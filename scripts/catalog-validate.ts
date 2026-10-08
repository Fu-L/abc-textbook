import { CatalogBuildError } from '../src/lib/catalog/build-catalog.js';
import { CatalogEvidenceInventoryError } from '../src/lib/catalog/evidence-inventory.js';
import { CatalogPublicationBoundaryError } from '../src/lib/catalog/publication-boundary.js';

import { loadCatalogInput, parseCatalogArgs } from './catalog-input.js';

let args: ReturnType<typeof parseCatalogArgs> | undefined;
try {
  args = parseCatalogArgs(process.argv.slice(2), false);
} catch {
  console.error(
    'Usage: catalog-validate --input CATALOG.json [--evidence-inventory INVENTORY.json]',
  );
  process.exitCode = 64;
}
if (args?.input) {
  try {
    await loadCatalogInput(args.input, args['evidence-inventory']);
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
