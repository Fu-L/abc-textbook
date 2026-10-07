import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
export interface ReleaseCommitContext {
  readonly repositoryRoot: string;
  readonly commit: string;
  readonly baseCommit: string;
}

/** Only the temporary clone is written. Dirty files and working-tree evidence
 * cannot influence validation of the requested Git tree.
 */
export const withReleaseCommit = async <Result>(
  input: {
    readonly repositoryRoot: string;
    readonly commit: string;
    /** CI's exact SHA for a push to protected main, supplied by the entry point. */
    readonly mergedMainCommit?: string;
  },
  validate: (context: ReleaseCommitContext) => Promise<Result>,
): Promise<Result> => {
  const git = async (...args: string[]) =>
    (
      await exec('git', args, { cwd: input.repositoryRoot, maxBuffer: 16 * 1024 * 1024 })
    ).stdout.trim();
  if (input.commit !== 'HEAD' && !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(input.commit))
    throw new Error('RELEASE_COMMIT_INVALID: use HEAD or a full commit ID.');
  let commit: string;
  try {
    commit = await git('rev-parse', '--verify', '--end-of-options', `${input.commit}^{commit}`);
  } catch {
    throw new Error('RELEASE_COMMIT_INVALID: unknown commit.');
  }
  let baseRef = process.env.GITHUB_BASE_REF?.trim() ?? 'main';
  if (baseRef.length === 0) baseRef = 'main';
  if (!/^[A-Za-z0-9._/-]+$/u.test(baseRef) || baseRef.includes('..') || baseRef.includes('@{'))
    throw new Error('RELEASE_BASE_INVALID: invalid protected branch.');
  let baseCommit: string;
  try {
    baseCommit = await git('rev-parse', '--verify', `refs/remotes/origin/${baseRef}^{commit}`);
    if (input.mergedMainCommit === commit && baseRef === 'main') {
      await git('merge-base', '--is-ancestor', commit, baseCommit);
      baseCommit = await git('rev-parse', `${commit}^1`);
    }
    if (baseCommit === commit) throw new Error('base is current commit');
    await git('merge-base', '--is-ancestor', baseCommit, commit);
  } catch {
    throw new Error('RELEASE_BASE_INVALID: protected base must precede the exact commit.');
  }
  const directory = await mkdtemp(path.join(tmpdir(), 'abc-release-snapshot-'));
  const snapshot = path.join(directory, 'repository');
  try {
    await exec('git', [
      'clone',
      '--quiet',
      '--shared',
      '--no-checkout',
      '--',
      input.repositoryRoot,
      snapshot,
    ]);
    await exec('git', ['checkout', '--quiet', '--detach', commit], { cwd: snapshot });
    await exec('git', ['update-ref', `refs/remotes/origin/${baseRef}`, baseCommit], {
      cwd: snapshot,
    });
    return await validate({ repositoryRoot: snapshot, commit, baseCommit });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
};
