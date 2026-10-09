import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { CorrectionImpactSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { enumerateCanonicalCorrectionImpact } from '../../src/lib/catalog/correction-targets.js';

export interface CorrectionLocator {
  readonly problemId: string;
  readonly learningUnitId: string;
  readonly exampleKey: string;
  readonly exerciseKey: string;
  readonly indexPaths: readonly string[];
}

export const enumerateCorrectionImpacts = (
  input:
    | Parameters<typeof enumerateCanonicalCorrectionImpact>[0]
    | {
        readonly correctionId: string;
        readonly sourceRevisionId: string;
        readonly problemIds: readonly string[];
        readonly changedBlocks: readonly string[];
        readonly locators: readonly CorrectionLocator[];
      },
) => {
  if ('catalog' in input) return enumerateCanonicalCorrectionImpact(input);
  const locators = input.problemIds.map((problemId) => {
    const locator = input.locators.find((candidate) => candidate.problemId === problemId);
    if (!locator) throw new Error(`CORRECTION_LOCATOR_MISSING:${problemId}`);
    return locator;
  });
  const subject = {
    sourceRevisionId: input.sourceRevisionId,
    correctionId: input.correctionId,
    problemIds: input.problemIds,
    changedBlocks: input.changedBlocks,
  };
  return CorrectionImpactSchema.parse({
    id: `correction-impact-${canonicalDigest(subject).slice(0, 20)}`,
    sourceRevisionId: input.sourceRevisionId,
    changeSummary: `${input.correctionId}: ${input.changedBlocks.join(', ')}`,
    affectedContentLocators: locators.flatMap((locator) => [
      {
        ownerType: 'learning_unit' as const,
        learningUnitId: locator.learningUnitId,
        path: 'content' as const,
      },
      {
        ownerType: 'learning_unit' as const,
        learningUnitId: locator.learningUnitId,
        path: `examples.${locator.exampleKey}`,
      },
      {
        ownerType: 'learning_unit' as const,
        learningUnitId: locator.learningUnitId,
        path: `exercises.${locator.exerciseKey}`,
      },
      {
        ownerType: 'learning_unit' as const,
        learningUnitId: locator.learningUnitId,
        path: `exercises.${locator.exerciseKey}.answer`,
      },
    ]),
    derivedIndexPaths: [...new Set(locators.flatMap(({ indexPaths }) => indexPaths))],
    verificationStatus: 'pending',
  });
};
