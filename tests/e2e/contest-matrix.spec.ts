import { expect, test } from './fixtures.js';

test('exposes every primary technique of composite problems in the table and list', async ({
  page,
}) => {
  for (const [contest, problem, name] of [
    ['abc214', 'abc214-h', 'SCC・縮約DAG'],
    ['abc227', 'abc227-h', '最大流・最小カット'],
  ] as const) {
    await page.goto(`./contests/${contest}/`);
    const cells = page.locator(`[data-problem-id="${problem}"]`);
    await expect(cells).toHaveCount(2);
    for (const cell of await cells.all())
      await expect(
        cell.getByRole('link', { name: new RegExp(`主タグ:.*${name}`, 'u') }),
      ).toBeVisible();
  }
});

test('renders dynamic columns, explicit states, direct links, and the alternative list', async ({
  page,
}) => {
  await page.goto('./contests/');

  const table = page.getByRole('table', { name: /上級問題マトリクス/u });
  for (const label of ['E', 'F', 'G', 'H', 'Ex']) {
    await expect(table.getByRole('columnheader', { name: label, exact: true })).toBeVisible();
  }
  await expect(table.getByText('公式問題なし').first()).toBeVisible();

  const cell = table.locator('[data-problem-id="abc212-g"]');
  for (const name of ['問題詳細', '解説', '学習単位', '主タグ']) {
    await expect(cell.getByRole('link', { name: new RegExp(name, 'u') }).first()).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'コンテスト別リスト' })).toBeVisible();
});

test('projects every canonical contest and excludes private compatibility fixtures', async ({
  page,
}) => {
  await page.goto('./contests/');
  const labels = await page
    .locator('[data-registry-labels]')
    .first()
    .getAttribute('data-registry-labels');
  expect(labels?.split(',')).toEqual(['E', 'F', 'G', 'Ex', 'H']);
  await expect(
    page.getByRole('table', { name: /上級問題マトリクス/u }).getByRole('row'),
  ).toHaveCount(255);
  await expect(page.getByText('future I compatibility fixture')).toHaveCount(0);
});

test('keeps only the two-dimensional table horizontally scrollable at 320 CSS pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('./contests/');

  const overflow = await page.evaluate(() => {
    const tableRegion = document.querySelector<HTMLElement>('[data-matrix-scroll]');
    return {
      body: getComputedStyle(document.body).overflowX,
      matrix: tableRegion ? getComputedStyle(tableRegion).overflowX : null,
      pageWiderThanViewport: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  expect(overflow.matrix).toBe('auto');
  expect(overflow.pageWiderThanViewport).toBe(false);
});
