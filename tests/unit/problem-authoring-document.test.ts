import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { ProblemAuthoringUnitSchema } from '../../src/lib/domain/schema-parts/authoring-unit.js';
import {
  renderProblemAuthoringDocument,
  readProblemAuthoringDocument,
} from '../../src/lib/authoring/problem-authoring-document.js';
const fixture = ProblemAuthoringUnitSchema.parse(
  JSON.parse(
    await readFile('tests/fixtures/authoring-skill/full-abc212-g.json', 'utf8'),
  ) as unknown,
);
const links = {
  home: '[原始根](src/content/docs/learn/number-theory/cyclic-group-order.md)',
  outcomes: ['位数ごとの寄与を数える。'],
  sources: ['[公式問題](https://atcoder.jp/contests/abc212/tasks/abc212_g)'],
  prerequisites: [],
};
describe('co-located full Problem document', () => {
  it('round-trips the canonical unit with sections stored only once in prose', () => {
    const doc = renderProblemAuthoringDocument(fixture, 'ABC212 G', links);
    const read = readProblemAuthoringDocument(doc);
    expect(read.unit).toEqual(fixture);
    expect(read.title).toBe('ABC212 G');
    expect(doc.split('---')[1]).not.toContain('"sections"');
    expect(read.body).not.toMatch(/^#{2,3} (具体例|確認問題|確認する観点|解答と理由)$/mu);
  });
  it('rejects missing proofs and publication-enabled copies', () => {
    const doc = renderProblemAuthoringDocument(fixture, 'ABC212 G', links);
    expect(() => readProblemAuthoringDocument(doc.replace('## 正当性', '## other'))).toThrow(
      /AUTHORING_SECTION/,
    );
    expect(() => readProblemAuthoringDocument(doc.replace('draft: true', 'draft: false'))).toThrow(
      'AUTHORING_DRAFT_FRONTMATTER_REQUIRED',
    );
  });
  it('preserves coefficient extraction as mathematics in prose without requiring exercise blocks', () => {
    const unit = structuredClone(fixture);
    unit.sections.reasoning = '係数 [x²](1+x)^4 を取り出す。';
    unit.examples = [];
    unit.exercises = [];
    const document = renderProblemAuthoringDocument(unit, '係数の例', links);
    expect(document).toContain('係数 \\[x²](1+x)^4');
    expect(document).toContain(links.home);
    expect(document).toContain(links.sources[0]);
    const parsed = readProblemAuthoringDocument(document);
    expect(renderProblemAuthoringDocument(parsed.unit, parsed.title, links)).toBe(document);
  });
});
