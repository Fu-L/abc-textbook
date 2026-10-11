import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { acquireOfficialMetadata, acquireMetadataRange } from '../../scripts/update-abc/acquire.js';
import { discoverContests, discoverMetadataBatch } from '../../scripts/update-abc/discover.js';
import { runMetadataAcquisition } from '../../scripts/corpus/acquire-metadata.js';
import { SerialOfficialPageClient } from '../../src/lib/corpus/acquisition.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import {
  liveBase,
  liveCheckedAt,
  livePolicyApproval,
  liveTaskList,
  liveTransport,
} from '../fixtures/live-metadata.js';

const fixture = JSON.parse(
  await readFile(new URL('../fixtures/weekly-update/contests.json', import.meta.url), 'utf8'),
) as { contests: Parameters<typeof discoverContests>[0]['contests'] };

describe('US5 update discovery', () => {
  const contest = fixture.contests[0];
  if (!contest) throw new Error('Weekly update fixture is empty.');

  it('selects only ended contests from latest and explicit-range discovery', () => {
    const now = '2026-07-29T12:00:00+09:00';
    expect(discoverContests({ contests: fixture.contests, mode: 'latest-ended', now })).toEqual([
      fixture.contests[0],
    ]);
    expect(
      discoverContests({
        contests: fixture.contests,
        mode: 'explicit-range',
        firstContestNumber: 500,
        lastContestNumber: 501,
        now,
      }),
    ).toEqual([fixture.contests[0]]);
  });

  it('discovers every official task after D including future labels', async () => {
    const result = await acquireOfficialMetadata(contest);
    expect(result.status).toBe('acquired');
    expect(result.advancedSlotLabels).toEqual(['E', 'F', 'I', 'Ex']);
    expect(result.problemIds).toEqual(['abc500-e', 'abc500-f', 'abc500-i', 'abc500-ex']);
    expect(result.sourceSetFingerprint).toMatch(/^[a-f0-9]{64}$/u);
  });

  it('preserves a source acquisition failure as a resumable hold', async () => {
    const result = await acquireOfficialMetadata(contest, {
      loadSource: (task) =>
        task.label === 'I'
          ? Promise.reject(new Error('fixture unavailable'))
          : Promise.resolve(task),
    });
    expect(result).toMatchObject({
      status: 'on_hold',
      hold: { code: 'SOURCE_UNAVAILABLE', problemId: 'abc500-i' },
    });
  });
});

describe('published-base metadata acquisition', () => {
  const client = (transport = liveTransport()) =>
    new SerialOfficialPageClient({
      transport,
      userAgent: 'abc-textbook/0.1.0 (contact: fixture-test)',
      minimumStartIntervalMs: 0,
    });

  it('selects one Contest or a bounded catch-up, excluding the covered base prefix', async () => {
    const base = await liveBase();
    expect(
      discoverMetadataBatch({ ...base, firstContestNumber: 466, lastContestNumber: 467 }).batch,
    ).toEqual({
      id: 'abc467-abc467',
      firstContestNumber: 467,
      lastContestNumber: 467,
    });
    expect(
      discoverMetadataBatch({ ...base, firstContestNumber: 467, lastContestNumber: 468 }).batch
        ?.lastContestNumber,
    ).toBe(468);
    expect(
      discoverMetadataBatch({ ...base, firstContestNumber: 465, lastContestNumber: 466 }).batch,
    ).toBeNull();
    expect(() =>
      discoverMetadataBatch({ ...base, firstContestNumber: 468, lastContestNumber: 467 }),
    ).toThrow(/RANGE_INVALID/u);
    expect(() =>
      discoverMetadataBatch({
        ...base,
        firstContestNumber: 467,
        lastContestNumber: 467,
        baseMetadata: { ...base.baseMetadata, version: '2026.10.11-r999' },
      }),
    ).toThrow(/SUMMARY_MISMATCH/u);
    expect(() =>
      discoverMetadataBatch({
        ...base,
        firstContestNumber: 467,
        lastContestNumber: 467,
        baseCatalog: { ...base.baseCatalog, contests: [] },
      }),
    ).toThrow(/BASE_RANGE_INVALID/u);
  });

  it.each([467, 468])(
    'acquires through the official parsers up to ABC%s without mutating the base',
    async (lastContestNumber) => {
      const base = await liveBase();
      const before = JSON.stringify(base);
      const result = await acquireMetadataRange({
        ...base,
        firstContestNumber: 467,
        lastContestNumber,
        checkedAt: liveCheckedAt,
        policyApproval: livePolicyApproval,
        client: client(),
      });
      expect(result.status).toBe('acquired');
      if (result.status !== 'acquired') throw new Error('Expected acquired metadata');
      expect(result.artifact.problems.map(({ id }) => id)).toEqual(
        Array.from({ length: lastContestNumber - 466 }, (_, index) =>
          ['e', 'f', 'i', 'ex'].map((label) => `abc${String(467 + index)}-${label}`),
        ).flat(),
      );
      expect(result.artifact.problems.find(({ id }) => id === 'abc467-ex')?.officialTaskId).toBe(
        'abc467_h',
      );
      const batch = result.scope.batch;
      if (!batch) throw new Error('Expected selected batch');
      expect(() => {
        verifyCorpusMetadataBatch(result.artifact, batch);
      }).not.toThrow();
      expect(JSON.stringify(base)).toBe(before);
    },
  );

  it.each([
    {
      code: 'CONTEST_NOT_ENDED',
      taskList: (number: number, labels: readonly string[]) => liveTaskList(number, labels, false),
    },
    { code: 'D_TASK_NOT_FOUND', labels: ['A', 'B', 'C', 'E'] },
    { code: 'TASK_ORDER_CONFLICT', labels: ['A', 'B', 'C', 'D', 'F', 'E'] },
    { code: 'OFFICIAL_REQUEST_REJECTED', unavailable: '/abc467/tasks' },
  ])(
    'holds $code with a reason and retry condition, without returning a partial batch',
    async ({ code, ...options }) => {
      const requests: string[] = [];
      const result = await acquireMetadataRange({
        ...(await liveBase()),
        firstContestNumber: 467,
        lastContestNumber: 468,
        checkedAt: liveCheckedAt,
        policyApproval: livePolicyApproval,
        client: client(liveTransport({ ...options, requests })),
      });
      expect(result).toMatchObject({
        status: 'on_hold',
        hold: {
          code,
          reason: expect.any(String) as unknown,
          retryCondition: expect.any(String) as unknown,
        },
      });
      expect(result).not.toHaveProperty('artifact');
      expect(requests.some((url) => url.includes('abc468'))).toBe(false);
      if (code !== 'OFFICIAL_REQUEST_REJECTED')
        expect(requests.filter((url) => url.includes('abc467'))).toEqual([
          'https://atcoder.jp/contests/abc467/tasks',
        ]);
    },
  );

  it('reports a later source failure and unchanged covered range without fabricated metadata', async () => {
    const base = await liveBase();
    const failed = await acquireMetadataRange({
      ...base,
      firstContestNumber: 467,
      lastContestNumber: 468,
      checkedAt: liveCheckedAt,
      policyApproval: livePolicyApproval,
      client: client(liveTransport({ unavailable: 'abc468_i' })),
    });
    expect(failed).toMatchObject({
      status: 'on_hold',
      hold: {
        code: 'OFFICIAL_REQUEST_REJECTED',
        reason: expect.stringContaining('abc468_i') as unknown,
      },
    });
    expect(failed).not.toHaveProperty('artifact');
    const requests: string[] = [];
    expect(
      await acquireMetadataRange({
        ...base,
        firstContestNumber: 466,
        lastContestNumber: 466,
        checkedAt: liveCheckedAt,
        policyApproval: livePolicyApproval,
        client: client(liveTransport({ requests })),
      }),
    ).toMatchObject({ status: 'unchanged' });
    expect(requests).toEqual([]);
  });

  it('holds exhausted transport retries with the failing official URL', async () => {
    const requests: string[] = [];
    const fixtureTransport = liveTransport();
    const result = await acquireMetadataRange({
      ...(await liveBase()),
      firstContestNumber: 467,
      lastContestNumber: 467,
      checkedAt: liveCheckedAt,
      policyApproval: livePolicyApproval,
      client: client((request) => {
        requests.push(request.url);
        return request.url.includes('abc467_i')
          ? Promise.reject(new TypeError('offline'))
          : fixtureTransport(request);
      }),
    });
    expect(requests.filter((url) => url.includes('abc467_i'))).toHaveLength(2);
    expect(result).toMatchObject({
      status: 'on_hold',
      hold: {
        code: 'OFFICIAL_REQUEST_FAILED',
        reason: expect.stringContaining('abc467_i') as unknown,
      },
    });
    expect(result).not.toHaveProperty('artifact');
  });

  it('distinguishes an officially proven ABC316 gap from an unavailable evidence page', async () => {
    const base = await liveBase();
    const catalog = base.baseCatalog;
    catalog.contests = catalog.contests.filter(({ number }) => number <= 315);
    catalog.contestGaps = [];
    catalog.contestSlots = catalog.contestSlots.filter(
      ({ contestId }) => Number(contestId.slice(3)) <= 315,
    );
    catalog.problems = catalog.problems.filter(
      ({ contestId }) => Number(contestId.slice(3)) <= 315,
    );
    catalog.release.lastContestId = 'abc315';
    catalog.release.contestCount = catalog.contests.length;
    catalog.release.problemCount = catalog.problems.length;
    catalog.release.slotRecordCount = catalog.contestSlots.length;
    delete catalog.release.agentQualityReviewEvidenceRef;
    const requests: string[] = [];
    const input = {
      ...base,
      firstContestNumber: 316,
      lastContestNumber: 317,
      checkedAt: liveCheckedAt,
      policyApproval: livePolicyApproval,
    };
    const acquired = await acquireMetadataRange({
      ...input,
      client: client(liveTransport({ requests })),
    });
    expect(acquired.status).toBe('acquired');
    if (acquired.status !== 'acquired') throw new Error('Expected gap evidence and ABC317');
    expect(acquired.artifact.contestGaps.map(({ contestId }) => contestId)).toEqual(['abc316']);
    expect(acquired.artifact.contests.map(({ id }) => id)).toEqual(['abc317']);
    expect(requests.some((url) => url.includes('/abc316/'))).toBe(false);
    const held = await acquireMetadataRange({
      ...input,
      client: client(liveTransport({ unavailable: 'abc350_a' })),
    });
    expect(held).toMatchObject({ status: 'on_hold', hold: { code: 'OFFICIAL_REQUEST_REJECTED' } });
    expect(held).not.toHaveProperty('artifact');
  });

  it('uses the existing CLI to write only complete temporary artifacts, resume, and report holds', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'abc84-cli-'));
    const base = await liveBase();
    try {
      for (const [file, value] of [
        ['catalog.json', base.baseCatalog],
        ['metadata.json', base.baseMetadata],
        ['policy.json', livePolicyApproval],
      ] as const)
        await writeFile(path.join(root, file), JSON.stringify(value));
      const output = path.join(root, 'acquired');
      const args = [
        '--base-catalog',
        path.join(root, 'catalog.json'),
        '--base-metadata',
        path.join(root, 'metadata.json'),
        '--first-contest',
        '467',
        '--last-contest',
        '467',
        '--policy-approval',
        path.join(root, 'policy.json'),
        '--output-dir',
        output,
        '--checked-at',
        liveCheckedAt,
        '--user-agent',
        'abc-textbook/0.1.0 (contact: fixture-test)',
      ];
      const report: unknown[] = [];
      const run = (transport = liveTransport(), runArgs = args) =>
        runMetadataAcquisition(runArgs, {
          transport,
          minimumStartIntervalMs: 0,
          report: (value) => report.push(value),
        });
      expect(await run()).toBe(0);
      const bytes = await readFile(path.join(output, 'abc467-abc467.json'), 'utf8');
      expect(await run()).toBe(0);
      expect(await readFile(path.join(output, 'abc467-abc467.json'), 'utf8')).toBe(bytes);
      expect(report).toContainEqual(expect.objectContaining({ status: 'verified_existing' }));
      const heldArgs = args.map((arg) => (arg === '467' ? '468' : arg));
      expect(await run(liveTransport({ unavailable: 'abc468_i' }), heldArgs)).toBe(2);
      expect(await readdir(output)).toEqual(['abc467-abc467.json']);
      expect(report).toContainEqual(
        expect.objectContaining({
          status: 'on_hold',
          hold: expect.objectContaining({ code: 'OFFICIAL_REQUEST_REJECTED' }) as unknown,
        }),
      );
      await expect(
        run(liveTransport({ unavailable: '/tasks' }), [
          '--batch',
          'abc420-abc466',
          '--policy-approval',
          path.join(root, 'policy.json'),
          '--output-dir',
          output,
          '--checked-at',
          liveCheckedAt,
          '--user-agent',
          'abc-textbook/0.1.0 (contact: fixture-test)',
        ]),
      ).rejects.toMatchObject({ code: 'OFFICIAL_REQUEST_REJECTED' });
      await expect(run(liveTransport(), [...args, '--batch', 'all'])).rejects.toThrow(
        /ARGUMENTS_INVALID/u,
      );
      await expect(
        run(
          liveTransport(),
          args.map((arg) =>
            arg === output ? path.join(process.cwd(), 'src/content/forbidden-acquisition') : arg,
          ),
        ),
      ).rejects.toThrow(/OUTPUT_INSIDE_REPOSITORY/u);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
