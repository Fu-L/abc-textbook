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
import {
  projectionBuildDigest,
  projectionImplementationDigest,
} from '../verify/full-projection-evidence.js';

const mode = process.argv[2] ?? '--check';
try {
  if (process.argv.length > 3 || !['--check', '--write', '--write-evidence'].includes(mode))
    throw new Error('Usage: verify-full-projections [--check | --write | --write-evidence]');
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
  const tagByFile = new Map(
    projection.catalog.tags.map((tag) => [`tags/${tag.id}/index.html`, tag]),
  );
  const placementByProblem = new Map(
    projection.policy.placements.map((placement) => [placement.problemId, placement]),
  );
  const outcomeById = new Map(
    projection.catalog.learningOutcomes.map((outcome) => [outcome.id, outcome]),
  );
  const cellProblemIds = new Set<string>();
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
        const tag = tagByFile.get(file);
        if (tag) {
          const searchTerms = main.find('[data-search-projection]').text();
          for (const [label, patterns] of [
            ['扱う対象', tag.semanticSignature.objectPatterns],
            ['使う手掛かり', tag.semanticSignature.triggerPatterns],
            ['保つ不変量', tag.semanticSignature.invariantPatterns],
            ['求めるもの', tag.semanticSignature.goalPatterns],
            ['適用しない条件', tag.semanticSignature.excludedPatterns],
          ] as const) {
            const actual = main
              .find('dt')
              .filter((_i, element) => $(element).text() === label)
              .next('dd')
              .find('li')
              .map((_i, element) => $(element).text())
              .get();
            if (canonicalJson(actual) !== canonicalJson(patterns))
              throw new Error(`FULL_PROJECTION_TAG_RECALL:${tag.id}:${label}`);
            if (patterns.some((pattern) => !searchTerms.includes(pattern)))
              throw new Error(`FULL_PROJECTION_TAG_SEARCH:${tag.id}:${label}`);
          }
          const actual = main
            .find('h2')
            .filter((_i, element) => $(element).text() === '学習成果と学習単位')
            .parent()
            .find('li > p')
            .map((_i, element) => $(element).text())
            .get();
          const expected = tag.learningOutcomeIds.map((id) => outcomeById.get(id)?.statement);
          if (canonicalJson(actual) !== canonicalJson(expected))
            throw new Error(`FULL_PROJECTION_TAG_OUTCOME:${tag.id}`);
          for (const [heading, problemIds] of [
            ['代表問題', tag.representativeProblemIds],
            [
              '関連問題',
              projection.catalog.problems
                .filter((problem) =>
                  [...problem.primaryTagIds, ...problem.secondaryTagIds].includes(tag.id),
                )
                .map((problem) => problem.id),
            ],
          ] as const) {
            const links = main
              .find('h2')
              .filter((_i, element) => $(element).text() === heading)
              .parent()
              .find('li a')
              .map((_i, element) => $(element).attr('href'))
              .get();
            const expectedLinks = problemIds.map((id) => withBase(`/problems/${id}/`, base));
            if (canonicalJson(links) !== canonicalJson(expectedLinks))
              throw new Error(`FULL_PROJECTION_TAG_PROBLEMS:${tag.id}:${heading}`);
          }
        }
        main.find('.contest-cell[data-problem-id]').each((_i, element) => {
          const cell = $(element);
          const id = cell.attr('data-problem-id') ?? '';
          const placement = placementByProblem.get(id);
          if (!placement) throw new Error(`FULL_PROJECTION_CELL_PROBLEM:${file}:${id}`);
          for (const [label, tagIds] of [
            ['主タグ:', placement.primaryTagIds],
            ['補助タグ:', placement.supportingTagIds],
          ] as const) {
            const actual = cell
              .find('a')
              .filter((_j, anchor) => $(anchor).text().startsWith(label))
              .map((_j, anchor) => $(anchor).attr('href'))
              .get();
            const expected = tagIds.map((tagId) => withBase(`/tags/${tagId}/`, base));
            if (canonicalJson(actual) !== canonicalJson(expected))
              throw new Error(`FULL_PROJECTION_CELL_TAGS:${file}:${id}:${label}`);
          }
          cellProblemIds.add(id);
        });
      }
    }
    if (mode !== '--check')
      artifactInventory.push({
        path: `dist/${file}`,
        digest: createHash('sha256').update(bytes).digest('hex'),
        byteLength: bytes.length,
      });
  }
  if (cellProblemIds.size !== projection.ui.problems.length)
    throw new Error('FULL_PROJECTION_CELL_COVERAGE');
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
  const counts = {
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
  };
  // Legacy audit consumers may explicitly write their existing report. Normal
  // checking validates the current source/build directly and never reads that report.
  if (mode === '--write' || mode === '--write-evidence') {
    const artifactDigest = canonicalDigest(artifactInventory);
    const report = {
      schemaVersion: '1.0.0',
      taskId: 'T160',
      status: 'passed',
      sourceProjectionDigest: projection.digest,
      implementationDigest: await projectionImplementationDigest(),
      fullProjectionDigest: projectionBuildDigest(projection.digest, artifactDigest),
      publicationStatus: 'prepared',
      productionReleaseApproved: false,
      build: { base, site },
      mappingDigest: projection.mappingDigest,
      counts,
      textbookUnitIds: projection.ui.learningUnits.map((unit) => unit.id),
      routes,
      searchDocumentsDigest: canonicalDigest(indexedEntities),
      correctionImpacts: projection.corrections,
      retiredTargets: projection.retiredTargets,
      artifactDigest,
      artifactInventory,
    };
    await mkdir(path.dirname(FULL_PROJECTION_PATH), { recursive: true });
    await writeFile(FULL_PROJECTION_PATH, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(
    JSON.stringify({
      status: 'passed',
      sourceProjectionDigest: projection.digest,
      ...counts,
    }),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
