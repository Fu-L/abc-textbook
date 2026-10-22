import { readFile } from 'node:fs/promises';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { load } from 'cheerio';
import { micromark } from 'micromark';
import { math, mathHtml } from 'micromark-extension-math';
import { describe, expect, it } from 'vitest';
import {
  parseDocumentMath,
  remarkRenderDocumentMath,
} from '../../src/lib/catalog/document-math.js';
import { inspectDocumentNotation } from '../../src/lib/catalog/inspect-document-notation.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

describe('explicit document mathematics', () => {
  it('keeps the micromark KaTeX override compatible with its HTML extension', () => {
    const html = micromark(String.raw`$\frac{1}{2}$`, {
      extensions: [math()],
      htmlExtensions: [mathHtml({ output: 'mathml', throwOnError: true, trust: false })],
    });
    const $ = load(html);
    expect($('math mfrac')).toHaveLength(1);
    expect($('annotation').text()).toBe(String.raw`\frac{1}{2}`);
    const untrusted = load(
      micromark(String.raw`$\href{javascript:alert(1)}{x}$`, {
        extensions: [math()],
        htmlExtensions: [mathHtml({ output: 'mathml', trust: false })],
      }),
    );
    expect(untrusted('a, script')).toHaveLength(0);
  });

  it('renders TeX as static MathML among Japanese, Markdown, links, and C++', async () => {
    const formula = String.raw`1\leq A_i \leq 2\times 10^5`;
    const cpp = String.raw`vector<int> dp(N); auto v = a_i * b_j; cout << "\\leq";`;
    const source =
      `**制約**は $$${formula}$$。[単元](/learn/example/)\n\n` +
      '`a_i * b_j` と x*middle*rev(x)、h*_i、<expr>。\n\n' +
      `\`\`\`cpp\n${cpp}\n\`\`\``;
    const $ = load(await renderPublicDocument(source, '/abc-textbook/'));
    expect($('math')).toHaveLength(1);
    expect($('math msub')).toHaveLength(1);
    expect($('math msup')).toHaveLength(1);
    expect($('math annotation').text()).toBe(formula);
    expect($('math mo').text()).toContain('≤');
    expect($('math mo').text()).toContain('×');
    expect($('strong').text()).toBe('制約');
    expect($('a').attr('href')).toBe('/abc-textbook/learn/example/');
    expect($('pre code').text()).toBe(`${cpp}\n`);
    expect($('p').last().text()).toBe('a_i * b_j と x*middle*rev(x)、h*_i、<expr>。');
    expect($('em, expr, script, [style]')).toHaveLength(0);
  });

  it('keeps DP indexing, set difference, coefficients, and aligned rows inside explicit math', async () => {
    const formula = String.raw`\begin{aligned} dp[S][v]&=\sum_{u\in S\setminus\{v\}}dp[S\setminus\{v\}][u] \\ c_k&=[x^k](F(x)) \end{aligned}`;
    const $ = load(await renderPublicDocument(`$$\n${formula}\n$$`, '/'));
    expect($('.math-display math[display="block"]')).toHaveLength(1);
    expect($('.math-display').attr('tabindex')).toBe('0');
    expect($('math mtable')).toHaveLength(1);
    expect($('annotation').text()).toBe(formula);
    expect($('a, pre')).toHaveLength(0);
  });

  it('uses the same math transform in the Astro Markdown pipeline', async () => {
    const processor = await createMarkdownProcessor({
      remarkPlugins: [[...parseDocumentMath], remarkRenderDocumentMath],
    });
    const $ = load((await processor.render('式 $$x_i^2$$。')).code);
    expect($('math msubsup')).toHaveLength(1);
  });

  it('preserves the existing dollar sentinel manuscript and undelimited legacy notation', async () => {
    const path =
      'src/content/docs/problems/string-geometry/outcome-build-finite-string-automaton/outcome-build-finite-string-automaton-shard-001/abc264-g.md';
    const $ = load(await renderPublicDocument(await readFile(path, 'utf8'), '/'));
    expect($('math')).toHaveLength(0);
    expect($('p').text()).toContain('初期状態 $$ から');
    expect($('p').text()).toContain('ダミー文字 $ を二つ置き、$を含む');
    const legacy = String.raw`S\{i}、1\leq N、dp[mask][i]、x*y、h*_i、[x^k](F)`;
    const rendered = load(await renderPublicDocument(legacy, '/'));
    expect(rendered('p').text()).toBe(legacy);
    expect(rendered('a, em, math')).toHaveLength(0);
  });

  it.each([
    String.raw`$$\unknowncommand{x}$$`,
    String.raw`$$\frac{1}$$`,
    String.raw`$$1\\leq N$$`,
    '$$\nx+1',
  ])('reports invalid or ambiguous explicit math and refuses to publish it: %s', async (source) => {
    expect((await inspectDocumentNotation(source)).map(({ code }) => code)).toEqual([
      'INVALID_MATH',
    ]);
    await expect(renderPublicDocument(source, '/')).rejects.toThrow();
  });

  it('reports original file locations without interpreting bare TeX or programming code', async () => {
    const source =
      '---\ntitle: "x"\n---\n\n本文 1\\leq N と $$未完\n\n' +
      '`x\\leq`\n\n```cpp\ncout << "\\\\times";\n```\n\n$$x_i$$';
    expect(await inspectDocumentNotation(source)).toEqual([
      { code: 'UNDELIMITED_TEX', line: 5, column: 5, detail: '\\leq' },
      { code: 'AMBIGUOUS_DOLLAR', line: 5, column: 14, detail: '$$' },
    ]);
  });
});
