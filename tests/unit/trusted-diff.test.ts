import { describe, expect, it } from 'vitest';

import {
  buildTrustedPublicationDiff,
  parseTrustedCatalog,
} from '../../src/lib/catalog/trusted-diff.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const sha = (character: string): string => character.repeat(64);

describe('trusted publication diff', () => {
  it('derives correction impacts from Catalog references and changed operations', () => {
    const currentCatalog = makeTrustedCatalog({}) as ReturnType<typeof makeTrustedCatalog> & {
      correctionImpacts: Record<string, unknown>[];
    };
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
    const baseCatalog = structuredClone(currentCatalog);
    baseCatalog.correctionImpacts = [];

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
        operationIds: ['operation-replace-explanation'],
      },
    ]);
  });
});
