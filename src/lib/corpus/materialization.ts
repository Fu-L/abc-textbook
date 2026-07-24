import {
  buildAdvancedSlotRegistry,
  type AdvancedSlotRegistry,
} from '../catalog/advanced-slot-registry.js';
import { canonicalDigest } from '../domain/canonical-json.js';
import { normalizeProblemLabel } from '../domain/identity.js';
import { assertBootstrapBatchPartition, getCorpusBatch, type CorpusBatch } from './batches.js';
import { advancedTasks } from './metadata.js';
import { verifyCorpusMetadataBatch } from './verification.js';
import type {
  CorpusMetadataBatch,
  CorpusProblemMetadata,
  CorpusSourceRevision,
  OfficialContestMetadata,
  OfficialContestGapMetadata,
} from './types.js';

export interface MaterializedContest {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly startedAt: string;
  readonly endedAt: string;
  readonly officialUrl: string;
  readonly officialTaskOrder: readonly string[];
  readonly officialTaskIds: readonly string[];
  readonly taskOrderSourceRevisionId: string;
  readonly checkedAt: string;
}

export interface MaterializedContestSlot {
  readonly contestId: string;
  readonly label: string;
  readonly officialTaskId: string | null;
  readonly officialOrder: number | null;
  readonly availability: 'exists' | 'official_absent';
  readonly catalogStatus: 'uncollected';
  readonly holdReason: null;
  readonly problemId: string | null;
  readonly sourceRevisionId: string;
  readonly checkedAt: string;
}

export interface MaterializedProblem {
  readonly id: string;
  readonly contestId: string;
  readonly slotLabel: string;
  readonly officialTaskId: string;
  readonly title: string;
  readonly officialUrl: string;
  readonly constraintsSummary: string;
  readonly difficultyEvidence: null;
  readonly sourceRevisionIds: readonly string[];
  readonly checkedAt: string;
  readonly publicationStatus: 'uncollected';
  readonly primaryTagIds: readonly string[];
  readonly secondaryTagIds: readonly string[];
  readonly adHocElements: readonly string[];
  readonly placementId: null;
}

export interface MaterializedMetadataBatch {
  readonly batchId: string;
  readonly metadataBatchDigest: string;
  readonly contests: readonly MaterializedContest[];
  readonly contestGaps: readonly OfficialContestGapMetadata[];
  readonly contestSlots: readonly MaterializedContestSlot[];
  readonly problems: readonly MaterializedProblem[];
  readonly sources: readonly CorpusSourceRevision[];
}

export interface CorpusWritePlanEntry {
  readonly path: string;
  readonly value:
    | MaterializedContest
    | OfficialContestGapMetadata
    | MaterializedContestSlot
    | MaterializedProblem
    | CorpusSourceRevision;
}

export interface CorpusMaterialization {
  readonly registry: AdvancedSlotRegistry;
  readonly batches: readonly MaterializedMetadataBatch[];
  readonly writePlan: readonly CorpusWritePlanEntry[];
}

export class CorpusMaterializationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CorpusMaterializationError';
  }
}

const codeUnitCompare = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const materializeContest = (contest: OfficialContestMetadata): MaterializedContest =>
  Object.freeze({
    id: contest.id,
    number: contest.number,
    title: contest.title,
    startedAt: contest.startedAt,
    endedAt: contest.endedAt,
    officialUrl: contest.officialUrl,
    officialTaskOrder: contest.officialTaskOrder,
    officialTaskIds: Object.freeze(contest.tasks.map(({ officialTaskId }) => officialTaskId)),
    taskOrderSourceRevisionId: contest.taskOrderSourceRevisionId,
    checkedAt: contest.checkedAt,
  });

const materializeProblem = (problem: CorpusProblemMetadata): MaterializedProblem =>
  Object.freeze({
    id: problem.id,
    contestId: problem.contestId,
    slotLabel: problem.slotLabel,
    officialTaskId: problem.officialTaskId,
    title: problem.title,
    officialUrl: problem.officialUrl,
    constraintsSummary: problem.constraintsSummary,
    difficultyEvidence: null,
    sourceRevisionIds: problem.sourceRevisionIds,
    checkedAt: problem.checkedAt,
    publicationStatus: 'uncollected',
    primaryTagIds: Object.freeze([]),
    secondaryTagIds: Object.freeze([]),
    adHocElements: Object.freeze([]),
    placementId: null,
  });

const observedSlot = (contest: OfficialContestMetadata, label: string): MaterializedContestSlot => {
  const task = contest.tasks.find((candidate) => candidate.label === label);
  if (!task) {
    throw new CorpusMaterializationError(
      'OBSERVED_TASK_MISSING',
      `${contest.id}:${label} is in official order without task metadata.`,
    );
  }
  return Object.freeze({
    contestId: contest.id,
    label,
    officialTaskId: task.officialTaskId,
    officialOrder: task.officialOrder,
    availability: 'exists',
    catalogStatus: 'uncollected',
    holdReason: null,
    problemId:
      advancedTasks(contest).find((candidate) => candidate.label === label)?.problemId ?? null,
    sourceRevisionId: contest.taskOrderSourceRevisionId,
    checkedAt: contest.checkedAt,
  });
};

export const observedMetadataProjection = (input: {
  readonly batchId: string;
  readonly contests: readonly MaterializedContest[];
  readonly contestGaps?: readonly OfficialContestGapMetadata[];
  readonly contestSlots: readonly MaterializedContestSlot[];
  readonly problems: readonly MaterializedProblem[];
  readonly sources: readonly CorpusSourceRevision[];
}): Readonly<Record<string, unknown>> => {
  const contestGaps = [...(input.contestGaps ?? [])].sort(
    (left, right) => left.number - right.number,
  );
  return {
    batchId: input.batchId,
    contests: [...input.contests].sort((left, right) => left.number - right.number),
    ...(contestGaps.length > 0 ? { contestGaps } : {}),
    contestSlots: input.contestSlots
      .filter(({ availability }) => availability === 'exists')
      .sort(
        (left, right) =>
          codeUnitCompare(left.contestId, right.contestId) ||
          (left.officialOrder ?? Number.MAX_SAFE_INTEGER) -
            (right.officialOrder ?? Number.MAX_SAFE_INTEGER) ||
          codeUnitCompare(left.label, right.label),
      ),
    problems: [...input.problems].sort((left, right) => codeUnitCompare(left.id, right.id)),
    sources: [...input.sources].sort((left, right) => codeUnitCompare(left.id, right.id)),
  };
};

export const calculateMetadataBatchDigest = (input: {
  readonly batchId: string;
  readonly contests: readonly MaterializedContest[];
  readonly contestGaps?: readonly OfficialContestGapMetadata[];
  readonly contestSlots: readonly MaterializedContestSlot[];
  readonly problems: readonly MaterializedProblem[];
  readonly sources: readonly CorpusSourceRevision[];
}): string => canonicalDigest(observedMetadataProjection(input));

export const materializeObservedMetadataBatch = (
  artifact: CorpusMetadataBatch,
): MaterializedMetadataBatch => {
  const contests = Object.freeze(artifact.contests.map(materializeContest));
  const contestGaps = Object.freeze([...artifact.contestGaps]);
  const contestSlots = Object.freeze(
    artifact.contests.flatMap((contest) =>
      advancedTasks(contest).map(({ label }) => observedSlot(contest, label)),
    ),
  );
  const problems = Object.freeze(artifact.problems.map(materializeProblem));
  const sources = Object.freeze([...artifact.sourceRevisions]);
  const metadataBatchDigest = calculateMetadataBatchDigest({
    batchId: artifact.batchId,
    contests,
    contestGaps,
    contestSlots,
    problems,
    sources,
  });
  return Object.freeze({
    batchId: artifact.batchId,
    metadataBatchDigest,
    contests,
    contestGaps,
    contestSlots,
    problems,
    sources,
  });
};

const fullSlotsForBatch = (
  artifact: CorpusMetadataBatch,
  labels: readonly string[],
): readonly MaterializedContestSlot[] =>
  Object.freeze(
    artifact.contests.flatMap((contest) =>
      labels.map((label) => {
        const task = contest.tasks.find((candidate) => candidate.label === label);
        if (task) return observedSlot(contest, label);
        return Object.freeze({
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
        });
      }),
    ),
  );

const writePlanForBatch = (batch: MaterializedMetadataBatch): readonly CorpusWritePlanEntry[] => {
  const roots = {
    contests: `src/content/contests/${batch.batchId}`,
    contestGaps: `src/content/contest-gaps/${batch.batchId}`,
    contestSlots: `src/content/problem-slots/${batch.batchId}`,
    problems: `src/content/problems/${batch.batchId}`,
    sources: `src/content/sources/${batch.batchId}`,
  };
  return Object.freeze([
    ...batch.contests.map((value) => ({ path: `${roots.contests}/${value.id}.json`, value })),
    ...batch.contestGaps.map((value) => ({
      path: `${roots.contestGaps}/${value.contestId}.json`,
      value,
    })),
    ...batch.contestSlots.map((value) => ({
      path: `${roots.contestSlots}/${value.contestId}-${normalizeProblemLabel(value.label)}.json`,
      value,
    })),
    ...batch.problems.map((value) => ({ path: `${roots.problems}/${value.id}.json`, value })),
    ...batch.sources.map((value) => ({ path: `${roots.sources}/${value.id}.json`, value })),
  ]);
};

/** Materialize only after all five independently acquired batches are present. */
export const materializeCorpusMetadata = (
  artifacts: readonly CorpusMetadataBatch[],
): CorpusMaterialization => {
  const sorted = [...artifacts].sort(
    (left, right) => left.firstContestNumber - right.firstContestNumber,
  );
  const batches: CorpusBatch[] = sorted.map((artifact) => {
    const batch = getCorpusBatch(artifact.batchId);
    verifyCorpusMetadataBatch(artifact, batch);
    return batch;
  });
  assertBootstrapBatchPartition(batches);
  if (new Set(sorted.map(({ batchId }) => batchId)).size !== sorted.length) {
    throw new CorpusMaterializationError('DUPLICATE_METADATA_BATCH', 'Batch IDs must be unique.');
  }
  const assertGloballyUnique = (values: readonly string[], entityKind: string): void => {
    if (new Set(values).size !== values.length) {
      throw new CorpusMaterializationError(
        'GLOBAL_ENTITY_ID_COLLISION',
        `${entityKind} IDs must be unique across batches.`,
      );
    }
  };
  assertGloballyUnique(
    sorted.flatMap(({ contests }) => contests.map(({ id }) => id)),
    'Contest',
  );
  assertGloballyUnique(
    sorted.flatMap(({ problems }) => problems.map(({ id }) => id)),
    'Problem',
  );
  assertGloballyUnique(
    sorted.flatMap(({ sourceRevisions }) => sourceRevisions.map(({ id }) => id)),
    'SourceRevision',
  );
  const registry = buildAdvancedSlotRegistry({
    contests: sorted.flatMap(({ contests }) =>
      contests.map((contest) => ({
        contestId: contest.id,
        advancedLabels: advancedTasks(contest).map(({ label }) => label),
        sourceRevisionId: contest.taskOrderSourceRevisionId,
      })),
    ),
  });
  const materializedBatches = Object.freeze(
    sorted.map((artifact) => {
      const observed = materializeObservedMetadataBatch(artifact);
      if (observed.metadataBatchDigest !== artifact.metadataBatchDigest) {
        throw new CorpusMaterializationError('METADATA_BATCH_DIGEST_MISMATCH', artifact.batchId);
      }
      return Object.freeze({
        ...observed,
        contestSlots: fullSlotsForBatch(artifact, registry.labels),
      });
    }),
  );
  const writePlan = Object.freeze(materializedBatches.flatMap(writePlanForBatch));
  const paths = writePlan.map(({ path }) => path);
  if (new Set(paths).size !== paths.length) {
    throw new CorpusMaterializationError(
      'CORPUS_WRITE_PATH_COLLISION',
      'Per-entity write paths must be unique.',
    );
  }
  return Object.freeze({ registry, batches: materializedBatches, writePlan });
};
