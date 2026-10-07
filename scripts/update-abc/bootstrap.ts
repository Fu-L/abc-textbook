import { stagePublicationUpdate } from './stage.js';
import { persistPublicationUpdate, runUpdatePipeline } from './index.js';
import { pathToFileURL } from 'node:url';
import { prepareSeedRelease } from '../release/prepare-seed.js';
import { parseKeyValueArguments } from '../corpus/cli-support.js';
import { acceptSeedAgentReview } from '../release/accept-seed-agent-review.js';

export const bootstrapPreviewSeed = (input: {
  readonly previewId: string;
  readonly problemIds: readonly string[];
  readonly snapshotDigest: string;
  readonly artifacts: readonly {
    readonly entityType:
      'contest' | 'problem' | 'source' | 'technique_inventory' | 'learning_unit' | 'placement';
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
    allowRepositoryPaths: true,
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
  if (!process.argv.includes('--fixture')) {
    try {
      const args = parseKeyValueArguments(process.argv.slice(2), [
        '--first',
        '--last',
        '--mode',
        '--version',
        '--review-policy',
        '--acceptance',
      ]);
      if (args.get('--first') !== '212' || args.get('--last') !== '466')
        throw new Error('INITIAL_RELEASE_RANGE: --first 212 --last 466 is required.');
      const mode = args.get('--mode') ?? 'inputs';
      if (mode !== 'inputs' && mode !== 'evidence') throw new Error('INITIAL_RELEASE_MODE');
      const policy = args.get('--review-policy') ?? 'third-party';
      if (!['third-party', 'solo-maintainer'].includes(policy))
        throw new Error('INITIAL_REVIEW_POLICY');
      const acceptance = args.get('--acceptance');
      if (acceptance && (acceptance !== 'agent-quality-review' || policy !== 'solo-maintainer'))
        throw new Error('INITIAL_ACCEPTANCE_POLICY');
      const result = await prepareSeedRelease(
        mode,
        args.get('--version'),
        policy === 'solo-maintainer',
      );
      if (mode === 'evidence' && acceptance === 'agent-quality-review')
        await acceptSeedAgentReview();
      process.stdout.write(
        `${JSON.stringify({ ...result, ...(acceptance ? { acceptanceMode: 'agent_quality_review' } : {}) })}\n`,
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 2;
    }
  } else {
    const args = parseKeyValueArguments(process.argv.slice(2), ['--fixture']);
    if (args.get('--fixture') !== 'initial-v1') throw new Error('BOOTSTRAP_FIXTURE_INVALID');
    const result = await runUpdatePipeline({ fixture: 'initial-v1' });
    await persistPublicationUpdate(result);
    const { publicationUpdate: _publicationUpdate, command: _command, ...summary } = result;
    void _publicationUpdate;
    void _command;
    process.stdout.write(`${JSON.stringify({ command: 'release:bootstrap', ...summary })}\n`);
    process.exitCode = result.state === 'ELIGIBLE_FOR_BATCH' ? 0 : 2;
  }
}
