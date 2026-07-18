import { createHash } from 'node:crypto';

export class CanonicalJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanonicalJsonError';
  }
}

const assertWellFormedUnicode = (value: string): void => {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (!Number.isInteger(nextCodeUnit) || nextCodeUnit < 0xdc00 || nextCodeUnit > 0xdfff) {
        throw new CanonicalJsonError('Canonical JSON cannot contain lone UTF-16 surrogates.');
      }
      index += 1;
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new CanonicalJsonError('Canonical JSON cannot contain lone UTF-16 surrogates.');
    }
  }
};

const assertNfc = (value: string): void => {
  assertWellFormedUnicode(value);
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
    const keys = Object.keys(object);
    keys.forEach(assertNfc);
    // RFC 8785/JCS uses ECMAScript's lexicographic UTF-16 code-unit ordering.
    const entries = keys.sort().map((key) => {
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
