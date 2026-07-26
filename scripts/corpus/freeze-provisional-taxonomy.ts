import { access } from 'node:fs/promises';
import path from 'node:path';

import {
  FrozenPreviewCohortSchema,
  PreviewTechniqueInventoryComponentSchema,
} from '../../src/lib/corpus/technique-inventory.js';
import { TechniqueInventoryItemSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import {
  buildProvisionalTaxonomyArtifacts,
  parseProvisionalCandidateClassificationsDocument,
  parseProvisionalTaxonomyProposal,
  validateProvisionalTaxonomyArtifacts,
} from '../../src/lib/preview/provisional-taxonomy.js';
import { CorpusCliError, readJson, reportCliFailure, writeJsonNoOverwrite } from './cli-support.js';

const USAGE = 'Usage: freeze-provisional-taxonomy (--check | --write)';
const PREVIEW_ID = 'initial-v1';
const MANIFEST_PATH = `staging/previews/${PREVIEW_ID}/preview-manifest.json`;
const INVENTORY_ROOT = `staging/previews/${PREVIEW_ID}/technique-inventory`;
const INVENTORY_COMPONENT_PATH = `docs/verification/previews/${PREVIEW_ID}/components/technique-inventory.json`;
const CLASSIFICATIONS_PATH = `staging/previews/${PREVIEW_ID}/candidate-classifications.json`;
const PROPOSAL_PATH = 'docs/work-manifests/initial/us2/taxonomy/proposal.json';
const TAXONOMY_PATH = `staging/previews/${PREVIEW_ID}/taxonomy/index.json`;
const INTEGRATION_PATH = `docs/verification/previews/${PREVIEW_ID}/taxonomy-integration.json`;
const WORK_MANIFEST_PATH = 'docs/work-manifests/initial/us2/taxonomy/manifest.json';
const COMPONENT_PATH = `docs/verification/previews/${PREVIEW_ID}/components/metadata-inventory-taxonomy.json`;

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const inspectFrozenOutput = async (
  filePath: string,
  value: unknown,
): Promise<'missing' | 'verified'> => {
  if (await pathExists(filePath)) {
    if (canonicalJson(await readJson(filePath)) !== canonicalJson(value)) {
      throw new CorpusCliError('FROZEN_TAXONOMY_CONFLICT', filePath);
    }
    return 'verified';
  }
  return 'missing';
};

const parseMode = (args: readonly string[]): 'check' | 'write' => {
  if (args.length !== 1 || !['--check', '--write'].includes(args[0] ?? '')) {
    throw new CorpusCliError('ARGUMENTS_INVALID', USAGE);
  }
  return args[0] === '--write' ? 'write' : 'check';
};

try {
  const mode = parseMode(process.argv.slice(2));
  const manifest = FrozenPreviewCohortSchema.parse(await readJson(MANIFEST_PATH));
  const inventoryComponent = PreviewTechniqueInventoryComponentSchema.parse(
    await readJson(INVENTORY_COMPONENT_PATH),
  );
  const inventoryItems = await Promise.all(
    manifest.selectedProblemIds.map(async (problemId) =>
      TechniqueInventoryItemSchema.parse(
        await readJson(path.join(INVENTORY_ROOT, `${problemId}.json`)),
      ),
    ),
  );
  const classifications = parseProvisionalCandidateClassificationsDocument(
    await readJson(CLASSIFICATIONS_PATH),
  );
  const proposal = parseProvisionalTaxonomyProposal(await readJson(PROPOSAL_PATH));
  const input = {
    manifest: {
      previewId: manifest.previewId,
      manifestDigest: manifest.manifestDigest,
      selectedProblemIds: manifest.selectedProblemIds,
      sourceRevisionIds: manifest.sourceRevisionIds,
      expectedDomains: manifest.cohortRules.domains,
      minimumProblemsPerOutcome: manifest.cohortRules.minimumProblemsPerOutcome,
    },
    inventoryComponent,
    inventoryItems,
    classifications,
    proposal,
  };
  const artifacts = buildProvisionalTaxonomyArtifacts(input);
  const violations = validateProvisionalTaxonomyArtifacts(input, artifacts);
  if (violations.length > 0) {
    throw new CorpusCliError('PROVISIONAL_TAXONOMY_INVALID', violations.join(', '));
  }
  const outputs: readonly (readonly [string, unknown])[] = [
    ...artifacts.groups.map(({ path: groupPath, artifact }) => [groupPath, artifact] as const),
    [TAXONOMY_PATH, artifacts.taxonomy],
    [INTEGRATION_PATH, artifacts.integration],
    [WORK_MANIFEST_PATH, artifacts.workManifest],
    [COMPONENT_PATH, artifacts.component],
  ];
  const preflight = await Promise.all(
    outputs.map(async ([filePath, value]) => inspectFrozenOutput(filePath, value)),
  );
  const missingOutputs = outputs.filter((_output, index) => preflight[index] === 'missing');
  if (mode === 'check' && missingOutputs.length > 0) {
    throw new CorpusCliError(
      'FROZEN_TAXONOMY_MISSING',
      missingOutputs.map(([filePath]) => filePath).join(', '),
    );
  }
  for (const [filePath, value] of missingOutputs) await writeJsonNoOverwrite(filePath, value);
  console.log(
    JSON.stringify({
      command: 'freeze-provisional-taxonomy',
      mode,
      status: 'passed',
      problemCount: artifacts.taxonomy.problemIds.length,
      groupCount: artifacts.groups.length,
      candidateCount: artifacts.integration.candidates.length,
      written: missingOutputs.length,
      verified: preflight.filter((result) => result === 'verified').length,
      taxonomyDigest: artifacts.taxonomy.taxonomyDigest,
      integrationDigest: artifacts.integration.integrationDigest,
      componentDigest: artifacts.component.outputDigest,
    }),
  );
} catch (error) {
  console.error(USAGE);
  reportCliFailure(error);
}
