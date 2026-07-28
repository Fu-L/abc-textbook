import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

const affectedKinds = ['content', 'examples', 'exercises', 'answers', 'order', 'indexes'] as const;

export interface CorrectionLocator {
  readonly problemId: string;
  readonly contentPath: string;
  readonly orderPath: string;
  readonly indexPaths: readonly string[];
}

export const enumerateCorrectionImpacts = (input: {
  readonly correctionId: string;
  readonly problemIds: readonly string[];
  readonly changedBlocks: readonly string[];
  readonly locators?: readonly CorrectionLocator[];
}) => ({
  correctionImpactId: `correction-impact-${canonicalDigest(input).slice(0, 20)}`,
  correctionId: input.correctionId,
  affectedProblemIds: [...input.problemIds],
  changedBlocks: [...input.changedBlocks],
  affectedKinds: [...affectedKinds],
  affectedSurfaces: input.problemIds.flatMap((problemId) => {
    const locator = input.locators?.find((candidate) => candidate.problemId === problemId);
    if (!locator) throw new Error(`CORRECTION_LOCATOR_MISSING:${problemId}`);
    return [
      { problemId, kind: 'content', path: locator.contentPath, locator: '$.explanation' },
      { problemId, kind: 'examples', path: locator.contentPath, locator: '$.examples' },
      { problemId, kind: 'exercises', path: locator.contentPath, locator: '$.exercises' },
      { problemId, kind: 'answers', path: locator.contentPath, locator: '$.exercises[*].answer' },
      { problemId, kind: 'order', path: locator.orderPath, locator: '$.standardUnitOrder' },
      ...locator.indexPaths.map((indexPath) => ({
        problemId,
        kind: 'indexes',
        path: indexPath,
        locator: `problem:${problemId}`,
      })),
    ];
  }),
});
