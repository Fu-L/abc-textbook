import { expect, test } from './fixtures.js';

test('keeps search metadata out of the visible tag introduction and in the Pagefind index', async ({
  page,
}) => {
  await page.goto('./tags/tag-slope-trick/');
  const metadata = page.locator('[data-search-projection]');
  await expect(metadata).toContainText('絶対値costを順次追加');
  await expect(metadata).toHaveAttribute('data-pagefind-meta', 'search-terms');
  // A clipped element still has a bounding box, so visibility alone cannot
  // distinguish it from the regression where this text filled several lines.
  const style = await metadata.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      position: computed.position,
      clipPath: computed.clipPath,
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    };
  });
  expect(style).toEqual({ position: 'absolute', clipPath: 'inset(50%)', width: 1, height: 1 });
  await expect(page.getByRole('heading', { level: 1, name: 'slope trick' })).toBeVisible();
  await expect(page.locator('dd').getByText('絶対値costを順次追加', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '検索' }).click();
  const dialog = page.getByRole('dialog', { name: '検索' });
  await dialog.locator('.pagefind-ui__search-input').fill('piecewise-linear convex DP');
  await expect(
    dialog.locator('.pagefind-ui__result-link[href$="/tags/tag-slope-trick/"]').first(),
  ).toBeVisible();
});

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
      term: 'cyclic-group counting',
      kind: '典型タグ',
      href: '/tags/tag-cyclic-exponent-counting/',
    },
    {
      term: '巡回群を指数化して数える',
      kind: '学習単位',
      href: '/learn/number-theory/cyclic-group-exponent-counting/',
    },
    { term: 'ABC 212', kind: 'コンテスト', href: '/contests/abc212/' },
    { term: '絶対値costを順次追加', kind: '典型タグ', href: '/tags/tag-slope-trick/' },
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
  await input.fill('cyclic-group counting');
  await expect(status).toHaveText(/\d+件の候補があります。/u);
  await expect(
    dialog.locator('.pagefind-ui__result-link[href$="/tags/tag-cyclic-exponent-counting/"]'),
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
  for (const excluded of ['ABC999_I', 'staging/', 'needsReview', 'statusUpdatedAt']) {
    await input.fill(excluded);
    await expect(status).toContainText('一致する公開ページはありません。');
    await expect(dialog.locator('.pagefind-ui__result-link')).toHaveCount(0);
  }

  const catalog = await page.request.get('./data/catalog.json');
  expect(catalog.ok()).toBe(true);
  const payload = (await catalog.json()) as { schemaVersion?: string };
  expect(payload.schemaVersion).toBe('3.0.0');
});

test('renders accepted canonical Unit prose and links at the canonical route', async ({ page }) => {
  await page.goto('./learn/number-theory/dynamic-modular-product/');
  await expect(page.getByRole('heading', { name: '考え方', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '成立条件と計算量', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /ABC405 G/u }).first()).toHaveAttribute(
    'href',
    /\/problems\/abc405-g\//u,
  );
});
