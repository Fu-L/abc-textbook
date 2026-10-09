import { execFileSync } from 'node:child_process';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  type ConfirmedPublication,
  readPagesArtifact,
  loadPublishedReleaseHistory,
  confirmPagesPublication,
  loadGitReleaseHistory,
} from '../../scripts/release/build-history.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { ReleaseMetadataSchema } from '../../src/lib/domain/schema-parts/release.js';
import {
  PublicReleaseHistoryEntrySchema,
  PublicReleaseHistorySchema,
} from '../../src/lib/catalog/build-release-history.js';
import { describe, expect, it, vi } from 'vitest';
import {
  buildAdministratorHoldSummary,
  buildReleaseHistory,
} from '../../src/lib/catalog/build-release-history.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const required = <T>(value: T | undefined): T => {
  if (value === undefined) throw Error('Fixture value missing');
  return value;
};

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

  it('never uses a Git prepared catalog for a run version', async () => {
    await expect(
      loadGitReleaseHistory({ metadata: [{ ...record.metadata, version: '2026.10.09-r9' }] }),
    ).rejects.toThrow('RELEASE_HISTORY_ARTIFACT_REQUIRED');
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

// All successes below are disposable fixtures, never evidence of a live deployment.
describe('post-publication history writer', () => {
  const publication = {
    version: '2026.10.09-r9',
    commit: execFileSync('git', ['rev-parse', 'HEAD']).toString().trim(),
    runUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/9',
    createdAt: '2026-10-09T00:00:00Z',
    publishedAt: '2026-10-09T00:10:00Z',
    artifactName: 'fixture-artifact',
    historyOnly: false,
  };
  const pair = () => {
    const catalog = makeTrustedCatalog({
      version: publication.version,
      publicationStatus: 'prepared',
    });
    return {
      catalog,
      metadata: {
        ...record.metadata,
        version: publication.version,
        commit: publication.commit,
        validationResultsUrl: publication.runUrl,
      },
    };
  };
  const setup = () => ({
    runId: '9',
    previous: buildReleaseHistory([record]),
    confirmPublication: vi.fn().mockResolvedValue(publication),
    readArtifact: vi.fn().mockResolvedValue(pair()),
    readPublic: vi.fn().mockResolvedValue(pair()),
  });
  it('appends the deployed artifact even though the Git prepared catalog has an old version', async () => {
    const input = setup();
    const result = await loadPublishedReleaseHistory(input);
    expect(result.status).toBe('appended');
    expect(result.history[0]).toEqual(input.previous[0]);
    expect(result.history[1]).toMatchObject({
      version: publication.version,
      commit: publication.commit,
    });
    expect(input.readPublic).not.toHaveBeenCalled();
    const retry = await loadPublishedReleaseHistory({ ...input, previous: result.history });
    expect(retry.status).toBe('unchanged');
    expect(retry.history).toEqual(result.history);
    expect(retry.history).toBe(result.history);
  });
  it('uses both public JSON files only when artifact acquisition is unavailable', async () => {
    const input = setup();
    input.readArtifact.mockResolvedValue(null);
    const result = await loadPublishedReleaseHistory(input);
    expect(result.source).toBe('public');
    expect(input.confirmPublication.mock.invocationCallOrder[0]).toBeLessThan(
      required(input.readPublic.mock.invocationCallOrder[0]),
    );
    expect(result.history).toHaveLength(2);
  });
  it('defers only the append when both inputs are unavailable', async () => {
    const input = setup();
    input.readArtifact.mockResolvedValue(null);
    input.readPublic.mockResolvedValue(null);
    const result = await loadPublishedReleaseHistory(input);
    expect(result.status).toBe('deferred');
    expect(result.history).toBe(input.previous);
  });
  it.each(['artifact', 'public'])(
    'rejects a different version from %s without retrying a mismatched artifact',
    async (source) => {
      const input = setup();
      const other = pair();
      other.metadata.version = '2026.10.09-r10';
      if (source === 'artifact') input.readArtifact.mockResolvedValue(other);
      else {
        input.readArtifact.mockResolvedValue(null);
        input.readPublic.mockResolvedValue(other);
      }
      await expect(loadPublishedReleaseHistory(input)).rejects.toThrow(
        'RELEASE_HISTORY_IDENTITY_MISMATCH',
      );
      if (source === 'artifact') expect(input.readPublic).not.toHaveBeenCalled();
    },
  );
  it.each([
    { commit: 'b'.repeat(40) },
    { validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/10' },
    { cutoffAt: '2026-07-18T00:00:00Z' },
    { changeSummary: { ...record.metadata.changeSummary, addedProblemIds: [] } },
    { schemaVersion: '2.0.0' },
  ])('rejects inconsistent artifact metadata: %j', async (change) => {
    const input = setup();
    input.readArtifact.mockResolvedValue({
      ...pair(),
      metadata: { ...pair().metadata, ...change },
    });
    await expect(loadPublishedReleaseHistory(input)).rejects.toThrow();
    expect(input.readPublic).not.toHaveBeenCalled();
  });
  it('rejects an existing version with a different range without rewriting old entries', async () => {
    const input = setup();
    const original = await loadPublishedReleaseHistory(input);
    const changed = pair();
    changed.catalog.release.problemCount = 2;
    input.readArtifact.mockResolvedValue(changed);
    await expect(
      loadPublishedReleaseHistory({ ...input, previous: original.history }),
    ).rejects.toThrow('RELEASE_HISTORY_REWRITE');
  });
  it('accepts another run of the same SHA as a separate version', async () => {
    const input = setup();
    const first = await loadPublishedReleaseHistory(input);
    const second = {
      ...publication,
      version: '2026.10.09-r10',
      runUrl: publication.runUrl.replace('/9', '/10'),
      publishedAt: '2026-10-09T00:20:00Z',
    };
    input.confirmPublication.mockImplementation((runId: string) =>
      Promise.resolve(runId === '10' ? second : publication),
    );
    const next = pair();
    next.catalog.release.version = second.version;
    next.metadata.version = second.version;
    next.metadata.validationResultsUrl = second.runUrl;
    input.readArtifact.mockResolvedValue(next);
    const result = await loadPublishedReleaseHistory({
      ...input,
      runId: '10',
      previous: first.history,
    });
    expect(result.history.map((x) => x.version)).toEqual([
      record.metadata.version,
      publication.version,
      second.version,
    ]);
    input.readArtifact.mockResolvedValue(pair());
    await expect(
      loadPublishedReleaseHistory({
        ...input,
        previous: [required(result.history[0]), required(result.history[2])],
      }),
    ).rejects.toThrow('RELEASE_HISTORY_PUBLICATION_ORDER');
  });
  it('keeps existing values when the same identity is reacquired with different ancillary information', async () => {
    const input = setup();
    const first = await loadPublishedReleaseHistory(input);
    const changed = pair();
    changed.catalog.release.validatedAt = '2026-10-09T00:30:00Z';
    input.readArtifact.mockResolvedValue(changed);
    expect((await loadPublishedReleaseHistory({ ...input, previous: first.history })).history).toBe(
      first.history,
    );
  });
  it.each([
    { contestCount: 2 },
    { problemCount: 2 },
    { slotRecordCount: 2 },
    { firstContestId: 'abc213' },
    { lastContestId: 'abc213' },
    { heldProblemIds: ['abc212-x45'] },
    { validationSummary: { ...catalog.release.validationSummary, blockingFindingCount: 1 } },
  ])('rejects incorrect range or failed catalog checks: %j', async (change) => {
    const input = setup();
    const bad = pair();
    Object.assign(bad.catalog.release, change);
    input.readArtifact.mockResolvedValue(bad);
    await expect(loadPublishedReleaseHistory(input)).rejects.toThrow();
  });
  it('uses the saved standard artifact after logs expire and preserves it for the next append', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'abc-saved-artifact-'));
    try {
      await mkdir(path.join(root, 'data'));
      await writeFile(path.join(root, 'data/catalog.json'), JSON.stringify(pair().catalog));
      await writeFile(path.join(root, 'release-metadata.json'), JSON.stringify(pair().metadata));
      execFileSync('tar', [
        '-cf',
        path.join(root, 'artifact.tar'),
        '-C',
        root,
        './data/catalog.json',
        './release-metadata.json',
      ]);
      const input = setup();
      const confirmed = { ...publication, artifactName: null };
      input.confirmPublication.mockResolvedValue(confirmed);
      const readArtifact = (value: ConfirmedPublication) =>
        readPagesArtifact('Fu-L/abc-textbook', '9', value, root);
      expect((await loadPublishedReleaseHistory({ ...input, readArtifact })).status).toBe(
        'appended',
      );
      expect(await readPagesArtifact('Fu-L/abc-textbook', '9', confirmed, root)).toEqual(pair());
      const bad = pair();
      bad.metadata.version = '2026.10.09-r10';
      await writeFile(path.join(root, 'release-metadata.json'), JSON.stringify(bad.metadata));
      execFileSync('tar', [
        '-cf',
        path.join(root, 'artifact.tar'),
        '-C',
        root,
        './data/catalog.json',
        './release-metadata.json',
      ]);
      await expect(loadPublishedReleaseHistory({ ...input, readArtifact })).rejects.toThrow(
        'RELEASE_HISTORY_IDENTITY_MISMATCH',
      );
      expect(input.readPublic).not.toHaveBeenCalled();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it('rejects unknown commits and unconfirmed runs before acquiring input', async () => {
    const input = setup();
    input.confirmPublication.mockRejectedValue(Error('RELEASE_HISTORY_HOST_NOT_CONFIRMED'));
    await expect(loadPublishedReleaseHistory(input)).rejects.toThrow(
      'RELEASE_HISTORY_HOST_NOT_CONFIRMED',
    );
    expect(input.readArtifact).not.toHaveBeenCalled();
    input.confirmPublication.mockResolvedValue({ ...publication, commit: '0'.repeat(40) });
    await expect(loadPublishedReleaseHistory(input)).rejects.toThrow(
      'RELEASE_HISTORY_UNKNOWN_COMMIT',
    );
    expect(input.readArtifact).not.toHaveBeenCalled();
  });
  it('does not append a history-only deployment but treats unknown scope as ordinary publication', async () => {
    const input = setup();
    input.confirmPublication.mockResolvedValue({ ...publication, historyOnly: true });
    expect((await loadPublishedReleaseHistory(input)).status).toBe('history-only');
    expect(input.readArtifact).not.toHaveBeenCalled();
    input.confirmPublication.mockResolvedValue({ ...publication, historyOnly: false });
    expect((await loadPublishedReleaseHistory(input)).status).toBe('appended');
  });
});

// Real API-shaped responses, with fake run/deployment IDs for success/failure regressions.
describe('standard Pages success confirmation', () => {
  const sha = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
  const runUrl = 'https://github.com/Fu-L/abc-textbook/actions/runs/9';
  const setup = () => ({
    repository: 'Fu-L/abc-textbook',
    runId: '9',
    api: vi.fn().mockImplementation((endpoint: string) =>
      Promise.resolve(
        endpoint.includes('/statuses')
          ? [{ state: 'success', log_url: runUrl + '/job/2', created_at: '2026-10-09T00:10:00Z' }]
          : endpoint.includes('/jobs')
            ? {
                jobs: [
                  {
                    id: 1,
                    name: 'Verify (release baseline)',
                    head_sha: sha,
                    status: 'completed',
                    conclusion: 'success',
                  },
                  {
                    id: 2,
                    name: 'Deploy GitHub Pages',
                    head_sha: sha,
                    status: 'completed',
                    conclusion: 'success',
                  },
                ],
              }
            : endpoint.includes('/deployments?')
              ? [{ id: 3, sha }]
              : {
                  id: 9,
                  head_sha: sha,
                  head_branch: 'main',
                  event: 'push',
                  path: '.github/workflows/ci.yml',
                  status: 'completed',
                  conclusion: 'success',
                  html_url: runUrl,
                  created_at: '2026-10-09T00:00:00Z',
                },
      ),
    ),
    readDeploymentLog: vi.fn().mockResolvedValue('artifact_name: github-pages-' + sha + '-9-1'),
  });
  it('confirms actual run, jobs, Pages status and the artifact selected by deploy', async () => {
    expect(await confirmPagesPublication(setup())).toMatchObject({
      commit: sha,
      version: '2026.10.09-r9',
      artifactName: 'github-pages-' + sha + '-9-1',
    });
  });
  it.each([
    'failure',
    'cancelled',
    'in_progress',
    'skipped',
    'wrong-SHA',
    'pull_request',
    'wrong-run',
    'wrong-Pages-run',
  ])('rejects %s', async (failure) => {
    const input = setup();
    const original = required(input.api.getMockImplementation());
    input.api.mockImplementation(async (endpoint: string) => {
      const value = (await original(endpoint)) as Record<string, unknown>;
      if (failure === 'wrong-Pages-run' && endpoint.includes('/statuses'))
        return [
          {
            state: 'success',
            log_url: runUrl.replace('/9', '/10') + '/job/2',
            created_at: '2026-10-09T00:10:00Z',
          },
        ];
      if (!endpoint.includes('/jobs') && !endpoint.includes('/deployments'))
        return {
          ...value,
          ...(failure === 'wrong-SHA'
            ? { head_sha: 'b'.repeat(40) }
            : failure === 'pull_request'
              ? { event: failure }
              : failure === 'wrong-run'
                ? { id: 10 }
                : { conclusion: failure }),
        };
      if (failure === 'wrong-SHA' && endpoint.includes('/jobs'))
        return {
          jobs: [
            {
              id: 2,
              name: 'Deploy GitHub Pages',
              head_sha: 'b'.repeat(40),
              status: 'completed',
              conclusion: 'success',
            },
          ],
        };
      return value;
    });
    await expect(confirmPagesPublication(input)).rejects.toThrow(
      'RELEASE_HISTORY_HOST_NOT_CONFIRMED',
    );
  });
  it('computes history-only scope from the preceding successful deployment and includes unpublished code changes', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'abc-history-scope-'));
    const git = (...args: string[]) => execFileSync('git', args, { cwd: root }).toString().trim();
    try {
      git('init', '-q');
      git('config', 'user.name', 'Fixture');
      git('config', 'user.email', 'fixture@example.test');
      await mkdir(path.join(root, 'src/content/indexes'), { recursive: true });
      await mkdir(path.join(root, 'docs/operations'), { recursive: true });
      await writeFile(path.join(root, 'src/content/indexes/release-history.json'), '[]');
      git('add', '.');
      git('commit', '-qm', 'baseline');
      const base = git('rev-parse', 'HEAD');
      await writeFile(path.join(root, 'src/content/indexes/release-history.json'), '[{}]');
      await writeFile(path.join(root, 'docs/operations/update-manual.md'), 'fixture');
      git('add', '.');
      git('commit', '-qm', 'history only');
      let target = git('rev-parse', 'HEAD');
      const input = setup();
      const original = required(input.api.getMockImplementation());
      input.api.mockImplementation(async (endpoint: string) => {
        if (endpoint.includes('/deployments?'))
          return [
            { id: 3, sha: target },
            { id: 4, sha: base },
          ];
        if (endpoint.includes('/deployments/4/statuses'))
          return [
            {
              state: 'success',
              log_url: runUrl.replace('/9', '/8') + '/job/8',
              created_at: '2026-10-08T00:10:00Z',
            },
          ];
        if (endpoint.includes('/jobs'))
          return {
            jobs: [
              {
                id: 1,
                name: 'Verify (release baseline)',
                head_sha: target,
                status: 'completed',
                conclusion: 'success',
              },
              {
                id: 2,
                name: 'Deploy GitHub Pages',
                head_sha: target,
                status: 'completed',
                conclusion: 'success',
              },
            ],
          };
        const value = (await original(endpoint)) as Record<string, unknown>;
        return endpoint.includes('/statuses') ? value : { ...value, head_sha: target };
      });
      expect((await confirmPagesPublication({ ...input, repositoryRoot: root })).historyOnly).toBe(
        true,
      );
      await writeFile(path.join(root, 'writer.ts'), 'fixture code');
      git('add', '.');
      git('commit', '-qm', 'unpublished code');
      target = git('rev-parse', 'HEAD');
      expect((await confirmPagesPublication({ ...input, repositoryRoot: root })).historyOnly).toBe(
        false,
      );
      expect(
        (await confirmPagesPublication({ ...input, repositoryRoot: path.join(root, 'missing') }))
          .historyOnly,
      ).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it('can confirm success when deployment logs have expired, leaving artifact acquisition unavailable', async () => {
    const input = setup();
    input.readDeploymentLog.mockRejectedValue(Error('expired'));
    expect(await confirmPagesPublication(input)).toMatchObject({ artifactName: null });
  });
});
