import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { withNewMaterialBuild } from '../fixtures/study-ux/build.js';
import { expect, test } from './fixtures.js';

test('publishes a newly generated Unit and authored Problem through the shared reading layout', async ({
  browser,
  baseURL,
}, testInfo) => {
  test.setTimeout(180_000);
  if (!baseURL) throw new Error('Missing baseURL');
  await withNewMaterialBuild(async (dist) => {
    const unitRoute = '/abc-textbook/learn/dp/regression-transitions/';
    const problemRoute = '/abc-textbook/problems/abc467-e/';
    for (const [width, colorScheme, javaScriptEnabled] of [
      [1440, 'light', true],
      [390, 'dark', false],
    ] as const) {
      const context = await browser.newContext({
        baseURL,
        viewport: { width, height: 1000 },
        colorScheme,
        javaScriptEnabled,
      });
      try {
        // Serve the fixture's actual built HTML/assets on the usual subpath.
        // No HTML replacement, injected styles or DOM patches are used.
        await context.route('**/*', async (route) => {
          const url = new URL(route.request().url());
          if (
            ![unitRoute, problemRoute].includes(url.pathname) &&
            !url.pathname.startsWith('/abc-textbook/_astro/')
          )
            return route.continue();
          const file = path.join(
            dist,
            url.pathname.replace('/abc-textbook/', ''),
            url.pathname.endsWith('/') ? 'index.html' : '',
          );
          const contentType = file.endsWith('.html')
            ? 'text/html'
            : file.endsWith('.css')
              ? 'text/css'
              : 'application/javascript';
          await route.fulfill({ body: await readFile(file), contentType });
        });
        const page = await context.newPage();
        await page.goto(unitRoute);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('表示回帰用の遷移');
        await expect(page.locator('#考え方 + p')).toContainText('通り数');
        await expect(page.locator('.authored-content math').first()).toBeVisible();
        await expect(page.locator('.unit-context')).not.toHaveAttribute('open', '');
        await page.getByRole('link', { name: '前提を確認', exact: true }).click();
        await expect(page.locator('#前提と範囲')).toBeInViewport();
        await expect(page.locator('#根拠 + ul a').first()).toHaveAttribute(
          'href',
          /^https:\/\/atcoder.jp\//u,
        );
        await page.locator('.unit-related > summary').focus();
        await page.keyboard.press('Enter');
        const problemLink = page.locator('.unit-related a[href$="/problems/abc467-e/"]').first();
        await expect(problemLink).toBeVisible();
        await problemLink.click();
        await expect(page).toHaveURL(new RegExp(`${problemRoute}$`, 'u'));
        await expect(page.locator('#explanation h2').first()).toHaveText(/考察/u);
        await expect(page.locator('#explanation math').first()).toBeVisible();
        await expect(page.locator('#explanation pre code')).toHaveText(
          'for each vertex v:\n    next[v] = total - dp[v] - sum_of_forbidden_neighbors[v]\n',
        );
        await expect(page.locator('#explanation pre')).toHaveCSS('white-space', 'pre');
        await expect(page.locator('#出典 + ul a').first()).toHaveAttribute(
          'href',
          /^https:\/\/atcoder.jp\//u,
        );
        await page.getByRole('link', { name: '分類と前提', exact: true }).click();
        await page.locator('#problem-context > summary').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#problem-context')).toHaveAttribute('open', '');
        await expect(
          page.locator('.problem-learning-position a[href$="/learn/dp/regression-transitions/"]'),
        ).toBeVisible();
        await page.getByRole('link', { name: '学習記録', exact: true }).click();
        await expect(page.locator('#learning-record-heading')).toBeInViewport();
        if (javaScriptEnabled) {
          await expect(page.getByLabel('学習状況', { exact: true })).toBeEnabled();
        } else {
          await expect(page.locator('.problem-record noscript')).toBeVisible();
          expect(
            await page.locator('.problem-record noscript').evaluate((node) => node.textContent),
          ).toContain('教材本文はそのまま読めます');
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        await page.goto(problemRoute);
        const screenshot = testInfo.outputPath(`new-problem-${String(width)}-${colorScheme}.png`);
        await page.screenshot({ path: screenshot });
        await testInfo.attach(`new-problem-${String(width)}-${colorScheme}`, {
          path: screenshot,
          contentType: 'image/png',
        });
      } finally {
        await context.close();
      }
    }
  });
});
