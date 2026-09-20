import { describe, expect, it } from 'vitest';
import {
  orderUnitProblemsByDifficulty,
  UNIT_PROBLEM_READING_ORDER,
} from '../../src/lib/taxonomy/problem-reading-order.js';

describe('editorial problem difficulty order', () => {
  it('uses the full editorial order independently of incoming order', () => {
    const expected = ['abc294-g', 'abc267-f', 'abc438-f', 'abc298-ex', 'abc329-g'];
    expect(
      orderUnitProblemsByDifficulty('unit-tree-ancestor-lca', [...expected].reverse()),
    ).toEqual(expected);
  });

  it('preserves content-based decisions across slots and close measured difficulties', () => {
    // 294 G is a standard LCA/distance query; 438 F combines path constraints and counting.
    // 351 G has fixed-root affine composition; 460 G also needs reversed cluster DP.
    expect(orderUnitProblemsByDifficulty('unit-static-top-tree', ['abc460-g', 'abc351-g'])).toEqual(
      ['abc351-g', 'abc460-g'],
    );
    expect(UNIT_PROBLEM_READING_ORDER['unit-dsu-components']?.[0]).toBe('abc420-e');
    expect(UNIT_PROBLEM_READING_ORDER['unit-dsu-components']?.at(-1)).toBe('abc440-g');
  });

  it('does not silently append, drop, duplicate, or mechanically sort unedited problems', () => {
    for (const input of [
      ['abc351-g'],
      ['abc351-g', 'abc460-g', 'abc999-g'],
      ['abc351-g', 'abc351-g'],
      ['abc351-g', 'abc999-g'],
    ]) {
      expect(() => orderUnitProblemsByDifficulty('unit-static-top-tree', input)).toThrow(
        'UNIT_PROBLEM_READING_ORDER_INCOMPLETE',
      );
    }
    expect(() => orderUnitProblemsByDifficulty('unit-unedited', ['abc999-e'])).toThrow(
      'UNIT_PROBLEM_READING_ORDER_INCOMPLETE',
    );
  });

  it('keeps empty and singleton Units and returns a copy of the editorial data', () => {
    expect(orderUnitProblemsByDifficulty('unit-chapter-tree', [])).toEqual([]);
    const singleton = Object.entries(UNIT_PROBLEM_READING_ORDER).find(
      ([, ids]) => ids.length === 1,
    );
    if (!singleton) throw new Error('Missing singleton Unit');
    const [id, ids] = singleton;
    const result = orderUnitProblemsByDifficulty(id, ids);
    expect(result).toEqual(ids);
    expect(result).not.toBe(ids);
  });
});
