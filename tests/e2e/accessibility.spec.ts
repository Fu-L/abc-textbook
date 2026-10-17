import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './fixtures.js';

function luminance(color: string) {
  const channels = color.match(/\d+/gu)?.slice(0, 3).map(Number);
  if (channels?.length !== 3) throw new Error(`Unexpected color: ${color}`);
  return channels.reduce((sum, channel, index) => {
    const value = channel / 255;
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return sum + linear * ([0.2126, 0.7152, 0.0722][index] ?? 0);
  }, 0);
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05);
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`applies readable Japanese prose and contrasting colors without JS in ${colorScheme}`, async ({
    browser,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required.');
    const context = await browser.newContext({
      baseURL,
      colorScheme,
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    await page.goto('./problems/abc391-f/');
    const styles = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const paragraph = document.querySelector('.authored-content p');
      const link = document.querySelector('.authored-content a:not(.heading-link)');
      const note = document.querySelector('.breadcrumbs');
      if (!paragraph || !link || !note) throw new Error('Missing published prose');
      const text = getComputedStyle(paragraph);
      return {
        size: parseFloat(text.fontSize),
        leading: parseFloat(text.lineHeight) / parseFloat(text.fontSize),
        font: text.fontFamily,
        width: paragraph.getBoundingClientRect().width,
        background: body.backgroundColor,
        text: text.color,
        link: getComputedStyle(link).color,
        underline: getComputedStyle(link).textDecorationLine,
        note: getComputedStyle(note).color,
      };
    });
    expect(styles.size).toBeGreaterThanOrEqual(16);
    expect(styles.size).toBeLessThanOrEqual(18);
    expect(styles.leading).toBeGreaterThanOrEqual(1.7);
    expect(styles.leading).toBeLessThanOrEqual(1.9);
    expect(styles.font).toContain('system-ui');
    expect(styles.width / styles.size).toBeLessThanOrEqual(44);
    expect(styles.text).not.toBe(styles.link);
    expect(styles.text).not.toBe(styles.note);
    expect(styles.underline).toContain('underline');
    if (colorScheme === 'dark') expect(luminance(styles.background)).toBeLessThan(0.2);
    else expect(luminance(styles.background)).toBeGreaterThan(0.5);
    for (const color of [styles.text, styles.link, styles.note]) {
      expect(contrast(color, styles.background)).toBeGreaterThanOrEqual(4.5);
    }
    await expect(page.locator('#考察')).toBeAttached();
    await expect(page.locator('main a[rel="external"]').first()).toBeVisible();
    await context.close();
  });
}

for (const width of [320, 390, 720]) {
  test(`reflows textbook prose and navigation at ${String(width)} CSS px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      './',
      './learn/query/priority-queue-best-first/',
      './learn/query/range-monoid-aggregation/',
      './problems/abc391-f/',
      './problems/abc251-f/',
      './contests/abc212/',
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        route,
      ).toBe(true);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
}

test('gives prose headings, quotations, lists, and tables a readable hierarchy', async ({
  page,
}) => {
  await page.goto('./problems/abc391-f/');
  // Exercise shared prose elements that are not all present on this representative page.
  await page.locator('.authored-content').evaluate((element) => {
    element.innerHTML = `<h2>節</h2><p>段落の本文です。</p><p>次の段落です。</p>
      <h3>項</h3><ul><li>一つ目</li><li>二つ目<ul><li>補足</li></ul></li></ul>
      <h4>小項</h4><blockquote><p>出典からの引用です。</p></blockquote><hr>
      <table><caption>比較</caption><tr><th>手法</th><th>条件</th></tr>
      <tr><td>累積和</td><td>静的な区間和</td></tr></table>`;
  });
  const metrics = await page.locator('main').evaluate((main) => {
    const style = (selector: string) => {
      const element = main.querySelector(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      return getComputedStyle(element);
    };
    return {
      headings: ['h1', 'h2', 'h3', 'h4'].map((selector) => parseFloat(style(selector).fontSize)),
      headingBefore: parseFloat(style('.authored-content h2').marginBlockStart),
      headingAfter: parseFloat(style('.authored-content h2').marginBlockEnd),
      paragraphGap: parseFloat(style('.authored-content p').marginBlockEnd),
      listIndent: parseFloat(style('.authored-content ul').paddingInlineStart),
      quoteBorder: parseFloat(style('blockquote').borderInlineStartWidth),
      ruleBorder: parseFloat(style('hr').borderBlockStartWidth),
      cellPadding: parseFloat(style('td').paddingInlineStart),
    };
  });
  for (let index = 1; index < metrics.headings.length; index++) {
    expect(metrics.headings[index - 1]).toBeGreaterThan(metrics.headings[index] ?? 0);
  }
  expect(metrics.headingBefore).toBeGreaterThan(metrics.headingAfter);
  for (const value of [
    metrics.paragraphGap,
    metrics.listIndent,
    metrics.quoteBorder,
    metrics.ruleBorder,
    metrics.cellPadding,
  ]) {
    expect(value).toBeGreaterThan(0);
  }
});

test('exposes landmarks, headings, table headers, names, text states, and keyboard focus', async ({
  page,
}) => {
  // The full matrix's 868 cells are covered by the structural/route checks.
  // Audit the same shared table and cell components on a representative contest.
  await page.goto('./contests/abc212/');

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'パンくず' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('rowheader').first()).toBeVisible();
  await expect(page.getByText('収録済み').first()).toBeVisible();
  await expect(page.getByRole('button', { name: '検索' })).toBeEnabled();

  await page.keyboard.press('Tab');
  await expect(page.locator(':focus-visible')).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('keeps core content and navigation available without JavaScript', async ({
  baseURL,
  browser,
}) => {
  if (!baseURL) throw new Error('Playwright baseURL is required.');
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /コンテスト/u }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '検索' })).toBeDisabled();
  await context.close();
});
