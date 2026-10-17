import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { expect, test } from './fixtures.js';

const manuscript = await readFile('tests/fixtures/documents/widths.md', 'utf8');
const fixture = await renderPublicDocument(manuscript, '/abc-textbook/');

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [320, 390, 720, 1440]) {
    test(`keeps code, formulas, and tables readable without JS at ${String(width)} px in ${colorScheme}`, async ({
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
      // Serve the real renderer's stress manuscript inside the built page and CSS.
      // It stays a test fixture, outside the published textbook and search index.
      await page.route('**/problems/abc391-f/', async (route) => {
        const response = await route.fetch();
        const $ = load(await response.text());
        $('.authored-content').html(fixture);
        await route.fulfill({ response, body: $.html() });
      });
      await page.goto('./problems/abc391-f/');
      const content = page.locator('.authored-content');
      const fences = [...manuscript.matchAll(/```(?:cpp|text)\n([\s\S]*?)```/gu)];
      expect(await content.locator('pre code').allTextContents()).toEqual(
        fences.map((match) => match[1]),
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const inlineCode = content.locator('p code');
      expect(await inlineCode.evaluate((element) => getComputedStyle(element).overflowWrap)).toBe(
        'anywhere',
      );
      const shortMath = content.locator('.math-inline').first();
      expect(
        await shortMath.evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
      await expect(content.getByRole('table')).toHaveCount(2);
      await expect(content.getByRole('columnheader')).toHaveCount(7);
      for (const selector of ['pre', '.table-scroll', '.math-inline', '.math-display']) {
        const regions = content.locator(selector);
        for (const region of await regions.all()) {
          expect(
            await region.evaluate((element) => {
              const bounds = element.getBoundingClientRect();
              return bounds.left >= 0 && bounds.right <= innerWidth;
            }),
          ).toBe(true);
          if (!(await region.evaluate((element) => element.scrollWidth > element.clientWidth)))
            continue;
          // Tab reaches each viewport; arrows reveal the rest and Tab leaves it.
          await region.focus();
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          await expect(region).toBeFocused();
          await expect(region).toHaveCSS('outline-style', 'solid');
          await page.keyboard.press('ArrowRight', { delay: 100 });
          await expect
            .poll(() => region.evaluate((element) => element.scrollLeft))
            .toBeGreaterThan(0);
          await page.keyboard.press('Tab');
          await expect(region).not.toBeFocused();
        }
      }
      for (const pre of await content.locator('pre').all()) {
        await expect(pre).toHaveCSS('white-space', 'pre');
        await expect(pre).toHaveCSS('overflow-wrap', 'normal');
        await expect(pre).toHaveCSS('tab-size', '4');
      }
      // Prove the stress cases really overflow. Math font widths vary by engine;
      // these expressions fit desktop prose in Firefox/WebKit, but overflow a phone.
      const wideSelectors =
        width <= 390
          ? ['pre', '.table-scroll', '.math-inline', '.math-display']
          : ['pre', '.table-scroll'];
      for (const selector of wideSelectors) {
        expect(
          await content
            .locator(selector)
            .evaluateAll((elements) =>
              elements.some((element) => element.scrollWidth > element.clientWidth),
            ),
          selector,
        ).toBe(true);
      }
      await content.getByRole('link', { name: '次の節へ' }).click();
      await expect(page).toHaveURL(/#%E7%A2%BA%E8%AA%8D%E5%BE%8C$/u);
      await context.close();
    });
  }
}
