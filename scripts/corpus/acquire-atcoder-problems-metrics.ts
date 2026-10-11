import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  acquireAtCoderProblemsSnapshot,
  ATCODER_PROBLEMS_METRICS_PATH,
  loadCanonicalProblemIdentities,
  loadMetadataBatchProblemIdentities,
  type AtCoderProblemsJsonFetcher,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';
import { parseOffsetDateTime } from '../../src/lib/domain/date-time.js';
import {
  assertTemporaryOutput,
  parseKeyValueArguments,
  reportCliFailure,
  replaceJsonAtomically,
  requiredArgument,
} from './cli-support.js';

const USAGE =
  'Usage: acquire-atcoder-problems-metrics --checked-at RFC3339 [--repository-root PATH] [--output PATH] [--metadata-batch BATCH.json --output /temporary/METRICS.json]';

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'abc-textbook/0.1.0 (contact: repository-maintainer)',
    },
  });
  if (!response.ok) {
    throw new Error(`ATCODER_PROBLEMS_REQUEST_FAILED: ${url}: HTTP ${String(response.status)}`);
  }
  return (await response.json()) as unknown;
};

export const runAtCoderProblemsMetricsAcquisition = async (
  args: readonly string[],
  options: {
    readonly fetchJson?: AtCoderProblemsJsonFetcher;
    readonly report?: (value: unknown) => void;
  } = {},
): Promise<void> => {
  const values = parseKeyValueArguments(args, [
    '--checked-at',
    '--repository-root',
    '--output',
    '--metadata-batch',
  ]);
  const checkedAt = requiredArgument(values, '--checked-at');
  parseOffsetDateTime(checkedAt);
  const repositoryRoot = path.resolve(values.get('--repository-root') ?? process.cwd());
  const metadataPath = values.get('--metadata-batch');
  const outputPath = path.resolve(
    repositoryRoot,
    metadataPath
      ? requiredArgument(values, '--output')
      : (values.get('--output') ?? ATCODER_PROBLEMS_METRICS_PATH),
  );
  if (metadataPath)
    await assertTemporaryOutput(outputPath, fileURLToPath(new URL('../..', import.meta.url)));
  const canonicalProblems = metadataPath
    ? await loadMetadataBatchProblemIdentities(path.resolve(repositoryRoot, metadataPath))
    : await loadCanonicalProblemIdentities(repositoryRoot);
  // The provider requests more than one second between accesses (doc/api.md).
  let fetched = false;
  const fetchUpstream =
    options.fetchJson ??
    (async (url: string) => {
      if (fetched) await sleep(1_100);
      fetched = true;
      return fetchJson(url);
    });
  const snapshot = await acquireAtCoderProblemsSnapshot({
    checkedAt,
    canonicalProblems,
    fetchJson: fetchUpstream,
  });
  await replaceJsonAtomically(outputPath, snapshot);
  const entries = Object.values(snapshot.problems);
  const report =
    options.report ??
    ((value: unknown) => {
      console.log(JSON.stringify(value));
    });
  report({
    command: 'acquire-atcoder-problems-metrics',
    status: 'passed',
    checkedAt,
    outputPath,
    problemCount: entries.length,
    missingDifficultyCount: entries.filter(({ difficulty }) => difficulty === null).length,
    missingPointCount: entries.filter(({ point }) => point === null).length,
  });
};

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await runAtCoderProblemsMetricsAcquisition(process.argv.slice(2));
  } catch (error) {
    console.error(USAGE);
    reportCliFailure(error);
  }
}
