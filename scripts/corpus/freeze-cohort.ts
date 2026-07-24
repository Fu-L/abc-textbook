import { access } from 'node:fs/promises';
import path from 'node:path';

import { freezePreviewCohort, verifyPreviewCandidatePool } from '../../src/lib/corpus/cohort.js';
import { getCorpusBatch } from '../../src/lib/corpus/batches.js';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  CorpusCliError,
  parseKeyValueArguments,
  readJson,
  replaceJsonAtomically,
  reportCliFailure,
  requiredArgument,
  writeJsonNoOverwrite,
} from './cli-support.js';
import { parsePreviewCandidatePool, parsePreviewSelectionControl } from './preview-contracts.js';

const USAGE =
  'Usage: freeze-cohort --metadata abc212-abc263.json --candidate-pool staging/previews/initial-v1/candidate-pool.json --selection-manifest staging/previews/initial-v1/preview-manifest.json --output-manifest staging/previews/initial-v1/preview-manifest.json --evidence-output docs/verification/previews/initial-v1/cohort-selection.json';

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const existingJsonMatches = async (filePath: string, value: unknown): Promise<boolean> => {
  if (!(await pathExists(filePath))) return false;
  if (canonicalJson(await readJson(filePath)) !== canonicalJson(value)) {
    throw new CorpusCliError('FROZEN_EVIDENCE_CONFLICT', filePath);
  }
  return true;
};

try {
  const values = parseKeyValueArguments(process.argv.slice(2), [
    '--metadata',
    '--candidate-pool',
    '--selection-manifest',
    '--output-manifest',
    '--evidence-output',
  ]);
  const metadataValue = await readJson(requiredArgument(values, '--metadata'));
  verifyCorpusMetadataBatch(metadataValue, getCorpusBatch('abc212-abc263'));
  const metadata = metadataValue as CorpusMetadataBatch;
  const candidatePool = parsePreviewCandidatePool(
    await readJson(requiredArgument(values, '--candidate-pool')),
  );
  verifyPreviewCandidatePool(candidatePool, metadata);
  const selectionManifestPath = path.resolve(requiredArgument(values, '--selection-manifest'));
  const selectionManifestValue = await readJson(selectionManifestPath);
  const control = parsePreviewSelectionControl(selectionManifestValue);
  if (!['selection_rules_frozen', 'cohort_frozen'].includes(control.phase)) {
    throw new CorpusCliError('SELECTION_MANIFEST_PHASE_INVALID', control.phase);
  }
  const frozen = freezePreviewCohort({
    pool: candidatePool,
    metadata,
    selectionRules: control.selectionRules,
    frozenRulesDigest: control.frozenRulesDigest,
  });
  const evidenceSubject = {
    schemaVersion: '1.0.0',
    previewId: 'initial-v1',
    status: 'passed',
    checkedAt: metadata.checkedAt,
    frozenRulesDigest: frozen.frozenRulesDigest,
    candidatePoolDigest: frozen.candidatePoolDigest,
    metadataBatchDigest: frozen.metadataBatchDigest,
    manifestDigest: frozen.manifestDigest,
    selectedProblemIds: frozen.selectedProblemIds,
    sourceRevisionIds: frozen.sourceRevisionIds,
    fixtureBoundaries: frozen.fixtureBoundaries,
    excludedProblemIds: frozen.excludedProblemIds,
  } as const;
  const evidence = {
    ...evidenceSubject,
    evidenceDigest: canonicalDigest(evidenceSubject),
  };
  const evidenceOutput = path.resolve(requiredArgument(values, '--evidence-output'));
  const outputManifest = path.resolve(requiredArgument(values, '--output-manifest'));
  const evidenceAlreadyExists = await existingJsonMatches(evidenceOutput, evidence);
  if (control.phase === 'cohort_frozen') {
    if (canonicalJson(selectionManifestValue) !== canonicalJson(frozen)) {
      throw new CorpusCliError('FROZEN_MANIFEST_CONFLICT', outputManifest);
    }
    if (outputManifest !== selectionManifestPath) {
      const outputAlreadyExists = await existingJsonMatches(outputManifest, frozen);
      if (!outputAlreadyExists) await writeJsonNoOverwrite(outputManifest, frozen);
    }
  } else if (outputManifest === selectionManifestPath) {
    await replaceJsonAtomically(outputManifest, frozen);
  } else {
    const outputAlreadyExists = await existingJsonMatches(outputManifest, frozen);
    if (!outputAlreadyExists) await writeJsonNoOverwrite(outputManifest, frozen);
  }
  if (!evidenceAlreadyExists) await writeJsonNoOverwrite(evidenceOutput, evidence);
  console.log(
    JSON.stringify({
      command: 'freeze-cohort',
      status: 'passed',
      selectedProblemCount: frozen.selectedProblemIds.length,
      selectedProblemIds: frozen.selectedProblemIds,
      manifestDigest: frozen.manifestDigest,
      evidenceDigest: evidence.evidenceDigest,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
