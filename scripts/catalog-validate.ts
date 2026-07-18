import { readFile } from 'node:fs/promises';

import { buildCatalog, CatalogBuildError } from '../src/lib/catalog/build-catalog.js';
import {
  CatalogEvidenceInventoryError,
  loadTrustedCatalogReleaseEvidenceInventory,
} from '../src/lib/catalog/evidence-inventory.js';
import {
  CatalogPublicationBoundaryError,
  resolveCanonicalReleaseSource,
  resolvePublicCatalogInput,
} from '../src/lib/catalog/publication-boundary.js';

const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
const inputPath = inputIndex < 0 ? undefined : args[inputIndex + 1];
const evidenceIndex = args.indexOf('--evidence-inventory');
const evidencePath = evidenceIndex < 0 ? undefined : args[evidenceIndex + 1];
const manifestIndex = args.indexOf('--work-manifest');
const workManifestPath = manifestIndex < 0 ? undefined : args[manifestIndex + 1];
const candidateIndex = args.indexOf('--release-candidate');
const releaseCandidatePath = candidateIndex < 0 ? undefined : args[candidateIndex + 1];
if (
  !inputPath ||
  !evidencePath ||
  !workManifestPath ||
  !releaseCandidatePath ||
  args.length !== 8
) {
  console.error(
    'Usage: catalog-validate --input CATALOG.json --evidence-inventory INVENTORY.json --work-manifest MANIFEST.json --release-candidate CANDIDATE.json',
  );
  process.exitCode = 64;
} else {
  try {
    const resolvedInputPath = await resolvePublicCatalogInput(inputPath);
    const input = JSON.parse(await readFile(resolvedInputPath, 'utf8')) as unknown;
    const resolvedManifestPath = await resolveCanonicalReleaseSource(workManifestPath);
    const resolvedCandidatePath = await resolveCanonicalReleaseSource(releaseCandidatePath);
    const workManifest = JSON.parse(await readFile(resolvedManifestPath, 'utf8')) as unknown;
    const releaseCandidate = JSON.parse(await readFile(resolvedCandidatePath, 'utf8')) as unknown;
    const trustedEvidence = await loadTrustedCatalogReleaseEvidenceInventory(evidencePath, {
      catalog: input,
      workManifest,
      releaseCandidate,
    });
    buildCatalog(input, [], trustedEvidence);
    console.log('CATALOG_VALID');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode =
      error instanceof CatalogBuildError ||
      error instanceof CatalogPublicationBoundaryError ||
      error instanceof CatalogEvidenceInventoryError
        ? 2
        : 70;
  }
}
