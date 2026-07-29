import { expect, test } from '@playwright/test';

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
        request.result.createObjectStore('learning-records', { keyPath: 'problemId' }).put({
          problemId: 'abc212-g',
          completed: true,
          needsReview: true,
          updatedAt: '2026-07-29T20:00:00+09:00',
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
  });
  await page.goto('problems/abc212-g/');
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  await expect(page.getByLabel('要復習')).toBeChecked();
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
