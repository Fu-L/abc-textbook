import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

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

  const themeSelect = page.locator('starlight-theme-select select').first();
  await themeSelect.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

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

test('keeps the mobile menu stable and CSP-clean', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const browserErrors = collectBrowserErrors(page);

  await page.goto('./');

  const menuButton = page.getByRole('button', { name: 'メニュー' });
  const menuToggle = page.locator('starlight-menu-button');
  const sidebar = page.locator('#starlight__sidebar');
  await page.waitForFunction(() => customElements.get('starlight-menu-button') !== undefined);
  await expect(sidebar).toBeHidden();

  await menuButton.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-mobile-menu-expanded', '');
  await expect(sidebar).toBeVisible();

  await menuButton.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveAttribute('data-mobile-menu-expanded', '');
  await expect(sidebar).toBeHidden();
  expect(browserErrors).toEqual([]);
});
