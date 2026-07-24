import { canonicalDigest } from '../domain/canonical-json.js';

export type IntegrationAction = 'promote' | 'merge' | 'split' | 'retire';
export type TaxonomyEntityKind = 'tag' | 'outcome' | 'unit';
export type TaxonomyReviewMode = 'self' | 'third_party';

export interface IntegrationEntry {
  readonly previewEntityId: string;
  readonly previewEntityKind: TaxonomyEntityKind;
  readonly action: IntegrationAction;
  readonly finalEntityIds: readonly string[];
  readonly affectedProblemIds: readonly string[];
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly aliasOrRedirects: readonly string[];
  readonly correctionImpactId: string;
  readonly reviewMode: TaxonomyReviewMode;
  readonly reviewEvidenceId: string;
  readonly status: 'accepted' | 'proposed' | 'rejected';
}

export interface FinalTaxonomyEntity {
  readonly id: string;
  readonly kind: TaxonomyEntityKind;
  readonly definition: string;
  readonly learningOutcomeIds: readonly string[];
  readonly representativeProblemIds: readonly string[];
  readonly sourceRevisionIds: readonly string[];
}

export interface PrerequisiteEdge {
  readonly nodeId: string;
  readonly prerequisiteId: string;
}

export interface FinalProblemPlacement {
  readonly problemId: string;
  readonly tagIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly learningUnitIds: readonly string[];
}

export interface TaxonomyCorrectionImpact {
  readonly correctionImpactId: string;
  readonly affectedProblemIds: readonly string[];
  readonly affectedSurfaces: readonly string[];
}

export interface TaxonomyReviewEvidence {
  readonly reviewEvidenceId: string;
  readonly subjectDigest: string;
  readonly requiredMode: TaxonomyReviewMode;
  readonly reviewMode: TaxonomyReviewMode;
  readonly aggregatePassed: boolean;
}

export interface FinalTaxonomyBuildInput {
  readonly inventoryDigest: string;
  readonly previewSnapshotDigest: string;
  readonly policy: {
    readonly name: string;
    readonly version: string;
    readonly inputScope: string;
    readonly requiredReviewMode: TaxonomyReviewMode;
  };
  readonly integrationEntries: readonly IntegrationEntry[];
  readonly finalEntities: readonly FinalTaxonomyEntity[];
  readonly tagPrerequisites: readonly PrerequisiteEdge[];
  readonly learningUnitPrerequisites: readonly PrerequisiteEdge[];
  readonly standardOrder: readonly string[];
  readonly placements: readonly FinalProblemPlacement[];
  readonly correctionImpacts: readonly TaxonomyCorrectionImpact[];
  readonly sourceRevisionIds: readonly string[];
  readonly reviewEvidence: readonly TaxonomyReviewEvidence[];
  readonly status: 'accepted' | 'proposed' | 'rejected';
  readonly acceptedAt: string | null;
}

export interface FinalTaxonomyBuild extends FinalTaxonomyBuildInput {
  readonly integrationMapDigest: string;
  readonly taxonomyDigest: string;
  readonly tagDagDigest: string;
  readonly learningUnitDagDigest: string;
  readonly orderDigest: string;
  readonly placementDigest: string;
  readonly correctionImpactDigest: string;
  readonly buildDigest: string;
}

export interface PreviewTaxonomyEntity {
  readonly id: string;
  readonly kind: TaxonomyEntityKind;
  readonly referencedProblemIds: readonly string[];
}

export interface TaxonomyValidationContext {
  readonly previewEntities: readonly PreviewTaxonomyEntity[];
  readonly inventoryProblemIds: readonly string[];
  readonly passedPreviewSnapshotDigests: readonly string[];
  readonly knownSourceRevisionIds: readonly string[];
}

export type FinalTaxonomyReviewSubject = Omit<
  FinalTaxonomyBuildInput,
  'reviewEvidence' | 'status' | 'acceptedAt'
>;

export const taxonomyReviewSubject = (
  build: FinalTaxonomyBuildInput | FinalTaxonomyBuild | FinalTaxonomyReviewSubject,
): FinalTaxonomyReviewSubject => ({
  inventoryDigest: build.inventoryDigest,
  previewSnapshotDigest: build.previewSnapshotDigest,
  policy: build.policy,
  integrationEntries: build.integrationEntries,
  finalEntities: build.finalEntities,
  tagPrerequisites: build.tagPrerequisites,
  learningUnitPrerequisites: build.learningUnitPrerequisites,
  standardOrder: build.standardOrder,
  placements: build.placements,
  correctionImpacts: build.correctionImpacts,
  sourceRevisionIds: build.sourceRevisionIds,
});

export const taxonomyReviewSubjectDigest = (
  build: FinalTaxonomyBuildInput | FinalTaxonomyBuild | FinalTaxonomyReviewSubject,
): string => canonicalDigest(taxonomyReviewSubject(build));

const buildDigests = (build: FinalTaxonomyBuildInput) => ({
  integrationMapDigest: canonicalDigest(build.integrationEntries),
  taxonomyDigest: canonicalDigest(build.finalEntities),
  tagDagDigest: canonicalDigest(build.tagPrerequisites),
  learningUnitDagDigest: canonicalDigest(build.learningUnitPrerequisites),
  orderDigest: canonicalDigest(build.standardOrder),
  placementDigest: canonicalDigest(build.placements),
  correctionImpactDigest: canonicalDigest(build.correctionImpacts),
});

const requiredReviewMode = (build: FinalTaxonomyBuildInput): TaxonomyReviewMode =>
  build.integrationEntries.some(({ action }) => action === 'split')
    ? 'third_party'
    : build.policy.requiredReviewMode;

export const finalTaxonomyBuildDigest = (build: Omit<FinalTaxonomyBuild, 'buildDigest'>): string =>
  canonicalDigest(build);

export const createFinalTaxonomyBuild = (input: FinalTaxonomyBuildInput): FinalTaxonomyBuild => {
  const digests = buildDigests(input);
  const subject = { ...input, ...digests };
  return { ...subject, buildDigest: finalTaxonomyBuildDigest(subject) };
};

const sameSet = (left: readonly string[], right: readonly string[]): boolean => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === left.length &&
    rightSet.size === right.length &&
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
};

const graphHasCycle = (nodeIds: readonly string[], edges: readonly PrerequisiteEdge[]): boolean => {
  const prerequisites = new Map(nodeIds.map((id) => [id, [] as string[]]));
  for (const edge of edges) prerequisites.get(edge.nodeId)?.push(edge.prerequisiteId);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    if ((prerequisites.get(id) ?? []).some(visit)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  return nodeIds.some(visit);
};

const graphViolations = (
  label: 'tag' | 'learning_unit',
  nodeIds: readonly string[],
  edges: readonly PrerequisiteEdge[],
): string[] => {
  if (
    new Set(nodeIds).size !== nodeIds.length ||
    edges.some(
      ({ nodeId, prerequisiteId }) =>
        !nodeIds.includes(nodeId) || !nodeIds.includes(prerequisiteId),
    )
  ) {
    return [`${label}_dag_unknown_reference`];
  }
  return graphHasCycle(nodeIds, edges) ? [`${label}_dag_cycle`] : [];
};

/** Validate the complete, accepted boundary consumed by canonical materialization. */
export const validateTaxonomyIntegration = (
  context: TaxonomyValidationContext,
  build: FinalTaxonomyBuild,
): string[] => {
  const violations: string[] = [];
  const previewEntitiesById = new Map(context.previewEntities.map((entity) => [entity.id, entity]));
  const requiredMode = requiredReviewMode(build);
  const finalEntityIds = build.finalEntities.map(({ id }) => id);
  const tagIds = build.finalEntities.filter(({ kind }) => kind === 'tag').map(({ id }) => id);
  const outcomeIds = build.finalEntities
    .filter(({ kind }) => kind === 'outcome')
    .map(({ id }) => id);
  const unitIds = build.finalEntities.filter(({ kind }) => kind === 'unit').map(({ id }) => id);

  if (!context.passedPreviewSnapshotDigests.includes(build.previewSnapshotDigest)) {
    violations.push('preview_snapshot_not_passed');
  }

  const mappedIds = build.integrationEntries.map(({ previewEntityId }) => previewEntityId);
  const previewEntityIds = context.previewEntities.map(({ id }) => id);
  if (!sameSet(mappedIds, previewEntityIds)) {
    violations.push('integration_mapping_incomplete');
  }
  if (build.policy.requiredReviewMode !== requiredMode) {
    violations.push('taxonomy_review_policy_insufficient');
  }
  for (const entry of build.integrationEntries) {
    const previewEntity = previewEntitiesById.get(entry.previewEntityId);
    const validFinalEntityCount =
      entry.action === 'retire'
        ? entry.finalEntityIds.length === 0
        : entry.action === 'split'
          ? entry.finalEntityIds.length >= 2
          : entry.finalEntityIds.length === 1;
    if (!validFinalEntityCount) {
      violations.push(`invalid_action_cardinality:${entry.previewEntityId}`);
    }
    if (
      entry.status !== 'accepted' ||
      entry.rationale.trim().length === 0 ||
      entry.evidenceIds.length === 0 ||
      entry.correctionImpactId.trim().length === 0
    ) {
      violations.push(`integration_evidence_missing:${entry.previewEntityId}`);
    }
    if (entry.finalEntityIds.some((id) => !finalEntityIds.includes(id))) {
      violations.push(`final_entity_missing:${entry.previewEntityId}`);
    }
    if (previewEntity && entry.previewEntityKind !== previewEntity.kind) {
      violations.push(`preview_entity_kind_mismatch:${entry.previewEntityId}`);
    }
    if (previewEntity && !sameSet(entry.affectedProblemIds, previewEntity.referencedProblemIds)) {
      violations.push(`affected_problem_scope_mismatch:${entry.previewEntityId}`);
    }
    if (entry.affectedProblemIds.some((id) => !context.inventoryProblemIds.includes(id))) {
      violations.push(`unknown_affected_problem:${entry.previewEntityId}`);
    }
    if (entry.reviewMode !== requiredMode) {
      violations.push(`integration_review_mode_insufficient:${entry.previewEntityId}`);
    }
    if (previewEntity && entry.action !== 'retire') {
      for (const finalEntityId of entry.finalEntityIds) {
        const finalEntity = build.finalEntities.find(({ id }) => id === finalEntityId);
        if (finalEntity && finalEntity.kind !== previewEntity.kind) {
          violations.push(`final_entity_kind_mismatch:${entry.previewEntityId}`);
          break;
        }
      }
    }
    const review = build.reviewEvidence.find(
      ({ reviewEvidenceId }) => reviewEvidenceId === entry.reviewEvidenceId,
    );
    const reviewMode = review?.reviewMode;
    const reviewRequiredMode = review?.requiredMode;
    const reviewPassed = review?.aggregatePassed;
    if (
      reviewMode !== entry.reviewMode ||
      reviewRequiredMode !== requiredMode ||
      reviewMode !== requiredMode ||
      !reviewPassed
    ) {
      violations.push(`integration_review_missing:${entry.previewEntityId}`);
    }
  }

  for (const previewEntity of context.previewEntities) {
    if (
      previewEntity.referencedProblemIds.some((id) => !context.inventoryProblemIds.includes(id))
    ) {
      violations.push(`unknown_preview_problem:${previewEntity.id}`);
    }
  }

  if (
    new Set(finalEntityIds).size !== finalEntityIds.length ||
    finalEntityIds.some((id) => /^(?:preview|provisional)-/u.test(id))
  ) {
    violations.push('final_taxonomy_not_deduplicated');
  }
  for (const entity of build.finalEntities) {
    if (
      entity.definition.trim().length === 0 ||
      entity.representativeProblemIds.length === 0 ||
      entity.representativeProblemIds.some((id) => !context.inventoryProblemIds.includes(id)) ||
      entity.sourceRevisionIds.length === 0 ||
      entity.sourceRevisionIds.some((id) => !build.sourceRevisionIds.includes(id))
    ) {
      violations.push(`final_entity_incomplete:${entity.id}`);
    }
    if (entity.learningOutcomeIds.some((id) => !outcomeIds.includes(id))) {
      violations.push(`final_entity_unknown_outcome:${entity.id}`);
    }
  }

  violations.push(
    ...graphViolations('tag', tagIds, build.tagPrerequisites),
    ...graphViolations('learning_unit', unitIds, build.learningUnitPrerequisites),
  );
  const orderIndex = new Map(build.standardOrder.map((id, index) => [id, index]));
  if (
    !sameSet(build.standardOrder, unitIds) ||
    build.learningUnitPrerequisites.some(
      ({ nodeId, prerequisiteId }) =>
        (orderIndex.get(prerequisiteId) ?? Number.POSITIVE_INFINITY) >=
        (orderIndex.get(nodeId) ?? Number.NEGATIVE_INFINITY),
    )
  ) {
    violations.push('standard_order_stale');
  }

  const placementProblemIds = build.placements.map(({ problemId }) => problemId);
  if (!sameSet(placementProblemIds, context.inventoryProblemIds)) {
    violations.push('placement_reachability_incomplete');
  }
  for (const placement of build.placements) {
    if (
      placement.tagIds.length === 0 ||
      placement.outcomeIds.length === 0 ||
      placement.learningUnitIds.length === 0 ||
      placement.tagIds.some((id) => !tagIds.includes(id)) ||
      placement.outcomeIds.some((id) => !outcomeIds.includes(id)) ||
      placement.learningUnitIds.some((id) => !unitIds.includes(id))
    ) {
      violations.push(`placement_reference_invalid:${placement.problemId}`);
    }
  }

  const impactIds = build.correctionImpacts.map(({ correctionImpactId }) => correctionImpactId);
  if (
    !sameSet(
      impactIds,
      build.integrationEntries.map(({ correctionImpactId }) => correctionImpactId),
    )
  ) {
    violations.push('correction_impact_incomplete');
  }
  for (const impact of build.correctionImpacts) {
    if (
      impact.affectedSurfaces.length === 0 ||
      impact.affectedProblemIds.some((id) => !context.inventoryProblemIds.includes(id))
    ) {
      violations.push(`correction_impact_invalid:${impact.correctionImpactId}`);
    }
    const entry = build.integrationEntries.find(
      ({ correctionImpactId }) => correctionImpactId === impact.correctionImpactId,
    );
    if (entry && !sameSet(impact.affectedProblemIds, entry.affectedProblemIds)) {
      violations.push(`correction_impact_scope_mismatch:${impact.correctionImpactId}`);
    }
  }

  if (!sameSet(build.sourceRevisionIds, context.knownSourceRevisionIds)) {
    violations.push('source_revisions_stale');
  }
  const reviewSubjectDigest = taxonomyReviewSubjectDigest(build);
  if (
    build.reviewEvidence.length === 0 ||
    build.reviewEvidence.some(
      (evidence) =>
        evidence.subjectDigest !== reviewSubjectDigest ||
        evidence.requiredMode !== requiredMode ||
        evidence.reviewMode !== requiredMode ||
        !evidence.aggregatePassed,
    )
  ) {
    violations.push('current_subject_review_missing');
  }

  if (build.status !== 'accepted' || build.acceptedAt === null) {
    violations.push('final_taxonomy_not_accepted');
  }

  const expectedDigests = buildDigests(build);
  for (const [field, expected] of Object.entries(expectedDigests)) {
    if (build[field as keyof typeof expectedDigests] !== expected) {
      violations.push(`${field.replace(/[A-Z]/gu, (value) => `_${value.toLowerCase()}`)}_stale`);
    }
  }
  const { buildDigest, ...buildSubject } = build;
  if (buildDigest !== finalTaxonomyBuildDigest(buildSubject)) {
    violations.push('final_taxonomy_build_digest_stale');
  }
  return violations;
};
