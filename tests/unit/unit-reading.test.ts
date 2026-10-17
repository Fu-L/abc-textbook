import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { arrangeUnitReading } from '../../src/components/unit-reading.js';
import { publicCatalog, publicProjection } from '../../src/lib/catalog/public-catalog.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

const base = '/abc-textbook/';
const routes = new Map(
  publicCatalog.problems.map((problem) => [problem.officialUrl, problem.route]),
);

describe('concept-first Unit reading', () => {
  it('preserves prose, headings, links, math and problem order across the published Units', async () => {
    for (const unit of publicCatalog.learningUnits) {
      const doc = publicProjection.unitDocuments.get(unit.id);
      if (!doc) throw new Error(unit.id);
      const original = await renderPublicDocument(doc.text, base, true, routes);
      const before = load(original, null, false);
      const after = load(arrangeUnitReading(original, unit.title), null, false);
      for (const selector of ['p', '[id]', 'a', 'math', 'pre', 'table']) {
        const values = ($: typeof before) =>
          $(selector)
            .map((_, element) => $.html(element))
            .get()
            .sort();
        expect(values(after), `${unit.id}: ${selector}`).toEqual(values(before));
      }
      expect(
        after('[id]')
          .map((_, element) => element.attribs.id)
          .get().length,
      ).toBe(
        new Set(
          after('[id]')
            .map((_, element) => element.attribs.id)
            .get(),
        ).size,
      );
      for (const name of ['問題一覧', '関連問題']) {
        const problemLinks = ($: typeof before) => {
          const heading = $(`#${name}`);
          const list =
            name === '関連問題' && heading.next().is('.unit-related')
              ? heading.next().children('ul').first()
              : heading.nextUntil('h2').filter('ul').first();
          return list
            .children('li')
            .children('a:first-child')
            .map((_, element) => $(element).attr('href'))
            .get();
        };
        expect(problemLinks(after), `${unit.id}: ${name}`).toEqual(problemLinks(before));
      }
      for (const name of ['概要', '考え方', '成立条件と計算量', '問題一覧'])
        expect(after(`#${name}`).parents('details'), `${unit.id}: ${name}`).toHaveLength(0);
      expect(after('#前提と範囲').parents('details.unit-context')).toHaveLength(1);
      expect(after('#根拠').parents('details.unit-context')).toHaveLength(1);
      expect(after('.unit-context').prevAll('#問題一覧')).toHaveLength(1);
    }
  }, 30_000);

  it('retains authored openings, unusual sections and actual prerequisites without a Unit ID branch', async () => {
    const original = await renderPublicDocument(
      `# 新しい単元

まず、この例から考える。

習得対象の目安: 青色。

## 概要

### 新しい単元

仕組みの説明。

### 習得する技能

- 必要な状態を導く。

## 手順と証明

学習上必要な条件はここに置く。

## 前提と範囲

直接の前提単元: [区間要約](/learn/query/range-monoid-aggregation/)。

## 問題一覧

- [問題](/problems/abc343-f/)

## 補足の反例

結合順を逆にしてはいけない。

## 根拠

[出典](https://atcoder.jp/contests/abc343/tasks/abc343_f)
`,
      base,
      true,
    );
    const $ = load(arrangeUnitReading(original, '新しい単元'), null, false);
    expect($.root().children().first().text()).toBe('まず、この例から考える。');
    expect($('#手順と証明').next().text()).toBe('学習上必要な条件はここに置く。');
    expect($('#補足の反例').next().text()).toBe('結合順を逆にしてはいけない。');
    expect($('.unit-context a').first().attr('href')).toBe(
      `${base}learn/query/range-monoid-aggregation/`,
    );
    expect($('.unit-context').text()).toContain('必要な状態を導く。');
    expect($('.unit-related')).toHaveLength(0);
  });
});
