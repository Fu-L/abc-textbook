import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import type { JSONReportSuite } from '@playwright/test/reporter';

const execute = promisify(execFile);
// Setup runs outside workers: diagnostics must stay off JSON reporter stdout.

/** Let Playwright resolve file/project/grep/shard selection instead of maintaining
 * a second selector. --list does not start global setup, a web server or browsers. */
export async function selectsNewMaterial(args: string[]) {
  const { stdout } = await execute(
    process.execPath,
    [path.resolve('node_modules/@playwright/test/cli.js'), ...args, '--list', '--reporter=json'],
    {
      env: {
        ...process.env,
        // Keep a caller's JSON-report destination untouched during discovery.
        PLAYWRIGHT_JSON_OUTPUT_FILE: '',
        PLAYWRIGHT_JSON_OUTPUT_NAME: '',
        PLAYWRIGHT_JSON_OUTPUT_DIR: '',
      },
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  const report = JSON.parse(stdout) as { suites: JSONReportSuite[]; errors: unknown[] };
  if (report.errors.length) throw new Error(`New material selection failed: ${stdout}`);
  const containsTest = (suite: JSONReportSuite): boolean =>
    (suite.file === 'new-material.spec.ts' && suite.specs.some((spec) => spec.tests.length > 0)) ||
    (suite.suites?.some(containsTest) ?? false);
  return report.suites.some(containsTest);
}

export async function setupNewMaterial(
  selected: boolean,
  prepare = async (root: string) => {
    const { prepareNewMaterialBuild } = await import('./build.js');
    return prepareNewMaterialBuild(root);
  },
) {
  // A previous run's environment must never supply a stale build.
  delete process.env.ABC_NEW_MATERIAL_DIST;
  if (!selected) {
    console.error('New material setup skipped: no selected new-material test');
    return;
  }
  const started = performance.now();
  await mkdir('build', { recursive: true });
  const root = await mkdtemp(path.resolve('build/study-ux-'));
  const cleanup = async () => {
    delete process.env.ABC_NEW_MATERIAL_DIST;
    await rm(root, { recursive: true, force: true });
  };
  console.error('New material setup started');
  try {
    process.env.ABC_NEW_MATERIAL_DIST = await prepare(root);
    console.error(
      `New material setup finished: result=passed elapsed_ms=${String(Math.round(performance.now() - started))}`,
    );
    return cleanup;
  } catch (error) {
    console.error(
      `New material setup finished: result=failed elapsed_ms=${String(Math.round(performance.now() - started))}`,
    );
    await cleanup();
    throw error;
  }
}

export default async function globalSetup() {
  return setupNewMaterial(await selectsNewMaterial(process.argv.slice(2)));
}
