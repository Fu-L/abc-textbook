import { mkdir } from 'node:fs/promises';
import { load } from 'cheerio';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { previewProblem } from '../../src/lib/study-preview/render.js';
import { expect, test } from './fixtures.js';

const preview = process.env.STUDY_UX_PREVIEW === '1';
const phase = preview ? 'after' : 'before';
const capture = process.env.STUDY_UX_CAPTURE === '1';
const captureDir = 'build/study-ux-prototype';
const samples = [
  {
    name: 'unit-desktop-light',
    route: './learn/query/priority-queue-best-first/',
    width: 1440,
    height: 1000,
    colorScheme: 'light',
    anchor: '',
  },
  {
    name: 'unit-mobile-light',
    route: './learn/query/priority-queue-best-first/',
    width: 390,
    height: 844,
    colorScheme: 'light',
    anchor: '',
  },
  {
    name: 'concept-mobile-light',
    route: './learn/query/priority-queue-best-first/',
    width: 390,
    height: 844,
    colorScheme: 'light',
    anchor: '#考え方',
  },
  {
    name: 'monoid-concept-mobile-dark',
    route: './learn/query/range-monoid-aggregation/',
    width: 390,
    height: 844,
    colorScheme: 'dark',
    anchor: '#考え方',
  },
  {
    name: 'long-unit-mobile-dark',
    route: './learn/query/range-monoid-aggregation/',
    width: 390,
    height: 844,
    colorScheme: 'dark',
    anchor: '#問題一覧',
  },
  {
    name: 'problem-desktop-light',
    route: './problems/abc391-f/',
    width: 1440,
    height: 1000,
    colorScheme: 'light',
    anchor: '',
  },
  {
    name: 'problem-mobile-light',
    route: './problems/abc391-f/',
    width: 390,
    height: 844,
    colorScheme: 'light',
    anchor: '',
  },
  {
    name: 'proof-mobile-light',
    route: './problems/abc391-f/',
    width: 390,
    height: 844,
    colorScheme: 'light',
    anchor: '#正当性',
  },
  {
    name: 'math-desktop-dark',
    route: './problems/abc213-g/',
    width: 1440,
    height: 1000,
    colorScheme: 'dark',
    anchor: '#計算量と制約',
  },
] as const;

for (const sample of samples) {
  test(`${phase}: ${sample.name} is readable without JS`, async ({ browser, baseURL }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required.');
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
      colorScheme: sample.colorScheme,
      viewport: { width: sample.width, height: sample.height },
    });
    const page = await context.newPage();
    await page.goto(sample.route);
    await expect(page.locator('.preview-notice')).toHaveCount(preview ? 1 : 0);
    await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(
      preview ? 1 : 0,
    );
    await expect(page.locator('main[data-pagefind-body]')).toHaveCount(preview ? 0 : 1);
    if (sample.anchor) {
      await page.locator(sample.anchor).evaluate((element) => {
        scrollTo(0, element.getBoundingClientRect().top + scrollY - 32);
      });
    }
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (preview && !sample.anchor) {
      const title = await page.locator('main h1').boundingBox();
      expect(title?.y).toBeLessThan(sample.height);
      await expect(page.locator('.authored-content p').first()).toBeVisible();
    }
    if (capture) {
      await mkdir(captureDir, { recursive: true });
      await page.screenshot({ path: `${captureDir}/${phase}-${sample.name}.png` });
    }
    await context.close();
  });
}

test('prototype supports fragment links, keyboard disclosure and a compact problem list', async ({
  page,
}) => {
  test.skip(!preview, 'Opt-in prototype build required.');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./learn/query/range-monoid-aggregation/');
  const compact = page.locator('#問題一覧 + ul');
  await expect(compact.locator('li')).toHaveCount(16);
  const detail = compact.locator(':scope > li > details').first();
  const summary = detail.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(detail).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(detail).not.toHaveAttribute('open', '');
  // Existing fragment URLs must open the preserved, collapsed source sections too.
  await page.goto('./learn/query/range-monoid-aggregation/#前提と範囲');
  await expect(page.locator('#前提と範囲')).toBeVisible();
  await page.goto('./problems/abc391-f/');
  await page.locator('#page-contents > summary').click();
  await page
    .getByRole('navigation', { name: 'このページの目次' })
    .getByRole('link', { name: '正当性', exact: true })
    .click();
  await expect(page.locator('#正当性')).toBeInViewport();
  await page
    .locator('.problem-reading-links')
    .getByRole('link', { name: '学習記録', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: '学習記録', exact: true })).toBeInViewport();
  await expect(page.getByLabel('学習状況')).toBeEnabled();
  await page.getByLabel('学習状況').selectOption('completed');
  await expect(page.getByRole('status')).toHaveText('進捗を保存しました。');
  await page.getByLabel('要復習', { exact: true }).check();
  await expect(page.getByRole('status')).toHaveText('復習設定を保存しました。');
  await page.reload();
  await expect(page.getByLabel('学習状況')).toHaveValue('completed');
  await expect(page.getByLabel('要復習', { exact: true })).toBeChecked();
});

test('unselected pages retain normal reading and search markup', async ({ page }) => {
  await page.goto('./problems/abc251-f/');
  await expect(page.locator('.preview-notice')).toHaveCount(0);
  await expect(page.locator('main[data-pagefind-body]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test(`${phase}: unpublished similar fixture keeps its full explanation within reach`, async ({
  browser,
  baseURL,
}) => {
  const manuscript =
    '---\nauthoringUnit: {"kind":"similar","primaryProblemId":"abc391-f"}\n---\n\n表示確認用fixture（未掲載・分類判断を含まない）\n\n## 主要解説との差分\n\nここでは差分形式の導線のみ確認する。共通する着想・正当性は参照元の完全解説を先に読む。\n\n## 実装上の注意\n\n実問題の差分や学習効果は評価していない。';
  if (!baseURL) throw new Error('Playwright baseURL is required.');
  const base = new URL(baseURL).pathname;
  const rendered = await renderPublicDocument(manuscript, base);
  const body = preview ? await previewProblem(rendered, 'fixture', base) : rendered;
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.route('**/problems/abc213-g/', async (route) => {
    const response = await route.fetch();
    const $ = load(await response.text());
    $('.authored-content').html(body);
    await route.fulfill({ response, body: $.html() });
  });
  await page.goto('./problems/abc213-g/');
  await page.locator('#explanation').evaluate((element) => {
    scrollTo(0, element.getBoundingClientRect().top + scrollY - 32);
  });
  const reference = page.locator('.authored-content a').first();
  await expect(reference).toHaveAttribute('href', `${base}problems/abc391-f/`);
  await reference.focus();
  await expect(reference).toBeFocused();
  if (capture) {
    await mkdir(captureDir, { recursive: true });
    await page.screenshot({ path: `${captureDir}/${phase}-similar-mobile-light.png` });
  }
  await reference.click();
  await expect(page).toHaveURL(/\/problems\/abc391-f\/$/u);
  await page.goBack();
  await expect(page.locator('.authored-content')).toContainText('表示確認用fixture');
  await context.close();
});
