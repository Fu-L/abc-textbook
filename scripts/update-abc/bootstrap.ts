import { stagePublicationUpdate } from './stage.js';
import { persistPublicationUpdate, runUpdatePipeline } from './index.js';
import { pathToFileURL } from 'node:url';

export const bootstrapPreviewSeed = (input: {
  readonly previewId: string;
  readonly problemIds: readonly string[];
  readonly snapshotDigest: string;
  readonly artifacts: readonly {
    readonly entityType: 'source' | 'technique_inventory' | 'learning_unit' | 'placement';
    readonly entityId: string;
    readonly path: string;
    readonly digest: string;
    readonly affectedProblemIds: readonly string[];
  }[];
}) =>
  stagePublicationUpdate({
    previewId: input.previewId,
    contestId: null,
    sourceSetFingerprint: input.snapshotDigest,
    targetProblemIds: input.problemIds,
    operations: input.artifacts.map((artifact) => ({
      entityType: artifact.entityType,
      entityId: artifact.entityId,
      action: 'add' as const,
      path: artifact.path,
      beforeDigest: null,
      afterDigest: artifact.digest,
      affectedProblemIds: artifact.affectedProblemIds,
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
