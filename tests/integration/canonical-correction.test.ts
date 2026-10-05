import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
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
});
