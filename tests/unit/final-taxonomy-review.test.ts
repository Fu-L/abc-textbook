import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { z } from 'zod';

import { parseFinalTaxonomyReviewArguments } from '../../scripts/corpus/review-final-taxonomy.js';
import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { FinalTaxonomyBuildSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import type { FinalTaxonomyCandidateSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import {
  FINAL_TAXONOMY_PROBLEM_COUNT,
  FINAL_TAXONOMY_PROPOSED_BUILD_PATH,
  FINAL_TAXONOMY_REVIEW_CHECKS,
  FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
  FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH,
  FINAL_TAXONOMY_WORK_MANIFEST_PATH,
  reviewFinalTaxonomy,
  validateFinalTaxonomyReviewCheckResults,
  type FinalTaxonomyCheckRunner,
} from '../../src/lib/taxonomy/final-taxonomy-review.js';

const manifestSourcePath = path.resolve(
  'docs/work-manifests/initial/us2/final-taxonomy/manifest.json',
);
const reviewedAt = '2026-08-08T18:00:00+09:00';
const temporaryRoots: string[] = [];
const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
});

const writeJson = async (repositoryRoot: string, relativePath: string, value: unknown) => {
  const absolutePath = path.join(repositoryRoot, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const problemIds = Array.from(
  { length: FINAL_TAXONOMY_PROBLEM_COUNT },
  (_value, index) => `abc${String(1000 + index)}-e`,
);
const affectedProblemIds = problemIds.slice(0, 2);
const sourceRevisionIds = affectedProblemIds.map((problemId) => `source-${problemId}-problem`);

const evidenceRef = (index: number) => ({
  problemId: affectedProblemIds[index] ?? affectedProblemIds[0] ?? 'abc1000-e',
  claimPath: '/outcomeCandidates/0',
  evidenceIds: ['evidence-official-analysis'],
  sourceRevisionIds: [
    sourceRevisionIds[index] ?? sourceRevisionIds[0] ?? 'source-abc1000-e-problem',
  ],
});
const evidenceRefs = [evidenceRef(0), evidenceRef(1)];

const provisionalCandidate = (
  previewEntityId: string,
  previewEntityKind: 'tag' | 'outcome' | 'unit',
) => ({
  previewEntityId,
  previewEntityKind,
  affectedProblemIds,
  rationale: 'The frozen preview entity requires a full-corpus decision.',
  evidenceIds: sourceRevisionIds,
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
) => ({
  previewEntityId,
  previewEntityKind,
  affectedProblemIds,
  rationale: 'The complete corpus supports this reusable final entity.',
  evidenceRefs,
  correctionImpactIds: [impactId],
  reviewPolicy: {
    requiredMode: 'third_party' as const,
    riskReasons: ['major_classification_change' as const],
  },
  reviewEvidenceId: null,
  status: 'proposed' as const,
  action: 'promote' as const,
  finalEntityIds: [finalEntityId],
  splitProblemAssignments: [],
  decisionEvidence: {
    fullInventoryComparison: 'The full inventory confirms the reusable target.',
    representativeProblemIds: affectedProblemIds,
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

const createIntegrationMap = (primaryOutcomeId: string) => {
  const provisionalEvidence = {
    schemaVersion: '1.0.0' as const,
    evidenceId: 'preview-initial-v1-taxonomy-integration',
    previewId: 'initial-v1',
    status: 'evidence_frozen' as const,
    taxonomyDigest: '1'.repeat(64),
    inventoryComponentDigest: '2'.repeat(64),
    classificationsDigest: '3'.repeat(64),
    proposalDigest: '4'.repeat(64),
    finalDecisionTask: 'T159' as const,
    canonicalMaterializationAllowed: false as const,
    candidates: [
      provisionalCandidate('provisional-tag-core', 'tag'),
      provisionalCandidate('outcome-provisional-core', 'outcome'),
      provisionalCandidate('provisional-unit-core', 'unit'),
    ],
    integrationDigest: '5'.repeat(64),
  };
  const subject = {
    schemaVersion: '2.0.0' as const,
    evidenceId: 'final-taxonomy-integration-initial',
    previewId: 'initial-v1',
    inventoryDigest: '6'.repeat(64),
    previewSnapshotDigest: '7'.repeat(64),
    provisionalEvidence,
    entries: [
      integrationEntry('provisional-tag-core', 'tag', 'tag-core', 'impact-preview-tag-core'),
      integrationEntry(
        'outcome-provisional-core',
        'outcome',
        primaryOutcomeId,
        'impact-preview-outcome-core',
      ),
      integrationEntry('provisional-unit-core', 'unit', 'unit-core', 'impact-preview-unit-core'),
    ],
    status: 'proposed' as const,
    canonicalMaterializationAllowed: false as const,
    integrationSubjectDigest: '',
  };
  const withSubject = {
    ...subject,
    integrationSubjectDigest: canonicalDigest(integrationSubject(subject)),
    integrationDigest: '0'.repeat(64),
  };
  return {
    ...withSubject,
    integrationDigest: digestWithoutField(withSubject, 'integrationDigest'),
  };
};

const createImpact = (id: string, previewEntityId: string) => {
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
    sourceRevisionIds,
    changeSummary: 'Replace the provisional identity and reassess dependent surfaces.',
    affectedProblemIds,
    affectedLearningUnitCandidateIds: ['unit-core'],
    surfaceAssessments: [
      ...affectedProblemIds.flatMap((problemId, index) =>
        problemSurfaces.map((surface) => ({
          ownerType: 'problem' as const,
          problemId,
          surface,
          disposition: 'materialize_change' as const,
          rationale: `${problemId} ${surface} consumes the accepted taxonomy.`,
          evidenceRefs: [evidenceRef(index)],
        })),
      ),
      ...unitSurfaces.map((surface) => ({
        ownerType: 'learning_unit_candidate' as const,
        learningUnitId: 'unit-core',
        surface,
        disposition: 'materialize_change' as const,
        rationale: `The Learning Unit ${surface} consumes the accepted taxonomy.`,
        evidenceRefs,
      })),
      {
        ownerType: 'derived_index' as const,
        path: 'docs/verification/bootstrap/final-taxonomy-index.json',
        surface: 'index' as const,
        disposition: 'materialize_change' as const,
        rationale: 'The derived index is rebuilt from accepted identities.',
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
    verificationStatus: 'pending' as const,
    impactSubjectDigest: canonicalDigest(subject),
  };
};

const createBuild = (
  manifest: z.infer<typeof ContentWorkManifestSchema>,
): z.input<typeof FinalTaxonomyBuildSchema> => {
  const outcomeIds = [...manifest.learningOutcomeIds];
  const integrationMap = createIntegrationMap(outcomeIds[0] ?? 'outcome-core');
  const candidates: z.input<typeof FinalTaxonomyCandidateSchema>[] = [
    {
      kind: 'tag',
      entity: {
        id: 'tag-algorithms',
        name: 'Algorithms',
        definition: 'A hierarchy root used only for supporting navigation.',
        parentId: null,
        prerequisiteTagIds: [],
        learningOutcomeIds: outcomeIds,
        representativeProblemIds: affectedProblemIds,
        aliases: [],
        formerNames: [],
        lifecycle: 'active',
        replacementTagIds: [],
      },
      sourceRevisionIds,
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
        learningOutcomeIds: outcomeIds,
        representativeProblemIds: affectedProblemIds,
        aliases: [],
        formerNames: [],
        lifecycle: 'active',
        replacementTagIds: [],
      },
      sourceRevisionIds,
      evidenceRefs,
      materializationTask: 'T047',
    },
    ...outcomeIds.map((outcomeId) => ({
      kind: 'outcome' as const,
      entity: {
        id: outcomeId,
        statement: `Demonstrate the observable skill ${outcomeId}.`,
        prerequisiteOutcomeIds: [],
        scopeIds: ['unit-core'],
      },
      sourceRevisionIds,
      evidenceRefs,
      materializationTask: 'T048' as const,
    })),
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
        sourceRevisionIds,
        tagIds: ['tag-algorithms', 'tag-core'],
        learningOutcomeIds: outcomeIds,
        problemIds,
        stageRank: 0,
        difficultyRank: 0,
        representativeRank: 0,
        globalIndex: 0,
        orderReason: 'The single fixture Unit is first.',
      },
      sourceRevisionIds,
      evidenceRefs,
      materializationTask: 'T050',
    },
  ];
  const placements = problemIds.map((problemId) => ({
    id: `placement-${problemId}`,
    problemId,
    policyVersion: '1.0.0',
    kind: 'full' as const,
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
    supportingTagIds: ['tag-algorithms'],
    primaryOutcomeId: outcomeIds[0] ?? 'outcome-core',
    supportingOutcomeIds: [],
    learningUnitIds: ['unit-core'],
    presentationUnitId: 'unit-core',
    adHocElements: [],
    claimDispositions: [
      {
        claimRef: {
          ...evidenceRef(0),
          problemId,
        },
        kind: 'primary' as const,
        tagIds: ['tag-core'],
        rationale: 'The fixture claim directly supports the primary Tag.',
      },
    ],
    analysisEvidenceRefs: [evidenceRef(0)],
  }));
  const correctionImpacts = [
    createImpact('impact-preview-tag-core', 'provisional-tag-core'),
    createImpact('impact-preview-outcome-core', 'outcome-provisional-core'),
    createImpact('impact-preview-unit-core', 'provisional-unit-core'),
  ];
  const inputs = {
    inventory: {
      evidencePath: 'docs/verification/bootstrap/technique-inventory.json',
      evidenceDigest: '8'.repeat(64),
      inventoryDigest: integrationMap.inventoryDigest,
      corpusDigest: '9'.repeat(64),
      authoringEvidencePath: 'docs/verification/bootstrap/technique-inventory-authoring.json',
      authoringEvidenceDigest: 'a'.repeat(64),
      authoringInventoryDigest: 'b'.repeat(64),
      normalizedSourceSetDigest: 'c'.repeat(64),
    },
    previewSnapshot: {
      path: `staging/previews/initial-v1/snapshots/${integrationMap.previewSnapshotDigest}.json`,
      referencePath: `docs/verification/previews/initial-v1/preview-join/${integrationMap.previewSnapshotDigest}.json`,
      joinDigest: integrationMap.previewSnapshotDigest,
      canonicalSnapshotDigest: 'd'.repeat(64),
      transactionId: `preview-snapshot:initial-v1:${integrationMap.previewSnapshotDigest}`,
      status: 'passed' as const,
    },
    integrationMapPath: 'docs/verification/previews/initial-v1/taxonomy-integration.json',
  };
  const policy = {
    name: 'corpus-first-final-taxonomy',
    version: '1.0.0',
    inputScope: 'ABC 212 through ABC 466 advanced Problems',
    rulesDigest: 'e'.repeat(64),
    requiredReviewMode: 'third_party' as const,
    riskReasons: ['major_classification_change' as const],
    authoringSkillName: 'abc-explanation-author',
    authoringSkillVersion: '1.1.1',
    authoringSkillDigest: 'f'.repeat(64),
    writingPolicyPath: '.agents/skills/abc-explanation-author/references/writing-policy.md',
    writingPolicyDigest: '1'.repeat(64),
    sourceNormalizationVersion: '1.0.0',
    workManifestPath: FINAL_TAXONOMY_WORK_MANIFEST_PATH,
    workManifestDigest: manifest.digest,
  };
  const subject = {
    inputs,
    policy,
    integrationSubjectDigest: integrationMap.integrationSubjectDigest,
    finalCandidates: candidates,
    tagPrerequisites: [],
    learningUnitPrerequisites: [],
    standardOrder: ['unit-core'],
    placements,
    correctionImpacts: correctionImpacts.map((impact) =>
      Object.fromEntries(
        Object.entries(impact).filter(([field]) => field !== 'verificationStatus'),
      ),
    ),
    sourceRevisionIds,
  };
  const beforeDigest = {
    schemaVersion: '2.0.0' as const,
    id: 'final-taxonomy-build-initial',
    generatedAt: reviewedAt,
    inputs,
    policy,
    integrationMap,
    integrationMapDigest: integrationMap.integrationDigest,
    finalCandidates: candidates,
    tagPrerequisites: [],
    learningUnitPrerequisites: [],
    standardOrder: ['unit-core'],
    placements,
    correctionImpacts,
    sourceRevisionIds,
    reviewEvidenceRefs: [],
    taxonomySubjectDigest: canonicalDigest(subject),
    taxonomyDigest: canonicalDigest(candidates),
    tagDagDigest: canonicalDigest([]),
    learningUnitDagDigest: canonicalDigest([]),
    orderDigest: canonicalDigest(['unit-core']),
    placementDigest: canonicalDigest(placements),
    correctionImpactDigest: canonicalDigest(correctionImpacts),
    status: 'proposed' as const,
    acceptedAt: null,
    holdReasons: ['CURRENT_SUBJECT_THIRD_PARTY_REVIEW_MISSING_OR_STALE'],
    canonicalMaterializationAllowed: false,
    buildDigest: '0'.repeat(64),
  };
  return {
    ...beforeDigest,
    buildDigest: digestWithoutField(beforeDigest, 'buildDigest'),
  };
};

const createRepository = async () => {
  const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), 'final-taxonomy-review-'));
  temporaryRoots.push(repositoryRoot);
  const manifest = ContentWorkManifestSchema.parse(
    JSON.parse(await readFile(manifestSourcePath, 'utf8')),
  );
  const build = FinalTaxonomyBuildSchema.parse(createBuild(manifest));
  await Promise.all([
    writeJson(repositoryRoot, FINAL_TAXONOMY_WORK_MANIFEST_PATH, manifest),
    writeJson(repositoryRoot, FINAL_TAXONOMY_PROPOSED_BUILD_PATH, build),
  ]);
  return { repositoryRoot, manifest, build };
};

const passingRunner = (): FinalTaxonomyCheckRunner => (check) =>
  Promise.resolve({
    exitCode: 0,
    stdout: `${check.checkId}: passed\n`,
    stderr: '',
  });

describe('T159 explicit third-party taxonomy review', () => {
  it('requires explicit approval, a supplied person ID, and exactly one nonempty basis source', async () => {
    expect(() =>
      parseFinalTaxonomyReviewArguments([
        '--reviewer-id',
        'person-independent-reviewer',
        '--review-basis',
        'Reviewed all decisions.',
      ]),
    ).toThrow(/FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID/u);
    expect(() =>
      parseFinalTaxonomyReviewArguments([
        '--reviewer-id',
        'person-independent-reviewer',
        '--approve',
        '--review-basis',
        'Reviewed all decisions.',
        '--review-basis-file',
        'review.md',
      ]),
    ).toThrow(/FINAL_TAXONOMY_REVIEW_ARGUMENTS_INVALID/u);
    await expect(
      reviewFinalTaxonomy({
        reviewerId: 'person-independent-reviewer',
        approve: false,
        reviewBasis: 'Reviewed all decisions.',
      }),
    ).rejects.toThrow(/FINAL_TAXONOMY_EXPLICIT_APPROVAL_REQUIRED/u);
    await expect(
      reviewFinalTaxonomy({
        reviewerId: 'person-independent-reviewer',
        approve: true,
        reviewBasis: '   ',
      }),
    ).rejects.toThrow(/FINAL_TAXONOMY_REVIEW_BASIS_REQUIRED/u);
  });

  it('rejects the manifest owner instead of inventing or accepting a same-author reviewer', async () => {
    const { repositoryRoot } = await createRepository();
    const runCheck = vi.fn(passingRunner());

    await expect(
      reviewFinalTaxonomy({
        repositoryRoot,
        reviewerId: 'person-maintainer',
        approve: true,
        reviewBasis: 'I reviewed the taxonomy.',
        runCheck,
        now: () => reviewedAt,
      }),
    ).rejects.toThrow(/FINAL_TAXONOMY_THIRD_PARTY_REVIEWER_REQUIRED/u);
    expect(runCheck).not.toHaveBeenCalled();
  });

  it('binds the manifest-declared Outcome set, both manifest paths, the proposed subject, and four exact checks', async () => {
    const { repositoryRoot, manifest, build } = await createRepository();
    const runCheck = vi.fn(passingRunner());
    const input = {
      repositoryRoot,
      reviewerId: 'person-independent-reviewer',
      approve: true,
      reviewBasis:
        'Compared every promote/merge/split/retire decision, placement, DAG, order, and correction surface with the frozen source-backed inventory.',
      runCheck,
      now: () => reviewedAt,
    } as const;

    await expect(
      access(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH)),
    ).rejects.toThrow();
    const first = await reviewFinalTaxonomy(input);
    expect(first.written).toBe(true);
    expect(first.evidence.subjectDigest).toBe(build.taxonomySubjectDigest);
    expect(first.evidence.reviewer).toEqual({
      personId: 'person-independent-reviewer',
      mode: 'third_party',
    });
    expect(first.evidence.outcomeCoverageReview.learningOutcomeIds).toEqual(
      [...manifest.learningOutcomeIds].sort(compareCodeUnits),
    );
    expect(first.evidence.outcomeCoverageReview.subjectPaths).toEqual([
      'docs/verification/previews/initial-v1/taxonomy-integration.json',
      'staging/taxonomy/initial/final-taxonomy-build.json',
    ]);
    expect(
      first.evidence.applicableChecks.map(({ checkId, command }) => ({ checkId, command })),
    ).toEqual(FINAL_TAXONOMY_REVIEW_CHECKS);
    expect(first.evidence.reviewItems[0]?.reviewItemId).toBe(
      'human-review-item-ru-t159-final-taxonomy',
    );
    expect(first.checkResultsPath).toBe(FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH);
    expect(
      first.evidence.applicableChecks.every(
        ({ resultPath }) => resultPath === FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH,
      ),
    ).toBe(true);
    const aggregate = JSON.parse(
      await readFile(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH), 'utf8'),
    ) as unknown;
    expect(
      validateFinalTaxonomyReviewCheckResults(aggregate, {
        taxonomySubjectDigest: build.taxonomySubjectDigest,
        reviewerId: 'person-independent-reviewer',
      }).results,
    ).toHaveLength(4);
    expect(runCheck).toHaveBeenCalledTimes(4);
    const evidenceBytes = await readFile(
      path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH),
      'utf8',
    );

    const second = await reviewFinalTaxonomy(input);
    expect(second.written).toBe(false);
    expect(runCheck).toHaveBeenCalledTimes(4);
    expect(
      await readFile(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH), 'utf8'),
    ).toBe(evidenceBytes);
  });

  it('rejects aggregate results that no longer match the reviewed subject', async () => {
    const { repositoryRoot, build } = await createRepository();
    const input = {
      repositoryRoot,
      reviewerId: 'person-independent-reviewer',
      approve: true,
      reviewBasis: 'Reviewed the proposed taxonomy.',
      runCheck: passingRunner(),
      now: () => reviewedAt,
    } as const;
    await reviewFinalTaxonomy(input);
    const aggregate = JSON.parse(
      await readFile(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH), 'utf8'),
    ) as Record<string, unknown>;
    await writeJson(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH, {
      ...aggregate,
      taxonomySubjectDigest: build.taxonomySubjectDigest.replace(/^./u, 'f'),
    });
    await expect(reviewFinalTaxonomy(input)).rejects.toThrow(
      /FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_STALE/u,
    );
  });

  it('rechecks the immutable proposal after commands and withholds evidence on drift or failure', async () => {
    const { repositoryRoot, build } = await createRepository();
    let invocation = 0;
    const mutatingRunner: FinalTaxonomyCheckRunner = async (check) => {
      invocation += 1;
      if (invocation === FINAL_TAXONOMY_REVIEW_CHECKS.length) {
        const placements = structuredClone(build.placements);
        const firstPlacement = placements[0];
        if (firstPlacement === undefined) throw new Error('Expected a placement.');
        firstPlacement.rationale = 'Changed during review.';
        await writeJson(repositoryRoot, FINAL_TAXONOMY_PROPOSED_BUILD_PATH, {
          ...build,
          placements,
        });
      }
      return { exitCode: 0, stdout: check.checkId, stderr: '' };
    };
    await expect(
      reviewFinalTaxonomy({
        repositoryRoot,
        reviewerId: 'person-independent-reviewer',
        approve: true,
        reviewBasis: 'Reviewed the proposed taxonomy.',
        runCheck: mutatingRunner,
        now: () => reviewedAt,
      }),
    ).rejects.toThrow();
    await expect(
      access(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH)),
    ).rejects.toThrow();

    const second = await createRepository();
    await expect(
      reviewFinalTaxonomy({
        repositoryRoot: second.repositoryRoot,
        reviewerId: 'person-independent-reviewer',
        approve: true,
        reviewBasis: 'Reviewed the proposed taxonomy.',
        runCheck: () => Promise.resolve({ exitCode: 1, stdout: '', stderr: 'failure' }),
        now: () => reviewedAt,
      }),
    ).rejects.toThrow(/FINAL_TAXONOMY_REVIEW_CHECK_FAILED/u);
    await expect(
      access(path.join(second.repositoryRoot, FINAL_TAXONOMY_REVIEW_EVIDENCE_PATH)),
    ).rejects.toThrow();
  });

  it('writes no partial aggregate, so a failed reviewer does not block a later reviewer', async () => {
    const { repositoryRoot } = await createRepository();
    let firstReviewerInvocation = 0;
    await expect(
      reviewFinalTaxonomy({
        repositoryRoot,
        reviewerId: 'person-first-reviewer',
        approve: true,
        reviewBasis: 'First independent review attempt.',
        runCheck: (check) => {
          firstReviewerInvocation += 1;
          return Promise.resolve({
            exitCode: firstReviewerInvocation === 2 ? 1 : 0,
            stdout: check.checkId,
            stderr: firstReviewerInvocation === 2 ? 'failed' : '',
          });
        },
        now: () => reviewedAt,
      }),
    ).rejects.toThrow(/FINAL_TAXONOMY_REVIEW_CHECK_FAILED/u);
    await expect(
      access(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH)),
    ).rejects.toThrow();

    const second = await reviewFinalTaxonomy({
      repositoryRoot,
      reviewerId: 'person-second-reviewer',
      approve: true,
      reviewBasis: 'Second independent review completed from the frozen subject.',
      runCheck: passingRunner(),
      now: () => reviewedAt,
    });
    expect(second.written).toBe(true);
    expect(second.checkResultsPath).toBe(FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH);
    const aggregate = JSON.parse(
      await readFile(path.join(repositoryRoot, FINAL_TAXONOMY_REVIEW_CHECK_RESULTS_PATH), 'utf8'),
    ) as { reviewerId?: unknown };
    expect(aggregate.reviewerId).toBe('person-second-reviewer');
  });
});
