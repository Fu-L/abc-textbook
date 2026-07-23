import { canonicalDigest } from '../domain/canonical-json.js';
import {
  assertPreviewSnapshotIntegrity,
  type PreviewSnapshot,
  type PreviewStatus,
} from './preview-snapshot.js';

export type PreviewSnapshotTransactionPhase =
  'prepared' | 'snapshot_committed' | 'reference_committed' | 'verified' | 'recovery_required';

export interface PreviewSnapshotReference {
  readonly previewId: string;
  readonly joinDigest: string;
  readonly canonicalSnapshotPath: string;
  readonly canonicalSnapshotDigest: string;
  readonly status: PreviewStatus;
  readonly transactionId: string;
}

export interface PreviewSnapshotTransaction {
  readonly transactionId: string;
  readonly previewId: string;
  readonly joinDigest: string;
  readonly canonicalSnapshotPath: string;
  readonly referencePath: string;
  readonly phase: PreviewSnapshotTransactionPhase;
  readonly canonicalSnapshotDigest: string | null;
  readonly recoveryReason: string | null;
}

/**
 * Storage boundary used by the commit service. The future filesystem adapter
 * implements these operations with same-directory temp-file/rename semantics;
 * tests can supply an in-memory adapter without changing the service contract.
 */
export interface PreviewSnapshotRepository {
  getSnapshot(previewId: string, joinDigest: string): Promise<PreviewSnapshot | undefined>;
  createSnapshot(snapshot: PreviewSnapshot): Promise<void>;
  getReference(
    previewId: string,
    joinDigest: string,
  ): Promise<PreviewSnapshotReference | undefined>;
  saveReference(reference: PreviewSnapshotReference): Promise<void>;
  deleteReference(previewId: string, joinDigest: string): Promise<void>;
  getTransaction(
    previewId: string,
    joinDigest: string,
  ): Promise<PreviewSnapshotTransaction | undefined>;
  saveTransaction(transaction: PreviewSnapshotTransaction): Promise<void>;
}

const transactionPaths = (previewId: string, joinDigest: string) => ({
  canonicalSnapshotPath: `staging/previews/${previewId}/snapshots/${joinDigest}.json`,
  referencePath: `docs/verification/previews/${previewId}/preview-join/${joinDigest}.json`,
});

const transactionId = (previewId: string, joinDigest: string): string =>
  `preview-snapshot:${previewId}:${joinDigest}`;

export interface PreviewSnapshotCommitOptions {
  readonly interruptAfterSnapshot?: boolean;
}

export class PreviewSnapshotCommitService {
  constructor(private readonly repository: PreviewSnapshotRepository) {}

  async commit(
    snapshot: PreviewSnapshot,
    options: PreviewSnapshotCommitOptions = {},
  ): Promise<PreviewSnapshotTransaction> {
    assertPreviewSnapshotIntegrity(snapshot, snapshot.joinDigest);
    const existing = await this.repository.getSnapshot(snapshot.previewId, snapshot.joinDigest);
    if (existing) throw new Error('SNAPSHOT_ALREADY_EXISTS');

    const paths = transactionPaths(snapshot.previewId, snapshot.joinDigest);
    const baseTransaction: PreviewSnapshotTransaction = {
      transactionId: transactionId(snapshot.previewId, snapshot.joinDigest),
      previewId: snapshot.previewId,
      joinDigest: snapshot.joinDigest,
      ...paths,
      phase: 'prepared',
      canonicalSnapshotDigest: null,
      recoveryReason: null,
    };
    await this.repository.saveTransaction(baseTransaction);
    await this.repository.createSnapshot(snapshot);

    const snapshotCommitted: PreviewSnapshotTransaction = {
      ...baseTransaction,
      phase: 'snapshot_committed',
      canonicalSnapshotDigest: canonicalDigest(snapshot),
    };
    await this.repository.saveTransaction(snapshotCommitted);
    if (options.interruptAfterSnapshot) throw new Error('INTERRUPTED_AFTER_SNAPSHOT');

    await this.writeReference(snapshot.previewId, snapshot.joinDigest);
    const referenceCommitted: PreviewSnapshotTransaction = {
      ...snapshotCommitted,
      phase: 'reference_committed',
    };
    await this.repository.saveTransaction(referenceCommitted);
    const verified: PreviewSnapshotTransaction = {
      ...referenceCommitted,
      phase: 'verified',
    };
    await this.repository.saveTransaction(verified);
    return verified;
  }

  async recover(previewId: string, joinDigest: string): Promise<PreviewSnapshotTransaction> {
    const paths = transactionPaths(previewId, joinDigest);
    const current = await this.repository.getTransaction(previewId, joinDigest);
    const baseTransaction: PreviewSnapshotTransaction = current ?? {
      transactionId: transactionId(previewId, joinDigest),
      previewId,
      joinDigest,
      ...paths,
      phase: 'prepared',
      canonicalSnapshotDigest: null,
      recoveryReason: null,
    };
    const snapshot = await this.repository.getSnapshot(previewId, joinDigest);
    if (!snapshot) {
      const recoveryRequired: PreviewSnapshotTransaction = {
        ...baseTransaction,
        phase: 'recovery_required',
        recoveryReason: 'CANONICAL_SNAPSHOT_MISSING',
      };
      await this.repository.saveTransaction(recoveryRequired);
      return recoveryRequired;
    }

    try {
      assertPreviewSnapshotIntegrity(snapshot, joinDigest);
    } catch {
      await this.repository.deleteReference(previewId, joinDigest);
      const recoveryRequired: PreviewSnapshotTransaction = {
        ...baseTransaction,
        phase: 'recovery_required',
        canonicalSnapshotDigest: null,
        recoveryReason: 'CANONICAL_SNAPSHOT_DIGEST_MISMATCH',
      };
      await this.repository.saveTransaction(recoveryRequired);
      return recoveryRequired;
    }

    const reference = await this.repository.getReference(previewId, joinDigest);
    const expectedSnapshotDigest = canonicalDigest(snapshot);
    const referenceIsCurrent =
      reference?.previewId === previewId &&
      reference.joinDigest === joinDigest &&
      reference.canonicalSnapshotPath === paths.canonicalSnapshotPath &&
      reference.canonicalSnapshotDigest === expectedSnapshotDigest &&
      reference.status === snapshot.status &&
      reference.transactionId === baseTransaction.transactionId;
    if (!referenceIsCurrent) {
      await this.writeReference(previewId, joinDigest);
    }

    const referenceCommitted: PreviewSnapshotTransaction = {
      ...baseTransaction,
      phase: 'reference_committed',
      canonicalSnapshotDigest: expectedSnapshotDigest,
      recoveryReason: null,
    };
    await this.repository.saveTransaction(referenceCommitted);
    const verified: PreviewSnapshotTransaction = {
      ...referenceCommitted,
      phase: 'verified',
    };
    await this.repository.saveTransaction(verified);
    return verified;
  }

  private async writeReference(previewId: string, joinDigest: string): Promise<void> {
    const snapshot = await this.repository.getSnapshot(previewId, joinDigest);
    if (!snapshot) throw new Error('CANONICAL_SNAPSHOT_MISSING');
    assertPreviewSnapshotIntegrity(snapshot, joinDigest);
    const paths = transactionPaths(previewId, joinDigest);
    await this.repository.saveReference({
      previewId,
      joinDigest,
      canonicalSnapshotPath: paths.canonicalSnapshotPath,
      canonicalSnapshotDigest: canonicalDigest(snapshot),
      status: snapshot.status,
      transactionId: transactionId(previewId, joinDigest),
    });
  }
}
