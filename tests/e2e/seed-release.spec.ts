import { performance } from 'node:perf_hooks';
import { expect, test } from './fixtures.js';

// Fixed representatives span the first contest, Ex label, and last contest.
// Timings measure automated control use after readiness, not human reading.
for (const problemId of ['abc212-e', 'abc315-ex', 'abc466-f', 'abc466-g']) {
  test(`seed SC-012 ${problemId}`, async ({ page, browserName, fixedClock }, testInfo) => {
    await page.goto(`./problems/${problemId}/`);
    const control = page.locator(`[data-learning-record-control="${problemId}"]`);
    await expect(control.getByLabel('学習状況')).toBeEnabled();
    const start = performance.now();
    const originalUrl = page.url();
    await control.getByLabel('学習状況').selectOption('completed');
    await expect(control.getByRole('status')).toHaveText('進捗を保存しました。');
    const readRecord = () =>
      page.evaluate(async (id) => {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
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
            const request = db
              .transaction('learning-records')
              .objectStore('learning-records')
              .get(id);
            request.onsuccess = () => {
              resolve(request.result as Record<string, unknown>);
            };
            request.onerror = () => {
              reject(request.error ?? new Error('read'));
            };
          });
        } finally {
          db.close();
        }
      }, problemId);
    const first = await readRecord();
    await fixedClock.advance(1000);
    await control.getByLabel('要復習').check();
    await expect(control.getByText('復習設定を保存しました。')).toBeVisible();
    const second = await readRecord();
    const durationMs = performance.now() - start;
    expect(durationMs).toBeLessThanOrEqual(30_000);
    expect(page.url()).toBe(originalUrl);
    expect(second.statusUpdatedAt).toBe(first.statusUpdatedAt);
    expect(second.needsReviewUpdatedAt).not.toBe(first.statusUpdatedAt);
    await page.reload();
    await expect(control.getByLabel('学習状況')).toHaveValue('completed');
    await expect(control.getByLabel('要復習')).toBeChecked();
    expect(await readRecord()).toEqual(second);
    await testInfo.attach('sc012-observation', {
      body: JSON.stringify({ problemId, browser: browserName, durationMs, preserved: true }),
      contentType: 'application/json',
    });
  });
}
