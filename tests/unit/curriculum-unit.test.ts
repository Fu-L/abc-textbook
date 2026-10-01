import { describe, expect, it } from 'vitest';

import { isCurriculumUnit } from '../../src/lib/taxonomy/curriculum-unit.js';

describe('curriculum unit classification', () => {
  it('distinguishes guide containers from units that directly teach an outcome', () => {
    const units = [
      { id: 'chapter', kind: 'chapter', parentId: null, ownedTagIds: ['orientation'] },
      {
        id: 'section',
        kind: 'section',
        parentId: 'chapter',
        ownedTagIds: [],
        ownedLearningOutcomeIds: [],
      },
      { id: 'concept', kind: 'subsection', parentId: 'section', ownedTagIds: ['concept-tag'] },
      {
        id: 'problem-only',
        kind: 'subsection',
        parentId: 'section',
        directProblemIds: ['abc500-e'],
      },
    ];

    expect(units.map((unit) => [unit.id, isCurriculumUnit(unit)])).toEqual([
      ['chapter', false],
      ['section', false],
      ['concept', true],
      ['problem-only', true],
    ]);
  });

  it('does not infer a learning order from Unit shape or identifiers', () => {
    const units = [
      { id: 'unit-z', kind: 'subsection', parentId: null, ownedTagIds: ['tag-z'] },
      { id: 'unit-a', kind: 'subsection', parentId: null, ownedTagIds: ['tag-a'] },
    ];

    expect(units.every(isCurriculumUnit)).toBe(true);
    expect(units.map(({ id }) => id)).toEqual(['unit-z', 'unit-a']);
  });
});
