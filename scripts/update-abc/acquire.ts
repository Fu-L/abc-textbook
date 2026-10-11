import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { stableProblemId } from '../../src/lib/domain/identity.js';
import {
  acquireCorpusMetadataBatch,
  type SerialOfficialPageClient,
} from '../../src/lib/corpus/acquisition.js';
import type { CorpusMetadataBatch, PolicyApprovalManifest } from '../../src/lib/corpus/types.js';
import {
  discoverMetadataBatch,
  type MetadataRangeInput,
  type MetadataAcquisitionScope,
} from './discover.js';
import type { DiscoverableContest, OfficialTask, UpdateHold } from './types.js';

export type MetadataRangeResult =
  | {
      readonly status: 'acquired';
      readonly scope: MetadataAcquisitionScope;
      readonly artifact: CorpusMetadataBatch;
    }
  | { readonly status: 'unchanged'; readonly scope: MetadataAcquisitionScope }
  | {
      readonly status: 'on_hold';
      readonly scope: MetadataAcquisitionScope;
      readonly hold: UpdateHold;
    };

export const metadataAcquisitionHold = (error: unknown): UpdateHold => {
  const code =
    error instanceof Error && 'code' in error && typeof error.code === 'string'
      ? error.code
      : 'PARSER_DRIFT';
  return {
    code,
    reason: error instanceof Error ? error.message : 'Official acquisition failed.',
    retryCondition:
      code === 'CONTEST_NOT_ENDED'
        ? 'Wait until the official end time, then retry with a new checkedAt.'
        : code === 'D_TASK_NOT_FOUND' || code === 'TASK_ORDER_CONFLICT' || code.includes('PARSER')
          ? 'Confirm the official task list and published order; correct parser/input drift, then retry in a new working directory.'
          : 'Restore the official source or confirm the reported policy/metadata issue, then retry the same range. A failed request is not evidence of an official gap.',
  };
};

/** Acquisition only: no canonical writes, classification, or publication. */
export const acquireMetadataRange = async (
  input: MetadataRangeInput & {
    readonly client: SerialOfficialPageClient;
    readonly policyApproval: PolicyApprovalManifest;
    readonly checkedAt: string;
  },
): Promise<MetadataRangeResult> => {
  const scope = discoverMetadataBatch(input);
  if (!scope.batch) return { status: 'unchanged', scope };
  try {
    const artifact = await acquireCorpusMetadataBatch({
      batch: scope.batch,
      client: input.client,
      policyApproval: input.policyApproval,
      checkedAt: input.checkedAt,
      existingRegistry: scope.existingRegistry,
    });
    return { status: 'acquired', scope, artifact };
  } catch (error) {
    return { status: 'on_hold', scope, hold: metadataAcquisitionHold(error) };
  }
};

export interface AcquisitionOptions {
  readonly loadSource?: (task: OfficialTask) => Promise<unknown>;
}

export interface AcquisitionResult {
  readonly status: 'acquired' | 'on_hold';
  readonly contestId: string;
  readonly advancedSlotLabels: readonly string[];
  readonly problemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
  readonly sourceSetFingerprint: string;
  readonly hold?: UpdateHold;
}

const advancedTasks = (contest: DiscoverableContest): readonly OfficialTask[] => {
  const anchors = contest.tasks.flatMap((task, index) =>
    task.label.toUpperCase() === 'D' ? [index] : [],
  );
  if (anchors.length !== 1)
    throw new Error(anchors.length === 0 ? 'D_TASK_NOT_FOUND' : 'TASK_ORDER_CONFLICT');
  const anchor = anchors[0];
  if (anchor === undefined) throw new Error('D_TASK_NOT_FOUND');
  return contest.tasks.slice(anchor + 1);
};

export const acquireOfficialMetadata = async (
  contest: DiscoverableContest,
  options: AcquisitionOptions = {},
): Promise<AcquisitionResult> => {
  let tasks: readonly OfficialTask[];
  try {
    tasks = advancedTasks(contest);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'PARSER_DRIFT';
    return {
      status: 'on_hold',
      contestId: contest.contestId,
      advancedSlotLabels: [],
      problemIds: [],
      sourceRevisionIds: [],
      sourceSetFingerprint: canonicalDigest([]),
      hold: {
        code,
        reason: 'The official task order cannot identify a unique D anchor.',
        retryCondition: 'Correct the official task fixture and resume.',
      },
    };
  }
  const labels = tasks.map(({ label }) => label);
  const problemIds = labels.map((label) => stableProblemId(contest.contestId, label));
  const revisionIds = tasks.map(({ sourceRevisionId }) => sourceRevisionId);
  for (const task of tasks) {
    try {
      await (options.loadSource?.(task) ?? Promise.resolve(task));
    } catch (error) {
      return {
        status: 'on_hold',
        contestId: contest.contestId,
        advancedSlotLabels: labels,
        problemIds,
        sourceRevisionIds: revisionIds,
        sourceSetFingerprint: canonicalDigest({ contestId: contest.contestId, tasks }),
        hold: {
          code: 'SOURCE_UNAVAILABLE',
          problemId: stableProblemId(contest.contestId, task.label),
          reason: error instanceof Error ? error.message : 'The official source is unavailable.',
          retryCondition: 'Restore official source acquisition and resume the same update.',
        },
      };
    }
  }
  return {
    status: 'acquired',
    contestId: contest.contestId,
    advancedSlotLabels: labels,
    problemIds,
    sourceRevisionIds: revisionIds,
    sourceSetFingerprint: canonicalDigest({ contestId: contest.contestId, tasks }),
  };
};
