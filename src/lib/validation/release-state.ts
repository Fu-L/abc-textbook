import { canonicalDigest } from '../domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
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

export interface TrustedPublicationUpdateContext {
  /** Ownership/impact inventory calculated from the trusted catalog diff. */
  readonly operationOwnership: readonly {
    readonly operationId: string;
    readonly affectedProblemIds: readonly string[];
    /** Present when the ownership inventory was derived from an actual diff. */
    readonly entityType?: string;
    readonly entityId?: string;
    readonly action?: 'add' | 'replace' | 'remove';
    readonly path?: string;
    readonly beforeDigest?: string | null;
    readonly afterDigest?: string | null;
  }[];
  /** Correction impacts calculated from the trusted catalog diff. */
  readonly correctionImpacts?: readonly {
    readonly correctionImpactId: string;
    readonly affectedProblemIds: readonly string[];
    readonly operationIds: readonly string[];
  }[];
  /** The independently reconstructed before/after content inventories. */
  readonly baseFiles?: readonly {
    readonly path: string;
    readonly sha256: string;
    readonly byteLength: number;
  }[];
  readonly currentFiles?: readonly {
    readonly path: string;
    readonly sha256: string;
    readonly byteLength: number;
  }[];
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
    const swapAt = parseOffsetDateTime(receipt.actualAtomicSwapAt);
    if (
      candidate.state !== 'READY_TO_PUBLISH' ||
      candidate.candidatePayloadDigest === null ||
      candidate.approvableDigest === null ||
      candidate.publicationEffectiveAt === null ||
      candidate.publicationWindowEndsAt === null ||
      receipt.candidateId !== candidate.candidateId ||
      receipt.releaseVersion !== candidate.targetReleaseVersion ||
      receipt.contentSnapshotDigest !== candidate.catalogContentSnapshotDigest ||
      receipt.candidatePayloadDigest !== candidate.candidatePayloadDigest ||
      receipt.approvableDigest !== candidate.approvableDigest ||
      receipt.publicationEffectiveAt !== candidate.publicationEffectiveAt ||
      receipt.publicationWindowEndsAt !== candidate.publicationWindowEndsAt ||
      receipt.newReleaseVersion !== candidate.targetReleaseVersion ||
      receipt.previousReleaseVersion !== candidate.baseReleaseVersion ||
      compareOffsetDateTimes(swapAt, parseOffsetDateTime(candidate.publicationEffectiveAt)) < 0 ||
      compareOffsetDateTimes(swapAt, parseOffsetDateTime(candidate.publicationWindowEndsAt)) > 0 ||
      compareOffsetDateTimes(parseOffsetDateTime(receipt.recordedAt), swapAt) < 0
    ) {
      throw new ReleaseTransitionError(
        'PUBLISH_RECEIPT_MISMATCH',
        'Receipt digests and publication window must match the fixed candidate.',
      );
    }
  }
  return next;
};

const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return (
    sortedLeft.length === sortedRight.length &&
    sortedLeft.every((item, index) => item === sortedRight[index])
  );
};

export const validatePublicationUpdate = (
  value: unknown,
  trusted?: TrustedPublicationUpdateContext,
): void => {
  const result = PublicationUpdateSchema.safeParse(value);
  if (!result.success) {
    throw new ReleaseTransitionError('PUBLICATION_UPDATE_INVALID', result.error.message);
  }
  if (!trusted) {
    throw new ReleaseTransitionError(
      'PUBLICATION_UPDATE_OWNERSHIP_REQUIRED',
      'Publication updates require an independently computed ownership inventory.',
    );
  }
  const update = result.data;
  const trustedOperations = new Map(
    trusted.operationOwnership.map((operation) => [operation.operationId, operation]),
  );
  const operationIds = update.operations.map(({ operationId }) => operationId);
  if (
    trustedOperations.size !== trusted.operationOwnership.length ||
    trustedOperations.size !== operationIds.length ||
    !sameStringSet([...trustedOperations.keys()], operationIds)
  ) {
    throw new ReleaseTransitionError(
      'PUBLICATION_UPDATE_OWNERSHIP_INVALID',
      'Trusted operation inventory does not exactly cover this update.',
    );
  }
  for (const operation of update.operations) {
    const expected = trustedOperations.get(operation.operationId);
    if (!expected || !sameStringSet(operation.affectedProblemIds, expected.affectedProblemIds)) {
      throw new ReleaseTransitionError(
        'PUBLICATION_UPDATE_OWNERSHIP_INVALID',
        `Operation ${operation.operationId} does not match trusted Problem ownership.`,
      );
    }
  }
  const hasDetailedDiff = trusted.operationOwnership.some(
    (operation) => operation.path !== undefined,
  );
  if (hasDetailedDiff || trusted.baseFiles !== undefined || trusted.currentFiles !== undefined) {
    if (
      !trusted.baseFiles ||
      !trusted.currentFiles ||
      trusted.operationOwnership.some(
        (operation) =>
          operation.entityType === undefined ||
          operation.entityId === undefined ||
          operation.action === undefined ||
          operation.path === undefined ||
          operation.beforeDigest === undefined ||
          operation.afterDigest === undefined,
      )
    ) {
      throw new ReleaseTransitionError(
        'PUBLICATION_UPDATE_DIFF_INVALID',
        'A trusted publication update must include a complete before/after file diff.',
      );
    }
    const baseFiles = new Map(trusted.baseFiles.map((file) => [file.path, file] as const));
    const currentFiles = new Map(trusted.currentFiles.map((file) => [file.path, file] as const));
    if (
      baseFiles.size !== trusted.baseFiles.length ||
      currentFiles.size !== trusted.currentFiles.length
    ) {
      throw new ReleaseTransitionError(
        'PUBLICATION_UPDATE_DIFF_INVALID',
        'Trusted publication file inventories must contain unique paths.',
      );
    }
    for (const operation of update.operations) {
      const expected = trustedOperations.get(operation.operationId);
      if (expected?.path === undefined) {
        throw new ReleaseTransitionError(
          'PUBLICATION_UPDATE_DIFF_INVALID',
          `Operation ${operation.operationId} is absent from the trusted file diff.`,
        );
      }
      if (
        expected.entityType !== operation.entityType ||
        expected.entityId !== operation.entityId ||
        expected.action !== operation.action ||
        expected.path !== operation.path ||
        expected.beforeDigest !== operation.beforeDigest ||
        expected.afterDigest !== operation.afterDigest
      ) {
        throw new ReleaseTransitionError(
          'PUBLICATION_UPDATE_DIFF_INVALID',
          `Operation ${operation.operationId} does not reproduce the trusted file diff.`,
        );
      }
      const before = baseFiles.get(operation.path);
      const after = currentFiles.get(operation.path);
      const fileTransition =
        before === undefined && after !== undefined
          ? 'add'
          : before !== undefined && after !== undefined
            ? 'replace'
            : before !== undefined && after === undefined
              ? 'remove'
              : undefined;
      const validTransition =
        fileTransition === 'add'
          ? operation.beforeDigest === null && operation.afterDigest === after?.sha256
          : fileTransition === 'replace'
            ? operation.beforeDigest === before?.sha256 && operation.afterDigest === after?.sha256
            : fileTransition === 'remove'
              ? operation.beforeDigest === before?.sha256 && operation.afterDigest === null
              : false;
      if (!validTransition) {
        throw new ReleaseTransitionError(
          'PUBLICATION_UPDATE_DIFF_INVALID',
          `Operation ${operation.operationId} does not match the trusted before/after files.`,
        );
      }
    }
  }
  const trustedAffectedProblemIds = trusted.operationOwnership.flatMap(
    (operation) => operation.affectedProblemIds,
  );
  if (!sameStringSet([...new Set(trustedAffectedProblemIds)], update.targetProblemIds)) {
    throw new ReleaseTransitionError(
      'PUBLICATION_UPDATE_OWNERSHIP_INVALID',
      'Trusted operation ownership does not exactly match targetProblemIds.',
    );
  }
  if (update.kind === 'correction') {
    const trustedImpacts = trusted.correctionImpacts ?? [];
    const impactMap = new Map(trustedImpacts.map((impact) => [impact.correctionImpactId, impact]));
    const updateImpactIds = update.correctionImpactIds;
    if (
      impactMap.size !== trustedImpacts.length ||
      impactMap.size !== updateImpactIds.length ||
      !sameStringSet([...impactMap.keys()], updateImpactIds)
    ) {
      throw new ReleaseTransitionError(
        'PUBLICATION_UPDATE_CORRECTION_IMPACT_INVALID',
        'Trusted Correction Impact inventory does not exactly cover the update.',
      );
    }
    const operationIdSet = new Set(operationIds);
    const impactAffectedProblemIds: string[] = [];
    const coveredOperationIds: string[] = [];
    for (const impactId of updateImpactIds) {
      const impact = impactMap.get(impactId);
      if (
        !impact ||
        impact.affectedProblemIds.length === 0 ||
        impact.affectedProblemIds.some(
          (problemId) => !update.targetProblemIds.includes(problemId),
        ) ||
        impact.operationIds.length === 0 ||
        impact.operationIds.some((operationId) => !operationIdSet.has(operationId))
      ) {
        throw new ReleaseTransitionError(
          'PUBLICATION_UPDATE_CORRECTION_IMPACT_INVALID',
          `Correction Impact ${impactId} is incomplete or outside the update scope.`,
        );
      }
      impactAffectedProblemIds.push(...impact.affectedProblemIds);
      coveredOperationIds.push(...impact.operationIds);
    }
    if (
      !sameStringSet([...new Set(impactAffectedProblemIds)], update.targetProblemIds) ||
      !sameStringSet([...new Set(coveredOperationIds)], operationIds)
    ) {
      throw new ReleaseTransitionError(
        'PUBLICATION_UPDATE_CORRECTION_IMPACT_INVALID',
        'Correction Impacts must cover every affected Problem and operation exactly.',
      );
    }
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
  readonly workManifestDigest: string;
  readonly catalogContentSnapshotDigest: string;
  readonly contentSubjectDigest: string;
  readonly candidatePayloadDigest: string;
  readonly preJudgmentCheckRefs: readonly unknown[];
  readonly humanContentReviewEvidenceRefs: readonly unknown[];
  readonly blockingFindings: readonly unknown[];
}): string =>
  canonicalDigest({
    workManifestDigest: candidate.workManifestDigest,
    catalogContentSnapshotDigest: candidate.catalogContentSnapshotDigest,
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
          workManifestDigest: candidate.workManifestDigest,
          catalogContentSnapshotDigest: candidate.catalogContentSnapshotDigest,
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
