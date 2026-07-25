import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { stableContestId, stableProblemId } from '../domain/identity.js';
import {
  previewSelectionRulesDigest,
  type PreviewCohortRules,
  type PreviewSelectionRules,
} from '../preview/cohort-selection.js';
import { getCorpusBatch } from './batches.js';
import { verifyCorpusMetadataBatch } from './verification.js';
import type {
  FrozenPreviewCohort,
  FrozenPreviewCohortSubject,
  PreviewCandidatePool,
  PreviewCandidatePoolSubject,
  PreviewCohortCandidate,
  PreviewCohortCandidateInput,
  CorpusMetadataBatch,
} from './types.js';

export class CohortFreezeError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CohortFreezeError';
  }
}

/** Independent, committed T028 trust anchor for the initial preview rules. */
export const INITIAL_PREVIEW_FROZEN_RULES_DIGEST =
  'c8a912fd36995e3347f8f59fad3df8fd08f2a2319a70448d3ea7edd11e718bae';

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortedUnique = (values: readonly string[]): readonly string[] =>
  Object.freeze([...new Set(values)].sort(compareText));

const isPlaceholderText = (value: string): boolean => /\b(?:todo|tbd)\b/iu.test(value);

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const compareCandidates = (
  left: Pick<PreviewCohortCandidate, 'contestNumber' | 'officialTaskOrder' | 'problemId'>,
  right: Pick<PreviewCohortCandidate, 'contestNumber' | 'officialTaskOrder' | 'problemId'>,
): number =>
  left.contestNumber - right.contestNumber ||
  left.officialTaskOrder - right.officialTaskOrder ||
  compareText(left.problemId, right.problemId);

export const buildPreviewCandidatePool = (input: {
  readonly metadata: CorpusMetadataBatch;
  readonly allowedDomains: readonly string[];
  readonly candidates: readonly PreviewCohortCandidateInput[];
  readonly fixtures?: readonly PreviewCohortCandidate[];
}): PreviewCandidatePool => {
  const firstBatch = getCorpusBatch('abc212-abc263');
  verifyCorpusMetadataBatch(input.metadata, firstBatch);
  if (input.metadata.batchId !== firstBatch.id) {
    throw new CohortFreezeError('CANDIDATE_POOL_BATCH_INVALID', input.metadata.batchId);
  }
  const allowedDomains = sortedUnique(input.allowedDomains);
  if (allowedDomains.length !== input.allowedDomains.length || allowedDomains.length === 0) {
    throw new CohortFreezeError(
      'CANDIDATE_DOMAIN_SET_INVALID',
      'Allowed domains must be sorted, unique, and non-empty.',
    );
  }
  const metadataProblems = new Map(input.metadata.problems.map((problem) => [problem.id, problem]));
  const inputByProblem = new Map(
    input.candidates.map((candidate) => [candidate.problemId, candidate]),
  );
  if (inputByProblem.size !== input.candidates.length) {
    throw new CohortFreezeError('DUPLICATE_CANDIDATE_PROBLEM', 'Problem IDs must be unique.');
  }
  const expectedIds = [...metadataProblems.keys()];
  if (
    input.candidates.length !== expectedIds.length ||
    expectedIds.some((problemId) => !inputByProblem.has(problemId))
  ) {
    throw new CohortFreezeError(
      'CANDIDATE_POOL_COVERAGE_INCOMPLETE',
      'Every advanced Problem in ABC 212-263 must have exactly one candidate record.',
    );
  }
  const knownSources = new Map(input.metadata.sourceRevisions.map((source) => [source.id, source]));
  const outcomeDomain = new Map<string, string>();
  const candidates: PreviewCohortCandidate[] = [];
  for (const problem of input.metadata.problems) {
    const candidate = inputByProblem.get(problem.id);
    if (!candidate) throw new CohortFreezeError('CANDIDATE_MISSING', problem.id);
    if (candidate.fixtureId !== null) {
      throw new CohortFreezeError(
        'FIXTURE_CANDIDATE_NOT_DECLARED',
        `${problem.id} is official metadata and cannot use a fixture ID.`,
      );
    }
    const sourceRevisionIds = sortedUnique(candidate.sourceRevisionIds);
    const expectedSourceRevisionIds = sortedUnique(problem.sourceRevisionIds);
    if (
      !sameOrderedValues(sourceRevisionIds, expectedSourceRevisionIds) ||
      sourceRevisionIds.some((sourceId) => !knownSources.has(sourceId))
    ) {
      throw new CohortFreezeError('CANDIDATE_SOURCE_SET_INVALID', problem.id);
    }
    if (
      (candidate.selectionEligible &&
        (candidate.exclusionReason !== null || candidate.classifications.length === 0)) ||
      (!candidate.selectionEligible &&
        (candidate.exclusionReason === null ||
          candidate.exclusionReason.trim() === '' ||
          isPlaceholderText(candidate.exclusionReason)))
    ) {
      throw new CohortFreezeError('CANDIDATE_ELIGIBILITY_CONTRADICTORY', problem.id);
    }
    const pairKeys = new Set<string>();
    for (const classification of candidate.classifications) {
      const classificationSourceIds = sortedUnique(classification.sourceRevisionIds);
      if (
        !allowedDomains.includes(classification.domain) ||
        classification.outcomeId.trim() === '' ||
        classification.rationale.trim() === '' ||
        isPlaceholderText(classification.rationale) ||
        classification.sourceRevisionIds.length === 0 ||
        classificationSourceIds.length !== classification.sourceRevisionIds.length ||
        classification.sourceRevisionIds.some((sourceId) => {
          const source = knownSources.get(sourceId);
          return (
            !sourceRevisionIds.includes(sourceId) ||
            source?.contestId !== problem.contestId ||
            source.officialTaskId !== problem.officialTaskId
          );
        })
      ) {
        throw new CohortFreezeError('CLASSIFICATION_EVIDENCE_INVALID', problem.id);
      }
      const pairKey = `${classification.domain}\0${classification.outcomeId}`;
      if (pairKeys.has(pairKey)) {
        throw new CohortFreezeError('DUPLICATE_CLASSIFICATION_EVIDENCE', problem.id);
      }
      pairKeys.add(pairKey);
      const previousDomain = outcomeDomain.get(classification.outcomeId);
      if (previousDomain !== undefined && previousDomain !== classification.domain) {
        throw new CohortFreezeError(
          'CLASSIFICATION_EVIDENCE_CONTRADICTORY',
          `${classification.outcomeId}: ${previousDomain} vs ${classification.domain}`,
        );
      }
      outcomeDomain.set(classification.outcomeId, classification.domain);
    }
    const contest = input.metadata.contests.find(({ id }) => id === problem.contestId);
    if (!contest) {
      throw new CohortFreezeError('CANDIDATE_OFFICIAL_METADATA_MISMATCH', problem.id);
    }
    const task = contest.tasks.find(
      ({ officialTaskId }) => officialTaskId === problem.officialTaskId,
    );
    if (task?.officialOrder !== problem.officialOrder) {
      throw new CohortFreezeError('CANDIDATE_OFFICIAL_METADATA_MISMATCH', problem.id);
    }
    candidates.push(
      Object.freeze({
        problemId: problem.id,
        contestNumber: contest.number,
        officialTaskOrder: problem.officialOrder,
        advancedLabel: problem.slotLabel,
        officialTaskId: problem.officialTaskId,
        sourceRevisionIds,
        candidateDomains: sortedUnique(candidate.classifications.map(({ domain }) => domain)),
        candidateOutcomeIds: sortedUnique(
          candidate.classifications.map(({ outcomeId }) => outcomeId),
        ),
        classifications: Object.freeze(
          candidate.classifications
            .map((classification) =>
              Object.freeze({
                ...classification,
                sourceRevisionIds: sortedUnique(classification.sourceRevisionIds),
              }),
            )
            .sort(
              (left, right) =>
                compareText(left.domain, right.domain) ||
                compareText(left.outcomeId, right.outcomeId),
            ),
        ),
        selectionEligible: candidate.selectionEligible,
        exclusionReason: candidate.exclusionReason,
        fixtureId: null,
      }),
    );
  }
  candidates.push(...(input.fixtures ?? []));
  candidates.sort(compareCandidates);
  const subject: PreviewCandidatePoolSubject = {
    schemaVersion: '1.0.0',
    previewId: 'initial-v1',
    batchId: 'abc212-abc263',
    metadataBatchDigest: input.metadata.metadataBatchDigest,
    allowedDomains,
    sourceRevisionIds: sortedUnique(
      candidates.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
    ),
    candidates: Object.freeze(candidates),
  };
  const pool = Object.freeze({ ...subject, candidatePoolDigest: canonicalDigest(subject) });
  verifyPreviewCandidatePool(pool, input.metadata);
  return pool;
};

/** Validate every self-contained invariant before consulting canonical metadata. */
export const verifyPreviewCandidatePoolStructure = (pool: PreviewCandidatePool): void => {
  if (
    canonicalDigest({
      schemaVersion: pool.schemaVersion,
      previewId: pool.previewId,
      batchId: pool.batchId,
      metadataBatchDigest: pool.metadataBatchDigest,
      allowedDomains: pool.allowedDomains,
      sourceRevisionIds: pool.sourceRevisionIds,
      candidates: pool.candidates,
    }) !== pool.candidatePoolDigest
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_DIGEST_MISMATCH', pool.previewId);
  }
  const sorted = [...pool.candidates].sort(compareCandidates);
  if (
    sorted.some((candidate, index) => candidate.problemId !== pool.candidates[index]?.problemId)
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_ORDER_INVALID', pool.previewId);
  }
  if (
    new Set(pool.candidates.map(({ problemId }) => problemId)).size !== pool.candidates.length ||
    new Set(pool.sourceRevisionIds).size !== pool.sourceRevisionIds.length
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_DUPLICATE', pool.previewId);
  }
  const allowedDomains = sortedUnique(pool.allowedDomains);
  if (!sameOrderedValues(allowedDomains, pool.allowedDomains) || allowedDomains.length === 0) {
    throw new CohortFreezeError('CANDIDATE_DOMAIN_SET_INVALID', pool.previewId);
  }
  const outcomeDomain = new Map<string, string>();
  for (const candidate of pool.candidates) {
    const candidateSources = sortedUnique(candidate.sourceRevisionIds);
    const contestId = stableContestId(candidate.contestNumber);
    if (
      candidate.sourceRevisionIds.length === 0 ||
      !sameOrderedValues(candidateSources, candidate.sourceRevisionIds) ||
      candidate.problemId !== stableProblemId(contestId, candidate.advancedLabel) ||
      !candidate.officialTaskId.startsWith(`${contestId}_`) ||
      (candidate.selectionEligible &&
        (candidate.exclusionReason !== null || candidate.classifications.length === 0)) ||
      (!candidate.selectionEligible &&
        (candidate.exclusionReason === null ||
          candidate.exclusionReason.trim() === '' ||
          isPlaceholderText(candidate.exclusionReason)))
    ) {
      throw new CohortFreezeError('CANDIDATE_STRUCTURE_INVALID', candidate.problemId);
    }
    const pairKeys = new Set<string>();
    for (const classification of candidate.classifications) {
      const evidenceSources = sortedUnique(classification.sourceRevisionIds);
      const pairKey = `${classification.domain}\0${classification.outcomeId}`;
      if (
        !allowedDomains.includes(classification.domain) ||
        classification.outcomeId.trim() === '' ||
        classification.rationale.trim() === '' ||
        isPlaceholderText(classification.rationale) ||
        evidenceSources.length === 0 ||
        !sameOrderedValues(evidenceSources, classification.sourceRevisionIds) ||
        evidenceSources.some((sourceId) => !candidateSources.includes(sourceId)) ||
        pairKeys.has(pairKey)
      ) {
        throw new CohortFreezeError('CLASSIFICATION_EVIDENCE_INVALID', candidate.problemId);
      }
      pairKeys.add(pairKey);
      const previousDomain = outcomeDomain.get(classification.outcomeId);
      if (previousDomain !== undefined && previousDomain !== classification.domain) {
        throw new CohortFreezeError(
          'CLASSIFICATION_EVIDENCE_CONTRADICTORY',
          `${classification.outcomeId}: ${previousDomain} vs ${classification.domain}`,
        );
      }
      outcomeDomain.set(classification.outcomeId, classification.domain);
    }
    const expectedClassifications = [...candidate.classifications].sort(
      (left, right) =>
        compareText(left.domain, right.domain) || compareText(left.outcomeId, right.outcomeId),
    );
    if (
      expectedClassifications.some(
        (classification, index) => classification !== candidate.classifications[index],
      ) ||
      !sameOrderedValues(
        candidate.candidateDomains,
        sortedUnique(candidate.classifications.map(({ domain }) => domain)),
      ) ||
      !sameOrderedValues(
        candidate.candidateOutcomeIds,
        sortedUnique(candidate.classifications.map(({ outcomeId }) => outcomeId)),
      )
    ) {
      throw new CohortFreezeError('CANDIDATE_DERIVED_CLASSIFICATION_MISMATCH', candidate.problemId);
    }
  }
  const expectedPoolSources = sortedUnique(
    pool.candidates.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
  );
  if (!sameOrderedValues(pool.sourceRevisionIds, expectedPoolSources)) {
    throw new CohortFreezeError('CANDIDATE_POOL_SOURCE_SET_INVALID', pool.previewId);
  }
};

export const verifyPreviewCandidatePool = (
  pool: PreviewCandidatePool,
  metadata: CorpusMetadataBatch,
): void => {
  verifyPreviewCandidatePoolStructure(pool);
  const firstBatch = getCorpusBatch('abc212-abc263');
  verifyCorpusMetadataBatch(metadata, firstBatch);
  if (
    pool.metadataBatchDigest !== metadata.metadataBatchDigest ||
    canonicalDigest({
      schemaVersion: pool.schemaVersion,
      previewId: pool.previewId,
      batchId: pool.batchId,
      metadataBatchDigest: pool.metadataBatchDigest,
      allowedDomains: pool.allowedDomains,
      sourceRevisionIds: pool.sourceRevisionIds,
      candidates: pool.candidates,
    }) !== pool.candidatePoolDigest
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_DIGEST_MISMATCH', pool.previewId);
  }
  const sorted = [...pool.candidates].sort(compareCandidates);
  if (
    sorted.some((candidate, index) => candidate.problemId !== pool.candidates[index]?.problemId)
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_ORDER_INVALID', pool.previewId);
  }
  if (
    new Set(pool.candidates.map(({ problemId }) => problemId)).size !== pool.candidates.length ||
    new Set(pool.sourceRevisionIds).size !== pool.sourceRevisionIds.length
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_DUPLICATE', pool.previewId);
  }
  const allowedDomains = sortedUnique(pool.allowedDomains);
  if (!sameOrderedValues(allowedDomains, pool.allowedDomains) || allowedDomains.length === 0) {
    throw new CohortFreezeError('CANDIDATE_DOMAIN_SET_INVALID', pool.previewId);
  }
  const canonicalCandidates = pool.candidates.filter(({ fixtureId }) => fixtureId === null);
  const candidateByProblem = new Map(
    canonicalCandidates.map((candidate) => [candidate.problemId, candidate]),
  );
  if (
    canonicalCandidates.length !== metadata.problems.length ||
    candidateByProblem.size !== metadata.problems.length ||
    metadata.problems.some(({ id }) => !candidateByProblem.has(id))
  ) {
    throw new CohortFreezeError('CANDIDATE_POOL_COVERAGE_INCOMPLETE', pool.previewId);
  }
  const sourceById = new Map(metadata.sourceRevisions.map((source) => [source.id, source]));
  const outcomeDomain = new Map<string, string>();
  for (const problem of metadata.problems) {
    const candidate = candidateByProblem.get(problem.id);
    const contest = metadata.contests.find(({ id }) => id === problem.contestId);
    if (!candidate) {
      throw new CohortFreezeError('CANDIDATE_OFFICIAL_METADATA_MISMATCH', problem.id);
    }
    if (
      candidate.contestNumber !== contest?.number ||
      candidate.officialTaskOrder !== problem.officialOrder ||
      candidate.advancedLabel !== problem.slotLabel ||
      candidate.officialTaskId !== problem.officialTaskId
    ) {
      throw new CohortFreezeError('CANDIDATE_OFFICIAL_METADATA_MISMATCH', problem.id);
    }
    const expectedSources = sortedUnique(problem.sourceRevisionIds);
    if (!sameOrderedValues(candidate.sourceRevisionIds, expectedSources)) {
      throw new CohortFreezeError('CANDIDATE_SOURCE_SET_INVALID', problem.id);
    }
    if (
      (candidate.selectionEligible &&
        (candidate.exclusionReason !== null || candidate.classifications.length === 0)) ||
      (!candidate.selectionEligible &&
        (candidate.exclusionReason === null ||
          candidate.exclusionReason.trim() === '' ||
          isPlaceholderText(candidate.exclusionReason)))
    ) {
      throw new CohortFreezeError('CANDIDATE_ELIGIBILITY_CONTRADICTORY', problem.id);
    }
    const pairKeys = new Set<string>();
    for (const classification of candidate.classifications) {
      const evidenceSources = sortedUnique(classification.sourceRevisionIds);
      if (
        !allowedDomains.includes(classification.domain) ||
        classification.outcomeId.trim() === '' ||
        classification.rationale.trim() === '' ||
        isPlaceholderText(classification.rationale) ||
        evidenceSources.length === 0 ||
        !sameOrderedValues(evidenceSources, classification.sourceRevisionIds) ||
        evidenceSources.some((sourceId) => {
          const source = sourceById.get(sourceId);
          return (
            !candidate.sourceRevisionIds.includes(sourceId) ||
            source?.contestId !== problem.contestId ||
            source.officialTaskId !== problem.officialTaskId
          );
        })
      ) {
        throw new CohortFreezeError('CLASSIFICATION_EVIDENCE_INVALID', problem.id);
      }
      const pairKey = `${classification.domain}\0${classification.outcomeId}`;
      if (pairKeys.has(pairKey)) {
        throw new CohortFreezeError('DUPLICATE_CLASSIFICATION_EVIDENCE', problem.id);
      }
      pairKeys.add(pairKey);
      const previousDomain = outcomeDomain.get(classification.outcomeId);
      if (previousDomain !== undefined && previousDomain !== classification.domain) {
        throw new CohortFreezeError(
          'CLASSIFICATION_EVIDENCE_CONTRADICTORY',
          `${classification.outcomeId}: ${previousDomain} vs ${classification.domain}`,
        );
      }
      outcomeDomain.set(classification.outcomeId, classification.domain);
    }
    const expectedClassifications = [...candidate.classifications].sort(
      (left, right) =>
        compareText(left.domain, right.domain) || compareText(left.outcomeId, right.outcomeId),
    );
    if (
      expectedClassifications.some(
        (classification, index) => classification !== candidate.classifications[index],
      ) ||
      !sameOrderedValues(
        candidate.candidateDomains,
        sortedUnique(candidate.classifications.map(({ domain }) => domain)),
      ) ||
      !sameOrderedValues(
        candidate.candidateOutcomeIds,
        sortedUnique(candidate.classifications.map(({ outcomeId }) => outcomeId)),
      )
    ) {
      throw new CohortFreezeError('CANDIDATE_DERIVED_CLASSIFICATION_MISMATCH', problem.id);
    }
  }
  const expectedPoolSources = sortedUnique(
    pool.candidates.flatMap(({ sourceRevisionIds }) => sourceRevisionIds),
  );
  if (!sameOrderedValues(pool.sourceRevisionIds, expectedPoolSources)) {
    throw new CohortFreezeError('CANDIDATE_POOL_SOURCE_SET_INVALID', pool.previewId);
  }
};

interface SearchState {
  readonly selectedIndexes: readonly number[];
  readonly problemCount: number;
  readonly domainCounts: readonly number[];
  readonly outcomeCounts: readonly number[];
  readonly contestIds: readonly string[];
  readonly labels: readonly string[];
}

const cappedSet = (
  current: readonly string[],
  value: string,
  minimum: number,
): readonly string[] => {
  if (current[0] === '*') return current;
  const next = sortedUnique([...current, value]);
  return next.length >= minimum ? Object.freeze(['*']) : next;
};

const lexicographicIndexes = (left: readonly number[], right: readonly number[]): number => {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
};

const betterSelection = (left: SearchState, right: SearchState): SearchState =>
  left.selectedIndexes.length !== right.selectedIndexes.length
    ? left.selectedIndexes.length < right.selectedIndexes.length
      ? left
      : right
    : lexicographicIndexes(left.selectedIndexes, right.selectedIndexes) <= 0
      ? left
      : right;

const stateKey = (state: SearchState): string =>
  [
    state.problemCount,
    state.domainCounts.join(','),
    state.outcomeCounts.join(','),
    state.contestIds.join(','),
    state.labels.join(','),
  ].join('|');

const selectCandidates = (
  candidates: readonly PreviewCohortCandidate[],
  rules: PreviewCohortRules,
): readonly PreviewCohortCandidate[] => {
  const outcomes = sortedUnique(
    candidates.flatMap(({ candidateOutcomeIds }) => candidateOutcomeIds),
  );
  let states = new Map<string, SearchState>();
  const initial: SearchState = {
    selectedIndexes: Object.freeze([]),
    problemCount: 0,
    domainCounts: Object.freeze(rules.domains.map(() => 0)),
    outcomeCounts: Object.freeze(outcomes.map(() => 0)),
    contestIds: Object.freeze([]),
    labels: Object.freeze([]),
  };
  states.set(stateKey(initial), initial);
  for (const [candidateIndex, candidate] of candidates.entries()) {
    const next = new Map(states);
    for (const state of states.values()) {
      const included: SearchState = {
        selectedIndexes: Object.freeze([...state.selectedIndexes, candidateIndex]),
        problemCount: Math.min(rules.minimumProblemCount, state.problemCount + 1),
        domainCounts: Object.freeze(
          state.domainCounts.map((count, index) =>
            candidate.candidateDomains.includes(rules.domains[index] ?? '')
              ? Math.min(rules.minimumProblemsPerDomain, count + 1)
              : count,
          ),
        ),
        outcomeCounts: Object.freeze(
          state.outcomeCounts.map((count, index) =>
            candidate.candidateOutcomeIds.includes(outcomes[index] ?? '')
              ? Math.min(rules.minimumProblemsPerOutcome, count + 1)
              : count,
          ),
        ),
        contestIds: cappedSet(
          state.contestIds,
          String(candidate.contestNumber),
          rules.minimumContestCount,
        ),
        labels: cappedSet(state.labels, candidate.advancedLabel, rules.minimumAdvancedLabelCount),
      };
      const key = stateKey(included);
      const existing = next.get(key);
      next.set(key, existing ? betterSelection(existing, included) : included);
    }
    states = next;
    if (states.size > 250_000) {
      throw new CohortFreezeError(
        'COHORT_SELECTION_STATE_LIMIT',
        'Candidate classifications are too broad for deterministic preview selection.',
      );
    }
  }
  const valid = [...states.values()].filter(
    (state) =>
      state.problemCount === rules.minimumProblemCount &&
      state.domainCounts.every((count) => count === rules.minimumProblemsPerDomain) &&
      state.outcomeCounts.every(
        (count) => count === 0 || count === rules.minimumProblemsPerOutcome,
      ) &&
      state.contestIds[0] === '*' &&
      state.labels[0] === '*',
  );
  const best = valid.reduce<SearchState | undefined>(
    (current, state) => (current ? betterSelection(current, state) : state),
    undefined,
  );
  if (!best) {
    throw new CohortFreezeError(
      'COHORT_REQUIREMENTS_UNSATISFIED',
      'No source-backed candidate subset satisfies the frozen rules.',
    );
  }
  return Object.freeze(
    best.selectedIndexes.map((index) => {
      const candidate = candidates[index];
      if (!candidate) throw new CohortFreezeError('COHORT_SELECTION_CORRUPT', String(index));
      return candidate;
    }),
  );
};

interface VerifiedCohortFreezeInput {
  readonly pool: PreviewCandidatePool;
  readonly selectionRules: PreviewSelectionRules;
  readonly frozenRulesDigest: string;
}

const freezeVerifiedPreviewCohort = (input: VerifiedCohortFreezeInput): FrozenPreviewCohort => {
  const rules = input.selectionRules.cohortRules;
  if (
    input.frozenRulesDigest !== INITIAL_PREVIEW_FROZEN_RULES_DIGEST ||
    previewSelectionRulesDigest(input.selectionRules) !== input.frozenRulesDigest ||
    rules.stableSortKeys.join(',') !== 'contestNumber,officialTaskOrder,problemId'
  ) {
    throw new CohortFreezeError('FROZEN_COHORT_RULES_INVALID', input.pool.previewId);
  }
  if (rules.domains.some((domain) => !input.pool.allowedDomains.includes(domain))) {
    throw new CohortFreezeError('COHORT_DOMAIN_RULE_MISMATCH', input.pool.previewId);
  }
  if (
    !rules.allowFixtureSupplement &&
    input.pool.candidates.some(({ fixtureId }) => fixtureId !== null)
  ) {
    throw new CohortFreezeError('COHORT_FIXTURE_NOT_ALLOWED', input.pool.previewId);
  }
  const eligible = input.pool.candidates.filter(({ selectionEligible }) => selectionEligible);
  const selected = selectCandidates(eligible, rules);
  const selectedIds = new Set(selected.map(({ problemId }) => problemId));
  const fixtureGroups = new Map<string, string[]>();
  for (const candidate of selected) {
    if (candidate.fixtureId !== null) {
      const problemIds = fixtureGroups.get(candidate.fixtureId) ?? [];
      problemIds.push(candidate.problemId);
      fixtureGroups.set(candidate.fixtureId, problemIds);
    }
  }
  const subject: FrozenPreviewCohortSubject = {
    schemaVersion: '1.0.0',
    previewId: 'initial-v1',
    phase: 'cohort_frozen',
    seedRange: input.selectionRules.seedRange,
    scopeRule: input.selectionRules.scopeRule,
    cohortRules: rules,
    publicationBoundary: input.selectionRules.publicationBoundary,
    frozenRulesDigest: input.frozenRulesDigest,
    candidatePoolDigest: input.pool.candidatePoolDigest,
    metadataBatchDigest: input.pool.metadataBatchDigest,
    selectedProblemIds: Object.freeze(selected.map(({ problemId }) => problemId)),
    sourceRevisionIds: sortedUnique(selected.flatMap(({ sourceRevisionIds }) => sourceRevisionIds)),
    fixtureBoundaries: Object.freeze(
      [...fixtureGroups.entries()]
        .sort(([left], [right]) => compareText(left, right))
        .map(([fixtureId, problemIds]) => ({ fixtureId, problemIds: sortedUnique(problemIds) })),
    ),
    excludedProblemIds: Object.freeze(
      input.pool.candidates
        .filter(({ problemId }) => !selectedIds.has(problemId))
        .map(({ problemId }) => problemId),
    ),
  };
  const frozen = Object.freeze({ ...subject, manifestDigest: canonicalDigest(subject) });
  if (digestWithoutField(frozen, 'manifestDigest') !== frozen.manifestDigest) {
    throw new CohortFreezeError('COHORT_MANIFEST_DIGEST_MISMATCH', frozen.previewId);
  }
  return frozen;
};

/** T037 entry point: prove the pool against the acquired canonical batch first. */
export const freezePreviewCohort = (
  input: VerifiedCohortFreezeInput & { readonly metadata: CorpusMetadataBatch },
): FrozenPreviewCohort => {
  verifyPreviewCandidatePool(input.pool, input.metadata);
  return freezeVerifiedPreviewCohort(input);
};

/**
 * Deterministic T044 re-selection after its caller has independently joined the
 * pool to canonical Contest/Problem/Source entities.
 */
export const refreezeVerifiedPreviewCohort = (
  input: VerifiedCohortFreezeInput,
): FrozenPreviewCohort => {
  verifyPreviewCandidatePoolStructure(input.pool);
  return freezeVerifiedPreviewCohort(input);
};
