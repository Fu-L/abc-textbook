import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CatalogSchema,
  LearningUnitSchema,
  SourceRevisionSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { readProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';
import {
  enumerateCanonicalCorrectionImpact,
  verifyCanonicalCorrectionTargets,
} from '../../src/lib/catalog/correction-targets.js';

describe('canonical correction target validation', () => {
  it('enumerates full owners and actual optional blocks without the retired standard order', () => {
    const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
    const source = catalog.sources[0];
    const problem = catalog.authoringUnits[0];
    if (!source || !problem) throw new Error('Missing fixture owners.');
    problem.examples = [];
    problem.exercises = [];
    const input = {
      catalog,
      correctionId: 'correction-source',
      sourceRevisionId: source.id,
      sourceRevisionIds: [source.id, 'source-previous-revision'],
      problemIds: [problem.problemId],
      changeSummary: 'Correct the official source.',
      derivedIndexPaths: ['index.json'],
    };
    const impact = enumerateCanonicalCorrectionImpact(input);
    expect(enumerateCanonicalCorrectionImpact(input)).toEqual(impact);
    expect(impact.sourceRevisionIds).toContain('source-previous-revision');
    expect(new Set(impact.affectedContentLocators.map((locator) => locator.ownerType))).toEqual(
      new Set(['problem', 'learning_unit', 'problem_placement', 'learning_prerequisites']),
    );
    expect(
      impact.affectedContentLocators
        .filter((locator) => locator.ownerType === 'problem')
        .some((locator) => locator.path.startsWith('examples.')),
    ).toBe(false);
    expect(JSON.stringify(impact)).not.toMatch(/standard_order|learning-order/);
    expect(impact.verificationStatus).toBe('pending');
  });
  it('checks real owners, local blocks, placement, prerequisites and regenerated indexes', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'abc-correction-target-'));
    try {
      const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
      await writeFile(path.join(root, 'unit.md'), 'authored unit');
      await writeFile(path.join(root, 'problem.md'), 'authored problem');
      await writeFile(
        path.join(root, 'placements.json'),
        JSON.stringify({ placements: [{ problemId: 'abc212-x45' }] }),
      );
      await writeFile(
        path.join(root, 'index.json'),
        JSON.stringify({ problemIds: ['abc212-x45'] }),
      );
      const authoring = catalog.authoringUnits[0];
      const unit = catalog.learningUnits[0];
      const source = catalog.sources[0];
      if (!authoring || !unit || !source) throw new Error('Missing fixture owners.');
      authoring.docPath = 'problem.md';
      unit.docPath = 'unit.md';
      const impact = {
        id: 'impact-test',
        sourceRevisionId: source.id,
        changeSummary: 'Fix reasoning and navigation.',
        verificationStatus: 'pending',
        derivedIndexPaths: ['index.json'],
        affectedContentLocators: [
          { ownerType: 'problem', problemId: 'abc212-x45', path: 'sections.reasoning' },
          { ownerType: 'learning_unit', learningUnitId: 'unit-graphs', path: 'content' },
          { ownerType: 'problem_placement', problemId: 'abc212-x45', path: 'placements.json' },
        ],
      };
      const input = {
        impact,
        catalog,
        readTarget: (file: string) => readFile(path.join(root, file)),
        indexProjections: new Map<string, unknown>([
          ['index.json', { problemIds: ['abc212-x45'] }],
        ]),
      };
      const result = await verifyCanonicalCorrectionTargets(input);
      expect(result.verificationStatus).toBe('verified');
      expect(result.targets).toHaveLength(3);
      expect(result.derivedIndexes[0]?.digest).toMatch(/^[a-f0-9]{64}$/);
      expect(impact.verificationStatus).toBe('pending');
      await writeFile(path.join(root, 'index.json'), JSON.stringify({ problemIds: [] }));
      await expect(verifyCanonicalCorrectionTargets(input)).rejects.toThrow(
        'CORRECTION_INDEX_STALE',
      );
      await writeFile(
        path.join(root, 'index.json'),
        JSON.stringify({ problemIds: ['abc212-x45'] }),
      );
      await expect(
        verifyCanonicalCorrectionTargets({
          ...input,
          impact: {
            ...impact,
            affectedContentLocators: [
              { ownerType: 'problem', problemId: 'abc212-x45', path: 'examples.nonexistent' },
            ],
          },
        }),
      ).rejects.toThrow('CORRECTION_TARGET_MISSING');
      await writeFile(path.join(root, 'placements.json'), JSON.stringify({ placements: [] }));
      await expect(verifyCanonicalCorrectionTargets(input)).rejects.toThrow(
        'CORRECTION_PLACEMENT_MISSING',
      );
      await expect(
        verifyCanonicalCorrectionTargets({
          ...input,
          impact: { ...impact, sourceRevisionId: 'source-missing' },
        }),
      ).rejects.toThrow('CORRECTION_SOURCE_MISSING');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it('checks related-only units from both sides of a classification change', async () => {
    const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
    const problem = catalog.authoringUnits[0];
    const source = catalog.sources[0];
    const home = catalog.learningUnits[0];
    if (!problem || !source || !home) throw new Error('Missing fixture owners.');
    const relatedUnit = (id: string, relatedProblemIds: string[]) => ({
      ...structuredClone(home),
      id,
      docPath: `${id}.md`,
      problemIds: [],
      relatedProblemIds,
      sourceRevisionIds: ['source-representative-unrelated'],
    });
    catalog.learningUnits.push(
      relatedUnit('unit-former-supporting', []),
      relatedUnit('unit-additional-primary', [problem.problemId]),
      relatedUnit('unit-unrelated', []),
    );
    const previousCatalog = structuredClone(catalog);
    const formerUnit = previousCatalog.learningUnits[1];
    const newUnit = previousCatalog.learningUnits[2];
    if (!formerUnit || !newUnit) throw new Error('Missing related units.');
    formerUnit.relatedProblemIds = [problem.problemId];
    newUnit.relatedProblemIds = [];
    const impact = enumerateCanonicalCorrectionImpact({
      catalog,
      previousCatalog,
      correctionId: 'correction-classification',
      sourceRevisionId: source.id,
      sourceRevisionIds: [source.id],
      problemIds: [problem.problemId],
      changeSummary: 'Move the supporting role to an additional primary skill.',
      derivedIndexPaths: [],
    });
    const relatedLocators = impact.affectedContentLocators.filter(
      (locator) => locator.ownerType === 'learning_unit',
    );
    expect(new Set(relatedLocators.map((locator) => locator.learningUnitId))).toEqual(
      new Set([home.id, 'unit-former-supporting', 'unit-additional-primary']),
    );
    expect(
      relatedLocators
        .filter((locator) => locator.learningUnitId === 'unit-former-supporting')
        .map((locator) => locator.path),
    ).toEqual(
      expect.arrayContaining([
        'content',
        'examples.unit-intuition',
        'exercises.unit-check',
        'exercises.unit-check.assessment',
        'exercises.unit-check.answer',
      ]),
    );
    const prerequisites = {
      schemaVersion: '1.0.0',
      sourceBuild: { id: 'build-test', digest: 'a'.repeat(64), acceptedAt: '2026-10-05T00:00:00Z' },
      tagPrerequisites: [],
      learningOutcomePrerequisites: [],
      learningUnitPrerequisites: [],
      tagDagDigest: canonicalDigest([]),
      learningOutcomeDagDigest: canonicalDigest([]),
      learningUnitDagDigest: canonicalDigest([]),
    };
    const documents = new Map([
      [problem.docPath, 'Current problem prose.'],
      [home.docPath, 'Current home prose.'],
      ['unit-former-supporting.md', 'The former supporting relation has been removed.'],
      ['unit-additional-primary.md', 'This problem teaches the additional primary skill.'],
      [
        'src/content/policies/problem-placements.json',
        JSON.stringify({ placements: [{ problemId: problem.problemId }] }),
      ],
      ['src/content/policies/learning-prerequisites.json', JSON.stringify(prerequisites)],
    ]);
    const input = {
      impact,
      catalog,
      indexProjections: new Map<string, unknown>(),
      readTarget: (file: string) => {
        const text = documents.get(file);
        return text
          ? Promise.resolve(Buffer.from(text))
          : Promise.reject(new Error(`Missing prose: ${file}`));
      },
    };
    const result = await verifyCanonicalCorrectionTargets(input);
    expect(result.targets.map((target) => target.documentPath)).toEqual(
      expect.arrayContaining(['unit-former-supporting.md', 'unit-additional-primary.md']),
    );
    documents.delete('unit-former-supporting.md');
    await expect(verifyCanonicalCorrectionTargets(input)).rejects.toThrow(
      'Missing prose: unit-former-supporting.md',
    );
  });
  it.each([
    [
      'abc267-e',
      'hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001',
    ],
    [
      'abc282-ex',
      'hybrid/outcome-divide-search-space-recursively/outcome-divide-search-space-recursively-shard-001',
    ],
    [
      'abc295-g',
      'graph-search/outcome-contract-monotone-paths-with-jump-pointers/outcome-contract-monotone-paths-with-jump-pointers-shard-001',
    ],
  ])('includes the actual related unit prose when correcting %s', async (problemId, directory) => {
    const catalog = CatalogSchema.parse(makeTrustedCatalog({}));
    const unit = LearningUnitSchema.parse(
      JSON.parse(
        await readFile('src/content/learning-units/unit-amortized-monotone-progress.json', 'utf8'),
      ) as unknown,
    );
    const problem = readProblemAuthoringDocument(
      await readFile(`src/content/docs/problems/${directory}/${problemId}.md`, 'utf8'),
    ).unit;
    expect(unit.relatedProblemIds).toContain(problemId);
    expect(unit.problemIds).not.toContain(problemId);
    expect(unit.sourceRevisionIds.some((id) => problem.sourceRevisionIds.includes(id))).toBe(false);
    catalog.learningUnits = [unit];
    catalog.authoringUnits = [problem];
    catalog.sources = await Promise.all(
      problem.sourceRevisionIds.map(async (id) =>
        SourceRevisionSchema.parse(
          JSON.parse(
            await readFile(`src/content/sources/abc264-abc315/${id}.json`, 'utf8'),
          ) as unknown,
        ),
      ),
    );
    const sourceRevisionId = problem.sourceRevisionIds[0];
    if (!sourceRevisionId) throw new Error('Missing canonical source revision.');
    const impact = enumerateCanonicalCorrectionImpact({
      catalog,
      correctionId: `correction-${problemId}`,
      sourceRevisionId,
      sourceRevisionIds: problem.sourceRevisionIds,
      problemIds: [problemId],
      changeSummary: 'Recheck the role of the amortized analysis.',
      derivedIndexPaths: [],
    });
    const proseLocator = impact.affectedContentLocators.find(
      (locator) =>
        locator.ownerType === 'learning_unit' &&
        locator.learningUnitId === unit.id &&
        locator.path === 'content',
    );
    expect(proseLocator).toBeDefined();
    if (!proseLocator) throw new Error('Missing related prose locator.');
    const result = await verifyCanonicalCorrectionTargets({
      impact: { ...impact, affectedContentLocators: [proseLocator] },
      catalog,
      readTarget: (file) => readFile(file),
      indexProjections: new Map<string, unknown>(),
    });
    expect(result.targets[0]).toMatchObject({ locator: proseLocator, documentPath: unit.docPath });
    expect(result.targets[0]?.digest).toMatch(/^[a-f0-9]{64}$/);
  });
});
