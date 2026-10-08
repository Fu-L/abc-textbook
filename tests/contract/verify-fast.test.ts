import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import {
  EXIT_CODE,
  executeVerificationStep,
  readVerificationChanges,
  runVerification,
  selectVerificationSteps,
  type VerificationChange,
} from '../../scripts/verify/runner.js';

const validEnvironment = { BASE_PATH: '/abc-textbook', SITE_URL: 'https://example.invalid' };
const changed = (...files: string[]): VerificationChange[] =>
  files.map((file) => ({ status: 'M', file }));
const plan = (...files: string[]) => selectVerificationSteps(changed(...files));
const ids = (...files: string[]) => plan(...files).map((step) => step.id);
const testArgs = (...files: string[]) =>
  plan(...files).find((step) => step.id === 'test')?.args ?? [];

describe('verify:fast change selection', () => {
  it('checks nonpublic documentation without preparing browsers, type checking or building', async () => {
    const changes = changed(
      'docs/operations/development.md',
      'specs/002-simplify-maintenance/plan.md',
    );
    expect(selectVerificationSteps(changes).map((step) => step.id)).toEqual(['docs']);
    const execute = vi.fn(() => Promise.resolve(0));
    expect(
      await runVerification({ args: [], env: validEnvironment, changes, execute, report: vi.fn() }),
    ).toBe(0);
    expect(execute.mock.calls).toHaveLength(1);
  });

  it('propagates a real documentation link failure through the required runner', async () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'verify-doc-failure-'));
    try {
      symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
      writeFileSync(path.join(root, 'fixture.md'), '# Fixture\n\n[Broken](missing.md)\n');
      const helper = path.join(root, 'check.mjs');
      const moduleUrl = pathToFileURL(
        path.resolve('.github/actions/nonpublic-docs/check.mjs'),
      ).href;
      writeFileSync(
        helper,
        `import { checkDocumentation } from ${JSON.stringify(moduleUrl)}; try { checkDocumentation([{file:'fixture.md'}], process.env.ABC_TEST_DOC_ROOT); } catch (error) { console.error(error.message); process.exit(1); }`,
      );
      const report = vi.fn();
      expect(
        await runVerification({
          args: [],
          env: validEnvironment,
          changes: changed('README.md'),
          report,
          execute: (step) =>
            executeVerificationStep(
              { ...step, script: helper, args: [] },
              { ...process.env, ABC_TEST_DOC_ROOT: root },
            ),
        }),
      ).toBe(EXIT_CODE.verificationFailure);
      expect(report).toHaveBeenCalledWith(
        expect.stringContaining('failed with native exit code 1'),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('validates published prose, real projection and links with one checked build', () => {
    expect(ids('src/content/docs/problems/abc212-g.md')).toEqual([
      'format',
      'test',
      'build',
      'links',
      'e2e',
    ]);
    expect(testArgs('src/content/docs/problems/abc212-g.md')).toContain(
      'tests/integration/full-public-projection.test.ts',
    );
    expect(
      plan('src/content/docs/problems/abc212-g.md').find((s) => s.id === 'build')?.script,
    ).toBe('build');
    expect(plan('src/content/docs/problems/abc212-g.md').find((s) => s.id === 'e2e')?.args).toEqual(
      ['--project=chromium', 'tests/e2e/full-projection.spec.ts'],
    );
  });

  it('retains real schema, ID/reference/DAG/order and metrics checks for data changes', () => {
    const files = [
      'src/content/problems/abc212-g.json',
      'src/content/policies/learning-prerequisites.json',
    ];
    expect(ids(...files)).toContain('schema');
    expect(testArgs(...files)).toEqual(
      expect.arrayContaining([
        'tests/unit/domain-invariants.test.ts',
        'tests/unit/release-learning-structure.test.ts',
        'tests/unit/textbook-order.test.ts',
        'tests/integration/full-public-projection.test.ts',
        'tests/unit/atcoder-problems-metrics.test.ts',
      ]),
    );
    expect(ids(...files)).toContain('links');
  });

  it('checks Unit coverage and review filtering for a learning-record filter change alone', () => {
    const file = 'src/lib/learning-records/filter.ts';
    expect(testArgs(file)).toEqual(
      expect.arrayContaining([
        'tests/integration/full-public-projection.test.ts',
        'tests/unit/learning-record-store.test.ts',
        'tests/unit/learning-record-timestamp.test.ts',
        'tests/integration/learning-record-backup.test.ts',
        'tests/integration/learning-record-control.test.ts',
      ]),
    );
    expect(plan(file).find((step) => step.id === 'e2e')?.args).toEqual([
      '--project=chromium',
      'tests/e2e/full-projection.spec.ts',
      'tests/e2e/learning-records.spec.ts',
    ]);
    expect(plan(file).find((step) => step.id === 'build')?.script).toBe('build:checked');
  });

  it('selects skill consumers rather than treating skill instructions as documentation', () => {
    expect(testArgs('.agents/skills/abc-explanation-author/references/writing-policy.md')).toEqual(
      expect.arrayContaining([
        'tests/contract/explanation-authoring-skill.test.ts',
        'tests/unit/problem-authoring-document.test.ts',
        'tests/unit/problem-authoring-details.test.ts',
      ]),
    );
    expect(ids('.agents/skills/speckit-implement/SKILL.md')).toContain('schema');
  });

  it('unions prose, UI, records, and documentation checks without duplicate build/check steps', () => {
    const files = [
      'src/content/docs/learn/a.md',
      'src/components/LearningRecordControls.tsx',
      'src/lib/learning-records/database.ts',
      'docs/operations/update-manual.md',
    ];
    const steps = plan(...files);
    expect(steps.filter((s) => s.id === 'build')).toHaveLength(1);
    expect(steps.find((s) => s.id === 'build')?.script).toBe('build:checked');
    expect(steps.filter((s) => s.id === 'check')).toHaveLength(1);
    expect(steps.find((s) => s.id === 'e2e')?.args).toEqual(
      expect.arrayContaining([
        '--project=chromium',
        'tests/e2e/learning-records.spec.ts',
        'tests/e2e/search.spec.ts',
      ]),
    );
    expect(steps.map((s) => s.id)).toContain('docs');
    expect(testArgs(...files)).toContain('tests/integration/learning-record-backup.test.ts');
    expect(
      testArgs(...files).filter(
        (file) => file === 'tests/integration/full-public-projection.test.ts',
      ),
    ).toHaveLength(1);
    expect(
      steps
        .find((s) => s.id === 'e2e')
        ?.args?.filter((file) => file === 'tests/e2e/full-projection.spec.ts'),
    ).toHaveLength(1);
  });

  it.each([
    null,
    [],
    changed('unknown/path'),
    changed('package-lock.json'),
    changed('scripts/verify/runner.ts'),
    [{ status: 'T', file: 'docs/README.md' }],
  ])('uses broad verification for unknown changes: %j', (changes) => {
    expect(selectVerificationSteps(changes).map((s) => s.id)).toEqual([
      'lint',
      'format',
      'schema',
      'check',
      'test',
      'build',
      'links',
      'e2e',
    ]);
    expect(selectVerificationSteps(changes).find((s) => s.id === 'test')?.args).toBeUndefined();
  });

  it('handles additions, deletions, and renames as both old and new paths', () => {
    expect(
      selectVerificationSteps([{ status: 'A', file: 'src/content/problems/abc999-e.json' }]).map(
        (s) => s.id,
      ),
    ).toContain('schema');
    expect(
      selectVerificationSteps([{ status: 'D', file: 'src/content/docs/problems/abc212-g.md' }]).map(
        (s) => s.id,
      ),
    ).toContain('links');
    // --no-renames reports a rename as a deletion and addition, so neither category is lost.
    expect(
      selectVerificationSteps([
        { status: 'D', file: 'src/content/docs/problems/a.md' },
        { status: 'A', file: 'src/lib/learning-records/a.ts' },
      ]).find((s) => s.id === 'e2e')?.args,
    ).toEqual(
      expect.arrayContaining([
        'tests/e2e/full-projection.spec.ts',
        'tests/e2e/learning-records.spec.ts',
      ]),
    );
    expect(
      selectVerificationSteps([{ status: 'D', file: 'docs/operations/development.md' }]).map(
        (s) => s.id,
      ),
    ).toContain('build');
  });

  it('prepares only Chromium in CI and only when E2E is selected', () => {
    expect(
      selectVerificationSteps(changed('README.md'), { CI: 'true' }).some(
        (s) => s.id === 'browsers',
      ),
    ).toBe(false);
    expect(
      selectVerificationSteps(null, { CI: 'true' }).find((s) => s.id === 'browsers')?.script,
    ).toBe('test:e2e:install:ci');
  });
});

describe('Git change selection', () => {
  it('uses PR merge-base and main before SHA, includes deleted/renamed paths, and fails broadly', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'verify-diff-'));
    const git = (args: readonly string[]) =>
      execFileSync('git', [...args], { cwd: root, encoding: 'utf8' });
    try {
      git(['init', '-q']);
      git(['config', 'user.name', 'Fixture']);
      git(['config', 'user.email', 'fixture@example.invalid']);
      mkdirSync(path.join(root, 'docs/operations'), { recursive: true });
      writeFileSync(path.join(root, 'docs/operations/a.md'), 'old\n');
      git(['add', '.']);
      git(['commit', '-qm', 'base']);
      const base = git(['rev-parse', 'HEAD']).trim();
      git(['switch', '-qc', 'feature']);
      mkdirSync(path.join(root, 'src/content/docs'), { recursive: true });
      git(['mv', 'docs/operations/a.md', 'src/content/docs/a.md']);
      git(['commit', '-qm', 'rename']);
      const head = git(['rev-parse', 'HEAD']).trim();
      git(['switch', '-qc', 'base-tip', base]);
      writeFileSync(path.join(root, 'README.md'), 'base advancement\n');
      git(['add', '.']);
      git(['commit', '-qm', 'advance']);
      const baseTip = git(['rev-parse', 'HEAD']).trim();
      git(['switch', '-q', 'feature']);
      const eventPath = path.join(root, 'event.json');
      writeFileSync(
        eventPath,
        JSON.stringify({ pull_request: { base: { sha: baseTip } }, before: base }),
      );
      const env = {
        GITHUB_EVENT_PATH: eventPath,
        GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_SHA: head,
      };
      const result = readVerificationChanges(env, undefined, git);
      expect(result).toEqual([
        { status: 'D', file: 'docs/operations/a.md' },
        { status: 'A', file: 'src/content/docs/a.md' },
      ]);
      expect(
        readVerificationChanges({ ...env, GITHUB_EVENT_NAME: 'push' }, undefined, git),
      ).toEqual(result);
      expect(readVerificationChanges(env, base, git)).toEqual([
        ...(result ?? []),
        { status: 'A', file: 'event.json' },
      ]);
      expect(readVerificationChanges({ ...env, GITHUB_SHA: base }, undefined, git)).toBeNull();
      expect(
        readVerificationChanges(env, undefined, () => {
          throw Error('missing history');
        }),
      ).toBeNull();
      writeFileSync(eventPath, JSON.stringify({ before: '0'.repeat(40) }));
      expect(
        readVerificationChanges({ ...env, GITHUB_EVENT_NAME: 'push' }, undefined, git),
      ).toBeNull();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('rejects malformed Git output instead of silently selecting fewer checks', () => {
    for (const output of ['M\0', 'R100\0old\0new\0', 'M\0README.md\0junk']) {
      expect(
        readVerificationChanges({}, 'HEAD', (args) =>
          args[0] === 'diff' ? output : 'a'.repeat(40),
        ),
      ).toBeNull();
    }
  });
});

describe('verify:fast failure propagation and script contract', () => {
  it.each(selectVerificationSteps(null).map((s) => s.id))(
    'stops after a %s failure and returns a nonzero status',
    async (failed) => {
      const executed: string[] = [];
      const execute = vi.fn((step: { id: string }) => {
        executed.push(step.id);
        return Promise.resolve(step.id === failed ? 1 : 0);
      });
      expect(
        await runVerification({ args: ['--all'], env: validEnvironment, execute, report: vi.fn() }),
      ).toBe(EXIT_CODE.verificationFailure);
      expect(executed.at(-1)).toBe(failed);
    },
  );
  it.each([64, 70])('preserves native exit code %s', async (code) => {
    expect(
      await runVerification({
        args: ['--all'],
        env: validEnvironment,
        execute: vi.fn(() => Promise.resolve(code)),
        report: vi.fn(),
      }),
    ).toBe(code);
  });
  it('propagates real process exit and signal termination', async () => {
    expect(
      await executeVerificationStep(
        { id: 'test', script: '-e', command: 'node', args: ['process.exit(17)'] },
        process.env,
      ),
    ).toBe(17);
    await expect(
      executeVerificationStep(
        {
          id: 'test',
          script: '-e',
          command: 'node',
          args: ['process.kill(process.pid,"SIGTERM")'],
        },
        process.env,
      ),
    ).rejects.toThrow('SIGTERM');
    expect(
      await runVerification({
        args: ['--all'],
        env: validEnvironment,
        execute: () => Promise.reject(Error('terminated by signal SIGTERM')),
        report: vi.fn(),
      }),
    ).toBe(70);
  });
  it.each(
    [['--unknown'], ['--base'], ['--base', 'HEAD', '--all'], ['--all', '--all']].map((args) => ({
      args,
    })),
  )('rejects invalid arguments %j', async ({ args }) => {
    const execute = vi.fn(() => Promise.resolve(0));
    expect(await runVerification({ args, env: validEnvironment, execute, report: vi.fn() })).toBe(
      64,
    );
    expect(execute).not.toHaveBeenCalled();
  });
  it.each([
    { SITE_URL: 'https://user:secret@example.invalid/' },
    { LINK_CHECK_PORT: '8673invalid' },
    { PORT: '0' },
    { BASE_PATH: '/abc?preview=true' },
  ])('rejects invalid environment %j', async (invalidEnv) => {
    const execute = vi.fn(() => Promise.resolve(0));
    expect(
      await runVerification({
        args: [],
        env: { ...validEnvironment, ...invalidEnv },
        execute,
        report: vi.fn(),
      }),
    ).toBe(64);
    expect(execute).not.toHaveBeenCalled();
  });
  it('keeps standalone build checked and provides a build for an already checked run', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts.build).toContain('astro check');
    expect(pkg.scripts['build:checked']).not.toContain('astro check');
    expect(pkg.scripts['test:e2e:install:ci']).toBe('playwright install --with-deps chromium');
    expect(pkg.scripts['test:e2e:install']).toContain('chromium firefox webkit');
  });
});

describe('production required-check failure gate', () => {
  const workflow = readFileSync('.github/workflows/production-deploy.yml', 'utf8');
  const gate = workflow.split("node --input-type=module <<'JS'\n")[1]?.split('\n          JS')[0];
  if (!gate) throw Error('Missing production check gate');

  it('accepts only completed successful required checks', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'verify-deploy-success-'));
    try {
      const file = path.join(root, 'checks.jsonl');
      const settings = JSON.parse(readFileSync('docs/operations/protected-main.json', 'utf8')) as {
        required_status_checks: { contexts: string[] };
      };
      writeFileSync(
        file,
        settings.required_status_checks.contexts
          .map((name) => JSON.stringify({ name, status: 'completed', conclusion: 'success' }))
          .join('\n'),
      );
      expect(() =>
        execFileSync(
          process.execPath,
          [
            '--input-type=module',
            '-e',
            gate.replace("'/tmp/check-runs.jsonl'", 'process.env.ABC_TEST_CHECKS_FILE'),
          ],
          { env: { ...process.env, ABC_TEST_CHECKS_FILE: file }, stdio: 'pipe' },
        ),
      ).not.toThrow();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(['failure', 'cancelled', 'timed_out', 'skipped', null])(
    'rejects a latest required check with conclusion %s even after an older success',
    (conclusion) => {
      const root = mkdtempSync(path.join(os.tmpdir(), 'verify-deploy-check-'));
      try {
        const file = path.join(root, 'checks.jsonl');
        const checks = [
          { name: 'Verify (release baseline)', status: 'completed', conclusion },
          { name: 'Verify (release baseline)', status: 'completed', conclusion: 'success' },
        ];
        writeFileSync(file, checks.map((check) => JSON.stringify(check)).join('\n'));
        const source = gate.replace("'/tmp/check-runs.jsonl'", 'process.env.ABC_TEST_CHECKS_FILE');
        expect(() =>
          execFileSync(process.execPath, ['--input-type=module', '-e', source], {
            env: { ...process.env, ABC_TEST_CHECKS_FILE: file },
            stdio: 'pipe',
          }),
        ).toThrow();
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  it('rejects an in-progress required check rather than deploying its older successful run', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'verify-deploy-check-'));
    try {
      const file = path.join(root, 'checks.jsonl');
      writeFileSync(
        file,
        JSON.stringify({
          name: 'Verify (release baseline)',
          status: 'in_progress',
          conclusion: 'success',
        }),
      );
      expect(() =>
        execFileSync(
          process.execPath,
          [
            '--input-type=module',
            '-e',
            gate.replace("'/tmp/check-runs.jsonl'", 'process.env.ABC_TEST_CHECKS_FILE'),
          ],
          { env: { ...process.env, ABC_TEST_CHECKS_FILE: file }, stdio: 'pipe' },
        ),
      ).toThrow();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
