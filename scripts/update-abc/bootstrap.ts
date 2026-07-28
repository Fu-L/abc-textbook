import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { stagePublicationUpdate } from './stage.js';
import { pathToFileURL } from 'node:url';
import { persistPublicationUpdate, runUpdatePipeline } from './index.js';

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

const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  const result = await runUpdatePipeline({ fixture: 'initial-v1' });
  await persistPublicationUpdate(result);
  const { publicationUpdate: _publicationUpdate, command: _command, ...summary } = result;
  void _publicationUpdate;
  void _command;
  process.stdout.write(`${JSON.stringify({ command: 'release:bootstrap', ...summary })}\n`);
  process.exitCode = result.state === 'ELIGIBLE_FOR_BATCH' ? 0 : 2;
}
