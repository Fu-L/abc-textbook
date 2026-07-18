import { readFile } from 'node:fs/promises';

import { buildCatalog, CatalogBuildError } from '../src/lib/catalog/build-catalog.js';
import {
  CatalogEvidenceInventoryError,
  loadCatalogEvidenceCanonicalSources,
  loadTrustedCatalogReleaseEvidenceInventory,
} from '../src/lib/catalog/evidence-inventory.js';
import {
  CatalogPublicationBoundaryError,
  resolvePublicCatalogInput,
} from '../src/lib/catalog/publication-boundary.js';

const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
const inputPath = inputIndex < 0 ? undefined : args[inputIndex + 1];
const evidenceIndex = args.indexOf('--evidence-inventory');
const evidencePath = evidenceIndex < 0 ? undefined : args[evidenceIndex + 1];
if (!inputPath || !evidencePath || args.length !== 4) {
  console.error('Usage: catalog-validate --input CATALOG.json --evidence-inventory INVENTORY.json');
  process.exitCode = 64;
} else {
  try {
    const resolvedInputPath = await resolvePublicCatalogInput(inputPath);
    const input = JSON.parse(await readFile(resolvedInputPath, 'utf8')) as unknown;
    const canonicalSources = await loadCatalogEvidenceCanonicalSources(input, process.cwd(), {
      catalogPath: resolvedInputPath,
    });
    const trustedEvidence = await loadTrustedCatalogReleaseEvidenceInventory(
      evidencePath,
      canonicalSources,
    );
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
