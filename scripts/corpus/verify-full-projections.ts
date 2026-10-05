import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import {
  loadFullPublicProjection,
  FULL_PROJECTION_PATH,
  TAXONOMY_INDEX_PATH,
} from '../../src/lib/catalog/full-public-projection.js';
import { buildSearchDocuments } from '../../src/lib/catalog/search-documents.js';
import { canonicalUiRoutes, withBase } from '../../src/lib/catalog/ui-catalog.js';
import { normalizeBasePath, resolveSite } from '../config/publication.js';

const mode = process.argv[2] ?? '--check';
try {
  if (process.argv.length > 3 || !['--check', '--write'].includes(mode))
    throw new Error('Usage: verify-full-projections [--check | --write]');
  if (mode === '--write') {
    const prepared = await loadFullPublicProjection({ verifyDerivedFiles: false });
    await mkdir(path.dirname(TAXONOMY_INDEX_PATH), { recursive: true });
    await writeFile(TAXONOMY_INDEX_PATH, `${JSON.stringify(prepared.taxonomyIndex, null, 2)}\n`);
  }
  const projection = await loadFullPublicProjection();
  const routes = canonicalUiRoutes(projection.ui);
  const base = normalizeBasePath(process.env.BASE_PATH ?? '/');
  const site = resolveSite(process.env.SITE_URL ?? 'https://abc-textbook.example');
  const builtFiles = (await readdir('dist', { recursive: true }))
    .filter((file) => /\.(?:html|json|xml|js|css|wasm|pf_meta|pf_fragment|pf_index)$/u.test(file))
    .sort();
  const artifactInventory = [];
  const fileFor = (route: string) =>
    path.join('dist', route.endsWith('/') ? `${route.slice(1)}index.html` : route.slice(1));
  for (const route of routes) await readFile(fileFor(route));
  const endpoint = CatalogSchema.parse(
    JSON.parse(await readFile('dist/data/catalog.json', 'utf8')) as unknown,
  );
  if (canonicalJson(endpoint) !== canonicalJson(projection.catalog))
    throw new Error('FULL_PROJECTION_ENDPOINT_STALE');
  const routeSet = new Set(routes);
  const indexedEntities = buildSearchDocuments(projection.ui);
  for (const document of indexedEntities) {
    if (!routeSet.has(document.route))
      throw new Error(`FULL_PROJECTION_SEARCH_ROUTE:${document.entityId}`);
  }
  for (const file of builtFiles) {
    const bytes = await readFile(path.join('dist', file));
    if (file.endsWith('.html')) {
      const $ = load(bytes.toString('utf8'));
      const main = $('main[data-pagefind-body]');
      if (main.length) {
        if ($('h1').length !== 1) throw new Error(`FULL_PROJECTION_HEADING:${file}`);
        const text = main.text();
        for (const forbidden of [
          'initial-v1',
          'provisional-',
          'staging/',
          'future I compatibility fixture',
        ])
          if (text.includes(forbidden))
            throw new Error(`FULL_PROJECTION_PRIVATE_CONTENT:${file}:${forbidden}`);
        if ($('a[href^="src/content/"]').length)
          throw new Error(`FULL_PROJECTION_SOURCE_LINK:${file}`);
      }
    }
    artifactInventory.push({
      path: `dist/${file}`,
      digest: createHash('sha256').update(bytes).digest('hex'),
      byteLength: bytes.length,
    });
  }
  const sitemap = load(await readFile('dist/sitemap.xml', 'utf8'), { xml: true });
  const sitemapUrls = sitemap('loc')
    .map((_i, element) => sitemap(element).text())
    .get();
  const expectedUrls = routes
    .filter((route) => route.endsWith('/'))
    .map((route) => new URL(withBase(route, base), site).href);
  if (canonicalJson(sitemapUrls) !== canonicalJson(expectedUrls))
    throw new Error('FULL_PROJECTION_SITEMAP_STALE');
  const feed = load(await readFile('dist/feed.xml', 'utf8'), { xml: true });
  if (feed('entry').length !== projection.history.length)
    throw new Error('FULL_PROJECTION_FEED_STALE');
  if (
    !builtFiles.includes('pagefind/pagefind.js') ||
    !builtFiles.some((file) => file.endsWith('.pf_meta'))
  )
    throw new Error('FULL_PROJECTION_PAGEFIND_MISSING');
  const artifactDigest = canonicalDigest(artifactInventory);
  const report = {
    schemaVersion: '1.0.0',
    taskId: 'T160',
    status: 'passed',
    sourceProjectionDigest: projection.digest,
    fullProjectionDigest: canonicalDigest({
      sourceProjectionDigest: projection.digest,
      artifactDigest,
    }),
    publicationStatus: 'prepared',
    productionReleaseApproved: false,
    build: { base, site },
    mappingDigest: projection.mappingDigest,
    counts: {
      contests: projection.ui.contests.length,
      officialGaps: projection.catalog.contestGaps.length,
      problems: projection.ui.problems.length,
      tags: projection.ui.tags.length,
      learningUnits: projection.ui.learningUnits.length,
      releases: projection.history.length,
      routes: routes.length,
      searchDocuments: indexedEntities.length,
      correctionImpacts: projection.corrections.length,
      retiredOptionalTargets: projection.retiredTargets.length,
    },
    textbookUnitIds: projection.ui.learningUnits.map((unit) => unit.id),
    routes,
    searchDocumentsDigest: canonicalDigest(indexedEntities),
    correctionImpacts: projection.corrections,
    retiredTargets: projection.retiredTargets,
    artifactDigest,
    artifactInventory,
  };
  if (mode === '--write') {
    await mkdir(path.dirname(FULL_PROJECTION_PATH), { recursive: true });
    await writeFile(FULL_PROJECTION_PATH, `${JSON.stringify(report, null, 2)}\n`);
  } else {
    const previous: unknown = JSON.parse(await readFile(FULL_PROJECTION_PATH, 'utf8')) as unknown;
    if (canonicalJson(previous) !== canonicalJson(report))
      throw new Error('FULL_PROJECTION_EVIDENCE_STALE');
  }
  console.log(
    JSON.stringify({
      status: 'passed',
      fullProjectionDigest: report.fullProjectionDigest,
      ...report.counts,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
