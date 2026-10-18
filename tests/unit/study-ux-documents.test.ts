import { readFile, readdir } from 'node:fs/promises';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

const problemFiles = await readdir('src/content/docs/problems', { recursive: true });
const representatives = ['abc391-f', 'abc213-g'].map((id) => {
  const file = problemFiles.find((entry) => entry.endsWith(`/${id}.md`));
  if (!file) throw new Error(`Missing representative: ${id}`);
  return `src/content/docs/problems/${file}`;
});
representatives.push(
  'src/content/docs/learn/query/priority-queue-best-first.md',
  'src/content/docs/learn/query/range-monoid-aggregation.md',
  'tests/fixtures/documents/widths.md',
);

describe('representative Japanese textbook documents', () => {
  it.each(representatives)(
    'renders math, anchors and code without leaking markup in %s',
    async (file) => {
      const manuscript = await readFile(file, 'utf8');
      const $ = load(await renderPublicDocument(manuscript, '/abc-textbook/'), null, false);
      if (manuscript.includes('$$')) expect($('math').length).toBeGreaterThan(0);
      expect($('h2').length).toBeGreaterThan(0);
      expect($('merror')).toHaveLength(0);
      const ids = $('[id]')
        .map((_, element) => $(element).attr('id'))
        .get();
      expect(new Set(ids).size).toBe(ids.length);
      for (const link of $('.heading-link').toArray()) {
        const fragment = $(link).attr('href');
        expect(fragment).toMatch(/^#/u);
        expect(ids).toContain(decodeURIComponent(fragment?.slice(1) ?? ''));
      }
      for (const link of $('a[href^="/abc-textbook/"]').toArray()) {
        expect($(link).attr('href')).not.toMatch(/\.md(?:#|$)|src\/content/u);
      }
      const fences = [...manuscript.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gmu)];
      expect(
        $('pre code')
          .map((_, element) => $(element).text())
          .get(),
      ).toEqual(fences.map((match) => match[1]));
      // MathML annotations deliberately retain TeX; code may explain TeX literally.
      // Neither should hide unconverted TeX in the ordinary reading text.
      $('annotation, pre, code').remove();
      expect($.text()).not.toMatch(/\$\$|```|\\(?:frac|sum|times|leq|geq|begin|end)\b/u);
    },
  );
});
