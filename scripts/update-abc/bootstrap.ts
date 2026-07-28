import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { stagePublicationUpdate } from './stage.js';

export const bootstrapPreviewSeed = (input: {
  readonly previewId: string;
  readonly problemIds: readonly string[];
  readonly snapshotDigest: string;
}) =>
  stagePublicationUpdate({
    previewId: input.previewId,
    contestId: null,
    sourceSetFingerprint: input.snapshotDigest,
    targetProblemIds: input.problemIds,
    operations: input.problemIds.map((problemId) => ({
      entityType: 'problem' as const,
      entityId: problemId,
      action: 'add' as const,
      path: `staging/previews/${input.previewId}/release-simulation/bootstrap/${problemId}.json`,
      beforeDigest: null,
      afterDigest: canonicalDigest({ problemId, snapshotDigest: input.snapshotDigest }),
      affectedProblemIds: [problemId],
    })),
  });
