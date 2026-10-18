import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.js';

test('applies combined conditions, restores the URL, and keeps edits separate from results', async ({
  page,
}) => {
  await page.goto('./problems/');
  const form = page.getByRole('search', { name: '問題を絞り込む' });
  const rows = page.locator('.problem-search-results > li');
  await expect(form.getByRole('button', { name: '適用' })).toBeEnabled();
  await expect(rows).toHaveCount(868);
  await form.getByLabel('問題名').fill('Power Pair');
  await form.getByLabel('コンテスト').selectOption('abc212');
  await form.getByLabel('問題記号').selectOption('G');
  await form.getByLabel('典型タグ').selectOption('tag-cyclic-exponent-counting');
  await form.getByLabel('学習単位').selectOption('unit-cyclic-group-exponent-counting');
  await form.locator('.record-filter-options > summary').click();
  await form.getByLabel('学習状況').selectOption('unstarted');
  await form.getByLabel('要復習').selectOption('no');
  await expect(form.getByRole('status')).toContainText('「適用」で結果を更新');
  await expect(rows).toHaveCount(868);
  await form.getByRole('button', { name: '適用' }).click();
  await expect(rows).toHaveCount(1);
  expect(Object.fromEntries(new URL(page.url()).searchParams)).toEqual({
    q: 'Power Pair',
    contest: 'abc212',
    slot: 'G',
    tag: 'tag-cyclic-exponent-counting',
    unit: 'unit-cyclic-group-exponent-counting',
    status: 'unstarted',
    needsReview: 'no',
  });
  await page.reload();
  await expect(rows).toHaveCount(1);
  await expect(form.getByLabel('問題名')).toHaveValue('Power Pair');
  await form.getByLabel('問題名').fill('見つからない問題');
  await expect(rows).toHaveCount(1);
  await form.getByLabel('問題名').press('Enter');
  await expect(rows).toHaveCount(0);
  await expect(page.locator('.filter-result-count')).toContainText('すべて解除');
  await form.getByRole('button', { name: 'すべて解除' }).click();
  await expect(rows).toHaveCount(868);
  expect(new URL(page.url()).search).toBe('');
  await rows.first().getByRole('link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/problems\/abc212-e\/$/u);
});

test('uses saved review state with the same problem conditions', async ({ page }) => {
  await page.goto('./problems/abc212-g/');
  await expect(page.getByLabel('学習状況')).toBeEnabled();
  await page.getByLabel('学習状況').selectOption('completed');
  await page.getByLabel('要復習', { exact: true }).check();
  await expect(page.getByText('復習設定を保存しました。', { exact: true })).toBeVisible();
  await page.goto('./problems/?contest=abc212&status=completed&needsReview=yes');
  await expect(page.locator('.problem-search-results > li')).toHaveCount(1);
  await expect(page.locator('.problem-search-results a')).toHaveAttribute(
    'href',
    /\/problems\/abc212-g\/$/u,
  );
});

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [320, 390, 720, 1440]) {
    test(`keeps indexes readable at ${String(width)} CSS px in ${colorScheme}`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width, height: 844 });
      for (const route of ['./problems/', './tags/', './tags/tag-slope-trick/', './contests/']) {
        await page.goto(route);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${route} at ${String(width)}`,
        ).toBe(true);
      }
    });
  }

  // Give each full-page axe audit its own budget, separate from the reflow checks.
  for (const route of ['./problems/', './tags/']) {
    test(`keeps ${route} accessible in ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 1440, height: 844 });
      await page.goto(route);
      if (route === './problems/') {
        await expect(page.getByRole('button', { name: '適用' })).toBeEnabled();
      }
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    });
  }
}

test('preserves definitions, every problem link, and native disclosure without JS', async ({
  browser,
  baseURL,
}) => {
  if (!baseURL) throw new Error('Playwright baseURL is required.');
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('./problems/?contest=abc212');
  await expect(page.locator('main > noscript p')).toBeVisible();
  await expect(page.locator('main > noscript p')).toContainText(
    '絞り込みにはJavaScriptが必要です。',
  );
  await expect(page.getByRole('button', { name: '適用' })).toBeDisabled();
  await expect(page.getByLabel('問題名')).toBeDisabled();
  await expect(page.locator('.problem-search-results a')).toHaveCount(868);
  await page.goto('./tags/');
  await expect(page.locator('.tag-index > li')).toHaveCount(213);
  await expect(page.locator('.tag-index > li > p')).toHaveCount(213);
  await page.goto('./tags/tag-slope-trick/');
  await expect(
    page.getByRole('heading', { name: '未知問からこの典型を見つける手掛かり' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '代表問題', exact: true })).toBeVisible();
  const classification = page.locator('.tag-classification');
  await classification.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(classification.getByRole('heading', { name: '分類と直接の前提' })).toBeVisible();
  await expect(classification.getByRole('heading', { name: '学習成果と学習単位' })).toBeVisible();
  await page.goto('./contests/abc212/');
  const alternative = page.locator('.contest-alternative');
  await alternative.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  const cell = alternative.locator('[data-problem-id="abc212-g"]');
  await cell.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(
    cell.getByRole('link', { name: '主タグ: 巡回群の指数化・位数別数え上げ' }),
  ).toBeVisible();
  await cell.getByRole('link', { name: /Power Pair/u }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/problems\/abc212-g\/$/u);
  await context.close();
});
