import { readFile } from 'node:fs/promises';

import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { normalizedPolicyFingerprint } from '../../src/lib/corpus/acquisition.js';
import type { OfficialPageTransport, PolicyApprovalManifest } from '../../src/lib/corpus/types.js';

export const liveCheckedAt = '2026-10-11T12:00:00+09:00';
const policies = [
  {
    id: 'atcoder-robots',
    kind: 'robots' as const,
    url: 'https://atcoder.jp/robots.txt',
    contentType: 'text/plain',
    body: 'User-agent: *\nAllow: /\n',
  },
  {
    id: 'atcoder-terms',
    kind: 'terms' as const,
    url: 'https://atcoder.jp/tos',
    contentType: 'text/html',
    body: '<div id="main-container"><div class="panel-body">Fixture terms</div></div>',
  },
  {
    id: 'atcoder-generative-ai',
    kind: 'generative-ai' as const,
    url: 'https://atcoder.jp/posts/1501',
    contentType: 'text/html',
    body: '<div id="main-container"><div class="blog-post">Fixture AI policy</div></div>',
  },
];
export const livePolicyApproval: PolicyApprovalManifest = {
  schemaVersion: '1.0.0',
  documents: policies.map((document) => ({
    id: document.id,
    kind: document.kind,
    url: document.url,
    approvedFingerprint: normalizedPolicyFingerprint(document, document),
  })),
};

/** The real existing ABC212–466 catalog, with explicit fixture publication identity. */
export const liveBase = async () => {
  const catalog = CatalogSchema.parse(
    JSON.parse(
      await readFile(
        new URL('../../docs/verification/releases/catalog.json', import.meta.url),
        'utf8',
      ),
    ) as unknown,
  );
  const metadata = {
    schemaVersion: '1.0.0',
    version: catalog.release.version,
    cutoffAt: catalog.release.cutoffAt,
    commit: 'a'.repeat(40),
    validationResultsUrl: 'https://github.com/Fu-L/abc-textbook/actions/runs/1',
    changeSummary: {
      updateIds: catalog.release.updateIds,
      addedProblemIds: catalog.release.addedProblemIds,
      changedProblemIds: catalog.release.changedProblemIds,
      withdrawnProblemIds: catalog.release.withdrawnProblemIds,
      taxonomyChanges: catalog.release.taxonomyChanges.map(({ summary }) => summary),
    },
  };
  return { baseCatalog: catalog, baseMetadata: metadata };
};

export const liveTaskId = (number: number, label: string) =>
  `abc${String(number)}_${label === 'Ex' ? 'h' : label.toLowerCase()}`;

export const liveTaskList = (number: number, labels: readonly string[], ended = true) => `
  <a class="contest-title" href="/contests/abc${String(number)}">AtCoder Beginner Contest ${String(number)}</a>
  <div class="contest-duration"><time class="fixtime-full">${ended ? '2026' : '2027'}-08-01 21:00:00+0900</time><time class="fixtime-full">${ended ? '2026' : '2027'}-08-01 22:40:00+0900</time></div>
  <table><tbody>${labels.map((label) => `<tr><td><a href="/contests/abc${String(number)}/tasks/${liveTaskId(number, label)}">${label}</a></td><td><a href="/contests/abc${String(number)}/tasks/${liveTaskId(number, label)}">Task ${label}</a></td><td>2 sec</td><td>1024 MiB</td></tr>`).join('')}</tbody></table>`;

/** Exercise the complete official parser/transport path, without network I/O. */
export const liveTransport = (
  options: {
    readonly labels?: readonly string[];
    readonly taskList?: (number: number, labels: readonly string[]) => string;
    readonly unavailable?: string;
    readonly failOnce?: string;
    readonly requests?: string[];
  } = {},
): OfficialPageTransport => {
  const labels = options.labels ?? ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'Ex'];
  let failed = false;
  return (request) => {
    options.requests?.push(request.url);
    const response = (body: string, contentType = 'text/html', status = 200) =>
      Promise.resolve({ url: request.url, body, contentType, status });
    const policy = policies.find(({ url }) => url === request.url);
    if (policy) return response(policy.body, policy.contentType);
    if (options.unavailable && request.url.includes(options.unavailable))
      return response('', 'text/html', 404);
    if (!failed && options.failOnce && request.url.includes(options.failOnce)) {
      failed = true;
      return response('', 'text/html', 503);
    }
    const number = Number(/\/contests\/abc(\d+)\//u.exec(request.url)?.[1]);
    const url = new URL(request.url);
    if (url.pathname === '/contests/abc350/tasks/abc350_a')
      return response(
        '<div id="task-statement"><span class="lang-en"><p>ABC316 was not held on AtCoder.</p></span></div>',
      );
    if (url.pathname.endsWith('/tasks'))
      return response(options.taskList?.(number, labels) ?? liveTaskList(number, labels));
    const label = labels.find((candidate) =>
      url.pathname.endsWith(`/tasks/${liveTaskId(number, candidate)}`),
    );
    if (label)
      return response(
        `<div class="h2">${label} - Task ${label}</div><div id="task-statement"><span class="lang-en"><section><h3>Problem Statement</h3><p>Fixture statement.</p></section><section><h3>Constraints</h3><ul><li>1 ≤ N ≤ 100</li></ul></section></span></div>`,
      );
    if (url.pathname.endsWith('/editorial'))
      return response(
        `<div id="main-container">${labels.map((candidate, index) => `<h3><a class="small" href="/contests/abc${String(number)}/tasks/${liveTaskId(number, candidate)}">${candidate} - Task ${candidate}</a></h3><div class="editorial-section"><ul><li><span class="label">Official</span><a href="/contests/abc${String(number)}/editorial/${String(1000 + index)}">Official explanation</a></li></ul></div>`).join('')}</div>`,
      );
    const index = Number(url.pathname.split('/').at(-1)) - 1000;
    const editorialLabel = labels[index];
    if (editorialLabel)
      return response(
        `<div id="main-container"><span class="label">Official</span><h2><a href="/contests/abc${String(number)}/tasks/${liveTaskId(number, editorialLabel)}">${editorialLabel} - Task ${editorialLabel}</a></h2><div class="editorial-body"><p>Fixture explanation.</p></div></div>`,
      );
    return Promise.reject(new Error(`Unexpected fixture request: ${request.url}`));
  };
};
