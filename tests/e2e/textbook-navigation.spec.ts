import { mkdir } from 'node:fs/promises';
import { expect, test } from './fixtures.js';

const unit = './learn/query/priority-queue-best-first/';

test('desktop highlights the current chapter, keeps the reading position and follows adjacent pages', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(unit);
  const menu = page.getByRole('navigation', { name: '教科書の目次' });
  await expect(page.locator('#unit-contents')).toHaveAttribute('open', '');
  await expect(menu.locator('.contents-chapter')).toHaveCount(9);
  await expect(menu.locator('.contents-chapter[open]')).toHaveCount(1);
  await expect(menu.locator('[aria-current="page"]')).toHaveText('priority queue・best-first列挙');
  await expect(menu.locator('[aria-current="page"]')).toBeInViewport();
  await expect(page.locator('.breadcrumbs a').last()).toHaveAttribute('href', /\/learn\/query\/$/u);
  const next = page.locator('.previous-next a[rel="next"]');
  const previous = page.locator('.previous-next a[rel="prev"]');
  await expect(previous).toHaveAttribute('href', /\/learn\/query\/ordered-set-heap\/$/u);
  await expect(next).toHaveAttribute('href', /\/learn\/query\/ordered-set-multiset\/$/u);
  await next.click();
  await expect(page.locator('h1')).toHaveText('ordered set・multisetの動的順序管理');
  await page.goBack();
  await page.locator('#考え方').evaluate((element) => {
    element.scrollIntoView();
  });
  const before = await page.evaluate(() => scrollY);
  await menu.locator('.contents-chapter > summary').last().click();
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(page.locator('#考え方')).toBeInViewport();
});

test('a late Unit in the longest chapter scrolls the menu without scrolling the article', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./learn/graph/min-weight-general-perfect-matching/');
  const current = page.locator('.textbook-sidebar [aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toBeInViewport();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect(
    await page.locator('.textbook-sidebar').evaluate((element) => element.scrollTop),
  ).toBeGreaterThan(0);
  await expect(page.locator('.previous-next a[rel="next"]')).toHaveAttribute(
    'href',
    /\/learn\/tree\/$/u,
  );
  await page.locator('.previous-next a[rel="next"]').click();
  await expect(page.locator('.previous-next a[rel="prev"]')).toHaveAttribute(
    'href',
    /\/learn\/graph\/min-weight-general-perfect-matching\/$/u,
  );
});

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [320, 720, 1440]) {
    test(`native menu works without JS at ${String(width)} px in ${colorScheme}`, async ({
      browser,
      baseURL,
    }) => {
      if (!baseURL) throw new Error('Playwright baseURL is required.');
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled: false,
        colorScheme,
        viewport: { width, height: 1000 },
      });
      const page = await context.newPage();
      await page.goto(unit);
      await expect(page.locator('#unit-contents')).not.toHaveAttribute('open', '');
      await expect(page.locator('#概要 + p')).toBeInViewport();
      const summary = page.locator('#unit-contents > summary');
      await summary.focus();
      await page.keyboard.press('Enter');
      const menu = page.getByRole('navigation', { name: '教科書の目次' });
      await expect(menu.locator('[aria-current="page"]')).toBeVisible();
      await expect(menu.locator('.contents-chapter[open]')).toHaveCount(1);
      const chapter = menu.locator('.contents-chapter').last();
      await chapter.locator('summary').focus();
      await page.keyboard.press('Space');
      await expect(chapter).toHaveAttribute('open', '');
      await expect(chapter.locator('ol a').last()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await chapter.locator('ol a').last().click();
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.previous-next a[rel="next"]')).toHaveCount(0);
      await page.goto('./learn/modeling/');
      await expect(page.locator('.previous-next a[rel="prev"]')).toHaveCount(0);
      await page.goto('./learn/');
      await expect(page.getByRole('navigation', { name: '章へ移動' }).locator('a')).toHaveCount(9);
      await page.getByRole('navigation', { name: '章へ移動' }).locator('a').last().click();
      await expect(page.locator('#unit-chapter-geometry-optimization h2')).toBeInViewport();
      await context.close();
    });
  }
}

test('mobile and 200% equivalent layout collapse the menu and keep legacy links reachable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(unit);
  await expect(page.locator('#unit-contents')).not.toHaveAttribute('open', '');
  await page.getByRole('link', { name: '章と単元の目次', exact: true }).click();
  await expect(page.locator('#unit-contents')).toHaveAttribute('open', '');
  await expect(page.locator('.textbook-sidebar [aria-current="page"]')).toBeInViewport();
  await page.locator('#unit-contents > summary').click();
  await expect(page.locator('#unit-contents')).not.toHaveAttribute('open', '');
  await page.getByRole('link', { name: '章と単元の目次', exact: true }).click();
  await expect(page.locator('#unit-contents')).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(unit);
  await page.setViewportSize({ width: 720, height: 500 });
  await expect(page.locator('#unit-contents')).not.toHaveAttribute('open', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('representative navigation screenshots', async ({ page }) => {
  test.skip(process.env.TEXTBOOK_NAV_CAPTURE !== '1', 'Optional comparison capture');
  const dir = 'docs/operations/textbook-navigation';
  await mkdir(dir, { recursive: true });
  for (const [name, width, height, colorScheme, open] of [
    ['after-desktop', 1440, 1000, 'light', false],
    ['after-mobile', 390, 844, 'light', false],
    ['after-mobile-open', 390, 844, 'dark', true],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ colorScheme });
    await page.goto(unit);
    if (open) await page.locator('#unit-contents > summary').click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${dir}/${name}.png` });
  }
});
