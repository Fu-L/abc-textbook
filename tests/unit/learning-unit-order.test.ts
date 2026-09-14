import { describe, expect, it } from 'vitest';
import {
  isCurriculumUnit,
  orderCurriculumUnits,
  unitNavigationIndices,
} from '../../src/lib/taxonomy/learning-unit-order.js';

describe('curriculum and navigation positions', () => {
  it('keeps concept continuations together but waits for outside prerequisites', () => {
    const unit = (id: string, stageRank: number, prerequisiteIds: string[] = []) => ({
      id,
      stageRank,
      prerequisiteIds,
      difficultyRank: 1,
      representativeRank: 1,
    });
    const units = [
      unit('unit-dp-sequence', 1),
      unit('unit-dp-lis', 2, ['unit-dp-sequence']),
      unit('unit-dp-prefix-partition', 1),
      unit('unit-unrelated', 1),
    ];
    expect(orderCurriculumUnits(units).map(({ id }) => id)).toEqual([
      'unit-dp-sequence',
      'unit-dp-lis',
      'unit-dp-prefix-partition',
      'unit-unrelated',
    ]);
    const blocked = units.map((u) =>
      u.id === 'unit-dp-lis'
        ? { ...u, prerequisiteIds: ['unit-dp-sequence', 'unit-unrelated'] }
        : u,
    );
    expect(orderCurriculumUnits(blocked).map(({ id }) => id)).toEqual([
      'unit-dp-sequence',
      'unit-dp-prefix-partition',
      'unit-unrelated',
      'unit-dp-lis',
    ]);
  });
  it('places containers at their earliest teaching descendant without adding curriculum steps', () => {
    const units = [
      { id: 'chapter', kind: 'chapter', parentId: null, ownedTagIds: ['orientation'] },
      { id: 'section', parentId: 'chapter', ownedTagIds: [], ownedLearningOutcomeIds: [] },
      { id: 'basic', parentId: 'section', ownedTagIds: ['basic-skill'] },
      { id: 'advanced', parentId: 'section', ownedTagIds: ['advanced-skill'] },
      { id: 'elsewhere', parentId: null, ownedTagIds: ['other-skill'] },
    ];
    const order = ['elsewhere', 'basic', 'advanced'];
    expect(units.filter(isCurriculumUnit).map(({ id }) => id)).toEqual([
      'basic',
      'advanced',
      'elsewhere',
    ]);
    const indices = unitNavigationIndices(units, order);
    expect(indices.get('chapter')).toBe(1);
    expect(indices.get('section')).toBe(1);
    expect(indices.get('basic')).toBe(1);
    expect(indices.get('advanced')).toBe(2);
    const regrouped = units.map((unit) =>
      unit.id === 'elsewhere' ? { ...unit, parentId: 'section' } : unit,
    );
    const moved = unitNavigationIndices(regrouped, order);
    expect(moved.get('chapter')).toBe(0);
    expect(moved.get('advanced')).toBe(2);
    expect(order).toEqual(['elsewhere', 'basic', 'advanced']);
  });
});
