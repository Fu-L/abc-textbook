import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

import {
  GitDeploymentAdapter,
  type CommitDeploymentRequest,
  type GitDeploymentError,
} from '../../src/lib/deployment/git-deployment-adapter.js';

const execFileAsync = promisify(execFile);

describe('GitDeploymentAdapter', () => {
  let repositoryRoot: string | undefined;

  afterEach(async () => {
    if (repositoryRoot) await rm(repositoryRoot, { recursive: true, force: true });
    repositoryRoot = undefined;
  });

  const commitSite = async (contents: string, message: string): Promise<string> => {
    if (!repositoryRoot) throw new Error('Test repository is not initialized.');
    await writeFile(path.join(repositoryRoot, 'site.txt'), contents, 'utf8');
    await execFileAsync('git', ['add', 'site.txt'], { cwd: repositoryRoot });
    await execFileAsync('git', ['commit', '-m', message], { cwd: repositoryRoot });
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    });
    return stdout.trim();
  };

  const metadata = (version: string, commit: string) => ({
    schemaVersion: '1.0.0',
    version,
    cutoffAt: '2026-07-17T12:00:00+09:00',
    commit,
    changeSummary: {
      updateIds: [`update-${version.replaceAll('.', '-')}`],
      addedProblemIds: [],
      changedProblemIds: [],
      withdrawnProblemIds: [],
      taxonomyChanges: [],
    },
    validationResultsUrl: `https://github.com/Fu-L/abc-textbook/actions/runs/${version.replaceAll('.', '')}`,
  });

  it('rolls back by redeploying a known release commit', async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-deploy-'));
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    await execFileAsync('git', ['config', 'user.name', 'Test Author'], { cwd: repositoryRoot });
    await execFileAsync('git', ['config', 'user.email', 'test@example.com'], {
      cwd: repositoryRoot,
    });
    const firstCommit = await commitSite('release one', 'release one');
    const secondCommit = await commitSite('release two', 'release two');
    const deployments: CommitDeploymentRequest[] = [];
    const deploymentHistory = new Set<string>();
    let deployedContents = '';
    const adapter = new GitDeploymentAdapter(repositoryRoot, {
      hasDeployment: (commit) => Promise.resolve(deploymentHistory.has(commit)),
      deployCommit: async (request) => {
        deployments.push(request);
        deploymentHistory.add(request.release.commit);
        const { stdout } = await execFileAsync(
          'git',
          ['show', `${request.release.commit}:site.txt`],
          {
            cwd: repositoryRoot,
            encoding: 'utf8',
          },
        );
        deployedContents = stdout;
        return { deploymentUrl: `https://example.test/deployments/${request.release.commit}` };
      },
    });

    await adapter.deploy(metadata('2026.07.17', firstCommit));
    await adapter.deploy(metadata('2026.07.18', secondCommit));
    expect(deployedContents).toBe('release two');

    await adapter.rollback(metadata('2026.07.17', firstCommit));
    expect(deployedContents).toBe('release one');
    expect(
      deployments.map(({ release, reason }) => ({
        commit: release.commit,
        version: release.version,
        reason,
      })),
    ).toEqual([
      { commit: firstCommit, version: '2026.07.17', reason: 'release' },
      { commit: secondCommit, version: '2026.07.18', reason: 'release' },
      { commit: firstCommit, version: '2026.07.17', reason: 'rollback' },
    ]);
  });

  it('rejects a commit that is not present in the repository', async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-deploy-'));
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    const adapter = new GitDeploymentAdapter(repositoryRoot, {
      hasDeployment: () => Promise.resolve(false),
      deployCommit: () => Promise.resolve({ deploymentUrl: 'https://example.test/unreachable' }),
    });

    await expect(adapter.rollback(metadata('2026.07.17', 'a'.repeat(40)))).rejects.toMatchObject({
      code: 'UNKNOWN_RELEASE_COMMIT',
    } satisfies Partial<GitDeploymentError>);
  });

  it('rejects rollback to an undeployed repository commit', async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-deploy-'));
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    await execFileAsync('git', ['config', 'user.name', 'Test Author'], { cwd: repositoryRoot });
    await execFileAsync('git', ['config', 'user.email', 'test@example.com'], {
      cwd: repositoryRoot,
    });
    const commit = await commitSite('unpublished change', 'unpublished change');
    let deployCalled = false;
    const adapter = new GitDeploymentAdapter(repositoryRoot, {
      hasDeployment: () => Promise.resolve(false),
      deployCommit: () => {
        deployCalled = true;
        return Promise.resolve({ deploymentUrl: 'https://example.test/unreachable' });
      },
    });

    await expect(adapter.rollback(metadata('2026.07.17', commit))).rejects.toMatchObject({
      code: 'UNKNOWN_RELEASE_COMMIT',
    } satisfies Partial<GitDeploymentError>);
    expect(deployCalled).toBe(false);
  });

  it('serializes release and rollback requests inside the deployment boundary', async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-deploy-'));
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    await execFileAsync('git', ['config', 'user.name', 'Test Author'], { cwd: repositoryRoot });
    await execFileAsync('git', ['config', 'user.email', 'test@example.com'], {
      cwd: repositoryRoot,
    });
    const commit = await commitSite('release one', 'release one');
    const deploymentHistory = new Set<string>();
    let activeDeployments = 0;
    let maximumActiveDeployments = 0;
    const adapter = new GitDeploymentAdapter(repositoryRoot, {
      hasDeployment: (candidate) => Promise.resolve(deploymentHistory.has(candidate)),
      deployCommit: async (request) => {
        activeDeployments += 1;
        maximumActiveDeployments = Math.max(maximumActiveDeployments, activeDeployments);
        await new Promise<void>((resolve) => setTimeout(resolve, 5));
        deploymentHistory.add(request.release.commit);
        activeDeployments -= 1;
        return { deploymentUrl: 'https://example.test/deployments/serialized' };
      },
    });

    await Promise.all([
      adapter.deploy(metadata('2026.07.17', commit)),
      adapter.rollback(metadata('2026.07.17', commit)),
    ]);

    expect(maximumActiveDeployments).toBe(1);
  });
});
