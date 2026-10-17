import { mkdir } from 'node:fs/promises';
import { expect, test } from './fixtures.js';

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [390, 1440]) {
    test(`reads concepts before context without JS at ${String(width)} px in ${colorScheme}`, async ({
      browser,
      baseURL,
    }) => {
      if (!baseURL) throw new Error('Playwright baseURL is required.');
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled: false,
        colorScheme,
        viewport: { width, height: width === 390 ? 844 : 1000 },
      });
      const page = await context.newPage();
      for (const slug of ['priority-queue-best-first', 'range-monoid-aggregation']) {
        await page.goto(`./learn/query/${slug}/`);
        await expect(page.locator('#概要 + p')).toBeInViewport();
        await expect(page.locator('#考え方')).toBeVisible();
        await expect(page.locator('#成立条件と計算量')).toBeVisible();
        await expect(page.locator('#考え方 + p')).toContainText(
          slug.startsWith('priority') ? '昇順の配列' : '文字列の区間',
        );
        await expect(page.locator('.unit-context').first()).not.toHaveAttribute('open', '');
        await expect(page.locator('#unit-contents')).not.toHaveAttribute('open', '');
        await expect(page.locator('.unit-related')).not.toHaveAttribute('open', '');
        await expect(page.locator('#前提と範囲')).not.toBeVisible();
        await expect(page.locator('.authored-content math').first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        if (process.env.UNIT_READING_CAPTURE === '1') {
          const dir = 'docs/operations/unit-reading';
          await mkdir(dir, { recursive: true });
          await page.screenshot({ path: `${dir}/${slug}-${String(width)}-${colorScheme}.png` });
          if (width === 390) {
            await page.locator('#考え方').evaluate((element) => {
              scrollTo(0, element.getBoundingClientRect().top + scrollY - 32);
            });
            await page.screenshot({ path: `${dir}/${slug}-concept-390-${colorScheme}.png` });
          }
        }
        await page.getByRole('link', { name: '前提を確認', exact: true }).click();
        await expect(page.locator('#前提と範囲')).toBeInViewport();
        await expect(page.locator('#根拠')).toBeVisible();
        await page.goto(`./learn/query/${slug}/#習得する技能`);
        await expect(page.locator('#習得する技能')).toBeInViewport();
        await page.goto(`./learn/query/${slug}/#根拠`);
        await expect(page.locator('#根拠')).toBeInViewport();
        await expect(page.locator('#根拠 + ul a').first()).toHaveAttribute(
          'href',
          /^https:\/\/atcoder.jp\//u,
        );
        const summary = page.locator('.unit-related > summary');
        await summary.focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('.unit-related')).toHaveAttribute('open', '');
        await expect(page.locator('.unit-related li > a').first()).toBeVisible();
        await page.keyboard.press('Enter');
        await expect(page.locator('.unit-related')).not.toHaveAttribute('open', '');
        await page.getByRole('link', { name: '章と単元の目次', exact: true }).click();
        const contents = page.locator('#unit-contents > summary');
        await contents.focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#unit-contents [aria-current="page"]')).toBeVisible();
        await page.goto(`./learn/query/${slug}/#問題一覧`);
        const first = page.locator('#問題一覧 + ul > li > a').first();
        await expect(first).toHaveAttribute(
          'href',
          new RegExp(
            slug.startsWith('priority') ? '/problems/abc384-e/$' : '/problems/abc432-e/$',
            'u',
          ),
        );
        await first.click();
        await expect(page.locator('#考察')).toBeVisible();
      }
      await context.close();
    });
  }
}

test('keeps chapters, guide Units, unedited concepts and 320/720 px reflow readable', async ({
  page,
}) => {
  for (const width of [320, 720]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      'query/',
      'modeling/',
      'query/ordered-set-heap/',
      'number-theory/dynamic-modular-product/',
    ]) {
      await page.goto(`./learn/${route}`);
      await expect(
        page.locator(route === 'modeling/' ? '#本書の読み方' : '#概要'),
      ).toBeInViewport();
      await expect(page.locator('#考え方')).toBeVisible();
      await expect(page.locator('#成立条件と計算量')).toBeVisible();
      if (route === 'query/') await expect(page.locator('#章の構成 + p + ul > li')).toHaveCount(29);
      await page.locator('.skip-link').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('main')).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});
