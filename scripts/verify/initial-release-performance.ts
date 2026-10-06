/// <reference lib="dom" />

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { UiCatalogSchema, type UiCatalog } from '../../src/lib/catalog/ui-catalog.js';
import { buildSearchDocuments } from '../../src/lib/catalog/search-documents.js';
import { assertAudit, type FullProjection } from './initial-release-audits.js';
import type { AuditCommand } from './initial-release-evidence.js';

export type AuditRun = (program: string, args: string[]) => Promise<AuditCommand>;
const ROOT = 'build/initial-release-performance';

export const designLimitCatalog = (source: UiCatalog): UiCatalog => {
  const problem = source.problems[0];
  const tag = source.tags[0];
  const unit = source.learningUnits[0];
  const contest = source.contests[0];
  if (!problem || !tag || !unit || !contest) throw new Error('PERFORMANCE_SOURCE_EMPTY');
  const tags = Array.from({ length: 500 }, (_, index) => ({
    ...tag,
    id: `tag-scale-${String(index)}`,
    name: `典型 ${String(index)}`,
    route: `/tags/tag-scale-${String(index)}/`,
    problemIds: [],
    representativeProblemIds: [],
  }));
  const learningUnits = Array.from({ length: 1000 }, (_, index) => ({
    ...unit,
    id: `unit-scale-${String(index)}`,
    title: `学習単位 ${String(index)}`,
    route: `/learn/unit-scale-${String(index)}/`,
    parentId: null,
    childUnitIds: [],
    parentTitles: [],
    prerequisiteUnitIds: [],
    problemIds: [],
    relatedProblemIds: [],
    coverageProblemIds: [],
    ownedTagIds: [],
  }));
  const contests = Array.from({ length: 375 }, (_, index) => ({
    ...contest,
    id: `abc${String(500 + index)}`,
    number: 500 + index,
    title: `ABC ${String(500 + index)}`,
    route: `/contests/abc${String(500 + index)}/`,
  }));
  const problems = Array.from({ length: 1500 }, (_, index) => {
    const number = 500 + Math.floor(index / 4);
    const label = ['E', 'F', 'G', 'I'][index % 4] ?? 'E';
    const id = `abc${String(number)}-${label.toLowerCase()}`;
    const tagId = `tag-scale-${String(index % 500)}`;
    return {
      ...problem,
      id,
      contestNumber: number,
      contestId: `abc${String(number)}`,
      label,
      route: `/problems/${id}/`,
      title: `設計上限検証 ${String(index)}`,
      tagIds: [tagId],
      primaryTagId: tagId,
      primaryTagIds: [tagId],
      supportingTagIds: [],
      learningUnitId: `unit-scale-${String(index % 1000)}`,
      similarProblemIds: [],
      relatedProblemIds: [],
    };
  });
  return UiCatalogSchema.parse({
    ...source,
    previewId: 'design-limit-performance-only',
    problems,
    tags: tags.map((item) => ({
      ...item,
      problemIds: problems.filter((p) => p.tagIds.includes(item.id)).map((p) => p.id),
    })),
    learningUnits: learningUnits.map((item) => ({
      ...item,
      problemIds: problems.filter((p) => p.learningUnitId === item.id).map((p) => p.id),
      coverageProblemIds: problems.filter((p) => p.learningUnitId === item.id).map((p) => p.id),
    })),
    contests,
    cells: [],
    releaseHistory: [],
  });
};

/** One isolated Astro fixture pipeline for all three sizes; uses production Markdown,
 * React filtering, search-document generation, CSS and Pagefind. It does not synthesize
 * accepted canonical metadata or write into src/content. Production layout/build closure
 * is separately tested by T138/T140. */
export const benchmarkInitialRelease = async (projection: FullProjection, run: AuditRun) => {
  const fixtures = [];
  const buildRuns = [];
  const commands: AuditCommand[] = [];
  const limit = designLimitCatalog(projection.ui);
  for (const [kind, ui] of [
    ['seed', projection.ui],
    ['release-cutoff', projection.ui],
    ['design-limit', limit],
  ] as const) {
    const documents = ui.problems.map((problem, index) => ({
      route: problem.route,
      title: problem.title,
      text:
        projection.problemDocuments.get(problem.id)?.text ??
        [...projection.problemDocuments.values()][index % projection.problemDocuments.size]?.text ??
        '',
    }));
    documents.push(
      ...ui.learningUnits.map((unit, index) => ({
        route: unit.route,
        title: unit.title,
        text:
          projection.unitDocuments.get(unit.id)?.text ??
          [...projection.unitDocuments.values()][index % projection.unitDocuments.size]?.text ??
          '',
      })),
    );
    documents.push(
      ...ui.tags.map((tag) => ({ route: tag.route, title: tag.name, text: tag.definition })),
      ...ui.contests.map((contest) => ({
        route: contest.route,
        title: contest.title,
        text: contest.officialUrl,
      })),
      { route: '/problems/', title: '問題一覧', text: '' },
    );
    const fixture = { ui, documents, searchDocuments: buildSearchDocuments(ui) };
    const fixtureDigest = canonicalDigest(fixture);
    fixtures.push({
      kind,
      generatorVersion: 'initial-release-v1',
      fixtureDigest,
      contestNumberCount:
        kind === 'design-limit'
          ? 375
          : projection.catalog.contests.length + projection.catalog.contestGaps.length,
      heldContestCount: ui.contests.length,
      problemCount: ui.problems.length,
      tagCount: ui.tags.length,
      learningUnitCount: ui.learningUnits.length,
      documentCount: documents.length,
      cutoffAt: kind === 'release-cutoff' ? projection.catalog.release.cutoffAt : null,
    });
    await mkdir(`${ROOT}/src/pages`, { recursive: true });
    await writeFile(`${ROOT}/fixture.json`, JSON.stringify(fixture));
    const importPath = (relative: string) => JSON.stringify(path.resolve(relative));
    await writeFile(
      `${ROOT}/astro.config.mjs`,
      `import { defineConfig } from 'astro/config';\nimport react from '@astrojs/react';\nexport default defineConfig({ site: 'http://127.0.0.1', integrations: [react()], vite: { logLevel: 'error' } });\n`,
    );
    await writeFile(
      `${ROOT}/src/pages/[...slug].astro`,
      `---
import fixture from '../../fixture.json';
import ProblemFilters from ${importPath('src/components/ProblemFilters.tsx')};
import { renderPublicDocument } from ${importPath('src/lib/catalog/render-public-document.ts')};
import ${importPath('src/styles/global.css')};
export function getStaticPaths() { return fixture.documents.map(entry => ({ params: { slug: entry.route.slice(1, -1) }, props: { entry } })); }
const { entry } = Astro.props;
const body = await renderPublicDocument(entry.text, '/');
const tags = Object.fromEntries(fixture.ui.tags.map(tag => [tag.id, tag.name]));
---
<html lang="ja"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>{entry.title}</title></head>
<body><main data-pagefind-body><h1>{entry.title}</h1><div set:html={body}/>
{entry.route === '/problems/' && <ProblemFilters client:load base="/" problems={fixture.ui.problems} tagNames={tags} learningUnits={fixture.ui.learningUnits}/>}
</main></body></html>
`,
    );
    for (let repetition = 1; repetition <= 3; repetition++) {
      const started = performance.now();
      const build = await run(process.execPath, [
        'node_modules/astro/bin/astro.mjs',
        'build',
        '--root',
        ROOT,
      ]);
      const index = await run(process.execPath, [
        'node_modules/pagefind/lib/runner/bin.cjs',
        '--site',
        `${ROOT}/dist`,
      ]);
      const searchEntry = JSON.parse(
        await readFile(`${ROOT}/dist/pagefind/pagefind-entry.json`, 'utf8'),
      ) as {
        languages: Record<string, { page_count: number }>;
      };
      assertAudit(
        Object.values(searchEntry.languages).reduce(
          (count, language) => count + language.page_count,
          0,
        ) === documents.length,
        `AUDIT_PERFORMANCE_INDEX_COVERAGE:${kind}`,
      );
      for (const document of documents) await readFile(`${ROOT}/dist${document.route}index.html`);
      const durationMs = performance.now() - started;
      assertAudit(durationMs <= 300_000, `AUDIT_BUILD_PERFORMANCE:${kind}`);
      commands.push(build, index);
      buildRuns.push({
        kind,
        run: repetition,
        fixtureDigest,
        durationMs,
        outputDigest: canonicalDigest([build.outputDigest, index.outputDigest]),
        passed: true,
      });
    }
  }
  const server = createServer((request, response) => {
    void (async () => {
      const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
      const file = path.join(
        ROOT,
        'dist',
        pathname.endsWith('/') ? `${pathname}index.html` : pathname,
      );
      response.setHeader(
        'Content-Type',
        file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html',
      );
      response.end(await readFile(file));
    })().catch(() => {
      response.writeHead(404);
      response.end();
    });
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('PERFORMANCE_SERVER');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${String(address.port)}/problems/`);
    await page.getByText('学習状態はこの端末内だけで絞り込みます。').waitFor();
    const samples = [];
    for (let index = 0; index < 40; index++) {
      const which = index % 2;
      await page.getByLabel('典型タグ').selectOption(`tag-scale-${String(which)}`);
      await page.getByLabel('学習単位').selectOption(`unit-scale-${String(which)}`);
      await page.getByLabel('学習状況').selectOption('unstarted');
      await page.getByLabel('要復習').selectOption('no');
      const expected = limit.problems
        .filter(
          (p) =>
            p.tagIds.includes(`tag-scale-${String(which)}`) &&
            p.learningUnitId === `unit-scale-${String(which)}`,
        )
        .map((p) => p.id);
      const durationMs = await page.evaluate(
        (ids) =>
          new Promise<number>((resolve, reject) => {
            const form = document.querySelector<HTMLFormElement>('form');
            const section = form?.parentElement;
            if (!form || !section) {
              reject(new Error('Missing production filter'));
              return;
            }
            const started = performance.now();
            const observer = new MutationObserver(() => {
              const links = [...section.querySelectorAll('ul li a')].map((a) =>
                a.getAttribute('href'),
              );
              if (
                links.length === ids.length &&
                ids.every((id) => links.includes(`/problems/${id}/`)) &&
                section.querySelector('[aria-live]')?.textContent ===
                  `${String(ids.length)}件の問題が該当します。`
              ) {
                observer.disconnect();
                clearTimeout(timeout);
                resolve(performance.now() - started);
              }
            });
            const timeout = setTimeout(() => {
              observer.disconnect();
              reject(new Error('Filter DOM deadline'));
            }, 5000);
            observer.observe(section, { childList: true, subtree: true, characterData: true });
            form.requestSubmit();
          }),
        expected,
      );
      if (index >= 10) samples.push(durationMs);
    }
    const sorted = [...samples].sort((a, b) => a - b);
    const p95Ms = sorted[Math.ceil(samples.length * 0.95) - 1] ?? Infinity;
    assertAudit(samples.length === 30 && p95Ms <= 100, 'AUDIT_FILTER_PERFORMANCE');
    return {
      fixtures,
      buildRuns,
      commands,
      filterMeasurement: {
        fixtureDigest: canonicalDigest(limit),
        startMarker: 'before-input-event',
        endMarker: 'count-and-list-dom-committed',
        warmupCount: 10,
        sampleCount: 30,
        samples,
        p95Ms,
        chromiumRevision: browser.version(),
        passed: true,
      },
      pipeline:
        'Isolated Astro static pages using production Markdown renderer, ProblemFilters, search documents, CSS and Pagefind; production shell closure is audited separately.',
      seedReleaseBoundary:
        'ABC212–466, 255 numbered contests including the official ABC316 gap; 254 held contests. Seed and release-cutoff currently contain the same accepted corpus.',
    };
  } finally {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    await rm(ROOT, { recursive: true, force: true });
  }
};
