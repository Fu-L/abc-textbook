import { mkdir } from 'node:fs/promises';
import { load } from 'cheerio';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { splitProblemContext } from '../../src/components/problem-reading.js';
import { expect, test } from './fixtures.js';

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [390, 1440]) {
    test(`reads a problem before metadata without JS at ${String(width)} px in ${colorScheme}`, async ({
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
      await page.goto('./problems/abc391-f/');
      await expect(page.locator('.problem-summary')).toContainText('各列を降順sort');
      await expect(page.locator('.problem-summary')).toBeInViewport();
      await expect(page.locator('#考察')).toBeVisible();
      await expect(page.locator('#problem-context')).not.toHaveAttribute('open', '');
      await expect(page.getByText('掲載状態: 収録済み')).not.toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.locator('#explanation math').first()).toBeVisible();
      await expect(page.locator('#正当性')).toBeVisible();
      await expect(page.locator('#計算量と制約')).toBeVisible();
      await expect(
        page.locator('#出典').locator('xpath=following-sibling::ul[1]').getByRole('link'),
      ).toHaveCount(2);
      if (process.env.PROBLEM_READING_CAPTURE === '1') {
        const dir = 'docs/operations/problem-reading';
        await mkdir(dir, { recursive: true });
        await page.screenshot({ path: `${dir}/after-${String(width)}-${colorScheme}.png` });
      }
      await page
        .getByRole('navigation', { name: '問題の学習' })
        .getByRole('link', { name: '分類と前提' })
        .click();
      const toggle = page.locator('#problem-context > summary');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#problem-context')).toHaveAttribute('open', '');
      await expect(page.getByText('掲載状態: 収録済み')).toBeVisible();
      await expect(page.locator('#学習の位置')).toBeVisible();
      await expect(page.getByText('既習技能', { exact: true })).toBeVisible();
      await expect(page.getByText(/revision 1/u)).toBeVisible();
      await page.goto('./problems/abc391-f/#学習の位置');
      await expect(page.locator('#学習の位置')).toBeInViewport();
      await page.goto('./problems/abc391-f/#explanation');
      await expect(page.locator('#考察')).toBeInViewport();
      await page
        .getByRole('navigation', { name: '問題の学習' })
        .getByRole('link', { name: '学習記録' })
        .click();
      await expect(page.locator('#learning-record-heading')).toBeInViewport();
      await expect(page.locator('.problem-record noscript')).toBeVisible();
      expect(
        await page.locator('.problem-record noscript').evaluate((node) => node.textContent),
      ).toContain('JavaScriptが必要');
      await context.close();
    });
  }
}

test('uses the shared layout and record controls on other Problem IDs', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const id of ['abc213-g', 'abc466-g']) {
    await page.goto(`./problems/${id}/`);
    await expect(page.locator('.problem-summary')).toBeVisible();
    await expect(page.locator('.problem-reading-links')).toContainText('完全解説');
    await page
      .getByRole('navigation', { name: '問題の学習' })
      .getByRole('link', { name: '学習記録' })
      .click();
    await expect(page.locator('#learning-record-heading')).toBeInViewport();
    await expect(page.getByLabel('学習状況')).toBeEnabled();
    await page.getByLabel('学習状況').selectOption('completed');
    await expect(page.getByRole('status')).toHaveText('進捗を保存しました。');
    await page.getByLabel('要復習', { exact: true }).check();
    await expect(page.getByRole('status')).toHaveText('復習設定を保存しました。');
    await page.reload();
    await expect(page.getByLabel('学習状況')).toHaveValue('completed');
    await expect(page.getByLabel('要復習', { exact: true })).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('keeps algorithm-summary notation as text rather than accidental links', async ({ page }) => {
  await page.goto('./problems/abc321-g/');
  await expect(page.locator('.problem-summary')).toContainText('g[S](M-m)!/M!');
  await expect(page.locator('.problem-summary a')).toHaveCount(0);
});

for (const kind of ['similar', 'supplement'] as const) {
  test(`unpublished ${kind} body explains its scope and links to the full explanation without JS`, async ({
    browser,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required.');
    const base = new URL(baseURL).pathname;
    const manuscript = `---\nauthoringUnit: {"kind":"${kind}","primaryProblemId":"abc391-f"}\n---\n\n## 差分\n\n未掲載の表示fixture。実問題の分類を表さない。\n\n## 実装上の注意\n\n同じ値の別状態を区別する。`;
    const reading = splitProblemContext(await renderPublicDocument(manuscript, base));
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.route('**/problems/abc213-g/', async (route) => {
      const response = await route.fetch();
      const $ = load(await response.text());
      $('#explanation .authored-content').html(reading.body);
      // This fixture exercises abbreviated prose in the common page shell; no catalog is changed.
      $('.problem-summary').remove();
      $('.problem-reading-links > span').text(kind === 'similar' ? '差分解説' : '補足解説');
      await route.fulfill({ response, body: $.html() });
    });
    await page.goto('./problems/abc213-g/#explanation');
    const reference = page.locator('#explanation .authored-content a').first();
    await expect(reference).toHaveAttribute('href', `${base}problems/abc391-f/`);
    await expect(page.locator('#explanation .authored-content p').first()).toContainText(
      kind === 'similar' ? '変わる点' : '追加する要素',
    );
    await reference.focus();
    await expect(reference).toBeFocused();
    await reference.click();
    await expect(page).toHaveURL(/\/problems\/abc391-f\/$/u);
    await page.goBack();
    await expect(page.locator('#差分')).toBeVisible();
    await context.close();
  });
}
