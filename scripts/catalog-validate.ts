import { readFile } from 'node:fs/promises';

import { buildCatalog, CatalogBuildError } from '../src/lib/catalog/build-catalog.js';

const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
const inputPath = inputIndex < 0 ? undefined : args[inputIndex + 1];
if (!inputPath || args.length !== 2) {
  console.error('Usage: catalog-validate --input CATALOG.json');
  process.exitCode = 64;
} else {
  try {
    const input = JSON.parse(await readFile(inputPath, 'utf8')) as unknown;
    buildCatalog(input, [inputPath]);
    console.log('CATALOG_VALID');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = error instanceof CatalogBuildError ? 2 : 70;
  }
}
