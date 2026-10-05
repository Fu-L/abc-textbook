import { describe, expect, it } from 'vitest';
import {
  buildProblemShardIndex,
  assertProblemShardIndex,
  type ProblemShardIndexInput,
} from '../../src/lib/authoring/problem-shard-index.js';
const input = (): ProblemShardIndexInput => ({
  frozenAt: '2026-10-02T00:00:00+09:00',
  inputs: { accepted: 'a'.repeat(64) },
  contests: [
    { id: 'abc212', number: 212, officialTaskIds: ['abc212_i', 'abc212_ex', 'abc212_h'] },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `abc${String(213 + i)}`,
      number: 213 + i,
      officialTaskIds: [`abc${String(213 + i)}_g`],
    })),
  ],
  problems: [
    { id: 'abc212-ex', contestId: 'abc212', officialTaskId: 'abc212_ex' },
    { id: 'abc212-h', contestId: 'abc212', officialTaskId: 'abc212_h' },
    { id: 'abc212-i', contestId: 'abc212', officialTaskId: 'abc212_i' },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `abc${String(213 + i)}-g`,
      contestId: `abc${String(213 + i)}`,
      officialTaskId: `abc${String(213 + i)}_g`,
    })),
  ],
  placements: [
    'abc212-h',
    'abc212-ex',
    'abc212-i',
    ...Array.from({ length: 8 }, (_, i) => `abc${String(213 + i)}-g`),
  ].map((problemId) => ({
    problemId,
    primaryOutcomeId: 'outcome-a',
    additionalPrimaryOutcomeIds: ['outcome-b'],
    supportingOutcomeIds: ['outcome-c'],
  })),
  units: [
    {
      id: 'unit-home',
      parentId: 'unit-chapter-modeling',
      ownedLearningOutcomeIds: ['outcome-a', 'outcome-b', 'outcome-c'],
    },
    { id: 'unit-chapter-modeling', parentId: null, ownedLearningOutcomeIds: [] },
  ],
  outcomes: [
    { id: 'outcome-a', prerequisiteOutcomeIds: [] },
    { id: 'outcome-b', prerequisiteOutcomeIds: [] },
    { id: 'outcome-c', prerequisiteOutcomeIds: [] },
  ],
});
describe('frozen semantic-primary Problem shards', () => {
  it('uses the official task order (including future labels), chunks 8+3, and never duplicates additional/supporting placements', () => {
    const index = buildProblemShardIndex(input());
    expect(index.shards.map((s) => s.problemIds.length)).toEqual([8, 3]);
    expect(index.shards[0]?.problemIds.slice(0, 3)).toEqual(['abc212-i', 'abc212-ex', 'abc212-h']);
    expect(
      index.shards.every((s) => s.domain === 'hybrid' && s.primaryOutcomeId === 'outcome-a'),
    ).toBe(true);
    expect(new Set(index.shards.flatMap((s) => s.documentPaths)).size).toBe(11);
  });
  it('is deterministic under shuffled inputs and title-independent', () => {
    const a = input();
    const b = {
      ...a,
      problems: [...a.problems].reverse(),
      placements: [...a.placements].reverse(),
      contests: [...a.contests].reverse(),
      units: [...a.units].reverse(),
    };
    expect(buildProblemShardIndex(a)).toEqual(buildProblemShardIndex(b));
  });
  it.each([
    'duplicate-problem',
    'duplicate-placement',
    'unassigned',
    'unknown-outcome',
    'missing-owner',
    'two-owners',
    'missing-order',
  ] as const)('rejects %s', (kind) => {
    const x = input();
    let value = x;
    if (kind === 'duplicate-problem')
      value = { ...x, problems: [...x.problems, ...x.problems.slice(0, 1)] };
    if (kind === 'duplicate-placement')
      value = { ...x, placements: [...x.placements, ...x.placements.slice(0, 1)] };
    if (kind === 'unassigned') value = { ...x, placements: x.placements.slice(1) };
    if (kind === 'unknown-outcome') value = { ...x, outcomes: [] };
    if (kind === 'missing-owner') value = { ...x, units: [] };
    if (kind === 'two-owners')
      value = {
        ...x,
        units: [
          ...x.units,
          { id: 'unit-second', parentId: null, ownedLearningOutcomeIds: ['outcome-a'] },
        ],
      };
    if (kind === 'missing-order') value = { ...x, contests: [] };
    expect(() => buildProblemShardIndex(value)).toThrow(/SHARD_/);
  });
  it('derives prerequisite shards separately and rejects dependency cycles', () => {
    const x = input();
    const placements = x.placements.map((p, i) =>
      i === 0 ? { ...p, primaryOutcomeId: 'outcome-b' } : p,
    );
    const outcomes = x.outcomes.map((o) =>
      o.id === 'outcome-a' ? { ...o, prerequisiteOutcomeIds: ['outcome-b'] } : o,
    );
    const index = buildProblemShardIndex({ ...x, placements, outcomes });
    expect(
      index.shards.find((s) => s.primaryOutcomeId === 'outcome-a')?.dependencyShardIds,
    ).toEqual(['outcome-b-shard-001']);
    expect(() =>
      buildProblemShardIndex({
        ...x,
        placements,
        outcomes: outcomes.map((o) =>
          o.id === 'outcome-b' ? { ...o, prerequisiteOutcomeIds: ['outcome-a'] } : o,
        ),
      }),
    ).toThrow('SHARD_DEPENDENCY_CYCLE');
  });
  it('rejects edited membership even after the attacker recomputes a digest', () => {
    const expected = buildProblemShardIndex(input());
    const actual = structuredClone(expected);
    const shard = actual.shards[0];
    if (!shard) throw new Error('Missing test shard');
    (shard.problemIds as string[]).reverse();
    expect(() => {
      assertProblemShardIndex(actual, expected);
    }).toThrow('SHARD_INDEX_DRIFT');
  });
});
