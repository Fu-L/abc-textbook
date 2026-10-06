import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { expect, test } from './fixtures.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';

const projection = await loadFullPublicProjection();
const routes = [
  '/',
  '/learn/',
  '/problems/',
  '/contests/abc466/',
  '/tags/',
  '/tags/tag-slope-trick/',
  '/learn/geometry-optimization/slope-trick/',
  '/problems/abc466-g/',
  '/updates/',
  '/review/',
  '/settings/learning-records/',
];

for (const route of routes) {
  test(`initial release axe and keyboard ${route}`, async ({ page, browserName }) => {
    await page.goto(`.${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('button', { name: '検索', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: '検索', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: '検索', exact: true })).toBeVisible();
    await expect(page.getByLabel('検索語')).toBeFocused();
    // macOS WebKit uses Option-Tab for navigation through every control.
    await page.keyboard.press(
      browserName === 'webkit' && process.platform === 'darwin' ? 'Shift+Alt+Tab' : 'Shift+Tab',
    );
    await expect(page.getByRole('button', { name: '検索を閉じる', exact: true })).toBeFocused();
    await expect(page.locator(':focus-visible')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: '検索', exact: true })).not.toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
  test(`initial release no JavaScript and reflow ${route}`, async ({ browser, baseURL }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required.');
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 320, height: 800 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`.${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (route === '/problems/abc466-g/') {
        await expect(page.getByRole('heading', { name: '正当性', exact: true })).toBeVisible();
        await expect(
          page.getByRole('heading', { name: '計算量と制約', exact: true }),
        ).toBeVisible();
      }
    } finally {
      await context.close();
    }
  });
}

for (const id of ['abc466-e', 'abc466-f', 'abc466-g', 'abc315-ex']) {
  test(`initial release independent record timestamps ${id}`, async ({ page, fixedClock }) => {
    await page.goto(`./problems/${id}/`);
    const control = page.locator(`[data-learning-record-control="${id}"]`);
    await expect(control.getByLabel('学習状況')).toBeEnabled();
    await control.getByLabel('学習状況').selectOption('completed');
    await expect(control.getByRole('status')).toHaveText('進捗を保存しました。');
    const readRecord = () =>
      page.evaluate(async (problemId) => {
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open('abc-textbook-learning-records');
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = () => {
            reject(request.error ?? new Error('open'));
          };
        });
        try {
          return await new Promise<Record<string, unknown>>((resolve, reject) => {
            const request = database
              .transaction('learning-records')
              .objectStore('learning-records')
              .get(problemId);
            request.onsuccess = () => {
              resolve(request.result as Record<string, unknown>);
            };
            request.onerror = () => {
              reject(request.error ?? new Error('read'));
            };
          });
        } finally {
          database.close();
        }
      }, id);
    const first = await readRecord();
    await fixedClock.advance(60_000);
    await control.getByLabel('要復習').check();
    await expect(control.getByText('復習設定を保存しました。')).toBeVisible();
    const second = await readRecord();
    expect(second.statusUpdatedAt).toBe(first.statusUpdatedAt);
    expect(second.needsReviewUpdatedAt).not.toBe(second.statusUpdatedAt);
    await page.reload();
    await expect(control.getByLabel('要復習')).toBeChecked();
    expect(await readRecord()).toEqual(second);
  });
}

test('initial release restores and exports 120 canonical records with exact values and timestamps', async ({
  page,
}) => {
  const records = projection.ui.problems.slice(0, 120).map((problem, index) => ({
    problemId: problem.id,
    status: index % 2 ? 'completed' : 'in_progress',
    statusUpdatedAt: '2026-07-29T10:00:00+09:00',
    needsReview: index % 3 === 0,
    needsReviewUpdatedAt: '2026-07-29T11:00:00+09:00',
  }));
  await page.goto('./settings/learning-records/');
  await expect(page.getByText(/件を端末内に保存しています/u)).toBeVisible();
  await page.getByLabel('JSONバックアップを選択').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-29T12:00:00+09:00',
        catalogVersionAtExport: projection.catalog.release.version,
        records,
        orphanedProblemIds: [],
      }),
    ),
  });
  await expect(page.getByText('new: 120件')).toBeVisible();
  await page.getByLabel('newer-wins').check();
  await page.getByRole('button', { name: '方針を確認して適用' }).click();
  await expect(page.getByText('120件を復元しました。')).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSONバックアップを保存' }).click();
  const file = await (await downloaded).path();
  if (!file) throw new Error('Missing backup download.');
  const actual = JSON.parse(await readFile(file, 'utf8')) as { records: unknown[] };
  expect(actual.records).toEqual(
    [...records].sort((a, b) => a.problemId.localeCompare(b.problemId, 'en')),
  );
});

test('initial release Pagefind reaches canonical identities and makes no external requests', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname))
      external.push(request.url());
  });
  await page.goto('./problems/abc466-g/');
  const results = await page.evaluate(async () => {
    const base = location.pathname.split('/problems/')[0] ?? '';
    // Pagefind is built output, intentionally loaded from the static site.
    const modulePath = `${base}/pagefind/pagefind.js`;
    const pagefind = (await import(/* @vite-ignore */ modulePath)) as {
      search(term: string): Promise<{ results: { data(): Promise<{ url: string }> }[] }>;
    };
    const ids = ['abc212-e', 'abc315-ex', 'abc466-g'];
    const matches = [];
    for (const id of ids) {
      const result = await pagefind.search(id);
      const entries = await Promise.all(result.results.slice(0, 20).map((entry) => entry.data()));
      matches.push({ id, found: entries.some((entry) => entry.url.endsWith(`/problems/${id}/`)) });
    }
    return matches;
  });
  expect(results.every((result) => result.found)).toBe(true);
  expect(external).toEqual([]);
});
