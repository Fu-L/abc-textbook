import { execFile } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it, vi } from 'vitest';
import { selectsNewMaterial, setupNewMaterial } from '../fixtures/study-ux/setup.js';

const execute = promisify(execFile);
const cli = path.resolve('node_modules/@playwright/test/cli.js');
const setup = path.resolve('tests/fixtures/study-ux/setup.ts');

// These tests launch child runners; allow for process startup under full-suite load.
describe('new material Playwright setup', { timeout: 30_000 }, () => {
  it.each([
    [['--project=chromium', 'tests/e2e/new-material.spec.ts'], true],
    [['tests/e2e/new-material.spec.ts'], true],
    [['--project=chromium'], true],
    [['--project=chromium', 'tests/e2e/unit-reading.spec.ts'], false],
    [['--project=chromium', '--grep', 'publishes a newly generated'], true],
    [['--project=chromium', '--grep-invert', 'publishes a newly generated'], false],
  ])('uses real Playwright selection: %j', async (args, expected) => {
    expect(await selectsNewMaterial(['test', ...args])).toBe(expected);
  });

  it('rejects discovery errors instead of treating them as a skipped build', async () => {
    await expect(selectsNewMaterial(['test', '--project=missing-browser'])).rejects.toThrow();
  });

  it('prepares only the shard containing the new material test', async () => {
    const selected = await Promise.all(
      ['1/2', '2/2'].map((shard) =>
        selectsNewMaterial([
          'test',
          '--project=chromium',
          'tests/e2e/new-material.spec.ts',
          `--shard=${shard}`,
          '--pass-with-no-tests',
        ]),
      ),
    );
    expect(selected.filter(Boolean)).toHaveLength(1);
  });

  it('skips preparation and discards a stale inherited dist', async () => {
    vi.stubEnv('ABC_NEW_MATERIAL_DIST', '/stale/dist');
    const prepare = vi.fn();
    expect(await setupNewMaterial(false, prepare)).toBeUndefined();
    expect(prepare).not.toHaveBeenCalled();
    expect(process.env.ABC_NEW_MATERIAL_DIST).toBeUndefined();
  });

  // Run the real Playwright lifecycle without browsers or a corpus build. These
  // cases cover setup failure, failed tests, and one build shared by workers.
  it.each(['passed', 'test-failed', 'setup-failed', 'json-report'] as const)(
    'cleans run-owned output when %s and preserves the exit status',
    async (outcome) => {
      await mkdir('build', { recursive: true });
      const root = await mkdtemp(path.resolve('build/new-material-lifecycle-'));
      try {
        const succeeds = outcome === 'passed' || outcome === 'json-report';
        const state = path.join(root, 'prepared-root');
        const marker = path.join(root, 'test-ran');
        await writeFile(
          path.join(root, 'global.setup.ts'),
          `import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setupNewMaterial } from ${JSON.stringify(setup)};
export default () => setupNewMaterial(true, async root => {
  await writeFile(${JSON.stringify(state)}, root, { flag: 'wx' });
  const dist = path.join(root, 'dist');
  await mkdir(dist);
  await writeFile(path.join(dist, 'index.html'), 'fresh build');
  ${outcome === 'setup-failed' ? "throw new Error('fixture preparation failed');" : 'return dist;'}
});
`,
        );
        await writeFile(
          path.join(root, 'playwright.config.ts'),
          `export default { testDir: '.', testMatch: '*.spec.ts', globalSetup: './global.setup.ts',
fullyParallel: true, workers: 2, retries: 0, reporter: ${JSON.stringify(outcome === 'json-report' ? 'json' : 'list')}, outputDir: './results' };`,
        );
        await writeFile(
          path.join(root, 'lifecycle.spec.ts'),
          `import { test, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
for (const name of ['PC', 'mobile']) test(name, async () => {
  const dist = process.env.ABC_NEW_MATERIAL_DIST;
  expect(dist).toBe(path.join(await readFile(${JSON.stringify(state)}, 'utf8'), 'dist'));
  expect(await readFile(path.join(dist, 'index.html'), 'utf8')).toBe('fresh build');
  await writeFile(${JSON.stringify(marker)}, 'ran');
  ${outcome === 'test-failed' ? "throw new Error('browser assertion failed');" : ''}
});`,
        );
        const result = await execute(process.execPath, [cli, 'test', '--config', root]).then(
          ({ stdout, stderr }) => ({ code: 0, stdout, stderr }),
          (error: unknown) => {
            if (
              !(error instanceof Error) ||
              !('code' in error) ||
              !('stdout' in error) ||
              !('stderr' in error)
            )
              throw error;
            return {
              code: Number(error.code),
              stdout: String(error.stdout),
              stderr: String(error.stderr),
            };
          },
        );
        expect(result.code).toBe(succeeds ? 0 : 1);
        expect(result.stderr).toContain(
          `New material setup finished: result=${outcome === 'setup-failed' ? 'failed' : 'passed'}`,
        );
        const preparedRoot = await readFile(state, 'utf8');
        await expect(access(preparedRoot)).rejects.toThrow();
        if (outcome === 'setup-failed') {
          await expect(access(marker)).rejects.toThrow();
          expect(result.stdout).toContain('fixture preparation failed');
        } else {
          expect(await readFile(marker, 'utf8')).toBe('ran');
          if (outcome === 'json-report') {
            const report = JSON.parse(result.stdout) as {
              stats: { expected: number; unexpected: number };
            };
            expect(report.stats).toMatchObject({ expected: 2, unexpected: 0 });
          } else {
            expect(result.stdout).toContain(succeeds ? '2 passed' : '2 failed');
          }
        }
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    },
  );
});
