import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { load } from 'cheerio';
import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { OffsetDateTimeSchema } from '../domain/schema-parts/catalog.js';
import type { DiscoverableContest } from '../../../scripts/update-abc/types.js';
import { discoverContests } from '../../../scripts/update-abc/discover.js';
import { PublicationUpdateSchema } from '../domain/schema-parts/release.js';
import { verifyCorpusMetadataBatch } from '../corpus/verification.js';
import type { CorpusMetadataBatch } from '../corpus/types.js';
import { materializeObservedMetadataBatch } from '../corpus/materialization.js';
import {
  ProblemAnalysisRecordSchema,
  FinalProblemPlacementProjectionSchema,
} from '../domain/schema-parts/catalog.js';
import {
  AuthoringInputPacketSchema,
  validateAuthoringOutput,
} from '../authoring/explanation-authoring-skill.js';
import { readProblemAuthoringDocument } from '../authoring/problem-authoring-document.js';
import { validateJoinedProblemDocuments } from '../authoring/verify-problem-corpus.js';
import { shardFileDigest } from '../authoring/problem-shard-context.js';
import { buildAdvancedSlotRegistry } from '../catalog/advanced-slot-registry.js';
import {
  BOOTSTRAP_UPDATE_ID,
  BOOTSTRAP_MANIFEST_PATH,
  prepareBootstrapUpdate,
} from './bootstrap-update.js';

export const CATCH_UP_ROOT = 'staging/updates/initial-catch-up';
export const CATCH_UP_POLICY = 'src/content/policies/catch-up.json';
export const UPDATE_RECEIPT_ROOT = 'src/content/accepted-updates';
export const INITIAL_CUTOFF = '2026-10-06T00:00:00+09:00';
export const UPDATE_REVIEW_RISKS: Readonly<
  Record<string, ('official_source_conflict' | 'independent_proof')[]>
> = {
  'abc467-e': ['independent_proof'],
  'abc476-f': ['independent_proof'],
  'abc478-f': ['official_source_conflict'],
  'abc478-g': ['independent_proof'],
};
export const jsonAt = async (root: string, file: string): Promise<unknown> =>
  JSON.parse(await readFile(path.join(root, file), 'utf8')) as unknown;
export const writeUpdateJson = async (file: string, value: unknown) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
};
export const discoverMissingContests = (input: {
  readonly cutoffAt: string;
  readonly contests: readonly DiscoverableContest[];
  readonly collectedContestIds: readonly string[];
}) => {
  OffsetDateTimeSchema.parse(input.cutoffAt);
  if (new Set(input.contests.map((c) => c.contestId)).size !== input.contests.length)
    throw new Error('DISCOVERY_DUPLICATE_CONTEST');
  const collected = new Set(input.collectedContestIds);
  return discoverContests({
    contests: input.contests,
    now: input.cutoffAt,
    mode: 'explicit-range',
    firstContestNumber: 467,
    lastContestNumber: Number.MAX_SAFE_INTEGER,
  })
    .filter((c) => !collected.has(c.contestId))
    .sort((a, b) => Number(a.contestId.slice(3)) - Number(b.contestId.slice(3)));
};

/** Archive discovery fixes every ended candidate before source acquisition. */
export const parseArchiveContests = (html: string): DiscoverableContest[] => {
  const $ = load(html);
  return $('tbody tr')
    .toArray()
    .flatMap((row) => {
      const cells = $(row).find('td');
      const id = cells
        .eq(1)
        .find('a[href]')
        .attr('href')
        ?.match(/^\/contests\/(abc\d+)$/u)?.[1];
      if (!id) return [];
      const startsAt =
        cells.eq(0).find('time').attr('datetime') ??
        cells
          .eq(0)
          .text()
          .trim()
          .replace(' ', 'T')
          .replace(/([+-]\d{2})(\d{2})$/u, '$1:$2');
      const duration = cells.eq(2).text().trim().split(':').map(Number);
      if (
        !OffsetDateTimeSchema.safeParse(startsAt).success ||
        duration.length !== 2 ||
        duration.some((n) => !Number.isFinite(n))
      )
        throw new Error(`ARCHIVE_PARSER_DRIFT:${id}`);
      const endsAt = new Date(
        Date.parse(startsAt) + ((duration[0] ?? 0) * 60 + (duration[1] ?? 0)) * 60_000,
      ).toISOString();
      return [{ contestId: id, startsAt, endsAt, tasks: [] }];
    });
};

export const UpdateAuthoringSchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  contestId: z.string(),
  items: z
    .array(
      z.strictObject({
        packet: AuthoringInputPacketSchema,
        inventory: ProblemAnalysisRecordSchema,
        placement: FinalProblemPlacementProjectionSchema,
        documentPath: z.string(),
        documentDigest: z.string(),
        review: z.strictObject({
          mode: z.enum(['self', 'third_party']),
          reviewMode: z.literal('agent_quality_review'),
          humanApproval: z.literal(false),
          riskReasons: z.array(
            z.enum([
              'official_source_conflict',
              'independent_proof',
              'major_classification_change',
            ]),
          ),
          basis: z.string().min(1),
        }),
      }),
    )
    .min(1),
});
export type UpdateAuthoring = z.infer<typeof UpdateAuthoringSchema>;

export const prepareCanonicalUpdate = async (input: {
  contestId: string;
  metadataPath: string;
  authoringPath: string;
  cutoffAt: string;
  repositoryRoot?: string;
}) => {
  const root = input.repositoryRoot ?? process.cwd();
  OffsetDateTimeSchema.parse(input.cutoffAt);
  const artifact = (await jsonAt(root, input.metadataPath)) as CorpusMetadataBatch;
  const number = Number(input.contestId.slice(3));
  verifyCorpusMetadataBatch(artifact, {
    id: input.contestId,
    firstContestNumber: number,
    lastContestNumber: number,
  });
  if (
    artifact.contests.length !== 1 ||
    artifact.contests[0]?.id !== input.contestId ||
    Date.parse(artifact.contests[0].endedAt) > Date.parse(input.cutoffAt)
  )
    throw new Error('CONTEST_NOT_ENDED');
  const observed = materializeObservedMetadataBatch(artifact);
  const contest = observed.contests[0];
  if (!contest) throw new Error('CONTEST_MISSING');
  const contestFiles = (
    await readdir(path.join(root, 'src/content/contests'), { recursive: true })
  ).filter((file) => file.endsWith('.json'));
  const existingContests = await Promise.all(
    contestFiles.map(
      async (file) =>
        (await jsonAt(root, `src/content/contests/${file}`)) as {
          id: string;
          officialTaskOrder: string[];
          taskOrderSourceRevisionId: string;
        },
    ),
  );
  const registry = buildAdvancedSlotRegistry({
    contests: [...existingContests, contest].map((record) => ({
      contestId: record.id,
      advancedLabels: record.officialTaskOrder.slice(record.officialTaskOrder.indexOf('D') + 1),
      sourceRevisionId: record.taskOrderSourceRevisionId,
    })),
  });
  const metadata = {
    ...observed,
    contestSlots: [
      ...observed.contestSlots,
      ...registry.labels
        .filter((label) => !observed.contestSlots.some((slot) => slot.label === label))
        .map((label) => ({
          contestId: contest.id,
          label,
          officialTaskId: null,
          officialOrder: null,
          availability: 'official_absent' as const,
          catalogStatus: 'uncollected' as const,
          holdReason: null,
          problemId: null,
          sourceRevisionId: contest.taskOrderSourceRevisionId,
          checkedAt: contest.checkedAt,
        })),
    ],
  };
  const sourceIds = new Map(metadata.sources.map((s) => [s.id, s]));
  const authoring = UpdateAuthoringSchema.parse(await jsonAt(root, input.authoringPath));
  const frozenSkill = (
    (await jsonAt(root, 'docs/verification/bootstrap/problem-authoring-units.json')) as {
      skill: unknown;
    }
  ).skill;
  const problemIds = metadata.problems.map((p) => p.id).sort();
  if (
    authoring.contestId !== input.contestId ||
    canonicalDigest(authoring.items.map((i) => i.packet.problemId).sort()) !==
      canonicalDigest(problemIds)
  )
    throw new Error('UPDATE_AUTHORING_COVERAGE');
  const operations = [];
  const documents = [];
  for (const item of authoring.items) {
    if (canonicalDigest(item.packet.skill) !== canonicalDigest(frozenSkill))
      throw new Error('UPDATE_SKILL_DRIFT');
    const problem = metadata.problems.find((p) => p.id === item.packet.problemId);
    const text = await readFile(path.join(root, item.documentPath), 'utf8');
    const parsed = readProblemAuthoringDocument(text);
    documents.push({ unit: parsed.unit, path: item.documentPath, body: parsed.body });
    if (
      !problem ||
      shardFileDigest(text) !== item.documentDigest ||
      parsed.unit.docPath !== item.documentPath ||
      parsed.unit.problemId !== problem.id
    )
      throw new Error('UPDATE_DOCUMENT_SUBJECT');
    const diagnostics = validateAuthoringOutput(parsed.unit, item.packet.skill, item.packet);
    if (diagnostics.status !== 'ready')
      throw new Error(`UPDATE_AUTHORING_INVALID:${JSON.stringify(diagnostics)}`);
    for (const ids of [
      item.packet.sources.map((source) => source.sourceRevisionId),
      parsed.unit.sourceRevisionIds,
    ])
      if (
        canonicalDigest(ids.slice().sort()) !==
        canonicalDigest(problem.sourceRevisionIds.slice().sort())
      )
        throw new Error('UPDATE_SOURCE_COVERAGE');
    if (item.documentPath !== `src/content/docs/problems/updates/${problem.id}.md`)
      throw new Error('UPDATE_DOCUMENT_PATH');
    if (
      item.inventory.problemId !== problem.id ||
      item.inventory.reviewStatus !== 'reviewed' ||
      item.inventory.reviewFindings.length ||
      item.placement.problemId !== problem.id ||
      item.placement.kind !== parsed.unit.kind ||
      canonicalDigest(item.inventory.sourceRevisionIds.slice().sort()) !==
        canonicalDigest(problem.sourceRevisionIds.slice().sort())
    )
      throw new Error('UPDATE_INVENTORY_OR_PLACEMENT');
    for (const ref of item.packet.sources) {
      const source = sourceIds.get(ref.sourceRevisionId);
      if (
        source?.officialTaskId !== problem.officialTaskId ||
        ref.officialTaskId !== source.officialTaskId ||
        ref.checkedAt !== source.checkedAt ||
        ref.termsCheckedAt !== source.termsCheckedAt ||
        ref.sourceKind !== source.sourceKind ||
        ref.path !== `src/content/sources/updates/${source.id}.json`
      )
        throw new Error('UPDATE_SOURCE_BINDING');
    }
    const expectedOutcomes = [
      item.placement.primaryOutcomeId,
      ...item.placement.additionalPrimaryOutcomeIds,
      ...item.placement.supportingOutcomeIds,
    ].sort();
    const expectedTags = [
      ...item.placement.primaryTagIds,
      ...item.placement.supportingTagIds,
    ].sort();
    if (
      canonicalDigest(expectedOutcomes) !==
        canonicalDigest(parsed.unit.learningOutcomeIds.slice().sort()) ||
      canonicalDigest(expectedTags) !== canonicalDigest(parsed.unit.tagIds.slice().sort())
    )
      throw new Error('UPDATE_SEMANTIC_BINDING');
    for (const ref of item.placement.analysisEvidenceRefs) {
      const value = ref.claimPath
        .slice(1)
        .split('/')
        .reduce<unknown>(
          (value, key) =>
            typeof value === 'object' && value !== null
              ? (Reflect.get(value, key) as unknown)
              : undefined,
          item.inventory,
        );
      if (
        ref.problemId !== problem.id ||
        !value ||
        !item.inventory.evidence.some(
          (e) =>
            ref.evidenceIds.includes(e.id) &&
            e.sourceRevisionIds.every((id) => ref.sourceRevisionIds.includes(id)),
        )
      )
        throw new Error('UPDATE_INVENTORY_CLAIM_BINDING');
    }
    if (item.review.mode !== (item.review.riskReasons.length ? 'third_party' : 'self'))
      throw new Error('UPDATE_REVIEW_POLICY');
    if (
      (UPDATE_REVIEW_RISKS[problem.id] ?? []).some(
        (reason) => !item.review.riskReasons.includes(reason),
      )
    )
      throw new Error('UPDATE_REVIEW_RISK_SCOPE');
    operations.push({
      entityType: 'authoring_unit' as const,
      entityId: problem.id,
      path: item.documentPath,
      value: text,
      affectedProblemIds: [problem.id],
    });
  }
  validateJoinedProblemDocuments({
    expectedDocuments: authoring.items.map((item) => ({
      problemId: item.packet.problemId,
      path: item.documentPath,
    })),
    documents,
    discoveredPaths: authoring.items.map((item) => item.documentPath),
  });
  const roots = {
    contests: 'contest',
    problems: 'problem',
    sources: 'source',
    contestSlots: 'contest_slot',
  } as const;
  for (const [kind, entityType] of Object.entries(roots)) {
    const values = metadata[kind as keyof typeof roots];
    for (const value of values) {
      const record = value as unknown as Record<string, unknown>;
      const id =
        typeof record.id === 'string'
          ? record.id
          : `slot-${String(record.contestId)}-${String(record.label).toLowerCase()}`;
      const directory = kind === 'contestSlots' ? 'problem-slots' : kind;
      operations.push({
        entityType,
        entityId: id,
        path: `src/content/${directory}/updates/${id}.json`,
        value: `${JSON.stringify(value, null, 2)}\n`,
        affectedProblemIds: entityType === 'problem' ? [id] : problemIds,
      });
    }
  }
  const receiptPath = `${UPDATE_RECEIPT_ROOT}/${input.contestId}.json`;
  operations.push({
    entityType: 'placement' as const,
    entityId: `placement-update-${input.contestId}`,
    path: receiptPath,
    value: `${JSON.stringify(authoring, null, 2)}\n`,
    affectedProblemIds: problemIds,
  });
  const transitions = operations.map((op) => ({
    operationId: `operation-${canonicalDigest({ path: op.path, digest: shardFileDigest(op.value) }).slice(0, 24)}`,
    entityType: op.entityType,
    entityId: op.entityId,
    action: 'add' as const,
    path: op.path,
    beforeDigest: null,
    afterDigest: shardFileDigest(op.value),
    affectedProblemIds: op.affectedProblemIds,
    affectedEntities: [
      { entityType: op.entityType, entityId: op.entityId, action: 'add' as const },
    ],
  }));
  const updateId = `update-${canonicalDigest({ metadata: artifact.digest, transitions }).slice(0, 24)}`;
  const validation = {
    checkIds: [
      'check-official-metadata',
      'check-authoring-subject',
      'check-inventory-placement',
      'check-review-policy',
    ],
    problemResults: problemIds.map((problemId) => ({
      problemId,
      passed: true,
      findingCodes: [],
      remediation: null,
    })),
    blockingFindingCount: 0,
    aggregatePassed: true,
  };
  const update = PublicationUpdateSchema.parse({
    schemaVersion: '2.0.0',
    updateId,
    kind: 'contest_addition',
    baseReleaseVersion: null,
    contestId: input.contestId,
    sourceSetFingerprint: artifact.digest,
    advancedSlotLabels: metadata.problems.map((p) => p.slotLabel),
    targetProblemIds: problemIds,
    operations: transitions,
    authoringResults: authoring.items.map((i) => ({
      problemId: i.packet.problemId,
      slotLabel: metadata.problems.find((p) => p.id === i.packet.problemId)?.slotLabel,
      resultType: 'authoring_unit_draft',
      draftPath: i.documentPath,
      packetPath: input.authoringPath,
      templatePath: null,
      reasonCode: null,
      reason: null,
      retryCondition: null,
    })),
    correctionImpactIds: [],
    validationSummary: { ...validation, resultDigest: canonicalDigest(validation) },
    state: 'ELIGIBLE_FOR_BATCH',
    createdAt: artifact.checkedAt,
    updatedAt: artifact.checkedAt,
    fixtureMode: false,
  });
  return { update, operations, authoring, metadata };
};

export const applyCanonicalUpdate = async (
  result: Awaited<ReturnType<typeof prepareCanonicalUpdate>>,
  root = process.cwd(),
) => {
  // Every source/content transition is validated before any canonical write.
  for (const operation of result.operations) {
    try {
      const existing = await readFile(path.join(root, operation.path), 'utf8');
      if (existing !== operation.value)
        throw new Error(`UPDATE_CANONICAL_CONFLICT:${operation.path}`);
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
  }
  for (const operation of result.operations) {
    await mkdir(path.dirname(path.join(root, operation.path)), { recursive: true });
    await writeFile(path.join(root, operation.path), operation.value);
  }
  await writeUpdateJson(
    path.join(root, `${CATCH_UP_ROOT}/${result.update.updateId}/manifest.json`),
    result.update,
  );
};

export const CatchUpPolicySchema = z.strictObject({
  schemaVersion: z.literal('1.0.0'),
  cutoffAt: OffsetDateTimeSchema,
  discoveryPath: z.string(),
  discoveryDigest: z.string(),
  bootstrapUpdateId: z.literal(BOOTSTRAP_UPDATE_ID),
  bootstrapManifestPath: z.literal(BOOTSTRAP_MANIFEST_PATH),
  bootstrapManifestDigest: z.string(),
  updates: z.array(
    z.strictObject({
      contestId: z.string(),
      updateId: z.string(),
      metadataPath: z.string(),
      authoringPath: z.string(),
      manifestPath: z.string(),
      receiptPath: z.string(),
      receiptDigest: z.string(),
    }),
  ),
  digest: z.string(),
});
export const loadAcceptedUpdates = async (root = process.cwd()) => {
  let value: unknown;
  try {
    value = await jsonAt(root, CATCH_UP_POLICY);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      try {
        const documents = await readdir(path.join(root, 'src/content/docs/problems/updates'));
        if (documents.some((file) => file.endsWith('.md')))
          throw new Error('CATCH_UP_UNACCEPTED_DOCUMENT', { cause: error });
      } catch (missing) {
        if (!(missing instanceof Error && 'code' in missing && missing.code === 'ENOENT'))
          throw missing;
      }
      return null;
    }
    throw error;
  }
  const policy = CatchUpPolicySchema.parse(value);
  if (digestWithoutField(policy, 'digest') !== policy.digest)
    throw new Error('CATCH_UP_POLICY_DIGEST');
  const bootstrap = PublicationUpdateSchema.parse(await jsonAt(root, policy.bootstrapManifestPath));
  if (
    canonicalDigest(bootstrap) !== policy.bootstrapManifestDigest ||
    canonicalDigest(bootstrap) !== canonicalDigest(await prepareBootstrapUpdate(root))
  )
    throw new Error('CATCH_UP_BOOTSTRAP_SUBJECT');
  const discovery = (await jsonAt(root, policy.discoveryPath)) as {
    cutoffAt: string;
    contests: DiscoverableContest[];
  };
  if (
    canonicalDigest(discovery) !== policy.discoveryDigest ||
    discovery.cutoffAt !== policy.cutoffAt
  )
    throw new Error('CATCH_UP_DISCOVERY_SUBJECT');
  const expected = discoverMissingContests({
    cutoffAt: policy.cutoffAt,
    contests: discovery.contests,
    collectedContestIds: [],
  }).map((c) => c.contestId);
  if (canonicalDigest(expected) !== canonicalDigest(policy.updates.map((u) => u.contestId)))
    throw new Error('CATCH_UP_CONTEST_COVERAGE');
  const receipts = [];
  for (const entry of policy.updates) {
    const result = await prepareCanonicalUpdate({
      contestId: entry.contestId,
      metadataPath: entry.metadataPath,
      authoringPath: entry.authoringPath,
      cutoffAt: policy.cutoffAt,
      repositoryRoot: root,
    });
    const saved = PublicationUpdateSchema.parse(await jsonAt(root, entry.manifestPath));
    const receipt = UpdateAuthoringSchema.parse(await jsonAt(root, entry.receiptPath));
    if (
      entry.updateId !== result.update.updateId ||
      saved.fixtureMode ||
      saved.state !== 'ELIGIBLE_FOR_BATCH' ||
      canonicalDigest(saved) !== canonicalDigest(result.update) ||
      canonicalDigest(receipt) !== entry.receiptDigest ||
      canonicalDigest(receipt) !== canonicalDigest(result.authoring)
    )
      throw new Error('CATCH_UP_UPDATE_SUBJECT');
    for (const operation of result.operations)
      if (
        shardFileDigest(await readFile(path.join(root, operation.path), 'utf8')) !==
        shardFileDigest(operation.value)
      )
        throw new Error(`CATCH_UP_CANONICAL_DRIFT:${operation.path}`);
    receipts.push(receipt);
  }
  const documents = receipts.flatMap((r) =>
    r.items.map((i) => ({
      problemId: i.packet.problemId,
      path: i.documentPath,
      digest: i.documentDigest,
    })),
  );
  const discovered = (await readdir(path.join(root, 'src/content/docs/problems/updates')))
    .filter((f) => f.endsWith('.md'))
    .map((f) => `src/content/docs/problems/updates/${f}`)
    .sort();
  if (canonicalDigest(discovered) !== canonicalDigest(documents.map((d) => d.path).sort()))
    throw new Error('CATCH_UP_UNJOINED_DOCUMENT');
  return {
    policy,
    receipts,
    documents,
    placements: receipts.flatMap((r) => r.items.map((i) => i.placement)),
    inventories: receipts.flatMap((r) => r.items.map((i) => i.inventory)),
  };
};
