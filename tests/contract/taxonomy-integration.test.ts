import { describe, expect, it } from 'vitest';

import {
  createFinalTaxonomyBuild,
  taxonomyReviewSubjectDigest,
  validateTaxonomyIntegration,
  type FinalTaxonomyBuild,
  type FinalTaxonomyBuildInput,
  type FinalTaxonomyEntity,
  type IntegrationEntry,
  type TaxonomyValidationContext,
} from '../../src/lib/preview/taxonomy-integration.js';

const validationContext: TaxonomyValidationContext = {
  previewEntities: [
    {
      id: 'preview-tag-bfs',
      kind: 'tag',
      referencedProblemIds: ['abc212-e'],
    },
    {
      id: 'preview-unit-search',
      kind: 'unit',
      referencedProblemIds: ['abc212-e', 'abc213-f'],
    },
  ],
  inventoryDigest: 'a'.repeat(64),
  inventoryProblemIds: ['abc212-e', 'abc213-f'],
  passedPreviewSnapshotDigests: ['b'.repeat(64)],
  knownSourceRevisionIds: ['source-abc212-e', 'source-abc213-f'],
};

const integrationEntries = (): IntegrationEntry[] => [
  {
    previewEntityId: 'preview-tag-bfs',
    previewEntityKind: 'tag',
    action: 'promote',
    finalEntityIds: ['tag-bfs'],
    affectedProblemIds: ['abc212-e'],
    splitProblemAssignments: [],
    rationale: 'The full inventory confirms the same reusable technique.',
    evidenceIds: ['evidence-bfs'],
    aliasOrRedirects: [],
    correctionImpactId: 'impact-bfs',
    reviewMode: 'third_party',
    reviewEvidenceId: 'review-bfs',
    status: 'accepted',
  },
  {
    previewEntityId: 'preview-unit-search',
    previewEntityKind: 'unit',
    action: 'split',
    finalEntityIds: ['unit-bfs', 'unit-dijkstra'],
    affectedProblemIds: ['abc212-e', 'abc213-f'],
    splitProblemAssignments: [
      { finalEntityId: 'unit-bfs', problemIds: ['abc212-e'] },
      { finalEntityId: 'unit-dijkstra', problemIds: ['abc213-f'] },
    ],
    rationale: 'The complete corpus requires separate unweighted and weighted units.',
    evidenceIds: ['evidence-search-split'],
    aliasOrRedirects: ['preview-unit-search'],
    correctionImpactId: 'impact-search-split',
    reviewMode: 'third_party',
    reviewEvidenceId: 'review-search-split',
    status: 'accepted',
  },
];

const inlineExample = (key: string, outcomeId: string) => ({
  key,
  learningOutcomeIds: [outcomeId],
  kind: 'illustrative' as const,
  language: 'text',
  omissions: [],
  environment: 'Fixture environment.',
  input: 'Fixture input.',
  procedure: ['Trace the fixture example.'],
  executionTarget: null,
  expectedResult: 'The fixture result is explained.',
  verificationStatus: 'not_applicable' as const,
});

const inlineExercise = (key: string, outcomeId: string) => ({
  key,
  learningOutcomeIds: [outcomeId],
  prerequisiteIds: [],
  attainmentCondition: 'Explain the fixture method.',
  assessment: {
    method: 'Compare the explanation with the invariant.',
    successCondition: 'The invariant and method are both stated.',
  },
  answer: {
    reasoningOrVerification: 'The fixture invariant is preserved.',
    procedure: ['Check the invariant.'],
    expectedResult: 'The method is justified.',
    verificationStatus: 'passed' as const,
  },
});

const finalEntities = (): FinalTaxonomyEntity[] => [
  {
    kind: 'tag',
    sourceRevisionIds: ['source-abc212-e'],
    entity: {
      id: 'tag-bfs',
      name: 'Breadth-first search',
      definition: 'Explore an unweighted state graph by distance layers.',
      parentId: null,
      prerequisiteTagIds: [],
      learningOutcomeIds: ['outcome-search'],
      representativeProblemIds: ['abc212-e'],
      aliases: [],
      formerNames: [],
      lifecycle: 'active',
      replacementTagIds: [],
    },
  },
  {
    kind: 'outcome',
    sourceRevisionIds: ['source-abc212-e', 'source-abc213-f'],
    entity: {
      id: 'outcome-search',
      statement: 'Select and justify a shortest-path search.',
      prerequisiteOutcomeIds: [],
      scopeIds: ['tag-bfs', 'unit-bfs', 'unit-dijkstra'],
    },
  },
  {
    kind: 'unit',
    sourceRevisionIds: ['source-abc212-e'],
    entity: {
      id: 'unit-bfs',
      kind: 'chapter',
      title: 'Breadth-first search foundations.',
      parentId: null,
      baselineId: 'baseline-foundation',
      baselineVersion: '1.0.0',
      additionalPrerequisiteUnitIds: [],
      excludedTopics: [],
      sourceRevisionIds: ['source-abc212-e'],
      tagIds: ['tag-bfs'],
      learningOutcomeIds: ['outcome-search'],
      docPath: 'src/content/docs/learn/unit-bfs.md',
      problemIds: ['abc212-e'],
      examples: [inlineExample('bfs-intuition', 'outcome-search')],
      exercises: [inlineExercise('bfs-check', 'outcome-search')],
      stageRank: 0,
      difficultyRank: 0,
      representativeRank: 0,
      globalIndex: 0,
      orderReason: 'Prerequisite-free foundation.',
    },
  },
  {
    kind: 'unit',
    sourceRevisionIds: ['source-abc213-f'],
    entity: {
      id: 'unit-dijkstra',
      kind: 'section',
      title: 'Shortest paths with non-negative weights.',
      parentId: 'unit-bfs',
      baselineId: 'baseline-foundation',
      baselineVersion: '1.0.0',
      additionalPrerequisiteUnitIds: ['unit-bfs'],
      excludedTopics: [],
      sourceRevisionIds: ['source-abc213-f'],
      tagIds: ['tag-bfs'],
      learningOutcomeIds: ['outcome-search'],
      docPath: 'src/content/docs/learn/unit-dijkstra.md',
      problemIds: ['abc213-f'],
      examples: [inlineExample('dijkstra-intuition', 'outcome-search')],
      exercises: [inlineExercise('dijkstra-check', 'outcome-search')],
      stageRank: 1,
      difficultyRank: 1,
      representativeRank: 1,
      globalIndex: 1,
      orderReason: 'Requires the BFS foundation first.',
    },
  },
];

const placements = () => [
  {
    id: 'placement-abc212-e',
    problemId: 'abc212-e',
    policyVersion: '1.0.0',
    kind: 'full' as const,
    primaryProblemId: null,
    sharedOutcomeIds: [],
    comparison: {
      method: 'The method is independently explained.',
      proof: 'The invariant is proved in the full explanation.',
      complexity: 'The complexity is derived from the constraints.',
      constraints: 'The method fits the official constraints.',
      prerequisites: 'The common foundation is sufficient.',
      implementation: 'The implementation notes are complete.',
    },
    additionalElement: null,
    rationale: 'This is a complete explanation for the outcome.',
    evidenceIds: ['source-abc212-e'],
    tagIds: ['tag-bfs'],
    outcomeIds: ['outcome-search'],
    learningUnitIds: ['unit-bfs'],
  },
  {
    id: 'placement-abc213-f',
    problemId: 'abc213-f',
    policyVersion: '1.0.0',
    kind: 'full' as const,
    primaryProblemId: null,
    sharedOutcomeIds: [],
    comparison: {
      method: 'The weighted method is independently explained.',
      proof: 'The relaxation invariant is proved in the full explanation.',
      complexity: 'The complexity is derived from the constraints.',
      constraints: 'The method fits the official constraints.',
      prerequisites: 'The BFS foundation is listed as a prerequisite.',
      implementation: 'The implementation notes are complete.',
    },
    additionalElement: null,
    rationale: 'This is a complete explanation for the outcome.',
    evidenceIds: ['source-abc213-f'],
    tagIds: ['tag-bfs'],
    outcomeIds: ['outcome-search'],
    learningUnitIds: ['unit-dijkstra'],
  },
];

const inputFixture = (): FinalTaxonomyBuildInput => {
  const reviewSubject = {
    inventoryDigest: 'a'.repeat(64),
    previewSnapshotDigest: 'b'.repeat(64),
    policy: {
      name: 'full-corpus-taxonomy-recompute',
      version: '1.0.0',
      inputScope: 'complete-technique-inventory',
      requiredReviewMode: 'third_party' as const,
    },
    integrationEntries: integrationEntries(),
    finalEntities: finalEntities(),
    tagPrerequisites: [],
    learningUnitPrerequisites: [{ nodeId: 'unit-dijkstra', prerequisiteId: 'unit-bfs' }],
    standardOrder: ['unit-bfs', 'unit-dijkstra'],
    placements: placements(),
    correctionImpacts: [
      {
        correctionImpactId: 'impact-bfs',
        affectedProblemIds: ['abc212-e'],
        affectedSurfaces: ['placement', 'index'],
      },
      {
        correctionImpactId: 'impact-search-split',
        affectedProblemIds: ['abc212-e', 'abc213-f'],
        affectedSurfaces: ['text', 'exercise', 'answer', 'order', 'index'],
      },
    ],
    sourceRevisionIds: ['source-abc212-e', 'source-abc213-f'],
  };
  const subjectDigest = taxonomyReviewSubjectDigest(reviewSubject);
  return {
    ...reviewSubject,
    reviewEvidence: [
      {
        reviewEvidenceId: 'review-bfs',
        subjectDigest,
        requiredMode: 'third_party',
        reviewMode: 'third_party',
        aggregatePassed: true,
      },
      {
        reviewEvidenceId: 'review-search-split',
        subjectDigest,
        requiredMode: 'third_party',
        reviewMode: 'third_party',
        aggregatePassed: true,
      },
    ],
    status: 'accepted',
    acceptedAt: '2026-07-24T00:00:00Z',
  };
};

const buildFixture = (): FinalTaxonomyBuild => createFinalTaxonomyBuild(inputFixture());

const rebuild = (
  build: FinalTaxonomyBuild,
  changes: Partial<FinalTaxonomyBuildInput>,
): FinalTaxonomyBuild => {
  const input: FinalTaxonomyBuildInput = {
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
    reviewEvidence: build.reviewEvidence,
    status: build.status,
    acceptedAt: build.acceptedAt,
  };
  const changed = { ...input, ...changes };
  const subjectDigest = taxonomyReviewSubjectDigest(changed);
  return createFinalTaxonomyBuild({
    ...changed,
    reviewEvidence: changed.reviewEvidence.map((evidence) => ({ ...evidence, subjectDigest })),
  });
};

describe('US2 preview-to-final taxonomy integration contract', () => {
  it('accepts a complete, current-subject full-corpus build', () => {
    expect(validateTaxonomyIntegration(validationContext, buildFixture())).toEqual([]);
  });

  it('requires canonical entity fields before accepting a final build', () => {
    const build = buildFixture();
    const invalidTag = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'tag' && entity.entity.id === 'tag-bfs'
          ? {
              ...entity,
              entity: { ...entity.entity, name: '' },
            }
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, invalidTag)).toContain(
      'final_entity_schema_invalid:tag-bfs',
    );

    const invalidUnit = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'unit' && entity.entity.id === 'unit-bfs'
          ? { ...entity, entity: { ...entity.entity, baselineId: '' } }
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, invalidUnit)).toContain(
      'final_entity_schema_invalid:unit-bfs',
    );

    const invalidUnitContent = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'unit' && entity.entity.id === 'unit-bfs'
          ? { ...entity, entity: { ...entity.entity, examples: [], exercises: [] } }
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, invalidUnitContent)).toContain(
      'final_entity_schema_invalid:unit-bfs',
    );
  });

  it('requires the canonical ProblemPlacement decision fields', () => {
    const build = buildFixture();
    const invalid = rebuild(build, {
      placements: build.placements.map((placement) =>
        placement.problemId === 'abc212-e'
          ? {
              ...placement,
              policyVersion: 'not-a-version',
              kind: 'similar' as const,
              primaryProblemId: null,
            }
          : placement,
      ),
    });

    expect(validateTaxonomyIntegration(validationContext, invalid)).toContain(
      'placement_schema_invalid:abc212-e',
    );
  });

  it('maps every provisional entity exactly once through promote/merge/split/retire', () => {
    const build = buildFixture();
    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, { integrationEntries: build.integrationEntries.slice(0, 1) }),
      ),
    ).toContain('integration_mapping_incomplete');
  });

  it('requires split integrations to use third-party review', () => {
    const build = buildFixture();
    const selfReviewed = rebuild(build, {
      policy: { ...build.policy, requiredReviewMode: 'self' },
      integrationEntries: build.integrationEntries.map((entry) => ({
        ...entry,
        reviewMode: 'self',
      })),
      reviewEvidence: build.reviewEvidence.map((evidence) => ({
        ...evidence,
        requiredMode: 'self',
        reviewMode: 'self',
      })),
    });

    expect(validateTaxonomyIntegration(validationContext, selfReviewed)).toEqual(
      expect.arrayContaining([
        'taxonomy_review_policy_insufficient',
        'integration_review_mode_insufficient:preview-tag-bfs',
        'integration_review_mode_insufficient:preview-unit-search',
      ]),
    );
  });

  it('requires preview entity kinds and affected Problem scopes to match exactly', () => {
    const build = buildFixture();
    const [first, second] = build.integrationEntries;
    if (!first || !second) throw new Error('Integration fixture is incomplete.');

    const mismatched = rebuild(build, {
      integrationEntries: [
        { ...first, previewEntityKind: 'unit' },
        { ...second, affectedProblemIds: ['abc212-e'] },
      ],
    });
    expect(validateTaxonomyIntegration(validationContext, mismatched)).toEqual(
      expect.arrayContaining([
        'preview_entity_kind_mismatch:preview-tag-bfs',
        'affected_problem_scope_mismatch:preview-unit-search',
      ]),
    );

    const wrongFinalKind = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'tag' && entity.entity.id === 'tag-bfs'
          ? ({ ...entity, kind: 'unit' as const } as unknown as FinalTaxonomyEntity)
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, wrongFinalKind)).toContain(
      'final_entity_kind_mismatch:preview-tag-bfs',
    );
  });

  it('rejects invalid action cardinality, fictional final IDs, and missing evidence', () => {
    const build = buildFixture();
    const [first, second] = build.integrationEntries;
    if (!first || !second) throw new Error('Integration fixture is incomplete.');
    const invalid = {
      ...second,
      finalEntityIds: ['unit-fictional'],
      evidenceIds: [],
      rationale: '',
    };
    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, { integrationEntries: [first, invalid] }),
      ),
    ).toEqual(
      expect.arrayContaining([
        'invalid_action_cardinality:preview-unit-search',
        'integration_evidence_missing:preview-unit-search',
        'final_entity_missing:preview-unit-search',
      ]),
    );
  });

  it('requires the referenced preview snapshot to be a trusted passed snapshot', () => {
    const build = buildFixture();
    const changed = rebuild(build, { previewSnapshotDigest: 'c'.repeat(64) });
    expect(validateTaxonomyIntegration(validationContext, changed)).toContain(
      'preview_snapshot_not_passed',
    );
  });

  it('requires the build to use the frozen full-inventory digest', () => {
    const build = buildFixture();
    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, { inventoryDigest: 'c'.repeat(64) }),
      ),
    ).toContain('inventory_digest_stale');
  });

  it('rejects cycles and a stale deterministic LearningUnit order', () => {
    const build = buildFixture();
    const cycle = rebuild(build, {
      learningUnitPrerequisites: [
        ...build.learningUnitPrerequisites,
        { nodeId: 'unit-bfs', prerequisiteId: 'unit-dijkstra' },
      ],
    });
    expect(validateTaxonomyIntegration(validationContext, cycle)).toEqual(
      expect.arrayContaining(['learning_unit_dag_cycle', 'standard_order_stale']),
    );

    const staleOrder = rebuild(build, { standardOrder: [...build.standardOrder].reverse() });
    expect(validateTaxonomyIntegration(validationContext, staleOrder)).toContain(
      'standard_order_stale',
    );
  });

  it('rejects a different order for independent LearningUnits', () => {
    const build = buildFixture();
    const reordered = rebuild(build, {
      learningUnitPrerequisites: [],
      standardOrder: ['unit-dijkstra', 'unit-bfs'],
    });
    expect(validateTaxonomyIntegration(validationContext, reordered)).toContain(
      'standard_order_stale',
    );
  });

  it('orders independent LearningUnits by all canonical ranks and checks globalIndex', () => {
    const build = buildFixture();
    const rankReordered = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) => {
        if (entity.kind !== 'unit') return entity;
        if (entity.entity.id === 'unit-bfs') {
          return {
            ...entity,
            entity: {
              ...entity.entity,
              parentId: null,
              additionalPrerequisiteUnitIds: [],
              stageRank: 1,
              difficultyRank: 0,
              representativeRank: 0,
              globalIndex: 0,
            },
          };
        }
        return {
          ...entity,
          entity: {
            ...entity.entity,
            parentId: null,
            additionalPrerequisiteUnitIds: [],
            stageRank: 0,
            difficultyRank: 0,
            representativeRank: 0,
            globalIndex: 1,
          },
        };
      }),
      learningUnitPrerequisites: [],
      standardOrder: ['unit-bfs', 'unit-dijkstra'],
    });

    expect(validateTaxonomyIntegration(validationContext, rankReordered)).toEqual(
      expect.arrayContaining([
        'standard_order_stale',
        'learning_unit_global_index_stale:unit-bfs',
        'learning_unit_global_index_stale:unit-dijkstra',
      ]),
    );
  });

  it('rejects cycles in canonical taxonomy hierarchy and prerequisite graphs', () => {
    const build = buildFixture();
    const tagParentCycle = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'tag'
          ? { ...entity, entity: { ...entity.entity, parentId: 'tag-bfs' } }
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, tagParentCycle)).toContain(
      'tag_parent_hierarchy_cycle',
    );

    const tagReplacementCycle = rebuild(build, {
      finalEntities: [
        ...build.finalEntities.map((entity) =>
          entity.kind === 'tag'
            ? {
                ...entity,
                entity: {
                  ...entity.entity,
                  lifecycle: 'deprecated' as const,
                  replacementTagIds: ['tag-other'],
                },
              }
            : entity,
        ),
        {
          kind: 'tag' as const,
          sourceRevisionIds: ['source-abc213-f'],
          entity: {
            id: 'tag-other',
            name: 'Another search technique',
            definition: 'A second fixture tag used for replacement validation.',
            parentId: null,
            prerequisiteTagIds: [],
            learningOutcomeIds: ['outcome-search'],
            representativeProblemIds: ['abc213-f'],
            aliases: [],
            formerNames: [],
            lifecycle: 'deprecated' as const,
            replacementTagIds: ['tag-bfs'],
          },
        },
      ],
    });
    expect(validateTaxonomyIntegration(validationContext, tagReplacementCycle)).toContain(
      'tag_replacement_graph_cycle',
    );

    const outcomeCycle = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'outcome'
          ? {
              ...entity,
              entity: { ...entity.entity, prerequisiteOutcomeIds: ['outcome-search'] },
            }
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, outcomeCycle)).toContain(
      'outcome_prerequisite_cycle',
    );

    const unitParentCycle = rebuild(build, {
      finalEntities: build.finalEntities.map((entity) =>
        entity.kind === 'unit' && entity.entity.id === 'unit-bfs'
          ? { ...entity, entity: { ...entity.entity, parentId: 'unit-bfs' } }
          : entity,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, unitParentCycle)).toContain(
      'learning_unit_parent_hierarchy_cycle',
    );
  });

  it('requires complete placements, CorrectionImpact scopes, and Source Revisions', () => {
    const build = buildFixture();
    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, { placements: build.placements.slice(0, 1) }),
      ),
    ).toContain('placement_reachability_incomplete');

    const [firstImpact, secondImpact] = build.correctionImpacts;
    if (!firstImpact || !secondImpact) throw new Error('CorrectionImpact fixture is incomplete.');
    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, {
          correctionImpacts: [firstImpact, { ...secondImpact, affectedProblemIds: ['abc213-f'] }],
        }),
      ),
    ).toContain('correction_impact_scope_mismatch:impact-search-split');

    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, { sourceRevisionIds: ['source-abc212-e'] }),
      ),
    ).toContain('source_revisions_stale');
  });

  it('requires exactly one placement for every Problem', () => {
    const build = buildFixture();
    const firstPlacement = build.placements[0];
    if (!firstPlacement) throw new Error('Placement fixture is incomplete.');
    const duplicateProblem = rebuild(build, {
      placements: [...build.placements, { ...firstPlacement, id: 'placement-duplicate' }],
    });

    expect(validateTaxonomyIntegration(validationContext, duplicateProblem)).toContain(
      'placement_problem_ids_not_unique',
    );
  });

  it('requires split assignments to agree with Problem placements', () => {
    const build = buildFixture();
    const mismatched = rebuild(build, {
      placements: build.placements.map((placement) =>
        placement.problemId === 'abc213-f'
          ? { ...placement, learningUnitIds: ['unit-bfs'] }
          : placement,
      ),
    });
    expect(validateTaxonomyIntegration(validationContext, mismatched)).toContain(
      'split_placement_mismatch:preview-unit-search:abc213-f',
    );
  });

  it('requires policy-matched review evidence for the current complete subject', () => {
    const build = buildFixture();
    const staleReview = createFinalTaxonomyBuild({
      ...inputFixture(),
      reviewEvidence: inputFixture().reviewEvidence.map((evidence) => ({
        ...evidence,
        subjectDigest: 'f'.repeat(64),
      })),
    });
    expect(validateTaxonomyIntegration(validationContext, staleReview)).toContain(
      'current_subject_review_missing',
    );

    expect(
      validateTaxonomyIntegration(
        validationContext,
        rebuild(build, { status: 'proposed', acceptedAt: null }),
      ),
    ).toContain('final_taxonomy_not_accepted');
  });

  it.each([
    ['integrationMapDigest', { integrationMapDigest: 'f'.repeat(64) }],
    ['taxonomyDigest', { taxonomyDigest: 'f'.repeat(64) }],
    ['tagDagDigest', { tagDagDigest: 'f'.repeat(64) }],
    ['learningUnitDagDigest', { learningUnitDagDigest: 'f'.repeat(64) }],
    ['orderDigest', { orderDigest: 'f'.repeat(64) }],
    ['placementDigest', { placementDigest: 'f'.repeat(64) }],
    ['correctionImpactDigest', { correctionImpactDigest: 'f'.repeat(64) }],
    ['buildDigest', { buildDigest: 'f'.repeat(64) }],
  ])('rejects a stale %s', (_, mutation) => {
    expect(
      validateTaxonomyIntegration(validationContext, { ...buildFixture(), ...mutation }),
    ).not.toEqual([]);
  });
});
