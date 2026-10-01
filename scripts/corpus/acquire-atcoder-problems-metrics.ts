import path from 'node:path';

import {
  acquireAtCoderProblemsSnapshot,
  ATCODER_PROBLEMS_METRICS_PATH,
  loadCanonicalProblemIdentities,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';
import { parseOffsetDateTime } from '../../src/lib/domain/date-time.js';
import {
  parseKeyValueArguments,
  reportCliFailure,
  replaceJsonAtomically,
  requiredArgument,
} from './cli-support.js';

const USAGE =
  'Usage: acquire-atcoder-problems-metrics --checked-at RFC3339 [--repository-root PATH] [--output PATH]';

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, {
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

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--checked-at',
    '--repository-root',
    '--output',
  ]);
  const checkedAt = requiredArgument(values, '--checked-at');
  parseOffsetDateTime(checkedAt);
  const repositoryRoot = path.resolve(values.get('--repository-root') ?? process.cwd());
  const outputPath = path.resolve(
    repositoryRoot,
    values.get('--output') ?? ATCODER_PROBLEMS_METRICS_PATH,
  );
  const canonicalProblems = await loadCanonicalProblemIdentities(repositoryRoot);
  const snapshot = await acquireAtCoderProblemsSnapshot({
    checkedAt,
    canonicalProblems,
    fetchJson,
  });
  await replaceJsonAtomically(outputPath, snapshot);
  const entries = Object.values(snapshot.problems);
  console.log(
    JSON.stringify({
      command: 'acquire-atcoder-problems-metrics',
      status: 'passed',
      checkedAt,
      outputPath,
      problemCount: entries.length,
      missingDifficultyCount: entries.filter(({ difficulty }) => difficulty === null).length,
      missingPointCount: entries.filter(({ point }) => point === null).length,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
