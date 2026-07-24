import { describe, expect, it } from 'vitest';

import { validateCatalogSemantics, type CatalogLike } from '../../src/lib/catalog/build-catalog.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const catalogFixture = () => CatalogSchema.parse(makeTrustedCatalog({}));
const diagnosticCodes = (catalog: CatalogLike): string[] =>
  validateCatalogSemantics(catalog).map(({ code }) => code);

describe('US2 Technique Inventory contract', () => {
  it('requires exactly one inventory record for every scoped Problem', () => {
    const missing = catalogFixture();
    missing.techniqueInventory = [];
    expect(diagnosticCodes(missing)).toContain('TECHNIQUE_INVENTORY_MISSING');

    const duplicate = catalogFixture();
    const item = duplicate.techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');
    duplicate.techniqueInventory.push(structuredClone(item));
    expect(diagnosticCodes(duplicate)).toContain('DUPLICATE_TECHNIQUE_INVENTORY_PROBLEM');
  });

  it('rejects an inventory record whose source revision is absent from the Catalog', () => {
    const catalog = catalogFixture();
    const item = catalog.techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');
    item.sourceRevisionIds = ['source-revision-missing'];

    expect(diagnosticCodes(catalog)).toContain('CATALOG_REFERENCE_MISSING');
  });

  it('keeps inventory analysis independent from provisional Tag and LearningUnit IDs', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');

    expect(item).not.toHaveProperty('tagIds');
    expect(item).not.toHaveProperty('learningUnitIds');
    expect(item).not.toHaveProperty('provisionalTagIds');
    expect(item).not.toHaveProperty('provisionalLearningUnitIds');
  });

  it('requires source-backed method, proof, complexity, and outcome analysis', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');
    const requiredMutations = [
      { ...item, sourceRevisionIds: [] },
      { ...item, coreMethod: '' },
      { ...item, proofIdeas: [] },
      { ...item, asymptoticComplexity: { time: '', space: '' } },
      { ...item, outcomeCandidates: [] },
    ];

    for (const invalid of requiredMutations) {
      expect(CatalogSchema.shape.techniqueInventory.element.safeParse(invalid).success).toBe(false);
    }
  });
});
