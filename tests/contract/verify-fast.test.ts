import { execFileSync } from 'node:child_process';
import {
  globSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import {
  EXIT_CODE,
  executeVerificationStep,
  readVerificationChanges,
  mergePublicationChanges,
  runVerification,
  selectVerificationSteps,
  type VerificationChange,
} from '../../scripts/verify/runner.js';

const validEnvironment = { BASE_PATH: '/abc-textbook', SITE_URL: 'https://example.invalid' };
const comparisonImage = 'docs/operations/content-readability/after.png';
const changed = (...files: string[]): VerificationChange[] =>
  files.map((file) => ({ status: 'M', file }));
const plan = (...files: string[]) => selectVerificationSteps(changed(...files));
const ids = (...files: string[]) => plan(...files).map((step) => step.id);
const testArgs = (...files: string[]) =>
  plan(...files).find((step) => step.id === 'test')?.args ?? [];
const readingCases = [
  {
    files: [
      'tests/contract/content-readability.test.ts',
      'tests/unit/problem-reading.test.ts',
      'tests/e2e/problem-reading.spec.ts',
    ],
    tests: ['tests/contract/content-readability.test.ts', 'tests/unit/problem-reading.test.ts'],
    e2e: ['tests/e2e/problem-reading.spec.ts', 'tests/e2e/document-contents.spec.ts'],
  },
  {
    files: ['tests/unit/unit-reading.test.ts', 'tests/e2e/unit-reading.spec.ts'],
    tests: ['tests/unit/unit-reading.test.ts'],
    e2e: ['tests/e2e/unit-reading.spec.ts', 'tests/e2e/document-contents.spec.ts'],
  },
  {
    files: ['tests/unit/document-contents.test.ts', 'tests/e2e/document-contents.spec.ts'],
    tests: [
      'tests/unit/document-contents.test.ts',
      'tests/unit/problem-reading.test.ts',
      'tests/unit/unit-reading.test.ts',
    ],
    e2e: ['tests/e2e/document-contents.spec.ts'],
  },
  {
    files: ['tests/unit/study-ux-documents.test.ts', 'tests/e2e/study-readability.spec.ts'],
    tests: ['tests/unit/study-ux-documents.test.ts'],
    e2e: ['tests/e2e/study-readability.spec.ts', 'tests/e2e/document-contents.spec.ts'],
  },
];

describe('verify:fast change selection', () => {
  it('checks every existing comparison PNG through documentation without build, E2E or publication', async () => {
    const images = globSync('docs/operations/**/*.png');
    expect(images.length).toBeGreaterThan(0);
    for (const file of [...images, comparisonImage]) {
      expect(ids(file)).toEqual(['docs']);
      expect(ids(file, 'docs/operations/content-readability.md')).toEqual(['docs']);
    }
    const root = mkdtempSync(path.join(os.tmpdir(), 'verify-image-publication-'));
    try {
      const output = path.join(root, 'output');
      const execute = vi.fn(() => Promise.resolve(0));
      expect(
        await runVerification({
          args: [],
          env: { ...validEnvironment, CI: 'true', GITHUB_OUTPUT: output },
          changes: [{ status: 'A', file: comparisonImage }],
          execute,
          report: vi.fn(),
        }),
      ).toBe(0);
      expect(execute).toHaveBeenCalledTimes(1);
      expect(readFileSync(output, 'utf8')).toBe('publication=false\n');
    } finally {
      rmSync(root, { recursive: true });
    }
  });

  it.each([
    'src/content/docs/problems/abc212-e.md',
    'src/content/problems/abc212-e.json',
    'src/components/ProblemExplanation.astro',
  ])('unions comparison image validation with required checks for %s', (file) => {
    const steps = plan(comparisonImage, file);
    expect(steps[0]).toEqual({
      id: 'docs',
      command: 'node',
      script: '.github/actions/nonpublic-docs/check.mjs',
      args: ['--files', comparisonImage],
    });
    expect(steps.slice(1)).toEqual(plan(file));
  });

  it.each([
    'docs/operations/content-readability/after.svg',
    'docs/operations/content-readability/after.jpg',
    'docs/operations/content-readability/after.png.js',
    'docs/operations/content-readability/after.PNG',
    'docs/operations/unknown/after.png',
    'docs/operations/after.png',
    'docs/operations/content-readability/nested/after.png',
    'public/after.png',
  ])('retains broad verification for an unknown image path or extension: %s', (file) => {
    expect(plan(comparisonImage, file).slice(1)).toEqual(selectVerificationSteps(null));
  });

  it('retains broad deletion/rename verification and checks references without formatting deleted images', () => {
    const removed = { status: 'D', file: comparisonImage };
    const renamed = 'docs/operations/content-readability/renamed.png';
    const deletion = selectVerificationSteps([removed]);
    expect(deletion[0]?.args).toEqual(['--files']);
    expect(deletion.slice(1)).toEqual(selectVerificationSteps(null));
    const rename = selectVerificationSteps([removed, { status: 'A', file: renamed }]);
    expect(rename[0]?.args).toEqual(['--files', renamed]);
    expect(rename.slice(1)).toEqual(selectVerificationSteps(null));
    expect(selectVerificationSteps([{ status: 'R100', file: comparisonImage }])).toEqual(
      selectVerificationSteps(null),
    );
  });

  it.each(['prose', 'common'] as const)(
    'unions image-only main pushes with undeployed %s changes and still publishes',
    async (kind) => {
      const pending =
        kind === 'prose'
          ? 'src/content/docs/problems/abc212-e.md'
          : 'src/lib/catalog/full-public-projection.ts';
      const env = {
        ...validEnvironment,
        CI: 'true',
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/main',
        GITHUB_SHA: 'a'.repeat(40),
        ABC_TEXTBOOK_PUBLICATION_BASE_SHA: 'b'.repeat(40),
      };
      const union = mergePublicationChanges(changed(comparisonImage), env, (args) =>
        args[0] === 'diff'
          ? `M\0${pending}\0`
          : args[0] === 'rev-parse' && args[1] === 'HEAD'
            ? 'a'.repeat(40)
            : 'b'.repeat(40),
      );
      expect(selectVerificationSteps(union)).toEqual(plan(comparisonImage, pending));
      const root = mkdtempSync(path.join(os.tmpdir(), 'verify-pending-image-'));
      try {
        const output = path.join(root, 'output');
        await runVerification({
          args: [],
          env: { ...env, GITHUB_OUTPUT: output },
          changes: union,
          execute: () => Promise.resolve(0),
          report: vi.fn(),
        });
        expect(readFileSync(output, 'utf8')).toBe('publication=true\n');
      } finally {
        rmSync(root, { recursive: true });
      }
    },
  );

  it.each(['missing image', 'inline reference', 'reference definition', 'deletion', 'rename'])(
    'stops the required runner on a real comparison image failure: %s',
    async (failure) => {
      const root = mkdtempSync(path.join(os.tmpdir(), 'verify-image-failure-'));
      try {
        mkdirSync(path.join(root, 'docs/operations/content-readability'), { recursive: true });
        const renamed = 'docs/operations/content-readability/renamed.png';
        const changes: VerificationChange[] =
          failure === 'deletion' || failure === 'rename'
            ? [{ status: 'D', file: comparisonImage }]
            : changed(comparisonImage);
        if (failure !== 'missing image' && failure !== 'deletion')
          writeFileSync(
            path.join(root, failure === 'rename' ? renamed : comparisonImage),
            Buffer.from([137, 80, 78, 71, 0]),
          );
        if (failure === 'rename') changes.push({ status: 'A', file: renamed });
        const target = failure.includes('reference') ? 'absent.png' : 'after.png';
        writeFileSync(
          path.join(root, 'docs/operations/content-readability.md'),
          failure === 'reference definition'
            ? `![After][image]\n\n[image]: content-readability/${target}\n`
            : `![After](content-readability/${target})\n`,
        );
        const helper = path.join(root, 'check.mjs');
        const moduleUrl = pathToFileURL(
          path.resolve('.github/actions/nonpublic-docs/check.mjs'),
        ).href;
        writeFileSync(
          helper,
          `import { checkDocumentation } from ${JSON.stringify(moduleUrl)}; try { checkDocumentation(process.argv.slice(2).map(file => ({file})), process.env.ABC_TEST_DOC_ROOT); } catch (error) { console.error(error.message); process.exit(1); }`,
        );
        const executed: string[] = [];
        expect(
          await runVerification({
            args: [],
            env: validEnvironment,
            changes,
            report: vi.fn(),
            execute: (step) => {
              executed.push(step.id);
              return executeVerificationStep(
                { ...step, script: helper, args: step.args?.slice(1) ?? [] },
                { ...process.env, ABC_TEST_DOC_ROOT: root },
              );
            },
          }),
        ).toBe(EXIT_CODE.verificationFailure);
        expect(executed).toEqual(['docs']);
      } finally {
        rmSync(root, { recursive: true });
      }
    },
  );

  it('verifies history-only publications without another history append or the full data suite', () => {
    expect(
      ids('src/content/indexes/release-history.json', 'docs/operations/update-manual.md'),
    ).toEqual(['docs', 'format', 'test', 'build', 'links']);
    expect(testArgs('src/content/indexes/release-history.json')).toContain(
      'tests/unit/release-history.test.ts',
    );
  });
  it('merges undeployed changes and refuses the history-only shortcut when lookup fails', () => {
    const env = {
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/heads/main',
      GITHUB_SHA: 'a'.repeat(40),
      ABC_TEXTBOOK_PUBLICATION_BASE_SHA: 'b'.repeat(40),
    };
    const git = (args: readonly string[]) =>
      args[0] === 'diff'
        ? 'M\0src/content/docs/problems/abc212-e.md\0'
        : args[0] === 'rev-parse' && args[1] === 'HEAD'
          ? 'a'.repeat(40)
          : 'b'.repeat(40);
    const union = mergePublicationChanges(
      changed('src/content/indexes/release-history.json'),
      env,
      git,
    );
    expect(union).toContainEqual({ status: 'M', file: 'src/content/docs/problems/abc212-e.md' });
    expect(selectVerificationSteps(union).map(({ id }) => id)).toContain('e2e');
    expect(
      mergePublicationChanges(
        changed('docs/operations/update-manual.md'),
        { ...env, ABC_TEXTBOOK_PUBLICATION_BASE_SHA: undefined },
        git,
      ),
    ).toBeNull();
    expect(
      mergePublicationChanges(changed('docs/operations/update-manual.md'), env, () => {
        throw Error('unknown commit');
      }),
    ).toBeNull();
  });
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
      [
        '--project=chromium',
        'tests/e2e/full-projection.spec.ts',
        'tests/e2e/new-material.spec.ts',
        'tests/e2e/document-contents.spec.ts',
      ],
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

  it.each([
    'src/content/docs/learn/a.md',
    'src/content/problems/abc999-e.json',
    'src/components/ProblemExplanation.astro',
    '.agents/skills/abc-explanation-author/references/writing-policy.md',
    'src/lib/taxonomy/canonical-taxonomy-materialization.ts',
  ])('runs the isolated new-material regression for %s', (file) => {
    const args = plan(file).find((step) => step.id === 'e2e')?.args ?? [];
    // An empty spec list after the project flag means the complete E2E suite.
    expect(args).toContain('--project=chromium');
    expect(args.length === 1 || args.includes('tests/e2e/new-material.spec.ts')).toBe(true);
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
        'tests/e2e/document-widths.spec.ts',
        'tests/e2e/study-readability.spec.ts',
        'tests/e2e/new-material.spec.ts',
        'tests/e2e/problem-reading.spec.ts',
        'tests/e2e/unit-reading.spec.ts',
        'tests/e2e/textbook-navigation.spec.ts',
        'tests/e2e/study-entry-points.spec.ts',
        'tests/e2e/study-indexes.spec.ts',
        'tests/e2e/document-contents.spec.ts',
      ]),
    );
    expect(steps.map((s) => s.id)).toContain('docs');
    expect(testArgs(...files)).toContain('tests/integration/learning-record-backup.test.ts');
    expect(testArgs(...files)).toContain('tests/unit/problem-reading.test.ts');
    expect(testArgs(...files)).toContain('tests/unit/unit-reading.test.ts');
    expect(testArgs(...files)).toContain('tests/unit/textbook-navigation.test.ts');
    expect(testArgs(...files)).toContain('tests/unit/document-contents.test.ts');
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

describe('known reading regression selection', () => {
  const common = [
    'tests/integration/full-public-projection.test.ts',
    'tests/unit/public-document.test.ts',
    'tests/unit/problem-content-projection.test.ts',
    'tests/unit/problem-authoring-document.test.ts',
    'tests/unit/study-ux-documents.test.ts',
  ];
  const cases = readingCases.flatMap((group) => group.files.map((file) => ({ ...group, file })));

  it.each(cases)('runs $file itself with its explicit reading checks', ({ file, tests, e2e }) => {
    expect(readFileSync(file, 'utf8').length).toBeGreaterThan(0);
    for (const status of ['A', 'M']) {
      const steps = selectVerificationSteps([{ status, file }], { CI: 'true' });
      expect(steps.map(({ id }) => id)).toEqual([
        'lint',
        'format',
        'check',
        'test',
        'build',
        'links',
        'browsers',
        'e2e',
      ]);
      const selectedTests = steps.find(({ id }) => id === 'test')?.args;
      const selectedE2e = steps.find(({ id }) => id === 'e2e')?.args;
      expect(selectedTests).toEqual([...new Set([...common, ...tests])]);
      expect(selectedE2e).toEqual(['--project=chromium', ...e2e]);
      expect([...(selectedTests ?? []), ...(selectedE2e ?? [])]).toContain(file);
      expect(steps.find(({ id }) => id === 'build')?.script).toBe('build:checked');
      expect(steps.find(({ id }) => id === 'browsers')?.script).toBe('test:e2e:install:ci');
    }
  });

  it.each(cases)('keeps the prose checks when $file accompanies a heading edit', ({ file }) => {
    const prose = 'src/content/docs/problems/abc391-f.md';
    const steps = plan(file, prose);
    for (const id of ['test', 'e2e'] as const) {
      const args = steps.find((step) => step.id === id)?.args ?? [];
      const expected = new Set([
        ...(plan(file).find((step) => step.id === id)?.args ?? []),
        ...(plan(prose).find((step) => step.id === id)?.args ?? []),
      ]);
      expect(new Set(args)).toEqual(expected);
      expect(args).toHaveLength(expected.size);
    }
    expect(steps.find(({ id }) => id === 'e2e')?.args).toContain(
      'tests/e2e/document-contents.spec.ts',
    );
    expect(steps.filter(({ id }) => id === 'build')).toHaveLength(1);
    expect(steps.filter(({ id }) => id === 'links')).toHaveLength(1);
  });

  it('unions known regressions, data, records and documentation without duplicate checks', () => {
    const files = [
      ...cases.map(({ file }) => file),
      'src/content/problems/abc391-f.json',
      'src/lib/learning-records/filter.ts',
      'docs/operations/development.md',
    ];
    const steps = plan(...files);
    for (const id of ['test', 'e2e'] as const) {
      const args = steps.find((step) => step.id === id)?.args ?? [];
      expect(new Set(args)).toEqual(
        new Set(files.flatMap((file) => plan(file).find((step) => step.id === id)?.args ?? [])),
      );
      expect(new Set(args).size).toBe(args.length);
    }
    expect(steps.map(({ id }) => id)).toContain('schema');
    expect(steps.map(({ id }) => id)).toContain('docs');
  });

  it.each(cases)('falls back broadly for deletion or rename of $file', ({ file }) => {
    const deletion: VerificationChange = { status: 'D', file };
    expect(selectVerificationSteps([deletion])).toEqual(selectVerificationSteps(null));
    for (const destination of ['tests/e2e/problem-reading.spec.ts', 'tests/e2e/renamed.spec.ts']) {
      expect(selectVerificationSteps([deletion, { status: 'A', file: destination }])).toEqual(
        selectVerificationSteps(null),
      );
      expect(
        selectVerificationSteps([
          { status: 'D', file: destination },
          { status: 'A', file },
        ]),
      ).toEqual(selectVerificationSteps(null));
    }
  });

  it.each([
    'tests/fixtures/documents/widths.md',
    'tests/fixtures/study-ux/build.ts',
    'tests/setup/fixed-clock.ts',
    'tests/e2e/fixtures.ts',
    'playwright.config.ts',
    'vitest.config.ts',
    'tests/unit/public-document.test.ts',
    'tests/e2e/document-widths.spec.ts',
    'tests/unit/unknown.test.ts',
    'tests/e2e/unknown.spec.ts',
    'src/lib/domain/schema.ts',
    'src/lib/study-preview/manuscripts.ts',
    'package-lock.json',
    '.github/workflows/ci.yml',
  ])('keeps broad checks for %s alone or mixed with known tests', (file) => {
    expect(plan(file)).toEqual(selectVerificationSteps(null));
    expect(plan('tests/e2e/problem-reading.spec.ts', file)).toEqual(selectVerificationSteps(null));
  });

  it.each(['src/content/docs/problems/abc391-f.md', 'src/lib/catalog/full-public-projection.ts'])(
    'keeps undeployed %s changes on a main push of a known test',
    (pending) => {
      const env = {
        CI: 'true',
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/main',
        ABC_TEXTBOOK_PUBLICATION_BASE_SHA: 'b'.repeat(40),
      };
      const changes = changed('tests/e2e/problem-reading.spec.ts');
      const union = mergePublicationChanges(changes, env, (args) =>
        args[0] === 'diff' ? `M\0${pending}\0` : 'b'.repeat(40),
      );
      expect(union).toEqual([...changes, ...changed(pending)]);
      expect(selectVerificationSteps(union)).toEqual(
        plan('tests/e2e/problem-reading.spec.ts', pending),
      );
      expect(
        selectVerificationSteps(
          mergePublicationChanges(changes, {
            ...env,
            ABC_TEXTBOOK_PUBLICATION_BASE_SHA: undefined,
          }),
        ),
      ).toEqual(selectVerificationSteps(null));
    },
  );
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

describe('verify:fast Actions diagnostics', () => {
  it('explains unavailable comparisons and the undeployed main union', () => {
    const report = vi.fn();
    expect(
      readVerificationChanges(
        {},
        'HEAD',
        () => {
          throw Error('missing history');
        },
        report,
      ),
    ).toBeNull();
    expect(report).toHaveBeenCalledWith(
      'Verification comparison unavailable: Git/event lookup failed: missing history.',
    );
    const env = { CI: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/heads/main' };
    expect(mergePublicationChanges(changed('README.md'), env, undefined, report)).toBeNull();
    expect(report).toHaveBeenCalledWith(
      expect.stringContaining(
        'main requires both the push diff and last successful deployment SHA',
      ),
    );
    const git = (args: readonly string[]) =>
      args[0] === 'diff' ? 'M\0scripts/verify/runner.ts\0' : 'a'.repeat(40);
    const union = mergePublicationChanges(
      changed('README.md'),
      { ...env, ABC_TEXTBOOK_PUBLICATION_BASE_SHA: 'a'.repeat(40) },
      git,
      report,
    );
    expect(union).toEqual(changed('README.md', 'scripts/verify/runner.ts'));
    expect(report).toHaveBeenCalledWith(
      `Verification includes undeployed changes since ${'a'.repeat(40)}.`,
    );
  });

  it.each([
    'docs/operations/development.md',
    'src/content/docs/problems/abc212-g.md',
    'src/content/problems/abc212-g.json',
    'src/components/ProblemExplanation.astro',
    'scripts/verify/runner.ts',
  ])('reports the selected commands, arguments and serial execution for %s', async (file) => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'verify-logs-'));
    try {
      const output = path.join(root, 'output');
      const env = { ...validEnvironment, CI: 'true', GITHUB_OUTPUT: output };
      const steps = selectVerificationSteps(changed(file), env);
      const messages: string[] = [];
      const executed: string[] = [];
      let monotonic = 100;
      vi.spyOn(performance, 'now').mockImplementation(() => monotonic);
      expect(
        await runVerification({
          args: [],
          env,
          changes: changed(file),
          report: (message) => messages.push(message),
          execute: (step) => {
            expect(messages.at(-1)).toMatch(`Verification started: id=${step.id} at=`);
            executed.push(step.id);
            // Wall-clock adjustments must not change elapsed time.
            vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2000-01-01T00:00:00.000Z');
            monotonic += 12.5;
            return Promise.resolve(0);
          },
        }),
      ).toBe(0);
      expect(executed).toEqual(steps.map(({ id }) => id));
      const planned = messages.filter((message) => message.startsWith('Verification planned:'));
      const finished = messages.filter((message) => message.startsWith('Verification finished:'));
      expect(planned).toHaveLength(steps.length);
      expect(finished).toHaveLength(steps.length);
      for (const [i, step] of steps.entries()) {
        const args =
          step.command === 'node'
            ? [step.script, ...(step.args ?? [])]
            : ['run', step.script, ...(step.args?.length ? ['--', ...step.args] : [])];
        expect(planned[i]).toContain(`id=${step.id} command=`);
        expect(planned[i]).toContain(`args=${JSON.stringify(args)}`);
        expect(finished[i]).toContain(`id=${step.id} at=`);
        expect(finished[i]).toContain('elapsed_ms=12.500 result=passed native_exit_code=0');
      }
      expect(readFileSync(output, 'utf8')).toBe(
        `publication=${String(steps.some(({ id }) => id === 'build'))}\n`,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each([
    { args: ['--all'], changes: null, reason: 'explicit --all' },
    { args: [], changes: null, reason: 'change set unavailable' },
    { args: [], changes: [], reason: 'empty change set' },
    {
      args: [],
      changes: changed('new/path'),
      reason: 'common code/configuration or unknown path: "new/path"',
    },
    {
      args: [],
      changes: [{ status: 'D', file: 'README.md' }],
      reason: 'nonpublic documentation deleted: "README.md"',
    },
    {
      args: [],
      changes: [{ status: 'T', file: 'README.md' }],
      reason: 'unsupported change status:',
    },
  ])('explains broad selection: $reason', async ({ args, changes, reason }) => {
    const report = vi.fn();
    await runVerification({
      args,
      changes,
      env: validEnvironment,
      report,
      execute: () => Promise.resolve(0),
    });
    expect(report).toHaveBeenCalledWith(
      expect.stringContaining(`Verification broad scope reason: ${reason}`),
    );
    expect(report).toHaveBeenCalledWith(
      'Verification planned: id=test command="npm" args=["run","test"].',
    );
    expect(report).toHaveBeenCalledWith(
      'Verification planned: id=e2e command="npm" args=["run","test:e2e:built","--","--project=chromium"].',
    );
  });

  it.each([1, 64, 70, 'signal', 'unavailable'] as const)(
    'times a stopped step without publishing or completing later steps: %s',
    async (failure) => {
      const root = mkdtempSync(path.join(os.tmpdir(), 'verify-stop-'));
      try {
        const output = path.join(root, 'output');
        writeFileSync(output, 'existing=value\n');
        const report = vi.fn();
        const execute = vi.fn(async (step: { id: string }) => {
          if (step.id !== 'test') return 0;
          if (failure === 'signal')
            return executeVerificationStep(
              {
                id: 'test',
                command: 'node',
                script: '-e',
                args: ['process.kill(process.pid,"SIGTERM")'],
              },
              process.env,
            );
          if (failure === 'unavailable')
            return executeVerificationStep(
              { id: 'test', script: 'test' },
              { ...process.env, PATH: root },
            );
          return failure;
        });
        expect(
          await runVerification({
            args: ['--all'],
            env: { ...validEnvironment, GITHUB_OUTPUT: output },
            execute,
            report,
          }),
        ).toBe(failure === 1 ? 2 : typeof failure === 'number' ? failure : 70);
        const messages = report.mock.calls.map(([message]) => String(message));
        expect(messages).toContainEqual(
          expect.stringMatching(
            /^Verification finished: id=test at=\S+ elapsed_ms=\d+\.\d{3} result=(failed|error)/u,
          ),
        );
        expect(messages).not.toContainEqual(
          expect.stringMatching(/^Verification (started|finished): id=(build|links|e2e)/u),
        );
        if (failure === 'signal')
          expect(messages).toContainEqual(expect.stringContaining('SIGTERM'));
        if (failure === 'unavailable')
          expect(messages).toContainEqual(expect.stringContaining('ENOENT'));
        expect(readFileSync(output, 'utf8')).toBe('existing=value\n');
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  it('does not log planned or completed steps on usage errors', async () => {
    const report = vi.fn();
    expect(await runVerification({ args: ['--unknown'], env: validEnvironment, report })).toBe(64);
    expect(report.mock.calls).toEqual([['Usage: verify:fast [--all | --base REF]']]);
  });
});
