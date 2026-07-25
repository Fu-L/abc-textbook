import { lstat, realpath } from 'node:fs/promises';
import path from 'node:path';

import { corpusBatches } from '../../src/lib/corpus/batches.js';
import { materializeCorpusMetadata } from '../../src/lib/corpus/materialization.js';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  CorpusCliError,
  ensureNoSymlinkParents,
  parseKeyValueArguments,
  readJson,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';

const USAGE = 'Usage: materialize-metadata --input-dir PATH [--repository-root PATH]';

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const inspectPath = async (filePath: string): Promise<Awaited<ReturnType<typeof lstat>> | null> => {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') return null;
    throw error;
  }
};

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--input-dir',
    '--repository-root',
  ]);
  const inputDirectory = path.resolve(requiredArgument(values, '--input-dir'));
  const repositoryRoot = await realpath(
    path.resolve(values.get('--repository-root') ?? path.resolve(import.meta.dirname, '../..')),
  );
  const artifacts: CorpusMetadataBatch[] = [];
  for (const batch of corpusBatches) {
    const value = await readJson(path.join(inputDirectory, `${batch.id}.json`));
    verifyCorpusMetadataBatch(value, batch);
    artifacts.push(value as CorpusMetadataBatch);
  }
  const materialization = materializeCorpusMetadata(artifacts);
  let written = 0;
  let verifiedExisting = 0;
  for (const entry of materialization.writePlan) {
    const destination = path.resolve(repositoryRoot, entry.path);
    const relative = path.relative(repositoryRoot, destination);
    if (
      relative === '' ||
      relative === '..' ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      throw new CorpusCliError('MATERIALIZATION_PATH_ESCAPE', entry.path);
    }
    await ensureNoSymlinkParents(repositoryRoot, relative);
    const destinationMetadata = await inspectPath(destination);
    if (destinationMetadata) {
      if (destinationMetadata.isSymbolicLink() || !destinationMetadata.isFile()) {
        throw new CorpusCliError('CANONICAL_ENTITY_PATH_UNSAFE', entry.path);
      }
      const existing = await readJson(destination);
      if (canonicalJson(existing) !== canonicalJson(entry.value)) {
        throw new CorpusCliError('CANONICAL_ENTITY_CONFLICT', entry.path);
      }
      verifiedExisting += 1;
      continue;
    }
    await writeJsonNoOverwrite(destination, entry.value);
    written += 1;
  }
  console.log(
    JSON.stringify({
      command: 'materialize-metadata',
      status: 'passed',
      registryDigest: materialization.registry.digest,
      registryLabels: materialization.registry.labels,
      entityCount: materialization.writePlan.length,
      written,
      verifiedExisting,
      batches: materialization.batches.map(({ batchId, metadataBatchDigest }) => ({
        batchId,
        metadataBatchDigest,
      })),
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
