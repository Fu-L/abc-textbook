import { describe, expect, it, vi } from 'vitest';

import {
  EXIT_CODE,
  runVerification,
  type VerificationExecutor,
  type VerificationStep,
} from '../../scripts/verify/runner.js';

const validEnvironment = {
  BASE_PATH: '/abc-textbook',
  SITE_URL: 'https://example.invalid',
};

describe('verify:fast exit code contract', () => {
  it.each<VerificationStep['id']>(['lint', 'test', 'build', 'e2e'])(
    'maps a %s failure to verification exit code 2',
    async (failedStep) => {
      const execute: VerificationExecutor = vi.fn((step: VerificationStep) =>
        Promise.resolve(step.id === failedStep ? 1 : 0),
      );

      await expect(
        runVerification({
          args: [],
          env: validEnvironment,
          execute,
          report: vi.fn(),
        }),
      ).resolves.toBe(EXIT_CODE.verificationFailure);
    },
  );

  it('maps invalid environment variables to usage exit code 64 before running checks', async () => {
    const execute: VerificationExecutor = vi.fn(() => Promise.resolve(0));

    await expect(
      runVerification({
        args: [],
        env: {
          ...validEnvironment,
          SITE_URL: 'https://user:secret@example.invalid/',
        },
        execute,
        report: vi.fn(),
      }),
    ).resolves.toBe(EXIT_CODE.usage);
    expect(execute).not.toHaveBeenCalled();
  });

  it('maps unexpected arguments to usage exit code 64', async () => {
    await expect(
      runVerification({
        args: ['--unknown'],
        env: validEnvironment,
        execute: vi.fn(() => Promise.resolve(0)),
        report: vi.fn(),
      }),
    ).resolves.toBe(EXIT_CODE.usage);
  });
});
