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
  hasDeployment(commit: string): Promise<boolean>;
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
 * The only publication boundary for static hosting. Snapshot selection and
 * rollback are both deployments of a full, already-known Git commit.
 */
export class GitDeploymentAdapter {
  private deploymentQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly repositoryRoot: string,
    private readonly target: CommitDeploymentTarget,
  ) {}

  deploy(releaseMetadata: unknown): Promise<CommitDeploymentResult> {
    return this.enqueue(releaseMetadata, 'release');
  }

  rollback(releaseMetadata: unknown): Promise<CommitDeploymentResult> {
    return this.enqueue(releaseMetadata, 'rollback');
  }

  private async enqueue(
    releaseMetadata: unknown,
    reason: DeploymentReason,
  ): Promise<CommitDeploymentResult> {
    const previousDeployment = this.deploymentQueue;
    let unlock: () => void = () => undefined;
    this.deploymentQueue = new Promise<void>((resolve) => {
      unlock = resolve;
    });
    await previousDeployment;
    try {
      return await this.deployKnownCommit(releaseMetadata, reason);
    } finally {
      unlock();
    }
  }

  private async deployKnownCommit(
    releaseMetadata: unknown,
    reason: DeploymentReason,
  ): Promise<CommitDeploymentResult> {
    const parsed = ReleaseMetadataSchema.safeParse(releaseMetadata);
    if (!parsed.success) {
      throw new GitDeploymentError('INVALID_RELEASE_METADATA', parsed.error.message);
    }
    const release = parsed.data;
    let resolvedCommit: string;
    try {
      const { stdout } = await execFileAsync(
        'git',
        ['rev-parse', '--verify', '--end-of-options', `${release.commit}^{commit}`],
        { cwd: this.repositoryRoot, encoding: 'utf8' },
      );
      resolvedCommit = stdout.trim();
    } catch {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        `${release.commit} is not a commit in the release repository.`,
      );
    }
    if (resolvedCommit !== release.commit) {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        `${release.commit} did not resolve to the exact release commit.`,
      );
    }
    if (reason === 'rollback' && !(await this.target.hasDeployment(release.commit))) {
      throw new GitDeploymentError(
        'UNKNOWN_RELEASE_COMMIT',
        `${release.commit} does not exist in the deployment history.`,
      );
    }
    return this.target.deployCommit({
      release,
      reason,
    });
  }
}
