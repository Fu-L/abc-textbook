import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

describe('ESLint execution environments', () => {
  it('rejects browser globals in Astro frontmatter', async () => {
    const eslint = new ESLint({ cwd: process.cwd() });
    const config: unknown = await eslint.calculateConfigForFile('src/components/frontmatter.astro');

    expect(config).not.toHaveProperty(['languageOptions', 'globals', 'window']);
    expect(config).toHaveProperty(['rules', 'no-undef', 0], 2);
  });
});
