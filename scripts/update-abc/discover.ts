import { pathToFileURL } from 'node:url';

import { stableCompare, type DiscoverableContest } from './types.js';

export interface DiscoveryInput {
  readonly contests: readonly DiscoverableContest[];
  readonly mode: 'latest-ended' | 'explicit-range';
  readonly now: string;
  readonly firstContestNumber?: number;
  readonly lastContestNumber?: number;
}

const contestNumber = (contestId: string): number => {
  const match = /^abc(?<number>\d{3,})$/u.exec(contestId);
  if (!match?.groups?.number) throw new Error(`Invalid Contest ID: ${contestId}`);
  return Number(match.groups.number);
};

export const discoverContests = (input: DiscoveryInput): DiscoverableContest[] => {
  const now = Date.parse(input.now);
  if (!Number.isFinite(now)) throw new Error(`Invalid discovery time: ${input.now}`);
  const ended = input.contests
    .filter((contest) => Date.parse(contest.endsAt) <= now)
    .filter((contest) => {
      if (input.mode === 'latest-ended') return true;
      const number = contestNumber(contest.contestId);
      return (
        input.firstContestNumber !== undefined &&
        input.lastContestNumber !== undefined &&
        number >= input.firstContestNumber &&
        number <= input.lastContestNumber
      );
    })
    .sort((left, right) => stableCompare(left.contestId, right.contestId));
  return input.mode === 'latest-ended' ? ended.slice(-1) : ended;
};

const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  process.stderr.write('discover.ts is used by abc:update; invoke npm run abc:update.\n');
  process.stdout.write(`${JSON.stringify({ command: 'abc:update:discover', exitCode: 64 })}\n`);
  process.exitCode = 64;
}
