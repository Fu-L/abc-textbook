import { describe, expect, it } from 'vitest';

import {
  createFinalTaxonomyBuild,
  taxonomyReviewSubjectDigest,
  validateTaxonomyIntegration,
  type FinalTaxonomyBuild,
  type FinalTaxonomyBuildInput,
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
    rationale: 'The complete corpus requires separate unweighted and weighted units.',
    evidenceIds: ['evidence-search-split'],
    aliasOrRedirects: ['preview-unit-search'],
    correctionImpactId: 'impact-search-split',
    reviewMode: 'third_party',
    reviewEvidenceId: 'review-search-split',
    status: 'accepted',
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
    finalEntities: [
      {
        id: 'tag-bfs',
        kind: 'tag' as const,
        definition: 'Explore an unweighted state graph by distance layers.',
        learningOutcomeIds: ['outcome-search'],
        representativeProblemIds: ['abc212-e'],
        sourceRevisionIds: ['source-abc212-e'],
      },
      {
        id: 'outcome-search',
        kind: 'outcome' as const,
        definition: 'Select and justify a shortest-path search.',
        learningOutcomeIds: [],
        representativeProblemIds: ['abc212-e', 'abc213-f'],
        sourceRevisionIds: ['source-abc212-e', 'source-abc213-f'],
      },
      {
        id: 'unit-bfs',
        kind: 'unit' as const,
        definition: 'Breadth-first search foundations.',
        learningOutcomeIds: ['outcome-search'],
        representativeProblemIds: ['abc212-e'],
        sourceRevisionIds: ['source-abc212-e'],
      },
      {
        id: 'unit-dijkstra',
        kind: 'unit' as const,
        definition: 'Shortest paths with non-negative weights.',
        learningOutcomeIds: ['outcome-search'],
        representativeProblemIds: ['abc213-f'],
        sourceRevisionIds: ['source-abc213-f'],
      },
    ],
    tagPrerequisites: [],
    learningUnitPrerequisites: [{ nodeId: 'unit-dijkstra', prerequisiteId: 'unit-bfs' }],
    standardOrder: ['unit-bfs', 'unit-dijkstra'],
    placements: [
      {
        problemId: 'abc212-e',
        tagIds: ['tag-bfs'],
        outcomeIds: ['outcome-search'],
        learningUnitIds: ['unit-bfs'],
      },
      {
        problemId: 'abc213-f',
        tagIds: ['tag-bfs'],
        outcomeIds: ['outcome-search'],
        learningUnitIds: ['unit-dijkstra'],
      },
    ],
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
        entity.id === 'tag-bfs' ? { ...entity, kind: 'unit' as const } : entity,
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
