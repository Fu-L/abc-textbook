import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { splitProblemContext } from '../../src/components/problem-reading.js';
import { publicProjection } from '../../src/lib/catalog/public-catalog.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

describe('problem reading order', () => {
  for (const id of ['abc391-f', 'abc330-g', 'abc321-g', 'abc213-g', 'abc466-g']) {
    it(`preserves every paragraph, anchor, link and equation when moving classification: ${id}`, async () => {
      const document = publicProjection.problemDocuments.get(id);
      if (!document) throw new Error(id);
      const original = await renderPublicDocument(document.text, '/abc-textbook/');
      const reading = splitProblemContext(original);
      const before = load(original, null, false);
      const after = load(reading.body + reading.context, null, false);
      for (const selector of ['p', '[id]', 'a', 'math', 'pre', 'table']) {
        const contents = ($: typeof before) =>
          $(selector)
            .map((_, element) => $.html(element))
            .get()
            .sort();
        expect(contents(after)).toEqual(contents(before));
      }
      expect(load(reading.body)('#学習の位置')).toHaveLength(0);
      expect(load(reading.context)('#学習の位置')).toHaveLength(1);
      for (const name of ['考察', '正当性', '計算量と制約', '出典'])
        expect(load(reading.body)(`[id="${name}"]`)).toHaveLength(1);
    });
  }

  it('moves an entire section with subsections, leaving later reasoning intact', () => {
    const reading = splitProblemContext(
      '<p>導入</p><h2 id="学習の位置">学習の位置</h2><h3>前提</h3><p>技能</p><h2 id="証明">証明</h2><p>論証</p>',
    );
    expect(load(reading.body).text()).toBe('導入証明論証');
    expect(load(reading.context).text()).toBe('学習の位置前提技能');
  });

  for (const kind of ['full', 'similar', 'supplement'] as const) {
    it(`supports future ${kind} manuscripts without a special Problem ID`, async () => {
      const fixture = `---\nauthoringUnit: ${JSON.stringify({ kind, primaryProblemId: kind === 'full' ? null : 'abc391-f' })}\n---\n\n## ${kind === 'full' ? '考察' : '差分'}\n\n未掲載の表示fixture。\n\n## 実装上の注意\n\n同じ値の別状態を区別する。`;
      const html = await renderPublicDocument(fixture, '/abc-textbook/');
      const reading = splitProblemContext(html);
      expect(reading.context).toBe('');
      expect(reading.body).toBe(html);
      const $ = load(reading.body);
      if (kind === 'full') expect($('a')).toHaveLength(0);
      else {
        expect($('a').first().attr('href')).toBe('/abc-textbook/problems/abc391-f/');
        expect($('p').first().text()).toContain(kind === 'similar' ? '差分解説' : '補足解説');
        expect($('p').first().text()).toContain('成立条件・正当性・全体計算量');
        expect($('p').first().text()).toContain(kind === 'similar' ? '変わる点' : '追加する要素');
      }
    });
  }
});
