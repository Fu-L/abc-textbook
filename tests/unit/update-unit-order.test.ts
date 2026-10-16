import { describe, expect, it } from 'vitest';
import {
  insertUnitProblemLinks,
  validateInsertedProblemOrder,
} from '../../scripts/update-abc/unit-order.js';

const oldIds = ['abc212-e', 'abc370-e'];
const first =
  '- [ABC212 E「Safety Journey」](https://atcoder.jp/contests/abc212/tasks/abc212_e) — 保持する式。';
const second = '- [ABC370 E「Avoid K Partition」](/problems/abc370-e/) — 保持する解説。';
const original = `冒頭\n\n## 問題一覧\n\n${first}\n\n  続きの証明。\n\n${second}\n\n## 根拠\n\n出典。\n`;
const newIds = ['abc468-i', 'abc467-ex', 'abc467-e', 'abc467-f'];
const links = new Map(
  newIds.map((id) => [id, `- [${id.toUpperCase().replace('-', ' ')}「新問」](/problems/${id}/)`]),
);

describe('editorial Unit insertions', () => {
  it('keeps explicit beginning, middle and end insertions, including multiple new IDs', () => {
    const ordered = ['abc468-i', 'abc212-e', 'abc467-ex', 'abc467-e', 'abc370-e', 'abc467-f'];
    expect(validateInsertedProblemOrder(oldIds, newIds, ordered, 'fixture')).toEqual(ordered);
    const text = insertUnitProblemLinks({
      text: original,
      heading: '問題一覧',
      previous: oldIds,
      ordered,
      links,
      unitId: 'fixture',
    });
    const listed = [...text.matchAll(/^- \[(ABC\d+) ([A-Za-z]+)「/gmu)].map(
      (m) => `${m[1]?.toLowerCase() ?? ''}-${m[2]?.toLowerCase() ?? ''}`,
    );
    expect(listed).toEqual(ordered);
    // Removing only the inserted lines recovers all old prose and whitespace.
    expect(
      text
        .split('\n')
        .filter((line) => ![...links.values()].includes(line))
        .join('\n'),
    ).toBe(original);
  });

  it.each([
    ['unspecified', oldIds, 'UNIT_PROBLEM_ORDER_REQUIRED'],
    ['reordered', ['abc370-e', 'abc467-e', 'abc212-e'], 'UNIT_PROBLEM_ORDER_CONFLICT'],
    ['removed', ['abc212-e', 'abc467-e'], 'UNIT_PROBLEM_ORDER_CONFLICT'],
    ['missing-new', ['abc212-e', 'abc370-e'], 'UNIT_PROBLEM_ORDER_REQUIRED'],
    ['duplicate', ['abc212-e', 'abc467-e', 'abc467-e', 'abc370-e'], 'UNIT_PROBLEM_ORDER_CONFLICT'],
    ['foreign', ['abc212-e', 'abc467-e', 'abc999-e', 'abc370-e'], 'UNIT_PROBLEM_ORDER_CONFLICT'],
  ] as const)('rejects %s order', (_name, ordered, code) => {
    expect(() => validateInsertedProblemOrder(oldIds, ['abc467-e'], ordered, 'fixture')).toThrow(
      code,
    );
  });

  it('allows an explicit append and an insertion into an empty Unit', () => {
    expect(
      validateInsertedProblemOrder(oldIds, ['abc467-e'], [...oldIds, 'abc467-e'], 'fixture'),
    ).toEqual([...oldIds, 'abc467-e']);
    expect(validateInsertedProblemOrder([], ['abc467-e'], ['abc467-e'], 'fixture')).toEqual([
      'abc467-e',
    ]);
  });

  it('creates the first related section while preserving the rest of the document', () => {
    const text = insertUnitProblemLinks({
      text: original,
      heading: '関連問題',
      previous: [],
      ordered: ['abc467-ex'],
      links,
      unitId: 'fixture',
    });
    expect(text).toBe(
      original.replace(
        '\n## 根拠\n',
        `\n## 関連問題\n\n${links.get('abc467-ex') ?? ''}\n\n## 根拠\n`,
      ),
    );
  });

  it('recognizes the existing mixed-case Ex label without inferring its official task ID', () => {
    const text = original.replace('ABC370 E「', 'ABC238 Ex「');
    const edited = insertUnitProblemLinks({
      text,
      heading: '問題一覧',
      previous: ['abc212-e', 'abc238-ex'],
      ordered: ['abc212-e', 'abc467-e', 'abc238-ex'],
      links,
      unitId: 'fixture',
    });
    expect(edited.indexOf(links.get('abc467-e') ?? '')).toBeLessThan(
      edited.indexOf('- [ABC238 Ex「'),
    );
    expect(edited.replace(`${links.get('abc467-e') ?? ''}\n`, '')).toBe(text);
  });

  it('replaces the empty-home notice when the first direct Problem is added', () => {
    const text =
      '概要。\n\n## 問題一覧\n\nこの単元に直接配置する問題はありません。下位単元または関連問題を参照してください。\n\n各項目には主題を示します。\n\n## 根拠\n出典。\n';
    const edited = insertUnitProblemLinks({
      text,
      heading: '問題一覧',
      previous: [],
      ordered: ['abc467-e'],
      links,
      unitId: 'fixture',
    });
    expect(edited).not.toContain('直接配置する問題はありません');
    expect(edited).toContain('各項目には主題を示します。');
    expect(edited).toContain(links.get('abc467-e'));
    expect(edited).toContain('## 根拠\n出典。');
  });

  it('rejects a pre-existing list whose order differs from its metadata', () => {
    expect(() =>
      insertUnitProblemLinks({
        text: original
          .replace(first, second)
          .replace(`${second}\n\n## 根拠`, `${first}\n\n## 根拠`),
        heading: '問題一覧',
        previous: oldIds,
        ordered: [...oldIds, 'abc467-e'],
        links,
        unitId: 'fixture',
      }),
    ).toThrow('UNIT_DOCUMENT_ORDER_CONFLICT');
  });
});
