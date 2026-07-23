import { describe, expect, it } from 'vitest';

import { validateCatalogSemantics, type CatalogLike } from '../../src/lib/catalog/build-catalog.js';
import { CatalogSchema, TechniqueTagSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { deterministicTopologicalOrder } from '../../src/lib/validation/validate.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const catalogFixture = () => CatalogSchema.parse(makeTrustedCatalog({}));
const codes = (catalog: CatalogLike): string[] =>
  validateCatalogSemantics(catalog).map(({ code }) => code);

describe('US2 taxonomy contract', () => {
  it('deduplicates canonical names, aliases, and former names across Tags', () => {
    const catalog = catalogFixture();
    const tag = catalog.tags[0];
    if (!tag) throw new Error('Technique Tag fixture is missing.');
    catalog.tags.push({
      ...structuredClone(tag),
      id: 'tag-duplicate-graph',
      name: '  GRAPHS  ',
    });

    expect(codes(catalog)).toContain('TAG_TERM_CONFLICT');
  });

  it('requires every formal Tag to define outcomes and representative Problems', () => {
    const tag = catalogFixture().tags[0];
    if (!tag) throw new Error('Technique Tag fixture is missing.');
    expect(TechniqueTagSchema.safeParse({ ...tag, learningOutcomeIds: [] }).success).toBe(false);
    expect(TechniqueTagSchema.safeParse({ ...tag, representativeProblemIds: [] }).success).toBe(
      false,
    );
  });

  it('validates Tag and LearningUnit prerequisite graphs separately', () => {
    const tagCycle = catalogFixture();
    const tag = tagCycle.tags[0];
    if (!tag) throw new Error('Technique Tag fixture is missing.');
    tag.prerequisiteTagIds = [tag.id];
    expect(codes(tagCycle)).toContain('DEPENDENCY_CYCLE');

    const unitCycle = catalogFixture();
    const unit = unitCycle.learningUnits[0];
    if (!unit) throw new Error('Learning Unit fixture is missing.');
    unit.additionalPrerequisiteUnitIds = [unit.id];
    expect(codes(unitCycle)).toContain('DEPENDENCY_CYCLE');
  });

  it('orders ready LearningUnits deterministically after all prerequisites', () => {
    const nodes = [
      { id: 'unit-b', prerequisiteIds: [], ranks: [0, 0, 0] },
      { id: 'unit-c', prerequisiteIds: ['unit-a'], ranks: [0, 0, 0] },
      { id: 'unit-a', prerequisiteIds: [], ranks: [0, 0, 0] },
    ];
    const order = (input: typeof nodes): string[] =>
      deterministicTopologicalOrder(input, ({ ranks }) => ranks).map(({ id }) => id);

    expect(order(nodes)).toEqual(['unit-a', 'unit-b', 'unit-c']);
    expect(order([...nodes].reverse())).toEqual(['unit-a', 'unit-b', 'unit-c']);
  });

  it('rejects published Problems without a primary Tag, Placement, and authoring unit', () => {
    const catalog = catalogFixture();
    const problem = catalog.problems[0];
    if (!problem) throw new Error('Problem fixture is missing.');
    problem.primaryTagIds = [];
    problem.placementId = null;

    expect(codes(catalog)).toContain('PUBLISHED_PROBLEM_UNREACHABLE');
  });
});
