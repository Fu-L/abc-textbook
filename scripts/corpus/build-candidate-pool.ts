import path from 'node:path';

import { getCorpusBatch } from '../../src/lib/corpus/batches.js';
import { buildPreviewCandidatePool } from '../../src/lib/corpus/cohort.js';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  CorpusCliError,
  parseKeyValueArguments,
  readJson,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';
import { parseCandidateInputFile, parsePreviewSelectionControl } from './preview-contracts.js';

const USAGE =
  'Usage: build-candidate-pool --metadata abc212-abc263.json --candidate-input candidate-input.json --selection-manifest preview-manifest.json --output staging/previews/initial-v1/candidate-pool.json';

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--metadata',
    '--candidate-input',
    '--selection-manifest',
    '--output',
  ]);
  const batch = getCorpusBatch('abc212-abc263');
  const metadataValue = await readJson(requiredArgument(values, '--metadata'));
  verifyCorpusMetadataBatch(metadataValue, batch);
  const metadata = metadataValue as CorpusMetadataBatch;
  const input = parseCandidateInputFile(
    await readJson(requiredArgument(values, '--candidate-input')),
  );
  const control = parsePreviewSelectionControl(
    await readJson(requiredArgument(values, '--selection-manifest')),
  );
  const expectedDomains = [...control.selectionRules.cohortRules.domains].sort(compareText);
  if (
    control.phase !== 'selection_rules_frozen' ||
    input.metadataBatchDigest !== metadata.metadataBatchDigest ||
    canonicalJson(input.allowedDomains) !== canonicalJson(expectedDomains)
  ) {
    throw new CorpusCliError(
      'CANDIDATE_INPUT_CONTROL_MISMATCH',
      'Phase, metadata digest, or allowed domains differ from the frozen selection control.',
    );
  }
  const pool = buildPreviewCandidatePool({
    metadata,
    allowedDomains: input.allowedDomains,
    candidates: input.candidates,
    fixtures: input.fixtures,
  });
  await writeJsonNoOverwrite(path.resolve(requiredArgument(values, '--output')), pool);
  console.log(
    JSON.stringify({
      command: 'build-candidate-pool',
      status: 'passed',
      candidateCount: pool.candidates.length,
      eligibleCount: pool.candidates.filter(({ selectionEligible }) => selectionEligible).length,
      candidatePoolDigest: pool.candidatePoolDigest,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
