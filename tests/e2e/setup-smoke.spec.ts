import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('renders the static textbook shell without detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('./');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'ABC上級問題体系化教科書',
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
