import type { LearningRecordMergePolicySchema } from '../domain/schema-parts/learning.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
import type { z } from 'zod';
import type { LearningRecordImportPreview } from './import-preview.js';
import type { LearningRecord, LearningRecordDatabase } from './types.js';

export type LearningRecordMergePolicy = z.infer<typeof LearningRecordMergePolicySchema>;

function mergeNewer(incoming: LearningRecord, local: LearningRecord | null): LearningRecord {
  if (!local) return incoming;
  const statusFromBackup =
    local.statusUpdatedAt === null ||
    (incoming.statusUpdatedAt !== null &&
      compareOffsetDateTimes(
        parseOffsetDateTime(incoming.statusUpdatedAt),
        parseOffsetDateTime(local.statusUpdatedAt),
      ) > 0);
  const reviewFromBackup =
    local.needsReviewUpdatedAt === null ||
    (incoming.needsReviewUpdatedAt !== null &&
      compareOffsetDateTimes(
        parseOffsetDateTime(incoming.needsReviewUpdatedAt),
        parseOffsetDateTime(local.needsReviewUpdatedAt),
      ) > 0);
  return {
    problemId: incoming.problemId,
    status: statusFromBackup ? incoming.status : local.status,
    statusUpdatedAt: statusFromBackup ? incoming.statusUpdatedAt : local.statusUpdatedAt,
    needsReview: reviewFromBackup ? incoming.needsReview : local.needsReview,
    needsReviewUpdatedAt: reviewFromBackup
      ? incoming.needsReviewUpdatedAt
      : local.needsReviewUpdatedAt,
  };
}

export interface ImportApplyResult {
  readonly appliedCount: number;
  readonly skippedCount: number;
  readonly cancelled: boolean;
}

export async function applyLearningRecordImport(
  database: LearningRecordDatabase,
  preview: LearningRecordImportPreview,
  policy: LearningRecordMergePolicy,
): Promise<ImportApplyResult> {
  if (policy === 'cancel') {
    return { appliedCount: 0, skippedCount: preview.items.length, cancelled: true };
  }
  if (!preview.applicable) throw new Error('無効な項目を含むバックアップは適用できません。');

  const candidates = preview.items.filter(
    (item) =>
      item.incoming !== null && (policy === 'backup-wins' || item.classification !== 'same'),
  );
  const transaction = database.transaction('readwrite');
  try {
    for (const item of candidates) {
      const incoming = item.incoming;
      if (!incoming) continue;
      const current = (await transaction.get(incoming.problemId)) ?? null;
      await transaction.put(policy === 'backup-wins' ? incoming : mergeNewer(incoming, current));
    }
    await transaction.done;
    return {
      appliedCount: candidates.length,
      skippedCount: preview.items.length - candidates.length,
      cancelled: false,
    };
  } catch (error) {
    try {
      transaction.abort();
    } catch {
      // A failed IndexedDB request may have aborted the transaction already.
    }
    throw new Error('復元に失敗したため、変更をすべて取り消しました。', { cause: error });
  }
}
