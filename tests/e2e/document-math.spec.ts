import { expect, test } from './fixtures.js';

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [1440, 390, 720]) {
    test(`reads static mathematics without JS at ${String(width)} px in ${colorScheme}`, async ({
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
      const violations: string[] = [];
      page.on('console', (message) => {
        if (/Content Security Policy|Refused to/iu.test(message.text()))
          violations.push(message.text());
      });
      for (const route of ['./problems/abc391-f/', './problems/abc213-g/']) {
        await page.goto(route);
        const math = page.locator('.authored-content math');
        await expect(math.first()).toBeVisible();
        await expect(page.locator('math msub').first()).toBeAttached();
        await expect(page.locator('math msup').first()).toBeAttached();
        await expect(page.locator('math mo').filter({ hasText: '≤' }).first()).toBeAttached();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        expect(
          await math.evaluateAll((elements) =>
            elements.every((element) => {
              const rect = element.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            }),
          ),
        ).toBe(true);
        await expect(page.locator('#計算量と制約')).toBeAttached();
        await expect(page.locator('main a[rel="external"]').first()).toBeVisible();
        expect(violations).toEqual([]);
      }
      await context.close();
    });
  }
}

test('lets the keyboard reach and scroll a wide display equation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./problems/abc391-f/');
  // Stress the published display with a long expression while retaining its MathML.
  const display = page.locator('.math-display');
  await display.evaluate((element) => {
    const row = element.querySelector('mrow');
    if (!row) throw new Error('Missing MathML row');
    const nodes = [...row.childNodes];
    for (let i = 0; i < 8; i++) for (const node of nodes) row.append(node.cloneNode(true));
  });
  await display.scrollIntoViewIfNeeded();
  await page.locator('.authored-content a').first().focus();
  await page.keyboard.press('Tab');
  await expect(display).toBeFocused();
  expect(await display.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.keyboard.press('ArrowRight', { delay: 100 });
  await expect.poll(() => display.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
