import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { buildFrozenPreviewSnapshot } from '../src/lib/preview/frozen-preview-join.js';
import { FileSystemPreviewSnapshotRepository } from '../src/lib/preview/filesystem-preview-snapshot-repository.js';
import { PreviewSnapshotCommitService } from '../src/lib/preview/preview-snapshot-repository.js';

const fixtureSelector = 'tests/fixtures/previews/initial-v1';
const usage = `Usage: preview-verify --fixture ${fixtureSelector}`;

export interface PreviewVerifyOptions {
  readonly repositoryRoot?: string;
  readonly fixture: string;
}

export interface PreviewVerifyResult {
  readonly command: 'preview:verify';
  readonly previewId: string;
  readonly joinDigest: string;
  readonly status: 'on_hold' | 'passed';
  readonly holdReasons: readonly string[];
  readonly snapshotPath: string;
  readonly referencePath: string;
  readonly transactionPath: string;
  readonly transactionPhase: string;
  readonly recovered: boolean;
}

class PreviewVerifyUsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreviewVerifyUsageError';
  }
}

const assertFixtureSelector = (repositoryRoot: string, fixture: string): void => {
  if (path.resolve(repositoryRoot, fixture) !== path.resolve(repositoryRoot, fixtureSelector)) {
    throw new PreviewVerifyUsageError('FIXTURE_NOT_ALLOWED');
  }
};

export const runPreviewVerify = async (
  options: PreviewVerifyOptions,
): Promise<PreviewVerifyResult> => {
  const repositoryRoot = options.repositoryRoot ?? process.cwd();
  assertFixtureSelector(repositoryRoot, options.fixture);
  const snapshot = await buildFrozenPreviewSnapshot(repositoryRoot);
  const repository = new FileSystemPreviewSnapshotRepository(repositoryRoot);
  const service = new PreviewSnapshotCommitService(repository);
  let recovered = false;
  let existingReadFailed = false;
  let existing;
  try {
    existing = await repository.getSnapshot(snapshot.previewId, snapshot.joinDigest);
  } catch {
    existingReadFailed = true;
  }
  const transaction =
    existing || existingReadFailed
      ? await (async () => {
          recovered = true;
          return service.recover(snapshot.previewId, snapshot.joinDigest);
        })()
      : await service.commit(snapshot);
  const recoveryHold =
    transaction.phase === 'verified'
      ? []
      : [`RECOVERY_REQUIRED:${transaction.recoveryReason ?? transaction.phase}`];
  const holdReasons = [...new Set([...snapshot.holdReasons, ...recoveryHold])];
  return {
    command: 'preview:verify',
    previewId: snapshot.previewId,
    joinDigest: snapshot.joinDigest,
    status: holdReasons.length === 0 && transaction.phase === 'verified' ? 'passed' : 'on_hold',
    holdReasons,
    snapshotPath: transaction.canonicalSnapshotPath,
    referencePath: transaction.referencePath,
    transactionPath: `staging/previews/${snapshot.previewId}/transactions/${snapshot.joinDigest}.json`,
    transactionPhase: transaction.phase,
    recovered,
  };
};

const parseArguments = (args: readonly string[]): PreviewVerifyOptions => {
  if (args.length !== 2 || args[0] !== '--fixture' || !args[1]) {
    throw new PreviewVerifyUsageError('ARGUMENTS_INVALID');
  }
  return { fixture: args[1] };
};

const isMain = (): boolean =>
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain()) {
  try {
    const result = await runPreviewVerify(parseArguments(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exitCode = result.status === 'passed' ? 0 : 2;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.stderr.write(`${usage}\n`);
    process.stdout.write(
      `${JSON.stringify({ command: 'preview:verify', exitCode: error instanceof PreviewVerifyUsageError ? 64 : 2 })}\n`,
    );
    process.exitCode = error instanceof PreviewVerifyUsageError ? 64 : 2;
  }
}
