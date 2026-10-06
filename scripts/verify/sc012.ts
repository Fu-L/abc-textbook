/// <reference lib="dom" />
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { load } from 'cheerio';
import { chromium, firefox, webkit, expect, type Page } from '@playwright/test';
import prettier from 'prettier';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { UserTimingEvidenceSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { fileSha } from './initial-release-evidence.js';

const ROOT = 'docs/verification/learner-outcomes/initial-release';
const actions = ['set_status_completed', 'set_needs_review_true'] as const;
const save = async (file: string, value: unknown) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    await prettier.format(JSON.stringify(value), {
      filepath: file,
      ...(await prettier.resolveConfig(file)),
    }),
  );
};
const record = async (page: Page, problemId: string) =>
  page.evaluate(async (id) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('abc-textbook-learning-records');
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error ?? new Error('Database'));
      };
    });
    try {
      return await new Promise<{
        status: string;
        needsReview: boolean;
        statusUpdatedAt: string;
        needsReviewUpdatedAt: string;
      }>((resolve, reject) => {
        const request = db.transaction('learning-records').objectStore('learning-records').get(id);
        request.onsuccess = () => {
          resolve(
            request.result as {
              status: string;
              needsReview: boolean;
              statusUpdatedAt: string;
              needsReviewUpdatedAt: string;
            },
          );
        };
        request.onerror = () => {
          reject(request.error ?? new Error('Record'));
        };
      });
    } finally {
      db.close();
    }
  }, problemId);

/** Fresh browser contexts only. Measures actual saving and reload, never operator self-study. */
export const measureSC012 = async (releaseCommit: string) => {
  const projection = await loadFullPublicProjection();
  const problemId = 'abc478-g';
  const files = [
    'src/components/LearningRecordControl.tsx',
    'src/lib/learning-records/database.ts',
    'src/lib/learning-records/store.ts',
    'src/lib/learning-records/types.ts',
  ];
  const sharedComponents = await Promise.all(
    files.map(async (file) => {
      const bytes = await readFile(file);
      return { path: file, digest: fileSha(bytes), byteLength: bytes.length };
    }),
  );
  const sharedComponentSetDigest = canonicalDigest(sharedComponents);
  const actionContract = {
    contractId: 'learning-record-direct-actions',
    version: '1.0.0',
    path: files[0],
    digest: sharedComponents[0]?.digest,
    requiredActions: actions,
  };
  const checkedAt = new Date().toISOString();
  const routeInventory = await Promise.all(
    projection.catalog.problems.map(async (problem) => {
      const routePath = `dist/problems/${problem.id}/index.html`;
      const bytes = await readFile(routePath);
      const $ = load(bytes.toString('utf8'));
      const control = $(`[data-learning-record-control="${problem.id}"]`);
      if (
        control.length !== 1 ||
        control.find('select').length !== 1 ||
        control.find('input[type="checkbox"]').length !== 1
      )
        throw new Error(`SC012_ROUTE_CONTROL:${problem.id}`);
      return {
        problemId: problem.id,
        routePath,
        routeDigest: fileSha(bytes),
        sharedComponentSetDigest,
        actionContractDigest: canonicalDigest(actionContract),
        sharedComponentRendered: true,
        requiredActions: actions,
        checkResultPath: `${ROOT}/routes.json`,
        status: 'passed',
        checkedAt,
      };
    }),
  );
  const inventory = {
    schemaVersion: '1.0.0',
    releaseCommit,
    sourceProjectionDigest: projection.digest,
    sharedComponents,
    actionContract,
    routes: routeInventory,
  };
  const inventoryDigest = canonicalDigest(inventory);
  await save(`${ROOT}/routes.json`, inventory);
  const routeEquivalence = {
    inventoryPath: `${ROOT}/routes.json`,
    inventoryDigest,
    inventoryCount: routeInventory.length,
    sharedComponents,
    sharedComponentSetDigest,
    actionContract,
    representativeProblemId: problemId,
  };
  const common = {
    schemaVersion: '1.2.0',
    criterionId: 'SC-012',
    releaseVersion: projection.catalog.release.version,
    releaseDigest: projection.catalog.release.contentSnapshotDigest,
    revision: 1,
    actorRole: 'automated_browser',
    problemId,
  };
  const protocolBase = {
    ...common,
    documentKind: 'user_timing_protocol',
    artifactPath: `${ROOT}/sc012-protocol.json`,
    routeEquivalence: { ...routeEquivalence, expectedCheckedRouteCount: routeInventory.length },
    fixedAt: checkedAt,
    measurementStartsAfter: checkedAt,
    startMarker: 'problem-detail-render-complete',
    endMarker: 'both-save-confirmations-visible',
    requiredOperations: actions,
    additionalNavigationAllowed: false,
    externalInstructionsAllowed: false,
    clockKind: 'monotonic',
    maximumDurationMs: 30000,
    reloadAssertions: [
      'status_completed',
      'needs_review_true',
      'status_updated_at_preserved',
      'review_updated_at_preserved',
    ],
  };
  const protocol = UserTimingEvidenceSchema.parse({
    ...protocolBase,
    protocolDigest: canonicalDigest(protocolBase),
  });
  await save(`${ROOT}/sc012-protocol.json`, protocol);
  const server = createServer((request, response) => {
    void (async () => {
      try {
        const url = new URL(request.url ?? '/', 'http://127.0.0.1');
        const name = decodeURIComponent(url.pathname);
        if (name.includes('..')) throw new Error('Invalid path');
        const file = path.join('dist', name.endsWith('/') ? `${name}index.html` : name);
        const bytes = await readFile(file);
        const ext = path.extname(file);
        response.setHeader(
          'Content-Type',
          (
            {
              '.html': 'text/html',
              '.js': 'text/javascript',
              '.css': 'text/css',
              '.json': 'application/json',
              '.wasm': 'application/wasm',
            } as Record<string, string>
          )[ext] ?? 'application/octet-stream',
        );
        response.end(bytes);
      } catch {
        response.statusCode = 404;
        response.end();
      }
    })();
  });
  await new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', () => {
      resolve();
    }),
  );
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('SC012_SERVER');
  const results = [];
  try {
    for (const [engine, type] of [
      ['chromium', chromium],
      ['firefox', firefox],
      ['webkit', webkit],
    ] as const) {
      const browser = await type.launch();
      try {
        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${String(address.port)}/problems/${problemId}/`);
        await expect(page.getByLabel('学習状況')).toBeEnabled();
        let additionalNavigationCount = 0;
        page.on('framenavigated', (frame) => {
          if (frame === page.mainFrame()) additionalNavigationCount++;
        });
        const startedMonotonicMs = await page.evaluate(() => performance.now());
        await page.getByLabel('学習状況').selectOption('completed');
        await expect(
          page.getByRole('status').filter({ hasText: '進捗を保存しました。' }),
        ).toBeVisible();
        const statusTime = await page.evaluate(() => performance.now());
        const first = await record(page, problemId);
        await page.getByLabel('要復習', { exact: true }).check();
        await expect(
          page.getByRole('status').filter({ hasText: '復習設定を保存しました。' }),
        ).toBeVisible();
        const completedMonotonicMs = await page.evaluate(() => performance.now());
        const second = await record(page, problemId);
        const navigationCount = additionalNavigationCount;
        await page.reload();
        await expect(page.getByLabel('学習状況')).toHaveValue('completed');
        await expect(page.getByLabel('要復習', { exact: true })).toBeChecked();
        const reloaded = await record(page, problemId);
        const durationMs = completedMonotonicMs - startedMonotonicMs;
        if (
          durationMs > 30000 ||
          navigationCount ||
          first.statusUpdatedAt !== second.statusUpdatedAt ||
          JSON.stringify(second) !== JSON.stringify(reloaded)
        )
          throw new Error(`SC012_TIMING_OR_RELOAD:${engine}`);
        const raw = {
          releaseCommit,
          engine,
          browserVersion: browser.version(),
          actorRole: 'automated_browser',
          startedMonotonicMs,
          completedMonotonicMs,
          durationMs,
          records: { first, second, reloaded },
          additionalNavigationCount: navigationCount,
          humanTimingClaimed: false,
        };
        const rawPath = `${ROOT}/sc012-${engine}-raw.json`;
        await save(rawPath, raw);
        const rawBytes = await readFile(rawPath);
        const rawFiles = [
          { path: rawPath, sha256: fileSha(rawBytes), byteLength: rawBytes.length },
        ];
        const resultBase = {
          ...common,
          documentKind: 'user_timing_result',
          artifactPath: `${ROOT}/sc012-${engine}.json`,
          protocolPath: `${ROOT}/sc012-protocol.json`,
          protocolDigest: protocol.protocolDigest,
          routeEquivalence: {
            ...routeEquivalence,
            routeChecks: routeInventory.map((route) => ({
              ...route,
              checkResultDigest: inventoryDigest,
            })),
            checkedRouteCount: routeInventory.length,
            passedRouteCount: routeInventory.length,
            failedRouteCount: 0,
            aggregatePassed: true,
            failureReasons: [],
          },
          startMarker: 'problem-detail-render-complete',
          endMarker: 'both-save-confirmations-visible',
          startedMonotonicMs,
          completedMonotonicMs,
          durationMs,
          operations: [
            {
              operation: actions[0],
              completedMonotonicMs: statusTime,
              saveConfirmationObserved: true,
              persistedUpdatedAt: first.statusUpdatedAt,
            },
            {
              operation: actions[1],
              completedMonotonicMs,
              saveConfirmationObserved: true,
              persistedUpdatedAt: second.needsReviewUpdatedAt,
            },
          ],
          additionalNavigationCount: navigationCount,
          externalInstructionUsed: false,
          reloadCompleted: true,
          reloadedStatus: reloaded.status,
          reloadedNeedsReview: reloaded.needsReview,
          reloadedStatusUpdatedAt: reloaded.statusUpdatedAt,
          reloadedReviewUpdatedAt: reloaded.needsReviewUpdatedAt,
          statusUpdatedAtPreserved: true,
          reviewUpdatedAtPreserved: true,
          passed: true,
          failureReasons: [],
          rawFiles,
          rawEvidenceDigest: canonicalDigest(rawFiles),
          generatedAt: new Date().toISOString(),
        };
        const result = UserTimingEvidenceSchema.parse({
          ...resultBase,
          resultDigest: canonicalDigest(resultBase),
        });
        await save(result.artifactPath, result);
        results.push({
          engine,
          durationMs,
          path: result.artifactPath,
          digest: canonicalDigest(result),
        });
      } finally {
        await browser.close();
      }
    }
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      }),
    );
  }
  await save(`${ROOT}/sc009-disposition.json`, {
    schemaVersion: '1.0.0',
    releaseCommit,
    sourceProjectionDigest: projection.digest,
    criterionId: 'SC-009',
    status: 'not_required_by_owner',
    decisionSource: 'owner_instruction_issue_48',
    sc010Status: 'not_required_by_owner_issue_46',
    manualAnswersGenerated: false,
    alternativeEvidence: 'docs/verification/initial-release/matrix.json',
  });
  return {
    protocolPath: `${ROOT}/sc012-protocol.json`,
    inventoryDigest,
    checkedRoutes: routeInventory.length,
    results,
    measurementKind: 'automated_browser',
    humanTimingClaimed: false,
  };
};
