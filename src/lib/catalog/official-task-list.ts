import { createHash } from 'node:crypto';

import { load } from 'cheerio';

import { parseOffsetDateTime } from '../domain/date-time.js';

export interface OfficialTaskListInput {
  readonly contestId: string;
  readonly officialTaskListUrl: string;
  readonly html: string;
  readonly checkedAt: string;
}

export interface ParsedOfficialTaskList {
  readonly contestId: string;
  readonly officialTaskListUrl: string;
  readonly officialTaskOrder: readonly string[];
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
  const labels: string[] = [];
  $('tr').each((_index, row) => {
    const labelAnchor = $(row).find('td').first().find('a[href]').first();
    if (labelAnchor.length === 0) return;

    const href = labelAnchor.attr('href');
    if (!href) return;
    const taskUrl = new URL(href, url);
    const match = /^\/contests\/(?<contestId>abc[0-9]{3,})\/tasks\/(?<taskId>[a-z0-9_]+)$/u.exec(
      taskUrl.pathname,
    );
    if (!match?.groups) return;
    if (
      taskUrl.hostname !== 'atcoder.jp' ||
      match.groups.contestId !== input.contestId ||
      !match.groups.taskId?.startsWith(`${input.contestId}_`)
    ) {
      throw new OfficialTaskListError('TASK_LINK_CONTEST_MISMATCH', href);
    }

    const label = labelAnchor.text().normalize('NFC').trim();
    if (!/^[A-Za-z][A-Za-z0-9+_-]*$/u.test(label)) {
      throw new OfficialTaskListError('INVALID_TASK_LABEL', label);
    }
    if (labels.includes(label)) {
      throw new OfficialTaskListError('DUPLICATE_TASK_LABEL', label);
    }
    labels.push(label);
  });

  if (labels.length === 0) {
    throw new OfficialTaskListError('PARSER_DRIFT', 'No task links were found.');
  }
  const dPosition = labels.indexOf('D');
  if (dPosition < 0) {
    throw new OfficialTaskListError('D_TASK_NOT_FOUND', input.contestId);
  }

  return Object.freeze({
    contestId: input.contestId,
    officialTaskListUrl: input.officialTaskListUrl,
    officialTaskOrder: Object.freeze(labels),
    advancedLabels: Object.freeze(labels.slice(dPosition + 1)),
    checkedAt: input.checkedAt,
    sourceFingerprint: createHash('sha256').update(input.html, 'utf8').digest('hex'),
  });
};
