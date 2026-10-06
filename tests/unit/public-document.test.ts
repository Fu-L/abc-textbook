import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

describe('accepted document rendering', () => {
  it('preserves Lagrange coefficient notation without creating a mathematical-expression URL', async () => {
    const source = "第一項は[t^(n−1)]Φ^n、第二項は[t^(n−2)](Φ^n)'/n。";
    const $ = load(await renderPublicDocument(source, '/'));
    expect($('body').text()).toContain(source);
    expect($('a')).toHaveLength(0);
  });
  it('keeps subscripts, products, optimal-value stars, and grammar symbols as literal notation', async () => {
    const source =
      'f(x)=m+Σ_{l∈L}(l−x)_++Σ_{r∈R}(x−r)_+\n\n(P⊗Q)_{ij}=min_k max(P_{ik},Q_{kj})\n\n<expr> と <term>、x*middle*rev(x)、h*_i≤b*_i、λ*で比較してλ*を選ぶ。';
    const $ = load(await renderPublicDocument(source, '/'));
    expect(
      $('p')
        .map((_index, p) => $(p).text())
        .get(),
    ).toEqual(source.split('\n\n'));
    expect($('em, expr, term')).toHaveLength(0);
  });
  it('retains structure, bold, links, and code when notation occurs in the same paragraph', async () => {
    const source =
      '# 表題\n\n**重要**: Σ_{i∈I}[単元](/learn/example/)Σ_{j∈J}。\n\n- `x_i*y_j <term>`\n\n```text\nx_i*y_j <expr>\n```';
    const $ = load(await renderPublicDocument(source, '/book/', true));
    expect($('h1')).toHaveLength(0);
    expect($('strong').text()).toBe('重要');
    expect($('p').text()).toBe('重要: Σ_{i∈I}単元Σ_{j∈J}。');
    expect($('a').attr('href')).toBe('/book/learn/example/');
    expect($('li code').text()).toBe('x_i*y_j <term>');
    expect($('pre code').text()).toBe('x_i*y_j <expr>\n');
  });
  it('preserves set difference and literal TeX punctuation', async () => {
    const source = 'dp[mask\\{i}][last_i]、t_i \\in \\{1,2\\} \\, (1 \\leq i \\leq N)';
    const $ = load(await renderPublicDocument(source, '/'));
    expect($('p').text()).toBe(source);
  });
  it('removes authoring link escapes while preserving mathematical backslashes in the same text', async () => {
    const source =
      'dp\\[m](m+c)、dp[N]\\[L](N−L)!、[x^k](F)、\\[x^k](F)、dp\\[mask\\s](−1)^c、S\\{i}、\\[x^2\\]、\\(x\\)、\\{1,2\\}';
    const $ = load(await renderPublicDocument(source, '/'));
    expect($('p').text()).toBe(
      'dp[m](m+c)、dp[N][L](N−L)!、[x^k](F)、[x^k](F)、dp[mask\\s](−1)^c、S\\{i}、\\[x^2\\]、\\(x\\)、\\{1,2\\}',
    );
    expect($('a')).toHaveLength(0);
  });
  it('removes authoring escapes in fenced text formulas and preserves programming code', async () => {
    const formula = 'G(L) = dp[N]\\[L](N−L)!';
    const source = `\`\`\`text\n${formula}\n\`\`\`\n\n\`\`\`js\nconst regex = /\\[x](f)/;\n\`\`\``;
    const $ = load(await renderPublicDocument(source, '/'));
    expect($('pre code').first().text()).toBe('G(L) = dp[N][L](N−L)!\n');
    expect($('pre code').last().text()).toBe('const regex = /\\[x](f)/;\n');
  });
  it('rewrites reading-list links while preserving official source attribution', async () => {
    const official = 'https://atcoder.jp/contests/abc212/tasks/abc212_g';
    const source = `[ABC212 G「Power Pair」](${official})\n\n[公式問題](${official})\n\n[単元](src/content/docs/learn/number-theory/cyclic-group-exponent-counting.md)`;
    const $ = load(
      await renderPublicDocument(
        source,
        '/book/',
        false,
        new Map([[official, '/problems/abc212-g/']]),
      ),
    );
    expect(
      $('a')
        .map((_index, anchor) => $(anchor).attr('href'))
        .get(),
    ).toEqual([
      '/book/problems/abc212-g/',
      official,
      '/book/learn/number-theory/cyclic-group-exponent-counting/',
    ]);
  });
  it('rejects authoring-only destinations', async () => {
    await expect(renderPublicDocument('[packet](staging/packet.md)', '/')).rejects.toThrow(
      'PUBLIC_DOCUMENT_LINK_UNKNOWN',
    );
  });
});
