import { mkdir, mkdtemp, readFile, readdir, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  buildFrozenPreviewSnapshot,
  frozenPreviewInputPaths,
} from '../../src/lib/preview/frozen-preview-join.js';
import { FileSystemPreviewSnapshotRepository } from '../../src/lib/preview/filesystem-preview-snapshot-repository.js';
import { PreviewSnapshotCommitService } from '../../src/lib/preview/preview-snapshot-repository.js';
import { runPreviewVerify } from '../../scripts/preview-verify.js';

const fixtureSelector = 'tests/fixtures/previews/initial-v1';
const repositoryRoot = process.cwd();

const readJson = async (root: string, relativePath: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(path.join(root, relativePath), 'utf8')) as Record<string, unknown>;

const writeJson = async (
  root: string,
  relativePath: string,
  value: Readonly<Record<string, unknown>>,
): Promise<void> => {
  const destination = path.join(root, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const copyFrozenInputs = async (destinationRoot: string): Promise<void> => {
  await Promise.all(
    frozenPreviewInputPaths.map(async (relativePath) => {
      const destination = path.join(destinationRoot, relativePath);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, await readFile(path.join(repositoryRoot, relativePath)));
    }),
  );
};

describe('T154 preview verification', () => {
  let temporaryRoot: string;

  beforeEach(async () => {
    temporaryRoot = await mkdtemp(path.join(tmpdir(), 'abc-preview-join-'));
    await copyFrozenInputs(temporaryRoot);
  });

  afterEach(async () => {
    await rm(temporaryRoot, { recursive: true, force: true });
  });

  it('joins only the enumerated frozen inputs into a passed snapshot', async () => {
    const snapshot = await buildFrozenPreviewSnapshot(temporaryRoot);

    expect(snapshot).toMatchObject({
      previewId: 'initial-v1',
      status: 'passed',
      holdReasons: [],
      authoringSkillVersion: '1.1.1',
    });
    expect(snapshot.problemIds).toHaveLength(8);
    expect(snapshot.componentDigests).toHaveLength(8);
    expect(snapshot.checkResultIds).toEqual(
      expect.arrayContaining([
        'check:graph-search:source-traceability',
        'check:update:idempotency',
        'check-us3-integration',
        'check-us4-links',
      ]),
    );
    expect(snapshot.reviewEvidenceIds).toEqual(
      expect.arrayContaining([
        'review:graph-search:self',
        'review:update-simulation:self',
        'human-content-review-initial-v1-us3',
        'human-content-review-initial-v1-us4',
      ]),
    );
  });

  it('binds the complete frozen component envelope into the join digest', async () => {
    const baseline = await buildFrozenPreviewSnapshot(temporaryRoot);
    const relativePath = 'docs/verification/previews/initial-v1/components/ui-search.json';
    const component = await readJson(temporaryRoot, relativePath);
    await writeJson(temporaryRoot, relativePath, {
      ...component,
      workManifestDigest: 'f'.repeat(64),
    });

    const changed = await buildFrozenPreviewSnapshot(temporaryRoot);

    expect(changed.status).toBe('passed');
    expect(changed.componentDigests).not.toEqual(baseline.componentDigests);
    expect(changed.joinDigest).not.toBe(baseline.joinDigest);
  });

  it('persists an on-hold snapshot when a fixed component is missing', async () => {
    await unlink(
      path.join(
        temporaryRoot,
        'docs/verification/previews/initial-v1/components/content/graph-search.json',
      ),
    );

    const result = await runPreviewVerify({
      repositoryRoot: temporaryRoot,
      fixture: fixtureSelector,
    });

    expect(result.status).toBe('on_hold');
    expect(result.holdReasons).toContain('COMPONENT_MISSING:content-graph-search');
    const persistedSnapshot = await readJson(temporaryRoot, result.snapshotPath);
    expect(persistedSnapshot.status).toBe('on_hold');
    expect(persistedSnapshot.holdReasons).toEqual(
      expect.arrayContaining(['COMPONENT_MISSING:content-graph-search']),
    );
  });

  it('holds stale component evidence and an authoring-skill mismatch', async () => {
    const relativePath = 'docs/verification/previews/initial-v1/components/update-simulation.json';
    const component = await readJson(temporaryRoot, relativePath);
    await writeJson(temporaryRoot, relativePath, {
      ...component,
      authoringSkillDigest: 'f'.repeat(64),
    });

    const snapshot = await buildFrozenPreviewSnapshot(temporaryRoot);

    expect(snapshot.status).toBe('on_hold');
    expect(snapshot.holdReasons).toEqual(
      expect.arrayContaining([
        'COMPONENT_DIGEST_STALE:update-simulation',
        'AUTHORING_SKILL_MISMATCH:update-simulation',
      ]),
    );
  });

  it('holds an incomplete frozen authoring input packet', async () => {
    const relativePath = 'docs/verification/authoring-skill/initial-v1/skill-manifest.json';
    const skill = await readJson(temporaryRoot, relativePath);
    const sourcePacket = skill.sourcePacket as Record<string, unknown>;
    await writeJson(temporaryRoot, relativePath, {
      ...skill,
      sourcePacket: {
        ...sourcePacket,
        inputProblemIds: (sourcePacket.inputProblemIds as unknown[]).slice(1),
      },
    });

    const snapshot = await buildFrozenPreviewSnapshot(temporaryRoot);

    expect(snapshot.status).toBe('on_hold');
    expect(snapshot.holdReasons).toContain('AUTHORING_INPUT_PACKET_INCOMPLETE');
  });

  it('commits once and repairs a missing derived reference without replacing the snapshot', async () => {
    const first = await runPreviewVerify({
      repositoryRoot: temporaryRoot,
      fixture: fixtureSelector,
    });
    const snapshotBytes = await readFile(path.join(temporaryRoot, first.snapshotPath), 'utf8');
    await unlink(path.join(temporaryRoot, first.referencePath));

    const second = await runPreviewVerify({
      repositoryRoot: temporaryRoot,
      fixture: fixtureSelector,
    });

    expect(first).toMatchObject({
      status: 'passed',
      recovered: false,
      transactionPhase: 'verified',
    });
    expect(second).toMatchObject({
      status: 'passed',
      recovered: true,
      transactionPhase: 'verified',
    });
    expect(await readFile(path.join(temporaryRoot, first.snapshotPath), 'utf8')).toBe(
      snapshotBytes,
    );
    expect(await readJson(temporaryRoot, second.referencePath)).toMatchObject({
      joinDigest: first.joinDigest,
      canonicalSnapshotPath: first.snapshotPath,
      status: 'passed',
    });
    expect(
      (await readdir(path.dirname(path.join(temporaryRoot, first.snapshotPath)))).some((name) =>
        name.endsWith('.tmp'),
      ),
    ).toBe(false);
  });

  it('allows only one concurrent creator for an immutable canonical snapshot', async () => {
    const snapshot = await buildFrozenPreviewSnapshot(temporaryRoot);
    const firstRepository = new FileSystemPreviewSnapshotRepository(temporaryRoot);
    const secondRepository = new FileSystemPreviewSnapshotRepository(temporaryRoot);

    const attempts = await Promise.allSettled([
      firstRepository.createSnapshot(snapshot),
      secondRepository.createSnapshot(snapshot),
    ]);

    expect(attempts.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    const rejected = attempts.find(({ status }) => status === 'rejected');
    if (rejected?.status !== 'rejected') throw new Error('expected one rejection');
    const rejectionReason: unknown = rejected.reason;
    expect(rejectionReason).toBeInstanceOf(Error);
    expect((rejectionReason as Error).message).toBe('SNAPSHOT_ALREADY_EXISTS');
    expect(
      await readJson(
        temporaryRoot,
        `staging/previews/initial-v1/snapshots/${snapshot.joinDigest}.json`,
      ),
    ).toEqual(snapshot);
  });

  it('normalizes stale transaction identity before recovery', async () => {
    const first = await runPreviewVerify({
      repositoryRoot: temporaryRoot,
      fixture: fixtureSelector,
    });
    const transaction = await readJson(temporaryRoot, first.transactionPath);
    await writeJson(temporaryRoot, first.transactionPath, {
      ...transaction,
      transactionId: 'stale-transaction',
      canonicalSnapshotPath: 'stale/snapshot.json',
      referencePath: 'stale/reference.json',
    });

    const recovered = await runPreviewVerify({
      repositoryRoot: temporaryRoot,
      fixture: fixtureSelector,
    });

    expect(recovered).toMatchObject({
      status: 'passed',
      recovered: true,
      transactionPhase: 'verified',
      snapshotPath: first.snapshotPath,
      referencePath: first.referencePath,
    });
    expect(await readJson(temporaryRoot, recovered.transactionPath)).toMatchObject({
      transactionId: `preview-snapshot:${first.previewId}:${first.joinDigest}`,
      canonicalSnapshotPath: first.snapshotPath,
      referencePath: first.referencePath,
      phase: 'verified',
    });
  });

  it('leaves a tampered canonical snapshot and its reference on hold during recovery', async () => {
    const result = await runPreviewVerify({
      repositoryRoot: temporaryRoot,
      fixture: fixtureSelector,
    });
    const snapshot = await readJson(temporaryRoot, result.snapshotPath);
    await writeJson(temporaryRoot, result.snapshotPath, {
      ...snapshot,
      componentDigests: ['tampered'],
    });
    await unlink(path.join(temporaryRoot, result.referencePath));
    const repository = new FileSystemPreviewSnapshotRepository(temporaryRoot);
    const transaction = await new PreviewSnapshotCommitService(repository).recover(
      result.previewId,
      result.joinDigest,
    );

    expect(transaction).toMatchObject({
      phase: 'recovery_required',
      recoveryReason: 'CANONICAL_SNAPSHOT_DIGEST_MISMATCH',
    });
    await expect(
      readFile(path.join(temporaryRoot, result.referencePath), 'utf8'),
    ).rejects.toThrow();
  });

  it('rejects selectors other than the fixed initial-v1 fixture', async () => {
    await expect(
      runPreviewVerify({
        repositoryRoot: temporaryRoot,
        fixture: 'tests/fixtures/previews/another-preview',
      }),
    ).rejects.toThrow('FIXTURE_NOT_ALLOWED');
  });
});
