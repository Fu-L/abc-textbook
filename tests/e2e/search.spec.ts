import { expect, test } from './fixtures.js';

test('indexes entity kind, aliases, hierarchy, and contest terms on canonical routes', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('button', { name: '検索' }).click();
  const dialog = page.getByRole('dialog', { name: '検索' });
  const input = dialog.locator('.pagefind-ui__search-input');
  const status = dialog.locator('[data-search-status]');
  const cases = [
    { term: 'Power Pair', kind: '問題', href: '/problems/abc212-g/' },
    {
      term: 'graph-search',
      kind: '典型タグ',
      href: '/tags/provisional-tag-shortest-path-structure/',
    },
    {
      term: 'グラフ・探索',
      kind: '学習単位',
      href: '/learn/provisional-unit-shortest-path-structure/',
    },
    { term: 'ABC 212', kind: 'コンテスト索引', href: '/contests/' },
  ] as const;

  for (const { term, kind, href } of cases) {
    await input.fill(term);
    await expect(status).toHaveText(/\d+件の候補があります。/u);
    const result = dialog.locator(`.pagefind-ui__result-link[href$="${href}"]`).first();
    await expect(result).toBeVisible();
    await expect(result).toContainText(`${kind}:`);
  }

  // A slower previous query must never overwrite the newest query's result set.
  await input.fill('Power Pair');
  await input.fill('graph-search');
  await expect(status).toHaveText(/\d+件の候補があります。/u);
  await expect(
    dialog.locator(
      '.pagefind-ui__result-link[href$="/tags/provisional-tag-shortest-path-structure/"]',
    ),
  ).toBeVisible();
  await expect(
    dialog.locator('.pagefind-ui__result-link[href$="/problems/abc212-g/"]'),
  ).toHaveCount(0);
});

test('shows zero-result guidance and excludes controls, staging, and local state', async ({
  page,
}) => {
  await page.goto('./problems/');
  const search = page.getByRole('search', { name: '問題を絞り込む' });
  await search.getByLabel('問題名').fill('存在しない問題名');
  await search.getByRole('button', { name: '適用' }).click();
  await expect(page.getByText(/0件.*条件を変更/u)).toBeVisible();

  await page.getByRole('button', { name: '検索' }).click();
  const dialog = page.getByRole('dialog', { name: '検索' });
  const input = dialog.locator('.pagefind-ui__search-input');
  const status = dialog.locator('[data-search-status]');
  for (const excluded of ['ABC212_E', 'staging/', 'needsReview', 'statusUpdatedAt']) {
    await input.fill(excluded);
    await expect(status).toContainText('一致する公開ページはありません。');
    await expect(dialog.locator('.pagefind-ui__result-link')).toHaveCount(0);
  }

  const catalog = await page.request.get('./data/catalog.json');
  expect(catalog.ok()).toBe(true);
  const payload = (await catalog.json()) as { schemaVersion?: string };
  expect(payload.schemaVersion).toBe('3.0.0');
});

test('keeps canonical LearningUnit skeletons unpublished until the T160 switch', async ({
  page,
}) => {
  const response = await page.request.get('./learn/number-theory/dynamic-modular-product/');
  expect(response.status()).toBe(404);
});
