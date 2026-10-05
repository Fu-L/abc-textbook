import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.js';

test('keeps the mathematical and grammar notation readable in published explanations', async ({
  page,
}) => {
  for (const [id, notation] of [
    ['abc217-h', 'f(x)=m+Σ_{l∈L}(l−x)_++Σ_{r∈R}(x−r)_+'],
    ['abc236-g', '(P⊗Q)_{ij}=min_k max(P_{ik},Q_{kj})'],
    ['abc403-f', '最短の任意の <expr> と最短の乗算可能な <term> を別状態にする'],
    ['abc363-f', 'x*middle*rev(x)'],
  ] as const) {
    await page.goto(`./problems/${id}/`);
    await expect(
      page.locator('.authored-content').getByText(notation, { exact: false }).first(),
    ).toBeVisible();
  }
});

test('connects unknown-problem recall cues to the actual slope-trick learning outcome', async ({
  page,
}) => {
  await page.goto('./tags/tag-slope-trick/');
  const main = page.locator('main');
  for (const cue of ['絶対値costを順次追加', '傾き単調', '左右heap balance', '最適解復元'])
    await expect(main.getByText(cue, { exact: true })).toBeVisible();
  await expect(
    main.getByText(
      '区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(main.getByRole('link', { name: 'slope trickで学ぶ', exact: true })).toHaveAttribute(
    'href',
    /\/learn\/geometry-optimization\/slope-trick\//u,
  );
});

test('serves a non-preview Problem with accepted reasoning and the shared record control', async ({
  page,
}) => {
  await page.goto('./problems/abc466-g/');
  await expect(page.getByRole('heading', { name: '考察', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '正当性', exact: true })).toBeVisible();
  await expect(page.getByText('掲載状態: 収録済み')).toBeVisible();
  await expect(page.getByLabel('学習状況')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('keeps the complete sidebar, semantic links, and prose accessible at a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('./learn/combinatorics-algebra/xor-linear-basis/');
  const navigation = page.getByRole('navigation', { name: '教科書の目次' });
  await expect(navigation.getByRole('link', { includeHidden: true })).toHaveCount(232);
  await expect(
    page
      .locator('main')
      .getByText(/概念上の親:/u)
      .first(),
  ).toBeVisible();
  await expect(page.locator('a[rel="prev"], a[rel="next"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
