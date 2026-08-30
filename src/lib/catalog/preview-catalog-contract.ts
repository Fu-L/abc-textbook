import type { z } from 'zod';

import acceptanceEvidence from '../../../docs/verification/previews/initial-v1/ui-search/acceptance.json';
import reviewEvidence from '../../../docs/reviews/human-content/previews/initial-v1/us4/ui-search-review.json';
import { canonicalDigest } from '../domain/canonical-json.js';
import { CatalogSchema } from '../domain/schema-parts/catalog.js';
import { buildAdvancedSlotRegistry } from './advanced-slot-registry.js';
import {
  buildPreviewUiCatalog,
  frozenPreviewUiCatalogSource,
  type PreviewUiCatalogSource,
} from './preview-ui-catalog.js';

export type PreviewCatalogContract = z.infer<typeof CatalogSchema>;

/**
 * Adapt the frozen preview source to the repository-wide public Catalog contract.
 * The UI view model stays separate; T160 can replace this adapter's source without
 * changing the endpoint schema or its consumers.
 */
export const buildPreviewCatalogContract = (
  source: PreviewUiCatalogSource = frozenPreviewUiCatalogSource,
): PreviewCatalogContract => {
  const uiCatalog = buildPreviewUiCatalog(source);
  const registry = buildAdvancedSlotRegistry({
    contests: source.contests.map((contest) => ({
      contestId: contest.id,
      advancedLabels: contest.officialTaskOrder.slice(contest.officialTaskOrder.indexOf('D') + 1),
      sourceRevisionId: contest.taskOrderSourceRevisionId,
    })),
  });
  const checkedAt = '2026-07-27T23:21:00+09:00';
  const endpointCheckDigest = canonicalDigest(acceptanceEvidence);
  const reviewDigest = canonicalDigest(reviewEvidence);
  const endpointCheck = reviewEvidence.applicableChecks.find(
    ({ checkId }) => checkId === 'check-us4-contracts',
  );
  if (!endpointCheck) throw new Error('US4 contract review evidence is missing.');

  const groupForProblem = (problemId: string) =>
    source.groups.filter(({ problemIds }) => problemIds.includes(problemId));

  return CatalogSchema.parse({
    schemaVersion: '3.0.0',
    release: {
      version: '2026.07.27',
      releaseKind: 'initial',
      cutoffAt: checkedAt,
      validatedAt: checkedAt,
      publicationEffectiveAt: checkedAt,
      manifestDigest: source.subjectDigest,
      contentFileInventoryDigest: source.subjectDigest,
      contentSnapshotDigest: canonicalDigest(uiCatalog),
      updateIds: ['update-initial-v1'],
      advancedSlotRegistryDigest: registry.digest,
      firstContestId: source.contests[0]?.id,
      lastContestId: source.contests.at(-1)?.id,
      contestCount: source.contests.length,
      problemCount: source.problems.length,
      slotRecordCount: source.problems.length,
      addedProblemIds: [...source.selectedProblemIds],
      changedProblemIds: [],
      heldProblemIds: [],
      withdrawnProblemIds: [],
      taxonomyChanges: [],
      validationSummary: {
        checkCount: 1,
        passedCheckCount: 1,
        blockingFindingCount: 0,
        evidenceDigests: [endpointCheckDigest],
        checks: [
          {
            checkId: 'check-preview-catalog-contract',
            command: 'npm test -- tests/contract/ui-routes.test.ts',
            subjectDigest: endpointCheck.subjectDigest,
            resultPath: 'docs/verification/previews/initial-v1/ui-search/acceptance.json',
            resultDigest: endpointCheckDigest,
            exitCode: 0,
            passed: true,
            completedAt: checkedAt,
          },
        ],
      },
      humanContentReviewEvidenceRefs: [
        {
          evidenceId: 'human-content-review-initial-v1-us4',
          path: 'docs/reviews/human-content/previews/initial-v1/us4/ui-search-review.json',
          digest: reviewDigest,
          subjectDigest: reviewEvidence.subjectDigest,
          authorIds: ['person-maintainer'],
          reviewerIds: ['person-maintainer'],
          reviewMode: 'self',
          aggregatePassed: true,
        },
      ],
      changelogPath: 'docs/verification/previews/initial-v1/ui-search/acceptance.json',
    },
    advancedSlotRegistry: registry,
    contests: source.contests.map((contest) => ({
      id: contest.id,
      number: contest.number,
      title: contest.title,
      startedAt: contest.startedAt,
      endedAt: contest.endedAt,
      officialUrl: contest.officialUrl,
      officialTaskOrder: contest.officialTaskOrder,
      officialTaskIds: contest.officialTaskIds,
      taskOrderSourceRevisionId: contest.taskOrderSourceRevisionId,
      checkedAt: contest.checkedAt,
    })),
    contestGaps: [],
    contestSlots: source.problems.map((problem) => {
      const contest = source.contests.find(({ id }) => id === problem.contestId);
      const officialOrder = contest?.officialTaskOrder.indexOf(problem.slotLabel) ?? -1;
      if (!contest || officialOrder < 0) {
        throw new Error(`Preview problem has no official slot: ${problem.id}`);
      }
      return {
        contestId: problem.contestId,
        label: problem.slotLabel,
        officialTaskId: problem.officialTaskId,
        officialOrder,
        availability: 'exists',
        catalogStatus: 'uncollected',
        holdReason: null,
        problemId: problem.id,
        sourceRevisionId: contest.taskOrderSourceRevisionId,
        checkedAt: problem.checkedAt,
      };
    }),
    problems: source.problems.map((problem) => {
      const problemGroups = groupForProblem(problem.id);
      const [primary, ...supporting] = problemGroups;
      return {
        id: problem.id,
        contestId: problem.contestId,
        slotLabel: problem.slotLabel,
        officialTaskId: problem.officialTaskId,
        title: problem.title,
        officialUrl: problem.officialUrl,
        constraintsSummary: problem.constraintsSummary,
        difficultyEvidence: problem.difficultyEvidence,
        sourceRevisionIds: problem.sourceRevisionIds,
        checkedAt: problem.checkedAt,
        publicationStatus: 'uncollected',
        primaryTagIds: primary ? [primary.tag.id] : [],
        secondaryTagIds: supporting.map(({ tag }) => tag.id),
        adHocElements: [],
        placementId: null,
      };
    }),
    techniqueInventory: [],
    tags: source.groups.map((group) => ({
      id: group.tag.id,
      name: group.tag.name,
      definition: group.tag.definition,
      parentId: null,
      prerequisiteTagIds: group.tag.prerequisiteTagIds,
      semanticSignature: {
        objectPatterns: [group.tag.name],
        triggerPatterns: [group.tag.definition],
        invariantPatterns: [group.outcome.statement],
        goalPatterns: [group.outcome.statement],
        excludedPatterns: [],
        minimumDimensions: 2,
        requireObjectForStrictRecall: true,
      },
      relatedTags: [],
      learningOutcomeIds: group.tag.outcomeIds,
      representativeProblemIds: group.tag.representativeProblemIds,
      aliases: [group.domain],
      formerNames: [],
      lifecycle: 'active',
      replacementTagIds: [],
    })),
    learningOutcomes: source.groups.map((group) => ({
      id: group.outcome.id,
      statement: group.outcome.statement,
      prerequisiteOutcomeIds: group.outcome.prerequisiteOutcomeIds,
      scopeIds: [group.tag.id, group.unit.id],
    })),
    learningUnits: source.groups.map((group, index) => ({
      id: group.unit.id,
      kind: 'chapter',
      title: group.unit.title,
      parentId: null,
      baselineId: 'baseline-abc-advanced-foundation',
      baselineVersion: '1.0.0',
      additionalPrerequisiteUnitIds: group.unit.prerequisiteUnitIds,
      excludedTopics: [],
      sourceRevisionIds: group.unit.sourceRevisionIds,
      tagIds: group.unit.tagIds,
      learningOutcomeIds: group.unit.outcomeIds,
      docPath: `src/pages/learn/${group.unit.id}.astro`,
      problemIds: group.unit.problemIds,
      examples: [
        {
          key: 'preview-intuition',
          learningOutcomeIds: group.unit.outcomeIds,
          kind: 'illustrative',
          language: 'text',
          omissions: ['完全な問題別解説は後続タスクで公開する。'],
          environment: 'initial-v1 preview page',
          input: group.unit.problemIds.join(', '),
          procedure: ['2問の分類根拠から共通する技法を確認する。'],
          executionTarget: null,
          expectedResult: group.outcome.statement,
          verificationStatus: 'not_applicable',
        },
      ],
      exercises: [
        {
          key: 'preview-check',
          learningOutcomeIds: group.unit.outcomeIds,
          prerequisiteIds: [],
          attainmentCondition: '2問の共通部分と問題固有部分を区別して説明できる。',
          assessment: {
            method: '分類根拠と学習成果を照合する。',
            successCondition: '共通技法と問題固有要素がともに説明されている。',
          },
          answer: {
            reasoningOrVerification: group.outcome.statement,
            procedure: ['各問題の分類根拠を比較する。'],
            expectedResult: '共通技法と問題固有要素を区別できる。',
            verificationStatus: 'passed',
          },
        },
      ],
      stageRank: index,
      difficultyRank: index,
      representativeRank: index,
      globalIndex: index,
      orderReason: 'initial-v1 の暫定学習順。',
    })),
    placements: [],
    authoringUnits: [],
    sources: [
      ...source.contests.map((contest) => sourceForContest(contest)),
      ...source.problems.flatMap((problem) =>
        problem.sourceRevisionIds.map((revisionId) =>
          sourceForProblemRevision(problem, revisionId),
        ),
      ),
    ],
    correctionImpacts: [],
  });
};

export const previewCatalogContract = buildPreviewCatalogContract();

function sourceForContest(contest: PreviewUiCatalogSource['contests'][number]) {
  return {
    id: contest.taskOrderSourceRevisionId,
    url: `https://atcoder.jp/contests/${contest.id}/tasks`,
    sourceKind: 'official_contest' as const,
    contestId: contest.id,
    officialTaskId: null,
    checkedAt: contest.checkedAt,
    fingerprint: revisionFingerprint(contest.taskOrderSourceRevisionId),
    termsCheckedAt: contest.checkedAt,
  };
}

function sourceForProblemRevision(
  problem: PreviewUiCatalogSource['problems'][number],
  revisionId: string,
) {
  const editorialMatch = /^source-[^-]+-editorial-(?<itemId>\d+)-/u.exec(revisionId);
  return {
    id: revisionId,
    url: editorialMatch?.groups?.itemId
      ? `https://atcoder.jp/contests/${problem.contestId}/editorial/${editorialMatch.groups.itemId}`
      : problem.officialUrl,
    sourceKind: editorialMatch ? ('official_editorial' as const) : ('official_problem' as const),
    contestId: problem.contestId,
    officialTaskId: problem.officialTaskId,
    checkedAt: problem.checkedAt,
    fingerprint: revisionFingerprint(revisionId),
    termsCheckedAt: problem.checkedAt,
  };
}

function revisionFingerprint(revisionId: string): string {
  const fingerprint = revisionId.split('-').at(-1);
  if (!fingerprint || !/^[a-f0-9]{64}$/u.test(fingerprint)) {
    throw new Error(`Source Revision ID has no SHA-256 fingerprint: ${revisionId}`);
  }
  return fingerprint;
}
