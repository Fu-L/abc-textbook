import { PublicationUpdateSchema } from '../domain/schema-parts/release.js';

export class PublicationUpdateError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'PublicationUpdateError';
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
    readonly affectedEntities: readonly {
      readonly entityType: string;
      readonly entityId: string;
      readonly action: 'add' | 'replace' | 'remove';
    }[];
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

const sameStringSet = (left: readonly string[], right: readonly string[]): boolean => {
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return (
    sortedLeft.length === sortedRight.length &&
    sortedLeft.every((item, index) => item === sortedRight[index])
  );
};

const entityDiffKey = (diff: {
  readonly entityType: string;
  readonly entityId: string;
  readonly action: string;
}): string => `${diff.entityType}\u0000${diff.entityId}\u0000${diff.action}`;

const sameEntityDiffSet = (
  left: readonly {
    readonly entityType: string;
    readonly entityId: string;
    readonly action: string;
  }[],
  right: readonly {
    readonly entityType: string;
    readonly entityId: string;
    readonly action: string;
  }[],
): boolean => sameStringSet(left.map(entityDiffKey), right.map(entityDiffKey));

export const validatePublicationUpdate = (
  value: unknown,
  trusted?: TrustedPublicationUpdateContext,
): void => {
  const result = PublicationUpdateSchema.safeParse(value);
  if (!result.success) {
    throw new PublicationUpdateError('PUBLICATION_UPDATE_INVALID', result.error.message);
  }
  if (!trusted) {
    throw new PublicationUpdateError(
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
    throw new PublicationUpdateError(
      'PUBLICATION_UPDATE_OWNERSHIP_INVALID',
      'Trusted operation inventory does not exactly cover this update.',
    );
  }
  for (const operation of update.operations) {
    const expected = trustedOperations.get(operation.operationId);
    if (
      !expected ||
      !sameStringSet(operation.affectedProblemIds, expected.affectedProblemIds) ||
      !sameEntityDiffSet(operation.affectedEntities, expected.affectedEntities)
    ) {
      throw new PublicationUpdateError(
        'PUBLICATION_UPDATE_OWNERSHIP_INVALID',
        `Operation ${operation.operationId} does not match trusted Problem or entity ownership.`,
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
      throw new PublicationUpdateError(
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
      throw new PublicationUpdateError(
        'PUBLICATION_UPDATE_DIFF_INVALID',
        'Trusted publication file inventories must contain unique paths.',
      );
    }
    for (const operation of update.operations) {
      const expected = trustedOperations.get(operation.operationId);
      if (expected?.path === undefined) {
        throw new PublicationUpdateError(
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
        throw new PublicationUpdateError(
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
        throw new PublicationUpdateError(
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
    throw new PublicationUpdateError(
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
      throw new PublicationUpdateError(
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
        throw new PublicationUpdateError(
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
      throw new PublicationUpdateError(
        'PUBLICATION_UPDATE_CORRECTION_IMPACT_INVALID',
        'Correction Impacts must cover every affected Problem and operation exactly.',
      );
    }
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
    throw new PublicationUpdateError('REVIEW_INCOMPLETE', 'Current review evidence is incomplete.');
  }
};
