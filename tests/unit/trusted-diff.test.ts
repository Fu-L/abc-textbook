import { describe, expect, it } from 'vitest';

import {
  buildTrustedPublicationDiff,
  parseTrustedCatalog,
} from '../../src/lib/catalog/trusted-diff.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { validatePublicationUpdate } from '../../src/lib/validation/release-state.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const sha = (character: string): string => character.repeat(64);

describe('trusted publication diff', () => {
  it('derives correction impacts from Catalog references and changed operations', () => {
    const currentCatalog = makeTrustedCatalog({}) as ReturnType<typeof makeTrustedCatalog> & {
      correctionImpacts: Record<string, unknown>[];
    };
    const baseCatalog = structuredClone(currentCatalog);
    const explanation = currentCatalog.explanations[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;
    const correctionImpact = {
      id: 'correction-impact-graphs',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Fixture correction.',
      explanationIds: ['explanation-abc212-x45'],
      claimIds: ['claim-graphs'],
      exampleIds: ['example-graphs'],
      exerciseIds: ['exercise-graphs'],
      answerMaterialIds: ['answer-graphs'],
      learningUnitIds: ['unit-graphs'],
      derivedIndexPaths: ['src/content/docs/index.md'],
      verificationStatus: 'verified' as const,
    };
    currentCatalog.correctionImpacts.push(correctionImpact);

    const update = PublicationUpdateSchema.parse({
      schemaVersion: '2.0.0',
      updateId: 'update-correction',
      kind: 'correction',
      baseReleaseVersion: '2026.07.16',
      contestId: null,
      sourceSetFingerprint: sha('1'),
      advancedSlotLabels: [],
      targetProblemIds: ['abc212-x45'],
      operations: [
        {
          operationId: 'operation-replace-explanation',
          entityType: 'explanation',
          entityId: 'explanation-abc212-x45',
          action: 'replace',
          path: 'src/content/docs/index.md',
          beforeDigest: sha('2'),
          afterDigest: sha('3'),
          affectedProblemIds: ['abc212-x45'],
        },
        {
          operationId: 'operation-add-correction-impact',
          entityType: 'correction_impact',
          entityId: 'correction-impact-graphs',
          action: 'add',
          path: 'src/content/docs/index.md',
          beforeDigest: sha('2'),
          afterDigest: sha('3'),
          affectedProblemIds: ['abc212-x45'],
        },
      ],
      authoringResults: [
        {
          problemId: 'abc212-x45',
          slotLabel: 'E',
          resultType: 'explanation_draft',
          draftPath: 'src/content/docs/index.md',
          packetPath: null,
          templatePath: null,
          reasonCode: null,
          reason: null,
          retryCondition: null,
        },
      ],
      correctionImpactIds: ['correction-impact-graphs'],
      validationSummary: {
        checkIds: ['check-catalog'],
        problemResults: [
          { problemId: 'abc212-x45', passed: true, findingCodes: [], remediation: null },
        ],
        blockingFindingCount: 0,
        aggregatePassed: true,
        resultDigest: sha('4'),
      },
      state: 'ELIGIBLE_FOR_BATCH',
      createdAt: '2026-07-17T10:00:00+09:00',
      updatedAt: '2026-07-17T11:00:00+09:00',
      fixtureMode: false,
    });

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
    );

    expect(diff.updates[0]?.correctionImpacts).toEqual([
      {
        correctionImpactId: 'correction-impact-graphs',
        affectedProblemIds: ['abc212-x45'],
        operationIds: ['operation-add-correction-impact', 'operation-replace-explanation'],
      },
    ]);

    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: [{ path: 'src/content/docs/index.md', sha256: sha('2'), byteLength: 10 }],
        currentFiles: [{ path: 'src/content/docs/index.md', sha256: sha('3'), byteLength: 11 }],
      });
    }).not.toThrow();
  });

  it('allows removing an entity from a shared file while retaining the file', () => {
    const baseCatalog = makeTrustedCatalog({}) as ReturnType<typeof makeTrustedCatalog> & {
      correctionImpacts: Record<string, unknown>[];
    };
    const currentCatalog = structuredClone(baseCatalog);
    baseCatalog.correctionImpacts.push({
      id: 'correction-impact-graphs',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Fixture correction.',
      explanationIds: ['explanation-abc212-x45'],
      claimIds: ['claim-graphs'],
      exampleIds: ['example-graphs'],
      exerciseIds: ['exercise-graphs'],
      answerMaterialIds: ['answer-graphs'],
      learningUnitIds: ['unit-graphs'],
      derivedIndexPaths: ['src/content/docs/index.md'],
      verificationStatus: 'verified' as const,
    });

    const update = makeUpdate(
      [
        makeOperation({
          operationId: 'operation-remove-correction-impact',
          entityType: 'correction_impact',
          entityId: 'correction-impact-graphs',
          action: 'remove',
          path: 'src/content/docs/index.md',
          beforeDigest: sha('2'),
          afterDigest: sha('3'),
        }),
      ],
      ['abc212-x45'],
      'update-remove-correction-impact',
    );
    update.kind = 'correction';
    update.correctionImpactIds = ['correction-impact-graphs'];

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: [{ path: 'src/content/docs/index.md', sha256: sha('2'), byteLength: 10 }],
        currentFiles: [{ path: 'src/content/docs/index.md', sha256: sha('3'), byteLength: 11 }],
      });
    }).not.toThrow();
  });

  it('rejects a replace operation when the entity projection is unchanged', () => {
    const catalog = makeTrustedCatalog({});
    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-explanation',
        entityType: 'explanation',
        entityId: 'explanation-abc212-x45',
        action: 'replace',
        path: 'src/content/docs/index.md',
      }),
    ]);

    expect(() => {
      buildTrustedPublicationDiff(
        [update],
        parseTrustedCatalog(catalog, 'base'),
        parseTrustedCatalog(catalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_ENTITY_DIFF_INVALID/u);
  });

  it('rejects an operation whose path is not owned by the changed entity', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = makeTrustedCatalog({});
    const tag = currentCatalog.tags[0];
    if (!tag) throw new Error('Fixture tag is missing.');
    tag.name = 'Changed graphs';
    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-tag',
        entityType: 'tag',
        entityId: 'tag-graphs',
        action: 'replace',
        path: 'src/content/problems/abc212-x45.json',
      }),
    ]);

    expect(() => {
      buildTrustedPublicationDiff(
        [update],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_ENTITY_PATH_INVALID/u);
  });

  it('rejects a Catalog entity diff omitted from publication operations', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = makeTrustedCatalog({});
    const explanation = currentCatalog.explanations[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;

    expect(() => {
      buildTrustedPublicationDiff(
        [makeUpdate([], [])],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_ENTITY_DIFF_INCOMPLETE/u);
  });

  it('allows multiple changed entities to share one owned file', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = makeTrustedCatalog({});
    const explanation = currentCatalog.explanations[0];
    const learningUnit = currentCatalog.learningUnits[0];
    if (!explanation || !learningUnit) throw new Error('Fixture learning entities are missing.');
    explanation.revision = 2;
    learningUnit.orderReason = 'Changed order reason.';
    const path = 'src/content/docs/index.md';
    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-explanation',
        entityType: 'explanation',
        entityId: 'explanation-abc212-x45',
        action: 'replace',
        path,
      }),
      makeOperation({
        operationId: 'operation-replace-learning-unit',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        action: 'replace',
        path,
      }),
    ]);

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
    );
    expect(diff.updates[0]?.operationOwnership).toHaveLength(2);
  });

  it('rejects the same entity diff and path claimed by multiple updates', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = makeTrustedCatalog({});
    const explanation = currentCatalog.explanations[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;

    expect(() => {
      buildTrustedPublicationDiff(
        [
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-replace-explanation-first',
                entityType: 'explanation',
                entityId: 'explanation-abc212-x45',
              }),
            ],
            ['abc212-x45'],
            'update-first',
          ),
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-replace-explanation-second',
                entityType: 'explanation',
                entityId: 'explanation-abc212-x45',
              }),
            ],
            ['abc212-x45'],
            'update-second',
          ),
        ],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_ENTITY_DIFF_DUPLICATE/u);
  });
});

const makeOperation = (overrides: Record<string, unknown>): Record<string, unknown> => ({
  operationId: 'operation-default',
  entityType: 'explanation',
  entityId: 'explanation-abc212-x45',
  action: 'replace',
  path: 'src/content/docs/index.md',
  beforeDigest: sha('2'),
  afterDigest: sha('3'),
  affectedProblemIds: ['abc212-x45'],
  ...overrides,
});

const makeUpdate = (
  operations: readonly Record<string, unknown>[],
  targetProblemIds: readonly string[] = ['abc212-x45'],
  updateId = 'update-diff-fixture',
) =>
  PublicationUpdateSchema.parse({
    schemaVersion: '2.0.0',
    updateId,
    kind: 'bootstrap',
    baseReleaseVersion: null,
    contestId: null,
    sourceSetFingerprint: sha('1'),
    advancedSlotLabels: [],
    targetProblemIds,
    operations,
    authoringResults: [],
    correctionImpactIds: [],
    validationSummary: {
      checkIds: ['check-catalog'],
      problemResults: [],
      blockingFindingCount: 0,
      aggregatePassed: false,
      resultDigest: sha('4'),
    },
    state: 'PREPARING',
    createdAt: '2026-07-17T10:00:00+09:00',
    updatedAt: '2026-07-17T11:00:00+09:00',
    fixtureMode: false,
  });
