import { describe, expect, it } from 'vitest';

import { validateCatalogSemantics, type CatalogLike } from '../../src/lib/catalog/build-catalog.js';
import { ProblemAuthoringUnitSchema } from '../../src/lib/domain/schema-parts/authoring-unit.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const catalogFixture = () => CatalogSchema.parse(makeTrustedCatalog({}));
const unitFixture = () => {
  const unit = catalogFixture().authoringUnits[0];
  if (!unit) throw new Error('Fixture authoring unit is missing.');
  return structuredClone(unit);
};

describe('Problem authoring unit', () => {
  it('keeps one complete Problem explanation in one strict authoring document', () => {
    const unit = unitFixture();
    expect(ProblemAuthoringUnitSchema.safeParse(unit).success).toBe(true);
    expect(ProblemAuthoringUnitSchema.safeParse({ ...unit, unexpected: true }).success).toBe(false);
  });

  it('uses document-local keys without allowing ambiguous duplicate locators', () => {
    const unit = unitFixture();
    const example = unit.examples[0];
    if (!example) throw new Error('Fixture example is missing.');
    unit.examples.push(structuredClone(example));
    expect(ProblemAuthoringUnitSchema.safeParse(unit).success).toBe(false);
  });

  it('keeps abbreviated Problems small while binding them to a full primary Problem', () => {
    const full = unitFixture();
    const abbreviated = {
      ...full,
      kind: 'similar',
      primaryProblemId: 'abc300-f',
      differenceSummary: 'Only the constraint bound differs.',
      sections: {
        differences: 'Reuse the primary proof with the documented bound change.',
        implementationNotes: 'Use a wider integer type.',
      },
    };
    expect(ProblemAuthoringUnitSchema.safeParse(abbreviated).success).toBe(true);
    expect(
      ProblemAuthoringUnitSchema.safeParse({ ...abbreviated, primaryProblemId: null }).success,
    ).toBe(false);
  });

  it('requires executable examples, claims, and answers to pass before publication', () => {
    const catalog = catalogFixture();
    const unit = catalog.authoringUnits[0];
    if (!unit) throw new Error('Fixture authoring unit is missing.');
    const claim = unit.claims[0];
    const example = unit.examples[0];
    const exercise = unit.exercises[0];
    if (!claim || !example || !exercise) throw new Error('Fixture authoring blocks are missing.');
    claim.verificationStatus = 'stale';
    example.verificationStatus = 'failed';
    exercise.answer.verificationStatus = 'pending';

    const codes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(codes).toEqual(
      expect.arrayContaining([
        'AUTHORING_CLAIM_NOT_VERIFIED',
        'AUTHORING_EXAMPLE_NOT_VERIFIED',
        'AUTHORING_ANSWER_NOT_VERIFIED',
      ]),
    );
  });

  it('retains traceability to shared Outcome, Unit, Tag, and Source entities', () => {
    const catalog = catalogFixture();
    const unit = catalog.authoringUnits[0];
    if (!unit) throw new Error('Fixture authoring unit is missing.');
    const claim = unit.claims[0];
    const example = unit.examples[0];
    if (!claim || !example) throw new Error('Fixture authoring blocks are missing.');
    claim.sourceRevisionIds = ['source-missing'];
    example.learningOutcomeIds = ['outcome-missing'];
    example.learningUnitIds = ['unit-missing'];
    unit.tagIds = ['tag-missing'];

    const diagnostics = validateCatalogSemantics(catalog);
    expect(diagnostics.filter(({ code }) => code === 'CATALOG_REFERENCE_MISSING')).toHaveLength(4);
  });
});
