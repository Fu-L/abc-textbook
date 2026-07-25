import {
  ContestSchema,
  ContestSlotRecordSchema,
  ProblemSchema,
  SourceRevisionSchema,
} from '../domain/schema-parts/catalog.js';
import { digestWithoutField } from '../domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
import { stableContestId } from '../domain/identity.js';
import {
  heldContestNumbersForBatch,
  officialContestGapsForBatch,
  type CorpusBatch,
} from './batches.js';
import {
  calculateMetadataBatchDigest,
  materializeObservedMetadataBatch,
} from './materialization.js';
import { advancedTasks, officialTaskListMetadataFingerprint } from './metadata.js';
import type { CorpusMetadataBatch, VerifiedPolicyBundle } from './types.js';

const SHA_256 = /^[a-f0-9]{64}$/u;
export class CorpusVerificationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CorpusVerificationError';
  }
}

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const assertExactKeys = (
  value: Readonly<Record<string, unknown>>,
  expected: readonly string[],
  owner: string,
): void => {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    throw new CorpusVerificationError(
      'CORPUS_UNKNOWN_FIELD',
      `${owner}: expected ${wanted.join(', ')}, received ${actual.join(', ')}`,
    );
  }
};

const assertNoRawSourcePayload = (value: unknown, path = '$'): void => {
  if (typeof value === 'string') {
    if (/<!doctype\s+html|<html(?:\s|>)/iu.test(value)) {
      throw new CorpusVerificationError('RAW_HTML_PERSISTENCE_FORBIDDEN', path);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      assertNoRawSourcePayload(item, `${path}[${String(index)}]`);
    });
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, item] of Object.entries(value)) {
    if (/^(?:html|rawHtml|body|statement|editorialBody)$/iu.test(key)) {
      throw new CorpusVerificationError('RAW_SOURCE_FIELD_FORBIDDEN', `${path}.${key}`);
    }
    assertNoRawSourcePayload(item, `${path}.${key}`);
  }
};

const assertUnique = (values: readonly string[], code: string): void => {
  if (new Set(values).size !== values.length) {
    throw new CorpusVerificationError(code, values.join(', '));
  }
};

const assertOfficialPolicyUrl = (urlValue: string, kind: string): void => {
  let url: URL;
  try {
    url = new URL(urlValue);
  } catch {
    throw new CorpusVerificationError('POLICY_URL_INVALID', urlValue);
  }
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'atcoder.jp' ||
    url.username !== '' ||
    url.password !== '' ||
    url.port !== '' ||
    url.hash !== ''
  ) {
    throw new CorpusVerificationError('POLICY_URL_UNTRUSTED', urlValue);
  }
  if (
    (kind === 'robots' && url.pathname !== '/robots.txt') ||
    (kind === 'terms' && url.pathname !== '/tos') ||
    (kind === 'generative-ai' && !/^\/posts\/[0-9]+$/u.test(url.pathname))
  ) {
    throw new CorpusVerificationError('POLICY_URL_KIND_MISMATCH', `${kind}: ${url.pathname}`);
  }
};

export function verifyPolicyApprovalManifest(value: unknown): void {
  if (!isRecord(value)) {
    throw new CorpusVerificationError('POLICY_APPROVAL_INVALID', 'Expected an object.');
  }
  assertExactKeys(value, ['schemaVersion', 'documents'], 'policy approval');
  if (value.schemaVersion !== '1.0.0' || !Array.isArray(value.documents)) {
    throw new CorpusVerificationError('POLICY_APPROVAL_INVALID', 'Unsupported shape.');
  }
  const kinds: string[] = [];
  const ids: string[] = [];
  for (const [index, item] of value.documents.entries()) {
    if (!isRecord(item)) {
      throw new CorpusVerificationError('POLICY_APPROVAL_INVALID', `documents[${String(index)}]`);
    }
    assertExactKeys(
      item,
      ['id', 'kind', 'url', 'approvedFingerprint'],
      `policy approval documents[${String(index)}]`,
    );
    if (
      typeof item.id !== 'string' ||
      !['robots', 'terms', 'generative-ai'].includes(String(item.kind)) ||
      typeof item.url !== 'string' ||
      typeof item.approvedFingerprint !== 'string' ||
      !SHA_256.test(item.approvedFingerprint)
    ) {
      throw new CorpusVerificationError('POLICY_APPROVAL_INVALID', `documents[${String(index)}]`);
    }
    assertOfficialPolicyUrl(item.url, String(item.kind));
    ids.push(item.id);
    kinds.push(String(item.kind));
  }
  assertUnique(ids, 'DUPLICATE_POLICY_DOCUMENT_ID');
  assertUnique(kinds, 'DUPLICATE_POLICY_DOCUMENT_KIND');
  if (
    kinds.length !== 3 ||
    !['robots', 'terms', 'generative-ai'].every((kind) => kinds.includes(kind))
  ) {
    throw new CorpusVerificationError(
      'POLICY_APPROVAL_INCOMPLETE',
      'robots, terms, and generative-ai approvals are required.',
    );
  }
}

const verifyPolicyBundle = (policy: VerifiedPolicyBundle): void => {
  parseOffsetDateTime(policy.checkedAt);
  const kinds: string[] = policy.documents.map(({ kind }) => kind);
  const ids = policy.documents.map(({ id }) => id);
  assertUnique(ids, 'DUPLICATE_POLICY_DOCUMENT_ID');
  assertUnique(kinds, 'DUPLICATE_POLICY_DOCUMENT_KIND');
  if (
    kinds.length !== 3 ||
    !['robots', 'terms', 'generative-ai'].every((kind) => kinds.includes(kind))
  ) {
    throw new CorpusVerificationError('POLICY_VERIFICATION_INCOMPLETE', kinds.join(', '));
  }
  for (const document of policy.documents) {
    assertOfficialPolicyUrl(document.url, document.kind);
    if (
      !SHA_256.test(document.fingerprint) ||
      document.fingerprint !== document.approvedFingerprint
    ) {
      throw new CorpusVerificationError('POLICY_FINGERPRINT_UNAPPROVED', document.id);
    }
  }
  if (
    digestWithoutField(
      { checkedAt: policy.checkedAt, documents: policy.documents, digest: policy.digest },
      'digest',
    ) !== policy.digest
  ) {
    throw new CorpusVerificationError('POLICY_BUNDLE_DIGEST_MISMATCH', policy.digest);
  }
};

export function verifyCorpusMetadataBatch(value: unknown, expectedBatch: CorpusBatch): void {
  assertNoRawSourcePayload(value);
  if (!isRecord(value)) {
    throw new CorpusVerificationError('METADATA_BATCH_INVALID', 'Expected an object.');
  }
  assertExactKeys(
    value,
    [
      'schemaVersion',
      'batchId',
      'firstContestNumber',
      'lastContestNumber',
      'checkedAt',
      'policy',
      'contests',
      'contestGaps',
      'problems',
      'sourceRevisions',
      'metadataBatchDigest',
      'digest',
    ],
    'metadata batch',
  );
  if (
    value.schemaVersion !== '1.0.0' ||
    value.batchId !== expectedBatch.id ||
    value.firstContestNumber !== expectedBatch.firstContestNumber ||
    value.lastContestNumber !== expectedBatch.lastContestNumber ||
    !Array.isArray(value.contests) ||
    !Array.isArray(value.contestGaps) ||
    !Array.isArray(value.problems) ||
    !Array.isArray(value.sourceRevisions) ||
    typeof value.metadataBatchDigest !== 'string' ||
    !SHA_256.test(value.metadataBatchDigest) ||
    typeof value.digest !== 'string' ||
    !SHA_256.test(value.digest)
  ) {
    throw new CorpusVerificationError('METADATA_BATCH_INVALID', expectedBatch.id);
  }
  const artifact: CorpusMetadataBatch = value as unknown as CorpusMetadataBatch;
  parseOffsetDateTime(artifact.checkedAt);
  verifyPolicyBundle(artifact.policy);
  if (digestWithoutField({ ...artifact }, 'digest') !== artifact.digest) {
    throw new CorpusVerificationError('METADATA_ARTIFACT_DIGEST_MISMATCH', artifact.batchId);
  }

  const expectedNumbers = heldContestNumbersForBatch(expectedBatch);
  if (
    artifact.contests.length !== expectedNumbers.length ||
    artifact.contests.some(
      (contest, index) =>
        contest.number !== expectedNumbers[index] || contest.id !== stableContestId(contest.number),
    )
  ) {
    throw new CorpusVerificationError('CONTEST_RANGE_INCOMPLETE', artifact.batchId);
  }
  const expectedGaps = officialContestGapsForBatch(expectedBatch);
  if (
    artifact.contestGaps.length !== expectedGaps.length ||
    artifact.contestGaps.some((gap, index) => {
      const expected = expectedGaps[index];
      return (
        gap.number !== expected?.number ||
        gap.contestId !== expected.contestId ||
        gap.evidenceUrl !== expected.evidenceUrl ||
        gap.evidenceAssertion !== expected.evidenceAssertion ||
        gap.checkedAt !== artifact.checkedAt ||
        gap.termsCheckedAt !== artifact.policy.checkedAt ||
        !SHA_256.test(gap.fingerprint)
      );
    })
  ) {
    throw new CorpusVerificationError('CONTEST_GAP_EVIDENCE_INVALID', artifact.batchId);
  }
  const sourceById = new Map(artifact.sourceRevisions.map((source) => [source.id, source]));
  assertUnique(
    artifact.sourceRevisions.map(({ id }) => id),
    'DUPLICATE_SOURCE_REVISION_ID',
  );
  assertUnique(
    artifact.problems.map(({ id }) => id),
    'DUPLICATE_PROBLEM_ID',
  );
  if (
    artifact.sourceRevisions.some(
      (source) =>
        source.checkedAt !== artifact.checkedAt ||
        source.termsCheckedAt !== artifact.policy.checkedAt,
    )
  ) {
    throw new CorpusVerificationError('SOURCE_REVISION_CHECK_TIME_MISMATCH', artifact.batchId);
  }
  for (const contest of artifact.contests) {
    if (contest.checkedAt !== artifact.checkedAt) {
      throw new CorpusVerificationError('CONTEST_CHECK_TIME_MISMATCH', contest.id);
    }
    const parsedEnd = parseOffsetDateTime(contest.endedAt);
    if (compareOffsetDateTimes(parsedEnd, parseOffsetDateTime(artifact.checkedAt)) > 0) {
      throw new CorpusVerificationError('CONTEST_NOT_ENDED', contest.id);
    }
    if (
      contest.tasks.length !== contest.officialTaskOrder.length ||
      contest.tasks.some(
        (task, index) =>
          task.officialOrder !== index || task.label !== contest.officialTaskOrder[index],
      )
    ) {
      throw new CorpusVerificationError('OFFICIAL_TASK_MAPPING_INCOMPLETE', contest.id);
    }
    assertUnique(
      contest.tasks.map(({ officialTaskId }) => officialTaskId),
      'DUPLICATE_TASK_ID',
    );
    const orderSource = sourceById.get(contest.taskOrderSourceRevisionId);
    if (
      orderSource?.sourceKind !== 'official_contest' ||
      orderSource.contestId !== contest.id ||
      orderSource.officialTaskId !== null ||
      orderSource.url !== contest.officialTaskListUrl ||
      orderSource.fingerprint !== officialTaskListMetadataFingerprint(contest)
    ) {
      throw new CorpusVerificationError('TASK_ORDER_SOURCE_MISMATCH', contest.id);
    }
  }

  const expectedProblems = artifact.contests.flatMap((contest) =>
    advancedTasks(contest).map(({ problemId }) => problemId),
  );
  const actualProblems = artifact.problems.map(({ id }) => id);
  if (
    expectedProblems.length !== actualProblems.length ||
    expectedProblems.some((problemId, index) => problemId !== actualProblems[index])
  ) {
    throw new CorpusVerificationError('ADVANCED_PROBLEM_COVERAGE_MISMATCH', artifact.batchId);
  }
  for (const problem of artifact.problems) {
    if (problem.checkedAt !== artifact.checkedAt) {
      throw new CorpusVerificationError('PROBLEM_CHECK_TIME_MISMATCH', problem.id);
    }
    const contest = artifact.contests.find(({ id }) => id === problem.contestId);
    const task = contest?.tasks.find(
      ({ officialTaskId }) => officialTaskId === problem.officialTaskId,
    );
    if (
      task?.label !== problem.slotLabel ||
      task.officialOrder !== problem.officialOrder ||
      task.title !== problem.title ||
      task.officialUrl !== problem.officialUrl ||
      problem.constraintsSummary.trim() === ''
    ) {
      throw new CorpusVerificationError('PROBLEM_METADATA_MISMATCH', problem.id);
    }
    assertUnique(problem.sourceRevisionIds, 'DUPLICATE_PROBLEM_SOURCE_REVISION');
    if (problem.sourceRevisionIds.some((sourceId) => !sourceById.has(sourceId))) {
      throw new CorpusVerificationError('PROBLEM_SOURCE_REVISION_MISSING', problem.id);
    }
    const officialProblemSources = problem.sourceRevisionIds
      .map((sourceId) => sourceById.get(sourceId))
      .filter(
        (source) =>
          source?.sourceKind === 'official_problem' &&
          source.contestId === problem.contestId &&
          source.officialTaskId === problem.officialTaskId &&
          source.url === problem.officialUrl,
      );
    const editorialItemSources = problem.sourceRevisionIds
      .map((sourceId) => sourceById.get(sourceId))
      .filter(
        (source) =>
          source?.sourceKind === 'official_editorial' &&
          source.contestId === problem.contestId &&
          source.officialTaskId === problem.officialTaskId,
      );
    if (
      officialProblemSources.length !== 1 ||
      problem.sourceRevisionIds.length !==
        officialProblemSources.length + editorialItemSources.length
    ) {
      throw new CorpusVerificationError('PROBLEM_OFFICIAL_SOURCE_SET_INVALID', problem.id);
    }
  }

  for (const contest of artifact.contests) {
    const editorialIndexSources = artifact.sourceRevisions.filter(
      (source) =>
        source.contestId === contest.id &&
        source.sourceKind === 'official_editorial' &&
        source.officialTaskId === null &&
        source.url === `https://atcoder.jp/contests/${contest.id}/editorial`,
    );
    if (editorialIndexSources.length !== 1) {
      throw new CorpusVerificationError('EDITORIAL_INDEX_SOURCE_INVALID', contest.id);
    }
  }

  const referencedSourceIds = new Set([
    ...artifact.contests.map(({ taskOrderSourceRevisionId }) => taskOrderSourceRevisionId),
    ...artifact.problems.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ...artifact.sourceRevisions
      .filter(
        ({ sourceKind, officialTaskId }) =>
          sourceKind === 'official_editorial' && officialTaskId === null,
      )
      .map(({ id }) => id),
  ]);
  if (artifact.sourceRevisions.some(({ id }) => !referencedSourceIds.has(id))) {
    throw new CorpusVerificationError(
      'ORPHAN_SOURCE_REVISION',
      artifact.sourceRevisions.find(({ id }) => !referencedSourceIds.has(id))?.id ??
        artifact.batchId,
    );
  }

  const observed = materializeObservedMetadataBatch(artifact);
  for (const contest of observed.contests) ContestSchema.parse(contest);
  for (const slot of observed.contestSlots) ContestSlotRecordSchema.parse(slot);
  for (const problem of observed.problems) ProblemSchema.parse(problem);
  for (const source of observed.sources) SourceRevisionSchema.parse(source);
  if (calculateMetadataBatchDigest(observed) !== artifact.metadataBatchDigest) {
    throw new CorpusVerificationError('METADATA_BATCH_DIGEST_MISMATCH', artifact.batchId);
  }
}

export const assertCorpusPathIsOfficial = (value: string): void => {
  if (!value.startsWith('https://atcoder.jp/')) {
    throw new CorpusVerificationError('OFFICIAL_URL_UNTRUSTED', value);
  }
};
