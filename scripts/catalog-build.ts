import { writeFile } from 'node:fs/promises';

import { CatalogBuildError } from '../src/lib/catalog/build-catalog.js';
import { CatalogEvidenceInventoryError } from '../src/lib/catalog/evidence-inventory.js';
import { CatalogPublicationBoundaryError } from '../src/lib/catalog/publication-boundary.js';

import { loadCatalogInput, parseCatalogArgs } from './catalog-input.js';

let args: ReturnType<typeof parseCatalogArgs> | undefined;
try {
  args = parseCatalogArgs(process.argv.slice(2), true);
} catch {
  console.error(
    'Usage: catalog-build --input CATALOG.json --output PATH [--evidence-inventory INVENTORY.json]',
  );
  process.exitCode = 64;
}
if (args?.input && args.output) {
  try {
    const catalog = await loadCatalogInput(args.input, args['evidence-inventory']);
    await writeFile(args.output, `${JSON.stringify(catalog, null, 2)}\n`, { flag: 'wx' });
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
