import { canonicalDigest } from '../domain/canonical-json.js';

export type ReleaseCandidateState =
  | 'DRAFTED'
  | 'VALIDATING'
  | 'AWAITING_REVIEW'
  | 'AWAITING_OWNER_APPROVAL'
  | 'AWAITING_FINAL_VALIDATION'
  | 'READY_TO_PUBLISH'
  | 'ON_HOLD'
  | 'PUBLISHED'
  | 'EXPIRED';

const forwardTransitions: Readonly<Partial<Record<ReleaseCandidateState, ReleaseCandidateState>>> =
  {
    DRAFTED: 'VALIDATING',
    VALIDATING: 'AWAITING_REVIEW',
    AWAITING_REVIEW: 'AWAITING_OWNER_APPROVAL',
    AWAITING_OWNER_APPROVAL: 'AWAITING_FINAL_VALIDATION',
    AWAITING_FINAL_VALIDATION: 'READY_TO_PUBLISH',
    READY_TO_PUBLISH: 'PUBLISHED',
  };

export class ReleaseTransitionError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'ReleaseTransitionError';
  }
}

interface PublishContext {
  readonly candidateId: string;
  readonly receipt?: {
    readonly candidateId: string;
    readonly result: string;
  };
}

export const transitionReleaseCandidate = (
  current: ReleaseCandidateState,
  next: ReleaseCandidateState,
  context?: PublishContext,
): ReleaseCandidateState => {
  if (next === 'ON_HOLD' && current !== 'PUBLISHED') return next;
  if (next === 'EXPIRED' && current !== 'PUBLISHED') return next;
  if (forwardTransitions[current] !== next) {
    throw new ReleaseTransitionError('INVALID_RELEASE_TRANSITION', `${current} -> ${next}`);
  }
  if (next === 'PUBLISHED') {
    if (
      context?.receipt?.candidateId !== context?.candidateId ||
      context?.receipt?.result !== 'published'
    ) {
      throw new ReleaseTransitionError(
        'PUBLISH_RECEIPT_REQUIRED',
        'A matching append-only receipt is required.',
      );
    }
  }
  return next;
};

export const assertImmutableSnapshot = (expectedDigest: string, snapshot: unknown): void => {
  if (canonicalDigest(snapshot) !== expectedDigest) {
    throw new ReleaseTransitionError(
      'IMMUTABLE_SNAPSHOT_MISMATCH',
      'The fixed candidate snapshot changed.',
    );
  }
};

export const assertApprovalDigest = (
  approvableDigest: string,
  approval: { readonly approvedDigest: string },
): void => {
  if (approval.approvedDigest !== approvableDigest) {
    throw new ReleaseTransitionError(
      'APPROVAL_DIGEST_MISMATCH',
      'Owner approval does not match the current approvable digest.',
    );
  }
};

interface ReviewCompleteness {
  readonly subjectDigest: string;
  readonly expectedSubjectDigest: string;
  readonly applicableCheckCount: number;
  readonly passedApplicableCheckCount: number;
  readonly unreviewedItemCount: number;
  readonly blockingFindingCount: number;
  readonly aggregatePassed: boolean;
}

export const assertReviewComplete = (review: ReviewCompleteness): void => {
  if (
    review.subjectDigest !== review.expectedSubjectDigest ||
    review.applicableCheckCount !== review.passedApplicableCheckCount ||
    review.unreviewedItemCount !== 0 ||
    review.blockingFindingCount !== 0 ||
    !review.aggregatePassed
  ) {
    throw new ReleaseTransitionError('REVIEW_INCOMPLETE', 'Current review evidence is incomplete.');
  }
};
