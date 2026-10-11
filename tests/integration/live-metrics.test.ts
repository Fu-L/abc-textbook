import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runAtCoderProblemsMetricsAcquisition } from '../../scripts/corpus/acquire-atcoder-problems-metrics.js';
import { acquireMetadataRange } from '../../scripts/update-abc/acquire.js';
import { SerialOfficialPageClient } from '../../src/lib/corpus/acquisition.js';
import {
  ATCODER_PROBLEMS_METRICS_PATH,
  ATCODER_PROBLEMS_SOURCES,
  loadMetadataBatchProblemIdentities,
  validateAtCoderProblemsSnapshot,
  type AtCoderProblemsJsonFetcher,
} from '../../src/lib/corpus/atcoder-problems-metrics.js';
import {
  liveBase,
  liveCheckedAt,
  livePolicyApproval,
  liveTransport,
} from '../fixtures/live-metadata.js';

const result = await acquireMetadataRange({
  ...(await liveBase()),
  firstContestNumber: 467,
  lastContestNumber: 467,
  checkedAt: liveCheckedAt,
  policyApproval: livePolicyApproval,
  client: new SerialOfficialPageClient({
    transport: liveTransport(),
    userAgent: 'abc-textbook/0.1.0 (contact: fixture-test)',
    minimumStartIntervalMs: 0,
  }),
});
if (result.status !== 'acquired') throw new Error('Expected acquired fixture metadata');
const artifact = result.artifact;
const canonicalBefore = await readFile(ATCODER_PROBLEMS_METRICS_PATH, 'utf8');
const directories: string[] = [];
const fixture = async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'abc-live-metrics-'));
  directories.push(directory);
  const metadataPath = path.join(directory, 'metadata.json');
  const outputPath = path.join(directory, 'metrics.json');
  await writeFile(metadataPath, JSON.stringify(artifact));
  return {
    metadataPath,
    outputPath,
    args: ['--metadata-batch', metadataPath, '--checked-at', liveCheckedAt, '--output', outputPath],
  };
};
const fetchJson: AtCoderProblemsJsonFetcher = (url) =>
  Promise.resolve(
    url === ATCODER_PROBLEMS_SOURCES.problemModels
      ? {
          abc467_h: { difficulty: 3100, is_experimental: true },
          abc467_i: { difficulty: 0, is_experimental: false },
          abc467_ex: { difficulty: 9999 },
        }
      : [
          { id: 'abc467_h', point: 700 },
          { id: 'abc467_i', point: 0 },
          { id: 'abc467_ex', point: 9999 },
          { id: 'abc212_e', point: 500 },
        ],
  );
const report = () => undefined;

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true })));
  expect(await readFile(ATCODER_PROBLEMS_METRICS_PATH, 'utf8')).toBe(canonicalBefore);
});

describe('metrics acquisition for an uncommitted official batch', () => {
  it('joins only the acquired problems by official task identity, including Ex and future I', async () => {
    const { args, metadataPath, outputPath } = await fixture();
    const requests: string[] = [];
    await runAtCoderProblemsMetricsAcquisition(args, {
      fetchJson: (url) => {
        requests.push(url);
        return fetchJson(url);
      },
      report,
    });
    const snapshot = validateAtCoderProblemsSnapshot(
      JSON.parse(await readFile(outputPath, 'utf8')) as unknown,
      await loadMetadataBatchProblemIdentities(metadataPath),
    );
    expect(Object.keys(snapshot.problems)).toEqual([
      'abc467-e',
      'abc467-ex',
      'abc467-f',
      'abc467-i',
    ]);
    expect(snapshot.problems['abc467-ex']).toEqual({
      officialTaskId: 'abc467_h',
      difficulty: 3100,
      difficultyExperimental: true,
      point: 700,
    });
    expect(snapshot.problems['abc467-i']).toEqual({
      officialTaskId: 'abc467_i',
      difficulty: 0,
      difficultyExperimental: false,
      point: 0,
    });
    expect(snapshot.problems['abc467-e']).toEqual({
      officialTaskId: 'abc467_e',
      difficulty: null,
      difficultyExperimental: null,
      point: null,
    });
    expect(snapshot.sources).toEqual(ATCODER_PROBLEMS_SOURCES);
    expect(snapshot.checkedAt).toBe(liveCheckedAt);
    expect(requests).toEqual(Object.values(ATCODER_PROBLEMS_SOURCES));
    expect(await readFile(metadataPath, 'utf8')).toBe(JSON.stringify(artifact));
  });

  it('requires an explicit temporary output before fetching anything', async () => {
    const { args } = await fixture();
    let requests = 0;
    const options = {
      fetchJson: () => {
        requests++;
        return Promise.resolve({});
      },
      report,
    };
    await expect(runAtCoderProblemsMetricsAcquisition(args.slice(0, 4), options)).rejects.toThrow(
      'ARGUMENT_REQUIRED',
    );
    await expect(
      runAtCoderProblemsMetricsAcquisition(
        [...args.slice(0, 4), '--output', ATCODER_PROBLEMS_METRICS_PATH],
        options,
      ),
    ).rejects.toThrow('OUTPUT_INSIDE_REPOSITORY');
    expect(requests).toBe(0);
  });

  it('rejects a damaged metadata artifact before fetching', async () => {
    const { args, metadataPath, outputPath } = await fixture();
    await writeFile(metadataPath, JSON.stringify({ ...artifact, digest: 'a'.repeat(64) }));
    let requests = 0;
    await expect(
      runAtCoderProblemsMetricsAcquisition(args, {
        fetchJson: () => {
          requests++;
          return Promise.resolve({});
        },
        report,
      }),
    ).rejects.toThrow('METADATA_ARTIFACT_DIGEST_MISMATCH');
    expect(requests).toBe(0);
    await expect(readFile(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it.each(['transport', 'malformed'])(
    'keeps an existing snapshot intact on %s failure',
    async (failure) => {
      const { args, outputPath } = await fixture();
      await runAtCoderProblemsMetricsAcquisition(args, { fetchJson, report });
      const before = await readFile(outputPath, 'utf8');
      await expect(
        runAtCoderProblemsMetricsAcquisition(args, {
          fetchJson: () =>
            failure === 'transport' ? Promise.reject(new Error('HTTP 503')) : Promise.resolve([]),
          report,
        }),
      ).rejects.toThrow(failure === 'transport' ? 'HTTP 503' : 'PROBLEM_MODELS_INVALID');
      expect(await readFile(outputPath, 'utf8')).toBe(before);
    },
  );

  it('does not emit null-filled success when an upstream request fails', async () => {
    const { args, outputPath } = await fixture();
    await expect(
      runAtCoderProblemsMetricsAcquisition(args, {
        fetchJson: (url) =>
          url === ATCODER_PROBLEMS_SOURCES.problemModels
            ? Promise.resolve({})
            : Promise.reject(new Error('HTTP 503')),
        report,
      }),
    ).rejects.toThrow('HTTP 503');
    await expect(readFile(outputPath)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('refreshes temporary metrics with the new check date without changing metadata', async () => {
    const { args, outputPath } = await fixture();
    await runAtCoderProblemsMetricsAcquisition(args, { fetchJson, report });
    const updatedArgs = [...args];
    updatedArgs[3] = '2026-10-12T12:00:00+09:00';
    await runAtCoderProblemsMetricsAcquisition(updatedArgs, {
      fetchJson: (url) =>
        Promise.resolve(
          url === ATCODER_PROBLEMS_SOURCES.problemModels
            ? { abc467_h: { difficulty: 3200, is_experimental: false } }
            : [{ id: 'abc467_h', point: 700 }],
        ),
      report,
    });
    const snapshot = validateAtCoderProblemsSnapshot(
      JSON.parse(await readFile(outputPath, 'utf8')) as unknown,
      artifact.problems,
    );
    expect(snapshot.checkedAt).toBe(updatedArgs[3]);
    expect(snapshot.problems['abc467-ex']?.difficulty).toBe(3200);
  });

  it('retains the existing canonical acquisition mode', async () => {
    const { outputPath } = await fixture();
    const reports: unknown[] = [];
    await runAtCoderProblemsMetricsAcquisition(
      ['--checked-at', liveCheckedAt, '--output', outputPath],
      {
        fetchJson: (url) =>
          Promise.resolve(url === ATCODER_PROBLEMS_SOURCES.problemModels ? {} : []),
        report: (value) => {
          reports.push(value);
        },
      },
    );
    expect(reports).toEqual([
      expect.objectContaining({
        status: 'passed',
        problemCount: 868,
        missingDifficultyCount: 868,
        missingPointCount: 868,
      }),
    ]);
  });
});
