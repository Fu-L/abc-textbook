import { createHash } from 'node:crypto';

export class CanonicalJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanonicalJsonError';
  }
}

const assertNfc = (value: string): void => {
  if (value.normalize('NFC') !== value) {
    throw new CanonicalJsonError('All JSON strings and keys must be Unicode NFC.');
  }
};

const serialize = (value: unknown, seen: Set<object>): string => {
  if (value === null) return 'null';
  if (typeof value === 'string') {
    assertNfc(value);
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new CanonicalJsonError('Canonical JSON cannot contain non-finite numbers.');
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) throw new CanonicalJsonError('Canonical JSON cannot contain cycles.');
    seen.add(value);
    const result = `[${value.map((item) => serialize(item, seen)).join(',')}]`;
    seen.delete(value);
    return result;
  }
  if (typeof value === 'object') {
    if (seen.has(value)) throw new CanonicalJsonError('Canonical JSON cannot contain cycles.');
    const prototype = Object.getPrototypeOf(value) as object | null;
    if (prototype !== Object.prototype && prototype !== null) {
      throw new CanonicalJsonError('Canonical JSON only accepts plain objects.');
    }
    seen.add(value);
    const object = value as Record<string, unknown>;
    const entries = Object.keys(object)
      .sort((left, right) => Buffer.from(left).compare(Buffer.from(right)))
      .map((key) => {
        assertNfc(key);
        const item = object[key];
        if (item === undefined) {
          throw new CanonicalJsonError('Canonical JSON cannot contain undefined values.');
        }
        return `${JSON.stringify(key)}:${serialize(item, seen)}`;
      });
    seen.delete(value);
    return `{${entries.join(',')}}`;
  }
  throw new CanonicalJsonError(`Unsupported canonical JSON value: ${typeof value}.`);
};

export const canonicalJson = (value: unknown): string => serialize(value, new Set());

export const canonicalDigest = (value: unknown): string =>
  createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');

export const digestWithoutField = (
  value: Readonly<Record<string, unknown>>,
  field: string,
): string => {
  const copy = Object.fromEntries(Object.entries(value).filter(([key]) => key !== field));
  return canonicalDigest(copy);
};
