import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { documentHeadings } from '../../src/components/document-contents.js';
import { arrangeUnitReading } from '../../src/components/unit-reading.js';
import { splitProblemContext } from '../../src/components/problem-reading.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { publicProjection } from '../../src/lib/catalog/public-catalog.js';

describe('page contents and heading links', () => {
  it('keeps existing slugs, duplicate suffixes and heading text while linking every subsection', async () => {
    const html = await renderPublicDocument(
      '# 題名\n\n## 考察\n\n本文。\n\n### 状態の定義\n\n導出。\n\n## 考察\n\n別の考察。\n\n#### A & B\n\n小節。\n\n##### 境界\n\n境界。\n\n###### 端点\n\n端点。',
      '/abc-textbook/',
    );
    const $ = load(html);
    expect(documentHeadings(html)).toEqual([
      { id: '考察', label: '考察', level: 2 },
      { id: '状態の定義', label: '状態の定義', level: 3 },
      { id: '考察-1', label: '考察', level: 2 },
      { id: 'a--b', label: 'A & B', level: 4 },
      { id: '境界', label: '境界', level: 5 },
      { id: '端点', label: '端点', level: 6 },
    ]);
    expect($('h1 .heading-link')).toHaveLength(0);
    for (const { id, label } of documentHeadings(html)) {
      const heading = $(`[id="${id}"]`);
      expect(heading.text()).toBe(label);
      expect(heading.attr('tabindex')).toBe('-1');
      expect(heading.attr('aria-label')).toBe(label);
      expect(heading.children('.heading-link').attr('href')).toBe(`#${encodeURIComponent(id)}`);
      expect(heading.children('.heading-link').attr('aria-label')).toBe('この節へのリンク');
    }
  });

  it('uses final reading order and omits hidden metadata, empty labels and unanchored headings', () => {
    expect(
      documentHeadings(
        '<h2 id="本文">本文</h2><h3 id="定義">定義</h3><details><summary>補足</summary><h2 id="補足">補足</h2></details><section data-pagefind-ignore><h2 id="分類">分類</h2></section><h2>節</h2><h2 id="空白"> </h2><h2 id="復習">復習</h2>',
      ),
    ).toEqual([
      { id: '本文', label: '本文', level: 2 },
      { id: '定義', label: '定義', level: 3 },
      { id: '復習', label: '復習', level: 2 },
    ]);
  });

  it('reads math headings once, preserving inline code and authored links', async () => {
    const html = await renderPublicDocument('## $$dp[S]$$ と `mask` の[定義](#定義)', '/');
    const $ = load(html);
    expect($('h2 code').text()).toBe('mask');
    expect($('h2 math')).toHaveLength(1);
    expect(decodeURIComponent($('h2 > a:not(.heading-link)').attr('href') ?? '')).toBe('#定義');
    expect($('h2 a a')).toHaveLength(0);
    expect(documentHeadings(html)[0]?.label).toBe('dp[S] と mask の定義');
  });

  it('includes problem reasoning subsections without the moved learning position', async () => {
    const doc = publicProjection.problemDocuments.get('abc391-f');
    if (!doc) throw new Error('abc391-f');
    const reading = splitProblemContext(await renderPublicDocument(doc.text, '/abc-textbook/'));
    const headings = documentHeadings(reading.body);
    expect(headings.filter(({ level }) => level === 2).map(({ id }) => id)).toEqual([
      '考察',
      '典型の発動条件',
      '問題固有の要素',
      '正当性',
      '実装上の注意',
      '復習の核',
      '計算量と制約',
      '出典',
    ]);
    expect(headings.some(({ id, level }) => id === '時間' && level === 3)).toBe(true);
    expect(load(reading.context)('#学習の位置 .heading-link')).toHaveLength(1);
  });

  it('keeps unit sections and subsection order while excluding folded classification and sources', async () => {
    const doc = publicProjection.unitDocuments.get('unit-range-monoid-aggregation');
    if (!doc) throw new Error('unit-range-monoid-aggregation');
    const html = arrangeUnitReading(await renderPublicDocument(doc.text, '/', true), 'モノイド');
    const headings = documentHeadings(html);
    expect(headings[0]?.id).toBe('概要');
    expect(headings.some(({ id }) => id === '考え方')).toBe(true);
    expect(headings.some(({ id }) => id === '問題一覧')).toBe(true);
    expect(headings.some(({ id }) => ['前提と範囲', '根拠', '習得する技能'].includes(id))).toBe(
      false,
    );
    const $ = load(html);
    expect($('#前提と範囲 .heading-link')).toHaveLength(1);
    expect($('#根拠 .heading-link')).toHaveLength(1);
  });
});
