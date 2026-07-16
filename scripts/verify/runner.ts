import { spawn } from 'node:child_process';

import { normalizeBasePath, resolveSite, UsageError } from '../config/publication.js';

export const EXIT_CODE = {
  success: 0,
  verificationFailure: 2,
  usage: 64,
  internal: 70,
} as const;

export interface VerificationStep {
  readonly id: 'lint' | 'format' | 'check' | 'test' | 'build' | 'links' | 'e2e';
  readonly script: string;
}

export const VERIFICATION_STEPS: readonly VerificationStep[] = [
  { id: 'lint', script: 'lint' },
  { id: 'format', script: 'format:check' },
  { id: 'check', script: 'check' },
  { id: 'test', script: 'test' },
  { id: 'build', script: 'build' },
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
        return EXIT_CODE.verificationFailure;
      }
    }
  } catch (error) {
    report(error instanceof Error ? error.message : String(error));
    return EXIT_CODE.internal;
  }

  return EXIT_CODE.success;
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
