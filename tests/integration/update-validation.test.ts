import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { enumerateCorrectionImpacts } from '../../scripts/update-abc/correction-impact.js';
import { resumeUpdate, runUpdatePipeline } from '../../scripts/update-abc/index.js';
import { validatePreparedUpdate } from '../../scripts/update-abc/validate.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
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
    expect(
      enumerateCorrectionImpacts({
        correctionId: 'correction-abc500-e',
        problemIds: ['abc500-e'],
        changedBlocks: ['explanation', 'example'],
        locators: [
          {
            problemId: 'abc500-e',
            contentPath: 'staging/previews/initial-v1/learning/graph-search/learning-unit.json',
            orderPath: 'staging/previews/initial-v1/taxonomy/index.json',
            indexPaths: ['staging/previews/initial-v1/taxonomy/index.json'],
          },
        ],
      }).affectedKinds,
    ).toEqual(['content', 'examples', 'exercises', 'answers', 'order', 'indexes']);
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

  it('freezes canonical update, work-manifest, review, and component evidence contracts', async () => {
    const update = PublicationUpdateSchema.parse(
      await json(
        'staging/previews/initial-v1/release-simulation/update-31c49d8ebf9d0f5e3faac0b7/manifest.json',
      ),
    );
    expect(update.authoringResults).toHaveLength(8);
    expect(
      update.authoringResults.every(({ resultType }) => resultType === 'authoring_required'),
    ).toBe(true);

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
  });
});
