import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.js';

const routes = [
  './learn/query/priority-queue-best-first/',
  './learn/query/range-monoid-aggregation/',
  './problems/abc391-f/',
];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`keeps ${route} readable with 200% text and keyboard in ${colorScheme}`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 720, height: 900 });
      await page.goto(route);
      const original = await page
        .locator('.authored-content p')
        .first()
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
      // User text enlargement plus a 720 CSS-px viewport (1440px at 200% page
      // zoom). This exercises reflow, unlike CDP's pinch-only pageScaleFactor.
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const paragraph = page.locator('.authored-content p').first();
      await expect
        .poll(
          async () =>
            (await paragraph.evaluate((element) =>
              parseFloat(getComputedStyle(element).fontSize),
            )) / original,
        )
        .toBeGreaterThanOrEqual(1.9);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.locator('.skip-link').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('main')).toBeInViewport();
      const contents = page.locator('#page-contents');
      await contents.locator('summary').focus();
      await expect(contents.locator('summary')).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      const link = contents
        .locator('a')
        .filter({ hasText: route.includes('/problems/') ? '正当性' : '考え方' })
        .first();
      const href = await link.getAttribute('href');
      if (!href) throw new Error('Missing heading fragment');
      await link.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator(`[id="${decodeURIComponent(href.slice(1))}"]`)).toBeInViewport();
      const math = page.locator('.authored-content math').first();
      await expect(math).toBeVisible();
      expect(
        await page.locator('.authored-content').evaluate((element) => {
          const clone = element.cloneNode(true) as HTMLElement;
          clone.querySelectorAll('annotation, pre, code').forEach((node) => {
            node.remove();
          });
          return /\$\$|\\(?:frac|sum|times|leq|geq|begin)\b/u.test(clone.textContent);
        }),
      ).toBe(false);
      // One independent axe run per representative page/theme keeps failure
      // reports local and checks actual computed contrast, not just variables.
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      if (route.includes('/problems/') && colorScheme === 'light') {
        const screenshot = testInfo.outputPath('200-percent-reading.png');
        await page.screenshot({ path: screenshot });
        await testInfo.attach('200-percent-reading', {
          path: screenshot,
          contentType: 'image/png',
        });
      }
    });
  }
}
