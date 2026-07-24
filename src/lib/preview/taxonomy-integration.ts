import { canonicalDigest } from '../domain/canonical-json.js';
import {
  LearningOutcomeSchema,
  LearningUnitSchema,
  ProblemPlacementSchema,
  TechniqueTagSchema,
} from '../domain/schema-parts/catalog.js';
import { DependencyCycleError, deterministicTopologicalOrder } from '../validation/validate.js';
import type { z } from 'zod';

export type IntegrationAction = 'promote' | 'merge' | 'split' | 'retire';
export type TaxonomyEntityKind = 'tag' | 'outcome' | 'unit';
export type TaxonomyReviewMode = 'self' | 'third_party';

export interface SplitProblemAssignment {
  readonly finalEntityId: string;
  readonly problemIds: readonly string[];
}

export interface IntegrationEntry {
  readonly previewEntityId: string;
  readonly previewEntityKind: TaxonomyEntityKind;
  readonly action: IntegrationAction;
  readonly finalEntityIds: readonly string[];
  readonly affectedProblemIds: readonly string[];
  /** Required for split entries; empty for promote, merge, and retire. */
  readonly splitProblemAssignments: readonly SplitProblemAssignment[];
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly aliasOrRedirects: readonly string[];
  readonly correctionImpactId: string;
  readonly reviewMode: TaxonomyReviewMode;
  readonly reviewEvidenceId: string;
  readonly status: 'accepted' | 'proposed' | 'rejected';
}

type TechniqueTag = z.infer<typeof TechniqueTagSchema>;
type LearningOutcome = z.infer<typeof LearningOutcomeSchema>;
type LearningUnit = z.infer<typeof LearningUnitSchema>;
type ProblemPlacement = z.infer<typeof ProblemPlacementSchema>;

/**
 * The outer `kind` is the taxonomy namespace. The nested value is the exact
 * canonical entity shape so accepted builds cannot silently materialize a
 * reduced preview-only projection.
 */
export type FinalTaxonomyEntity =
  | {
      readonly kind: 'tag';
      readonly entity: TechniqueTag;
      readonly sourceRevisionIds: readonly string[];
    }
  | {
      readonly kind: 'outcome';
      readonly entity: LearningOutcome;
      readonly sourceRevisionIds: readonly string[];
    }
  | {
      readonly kind: 'unit';
      readonly entity: LearningUnit;
      readonly sourceRevisionIds: readonly string[];
    };

/** Canonical ProblemPlacement plus the taxonomy reachability projections. */
export type FinalProblemPlacement = ProblemPlacement & {
  readonly tagIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly learningUnitIds: readonly string[];
};

export interface PrerequisiteEdge {
  readonly nodeId: string;
  readonly prerequisiteId: string;
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
  /** Digest frozen after the complete Technique Inventory join. */
  readonly inventoryDigest: string;
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

export const finalTaxonomyEntityId = (entity: FinalTaxonomyEntity): string => entity.entity.id;

const finalTaxonomyEntityIds = (entities: readonly FinalTaxonomyEntity[]): string[] =>
  entities.map(finalTaxonomyEntityId);

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

const edgeKey = ({ nodeId, prerequisiteId }: PrerequisiteEdge): string =>
  `${nodeId}\u0000${prerequisiteId}`;

const sameEdgeSet = (
  left: readonly PrerequisiteEdge[],
  right: readonly PrerequisiteEdge[],
): boolean => sameSet(left.map(edgeKey), right.map(edgeKey));

const finalEntitySchemaResult = (entity: FinalTaxonomyEntity) => {
  switch (entity.kind) {
    case 'tag':
      return TechniqueTagSchema.safeParse(entity.entity);
    case 'outcome':
      return LearningOutcomeSchema.safeParse(entity.entity);
    case 'unit':
      return LearningUnitSchema.safeParse(entity.entity);
  }
};

const requireKnownReferences = (
  violations: string[],
  ownerId: string,
  field: string,
  references: readonly string[],
  knownIds: ReadonlySet<string>,
): void => {
  for (const reference of references) {
    if (!knownIds.has(reference)) {
      violations.push(`final_entity_unknown_reference:${ownerId}:${field}:${reference}`);
    }
  }
};

const sameOrderedValues = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const graphViolations = (
  label: string,
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
    return [`${label}_unknown_reference`];
  }
  const nodes = nodeIds.map((id) => ({
    id,
    prerequisiteIds: edges
      .filter((edge) => edge.nodeId === id)
      .map(({ prerequisiteId }) => prerequisiteId),
  }));
  try {
    deterministicTopologicalOrder(nodes);
    return [];
  } catch (error) {
    return [
      error instanceof DependencyCycleError ? `${label}_cycle` : `${label}_unknown_reference`,
    ];
  }
};

/** Validate the complete, accepted boundary consumed by canonical materialization. */
export const validateTaxonomyIntegration = (
  context: TaxonomyValidationContext,
  build: FinalTaxonomyBuild,
): string[] => {
  const violations: string[] = [];
  const previewEntitiesById = new Map(context.previewEntities.map((entity) => [entity.id, entity]));
  const requiredMode = requiredReviewMode(build);
  const finalEntityIds = finalTaxonomyEntityIds(build.finalEntities);
  const tagIds = build.finalEntities
    .filter(({ kind }) => kind === 'tag')
    .map(finalTaxonomyEntityId);
  const outcomeIds = build.finalEntities
    .filter(({ kind }) => kind === 'outcome')
    .map(finalTaxonomyEntityId);
  const unitIds = build.finalEntities
    .filter(({ kind }) => kind === 'unit')
    .map(finalTaxonomyEntityId);
  const tagIdsSet = new Set(tagIds);
  const outcomeIdsSet = new Set(outcomeIds);
  const unitIdsSet = new Set(unitIds);
  const problemIdsSet = new Set(context.inventoryProblemIds);
  const sourceRevisionIdsSet = new Set(build.sourceRevisionIds);

  if (!context.passedPreviewSnapshotDigests.includes(build.previewSnapshotDigest)) {
    violations.push('preview_snapshot_not_passed');
  }
  if (build.inventoryDigest !== context.inventoryDigest) {
    violations.push('inventory_digest_stale');
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
    if (entry.action !== 'split' && entry.splitProblemAssignments.length > 0) {
      violations.push(`split_assignments_unexpected:${entry.previewEntityId}`);
    }
    if (entry.action === 'split') {
      const assignedFinalEntityIds = entry.splitProblemAssignments.map(
        ({ finalEntityId }) => finalEntityId,
      );
      const assignedProblemIds = entry.splitProblemAssignments.flatMap(
        ({ problemIds }) => problemIds,
      );
      if (
        !sameSet(assignedFinalEntityIds, entry.finalEntityIds) ||
        !sameSet(assignedProblemIds, entry.affectedProblemIds) ||
        entry.splitProblemAssignments.some(({ problemIds }) => problemIds.length === 0)
      ) {
        violations.push(`split_assignments_incomplete:${entry.previewEntityId}`);
      }
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
        const finalEntity = build.finalEntities.find(
          (candidate) => finalTaxonomyEntityId(candidate) === finalEntityId,
        );
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
    const entityId = finalTaxonomyEntityId(entity);
    const schemaResult = finalEntitySchemaResult(entity);
    if (!schemaResult.success) {
      violations.push(`final_entity_schema_invalid:${entityId}`);
      continue;
    }
    if (
      entity.sourceRevisionIds.length === 0 ||
      new Set(entity.sourceRevisionIds).size !== entity.sourceRevisionIds.length ||
      entity.sourceRevisionIds.some((id) => !sourceRevisionIdsSet.has(id))
    ) {
      violations.push(`final_entity_incomplete:${entityId}`);
    }
    if (entity.kind === 'tag') {
      const tagResult = TechniqueTagSchema.safeParse(entity.entity);
      if (!tagResult.success) continue;
      const tag = tagResult.data;
      requireKnownReferences(
        violations,
        entityId,
        'parentId',
        tag.parentId === null ? [] : [tag.parentId],
        tagIdsSet,
      );
      requireKnownReferences(
        violations,
        entityId,
        'prerequisiteTagIds',
        tag.prerequisiteTagIds,
        tagIdsSet,
      );
      requireKnownReferences(
        violations,
        entityId,
        'replacementTagIds',
        tag.replacementTagIds,
        tagIdsSet,
      );
      if (tag.learningOutcomeIds.some((id) => !outcomeIdsSet.has(id))) {
        violations.push(`final_entity_unknown_outcome:${entityId}`);
      }
      if (tag.representativeProblemIds.some((id) => !problemIdsSet.has(id))) {
        violations.push(`final_entity_unknown_problem:${entityId}`);
      }
    } else if (entity.kind === 'outcome') {
      const outcomeResult = LearningOutcomeSchema.safeParse(entity.entity);
      if (!outcomeResult.success) continue;
      const outcome = outcomeResult.data;
      requireKnownReferences(
        violations,
        entityId,
        'prerequisiteOutcomeIds',
        outcome.prerequisiteOutcomeIds,
        outcomeIdsSet,
      );
      requireKnownReferences(
        violations,
        entityId,
        'scopeIds',
        outcome.scopeIds,
        new Set([...tagIds, ...unitIds, ...context.inventoryProblemIds]),
      );
    } else {
      const unitResult = LearningUnitSchema.safeParse(entity.entity);
      if (!unitResult.success) continue;
      const unit = unitResult.data;
      if (!sameSet(unit.sourceRevisionIds, entity.sourceRevisionIds)) {
        violations.push(`final_entity_source_revisions_mismatch:${entityId}`);
      }
      requireKnownReferences(
        violations,
        entityId,
        'parentId',
        unit.parentId === null ? [] : [unit.parentId],
        unitIdsSet,
      );
      requireKnownReferences(
        violations,
        entityId,
        'additionalPrerequisiteUnitIds',
        unit.additionalPrerequisiteUnitIds,
        unitIdsSet,
      );
      requireKnownReferences(violations, entityId, 'tagIds', unit.tagIds, tagIdsSet);
      requireKnownReferences(
        violations,
        entityId,
        'learningOutcomeIds',
        unit.learningOutcomeIds,
        outcomeIdsSet,
      );
      requireKnownReferences(violations, entityId, 'problemIds', unit.problemIds, problemIdsSet);
      for (const example of unit.examples) {
        requireKnownReferences(
          violations,
          `${entityId}:${example.key}`,
          'learningOutcomeIds',
          example.learningOutcomeIds,
          outcomeIdsSet,
        );
      }
      for (const exercise of unit.exercises) {
        requireKnownReferences(
          violations,
          `${entityId}:${exercise.key}`,
          'learningOutcomeIds',
          exercise.learningOutcomeIds,
          outcomeIdsSet,
        );
      }
    }
  }

  const parsedTags = build.finalEntities
    .filter(
      (entity): entity is Extract<FinalTaxonomyEntity, { kind: 'tag' }> => entity.kind === 'tag',
    )
    .flatMap(({ entity }) => {
      const parsed = TechniqueTagSchema.safeParse(entity);
      return parsed.success ? [parsed.data] : [];
    });
  const parsedOutcomes = build.finalEntities
    .filter(
      (entity): entity is Extract<FinalTaxonomyEntity, { kind: 'outcome' }> =>
        entity.kind === 'outcome',
    )
    .flatMap(({ entity }) => {
      const parsed = LearningOutcomeSchema.safeParse(entity);
      return parsed.success ? [parsed.data] : [];
    });
  const parsedLearningUnits = build.finalEntities
    .filter(
      (entity): entity is Extract<FinalTaxonomyEntity, { kind: 'unit' }> => entity.kind === 'unit',
    )
    .flatMap(({ entity }) => {
      const parsed = LearningUnitSchema.safeParse(entity);
      return parsed.success ? [parsed.data] : [];
    });

  const expectedTagPrerequisites = parsedTags.flatMap((tag) =>
    tag.prerequisiteTagIds.map((prerequisiteId) => ({
      nodeId: tag.id,
      prerequisiteId,
    })),
  );
  if (!sameEdgeSet(build.tagPrerequisites, expectedTagPrerequisites)) {
    violations.push('tag_dag_not_materialized_from_entities');
  }
  const expectedLearningUnitPrerequisites = parsedLearningUnits.flatMap((unit) =>
    unit.additionalPrerequisiteUnitIds.map((prerequisiteId) => ({
      nodeId: unit.id,
      prerequisiteId,
    })),
  );
  if (!sameEdgeSet(build.learningUnitPrerequisites, expectedLearningUnitPrerequisites)) {
    violations.push('learning_unit_dag_not_materialized_from_entities');
  }

  violations.push(
    ...graphViolations('tag_dag', tagIds, build.tagPrerequisites),
    ...graphViolations('learning_unit_dag', unitIds, build.learningUnitPrerequisites),
    ...graphViolations(
      'tag_parent_hierarchy',
      tagIds,
      parsedTags.flatMap(({ id, parentId }) =>
        parentId === null ? [] : [{ nodeId: id, prerequisiteId: parentId }],
      ),
    ),
    ...graphViolations(
      'tag_replacement_graph',
      tagIds,
      parsedTags.flatMap(({ id, replacementTagIds }) =>
        replacementTagIds.map((prerequisiteId) => ({ nodeId: id, prerequisiteId })),
      ),
    ),
    ...graphViolations(
      'outcome_prerequisite',
      outcomeIds,
      parsedOutcomes.flatMap(({ id, prerequisiteOutcomeIds }) =>
        prerequisiteOutcomeIds.map((prerequisiteId) => ({ nodeId: id, prerequisiteId })),
      ),
    ),
    ...graphViolations(
      'learning_unit_parent_hierarchy',
      unitIds,
      parsedLearningUnits.flatMap(({ id, parentId }) =>
        parentId === null ? [] : [{ nodeId: id, prerequisiteId: parentId }],
      ),
    ),
  );
  const orderIndex = new Map(build.standardOrder.map((id, index) => [id, index]));
  const ranksByUnitId = new Map(
    parsedLearningUnits.map((unit) => [
      unit.id,
      [unit.stageRank, unit.difficultyRank, unit.representativeRank],
    ]),
  );
  let expectedLearningUnitOrder: string[] = [];
  try {
    expectedLearningUnitOrder = deterministicTopologicalOrder(
      unitIds.map((id) => ({
        id,
        prerequisiteIds: build.learningUnitPrerequisites
          .filter((edge) => edge.nodeId === id)
          .map(({ prerequisiteId }) => prerequisiteId),
        ranks: ranksByUnitId.get(id) ?? [],
      })),
      ({ ranks }) => ranks,
    ).map(({ id }) => id);
  } catch {
    // The dedicated graph validators above report the actionable dependency error.
  }
  if (
    !sameOrderedValues(build.standardOrder, expectedLearningUnitOrder) ||
    build.learningUnitPrerequisites.some(
      ({ nodeId, prerequisiteId }) =>
        (orderIndex.get(prerequisiteId) ?? Number.POSITIVE_INFINITY) >=
        (orderIndex.get(nodeId) ?? Number.NEGATIVE_INFINITY),
    )
  ) {
    violations.push('standard_order_stale');
  }
  const globalIndexByUnitId = new Map(
    parsedLearningUnits.map((unit) => [unit.id, unit.globalIndex]),
  );
  for (const [index, unitId] of expectedLearningUnitOrder.entries()) {
    if (globalIndexByUnitId.get(unitId) !== index) {
      violations.push(`learning_unit_global_index_stale:${unitId}`);
    }
  }

  const placementProblemIds = build.placements.map(({ problemId }) => problemId);
  if (new Set(placementProblemIds).size !== placementProblemIds.length) {
    violations.push('placement_problem_ids_not_unique');
  }
  if (!sameSet(placementProblemIds, context.inventoryProblemIds)) {
    violations.push('placement_reachability_incomplete');
  }
  const placementIds = build.placements.map(({ id }) => id);
  if (new Set(placementIds).size !== placementIds.length) {
    violations.push('placement_ids_not_unique');
  }
  for (const placement of build.placements) {
    const { tagIds, outcomeIds, learningUnitIds, ...canonicalPlacement } = placement;
    if (!ProblemPlacementSchema.safeParse(canonicalPlacement).success) {
      violations.push(`placement_schema_invalid:${placement.problemId}`);
    }
    if (!problemIdsSet.has(placement.problemId)) {
      violations.push(`placement_unknown_problem:${placement.problemId}`);
    }
    if (
      tagIds.length === 0 ||
      outcomeIds.length === 0 ||
      learningUnitIds.length === 0 ||
      new Set(tagIds).size !== tagIds.length ||
      new Set(outcomeIds).size !== outcomeIds.length ||
      new Set(learningUnitIds).size !== learningUnitIds.length ||
      tagIds.some((id) => !tagIdsSet.has(id)) ||
      outcomeIds.some((id) => !outcomeIdsSet.has(id)) ||
      learningUnitIds.some((id) => !unitIdsSet.has(id))
    ) {
      violations.push(`placement_reference_invalid:${placement.problemId}`);
    }
    if (
      placement.primaryProblemId !== null &&
      (!problemIdsSet.has(placement.primaryProblemId) ||
        placement.primaryProblemId === placement.problemId)
    ) {
      violations.push(`placement_primary_problem_invalid:${placement.problemId}`);
    }
    if (placement.sharedOutcomeIds.some((id) => !outcomeIdsSet.has(id))) {
      violations.push(`placement_shared_outcome_invalid:${placement.problemId}`);
    }
    if (
      placement.kind !== 'full' &&
      placement.sharedOutcomeIds.some((id) => !outcomeIds.includes(id))
    ) {
      violations.push(`placement_shared_outcome_not_placed:${placement.problemId}`);
    }
  }

  const placementByProblemId = new Map(
    build.placements.map((placement) => [placement.problemId, placement]),
  );
  for (const entry of build.integrationEntries.filter(({ action }) => action === 'split')) {
    const previewEntity = previewEntitiesById.get(entry.previewEntityId);
    if (!previewEntity) continue;
    for (const assignment of entry.splitProblemAssignments) {
      for (const problemId of assignment.problemIds) {
        const problemPlacement = placementByProblemId.get(problemId);
        const finalEntity = build.finalEntities.find(
          (candidate) => finalTaxonomyEntityId(candidate) === assignment.finalEntityId,
        );
        const placedIds =
          previewEntity.kind === 'tag'
            ? problemPlacement?.tagIds
            : previewEntity.kind === 'outcome'
              ? problemPlacement?.outcomeIds
              : problemPlacement?.learningUnitIds;
        if (!finalEntity || !placedIds?.includes(assignment.finalEntityId)) {
          violations.push(`split_placement_mismatch:${entry.previewEntityId}:${problemId}`);
        }
      }
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
