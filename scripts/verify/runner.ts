import { execFileSync, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { normalizeBasePath, resolvePort, resolveSite, UsageError } from '../config/publication.js';

export const EXIT_CODE = { success: 0, verificationFailure: 2, usage: 64, internal: 70 } as const;

export interface VerificationChange {
  readonly status: string;
  readonly file: string;
}
export interface VerificationStep {
  readonly id:
    | 'docs'
    | 'lint'
    | 'format'
    | 'schema'
    | 'check'
    | 'test'
    | 'build'
    | 'links'
    | 'browsers'
    | 'e2e';
  readonly script: string;
  readonly args?: readonly string[];
  readonly command?: 'node';
}
export type VerificationExecutor = (step: VerificationStep) => Promise<number>;
type GitReader = (args: readonly string[]) => string;

const documentationPath = (file: string): boolean =>
  [
    'AGENTS.md',
    'README.md',
    'docs/README.md',
    '.specify/feature.json',
    '.specify/memory/constitution.md',
  ].includes(file) ||
  /^\.specify\/templates\/[^/]+\.md$/u.test(file) ||
  /^docs\/operations\/[^/]+\.md$/u.test(file) ||
  /^specs\/\d{3}-[^/]+\/(?:[^/]+\/)*[^/]+\.md$/u.test(file);

/** Only a known index + nonpublic documentation diff stops the append chain. */
export function isHistoryOnlyPublication(changes: readonly VerificationChange[] | null): boolean {
  return (
    !!changes?.some(({ file }) => file === 'src/content/indexes/release-history.json') &&
    changes.every(
      ({ status, file }) =>
        ['A', 'M'].includes(status) &&
        (file === 'src/content/indexes/release-history.json' || documentationPath(file)),
    )
  );
}

/** Main must also verify changes that never reached a successful deployment. */
export function mergePublicationChanges(
  changes: readonly VerificationChange[] | null,
  env: NodeJS.ProcessEnv,
  git?: GitReader,
): readonly VerificationChange[] | null {
  if (env.GITHUB_EVENT_NAME !== 'push' || env.GITHUB_REF !== 'refs/heads/main') return changes;
  if (!env.ABC_TEXTBOOK_PUBLICATION_BASE_SHA || !changes) return null;
  const pending = readVerificationChanges(env, env.ABC_TEXTBOOK_PUBLICATION_BASE_SHA, git);
  return pending ? [...changes, ...pending] : null;
}

/** Renames become deletion + addition, keeping both paths in the verification union. */
export function readVerificationChanges(
  env: NodeJS.ProcessEnv,
  baseRef?: string,
  git: GitReader = (args) => execFileSync('git', [...args], { encoding: 'utf8' }),
): VerificationChange[] | null {
  try {
    const head = git(['rev-parse', 'HEAD']).trim();
    let comparison: string;
    if (baseRef) {
      comparison = git(['rev-parse', '--verify', `${baseRef}^{commit}`]).trim();
    } else {
      if (!env.GITHUB_EVENT_PATH || head !== env.GITHUB_SHA) return null;
      const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')) as {
        before?: string;
        pull_request?: { base?: { sha?: string } };
      };
      const base =
        env.GITHUB_EVENT_NAME === 'pull_request'
          ? event.pull_request?.base?.sha
          : env.GITHUB_EVENT_NAME === 'push'
            ? event.before
            : undefined;
      if (!base || !/^[a-f0-9]{40}$/u.test(base) || /^0+$/u.test(base)) return null;
      git(['rev-parse', '--verify', `${base}^{commit}`]);
      comparison =
        env.GITHUB_EVENT_NAME === 'pull_request' ? git(['merge-base', base, head]).trim() : base;
    }
    if (!/^[a-f0-9]{40}$/u.test(comparison)) return null;
    // Explicit local --base includes tracked working-tree edits. Actions compares exact commits.
    const fields = git([
      'diff',
      '--name-status',
      '--no-renames',
      '-z',
      comparison,
      ...(baseRef && !env.CI ? [] : [head]),
    ]).split('\0');
    if (fields.pop() !== '' || fields.length % 2 !== 0) return null;
    const changes: VerificationChange[] = [];
    for (let i = 0; i < fields.length; i += 2) {
      const status = fields[i],
        file = fields[i + 1];
      if (!status || !file || !/^[AMD]$/u.test(status)) return null;
      changes.push({ status, file });
    }
    if (baseRef && !env.CI) {
      for (const file of git(['ls-files', '--others', '--exclude-standard', '-z'])
        .split('\0')
        .filter(Boolean))
        changes.push({ status: 'A', file });
    }
    return changes;
  } catch {
    return null;
  }
}

const contentTests = [
  'tests/integration/full-public-projection.test.ts',
  'tests/unit/public-document.test.ts',
  'tests/unit/problem-content-projection.test.ts',
  'tests/unit/problem-authoring-document.test.ts',
];
const dataTests = [
  'tests/contract/schema-parity.test.ts',
  'tests/unit/domain-invariants.test.ts',
  'tests/unit/release-learning-structure.test.ts',
  'tests/unit/textbook-order.test.ts',
  'tests/unit/problem-reading-order.test.ts',
  'tests/unit/atcoder-problems-metrics.test.ts',
  'tests/contract/corpus-metadata.test.ts',
  'tests/integration/canonical-correction.test.ts',
  'tests/unit/release-history.test.ts',
];
const recordTests = [
  // Record filtering consumes coverage across leaf, parent, and chapter Units.
  'tests/integration/full-public-projection.test.ts',
  'tests/unit/learning-record-store.test.ts',
  'tests/unit/learning-record-timestamp.test.ts',
  'tests/integration/learning-record-backup.test.ts',
  'tests/integration/learning-record-control.test.ts',
];
const skillTests = [
  'tests/contract/explanation-authoring-skill.test.ts',
  'tests/unit/problem-authoring-document.test.ts',
  'tests/unit/problem-authoring-details.test.ts',
  'tests/unit/executable-example-evidence.test.ts',
];

/** Short path branches, no persisted plan or policy engine. Unknown scope stays broad. */
export function selectVerificationSteps(
  changes: readonly VerificationChange[] | null,
  env: NodeJS.ProcessEnv = {},
): VerificationStep[] {
  let broad = !changes?.length;
  let prose = false,
    data = false,
    ui = false,
    records = false,
    skill = false,
    history = false;
  const docs: string[] = [];
  for (const { status, file } of changes ?? []) {
    if (!['A', 'M', 'D'].includes(status)) {
      broad = true;
      continue;
    }
    if (documentationPath(file)) {
      if (status === 'D') broad = true;
      else docs.push(file);
    } else if (file === 'src/content/indexes/release-history.json') history = true;
    else if (file.startsWith('src/content/docs/')) prose = true;
    else if (file.startsWith('src/content/') || file === 'src/lib/taxonomy/textbook-order.ts')
      data = true;
    else if (file.startsWith('src/lib/learning-records/')) records = true;
    else if (/^src\/(?:pages|components|layouts|styles|client)\//u.test(file)) {
      ui = true;
      records = true;
    } else if (file.startsWith('.agents/skills/abc-explanation-author/')) skill = true;
    else broad = true;
  }
  const steps: VerificationStep[] = [];
  if (docs.length)
    steps.push({
      id: 'docs',
      command: 'node',
      script: '.github/actions/nonpublic-docs/check.mjs',
      args: ['--files', ...docs],
    });
  const runtime = broad || ui || records || skill;
  const publish = broad || prose || data || ui || records || history;
  if (runtime) steps.push({ id: 'lint', script: 'lint' });
  if (broad || prose || data || runtime || history)
    steps.push({ id: 'format', script: 'format:check' });
  if (broad || data) steps.push({ id: 'schema', script: 'schema:check' });
  if (runtime) steps.push({ id: 'check', script: 'check' });
  const tests = new Set<string>();
  if (prose || data || ui) for (const test of contentTests) tests.add(test);
  if (data) for (const test of dataTests) tests.add(test);
  if (records) for (const test of recordTests) tests.add(test);
  if (ui) tests.add('tests/contract/ui-routes.test.ts');
  if (skill) for (const test of skillTests) tests.add(test);
  if (history) {
    tests.add('tests/unit/release-history.test.ts');
    tests.add('tests/unit/publication-config.test.ts');
    tests.add('tests/unit/publication-update.test.ts');
  }
  if (broad || tests.size)
    steps.push({ id: 'test', script: 'test', ...(broad ? {} : { args: [...tests] }) });
  if (publish) {
    steps.push({ id: 'build', script: runtime ? 'build:checked' : 'build' });
    steps.push({ id: 'links', script: 'link:check:built' });
    if (env.CI && (broad || prose || data || ui || records))
      steps.push({ id: 'browsers', script: 'test:e2e:install:ci' });
    const e2e = new Set<string>();
    if (prose || data || ui || records) e2e.add('tests/e2e/full-projection.spec.ts');
    if (data || ui) e2e.add('tests/e2e/search.spec.ts');
    if (ui) {
      e2e.add('tests/e2e/accessibility.spec.ts');
      e2e.add('tests/e2e/contest-matrix.spec.ts');
    }
    if (records || data) e2e.add('tests/e2e/learning-records.spec.ts');
    if (broad || e2e.size)
      steps.push({
        id: 'e2e',
        script: 'test:e2e:built',
        args: ['--project=chromium', ...(broad ? [] : [...e2e])],
      });
  }
  return steps;
}

export async function runVerification(options: {
  readonly args: readonly string[];
  readonly env: NodeJS.ProcessEnv;
  readonly changes?: readonly VerificationChange[] | null;
  readonly execute?: VerificationExecutor;
  readonly report?: (message: string) => void;
}): Promise<number> {
  const report =
    options.report ??
    ((message: string) => {
      console.error(message);
    });
  const all = options.args.length === 1 && options.args[0] === '--all';
  const base =
    options.args.length === 2 &&
    options.args[0] === '--base' &&
    options.args[1] &&
    !options.args[1].startsWith('-')
      ? options.args[1]
      : undefined;
  if (options.args.length && !all && !base) {
    report('Usage: verify:fast [--all | --base REF]');
    return EXIT_CODE.usage;
  }
  try {
    normalizeBasePath(options.env.BASE_PATH ?? '/');
    resolveSite(options.env.SITE_URL ?? 'https://abc-textbook.example');
    resolvePort(options.env.LINK_CHECK_PORT ?? '8673', 'LINK_CHECK_PORT');
    resolvePort(options.env.PORT ?? '4321', 'PORT');
  } catch (error) {
    if (error instanceof UsageError) {
      report(error.message);
      return EXIT_CODE.usage;
    }
    throw error;
  }
  const changes = all
    ? null
    : options.changes === undefined
      ? mergePublicationChanges(readVerificationChanges(options.env, base), options.env)
      : options.changes;
  const steps = selectVerificationSteps(changes, options.env);
  const execute =
    options.execute ?? ((step: VerificationStep) => executeVerificationStep(step, options.env));
  report(`Verification scope: ${steps.map((step) => step.id).join(', ')}.`);
  try {
    for (const step of steps) {
      const exitCode = await execute(step);
      if (exitCode !== EXIT_CODE.success) {
        report(`${step.script} failed with native exit code ${String(exitCode)}.`);
        return exitCode === EXIT_CODE.usage || exitCode === EXIT_CODE.internal
          ? exitCode
          : EXIT_CODE.verificationFailure;
      }
    }
  } catch (error) {
    report(error instanceof Error ? error.message : String(error));
    return EXIT_CODE.internal;
  }
  if (options.env.GITHUB_OUTPUT) {
    const { appendFileSync } = await import('node:fs');
    appendFileSync(
      options.env.GITHUB_OUTPUT,
      `publication=${String(steps.some(({ id }) => id === 'build'))}\n`,
    );
  }
  return EXIT_CODE.success;
}

export function executeVerificationStep(
  step: VerificationStep,
  env: NodeJS.ProcessEnv,
): Promise<number> {
  const command =
    step.command === 'node' ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args =
    step.command === 'node'
      ? [step.script, ...(step.args ?? [])]
      : ['run', step.script, ...(step.args?.length ? ['--', ...step.args] : [])];
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal !== null) {
        reject(new Error(`${step.script} was terminated by signal ${signal}.`));
        return;
      }
      resolve(code ?? EXIT_CODE.internal);
    });
  });
}
