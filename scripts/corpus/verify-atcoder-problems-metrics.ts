import path from 'node:path';

import {
  ATCODER_PROBLEMS_METRICS_PATH,
  loadCanonicalProblemIdentities,
  loadMetadataBatchProblemIdentities,
  validateAtCoderProblemsSnapshot,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';
import { parseKeyValueArguments, readJson, reportCliFailure } from './cli-support.js';

const USAGE =
  'Usage: verify-atcoder-problems-metrics [--repository-root PATH] [--snapshot PATH] [--metadata-batch BATCH.json]';

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--repository-root',
    '--snapshot',
    '--metadata-batch',
  ]);
  const repositoryRoot = path.resolve(values.get('--repository-root') ?? process.cwd());
  const snapshotPath = path.resolve(
    repositoryRoot,
    values.get('--snapshot') ?? ATCODER_PROBLEMS_METRICS_PATH,
  );
  const metadataPath = values.get('--metadata-batch');
  const canonicalProblems = metadataPath
    ? await loadMetadataBatchProblemIdentities(path.resolve(repositoryRoot, metadataPath))
    : await loadCanonicalProblemIdentities(repositoryRoot);
  const snapshot = validateAtCoderProblemsSnapshot(await readJson(snapshotPath), canonicalProblems);
  console.log(
    JSON.stringify({
      command: 'verify-atcoder-problems-metrics',
      status: 'passed',
      snapshotPath,
      checkedAt: snapshot.checkedAt,
      problemCount: Object.keys(snapshot.problems).length,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
