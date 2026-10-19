import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
export const LEGACY_SEED_CATALOG_PATH = 'docs/verification/releases/catalog.json';
// Pin the accepted snapshot: later branch tips must not redefine this fixture.
export const LEGACY_SEED_COMMIT = 'b7bc7422538ceb1e9b9997c205c85d487dd72d9a';

/** Exercise retained seed consumers against the Git version that sealed their catalog.
 * Later publication history belongs to the current site, not to this initial snapshot.
 * Restore actual historical inputs; never regenerate evidence to make a fixture pass.
 */
export async function withLegacySeedRepository<T>(
  inspect: (root: string) => Promise<T>,
): Promise<T> {
  const commit = LEGACY_SEED_COMMIT;
  const temporary = await mkdtemp(path.join(tmpdir(), 'abc-legacy-seed-'));
  const root = path.join(temporary, 'repository');
  const git = (...args: string[]) => execute('git', args, { cwd: root });
  try {
    await execute('git', ['init', '--quiet', root]);
    // Fetch the exact historical input from the local checkout, independently
    // of clone defaults, branch tips and alternate object stores.
    await git('fetch', '--quiet', '--no-tags', repositoryRoot, commit);
    await git('reset', '--mixed', '--quiet', commit);
    await git(
      'restore',
      `--source=${commit}`,
      '--worktree',
      '--',
      'src/content',
      'docs/work-manifests',
      'docs/verification/releases',
      'docs/reviews/agent-content/initial-release',
      'docs/verification/initial-release',
      'docs/verification/bootstrap/us1.json',
      'docs/verification/bootstrap/learning-unit-content.json',
      'docs/verification/bootstrap/problem-authoring-units.json',
      '.specify/memory/constitution.md',
      '.specify/templates',
      'staging/updates',
    );
    await git('update-ref', 'refs/remotes/origin/main', commit);
    await git(
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '--quiet',
      '--allow-empty',
      '-m',
      'Continue sealed seed deployment',
    );
    return await inspect(root);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
