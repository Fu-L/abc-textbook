import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { loadGitReleaseHistory } from '../../scripts/release/build-history.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { ReleaseMetadataSchema } from '../../src/lib/domain/schema-parts/release.js';
import {
  PublicReleaseHistoryEntrySchema,
  PublicReleaseHistorySchema,
} from '../../src/lib/catalog/build-release-history.js';
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
  it('rejects rewriting a known version, duplicate versions, and mismatched summaries', () => {
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
  it('reads actual legacy catalog, metadata and history without changing values', async () => {
    const legacy = JSON.parse(
      await readFile('docs/verification/deployments/initial-history.json', 'utf8'),
    ) as unknown[];
    const metadata = legacy.map((value) => {
      const { schemaVersion, version, cutoffAt, commit, changeSummary, validationResultsUrl } =
        PublicReleaseHistoryEntrySchema.parse(value);
      return { schemaVersion, version, cutoffAt, commit, changeSummary, validationResultsUrl };
    });
    for (const item of metadata) {
      const original = JSON.parse(
        execFileSync('git', ['show', `${item.commit}:docs/verification/releases/catalog.json`], {
          maxBuffer: 128 * 1024 * 1024,
        }).toString(),
      ) as unknown;
      expect(CatalogSchema.parse(original)).toEqual(original);
      expect(ReleaseMetadataSchema.parse(item)).toEqual(item);
    }
    expect(
      await loadGitReleaseHistory({
        metadata,
        previous: legacy.map((value) => PublicReleaseHistoryEntrySchema.parse(value)),
        confirmHostPublication: (commit) =>
          Promise.resolve(metadata.find((item) => item.commit === commit)),
      }),
    ).toEqual(legacy);
  });

  const withoutEvidence = (version: string) => {
    const next = structuredClone(record);
    next.catalog.release.version = version;
    next.metadata.version = version;
    const release = next.catalog.release as Record<string, unknown>;
    for (const field of [
      'manifestDigest',
      'contentFileInventoryDigest',
      'contentSnapshotDigest',
      'validationSummary',
      'humanContentReviewEvidenceRefs',
      'agentQualityReviewEvidenceRef',
    ])
      Reflect.deleteProperty(release, field);
    return next;
  };

  it('reads evidence-free releases in publication order, including separate runs of the same SHA', () => {
    const first = withoutEvidence('2026.10.09-r9');
    const second = withoutEvidence('2026.10.09-r10');
    second.metadata.validationResultsUrl = 'https://github.com/Fu-L/abc-textbook/actions/runs/10';
    const previous = buildReleaseHistory([record, first]);
    const history = buildReleaseHistory([record, first, second], previous);
    expect(history.map(({ version }) => version)).toEqual([
      record.metadata.version,
      first.metadata.version,
      second.metadata.version,
    ]);
    expect(history.slice(0, 2)).toEqual(previous);
    expect(history[1]).not.toHaveProperty('validationSummary');
    expect(history[1]).not.toHaveProperty('reviewEvidenceRefs');
    for (const entry of history)
      expect(PublicReleaseHistoryEntrySchema.parse(entry)).toEqual(entry);
    expect(() => buildReleaseHistory([first, first])).toThrow('RELEASE_HISTORY_DUPLICATE');
    expect(() => PublicReleaseHistorySchema.parse([history[0], history[0]])).toThrow(
      'RELEASE_HISTORY_DUPLICATE',
    );
    expect(() => buildReleaseHistory([second, first], buildReleaseHistory([first]))).toThrow(
      'RELEASE_HISTORY_REWRITE',
    );
  });

  it.each([
    { firstContestId: 'abc213' },
    { lastContestId: 'abc213' },
    { contestCount: 2 },
    { problemCount: 2 },
    { addedProblemIds: [], changedProblemIds: catalog.release.addedProblemIds },
  ])('rejects changing the range or summary of an existing version: %j', (change) => {
    const first = withoutEvidence('2026.10.09-r9');
    const previous = buildReleaseHistory([first]);
    const changed = withoutEvidence(first.metadata.version);
    Object.assign(changed.catalog.release, change);
    changed.metadata.changeSummary.addedProblemIds = changed.catalog.release.addedProblemIds;
    changed.metadata.changeSummary.changedProblemIds = changed.catalog.release.changedProblemIds;
    expect(() => buildReleaseHistory([changed], previous)).toThrow('RELEASE_HISTORY_REWRITE');
  });

  it('rejects unknown Git commits before reading any catalog', async () => {
    await expect(
      loadGitReleaseHistory({ metadata: [{ ...record.metadata, commit: '0'.repeat(40) }] }),
    ).rejects.toThrow('RELEASE_HISTORY_UNKNOWN_COMMIT');
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
