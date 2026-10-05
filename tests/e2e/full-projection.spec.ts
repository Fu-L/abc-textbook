import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures.js';

test('connects the parent DP concept to its representative problems without claiming direct tags', async ({
  page,
}) => {
  await page.goto('./tags/tag-dp-state-transition/');
  const representatives = page
    .locator('main section')
    .filter({ has: page.getByRole('heading', { name: '代表問題', exact: true }) });
  for (const id of ['abc375-e', 'abc253-e', 'abc391-g']) {
    await expect(representatives.locator(`a[href$="/problems/${id}/"]`)).toBeVisible();
  }
  const related = page
    .locator('main section')
    .filter({ has: page.getByRole('heading', { name: '関連問題', exact: true }) });
  await expect(related.locator('li a')).toHaveCount(0);
});

for (const { unit, problemId, count } of [
  { unit: 'unit-change-impact-localization', problemId: 'abc218-f', count: 2 },
  { unit: 'unit-persistence-rollback', problemId: 'abc218-g', count: 5 },
  { unit: 'unit-chapter-graph', problemId: 'abc218-e', count: 127 },
]) {
  test(`keeps covered problems and review records when filtering by ${unit}`, async ({ page }) => {
    await page.goto(`./problems/${problemId}/`);
    const control = page.locator(`[data-learning-record-control="${problemId}"]`);
    await control.getByLabel('要復習').check();
    await expect(control.getByText('復習設定を保存しました。')).toBeVisible();

    await page.goto('./problems/');
    await expect(page.getByText('学習状態はこの端末内だけで絞り込みます。')).toBeVisible();
    await page.getByLabel('学習単位').selectOption(unit);
    await page.getByRole('button', { name: '適用', exact: true }).click();
    await expect(page.locator('main [aria-live="polite"]')).toHaveText(
      `${String(count)}件の問題が該当します。`,
    );
    await expect(page.locator(`main li a[href$="/problems/${problemId}/"]`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`\\?unit=${unit}$`, 'u'));
    await page.reload();
    await expect(page.getByLabel('学習単位')).toHaveValue(unit);
    await expect(page.locator('main [aria-live="polite"]')).toHaveText(
      `${String(count)}件の問題が該当します。`,
    );

    await page.goto('./review/');
    await expect(page.getByRole('status')).toHaveText(
      '復習対象は端末内の記録だけから表示しています。',
    );
    await page.getByLabel('学習単位').selectOption('unit-xor-linear-basis');
    await expect(page.locator('main [aria-live="polite"]')).toHaveText('0件の復習対象');
    await page.getByLabel('学習単位').selectOption(unit);
    await expect(page.locator('main [aria-live="polite"]')).toHaveText('1件の復習対象');
    await expect(page.locator(`main li a[href$="/problems/${problemId}/"]`)).toBeVisible();
    await page.getByLabel('コンテスト').selectOption('abc212');
    await expect(page.locator('main [aria-live="polite"]')).toHaveText('0件の復習対象');
  });
}

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
