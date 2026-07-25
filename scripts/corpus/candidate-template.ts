import path from 'node:path';

import { getCorpusBatch } from '../../src/lib/corpus/batches.js';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  CorpusCliError,
  parseKeyValueArguments,
  readJson,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';
import { parsePreviewSelectionControl } from './preview-contracts.js';

const USAGE =
  'Usage: candidate-template --metadata abc212-abc263.json --selection-manifest staging/previews/initial-v1/preview-manifest.json --output candidate-input.json';

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--metadata',
    '--selection-manifest',
    '--output',
  ]);
  const batch = getCorpusBatch('abc212-abc263');
  const metadataValue = await readJson(requiredArgument(values, '--metadata'));
  verifyCorpusMetadataBatch(metadataValue, batch);
  const metadata = metadataValue as CorpusMetadataBatch;
  const control = parsePreviewSelectionControl(
    await readJson(requiredArgument(values, '--selection-manifest')),
  );
  if (control.phase !== 'selection_rules_frozen') {
    throw new CorpusCliError('SELECTION_MANIFEST_PHASE_INVALID', control.phase);
  }
  const template = {
    schemaVersion: '1.0.0',
    previewId: 'initial-v1',
    batchId: 'abc212-abc263',
    metadataBatchDigest: metadata.metadataBatchDigest,
    allowedDomains: [...control.selectionRules.cohortRules.domains].sort(compareText),
    candidates: metadata.problems.map((problem) => ({
      problemId: problem.id,
      sourceRevisionIds: problem.sourceRevisionIds,
      classifications: [],
      selectionEligible: false,
      exclusionReason: null,
      fixtureId: null,
    })),
    fixtures: [],
  } as const;
  await writeJsonNoOverwrite(path.resolve(requiredArgument(values, '--output')), template);
  console.log(
    JSON.stringify({
      command: 'candidate-template',
      status: 'written_for_source_backed_classification',
      candidateCount: template.candidates.length,
      metadataBatchDigest: template.metadataBatchDigest,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
