import { describe, expect, it } from 'vitest';

import { normalizeBasePath, resolveSite, UsageError } from '../../scripts/config/publication.js';

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
});
