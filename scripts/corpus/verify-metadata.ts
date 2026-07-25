import path from 'node:path';

import { corpusBatches, getCorpusBatch, type CorpusBatch } from '../../src/lib/corpus/batches.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  parseKeyValueArguments,
  readJson,
  reportCliFailure,
  requiredArgument,
} from './cli-support.js';

const USAGE = 'Usage: verify-metadata --batch all|abc212-abc263 --input-dir PATH';

try {
  const values = parseKeyValueArguments(process.argv.slice(2), ['--batch', '--input-dir']);
  const requestedBatch = requiredArgument(values, '--batch');
  const batches: readonly CorpusBatch[] =
    requestedBatch === 'all' ? corpusBatches : [getCorpusBatch(requestedBatch)];
  const inputDirectory = path.resolve(requiredArgument(values, '--input-dir'));
  const verified = [];
  for (const batch of batches) {
    const artifact = await readJson(path.join(inputDirectory, `${batch.id}.json`));
    verifyCorpusMetadataBatch(artifact, batch);
    verified.push(batch.id);
  }
  console.log(
    JSON.stringify({
      command: 'verify-metadata',
      status: 'passed',
      batchIds: verified,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
