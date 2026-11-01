import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { generateWritingExamples } from '../fixtures/authoring-skill/writing-examples/generate.js';
import { readProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';
import { splitProblemContext } from '../../src/components/problem-reading.js';
import {
  prepareExplanationAuthoring,
  validateAuthoringInput,
  validateAuthoringOutput,
  type ExplanationComparison,
} from '../../src/lib/authoring/explanation-authoring-skill.js';

describe('standalone full writing and legacy abbreviated compatibility', () => {
  it('prepares standalone full input and rejects abbreviated comparison input for full output', async () => {
    const examples = await generateWritingExamples();
    const full = examples.find(({ unit }) => unit.kind === 'full');
    const legacy = examples.find(({ unit }) => unit.kind === 'similar');
    if (!full || !legacy) throw new Error('Missing writing fixtures');
    expect(full.input.placementCandidate).toEqual({
      primaryProblemId: null,
      comparison: null,
      additionalElement: null,
    });
    expect(full.preparation).toMatchObject({
      status: 'authoring_required',
      explanationKind: 'full',
      templatePath: '.agents/skills/abc-explanation-author/templates/full-explanation.md',
    });
    expect(full.unit).toMatchObject({
      kind: 'full',
      primaryProblemId: null,
      differenceSummary: null,
    });
    expect(validateAuthoringOutput(full.unit, full.input).status).toBe('ready');

    for (const additionalElement of [null, '旧形式の追加観察']) {
      const input = structuredClone(full.input);
      input.placementCandidate = {
        ...legacy.input.placementCandidate,
        primaryProblemId: legacy.unit.problemId,
        additionalElement,
      };
      const snapshot = structuredClone(input);
      expect(prepareExplanationAuthoring(input).explanationKind).toBe(
        additionalElement === null ? 'similar' : 'supplement',
      );
      expect(validateAuthoringOutput(full.unit, input).diagnostics.map(({ code }) => code)).toEqual(
        expect.arrayContaining(['OUTPUT_KIND_MISMATCH', 'OUTPUT_PRIMARY_PROBLEM_MISMATCH']),
      );
      expect(input).toEqual(snapshot);
    }
  });

  it.each<keyof ExplanationComparison>([
    'learningOutcomes',
    'prerequisites',
    'coreMethod',
    'proofIdea',
    'asymptoticComplexity',
  ])('retains full fallback for a legacy mismatch in %s', async (field) => {
    const legacy = (await generateWritingExamples()).find(({ unit }) => unit.kind === 'similar');
    if (!legacy?.input.placementCandidate.comparison) throw new Error('Missing legacy comparison');
    const input = structuredClone(legacy.input);
    if (!input.placementCandidate.comparison) throw new Error('Missing comparison');
    input.placementCandidate.comparison[field] = false;
    for (const additionalElement of [null, '旧形式の追加観察']) {
      input.placementCandidate.additionalElement = additionalElement;
      expect(prepareExplanationAuthoring(input)).toMatchObject({
        status: 'authoring_required',
        explanationKind: 'full',
        templatePath: '.agents/skills/abc-explanation-author/templates/full-explanation.md',
      });
    }
    input.placementCandidate.comparison = null;
    expect(validateAuthoringInput(input).diagnostics.map(({ code }) => code)).toContain(
      'PLACEMENT_COMPARISON_INCOMPLETE',
    );
  });

  it('prepares full and legacy similar with the current policy and round-trips generated prose', async () => {
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
    // The counterexample in the technique section: descending order alone is insufficient.
    const score = (a: number, b: number, c: number) => a * b + b * c + c * a;
    expect(score(2, -3, 1)).toBe(-7);
    expect(score(1, -3, 1)).toBe(-5);
  });
});
