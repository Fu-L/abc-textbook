import { load } from 'cheerio';

import {
  OfficialTaskListError,
  parseOfficialEditorialItem,
  parseOfficialTaskList,
} from '../catalog/official-task-list.js';
import { normalizeOfficialContentFragment } from '../catalog/official-content-normalization.js';
import { canonicalDigest } from '../domain/canonical-json.js';
import { compareOffsetDateTimes, parseOffsetDateTime } from '../domain/date-time.js';
import { stableContestId, stableProblemId } from '../domain/identity.js';
import type {
  CorpusProblemMetadata,
  CorpusSourceRevision,
  OfficialContestMetadata,
  OfficialContestGapMetadata,
  OfficialTaskMetadata,
} from './types.js';

export class OfficialMetadataError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'OfficialMetadataError';
  }
}

const normalizeText = (value: string): string =>
  value.normalize('NFC').replace(/\s+/gu, ' ').trim();

const canonicalTaskUrl = (contestId: string, officialTaskId: string): string =>
  `https://atcoder.jp/contests/${contestId}/tasks/${officialTaskId}`;

const normalizeFact = (value: string): string => normalizeText(value).replaceAll('；', ';');

const parseDisplayedOffsetDateTime = (value: string): string => {
  const normalized = normalizeText(value);
  const match =
    /^(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2})(?<offset>[+-]\d{2})(?<minutes>\d{2})$/u.exec(
      normalized,
    );
  if (!match?.groups) {
    throw new OfficialMetadataError('CONTEST_TIME_PARSER_DRIFT', normalized);
  }
  const { date, time, offset, minutes } = match.groups;
  if (!date || !time || !offset || !minutes) {
    throw new OfficialMetadataError('CONTEST_TIME_PARSER_DRIFT', normalized);
  }
  const parsed = `${date}T${time}${offset}:${minutes}`;
  parseOffsetDateTime(parsed);
  return parsed;
};

export type OfficialTaskListFingerprintSubject = Omit<
  OfficialContestMetadata,
  'taskOrderSourceRevisionId' | 'checkedAt'
>;

export const officialTaskListFingerprintSubject = (
  metadata: OfficialContestMetadata | OfficialTaskListFingerprintSubject,
): OfficialTaskListFingerprintSubject => ({
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  startedAt: metadata.startedAt,
  endedAt: metadata.endedAt,
  officialUrl: metadata.officialUrl,
  officialTaskListUrl: metadata.officialTaskListUrl,
  officialTaskOrder: metadata.officialTaskOrder,
  tasks: metadata.tasks,
});

export const officialTaskListMetadataFingerprint = (
  metadata: OfficialContestMetadata | OfficialTaskListFingerprintSubject,
): string => canonicalDigest(officialTaskListFingerprintSubject(metadata));

export interface ParsedContestMetadata {
  readonly contest: OfficialContestMetadata;
  readonly sourceRevision: CorpusSourceRevision;
}

export const parseOfficialContestGapMetadata = (input: {
  readonly number: number;
  readonly contestId: string;
  readonly evidenceUrl: string;
  readonly evidenceAssertion: string;
  readonly html: string;
  readonly checkedAt: string;
  readonly termsCheckedAt: string;
}): OfficialContestGapMetadata => {
  parseOffsetDateTime(input.checkedAt);
  parseOffsetDateTime(input.termsCheckedAt);
  if (input.contestId !== stableContestId(input.number)) {
    throw new OfficialMetadataError('CONTEST_GAP_ID_MISMATCH', input.contestId);
  }
  const evidenceUrl = new URL(input.evidenceUrl);
  if (
    evidenceUrl.protocol !== 'https:' ||
    evidenceUrl.hostname !== 'atcoder.jp' ||
    evidenceUrl.hash !== ''
  ) {
    throw new OfficialMetadataError('CONTEST_GAP_EVIDENCE_URL_UNTRUSTED', input.evidenceUrl);
  }
  const $ = load(input.html);
  const englishStatement = $('#task-statement span.lang-en');
  if (englishStatement.length !== 1) {
    throw new OfficialMetadataError(
      'CONTEST_GAP_EVIDENCE_PARSER_DRIFT',
      `${input.contestId}: ${String(englishStatement.length)} English statement roots.`,
    );
  }
  const normalizedContent = normalizeOfficialContentFragment(
    englishStatement.html() ?? '',
    input.evidenceUrl,
  );
  if (!normalizedContent.text.includes(input.evidenceAssertion)) {
    throw new OfficialMetadataError(
      'CONTEST_GAP_ASSERTION_MISSING',
      `${input.contestId}: ${input.evidenceAssertion}`,
    );
  }
  const fingerprint = canonicalDigest({
    number: input.number,
    contestId: input.contestId,
    status: 'officially_unheld',
    evidenceUrl: input.evidenceUrl,
    evidenceAssertion: input.evidenceAssertion,
    normalizedContent,
  });
  return Object.freeze({
    number: input.number,
    contestId: input.contestId,
    status: 'officially_unheld',
    evidenceUrl: input.evidenceUrl,
    evidenceAssertion: input.evidenceAssertion,
    checkedAt: input.checkedAt,
    termsCheckedAt: input.termsCheckedAt,
    fingerprint,
  });
};

/**
 * Extract only contest/task metadata. The raw page is intentionally absent from
 * the return type, and the revision fingerprint is computed from the normalized
 * projection so volatile CSRF/session markup cannot create false revisions.
 */
export const parseOfficialContestMetadata = (input: {
  readonly contestNumber: number;
  readonly officialTaskListUrl: string;
  readonly html: string;
  readonly checkedAt: string;
  readonly termsCheckedAt: string;
}): ParsedContestMetadata => {
  const contestId = stableContestId(input.contestNumber);
  parseOffsetDateTime(input.checkedAt);
  parseOffsetDateTime(input.termsCheckedAt);

  let parsedTaskList: ReturnType<typeof parseOfficialTaskList>;
  try {
    parsedTaskList = parseOfficialTaskList({
      contestId,
      officialTaskListUrl: input.officialTaskListUrl,
      html: input.html,
      checkedAt: input.checkedAt,
    });
  } catch (error) {
    if (error instanceof OfficialTaskListError) {
      throw new OfficialMetadataError(error.code, error.message);
    }
    throw error;
  }

  const url = new URL(input.officialTaskListUrl);
  const officialTaskListUrl = `${url.origin}/contests/${contestId}/tasks`;
  const officialUrl = `${url.origin}/contests/${contestId}`;
  const $ = load(input.html);
  const taskTables = $('table').filter(
    (_index, table) => $(table).find('tbody a[href*="/tasks/"]').length > 0,
  );
  if (taskTables.length !== 1) {
    throw new OfficialMetadataError(
      'PARSER_DRIFT',
      `Expected exactly one official task table, found ${String(taskTables.length)}.`,
    );
  }

  const rows = taskTables.first().find('tbody > tr').toArray();
  if (rows.length !== parsedTaskList.officialTaskOrder.length) {
    throw new OfficialMetadataError(
      'TASK_METADATA_COUNT_MISMATCH',
      `${contestId} has inconsistent parser projections.`,
    );
  }

  const tasks: OfficialTaskMetadata[] = rows.map((row, officialOrder) => {
    const cells = $(row).find('td');
    const titleLinks = cells.eq(1).find('a[href]');
    if (titleLinks.length !== 1) {
      throw new OfficialMetadataError(
        'TASK_TITLE_PARSER_DRIFT',
        `${contestId} task ${String(officialOrder)} has no unique title link.`,
      );
    }
    const label = parsedTaskList.officialTaskOrder[officialOrder];
    const officialTaskId = parsedTaskList.officialTaskIds[officialOrder];
    if (!label || !officialTaskId) {
      throw new OfficialMetadataError(
        'TASK_METADATA_COUNT_MISMATCH',
        `${contestId} task ${String(officialOrder)} is incomplete.`,
      );
    }
    const titleLink = titleLinks.first();
    const title = normalizeText(titleLink.text());
    if (title === '') {
      throw new OfficialMetadataError(
        'TASK_TITLE_MISSING',
        `${contestId} task ${String(officialOrder)} has an empty title.`,
      );
    }
    const expectedUrl = canonicalTaskUrl(contestId, officialTaskId);
    const titleHref = titleLink.attr('href');
    if (!titleHref || new URL(titleHref, url).href !== expectedUrl) {
      throw new OfficialMetadataError(
        'TASK_TITLE_LINK_MISMATCH',
        `${contestId} task ${String(officialOrder)} title points at a different task.`,
      );
    }
    const timeLimit = normalizeFact(cells.eq(2).text());
    const memoryLimit = normalizeFact(cells.eq(3).text());
    if (timeLimit === '' || memoryLimit === '') {
      throw new OfficialMetadataError(
        'TASK_LIMIT_PARSER_DRIFT',
        `${contestId} task ${String(officialOrder)} has incomplete limits.`,
      );
    }
    return Object.freeze({
      label,
      officialOrder,
      officialTaskId,
      title,
      officialUrl: expectedUrl,
      timeLimit,
      memoryLimit,
    });
  });

  const contestTitleLinks = $('a.contest-title').filter((_index, element) => {
    const href = $(element).attr('href');
    return href !== undefined && new URL(href, url).pathname === `/contests/${contestId}`;
  });
  const contestTitles = [
    ...new Set(contestTitleLinks.toArray().map((item) => normalizeText($(item).text()))),
  ];
  if (contestTitles.length !== 1 || contestTitles[0] === '') {
    throw new OfficialMetadataError(
      'CONTEST_TITLE_PARSER_DRIFT',
      `${contestId} has no unique official title.`,
    );
  }
  const contestTitle = contestTitles[0];
  if (!contestTitle) {
    throw new OfficialMetadataError('CONTEST_TITLE_PARSER_DRIFT', contestId);
  }

  const displayedTimes = $('.contest-duration time.fixtime-full')
    .toArray()
    .map((item) => parseDisplayedOffsetDateTime($(item).text()));
  if (displayedTimes.length !== 2 || !displayedTimes[0] || !displayedTimes[1]) {
    throw new OfficialMetadataError(
      'CONTEST_TIME_PARSER_DRIFT',
      `${contestId} has ${String(displayedTimes.length)} displayed contest times.`,
    );
  }
  if (
    compareOffsetDateTimes(
      parseOffsetDateTime(displayedTimes[0]),
      parseOffsetDateTime(displayedTimes[1]),
    ) >= 0
  ) {
    throw new OfficialMetadataError('CONTEST_TIME_RANGE_INVALID', contestId);
  }

  const withoutRevision: OfficialTaskListFingerprintSubject = {
    id: contestId,
    number: input.contestNumber,
    title: contestTitle,
    startedAt: displayedTimes[0],
    endedAt: displayedTimes[1],
    officialUrl,
    officialTaskListUrl,
    officialTaskOrder: Object.freeze([...parsedTaskList.officialTaskOrder]),
    tasks: Object.freeze(tasks),
  };
  const fingerprint = officialTaskListMetadataFingerprint(withoutRevision);
  const sourceRevisionId = `source-${contestId}-task-list-${fingerprint}`;
  const contest: OfficialContestMetadata = Object.freeze({
    ...withoutRevision,
    taskOrderSourceRevisionId: sourceRevisionId,
    checkedAt: input.checkedAt,
  });
  const sourceRevision: CorpusSourceRevision = Object.freeze({
    id: sourceRevisionId,
    url: officialTaskListUrl,
    sourceKind: 'official_contest',
    contestId,
    officialTaskId: null,
    checkedAt: input.checkedAt,
    fingerprint,
    termsCheckedAt: input.termsCheckedAt,
  });
  return Object.freeze({ contest, sourceRevision });
};

const contentFingerprint = (input: {
  readonly url: string;
  readonly kind: 'official_problem' | 'official_editorial';
  readonly normalizedContent: unknown;
}): string => canonicalDigest(input);

export const parseOfficialProblemMetadata = (input: {
  readonly contest: OfficialContestMetadata;
  readonly task: OfficialTaskMetadata;
  readonly html: string;
  readonly checkedAt: string;
  readonly termsCheckedAt: string;
}): {
  readonly problem: CorpusProblemMetadata;
  readonly sourceRevision: CorpusSourceRevision;
} => {
  parseOffsetDateTime(input.checkedAt);
  const problemId = stableProblemId(input.contest.id, input.task.label);
  const $ = load(input.html);
  const englishStatement = $('#task-statement span.lang-en');
  if (englishStatement.length !== 1) {
    throw new OfficialMetadataError(
      'TASK_STATEMENT_PARSER_DRIFT',
      `${problemId} has ${String(englishStatement.length)} English statement roots.`,
    );
  }
  const heading = normalizeText($('.h2').first().clone().children().remove().end().text());
  const expectedHeading = `${input.task.label} - ${input.task.title}`;
  if (heading !== expectedHeading) {
    throw new OfficialMetadataError(
      'TASK_HEADING_MISMATCH',
      `${problemId}: expected ${expectedHeading}, received ${heading}.`,
    );
  }
  const constraintSections = englishStatement
    .find('section')
    .filter((_index, section) =>
      /^constraints$/iu.test(normalizeText($(section).find('h3').first().text())),
    );
  if (constraintSections.length !== 1) {
    throw new OfficialMetadataError(
      'TASK_CONSTRAINTS_PARSER_DRIFT',
      `${problemId} has ${String(constraintSections.length)} English constraint sections.`,
    );
  }
  const constraints = constraintSections
    .first()
    .find('li')
    .toArray()
    .map((item) => normalizeFact($(item).text()));
  if (constraints.length === 0 || constraints.some((constraint) => constraint === '')) {
    throw new OfficialMetadataError('TASK_CONSTRAINTS_MISSING', problemId);
  }
  const statementProjection = normalizeOfficialContentFragment(
    englishStatement.html() ?? '',
    input.task.officialUrl,
  );
  if (statementProjection.text === '') {
    throw new OfficialMetadataError('TASK_STATEMENT_PARSER_DRIFT', `${problemId} is empty.`);
  }
  const fingerprint = contentFingerprint({
    url: input.task.officialUrl,
    kind: 'official_problem',
    normalizedContent: statementProjection,
  });
  const sourceRevisionId = `source-${problemId}-problem-${fingerprint}`;
  const sourceRevision: CorpusSourceRevision = Object.freeze({
    id: sourceRevisionId,
    url: input.task.officialUrl,
    sourceKind: 'official_problem',
    contestId: input.contest.id,
    officialTaskId: input.task.officialTaskId,
    checkedAt: input.checkedAt,
    fingerprint,
    termsCheckedAt: input.termsCheckedAt,
  });
  const problem: CorpusProblemMetadata = Object.freeze({
    id: problemId,
    contestId: input.contest.id,
    slotLabel: input.task.label,
    officialTaskId: input.task.officialTaskId,
    officialOrder: input.task.officialOrder,
    title: input.task.title,
    officialUrl: input.task.officialUrl,
    constraintsSummary: [
      `Time limit: ${input.task.timeLimit}`,
      `Memory limit: ${input.task.memoryLimit}`,
      `Constraints: ${constraints.join('; ')}`,
    ].join('; '),
    sourceRevisionIds: Object.freeze([sourceRevisionId]),
    checkedAt: input.checkedAt,
  });
  return Object.freeze({ problem, sourceRevision });
};

export interface OfficialEditorialIndex {
  readonly sourceRevision: CorpusSourceRevision;
  readonly itemUrlsByOfficialTaskId: Readonly<Record<string, readonly string[]>>;
}

export const parseOfficialEditorialIndex = (input: {
  readonly contest: OfficialContestMetadata;
  readonly html: string;
  readonly checkedAt: string;
  readonly termsCheckedAt: string;
}): OfficialEditorialIndex => {
  parseOffsetDateTime(input.checkedAt);
  parseOffsetDateTime(input.termsCheckedAt);
  const $ = load(input.html);
  const itemUrlsByOfficialTaskId: Record<string, readonly string[]> = {};
  const knownTaskIds = new Set(input.contest.tasks.map(({ officialTaskId }) => officialTaskId));
  const seenTaskIds = new Set<string>();
  const contestOrigin = new URL(input.contest.officialUrl).origin;
  $('#main-container h3').each((_index, heading) => {
    const taskLinks = $(heading).find('a.small[href*="/tasks/"]');
    if (taskLinks.length === 0) return;
    if (taskLinks.length !== 1) {
      throw new OfficialMetadataError(
        'EDITORIAL_INDEX_PARSER_DRIFT',
        `${input.contest.id} has a heading with ${String(taskLinks.length)} task links.`,
      );
    }
    const taskLink = taskLinks.first();
    const taskHref = taskLink.attr('href');
    if (!taskHref) {
      throw new OfficialMetadataError(
        'EDITORIAL_INDEX_PARSER_DRIFT',
        `${input.contest.id} has a task link without an href.`,
      );
    }
    const taskUrl = new URL(taskHref, input.contest.officialUrl);
    const taskMatch = new RegExp(
      `^/contests/${input.contest.id}/tasks/(?<taskId>${input.contest.id}_[a-z0-9_]+)$`,
      'u',
    ).exec(taskUrl.pathname);
    const officialTaskId = taskMatch?.groups?.taskId;
    if (taskUrl.origin !== contestOrigin || !officialTaskId || !knownTaskIds.has(officialTaskId)) {
      throw new OfficialMetadataError(
        'EDITORIAL_TASK_LINK_MISMATCH',
        `${input.contest.id}: ${taskUrl.href}`,
      );
    }
    if (seenTaskIds.has(officialTaskId)) {
      throw new OfficialMetadataError(
        'EDITORIAL_INDEX_TASK_SECTION_DUPLICATE',
        `${input.contest.id}:${officialTaskId} has more than one task section.`,
      );
    }
    seenTaskIds.add(officialTaskId);
    const section = $(heading).next('.editorial-section');
    if (section.length !== 1) {
      throw new OfficialMetadataError(
        'EDITORIAL_INDEX_PARSER_DRIFT',
        `${input.contest.id}:${officialTaskId} has no editorial section.`,
      );
    }
    const itemUrls: string[] = [];
    section.find('li').each((_itemIndex, item) => {
      const officialBadge = $(item)
        .find('.label')
        .toArray()
        .some((badge) => new Set(['Official', '公式']).has(normalizeText($(badge).text())));
      if (!officialBadge) return;
      $(item)
        .find('a[href]')
        .each((_linkIndex, link) => {
          const href = $(link).attr('href');
          if (!href) return;
          const linkUrl = new URL(href, input.contest.officialUrl);
          if (
            linkUrl.origin === contestOrigin &&
            new RegExp(`^/contests/${input.contest.id}/editorial/[0-9]+$`, 'u').test(
              linkUrl.pathname,
            )
          ) {
            itemUrls.push(`${linkUrl.origin}${linkUrl.pathname}`);
          }
        });
    });
    // DOM order is the official preference order. Historically the Japanese
    // internal editorial appears before translated duplicates, so retain it.
    itemUrlsByOfficialTaskId[officialTaskId] = Object.freeze([...new Set(itemUrls)]);
  });
  for (const task of input.contest.tasks) {
    if (!seenTaskIds.has(task.officialTaskId)) {
      throw new OfficialMetadataError(
        'EDITORIAL_INDEX_TASK_SECTION_MISSING',
        `${input.contest.id}:${task.officialTaskId} has no task section.`,
      );
    }
  }
  const url = `https://atcoder.jp/contests/${input.contest.id}/editorial`;
  const fingerprint = canonicalDigest({
    url,
    itemUrlsByOfficialTaskId,
  });
  return Object.freeze({
    sourceRevision: Object.freeze({
      id: `source-${input.contest.id}-editorial-index-${fingerprint}`,
      url,
      sourceKind: 'official_editorial',
      contestId: input.contest.id,
      officialTaskId: null,
      checkedAt: input.checkedAt,
      fingerprint,
      termsCheckedAt: input.termsCheckedAt,
    }),
    itemUrlsByOfficialTaskId: Object.freeze(itemUrlsByOfficialTaskId),
  });
};

export const parseOfficialEditorialItemRevision = (input: {
  readonly contestId: string;
  readonly officialTaskId: string;
  readonly url: string;
  readonly html: string;
  readonly checkedAt: string;
  readonly termsCheckedAt: string;
}): CorpusSourceRevision => {
  parseOffsetDateTime(input.checkedAt);
  parseOffsetDateTime(input.termsCheckedAt);
  let parsed: ReturnType<typeof parseOfficialEditorialItem>;
  try {
    parsed = parseOfficialEditorialItem({
      contestId: input.contestId,
      officialEditorialUrl: input.url,
      html: input.html,
      checkedAt: input.checkedAt,
    });
  } catch (error) {
    if (error instanceof OfficialTaskListError) {
      const prefix = `${error.code}: `;
      const detail = error.message.startsWith(prefix)
        ? error.message.slice(prefix.length)
        : error.message;
      throw new OfficialMetadataError(error.code, detail);
    }
    throw error;
  }
  const url = new URL(parsed.officialEditorialUrl);
  if (parsed.officialTaskId !== input.officialTaskId) {
    throw new OfficialMetadataError(
      'EDITORIAL_ITEM_TASK_MISMATCH',
      `${url.pathname} cites ${parsed.officialTaskId}, not ${input.officialTaskId}.`,
    );
  }
  const canonicalUrl = `${url.origin}${url.pathname}`;
  const fingerprint = parsed.sourceFingerprint;
  return Object.freeze({
    id: `source-${input.contestId}-editorial-${parsed.editorialItemId}-${fingerprint}`,
    url: canonicalUrl,
    sourceKind: 'official_editorial',
    contestId: input.contestId,
    officialTaskId: input.officialTaskId,
    checkedAt: input.checkedAt,
    fingerprint,
    termsCheckedAt: input.termsCheckedAt,
  });
};

/** Follow an explicit continuation chosen by the official author without
 * silently mixing translated duplicates or unrelated alternative editorials. */
export const parseOfficialEditorialContinuationUrls = (input: {
  readonly contestId: string;
  readonly url: string;
  readonly html: string;
}): readonly string[] => {
  const currentUrl = new URL(input.url);
  const expectedOrigin = 'https://atcoder.jp';
  if (
    currentUrl.origin !== expectedOrigin ||
    !new RegExp(`^/contests/${input.contestId}/editorial/[0-9]+$`, 'u').test(currentUrl.pathname)
  ) {
    throw new OfficialMetadataError('EDITORIAL_ITEM_URL_INVALID', input.url);
  }
  const $ = load(input.html);
  const continuationText = /(?:後半|続(?:き|く|け)|latter half|next part|continu(?:ed|ation))/iu;
  const urls: string[] = [];
  $('#main-container a[href]').each((_index, anchor) => {
    if (!continuationText.test(normalizeText($(anchor).text()))) return;
    const href = $(anchor).attr('href');
    if (!href) return;
    const candidate = new URL(href, currentUrl);
    if (
      candidate.origin === expectedOrigin &&
      candidate.pathname !== currentUrl.pathname &&
      new RegExp(`^/contests/${input.contestId}/editorial/[0-9]+$`, 'u').test(candidate.pathname)
    ) {
      urls.push(`${candidate.origin}${candidate.pathname}`);
    }
  });
  return Object.freeze([...new Set(urls)]);
};

export const advancedTasks = (
  contest: OfficialContestMetadata,
): readonly (OfficialTaskMetadata & { readonly problemId: string })[] => {
  const dPosition = contest.officialTaskOrder.indexOf('D');
  if (dPosition < 0) throw new OfficialMetadataError('D_TASK_NOT_FOUND', contest.id);
  return Object.freeze(
    contest.tasks.slice(dPosition + 1).map((task) =>
      Object.freeze({
        ...task,
        problemId: stableProblemId(contest.id, task.label),
      }),
    ),
  );
};
