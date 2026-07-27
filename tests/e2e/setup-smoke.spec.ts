import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { FIXED_CLOCK_INSTANT } from '../setup/clock-constants.js';
import { expect, test } from './fixtures.js';

function collectBrowserErrors(page: Page): string[] {
  const browserErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      browserErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    browserErrors.push(error.message);
  });

  return browserErrors;
}

test('uses the deterministic browser clock and Tokyo timezone', async ({ fixedClock, page }) => {
  await page.goto('./');

  const initialClock = await page.evaluate(() => {
    const formatter = new Intl.DateTimeFormat('ja-JP', {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      month: '2-digit',
      timeZoneName: 'short',
      year: 'numeric',
    });

    return {
      iso: new Date().toISOString(),
      parts: Object.fromEntries(
        formatter
          .formatToParts(new Date())
          .filter((part) => part.type !== 'literal')
          .map((part) => [part.type, part.value]),
      ),
      timeZone: formatter.resolvedOptions().timeZone,
    };
  });

  expect(initialClock.iso).toBe(FIXED_CLOCK_INSTANT.toISOString());
  expect(initialClock.timeZone).toBe('Asia/Tokyo');
  expect(initialClock.parts).toMatchObject({
    day: '14',
    hour: '12',
    month: '07',
    year: '2026',
  });
  expect(initialClock.parts.timeZoneName).toBeTruthy();

  await fixedClock.advance(60_000);
  await expect
    .poll(() => page.evaluate(() => new Date().toISOString()))
    .toBe('2026-07-14T03:01:00.000Z');
});

test('keeps the desktop textbook shell interactive, accessible, and CSP-clean', async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page);

  await page.goto('./');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'ABC上級問題体系化教科書',
    }),
  ).toBeVisible();

  const searchButton = page.getByRole('button', { name: '検索' });
  await expect(searchButton).toBeEnabled();
  await searchButton.click();

  const searchDialog = page.getByRole('dialog', { name: '検索' });
  await expect(searchDialog).toBeVisible();

  const searchInput = searchDialog.locator('.pagefind-ui__search-input');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('体系化');
  await expect(searchDialog.locator('.pagefind-ui__result-link').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(searchDialog).toBeHidden();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  expect(browserErrors).toEqual([]);
});

test('keeps the mobile textbook navigation stable and CSP-clean', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const browserErrors = collectBrowserErrors(page);

  await page.goto('./');

  const navigation = page.getByRole('navigation', { name: '主要セクション' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link', { name: '学習経路' })).toBeVisible();
  await expect(navigation.getByRole('link', { name: 'コンテスト' })).toBeVisible();
  await page.getByRole('button', { name: '検索' }).click();
  await expect(page.getByRole('dialog', { name: '検索' })).toBeVisible();
  expect(browserErrors).toEqual([]);
});
