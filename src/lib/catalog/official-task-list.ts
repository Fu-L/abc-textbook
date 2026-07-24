import { load } from 'cheerio';

import { canonicalDigest } from '../domain/canonical-json.js';
import { parseOffsetDateTime } from '../domain/date-time.js';
import { parseAtCoderContestResourceUrl } from '../domain/schema-parts/catalog.js';
import {
  normalizeOfficialContentFragment,
  type NormalizedOfficialContentFragment,
} from './official-content-normalization.js';

export interface OfficialTaskListInput {
  readonly contestId: string;
  readonly officialTaskListUrl: string;
  readonly html: string;
  readonly checkedAt: string;
}

export interface ParsedOfficialTaskList {
  readonly contestId: string;
  readonly officialTaskListUrl: string;
  /** Ordered, lossless mapping from the displayed label to AtCoder's internal task ID. */
  readonly officialTasks: readonly {
    readonly label: string;
    readonly taskId: string;
    readonly officialOrder: number;
  }[];
  readonly officialTaskOrder: readonly string[];
  readonly officialTaskIds: readonly string[];
  readonly advancedLabels: readonly string[];
  readonly checkedAt: string;
  readonly sourceFingerprint: string;
}

export class OfficialTaskListError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'OfficialTaskListError';
  }
}

const normalizeText = (value: string): string =>
  value.normalize('NFC').replace(/\s+/gu, ' ').trim();

const compareCodePoints = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const canonicalAtCoderResourceUrl = (value: string): string => {
  const url = new URL(value);
  const pathname = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
  return `${url.protocol}//${url.host}${pathname}`;
};

export interface OfficialEditorialItemInput {
  readonly contestId: string;
  readonly officialEditorialUrl: string;
  readonly html: string;
  readonly checkedAt: string;
}

export interface ParsedOfficialEditorialItem {
  readonly contestId: string;
  readonly officialEditorialUrl: string;
  readonly editorialItemId: string;
  readonly officialTaskId: string;
  readonly checkedAt: string;
  readonly sourceFingerprint: string;
}

interface NormalizedEditorialContent {
  readonly officialMarkerCount: number;
  readonly taskHeadingCount: number;
  readonly taskBindings: readonly {
    readonly contestId: string;
    readonly taskId: string;
  }[];
  readonly fragments: readonly NormalizedOfficialContentFragment[];
}

const normalizeEditorialContent = (
  html: string,
  officialEditorialUrl: string,
): NormalizedEditorialContent => {
  const $ = load(html);
  const officialMarkerTexts = new Set(['Official', '公式']);
  const officialMarkerCount = $('.label').filter((_index, marker) =>
    officialMarkerTexts.has(normalizeText($(marker).text())),
  ).length;

  const taskBindings = new Map<string, { readonly contestId: string; readonly taskId: string }>();
  const taskHeadings = $('h2').filter((_index, heading) => {
    let hasTaskLink = false;
    $(heading)
      .find('a[href]')
      .each((_anchorIndex, anchor) => {
        const href = $(anchor).attr('href');
        if (!href) return;
        try {
          const parsedTaskUrl = parseAtCoderContestResourceUrl(
            new URL(href, officialEditorialUrl).href,
          );
          if (parsedTaskUrl?.resource === 'task' && parsedTaskUrl.taskId !== null) {
            hasTaskLink = true;
            taskBindings.set(`${parsedTaskUrl.contestId}:${parsedTaskUrl.taskId}`, {
              contestId: parsedTaskUrl.contestId,
              taskId: parsedTaskUrl.taskId,
            });
          }
        } catch {
          // Non-URL anchors are irrelevant to the authoritative task binding.
        }
      });
    return hasTaskLink;
  });

  const taskHeading = taskHeadings.first();
  const fragments = taskHeading
    .nextAll()
    .toArray()
    .filter((element) => {
      const selected = $(element);
      return (
        !selected.is('script, style, form, nav, footer, input, button, noscript') &&
        !selected.hasClass('clearfix')
      );
    })
    .flatMap((element): NormalizedOfficialContentFragment[] => {
      const projection = normalizeOfficialContentFragment($.html(element), officialEditorialUrl);
      return projection.text === '' &&
        projection.links.length === 0 &&
        projection.images.length === 0
        ? []
        : [projection];
    });

  return {
    officialMarkerCount,
    taskHeadingCount: taskHeadings.length,
    taskBindings: [...taskBindings.values()].sort(
      (left, right) =>
        compareCodePoints(left.contestId, right.contestId) ||
        compareCodePoints(left.taskId, right.taskId),
    ),
    fragments,
  };
};

/**
 * Bind an individual official editorial to the task link rendered in its heading.
 * Editorial numeric IDs have no task identity of their own, so callers must not
 * infer this relation from URL naming or from the displayed Problem label.
 */
export const parseOfficialEditorialItem = (
  input: OfficialEditorialItemInput,
): ParsedOfficialEditorialItem => {
  parseOffsetDateTime(input.checkedAt);
  const editorialUrl = parseAtCoderContestResourceUrl(input.officialEditorialUrl);
  if (
    editorialUrl?.contestId !== input.contestId ||
    editorialUrl.resource !== 'editorial_item' ||
    editorialUrl.editorialItemId === null
  ) {
    throw new OfficialTaskListError('EDITORIAL_URL_MISMATCH', input.officialEditorialUrl);
  }

  const normalizedContent = normalizeEditorialContent(input.html, input.officialEditorialUrl);
  if (normalizedContent.officialMarkerCount !== 1) {
    throw new OfficialTaskListError(
      'EDITORIAL_NOT_OFFICIAL',
      `Expected one Official marker, found ${String(normalizedContent.officialMarkerCount)}.`,
    );
  }

  const [taskBinding] = normalizedContent.taskBindings;
  if (
    normalizedContent.taskHeadingCount !== 1 ||
    normalizedContent.taskBindings.length !== 1 ||
    taskBinding?.contestId !== input.contestId
  ) {
    throw new OfficialTaskListError(
      'EDITORIAL_TASK_MAPPING_INVALID',
      `Expected one task-bound heading, found ${String(normalizedContent.taskHeadingCount)} headings and ${String(normalizedContent.taskBindings.length)} task bindings.`,
    );
  }
  const officialTaskId = taskBinding.taskId;
  if (!officialTaskId) {
    throw new OfficialTaskListError(
      'EDITORIAL_TASK_MAPPING_INVALID',
      'The official task ID is missing.',
    );
  }
  if (normalizedContent.fragments.length === 0) {
    throw new OfficialTaskListError(
      'EDITORIAL_CONTENT_MISSING',
      'The normalized official editorial body is empty.',
    );
  }

  return Object.freeze({
    contestId: input.contestId,
    officialEditorialUrl: input.officialEditorialUrl,
    editorialItemId: editorialUrl.editorialItemId,
    officialTaskId,
    checkedAt: input.checkedAt,
    sourceFingerprint: canonicalDigest({
      projectionVersion: 'official-editorial-item-v1',
      contestId: input.contestId,
      officialEditorialUrl: canonicalAtCoderResourceUrl(input.officialEditorialUrl),
      editorialItemId: editorialUrl.editorialItemId,
      official: true,
      officialTaskId,
      fragments: normalizedContent.fragments,
    }),
  });
};

export const parseOfficialTaskList = (input: OfficialTaskListInput): ParsedOfficialTaskList => {
  parseOffsetDateTime(input.checkedAt);
  const url = new URL(input.officialTaskListUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'atcoder.jp') {
    throw new OfficialTaskListError('UNTRUSTED_OFFICIAL_URL', input.officialTaskListUrl);
  }
  const expectedTaskListPath = `/contests/${input.contestId}/tasks`;
  if (url.pathname.replace(/\/$/u, '') !== expectedTaskListPath) {
    throw new OfficialTaskListError('CONTEST_URL_MISMATCH', input.officialTaskListUrl);
  }

  const $ = load(input.html);
  const taskTables = $('table').filter(
    (_index, table) => $(table).find('tbody a[href*="/tasks/"]').length > 0,
  );
  if (taskTables.length !== 1) {
    throw new OfficialTaskListError(
      'PARSER_DRIFT',
      `Expected exactly one official task table, found ${String(taskTables.length)}.`,
    );
  }
  const rows = taskTables.first().find('tbody > tr');
  if (rows.length === 0) {
    throw new OfficialTaskListError('PARSER_DRIFT', 'The official task table has no body rows.');
  }
  const labels: string[] = [];
  const taskIds: string[] = [];
  const seenTaskIds = new Set<string>();
  rows.each((_index, row) => {
    const labelAnchors = $(row).find('td').first().find('a[href]');
    if (labelAnchors.length !== 1) {
      throw new OfficialTaskListError('PARSER_DRIFT', 'A task row has no label link.');
    }
    const labelAnchor = labelAnchors.first();

    const href = labelAnchor.attr('href');
    if (!href) {
      throw new OfficialTaskListError('PARSER_DRIFT', 'A task label link has no href.');
    }
    let taskUrl: URL;
    try {
      taskUrl = new URL(href, url);
    } catch {
      throw new OfficialTaskListError('PARSER_DRIFT', `Unrecognized task link: ${href}`);
    }
    const match = /^\/contests\/(?<contestId>abc[0-9]{3,})\/tasks\/(?<taskId>[a-z0-9_]+)$/u.exec(
      taskUrl.pathname,
    );
    if (!match?.groups) {
      throw new OfficialTaskListError('PARSER_DRIFT', `Unrecognized task link: ${href}`);
    }
    if (
      taskUrl.protocol !== 'https:' ||
      taskUrl.hostname !== 'atcoder.jp' ||
      match.groups.contestId !== input.contestId ||
      !match.groups.taskId?.startsWith(`${input.contestId}_`)
    ) {
      throw new OfficialTaskListError('TASK_LINK_CONTEST_MISMATCH', href);
    }

    const taskId = match.groups.taskId;
    if (!taskId) {
      throw new OfficialTaskListError('PARSER_DRIFT', `Task link has no task ID: ${href}`);
    }
    if (seenTaskIds.has(taskId)) {
      throw new OfficialTaskListError('PARSER_DRIFT', `DUPLICATE_TASK_ID: ${taskId}`);
    }
    seenTaskIds.add(taskId);

    const label = labelAnchor.text().normalize('NFC').trim();
    if (!/^[A-Za-z][A-Za-z0-9+_-]*$/u.test(label)) {
      throw new OfficialTaskListError('INVALID_TASK_LABEL', label);
    }
    if (
      labels.some(
        (existing) => existing.toLocaleLowerCase('en-US') === label.toLocaleLowerCase('en-US'),
      )
    ) {
      throw new OfficialTaskListError('DUPLICATE_TASK_LABEL', label);
    }
    labels.push(label);
    taskIds.push(taskId);
  });

  if (labels.length === 0) {
    throw new OfficialTaskListError('PARSER_DRIFT', 'No task links were found.');
  }
  const dPosition = labels.indexOf('D');
  if (dPosition < 0) {
    throw new OfficialTaskListError('D_TASK_NOT_FOUND', input.contestId);
  }
  const officialTasks = labels.map((label, officialOrder) => {
    const taskId = taskIds[officialOrder];
    if (!taskId) {
      throw new OfficialTaskListError(
        'PARSER_DRIFT',
        `Task label ${label} has no corresponding official task ID.`,
      );
    }
    return Object.freeze({ label, taskId, officialOrder });
  });

  return Object.freeze({
    contestId: input.contestId,
    officialTaskListUrl: input.officialTaskListUrl,
    officialTasks: Object.freeze(officialTasks),
    officialTaskOrder: Object.freeze(labels),
    officialTaskIds: Object.freeze(taskIds),
    advancedLabels: Object.freeze(labels.slice(dPosition + 1)),
    checkedAt: input.checkedAt,
    sourceFingerprint: canonicalDigest({
      projectionVersion: 'official-task-list-v1',
      contestId: input.contestId,
      officialTaskListUrl: canonicalAtCoderResourceUrl(input.officialTaskListUrl),
      officialTasks,
    }),
  });
};
