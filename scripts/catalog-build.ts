import { readFile, writeFile } from 'node:fs/promises';

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

const valueAfter = (args: readonly string[], flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index < 0 ? undefined : args[index + 1];
};

const args = process.argv.slice(2);
const inputPath = valueAfter(args, '--input');
const outputPath = valueAfter(args, '--output');
const evidencePath = valueAfter(args, '--evidence-inventory');
if (!inputPath || !outputPath || !evidencePath || args.length !== 6) {
  console.error(
    'Usage: catalog-build --input CATALOG.json --output PATH --evidence-inventory INVENTORY.json',
  );
  process.exitCode = 64;
} else {
  try {
    const resolvedInputPath = await resolvePublicCatalogInput(inputPath);
    const input = JSON.parse(await readFile(resolvedInputPath, 'utf8')) as unknown;
    const canonicalSources = await loadCatalogEvidenceCanonicalSources(input);
    const trustedEvidence = await loadTrustedCatalogReleaseEvidenceInventory(
      evidencePath,
      canonicalSources,
    );
    const catalog = buildCatalog(input, [], trustedEvidence);
    await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, { flag: 'wx' });
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
