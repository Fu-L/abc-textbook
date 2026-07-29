import type { PreviewProblem } from '../catalog/preview-ui-catalog.js';
import { defaultLearningRecord } from './database.js';
import type { LearningRecord, LearningStatus } from './types.js';

export interface LearningRecordFilters {
  readonly contest?: string;
  readonly slot?: string;
  readonly tag?: string;
  readonly unit?: string;
  readonly status?: LearningStatus | '';
  readonly needsReview?: boolean | null;
}

export interface ProblemWithLearningRecord {
  readonly problem: PreviewProblem;
  readonly record: LearningRecord;
}

export function joinAndFilterLearningRecords(
  problems: readonly PreviewProblem[],
  records: readonly LearningRecord[],
  filters: LearningRecordFilters,
): ProblemWithLearningRecord[] {
  const byProblemId = new Map(records.map((record) => [record.problemId, record]));
  return problems
    .map((problem) => ({
      problem,
      record: byProblemId.get(problem.id) ?? defaultLearningRecord(problem.id),
    }))
    .filter(
      ({ problem, record }) =>
        (!filters.contest || problem.contestId === filters.contest) &&
        (!filters.slot || problem.label === filters.slot) &&
        (!filters.tag || problem.tagIds.includes(filters.tag)) &&
        (!filters.unit || problem.learningUnitId === filters.unit) &&
        (!filters.status || record.status === filters.status) &&
        (filters.needsReview === null ||
          filters.needsReview === undefined ||
          record.needsReview === filters.needsReview),
    );
}
