import { describe, expect, it } from 'vitest';

import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  acquireAtCoderProblemsSnapshot,
  ATCODER_PROBLEMS_SOURCES,
  buildAtCoderProblemsSnapshot,
  loadCanonicalProblemIdentities,
  validateAtCoderProblemsSnapshot,
  type CanonicalProblemIdentity,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';

const canonicalProblems: readonly CanonicalProblemIdentity[] = [
  { id: 'abc212-e', officialTaskId: 'abc212_e' },
  { id: 'abc212-f', officialTaskId: 'abc212_f' },
];

const buildFixture = () =>
  buildAtCoderProblemsSnapshot({
    checkedAt: '2026-09-14T12:00:00+09:00',
    canonicalProblems,
    problemModels: {
      abc212_e: { difficulty: 1410, is_experimental: true },
      abc212_f: { difficulty: 2332, is_experimental: false },
    },
    mergedProblems: [
      { id: 'abc212_e', point: 500 },
      { id: 'abc212_f', point: 500 },
    ],
  });

describe('AtCoder Problems metric snapshot', () => {
  it('joins difficulty, experimental flag, and point by official task ID', () => {
    const snapshot = buildFixture();

    expect(snapshot.problems['abc212-e']).toEqual({
      officialTaskId: 'abc212_e',
      difficulty: 1410,
      difficultyExperimental: true,
      point: 500,
    });
    expect(snapshot.problems['abc212-f']?.difficultyExperimental).toBe(false);
    expect(snapshot.sources).toEqual(ATCODER_PROBLEMS_SOURCES);
  });

  it('materializes missing difficulty and point as null without inference', () => {
    const snapshot = buildAtCoderProblemsSnapshot({
      checkedAt: '2026-09-14T12:00:00+09:00',
      canonicalProblems,
      problemModels: {
        abc212_e: { is_experimental: false },
        abc212_f: { difficulty: 2332 },
      },
      mergedProblems: [{ id: 'abc212_e', point: 500 }],
    });

    expect(snapshot.problems['abc212-e']).toMatchObject({
      difficulty: null,
      difficultyExperimental: false,
      point: 500,
    });
    expect(snapshot.problems['abc212-f']).toMatchObject({
      difficulty: 2332,
      difficultyExperimental: null,
      point: null,
    });
  });

  it('requires the canonical Problem set exactly once and preserves officialTaskId bindings', () => {
    const snapshot = buildFixture();
    const identities = Object.keys(snapshot.problems);
    expect(identities).toHaveLength(canonicalProblems.length);
    expect(new Set(identities).size).toBe(canonicalProblems.length);
    expect(() =>
      validateAtCoderProblemsSnapshot(
        {
          ...snapshot,
          problems: {
            ...snapshot.problems,
            'abc999-e': snapshot.problems['abc212-e'],
          },
        },
        canonicalProblems,
      ),
    ).toThrow('UNKNOWN_PROBLEM_ID');

    expect(() =>
      validateAtCoderProblemsSnapshot(
        {
          ...snapshot,
          problems: {
            ...snapshot.problems,
            'abc212-e': {
              ...snapshot.problems['abc212-e'],
              officialTaskId: 'abc212_f',
            },
          },
        },
        canonicalProblems,
      ),
    ).toThrow('OFFICIAL_TASK_ID_MISMATCH');
  });

  it('rejects duplicate canonical IDs and preserves deterministic output', () => {
    expect(() =>
      buildAtCoderProblemsSnapshot({
        checkedAt: '2026-09-14T12:00:00+09:00',
        canonicalProblems: [...canonicalProblems, ...canonicalProblems.slice(0, 1)],
        problemModels: {},
        mergedProblems: [],
      }),
    ).toThrow('DUPLICATE_CANONICAL_PROBLEM_ID');

    expect(canonicalJson(buildFixture())).toBe(canonicalJson(buildFixture()));
  });

  it('loads and materializes every current canonical Problem', async () => {
    const identities = await loadCanonicalProblemIdentities();
    const snapshot = buildAtCoderProblemsSnapshot({
      checkedAt: '2026-09-14T12:00:00+09:00',
      canonicalProblems: identities,
      problemModels: Object.fromEntries(
        identities.map(({ officialTaskId }) => [
          officialTaskId,
          { difficulty: 1000, is_experimental: false },
        ]),
      ),
      mergedProblems: identities.map(({ officialTaskId }) => ({
        id: officialTaskId,
        point: 100,
      })),
    });

    expect(Object.keys(snapshot.problems)).toEqual(identities.map(({ id }) => id));
    expect(Object.keys(snapshot.problems)).toHaveLength(904);
  });

  it('fetches each upstream resource exactly once', async () => {
    const calls: string[] = [];
    const snapshot = await acquireAtCoderProblemsSnapshot({
      checkedAt: '2026-09-14T12:00:00+09:00',
      canonicalProblems,
      fetchJson: (url) => {
        calls.push(url);
        if (url === ATCODER_PROBLEMS_SOURCES.problemModels) {
          return Promise.resolve({ abc212_e: { difficulty: 1410, is_experimental: false } });
        }
        return Promise.resolve([
          { id: 'abc212_e', point: 500 },
          { id: 'abc212_f', point: 500 },
        ]);
      },
    });

    expect(calls).toEqual([
      ATCODER_PROBLEMS_SOURCES.problemModels,
      ATCODER_PROBLEMS_SOURCES.mergedProblems,
    ]);
    expect(snapshot.problems['abc212-f']?.difficulty).toBe(null);
  });
});
