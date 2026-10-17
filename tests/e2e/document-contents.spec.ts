import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.js';

const problem = './problems/abc391-f/';
const unit = './learn/query/range-monoid-aggregation/';
const contents = 'このページの目次';

for (const javaScriptEnabled of [true, false]) {
  for (const [width, colorScheme] of [
    [1440, 'light'],
    [390, 'dark'],
  ] as const) {
    test(`native page contents: JS ${String(javaScriptEnabled)}, ${String(width)} px, ${colorScheme}`, async ({
      browser,
      baseURL,
    }) => {
      if (!baseURL) throw new Error('Playwright baseURL is required.');
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled,
        viewport: { width, height: 1000 },
        colorScheme,
      });
      const page = await context.newPage();
      await page.goto(problem);
      const panel = page.locator('#page-contents');
      if (javaScriptEnabled && width === 1440) await expect(panel).toHaveAttribute('open', '');
      else {
        await expect(panel).not.toHaveAttribute('open', '');
        await panel.locator('summary').focus();
        await page.keyboard.press('Enter');
      }
      const menu = page.getByRole('navigation', { name: contents });
      await expect(menu.getByRole('link')).toHaveCount(13);
      await expect(menu).not.toContainText('学習の位置');
      const proof = menu.getByRole('link', { name: '正当性', exact: true });
      await proof.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#正当性')).toBeInViewport();
      await expect(page.locator('#正当性')).toBeFocused();
      await page.goBack();
      await expect(page).toHaveURL(/\/abc391-f\/$/u);
      await page.goForward();
      await expect(page.locator('#正当性')).toBeInViewport();
      await page.goto(`${problem}#${encodeURIComponent('復習の核')}`);
      // Reload exercises an incoming fragment URL, independent of the open menu's history state.
      await page.reload();
      await expect(page.locator('#復習の核')).toBeInViewport();
      const permalink = page.locator('#復習の核 .heading-link');
      await permalink.focus();
      await expect(permalink).toBeFocused();
      await expect(permalink).toHaveCSS('opacity', '1');
      await expect(permalink).toHaveAttribute('href', `#${encodeURIComponent('復習の核')}`);
      // The mobile contents stays within reach even after a deep fragment jump.
      if (javaScriptEnabled && width === 390)
        await expect(panel.locator('summary')).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );

      await page.goto(unit);
      if (!(javaScriptEnabled && width === 1440)) {
        await page.locator('#page-contents > summary').focus();
        await page.keyboard.press('Space');
      }
      const sections = page.getByRole('navigation', { name: contents });
      await expect(sections.getByRole('link', { name: '問題一覧', exact: true })).toBeVisible();
      await expect(sections).not.toContainText('前提と範囲');
      await sections.getByRole('link', { name: '問題一覧', exact: true }).click();
      await expect(page.locator('#問題一覧')).toBeInViewport();
      if (javaScriptEnabled || width === 1440)
        await expect(page.locator('#page-contents > summary')).toBeInViewport();
      // Existing fragments inside native details continue to reveal their original section.
      await page.goto(`${unit}#${encodeURIComponent('前提と範囲')}`);
      await expect(page.locator('#前提と範囲')).toBeInViewport();
      await context.close();
    });
  }
}

test('mobile page contents can be reopened from deep prose and closed by keyboard', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${problem}#${encodeURIComponent('復習の核')}`);
  const toggle = page.locator('#page-contents > summary');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await page
    .getByRole('navigation', { name: contents })
    .getByRole('link', { name: '考察', exact: true })
    .click();
  await expect(page.locator('#考察')).toBeInViewport();
  await expect(page.locator('#page-contents')).not.toHaveAttribute('open', '');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#page-contents')).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('#page-contents')).not.toHaveAttribute('open', '');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('#page-contents')).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 720, height: 500 });
  await expect(page.locator('#page-contents')).not.toHaveAttribute('open', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const width of [320, 390, 720]) {
  test(`touch opens page contents within the viewport from deep prose: ${String(width)} px`, async ({
    browser,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required.');
    const context = await browser.newContext({
      baseURL,
      viewport: { width, height: width === 720 ? 500 : 844 },
      hasTouch: true,
    });
    const page = await context.newPage();
    for (const [route, section, destination] of [
      [problem, '復習の核', '考察'],
      [unit, '問題一覧', '考え方'],
    ] as const) {
      await page.goto(`${route}#${encodeURIComponent(section)}`);
      await expect(page.locator(`[id="${section}"]`)).toBeInViewport();
      const toggle = page.locator('#page-contents > summary');
      await expect(toggle).toBeInViewport();
      const bounds = await toggle.boundingBox();
      if (!bounds) throw new Error('Missing page contents summary');
      // Tap the actual on-screen control without Playwright scrolling it into view.
      await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      const menu = page.getByRole('navigation', { name: contents });
      await expect(page.locator('#page-contents')).toHaveAttribute('open', '');
      // Check before any link action: click()/focus() would hide a regression by scrolling.
      await expect(menu).toBeInViewport({ ratio: 1 });
      const menuBounds = await menu.boundingBox();
      if (!menuBounds) throw new Error('Missing page contents menu');
      expect(menuBounds.y).toBeGreaterThanOrEqual(0);
      expect(menuBounds.y + menuBounds.height).toBeLessThanOrEqual(width === 720 ? 500 : 844);
      const link = menu.getByRole('link', { name: destination, exact: true });
      await expect(link).toBeInViewport({ ratio: 1 });
      await link.tap();
      await expect(page.locator('#page-contents')).not.toHaveAttribute('open', '');
      await expect(page.locator(`[id="${destination}"]`)).toBeInViewport();
    }
    await context.close();
  });

  test(`without JS the page contents stays in document flow: ${String(width)} px`, async ({
    browser,
    baseURL,
  }) => {
    if (!baseURL) throw new Error('Playwright baseURL is required.');
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width, height: width === 720 ? 500 : 844 },
    });
    const page = await context.newPage();
    await page.goto(problem);
    const panel = page.locator('#page-contents');
    await expect(page.locator('.page-contents')).toHaveCSS('position', 'static');
    await panel.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(panel).toHaveAttribute('open', '');
    await page
      .getByRole('navigation', { name: contents })
      .getByRole('link', {
        name: '復習の核',
        exact: true,
      })
      .focus();
    await page.keyboard.press('Enter');
    const heading = page.locator('#復習の核');
    await expect(heading).toBeInViewport();
    await expect(heading).toBeFocused();
    await expect(panel).toHaveAttribute('open', '');
    await expect(panel).not.toBeInViewport();
    await page.reload();
    await expect(heading).toBeInViewport();
    await expect(panel).not.toBeInViewport();
    await context.close();
  });
}

test('contents and heading links have accessible names and do not obscure focused prose', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(problem);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const width of [1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(unit);
    await expect(
      page.getByRole('complementary', { name: '章と単元の目次', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('complementary', { name: contents, exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    const prose = await page.locator('.authored-content').boundingBox();
    const menu = await page.locator('.page-contents').boundingBox();
    if (!prose || !menu) throw new Error('Missing prose or page contents');
    expect(menu.x - prose.x - prose.width).toBeGreaterThanOrEqual(16);
    expect(menu.x - prose.x - prose.width).toBeLessThanOrEqual(48);
    expect(prose.width).toBeLessThanOrEqual(704);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${problem}#${encodeURIComponent('計算量と制約')}`);
  const heading = page.locator('#計算量と制約');
  const link = heading.locator('.heading-link');
  await link.focus();
  const bounds = await heading.boundingBox();
  const menu = await page.locator('.page-contents').boundingBox();
  expect(bounds?.y).toBeGreaterThanOrEqual((menu?.y ?? 0) + (menu?.height ?? 0));
});
