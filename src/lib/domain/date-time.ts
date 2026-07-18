const RFC_3339_WITH_OFFSET =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})(?:\.(?<fraction>\d{1,9}))?(?<offset>Z|(?<offsetSign>[+-])(?<offsetHour>\d{2}):(?<offsetMinute>\d{2}))$/u;

export interface OffsetDateTime {
  readonly original: string;
  readonly offset: string;
  readonly epochMilliseconds: number;
  /** Exact UTC instant used for ordering; the schema permits up to 9 digits. */
  readonly epochNanoseconds: bigint;
}

export class OffsetDateTimeError extends Error {
  constructor(value: string) {
    super(`Invalid offset-preserving RFC 3339 date-time: ${value}`);
    this.name = 'OffsetDateTimeError';
  }
}

export const parseOffsetDateTime = (value: string): OffsetDateTime => {
  const match = RFC_3339_WITH_OFFSET.exec(value);
  if (!match?.groups) throw new OffsetDateTimeError(value);
  const component = (name: string): number => Number(match.groups?.[name]);
  const year = component('year');
  const month = component('month');
  const day = component('day');
  const hour = component('hour');
  const minute = component('minute');
  const second = component('second');
  const offsetHour = match.groups.offset === 'Z' ? 0 : component('offsetHour');
  const offsetMinute = match.groups.offset === 'Z' ? 0 : component('offsetMinute');
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > (daysInMonth[month - 1] ?? 0) ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    offsetHour > 23 ||
    offsetMinute > 59
  ) {
    throw new OffsetDateTimeError(value);
  }
  const fraction = match.groups.fraction ?? '';
  const fractionNanoseconds = BigInt(fraction.padEnd(9, '0') || '0');
  const wholeSecondValue = fraction ? value.replace(`.${fraction}`, '') : value;
  const wholeSecondEpochMilliseconds = Date.parse(wholeSecondValue);
  if (!Number.isFinite(wholeSecondEpochMilliseconds)) throw new OffsetDateTimeError(value);
  const epochMilliseconds = wholeSecondEpochMilliseconds + Number(fractionNanoseconds / 1_000_000n);
  const epochNanoseconds = BigInt(wholeSecondEpochMilliseconds) * 1_000_000n + fractionNanoseconds;

  const roundTrip = new Date(epochMilliseconds);
  if (Number.isNaN(roundTrip.getTime())) throw new OffsetDateTimeError(value);

  return Object.freeze({
    original: value,
    offset: match.groups.offset ?? 'Z',
    epochMilliseconds,
    epochNanoseconds,
  });
};

export const compareOffsetDateTimes = (left: OffsetDateTime, right: OffsetDateTime): number => {
  if (left.epochNanoseconds < right.epochNanoseconds) return -1;
  if (left.epochNanoseconds > right.epochNanoseconds) return 1;
  return 0;
};

export const isOffsetDateTime = (value: string): boolean => {
  try {
    parseOffsetDateTime(value);
    return true;
  } catch {
    return false;
  }
};
