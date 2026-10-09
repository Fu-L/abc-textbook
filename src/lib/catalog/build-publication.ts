import type { z } from 'zod';
import { CatalogSchema } from '../domain/schema-parts/catalog.js';
import { createBuildReleaseMetadata } from '../../../scripts/release/build-history.js';
import { canonicalJson } from '../domain/canonical-json.js';
import type { PublicReleaseHistoryEntry } from './build-release-history.js';
import type { BuildPublication } from '../../../scripts/config/publication.js';
import type { VerificationChange } from '../../../scripts/verify/runner.js';

type Catalog = z.infer<typeof CatalogSchema>;

/** Generate identity and summary, never a record of successful publication. */
export function buildPublicationCandidate(
  source: Catalog,
  publication: BuildPublication,
  changes: readonly VerificationChange[] | null,
  history: readonly PublicReleaseHistoryEntry[],
  readBefore?: (file: string) => string | undefined,
) {
  const release = source.release;
  const added = new Set<string>(),
    changed = new Set<string>(),
    withdrawn = new Set<string>();
  const taxonomyChanges: Catalog['release']['taxonomyChanges'] = [];
  // Without a comparison, never label the textbook change set as empty.
  // This is a conservative affected scope, not the history-only shortcut.
  if (changes === null) for (const problem of source.problems) changed.add(problem.id);
  for (const change of changes ?? []) {
    const problemId = /\/(abc\d+-[a-z0-9]+)\.(?:md|json)$/u.exec(change.file)?.[1];
    if (problemId && /^src\/content\/(?:docs\/problems|problems)\//u.test(change.file)) {
      if (change.file.startsWith('src/content/problems/') && change.status === 'A')
        added.add(problemId);
      else if (change.file.startsWith('src/content/problems/') && change.status === 'D')
        withdrawn.add(problemId);
      else changed.add(problemId);
    }
    // A changed Unit or placement can affect many problem explanations.
    if (
      /^src\/content\/(?:docs\/learn|policies)\//u.test(change.file) ||
      change.file === 'src/lib/taxonomy/textbook-order.ts'
    )
      for (const problem of source.problems) changed.add(problem.id);
    const taxonomy = /^src\/content\/(tags|learning-outcomes|learning-units)\//u.exec(change.file);
    if (taxonomy) {
      const entityId = change.file
        .split('/')
        .at(-1)
        ?.replace(/\.json$/u, '');
      const entity = [...source.tags, ...source.learningOutcomes, ...source.learningUnits].find(
        ({ id }) => id === entityId,
      );
      // Existing kinds describe semantic operations, so an arbitrary metadata edit
      // must not be mislabeled as a rename. Other edits affect the problem scope.
      const previousTitle = change.status === 'M' ? readBefore?.(change.file) : undefined;
      const title =
        entity && ('name' in entity ? entity.name : 'title' in entity ? entity.title : undefined);
      const renamed = previousTitle !== undefined && title !== undefined && previousTitle !== title;
      if (entityId && (change.status !== 'M' || renamed))
        taxonomyChanges.push({
          kind: change.status === 'A' ? 'added' : change.status === 'D' ? 'deprecated' : 'renamed',
          entityId,
          summary: `${change.file}: ${change.status === 'A' ? '追加' : change.status === 'D' ? '削除' : '更新'}`,
        });
      for (const problem of source.problems) changed.add(problem.id);
    }
    if (/^src\/content\/(?:sources|correction-impacts)\//u.test(change.file))
      for (const problem of source.problems) changed.add(problem.id);
  }
  for (const id of [...added, ...withdrawn]) changed.delete(id);
  const catalog = CatalogSchema.parse({
    ...source,
    release: {
      publicationStatus: 'prepared',
      version: publication.version,
      releaseKind: 'incremental',
      cutoffAt: release.cutoffAt,
      validatedAt: publication.createdAt ?? release.validatedAt,
      publicationEffectiveAt: publication.createdAt ?? release.publicationEffectiveAt,
      advancedSlotRegistryDigest: release.advancedSlotRegistryDigest,
      firstContestId: release.firstContestId,
      lastContestId: release.lastContestId,
      contestCount: release.contestCount,
      problemCount: release.problemCount,
      slotRecordCount: release.slotRecordCount,
      updateIds: [`update-${publication.version.replaceAll('.', '-')}`],
      addedProblemIds: [...added].sort(),
      changedProblemIds: [...changed].sort(),
      withdrawnProblemIds: [...withdrawn].sort(),
      heldProblemIds: release.heldProblemIds,
      taxonomyChanges,
      changelogPath: release.changelogPath,
    },
  });
  const metadata = createBuildReleaseMetadata(catalog.release, publication);
  const previous = history.find(({ version }) => version === publication.version);
  if (
    metadata &&
    previous &&
    canonicalJson({
      version: previous.version,
      commit: previous.commit,
      cutoffAt: previous.cutoffAt,
      firstContestId: previous.firstContestId,
      lastContestId: previous.lastContestId,
      contestCount: previous.contestCount,
      problemCount: previous.problemCount,
      changeSummary: previous.changeSummary,
      validationResultsUrl: previous.validationResultsUrl,
    }) !==
      canonicalJson({
        version: metadata.version,
        commit: metadata.commit,
        cutoffAt: metadata.cutoffAt,
        firstContestId: catalog.release.firstContestId,
        lastContestId: catalog.release.lastContestId,
        contestCount: catalog.release.contestCount,
        problemCount: catalog.release.problemCount,
        changeSummary: metadata.changeSummary,
        validationResultsUrl: metadata.validationResultsUrl,
      })
  )
    throw new Error('PUBLICATION_VERSION_CONFLICT');
  return { catalog, metadata };
}
