import { describe, expect, it } from 'vitest';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { assertAuditEvidence } from '../../scripts/verify/initial-release-evidence.js';

const signed = (overrides: Record<string, unknown> = {}) => {
  const evidence = {
    schemaVersion: '1.0.0',
    taskId: 'T133',
    status: 'passed',
    scope: 'canonical-full-corpus',
    inputSubject: { digest: 'a'.repeat(64), fileCount: 42 },
    sourceProjectionDigest: 'b'.repeat(64),
    generatedAt: '2026-10-06T09:00:00Z',
    checks: {},
    commands: [
      {
        command: 'npm run schema:check',
        exitCode: 0,
        durationMs: 1,
        outputDigest: 'c'.repeat(64),
        outputBytes: 12,
        observed: 'passed',
      },
    ],
    ...overrides,
  };
  return { ...evidence, evidenceDigest: canonicalDigest(evidence) };
};
const verify = (value: unknown) =>
  assertAuditEvidence(value, 'T133', 'a'.repeat(64), 'b'.repeat(64));
describe('initial-release evidence boundaries', () => {
  it('accepts a current canonical audit', () => {
    expect(verify(signed()).status).toBe('passed');
  });
  it('rejects preview evidence, another task and a stale subject even when signed', () => {
    for (const overrides of [
      { scope: 'private-preview' },
      { schemaVersion: '0.0.0' },
      { taskId: 'T154' },
      { inputSubject: { digest: 'd'.repeat(64), fileCount: 42 } },
    ])
      expect(() => verify(signed(overrides))).toThrow('AUDIT_REPORT_SUBJECT');
  });
  it('rejects failed or absent commands and changed report contents', () => {
    expect(() => verify(signed({ commands: [] }))).toThrow('AUDIT_REPORT_COMMAND_FAILED');
    expect(() => verify(signed({ commands: [{ exitCode: 2 }] }))).toThrow(
      'AUDIT_REPORT_COMMAND_FAILED',
    );
    expect(() => verify({ ...signed(), checks: { changed: true } })).toThrow('AUDIT_REPORT_DIGEST');
  });
});
