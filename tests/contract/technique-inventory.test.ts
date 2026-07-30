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

  it('binds inventory evidence to the same Contest and official task', () => {
    const wrongTask = catalogFixture();
    const item = wrongTask.techniqueInventory[0];
    const source = wrongTask.sources[0];
    if (!item || !source) throw new Error('Technique Inventory fixture is incomplete.');
    wrongTask.sources.push({
      ...structuredClone(source),
      id: 'source-revision-abc212-f',
      url: 'https://atcoder.jp/contests/abc212/tasks/abc212_f',
      officialTaskId: 'abc212_f',
    });
    item.sourceRevisionIds = ['source-revision-abc212-f'];
    expect(diagnosticCodes(wrongTask)).toEqual(
      expect.arrayContaining([
        'TECHNIQUE_INVENTORY_SOURCE_TASK_MISMATCH',
        'TECHNIQUE_INVENTORY_PROBLEM_SOURCE_REQUIRED',
      ]),
    );

    const wrongContest = catalogFixture();
    const wrongContestItem = wrongContest.techniqueInventory[0];
    const wrongContestSource = wrongContest.sources[0];
    if (!wrongContestItem || !wrongContestSource) {
      throw new Error('Technique Inventory fixture is incomplete.');
    }
    wrongContest.sources.push({
      ...structuredClone(wrongContestSource),
      id: 'source-revision-abc213-e',
      url: 'https://atcoder.jp/contests/abc213/tasks/abc213_e',
      contestId: 'abc213',
      officialTaskId: 'abc213_e',
    });
    wrongContestItem.sourceRevisionIds = ['source-revision-abc213-e'];
    expect(diagnosticCodes(wrongContest)).toContain('TECHNIQUE_INVENTORY_SOURCE_CONTEST_MISMATCH');
  });

  it('does not accept a Contest index as the Problem-specific inventory source', () => {
    const catalog = catalogFixture();
    const item = catalog.techniqueInventory[0];
    const source = catalog.sources[0];
    if (!item || !source) throw new Error('Technique Inventory fixture is incomplete.');
    source.url = 'https://atcoder.jp/contests/abc212/tasks';
    source.sourceKind = 'official_contest';
    source.officialTaskId = null;

    expect(diagnosticCodes(catalog)).toContain('TECHNIQUE_INVENTORY_PROBLEM_SOURCE_REQUIRED');
  });

  it('rejects an official editorial bound to another task', () => {
    const catalog = catalogFixture();
    const item = catalog.techniqueInventory[0];
    const source = catalog.sources[0];
    if (!item || !source) throw new Error('Technique Inventory fixture is incomplete.');
    catalog.sources.push({
      ...structuredClone(source),
      id: 'source-revision-abc212-f-editorial',
      url: 'https://atcoder.jp/contests/abc212/editorial/9999',
      sourceKind: 'official_editorial',
      officialTaskId: 'abc212_f',
    });
    item.sourceRevisionIds = [source.id, 'source-revision-abc212-f-editorial'];

    expect(diagnosticCodes(catalog)).toContain('TECHNIQUE_INVENTORY_SOURCE_TASK_MISMATCH');
  });

  it('keeps inventory analysis independent from provisional Tag and LearningUnit IDs', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');

    expect(item).not.toHaveProperty('tagIds');
    expect(item).not.toHaveProperty('learningUnitIds');
    expect(item).not.toHaveProperty('provisionalTagIds');
    expect(item).not.toHaveProperty('provisionalLearningUnitIds');
  });

  it('requires a source-backed reasoning path, outcomes, and review advice', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');
    const requiredMutations = [
      { ...item, sourceRevisionIds: [] },
      {
        ...item,
        sourceRevisionIds: ['source-revision-abc212-e', 'source-revision-abc212-e'],
      },
      {
        ...item,
        reasoningPath: { ...item.reasoningPath, observations: [] },
      },
      {
        ...item,
        reasoningPath: { ...item.reasoningPath, keyInsights: [] },
      },
      { ...item, outcomeCandidates: [] },
      { ...item, reviewAdvice: [] },
    ];

    for (const invalid of requiredMutations) {
      expect(CatalogSchema.shape.techniqueInventory.element.safeParse(invalid).success).toBe(false);
    }

    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        asymptoticComplexity: {
          evidenceIds: item.reasoningPath.algorithmConnection.evidenceIds,
        },
      }).success,
    ).toBe(false);
    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        asymptoticComplexity: undefined,
      }).success,
    ).toBe(true);
  });

  it('rejects claim evidence outside the record source set and a reviewed analysis without an adopted approach', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');

    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        evidence: item.evidence.map((evidence, index) =>
          index === 0
            ? { ...evidence, sourceRevisionIds: ['source-revision-not-declared'] }
            : evidence,
        ),
      }).success,
    ).toBe(false);

    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        reasoningPath: {
          ...item.reasoningPath,
          algorithmConnection: {
            ...item.reasoningPath.algorithmConnection,
            evidenceIds: ['evidence-not-declared'],
          },
        },
      }).success,
    ).toBe(false);

    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        reasoningPath: {
          ...item.reasoningPath,
          candidateApproaches: item.reasoningPath.candidateApproaches.filter(
            ({ decision }) => decision === 'adopted',
          ),
        },
      }).success,
    ).toBe(true);
    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        reasoningPath: {
          ...item.reasoningPath,
          candidateApproaches: item.reasoningPath.candidateApproaches.filter(
            ({ decision }) => decision === 'rejected',
          ),
        },
      }).success,
    ).toBe(false);
  });

  it('allows optional learning parts to be omitted without inventing content', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');
    const omissionReason = {
      text: '公式Sourceから問題固有として分離する追加要素は確認できない。',
      evidenceIds: item.reasoningPath.algorithmConnection.evidenceIds,
    };

    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        problemSpecificInsights: [],
        reviewStatus: 'draft',
      }).success,
    ).toBe(true);
    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        problemSpecificInsights: [],
      }).success,
    ).toBe(false);
    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        problemSpecificInsights: [],
        problemSpecificInsightOmissionReason: omissionReason,
      }).success,
    ).toBe(true);
    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        problemSpecificInsightOmissionReason: omissionReason,
      }).success,
    ).toBe(false);
  });

  it('requires an unresolved finding only for changes-requested review state', () => {
    const item = catalogFixture().techniqueInventory[0];
    if (!item) throw new Error('Technique Inventory fixture is missing.');

    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        reviewStatus: 'changes_requested',
        reviewFindings: [],
      }).success,
    ).toBe(false);
    expect(
      CatalogSchema.shape.techniqueInventory.element.safeParse({
        ...item,
        reviewStatus: 'changes_requested',
        reviewFindings: ['採用理由を公式解説の該当箇所へ結び直す。'],
      }).success,
    ).toBe(true);
  });
});
