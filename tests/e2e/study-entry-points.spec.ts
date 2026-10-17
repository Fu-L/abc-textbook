import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { unitLearningTarget } from '../../src/lib/taxonomy/unit-learning-targets.js';
import { expect, test } from './fixtures.js';

test('home offers three study paths and reaches saved review problems', async ({ page }) => {
  await page.goto('./');
  const choices = page.getByRole('navigation', { name: '学び方を選ぶ' });
  await expect(choices.getByRole('link')).toHaveText(['体系的に学ぶ', '問題から学ぶ', '復習する']);
  for (const [choice, heading] of [
    ['体系的に学ぶ', '分野別目次'],
    ['問題から学ぶ', '問題一覧'],
    ['復習する', '要復習'],
  ] as const) {
    await choices.getByRole('link', { name: choice, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();
    await page.goBack();
  }
  await page.goto('./problems/abc391-f/');
  await page.getByLabel('要復習', { exact: true }).check();
  await expect(page.getByRole('status')).toHaveText('復習設定を保存しました。');
  await page.goto('./');
  await choices.getByRole('link', { name: '復習する', exact: true }).click();
  await page
    .locator('main')
    .getByRole('link', { name: /ABC391-F/u })
    .click();
  await expect(page.getByLabel('要復習', { exact: true })).toBeChecked();
});

test('contents preserves every chapter anchor and all Unit links in reading order', async ({
  page,
}) => {
  await page.goto('./learn/');
  const jump = page.getByRole('navigation', { name: '章へ移動' });
  await expect(jump.getByRole('link')).toHaveCount(TEXTBOOK_CHAPTERS.length);
  for (const [index, chapter] of TEXTBOOK_CHAPTERS.entries()) {
    const section = page.locator(`main section[id="${chapter.id}"]`);
    await jump.getByRole('link').nth(index).click();
    await expect(section.getByRole('heading', { level: 2 })).toBeInViewport();
    const links = section.locator('.unit-index > li > a');
    await expect(links).toHaveCount(chapter.unitIds.length);
    const ids = await links.evaluateAll((elements) =>
      elements.map((element) => {
        const href = element.getAttribute('href');
        return href?.split('/').filter(Boolean).at(-1);
      }),
    );
    const expected = await Promise.all(
      chapter.unitIds.map(async (id) => {
        const unit = JSON.parse(
          await readFile(`src/content/learning-units/${id}.json`, 'utf8'),
        ) as { docPath: string };
        return unit.docPath.split('/').at(-1)?.replace(/\.md$/u, '');
      }),
    );
    expect(ids).toEqual(expected);
    const context = section.locator('.chapter-context');
    await expect(context).not.toHaveAttribute('open', '');
    await context.locator('summary').click();
    await expect(context.getByText(chapter.introduction, { exact: true })).toBeVisible();
    for (const id of chapter.unitIds) {
      await expect(
        context.getByText(unitLearningTarget(id).reason, { exact: true }),
      ).toBeAttached();
    }
  }
  await page.goto('./learn/');
  await page.getByRole('link', { name: '第1章の最初の単元', exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/modeling\/bounded-enumeration\/$/u);
  await expect(page.getByRole('link', { name: '問題へ進む', exact: true })).toBeVisible();
});

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [390, 720, 1440]) {
    test(`study entries and details work without JS at ${String(width)} px in ${colorScheme}`, async ({
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
      await page.goto('./');
      const choices = page.getByRole('navigation', { name: '学び方を選ぶ' });
      await expect(choices.getByRole('link')).toHaveCount(3);
      const details = page.locator('.collection-details');
      await expect(details).not.toHaveAttribute('open', '');
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(details.getByText(/868問/u)).toBeVisible();
      await expect(details.getByText(/2026年7月12日0時/u)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await choices.getByRole('link', { name: '体系的に学ぶ', exact: true }).click();
      const jump = page.getByRole('navigation', { name: '章へ移動' });
      await jump.getByRole('link').nth(1).click();
      const section = page.locator('#unit-chapter-query');
      await expect(section.getByRole('heading', { level: 2 })).toBeInViewport();
      const summary = section.locator('.chapter-context > summary');
      await summary.focus();
      await page.keyboard.press('Space');
      await expect(section.getByText(/概念上の親:/u).first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const link = section.locator('.unit-index > li > a').nth(3);
      await link.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/learn\/query\/priority-queue-best-first\/$/u);
      await context.close();
    });
  }
}

test('home and chapter contents expose accessible navigation', async ({ page }) => {
  for (const route of ['./', './learn/']) {
    await page.goto(route);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});
