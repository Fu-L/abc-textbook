import { describe, expect, it } from 'vitest';

import {
  normalizeBasePath,
  resolvePort,
  resolveSite,
  UsageError,
} from '../../scripts/config/publication.js';

describe('publication environment configuration', () => {
  it('normalizes root and subpath publication targets', () => {
    expect(normalizeBasePath('/')).toBe('/');
    expect(normalizeBasePath('abc-textbook/')).toBe('/abc-textbook');
    expect(resolveSite('https://example.invalid')).toBe('https://example.invalid/');
  });

  it.each([
    'https:example.invalid',
    'https://user@example.invalid/',
    'https://user:secret@example.invalid/',
    'https://example.invalid/path',
    'https://example.invalid/.',
    'https://example.invalid/../',
    'https://example.invalid/?token=secret',
    'https://example.invalid/#secret',
  ])('rejects SITE_URL values that are not pure origins: %s', (value) => {
    expect(() => resolveSite(value)).toThrow(UsageError);
  });

  it.each([
    '/abc?preview=true',
    '/abc#section',
    '/abc//problems',
    '/abc/./problems',
    '/abc/../problems',
    '/abc/%2e%2e/problems',
    '/abc/%2Fproblems',
    '/abc/%5cproblems',
    '/abc\\problems',
    '/abc\u0000problems',
  ])('rejects unsafe BASE_PATH values: %s', (value) => {
    expect(() => normalizeBasePath(value)).toThrow(UsageError);
  });

  it('validates ports without accepting partial numbers', () => {
    expect(resolvePort('4321', 'PORT')).toBe(4321);
    expect(() => resolvePort('4321abc', 'PORT')).toThrow(UsageError);
    expect(() => resolvePort('0', 'LINK_CHECK_PORT')).toThrow(UsageError);
    expect(() => resolvePort('65536', 'LINK_CHECK_PORT')).toThrow(UsageError);
  });
});
