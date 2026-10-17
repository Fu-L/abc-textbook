import { glob, readFile } from 'node:fs/promises';
import { inspectDocumentNotation } from '../../src/lib/catalog/inspect-document-notation.js';

const paths = process.argv.slice(2);
if (!paths.length) {
  for await (const path of glob('src/content/docs/**/*.md')) paths.push(path);
}
let candidates = 0;
let errors = 0;
for (const path of paths.sort()) {
  const diagnostics = await inspectDocumentNotation(await readFile(path, 'utf8'));
  for (const diagnostic of diagnostics) {
    console.log(
      `${path}:${String(diagnostic.line)}:${String(diagnostic.column)} ${diagnostic.code}: ${diagnostic.detail.replace(/\s+/gu, ' ')}`,
    );
    if (diagnostic.code === 'INVALID_MATH') errors++;
    else candidates++;
  }
}
console.log(
  `${String(paths.length)} documents; ${String(candidates)} notation candidates; ${String(errors)} invalid formulas.`,
);
process.exitCode = errors ? 1 : 0;
