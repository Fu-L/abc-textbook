import { describe, expect, it } from 'vitest';

import { validateCatalogSemantics } from '../../src/lib/catalog/build-catalog.js';
import { CatalogSchema, LearningUnitSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { deterministicTopologicalOrder } from '../../src/lib/validation/validate.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

interface LearningPathNode {
  readonly id: string;
  readonly prerequisiteIds: readonly string[];
  readonly ranks: readonly number[];
}

const learningPath = (nodes: readonly LearningPathNode[]) => {
  const ordered = deterministicTopologicalOrder(nodes, ({ ranks }) => ranks);
  return ordered.map(({ id }, index) => ({
    id,
    previousId: ordered[index - 1]?.id ?? null,
    nextId: ordered[index + 1]?.id ?? null,
  }));
};

describe('US2 LearningUnit and learning-path contract', () => {
  it('requires outcomes, prerequisites, examples, exercises, answers, and assessments', () => {
    const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
    const unit = catalog.learningUnits[0];
    if (!unit) throw new Error('Learning Unit fixture is missing.');
    expect(LearningUnitSchema.safeParse(unit).success).toBe(true);

    for (const invalid of [
      { ...unit, learningOutcomeIds: [] },
      { ...unit, baselineId: '' },
      { ...unit, examples: [] },
      { ...unit, exercises: [] },
      { ...unit, exercises: [{ ...unit.exercises[0], assessment: undefined }] },
      { ...unit, exercises: [{ ...unit.exercises[0], answer: undefined }] },
    ]) {
      expect(LearningUnitSchema.safeParse(invalid).success).toBe(false);
    }
  });

  it('rejects unknown outcome and prerequisite references before navigation is generated', () => {
    const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
    const unit = catalog.learningUnits[0];
    if (!unit) throw new Error('Learning Unit fixture is missing.');
    unit.learningOutcomeIds = ['outcome-missing'];
    unit.additionalPrerequisiteUnitIds = ['unit-missing'];

    const diagnostics = validateCatalogSemantics(catalog);
    expect(diagnostics.filter(({ code }) => code === 'CATALOG_REFERENCE_MISSING')).toHaveLength(2);
  });

  it('generates stable previous/next navigation from prerequisite order', () => {
    const nodes: LearningPathNode[] = [
      { id: 'unit-application', prerequisiteIds: ['unit-foundation'], ranks: [1, 0, 0] },
      { id: 'unit-extension', prerequisiteIds: ['unit-foundation'], ranks: [1, 1, 0] },
      { id: 'unit-foundation', prerequisiteIds: [], ranks: [0, 0, 0] },
    ];
    const expected = [
      { id: 'unit-foundation', previousId: null, nextId: 'unit-application' },
      { id: 'unit-application', previousId: 'unit-foundation', nextId: 'unit-extension' },
      { id: 'unit-extension', previousId: 'unit-application', nextId: null },
    ];

    expect(learningPath(nodes)).toEqual(expected);
    expect(learningPath([...nodes].reverse())).toEqual(expected);
  });
});
