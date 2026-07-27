import { expect, test } from './fixtures.js';

test('indexes entity kind, aliases, hierarchy, and contest terms on canonical routes', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('button', { name: '検索' }).click();
  const dialog = page.getByRole('dialog', { name: '検索' });
  const input = dialog.locator('.pagefind-ui__search-input');

  for (const term of ['Power Pair', 'graph-search', 'グラフ・探索', 'ABC 212']) {
    await input.fill(term);
    await expect(dialog.locator('.pagefind-ui__result-link').first()).toBeVisible();
  }
  await input.fill('Power Pair');
  await expect(dialog.locator('.pagefind-ui__result-link').first()).toContainText('問題:');
});

test('shows zero-result guidance and excludes controls, staging, and local state', async ({
  page,
}) => {
  await page.goto('./problems/');
  const search = page.getByRole('search', { name: '問題を絞り込む' });
  await search.getByLabel('問題名').fill('存在しない問題名');
  await search.getByRole('button', { name: '適用' }).click();
  await expect(page.getByText(/0件.*条件を変更/u)).toBeVisible();

  const catalog = await page.request.get('./data/catalog.json');
  const body = await catalog.text();
  expect(body).not.toContain('staging/');
  expect(body).not.toContain('needsReview');
  expect(body).not.toContain('statusUpdatedAt');
});
