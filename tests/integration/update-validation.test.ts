import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { enumerateCorrectionImpacts } from '../../scripts/update-abc/correction-impact.js';
import { verifyPreviewReleaseSimulation } from '../../scripts/verify-release.js';
import {
  persistPublicationUpdate,
  resumeUpdate,
  runUpdatePipeline,
} from '../../scripts/update-abc/index.js';
import { validatePreparedUpdate } from '../../scripts/update-abc/validate.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { CorrectionImpactSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { HumanContentReviewEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  componentEvidenceDigest,
  componentSubjectDigest,
  type ComponentEvidence,
} from '../../src/lib/preview/preview-snapshot.js';
import { validateContentWorkManifest } from '../../src/lib/validation/content-work-manifest.js';

const json = async (relativePath: string): Promise<unknown> =>
  JSON.parse(await readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8')) as unknown;

describe('US5 update validation', () => {
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
          orderId: 'order-preview',
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
        'staging/previews/initial-v1/release-simulation/update-04ea38e2db1d7b390448b807/manifest.json',
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
    expect(
      verifyPreviewReleaseSimulation({
        previewId: 'initial-v1',
        update: { updateId: update.updateId, publicationUpdate: update },
        publicWrites: [],
        productionReleaseMetadataWrites: [],
        deploymentWrites: [],
      }),
    ).toEqual(verification);
  });
});
