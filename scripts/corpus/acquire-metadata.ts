import { access } from 'node:fs/promises';
import path from 'node:path';

import {
  acquireCorpusMetadataBatch,
  createFetchTransport,
  SerialOfficialPageClient,
  verifyApprovedPolicies,
} from '../../src/lib/corpus/acquisition.js';
import { corpusBatches, getCorpusBatch, type CorpusBatch } from '../../src/lib/corpus/batches.js';
import type { CorpusMetadataBatch, PolicyApprovalManifest } from '../../src/lib/corpus/types.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  verifyCorpusMetadataBatch,
  verifyPolicyApprovalManifest,
} from '../../src/lib/corpus/verification.js';
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
  'Usage: acquire-metadata --batch all|abc212-abc263 --policy-approval APPROVAL.json --output-dir PATH --user-agent "abc-textbook/VERSION (contact: CONTACT)" --checked-at RFC3339 [--cache-dir /absolute/private/cache]';

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--batch',
    '--policy-approval',
    '--output-dir',
    '--user-agent',
    '--cache-dir',
    '--checked-at',
  ]);
  const requestedBatch = requiredArgument(values, '--batch');
  const batches: readonly CorpusBatch[] =
    requestedBatch === 'all' ? corpusBatches : [getCorpusBatch(requestedBatch)];
  const policyValue = await readJson(requiredArgument(values, '--policy-approval'));
  verifyPolicyApprovalManifest(policyValue);
  const policyApproval = policyValue as PolicyApprovalManifest;
  const outputDirectory = path.resolve(requiredArgument(values, '--output-dir'));
  const checkedAt = requiredArgument(values, '--checked-at');
  const upstream = createFetchTransport();
  const cacheDirectory = values.get('--cache-dir');
  const cacheScope = canonicalDigest({ checkedAt, policyApproval });
  const repositoryRoot = path.resolve(import.meta.dirname, '../..');
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
    userAgent: requiredArgument(values, '--user-agent'),
    ...(cache ? { isCached: cache.isCached } : {}),
  });
  console.log(
    JSON.stringify({
      command: 'acquire-metadata',
      status: 'run_started',
      checkedAt,
      cacheScope,
      cacheDirectory: cache?.cacheDirectory ?? null,
    }),
  );
  // This preflight always bypasses the raw-response cache. It also protects
  // the resume path where every requested batch artifact already exists.
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
      const existingArtifact = existing as CorpusMetadataBatch;
      if (
        existingArtifact.checkedAt !== checkedAt ||
        existingArtifact.policy.digest !== livePolicy.digest
      ) {
        throw new CorpusCliError(
          'EXISTING_BATCH_RUN_SCOPE_MISMATCH',
          `${batch.id} was not acquired under this checkedAt and live-approved policy.`,
        );
      }
      console.log(
        JSON.stringify({
          command: 'acquire-metadata',
          batchId: batch.id,
          status: 'verified_existing',
        }),
      );
      continue;
    }
    const artifact = await acquireCorpusMetadataBatch({
      batch,
      client,
      policyApproval,
      checkedAt,
    });
    await writeJsonNoOverwrite(outputPath, artifact);
    console.log(
      JSON.stringify({
        command: 'acquire-metadata',
        batchId: batch.id,
        status: 'acquired',
        contestCount: artifact.contests.length,
        contestGapCount: artifact.contestGaps.length,
        problemCount: artifact.problems.length,
        sourceRevisionCount: artifact.sourceRevisions.length,
        metadataBatchDigest: artifact.metadataBatchDigest,
        artifactDigest: artifact.digest,
      }),
    );
  }
  console.log(
    JSON.stringify({
      command: 'acquire-metadata',
      status: 'passed',
      batchCount: batches.length,
      cacheDirectory: cache?.cacheDirectory ?? null,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
