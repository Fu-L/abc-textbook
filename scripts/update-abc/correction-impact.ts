import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

const affectedKinds = ['content', 'examples', 'exercises', 'answers', 'order', 'indexes'] as const;

export const enumerateCorrectionImpacts = (input: {
  readonly correctionId: string;
  readonly problemIds: readonly string[];
  readonly changedBlocks: readonly string[];
}) => ({
  correctionImpactId: `correction-impact-${canonicalDigest(input).slice(0, 20)}`,
  correctionId: input.correctionId,
  affectedProblemIds: [...input.problemIds],
  changedBlocks: [...input.changedBlocks],
  affectedKinds: [...affectedKinds],
});
