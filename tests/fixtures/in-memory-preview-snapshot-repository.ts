import type { PreviewSnapshot } from '../../src/lib/preview/preview-snapshot.js';
import type {
  PreviewSnapshotReference,
  PreviewSnapshotRepository,
  PreviewSnapshotTransaction,
} from '../../src/lib/preview/preview-snapshot-repository.js';

const repositoryKey = (previewId: string, joinDigest: string): string =>
  `${previewId}/${joinDigest}`;

/** In-memory adapter used to drive the production commit service without filesystem I/O. */
export class InMemoryPreviewSnapshotRepository implements PreviewSnapshotRepository {
  private readonly snapshots = new Map<string, PreviewSnapshot>();
  private readonly references = new Map<string, PreviewSnapshotReference>();
  private readonly transactions = new Map<string, PreviewSnapshotTransaction>();

  getSnapshot(previewId: string, joinDigest: string): Promise<PreviewSnapshot | undefined> {
    const snapshot = this.snapshots.get(repositoryKey(previewId, joinDigest));
    return Promise.resolve(snapshot ? structuredClone(snapshot) : undefined);
  }

  createSnapshot(snapshot: PreviewSnapshot): Promise<void> {
    const key = repositoryKey(snapshot.previewId, snapshot.joinDigest);
    if (this.snapshots.has(key)) return Promise.reject(new Error('SNAPSHOT_ALREADY_EXISTS'));
    this.snapshots.set(key, structuredClone(snapshot));
    return Promise.resolve();
  }

  getReference(
    previewId: string,
    joinDigest: string,
  ): Promise<PreviewSnapshotReference | undefined> {
    const reference = this.references.get(repositoryKey(previewId, joinDigest));
    return Promise.resolve(reference ? structuredClone(reference) : undefined);
  }

  saveReference(reference: PreviewSnapshotReference): Promise<void> {
    this.references.set(
      repositoryKey(reference.previewId, reference.joinDigest),
      structuredClone(reference),
    );
    return Promise.resolve();
  }

  deleteReference(previewId: string, joinDigest: string): Promise<void> {
    this.references.delete(repositoryKey(previewId, joinDigest));
    return Promise.resolve();
  }

  getTransaction(
    previewId: string,
    joinDigest: string,
  ): Promise<PreviewSnapshotTransaction | undefined> {
    const transaction = this.transactions.get(repositoryKey(previewId, joinDigest));
    return Promise.resolve(transaction ? structuredClone(transaction) : undefined);
  }

  saveTransaction(transaction: PreviewSnapshotTransaction): Promise<void> {
    this.transactions.set(
      repositoryKey(transaction.previewId, transaction.joinDigest),
      structuredClone(transaction),
    );
    return Promise.resolve();
  }

  /** Failure injection for recovery tests; a filesystem adapter must never expose this operation. */
  replaceSnapshotForFailureInjection(snapshot: PreviewSnapshot): void {
    this.snapshots.set(
      repositoryKey(snapshot.previewId, snapshot.joinDigest),
      structuredClone(snapshot),
    );
  }
}
