const RFC_3339_WITH_OFFSET =
  /^(?<date>\d{4}-\d{2}-\d{2})T(?<time>\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?)(?<offset>Z|[+-]\d{2}:\d{2})$/u;

export interface OffsetDateTime {
  readonly original: string;
  readonly offset: string;
  readonly epochMilliseconds: number;
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
  const epochMilliseconds = Date.parse(value);
  if (!Number.isFinite(epochMilliseconds)) throw new OffsetDateTimeError(value);

  const roundTrip = new Date(epochMilliseconds);
  if (Number.isNaN(roundTrip.getTime())) throw new OffsetDateTimeError(value);

  return Object.freeze({
    original: value,
    offset: match.groups.offset ?? 'Z',
    epochMilliseconds,
  });
};

export const compareOffsetDateTimes = (left: OffsetDateTime, right: OffsetDateTime): number =>
  Math.sign(left.epochMilliseconds - right.epochMilliseconds);

export const isOffsetDateTime = (value: string): boolean => {
  try {
    parseOffsetDateTime(value);
    return true;
  } catch {
    return false;
  }
};
