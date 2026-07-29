import { LearningRecordBackupSchema } from '../domain/schema-parts/learning.js';
import { listLearningRecords } from './store.js';
import type { LearningRecordDatabase } from './types.js';

export interface ExportLearningRecordsOptions {
  readonly catalogVersion: string;
  readonly catalogProblemIds: ReadonlySet<string>;
  readonly exportedAt?: string;
}

export async function exportLearningRecords(
  database: LearningRecordDatabase,
  options: ExportLearningRecordsOptions,
) {
  const records = (await listLearningRecords(database)).toSorted((left, right) =>
    left.problemId.localeCompare(right.problemId),
  );
  const orphanedProblemIds = records
    .filter(({ problemId }) => !options.catalogProblemIds.has(problemId))
    .map(({ problemId }) => problemId);
  return LearningRecordBackupSchema.parse({
    schemaVersion: '1.0.0',
    exportedAt: options.exportedAt ?? new Date().toISOString(),
    catalogVersionAtExport: options.catalogVersion,
    records,
    orphanedProblemIds,
  });
}

export async function exportLearningRecordsJson(
  database: LearningRecordDatabase,
  options: ExportLearningRecordsOptions,
) {
  return `${JSON.stringify(await exportLearningRecords(database, options), null, 2)}\n`;
}
