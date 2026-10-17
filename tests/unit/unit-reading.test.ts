import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { arrangeUnitReading } from '../../src/components/unit-reading.js';
import {
  compactUnitProblemLists,
  renderTagProblemList,
} from '../../src/components/problem-list.js';
import { publicCatalog, publicProjection } from '../../src/lib/catalog/public-catalog.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

const base = '/abc-textbook/';
const routes = new Map(
  publicCatalog.problems.map((problem) => [problem.officialUrl, problem.route]),
);
const problemsByRoute = new Map(
  publicCatalog.problems.map((problem) => [`${base}${problem.route.slice(1)}`, problem]),
);

describe('concept-first Unit reading', () => {
  it('compacts every Unit without losing problems, order, authored context or references', async () => {
    const directIds = new Set<string>();
    for (const unit of publicCatalog.learningUnits) {
      const doc = publicProjection.unitDocuments.get(unit.id);
      if (!doc) throw new Error(unit.id);
      const body = arrangeUnitReading(
        await renderPublicDocument(doc.text, base, true, routes),
        unit.title,
      );
      const before = load(body, null, false);
      const after = load(compactUnitProblemLists(body, publicCatalog, base, unit.id), null, false);
      for (const selector of ['[id]', 'math', 'pre', 'table']) {
        expect(
          after(selector)
            .map((_, e) => after.html(e))
            .get()
            .sort(),
          unit.id,
        ).toEqual(
          before(selector)
            .map((_, e) => before.html(e))
            .get()
            .sort(),
        );
      }
      const retainedLinks = new Set(
        after('a[href]')
          .map((_, anchor) => anchor.attribs.href)
          .get(),
      );
      for (const anchor of before('a[href]').toArray()) {
        const href = anchor.attribs.href ?? '';
        expect(retainedLinks.has(href), `${unit.id}: ${href}`).toBe(true);
      }
      for (const id of ['問題一覧', '関連問題']) {
        const oldList =
          id === '関連問題'
            ? before(`#${id}`).next('.unit-related').children('ul').first()
            : before(`#${id}`).nextUntil('h2').filter('ul').first();
        const newList =
          id === '関連問題'
            ? after(`#${id}`).next('.unit-related').children('ul').first()
            : after(`#${id}`).nextUntil('h2').filter('ul').first();
        const oldRows = oldList.children('li').toArray();
        const newRows = newList.children('li').toArray();
        expect(newRows.length, unit.id).toBe(oldRows.length);
        for (const [index, row] of oldRows.entries()) {
          const original = before(row);
          const result = after(newRows[index]);
          const href = original.children('a').first().attr('href');
          const problem = problemsByRoute.get(href ?? '');
          if (!problem) throw new Error(`${unit.id}: ${String(href)}`);
          if (id === '問題一覧') directIds.add(problem.id);
          expect(result.children('a').first().attr('href')).toBe(href);
          expect(result.children('a').first().text()).toBe(original.children('a').first().text());
          expect(result.children('a.problem-list-official').attr('href')).toBe(problem.officialUrl);
          expect(result.children('details').attr('open')).toBeUndefined();
          original.children('a').first().remove();
          const normalize = (text: string) => text.replace(/\s+/gu, '').replace(/^—/u, '');
          expect(normalize(result.find('.problem-list-roles').text())).toBe(
            normalize(original.text()),
          );
          const visible = result.clone();
          visible.children('details').remove();
          expect(visible.text()).not.toContain('その発動条件、正当性、計算量を説明し');
        }
      }
    }
    expect([...directIds].sort()).toEqual(publicCatalog.problems.map((p) => p.id).sort());
  }, 30_000);

  it('keeps accepted tag representatives and membership in order with both destinations and actual roles', () => {
    for (const tag of publicCatalog.tags) {
      for (const ids of [tag.representativeProblemIds, tag.problemIds]) {
        const $ = load(renderTagProblemList(ids, publicCatalog, base, tag.id), null, false);
        const rows = $('ul > li');
        expect(rows).toHaveLength(ids.length);
        rows.each((i, element) => {
          const problem = publicCatalog.problems.find((p) => p.id === ids[i]);
          if (!problem) throw new Error(String(ids[i]));
          expect($(element).children('a').first().attr('href')).toBe(
            `${base}${problem.route.slice(1)}`,
          );
          expect($(element).children('.problem-list-official').attr('href')).toBe(
            problem.officialUrl,
          );
          const connection = $(element).find('.problem-list-connections').text();
          if (problem.primaryTagIds.includes(tag.id)) expect(connection).toContain('主タグ');
          else if (problem.supportingTagIds.includes(tag.id))
            expect(connection).toContain('補助タグ');
          else {
            // A broad introductory tag can select examples from descendant techniques.
            expect(connection).not.toContain('主タグ');
            expect(connection).not.toContain('補助タグ');
          }
          for (const id of [...problem.primaryTagIds, ...problem.supportingTagIds]) {
            expect($(element).find(`details a[href="${base}tags/${id}/"]`)).toHaveLength(1);
          }
        });
      }
    }
  });

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
