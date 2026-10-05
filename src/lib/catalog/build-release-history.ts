import { canonicalJson } from '../domain/canonical-json.js';
import { CatalogSchema } from '../domain/schema-parts/catalog.js';
import { ReleaseMetadataSchema } from '../domain/schema-parts/release.js';

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
  if (
    release.heldProblemIds.length ||
    release.validationSummary.blockingFindingCount ||
    !release.validationSummary.checkCount ||
    release.validationSummary.passedCheckCount !== release.validationSummary.checkCount ||
    release.validationSummary.checks.some((check) => !check.passed || check.exitCode !== 0) ||
    !release.humanContentReviewEvidenceRefs.length
  )
    throw new Error('RELEASE_HISTORY_INCOMPLETE');
  return freeze({
    ...structuredClone(metadata),
    validatedAt: release.validatedAt,
    firstContestId: release.firstContestId,
    lastContestId: release.lastContestId,
    contestCount: release.contestCount,
    problemCount: release.problemCount,
    validationSummary: structuredClone(release.validationSummary),
    reviewEvidenceRefs: structuredClone(release.humanContentReviewEvidenceRefs),
    changelogPath: release.changelogPath,
  });
};
export type PublicReleaseHistoryEntry = ReturnType<typeof projectRelease>;

/** Historical catalogs must be read from their metadata commits by the caller;
 * never project old releases using the current catalog. The previous projection
 * is an append-only consistency check, not another release transaction.
 */
export const buildReleaseHistory = (
  records: readonly { readonly metadata: unknown; readonly catalog: unknown }[],
  previous: readonly PublicReleaseHistoryEntry[] = [],
): readonly PublicReleaseHistoryEntry[] => {
  const entries = records
    .map(projectRelease)
    .sort((a, b) => a.version.localeCompare(b.version, 'en'));
  if (
    new Set(entries.map((entry) => entry.version)).size !== entries.length ||
    new Set(entries.map((entry) => entry.commit)).size !== entries.length
  )
    throw new Error('RELEASE_HISTORY_DUPLICATE');
  if (
    previous.some(
      (entry, index) => !entries[index] || canonicalJson(entries[index]) !== canonicalJson(entry),
    )
  )
    throw new Error('RELEASE_HISTORY_REWRITE');
  return freeze(entries);
};

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
