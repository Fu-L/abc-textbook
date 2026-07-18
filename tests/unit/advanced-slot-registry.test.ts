import { describe, expect, it } from 'vitest';

import {
  AdvancedSlotRegistrySchema,
  ContestSlotRecordSchema,
  ProblemSchema,
  ExerciseSchema,
  ProblemPlacementSchema,
  SafePathSchema,
  SourceRevisionSchema,
  TechniqueTagSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  AdvancedSlotRegistryError,
  buildAdvancedSlotRegistry,
  materializeContestSlotStates,
} from '../../src/lib/catalog/advanced-slot-registry.js';
import {
  buildCatalog,
  catalogContentDigest,
  sortCatalogEntityArray,
  type CatalogLike,
} from '../../src/lib/catalog/build-catalog.js';
import { parseOfficialTaskList } from '../../src/lib/catalog/official-task-list.js';

const taskList = (labels: readonly string[]) => `
  <table><tbody>${labels
    .map(
      (label) =>
        `<tr><td><a href="/contests/abc500/tasks/abc500_${label.toLowerCase()}">${label}</a></td><td><a href="/contests/abc500/tasks/abc500_${label.toLowerCase()}">Problem ${label}</a></td></tr>`,
    )
    .join('')}</tbody></table>`;

describe('official advanced slot registry', () => {
  it('selects every official task after D without copying statements', () => {
    const parsed = parseOfficialTaskList({
      contestId: 'abc500',
      officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
      html: taskList(['A', 'B', 'C', 'D', 'E', 'F', 'I', 'Ex']),
      checkedAt: '2026-07-17T12:00:00+09:00',
    });

    expect(parsed.advancedLabels).toEqual(['E', 'F', 'I', 'Ex']);
    expect(parsed.sourceFingerprint).toMatch(/^[a-f0-9]{64}$/u);
    expect(JSON.stringify(parsed)).not.toContain('Problem E');
  });

  it('fails closed when a displayed label and task URL disagree or a task URL repeats', () => {
    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E']).replace(
          '/contests/abc500/tasks/abc500_e">E',
          '/contests/abc500/tasks/abc500_f">E',
        ),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/PARSER_DRIFT/u);

    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E']).replace(
          '/contests/abc500/tasks/abc500_e">E',
          '/contests/abc500/tasks/abc500_d">E',
        ),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/PARSER_DRIFT/u);
  });

  it('rejects task-list and task links for a different contest', () => {
    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc501',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/CONTEST_URL_MISMATCH/u);

    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc501',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc501/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/TASK_LINK_CONTEST_MISMATCH/u);
  });

  it('fails closed when D is missing or a label is duplicated', () => {
    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/D_TASK_NOT_FOUND/u);

    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'E', 'E']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/DUPLICATE_TASK_LABEL|DUPLICATE_TASK_LINK/u);

    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html: taskList(['A', 'B', 'C', 'D', 'Ex', 'ex']),
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/DUPLICATE_TASK_LABEL|DUPLICATE_TASK_LINK/u);

    expect(() =>
      buildAdvancedSlotRegistry({
        contests: [
          {
            contestId: 'abc500',
            advancedLabels: ['Ex', 'ex'],
            sourceRevisionId: 'source-abc500-task-order',
          },
        ],
      }),
    ).toThrow(/DUPLICATE_TASK_LABEL/u);
  });

  it('fails the whole contest when one task-table row cannot be interpreted', () => {
    const html = taskList(['A', 'B', 'C', 'D', 'E']).replace(
      '/contests/abc500/tasks/abc500_e',
      '/contests/abc500/task/abc500_e',
    );
    expect(() =>
      parseOfficialTaskList({
        contestId: 'abc500',
        officialTaskListUrl: 'https://atcoder.jp/contests/abc500/tasks',
        html,
        checkedAt: '2026-07-17T12:00:00+09:00',
      }),
    ).toThrow(/PARSER_DRIFT/u);
  });

  it('keeps the existing order while inserting future labels from official constraints', () => {
    const existingSubject = {
      version: '1.0.0' as const,
      labels: ['E', 'F', 'G', 'H'],
      firstSeenContestByLabel: {
        E: 'abc212',
        F: 'abc212',
        G: 'abc212',
        H: 'abc212',
      },
      orderEvidenceSourceRevisionIds: ['source-abc212-task-order'],
    };
    const registry = buildAdvancedSlotRegistry({
      existingRegistry: { ...existingSubject, digest: canonicalDigest(existingSubject) },
      contests: [
        {
          contestId: 'abc500',
          advancedLabels: ['E', 'F', 'I', 'Ex'],
          sourceRevisionId: 'source-abc500-task-order',
        },
        {
          contestId: 'abc501',
          advancedLabels: ['E', 'F', 'G', 'H'],
          sourceRevisionId: 'source-abc501-task-order',
        },
      ],
    });

    expect(registry.labels).toEqual(['E', 'F', 'I', 'Ex', 'G', 'H']);
    expect(registry.firstSeenContestByLabel.E).toBe('abc212');
    expect(registry.orderEvidenceSourceRevisionIds).toContain('source-abc212-task-order');
    expect(AdvancedSlotRegistrySchema.safeParse(registry).success).toBe(true);
  });

  it('passes a newly built registry through the canonical catalog contract', () => {
    const registry = buildAdvancedSlotRegistry({
      contests: [
        {
          contestId: 'abc212',
          advancedLabels: ['E'],
          sourceRevisionId: 'source-abc212-task-order',
        },
      ],
    });
    const digest = 'a'.repeat(64);
    const releaseCheck = {
      checkId: 'check-catalog-foundation',
      command: 'npm run test:contract',
      subjectDigest: digest,
      resultPath: 'docs/verification/catalog-check.json',
      resultDigest: digest,
      exitCode: 0 as const,
      passed: true as const,
      completedAt: '2026-07-17T14:00:00+09:00',
    };
    const releaseReview = {
      evidenceId: 'human-review-foundation',
      path: 'docs/judgments/merge/foundation/human-review.json',
      digest,
      subjectDigest: digest,
      authorIds: ['person-author'],
      reviewerIds: ['person-reviewer'],
      aggregatePassed: true as const,
    };
    const trustedEvidence = {
      subjectDigest: digest,
      checks: [releaseCheck],
      reviews: [releaseReview],
    };
    const build = (input: unknown) => buildCatalog(input, [], trustedEvidence);
    const catalogInput = {
      schemaVersion: '2.0.0',
      release: {
        version: '2026.07.17',
        releaseKind: 'initial',
        cutoffAt: '2026-07-17T14:00:00+09:00',
        validatedAt: '2026-07-17T12:01:00+09:00',
        publicationEffectiveAt: '2026-07-17T12:02:00+09:00',
        manifestDigest: digest,
        contentFileInventoryDigest: digest,
        contentSnapshotDigest: digest,
        updateIds: ['update-foundation'],
        advancedSlotRegistryDigest: registry.digest,
        firstContestId: 'abc212',
        lastContestId: 'abc212',
        contestCount: 1,
        problemCount: 1,
        slotRecordCount: 1,
        addedProblemIds: [],
        changedProblemIds: [],
        heldProblemIds: [],
        withdrawnProblemIds: [],
        taxonomyChanges: [],
        validationSummary: {
          checkCount: 1,
          passedCheckCount: 1,
          blockingFindingCount: 0,
          evidenceDigests: [digest],
          checks: [releaseCheck],
        },
        humanContentReviewEvidenceRefs: [releaseReview],
        changelogPath: 'docs/changelog/2026.07.17.md',
      },
      advancedSlotRegistry: registry,
      contests: [
        {
          id: 'abc212',
          number: 212,
          title: 'AtCoder Beginner Contest 212',
          startedAt: '2026-07-17T12:00:00+09:00',
          endedAt: '2026-07-17T13:40:00+09:00',
          officialUrl: 'https://atcoder.jp/contests/abc212',
          officialTaskOrder: ['A', 'B', 'C', 'D', 'E'],
          taskOrderSourceRevisionId: 'source-abc212-task-order',
          checkedAt: '2026-07-17T14:00:00+09:00',
        },
      ],
      contestSlots: [
        {
          contestId: 'abc212',
          label: 'E',
          officialOrder: 4,
          availability: 'exists',
          catalogStatus: 'uncollected',
          holdReason: null,
          problemId: 'abc212-e',
          sourceRevisionId: 'source-abc212-task-order',
          checkedAt: '2026-07-17T14:00:00+09:00',
        },
      ],
      problems: [
        {
          id: 'abc212-e',
          contestId: 'abc212',
          slotLabel: 'E',
          title: 'Problem E',
          officialUrl: 'https://atcoder.jp/contests/abc212/tasks/abc212_e',
          constraintsSummary: 'Fixture constraints.',
          difficultyEvidence: 'Fixture evidence.',
          sourceRevisionIds: ['source-abc212-task-order'],
          checkedAt: '2026-07-17T14:00:00+09:00',
          publicationStatus: 'uncollected',
          primaryTagIds: [],
          secondaryTagIds: [],
          adHocElements: [],
          placementId: null,
          explanationId: null,
        },
      ],
      techniqueInventory: [
        {
          problemId: 'abc212-e',
          sourceRevisionIds: ['source-abc212-task-order'],
          coreMethod: 'Fixture method.',
          proofIdeas: ['Fixture proof.'],
          asymptoticComplexity: { time: 'O(1)', space: 'O(1)' },
          prerequisiteCandidates: [],
          implementationConcerns: [],
          outcomeCandidates: ['Fixture outcome.'],
          adHocElements: [],
          authorId: 'author-fixture',
          reviewStatus: 'draft',
        },
      ],
      tags: [],
      learningOutcomes: [],
      learningUnits: [],
      placements: [],
      explanations: [],
      sources: [
        {
          id: 'source-abc212-task-order',
          url: 'https://atcoder.jp/contests/abc212/tasks',
          sourceKind: 'official_contest',
          contestId: 'abc212',
          checkedAt: '2026-07-17T14:00:00+09:00',
          fingerprint: digest,
          termsCheckedAt: '2026-07-17T14:00:00+09:00',
        },
      ],
      correctionImpacts: [],
      claims: [],
      examples: [],
      exercises: [],
      assessments: [],
      answerMaterials: [],
    };
    const contentDigest = catalogContentDigest(catalogInput as CatalogLike);
    catalogInput.release.contentSnapshotDigest = contentDigest;
    const catalog = build(catalogInput);

    expect(catalog.advancedSlotRegistry).toEqual(registry);
    expect(catalogContentDigest(catalog)).toBe(catalog.release.contentSnapshotDigest);
    const releaseScopeMutations: readonly ((release: Record<string, unknown>) => void)[] = [
      (release) => {
        release.version = '2026.07.18';
      },
      (release) => {
        release.releaseKind = 'incremental';
      },
      (release) => {
        release.cutoffAt = '2026-07-17T14:01:00+09:00';
      },
      (release) => {
        release.manifestDigest = '1'.repeat(64);
      },
      (release) => {
        release.updateIds = ['update-replaced'];
      },
      (release) => {
        release.addedProblemIds = ['abc212-e'];
      },
      (release) => {
        release.taxonomyChanges = [{ changed: true }];
      },
      (release) => {
        release.changelogPath = 'docs/changelog/2026.07.18.md';
      },
    ];
    for (const mutateRelease of releaseScopeMutations) {
      const changedReleaseScope = structuredClone(catalog);
      mutateRelease(changedReleaseScope.release);
      expect(catalogContentDigest(changedReleaseScope)).not.toBe(
        catalog.release.contentSnapshotDigest,
      );
    }
    const changedContent = structuredClone(catalog) as Record<string, unknown>;
    const [changedProblem] = changedContent.problems as { title: string }[];
    if (!changedProblem) throw new Error('Fixture problem is missing.');
    changedProblem.title = 'Changed after review.';
    expect(() => build(changedContent)).toThrow(/CONTENT_SNAPSHOT_DIGEST_MISMATCH/u);

    const countMismatch = structuredClone(catalog) as Record<string, unknown>;
    (countMismatch.release as { problemCount: number }).problemCount = 2;
    expect(() => build(countMismatch)).toThrow(/PROBLEM_COUNT_MISMATCH/u);

    const falseAbsence = structuredClone(catalog) as Record<string, unknown>;
    const [slot] = falseAbsence.contestSlots as {
      availability: string;
      officialOrder: number | null;
      problemId: string | null;
    }[];
    if (slot) {
      slot.availability = 'official_absent';
      slot.officialOrder = null;
      slot.problemId = null;
    }
    expect(() => build(falseAbsence)).toThrow(
      /CONTEST_SLOT_OFFICIAL_MISMATCH|CATALOG_SCHEMA_INVALID/u,
    );

    const unknownTag = structuredClone(catalog) as Record<string, unknown>;
    const [problem] = unknownTag.problems as { primaryTagIds: string[] }[];
    if (!problem) throw new Error('Fixture problem is missing.');
    problem.primaryTagIds = ['tag-missing'];
    expect(() => build(unknownTag)).toThrow(/CATALOG_REFERENCE_MISSING/u);

    const failedRelease = structuredClone(catalog) as Record<string, unknown>;
    const release = failedRelease.release as {
      validationSummary: {
        passedCheckCount: number;
        blockingFindingCount: number;
        checks: { passed: boolean; exitCode: number }[];
      };
    };
    release.validationSummary.passedCheckCount = 0;
    release.validationSummary.blockingFindingCount = 1;
    const [failedCheck] = release.validationSummary.checks;
    if (!failedCheck) throw new Error('Fixture release check is missing.');
    failedCheck.passed = false;
    failedCheck.exitCode = 1;
    expect(() => build(failedRelease)).toThrow(
      /CATALOG_SCHEMA_INVALID|RELEASE_EVIDENCE_INCOMPLETE/u,
    );

    const duplicatedReleaseEvidence = structuredClone(catalog) as Record<string, unknown>;
    (duplicatedReleaseEvidence.release as Record<string, unknown>).validationSummary = {
      checkCount: 2,
      passedCheckCount: 2,
      blockingFindingCount: 0,
      evidenceDigests: [digest, digest],
    };
    expect(() => build(duplicatedReleaseEvidence)).toThrow(/CATALOG_SCHEMA_INVALID/u);

    const unverifiedClaim = structuredClone(catalog) as Record<string, unknown>;
    (unverifiedClaim.claims as unknown[]) = [
      {
        id: 'claim-one',
        text: 'Fixture claim.',
        sourceRevisionIds: ['source-abc212-task-order'],
        authorId: 'author-fixture',
        verificationStatus: 'unverified',
      },
    ];
    expect(() => build(unverifiedClaim)).toThrow(/CLAIM_NOT_VERIFIED/u);

    const unknownOutcomeScope = structuredClone(catalog) as Record<string, unknown>;
    unknownOutcomeScope.learningOutcomes = [
      {
        id: 'outcome-one',
        statement: 'Explain the fixture method.',
        prerequisiteOutcomeIds: [],
        scopeIds: ['tag-missing'],
        assessmentIds: ['assessment-one'],
      },
    ];
    unknownOutcomeScope.assessments = [
      {
        id: 'assessment-one',
        learningOutcomeIds: ['outcome-one'],
        method: 'Fixture assessment.',
        successCondition: 'The learner explains it.',
      },
    ];
    expect(() => build(unknownOutcomeScope)).toThrow(/CATALOG_REFERENCE_MISSING/u);

    const independentGraphs = structuredClone(catalog) as Record<string, unknown>;
    independentGraphs.learningOutcomes = [
      {
        id: 'outcome-one',
        statement: 'Explain the fixture method.',
        prerequisiteOutcomeIds: [],
        scopeIds: [],
        assessmentIds: ['assessment-one'],
      },
    ];
    independentGraphs.assessments = [
      {
        id: 'assessment-one',
        learningOutcomeIds: ['outcome-one'],
        method: 'Fixture assessment.',
        successCondition: 'The learner explains it.',
      },
    ];
    independentGraphs.tags = [
      {
        id: 'tag-a',
        name: 'Tag A',
        definition: 'Fixture tag A.',
        parentId: 'tag-b',
        prerequisiteTagIds: [],
        learningOutcomeIds: ['outcome-one'],
        representativeProblemIds: ['abc212-e'],
        aliases: [],
        formerNames: [],
        lifecycle: 'active',
        replacementTagIds: [],
      },
      {
        id: 'tag-b',
        name: 'Tag B',
        definition: 'Fixture tag B.',
        parentId: null,
        prerequisiteTagIds: ['tag-a'],
        learningOutcomeIds: ['outcome-one'],
        representativeProblemIds: ['abc212-e'],
        aliases: [],
        formerNames: [],
        lifecycle: 'active',
        replacementTagIds: [],
      },
    ];
    const independentContentDigest = catalogContentDigest(independentGraphs as CatalogLike);
    const independentRelease = independentGraphs.release as {
      contentSnapshotDigest: string;
    };
    independentRelease.contentSnapshotDigest = independentContentDigest;
    expect(() => build(independentGraphs)).not.toThrow();
  });

  it('enforces placement mode fields and tag lifecycle invariants', () => {
    const placement = {
      id: 'placement-abc500-e',
      problemId: 'abc500-e',
      policyVersion: '1.0.0',
      kind: 'full' as const,
      primaryExplanationId: null,
      sharedOutcomeIds: [],
      comparison: {
        method: 'Same method.',
        proof: 'Same proof.',
        complexity: 'Same complexity.',
        constraints: 'Same constraints.',
        prerequisites: 'Same prerequisites.',
        implementation: 'Same implementation.',
      },
      additionalElement: null,
      rationale: 'Independent explanation is required.',
      evidenceIds: ['evidence-placement'],
    };
    expect(ProblemPlacementSchema.safeParse(placement).success).toBe(true);
    expect(
      ProblemPlacementSchema.safeParse({
        ...placement,
        kind: 'supplement',
      }).success,
    ).toBe(false);

    const tag = {
      id: 'tag-dp',
      name: 'Dynamic programming',
      definition: 'A reusable method.',
      parentId: null,
      prerequisiteTagIds: [],
      learningOutcomeIds: ['outcome-dp'],
      representativeProblemIds: ['abc500-e'],
      aliases: [],
      formerNames: [],
      lifecycle: 'active' as const,
      replacementTagIds: [],
    };
    expect(TechniqueTagSchema.safeParse(tag).success).toBe(true);
    expect(
      TechniqueTagSchema.safeParse({ ...tag, lifecycle: 'deprecated', replacementTagIds: [] })
        .success,
    ).toBe(false);
    expect(TechniqueTagSchema.safeParse({ ...tag, replacementTagIds: ['tag-other'] }).success).toBe(
      false,
    );
    expect(
      ExerciseSchema.safeParse({
        id: 'exercise-one',
        problemId: null,
        learningOutcomeIds: ['outcome-dp'],
        prerequisiteIds: [],
        attainmentCondition: 'The learner explains the method.',
        assessmentId: 'assessment-one',
        answerMaterialId: 'answer-one',
      }).success,
    ).toBe(false);
  });

  it('places an order-conflict hold instead of guessing', () => {
    expect(() =>
      buildAdvancedSlotRegistry({
        contests: [
          {
            contestId: 'abc500',
            advancedLabels: ['E', 'F'],
            sourceRevisionId: 'source-abc500-task-order',
          },
          {
            contestId: 'abc501',
            advancedLabels: ['F', 'E'],
            sourceRevisionId: 'source-abc501-task-order',
          },
        ],
      }),
    ).toThrow(AdvancedSlotRegistryError);
  });

  it('records a missing H as official absence and keeps unknown/withdrawn distinct', () => {
    const states = materializeContestSlotStates(
      ['E', 'F', 'G', 'H', 'I', 'Ex'],
      {
        contestId: 'abc500',
        officialTaskOrder: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'Ex'],
        advancedLabels: ['E', 'F', 'G', 'I', 'Ex'],
      },
      { I: 'unknown', Ex: 'withdrawn' },
    );

    expect(states.find(({ label }) => label === 'H')).toMatchObject({
      officialOrder: null,
      availability: 'official_absent',
    });
    expect(states.find(({ label }) => label === 'I')?.availability).toBe('unknown');
    expect(states.find(({ label }) => label === 'Ex')?.availability).toBe('withdrawn');
    expect(states.find(({ label }) => label === 'E')?.officialOrder).toBe(4);
    expect(states.find(({ label }) => label === 'F')?.officialOrder).toBe(5);
  });

  it('rejects case-fold collisions across existing and later contest labels', () => {
    const subject = {
      version: '1.0.0' as const,
      labels: ['Ex'],
      firstSeenContestByLabel: { Ex: 'abc212' },
      orderEvidenceSourceRevisionIds: ['source-abc212-task-order'],
    };
    expect(() =>
      buildAdvancedSlotRegistry({
        existingRegistry: { ...subject, digest: canonicalDigest(subject) },
        contests: [
          {
            contestId: 'abc500',
            advancedLabels: ['ex'],
            sourceRevisionId: 'source-abc500-task-order',
          },
        ],
      }),
    ).toThrow(/TASK_LABEL_CASE_CONFLICT/u);
  });

  it('sorts contest entities numerically and without locale-dependent comparison', () => {
    expect(
      sortCatalogEntityArray('contests', [{ id: 'abc1000' }, { id: 'abc999' }]).map(({ id }) => id),
    ).toEqual(['abc999', 'abc1000']);
  });

  it('orders learning units by prerequisites before applying the ID tie-breaker', () => {
    expect(
      sortCatalogEntityArray('learningUnits', [
        {
          id: 'unit-b',
          additionalPrerequisiteUnitIds: ['unit-a'],
          stageRank: 0,
          difficultyRank: 0,
          representativeRank: 0,
        },
        {
          id: 'unit-a',
          additionalPrerequisiteUnitIds: [],
          stageRank: 0,
          difficultyRank: 0,
          representativeRank: 0,
        },
      ]).map(({ id }) => id),
    ).toEqual(['unit-a', 'unit-b']);
  });

  it('rejects contradictory ContestSlot availability and hold states', () => {
    const base = {
      contestId: 'abc500',
      label: 'E',
      officialOrder: 4,
      availability: 'exists' as const,
      catalogStatus: 'drafting' as const,
      holdReason: null,
      problemId: 'abc500-e',
      sourceRevisionId: 'source-abc500-task-order',
      checkedAt: '2026-07-17T12:00:00+09:00',
    };
    expect(ContestSlotRecordSchema.safeParse(base).success).toBe(true);
    expect(ContestSlotRecordSchema.safeParse({ ...base, problemId: null }).success).toBe(false);
    expect(
      ContestSlotRecordSchema.safeParse({
        ...base,
        availability: 'official_absent',
        officialOrder: null,
      }).success,
    ).toBe(false);
    expect(
      ContestSlotRecordSchema.safeParse({ ...base, availability: 'unknown', problemId: null })
        .success,
    ).toBe(false);
    expect(ContestSlotRecordSchema.safeParse({ ...base, catalogStatus: 'on_hold' }).success).toBe(
      false,
    );
  });

  it('binds paths, official URLs, and source revisions to their trusted shapes', () => {
    expect(SafePathSchema.safeParse('src/content/catalog.json').success).toBe(true);
    for (const path of ['.', '..', './catalog.json', 'src//catalog.json', 'src/content/']) {
      expect(SafePathSchema.safeParse(path).success, path).toBe(false);
    }

    const digest = 'a'.repeat(64);
    const problem = {
      id: 'abc500-e',
      contestId: 'abc500',
      slotLabel: 'E',
      title: 'Problem E',
      officialUrl: 'https://atcoder.jp/contests/abc500/tasks/abc500_e',
      constraintsSummary: 'Fixture constraints.',
      difficultyEvidence: 'Fixture evidence.',
      sourceRevisionIds: ['source-abc500-e'],
      checkedAt: '2026-07-17T14:00:00+09:00',
      publicationStatus: 'uncollected' as const,
      primaryTagIds: [],
      secondaryTagIds: [],
      adHocElements: [],
      placementId: null,
      explanationId: null,
    };
    expect(ProblemSchema.safeParse(problem).success).toBe(true);
    expect(
      ProblemSchema.safeParse({
        ...problem,
        officialUrl: 'https://example.com/abc500/tasks/abc500_e',
      }).success,
    ).toBe(false);
    expect(
      ProblemSchema.safeParse({
        ...problem,
        officialUrl: 'https://atcoder.jp/contests/abc500/tasks/abc500_f',
      }).success,
    ).toBe(false);

    const source = {
      id: 'source-abc500-e',
      url: 'https://atcoder.jp/contests/abc500/tasks/abc500_e',
      sourceKind: 'official_problem' as const,
      contestId: 'abc500',
      checkedAt: '2026-07-17T14:00:00+09:00',
      fingerprint: digest,
      termsCheckedAt: '2026-07-17T14:00:00+09:00',
    };
    expect(SourceRevisionSchema.safeParse(source).success).toBe(true);
    expect(
      SourceRevisionSchema.safeParse({
        ...source,
        url: 'https://atcoder.jp/contests/abc501/tasks/abc500_e',
      }).success,
    ).toBe(false);
    expect(
      SourceRevisionSchema.safeParse({ ...source, url: 'https://example.com/source' }).success,
    ).toBe(false);
  });
});
