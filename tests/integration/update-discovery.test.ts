import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { acquireOfficialMetadata } from '../../scripts/update-abc/acquire.js';
import { discoverContests } from '../../scripts/update-abc/discover.js';

const fixture = JSON.parse(
  await readFile(new URL('../fixtures/weekly-update/contests.json', import.meta.url), 'utf8'),
) as { contests: Parameters<typeof discoverContests>[0]['contests'] };

describe('US5 update discovery', () => {
  const contest = fixture.contests[0];
  if (!contest) throw new Error('Weekly update fixture is empty.');

  it('selects only ended contests from latest and explicit-range discovery', () => {
    const now = '2026-07-29T12:00:00+09:00';
    expect(discoverContests({ contests: fixture.contests, mode: 'latest-ended', now })).toEqual([
      fixture.contests[0],
    ]);
    expect(
      discoverContests({
        contests: fixture.contests,
        mode: 'explicit-range',
        firstContestNumber: 500,
        lastContestNumber: 501,
        now,
      }),
    ).toEqual([fixture.contests[0]]);
  });

  it('discovers every official task after D including future labels', async () => {
    const result = await acquireOfficialMetadata(contest);
    expect(result.status).toBe('acquired');
    expect(result.advancedSlotLabels).toEqual(['E', 'F', 'I', 'Ex']);
    expect(result.problemIds).toEqual(['abc500-e', 'abc500-f', 'abc500-i', 'abc500-ex']);
    expect(result.sourceSetFingerprint).toMatch(/^[a-f0-9]{64}$/u);
  });

  it('preserves a source acquisition failure as a resumable hold', async () => {
    const result = await acquireOfficialMetadata(contest, {
      loadSource: (task) =>
        task.label === 'I'
          ? Promise.reject(new Error('fixture unavailable'))
          : Promise.resolve(task),
    });
    expect(result).toMatchObject({
      status: 'on_hold',
      hold: { code: 'SOURCE_UNAVAILABLE', problemId: 'abc500-i' },
    });
  });
});
