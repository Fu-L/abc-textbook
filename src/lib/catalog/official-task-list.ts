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

  const $ = load(input.html);
  const labels: string[] = [];
  $('a[href*="/tasks/"]').each((_index, element) => {
    const label = $(element).text().normalize('NFC').trim();
    if (label.length > 0 && !labels.includes(label)) labels.push(label);
    else if (label.length > 0) {
      throw new OfficialTaskListError('DUPLICATE_TASK_LABEL', label);
    }
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
