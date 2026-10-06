import { expect, test } from './fixtures.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';

const projection = await loadFullPublicProjection();
test('every catch-up Problem is linked from its semantic home and has a full explanation', async ({
  page,
}) => {
  for (const problem of projection.ui.problems.filter((problem) => problem.contestNumber > 466)) {
    const unit = projection.ui.learningUnits.find((unit) => unit.id === problem.learningUnitId);
    if (!unit) throw new Error('Missing home');
    await page.goto(`.${unit.route}`);
    await expect(
      page
        .locator('#catch-up-problems')
        .locator('..')
        .getByRole('link', { name: new RegExp(problem.id.toUpperCase(), 'u') }),
    ).toBeVisible();
  }
  for (const id of ['abc467-e', 'abc478-f', 'abc478-g']) {
    await page.goto(`./problems/${id}/`);
    for (const name of ['考察', '正当性', '計算量と制約', '復習の核'])
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(page.getByLabel('学習状況')).toBeEnabled();
  }
});

test('expanded catalog and new Problem hydration preserve all 120 existing learner records', async ({
  page,
}) => {
  const ids = projection.ui.problems
    .filter((problem) => problem.contestNumber <= 466)
    .slice(0, 120)
    .map((problem) => problem.id);
  const records = ids.map((problemId, index) => ({
    problemId,
    status: index % 2 ? 'completed' : 'in_progress',
    statusUpdatedAt: '2026-10-01T11:00:00.000Z',
    needsReview: index % 3 === 0,
    needsReviewUpdatedAt: '2026-10-02T12:00:00.000Z',
  }));
  await page.goto('./problems/abc467-e/');
  await expect(page.getByLabel('学習状況')).toBeEnabled();
  await page.evaluate(async (values) => {
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
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('learning-records', 'readwrite');
        for (const value of values) tx.objectStore('learning-records').put(value);
        tx.oncomplete = () => {
          resolve();
        };
        tx.onerror = () => {
          reject(tx.error ?? new Error('Transaction'));
        };
      });
    } finally {
      db.close();
    }
  }, records);
  await page.goto('./problems/abc478-g/');
  await expect(page.getByLabel('学習状況')).toBeEnabled();
  await page.evaluate(async () => {
    const response = await fetch('/data/catalog.json');
    if (!response.ok) throw new Error('Catalog');
    await response.json();
  });
  const preserved = await page.evaluate(async (problemIds) => {
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
      return await Promise.all(
        problemIds.map(
          (id) =>
            new Promise<unknown>((resolve, reject) => {
              const request = db
                .transaction('learning-records')
                .objectStore('learning-records')
                .get(id);
              request.onsuccess = () => {
                resolve(request.result as unknown);
              };
              request.onerror = () => {
                reject(request.error ?? new Error('Record'));
              };
            }),
        ),
      );
    } finally {
      db.close();
    }
  }, ids);
  expect(preserved).toEqual(records);
});
