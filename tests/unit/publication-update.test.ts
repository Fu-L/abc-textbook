import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { buildReleaseHistory } from '../../src/lib/catalog/build-release-history.js';
import { buildPublicationCandidate } from '../../src/lib/catalog/build-publication.js';
import { writeBuildReleaseMetadata } from '../../scripts/release/build-history.js';

const legacyCatalog = CatalogSchema.parse(
  JSON.parse(readFileSync('docs/verification/releases/catalog.json', 'utf8')) as unknown,
);

import {
  assertReviewComplete,
  validatePublicationUpdate,
} from '../../src/lib/validation/publication-update.js';

const digest = 'a'.repeat(64);
const sha = (character: string): string => character.repeat(64);
const updatedAt = '2026-07-17T12:00:00+09:00';

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
      affectedEntities: [],
      affectedProblemIds: ['abc212-x45'],
    },
  ],
  authoringResults: [
    {
      problemId: 'abc212-x45',
      slotLabel: 'E',
      resultType: 'authoring_unit_draft',
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
  createdAt: updatedAt,
  updatedAt,
  fixtureMode: false,
});

const trustedPublicationUpdateContext = (update: Record<string, unknown>) => {
  const operations = update.operations as {
    operationId: string;
    affectedEntities: {
      entityType: string;
      entityId: string;
      action: 'add' | 'replace' | 'remove';
    }[];
    affectedProblemIds: string[];
  }[];
  const targetProblemIds = update.targetProblemIds as string[];
  const correctionImpactIds = update.correctionImpactIds as string[];
  return {
    operationOwnership: operations.map(({ operationId, affectedEntities, affectedProblemIds }) => ({
      operationId,
      affectedEntities: affectedEntities.map((diff) => ({ ...diff })),
      affectedProblemIds: [...affectedProblemIds],
    })),
    correctionImpacts: correctionImpactIds.map((correctionImpactId) => ({
      correctionImpactId,
      affectedProblemIds: [...targetProblemIds],
      operationIds: operations.map(({ operationId }) => operationId),
    })),
  };
};

describe('publication update validation', () => {
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

  it('rejects failed publication updates', () => {
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
  });

  it('uses explicit target Problem IDs for correction operations', () => {
    const correction = makePublicationUpdate();
    correction.kind = 'correction';
    correction.advancedSlotLabels = [];
    correction.correctionImpactIds = ['correction-impact-one'];
    correction.operations = [
      {
        operationId: 'operation-replace-explanation',
        entityType: 'authoring_unit',
        entityId: 'abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedEntities: [],
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
        entityType: 'authoring_unit',
        entityId: 'abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedEntities: [],
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

  it('rejects multiple operations that duplicate one file transition', () => {
    const update = makePublicationUpdate();
    update.operations = [
      {
        operationId: 'operation-replace-explanation',
        entityType: 'authoring_unit',
        entityId: 'abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedEntities: [],
        affectedProblemIds: ['abc212-x45'],
      },
      {
        operationId: 'operation-replace-learning-unit',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedEntities: [],
        affectedProblemIds: ['abc212-x45'],
      },
    ];
    const operations = update.operations as {
      operationId: string;
      affectedEntities: [];
      affectedProblemIds: string[];
      entityType: string;
      entityId: string;
      action: 'add' | 'replace' | 'remove';
      path: string;
      beforeDigest: string | null;
      afterDigest: string | null;
    }[];
    const trusted = {
      operationOwnership: operations,
      baseFiles: [{ path: 'src/content/docs/abc212-e.md', sha256: sha('a'), byteLength: 10 }],
      currentFiles: [{ path: 'src/content/docs/abc212-e.md', sha256: sha('b'), byteLength: 11 }],
    };

    expect(() => {
      validatePublicationUpdate(update, trusted);
    }).toThrow(/PUBLICATION_UPDATE_INVALID/u);
  });

  it.each([
    ['replace+add', ['replace', 'add'] as const],
    ['replace+remove', ['replace', 'remove'] as const],
    ['add+add', ['add', 'add'] as const],
    ['remove+remove', ['remove', 'remove'] as const],
  ])(
    'rejects duplicate file transitions independently of entity actions (%s)',
    (_label, actions) => {
      const operations = actions.map((action, index) => ({
        operationId: `operation-shared-${String(index)}`,
        entityType: index === 0 ? 'authoring_unit' : 'learning_unit',
        entityId: index === 0 ? 'abc212-x45' : 'unit-graphs',
        action,
        path: 'src/content/docs/index.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedEntities: [],
        affectedProblemIds: ['abc212-x45'],
      }));
      const update = makePublicationUpdate();
      update.operations = operations;

      expect(() => {
        validatePublicationUpdate(update, {
          operationOwnership: operations,
          baseFiles: [{ path: 'src/content/docs/index.md', sha256: sha('a'), byteLength: 10 }],
          currentFiles: [{ path: 'src/content/docs/index.md', sha256: sha('b'), byteLength: 11 }],
        });
      }).toThrow(/PUBLICATION_UPDATE_INVALID/u);
    },
  );

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
        entityType: 'authoring_unit',
        entityId: 'abc212-x45',
        action: 'replace',
        path: 'src/content/docs/abc212-e.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
        affectedEntities: [],
        affectedProblemIds: ['abc212-x45'],
      },
    ];
    expect(() => {
      validatePublicationUpdate(correction, trustedPublicationUpdateContext(correction));
    }).toThrow(/PUBLICATION_UPDATE_INVALID/u);
  });
});

// Disposable candidate inputs never represent a successful Pages deployment.
describe('standard Pages candidate', () => {
  const publication = {
    version: '2026.10.09-r123',
    createdAt: '2026-10-09T00:00:00Z',
    commit: 'a'.repeat(40),
    runUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/123',
  };
  it('replaces stale public metadata from the same built catalog and removes it locally', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'publication-metadata-'));
    try {
      const candidate = buildPublicationCandidate(legacyCatalog, publication, [], []);
      await mkdir(path.join(root, 'data'));
      await writeFile(path.join(root, 'data/catalog.json'), JSON.stringify(candidate.catalog));
      const metadataPath = path.join(root, 'release-metadata.json');
      const directory = pathToFileURL(`${root}/`);
      await writeFile(metadataPath, '{"stale":true}');
      await writeBuildReleaseMetadata(directory, publication);
      expect(JSON.parse(await readFile(metadataPath, 'utf8')) as unknown).toEqual(
        candidate.metadata,
      );
      await writeBuildReleaseMetadata(directory, null);
      await expect(access(metadataPath)).rejects.toThrow();
      await expect(
        writeBuildReleaseMetadata(directory, { ...publication, version: '2026.10.09-r124' }),
      ).rejects.toThrow('PUBLICATION_METADATA_CATALOG_MISMATCH');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it('builds a prepared candidate without old acceptance or check digests', () => {
    const candidate = buildPublicationCandidate(legacyCatalog, publication, [], []);
    expect(candidate.catalog.release.publicationStatus).toBe('prepared');
    expect(candidate.catalog.release.version).toBe(publication.version);
    expect(candidate.metadata?.commit).toBe(publication.commit);
    expect(candidate.metadata?.validationResultsUrl).toBe(publication.runUrl);
    expect(candidate.catalog.release.validationSummary).toBeUndefined();
    expect(candidate.catalog.release.agentQualityReviewEvidenceRef).toBeUndefined();
    expect(candidate.catalog.release.manifestDigest).toBeUndefined();
    expect(candidate.catalog.release.contentSnapshotDigest).toBeUndefined();
    expect(() =>
      buildReleaseHistory([{ catalog: candidate.catalog, metadata: candidate.metadata }]),
    ).toThrow('RELEASE_HISTORY_INCOMPLETE');
  });
  it('keeps cutoff and scope and empties textbook changes for a history-only deployment', () => {
    const candidate = buildPublicationCandidate(
      legacyCatalog,
      publication,
      [
        { status: 'M', file: 'src/content/indexes/release-history.json' },
        { status: 'M', file: 'docs/operations/update-manual.md' },
      ],
      [],
    );
    expect(candidate.metadata?.changeSummary).toMatchObject({
      addedProblemIds: [],
      changedProblemIds: [],
      withdrawnProblemIds: [],
      taxonomyChanges: [],
    });
    for (const key of [
      'cutoffAt',
      'firstContestId',
      'lastContestId',
      'problemCount',
      'contestCount',
    ] as const)
      expect(candidate.catalog.release[key]).toBe(legacyCatalog.release[key]);
    expect(candidate.catalog.problems).toEqual(legacyCatalog.problems);
  });
  it('includes a previously undeployed prose correction in the change summary', () => {
    const candidate = buildPublicationCandidate(
      legacyCatalog,
      publication,
      [
        { status: 'M', file: 'src/content/docs/problems/abc212-e.md' },
        { status: 'M', file: 'src/content/indexes/release-history.json' },
      ],
      [],
    );
    expect(candidate.metadata?.changeSummary.changedProblemIds).toEqual(['abc212-e']);
  });
  it('does not claim an empty textbook scope when the publication comparison is unavailable', () => {
    const candidate = buildPublicationCandidate(legacyCatalog, publication, null, []);
    expect(candidate.metadata?.changeSummary.changedProblemIds).toHaveLength(868);
  });
  it('keeps local baseline candidates metadata-free', () => {
    const candidate = buildPublicationCandidate(
      legacyCatalog,
      { version: legacyCatalog.release.version },
      [],
      [],
    );
    expect(candidate.metadata).toBeNull();
    expect(candidate.catalog.release.publicationStatus).toBe('prepared');
  });
  it('rejects an existing version with a different SHA, scope, or summary', () => {
    const candidate = buildPublicationCandidate(legacyCatalog, publication, [], []);
    if (!candidate.metadata) throw new Error('Missing fixture metadata');
    const entry = {
      ...candidate.metadata,
      validatedAt: candidate.catalog.release.validatedAt,
      firstContestId: candidate.catalog.release.firstContestId,
      lastContestId: candidate.catalog.release.lastContestId,
      contestCount: candidate.catalog.release.contestCount,
      problemCount: candidate.catalog.release.problemCount,
      changelogPath: candidate.catalog.release.changelogPath,
    };
    expect(() => buildPublicationCandidate(legacyCatalog, publication, [], [entry])).not.toThrow();
    for (const change of [
      { commit: 'b'.repeat(40) },
      { problemCount: 867 },
      { changeSummary: { ...entry.changeSummary, changedProblemIds: ['abc212-e'] } },
    ])
      expect(() =>
        buildPublicationCandidate(legacyCatalog, publication, [], [{ ...entry, ...change }]),
      ).toThrow('PUBLICATION_VERSION_CONFLICT');
  });
});
