import { access, realpath } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  acquireCorpusMetadataBatch,
  acquisitionCacheScope,
  createFetchTransport,
  SerialOfficialPageClient,
  verifyApprovedPolicies,
} from '../../src/lib/corpus/acquisition.js';
import { corpusBatches, getCorpusBatch, type CorpusBatch } from '../../src/lib/corpus/batches.js';
import type {
  CorpusMetadataBatch,
  OfficialPageTransport,
  PolicyApprovalManifest,
} from '../../src/lib/corpus/types.js';
import { buildAdvancedSlotRegistry } from '../../src/lib/catalog/advanced-slot-registry.js';
import { advancedTasks } from '../../src/lib/corpus/metadata.js';
import {
  verifyCorpusMetadataBatch,
  verifyPolicyApprovalManifest,
} from '../../src/lib/corpus/verification.js';
import { discoverMetadataBatch } from '../update-abc/discover.js';
import { metadataAcquisitionHold } from '../update-abc/acquire.js';
import {
  parseKeyValueArguments,
  CorpusCliError,
  readJson,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';
import { createPrivateResponseCache } from './private-response-cache.js';

const USAGE =
  'Usage: acquire-metadata (--batch all|abc212-abc263 OR --base-catalog CATALOG.json --base-metadata METADATA.json --first-contest N --last-contest N) --policy-approval APPROVAL.json --output-dir PATH --user-agent "abc-textbook/VERSION (contact: CONTACT)" --checked-at RFC3339 [--cache-dir /absolute/private/cache]';

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return false;
    throw error;
  }
};

/** Prevent accidental canonical writes, including a symlink into the checkout. */
const assertTemporaryOutput = async (directory: string, repositoryRoot: string) => {
  let parent = directory;
  while (!(await pathExists(parent))) parent = path.dirname(parent);
  const resolved = path.join(await realpath(parent), path.relative(parent, directory));
  const relative = path.relative(await realpath(repositoryRoot), resolved);
  if (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  )
    throw new CorpusCliError(
      'OUTPUT_INSIDE_REPOSITORY',
      'Use a temporary acquisition directory outside the checkout.',
    );
};

/** The same entry point serves bootstrap and bounded published-base acquisition. */
export const runMetadataAcquisition = async (
  args: readonly string[],
  options: {
    readonly transport?: OfficialPageTransport;
    readonly minimumStartIntervalMs?: number;
    readonly report?: (value: unknown) => void;
  } = {},
): Promise<number> => {
  const report =
    options.report ??
    ((value: unknown) => {
      console.log(JSON.stringify(value));
    });
  const values = parseKeyValueArguments(args, [
    '--batch',
    '--base-catalog',
    '--base-metadata',
    '--first-contest',
    '--last-contest',
    '--policy-approval',
    '--output-dir',
    '--user-agent',
    '--cache-dir',
    '--checked-at',
  ]);
  const liveFlags = ['--base-catalog', '--base-metadata', '--first-contest', '--last-contest'];
  const isLive = liveFlags.some((flag) => values.has(flag));
  if (isLive && values.has('--batch'))
    throw new CorpusCliError(
      'ARGUMENTS_INVALID',
      '--batch cannot be combined with published-base range arguments.',
    );
  const parseNumber = (flag: string) => {
    const value = requiredArgument(values, flag);
    if (!/^[1-9][0-9]*$/u.test(value) || !Number.isSafeInteger(Number(value)))
      throw new CorpusCliError('ARGUMENTS_INVALID', `${flag} requires a positive Contest number.`);
    return Number(value);
  };
  const scope = isLive
    ? discoverMetadataBatch({
        baseCatalog: await readJson(requiredArgument(values, '--base-catalog')),
        baseMetadata: await readJson(requiredArgument(values, '--base-metadata')),
        firstContestNumber: parseNumber('--first-contest'),
        lastContestNumber: parseNumber('--last-contest'),
      })
    : null;
  const requestedBatch = isLive ? null : requiredArgument(values, '--batch');
  const batches: readonly CorpusBatch[] = scope
    ? scope.batch
      ? [scope.batch]
      : []
    : requestedBatch === 'all'
      ? corpusBatches
      : [getCorpusBatch(requestedBatch ?? '')];
  const policyValue = await readJson(requiredArgument(values, '--policy-approval'));
  verifyPolicyApprovalManifest(policyValue);
  const policyApproval = policyValue as PolicyApprovalManifest;
  const outputDirectory = path.resolve(requiredArgument(values, '--output-dir'));
  const repositoryRoot = path.resolve(import.meta.dirname, '../..');
  if (isLive) await assertTemporaryOutput(outputDirectory, repositoryRoot);
  const checkedAt = requiredArgument(values, '--checked-at');
  const userAgent = requiredArgument(values, '--user-agent');
  if (scope)
    report({
      command: 'acquire-metadata',
      status: scope.batch ? 'range_selected' : 'unchanged',
      baseVersion: scope.baseVersion,
      baseCommit: scope.baseCommit,
      batch: scope.batch,
    });
  if (!batches.length) return 0;
  const upstream = options.transport ?? createFetchTransport();
  const cacheDirectory = values.get('--cache-dir');
  const cacheScope = acquisitionCacheScope(checkedAt, policyApproval);
  const cache = cacheDirectory
    ? await createPrivateResponseCache({
        cacheDirectory,
        repositoryRoot,
        upstream,
        cacheScope,
        bypassUrls: policyApproval.documents.map(({ url }) => url),
      })
    : null;
  const client = new SerialOfficialPageClient({
    transport: cache?.transport ?? upstream,
    userAgent,
    ...(options.minimumStartIntervalMs !== undefined
      ? { minimumStartIntervalMs: options.minimumStartIntervalMs }
      : {}),
    ...(cache ? { isCached: cache.isCached } : {}),
  });
  report({
    command: 'acquire-metadata',
    status: 'run_started',
    checkedAt,
    cacheScope,
    cacheDirectory: cache?.cacheDirectory ?? null,
  });
  try {
    // Policies always bypass the raw-response cache, including resume runs.
    const livePolicy = await verifyApprovedPolicies({
      client,
      approval: policyApproval,
      checkedAt,
    });
    for (const batch of batches) {
      const outputPath = path.join(outputDirectory, `${batch.id}.json`);
      if (await pathExists(outputPath)) {
        const existing = await readJson(outputPath);
        verifyCorpusMetadataBatch(existing, batch);
        const artifact = existing as CorpusMetadataBatch;
        if (artifact.checkedAt !== checkedAt || artifact.policy.digest !== livePolicy.digest)
          throw new CorpusCliError(
            'EXISTING_BATCH_RUN_SCOPE_MISMATCH',
            `${batch.id} was not acquired under this checkedAt and live-approved policy.`,
          );
        if (scope)
          buildAdvancedSlotRegistry({
            existingRegistry: scope.existingRegistry,
            contests: artifact.contests.map((contest) => ({
              contestId: contest.id,
              advancedLabels: advancedTasks(contest).map(({ label }) => label),
              sourceRevisionId: contest.taskOrderSourceRevisionId,
            })),
          });
        report({ command: 'acquire-metadata', batchId: batch.id, status: 'verified_existing' });
        continue;
      }
      const artifact = await acquireCorpusMetadataBatch({
        batch,
        client,
        policyApproval,
        checkedAt,
        ...(scope ? { existingRegistry: scope.existingRegistry } : {}),
      });
      await writeJsonNoOverwrite(outputPath, artifact);
      report({
        command: 'acquire-metadata',
        batchId: batch.id,
        status: 'acquired',
        contestCount: artifact.contests.length,
        contestGapCount: artifact.contestGaps.length,
        problemCount: artifact.problems.length,
        sourceRevisionCount: artifact.sourceRevisions.length,
        metadataBatchDigest: artifact.metadataBatchDigest,
        artifactDigest: artifact.digest,
      });
    }
  } catch (error) {
    if (!scope) throw error;
    report({
      command: 'acquire-metadata',
      status: 'on_hold',
      batch: scope.batch,
      hold: metadataAcquisitionHold(error),
    });
    return 2;
  }
  report({
    command: 'acquire-metadata',
    status: 'passed',
    batchCount: batches.length,
    cacheDirectory: cache?.cacheDirectory ?? null,
  });
  return 0;
};

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = await runMetadataAcquisition(process.argv.slice(2));
  } catch (error) {
    console.error(USAGE);
    reportCliFailure(error);
  }
}
