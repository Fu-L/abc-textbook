import { describe, expect, it } from 'vitest';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import {
  assertSeedRelease,
  createSeedReleaseManifest,
  INITIAL_RELEASE_CUTOFF,
} from '../../src/lib/catalog/seed-release.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { validatePublicationUpdate } from '../../src/lib/validation/publication-update.js';

describe('accepted seed initial publication', () => {
  it('fixes the cutoff and keeps all accepted Problem homes, prose and taxonomy', async () => {
    const { catalog } = await loadFullPublicProjection();
    expect(catalog.release.cutoffAt).toBe(INITIAL_RELEASE_CUTOFF);
    expect(() => {
      assertSeedRelease(catalog);
    }).not.toThrow();
    const manifest = ContentWorkManifestSchema.parse(
      createSeedReleaseManifest(catalog, '2026-10-07T12:00:00Z'),
    );
    expect(manifest.reviewUnits).toHaveLength(232);
    const paths = manifest.reviewUnits.flatMap((unit) => unit.paths);
    for (const unit of catalog.authoringUnits) expect(paths).toContain(unit.docPath);
    expect(new Set(paths).size).toBe(paths.length);
    expect(manifest.learningOutcomeIds).toHaveLength(catalog.learningOutcomes.length);
    const caughtUp = structuredClone(catalog);
    caughtUp.release.updateIds.push('update-unpublished-catch-up');
    expect(() => {
      assertSeedRelease(caughtUp);
    }).toThrow('INITIAL_RELEASE_SCOPE_MISMATCH');
  }, 30_000);
  it('allows initial publication without imaginary file additions only with independently verified scope', () => {
    const update = PublicationUpdateSchema.parse({
      schemaVersion: '2.0.0',
      updateId: 'update-seed',
      kind: 'bootstrap',
      baseReleaseVersion: null,
      contestId: null,
      sourceSetFingerprint: 'a'.repeat(64),
      advancedSlotLabels: ['E'],
      targetProblemIds: ['abc212-e'],
      operations: [],
      authoringResults: [],
      correctionImpactIds: [],
      validationSummary: {
        checkIds: ['check-seed'],
        problemResults: [],
        blockingFindingCount: 0,
        aggregatePassed: false,
        resultDigest: 'b'.repeat(64),
      },
      state: 'ON_HOLD',
      createdAt: '2026-10-07T12:00:00Z',
      updatedAt: '2026-10-07T12:00:00Z',
      fixtureMode: false,
    });
    const diff = { operationOwnership: [], baseFiles: [], currentFiles: [] };
    expect(() => {
      validatePublicationUpdate(update, diff);
    }).toThrow('OWNERSHIP_INVALID');
    expect(() => {
      validatePublicationUpdate(update, { ...diff, initialPublicationProblemIds: ['abc212-e'] });
    }).not.toThrow();
    expect(() => {
      validatePublicationUpdate(
        { ...update, kind: 'taxonomy' },
        { ...diff, initialPublicationProblemIds: ['abc212-e'] },
      );
    }).toThrow();
    expect(() => {
      validatePublicationUpdate(update, { ...diff, initialPublicationProblemIds: ['abc213-e'] });
    }).toThrow();
  });
});
