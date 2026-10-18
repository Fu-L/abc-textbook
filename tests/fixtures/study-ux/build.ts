import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { runSmallBatchUpdate } from '../../../scripts/update-abc/index.js';
import { smallBatchInput, authorSmallBatch } from '../small-batch.js';

const execute = promisify(execFile);

/** One isolated build per test, with real projection, routes and CSS. Dependencies
 * resolve from the parent checkout; no node_modules symlink or public fixture. */
export async function withNewMaterialBuild(inspect: (dist: string) => Promise<void>) {
  await mkdir('build', { recursive: true });
  const root = await mkdtemp(path.resolve('build/study-ux-'));
  const candidate = await mkdtemp(path.join(tmpdir(), 'abc-new-material-'));
  const env = {
    ...process.env,
    SITE_URL: 'https://fu-l.github.io',
    BASE_PATH: '/abc-textbook',
    ASTRO_TELEMETRY_DISABLED: '1',
    GITHUB_ACTIONS: 'false',
    STUDY_UX_PREVIEW: '0',
  };
  const run = async (args: string[]) => {
    try {
      return await execute(process.execPath, args, { cwd: root, env, maxBuffer: 8 * 1024 * 1024 });
    } catch (error) {
      if (error && typeof error === 'object' && 'stderr' in error && 'stdout' in error)
        throw new Error(`${String(error.stdout)}\n${String(error.stderr)}`, { cause: error });
      throw error;
    }
  };
  try {
    const input = await smallBatchInput(candidate);
    assert.equal((await runSmallBatchUpdate({ ...input, mode: 'prepare' })).status, 'on_hold');
    await authorSmallBatch(input);
    const validated = await runSmallBatchUpdate({ ...input, mode: 'validate' });
    assert.equal(validated.status, 'passed', JSON.stringify(validated.holds));
    for (const entry of [
      'src',
      'scripts',
      'astro.config.mjs',
      'package.json',
      'tsconfig.json',
      'tsconfig.base.json',
    ])
      await cp(entry, path.join(root, entry), { recursive: true });
    await cp(path.join(candidate, 'src/content'), path.join(root, 'src/content'), {
      recursive: true,
    });
    await cp(
      'tests/fixtures/study-ux/new-unit.ts',
      path.join(root, 'tests/fixtures/study-ux/new-unit.ts'),
      { recursive: true },
    );
    const orderPath = path.join(root, 'src/lib/taxonomy/textbook-order.ts');
    await writeFile(
      orderPath,
      (await readFile(orderPath, 'utf8')).replace(
        'const textbookIndexById',
        `// Register the synthetic Unit in this disposable project's editorial order.\n(TEXTBOOK_CHAPTERS.find(({ id }) => id === 'unit-chapter-dynamic-programming')!.unitIds as unknown as string[]).push('unit-regression-transitions');\nconst textbookIndexById`,
      ),
    );
    const targetsPath = path.join(root, 'src/lib/taxonomy/unit-learning-targets.ts');
    await writeFile(
      targetsPath,
      `${await readFile(targetsPath, 'utf8')}\nUNIT_LEARNING_TARGETS['unit-regression-transitions'] = UNIT_LEARNING_TARGETS['unit-dp-transition-optimization']!;\n`,
    );
    await run(['--import', 'tsx', 'tests/fixtures/study-ux/new-unit.ts']);
    // Limit static output, keeping the production page bodies and CSS untouched.
    for (const [file, collection, id] of [
      ['src/pages/learn/[...slug].astro', 'learningUnits', 'unit-regression-transitions'],
      ['src/pages/problems/[problemId].astro', 'problems', 'abc467-e'],
    ] as const) {
      const target = path.join(root, file);
      await writeFile(
        target,
        (await readFile(target, 'utf8')).replace(
          `publicCatalog.${collection}.map(`,
          `publicCatalog.${collection}.filter((item) => item.id === '${id}').map(`,
        ),
      );
    }
    await writeFile(
      path.join(root, 'astro.fixture.config.mjs'),
      `
import config from './astro.config.mjs';
export default { ...config, integrations: [...config.integrations, {
  name: 'only-new-material-routes',
  hooks: { 'astro:build:setup': ({ pages }) => {
    for (const [key, page] of pages) {
      if (!['src/pages/learn/[...slug].astro', 'src/pages/problems/[problemId].astro'].includes(page.component)) pages.delete(key);
    }
  } }
}] };
`,
    );
    await run([
      path.resolve('node_modules/astro/bin/astro.mjs'),
      'build',
      '--config',
      './astro.fixture.config.mjs',
    ]);
    const dist = path.join(root, 'dist');
    assert.equal(
      (await readdir(dist, { recursive: true })).filter((file) => file.endsWith('.html')).length,
      2,
      'The fixture must build only its two representative pages',
    );
    await inspect(dist);
  } finally {
    await rm(candidate, { recursive: true, force: true });
    await rm(root, { recursive: true, force: true });
  }
}
