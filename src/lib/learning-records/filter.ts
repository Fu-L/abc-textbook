import type { UiCatalog, UiProblem } from '../catalog/ui-catalog.js';
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
  readonly problem: UiProblem;
  readonly record: LearningRecord;
}

export type FilterLearningUnit = Pick<
  UiCatalog['learningUnits'][number],
  'id' | 'title' | 'coverageProblemIds'
>;

export function joinAndFilterLearningRecords(
  problems: readonly UiProblem[],
  records: readonly LearningRecord[],
  filters: LearningRecordFilters,
  learningUnits: readonly FilterLearningUnit[],
): ProblemWithLearningRecord[] {
  const byProblemId = new Map(records.map((record) => [record.problemId, record]));
  const unitProblemIds = new Set(
    learningUnits.find((unit) => unit.id === filters.unit)?.coverageProblemIds ?? [],
  );
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
        (!filters.unit || unitProblemIds.has(problem.id)) &&
        (!filters.status || record.status === filters.status) &&
        (filters.needsReview === null ||
          filters.needsReview === undefined ||
          record.needsReview === filters.needsReview),
    );
}
