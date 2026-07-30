import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';

const sha = (character: string): string => character.repeat(64);

export const makeProblemAnalysisFixture = (
  problemId: string,
  sourceRevisionId: string,
  reviewStatus: 'draft' | 'reviewed' = 'reviewed',
) => {
  const evidenceId = 'evidence-official-analysis';
  const evidence = {
    id: evidenceId,
    sourceRevisionIds: [sourceRevisionId],
    rationale: 'The official fixture source supports this analysis.',
  };
  const evidenceIds = [evidenceId];
  const claim = (text: string) => ({ text, evidenceIds });
  return {
    problemId,
    sourceRevisionIds: [sourceRevisionId],
    evidence: [evidence],
    reasoningPath: {
      observations: [claim('The fixture constraints expose one reusable transition state.')],
      candidateApproaches: [
        {
          approach: 'Track and reuse the transition state.',
          decision: 'adopted' as const,
          decisionReason: 'It preserves exactly the information required by the next step.',
          evidenceIds,
        },
        ...(reviewStatus === 'reviewed'
          ? [
              {
                approach: 'Enumerate every complete transition history.',
                decision: 'rejected' as const,
                decisionReason: 'It repeats histories that have identical future behavior.',
                evidenceIds,
              },
            ]
          : []),
      ],
      keyInsights: [claim('Equal transition states have equal future behavior.')],
      algorithmConnection: claim(
        'Store each transition state once and propagate its result to the next state.',
      ),
    },
    typicalTechniques: [],
    problemSpecificInsights: [
      {
        insight: 'Only the current transition state changes future choices.',
        reusablePerspective: 'Compare histories by the information needed for their next move.',
        evidenceIds,
      },
    ],
    asymptoticComplexity: { time: 'O(1)', space: 'O(1)', evidenceIds },
    prerequisiteCandidates: [],
    implementationConcerns: [],
    outcomeCandidates: [claim('Identify the reusable state and justify every transition from it.')],
    reviewAdvice: [
      claim('Reconstruct why the transition state is sufficient before reading the solution.'),
    ],
    authorId: 'person-author',
    reviewStatus,
    reviewFindings: [],
  };
};

const registrySubject = {
  version: '1.0.0' as const,
  labels: ['E' as const],
  firstSeenContestByLabel: { E: 'abc212' },
  orderEvidenceSourceRevisionIds: ['source-revision-abc212-e'],
};

const registryDigest = canonicalDigest(registrySubject);

export const makeTrustedCatalog = (releaseOverrides: Record<string, unknown>) => ({
  schemaVersion: '3.0.0' as const,
  release: {
    version: '2026.07.17',
    releaseKind: 'initial' as const,
    cutoffAt: '2026-07-17T09:00:00+09:00',
    validatedAt: '2026-07-17T12:00:00+09:00',
    publicationEffectiveAt: '2026-07-17T13:00:00+09:00',
    manifestDigest: sha('1'),
    contentFileInventoryDigest: sha('2'),
    contentSnapshotDigest: sha('3'),
    updateIds: ['update-foundation'],
    advancedSlotRegistryDigest: registryDigest,
    firstContestId: 'abc212',
    lastContestId: 'abc212',
    contestCount: 1,
    problemCount: 1,
    slotRecordCount: 1,
    addedProblemIds: ['abc212-x45'],
    changedProblemIds: [],
    heldProblemIds: [],
    withdrawnProblemIds: [],
    taxonomyChanges: [],
    validationSummary: {
      checkCount: 1,
      passedCheckCount: 1,
      blockingFindingCount: 0,
      evidenceDigests: [sha('4')],
      checks: [
        {
          checkId: 'check-catalog',
          command: 'npm run test:contract',
          subjectDigest: sha('2'),
          resultPath: 'docs/verification/check-catalog.json',
          resultDigest: sha('4'),
          exitCode: 0,
          passed: true,
          completedAt: '2026-07-17T12:00:00+09:00',
        },
      ],
    },
    humanContentReviewEvidenceRefs: [
      {
        evidenceId: 'human-content-review-catalog',
        path: 'docs/reviews/human-content/review-catalog.json',
        digest: sha('5'),
        subjectDigest: sha('2'),
        authorIds: ['person-author'],
        reviewerIds: ['person-author'],
        reviewMode: 'self',
        aggregatePassed: true as const,
      },
    ],
    changelogPath: 'docs/changelog/2026-07-17.md',
    ...releaseOverrides,
  },
  advancedSlotRegistry: {
    ...registrySubject,
    digest: registryDigest,
  },
  contests: [
    {
      id: 'abc212',
      number: 212,
      title: 'ABC 212',
      startedAt: '2026-07-17T00:00:00+09:00',
      endedAt: '2026-07-17T01:00:00+09:00',
      officialUrl: 'https://atcoder.jp/contests/abc212',
      officialTaskOrder: ['A', 'B', 'C', 'D', 'E'],
      officialTaskIds: ['abc212_a', 'abc212_b', 'abc212_c', 'abc212_d', 'abc212_e'],
      taskOrderSourceRevisionId: 'source-revision-abc212-e',
      checkedAt: '2026-07-17T02:00:00+09:00',
    },
  ],
  contestGaps: [],
  contestSlots: [
    {
      contestId: 'abc212',
      label: 'E',
      officialTaskId: 'abc212_e',
      officialOrder: 4,
      availability: 'exists' as const,
      catalogStatus: 'published' as const,
      holdReason: null,
      problemId: 'abc212-x45',
      sourceRevisionId: 'source-revision-abc212-e',
      checkedAt: '2026-07-17T02:00:00+09:00',
    },
  ],
  problems: [
    {
      id: 'abc212-x45',
      contestId: 'abc212',
      slotLabel: 'E',
      officialTaskId: 'abc212_e',
      title: 'Fixture problem',
      officialUrl: 'https://atcoder.jp/contests/abc212/tasks/abc212_e',
      constraintsSummary: 'Fixture constraints.',
      difficultyEvidence: 'Fixture difficulty.',
      sourceRevisionIds: ['source-revision-abc212-e'],
      checkedAt: '2026-07-17T02:00:00+09:00',
      publicationStatus: 'published' as const,
      primaryTagIds: ['tag-graphs'],
      secondaryTagIds: [],
      adHocElements: [],
      placementId: null,
    },
  ],
  techniqueInventory: [makeProblemAnalysisFixture('abc212-x45', 'source-revision-abc212-e')],
  tags: [
    {
      id: 'tag-graphs',
      name: 'Graphs',
      definition: 'Fixture graph definition.',
      parentId: null,
      prerequisiteTagIds: [],
      learningOutcomeIds: ['outcome-graphs'],
      representativeProblemIds: ['abc212-x45'],
      aliases: [],
      formerNames: [],
      lifecycle: 'active' as const,
      replacementTagIds: [],
    },
  ],
  learningOutcomes: [
    {
      id: 'outcome-graphs',
      statement: 'Explain the fixture graph method.',
      prerequisiteOutcomeIds: [],
      scopeIds: ['tag-graphs'],
    },
  ],
  learningUnits: [
    {
      id: 'unit-graphs',
      kind: 'chapter' as const,
      title: 'Fixture graphs',
      parentId: null,
      baselineId: 'baseline-foundation',
      baselineVersion: '1.0.0',
      additionalPrerequisiteUnitIds: [],
      excludedTopics: [],
      sourceRevisionIds: ['source-revision-abc212-e'],
      tagIds: ['tag-graphs'],
      learningOutcomeIds: ['outcome-graphs'],
      docPath: 'src/content/docs/index.md',
      problemIds: ['abc212-x45'],
      examples: [
        {
          key: 'unit-intuition',
          learningOutcomeIds: ['outcome-graphs'],
          kind: 'illustrative' as const,
          language: 'text',
          omissions: [],
          environment: 'Textbook page.',
          input: 'Fixture graph.',
          procedure: ['Trace the fixture graph.'],
          executionTarget: null,
          expectedResult: 'The transition is identified.',
          verificationStatus: 'not_applicable' as const,
        },
      ],
      exercises: [
        {
          key: 'unit-check',
          learningOutcomeIds: ['outcome-graphs'],
          prerequisiteIds: [],
          attainmentCondition: 'Explain the fixture transition.',
          assessment: {
            method: 'Compare the explanation with the invariant.',
            successCondition: 'The invariant and transition are both stated.',
          },
          answer: {
            reasoningOrVerification: 'The fixture transition preserves the invariant.',
            procedure: ['Check the invariant before and after the transition.'],
            expectedResult: 'The invariant is preserved.',
            verificationStatus: 'passed' as const,
          },
        },
      ],
      stageRank: 0,
      difficultyRank: 0,
      representativeRank: 0,
      globalIndex: 0,
      orderReason: 'Fixture order.',
    },
  ],
  placements: [],
  authoringUnits: [
    {
      problemId: 'abc212-x45',
      kind: 'full' as const,
      primaryProblemId: null,
      differenceSummary: null,
      docPath: 'src/content/docs/index.md',
      learningOutcomeIds: ['outcome-graphs'],
      baselineId: 'baseline-foundation',
      baselineVersion: '1.0.0',
      additionalPrerequisiteUnitIds: [],
      excludedTopics: [],
      tagIds: ['tag-graphs'],
      sourceRevisionIds: ['source-revision-abc212-e'],
      skill: { name: 'fixture-skill', version: '1.0.0', digest: sha('a') },
      revision: 1,
      sections: {
        reasoning: 'Fixture reasoning.',
        technique: 'Fixture technique.',
        problemSpecificElements: 'Fixture-specific elements.',
        reviewAdvice: 'Fixture review advice.',
        correctness: 'Fixture correctness argument.',
        complexity: { time: 'O(1)', space: 'O(1)' },
        constraintConsistency: 'Fixture constraints are consistent.',
        implementationNotes: 'Fixture implementation notes.',
      },
      claims: [
        {
          key: 'method-correctness',
          text: 'Fixture claim.',
          sourceRevisionIds: ['source-revision-abc212-e'],
          authorId: 'person-author',
          verificationStatus: 'verified' as const,
        },
      ],
      examples: [
        {
          key: 'minimal-case',
          learningOutcomeIds: ['outcome-graphs'],
          learningUnitIds: ['unit-graphs'],
          kind: 'executable' as const,
          language: 'text',
          omissions: [],
          environment: 'Fixture environment.',
          input: '1',
          procedure: ['Run fixture.'],
          executionTarget: 'tests/fixtures/authoring-skill/echo-input.ts',
          expectedResult: '1',
          verificationStatus: 'passed' as const,
        },
      ],
      exercises: [
        {
          key: 'apply-method',
          learningOutcomeIds: ['outcome-graphs'],
          prerequisiteIds: [],
          attainmentCondition: 'Fixture condition.',
          assessment: {
            method: 'Fixture assessment.',
            successCondition: 'Fixture success.',
          },
          answer: {
            reasoningOrVerification: 'Fixture answer.',
            procedure: ['Verify fixture.'],
            expectedResult: '1',
            verificationStatus: 'passed' as const,
          },
        },
      ],
    },
  ],
  sources: [
    {
      id: 'source-revision-abc212-e',
      url: 'https://atcoder.jp/contests/abc212/tasks/abc212_e',
      sourceKind: 'official_problem' as const,
      contestId: 'abc212',
      officialTaskId: 'abc212_e',
      checkedAt: '2026-07-17T02:00:00+09:00',
      fingerprint: sha('b'),
      termsCheckedAt: '2026-07-17T02:00:00+09:00',
    },
  ],
  correctionImpacts: [],
});
