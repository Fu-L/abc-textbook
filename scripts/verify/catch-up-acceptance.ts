import { spawn } from 'node:child_process';
import { cp, readFile, symlink } from 'node:fs/promises';
import path from 'node:path';
import { withReleaseCommit } from '../release/commit-snapshot.js';
import { parseKeyValueArguments, requiredArgument } from '../corpus/cli-support.js';
import { auditInputSubject } from './initial-release-evidence.js';

/** Acceptance runs on a detached copy of the requested commit, never on a dirty checkout. */
try {
  const args = parseKeyValueArguments(process.argv.slice(2), ['--commit']);
  const commit = requiredArgument(args, '--commit');
  const root = process.cwd();
  await withReleaseCommit({ repositoryRoot: root, commit }, async (snapshot) => {
    await symlink(
      path.join(root, 'node_modules'),
      path.join(snapshot.repositoryRoot, 'node_modules'),
      'dir',
    );
    const run = async (script: string, args: string[]) =>
      new Promise<void>((resolve, reject) => {
        const child = spawn(process.execPath, ['--import', 'tsx', script, ...args], {
          cwd: snapshot.repositoryRoot,
          env: {
            ...process.env,
            ASTRO_TELEMETRY_DISABLED: '1',
            BASE_PATH: '/',
            SITE_URL: 'https://abc-textbook.example',
          },
          stdio: 'inherit',
        });
        child.on('error', reject);
        child.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`${script}: exit ${String(code)}`));
        });
      });
    console.error(`Acceptance subject: ${snapshot.commit}`);
    await run('scripts/verify/initial-release.ts', ['--write']);
    await run('scripts/verify/finish-catch-up.ts', ['--commit', snapshot.commit]);
    const report = JSON.parse(
      await readFile(
        path.join(snapshot.repositoryRoot, 'docs/verification/initial-release/post-catch-up.json'),
        'utf8',
      ),
    ) as { inputSubject: { digest: string } };
    if ((await auditInputSubject()).digest !== report.inputSubject.digest)
      throw new Error(
        'CATCH_UP_WORKTREE_DRIFT: exact commit passed, working inputs changed; evidence not copied.',
      );
    for (const directory of [
      'docs/verification/initial-release',
      'docs/reviews/human-content/initial-release',
      'docs/verification/learner-outcomes/initial-release',
    ])
      await cp(path.join(snapshot.repositoryRoot, directory), path.join(root, directory), {
        recursive: true,
      });
    console.log(
      JSON.stringify({
        status: 'passed',
        releaseCommit: snapshot.commit,
        evidenceCopied: true,
        productionReleaseApproved: false,
      }),
    );
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
