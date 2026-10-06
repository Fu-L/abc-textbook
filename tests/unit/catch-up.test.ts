import { describe, expect, it } from 'vitest';
import { discoverMissingContests } from '../../scripts/update-abc/catch-up.js';

const contest = (number: number, endsAt = '2026-10-03T22:40:00+09:00') => ({
  contestId: `abc${String(number)}`,
  startsAt: '2026-10-03T21:00:00+09:00',
  endsAt,
  tasks: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I'].map((label) => ({
    label,
    sourceRevisionId: 'source-tasks',
  })),
});

describe('initial catch-up discovery', () => {
  it('takes every missing ended Contest, including holes, in numerical order', () => {
    expect(
      discoverMissingContests({
        cutoffAt: '2026-10-06T00:00:00+09:00',
        contests: [contest(478), contest(466), contest(467), contest(469), contest(468)],
        collectedContestIds: ['abc466', 'abc469'],
      }).map((item) => item.contestId),
    ).toEqual(['abc467', 'abc468', 'abc478']);
  });
  it('excludes ongoing and future contests by the offset-qualified cutoff', () => {
    expect(
      discoverMissingContests({
        cutoffAt: '2026-10-03T13:40:00+00:00',
        contests: [contest(478), contest(479, '2026-10-10T22:40:00+09:00')],
        collectedContestIds: [],
      }).map((item) => item.contestId),
    ).toEqual(['abc478']);
  });
  it('rejects ambiguous cutoffs and contradictory discovery identities', () => {
    for (const cutoffAt of ['2026-10-06T00:00:00', 'invalid'])
      expect(() =>
        discoverMissingContests({ cutoffAt, contests: [], collectedContestIds: [] }),
      ).toThrow();
    expect(() =>
      discoverMissingContests({
        cutoffAt: '2026-10-06T00:00:00+09:00',
        contests: [contest(478), contest(478)],
        collectedContestIds: [],
      }),
    ).toThrow('DUPLICATE');
  });
});
