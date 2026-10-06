import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './fixtures.js';

test('exposes landmarks, headings, table headers, names, text states, and keyboard focus', async ({
  page,
}) => {
  // The full matrix's 868 cells are covered by the structural/route checks.
  // Audit the same shared table and cell components on a representative contest.
  await page.goto('./contests/abc212/');

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'パンくず' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('rowheader').first()).toBeVisible();
  await expect(page.getByText('収録済み').first()).toBeVisible();
  await expect(page.getByRole('button', { name: '検索' })).toBeEnabled();

  await page.keyboard.press('Tab');
  await expect(page.locator(':focus-visible')).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('keeps core content and navigation available without JavaScript', async ({
  baseURL,
  browser,
}) => {
  if (!baseURL) throw new Error('Playwright baseURL is required.');
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /コンテスト/u }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '検索' })).toBeDisabled();
  await context.close();
});
