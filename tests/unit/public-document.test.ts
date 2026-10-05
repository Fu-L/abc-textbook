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
