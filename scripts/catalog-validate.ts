import { readFile } from 'node:fs/promises';

import {
  buildCatalog,
  CatalogBuildError,
  type TrustedCatalogReleaseEvidenceInventory,
} from '../src/lib/catalog/build-catalog.js';
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
    const trustedEvidence = JSON.parse(
      await readFile(evidencePath, 'utf8'),
    ) as TrustedCatalogReleaseEvidenceInventory;
    buildCatalog(input, [], trustedEvidence);
    console.log('CATALOG_VALID');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode =
      error instanceof CatalogBuildError || error instanceof CatalogPublicationBoundaryError
        ? 2
        : 70;
  }
}
