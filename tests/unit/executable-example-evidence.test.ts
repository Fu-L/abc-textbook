import { describe, expect, it } from 'vitest';

import { ExecutableExampleEvidenceSchema } from '../../src/lib/domain/schema-parts/verification-evidence.js';

const sha = (character: string): string => character.repeat(64);
const evidence = () => ({
  schemaVersion: '1.0.0',
  releaseDigest: sha('a'),
  subjectDigest: sha('b'),
  inventoryDigest: sha('c'),
  inventoryCount: 1,
  checkedCount: 1,
  passedCount: 1,
  failedCount: 0,
  aggregatePassed: true,
  items: [
    {
      exampleId: 'example-one',
      subjectDigest: sha('b'),
      releaseDigest: sha('a'),
      environment: 'Node.js 24.18.0',
      command: 'node example.js',
      expectedResult: '42',
      actualResult: '42',
      exitCode: 0,
      passed: true,
      executedAt: '2026-07-17T12:00:00+09:00',
      resultDigest: sha('d'),
      evidencePath: 'docs/verification/examples/example-one.json',
    },
  ],
  generatedAt: '2026-07-17T12:01:00+09:00',
});

describe('executable example evidence contract', () => {
  it('accepts only complete, current, successful execution records', () => {
    expect(ExecutableExampleEvidenceSchema.safeParse(evidence()).success).toBe(true);
    expect(
      ExecutableExampleEvidenceSchema.safeParse({ ...evidence(), unexpected: true }).success,
    ).toBe(false);
  });

  it('rejects stale aggregates, mismatched scopes, and false successful results', () => {
    expect(
      ExecutableExampleEvidenceSchema.safeParse({ ...evidence(), checkedCount: 2 }).success,
    ).toBe(false);
    const wrongScope = evidence();
    const [wrongScopeItem] = wrongScope.items;
    if (!wrongScopeItem) throw new Error('Fixture item is missing.');
    wrongScopeItem.subjectDigest = sha('e');
    expect(ExecutableExampleEvidenceSchema.safeParse(wrongScope).success).toBe(false);
    const badExit = evidence();
    const [badExitItem] = badExit.items;
    if (!badExitItem) throw new Error('Fixture item is missing.');
    badExitItem.exitCode = 1;
    expect(ExecutableExampleEvidenceSchema.safeParse(badExit).success).toBe(false);
  });
});
