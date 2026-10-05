import { describe, expect, it } from 'vitest';
import {
  buildAdministratorHoldSummary,
  buildReleaseHistory,
} from '../../src/lib/catalog/build-release-history.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const catalog = makeTrustedCatalog({});
const record = {
  metadata: {
    schemaVersion: '1.0.0',
    version: catalog.release.version,
    cutoffAt: catalog.release.cutoffAt,
    commit: 'a'.repeat(40),
    changeSummary: {
      updateIds: catalog.release.updateIds,
      addedProblemIds: catalog.release.addedProblemIds,
      changedProblemIds: [],
      withdrawnProblemIds: [],
      taxonomyChanges: [],
    },
    validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/1',
  },
  catalog,
};

describe('full catalog release history', () => {
  it('projects immutable public records without administrator hold data', () => {
    const history = buildReleaseHistory([record]);
    expect(history[0]).toMatchObject({
      commit: record.metadata.commit,
      problemCount: 1,
      reviewEvidenceRefs: catalog.release.humanContentReviewEvidenceRefs,
    });
    expect(JSON.stringify(history)).not.toMatch(/heldProblemIds|retryCondition|holdReason/);
    expect(Object.isFrozen(history[0])).toBe(true);
    expect(buildReleaseHistory([record], history)).toEqual(history);
  });
  it('rejects rewriting a known version, duplicate commits, and mismatched summaries', () => {
    const history = buildReleaseHistory([record]);
    expect(() =>
      buildReleaseHistory(
        [{ ...record, metadata: { ...record.metadata, commit: 'b'.repeat(40) } }],
        history,
      ),
    ).toThrow('RELEASE_HISTORY_REWRITE');
    expect(() => buildReleaseHistory([record, record])).toThrow('RELEASE_HISTORY_DUPLICATE');
    expect(() =>
      buildReleaseHistory([
        {
          ...record,
          metadata: {
            ...record.metadata,
            changeSummary: { ...record.metadata.changeSummary, addedProblemIds: [] },
          },
        },
      ]),
    ).toThrow('RELEASE_HISTORY_SUMMARY_MISMATCH');
  });
  it('rejects holds and failed checks from the public projection', () => {
    expect(() =>
      buildReleaseHistory([
        { ...record, catalog: makeTrustedCatalog({ heldProblemIds: ['abc212-x45'] }) },
      ]),
    ).toThrow('RELEASE_HISTORY_INCOMPLETE');
    expect(() =>
      buildReleaseHistory([
        {
          ...record,
          catalog: makeTrustedCatalog({
            validationSummary: { ...catalog.release.validationSummary, blockingFindingCount: 1 },
          }),
        },
      ]),
    ).toThrow('RELEASE_HISTORY_INCOMPLETE');
  });
  it('keeps pending attempts in a separate administrator projection', () => {
    const summary = buildAdministratorHoldSummary([
      {
        updateId: 'update-held',
        state: 'ON_HOLD',
        fixtureMode: false,
        targetProblemIds: ['abc212-x45'],
        updatedAt: '2026-10-05T00:00:00Z',
        authoringResults: [
          {
            problemId: 'abc212-x45',
            resultType: 'blocked',
            reasonCode: 'SOURCE_UNAVAILABLE',
            reason: 'No official source.',
            retryCondition: 'Retry acquisition.',
          },
        ],
        validationSummary: {
          problemResults: [
            {
              problemId: 'abc212-x45',
              findingCodes: ['SOURCE_UNAVAILABLE'],
              remediation: 'Acquire the source.',
            },
          ],
        },
      },
    ]);
    expect(summary[0]?.problems[0]).toMatchObject({
      reasonCode: 'SOURCE_UNAVAILABLE',
      retryCondition: 'Retry acquisition.',
    });
    expect(buildReleaseHistory([record])).toHaveLength(1);
  });
});
