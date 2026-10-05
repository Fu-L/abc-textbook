import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { withReleaseCommit } from '../../scripts/release/commit-snapshot.js';
import { loadGitReleaseHistory } from '../../scripts/release/build-history.js';
import { verifyPreviewReleaseSimulation } from '../../scripts/verify-release.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';
import {
  GitDeploymentAdapter,
  type CommitDeploymentRequest,
} from '../../src/lib/deployment/git-deployment-adapter.js';

const exec = promisify(execFile);
describe('read-only exact release commit', () => {
  let root: string;
  let base: string;
  let commit: string;
  const git = async (...args: string[]) => (await exec('git', args, { cwd: root })).stdout.trim();
  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'abc-release-commit-'));
    await git('init', '-q');
    await git('config', 'user.email', 'fixture@example.invalid');
    await git('config', 'user.name', 'Fixture');
    await writeFile(path.join(root, 'content.txt'), 'base');
    await git('add', '.');
    await git('commit', '-qm', 'base');
    base = await git('rev-parse', 'HEAD');
    await git('update-ref', 'refs/remotes/origin/main', base);
    await writeFile(path.join(root, 'content.txt'), 'committed');
    await git('commit', '-qam', 'update');
    commit = await git('rev-parse', 'HEAD');
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });
  it('rejects unknown and duplicated release CLI flags before reading release inputs', async () => {
    for (const flags of [
      ['--commit', 'HEAD', '--unknown', 'value'],
      ['--commit', 'HEAD', '--commit', 'HEAD'],
    ]) {
      await expect(
        exec(process.execPath, ['--import', 'tsx', 'scripts/verify-release.ts', ...flags]),
      ).rejects.toMatchObject({
        code: 64,
        stderr: expect.stringContaining('ARGUMENTS_INVALID') as unknown,
      });
    }
  });
  it('detects preview writes even when preview CLI arguments are present', async () => {
    const update = PublicationUpdateSchema.parse(
      JSON.parse(
        await readFile(
          'staging/previews/initial-v1/release-simulation/update-2661fc1615b0f12e3619aedd/manifest.json',
          'utf8',
        ),
      ) as unknown,
    );
    const paths = ['public/page.txt', 'src/content/releases/release.json', 'dist/page.html'];
    for (const file of paths) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), 'before');
    }
    const originalArgv = process.argv;
    process.argv = [...originalArgv.slice(0, 2), '--manifest', 'fixture.json'];
    try {
      const result = await verifyPreviewReleaseSimulation({
        previewId: 'initial-v1',
        repositoryRoot: root,
        update: { updateId: update.updateId, publicationUpdate: update },
        executeSimulation: async () => {
          for (const file of paths) await writeFile(path.join(root, file), 'after');
          return { updateId: update.updateId, publicationUpdate: update };
        },
      });
      expect(result).toMatchObject({
        publicWriteCount: 2,
        productionReleaseMetadataWriteCount: 1,
        deploymentWriteCount: 1,
        aggregatePassed: false,
      });
      expect(result.findings).toEqual(
        expect.arrayContaining([
          'PUBLIC_WRITE_DETECTED',
          'PRODUCTION_RELEASE_METADATA_WRITE_DETECTED',
          'DEPLOYMENT_WRITE_DETECTED',
        ]),
      );
    } finally {
      process.argv = originalArgv;
    }
  });
  it('reads committed bytes despite dirty and untracked worktree files and cleans up', async () => {
    await writeFile(path.join(root, 'content.txt'), 'dirty');
    await writeFile(path.join(root, 'untracked.txt'), 'local only');
    const before = await git('status', '--porcelain=v1');
    let snapshot = '';
    const result = await withReleaseCommit({ repositoryRoot: root, commit }, async (context) => {
      snapshot = context.repositoryRoot;
      expect(context.baseCommit).toBe(base);
      expect(context.commit).toBe(commit);
      expect(await readFile(path.join(snapshot, 'content.txt'), 'utf8')).toBe('committed');
      await expect(readFile(path.join(snapshot, 'untracked.txt'))).rejects.toThrow();
      return 'checked';
    });
    expect(result).toBe('checked');
    expect(await git('status', '--porcelain=v1')).toBe(before);
    expect(await readFile(path.join(root, 'content.txt'), 'utf8')).toBe('dirty');
    await expect(readFile(path.join(snapshot, 'content.txt'))).rejects.toThrow();
  });
  it('cleans up after validation failure and rejects unknown/non-ancestor bases', async () => {
    let snapshot = '';
    await expect(
      withReleaseCommit({ repositoryRoot: root, commit }, async (context) => {
        snapshot = context.repositoryRoot;
        await Promise.reject(new Error('injected validation failure'));
        return false;
      }),
    ).rejects.toThrow('injected');
    await expect(readFile(path.join(snapshot, 'content.txt'))).rejects.toThrow();
    await expect(
      withReleaseCommit({ repositoryRoot: root, commit: 'f'.repeat(40) }, () =>
        Promise.resolve(true),
      ),
    ).rejects.toThrow('RELEASE_COMMIT_INVALID');
    await git('update-ref', 'refs/remotes/origin/main', commit);
    await expect(
      withReleaseCommit({ repositoryRoot: root, commit: base }, () => Promise.resolve(true)),
    ).rejects.toThrow('RELEASE_BASE_INVALID');
  });
  it('validates an exact main commit using the trusted first-parent diff', async () => {
    await git('update-ref', 'refs/remotes/origin/main', commit);
    await expect(
      withReleaseCommit({ repositoryRoot: root, commit }, () => Promise.resolve(true)),
    ).rejects.toThrow('RELEASE_BASE_INVALID');
    expect(
      await withReleaseCommit(
        { repositoryRoot: root, commit, mergedMainCommit: commit },
        (context) => Promise.resolve(context.baseCommit),
      ),
    ).toBe(base);
  });
  it('reads historical catalogs at their own commits and preserves earlier releases', async () => {
    const catalog = makeTrustedCatalog({});
    await writeFile(path.join(root, 'catalog.json'), JSON.stringify(catalog));
    await git('add', '.');
    await git('commit', '-qm', 'first catalog');
    const firstCommit = await git('rev-parse', 'HEAD');
    const metadata = {
      schemaVersion: '1.0.0',
      version: catalog.release.version,
      cutoffAt: catalog.release.cutoffAt,
      commit: firstCommit,
      changeSummary: {
        updateIds: catalog.release.updateIds,
        addedProblemIds: catalog.release.addedProblemIds,
        changedProblemIds: [],
        withdrawnProblemIds: [],
        taxonomyChanges: [],
      },
      validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/1',
    };
    const first = await loadGitReleaseHistory({
      repositoryRoot: root,
      catalogPath: 'catalog.json',
      metadata: [metadata],
    });
    const nextCatalog = makeTrustedCatalog({ version: '2026.07.18' });
    await writeFile(path.join(root, 'catalog.json'), JSON.stringify(nextCatalog));
    await git('commit', '-qam', 'second catalog');
    const nextMetadata = {
      ...metadata,
      version: nextCatalog.release.version,
      commit: await git('rev-parse', 'HEAD'),
    };
    await writeFile(path.join(root, 'catalog.json'), 'dirty catalog');
    const history = await loadGitReleaseHistory({
      repositoryRoot: root,
      catalogPath: 'catalog.json',
      metadata: [metadata, nextMetadata],
      previous: first,
    });
    expect(history[0]).toEqual(first[0]);
    expect(history[1]?.version).toBe('2026.07.18');
    await expect(
      loadGitReleaseHistory({
        repositoryRoot: root,
        catalogPath: 'catalog.json',
        metadata: [],
        previous: first,
      }),
    ).rejects.toThrow('RELEASE_HISTORY_REWRITE');
  });
  it('does not call the deployment target after a failed check and releases its queue after a host failure', async () => {
    const catalog = makeTrustedCatalog({});
    const metadata: CommitDeploymentRequest['release'] = {
      schemaVersion: '1.0.0',
      version: catalog.release.version,
      cutoffAt: catalog.release.cutoffAt,
      commit,
      changeSummary: {
        updateIds: catalog.release.updateIds,
        addedProblemIds: catalog.release.addedProblemIds,
        changedProblemIds: [],
        withdrawnProblemIds: [],
        taxonomyChanges: [],
      },
      validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/1',
    };
    let calls = 0;
    const adapter = new GitDeploymentAdapter(root, {
      getDeployment: () => Promise.resolve(undefined),
      deployCommit: () => {
        calls += 1;
        return calls === 1
          ? Promise.reject(new Error('injected host failure'))
          : Promise.resolve({ deploymentUrl: 'https://fixture.invalid/site' });
      },
    });
    // CI owns the required-check decision, the adapter only owns deployment.
    const failedCheck = await withReleaseCommit({ repositoryRoot: root, commit }, () =>
      Promise.resolve({ aggregatePassed: false }),
    );
    if (failedCheck.aggregatePassed) await adapter.deploy(metadata);
    expect(calls).toBe(0);
    await expect(adapter.deploy(metadata)).rejects.toThrow('injected host failure');
    await expect(adapter.deploy(metadata)).resolves.toMatchObject({
      deploymentUrl: 'https://fixture.invalid/site',
    });
    expect(calls).toBe(2);
    await expect(adapter.rollback(base)).rejects.toThrow('UNKNOWN_RELEASE_COMMIT');
    expect(calls).toBe(2);
  });
});
