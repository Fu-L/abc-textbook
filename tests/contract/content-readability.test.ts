import { glob, readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import {
  readProblemAuthoringDocument,
  renderProblemAuthoringDocument,
} from '../../src/lib/authoring/problem-authoring-document.js';
import { validateAuthoringOutput } from '../../src/lib/authoring/explanation-authoring-skill.js';
import { SourceRevisionSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { inspectDocumentNotation } from '../../src/lib/catalog/inspect-document-notation.js';
import { renderPublicDocument } from '../../src/lib/catalog/render-public-document.js';

const ids = ['abc391-f', 'abc297-e', 'abc212-e'];
const sources = new Map<
  string,
  { path: string; source: ReturnType<typeof SourceRevisionSchema.parse> }
>();
for await (const path of glob('src/content/sources/**/source-*.json')) {
  const source = SourceRevisionSchema.parse(JSON.parse(await readFile(path, 'utf8')));
  if (ids.some((id) => source.officialTaskId === id.replace('-', '_')))
    sources.set(source.id, { path, source });
}

describe('small manuscript revision for #121', () => {
  it.each(ids)(
    'validates %s with its task sources and renders delimited mathematics',
    async (id) => {
      const paths: string[] = [];
      for await (const path of glob(`src/content/docs/problems/**/${id}.md`)) paths.push(path);
      expect(paths).toHaveLength(1);
      const path = paths[0];
      if (!path) throw new Error(`Missing manuscript ${id}`);
      const text = await readFile(path, 'utf8');
      const { unit, title } = readProblemAuthoringDocument(text);
      const validation = validateAuthoringOutput(unit, {
        problemId: id,
        learningOutcomeIds: unit.learningOutcomeIds,
        baseline: { id: unit.baselineId, version: unit.baselineVersion },
        additionalPrerequisiteUnitIds: unit.additionalPrerequisiteUnitIds,
        excludedTopics: unit.excludedTopics,
        tagIds: unit.tagIds,
        constraints: [unit.sections.constraintConsistency as string],
        placementCandidate: { primaryProblemId: null, comparison: null, additionalElement: null },
        technicalClaims: unit.claims.map(({ text, sourceRevisionIds }) => ({
          text,
          sourceRevisionIds,
        })),
        sources: unit.sourceRevisionIds.map((id) => {
          const entry = sources.get(id);
          if (!entry) throw new Error(`Missing task source ${id}`);
          const { path, source } = entry;
          if (
            !source.officialTaskId ||
            (source.sourceKind !== 'official_problem' && source.sourceKind !== 'official_editorial')
          )
            throw new Error(`Invalid task source ${id}`);
          return {
            path,
            sourceRevisionId: id,
            sourceKind: source.sourceKind,
            officialTaskId: source.officialTaskId,
            checkedAt: source.checkedAt,
            termsCheckedAt: source.termsCheckedAt,
            allowedUses: ['constraint_reference', 'technical_claim'],
          };
        }),
      });
      expect(validation).toEqual({ status: 'ready', diagnostics: [] });
      expect(unit.claims[0]?.text).toBe(unit.sections.correctness);
      const generated = renderProblemAuthoringDocument(unit, title, {
        home: '学習の位置',
        outcomes: [],
        prerequisites: [],
        sources: [],
      });
      expect(readProblemAuthoringDocument(generated).unit).toEqual(unit);
      expect(await inspectDocumentNotation(text)).toEqual([]);
      const $ = load(await renderPublicDocument(text, '/abc-textbook/'));
      expect($('math').length).toBeGreaterThan(10);
      expect($('h2[id="正当性"]')).toHaveLength(1);
      expect($('#出典 + ul a')).toHaveLength(2);
      $('annotation').remove();
      expect($.text()).not.toMatch(/\$\$|\\(?:leq|geq|times|log)\b/u);
    },
  );

  it('checks the triplet teaching example and counts equal values by distinct positions', () => {
    const enumerate = (a: number[], b: number[], c: number[]) =>
      a.flatMap((x) => b.flatMap((y) => c.map((z) => x * y + y * z + z * x)));
    expect(enumerate([3, 1], [4, 2], [5, 1]).sort((x, y) => y - x)).toEqual([
      47, 31, 29, 19, 17, 11, 9, 5,
    ]);
    expect(enumerate([1, 1], [1, 1], [1, 1])).toEqual(Array<number>(8).fill(3));
  });

  it('checks the distinct-price example by enumerating purchase counts', () => {
    const amounts = new Set<number>();
    for (let twos = 0; twos <= 3; twos++)
      for (let threes = 0; threes <= 2; threes++) {
        const value = 2 * twos + 3 * threes;
        if (value > 0 && value <= 6) amounts.add(value);
      }
    expect([...amounts].sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6]);
  });

  it('checks the complement recurrence against direct walks for every graph on 2–4 cities', () => {
    const at = (array: number[], index: number): number => {
      const value = array[index];
      if (value === undefined) throw new Error(`Missing city ${String(index)}`);
      return value;
    };
    for (let n = 2; n <= 4; n++) {
      const pairs: [number, number][] = [];
      for (let u = 0; u < n; u++) for (let v = u + 1; v < n; v++) pairs.push([u, v]);
      for (let mask = 0; mask < 2 ** pairs.length; mask++) {
        const broken = pairs.filter((_, i) => mask & (1 << i));
        for (const modulus of [7, 998244353]) {
          let previous = Array<number>(n).fill(0);
          previous[0] = 1;
          for (let day = 0; day < 6; day++) {
            const direct = Array.from({ length: n }, (_, v) =>
              previous.reduce(
                (sum, count, u) =>
                  u !== v && !broken.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
                    ? (sum + count) % modulus
                    : sum,
                0,
              ),
            );
            const total = previous.reduce((a, b) => a + b, 0) % modulus;
            const next = previous.map((value) => total - value);
            for (const [u, v] of broken) {
              next[u] = at(next, u) - at(previous, v);
              next[v] = at(next, v) - at(previous, u);
            }
            const normalized = next.map((value) => ((value % modulus) + modulus) % modulus);
            expect(normalized).toEqual(direct);
            previous = normalized;
          }
        }
      }
    }
  });
});
