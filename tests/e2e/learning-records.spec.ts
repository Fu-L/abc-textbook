import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.js';
import type { LearningRecord } from '../../src/lib/learning-records/types.js';

const compatibilityRecords: LearningRecord[] = Array.from({ length: 120 }, (_, index) => ({
  problemId: index === 0 ? 'abc212-g' : `abc${String(500 + index)}-e`,
  status: index % 2 ? 'in_progress' : 'completed',
  statusUpdatedAt: '2026-07-29T08:00:00-04:00',
  needsReview: index % 3 === 0,
  needsReviewUpdatedAt: '2026-07-29T21:30:00+09:00',
}));

async function browserRecordState(page: Page) {
  return page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('abc-textbook-learning-records');
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error ?? new Error('Database open failed'));
      };
    });
    try {
      const store = database
        .transaction('learning-records', 'readonly')
        .objectStore('learning-records');
      const records = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
          resolve(request.result as Record<string, unknown>[]);
        };
        request.onerror = () => {
          reject(request.error ?? new Error('Database read failed'));
        };
      });
      return {
        name: database.name,
        version: database.version,
        stores: [...database.objectStoreNames],
        keyPath: store.keyPath,
        records,
      };
    } finally {
      database.close();
    }
  });
}

async function selectBackup(page: Page, records: LearningRecord[]) {
  await expect(page.getByLabel('JSONバックアップを選択')).toBeEnabled();
  await page.getByLabel('JSONバックアップを選択').setInputFiles({
    name: 'old-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-30T10:00:00+09:00',
        catalogVersionAtExport: '2026.07.1',
        records,
        orphanedProblemIds: [],
      }),
    ),
  });
  await expect(page.getByRole('heading', { name: '復元前プレビュー' })).toBeVisible();
  await page.getByLabel('backup-wins', { exact: true }).check();
}

const problemIds = [
  'abc212-g',
  'abc215-e',
  'abc218-f',
  'abc222-g',
  'abc223-f',
  'abc232-e',
  'abc252-e',
  'abc256-f',
];

for (const problemId of problemIds) {
  for (const run of [1, 2]) {
    test(`${problemId} run ${String(run)} uses the shared learning-record contract and persists both actions`, async ({
      browser,
      page,
    }, testInfo) => {
      await page.goto(`problems/${problemId}/`);
      const control = page.locator(`[data-learning-record-control="${problemId}"]`);
      await expect(control).toBeVisible();
      await expect(
        control.getByText('端末内だけに保存します。外部送信は行いません。'),
      ).toBeVisible();
      const startedAt = performance.now();
      await control.getByLabel('学習状況').selectOption('completed');
      await expect(control.getByRole('status')).toHaveText('進捗を保存しました。');
      await control.getByLabel('要復習').check();
      await expect(control.getByText('復習設定を保存しました。')).toBeVisible();
      const completedAt = performance.now();
      expect(completedAt - startedAt).toBeLessThan(30_000);
      await page.reload();
      await expect(control.getByLabel('学習状況')).toHaveValue('completed');
      await expect(control.getByLabel('要復習')).toBeChecked();
      const persisted = await page.evaluate(async (id) => {
        const request = indexedDB.open('abc-textbook-learning-records');
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = () => {
            reject(request.error ?? new Error('IndexedDB open failed.'));
          };
        });
        const transaction = database.transaction('learning-records', 'readonly');
        const getRequest = transaction.objectStore('learning-records').get(id);
        const record = await new Promise<Record<string, unknown>>((resolve, reject) => {
          getRequest.onsuccess = () => {
            resolve(getRequest.result as Record<string, unknown>);
          };
          getRequest.onerror = () => {
            reject(getRequest.error ?? new Error('IndexedDB read failed.'));
          };
        });
        database.close();
        return record;
      }, problemId);
      const rollbackPassed = await page.evaluate(async () => {
        const request = indexedDB.open('abc-textbook-learning-records');
        const database = await new Promise<IDBDatabase>((resolve, reject) => {
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = () => {
            reject(request.error ?? new Error('IndexedDB open failed.'));
          };
        });
        const transaction = database.transaction('learning-records', 'readwrite');
        transaction.objectStore('learning-records').put({
          problemId: 'abc999-rollback-probe',
          status: 'completed',
          statusUpdatedAt: '2026-07-29T20:00:00+09:00',
          needsReview: true,
          needsReviewUpdatedAt: '2026-07-29T20:00:00+09:00',
        });
        const aborted = new Promise<void>((resolve) => {
          transaction.onabort = () => {
            resolve();
          };
        });
        transaction.abort();
        await aborted;
        const verifyTransaction = database.transaction('learning-records', 'readonly');
        const verifyRequest = verifyTransaction
          .objectStore('learning-records')
          .get('abc999-rollback-probe');
        const value = await new Promise<unknown>((resolve, reject) => {
          verifyRequest.onsuccess = () => {
            resolve(verifyRequest.result);
          };
          verifyRequest.onerror = () => {
            reject(verifyRequest.error ?? new Error('IndexedDB rollback read failed.'));
          };
        });
        database.close();
        return value === undefined;
      });
      expect(rollbackPassed).toBe(true);
      await testInfo.attach('learning-record-run', {
        body: JSON.stringify({
          problemId,
          engineRevision: browser.version(),
          startedMonotonicMs: startedAt,
          completedMonotonicMs: completedAt,
          durationMs: completedAt - startedAt,
          rollbackPassed,
          ...persisted,
        }),
        contentType: 'application/json',
      });
    });
  }
}

test('storage failure leaves the textbook readable and disables only the controls', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis, 'indexedDB', { value: undefined });
  });
  await page.goto('problems/abc212-g/');
  await expect(page.getByRole('heading', { name: '解説' })).toBeVisible();
  await expect(page.getByLabel('学習状況')).toBeDisabled();
  await expect(page.getByRole('alert')).toContainText('利用できません');
});

test('version 1 records migrate atomically', async ({ page }) => {
  await page.goto('learn/');
  await page.evaluate(async (records) => {
    await new Promise<void>((resolve, reject) => {
      const remove = indexedDB.deleteDatabase('abc-textbook-learning-records');
      remove.onsuccess = () => {
        resolve();
      };
      remove.onerror = () => {
        reject(remove.error ?? new Error('IndexedDB delete failed.'));
      };
    });
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('abc-textbook-learning-records', 1);
      request.onupgradeneeded = () => {
        const store = request.result.createObjectStore('learning-records', {
          keyPath: 'problemId',
        });
        for (const record of records)
          store.put({
            problemId: record.problemId,
            // Both the old boolean-only form and independently dated v1 records remain readable.
            completed: record.status === 'completed',
            ...(record.status === 'in_progress' ? { status: record.status } : {}),
            updatedAt: record.statusUpdatedAt,
            needsReview: record.needsReview,
            needsReviewUpdatedAt: record.needsReviewUpdatedAt,
          });
      };
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
      request.onerror = () => {
        reject(request.error ?? new Error('IndexedDB seed failed.'));
      };
    });
  }, compatibilityRecords);
  await page.goto('problems/abc212-g/');
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  await expect(page.getByLabel('要復習')).toBeChecked();
  const state = await browserRecordState(page);
  expect(state).toEqual({
    name: 'abc-textbook-learning-records',
    version: 2,
    stores: ['learning-records'],
    keyPath: 'problemId',
    records: compatibilityRecords,
  });
  await page.reload();
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  expect(await browserRecordState(page)).toEqual(state);
});

test('migration failure aborts database open and disables controls', async ({ page }) => {
  await page.goto('learn/');
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const remove = indexedDB.deleteDatabase('abc-textbook-learning-records');
      remove.onsuccess = () => {
        resolve();
      };
      remove.onerror = () => {
        reject(remove.error ?? new Error('IndexedDB delete failed.'));
      };
    });
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('abc-textbook-learning-records', 1);
      request.onupgradeneeded = () => {
        request.result
          .createObjectStore('learning-records', { keyPath: 'problemId' })
          .put({ problemId: 'not-a-problem-id', completed: true });
      };
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
      request.onerror = () => {
        reject(request.error ?? new Error('IndexedDB seed failed.'));
      };
    });
  });
  await page.goto('problems/abc212-g/');
  await expect(page.getByLabel('学習状況')).toBeDisabled();
  await expect(page.getByRole('alert')).toBeVisible();
  const state = await browserRecordState(page);
  expect(state.version).toBe(1);
  expect(state.records).toEqual([{ problemId: 'not-a-problem-id', completed: true }]);
});

test('separate tabs preserve independent values and timestamps through reload', async ({
  context,
  page,
}) => {
  const other = await context.newPage();
  const firstTime = '2026-07-29T01:00:00.000Z';
  const secondTime = '2026-07-29T02:00:00.000Z';
  await page.clock.setFixedTime(new Date(firstTime));
  await page.goto('problems/abc212-g/');
  await other.goto('problems/abc212-g/');
  await expect(other.getByLabel('要復習')).toBeEnabled();
  await page.getByLabel('学習状況').selectOption('completed');
  await expect(page.getByText('進捗を保存しました。', { exact: true })).toBeVisible();
  await other.clock.setFixedTime(new Date(secondTime));
  // The other tab still displays the old status; its review write must re-read the actual DB record.
  await other.getByLabel('要復習').check();
  await expect(other.getByText('復習設定を保存しました。', { exact: true })).toBeVisible();
  const expected = [
    {
      problemId: 'abc212-g',
      status: 'completed',
      statusUpdatedAt: firstTime,
      needsReview: true,
      needsReviewUpdatedAt: secondTime,
    },
  ];
  expect((await browserRecordState(page)).records).toEqual(expected);
  for (const tab of [page, other]) {
    await tab.reload();
    await expect(tab.getByLabel('学習状況')).toHaveValue('completed');
    await expect(tab.getByLabel('要復習')).toBeChecked();
    expect((await browserRecordState(tab)).records).toEqual(expected);
  }
});

test('failed writes restore the displayed values and retain the stored timestamps', async ({
  page,
}) => {
  await page.goto('settings/learning-records/');
  await selectBackup(page, compatibilityRecords.slice(0, 1));
  await page.getByRole('button', { name: '方針を確認して適用' }).click();
  await expect(page.getByText('1件を復元しました。', { exact: true })).toBeVisible();
  await page.goto('problems/abc212-g/');
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  const before = await browserRecordState(page);
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = function () {
      throw new DOMException('Injected save failure', 'QuotaExceededError');
    };
  });
  await page.getByLabel('学習状況').selectOption('in_progress');
  await expect(page.getByRole('status')).toContainText(
    '進捗を保存できませんでした。表示を元に戻しました。',
  );
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  // The failed write immediately restores the checked state; uncheck() would reject that rollback.
  await page.getByLabel('要復習').click();
  await expect(page.getByRole('status')).toContainText(
    '復習設定を保存できませんでした。表示を元に戻しました。',
  );
  await expect(page.getByLabel('要復習')).toBeChecked();
  expect(await browserRecordState(page)).toEqual(before);
  await page.reload();
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  expect(await browserRecordState(page)).toEqual(before);
});

test('restores and exports 120 old backup records including unknown IDs without changing values', async ({
  page,
}) => {
  await page.goto('settings/learning-records/');
  await selectBackup(page, compatibilityRecords);
  await expect(page.getByText('unknown_problem_id: 119件', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '方針を確認して適用' }).click();
  await expect(page.getByText('120件を復元しました。', { exact: true })).toBeVisible();
  expect((await browserRecordState(page)).records).toEqual(compatibilityRecords);
  await page.reload();
  await expect(page.getByText('120件を端末内に保存しています。', { exact: true })).toBeVisible();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'JSONバックアップを保存' }).click();
  const download = await downloading;
  const file = await download.path();
  if (!file) throw new Error('Missing backup download');
  const bytes = await readFile(file);
  const backup = JSON.parse(bytes.toString('utf8')) as {
    schemaVersion: string;
    records: LearningRecord[];
    orphanedProblemIds: string[];
  };
  expect(backup.schemaVersion).toBe('1.0.0');
  expect(backup.records).toEqual(compatibilityRecords);
  expect(backup.orphanedProblemIds).toEqual(
    compatibilityRecords.slice(1).map(({ problemId }) => problemId),
  );
  await page.getByLabel('JSONバックアップを選択').setInputFiles({
    name: 'exported-backup.json',
    mimeType: 'application/json',
    buffer: bytes,
  });
  await expect(page.getByRole('heading', { name: '復元前プレビュー' })).toBeVisible();
  await page.getByLabel('newer-wins', { exact: true }).check();
  await page.getByRole('button', { name: '方針を確認して適用' }).click();
  await expect(page.getByRole('heading', { name: '復元前プレビュー' })).toHaveCount(0);
  expect((await browserRecordState(page)).records).toEqual(compatibilityRecords);
});

test('a failed browser restore rolls back both overwrites and additions', async ({ page }) => {
  await page.goto('settings/learning-records/');
  const original = compatibilityRecords.slice(0, 1);
  await selectBackup(page, original);
  await page.getByRole('button', { name: '方針を確認して適用' }).click();
  await expect(page.getByText('1件を復元しました。', { exact: true })).toBeVisible();
  const before = await browserRecordState(page);
  await selectBackup(
    page,
    compatibilityRecords.slice(0, 3).map((record) => ({ ...record, status: 'unstarted' })),
  );
  await page.evaluate(() => {
    const put = Reflect.get(IDBObjectStore.prototype, 'put');
    let calls = 0;
    IDBObjectStore.prototype.put = function (...args: Parameters<typeof put>) {
      // Awaited puts have already overwritten the existing record and added a new one.
      if (++calls === 3) throw new DOMException('Injected restore failure', 'QuotaExceededError');
      return put.apply(this, args);
    };
  });
  await page.getByRole('button', { name: '方針を確認して適用' }).click();
  await expect(page.getByText(/すべて取り消しました/u)).toBeVisible();
  expect(await browserRecordState(page)).toEqual(before);
  await page.reload();
  await expect(page.getByText('1件を端末内に保存しています。', { exact: true })).toBeVisible();
  expect(await browserRecordState(page)).toEqual(before);
});

test('a blocking tab rejects database open with actionable guidance', async ({ context, page }) => {
  const blocker = await context.newPage();
  await blocker.goto('learn/');
  await blocker.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const remove = indexedDB.deleteDatabase('abc-textbook-learning-records');
      remove.onsuccess = () => {
        resolve();
      };
      remove.onerror = () => {
        reject(remove.error ?? new Error('IndexedDB delete failed.'));
      };
    });
    const request = indexedDB.open('abc-textbook-learning-records', 1);
    Reflect.set(
      globalThis,
      'learningRecordBlockingDatabase',
      await new Promise<IDBDatabase>((resolve, reject) => {
        request.onupgradeneeded = () => {
          request.result.createObjectStore('learning-records', { keyPath: 'problemId' });
        };
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(request.error ?? new Error('IndexedDB open failed.'));
        };
      }),
    );
  });
  await page.goto('problems/abc212-g/');
  await expect(page.getByLabel('学習状況')).toBeDisabled();
  await expect(page.getByRole('alert')).toContainText('ほかのタブを閉じてください');
  await blocker.close();
});

test('problem details reach the review page with all extra filters', async ({ page }) => {
  await page.goto('problems/abc212-g/');
  await expect(page.getByText('端末内だけに保存します。外部送信は行いません。')).toBeVisible();
  await page.getByLabel('要復習').check();
  await page.getByRole('link', { name: '要復習一覧' }).click();
  await expect(page.getByLabel('コンテスト')).toBeVisible();
  await expect(page.getByLabel('問題記号')).toBeVisible();
  await expect(page.getByLabel('典型タグ')).toBeVisible();
  await expect(page.getByLabel('学習単位')).toBeVisible();
  await expect(page.getByLabel('学習状況')).toBeVisible();
  await expect(page.getByRole('link', { name: /ABC212-G/u })).toBeVisible();
});

test('restore requires an explicit policy after showing component details', async ({ page }) => {
  await page.goto('settings/learning-records/');
  await expect(page.getByText(/件を端末内に保存しています/u)).toBeVisible();
  await page.evaluate(async () => {
    const request = indexedDB.open('abc-textbook-learning-records');
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error ?? new Error('IndexedDB open failed.'));
      };
    });
    const transaction = database.transaction('learning-records', 'readwrite');
    transaction.objectStore('learning-records').put({
      problemId: 'abc212-g',
      status: 'in_progress',
      statusUpdatedAt: '2026-07-28T20:00:00+09:00',
      needsReview: false,
      needsReviewUpdatedAt: '2026-07-28T20:00:00+09:00',
    });
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error ?? new Error('IndexedDB seed failed.'));
      };
    });
    database.close();
  });
  await page.getByLabel('JSONバックアップを選択').setInputFiles({
    name: 'learning-records.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        schemaVersion: '1.0.0',
        exportedAt: '2026-07-29T20:00:00+09:00',
        catalogVersionAtExport: '2026.07.1',
        records: [
          {
            problemId: 'abc212-g',
            status: 'completed',
            statusUpdatedAt: '2026-07-29T20:00:00+09:00',
            needsReview: true,
            needsReviewUpdatedAt: '2026-07-29T20:00:00+09:00',
          },
        ],
        orphanedProblemIds: [],
      }),
    ),
  });
  await page.getByText('項目ごとの判定').click();
  await expect(page.getByText('backup status')).toBeVisible();
  await expect(page.getByText(/status: 採用元 backup \/ 理由/u)).toBeVisible();
  const applyButton = page.getByRole('button', { name: '方針を確認して適用' });
  await expect(applyButton).toBeDisabled();
  await page.getByLabel('newer-wins').check();
  await expect(applyButton).toBeEnabled();
});
