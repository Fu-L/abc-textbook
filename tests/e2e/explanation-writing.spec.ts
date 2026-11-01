import { mkdir } from 'node:fs/promises';
import { load } from 'cheerio';

import { generateWritingExamples } from '../fixtures/authoring-skill/writing-examples/generate.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { splitProblemContext } from '../../src/components/problem-reading.js';
import { documentHeadings } from '../../src/components/document-contents.js';
import { expect, test } from './fixtures.js';

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of [320, 390, 720, 1440]) {
    test(`reads new full and similar writing at ${String(width)} px in ${colorScheme} without JS`, async ({
      browser,
      baseURL,
    }) => {
      if (!baseURL) throw new Error('Missing baseURL');
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled: false,
        colorScheme,
        viewport: { width, height: width < 720 ? 844 : 1000 },
      });
      const page = await context.newPage();
      const base = new URL(baseURL).pathname;
      for (const { unit, document: manuscript } of await generateWritingExamples()) {
        // Exercise generated documents in the published shared shell. No fixture is indexed.
        const routePath = `${base}problems/${unit.problemId}/`;
        const reading = splitProblemContext(await renderPublicDocument(manuscript, base));
        const capture =
          process.env.EXPLANATION_WRITING_CAPTURE === '1' &&
          [390, 1440].includes(width) &&
          colorScheme === 'light';
        const captureDir = 'docs/operations/explanation-writing';
        if (capture) {
          await mkdir(captureDir, { recursive: true });
          if (unit.kind === 'full') {
            await page.goto('./problems/abc391-f/');
            await page.screenshot({ path: `${captureDir}/before-${String(width)}.png` });
          }
        }
        await context.route(`**${routePath}`, async (route) => {
          const response = await route.fetch({
            url: new URL(`${base}problems/abc391-f/`, baseURL).href,
          });
          const $ = load(await response.text());
          $('h1').text(unit.kind === 'full' ? 'ABC391 F — 執筆例' : 'ABC123 D — 差分の執筆例');
          $('[aria-current="page"]').text(unit.problemId.toUpperCase());
          $('.problem-reading-links > span').text(unit.kind === 'full' ? '完全解説' : '差分解説');
          $('.problem-reading-links a[rel="external"]').attr(
            'href',
            `https://atcoder.jp/contests/${unit.problemId.slice(0, unit.problemId.indexOf('-'))}/tasks/${unit.problemId.replace('-', '_')}`,
          );
          $('#explanation .authored-content').html(reading.body);
          $('#problem-context')
            .empty()
            .append('<summary>分類・前提・執筆情報</summary>')
            .append($('<div>').addClass('problem-learning-position').html(reading.context));
          // The production ToC derives its links from the final rendered headings too.
          const items = documentHeadings(reading.body).map(({ id, label }) => {
            const li = $('<li>');
            li.append(
              $('<a>')
                .attr('href', `#${encodeURIComponent(id)}`)
                .text(label),
            );
            return li;
          });
          $('#page-contents ol')
            .empty()
            .append(...items);
          await route.fulfill({ response, body: $.html() });
        });
        await page.goto(routePath);
        const article = page.locator('#explanation .authored-content');
        await expect(article.locator('h2').first()).toHaveAttribute(
          'id',
          unit.kind === 'full' ? '考察' : '差分',
        );
        await expect(article.locator('math').first()).toBeVisible();
        await expect(article).toContainText(unit.kind === 'full' ? '以前の候補29' : '復習では');
        if (unit.kind === 'full') {
          await expect(
            article.getByRole('heading', {
              name: '値の単調性と、同じ状態への合流を確かめる',
              exact: true,
            }),
          ).toBeVisible();
          // The constraint-changing counterexample must render its negative operand as math.
          await expect(article.locator('math').filter({ hasText: '−3' })).toBeVisible();
          await expect(article).toContainText('値が−7から−5へ増える');
        }
        await expect(article.locator('#出典 + ul a')).toHaveCount(unit.sourceRevisionIds.length);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        if (capture)
          await page.screenshot({ path: `${captureDir}/${unit.kind}-${String(width)}.png` });
        const contents = page.locator('#page-contents');
        await contents.locator('summary').focus();
        await page.keyboard.press('Enter');
        await contents
          .getByRole('link', { name: unit.kind === 'full' ? '正当性' : '差分', exact: true })
          .click();
        await expect(page.locator(unit.kind === 'full' ? '#正当性' : '#差分')).toBeInViewport();
        if (unit.kind === 'similar') {
          await article.locator('a').first().focus();
          await page.keyboard.press('Enter');
          await expect(page).toHaveURL(/\/problems\/abc391-f\/$/u);
          await expect(page.locator('#正当性')).toBeVisible();
        }
        await context.unroute(`**${routePath}`);
      }
      await context.close();
    });
  }
}
