import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { generateWritingExamples } from '../fixtures/authoring-skill/writing-examples/generate.js';
import { readProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { splitProblemContext } from '../../src/components/problem-reading.js';

describe('new explanation writing examples', () => {
  it('prepares both forms with the current policy and round-trips the generated prose', async () => {
    for (const { unit, preparation, document } of await generateWritingExamples()) {
      expect(preparation.explanationKind).toBe(unit.kind);
      expect(preparation.writingPolicyPath).toBe(
        '.agents/skills/abc-explanation-author/references/writing-policy.md',
      );
      if (!preparation.templatePath) throw new Error('Missing template');
      const template = await readFile(preparation.templatePath, 'utf8');
      const headings = (text: string) => [...text.matchAll(/^## (.+)$/gmu)].map((m) => m[1]);
      expect(headings(document).filter((h) => h !== '学習の位置' && h !== '出典')).toEqual(
        headings(template),
      );
      expect(readProblemAuthoringDocument(document).unit).toEqual(unit);
      expect(document).not.toContain('<!--');
      expect(document).not.toContain('undefined');
      expect(document).not.toMatch(/^#{2,4} (観察|着想|状態の定義|追加要素なし)$/mu);
      expect(unit).not.toHaveProperty('skill');
      expect(unit.examples).toEqual([]);
      expect(unit.exercises).toEqual([]);
      expect(unit.claims[0]?.text).toBe(
        unit.sections[unit.kind === 'full' ? 'correctness' : 'differences'],
      );
    }
  });

  it('renders new full and difference formulas, proof, complexity and sources in the reading layout', async () => {
    for (const { unit, document } of await generateWritingExamples()) {
      const reading = splitProblemContext(await renderPublicDocument(document, '/abc-textbook/'));
      const $ = load(reading.body, null, false);
      expect($('h2').first().attr('id')).toBe(unit.kind === 'full' ? '考察' : '差分');
      expect($('math').length).toBeGreaterThan(10);
      expect($('math msub').length).toBeGreaterThan(0);
      expect($('math').text()).toContain('≥');
      // TeX is retained in hidden MathML annotations for assistive tooling.
      $('annotation').remove();
      expect($.text()).not.toMatch(/\$\$|\\(?:times|leq|geq|log|text)\b/u);
      expect($.text()).toContain('時間');
      expect($.text()).toContain('空間');
      expect($('#出典 + ul a')).toHaveLength(unit.sourceRevisionIds.length);
      expect(reading.context).toContain('/abc-textbook/learn/query/priority-queue-best-first/');
      if (unit.kind === 'full') {
        expect($('#正当性 + p').text()).toContain('最初の未出力状態');
        expect($('#復習の核 + ul').text()).toContain('同じ状態');
      } else {
        expect($('a').first().attr('href')).toBe('/abc-textbook/problems/abc391-f/');
        expect($.text()).toContain('復習では');
        expect($.text()).toContain('証明を');
      }
    }
  });

  it('checks the teaching example and equal-value states against exhaustive enumeration', () => {
    const values = (a: number[], b: number[], c: number[]) =>
      a.flatMap((x) => b.flatMap((y) => c.map((z) => x * y + y * z + z * x))).sort((x, y) => y - x);
    expect(values([3, 1], [4, 2], [5, 1])).toEqual([47, 31, 29, 19, 17, 11, 9, 5]);
    expect(values([1, 1], [1, 1], [1, 1])).toEqual(Array<number>(8).fill(3));
  });
});
