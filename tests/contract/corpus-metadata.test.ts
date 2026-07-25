import { access, mkdir, mkdtemp, readFile, readdir, rm, stat, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import {
  acquireCorpusMetadataBatch,
  normalizedPolicyFingerprint,
  SerialOfficialPageClient,
} from '../../src/lib/corpus/acquisition.js';
import type { CorpusAcquisitionError } from '../../src/lib/corpus/acquisition.js';
import { corpusBatches } from '../../src/lib/corpus/batches.js';
import {
  INITIAL_PREVIEW_FROZEN_RULES_DIGEST,
  refreezeVerifiedPreviewCohort,
} from '../../src/lib/corpus/cohort.js';
import {
  calculateMetadataBatchDigest,
  materializeCorpusMetadata,
  materializeObservedMetadataBatch,
} from '../../src/lib/corpus/materialization.js';
import {
  parseOfficialContestMetadata,
  parseOfficialEditorialContinuationUrls,
  parseOfficialEditorialIndex,
  parseOfficialEditorialItemRevision,
  parseOfficialProblemMetadata,
} from '../../src/lib/corpus/metadata.js';
import type {
  CorpusMetadataBatch,
  OfficialPageResponse,
  OfficialPageTransport,
  PolicyApprovalManifest,
  PreviewCandidatePool,
} from '../../src/lib/corpus/types.js';
import { verifyCorpusMetadataBatch } from '../../src/lib/corpus/verification.js';
import { ensureNoSymlinkParents } from '../../scripts/corpus/cli-support.js';
import { createPrivateResponseCache } from '../../scripts/corpus/private-response-cache.js';
import {
  frozenInitialV1RulesDigest,
  frozenInitialV1SelectionRules,
} from '../fixtures/preview-selection-rules.js';

const checkedAt = '2026-07-24T12:00:00+09:00';
const batch = {
  id: 'abc212-abc212-test',
  firstContestNumber: 212,
  lastContestNumber: 212,
} as const;

const policyBodies = {
  robots: 'User-agent: *\nAllow: /\n',
  terms:
    '<html><body><div id="main-container"><div class="panel-body">Official terms revision 1</div></div></body></html>',
  generativeAi:
    '<html><body><div id="main-container"><article class="blog-post">Generative AI policy revision 1</article></div></body></html>',
} as const;

const taskLabels = ['A', 'B', 'C', 'D', 'E'] as const;

const taskListHtml = (csrfToken: string): string => `
<!doctype html>
<html><body>
  <input name="csrf_token" value="${csrfToken}">
  <a class="contest-title" href="/contests/abc212">AtCoder Beginner Contest 212</a>
  <div class="contest-duration">
    <time class="fixtime-full">2021-07-31 21:00:00+0900</time>
    <time class="fixtime-full">2021-07-31 22:40:00+0900</time>
  </div>
  <table><tbody>
    ${taskLabels
      .map(
        (label) => `<tr>
          <td><a href="/contests/abc212/tasks/abc212_${label.toLocaleLowerCase('en-US')}">${label}</a></td>
          <td><a href="/contests/abc212/tasks/abc212_${label.toLocaleLowerCase('en-US')}">Task ${label}</a></td>
          <td>2 sec</td><td>1024 MiB</td>
        </tr>`,
      )
      .join('')}
  </tbody></table>
</body></html>`;

const problemPageHtml = (
  options: { readonly resourceHref?: string; readonly imageSrc?: string } = {},
): string => {
  const {
    resourceHref = '/resources/statement-v1.pdf',
    imageSrc = '/resources/statement-diagram-v1.png',
  } = options;
  return `
    <!doctype html>
    <html><body>
      <div class="h2">E - Task E</div>
      <div id="task-statement"><span class="lang-en">
        <section><h3>Problem Statement</h3><p>Transient statement prose.</p>
          <a href="${resourceHref}">Definition</a>
          <img src="${imageSrc}" alt="Statement diagram">
        </section>
        <section><h3>Constraints</h3><ul><li>1 ≤ N ≤ 2 × 10^5</li><li>All values are integers.</li></ul></section>
      </span></div>
    </body></html>`;
};

const problemHtml = problemPageHtml();

const editorialIndexHtml = (labels: readonly string[] = taskLabels): string => `
<!doctype html>
<html><body><div id="main-container">
  ${labels
    .map(
      (label) => `
        <h3><a class="small" href="/contests/abc212/tasks/abc212_${label.toLocaleLowerCase('en-US')}">${label} - Task ${label}</a></h3>
        <div class="editorial-section"><ul>
          ${
            label === 'E'
              ? '<li><span class="label">Official</span><a href="/contests/abc212/editorial/2407">Editorial former half</a></li><li><span class="label">Official</span><a href="/contests/abc212/editorial/2408">Editorial latter half</a></li>'
              : '<li><span class="label">User</span><a href="/contests/abc212/editorial/9999">Ignore</a></li>'
          }
        </ul></div>`,
    )
    .join('')}
</div></body></html>`;

const editorialItemHtml = (
  options: {
    readonly taskId?: string;
    readonly explanation?: string;
    readonly resourceHref?: string;
    readonly imageSrc?: string;
    readonly volatileToken?: string;
    readonly continuationHref?: string;
  } = {},
): string => {
  const {
    taskId = 'abc212_e',
    explanation = 'Transient editorial explanation.',
    resourceHref = '/resources/proof-v1.pdf',
    imageSrc = '/resources/diagram-v1.png',
    volatileToken = 'token-one',
    continuationHref,
  } = options;
  return `
    <!doctype html>
    <html><body><div id="main-container" data-session="${volatileToken}">
      <span class="label">Official</span>
      <h2><a href="/contests/abc212/tasks/${taskId}">E - Task E</a></h2>
      <form><input name="csrf_token" value="${volatileToken}"></form>
      <div class="editorial-body">
        <p>${explanation}</p>
        <a href="${resourceHref}">Proof</a>
        <img src="${imageSrc}" alt="State diagram">
        ${continuationHref ? `<a href="${continuationHref}">Continue in the latter half</a>` : ''}
      </div>
      <div class="clearfix">Session ${volatileToken}</div>
      <footer>Session ${volatileToken}</footer>
    </div></body></html>`;
};

const contestGapEvidenceHtml = `
<!doctype html>
<html><body>
  <div id="task-statement"><span class="lang-en">
    <section><h3>Problem Statement</h3>
      <p>ABC316 was not held on AtCoder.</p>
    </section>
  </span></div>
</body></html>`;

const policyDocuments = [
  {
    id: 'atcoder-robots',
    kind: 'robots' as const,
    url: 'https://atcoder.jp/robots.txt',
    body: policyBodies.robots,
    contentType: 'text/plain; charset=utf-8',
  },
  {
    id: 'atcoder-terms',
    kind: 'terms' as const,
    url: 'https://atcoder.jp/tos',
    body: policyBodies.terms,
    contentType: 'text/html; charset=utf-8',
  },
  {
    id: 'atcoder-generative-ai',
    kind: 'generative-ai' as const,
    url: 'https://atcoder.jp/posts/1501',
    body: policyBodies.generativeAi,
    contentType: 'text/html; charset=utf-8',
  },
] as const;

const approval = (): PolicyApprovalManifest => ({
  schemaVersion: '1.0.0',
  documents: policyDocuments.map((document) => ({
    id: document.id,
    kind: document.kind,
    url: document.url,
    approvedFingerprint: normalizedPolicyFingerprint(document, {
      contentType: document.contentType,
      body: document.body,
    }),
  })),
});

const pageFixtures = (): ReadonlyMap<string, Omit<OfficialPageResponse, 'url'>> =>
  new Map([
    ...policyDocuments.map(
      (document) =>
        [
          document.url,
          {
            status: 200,
            contentType: document.contentType,
            body: document.body,
          },
        ] as const,
    ),
    [
      'https://atcoder.jp/contests/abc212/tasks',
      { status: 200, contentType: 'text/html; charset=utf-8', body: taskListHtml('volatile-a') },
    ],
    [
      'https://atcoder.jp/contests/abc212/tasks/abc212_e?lang=en',
      { status: 200, contentType: 'text/html; charset=utf-8', body: problemHtml },
    ],
    [
      'https://atcoder.jp/contests/abc212/editorial?lang=en',
      { status: 200, contentType: 'text/html; charset=utf-8', body: editorialIndexHtml() },
    ],
    [
      'https://atcoder.jp/contests/abc212/editorial/2407?lang=en',
      {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: editorialItemHtml({ continuationHref: '/contests/abc212/editorial/2408' }),
      },
    ],
    [
      'https://atcoder.jp/contests/abc212/editorial/2408?lang=en',
      {
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: editorialItemHtml({ explanation: 'Transient latter-half explanation.' }),
      },
    ],
  ]);

describe('T032-T037 official metadata corpus contract', () => {
  it('fingerprints normalized task metadata rather than volatile page markup', () => {
    const parse = (html: string) =>
      parseOfficialContestMetadata({
        contestNumber: 212,
        officialTaskListUrl: 'https://atcoder.jp/contests/abc212/tasks',
        html,
        checkedAt,
        termsCheckedAt: checkedAt,
      });

    const first = parse(taskListHtml('csrf-one'));
    const second = parse(taskListHtml('csrf-two'));

    expect(first.sourceRevision.fingerprint).toBe(second.sourceRevision.fingerprint);
    expect(first.contest.tasks.at(-1)).toMatchObject({
      label: 'E',
      officialOrder: 4,
      officialTaskId: 'abc212_e',
      title: 'Task E',
      timeLimit: '2 sec',
      memoryLimit: '1024 MiB',
    });
  });

  it('fingerprints every language panel in the official terms page', () => {
    const termsDocument = {
      kind: 'terms' as const,
      url: 'https://atcoder.jp/tos',
    };
    const response = (japaneseRevision: string) => ({
      contentType: 'text/html; charset=utf-8',
      body: `<div id="main-container">
        <div class="panel-body">English terms revision 1</div>
        <div class="panel-body">日本語利用規約 ${japaneseRevision}</div>
      </div>`,
    });

    expect(normalizedPolicyFingerprint(termsDocument, response('改訂1'))).not.toBe(
      normalizedPolicyFingerprint(termsDocument, response('改訂2')),
    );
  });

  it('requires exactly one editorial-index section for every known task', () => {
    const { contest } = parseOfficialContestMetadata({
      contestNumber: 212,
      officialTaskListUrl: 'https://atcoder.jp/contests/abc212/tasks',
      html: taskListHtml('index-fixture'),
      checkedAt,
      termsCheckedAt: checkedAt,
    });
    const parseIndex = (html: string) =>
      parseOfficialEditorialIndex({
        contest,
        html,
        checkedAt,
        termsCheckedAt: checkedAt,
      });

    const complete = parseIndex(editorialIndexHtml());
    expect(complete.itemUrlsByOfficialTaskId.abc212_a).toEqual([]);
    expect(complete.itemUrlsByOfficialTaskId.abc212_e).toEqual([
      'https://atcoder.jp/contests/abc212/editorial/2407',
      'https://atcoder.jp/contests/abc212/editorial/2408',
    ]);
    expect(() => parseIndex(editorialIndexHtml(taskLabels.slice(1)))).toThrow(
      /EDITORIAL_INDEX_TASK_SECTION_MISSING/u,
    );
    expect(() => parseIndex(editorialIndexHtml([...taskLabels, 'E']))).toThrow(
      /EDITORIAL_INDEX_TASK_SECTION_DUPLICATE/u,
    );
  });

  it('follows only explicit same-contest editorial continuations', () => {
    expect(
      parseOfficialEditorialContinuationUrls({
        contestId: 'abc212',
        url: 'https://atcoder.jp/contests/abc212/editorial/2407',
        html: editorialItemHtml({ continuationHref: '/contests/abc212/editorial/2408' }),
      }),
    ).toEqual(['https://atcoder.jp/contests/abc212/editorial/2408']);
  });

  it('shares task-bound editorial fingerprints that include link and image revisions', () => {
    const parseItem = (html: string, url = 'https://atcoder.jp/contests/abc212/editorial/2407') =>
      parseOfficialEditorialItemRevision({
        contestId: 'abc212',
        officialTaskId: 'abc212_e',
        url,
        html,
        checkedAt,
        termsCheckedAt: checkedAt,
      });

    const stable = parseItem(editorialItemHtml());
    const volatileOnly = parseItem(
      editorialItemHtml({ volatileToken: 'rotated-token' }),
      'https://atcoder.jp/contests/abc212/editorial/2407?lang=en#top',
    );
    const changedLink = parseItem(editorialItemHtml({ resourceHref: '/resources/proof-v2.pdf' }));
    const changedImage = parseItem(editorialItemHtml({ imageSrc: '/resources/diagram-v2.png' }));
    const changedText = parseItem(
      editorialItemHtml({ explanation: 'A corrected editorial explanation.' }),
    );

    expect(volatileOnly.fingerprint).toBe(stable.fingerprint);
    expect(changedLink.fingerprint).not.toBe(stable.fingerprint);
    expect(changedImage.fingerprint).not.toBe(stable.fingerprint);
    expect(changedText.fingerprint).not.toBe(stable.fingerprint);
    expect(() => parseItem(editorialItemHtml({ taskId: 'abc212_f' }))).toThrow(
      /EDITORIAL_ITEM_TASK_MISMATCH/u,
    );
  });

  it('fingerprints normalized Problem text, links, and images', () => {
    const { contest } = parseOfficialContestMetadata({
      contestNumber: 212,
      officialTaskListUrl: 'https://atcoder.jp/contests/abc212/tasks',
      html: taskListHtml('problem-fingerprint-fixture'),
      checkedAt,
      termsCheckedAt: checkedAt,
    });
    const task = contest.tasks.at(-1);
    if (!task) throw new Error('The fixture has no advanced task.');
    const parseProblem = (html: string) =>
      parseOfficialProblemMetadata({
        contest,
        task,
        html,
        checkedAt,
        termsCheckedAt: checkedAt,
      }).sourceRevision.fingerprint;

    const stable = parseProblem(problemPageHtml());
    expect(parseProblem(problemPageHtml({ resourceHref: '/resources/statement-v2.pdf' }))).not.toBe(
      stable,
    );
    expect(
      parseProblem(problemPageHtml({ imageSrc: '/resources/statement-diagram-v2.png' })),
    ).not.toBe(stable);
  });

  it('acquires serially, follows an Official editorial continuation, and persists no raw HTML', async () => {
    const fixtures = pageFixtures();
    const requestedUrls: string[] = [];
    let activeRequests = 0;
    let maximumActiveRequests = 0;
    const transport: OfficialPageTransport = async (request) => {
      activeRequests += 1;
      maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests);
      requestedUrls.push(request.url);
      await Promise.resolve();
      const fixture = fixtures.get(request.url);
      activeRequests -= 1;
      if (!fixture) throw new Error(`Missing fixture: ${request.url}`);
      return { ...fixture, url: request.url };
    };
    const client = new SerialOfficialPageClient({
      transport,
      userAgent: 'abc-textbook/0.1.0 (contact: offline-contract-test)',
      minimumStartIntervalMs: 0,
    });

    const artifact = await acquireCorpusMetadataBatch({
      batch,
      client,
      policyApproval: approval(),
      checkedAt,
    });

    expect(maximumActiveRequests).toBe(1);
    expect(requestedUrls).toEqual([
      ...policyDocuments.map(({ url }) => url),
      'https://atcoder.jp/contests/abc212/tasks',
      'https://atcoder.jp/contests/abc212/tasks/abc212_e?lang=en',
      'https://atcoder.jp/contests/abc212/editorial?lang=en',
      'https://atcoder.jp/contests/abc212/editorial/2407?lang=en',
      'https://atcoder.jp/contests/abc212/editorial/2408?lang=en',
    ]);
    expect(() => {
      verifyCorpusMetadataBatch(artifact, batch);
    }).not.toThrow();
    expect(artifact.problems).toHaveLength(1);
    expect(artifact.problems[0]?.constraintsSummary).toBe(
      'Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 ≤ N ≤ 2 × 10^5; All values are integers.',
    );
    expect(artifact.problems[0]?.sourceRevisionIds).toHaveLength(3);
    expect(
      artifact.problems[0]?.sourceRevisionIds.map(
        (sourceId) => artifact.sourceRevisions.find(({ id }) => id === sourceId)?.sourceKind,
      ),
    ).toEqual(['official_problem', 'official_editorial', 'official_editorial']);
    expect(artifact.sourceRevisions).toHaveLength(5);
    expect(JSON.stringify(artifact)).not.toMatch(
      /<!doctype|<html|Transient statement prose|Transient editorial explanation/iu,
    );
  });

  it('covers an officially unheld contest number with task-bound evidence, not a fake Contest', async () => {
    const gapBatch = {
      id: 'abc316-abc316-test',
      firstContestNumber: 316,
      lastContestNumber: 316,
    } as const;
    const gapEvidenceUrl = 'https://atcoder.jp/contests/abc350/tasks/abc350_a?lang=en';
    const requestedUrls: string[] = [];
    const client = new SerialOfficialPageClient({
      transport: (request) => {
        requestedUrls.push(request.url);
        const policy = policyDocuments.find(({ url }) => url === request.url);
        if (policy) {
          return Promise.resolve({
            status: 200,
            url: request.url,
            contentType: policy.contentType,
            body: policy.body,
          });
        }
        if (request.url === gapEvidenceUrl) {
          return Promise.resolve({
            status: 200,
            url: request.url,
            contentType: 'text/html; charset=utf-8',
            body: contestGapEvidenceHtml,
          });
        }
        return Promise.reject(new Error(`Unexpected request: ${request.url}`));
      },
      userAgent: 'abc-textbook/0.1.0 (contact: offline-contract-test)',
      minimumStartIntervalMs: 0,
    });

    const artifact = await acquireCorpusMetadataBatch({
      batch: gapBatch,
      client,
      policyApproval: approval(),
      checkedAt,
    });

    expect(requestedUrls).toEqual([...policyDocuments.map(({ url }) => url), gapEvidenceUrl]);
    expect(artifact.contests).toEqual([]);
    expect(artifact.contestGaps).toEqual([
      expect.objectContaining({
        number: 316,
        contestId: 'abc316',
        status: 'officially_unheld',
        evidenceAssertion: 'ABC316 was not held on AtCoder.',
      }),
    ]);
    expect(() => {
      verifyCorpusMetadataBatch(artifact, gapBatch);
    }).not.toThrow();
  });

  it('rejects a recomputed artifact whose problem source is bound to another task', async () => {
    const fixtures = pageFixtures();
    const client = new SerialOfficialPageClient({
      transport: (request) => {
        const fixture = fixtures.get(request.url);
        if (!fixture) return Promise.reject(new Error(`Missing fixture: ${request.url}`));
        return Promise.resolve({ ...fixture, url: request.url });
      },
      userAgent: 'abc-textbook/0.1.0 (contact: offline-contract-test)',
      minimumStartIntervalMs: 0,
    });
    const artifact = await acquireCorpusMetadataBatch({
      batch,
      client,
      policyApproval: approval(),
      checkedAt,
    });
    const officialProblemSource = artifact.sourceRevisions.find(
      ({ sourceKind }) => sourceKind === 'official_problem',
    );
    if (!officialProblemSource) throw new Error('The fixture has no official Problem source.');

    const reboundSources = artifact.sourceRevisions.map((source) =>
      source.id === officialProblemSource.id
        ? Object.freeze({
            ...source,
            url: 'https://atcoder.jp/contests/abc212/tasks/abc212_f',
            officialTaskId: 'abc212_f',
          })
        : source,
    );
    const changedSources: CorpusMetadataBatch = {
      ...artifact,
      sourceRevisions: Object.freeze(reboundSources),
    };
    const withMetadataDigest: CorpusMetadataBatch = {
      ...changedSources,
      metadataBatchDigest: calculateMetadataBatchDigest(
        materializeObservedMetadataBatch(changedSources),
      ),
    };
    const forged: CorpusMetadataBatch = {
      ...withMetadataDigest,
      digest: digestWithoutField({ ...withMetadataDigest }, 'digest'),
    };

    expect(() => {
      verifyCorpusMetadataBatch(forged, batch);
    }).toThrow(/PROBLEM_OFFICIAL_SOURCE_SET_INVALID/u);
  });

  it('fails closed when an approved policy fingerprint changes', async () => {
    const fixtures = pageFixtures();
    const transport: OfficialPageTransport = (request) => {
      const fixture = fixtures.get(request.url);
      if (!fixture) return Promise.reject(new Error(`Missing fixture: ${request.url}`));
      if (request.url === 'https://atcoder.jp/tos') {
        return Promise.resolve({
          ...fixture,
          url: request.url,
          body: fixture.body.replace('revision 1', 'revision 2'),
        });
      }
      return Promise.resolve({ ...fixture, url: request.url });
    };
    const client = new SerialOfficialPageClient({
      transport,
      userAgent: 'abc-textbook/0.1.0 (contact: offline-contract-test)',
      minimumStartIntervalMs: 0,
    });

    await expect(
      acquireCorpusMetadataBatch({
        batch,
        client,
        policyApproval: approval(),
        checkedAt,
      }),
    ).rejects.toMatchObject({
      code: 'POLICY_FINGERPRINT_CHANGED',
    } satisfies Partial<CorpusAcquisitionError>);
  });

  it('stops after the task list when a contest has not ended', async () => {
    const fixtures = new Map(pageFixtures());
    const taskListUrl = 'https://atcoder.jp/contests/abc212/tasks';
    const original = fixtures.get(taskListUrl);
    if (!original) throw new Error('The fixture has no task list.');
    fixtures.set(taskListUrl, {
      ...original,
      body: original.body.replaceAll('2021-07-31', '2027-07-31'),
    });
    const requestedUrls: string[] = [];
    const client = new SerialOfficialPageClient({
      transport: (request) => {
        requestedUrls.push(request.url);
        const fixture = fixtures.get(request.url);
        if (!fixture) return Promise.reject(new Error(`Missing fixture: ${request.url}`));
        return Promise.resolve({ ...fixture, url: request.url });
      },
      userAgent: 'abc-textbook/0.1.0 (contact: offline-contract-test)',
      minimumStartIntervalMs: 0,
    });

    await expect(
      acquireCorpusMetadataBatch({ batch, client, policyApproval: approval(), checkedAt }),
    ).rejects.toMatchObject({ code: 'CONTEST_NOT_ENDED' });
    expect(requestedUrls).toEqual([...policyDocuments.map(({ url }) => url), taskListUrl]);
  });

  it('scopes the private raw-response cache to one run and never caches policy checks', async () => {
    const cacheRoot = await mkdtemp(path.join(os.tmpdir(), 'abc-corpus-cache-'));
    const forbiddenCache = path.join(process.cwd(), '.forbidden-corpus-response-cache');
    const taskUrl = 'https://atcoder.jp/contests/abc212/tasks';
    const policyUrl = 'https://atcoder.jp/robots.txt';
    const requestCounts = new Map<string, number>();
    const upstream: OfficialPageTransport = (request) => {
      requestCounts.set(request.url, (requestCounts.get(request.url) ?? 0) + 1);
      return Promise.resolve({
        status: 200,
        url: request.url,
        contentType: request.url === policyUrl ? 'text/plain' : 'text/html',
        body: request.url === policyUrl ? 'User-agent: *' : '<html>private raw response</html>',
      });
    };
    const request = (transport: OfficialPageTransport, url: string) =>
      transport({ url, headers: {}, signal: new AbortController().signal });

    try {
      const firstScope = canonicalDigest({ run: 'first' });
      const first = await createPrivateResponseCache({
        cacheDirectory: cacheRoot,
        repositoryRoot: process.cwd(),
        upstream,
        cacheScope: firstScope,
        bypassUrls: [policyUrl],
      });
      await request(first.transport, taskUrl);
      await request(first.transport, taskUrl);
      await request(first.transport, policyUrl);
      await request(first.transport, policyUrl);

      expect(requestCounts.get(taskUrl)).toBe(1);
      expect(requestCounts.get(policyUrl)).toBe(2);
      expect(await first.isCached(taskUrl)).toBe(true);
      expect(await first.isCached(policyUrl)).toBe(false);
      expect((await stat(first.cacheDirectory)).mode & 0o077).toBe(0);
      const [entryName] = await readdir(first.cacheDirectory);
      expect(entryName).toMatch(/^[a-f0-9]{64}\.json$/u);
      expect(
        JSON.parse(await readFile(path.join(first.cacheDirectory, entryName ?? ''), 'utf8')),
      ).toMatchObject({
        cacheScope: firstScope,
        url: taskUrl,
        status: 200,
        finalUrl: taskUrl,
        body: '<html>private raw response</html>',
      });

      const second = await createPrivateResponseCache({
        cacheDirectory: cacheRoot,
        repositoryRoot: process.cwd(),
        upstream,
        cacheScope: canonicalDigest({ run: 'second' }),
        bypassUrls: [policyUrl],
      });
      await request(second.transport, taskUrl);
      expect(requestCounts.get(taskUrl)).toBe(2);

      await expect(
        createPrivateResponseCache({
          cacheDirectory: forbiddenCache,
          repositoryRoot: process.cwd(),
          upstream,
          cacheScope: firstScope,
        }),
      ).rejects.toMatchObject({ code: 'RESPONSE_CACHE_INSIDE_REPOSITORY' });
      await expect(access(forbiddenCache)).rejects.toMatchObject({ code: 'ENOENT' });
    } finally {
      await rm(cacheRoot, { recursive: true, force: true });
    }
  });

  it('rejects a symlinked canonical parent before materialization can escape', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'abc-materialize-root-'));
    const outsideRoot = await mkdtemp(path.join(os.tmpdir(), 'abc-materialize-outside-'));
    try {
      await mkdir(path.join(temporaryRoot, 'src', 'content'), { recursive: true });
      await symlink(outsideRoot, path.join(temporaryRoot, 'src', 'content', 'contests'));
      await expect(
        ensureNoSymlinkParents(temporaryRoot, 'src/content/contests/abc212-abc263/abc212.json'),
      ).rejects.toMatchObject({ code: 'MATERIALIZATION_PARENT_UNSAFE' });
      expect(await readdir(outsideRoot)).toEqual([]);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
      await rm(outsideRoot, { recursive: true, force: true });
    }
  });

  it('rejects declared batch IDs whose artifacts do not contain their complete ranges', async () => {
    const fixtures = pageFixtures();
    const client = new SerialOfficialPageClient({
      transport: (request) => {
        const fixture = fixtures.get(request.url);
        if (!fixture) return Promise.reject(new Error(`Missing fixture: ${request.url}`));
        return Promise.resolve({ ...fixture, url: request.url });
      },
      userAgent: 'abc-textbook/0.1.0 (contact: offline-contract-test)',
      minimumStartIntervalMs: 0,
    });
    const oneContest = await acquireCorpusMetadataBatch({
      batch,
      client,
      policyApproval: approval(),
      checkedAt,
    });
    const incomplete = corpusBatches.map((declaredBatch): CorpusMetadataBatch => {
      const subject = {
        ...oneContest,
        batchId: declaredBatch.id,
        firstContestNumber: declaredBatch.firstContestNumber,
        lastContestNumber: declaredBatch.lastContestNumber,
      };
      return {
        ...subject,
        digest: digestWithoutField({ ...subject }, 'digest'),
      };
    });

    expect(() => materializeCorpusMetadata(incomplete)).toThrow(/CONTEST_RANGE_INCOMPLETE/u);
  });

  it('reselects a structurally verified cohort with the independent T028 rules anchor', () => {
    const domainCandidates = frozenInitialV1SelectionRules.cohortRules.domains.flatMap(
      (domain, domainIndex) =>
        [0, 1].map((offset) => {
          const isFixture = domainIndex === 3 && offset === 1;
          const contestNumber = isFixture ? 999 : 212 + domainIndex;
          const advancedLabel = offset === 0 ? 'E' : 'F';
          const contestId = `abc${String(contestNumber).padStart(3, '0')}`;
          const problemId = `${contestId}-${advancedLabel.toLocaleLowerCase('en-US')}`;
          const sourceRevisionId = `source-${problemId}`;
          const outcomeId = `outcome-${domain}`;
          return {
            problemId,
            contestNumber,
            officialTaskOrder: 4 + offset,
            advancedLabel,
            officialTaskId: `${contestId}_${advancedLabel.toLocaleLowerCase('en-US')}`,
            sourceRevisionIds: [sourceRevisionId],
            candidateDomains: [domain],
            candidateOutcomeIds: [outcomeId],
            classifications: [
              {
                domain,
                outcomeId,
                sourceRevisionIds: [sourceRevisionId],
                rationale: `Source-backed ${domain} classification.`,
              },
            ],
            selectionEligible: true,
            exclusionReason: null,
            fixtureId: isFixture ? 'future-label-fixture' : null,
          };
        }),
    );
    const candidates = [...domainCandidates].sort(
      (left, right) =>
        left.contestNumber - right.contestNumber ||
        left.officialTaskOrder - right.officialTaskOrder ||
        left.problemId.localeCompare(right.problemId, 'en-US'),
    );
    const candidatePoolSubject = {
      schemaVersion: '1.0.0' as const,
      previewId: 'initial-v1' as const,
      batchId: 'abc212-abc263' as const,
      metadataBatchDigest: canonicalDigest({ metadata: 'verified-elsewhere' }),
      allowedDomains: [...frozenInitialV1SelectionRules.cohortRules.domains].sort(),
      sourceRevisionIds: candidates.map(({ sourceRevisionIds }) => sourceRevisionIds[0] ?? ''),
      candidates,
    };
    const pool: PreviewCandidatePool = {
      ...candidatePoolSubject,
      candidatePoolDigest: canonicalDigest(candidatePoolSubject),
    };

    const frozen = refreezeVerifiedPreviewCohort({
      pool,
      selectionRules: frozenInitialV1SelectionRules,
      frozenRulesDigest: frozenInitialV1RulesDigest,
    });
    expect(frozen.selectedProblemIds).toHaveLength(8);
    expect(frozen.fixtureBoundaries).toEqual([
      { fixtureId: 'future-label-fixture', problemIds: ['abc999-f'] },
    ]);
    expect(frozen.frozenRulesDigest).toBe(INITIAL_PREVIEW_FROZEN_RULES_DIGEST);
    expect(frozen).toMatchObject({
      seedRange: frozenInitialV1SelectionRules.seedRange,
      scopeRule: frozenInitialV1SelectionRules.scopeRule,
      cohortRules: frozenInitialV1SelectionRules.cohortRules,
      publicationBoundary: frozenInitialV1SelectionRules.publicationBoundary,
    });

    const forgedRules = {
      ...frozenInitialV1SelectionRules,
      cohortRules: {
        ...frozenInitialV1SelectionRules.cohortRules,
        minimumProblemCount: 7,
      },
    };
    expect(() =>
      refreezeVerifiedPreviewCohort({
        pool,
        selectionRules: forgedRules,
        frozenRulesDigest: canonicalDigest(forgedRules),
      }),
    ).toThrow(/FROZEN_COHORT_RULES_INVALID/u);

    const emptyEligibleSubject = {
      ...candidatePoolSubject,
      candidates: candidatePoolSubject.candidates.map((candidate, index) =>
        index === 0
          ? { ...candidate, candidateDomains: [], candidateOutcomeIds: [], classifications: [] }
          : candidate,
      ),
    };
    const emptyEligible: PreviewCandidatePool = {
      ...emptyEligibleSubject,
      candidatePoolDigest: canonicalDigest(emptyEligibleSubject),
    };
    expect(() =>
      refreezeVerifiedPreviewCohort({
        pool: emptyEligible,
        selectionRules: frozenInitialV1SelectionRules,
        frozenRulesDigest: frozenInitialV1RulesDigest,
      }),
    ).toThrow(/CANDIDATE_STRUCTURE_INVALID/u);
  });
});
