import { describe, expect, it, vi } from 'vitest';

import {
  EXIT_CODE,
  runVerification,
  VERIFICATION_STEPS,
  type VerificationExecutor,
  type VerificationStep,
} from '../../scripts/verify/runner.js';

const validEnvironment = {
  BASE_PATH: '/abc-textbook',
  SITE_URL: 'https://example.invalid',
};

describe('verify:fast exit code contract', () => {
  it('checks canonical materialization after final taxonomy and before learning content', () => {
    const ids = VERIFICATION_STEPS.map(({ id }) => id);
    expect(ids.indexOf('problem-metrics')).toBe(ids.indexOf('corpus') + 1);
    expect(ids.indexOf('authoring')).toBe(ids.indexOf('problem-metrics') + 1);
    expect(ids.indexOf('final-taxonomy')).toBe(ids.indexOf('taxonomy') + 1);
    expect(ids.indexOf('canonical-taxonomy')).toBe(ids.indexOf('final-taxonomy') + 1);
    expect(ids.indexOf('full-learning-content')).toBe(ids.indexOf('canonical-taxonomy') + 1);
    expect(ids.indexOf('learning-content')).toBe(ids.indexOf('full-learning-content') + 1);
    expect(ids.indexOf('learning-content')).toBeLessThan(ids.indexOf('build'));
  });

  it('registers the committed AtCoder Problems snapshot verifier', () => {
    expect(VERIFICATION_STEPS).toContainEqual({
      id: 'problem-metrics',
      script: 'corpus:verify-atcoder-problems-metrics',
    });
  });

  it.each<VerificationStep['id']>(VERIFICATION_STEPS.map((step) => step.id))(
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

  it.each(
    VERIFICATION_STEPS.flatMap((step) => [
      { expected: EXIT_CODE.usage, native: EXIT_CODE.usage, stepId: step.id },
      { expected: EXIT_CODE.internal, native: EXIT_CODE.internal, stepId: step.id },
    ]),
  )('preserves exit code $native from the $stepId step', async ({ expected, native, stepId }) => {
    const execute: VerificationExecutor = vi.fn((step: VerificationStep) =>
      Promise.resolve(step.id === stepId ? native : 0),
    );

    await expect(
      runVerification({
        args: [],
        env: validEnvironment,
        execute,
        report: vi.fn(),
      }),
    ).resolves.toBe(expected);
  });

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

  it.each([
    { LINK_CHECK_PORT: '8673invalid' },
    { PORT: '0' },
    { BASE_PATH: '/abc?preview=true' },
    { BASE_PATH: '/教材' },
    { BASE_PATH: '/abc text' },
    { BASE_PATH: '/abc"x' },
  ])('rejects invalid runner-owned environment before running checks: %s', async (invalidEnv) => {
    const execute: VerificationExecutor = vi.fn(() => Promise.resolve(0));

    await expect(
      runVerification({
        args: [],
        env: { ...validEnvironment, ...invalidEnv },
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
