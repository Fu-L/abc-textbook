import { pathToFileURL } from 'node:url';

import { appendReleaseHistory } from '../../src/lib/catalog/build-release-history.js';
import type { AdvancedSlotRegistry } from '../../src/lib/catalog/advanced-slot-registry.js';
import type { CorpusBatch } from '../../src/lib/corpus/batches.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';

import { stableCompare, type DiscoverableContest } from './types.js';

export interface MetadataRangeInput {
  /** Downloaded from the published host (or its successful Pages artifact).
   * Schema/identity checks do not establish publication by themselves. */
  readonly baseCatalog: unknown;
  readonly baseMetadata: unknown;
  readonly firstContestNumber: number;
  readonly lastContestNumber: number;
}

export interface MetadataAcquisitionScope {
  readonly baseVersion: string;
  readonly baseCommit: string;
  readonly batch: CorpusBatch | null;
  readonly existingRegistry: AdvancedSlotRegistry;
}

/** Select a bounded extension of the verified base; never infer the latest ABC. */
export const discoverMetadataBatch = (input: MetadataRangeInput): MetadataAcquisitionScope => {
  if (
    !Number.isSafeInteger(input.firstContestNumber) ||
    !Number.isSafeInteger(input.lastContestNumber) ||
    input.firstContestNumber < 1 ||
    input.lastContestNumber < input.firstContestNumber
  ) {
    throw new Error('RANGE_INVALID: Specify positive ascending Contest numbers.');
  }
  const catalog = CatalogSchema.parse(input.baseCatalog);
  const first = Number(catalog.release.firstContestId.slice(3));
  const last = Number(catalog.release.lastContestId.slice(3));
  const numbers = [
    ...catalog.contests.map(({ number }) => number),
    ...catalog.contestGaps.map(({ number }) => number),
  ].sort((left, right) => left - right);
  if (
    !Number.isSafeInteger(first) ||
    !Number.isSafeInteger(last) ||
    first > last ||
    numbers.length !== last - first + 1 ||
    numbers.some((number, index) => number !== first + index) ||
    catalog.release.contestCount !== catalog.contests.length ||
    catalog.release.problemCount !== catalog.problems.length ||
    catalog.release.advancedSlotRegistryDigest !== catalog.advancedSlotRegistry.digest
  ) {
    throw new Error('BASE_RANGE_INVALID: Catalog coverage does not match its release.');
  }
  const [publication] = appendReleaseHistory({ catalog, metadata: input.baseMetadata }, []);
  if (!publication) throw new Error('BASE_METADATA_MISSING');
  const firstContestNumber = Math.max(input.firstContestNumber, last + 1);
  const lastContestNumber = input.lastContestNumber;
  return {
    baseVersion: publication.version,
    baseCommit: publication.commit,
    existingRegistry: catalog.advancedSlotRegistry,
    batch:
      firstContestNumber > lastContestNumber
        ? null
        : {
            id: `abc${String(firstContestNumber).padStart(3, '0')}-abc${String(lastContestNumber).padStart(3, '0')}`,
            firstContestNumber,
            lastContestNumber,
          },
  };
};

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
