import { describe, expect, it } from 'vitest';

import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import {
  ReleaseTransitionError,
  assertApprovalDigest,
  assertImmutableSnapshot,
  assertReviewComplete,
  calculateApprovableDigest,
  calculateCandidatePayloadDigest,
  calculateContentSubjectDigest,
  transitionReleaseCandidate,
  validatePublicationUpdate,
  validateReleaseCandidate,
} from '../../src/lib/validation/release-state.js';

const digest = 'a'.repeat(64);
const sha = (character: string): string => character.repeat(64);
const publishedAt = '2026-07-17T12:00:00+09:00';
const windowEndsAt = '2026-07-17T13:00:00+09:00';

const makePublicationUpdate = (): Record<string, unknown> => ({
  schemaVersion: '2.0.0',
  updateId: 'update-phase-two',
  kind: 'bootstrap',
  baseReleaseVersion: null,
  contestId: null,
  sourceSetFingerprint: sha('1'),
  advancedSlotLabels: ['E'],
  targetProblemIds: ['abc212-x45'],
  operations: [
    {
      operationId: 'operation-add-abc212-x45',
      entityType: 'problem',
      entityId: 'abc212-x45',
      action: 'add',
      path: 'src/content/problems/abc212-x45.json',
      beforeDigest: null,
      afterDigest: sha('a'),
      affectedProblemIds: ['abc212-x45'],
    },
  ],
  authoringResults: [
    {
      problemId: 'abc212-x45',
      slotLabel: 'E',
      resultType: 'explanation_draft',
      draftPath: 'src/content/docs/abc212-e.md',
      packetPath: null,
      templatePath: null,
      reasonCode: null,
      reason: null,
      retryCondition: null,
    },
  ],
  correctionImpactIds: [],
  validationSummary: {
    checkIds: ['check-contracts'],
    problemResults: [
      { problemId: 'abc212-x45', passed: true, findingCodes: [], remediation: null },
    ],
    blockingFindingCount: 0,
    aggregatePassed: true,
    resultDigest: sha('2'),
  },
  state: 'ELIGIBLE_FOR_BATCH',
  createdAt: publishedAt,
  updatedAt: publishedAt,
  fixtureMode: false,
});

const trustedPublicationUpdateContext = (update: Record<string, unknown>) => {
  const operations = update.operations as {
    operationId: string;
    affectedProblemIds: string[];
  }[];
  const targetProblemIds = update.targetProblemIds as string[];
  const correctionImpactIds = update.correctionImpactIds as string[];
  return {
    operationOwnership: operations.map(({ operationId, affectedProblemIds }) => ({
      operationId,
      affectedProblemIds: [...affectedProblemIds],
    })),
    correctionImpacts: correctionImpactIds.map((correctionImpactId) => ({
      correctionImpactId,
      affectedProblemIds: [...targetProblemIds],
      operationIds: operations.map(({ operationId }) => operationId),
    })),
  };
};

const makeReleaseCandidate = (): Record<string, unknown> => {
  const contentFiles = [{ path: 'src/content/catalog.json', sha256: sha('4'), byteLength: 1 }];
  const contentSubjectDigest = calculateContentSubjectDigest(contentFiles);
  const candidate: Record<string, unknown> = {
    schemaVersion: '2.0.0',
    candidateId: 'release-candidate-2026.07.17-aaaaaaaaaaaa',
    releaseKind: 'initial',
    targetReleaseVersion: '2026.07.17',
    baseReleaseVersion: null,
    cutoffAt: publishedAt,
    orderedUpdateIds: ['update-phase-two'],
    fixtureMode: false,
    advancedSlotRegistryDigest: sha('3'),
    contentFiles,
    contentSubjectDigest,
    preJudgmentCheckRefs: [
      {
        checkId: 'check-contracts',
        checkType: 'automated',
        subjectDigest: contentSubjectDigest,
        command: 'npm run test:contract',
        exitCode: 0,
        resultPath: 'docs/verification/check.json',
        resultDigest: sha('6'),
        completedAt: publishedAt,
      },
    ],
    humanContentReviewEvidenceRefs: [
      {
        evidenceId: 'human-review-phase-two',
        path: 'docs/verification/human-review.json',
        digest: sha('7'),
        subjectDigest: contentSubjectDigest,
        reviewerExecutedCheckSetDigest: sha('8'),
        aggregatePassed: true,
      },
    ],
    blockingFindings: [],
    candidateFiles: [{ path: 'dist/catalog.json', sha256: sha('9'), byteLength: 1 }],
    candidatePayloadDigest: '',
    approvableDigest: '',
    ownerApproval: null,
    publicationEffectiveAt: publishedAt,
    publicationWindowEndsAt: windowEndsAt,
    state: 'READY_TO_PUBLISH',
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
  candidate.candidatePayloadDigest = calculateCandidatePayloadDigest(
    candidate.candidateFiles as readonly unknown[],
  );
  candidate.approvableDigest = calculateApprovableDigest({
    contentSubjectDigest: candidate.contentSubjectDigest as string,
    candidatePayloadDigest: candidate.candidatePayloadDigest as string,
    preJudgmentCheckRefs: candidate.preJudgmentCheckRefs as readonly unknown[],
    humanContentReviewEvidenceRefs: candidate.humanContentReviewEvidenceRefs as readonly unknown[],
    blockingFindings: candidate.blockingFindings as readonly unknown[],
  });
  candidate.ownerApproval = {
    ownerId: 'person-owner',
    approvedDigest: candidate.approvableDigest,
    approvedAt: publishedAt,
  };
  return candidate;
};

const trustedCandidateContext = (candidate: Record<string, unknown>) => ({
  updates: [
    {
      updateId: 'update-phase-two',
      state: 'ELIGIBLE_FOR_BATCH' as const,
      baseReleaseVersion: null,
      targetReleaseVersion: '2026.07.17',
    },
  ],
  contentFiles: candidate.contentFiles as {
    path: string;
    sha256: string;
    byteLength: number;
  }[],
});

describe('release state gate', () => {
  it('allows only the declared forward transitions and fail-closed holds', () => {
    expect(transitionReleaseCandidate('DRAFTED', 'VALIDATING')).toBe('VALIDATING');
    expect(transitionReleaseCandidate('READY_TO_PUBLISH', 'ON_HOLD')).toBe('ON_HOLD');
    expect(() => transitionReleaseCandidate('DRAFTED', 'PUBLISHED')).toThrow(
      ReleaseTransitionError,
    );
  });

  it('detects any mutation of a fixed snapshot', () => {
    const files = [{ path: 'src/content/a.json', sha256: digest, byteLength: 1 }];
    const expected = canonicalDigest(files);

    expect(() => {
      assertImmutableSnapshot(expected, files);
    }).not.toThrow();
    expect(() => {
      assertImmutableSnapshot(expected, [
        { path: 'src/content/a.json', sha256: 'b'.repeat(64), byteLength: 1 },
      ]);
    }).toThrow(/IMMUTABLE_SNAPSHOT_MISMATCH/u);
  });

  it('binds owner approval to the current approvable digest', () => {
    expect(() => {
      assertApprovalDigest(digest, { approvedDigest: digest });
    }).not.toThrow();
    expect(() => {
      assertApprovalDigest(digest, { approvedDigest: 'b'.repeat(64) });
    }).toThrow(/APPROVAL_DIGEST_MISMATCH/u);
  });

  it('requires complete current review evidence before publication', () => {
    expect(() => {
      assertReviewComplete({
        subjectDigest: digest,
        expectedSubjectDigest: digest,
        applicableCheckCount: 2,
        passedApplicableCheckCount: 2,
        unreviewedItemCount: 0,
        blockingFindingCount: 0,
        aggregatePassed: true,
      });
    }).not.toThrow();

    expect(() => {
      assertReviewComplete({
        subjectDigest: digest,
        expectedSubjectDigest: digest,
        applicableCheckCount: 2,
        passedApplicableCheckCount: 1,
        unreviewedItemCount: 0,
        blockingFindingCount: 0,
        aggregatePassed: true,
      });
    }).toThrow(/REVIEW_INCOMPLETE/u);
  });

  it('requires an append-only receipt before the published state is accepted', () => {
    const candidate = makeReleaseCandidate();
    const receipt = {
      schemaVersion: '1.0.0',
      receiptId: 'publish-receipt-2026.07.17-bbbbbbbbbbbb',
      receiptPath: 'docs/verification/publish-receipts/2026.07.17.json',
      candidateId: candidate.candidateId,
      releaseVersion: '2026.07.17',
      contentSnapshotDigest: candidate.contentSubjectDigest,
      candidatePayloadDigest: candidate.candidatePayloadDigest,
      approvableDigest: candidate.approvableDigest,
      publicationEffectiveAt: publishedAt,
      publicationWindowEndsAt: windowEndsAt,
      actualAtomicSwapAt: '2026-07-17T12:30:00+09:00',
      osFamily: 'macos',
      osVersion: '15.0',
      filesystem: 'apfs',
      toolVersions: { node: '24.18.0' },
      previousReleaseVersion: null,
      newReleaseVersion: '2026.07.17',
      result: 'published',
      rawEvidenceDigest: sha('d'),
      recordedAt: '2026-07-17T12:31:00+09:00',
    };
    expect(() =>
      transitionReleaseCandidate('READY_TO_PUBLISH', 'PUBLISHED', {
        receipt,
        candidate,
        trusted: trustedCandidateContext(candidate),
      }),
    ).not.toThrow();

    expect(() =>
      transitionReleaseCandidate('READY_TO_PUBLISH', 'PUBLISHED', {
        candidate,
      }),
    ).toThrow(/PUBLISH_RECEIPT_REQUIRED/u);

    expect(() =>
      transitionReleaseCandidate('READY_TO_PUBLISH', 'PUBLISHED', {
        candidate,
        receipt: { ...receipt, approvableDigest: sha('e') },
        trusted: trustedCandidateContext(candidate),
      }),
    ).toThrow(/PUBLISH_RECEIPT_MISMATCH/u);

    expect(() =>
      transitionReleaseCandidate('READY_TO_PUBLISH', 'PUBLISHED', {
        candidate,
        receipt: { ...receipt, actualAtomicSwapAt: '2026-07-17T14:00:00+09:00' },
        trusted: trustedCandidateContext(candidate),
      }),
    ).toThrow(/PUBLISH_RECEIPT_MISMATCH/u);
  });

  it('rejects failed updates and incomplete publishable candidates', () => {
    expect(() => {
      const update = makePublicationUpdate();
      validatePublicationUpdate(update, trustedPublicationUpdateContext(update));
    }).not.toThrow();
    const failedUpdate = makePublicationUpdate();
    const [authoringResult] = failedUpdate.authoringResults as Record<string, unknown>[];
    if (!authoringResult) throw new Error('Fixture authoring result is missing.');
    authoringResult.resultType = 'blocked';
    authoringResult.draftPath = null;
    authoringResult.reasonCode = 'SOURCE_UNAVAILABLE';
    authoringResult.reason = 'The source could not be verified.';
    authoringResult.retryCondition = 'Retry after the source is restored.';
    expect(() => {
      validatePublicationUpdate(failedUpdate, trustedPublicationUpdateContext(failedUpdate));
    }).toThrow(/PUBLICATION_UPDATE_INVALID/u);

    expect(() => {
      const candidate = makeReleaseCandidate();
      validateReleaseCandidate(candidate, trustedCandidateContext(candidate));
    }).not.toThrow();
    const unapproved = makeReleaseCandidate();
    unapproved.ownerApproval = null;
    expect(() => {
      validateReleaseCandidate(unapproved, trustedCandidateContext(unapproved));
    }).toThrow(/RELEASE_CANDIDATE_INVALID/u);

    const stalePayload = makeReleaseCandidate();
    const [candidateFile] = stalePayload.candidateFiles as { sha256: string }[];
    if (!candidateFile) throw new Error('Fixture candidate file is missing.');
    candidateFile.sha256 = sha('d');
    expect(() => {
      validateReleaseCandidate(stalePayload, trustedCandidateContext(stalePayload));
    }).toThrow(/RELEASE_CANDIDATE_DIGEST_MISMATCH/u);

    const changedContent = makeReleaseCandidate();
    const [contentFile] = changedContent.contentFiles as { sha256: string }[];
    if (!contentFile) throw new Error('Fixture content file is missing.');
    const trusted = trustedCandidateContext(changedContent);
    trusted.contentFiles = structuredClone(trusted.contentFiles);
    const [trustedContentFile] = trusted.contentFiles;
    if (!trustedContentFile) throw new Error('Trusted content fixture is missing.');
    trustedContentFile.sha256 = sha('f');
    expect(() => {
      validateReleaseCandidate(changedContent, trusted);
    }).toThrow(/RELEASE_CANDIDATE_DIGEST_MISMATCH/u);

    expect(() => {
      validateReleaseCandidate(makeReleaseCandidate());
    }).toThrow(/RELEASE_TRUSTED_INVENTORY_REQUIRED/u);
  });

  it('uses explicit target Problem IDs for correction operations', () => {
    const correction = makePublicationUpdate();
    correction.kind = 'correction';
    correction.advancedSlotLabels = [];
    correction.correctionImpactIds = ['correction-impact-one'];
    correction.operations = [
      {
        operationId: 'operation-replace-explanation',
        entityType: 'explanation',
        entityId: 'explanation-abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedProblemIds: ['abc212-x45'],
      },
    ];
    expect(() => {
      validatePublicationUpdate(correction, trustedPublicationUpdateContext(correction));
    }).not.toThrow();

    const wrongTarget = makePublicationUpdate();
    wrongTarget.targetProblemIds = ['abc212-other'];
    expect(() => {
      validatePublicationUpdate(
        wrongTarget,
        trustedPublicationUpdateContext(makePublicationUpdate()),
      );
    }).toThrow(/PUBLICATION_UPDATE_INVALID/u);

    const mismatchedOperationOwner = makePublicationUpdate();
    mismatchedOperationOwner.kind = 'correction';
    mismatchedOperationOwner.advancedSlotLabels = [];
    mismatchedOperationOwner.targetProblemIds = ['abc212-other'];
    mismatchedOperationOwner.operations = [
      {
        operationId: 'operation-replace-explanation',
        entityType: 'explanation',
        entityId: 'explanation-abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedProblemIds: ['abc212-x45'],
      },
    ];
    mismatchedOperationOwner.authoringResults = (
      mismatchedOperationOwner.authoringResults as {
        problemId: string;
      }[]
    ).map((result) => ({ ...result, problemId: 'abc212-other' }));
    mismatchedOperationOwner.validationSummary = {
      ...(mismatchedOperationOwner.validationSummary as Record<string, unknown>),
      problemResults: [
        { problemId: 'abc212-other', passed: true, findingCodes: [], remediation: null },
      ],
    };
    expect(() => {
      validatePublicationUpdate(
        mismatchedOperationOwner,
        trustedPublicationUpdateContext(mismatchedOperationOwner),
      );
    }).toThrow(/PUBLICATION_UPDATE_INVALID/u);
  });

  it('fails closed when update ownership is not independently trusted', () => {
    const update = makePublicationUpdate();
    expect(() => {
      validatePublicationUpdate(update);
    }).toThrow(/PUBLICATION_UPDATE_OWNERSHIP_REQUIRED/u);

    const correction = makePublicationUpdate();
    correction.kind = 'correction';
    correction.advancedSlotLabels = [];
    correction.correctionImpactIds = [];
    correction.operations = [
      {
        operationId: 'operation-replace-explanation',
        entityType: 'explanation',
        entityId: 'explanation-abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedProblemIds: ['abc212-x45'],
      },
    ];
    expect(() => {
      validatePublicationUpdate(correction, trustedPublicationUpdateContext(correction));
    }).toThrow(/PUBLICATION_UPDATE_INVALID/u);
  });
});
