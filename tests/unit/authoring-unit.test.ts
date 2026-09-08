import { describe, expect, it } from 'vitest';

import {
  catalogContentDigest,
  deriveExecutableExampleInventory,
  executableExampleInventoryDigest,
  validateCatalogSemantics,
  type CatalogLike,
} from '../../src/lib/catalog/build-catalog.js';
import { ProblemAuthoringUnitSchema } from '../../src/lib/domain/schema-parts/authoring-unit.js';
import {
  CatalogSchema,
  CorrectionImpactSchema,
  LearningUnitSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const catalogFixture = () => CatalogSchema.parse(makeTrustedCatalog({}));
const sha = (character: string): string => character.repeat(64);

const addLearningUnitExecutableExample = (catalog: ReturnType<typeof catalogFixture>): void => {
  const unit = catalog.learningUnits[0];
  if (!unit) throw new Error('Fixture learning unit is missing.');
  unit.examples.push({
    key: 'unit-example',
    learningOutcomeIds: ['outcome-graphs'],
    kind: 'executable',
    language: 'text',
    omissions: [],
    environment: 'Fixture environment.',
    input: '1',
    procedure: ['Run fixture.'],
    executionTarget: 'tests/fixtures/authoring-skill/echo-input.ts',
    expectedResult: '1',
    verificationStatus: 'passed',
  });
  catalog.release.contentSnapshotDigest = catalogContentDigest(catalog);
};

const executableEvidence = (catalog: ReturnType<typeof catalogFixture>) => {
  const inventory = deriveExecutableExampleInventory(catalog);
  const subjectDigest = catalog.release.contentSnapshotDigest;
  return {
    path: 'docs/verification/examples.json',
    digest: sha('e'),
    evidence: {
      schemaVersion: '3.0.0' as const,
      releaseDigest: sha('r'),
      subjectDigest,
      inventoryDigest: executableExampleInventoryDigest(catalog),
      inventoryCount: inventory.length,
      checkedCount: inventory.length,
      passedCount: inventory.length,
      failedCount: 0,
      aggregatePassed: true,
      items: inventory.map((item, index) => ({
        ...item,
        subjectDigest,
        releaseDigest: sha('r'),
        environment: 'Fixture environment.',
        command: 'run-fixture',
        expectedResult: '1',
        actualResult: '1',
        exitCode: 0,
        passed: true,
        executedAt: `2026-07-17T12:0${String(index)}:00+09:00`,
        resultDigest: sha(String(index + 1)),
        evidencePath: 'docs/verification/examples.json',
      })),
      generatedAt: '2026-07-17T12:30:00+09:00',
    },
  };
};
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

  it('requires executable targets and rejects targets on non-executable examples', () => {
    const executableWithoutTarget = unitFixture();
    const executableExample = executableWithoutTarget.examples[0];
    if (!executableExample) throw new Error('Fixture example is missing.');
    executableExample.executionTarget = null;
    expect(ProblemAuthoringUnitSchema.safeParse(executableWithoutTarget).success).toBe(false);

    const illustrativeWithTarget = unitFixture();
    const illustrativeExample = illustrativeWithTarget.examples[0];
    if (!illustrativeExample) throw new Error('Fixture example is missing.');
    illustrativeExample.kind = 'illustrative';
    illustrativeExample.verificationStatus = 'not_applicable';
    expect(ProblemAuthoringUnitSchema.safeParse(illustrativeWithTarget).success).toBe(false);
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

  it('requires every abbreviated authoring unit to point directly to a full primary unit', () => {
    const catalog = catalogFixture();
    const unit = catalog.authoringUnits[0];
    if (!unit) throw new Error('Fixture authoring unit is missing.');
    unit.kind = 'similar';
    unit.primaryProblemId = 'abc212-missing';
    unit.differenceSummary = 'Missing primary fixture.';
    const missingCodes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(missingCodes).toContain('AUTHORING_PRIMARY_MISSING');

    unit.primaryProblemId = unit.problemId;
    unit.differenceSummary = 'Self-referential abbreviated fixture.';
    const codes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(codes).toContain('AUTHORING_PRIMARY_NOT_FULL');
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

  it('requires Learning Unit executable examples to be covered by owner-qualified evidence', () => {
    const catalog = catalogFixture();
    addLearningUnitExecutableExample(catalog);
    const trustedEvidence = {
      subjectDigest: sha('2'),
      checks: [],
      reviews: [],
      executableExampleEvidence: executableEvidence(catalog),
    };
    const codes = validateCatalogSemantics(catalog as CatalogLike, trustedEvidence).map(
      ({ code }) => code,
    );
    expect(codes).not.toContain('EXECUTABLE_EXAMPLE_EVIDENCE_MISMATCH');

    const missingEvidenceCodes = validateCatalogSemantics(catalog as CatalogLike).map(
      ({ code }) => code,
    );
    expect(missingEvidenceCodes).toContain('EXECUTABLE_EXAMPLE_EVIDENCE_REQUIRED');

    const staleEvidence = executableEvidence(catalog);
    staleEvidence.evidence.inventoryCount += 1;
    const staleCodes = validateCatalogSemantics(catalog as CatalogLike, {
      ...trustedEvidence,
      executableExampleEvidence: staleEvidence,
    }).map(({ code }) => code);
    expect(staleCodes).toContain('EXECUTABLE_EXAMPLE_EVIDENCE_MISMATCH');
  });

  it('keeps each Learning Unit example and attainment check in one strict document', () => {
    const unit = catalogFixture().learningUnits[0];
    if (!unit) throw new Error('Fixture learning unit is missing.');
    expect(LearningUnitSchema.safeParse(unit).success).toBe(true);
    expect(LearningUnitSchema.safeParse({ ...unit, examples: [] }).success).toBe(false);
    expect(LearningUnitSchema.safeParse({ ...unit, exercises: [] }).success).toBe(false);

    const example = unit.examples[0];
    const exercise = unit.exercises[0];
    if (!example || !exercise) throw new Error('Fixture Learning Unit blocks are missing.');
    expect(
      LearningUnitSchema.safeParse({ ...unit, examples: [example, structuredClone(example)] })
        .success,
    ).toBe(false);
    expect(
      LearningUnitSchema.safeParse({ ...unit, exercises: [exercise, structuredClone(exercise)] })
        .success,
    ).toBe(false);
  });

  it('separates canonical Unit ownership from descendant navigation coverage', () => {
    const unit = catalogFixture().learningUnits[0];
    if (!unit) throw new Error('Fixture learning unit is missing.');
    const owned = {
      ...unit,
      ownedTagIds: [...unit.tagIds],
      ownedLearningOutcomeIds: [...unit.learningOutcomeIds],
      examples: unit.examples.map((example) => ({
        ...example,
        learningUnitRole: 'guided_outcome' as const,
      })),
      exercises: unit.exercises.map((exercise) => ({
        ...exercise,
        learningUnitRole: 'outcome_attainment' as const,
      })),
    };
    expect(LearningUnitSchema.safeParse(owned).success).toBe(true);
    expect(
      LearningUnitSchema.safeParse({ ...owned, ownedLearningOutcomeIds: undefined }).success,
    ).toBe(false);
    expect(
      LearningUnitSchema.safeParse({
        ...owned,
        examples: owned.examples.map((example) =>
          Object.fromEntries(
            Object.entries(example).filter(([field]) => field !== 'learningUnitRole'),
          ),
        ),
      }).success,
    ).toBe(false);

    const routingOnly = {
      ...unit,
      ownedTagIds: [],
      ownedLearningOutcomeIds: [],
      examples: unit.examples.map((example) => ({
        ...example,
        learningUnitRole: 'curriculum_routing' as const,
      })),
      exercises: unit.exercises.map((exercise) => ({
        ...exercise,
        learningUnitRole: 'curriculum_routing' as const,
      })),
    };
    expect(LearningUnitSchema.safeParse(routingOnly).success).toBe(true);
  });

  it('validates Learning Unit outcome links and answer evidence before publication', () => {
    const catalog = catalogFixture();
    const unit = catalog.learningUnits[0];
    const exercise = unit?.exercises[0];
    if (!unit || !exercise) throw new Error('Fixture Learning Unit exercise is missing.');
    exercise.learningOutcomeIds = ['outcome-missing'];
    exercise.answer.verificationStatus = 'pending';

    const diagnostics = validateCatalogSemantics(catalog);
    expect(diagnostics.map(({ code }) => code)).toEqual(
      expect.arrayContaining(['CATALOG_REFERENCE_MISSING', 'LEARNING_UNIT_ANSWER_NOT_VERIFIED']),
    );
  });

  it('resolves owner-qualified Correction Impact locators against both document types', () => {
    const catalog = catalogFixture();
    catalog.correctionImpacts.push({
      id: 'correction-impact-invalid',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Invalid fixture correction.',
      affectedContentLocators: [
        { ownerType: 'problem', problemId: 'abc212-x45', path: 'sections.correctnes' },
      ],
      affectedLearningUnitOrderIds: [],
      derivedIndexPaths: ['src/content/docs/index.md'],
      verificationStatus: 'verified',
    });
    const invalidCodes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(invalidCodes).toContain('CORRECTION_IMPACT_CONTENT_NOT_FOUND');

    catalog.correctionImpacts.push({
      id: 'correction-impact-learning-unit',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Learning Unit fixture correction.',
      affectedContentLocators: [
        {
          ownerType: 'learning_unit',
          learningUnitId: 'unit-graphs',
          path: 'examples.unit-intuition',
        },
        {
          ownerType: 'learning_unit',
          learningUnitId: 'unit-graphs',
          path: 'exercises.unit-check.assessment',
        },
      ],
      affectedLearningUnitOrderIds: ['unit-graphs'],
      derivedIndexPaths: ['src/content/docs/index.md'],
      verificationStatus: 'verified',
    });
    const learningUnitCodes = validateCatalogSemantics(catalog as CatalogLike).filter(
      ({ entityId }) => entityId === 'correction-impact-learning-unit',
    );
    expect(learningUnitCodes).toEqual([]);

    catalog.correctionImpacts.push({
      id: 'correction-impact-learning-unit-invalid',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Unknown Learning Unit block correction.',
      affectedContentLocators: [
        {
          ownerType: 'learning_unit',
          learningUnitId: 'unit-graphs',
          path: 'examples.missing-example',
        },
      ],
      affectedLearningUnitOrderIds: [],
      derivedIndexPaths: [],
      verificationStatus: 'verified',
    });
    const missingBlockCodes = validateCatalogSemantics(catalog as CatalogLike)
      .filter(({ entityId }) => entityId === 'correction-impact-learning-unit-invalid')
      .map(({ code }) => code);
    expect(missingBlockCodes).toContain('CORRECTION_IMPACT_CONTENT_NOT_FOUND');

    catalog.correctionImpacts.push({
      id: 'correction-impact-missing-owner',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Missing owner fixture correction.',
      affectedContentLocators: [
        { ownerType: 'learning_unit', learningUnitId: 'unit-missing', path: 'content' },
      ],
      affectedLearningUnitOrderIds: [],
      derivedIndexPaths: [],
      verificationStatus: 'verified',
    });
    const missingOwnerCodes = validateCatalogSemantics(catalog as CatalogLike).map(
      ({ code }) => code,
    );
    expect(missingOwnerCodes).toContain('CORRECTION_IMPACT_LOCATOR_OWNER_MISSING');

    catalog.correctionImpacts.push({
      id: 'correction-impact-duplicate',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Duplicate fixture correction.',
      affectedContentLocators: [
        { ownerType: 'problem', problemId: 'abc212-x45', path: 'sections.correctness' },
        { ownerType: 'problem', problemId: 'abc212-x45', path: 'sections.correctness' },
      ],
      affectedLearningUnitOrderIds: ['unit-graphs', 'unit-graphs'],
      derivedIndexPaths: ['src/content/docs/index.md'],
      verificationStatus: 'verified',
    });
    const duplicateCodes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(duplicateCodes).toContain('CORRECTION_IMPACT_LOCATOR_DUPLICATE');

    const originalImpact = catalog.correctionImpacts[0];
    if (!originalImpact) throw new Error('Fixture correction impact is missing.');
    const emptyImpact = {
      ...originalImpact,
      id: 'correction-impact-empty',
      affectedContentLocators: [],
    };
    catalog.correctionImpacts.push(emptyImpact);
    const emptyCodes = validateCatalogSemantics(catalog as CatalogLike).map(({ code }) => code);
    expect(emptyCodes).toContain('CORRECTION_IMPACT_LOCATORS_EMPTY');

    expect(
      CorrectionImpactSchema.safeParse({
        ...originalImpact,
        affectedContentLocators: [
          { ownerType: 'learning_unit', problemId: 'abc212-x45', path: 'content' },
        ],
      }).success,
    ).toBe(false);
  });
});
