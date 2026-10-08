import { describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
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

describe('accepted seed initial publication', () => {
  it('continues unchanged bootstrap publication after its prepared catalog has merged', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'abc-seed-continuation-'));
    const root = path.join(directory, 'repository');
    const exec = promisify(execFile);
    try {
      await exec('git', ['clone', '--quiet', '--shared', process.cwd(), root]);
      const git = (...args: string[]) => exec('git', args, { cwd: root });
      const base = (await git('rev-parse', 'HEAD')).stdout.trim();
      await git('update-ref', 'refs/remotes/origin/main', base);
      await git('config', 'user.name', 'Fixture');
      await git('config', 'user.email', 'fixture@example.invalid');
      await writeFile(path.join(root, 'deployment-note.md'), 'Operational continuation.');
      await git('add', 'deployment-note.md');
      await git('commit', '--quiet', '-m', 'Continue prepared initial deployment');
      const catalogPath = 'docs/verification/releases/catalog.json';
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
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }, 120_000);
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
