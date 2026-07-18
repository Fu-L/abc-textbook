import { readFile } from 'node:fs/promises';

import { buildCatalog, CatalogBuildError } from '../src/lib/catalog/build-catalog.js';
import {
  CatalogEvidenceInventoryError,
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
const trustContextIndex = args.indexOf('--trusted-review-context');
const trustContextPath = trustContextIndex < 0 ? undefined : args[trustContextIndex + 1];
if (!inputPath || !evidencePath || !trustContextPath || args.length !== 6) {
  console.error(
    'Usage: catalog-validate --input CATALOG.json --evidence-inventory INVENTORY.json --trusted-review-context CONTEXT.json',
  );
  process.exitCode = 64;
} else {
  try {
    const resolvedInputPath = await resolvePublicCatalogInput(inputPath);
    const input = JSON.parse(await readFile(resolvedInputPath, 'utf8')) as unknown;
    const trustedReviewContext = JSON.parse(await readFile(trustContextPath, 'utf8')) as unknown;
    const trustedEvidence = await loadTrustedCatalogReleaseEvidenceInventory(
      evidencePath,
      trustedReviewContext,
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
