import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { enumerateCorrectionImpacts } from '../../scripts/update-abc/correction-impact.js';
import {
  isProductionReleaseEligible,
  verifyPreviewReleaseSimulation,
} from '../../scripts/verify-release.js';
import { deriveFrozenClassification } from '../../scripts/update-abc/classify.js';
import { validatePreviewUpdateReview } from '../../scripts/review-update.js';
import {
  persistPublicationUpdate,
  resumeUpdate,
  runUpdatePipeline,
} from '../../scripts/update-abc/index.js';
import { validatePreparedUpdate } from '../../scripts/update-abc/validate.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import {
  CanonicalProblemPlacementPolicySchema,
  CorrectionImpactSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { HumanContentReviewEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  componentEvidenceDigest,
  componentSubjectDigest,
  type ComponentEvidence,
} from '../../src/lib/preview/preview-snapshot.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';
import { runSmallBatchUpdate } from '../../scripts/update-abc/index.js';
import { smallBatchInput, authorSmallBatch, contentHashes } from '../fixtures/small-batch.js';

const json = async (relativePath: string): Promise<unknown> =>
  JSON.parse(await readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8')) as unknown;

describe('US5 update validation', () => {
  const updateId = 'update-2661fc1615b0f12e3619aedd';
  const evidencePath =
    'docs/reviews/human-content/previews/initial-v1/us5/update-simulation-review.json';
  const componentPath = 'docs/verification/previews/initial-v1/components/update-simulation.json';
  const reviewValidationPaths = [
    evidencePath,
    'docs/work-manifests/initial/us5/manifest.json',
    componentPath,
    'staging/previews/initial-v1/release-simulation/verification.json',
    `staging/previews/initial-v1/release-simulation/${updateId}/manifest.json`,
    'staging/previews/initial-v1/preview-manifest.json',
    'staging/previews/initial-v1/candidate-pool.json',
    'staging/previews/initial-v1/taxonomy/index.json',
    'docs/verification/authoring-skill/initial-v1/skill-manifest.json',
    'src/content/sources/authoring/initial-v1.json',
  ];

  const copyReviewValidationArtifacts = async (outputRoot: string): Promise<void> => {
    for (const relativePath of reviewValidationPaths) {
      const destination = path.join(outputRoot, relativePath);
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(new URL(`../../${relativePath}`, import.meta.url), destination);
    }
  };

  it('enumerates every affected content and derived index surface', () => {
    const impact = enumerateCorrectionImpacts({
      correctionId: 'correction-abc500-e',
      sourceRevisionId: 'source-abc500-e',
      problemIds: ['abc500-e'],
      changedBlocks: ['explanation', 'example'],
      locators: [
        {
          problemId: 'abc500-e',
          learningUnitId: 'unit-abc500-e',
          exampleKey: 'worked-example',
          exerciseKey: 'practice',
          indexPaths: ['staging/previews/initial-v1/taxonomy/index.json'],
        },
      ],
    });
    expect(CorrectionImpactSchema.parse(impact)).toEqual(impact);
    expect(impact.affectedContentLocators).toHaveLength(4);
  });

  it('reports cycle, reachability, and index failures per Problem', () => {
    const result = validatePreparedUpdate({
      problems: [
        {
          problemId: 'abc500-e',
          sourceAvailable: true,
          explanationComplete: true,
          examplesValid: true,
          placementIds: ['placement-abc500-e'],
          crossReferencesValid: true,
        },
      ],
      taxonomyEdges: [
        ['outcome-a', 'outcome-b'],
        ['outcome-b', 'outcome-a'],
      ],
      reachableProblemIds: [],
      indexedProblemIds: [],
      catalogProblemIds: ['abc500-e'],
    });
    expect(result.problemResults[0]?.findingCodes).toEqual(
      expect.arrayContaining(['DEPENDENCY_CYCLE', 'PROBLEM_UNREACHABLE', 'INDEX_MISSING']),
    );
    expect(result.aggregatePassed).toBe(false);
  });

  it('derives classification mappings and DAG edges from frozen artifacts', () => {
    const base = {
      selectedProblemIds: ['abc500-e'],
      candidates: [
        {
          problemId: 'abc500-e',
          sourceRevisionIds: ['source-abc500-e'],
          classifications: [
            {
              domain: 'graphs',
              outcomeId: 'outcome-candidate-graphs',
              sourceRevisionIds: ['source-abc500-e'],
              rationale: 'Shortest paths.',
            },
          ],
        },
      ],
      groups: [
        {
          domain: 'graphs',
          candidateOutcomeId: 'outcome-candidate-graphs',
          problemIds: ['abc500-e'],
          sourceRevisionIds: ['source-abc500-e'],
          tag: { id: 'tag-graphs', prerequisiteTagIds: ['tag-basics'] },
          outcome: { id: 'outcome-graphs', prerequisiteOutcomeIds: ['outcome-basics'] },
          unit: { id: 'unit-graphs', prerequisiteUnitIds: ['unit-basics'] },
          placements: [
            {
              problemId: 'abc500-e',
              tagIds: ['tag-graphs'],
              outcomeIds: ['outcome-graphs'],
              unitIds: ['unit-graphs'],
              sourceRevisionIds: ['source-abc500-e'],
              classificationRationale: 'Shortest paths.',
            },
          ],
        },
      ],
      index: {
        problemIds: ['abc500-e'],
        tags: [
          { id: 'tag-basics', prerequisiteTagIds: [] },
          { id: 'tag-graphs', prerequisiteTagIds: ['tag-basics'] },
        ],
        outcomes: [
          { id: 'outcome-basics', prerequisiteOutcomeIds: [] },
          { id: 'outcome-graphs', prerequisiteOutcomeIds: ['outcome-basics'] },
        ],
        units: [
          { id: 'unit-basics', prerequisiteUnitIds: [] },
          { id: 'unit-graphs', prerequisiteUnitIds: ['unit-basics'] },
        ],
        placements: [
          {
            problemId: 'abc500-e',
            tagIds: ['tag-graphs'],
            outcomeIds: ['outcome-graphs'],
            unitIds: ['unit-graphs'],
            sourceRevisionIds: ['source-abc500-e'],
            classificationRationale: 'Shortest paths.',
          },
        ],
        standardUnitOrder: ['unit-basics', 'unit-graphs'],
      },
    } as const;
    expect(deriveFrozenClassification(base)).toMatchObject({
      proposals: [],
      validProblemIds: ['abc500-e'],
      taxonomyEdges: [
        ['tag-basics', 'tag-graphs'],
        ['outcome-basics', 'outcome-graphs'],
        ['unit-basics', 'unit-graphs'],
      ],
    });
    const broken = {
      ...base,
      candidates: [
        {
          ...base.candidates[0],
          classifications: [
            { ...base.candidates[0].classifications[0], outcomeId: 'outcome-missing' },
          ],
        },
      ],
    };
    expect(deriveFrozenClassification(broken)).toMatchObject({
      validProblemIds: [],
      proposals: [expect.objectContaining({ problemId: 'abc500-e' })],
    });
    const danglingPrerequisite = {
      ...base,
      index: {
        ...base.index,
        tags: [base.index.tags[0], { ...base.index.tags[1], prerequisiteTagIds: ['tag-missing'] }],
      },
    };
    expect(deriveFrozenClassification(danglingPrerequisite)).toMatchObject({
      taxonomyValid: false,
      validProblemIds: [],
    });
  });

  it('never admits fixture updates through the production release gate', () => {
    expect(isProductionReleaseEligible({ state: 'ELIGIBLE_FOR_BATCH', fixtureMode: true })).toBe(
      false,
    );
    expect(isProductionReleaseEligible({ state: 'ELIGIBLE_FOR_BATCH', fixtureMode: false })).toBe(
      true,
    );
  });

  it('rejects review evidence whose trusted review-item scope was replaced', async () => {
    const outputRoot = await mkdtemp(path.join(tmpdir(), 'abc-review-scope-'));
    try {
      await copyReviewValidationArtifacts(outputRoot);
      const evidence = JSON.parse(await readFile(path.join(outputRoot, evidencePath), 'utf8')) as {
        evidenceDigest: string;
        reviewItems: { reviewItemId: string }[];
        [key: string]: unknown;
      };
      const firstItem = evidence.reviewItems[0];
      if (!firstItem) throw new Error('Review fixture has no review items.');
      firstItem.reviewItemId = 'human-review-item-replaced';
      const subject = Object.fromEntries(
        Object.entries(evidence).filter(([key]) => key !== 'evidenceDigest'),
      );
      evidence.evidenceDigest = canonicalDigest(subject);
      await writeFile(path.join(outputRoot, evidencePath), `${JSON.stringify(evidence)}\n`);
      await expect(
        validatePreviewUpdateReview({
          updateId,
          evidencePath,
          repositoryRoot: outputRoot,
        }),
      ).rejects.toThrow('REVIEW_ITEM_INVENTORY_INVALID');
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it('rejects a changed historical skill subject without depending on current instructions', async () => {
    const outputRoot = await mkdtemp(path.join(tmpdir(), 'abc-review-old-skill-'));
    try {
      await copyReviewValidationArtifacts(outputRoot);
      const manifestPath = 'docs/verification/authoring-skill/initial-v1/skill-manifest.json';
      const manifest = JSON.parse(await readFile(path.join(outputRoot, manifestPath), 'utf8')) as {
        artifacts: { digest: string }[];
      };
      const artifact = manifest.artifacts[0];
      if (!artifact) throw new Error('Missing historical artifact subject.');
      artifact.digest = '0'.repeat(64);
      await writeFile(path.join(outputRoot, manifestPath), JSON.stringify(manifest));
      await expect(
        validatePreviewUpdateReview({ updateId, evidencePath, repositoryRoot: outputRoot }),
      ).rejects.toThrow('REVIEW_COMPONENT_SUBJECT_DIGEST_MISMATCH');
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it('rejects stale component evidence digests', async () => {
    const outputRoot = await mkdtemp(path.join(tmpdir(), 'abc-review-component-'));
    try {
      await copyReviewValidationArtifacts(outputRoot);
      const component = JSON.parse(
        await readFile(path.join(outputRoot, componentPath), 'utf8'),
      ) as ComponentEvidence;
      await writeFile(
        path.join(outputRoot, componentPath),
        `${JSON.stringify({ ...component, componentDigest: '0'.repeat(64) })}\n`,
      );
      await expect(
        validatePreviewUpdateReview({
          updateId,
          evidencePath,
          repositoryRoot: outputRoot,
        }),
      ).rejects.toThrow('REVIEW_COMPONENT_SUBJECT_DIGEST_MISMATCH');
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it('resumes an on-hold operation without changing its update identity', async () => {
    const held = await runUpdatePipeline({ fixture: 'initial-v1', failAt: 'validate' });
    expect(held.state).toBe('ON_HOLD');
    const resumed = await resumeUpdate(held, { fixture: 'initial-v1' });
    expect(resumed.updateId).toBe(held.updateId);
    expect(resumed.state).toBe('ON_HOLD');
    expect(resumed.holdReasons).toEqual(['AUTHORING_REQUIRED']);
    expect(resumed.blockingFindingCount).toBe(0);
    expect(PublicationUpdateSchema.parse(resumed.publicationUpdate).updateId).toBe(held.updateId);
  });

  it('rejects resume when the persisted source fingerprint is stale', async () => {
    const held = await runUpdatePipeline({ fixture: 'initial-v1' });
    await expect(
      runUpdatePipeline({
        fixture: 'initial-v1',
        resume: { updateId: held.updateId, sourceSetFingerprint: '0'.repeat(64) },
      }),
    ).rejects.toThrow('RESUME_INPUT_MISMATCH');
  });

  it('persists a validated resume transition for the same immutable input identity', async () => {
    const outputRoot = await mkdtemp(path.join(tmpdir(), 'abc-update-resume-'));
    try {
      const held = await runUpdatePipeline({ fixture: 'initial-v1', failAt: 'validate' });
      await persistPublicationUpdate(held, outputRoot);
      const resumed = await resumeUpdate(held, { fixture: 'initial-v1' });
      await expect(persistPublicationUpdate(resumed, outputRoot)).resolves.toBeUndefined();
      const saved = PublicationUpdateSchema.parse(
        JSON.parse(await readFile(path.join(outputRoot, resumed.resultPath), 'utf8')) as unknown,
      );
      expect(saved.validationSummary.aggregatePassed).toBe(true);
      expect(saved.updateId).toBe(held.updateId);
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it('freezes canonical update, work-manifest, review, and component evidence contracts', async () => {
    const update = PublicationUpdateSchema.parse(
      await json(
        'staging/previews/initial-v1/release-simulation/update-2661fc1615b0f12e3619aedd/manifest.json',
      ),
    );
    expect(update.authoringResults).toHaveLength(8);
    expect(
      update.authoringResults.every(({ resultType }) => resultType === 'authoring_required'),
    ).toBe(true);
    expect(update.operations.filter(({ entityType }) => entityType === 'contest')).toHaveLength(8);
    expect(update.operations.filter(({ entityType }) => entityType === 'problem')).toHaveLength(8);
    expect(update.operations.filter(({ entityType }) => entityType === 'source')).toHaveLength(16);

    const workManifest = await json('docs/work-manifests/initial/us5/manifest.json');
    expect(() => {
      validateContentWorkManifest(workManifest);
    }).not.toThrow();

    const review = HumanContentReviewEvidenceSchema.parse(
      await json(
        'docs/reviews/human-content/previews/initial-v1/us5/update-simulation-review.json',
      ),
    );
    const { evidenceDigest, ...reviewSubject } = review;
    expect(canonicalDigest(reviewSubject)).toBe(evidenceDigest);
    const verification = await json(
      'staging/previews/initial-v1/release-simulation/verification.json',
    );
    expect(
      review.applicableChecks.every(
        (check) => check.resultDigest === canonicalDigest(verification),
      ),
    ).toBe(true);
    expect(
      review.applicableChecks.every((check) => check.command.includes('--simulation-only')),
    ).toBe(true);

    const component = (await json(
      'docs/verification/previews/initial-v1/components/update-simulation.json',
    )) as ComponentEvidence;
    const { componentDigest, ...componentSubject } = component;
    const {
      subjectDigest,
      checkResults: _checkResults,
      reviewEvidence: _reviewEvidence,
      ...currentSubject
    } = componentSubject;
    void _checkResults;
    void _reviewEvidence;
    expect(componentSubjectDigest(currentSubject)).toBe(subjectDigest);
    expect(componentEvidenceDigest(componentSubject)).toBe(componentDigest);
    expect(component.artifactDigest).toBe(canonicalDigest(verification));
    await expect(
      validatePreviewUpdateReview({
        updateId: update.updateId,
        evidencePath,
      }),
    ).resolves.toMatchObject({ aggregatePassed: true });
    expect(
      await verifyPreviewReleaseSimulation({
        previewId: 'initial-v1',
        update: { updateId: update.updateId, publicationUpdate: update },
        executeSimulation: () =>
          Promise.resolve({ updateId: update.updateId, publicationUpdate: update }),
      }),
    ).toEqual(verification);
  });

  it('fails release simulation when an operation artifact is missing or stale', async () => {
    const update = PublicationUpdateSchema.parse(
      await json(
        'staging/previews/initial-v1/release-simulation/update-2661fc1615b0f12e3619aedd/manifest.json',
      ),
    );
    const broken = {
      ...update,
      operations: update.operations.map((operation, index) =>
        index === 0
          ? { ...operation, path: 'staging/previews/initial-v1/missing.json' }
          : operation,
      ),
    };
    const result = await verifyPreviewReleaseSimulation({
      previewId: 'initial-v1',
      update: { updateId: update.updateId, publicationUpdate: broken },
      executeSimulation: () =>
        Promise.resolve({ updateId: update.updateId, publicationUpdate: broken }),
    });
    expect(result).toMatchObject({ stagingClosed: false, aggregatePassed: false });
    expect(result.findings).toContain(
      'OPERATION_ARTIFACT_UNREADABLE:staging/previews/initial-v1/missing.json',
    );
  });
});

describe('normal batch holds', () => {
  // Multiple complete-corpus validations share the CI runner with legacy fixtures.
  it('holds incomplete/source-failed input without applying part of a batch', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-batch-hold-'));
    try {
      const input = await smallBatchInput(root);
      const snapshot = () => contentHashes(root);
      const before = await snapshot();
      const failed = {
        ...input.metadataBatch,
        sourceRevisions: input.metadataBatch.sourceRevisions.slice(1),
      };
      expect(
        await runSmallBatchUpdate({ ...input, metadataBatch: failed, mode: 'prepare' }),
      ).toMatchObject({ status: 'on_hold', writtenPaths: [] });
      expect(await snapshot()).toEqual(before);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      const prepared = await snapshot();
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        holds: [
          expect.objectContaining({
            code: 'AUTHORING_REQUIRED',
            retryCondition: expect.any(String) as unknown,
          }),
        ],
        writtenPaths: [],
      });
      expect(await snapshot()).toEqual(prepared);
      await authorSmallBatch(input);
      const file = path.join(root, 'src/content/docs/problems/abc467-i.md');
      const text = await readFile(file, 'utf8');
      await writeFile(
        file,
        text.replaceAll('"verificationStatus":"verified"', '"verificationStatus":"unverified"'),
      );
      const authored = await snapshot();
      const held = await runSmallBatchUpdate({ ...input, mode: 'validate' });
      expect(held).toMatchObject({ status: 'on_hold', writtenPaths: [] });
      expect(held.holds[0]?.reason).toContain('CLAIM_HOLD');
      expect(await snapshot()).toEqual(authored);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 300_000);

  it('holds role mismatches and lost analysis without applying derived content', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-batch-analysis-'));
    try {
      const input = await smallBatchInput(root);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      await authorSmallBatch(input);
      const policyFile = path.join(root, 'src/content/policies/problem-placements.json');
      const originalPolicy = await readFile(policyFile);
      const documentFile = path.join(root, 'src/content/docs/problems/abc467-e.md');
      const originalDocument = await readFile(documentFile, 'utf8');
      const scenarios = [
        'primary-role',
        'supporting-role',
        'typical',
        'prerequisite',
        'insight',
        'evidence',
        'conflict',
        'review-reproduction',
      ] as const;
      for (const scenario of scenarios) {
        const policy = CanonicalProblemPlacementPolicySchema.parse(
          JSON.parse(originalPolicy.toString('utf8')),
        );
        const placement = policy.placements.find((p) => p.problemId === 'abc467-e');
        if (!placement) throw new Error('Missing batch placement');
        let document = originalDocument;
        let expectedCode: string;
        if (scenario === 'primary-role') {
          placement.primaryOutcomeId = 'outcome-compute-convolution-or-correlation';
          document = document.replaceAll(
            'outcome-subtract-exception-transitions',
            placement.primaryOutcomeId,
          );
          expectedCode = 'PLACEMENT_OUTCOME_ROLE_MISMATCH';
        } else if (scenario === 'supporting-role') {
          placement.supportingTagIds = [];
          // Remove the Tag-bearing decision too, isolating the missing role check.
          const claim = placement.claimDispositions.find((d) => d.kind === 'supporting');
          if (!claim) throw new Error('Missing supporting claim');
          claim.kind = 'baseline';
          claim.tagIds = [];
          expectedCode = 'PLACEMENT_OUTCOME_ROLE_MISMATCH';
        } else if (scenario === 'typical' || scenario === 'prerequisite') {
          const claimPath =
            scenario === 'typical' ? '/typicalTechniques/1' : '/prerequisiteCandidates/0';
          placement.claimDispositions = placement.claimDispositions.filter(
            (d) => d.claimRef.claimPath !== claimPath,
          );
          placement.analysisEvidenceRefs = placement.analysisEvidenceRefs.filter(
            (r) => r.claimPath !== claimPath,
          );
          expectedCode = 'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_INCOMPLETE';
        } else if (scenario === 'insight') {
          placement.adHocElements = [];
          expectedCode = 'PLACEMENT_AD_HOC_ELEMENTS_INCOMPLETE';
        } else if (scenario === 'evidence') {
          placement.analysisEvidenceRefs = placement.analysisEvidenceRefs.filter(
            (r) => r.claimPath !== '/prerequisiteCandidates/0',
          );
          expectedCode = 'PLACEMENT_INVENTORY_CLAIM_EVIDENCE_INCOMPLETE';
        } else if (scenario === 'conflict') {
          const claim = structuredClone(placement.claimDispositions[0]);
          if (!claim) throw new Error('Missing disposition fixture');
          claim.kind = 'baseline';
          claim.tagIds = [];
          placement.claimDispositions.push(claim);
          expectedCode = 'PLACEMENT_INVENTORY_CLAIM_DISPOSITION_CONFLICT';
        } else {
          placement.claimDispositions = placement.claimDispositions.filter(
            (d) => d.claimRef.claimPath === '/typicalTechniques/0',
          );
          placement.analysisEvidenceRefs = placement.analysisEvidenceRefs.filter(
            (r) => r.claimPath === '/typicalTechniques/0',
          );
          placement.adHocElements = [];
          expectedCode = 'PLACEMENT_AD_HOC_ELEMENTS_INCOMPLETE';
        }
        policy.placementDigest = canonicalDigest(policy.placements);
        await writeFile(policyFile, JSON.stringify(policy));
        await writeFile(documentFile, document);
        const before = await contentHashes(root);
        const result = await runSmallBatchUpdate({ ...input, mode: 'validate' });
        expect(result, scenario).toMatchObject({
          status: 'on_hold',
          writtenPaths: [],
          holds: [expect.objectContaining({ code: expectedCode })],
        });
        expect(await contentHashes(root), scenario).toEqual(before);
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 300_000);

  it('rejects changed acquired input, outside prose and semantic primary mismatch', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-batch-conflict-'));
    try {
      const input = await smallBatchInput(root);
      await runSmallBatchUpdate({ ...input, mode: 'prepare' });
      await authorSmallBatch(input);
      const source = input.metadataBatch.sourceRevisions[0];
      if (!source) throw new Error('Missing source fixture');
      const sourceFile = path.join(
        root,
        `src/content/sources/${input.metadataBatch.batchId}/${source.id}.json`,
      );
      const sourceBytes = await readFile(sourceFile);
      await writeFile(sourceFile, JSON.stringify({ ...source, fingerprint: 'f'.repeat(64) }));
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        holds: [expect.objectContaining({ code: 'ACQUIRED_INPUT_CONFLICT' })],
      });
      await writeFile(sourceFile, sourceBytes);
      for (const docPath of [
        'src/content/docs/problems/dynamic-programming/outcome-subtract-exception-transitions/outcome-subtract-exception-transitions-shard-001/abc212-e.md',
        'src/content/docs/learn/dynamic-programming/index.md',
      ]) {
        const proseFile = path.join(root, docPath);
        const prose = await readFile(proseFile);
        await writeFile(proseFile, Buffer.concat([prose, Buffer.from('\n対象外の変更\n')]));
        expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
          status: 'on_hold',
          writtenPaths: [],
          holds: [expect.objectContaining({ code: 'OUTSIDE_BATCH_CHANGE' })],
        });
        await writeFile(proseFile, prose);
      }
      const policyFile = path.join(root, 'src/content/policies/problem-placements.json');
      const policy = CanonicalProblemPlacementPolicySchema.parse(
        JSON.parse(await readFile(policyFile, 'utf8')),
      );
      const placement = policy.placements.find((p) => p.problemId === 'abc467-e');
      if (!placement) throw new Error('Missing placement fixture');
      const reference = placement.analysisEvidenceRefs[0];
      if (!reference) throw new Error('Missing claim reference fixture');
      const originalPath = reference.claimPath;
      reference.claimPath = '/typicalTechniques/999';
      policy.placementDigest = canonicalDigest(policy.placements);
      await writeFile(policyFile, JSON.stringify(policy));
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        writtenPaths: [],
        holds: [expect.objectContaining({ code: 'ANALYSIS_CLAIM_POINTER_STALE' })],
      });
      reference.claimPath = originalPath;
      placement.primaryOutcomeId = 'outcome-missing';
      policy.placementDigest = canonicalDigest(policy.placements);
      await writeFile(policyFile, JSON.stringify(policy));
      expect(await runSmallBatchUpdate({ ...input, mode: 'validate' })).toMatchObject({
        status: 'on_hold',
        holds: [expect.objectContaining({ code: 'OUTCOME_OWNER_MISSING' })],
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 300_000);
});
