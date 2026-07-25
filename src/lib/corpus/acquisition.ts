import { load } from 'cheerio';

import { canonicalDigest, digestWithoutField } from '../domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
import {
  contestNumbersForBatch,
  officialContestGapsForBatch,
  type CorpusBatch,
} from './batches.js';
import {
  calculateMetadataBatchDigest,
  materializeObservedMetadataBatch,
} from './materialization.js';
import {
  advancedTasks,
  parseOfficialContestMetadata,
  parseOfficialContestGapMetadata,
  parseOfficialEditorialIndex,
  parseOfficialEditorialContinuationUrls,
  parseOfficialEditorialItemRevision,
  parseOfficialProblemMetadata,
} from './metadata.js';
import type {
  ApprovedPolicyDocument,
  CorpusMetadataBatch,
  CorpusMetadataBatchSubject,
  CorpusProblemMetadata,
  CorpusSourceRevision,
  OfficialPageResponse,
  OfficialPageTransport,
  PolicyApprovalManifest,
  PolicyDocumentKind,
  VerifiedPolicyBundle,
  VerifiedPolicyDocument,
} from './types.js';
import { verifyCorpusMetadataBatch, verifyPolicyApprovalManifest } from './verification.js';

const SHA_256 = /^[a-f0-9]{64}$/u;
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

export class CorpusAcquisitionError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CorpusAcquisitionError';
  }
}

export interface SerialOfficialPageClientOptions {
  readonly transport: OfficialPageTransport;
  readonly userAgent: string;
  readonly minimumStartIntervalMs?: number;
  readonly requestTimeoutMs?: number;
  readonly maximumAttempts?: number;
  readonly now?: () => number;
  readonly sleep?: (milliseconds: number) => Promise<void>;
  /** Cache hits are serialized but do not consume the official-host rate limit. */
  readonly isCached?: (url: string) => Promise<boolean>;
}

const defaultSleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const assertOfficialUrl = (value: string): URL => {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new CorpusAcquisitionError('OFFICIAL_URL_INVALID', value);
  }
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'atcoder.jp' ||
    url.username !== '' ||
    url.password !== '' ||
    url.port !== '' ||
    url.hash !== ''
  ) {
    throw new CorpusAcquisitionError('OFFICIAL_URL_UNTRUSTED', value);
  }
  return url;
};

/**
 * One shared queue owns all starts, including retries. Callers may accidentally
 * invoke `get` concurrently without increasing load on the official host.
 */
export class SerialOfficialPageClient {
  readonly #transport: OfficialPageTransport;
  readonly #userAgent: string;
  readonly #minimumStartIntervalMs: number;
  readonly #requestTimeoutMs: number;
  readonly #maximumAttempts: number;
  readonly #now: () => number;
  readonly #sleep: (milliseconds: number) => Promise<void>;
  readonly #isCached: (url: string) => Promise<boolean>;
  #lastStartedAt: number | null = null;
  #tail: Promise<void> = Promise.resolve();

  constructor(options: SerialOfficialPageClientOptions) {
    if (!/^abc-textbook\/[A-Za-z0-9._-]+ \(contact: [^)]+\)$/u.test(options.userAgent)) {
      throw new CorpusAcquisitionError(
        'USER_AGENT_INVALID',
        'Use `abc-textbook/<version> (contact: <project-or-contact>)`.',
      );
    }
    const minimumStartIntervalMs = options.minimumStartIntervalMs ?? 1_000;
    const requestTimeoutMs = options.requestTimeoutMs ?? 15_000;
    const maximumAttempts = options.maximumAttempts ?? 2;
    if (!Number.isSafeInteger(minimumStartIntervalMs) || minimumStartIntervalMs < 0) {
      throw new CorpusAcquisitionError('START_INTERVAL_INVALID', String(minimumStartIntervalMs));
    }
    if (!Number.isSafeInteger(requestTimeoutMs) || requestTimeoutMs <= 0) {
      throw new CorpusAcquisitionError('REQUEST_TIMEOUT_INVALID', String(requestTimeoutMs));
    }
    if (!Number.isSafeInteger(maximumAttempts) || maximumAttempts < 1 || maximumAttempts > 3) {
      throw new CorpusAcquisitionError('MAXIMUM_ATTEMPTS_INVALID', String(maximumAttempts));
    }
    this.#transport = options.transport;
    this.#userAgent = options.userAgent;
    this.#minimumStartIntervalMs = minimumStartIntervalMs;
    this.#requestTimeoutMs = requestTimeoutMs;
    this.#maximumAttempts = maximumAttempts;
    this.#now = options.now ?? Date.now;
    this.#sleep = options.sleep ?? defaultSleep;
    this.#isCached = options.isCached ?? (() => Promise.resolve(false));
  }

  get(url: string): Promise<OfficialPageResponse> {
    assertOfficialUrl(url);
    const operation = this.#tail.then(() => this.#perform(url));
    this.#tail = operation.then(
      () => undefined,
      () => undefined,
    );
    return operation;
  }

  async #perform(url: string): Promise<OfficialPageResponse> {
    let lastFailure = 'request failed';
    for (let attempt = 1; attempt <= this.#maximumAttempts; attempt += 1) {
      const isCacheHit = await this.#isCached(url);
      if (!isCacheHit && this.#lastStartedAt !== null) {
        const wait = this.#lastStartedAt + this.#minimumStartIntervalMs - this.#now();
        if (wait > 0) await this.#sleep(wait);
      }
      if (!isCacheHit) this.#lastStartedAt = this.#now();
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, this.#requestTimeoutMs);
      try {
        const response = await this.#transport({
          url,
          headers: {
            Accept: 'text/html, text/plain;q=0.9',
            'Accept-Language': 'en',
            'User-Agent': this.#userAgent,
          },
          signal: controller.signal,
        });
        const requested = assertOfficialUrl(url);
        const responded = assertOfficialUrl(response.url);
        if (requested.origin !== responded.origin || requested.pathname !== responded.pathname) {
          throw new CorpusAcquisitionError(
            'OFFICIAL_REDIRECT_REJECTED',
            `${requested.pathname} -> ${responded.pathname}`,
          );
        }
        if (response.status === 200) return response;
        lastFailure = `HTTP ${String(response.status)} for ${requested.pathname}`;
        if (!RETRYABLE_STATUS.has(response.status)) {
          throw new CorpusAcquisitionError('OFFICIAL_REQUEST_REJECTED', lastFailure);
        }
      } catch (error) {
        if (error instanceof CorpusAcquisitionError) throw error;
        lastFailure = error instanceof Error ? error.name : 'transport failure';
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new CorpusAcquisitionError('OFFICIAL_REQUEST_FAILED', lastFailure);
  }
}

const normalizedWhitespace = (value: string): string =>
  value
    .normalize('NFC')
    .replace(/\r\n?/gu, '\n')
    .replace(/[\t ]+/gu, ' ')
    .trim();

const normalizeRobotsPolicy = (body: string): string =>
  normalizedWhitespace(
    body
      .split(/\r?\n/u)
      .map((line) => line.trimEnd())
      .join('\n'),
  );

const extractPolicyText = (kind: Exclude<PolicyDocumentKind, 'robots'>, html: string): string => {
  const $ = load(html);
  $('script, style, form, nav, footer, .a2a_kit').remove();
  const selector = kind === 'terms' ? '#main-container .panel-body' : '#main-container .blog-post';
  const matches = $(selector);
  if (matches.length === 0) {
    throw new CorpusAcquisitionError('POLICY_PARSER_DRIFT', `${kind} selector is absent.`);
  }
  const sections = matches.toArray().map((element) => normalizedWhitespace($(element).text()));
  if (sections.some((section) => section === '')) {
    throw new CorpusAcquisitionError('POLICY_PARSER_DRIFT', `${kind} policy text is empty.`);
  }
  return sections
    .map((section, index) => `policy-section-${String(index + 1)}\n${section}`)
    .join('\n---\n');
};

export const normalizedPolicyFingerprint = (
  document: Pick<ApprovedPolicyDocument, 'kind' | 'url'>,
  response: Pick<OfficialPageResponse, 'contentType' | 'body'>,
): string => {
  const contentType = response.contentType.toLocaleLowerCase('en-US');
  const normalizedText =
    document.kind === 'robots'
      ? contentType.includes('text/plain')
        ? normalizeRobotsPolicy(response.body)
        : (() => {
            throw new CorpusAcquisitionError(
              'POLICY_CONTENT_TYPE_INVALID',
              `${document.kind}: ${response.contentType}`,
            );
          })()
      : contentType.includes('text/html')
        ? extractPolicyText(document.kind, response.body)
        : (() => {
            throw new CorpusAcquisitionError(
              'POLICY_CONTENT_TYPE_INVALID',
              `${document.kind}: ${response.contentType}`,
            );
          })();
  return canonicalDigest({
    kind: document.kind,
    url: document.url,
    normalizedText,
  });
};

export const verifyApprovedPolicies = async (input: {
  readonly client: SerialOfficialPageClient;
  readonly approval: PolicyApprovalManifest;
  readonly checkedAt: string;
}): Promise<VerifiedPolicyBundle> => {
  verifyPolicyApprovalManifest(input.approval);
  parseOffsetDateTime(input.checkedAt);
  const documents: VerifiedPolicyDocument[] = [];
  for (const approved of input.approval.documents) {
    const response = await input.client.get(approved.url);
    const fingerprint = normalizedPolicyFingerprint(approved, response);
    if (fingerprint !== approved.approvedFingerprint) {
      throw new CorpusAcquisitionError(
        'POLICY_FINGERPRINT_CHANGED',
        `${approved.id} requires explicit re-approval.`,
      );
    }
    documents.push(
      Object.freeze({
        id: approved.id,
        kind: approved.kind,
        url: approved.url,
        fingerprint,
        approvedFingerprint: approved.approvedFingerprint,
      }),
    );
  }
  const subject = {
    checkedAt: input.checkedAt,
    documents: Object.freeze(documents),
  };
  return Object.freeze({ ...subject, digest: canonicalDigest(subject) });
};

export const acquireCorpusMetadataBatch = async (input: {
  readonly batch: CorpusBatch;
  readonly client: SerialOfficialPageClient;
  readonly policyApproval: PolicyApprovalManifest;
  readonly checkedAt: string;
}): Promise<CorpusMetadataBatch> => {
  parseOffsetDateTime(input.checkedAt);
  const policy = await verifyApprovedPolicies({
    client: input.client,
    approval: input.policyApproval,
    checkedAt: input.checkedAt,
  });
  const contests = [];
  const contestGaps = [];
  const problems: CorpusProblemMetadata[] = [];
  const sourceRevisions: CorpusSourceRevision[] = [];
  const gapByNumber = new Map(
    officialContestGapsForBatch(input.batch).map((definition) => [definition.number, definition]),
  );
  for (const contestNumber of contestNumbersForBatch(input.batch)) {
    const gap = gapByNumber.get(contestNumber);
    if (gap) {
      const gapResponse = await input.client.get(`${gap.evidenceUrl}?lang=en`);
      if (!gapResponse.contentType.toLocaleLowerCase('en-US').includes('text/html')) {
        throw new CorpusAcquisitionError(
          'CONTEST_GAP_EVIDENCE_CONTENT_TYPE_INVALID',
          `${gap.contestId}: ${gapResponse.contentType}`,
        );
      }
      contestGaps.push(
        parseOfficialContestGapMetadata({
          ...gap,
          html: gapResponse.body,
          checkedAt: input.checkedAt,
          termsCheckedAt: policy.checkedAt,
        }),
      );
      continue;
    }
    const contestId = `abc${String(contestNumber).padStart(3, '0')}`;
    const officialTaskListUrl = `https://atcoder.jp/contests/${contestId}/tasks`;
    const response = await input.client.get(officialTaskListUrl);
    if (!response.contentType.toLocaleLowerCase('en-US').includes('text/html')) {
      throw new CorpusAcquisitionError(
        'TASK_LIST_CONTENT_TYPE_INVALID',
        `${contestId}: ${response.contentType}`,
      );
    }
    const parsed = parseOfficialContestMetadata({
      contestNumber,
      officialTaskListUrl,
      html: response.body,
      checkedAt: input.checkedAt,
      termsCheckedAt: policy.checkedAt,
    });
    if (
      compareOffsetDateTimes(
        parseOffsetDateTime(parsed.contest.endedAt),
        parseOffsetDateTime(input.checkedAt),
      ) > 0
    ) {
      throw new CorpusAcquisitionError(
        'CONTEST_NOT_ENDED',
        `${contestId} ends at ${parsed.contest.endedAt}, after ${input.checkedAt}.`,
      );
    }
    contests.push(parsed.contest);
    sourceRevisions.push(parsed.sourceRevision);

    const advanced = advancedTasks(parsed.contest);
    for (const task of advanced) {
      const taskResponse = await input.client.get(`${task.officialUrl}?lang=en`);
      if (!taskResponse.contentType.toLocaleLowerCase('en-US').includes('text/html')) {
        throw new CorpusAcquisitionError(
          'TASK_CONTENT_TYPE_INVALID',
          `${task.problemId}: ${taskResponse.contentType}`,
        );
      }
      const detail = parseOfficialProblemMetadata({
        contest: parsed.contest,
        task,
        html: taskResponse.body,
        checkedAt: input.checkedAt,
        termsCheckedAt: policy.checkedAt,
      });
      problems.push(detail.problem);
      sourceRevisions.push(detail.sourceRevision);
    }

    const editorialResponse = await input.client.get(
      `https://atcoder.jp/contests/${contestId}/editorial?lang=en`,
    );
    if (!editorialResponse.contentType.toLocaleLowerCase('en-US').includes('text/html')) {
      throw new CorpusAcquisitionError(
        'EDITORIAL_INDEX_CONTENT_TYPE_INVALID',
        `${contestId}: ${editorialResponse.contentType}`,
      );
    }
    const editorialIndex = parseOfficialEditorialIndex({
      contest: parsed.contest,
      html: editorialResponse.body,
      checkedAt: input.checkedAt,
      termsCheckedAt: policy.checkedAt,
    });
    sourceRevisions.push(editorialIndex.sourceRevision);
    for (const task of advanced) {
      const problem = problems.find(
        (candidate) =>
          candidate.contestId === contestId && candidate.officialTaskId === task.officialTaskId,
      );
      if (!problem) {
        throw new CorpusAcquisitionError('PROBLEM_METADATA_MISSING', task.problemId);
      }
      const editorialRevisionIds: string[] = [];
      const preferredEditorialUrl =
        editorialIndex.itemUrlsByOfficialTaskId[task.officialTaskId]?.[0];
      const pendingEditorialUrls = preferredEditorialUrl ? [preferredEditorialUrl] : [];
      const visitedEditorialUrls = new Set<string>();
      while (pendingEditorialUrls.length > 0) {
        const editorialUrl = pendingEditorialUrls.shift();
        if (!editorialUrl || visitedEditorialUrls.has(editorialUrl)) continue;
        visitedEditorialUrls.add(editorialUrl);
        const itemResponse = await input.client.get(`${editorialUrl}?lang=en`);
        if (!itemResponse.contentType.toLocaleLowerCase('en-US').includes('text/html')) {
          throw new CorpusAcquisitionError(
            'EDITORIAL_ITEM_CONTENT_TYPE_INVALID',
            `${editorialUrl}: ${itemResponse.contentType}`,
          );
        }
        const revision = parseOfficialEditorialItemRevision({
          contestId,
          officialTaskId: task.officialTaskId,
          url: editorialUrl,
          html: itemResponse.body,
          checkedAt: input.checkedAt,
          termsCheckedAt: policy.checkedAt,
        });
        sourceRevisions.push(revision);
        editorialRevisionIds.push(revision.id);
        for (const continuationUrl of parseOfficialEditorialContinuationUrls({
          contestId,
          url: editorialUrl,
          html: itemResponse.body,
        })) {
          if (!visitedEditorialUrls.has(continuationUrl))
            pendingEditorialUrls.push(continuationUrl);
        }
      }
      const problemIndex = problems.indexOf(problem);
      problems[problemIndex] = Object.freeze({
        ...problem,
        sourceRevisionIds: Object.freeze([...problem.sourceRevisionIds, ...editorialRevisionIds]),
      });
    }
  }
  const partialSubject = {
    schemaVersion: '1.0.0',
    batchId: input.batch.id,
    firstContestNumber: input.batch.firstContestNumber,
    lastContestNumber: input.batch.lastContestNumber,
    checkedAt: input.checkedAt,
    policy,
    contests: Object.freeze(contests),
    contestGaps: Object.freeze(contestGaps),
    problems: Object.freeze(problems),
    sourceRevisions: Object.freeze(sourceRevisions),
  } as const;
  const temporary = {
    ...partialSubject,
    metadataBatchDigest: '',
    digest: '',
  } satisfies CorpusMetadataBatch;
  const observed = materializeObservedMetadataBatch(temporary);
  const metadataBatchDigest = calculateMetadataBatchDigest(observed);
  const subject: CorpusMetadataBatchSubject = {
    ...partialSubject,
    metadataBatchDigest,
  };
  const artifact: CorpusMetadataBatch = Object.freeze({
    ...subject,
    digest: digestWithoutField({ ...subject, digest: '' }, 'digest'),
  });
  verifyCorpusMetadataBatch(artifact, input.batch);
  return artifact;
};

export const createFetchTransport =
  (fetchImplementation: typeof fetch = fetch): OfficialPageTransport =>
  async (request) => {
    const response = await fetchImplementation(request.url, {
      headers: request.headers,
      redirect: 'follow',
      signal: request.signal,
    });
    return {
      status: response.status,
      url: response.url,
      contentType: response.headers.get('content-type') ?? '',
      body: await response.text(),
    };
  };

export const isSha256 = (value: string): boolean => SHA_256.test(value);
