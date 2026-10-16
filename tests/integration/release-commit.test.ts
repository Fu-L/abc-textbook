import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadGitReleaseHistory } from '../../scripts/release/build-history.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';
import {
  GitDeploymentAdapter,
  type CommitDeploymentRequest,
} from '../../src/lib/deployment/git-deployment-adapter.js';

const exec = promisify(execFile);
describe('legacy Git release history and deployment', () => {
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
  it('requires actual host confirmation before projecting a prepared catalog as published history', async () => {
    const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
    catalog.release.publicationStatus = 'prepared';
    await writeFile(path.join(root, 'catalog.json'), JSON.stringify(catalog));
    await git('add', '.');
    await git('commit', '-qm', 'prepared catalog');
    const preparedCommit = await git('rev-parse', 'HEAD');
    const metadata = {
      schemaVersion: '1.0.0',
      version: catalog.release.version,
      cutoffAt: catalog.release.cutoffAt,
      commit: preparedCommit,
      changeSummary: {
        updateIds: catalog.release.updateIds,
        addedProblemIds: catalog.release.addedProblemIds,
        changedProblemIds: [],
        withdrawnProblemIds: [],
        taxonomyChanges: [],
      },
      validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/1',
    };
    const input = { repositoryRoot: root, catalogPath: 'catalog.json', metadata: [metadata] };
    await expect(loadGitReleaseHistory(input)).rejects.toThrow('RELEASE_HISTORY_INCOMPLETE');
    await expect(
      loadGitReleaseHistory({ ...input, confirmHostPublication: () => Promise.resolve(undefined) }),
    ).rejects.toThrow('HOST_NOT_CONFIRMED');
    const history = await loadGitReleaseHistory({
      ...input,
      confirmHostPublication: () => Promise.resolve(metadata),
    });
    expect(history[0]?.commit).toBe(preparedCommit);
    const original = JSON.parse(await git('show', `${preparedCommit}:catalog.json`)) as {
      release: { publicationStatus: string };
    };
    expect(original.release.publicationStatus).toBe('prepared');
  });
  it('releases the deployment queue after a host failure', async () => {
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
    await expect(adapter.deploy(metadata)).rejects.toThrow('injected host failure');
    await expect(adapter.deploy(metadata)).resolves.toMatchObject({
      deploymentUrl: 'https://fixture.invalid/site',
    });
    expect(calls).toBe(2);
    await expect(adapter.rollback(base)).rejects.toThrow('UNKNOWN_RELEASE_COMMIT');
    expect(calls).toBe(2);
  });
});
