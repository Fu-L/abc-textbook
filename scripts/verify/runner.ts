import { spawn } from 'node:child_process';

import { normalizeBasePath, resolvePort, resolveSite, UsageError } from '../config/publication.js';

export const EXIT_CODE = {
  success: 0,
  verificationFailure: 2,
  usage: 64,
  internal: 70,
} as const;

export interface VerificationStep {
  readonly id:
    | 'lint'
    | 'format'
    | 'check'
    | 'test'
    | 'corpus'
    | 'problem-metrics'
    | 'authoring'
    | 'taxonomy'
    | 'final-taxonomy'
    | 'canonical-taxonomy'
    | 'learning-content'
    | 'full-learning-content'
    | 'problem-shard-index'
    | 'problem-shards'
    | 'problem-corpus'
    | 'build'
    | 'full-projections'
    | 'links'
    | 'e2e';
  readonly script: string;
}

export const VERIFICATION_STEPS: readonly VerificationStep[] = [
  { id: 'lint', script: 'lint' },
  { id: 'format', script: 'format:check' },
  { id: 'check', script: 'check' },
  { id: 'test', script: 'test' },
  { id: 'corpus', script: 'corpus:verify' },
  { id: 'problem-metrics', script: 'corpus:verify-atcoder-problems-metrics' },
  { id: 'authoring', script: 'corpus:verify-authoring' },
  { id: 'taxonomy', script: 'preview:taxonomy' },
  { id: 'final-taxonomy', script: 'corpus:final-taxonomy' },
  { id: 'canonical-taxonomy', script: 'corpus:materialize-taxonomy' },
  { id: 'full-learning-content', script: 'corpus:verify-learning-units' },
  { id: 'problem-shard-index', script: 'corpus:verify-problem-shard-index' },
  { id: 'problem-shards', script: 'corpus:verify-problem-shards' },
  { id: 'problem-corpus', script: 'corpus:verify-problem-corpus' },
  { id: 'learning-content', script: 'preview:learning-content' },
  { id: 'build', script: 'build' },
  { id: 'full-projections', script: 'corpus:verify-full-projections' },
  { id: 'links', script: 'link:check:built' },
  { id: 'e2e', script: 'test:e2e:built' },
];

export type VerificationExecutor = (step: VerificationStep) => Promise<number>;

interface RunVerificationOptions {
  readonly args: readonly string[];
  readonly env: NodeJS.ProcessEnv;
  readonly execute?: VerificationExecutor;
  readonly report?: (message: string) => void;
}

export async function runVerification(options: RunVerificationOptions): Promise<number> {
  const report =
    options.report ??
    ((message: string) => {
      console.error(message);
    });

  if (options.args.length > 0) {
    report('verify:fast does not accept arguments.');
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

  const execute = options.execute ?? executeNpmScript;

  try {
    for (const step of VERIFICATION_STEPS) {
      const exitCode = await execute(step);
      if (exitCode !== EXIT_CODE.success) {
        report(`${step.script} failed with native exit code ${String(exitCode)}.`);
        return classifyChildExitCode(exitCode);
      }
    }
  } catch (error) {
    report(error instanceof Error ? error.message : String(error));
    return EXIT_CODE.internal;
  }

  return EXIT_CODE.success;
}

function classifyChildExitCode(exitCode: number): number {
  if (exitCode === EXIT_CODE.usage || exitCode === EXIT_CODE.internal) {
    return exitCode;
  }

  return EXIT_CODE.verificationFailure;
}

function executeNpmScript(step: VerificationStep): Promise<number> {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  return new Promise((resolve, reject) => {
    const child = spawn(npmCommand, ['run', step.script], {
      env: process.env,
      stdio: 'inherit',
    });

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
