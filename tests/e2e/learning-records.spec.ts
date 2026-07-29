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
      page,
    }) => {
      await page.goto(`problems/${problemId}/`);
      const control = page.locator(`[data-learning-record-control="${problemId}"]`);
      await expect(control).toBeVisible();
      await expect(
        control.getByText('端末内だけに保存します。外部送信は行いません。'),
      ).toBeVisible();
      const startedAt = Date.now();
      await control.getByLabel('学習状況').selectOption('completed');
      await expect(control.getByRole('status')).toHaveText('進捗を保存しました。');
      await control.getByLabel('要復習').check();
      await expect(control.getByText('復習設定を保存しました。')).toBeVisible();
      expect(Date.now() - startedAt).toBeLessThan(30_000);
      await page.reload();
      await expect(control.getByLabel('学習状況')).toHaveValue('completed');
      await expect(control.getByLabel('要復習')).toBeChecked();
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
