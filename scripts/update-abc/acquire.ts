import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { stableProblemId } from '../../src/lib/domain/identity.js';
import type { DiscoverableContest, OfficialTask, UpdateHold } from './types.js';

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
