import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
import {
  LearningRecordBackupSchema,
  LearningRecordSchema,
} from '../domain/schema-parts/learning.js';
import type { LearningRecord } from './types.js';

export const IMPORT_CLASSIFICATIONS = [
  'new',
  'updated',
  'same',
  'unknown_problem_id',
  'invalid_item',
] as const;
export type ImportClassification = (typeof IMPORT_CLASSIFICATIONS)[number];

export interface ComponentImportDecision {
  readonly component: 'status' | 'needsReview';
  readonly source: 'backup' | 'local' | 'same';
  readonly reason: string;
  readonly result: string | boolean;
}

export interface LearningRecordImportPreviewItem {
  readonly problemId: string;
  readonly classification: ImportClassification;
  readonly reason: string;
  readonly incoming: LearningRecord | null;
  readonly local: LearningRecord | null;
  readonly components: readonly ComponentImportDecision[];
}

export interface LearningRecordImportPreview {
  readonly schemaVersion: '1.0.0';
  readonly items: readonly LearningRecordImportPreviewItem[];
  readonly counts: Readonly<Record<ImportClassification, number>>;
  readonly applicable: boolean;
}

const problemIdPattern = /^abc\d{3,}-[a-z][a-z0-9+_-]*$/u;

function isValidEnvelope(input: unknown): boolean {
  if (
    !input ||
    typeof input !== 'object' ||
    !('records' in input) ||
    !Array.isArray(Reflect.get(input, 'records'))
  ) {
    return false;
  }
  const parsed = LearningRecordBackupSchema.safeParse(input);
  if (parsed.success) return true;
  // Invalid and duplicate records are reported as item-level classifications below.
  // Every other issue is an envelope/backup-contract failure and blocks apply.
  return parsed.error.issues.every(({ path }) => path[0] === 'records');
}

function compareComponent(
  component: 'status' | 'needsReview',
  incoming: LearningRecord,
  local: LearningRecord,
): ComponentImportDecision {
  const timestampKey = component === 'status' ? 'statusUpdatedAt' : 'needsReviewUpdatedAt';
  const incomingTimestamp = incoming[timestampKey];
  const localTimestamp = local[timestampKey];
  const result = incoming[component];
  const valuesEqual = incoming[component] === local[component];
  if (
    incomingTimestamp === localTimestamp ||
    (incomingTimestamp !== null &&
      localTimestamp !== null &&
      compareOffsetDateTimes(
        parseOffsetDateTime(incomingTimestamp),
        parseOffsetDateTime(localTimestamp),
      ) === 0)
  ) {
    return {
      component,
      source: valuesEqual ? 'same' : 'local',
      reason: valuesEqual
        ? 'component_values_and_timestamps_equal'
        : 'timestamp_tie_local_preserved',
      result: local[component],
    };
  }
  if (
    localTimestamp === null ||
    (incomingTimestamp !== null &&
      compareOffsetDateTimes(
        parseOffsetDateTime(incomingTimestamp),
        parseOffsetDateTime(localTimestamp),
      ) > 0)
  ) {
    return { component, source: 'backup', reason: 'backup_component_is_newer', result };
  }
  return {
    component,
    source: 'local',
    reason: 'local_component_is_newer',
    result: local[component],
  };
}

export function previewLearningRecordImport(
  input: unknown,
  localRecords: readonly LearningRecord[],
  catalogProblemIds: ReadonlySet<string>,
): LearningRecordImportPreview {
  const envelope =
    input && typeof input === 'object'
      ? (input as { readonly records?: unknown })
      : { records: undefined };
  const rawRecords = Array.isArray(envelope.records) ? envelope.records : [];
  const localById = new Map(localRecords.map((record) => [record.problemId, record]));
  const seenIds = new Set<string>();
  const items: LearningRecordImportPreviewItem[] = rawRecords.map((rawRecord, index) => {
    const rawId =
      rawRecord && typeof rawRecord === 'object' && 'problemId' in rawRecord
        ? String(Reflect.get(rawRecord, 'problemId'))
        : `abc000-invalid-${String(index + 1)}`;
    const parsed = LearningRecordSchema.safeParse(rawRecord);
    if (!parsed.success || seenIds.has(rawId)) {
      return {
        problemId: problemIdPattern.test(rawId) ? rawId : `abc000-invalid-${String(index + 1)}`,
        classification: 'invalid_item',
        reason: seenIds.has(rawId) ? 'duplicate_problem_id' : 'schema_validation_failed',
        incoming: null,
        local: localById.get(rawId) ?? null,
        components: [],
      };
    }
    seenIds.add(rawId);
    const incoming = parsed.data;
    const local = localById.get(incoming.problemId) ?? null;
    if (!catalogProblemIds.has(incoming.problemId)) {
      return {
        problemId: incoming.problemId,
        classification: 'unknown_problem_id',
        reason: 'problem_id_not_in_current_catalog',
        incoming,
        local,
        components: [],
      };
    }
    if (!local) {
      return {
        problemId: incoming.problemId,
        classification: 'new',
        reason: 'no_local_record',
        incoming,
        local: null,
        components: [],
      };
    }
    const components = [
      compareComponent('status', incoming, local),
      compareComponent('needsReview', incoming, local),
    ];
    const same = components.every(({ source }) => source === 'same');
    return {
      problemId: incoming.problemId,
      classification: same ? 'same' : 'updated',
      reason: same ? 'all_components_equal' : 'component_merge_available',
      incoming,
      local,
      components,
    };
  });
  if (!isValidEnvelope(input)) {
    items.unshift({
      problemId: 'abc000-invalid-envelope',
      classification: 'invalid_item',
      reason: 'unsupported_or_missing_backup_schema',
      incoming: null,
      local: null,
      components: [],
    });
  }
  const counts = Object.fromEntries(
    IMPORT_CLASSIFICATIONS.map((classification) => [
      classification,
      items.filter((item) => item.classification === classification).length,
    ]),
  ) as Record<ImportClassification, number>;
  return {
    schemaVersion: '1.0.0',
    items,
    counts,
    applicable: counts.invalid_item === 0,
  };
}
