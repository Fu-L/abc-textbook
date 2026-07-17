import { readFile, writeFile } from 'node:fs/promises';

import { buildCatalog, CatalogBuildError } from '../src/lib/catalog/build-catalog.js';

const valueAfter = (args: readonly string[], flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index < 0 ? undefined : args[index + 1];
};

const args = process.argv.slice(2);
const inputPath = valueAfter(args, '--input');
const outputPath = valueAfter(args, '--output');
if (!inputPath || !outputPath || args.length !== 4) {
  console.error('Usage: catalog-build --input CATALOG.json --output PATH');
  process.exitCode = 64;
} else {
  try {
    const input = JSON.parse(await readFile(inputPath, 'utf8')) as unknown;
    const catalog = buildCatalog(input, [inputPath]);
    await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, { flag: 'wx' });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = error instanceof CatalogBuildError ? 2 : 70;
  }
}
