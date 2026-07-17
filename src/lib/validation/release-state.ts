import { canonicalDigest } from '../domain/canonical-json.js';
import { PublicationUpdateSchema, ReleaseCandidateSchema } from '../domain/schema-parts/release.js';

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
  readonly candidate?: {
    readonly candidateId: string;
    readonly targetReleaseVersion: string;
    readonly contentSubjectDigest: string;
    readonly candidatePayloadDigest: string | null;
    readonly approvableDigest: string | null;
    readonly publicationEffectiveAt: string | null;
    readonly publicationWindowEndsAt: string | null;
  };
  readonly receipt?: {
    readonly candidateId: string;
    readonly releaseVersion: string;
    readonly contentSnapshotDigest: string;
    readonly candidatePayloadDigest: string;
    readonly approvableDigest: string;
    readonly publicationEffectiveAt: string;
    readonly publicationWindowEndsAt: string;
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
    const candidate = context?.candidate;
    const receipt = context?.receipt;
    if (!candidate || !receipt) {
      throw new ReleaseTransitionError(
        'PUBLISH_RECEIPT_REQUIRED',
        'A matching append-only receipt is required.',
      );
    }
    if (receipt.result !== 'published') {
      throw new ReleaseTransitionError(
        'PUBLISH_RECEIPT_REQUIRED',
        'A successful append-only receipt is required.',
      );
    }
    if (
      candidate.candidatePayloadDigest === null ||
      candidate.approvableDigest === null ||
      candidate.publicationEffectiveAt === null ||
      candidate.publicationWindowEndsAt === null ||
      receipt.candidateId !== candidate.candidateId ||
      receipt.releaseVersion !== candidate.targetReleaseVersion ||
      receipt.contentSnapshotDigest !== candidate.contentSubjectDigest ||
      receipt.candidatePayloadDigest !== candidate.candidatePayloadDigest ||
      receipt.approvableDigest !== candidate.approvableDigest ||
      receipt.publicationEffectiveAt !== candidate.publicationEffectiveAt ||
      receipt.publicationWindowEndsAt !== candidate.publicationWindowEndsAt
    ) {
      throw new ReleaseTransitionError(
        'PUBLISH_RECEIPT_MISMATCH',
        'Receipt digests and publication window must match the fixed candidate.',
      );
    }
  }
  return next;
};

export const validatePublicationUpdate = (value: unknown): void => {
  const result = PublicationUpdateSchema.safeParse(value);
  if (!result.success) {
    throw new ReleaseTransitionError('PUBLICATION_UPDATE_INVALID', result.error.message);
  }
};

export const calculateCandidatePayloadDigest = (candidateFiles: readonly unknown[]): string =>
  canonicalDigest(candidateFiles);

export const calculateApprovableDigest = (candidate: {
  readonly contentSubjectDigest: string;
  readonly candidatePayloadDigest: string;
  readonly preJudgmentCheckRefs: readonly unknown[];
  readonly humanContentReviewEvidenceRefs: readonly unknown[];
  readonly blockingFindings: readonly unknown[];
}): string =>
  canonicalDigest({
    contentSubjectDigest: candidate.contentSubjectDigest,
    candidatePayloadDigest: candidate.candidatePayloadDigest,
    preJudgmentCheckRefs: candidate.preJudgmentCheckRefs,
    humanContentReviewEvidenceRefs: candidate.humanContentReviewEvidenceRefs,
    blockingFindings: candidate.blockingFindings,
  });

export const validateReleaseCandidate = (value: unknown): void => {
  const result = ReleaseCandidateSchema.safeParse(value);
  if (!result.success) {
    throw new ReleaseTransitionError('RELEASE_CANDIDATE_INVALID', result.error.message);
  }
  const candidate = result.data;
  if (['READY_TO_PUBLISH', 'PUBLISHED'].includes(candidate.state)) {
    if (
      candidate.fixtureMode ||
      candidate.candidatePayloadDigest === null ||
      candidate.approvableDigest === null ||
      candidate.candidatePayloadDigest !==
        calculateCandidatePayloadDigest(candidate.candidateFiles) ||
      candidate.approvableDigest !==
        calculateApprovableDigest({
          contentSubjectDigest: candidate.contentSubjectDigest,
          candidatePayloadDigest: candidate.candidatePayloadDigest,
          preJudgmentCheckRefs: candidate.preJudgmentCheckRefs,
          humanContentReviewEvidenceRefs: candidate.humanContentReviewEvidenceRefs,
          blockingFindings: candidate.blockingFindings,
        })
    ) {
      throw new ReleaseTransitionError(
        'RELEASE_CANDIDATE_DIGEST_MISMATCH',
        'Publishable candidate digests are stale or fixture-derived.',
      );
    }
  }
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
