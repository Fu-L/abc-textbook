import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { canonicalJson } from '../src/lib/domain/canonical-json.js';
import {
  buildCanonicalCatalog,
  buildCatalog,
  CatalogBuildError,
} from '../src/lib/catalog/build-catalog.js';
import { loadFullPublicProjection } from '../src/lib/catalog/full-public-projection.js';
import {
  loadCatalogEvidenceCanonicalSources,
  loadTrustedCatalogReleaseEvidenceInventory,
} from '../src/lib/catalog/evidence-inventory.js';
import { resolvePublicCatalogInput } from '../src/lib/catalog/publication-boundary.js';

/** Both CLIs reject unknown, repeated, missing-value and positional arguments. */
export const parseCatalogArgs = (args: string[], build: boolean) => {
  const { values, tokens } = parseArgs({
    args,
    strict: true,
    allowPositionals: false,
    tokens: true,
    options: {
      input: { type: 'string' },
      ...(build ? { output: { type: 'string' as const } } : {}),
      'evidence-inventory': { type: 'string' },
    },
  });
  const names = tokens.map((token) => (token.kind === 'option' ? token.name : ''));
  if (
    new Set(names).size !== names.length ||
    typeof values.input !== 'string' ||
    (build && typeof values.output !== 'string') ||
    Object.values(values).some(
      (value) => typeof value !== 'string' || !value || value.startsWith('--'),
    )
  )
    throw new Error('Invalid catalog arguments.');
  return {
    input: values.input,
    output: typeof values.output === 'string' ? values.output : undefined,
    'evidence-inventory':
      typeof values['evidence-inventory'] === 'string' ? values['evidence-inventory'] : undefined,
  };
};

export const loadCatalogInput = async (inputPath: string, evidencePath?: string) => {
  const resolvedInputPath = await resolvePublicCatalogInput(inputPath);
  const input = JSON.parse(await readFile(resolvedInputPath, 'utf8')) as unknown;
  if (evidencePath !== undefined) {
    // Keep the complete old trust reconstruction and validation, rather than ignoring the flag.
    const sources = await loadCatalogEvidenceCanonicalSources(input, process.cwd(), {
      catalogPath: resolvedInputPath,
    });
    const evidence = await loadTrustedCatalogReleaseEvidenceInventory(evidencePath, sources);
    return buildCatalog(input, [], evidence);
  }
  const catalog = buildCanonicalCatalog(input);
  let projection: Awaited<ReturnType<typeof loadFullPublicProjection>>;
  try {
    projection = await loadFullPublicProjection({ usePreparedRelease: false });
  } catch (error) {
    throw new CatalogBuildError([
      {
        code: 'CATALOG_CANONICAL_INVALID',
        message: error instanceof Error ? error.message : String(error),
      },
    ]);
  }
  // Release information is supplied by the caller; all content must be the current canonical projection.
  for (const key of Object.keys(projection.catalog).filter((key) => key !== 'release')) {
    if (
      canonicalJson(catalog[key]) !==
      canonicalJson(projection.catalog[key as keyof typeof projection.catalog])
    )
      throw new CatalogBuildError([
        {
          code: 'CATALOG_CANONICAL_DRIFT',
          message: `Catalog ${key} differs from current canonical content.`,
        },
      ]);
  }
  return catalog;
};
