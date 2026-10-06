import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalUiRoutes, withBase } from '../../src/lib/catalog/ui-catalog.js';
import { buildSearchDocuments } from '../../src/lib/catalog/search-documents.js';
import { assertAudit, type FullProjection } from './initial-release-audits.js';
import { fileSha } from './initial-release-evidence.js';

export const auditPublicArtifacts = async (projection: FullProjection) => {
  const routes = canonicalUiRoutes(projection.ui);
  const base = process.env.BASE_PATH ?? '/';
  const endpoint = CatalogSchema.parse(
    JSON.parse(await readFile('dist/data/catalog.json', 'utf8')) as unknown,
  );
  assertAudit(
    canonicalJson(endpoint) === canonicalJson(projection.catalog),
    'AUDIT_PUBLIC_ENDPOINT',
  );
  const seenProblems = new Set<string>();
  const chunks = new Map<string, { text: string; digest: string }>();
  const decisions = [];
  let imageCount = 0;
  const inventory = [];
  for (const file of (await readdir('dist', { recursive: true }))
    .filter((file) => !file.endsWith('.map'))
    .sort()) {
    // readdir includes directories; only generated files belong to the artifact subject.
    if (!/\.[a-z0-9_]+$/u.test(file)) continue;
    const bytes = await readFile(path.join('dist', file));
    inventory.push({ path: file, digest: fileSha(bytes), byteLength: bytes.length });
    if (file.endsWith('.js'))
      chunks.set(`/${file}`, { text: bytes.toString('utf8'), digest: fileSha(bytes) });
  }
  const closure = (initial: string[]) => {
    const visited = new Set<string>();
    const visit = (url: string) => {
      const logical =
        base === '/' ? url : url.replace(new RegExp(`^${base.replace(/\/$/u, '')}`, 'u'), '');
      if (visited.has(logical)) return;
      const chunk = chunks.get(logical);
      if (!chunk) return;
      visited.add(logical);
      for (const match of chunk.text.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/gu)) {
        const target = match[1];
        if (target?.startsWith('.')) visit(new URL(target, `http://localhost${logical}`).pathname);
      }
    };
    initial.forEach(visit);
    return [...visited];
  };
  for (const route of routes.filter((route) => route.endsWith('/'))) {
    const $ = load(await readFile(`dist${route}index.html`, 'utf8'));
    assertAudit(
      $('html').attr('lang') === 'ja' && $('h1').length === 1 && $('main').length === 1,
      `AUDIT_LANDMARKS:${route}`,
    );
    $('img').each((_i, element) => {
      imageCount++;
      assertAudit($(element).attr('alt') !== undefined, `AUDIT_TEXT_ALTERNATIVE:${route}`);
    });
    for (const selector of [
      'script[src]',
      'link[rel="stylesheet"]',
      'astro-island[component-url]',
      'astro-island[renderer-url]',
    ]) {
      $(selector).each((_i, element) => {
        const src =
          $(element).attr('src') ??
          $(element).attr('href') ??
          $(element).attr('component-url') ??
          '';
        assertAudit(!/^https?:\/\//u.test(src), `AUDIT_EXTERNAL_RUNTIME:${route}`);
      });
    }
    assertAudit(!$('iframe, embed, object').length, `AUDIT_EXTERNAL_EMBED:${route}`);
    if (route.startsWith('/problems/') && route !== '/problems/') {
      const id = route.split('/')[2] ?? '';
      assertAudit(
        $(`[data-learning-record-control="${id}"]`).length === 1,
        `AUDIT_RECORD_CONTROL:${id}`,
      );
      assertAudit(
        $('main').text().includes('掲載状態: 収録済み'),
        `AUDIT_EXPLANATION_PUBLIC:${id}`,
      );
      const problem = projection.ui.problems.find((item) => item.id === id);
      assertAudit(
        problem &&
          $('main a')
            .toArray()
            .some(
              (a) =>
                $(a).attr('href') ===
                withBase(
                  projection.ui.learningUnits.find((unit) => unit.id === problem.learningUnitId)
                    ?.route ?? '',
                  base,
                ),
            ),
        `AUDIT_HOME_LINK:${id}`,
      );
      for (const tagId of problem?.primaryTagIds ?? [])
        assertAudit($(`main a[href$="/tags/${tagId}/"]`).length, `AUDIT_DIRECT_TAG_LINK:${id}`);
      seenProblems.add(id);
    }
    const initial = $('script[src], astro-island')
      .toArray()
      .flatMap((element) =>
        [
          $(element).attr('src'),
          $(element).attr('component-url'),
          $(element).attr('renderer-url'),
        ].filter((url): url is string => !!url),
      );
    for (const chunkPath of closure(initial)) {
      const chunk = chunks.get(chunkPath);
      if (!chunk) continue;
      const containsLearningRecordBundle = chunk.text.includes('abc-textbook-learning-records');
      const allowed =
        !containsLearningRecordBundle ||
        route === '/problems/' ||
        /^\/problems\/abc\d+-[a-z][a-z0-9_-]*\/$/u.test(route) ||
        ['/contests/', '/review/', '/settings/learning-records/'].includes(route);
      assertAudit(allowed, `AUDIT_RECORD_BUNDLE_ROUTE:${route}:${chunkPath}`);
      decisions.push({
        route,
        chunkPath: chunkPath.slice(1),
        chunkDigest: chunk.digest,
        containsLearningRecordBundle,
        allowed,
        decisionRule: containsLearningRecordBundle
          ? 'allowed_learning_record_route_delivery'
          : 'no_learning_record_bundle',
        rationale: containsLearningRecordBundle
          ? 'Local record interaction route.'
          : 'No IndexedDB learning-record module in this delivered chunk.',
      });
    }
  }
  assertAudit(
    seenProblems.size === projection.catalog.problems.length,
    'AUDIT_PUBLIC_PROBLEM_ROUTES',
  );
  const documents = buildSearchDocuments(projection.ui);
  assertAudit(
    documents.every((document) => routes.includes(document.route)),
    'AUDIT_SEARCH_CLOSURE',
  );
  assertAudit(
    !/"(?:needsReview|statusUpdatedAt|needsReviewUpdatedAt|orphanedProblemIds)"\s*:/u.test(
      JSON.stringify(endpoint),
    ),
    'AUDIT_LOCAL_STATE_LEAK',
  );
  return {
    routeCount: routes.length,
    searchDocumentCount: documents.length,
    problemRouteCount: seenProblems.size,
    sharedControlCount: seenProblems.size,
    imageCount,
    artifactDigest: canonicalDigest(inventory),
    artifactCount: inventory.length,
    searchDocumentsDigest: canonicalDigest(documents),
    routeChunkDecisions: decisions,
    stagingAndLocalStateExcluded: true,
  };
};

export const auditLocalDependencies = async () => {
  const manifest = JSON.parse(await readFile('package.json', 'utf8')) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
  };
  const packages = [];
  for (const [name, version] of Object.entries({
    ...manifest.dependencies,
    ...manifest.devDependencies,
  }).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const installed = JSON.parse(await readFile(`node_modules/${name}/package.json`, 'utf8')) as {
      version: string;
      license?: string;
    };
    assertAudit(
      installed.version === version && typeof installed.license === 'string',
      `AUDIT_DEPENDENCY_METADATA:${name}`,
    );
    packages.push({
      name,
      version,
      license: installed.license,
      use: name in manifest.dependencies ? 'local runtime/build' : 'local development/verification',
    });
  }
  assertAudit(
    ['dev', 'build', 'preview'].every((script) =>
      manifest.scripts[script]?.includes('ASTRO_TELEMETRY_DISABLED=1'),
    ),
    'AUDIT_ASTRO_TELEMETRY',
  );
  const localState = (await readdir('src/lib/learning-records')).filter((file) =>
    file.endsWith('.ts'),
  );
  for (const file of localState) {
    const code = await readFile(`src/lib/learning-records/${file}`, 'utf8');
    assertAudit(
      !/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*(?:\(|\.)|navigator\.sendBeacon/u.test(
        code,
      ),
      `AUDIT_LEARNING_RECORD_TRANSMISSION:${file}`,
    );
  }
  return {
    packages,
    astroTelemetryDisabled: true,
    learningRecordNetworkCalls: 0,
    lockDigest: fileSha(await readFile('package-lock.json')),
  };
};

export const groupBundleDecisions = (
  decisions: Awaited<ReturnType<typeof auditPublicArtifacts>>['routeChunkDecisions'],
) => {
  const grouped = new Map<
    string,
    {
      chunkPath: string;
      chunkDigest: string;
      containsLearningRecordBundle: boolean;
      allowed: boolean;
      routes: string[];
    }
  >();
  for (const decision of decisions) {
    const item = grouped.get(decision.chunkPath) ?? {
      chunkPath: decision.chunkPath,
      chunkDigest: decision.chunkDigest,
      containsLearningRecordBundle: decision.containsLearningRecordBundle,
      allowed: decision.allowed,
      routes: [],
    };
    item.routes.push(decision.route);
    grouped.set(decision.chunkPath, item);
  }
  return {
    decisionCount: decisions.length,
    violationCount: decisions.filter((item) => !item.allowed).length,
    decisionDigest: canonicalDigest(decisions),
    chunks: [...grouped.values()],
  };
};
