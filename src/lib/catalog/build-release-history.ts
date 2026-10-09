import { z } from 'zod';
import { canonicalJson } from '../domain/canonical-json.js';
import { CatalogSchema, CatalogReleaseSchema } from '../domain/schema-parts/catalog.js';
import { ReleaseMetadataSchema } from '../domain/schema-parts/release.js';

/** Serialized public history contains only records of actual published commits. */
export const PublicReleaseHistoryEntrySchema = ReleaseMetadataSchema.unwrap().extend({
  validatedAt: CatalogReleaseSchema.shape.validatedAt,
  firstContestId: CatalogReleaseSchema.shape.firstContestId,
  lastContestId: CatalogReleaseSchema.shape.lastContestId,
  contestCount: CatalogReleaseSchema.shape.contestCount,
  problemCount: CatalogReleaseSchema.shape.problemCount,
  validationSummary: CatalogReleaseSchema.shape.validationSummary,
  reviewEvidenceRefs: CatalogReleaseSchema.shape.humanContentReviewEvidenceRefs,
  agentQualityReviewEvidenceRef: CatalogReleaseSchema.shape.agentQualityReviewEvidenceRef,
  changelogPath: CatalogReleaseSchema.shape.changelogPath,
});

/** Existing order is authoritative; repeated version identifiers cannot share a route. */
export const PublicReleaseHistorySchema = z
  .array(PublicReleaseHistoryEntrySchema)
  .superRefine((entries, context) => {
    if (new Set(entries.map(({ version }) => version)).size !== entries.length)
      context.addIssue({ code: 'custom', message: 'RELEASE_HISTORY_DUPLICATE' });
  });

const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach((child: unknown) => freeze(child));
    Object.freeze(value);
  }
  return value;
};

const projectRelease = (record: { readonly metadata: unknown; readonly catalog: unknown }) => {
  const metadata = ReleaseMetadataSchema.parse(record.metadata);
  const { release } = CatalogSchema.parse(record.catalog);
  if (
    metadata.version !== release.version ||
    metadata.cutoffAt !== release.cutoffAt ||
    canonicalJson(metadata.changeSummary) !==
      canonicalJson({
        updateIds: release.updateIds,
        addedProblemIds: release.addedProblemIds,
        changedProblemIds: release.changedProblemIds,
        withdrawnProblemIds: release.withdrawnProblemIds,
        taxonomyChanges: release.taxonomyChanges.map((change) => change.summary),
      })
  )
    throw new Error('RELEASE_HISTORY_SUMMARY_MISMATCH');
  const summary = release.validationSummary;
  if (
    release.publicationStatus === 'prepared' ||
    release.heldProblemIds.length ||
    (summary !== undefined &&
      (summary.blockingFindingCount ||
        !summary.checkCount ||
        summary.passedCheckCount !== summary.checkCount ||
        summary.checks.some((check) => !check.passed || check.exitCode !== 0)))
  )
    throw new Error('RELEASE_HISTORY_INCOMPLETE');
  return freeze({
    ...structuredClone(metadata),
    validatedAt: release.validatedAt,
    firstContestId: release.firstContestId,
    lastContestId: release.lastContestId,
    contestCount: release.contestCount,
    problemCount: release.problemCount,
    ...(summary !== undefined ? { validationSummary: structuredClone(summary) } : {}),
    ...(release.humanContentReviewEvidenceRefs !== undefined
      ? { reviewEvidenceRefs: structuredClone(release.humanContentReviewEvidenceRefs) }
      : {}),
    ...(release.agentQualityReviewEvidenceRef
      ? { agentQualityReviewEvidenceRef: structuredClone(release.agentQualityReviewEvidenceRef) }
      : {}),
    changelogPath: release.changelogPath,
  });
};
export type PublicReleaseHistoryEntry = z.infer<typeof PublicReleaseHistoryEntrySchema>;

/** Historical catalogs must be read from their metadata commits by the caller;
 * never project old releases using the current catalog. The previous projection
 * is an append-only consistency check, not another release transaction.
 */
export const buildReleaseHistory = (
  records: readonly { readonly metadata: unknown; readonly catalog: unknown }[],
  previous: readonly PublicReleaseHistoryEntry[] = [],
): readonly PublicReleaseHistoryEntry[] => {
  // Input follows actual publication order; run identifiers are not sortable versions.
  const entries = records.map(projectRelease);
  if (new Set(entries.map((entry) => entry.version)).size !== entries.length)
    throw new Error('RELEASE_HISTORY_DUPLICATE');
  if (
    previous.some(
      (entry, index) => !entries[index] || canonicalJson(entries[index]) !== canonicalJson(entry),
    )
  )
    throw new Error('RELEASE_HISTORY_REWRITE');
  return freeze(entries);
};

/** Caller confirms Pages/Actions before projecting the delivered prepared artifact. */
export function appendReleaseHistory(
  record: { readonly metadata: unknown; readonly catalog: unknown },
  previous: readonly PublicReleaseHistoryEntry[],
) {
  PublicReleaseHistorySchema.parse(previous);
  const catalog = CatalogSchema.parse(record.catalog);
  // The source artifact stays prepared; publication is recorded only in the history.
  catalog.release.publicationStatus = 'published';
  const entry = projectRelease({ ...record, catalog });
  const existing = previous.find(({ version }) => version === entry.version);
  if (existing) {
    const identity = ({
      schemaVersion,
      version,
      cutoffAt,
      commit,
      validationResultsUrl,
      changeSummary,
      firstContestId,
      lastContestId,
      contestCount,
      problemCount,
    }: PublicReleaseHistoryEntry) => ({
      schemaVersion,
      version,
      cutoffAt,
      commit,
      validationResultsUrl,
      changeSummary,
      firstContestId,
      lastContestId,
      contestCount,
      problemCount,
    });
    if (canonicalJson(identity(existing)) !== canonicalJson(identity(entry)))
      throw new Error('RELEASE_HISTORY_REWRITE');
    return previous;
  }
  const contests = [...catalog.contests].sort((a, b) => a.number - b.number);
  if (
    catalog.release.contestCount !== contests.length ||
    catalog.release.problemCount !== catalog.problems.length ||
    catalog.release.slotRecordCount !== catalog.contestSlots.length ||
    catalog.release.firstContestId !== contests[0]?.id ||
    catalog.release.lastContestId !== contests.at(-1)?.id
  )
    throw Error('RELEASE_HISTORY_RANGE_MISMATCH');
  return freeze([...previous, entry]);
}

interface UpdateStatus {
  readonly updateId: string;
  readonly state: string;
  readonly fixtureMode: boolean;
  readonly targetProblemIds: readonly string[];
  readonly updatedAt: string;
  readonly authoringResults: readonly {
    readonly problemId: string;
    readonly resultType: string;
    readonly reasonCode: string | null;
    readonly reason: string | null;
    readonly retryCondition: string | null;
  }[];
  readonly validationSummary: {
    readonly problemResults: readonly {
      readonly problemId: string;
      readonly findingCodes: readonly string[];
      readonly remediation: string | null;
    }[];
  };
}

/** Administrator-only data. Write it under staging, never a public content root. */
export const buildAdministratorHoldSummary = (updates: readonly UpdateStatus[]) =>
  updates
    .filter((update) => update.state !== 'ELIGIBLE_FOR_BATCH')
    .map((update) => ({
      updateId: update.updateId,
      state: update.state,
      fixtureMode: update.fixtureMode,
      updatedAt: update.updatedAt,
      problems: update.targetProblemIds.map((problemId) => {
        const authoring = update.authoringResults.find((item) => item.problemId === problemId);
        const validation = update.validationSummary.problemResults.find(
          (item) => item.problemId === problemId,
        );
        return {
          problemId,
          resultType: authoring?.resultType ?? 'blocked',
          reasonCode: authoring?.reasonCode ?? (authoring ? null : 'AUTHORING_RESULT_MISSING'),
          reason: authoring?.reason ?? null,
          retryCondition: authoring?.retryCondition ?? null,
          findingCodes: validation?.findingCodes ?? ['VALIDATION_RESULT_MISSING'],
          remediation: validation?.remediation ?? null,
        };
      }),
    }))
    .sort((a, b) => a.updateId.localeCompare(b.updateId, 'en'));
