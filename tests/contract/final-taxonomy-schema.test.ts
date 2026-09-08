import { describe, expect, it } from 'vitest';
import type { z } from 'zod';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import {
  CatalogContract,
  FinalProblemPlacementProjectionSchema,
  FinalTaxonomyBuildSchema,
  FinalTaxonomyCandidateSchema,
  LearningUnitTaxonomyCandidateSchema,
  PreMaterializationCorrectionImpactSchema,
  ProblemAnalysisClaimRefSchema,
  TaxonomyIntegrationMapSchema,
  TechniqueTagRelationTypeSchema,
  TechniqueTagSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';

const sha = (character: string): string => character.repeat(64);
const acceptedAt = '2026-08-08T12:00:00+09:00';
const problemIds = ['abc212-e', 'abc212-f'] as const;
const sourceIds = ['source-abc212-e-problem', 'source-abc212-f-problem'] as const;
const reviewEvidenceId = 'human-content-review-final-taxonomy';

const evidenceRef = (index: number) => ({
  problemId: problemIds[index] ?? problemIds[0],
  claimPath: '/outcomeCandidates/0',
  evidenceIds: ['evidence-official-analysis'],
  sourceRevisionIds: [sourceIds[index] ?? sourceIds[0]],
});
const evidenceRefs = [evidenceRef(0), evidenceRef(1)];

const provisionalCandidate = (
  previewEntityId: string,
  previewEntityKind: 'tag' | 'outcome' | 'unit',
) => ({
  previewEntityId,
  previewEntityKind,
  affectedProblemIds: [...problemIds],
  rationale: 'The frozen preview entity requires a full-corpus decision.',
  evidenceIds: [...sourceIds],
  affectedSurfaces: ['staging/previews/initial-v1/taxonomy/index.json'],
  actionAssessments: (['promote', 'merge', 'split', 'retire'] as const).map((action) => ({
    action,
    criterion: `${action} criterion`,
    evidenceRequiredAtT159: [`evidence-${action}`],
  })),
  provisionalRecommendation: 'promote' as const,
  finalDecision: null,
  finalEntityIds: [],
  reviewPolicy: {
    requiredMode: 'third_party' as const,
    riskReasons: ['major_classification_change' as const],
  },
});

const integrationEntry = (
  previewEntityId: string,
  previewEntityKind: 'tag' | 'outcome' | 'unit',
  finalEntityId: string,
  impactId: string,
  status: 'proposed' | 'accepted',
) => ({
  previewEntityId,
  previewEntityKind,
  affectedProblemIds: [...problemIds],
  rationale: 'The full inventory supports this reusable final entity.',
  evidenceRefs,
  correctionImpactIds: [impactId],
  reviewPolicy: {
    requiredMode: 'third_party' as const,
    riskReasons: ['major_classification_change' as const],
  },
  reviewEvidenceId: status === 'accepted' ? reviewEvidenceId : null,
  status,
  action: 'promote' as const,
  finalEntityIds: [finalEntityId],
  splitProblemAssignments: [],
  decisionEvidence: {
    fullInventoryComparison: 'The candidate remains useful after comparing all inventory records.',
    representativeProblemIds: [...problemIds],
  },
  legacyDisposition: {
    kind: 'redirect' as const,
    fromPreviewEntityId: previewEntityId,
    toFinalEntityId: finalEntityId,
    aliases: [],
  },
});

const integrationSubject = (integration: Record<string, unknown>) => ({
  schemaVersion: integration.schemaVersion,
  evidenceId: integration.evidenceId,
  previewId: integration.previewId,
  inventoryDigest: integration.inventoryDigest,
  previewSnapshotDigest: integration.previewSnapshotDigest,
  provisionalEvidence: integration.provisionalEvidence,
  entries: (integration.entries as readonly Record<string, unknown>[]).map((entry) =>
    Object.fromEntries(
      Object.entries(entry).filter(([field]) => !['reviewEvidenceId', 'status'].includes(field)),
    ),
  ),
  canonicalMaterializationAllowed: integration.canonicalMaterializationAllowed,
});

const createIntegrationMap = (
  status: 'proposed' | 'accepted',
): z.input<typeof TaxonomyIntegrationMapSchema> => {
  const provisionalEvidence = {
    schemaVersion: '1.0.0' as const,
    evidenceId: 'preview-initial-v1-taxonomy-integration',
    previewId: 'initial-v1',
    status: 'evidence_frozen' as const,
    taxonomyDigest: sha('1'),
    inventoryComponentDigest: sha('2'),
    classificationsDigest: sha('3'),
    proposalDigest: sha('4'),
    finalDecisionTask: 'T159' as const,
    canonicalMaterializationAllowed: false as const,
    candidates: [
      provisionalCandidate('provisional-tag-core', 'tag'),
      provisionalCandidate('outcome-provisional-core', 'outcome'),
      provisionalCandidate('provisional-unit-core', 'unit'),
    ],
    integrationDigest: sha('5'),
  };
  const base = {
    schemaVersion: '2.0.0' as const,
    evidenceId: 'final-taxonomy-integration-initial',
    previewId: 'initial-v1',
    inventoryDigest: sha('6'),
    previewSnapshotDigest: sha('7'),
    provisionalEvidence,
    entries: [
      integrationEntry(
        'provisional-tag-core',
        'tag',
        'tag-core',
        'impact-preview-tag-core',
        status,
      ),
      integrationEntry(
        'outcome-provisional-core',
        'outcome',
        'outcome-core',
        'impact-preview-outcome-core',
        status,
      ),
      integrationEntry(
        'provisional-unit-core',
        'unit',
        'unit-core',
        'impact-preview-unit-core',
        status,
      ),
    ],
    status,
    canonicalMaterializationAllowed: false as const,
    integrationSubjectDigest: '',
  };
  const withSubject = {
    ...base,
    integrationSubjectDigest: canonicalDigest(integrationSubject(base)),
    integrationDigest: sha('0'),
  };
  return {
    ...withSubject,
    integrationDigest: digestWithoutField(withSubject, 'integrationDigest'),
  };
};

const impact = (
  id: string,
  previewEntityId: string,
  verificationStatus: 'pending' | 'reviewed',
): z.input<typeof PreMaterializationCorrectionImpactSchema> => {
  const problemSurfaces = [
    'body',
    'example',
    'exercise',
    'answer',
    'placement',
    'derived_index',
  ] as const;
  const unitSurfaces = [
    'body',
    'example',
    'exercise',
    'answer',
    'standard_order',
    'derived_index',
  ] as const;
  const subject = {
    id,
    integrationPreviewEntityIds: [previewEntityId],
    sourceRevisionIds: [...sourceIds],
    changeSummary: 'Replace the preview identity and reassess every dependent surface.',
    affectedProblemIds: [...problemIds],
    affectedLearningUnitCandidateIds: ['unit-core'],
    surfaceAssessments: [
      ...problemIds.flatMap((problemId, index) =>
        problemSurfaces.map((surface) => ({
          ownerType: 'problem' as const,
          problemId,
          surface,
          disposition: 'materialize_change' as const,
          rationale: `${problemId} ${surface} must consume the accepted taxonomy.`,
          evidenceRefs: [evidenceRef(index)],
        })),
      ),
      ...unitSurfaces.map((surface) => ({
        ownerType: 'learning_unit_candidate' as const,
        learningUnitId: 'unit-core',
        surface,
        disposition: 'materialize_change' as const,
        rationale: `The Unit ${surface} must consume the accepted taxonomy.`,
        evidenceRefs,
      })),
      {
        ownerType: 'derived_index' as const,
        path: 'docs/verification/bootstrap/final-taxonomy-index.json',
        surface: 'index' as const,
        disposition: 'materialize_change' as const,
        rationale: 'Derived indexes must be rebuilt from accepted IDs.',
        evidenceRefs,
      },
    ],
    affectedLearningUnitOrderIds: ['unit-core'],
    derivedIndexPaths: ['docs/verification/bootstrap/final-taxonomy-index.json'],
    canonicalMaterializationTask: 'T049' as const,
    coverageStatus: 'complete' as const,
  };
  return {
    ...subject,
    verificationStatus,
    impactSubjectDigest: canonicalDigest(subject),
  };
};

const finalCandidates = (): z.input<typeof FinalTaxonomyCandidateSchema>[] => [
  {
    kind: 'tag',
    entity: {
      id: 'tag-algorithms',
      name: 'Algorithms',
      definition: 'A hierarchy root used only as supporting navigation.',
      parentId: null,
      prerequisiteTagIds: [],
      semanticSignature: {
        objectPatterns: ['algorithm'],
        triggerPatterns: ['model'],
        invariantPatterns: ['reusable structure'],
        goalPatterns: ['select an algorithm'],
        excludedPatterns: [],
        minimumDimensions: 2,
        requireObjectForStrictRecall: true,
      },
      relatedTags: [],
      learningOutcomeIds: ['outcome-core'],
      representativeProblemIds: [...problemIds],
      aliases: [],
      formerNames: [],
      lifecycle: 'active',
      replacementTagIds: [],
    },
    sourceRevisionIds: [...sourceIds],
    evidenceRefs,
    materializationTask: 'T047',
  },
  {
    kind: 'tag',
    entity: {
      id: 'tag-core',
      name: 'Core technique',
      definition: 'A reusable technique demonstrated by multiple Problems.',
      parentId: 'tag-algorithms',
      prerequisiteTagIds: [],
      semanticSignature: {
        objectPatterns: ['fixture object'],
        triggerPatterns: ['fixture trigger'],
        invariantPatterns: ['fixture invariant'],
        goalPatterns: ['fixture goal'],
        excludedPatterns: [],
        minimumDimensions: 2,
        requireObjectForStrictRecall: true,
      },
      relatedTags: [],
      learningOutcomeIds: ['outcome-core'],
      representativeProblemIds: [...problemIds],
      aliases: [],
      formerNames: [],
      lifecycle: 'active',
      replacementTagIds: [],
    },
    sourceRevisionIds: [...sourceIds],
    evidenceRefs,
    materializationTask: 'T047',
  },
  {
    kind: 'outcome',
    entity: {
      id: 'outcome-core',
      statement: 'Select and implement the reusable core technique.',
      prerequisiteOutcomeIds: [],
      scopeIds: ['tag-algorithms', 'tag-core', 'unit-core', ...problemIds],
    },
    sourceRevisionIds: [...sourceIds],
    evidenceRefs,
    materializationTask: 'T048',
  },
  {
    kind: 'unit',
    entity: {
      id: 'unit-core',
      kind: 'section',
      title: 'Core technique',
      parentId: null,
      baselineId: 'prereq-abc-advanced-v1',
      baselineVersion: '1.0.0',
      additionalPrerequisiteUnitIds: [],
      excludedTopics: [],
      sourceRevisionIds: [...sourceIds],
      tagIds: ['tag-algorithms', 'tag-core'],
      ownedTagIds: ['tag-algorithms', 'tag-core'],
      learningOutcomeIds: ['outcome-core'],
      ownedLearningOutcomeIds: ['outcome-core'],
      problemIds: [...problemIds],
      stageRank: 0,
      difficultyRank: 0,
      representativeRank: 0,
      globalIndex: 0,
      orderReason: 'This is the first and only Unit in the fixture.',
    },
    sourceRevisionIds: [...sourceIds],
    evidenceRefs,
    materializationTask: 'T050',
  },
];

const placements = (): z.input<typeof FinalProblemPlacementProjectionSchema>[] =>
  problemIds.map((problemId, index) => ({
    id: `placement-${problemId}`,
    problemId,
    policyVersion: '1.0.0',
    kind: 'full',
    primaryProblemId: null,
    sharedOutcomeIds: [],
    comparison: {
      method: 'Independent full method.',
      proof: 'Independent full proof.',
      complexity: 'Problem-specific complexity.',
      constraints: 'Problem-specific constraints.',
      prerequisites: 'Declared prerequisites.',
      implementation: 'Problem-specific implementation.',
    },
    additionalElement: null,
    rationale: 'Full is the safe default for a distinct Problem.',
    evidenceIds: ['evidence-official-analysis'],
    primaryTagIds: ['tag-core'],
    supportingTagIds: [],
    primaryOutcomeId: 'outcome-core',
    additionalPrimaryOutcomeIds: [],
    supportingOutcomeIds: [],
    learningUnitIds: ['unit-core'],
    presentationUnitId: 'unit-core',
    adHocElements: index === 0 ? ['Problem-specific boundary handling.'] : [],
    claimDispositions: [
      {
        claimRef: evidenceRef(index),
        kind: 'primary',
        tagIds: ['tag-core'],
        rationale: 'The fixture claim directly supports the primary Tag.',
      },
    ],
    analysisEvidenceRefs: [evidenceRef(index)],
  }));

const createBuild = (status: 'proposed' | 'accepted'): z.input<typeof FinalTaxonomyBuildSchema> => {
  const integrationMap = createIntegrationMap(status);
  const candidates = finalCandidates();
  const placementValues = placements();
  const correctionImpacts = [
    impact(
      'impact-preview-tag-core',
      'provisional-tag-core',
      status === 'accepted' ? 'reviewed' : 'pending',
    ),
    impact(
      'impact-preview-outcome-core',
      'outcome-provisional-core',
      status === 'accepted' ? 'reviewed' : 'pending',
    ),
    impact(
      'impact-preview-unit-core',
      'provisional-unit-core',
      status === 'accepted' ? 'reviewed' : 'pending',
    ),
  ];
  const inputs = {
    inventory: {
      evidencePath: 'docs/verification/bootstrap/technique-inventory.json',
      evidenceDigest: sha('8'),
      inventoryDigest: integrationMap.inventoryDigest,
      corpusDigest: sha('9'),
      authoringEvidencePath: 'docs/verification/bootstrap/technique-inventory-authoring.json',
      authoringEvidenceDigest: sha('a'),
      authoringInventoryDigest: sha('2'),
      normalizedSourceSetDigest: sha('3'),
    },
    previewSnapshot: {
      path: `staging/previews/initial-v1/snapshots/${integrationMap.previewSnapshotDigest}.json`,
      referencePath: `docs/verification/previews/initial-v1/preview-join/${integrationMap.previewSnapshotDigest}.json`,
      joinDigest: integrationMap.previewSnapshotDigest,
      canonicalSnapshotDigest: sha('b'),
      transactionId: `preview-snapshot:initial-v1:${integrationMap.previewSnapshotDigest}`,
      status: 'passed' as const,
    },
    placementDecisionTable: {
      path: 'src/content/policies/problem-placement.json',
      version: '1.0.0',
      digest: sha('f'),
    },
    integrationMapPath: 'docs/verification/previews/initial-v1/taxonomy-integration.json',
  };
  const policy = {
    name: 'corpus-first-final-taxonomy',
    version: '1.0.0',
    inputScope: 'ABC 212 through ABC 466 advanced Problems',
    rulesDigest: sha('c'),
    requiredReviewMode: 'third_party' as const,
    riskReasons: ['major_classification_change' as const],
    authoringSkillName: 'abc-explanation-author',
    authoringSkillVersion: '1.1.1',
    authoringSkillDigest: sha('d'),
    writingPolicyPath: '.agents/skills/abc-explanation-author/references/writing-policy.md',
    writingPolicyDigest: sha('e'),
    sourceNormalizationVersion: '1.0.0',
    workManifestPath: 'docs/work-manifests/initial/us2/final-taxonomy/manifest.json',
    workManifestDigest: sha('f'),
  };
  const subject = {
    inputs,
    policy,
    integrationSubjectDigest: integrationMap.integrationSubjectDigest,
    finalCandidates: candidates,
    tagPrerequisites: [],
    learningUnitPrerequisites: [],
    standardOrder: ['unit-core'],
    placements: placementValues,
    correctionImpacts: correctionImpacts.map((correctionImpact) =>
      Object.fromEntries(
        Object.entries(correctionImpact).filter(([field]) => field !== 'verificationStatus'),
      ),
    ),
    sourceRevisionIds: [...sourceIds],
  };
  const taxonomySubjectDigest = canonicalDigest(subject);
  const reviewEvidenceRefs =
    status === 'accepted'
      ? [
          {
            evidenceId: reviewEvidenceId,
            path: 'docs/reviews/human-content/bootstrap/us2/final-taxonomy-review.json',
            digest: sha('1'),
            subjectDigest: taxonomySubjectDigest,
            authorIds: ['person-taxonomy-author'],
            reviewerIds: ['person-independent-reviewer'],
            reviewMode: 'third_party' as const,
            aggregatePassed: true as const,
          },
        ]
      : [];
  const beforeBuildDigest = {
    schemaVersion: '2.0.0' as const,
    id: 'final-taxonomy-initial',
    generatedAt: acceptedAt,
    inputs,
    policy,
    integrationMap,
    integrationMapDigest: integrationMap.integrationDigest,
    finalCandidates: candidates,
    tagPrerequisites: [],
    learningUnitPrerequisites: [],
    standardOrder: ['unit-core'],
    placements: placementValues,
    correctionImpacts,
    sourceRevisionIds: [...sourceIds],
    reviewEvidenceRefs,
    taxonomySubjectDigest,
    taxonomyDigest: canonicalDigest(candidates),
    tagDagDigest: canonicalDigest([]),
    learningUnitDagDigest: canonicalDigest([]),
    orderDigest: canonicalDigest(['unit-core']),
    placementDigest: canonicalDigest(placementValues),
    correctionImpactDigest: canonicalDigest(correctionImpacts),
    status,
    acceptedAt: status === 'accepted' ? acceptedAt : null,
    holdReasons: status === 'accepted' ? [] : ['Awaiting third-party review.'],
    canonicalMaterializationAllowed: status === 'accepted',
    buildDigest: sha('0'),
  };
  return {
    ...beforeBuildDigest,
    buildDigest: digestWithoutField(beforeBuildDigest, 'buildDigest'),
  };
};

describe('strict T159 staging schemas', () => {
  it('accepts complete proposed and accepted builds without widening the public Catalog root', () => {
    const proposed = createBuild('proposed');
    const accepted = createBuild('accepted');

    expect(FinalTaxonomyBuildSchema.safeParse(proposed).success).toBe(true);
    expect(FinalTaxonomyBuildSchema.safeParse(accepted).success).toBe(true);
    expect(CatalogContract.schema.safeParse(accepted).success).toBe(false);
    expect(CatalogContract.jsonSchema.properties).not.toHaveProperty('finalTaxonomyBuild');
    expect(CatalogContract.jsonSchema.$defs).toHaveProperty('FinalTaxonomyBuild');
    expect(CatalogContract.jsonSchema.$defs).toHaveProperty('TaxonomyIntegrationMap');
  });

  it('keeps Learning Unit candidates metadata-only and enforces kind-specific IDs', () => {
    const unit = finalCandidates().find(({ kind }) => kind === 'unit');
    expect(LearningUnitTaxonomyCandidateSchema.safeParse(unit?.entity).success).toBe(true);
    expect(
      LearningUnitTaxonomyCandidateSchema.safeParse({
        ...unit?.entity,
        docPath: 'src/content/docs/learn/core.md',
      }).success,
    ).toBe(false);
    const tag = finalCandidates().find(({ kind }) => kind === 'tag');
    expect(
      FinalTaxonomyCandidateSchema.safeParse({
        ...tag,
        entity: { ...tag?.entity, id: 'unit-wrong-namespace' },
      }).success,
    ).toBe(false);
  });

  it('rejects missing direct owners and navigation closure drift inside the build schema', () => {
    const missingOwner = createBuild('proposed');
    const unit = missingOwner.finalCandidates.find((candidate) => candidate.kind === 'unit');
    if (unit?.kind !== 'unit') throw new Error('Unit fixture missing.');
    unit.entity.ownedTagIds = ['tag-algorithms'];
    unit.entity.ownedLearningOutcomeIds = [];

    const parsed = FinalTaxonomyBuildSchema.safeParse(missingOwner);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const messages = parsed.error.issues.map(({ message }) => message);
      expect(messages).toContain(
        'Final Tag tag-core must have exactly one direct Learning Unit owner.',
      );
      expect(messages).toContain(
        'Final Outcome outcome-core must have one direct owner matching its Unit and Tag scopes.',
      );
      expect(messages).toContain(
        'Final Learning Unit unit-core navigation must be the exact direct-owner and child closure.',
      );
    }
  });

  it('keeps recognition signatures and typed non-prerequisite Tag relations canonical', () => {
    const tagCandidate = finalCandidates().find(
      (
        candidate,
      ): candidate is Extract<ReturnType<typeof finalCandidates>[number], { kind: 'tag' }> =>
        candidate.kind === 'tag' && candidate.entity.id === 'tag-core',
    );
    expect(tagCandidate).toBeDefined();
    const withoutSignature = Object.fromEntries(
      Object.entries(tagCandidate?.entity ?? {}).filter(([field]) => field !== 'semanticSignature'),
    );
    expect(TechniqueTagSchema.safeParse(withoutSignature).success).toBe(false);
    expect(tagCandidate?.entity.relatedTags).toEqual([]);
    expect(TechniqueTagSchema.safeParse(tagCandidate?.entity).success).toBe(true);
    expect(TechniqueTagRelationTypeSchema.safeParse('extension').success).toBe(true);
    expect(TechniqueTagRelationTypeSchema.safeParse('reduction').success).toBe(true);
    expect(
      TechniqueTagSchema.safeParse({
        ...tagCandidate?.entity,
        relatedTags: [
          {
            tagId: 'tag-core',
            type: 'contrast',
            rationale: 'A self relation must never be canonical.',
          },
        ],
      }).success,
    ).toBe(false);

    const asymmetric = createBuild('proposed');
    const core = asymmetric.finalCandidates.find(
      (candidate) => candidate.kind === 'tag' && candidate.entity.id === 'tag-core',
    );
    if (core?.kind !== 'tag') throw new Error('tag-core fixture missing');
    core.entity.relatedTags.push({
      tagId: 'tag-algorithms',
      type: 'analogy',
      rationale: 'Fixture relation with no reverse edge.',
    });
    const parsed = FinalTaxonomyBuildSchema.safeParse(asymmetric);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some(({ message }) => message.includes('reverse edge'))).toBe(
        true,
      );
    }
  });

  it('requires qualified claim refs, ad-hoc decomposition, and complete impact surfaces', () => {
    expect(
      ProblemAnalysisClaimRefSchema.safeParse({
        ...evidenceRef(0),
        claimPath: '/unknownClaims/0',
      }).success,
    ).toBe(false);
    const [placement] = placements();
    const withoutAdHoc = Object.fromEntries(
      Object.entries(placement ?? {}).filter(([field]) => field !== 'adHocElements'),
    );
    expect(FinalProblemPlacementProjectionSchema.safeParse(withoutAdHoc).success).toBe(false);
    expect(
      FinalProblemPlacementProjectionSchema.safeParse({
        ...placement,
        taxonomyDecision: { selectionRationale: 'Duplicated placement audit metadata.' },
      }).success,
    ).toBe(false);
    const completeImpact = impact('impact-complete', 'provisional-tag-core', 'reviewed');
    expect(PreMaterializationCorrectionImpactSchema.safeParse(completeImpact).success).toBe(true);
    expect(
      PreMaterializationCorrectionImpactSchema.safeParse({
        ...completeImpact,
        surfaceAssessments: completeImpact.surfaceAssessments.slice(1),
      }).success,
    ).toBe(false);
  });

  it('allows overlapping composite Tag splits but rejects overlapping Outcome splits', () => {
    const base = createIntegrationMap('accepted');
    const splitEntry = {
      ...base.entries[0],
      action: 'split' as const,
      finalEntityIds: ['tag-core', 'tag-secondary'],
      splitProblemAssignments: [
        {
          finalEntityId: 'tag-core',
          problemIds: [...problemIds],
          evidenceRefs: [
            ...evidenceRefs,
            {
              problemId: 'abc335-g',
              claimPath: '/outcomeCandidates/0',
              evidenceIds: ['evidence-cross-corpus-analysis'],
              sourceRevisionIds: ['source-abc335-g-problem'],
            },
          ],
          representativeProblemIds: ['abc335-g'],
        },
        {
          finalEntityId: 'tag-secondary',
          problemIds: ['abc212-e'],
          evidenceRefs: [evidenceRef(0)],
          representativeProblemIds: ['abc212-e'],
        },
      ],
      decisionEvidence: { completeReclassificationProof: 'Composite Tags may overlap.' },
      legacyDisposition: {
        kind: 'split_aliases' as const,
        fromPreviewEntityId: 'provisional-tag-core',
        targets: [
          { finalEntityId: 'tag-core', aliases: ['core'] },
          { finalEntityId: 'tag-secondary', aliases: ['secondary'] },
        ],
        ambiguousRedirectOmittedReason: 'A composite preview identity has no unique redirect.',
      },
    };
    const tagSubjectBase = { ...base, entries: [splitEntry, ...base.entries.slice(1)] };
    const tagWithSubject = {
      ...tagSubjectBase,
      integrationSubjectDigest: canonicalDigest(integrationSubject(tagSubjectBase)),
    };
    const tagSplit = {
      ...tagWithSubject,
      integrationDigest: digestWithoutField(tagWithSubject, 'integrationDigest'),
    };
    expect(TaxonomyIntegrationMapSchema.safeParse(tagSplit).success).toBe(true);

    const outcomeEntry = {
      ...splitEntry,
      previewEntityId: 'outcome-provisional-core',
      previewEntityKind: 'outcome' as const,
      finalEntityIds: ['outcome-core', 'outcome-secondary'],
      splitProblemAssignments: splitEntry.splitProblemAssignments.map((assignment, index) => ({
        ...assignment,
        finalEntityId: index === 0 ? 'outcome-core' : 'outcome-secondary',
      })),
      legacyDisposition: {
        ...splitEntry.legacyDisposition,
        fromPreviewEntityId: 'outcome-provisional-core',
        targets: [
          { finalEntityId: 'outcome-core', aliases: ['core'] },
          { finalEntityId: 'outcome-secondary', aliases: ['secondary'] },
        ],
      },
    };
    const outcomeSubjectBase = {
      ...base,
      entries: [base.entries[0], outcomeEntry, base.entries[2]],
    };
    const outcomeWithSubject = {
      ...outcomeSubjectBase,
      integrationSubjectDigest: canonicalDigest(integrationSubject(outcomeSubjectBase)),
    };
    const outcomeSplit = {
      ...outcomeWithSubject,
      integrationDigest: digestWithoutField(outcomeWithSubject, 'integrationDigest'),
    };
    expect(TaxonomyIntegrationMapSchema.safeParse(outcomeSplit).success).toBe(false);
  });

  it('keeps the reviewed subject stable while proposal wrapper status changes', () => {
    const proposed = createBuild('proposed');
    const accepted = createBuild('accepted');

    expect(proposed.integrationMap.integrationSubjectDigest).toBe(
      accepted.integrationMap.integrationSubjectDigest,
    );
    expect(proposed.taxonomySubjectDigest).toBe(accepted.taxonomySubjectDigest);
    expect(proposed.integrationMapDigest).not.toBe(accepted.integrationMapDigest);
    expect(proposed.buildDigest).not.toBe(accepted.buildDigest);
  });
});
