import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { digestWithoutField } from '../../src/lib/domain/canonical-json.js';

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;

interface Condition {
  readonly attribute: string;
  readonly operator: string;
  readonly value: unknown;
}

const ruleMatches = (
  rule: { readonly clauses: readonly { readonly all: readonly Condition[] }[] },
  input: Readonly<Record<string, unknown>>,
): boolean =>
  rule.clauses.some(({ all }) =>
    all.every(
      (condition) => condition.operator === 'eq' && input[condition.attribute] === condition.value,
    ),
  );

describe('canonical content policies', () => {
  it('fails closed when any similar/supplement comparison dimension is undocumented', () => {
    const policyDocument = readJson('src/content/policies/problem-placement.json');
    const policy = policyDocument as {
      digest: string;
      modeRules: Record<string, { clauses: { all: Condition[] }[] }>;
    };
    expect(digestWithoutField(policyDocument, 'digest')).toBe(policy.digest);
    const complete = {
      primary_explanation_valid: true,
      algorithm_same: true,
      proof_same: true,
      complexity_same: true,
      constraints_difference_documented: true,
      prerequisites_same: true,
      implementation_difference_documented: true,
      learning_outcomes_same: true,
      additional_learning_count: 0,
      evidence_complete: true,
      conflict_free: true,
    };
    const similar = policy.modeRules.similar;
    const supplement = policy.modeRules.supplement;
    if (!similar || !supplement) throw new Error('Placement policy modes are missing.');

    expect(ruleMatches(similar, complete)).toBe(true);
    for (const attribute of [
      'primary_explanation_valid',
      'algorithm_same',
      'proof_same',
      'complexity_same',
      'constraints_difference_documented',
      'prerequisites_same',
      'implementation_difference_documented',
      'learning_outcomes_same',
      'evidence_complete',
      'conflict_free',
    ]) {
      expect(ruleMatches(similar, { ...complete, [attribute]: false })).toBe(false);
      const missing = Object.fromEntries(
        Object.entries(complete).filter(([key]) => key !== attribute),
      );
      expect(ruleMatches(similar, missing)).toBe(false);
      expect(
        ruleMatches(supplement, {
          ...complete,
          additional_learning_count: 1,
          [attribute]: false,
        }),
      ).toBe(false);
    }
    expect(ruleMatches(similar, { ...complete, additional_learning_count: 1 })).toBe(false);
    expect(ruleMatches(supplement, { ...complete, additional_learning_count: 0 })).toBe(false);
  });

  it('maps every prerequisite named by the specification to an observable baseline skill', () => {
    const baselineDocument = readJson('src/content/policies/prerequisite-baseline.json');
    const baseline = baselineDocument as {
      digest: string;
      skills: { id: string }[];
      excludedSkills: { rationale: string }[];
    };
    expect(digestWithoutField(baselineDocument, 'digest')).toBe(baseline.digest);
    const ids = new Set(baseline.skills.map(({ id }) => id));
    for (const id of [
      'skill-programming-basics',
      'skill-basic-data-handling',
      'skill-complexity-basics',
      'skill-prefix-greedy-elementary-dp',
      'skill-basic-dfs-bfs',
      'skill-elementary-number-theory-testing',
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
    expect(baseline.excludedSkills.map(({ rationale }) => rationale).join('\n')).toContain(
      '初歩的な一次元DP',
    );
  });
});
