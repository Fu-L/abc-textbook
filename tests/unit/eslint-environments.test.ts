import { writeFile, unlink } from 'node:fs/promises';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

describe('ESLint execution environments', () => {
  it('rejects browser globals in Astro frontmatter', async () => {
    const eslint = new ESLint({ cwd: process.cwd() });
    const fixturePath = 'src/components/frontmatter-negative.fixture.astro';
    await writeFile(
      fixturePath,
      `---\nconst currentUrl = window.location.href;\n---\n<p>{currentUrl}</p>\n`,
      'utf8',
    );

    try {
      const [result] = await eslint.lintFiles([fixturePath]);
      expect(
        result?.messages.some(
          (message) => message.ruleId === 'no-undef' && message.message.includes('window'),
        ),
      ).toBe(true);
    } finally {
      await unlink(fixturePath);
    }
  });
});
