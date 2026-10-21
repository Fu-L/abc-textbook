import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadCatalogEvidenceCanonicalSources } from '../../src/lib/catalog/evidence-inventory.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import {
  assertSeedRelease,
  createSeedReleaseManifest,
  INITIAL_RELEASE_CUTOFF,
} from '../../src/lib/catalog/seed-release.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { validatePublicationUpdate } from '../../src/lib/validation/publication-update.js';
import { LEGACY_SEED_CATALOG_PATH, withLegacySeedRepository } from '../fixtures/legacy-seed.js';
import * as learningTargets from '../../src/lib/taxonomy/unit-learning-targets.js';

describe('accepted seed initial publication', () => {
  beforeEach(() => {
    // The historical snapshot seals a main base in its temporary repository.
    vi.stubEnv('GITHUB_BASE_REF', 'main');
  });
  it('keeps the sealed manuscripts after reading current content', async () => {
    await loadFullPublicProjection({ usePreparedRelease: false });
    await withLegacySeedRepository(async (repositoryRoot) => {
      const sealed = JSON.parse(
        await readFile(path.join(repositoryRoot, LEGACY_SEED_CATALOG_PATH), 'utf8'),
      ) as { authoringUnits: { problemId: string }[] };
      const projection = await loadFullPublicProjection({
        repositoryRoot,
        usePreparedRelease: false,
      });
      expect(projection.problemDocuments.get('abc212-e')?.unit).toEqual(
        sealed.authoringUnits.find((unit) => unit.problemId === 'abc212-e'),
      );
    });
  }, 60_000);
  it('continues unchanged bootstrap publication after its prepared catalog has merged', async () => {
    // Current editorial changes must not redefine a sealed historical fingerprint.
    vi.spyOn(learningTargets, 'unitLearningTarget').mockReturnValue({
      color: '青色',
      rating: '1600–1999',
      reason: '現在の教材に合わせて改訂した対象色の理由。',
    });
    await withLegacySeedRepository(async (root) => {
      const catalogPath = LEGACY_SEED_CATALOG_PATH;
      const catalog = JSON.parse(await readFile(path.join(root, catalogPath), 'utf8')) as unknown;
      await expect(
        loadCatalogEvidenceCanonicalSources(catalog, root, { catalogPath }),
      ).resolves.toMatchObject({ catalog: { release: { problemCount: 868 } } });
      const bootstrapPath = path.join(
        root,
        'staging/updates/update-bootstrap-full-corpus/manifest.json',
      );
      const bootstrapText = await readFile(bootstrapPath, 'utf8');
      const bootstrap = PublicationUpdateSchema.parse(JSON.parse(bootstrapText) as unknown);
      bootstrap.sourceSetFingerprint = 'f'.repeat(64);
      await writeFile(bootstrapPath, JSON.stringify(bootstrap));
      await expect(
        loadCatalogEvidenceCanonicalSources(catalog, root, { catalogPath }),
      ).rejects.toThrow('INITIAL_BOOTSTRAP_BINDING');
      await writeFile(bootstrapPath, bootstrapText);
      const documentPath = (catalog as { authoringUnits: { docPath: string }[] }).authoringUnits[0]
        ?.docPath;
      if (!documentPath) throw new Error('Missing canonical document fixture.');
      await writeFile(path.join(root, documentPath), 'Changed content');
      await expect(
        loadCatalogEvidenceCanonicalSources(catalog, root, { catalogPath }),
      ).rejects.toThrow();
    });
  }, 120_000);
  it('fixes the cutoff and keeps all accepted Problem homes, prose and taxonomy', async () => {
    await withLegacySeedRepository(async (repositoryRoot) => {
      const { catalog } = await loadFullPublicProjection({ repositoryRoot });
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
    });
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
