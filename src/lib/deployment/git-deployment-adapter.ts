import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { ReleaseMetadataSchema, type ReleaseMetadata } from '../domain/schema-parts/release.js';

const execFileAsync = promisify(execFile);

export type DeploymentReason = 'release' | 'rollback';

export interface CommitDeploymentRequest {
  readonly release: ReleaseMetadata;
  readonly reason: DeploymentReason;
}

export interface CommitDeploymentResult {
  readonly deploymentUrl: string;
}

export interface CommitDeploymentTarget {
  getDeployment(commit: string): Promise<ReleaseMetadata | undefined>;
  deployCommit(request: CommitDeploymentRequest): Promise<CommitDeploymentResult>;
}

export class GitDeploymentError extends Error {
  readonly code: 'INVALID_RELEASE_METADATA' | 'UNKNOWN_RELEASE_COMMIT';

  constructor(code: GitDeploymentError['code'], message: string) {
    super(`${code}: ${message}`);
    this.name = 'GitDeploymentError';
    this.code = code;
  }
}

/**
 * A small adapter around static hosting. Protected-main checks remain the
 * responsibility of CI; this boundary verifies exact local object IDs and
 * delegates deployment history to the hosting target.
 */
export class GitDeploymentAdapter {
  private deploymentQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly repositoryRoot: string,
    private readonly target: CommitDeploymentTarget,
  ) {}

  deploy(releaseMetadata: unknown): Promise<CommitDeploymentResult> {
    return this.enqueue(() => this.deployRelease(releaseMetadata));
  }

  rollback(commit: unknown): Promise<CommitDeploymentResult> {
    return this.enqueue(() => this.rollbackToCommit(commit));
  }

  private async enqueue(operation: () => Promise<CommitDeploymentResult>) {
    const previousDeployment = this.deploymentQueue;
    let unlock: () => void = () => undefined;
    this.deploymentQueue = new Promise<void>((resolve) => {
      unlock = resolve;
    });
    await previousDeployment;
    try {
      return await operation();
    } finally {
      unlock();
    }
  }

  private async deployRelease(releaseMetadata: unknown): Promise<CommitDeploymentResult> {
    const parsed = ReleaseMetadataSchema.safeParse(releaseMetadata);
    if (!parsed.success) {
      throw new GitDeploymentError('INVALID_RELEASE_METADATA', parsed.error.message);
    }
    const release = parsed.data;
    await this.resolveExactCommit(release.commit);
    return this.target.deployCommit({ release, reason: 'release' });
  }

  private async rollbackToCommit(commit: unknown): Promise<CommitDeploymentResult> {
    if (typeof commit !== 'string' || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(commit)) {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        'Rollback requires a full Git commit object ID.',
      );
    }
    await this.resolveExactCommit(commit);
    const recordedMetadata = await this.target.getDeployment(commit);
    if (recordedMetadata === undefined) {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        `${commit} does not exist in the deployment history.`,
      );
    }
    const parsed = ReleaseMetadataSchema.safeParse(recordedMetadata);
    if (!parsed.success || parsed.data.commit !== commit) {
      throw new GitDeploymentError(
        'INVALID_RELEASE_METADATA',
        `Deployment history returned invalid metadata for ${commit}.`,
      );
    }
    return this.target.deployCommit({ release: parsed.data, reason: 'rollback' });
  }

  private async resolveExactCommit(commit: string): Promise<string> {
    let resolvedCommit: string;
    try {
      const { stdout } = await execFileAsync(
        'git',
        ['rev-parse', '--verify', '--end-of-options', `${commit}^{commit}`],
        { cwd: this.repositoryRoot, encoding: 'utf8' },
      );
      resolvedCommit = stdout.trim();
    } catch {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        `${commit} is not a commit in the release repository.`,
      );
    }
    if (resolvedCommit !== commit) {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        `${commit} did not resolve to the exact release commit.`,
      );
    }
    return resolvedCommit;
  }
}
