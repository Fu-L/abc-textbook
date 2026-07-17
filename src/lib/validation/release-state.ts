import { canonicalDigest } from '../domain/canonical-json.js';
import {
  PublicationUpdateSchema,
  PublishReceiptSchema,
  ReleaseCandidateSchema,
} from '../domain/schema-parts/release.js';

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
  readonly candidate?: unknown;
  readonly receipt?: unknown;
  readonly trusted?: TrustedReleaseCandidateContext;
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
    const candidateResult = ReleaseCandidateSchema.safeParse(context?.candidate);
    const receiptResult = PublishReceiptSchema.safeParse(context?.receipt);
    if (!candidateResult.success || !receiptResult.success) {
      throw new ReleaseTransitionError(
        'PUBLISH_RECEIPT_REQUIRED',
        'A schema-valid READY candidate and append-only receipt are required.',
      );
    }
    const candidate = candidateResult.data;
    const receipt = receiptResult.data;
    try {
      validateReleaseCandidate(candidate, context?.trusted);
    } catch (error) {
      throw new ReleaseTransitionError(
        'PUBLISH_CANDIDATE_INVALID',
        error instanceof Error ? error.message : String(error),
      );
    }
    const swapAt = Date.parse(receipt.actualAtomicSwapAt);
    if (
      candidate.state !== 'READY_TO_PUBLISH' ||
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
      receipt.publicationWindowEndsAt !== candidate.publicationWindowEndsAt ||
      receipt.newReleaseVersion !== candidate.targetReleaseVersion ||
      receipt.previousReleaseVersion !== candidate.baseReleaseVersion ||
      swapAt < Date.parse(candidate.publicationEffectiveAt) ||
      swapAt > Date.parse(candidate.publicationWindowEndsAt) ||
      Date.parse(receipt.recordedAt) < swapAt
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
  canonicalDigest(sortFileInventory(candidateFiles));

const sortFileInventory = (files: readonly unknown[]): readonly unknown[] =>
  [...files].sort((left, right) => {
    const leftPath =
      typeof left === 'object' && left !== null && 'path' in left ? String(left.path) : '';
    const rightPath =
      typeof right === 'object' && right !== null && 'path' in right ? String(right.path) : '';
    return leftPath < rightPath ? -1 : leftPath > rightPath ? 1 : 0;
  });

export const calculateContentSubjectDigest = (contentFiles: readonly unknown[]): string =>
  canonicalDigest(sortFileInventory(contentFiles));

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

export interface TrustedReleaseCandidateContext {
  readonly updates: readonly {
    readonly updateId: string;
    readonly state: 'ELIGIBLE_FOR_BATCH';
    readonly baseReleaseVersion: string | null;
    readonly targetReleaseVersion: string;
  }[];
  /** Read-only inventory calculated from the actual files immediately before publication. */
  readonly contentFiles: readonly {
    readonly path: string;
    readonly sha256: string;
    readonly byteLength: number;
  }[];
}

export const validateReleaseCandidate = (
  value: unknown,
  trusted?: TrustedReleaseCandidateContext,
): void => {
  const result = ReleaseCandidateSchema.safeParse(value);
  if (!result.success) {
    throw new ReleaseTransitionError('RELEASE_CANDIDATE_INVALID', result.error.message);
  }
  const candidate = result.data;
  if (['READY_TO_PUBLISH', 'PUBLISHED'].includes(candidate.state)) {
    if (!trusted) {
      throw new ReleaseTransitionError(
        'RELEASE_TRUSTED_INVENTORY_REQUIRED',
        'Final validation requires trusted update and file inventories.',
      );
    }
    const trustedUpdates = new Map(trusted.updates.map((update) => [update.updateId, update]));
    const updateInventoryMatches =
      trustedUpdates.size === trusted.updates.length &&
      trustedUpdates.size === candidate.orderedUpdateIds.length &&
      candidate.orderedUpdateIds.every((updateId, index) => {
        const update = trustedUpdates.get(updateId);
        return (
          trusted.updates[index]?.updateId === updateId &&
          update?.state === 'ELIGIBLE_FOR_BATCH' &&
          update.baseReleaseVersion === candidate.baseReleaseVersion &&
          update.targetReleaseVersion === candidate.targetReleaseVersion
        );
      });
    const trustedFiles = sortFileInventory(trusted.contentFiles);
    const candidateContentFiles = sortFileInventory(candidate.contentFiles);
    if (
      !updateInventoryMatches ||
      canonicalDigest(trustedFiles) !== canonicalDigest(candidateContentFiles) ||
      candidate.contentSubjectDigest !== calculateContentSubjectDigest(candidate.contentFiles) ||
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
