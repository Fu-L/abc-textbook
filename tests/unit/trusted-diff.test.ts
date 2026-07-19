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
    const explanation = currentCatalog.authoringUnits[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;
    const correctionImpact = {
      id: 'correction-impact-graphs',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Fixture correction.',
      authoringUnitProblemIds: ['abc212-x45'],
      affectedSectionKeys: ['sections.correctness'],
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
          entityType: 'authoring_unit',
          entityId: 'abc212-x45',
          action: 'replace',
          path: 'src/content/docs/index.md',
          beforeDigest: sha('2'),
          afterDigest: sha('3'),
          affectedEntities: [],
          affectedProblemIds: ['abc212-x45'],
        },
      ],
      authoringResults: [
        {
          problemId: 'abc212-x45',
          slotLabel: 'E',
          resultType: 'authoring_unit_draft',
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
        operationIds: ['operation-replace-explanation'],
      },
    ]);

    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);
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
      authoringUnitProblemIds: ['abc212-x45'],
      affectedSectionKeys: ['sections.correctness'],
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
          action: 'replace',
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
    persistAffectedEntities(update, trustedUpdate);
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
        entityType: 'authoring_unit',
        entityId: 'abc212-x45',
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
    const explanation = currentCatalog.authoringUnits[0];
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
    const explanation = currentCatalog.authoringUnits[0];
    const learningUnit = currentCatalog.learningUnits[0];
    if (!explanation || !learningUnit) throw new Error('Fixture learning entities are missing.');
    explanation.revision = 2;
    learningUnit.orderReason = 'Changed order reason.';
    const path = 'src/content/docs/index.md';
    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-explanation',
        entityType: 'authoring_unit',
        entityId: 'abc212-x45',
        action: 'replace',
        path,
      }),
      makeOperation({
        operationId: 'operation-replace-learning-unit-json',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        action: 'replace',
        path: 'src/content/learning-units/unit-graphs.json',
      }),
    ]);

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
    );
    expect(diff.updates[0]?.operationOwnership).toHaveLength(2);
    expect(diff.updates[0]?.operationOwnership[0]?.affectedEntities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ entityType: 'authoring_unit' }),
        expect.objectContaining({ entityType: 'learning_unit' }),
      ]),
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    const sourceInventory = {
      baseFiles: [
        { path, sha256: sha('2'), byteLength: 10 },
        {
          path: 'src/content/learning-units/unit-graphs.json',
          sha256: sha('2'),
          byteLength: 10,
        },
      ],
      currentFiles: [
        { path, sha256: sha('3'), byteLength: 11 },
        {
          path: 'src/content/learning-units/unit-graphs.json',
          sha256: sha('3'),
          byteLength: 11,
        },
      ],
    };
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        ...sourceInventory,
      });
    }).toThrow(/PUBLICATION_UPDATE_OWNERSHIP_INVALID/u);

    persistAffectedEntities(update, trustedUpdate);
    expect(update.operations.map(({ affectedEntities }) => affectedEntities)).toEqual(
      trustedUpdate.operationOwnership.map(({ affectedEntities }) => affectedEntities),
    );
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        ...sourceInventory,
      });
    }).not.toThrow();
  });

  it('requires only the changed structured source for LearningUnit metadata changes', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const baseUnit = baseCatalog.learningUnits[0];
    const currentUnit = currentCatalog.learningUnits[0];
    if (!baseUnit || !currentUnit) throw new Error('LearningUnit fixture is missing.');
    baseUnit.docPath = 'src/content/docs/unit-graphs.md';
    currentUnit.docPath = baseUnit.docPath;
    currentUnit.orderReason = 'Changed order reason.';

    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-learning-unit-json',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        path: 'src/content/learning-units/unit-graphs.json',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
      }),
    ]);
    const sourceInventory = {
      baseFiles: [
        { path: 'src/content/learning-units/unit-graphs.json', sha256: sha('a'), byteLength: 10 },
        { path: 'src/content/docs/unit-graphs.md', sha256: sha('c'), byteLength: 10 },
      ],
      currentFiles: [
        { path: 'src/content/learning-units/unit-graphs.json', sha256: sha('b'), byteLength: 11 },
        { path: 'src/content/docs/unit-graphs.md', sha256: sha('c'), byteLength: 10 },
      ],
    };

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
      sourceInventory,
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);
    expect(trustedUpdate.operationOwnership.map(({ path }) => path)).toEqual([
      'src/content/learning-units/unit-graphs.json',
    ]);
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: sourceInventory.baseFiles,
        currentFiles: sourceInventory.currentFiles,
      });
    }).not.toThrow();
  });

  it('represents a LearningUnit body-only change even when its Catalog projection is unchanged', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const baseUnit = baseCatalog.learningUnits[0];
    const currentUnit = currentCatalog.learningUnits[0];
    if (!baseUnit || !currentUnit) throw new Error('LearningUnit fixture is missing.');
    baseUnit.docPath = 'src/content/docs/unit-graphs.md';
    currentUnit.docPath = baseUnit.docPath;

    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-learning-unit-body',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        path: 'src/content/docs/unit-graphs.md',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
      }),
    ]);
    const sourceInventory = {
      baseFiles: [
        { path: 'src/content/learning-units/unit-graphs.json', sha256: sha('c'), byteLength: 10 },
        { path: 'src/content/docs/unit-graphs.md', sha256: sha('a'), byteLength: 10 },
      ],
      currentFiles: [
        { path: 'src/content/learning-units/unit-graphs.json', sha256: sha('c'), byteLength: 10 },
        { path: 'src/content/docs/unit-graphs.md', sha256: sha('b'), byteLength: 11 },
      ],
    };

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
      sourceInventory,
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);
    expect(trustedUpdate.operationOwnership.map(({ path }) => path)).toEqual([
      'src/content/docs/unit-graphs.md',
    ]);
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: sourceInventory.baseFiles,
        currentFiles: sourceInventory.currentFiles,
      });
    }).not.toThrow();
  });

  it('records a shared Markdown body change once without inventing other entity diffs', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const baseUnit = baseCatalog.learningUnits[0];
    const currentUnit = currentCatalog.learningUnits[0];
    if (!baseUnit || !currentUnit) throw new Error('LearningUnit fixture is missing.');
    baseUnit.docPath = 'src/content/docs/index.md';
    currentUnit.docPath = baseUnit.docPath;
    const sourceInventory = {
      baseFiles: [{ path: baseUnit.docPath, sha256: sha('a'), byteLength: 10 }],
      currentFiles: [{ path: baseUnit.docPath, sha256: sha('b'), byteLength: 11 }],
    };
    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-learning-unit-body',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
      }),
    ]);

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
      sourceInventory,
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);
    expect(trustedUpdate.operationOwnership).toHaveLength(1);
    expect(trustedUpdate.operationOwnership[0]?.affectedEntities).toEqual([]);
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: [],
        ...sourceInventory,
      });
    }).not.toThrow();
  });

  it('includes every independent owner Problem for a shared body-only change', () => {
    const baseCatalog = makeTrustedCatalog({});
    const independentUnit = structuredClone(baseCatalog.learningUnits[0]);
    if (!independentUnit) throw new Error('LearningUnit fixture is missing.');
    independentUnit.id = 'unit-independent';
    independentUnit.title = 'Independent shared owner';
    independentUnit.problemIds = ['abc212-x46'];
    independentUnit.globalIndex = 1;
    baseCatalog.learningUnits.push(independentUnit);
    const currentCatalog = structuredClone(baseCatalog);
    const path = 'src/content/docs/index.md';
    const sourceInventory = {
      baseFiles: [{ path, sha256: sha('a'), byteLength: 10 }],
      currentFiles: [{ path, sha256: sha('b'), byteLength: 11 }],
    };
    const update = makeUpdate(
      [
        makeOperation({
          operationId: 'operation-replace-shared-body',
          beforeDigest: sha('a'),
          afterDigest: sha('b'),
          affectedProblemIds: ['abc212-x45', 'abc212-x46'],
        }),
      ],
      ['abc212-x45', 'abc212-x46'],
    );

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
      sourceInventory,
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    expect(trustedUpdate.operationOwnership[0]).toMatchObject({
      affectedProblemIds: ['abc212-x45', 'abc212-x46'],
      affectedEntities: [],
    });
    persistAffectedEntities(update, trustedUpdate);
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        ...sourceInventory,
      });
    }).not.toThrow();
  });

  it.each(['add', 'replace', 'remove'] as const)(
    'publishes a problem-less ContestSlot through a stable operation identity (%s)',
    (transition) => {
      const absentSlot = {
        contestId: 'abc212',
        label: 'E',
        officialOrder: null,
        availability: 'official_absent' as const,
        catalogStatus: 'uncollected' as const,
        holdReason: null,
        problemId: null,
        sourceRevisionId: 'source-revision-abc212-e',
        checkedAt: '2026-07-17T02:00:00+09:00',
      };
      const baseCatalog = makeTrustedCatalog({}) as unknown as Record<string, unknown> & {
        contestSlots: Record<string, unknown>[];
      };
      const currentCatalog = structuredClone(baseCatalog);
      baseCatalog.contestSlots = transition === 'add' ? [] : [structuredClone(absentSlot)];
      currentCatalog.contestSlots =
        transition === 'remove'
          ? []
          : [
              transition === 'replace'
                ? { ...absentSlot, checkedAt: '2026-07-18T02:00:00+09:00' }
                : structuredClone(absentSlot),
            ];
      const path = 'src/content/problem-slots/contest-slot-abc212-e.json';
      const beforeDigest = transition === 'add' ? null : sha('a');
      const afterDigest = transition === 'remove' ? null : sha('b');
      const sourceInventory = {
        baseFiles: beforeDigest === null ? [] : [{ path, sha256: beforeDigest, byteLength: 10 }],
        currentFiles: afterDigest === null ? [] : [{ path, sha256: afterDigest, byteLength: 11 }],
      };
      const update = makeUpdate(
        [
          makeOperation({
            operationId: `operation-${transition}-contest-slot`,
            entityType: 'contest_slot',
            entityId: 'contest-slot-abc212-e',
            action: transition,
            path,
            beforeDigest,
            afterDigest,
            affectedEntities: [],
            affectedProblemIds: [],
          }),
        ],
        [],
        `update-${transition}-contest-slot`,
      );

      const diff = buildTrustedPublicationDiff(
        [update],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
        sourceInventory,
      );
      const trustedUpdate = diff.updates[0];
      if (!trustedUpdate) throw new Error('Trusted update is missing.');
      persistAffectedEntities(update, trustedUpdate);
      expect(trustedUpdate.operationOwnership[0]?.affectedProblemIds).toEqual([]);
      expect(trustedUpdate.operationOwnership[0]?.affectedEntities).toEqual([
        {
          entityType: 'contest_slot',
          entityId: 'contest-slot-abc212-e',
          action: transition,
        },
      ]);
      expect(() => {
        validatePublicationUpdate(update, {
          operationOwnership: trustedUpdate.operationOwnership,
          correctionImpacts: [],
          ...sourceInventory,
        });
      }).not.toThrow();
    },
  );

  it('requires both LearningUnit sources when metadata and body change together', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const baseUnit = baseCatalog.learningUnits[0];
    const currentUnit = currentCatalog.learningUnits[0];
    if (!baseUnit || !currentUnit) throw new Error('LearningUnit fixture is missing.');
    baseUnit.docPath = 'src/content/docs/unit-graphs.md';
    currentUnit.docPath = baseUnit.docPath;
    currentUnit.orderReason = 'Changed order reason.';

    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-replace-learning-unit-json',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        path: 'src/content/learning-units/unit-graphs.json',
        beforeDigest: sha('a'),
        afterDigest: sha('b'),
      }),
      makeOperation({
        operationId: 'operation-replace-learning-unit-body',
        entityType: 'learning_unit',
        entityId: 'unit-graphs',
        path: 'src/content/docs/unit-graphs.md',
        beforeDigest: sha('c'),
        afterDigest: sha('d'),
      }),
    ]);
    const sourceInventory = {
      baseFiles: [
        { path: 'src/content/learning-units/unit-graphs.json', sha256: sha('a'), byteLength: 10 },
        { path: 'src/content/docs/unit-graphs.md', sha256: sha('c'), byteLength: 10 },
      ],
      currentFiles: [
        { path: 'src/content/learning-units/unit-graphs.json', sha256: sha('b'), byteLength: 11 },
        { path: 'src/content/docs/unit-graphs.md', sha256: sha('d'), byteLength: 11 },
      ],
    };

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
      sourceInventory,
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);
    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: sourceInventory.baseFiles,
        currentFiles: sourceInventory.currentFiles,
      });
    }).not.toThrow();
  });

  it('allows an explanation docPath move through the complete release validation', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const explanation = currentCatalog.authoringUnits[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.docPath = 'src/content/docs/moved.md';

    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-remove-explanation-doc',
        action: 'remove',
        beforeDigest: sha('2'),
        afterDigest: null,
      }),
      makeOperation({
        operationId: 'operation-add-explanation-doc',
        action: 'add',
        path: 'src/content/docs/moved.md',
        beforeDigest: null,
        afterDigest: sha('3'),
      }),
    ]);
    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);

    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: [{ path: 'src/content/docs/index.md', sha256: sha('2'), byteLength: 10 }],
        currentFiles: [{ path: 'src/content/docs/moved.md', sha256: sha('3'), byteLength: 11 }],
      });
    }).not.toThrow();
  });

  it('allows replacing correction impact index paths through the complete release validation', () => {
    const baseCatalog = makeTrustedCatalog({}) as ReturnType<typeof makeTrustedCatalog> & {
      correctionImpacts: Record<string, unknown>[];
    };
    const correctionImpact = {
      id: 'correction-impact-graphs',
      sourceRevisionId: 'source-revision-abc212-e',
      changeSummary: 'Fixture correction.',
      authoringUnitProblemIds: ['abc212-x45'],
      affectedSectionKeys: ['sections.correctness'],
      learningUnitIds: ['unit-graphs'],
      derivedIndexPaths: ['src/content/docs/index.md'],
      verificationStatus: 'verified' as const,
    };
    baseCatalog.correctionImpacts.push(correctionImpact);
    const currentCatalog = structuredClone(baseCatalog);
    const currentImpact = currentCatalog.correctionImpacts[0] as
      Record<string, unknown> | undefined;
    if (!currentImpact) throw new Error('Fixture correction impact is missing.');
    currentImpact.derivedIndexPaths = ['src/content/docs/moved-index.md'];

    const update = makeUpdate([
      makeOperation({
        operationId: 'operation-remove-correction-index',
        entityType: 'correction_impact',
        entityId: 'correction-impact-graphs',
        action: 'remove',
        beforeDigest: sha('2'),
        afterDigest: null,
      }),
      makeOperation({
        operationId: 'operation-add-correction-index',
        entityType: 'correction_impact',
        entityId: 'correction-impact-graphs',
        action: 'add',
        path: 'src/content/docs/moved-index.md',
        beforeDigest: null,
        afterDigest: sha('3'),
      }),
    ]);
    update.kind = 'correction';
    update.correctionImpactIds = ['correction-impact-graphs'];

    const diff = buildTrustedPublicationDiff(
      [update],
      parseTrustedCatalog(baseCatalog, 'base'),
      parseTrustedCatalog(currentCatalog, 'current'),
    );
    const trustedUpdate = diff.updates[0];
    if (!trustedUpdate) throw new Error('Trusted update is missing.');
    persistAffectedEntities(update, trustedUpdate);

    expect(() => {
      validatePublicationUpdate(update, {
        operationOwnership: trustedUpdate.operationOwnership,
        correctionImpacts: trustedUpdate.correctionImpacts,
        baseFiles: [{ path: 'src/content/docs/index.md', sha256: sha('2'), byteLength: 10 }],
        currentFiles: [
          { path: 'src/content/docs/moved-index.md', sha256: sha('3'), byteLength: 11 },
        ],
      });
    }).not.toThrow();
  });

  it('rejects splitting one entity diff across updates even when paths differ', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const explanation = currentCatalog.authoringUnits[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.docPath = 'src/content/docs/moved.md';

    expect(() => {
      buildTrustedPublicationDiff(
        [
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-remove-explanation-doc',
                action: 'remove',
                beforeDigest: sha('2'),
                afterDigest: null,
              }),
            ],
            ['abc212-x45'],
            'update-remove-explanation-doc',
          ),
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-add-explanation-doc',
                action: 'add',
                path: 'src/content/docs/moved.md',
                beforeDigest: null,
                afterDigest: sha('3'),
              }),
            ],
            ['abc212-x45'],
            'update-add-explanation-doc',
          ),
        ],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_ENTITY_DIFF_DUPLICATE/u);
  });

  it('rejects the same entity diff and path claimed by multiple updates', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = makeTrustedCatalog({});
    const explanation = currentCatalog.authoringUnits[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;

    expect(() => {
      buildTrustedPublicationDiff(
        [
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-replace-explanation-first',
                entityType: 'authoring_unit',
                entityId: 'abc212-x45',
              }),
            ],
            ['abc212-x45'],
            'update-first',
          ),
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-replace-explanation-second',
                entityType: 'authoring_unit',
                entityId: 'abc212-x45',
              }),
            ],
            ['abc212-x45'],
            'update-second',
          ),
        ],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_DUPLICATE_PATH/u);
  });

  it('rejects splitting shared source paths across entity updates', () => {
    const baseCatalog = makeTrustedCatalog({});
    const currentCatalog = structuredClone(baseCatalog);
    const explanation = currentCatalog.authoringUnits[0];
    const learningUnit = currentCatalog.learningUnits[0];
    if (!explanation || !learningUnit) throw new Error('Fixture learning entities are missing.');
    explanation.docPath = 'src/content/docs/moved.md';
    learningUnit.docPath = 'src/content/docs/moved.md';

    expect(() => {
      buildTrustedPublicationDiff(
        [
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-remove-explanation-doc',
                entityType: 'authoring_unit',
                entityId: 'abc212-x45',
                action: 'remove',
                beforeDigest: sha('2'),
                afterDigest: null,
              }),
              makeOperation({
                operationId: 'operation-add-explanation-doc',
                entityType: 'authoring_unit',
                entityId: 'abc212-x45',
                action: 'add',
                path: 'src/content/docs/moved.md',
                beforeDigest: null,
                afterDigest: sha('3'),
              }),
            ],
            ['abc212-x45'],
            'update-explanation-move',
          ),
          makeUpdate(
            [
              makeOperation({
                operationId: 'operation-remove-learning-unit-doc',
                entityType: 'learning_unit',
                entityId: 'unit-graphs',
                action: 'remove',
                beforeDigest: sha('2'),
                afterDigest: null,
              }),
              makeOperation({
                operationId: 'operation-add-learning-unit-doc',
                entityType: 'learning_unit',
                entityId: 'unit-graphs',
                action: 'add',
                path: 'src/content/docs/moved.md',
                beforeDigest: null,
                afterDigest: sha('3'),
              }),
            ],
            ['abc212-x45'],
            'update-learning-unit-move',
          ),
        ],
        parseTrustedCatalog(baseCatalog, 'base'),
        parseTrustedCatalog(currentCatalog, 'current'),
      );
    }).toThrow(/PUBLICATION_UPDATE_DUPLICATE_PATH/u);
  });
});

const makeOperation = (overrides: Record<string, unknown>): Record<string, unknown> => ({
  operationId: 'operation-default',
  entityType: 'authoring_unit',
  entityId: 'abc212-x45',
  action: 'replace',
  path: 'src/content/docs/index.md',
  beforeDigest: sha('2'),
  afterDigest: sha('3'),
  affectedEntities: [],
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

const persistAffectedEntities = (
  update: ReturnType<typeof makeUpdate>,
  trustedUpdate: ReturnType<typeof buildTrustedPublicationDiff>['updates'][number],
): void => {
  for (const operation of update.operations) {
    const trustedOperation = trustedUpdate.operationOwnership.find(
      ({ operationId }) => operationId === operation.operationId,
    );
    if (!trustedOperation)
      throw new Error(`Trusted operation ${operation.operationId} is missing.`);
    operation.affectedEntities = trustedOperation.affectedEntities.map((diff) => ({ ...diff }));
  }
};
