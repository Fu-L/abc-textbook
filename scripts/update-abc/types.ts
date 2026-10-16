export interface OfficialTask {
  readonly label: string;
  readonly sourceRevisionId: string;
  readonly title?: string;
}

export interface DiscoverableContest {
  readonly contestId: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly tasks: readonly OfficialTask[];
}

export interface UpdateHold {
  readonly code: string;
  readonly reason: string;
  readonly retryCondition: string;
  readonly problemId?: string;
}

/** Normal editing uses acquired data and an editable copy, without a release transaction. */
export interface SmallBatchOptions {
  readonly mode: 'prepare' | 'validate';
  readonly repositoryRoot: string;
  readonly candidateRoot: string;
  readonly baseCatalog: unknown;
  readonly baseMetadata: unknown;
  readonly metadataBatch: unknown;
  readonly metrics: unknown;
}

export interface SmallBatchResult {
  readonly command: 'abc:update';
  readonly status: 'passed' | 'unchanged' | 'on_hold';
  readonly addedProblemIds: readonly string[];
  readonly lastContestId: string;
  readonly cutoffAt: string;
  readonly writtenPaths: readonly string[];
  readonly holds: readonly UpdateHold[];
}

export interface StagedOperationInput {
  readonly entityType:
    | 'contest'
    | 'contest_slot'
    | 'problem'
    | 'technique_inventory'
    | 'tag'
    | 'learning_outcome'
    | 'learning_unit'
    | 'placement'
    | 'authoring_unit'
    | 'source'
    | 'correction_impact';
  readonly entityId: string;
  readonly action: 'add' | 'replace' | 'remove';
  readonly path: string;
  readonly beforeDigest: string | null;
  readonly afterDigest: string | null;
  readonly affectedProblemIds: readonly string[];
}

export const stableCompare = (left: string, right: string): number =>
  left.localeCompare(right, 'en');
