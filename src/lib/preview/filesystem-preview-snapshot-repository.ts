import { randomUUID } from 'node:crypto';
import { mkdir, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { PreviewSnapshot } from './preview-snapshot.js';
import type {
  PreviewSnapshotReference,
  PreviewSnapshotRepository,
  PreviewSnapshotTransaction,
} from './preview-snapshot-repository.js';

const previewIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const digestPattern = /^[a-f0-9]{64}$/u;

const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const relativePaths = (previewId: string, joinDigest: string) => {
  if (!previewIdPattern.test(previewId) || !digestPattern.test(joinDigest)) {
    throw new Error('PREVIEW_SNAPSHOT_KEY_INVALID');
  }
  return {
    snapshot: `staging/previews/${previewId}/snapshots/${joinDigest}.json`,
    reference: `docs/verification/previews/${previewId}/preview-join/${joinDigest}.json`,
    transaction: `staging/previews/${previewId}/transactions/${joinDigest}.json`,
  };
};

const serializedJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

export class FileSystemPreviewSnapshotRepository implements PreviewSnapshotRepository {
  constructor(private readonly repositoryRoot: string) {}

  getSnapshot(previewId: string, joinDigest: string): Promise<PreviewSnapshot | undefined> {
    return this.readJson<PreviewSnapshot>(relativePaths(previewId, joinDigest).snapshot);
  }

  createSnapshot(snapshot: PreviewSnapshot): Promise<void> {
    return this.writeJson(
      relativePaths(snapshot.previewId, snapshot.joinDigest).snapshot,
      snapshot,
      false,
    );
  }

  getReference(
    previewId: string,
    joinDigest: string,
  ): Promise<PreviewSnapshotReference | undefined> {
    return this.readJson<PreviewSnapshotReference>(relativePaths(previewId, joinDigest).reference);
  }

  saveReference(reference: PreviewSnapshotReference): Promise<void> {
    return this.writeJson(
      relativePaths(reference.previewId, reference.joinDigest).reference,
      reference,
      true,
    );
  }

  async deleteReference(previewId: string, joinDigest: string): Promise<void> {
    await unlink(this.absolutePath(relativePaths(previewId, joinDigest).reference)).catch(
      (error: unknown) => {
        if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
      },
    );
  }

  getTransaction(
    previewId: string,
    joinDigest: string,
  ): Promise<PreviewSnapshotTransaction | undefined> {
    return this.readJson<PreviewSnapshotTransaction>(
      relativePaths(previewId, joinDigest).transaction,
    );
  }

  saveTransaction(transaction: PreviewSnapshotTransaction): Promise<void> {
    return this.writeJson(
      relativePaths(transaction.previewId, transaction.joinDigest).transaction,
      transaction,
      true,
    );
  }

  private absolutePath(relativePath: string): string {
    return path.join(this.repositoryRoot, relativePath);
  }

  private async readJson<Value>(relativePath: string): Promise<Value | undefined> {
    try {
      return JSON.parse(await readFile(this.absolutePath(relativePath), 'utf8')) as Value;
    } catch (error) {
      if (isNodeError(error) && error.code === 'ENOENT') return undefined;
      if (error instanceof SyntaxError) {
        throw new Error(`PREVIEW_SNAPSHOT_JSON_INVALID:${relativePath}`, { cause: error });
      }
      throw error;
    }
  }

  /** Write through a same-directory temporary file; canonical snapshots are never replaced. */
  private async writeJson(relativePath: string, value: unknown, replace: boolean): Promise<void> {
    const destination = this.absolutePath(relativePath);
    await mkdir(path.dirname(destination), { recursive: true });
    const temporaryPath = path.join(
      path.dirname(destination),
      `.${path.basename(destination)}.${String(process.pid)}.${randomUUID()}.tmp`,
    );
    await writeFile(temporaryPath, serializedJson(value), {
      encoding: 'utf8',
      flag: 'wx',
      mode: 0o600,
    });
    let destinationReserved = false;
    try {
      if (!replace) {
        const reservation = await open(destination, 'wx', 0o600).catch((error: unknown) => {
          if (isNodeError(error) && error.code === 'EEXIST') {
            throw new Error('SNAPSHOT_ALREADY_EXISTS', { cause: error });
          }
          throw error;
        });
        destinationReserved = true;
        await reservation.close();
      }
      await rename(temporaryPath, destination);
    } catch (error) {
      if (destinationReserved) {
        await unlink(destination).catch((cleanupError: unknown) => {
          if (!isNodeError(cleanupError) || cleanupError.code !== 'ENOENT') throw cleanupError;
        });
      }
      throw error;
    } finally {
      await unlink(temporaryPath).catch((error: unknown) => {
        if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
      });
    }
  }
}
