import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.js';

test('serves a non-preview Problem with accepted reasoning and the shared record control', async ({
  page,
}) => {
  await page.goto('./problems/abc466-g/');
  await expect(page.getByRole('heading', { name: '考察', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '正当性', exact: true })).toBeVisible();
  await expect(page.getByText('掲載状態: 収録済み')).toBeVisible();
  await expect(page.getByLabel('学習状況')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('keeps the complete sidebar, semantic links, and prose accessible at a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('./learn/combinatorics-algebra/xor-linear-basis/');
  const navigation = page.getByRole('navigation', { name: '教科書の目次' });
  await expect(navigation.getByRole('link', { includeHidden: true })).toHaveCount(232);
  await expect(
    page
      .locator('main')
      .getByText(/概念上の親:/u)
      .first(),
  ).toBeVisible();
  await expect(page.locator('a[rel="prev"], a[rel="next"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
