import { canonicalDigest, canonicalJson, digestWithoutField } from '../domain/canonical-json.js';
import { ContentWorkManifestSchema } from '../domain/schema-parts/review-evidence.js';
import { deterministicTopologicalOrder } from './validate.js';

export class WorkManifestError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'WorkManifestError';
  }
}

export interface WorkManifestReviewUnitInput {
  readonly unitId: string;
  readonly paths: readonly string[];
  readonly itemIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly dependencyUnitIds: readonly string[];
  readonly checkIds: readonly string[];
  readonly evidenceRole: string;
  readonly ownerId: string;
}

export interface ContentReviewPolicy {
  readonly requiredMode: 'self' | 'third_party';
  readonly riskReasons: readonly string[];
}

export interface ManifestReviewUnit {
  readonly reviewUnitId: string;
  readonly changeKind: string;
  readonly paths: readonly string[];
  readonly itemIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly dependencyReviewUnitIds: readonly string[];
  readonly checkIds: readonly string[];
  readonly evidenceRoles: readonly string[];
  readonly maintenanceBenefit: string | null;
  readonly owner: string;
}

/**
 * Trusted scope captured before implementation starts.  A manifest's own
 * scopeDigest proves internal consistency, but it cannot prove that a caller
 * has not replaced both the scope and its digest.  Validators that cross a
 * trust boundary should pass this independently captured projection.
 */
export interface ContentWorkManifestScope {
  readonly taskId: string;
  readonly requiredRequirementIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly reviewPolicy: ContentReviewPolicy;
  readonly reviewUnits: readonly ManifestReviewUnit[];
}

const sortedUnique = (values: readonly string[]): string[] => [...values].sort();

const scopeProjection = (input: ContentWorkManifestScope): Readonly<Record<string, unknown>> => ({
  taskId: input.taskId,
  requiredRequirementIds: sortedUnique(input.requiredRequirementIds),
  learningOutcomeIds: sortedUnique(input.learningOutcomeIds),
  reviewPolicy: {
    requiredMode: input.reviewPolicy.requiredMode,
    riskReasons: sortedUnique(input.reviewPolicy.riskReasons),
  },
  reviewUnits: input.reviewUnits
    .map((unit) => ({
      reviewUnitId: unit.reviewUnitId,
      changeKind: unit.changeKind,
      paths: sortedUnique(unit.paths),
      itemIds: sortedUnique(unit.itemIds),
      requirementIds: sortedUnique(unit.requirementIds),
      learningOutcomeIds: sortedUnique(unit.learningOutcomeIds),
      dependencyReviewUnitIds: sortedUnique(unit.dependencyReviewUnitIds),
      checkIds: sortedUnique(unit.checkIds),
      evidenceRoles: sortedUnique(unit.evidenceRoles),
      maintenanceBenefit: unit.maintenanceBenefit,
      owner: unit.owner,
    }))
    .sort((left, right) => left.reviewUnitId.localeCompare(right.reviewUnitId)),
});

export const calculateContentWorkManifestScopeDigest = (scope: ContentWorkManifestScope): string =>
  canonicalDigest(scopeProjection(scope));

export const createContentWorkManifest = (input: {
  readonly manifestId: string;
  readonly taskId: string;
  readonly changeKind: string;
  readonly requiredRequirementIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly reviewPolicy?: ContentReviewPolicy;
  readonly reviewUnits: readonly WorkManifestReviewUnitInput[];
  readonly maintenanceBenefit: string | null;
  readonly createdAt: string;
}): Readonly<Record<string, unknown>> => {
  const outcomeImpact = {
    kind: input.learningOutcomeIds.length > 0 ? 'affects_learning_outcomes' : 'none',
    rationale:
      input.learningOutcomeIds.length > 0
        ? 'The declared review units change observable learning outcomes.'
        : 'The change is infrastructure-only and does not alter learner-visible outcomes.',
  };
  const reviewPolicy = input.reviewPolicy ?? { requiredMode: 'self', riskReasons: [] };
  const scope: ContentWorkManifestScope = {
    taskId: input.taskId,
    requiredRequirementIds: [...input.requiredRequirementIds].sort(),
    learningOutcomeIds: [...input.learningOutcomeIds].sort(),
    reviewPolicy,
    reviewUnits: input.reviewUnits.map((unit) => ({
      reviewUnitId: unit.unitId,
      changeKind: input.changeKind,
      paths: [...unit.paths].sort(),
      itemIds: [...unit.itemIds].sort(),
      requirementIds: [...unit.requirementIds].sort(),
      learningOutcomeIds: [...unit.learningOutcomeIds].sort(),
      outcomeImpact:
        unit.learningOutcomeIds.length > 0
          ? outcomeImpact
          : {
              kind: 'none',
              rationale: 'This review unit does not alter an observable learning outcome.',
            },
      dependencyReviewUnitIds: [...unit.dependencyUnitIds].sort(),
      checkIds: [...unit.checkIds].sort(),
      evidenceRoles: [unit.evidenceRole],
      maintenanceBenefit: input.maintenanceBenefit,
      owner: unit.ownerId,
      status: 'planned',
    })),
  };
  const manifest: Record<string, unknown> = {
    schemaVersion: '2.0.0',
    manifestId: input.manifestId,
    taskId: input.taskId,
    scopeDigest: calculateContentWorkManifestScopeDigest(scope),
    digest: '',
    changeKind: input.changeKind,
    requiredRequirementIds: scope.requiredRequirementIds,
    learningOutcomeIds: scope.learningOutcomeIds,
    outcomeImpact,
    reviewPolicy: scope.reviewPolicy,
    reviewUnits: scope.reviewUnits,
    maintenanceBenefit: input.maintenanceBenefit,
    state: 'planned',
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  };
  manifest.digest = digestWithoutField(manifest, 'digest');
  validateContentWorkManifest(manifest, scope);
  return Object.freeze(manifest);
};

export const validateContentWorkManifest = (
  value: unknown,
  trustedScope?: ContentWorkManifestScope,
): void => {
  const parsed = ContentWorkManifestSchema.safeParse(value);
  if (!parsed.success) {
    throw new WorkManifestError('WORK_MANIFEST_SCHEMA_INVALID', parsed.error.message);
  }
  const manifest = value as {
    readonly taskId: string;
    readonly scopeDigest: string;
    readonly digest: string;
    readonly requiredRequirementIds: readonly string[];
    readonly learningOutcomeIds: readonly string[];
    readonly reviewPolicy: ContentReviewPolicy;
    readonly outcomeImpact: { readonly kind: string };
    readonly reviewUnits: readonly {
      readonly reviewUnitId: string;
      readonly changeKind: string;
      readonly paths: readonly string[];
      readonly itemIds: readonly string[];
      readonly requirementIds: readonly string[];
      readonly learningOutcomeIds: readonly string[];
      readonly dependencyReviewUnitIds: readonly string[];
      readonly checkIds: readonly string[];
      readonly evidenceRoles: readonly string[];
      readonly maintenanceBenefit: string | null;
      readonly owner: string;
    }[];
  };
  if (digestWithoutField(value as Record<string, unknown>, 'digest') !== manifest.digest) {
    throw new WorkManifestError('WORK_MANIFEST_DIGEST_MISMATCH', 'Manifest digest is stale.');
  }
  const manifestScope = scopeProjection(manifest);
  const expectedScope = trustedScope ? scopeProjection(trustedScope) : manifestScope;
  if (
    calculateContentWorkManifestScopeDigest(manifest) !== manifest.scopeDigest ||
    (trustedScope !== undefined &&
      (manifest.scopeDigest !== canonicalDigest(expectedScope) ||
        canonicalJson(manifestScope) !== canonicalJson(expectedScope)))
  ) {
    throw new WorkManifestError('WORK_MANIFEST_SCOPE_DIGEST_MISMATCH', 'Manifest scope is stale.');
  }

  const knownOutcomes = new Set(manifest.learningOutcomeIds);
  const requiredRequirements = new Set(manifest.requiredRequirementIds);
  const unitIds = new Set(manifest.reviewUnits.map(({ reviewUnitId }) => reviewUnitId));
  if (unitIds.size !== manifest.reviewUnits.length) {
    throw new WorkManifestError('DUPLICATE_REVIEW_UNIT_ID', 'Review unit IDs must be unique.');
  }
  const ownedPaths = new Map<string, string>();
  const ownedItems = new Map<string, string>();
  const ownedOutcomes = new Map<string, string>();
  const assignedRequirements = new Set<string>();
  for (const unit of manifest.reviewUnits) {
    for (const outcomeId of unit.learningOutcomeIds) {
      if (!knownOutcomes.has(outcomeId)) {
        throw new WorkManifestError(
          'OUTCOME_SCOPE_MISMATCH',
          `${unit.reviewUnitId} references undeclared ${outcomeId}.`,
        );
      }
      const previous = ownedOutcomes.get(outcomeId);
      if (previous) {
        throw new WorkManifestError(
          'OVERLAPPING_REVIEW_UNIT_OUTCOME',
          `${outcomeId} is owned by ${previous} and ${unit.reviewUnitId}.`,
        );
      }
      ownedOutcomes.set(outcomeId, unit.reviewUnitId);
    }
    for (const requirementId of unit.requirementIds) {
      if (!requiredRequirements.has(requirementId)) {
        throw new WorkManifestError(
          'REQUIREMENT_SCOPE_MISMATCH',
          `${unit.reviewUnitId} references undeclared ${requirementId}.`,
        );
      }
      assignedRequirements.add(requirementId);
    }
    for (const dependencyId of unit.dependencyReviewUnitIds) {
      if (!unitIds.has(dependencyId) || dependencyId === unit.reviewUnitId) {
        throw new WorkManifestError('INVALID_REVIEW_UNIT_DEPENDENCY', dependencyId);
      }
    }
    for (const path of unit.paths) {
      const previous = ownedPaths.get(path);
      if (previous) {
        throw new WorkManifestError(
          'OVERLAPPING_REVIEW_UNIT_PATH',
          `${path} is owned by ${previous} and ${unit.reviewUnitId}.`,
        );
      }
      ownedPaths.set(path, unit.reviewUnitId);
    }
    for (const itemId of unit.itemIds) {
      const previous = ownedItems.get(itemId);
      if (previous) {
        throw new WorkManifestError(
          'OVERLAPPING_REVIEW_UNIT_ITEM',
          `${itemId} is owned by ${previous} and ${unit.reviewUnitId}.`,
        );
      }
      ownedItems.set(itemId, unit.reviewUnitId);
    }
  }
  if (
    assignedRequirements.size !== requiredRequirements.size ||
    [...requiredRequirements].some((requirementId) => !assignedRequirements.has(requirementId))
  ) {
    throw new WorkManifestError(
      'REQUIREMENT_SCOPE_MISMATCH',
      'Review units do not cover the complete required requirement set.',
    );
  }
  if (
    ownedOutcomes.size !== knownOutcomes.size ||
    [...knownOutcomes].some((outcomeId) => !ownedOutcomes.has(outcomeId))
  ) {
    throw new WorkManifestError(
      'OUTCOME_SCOPE_MISMATCH',
      'Review units must own every declared learning outcome exactly once.',
    );
  }
  try {
    deterministicTopologicalOrder(
      manifest.reviewUnits.map((unit) => ({
        id: unit.reviewUnitId,
        prerequisiteIds: unit.dependencyReviewUnitIds,
      })),
    );
  } catch (error) {
    throw new WorkManifestError(
      'INVALID_REVIEW_UNIT_DEPENDENCY',
      error instanceof Error ? error.message : String(error),
    );
  }
  if (manifest.outcomeImpact.kind === 'affects_learning_outcomes' && knownOutcomes.size === 0) {
    throw new WorkManifestError('OUTCOME_SCOPE_EMPTY', 'Outcome-changing work must name outcomes.');
  }
};
