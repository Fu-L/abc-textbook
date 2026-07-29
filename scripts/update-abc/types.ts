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
