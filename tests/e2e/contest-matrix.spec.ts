import { expect, test } from './fixtures.js';

test('renders dynamic columns, explicit states, direct links, and the alternative list', async ({
  page,
}) => {
  await page.goto('./contests/');

  const table = page.getByRole('table', { name: /上級問題マトリクス/u });
  for (const label of ['E', 'F', 'G', 'H', 'Ex']) {
    await expect(table.getByRole('columnheader', { name: label, exact: true })).toBeVisible();
  }
  await expect(table.getByText('公式問題なし').first()).toBeVisible();

  const cell = table.locator('[data-problem-id="abc212-g"]');
  for (const name of ['問題詳細', '解説', '学習単位', '主タグ', '類題']) {
    await expect(cell.getByRole('link', { name: new RegExp(name, 'u') }).first()).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'コンテスト別リスト' })).toBeVisible();
});

test('the registry accepts a future I column through the same projection', async ({ page }) => {
  await page.goto('./contests/');
  const labels = await page
    .locator('[data-registry-labels]')
    .first()
    .getAttribute('data-registry-labels');
  expect(labels?.split(',')).toEqual(['E', 'F', 'G', 'Ex', 'H']);
  await page.getByText('将来の I 問題と確認不能状態を同じ投影で扱う互換性 fixture').click();
  const fixture = page.getByRole('table', { name: 'future I compatibility fixture' });
  await expect(fixture.getByRole('columnheader', { name: 'I', exact: true })).toBeVisible();
  await expect(fixture.getByText('確認不能')).toBeVisible();
  await expect(fixture.getByText('未収録').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'コンテスト別リスト' }).last()).toBeVisible();
});

test('keeps only the two-dimensional table horizontally scrollable at 320 CSS pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('./contests/');

  const overflow = await page.evaluate(() => {
    const tableRegion = document.querySelector<HTMLElement>('[data-matrix-scroll]');
    return {
      body: getComputedStyle(document.body).overflowX,
      matrix: tableRegion ? getComputedStyle(tableRegion).overflowX : null,
      pageWiderThanViewport: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  expect(overflow.matrix).toBe('auto');
  expect(overflow.pageWiderThanViewport).toBe(false);
});
