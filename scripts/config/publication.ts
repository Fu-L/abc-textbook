export class UsageError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

/**
 * 公開先がルートでもサブパスでも、Astroへ渡すbaseの形式を統一する。
 */
export function normalizeBasePath(value: string): string {
  const trimmed = value.trim();

  if (trimmed === '' || trimmed === '/') {
    return '/';
  }

  const unsafeUrlSyntax = /[\\%?#]/u;
  const hasEmptySegment =
    trimmed.startsWith('//') || trimmed.endsWith('//') || trimmed.includes('//');
  const pathWithoutBoundarySlashes = trimmed.replace(/^\/|\/$/gu, '');
  const segments = pathWithoutBoundarySlashes.split('/');

  if (
    containsControlCharacter(value) ||
    unsafeUrlSyntax.test(trimmed) ||
    hasEmptySegment ||
    segments.some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new UsageError(`BASE_PATH must be a safe URL pathname: ${value}`);
  }

  return `/${pathWithoutBoundarySlashes}`;
}

function containsControlCharacter(value: string): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint !== undefined && (codePoint <= 31 || codePoint === 127)) {
      return true;
    }
  }

  return false;
}

/**
 * CLI間でportの解釈を揃え、部分的に数値へ変換できる値を拒否する。
 */
export function resolvePort(value: string, variableName: 'LINK_CHECK_PORT' | 'PORT'): number {
  if (!/^[1-9]\d*$/u.test(value)) {
    throw new UsageError(`${variableName} must be an integer from 1 through 65535.`);
  }

  const port = Number(value);
  if (!Number.isSafeInteger(port) || port > 65_535) {
    throw new UsageError(`${variableName} must be an integer from 1 through 65535.`);
  }

  return port;
}

/**
 * canonical URLへ秘密情報やorigin以外の要素を混入させない。
 */
export function resolveSite(value: string): string {
  const trimmed = value.trim();
  let site: URL;

  try {
    site = new URL(trimmed);
  } catch {
    throw new UsageError('SITE_URL must be an absolute HTTP(S) origin.');
  }

  const schemeSeparatorIndex = trimmed.indexOf('://');
  const authorityAndSuffix =
    schemeSeparatorIndex === -1 ? '' : trimmed.slice(schemeSeparatorIndex + 3);
  const suffixIndex = authorityAndSuffix.search(/[/?#]/u);
  const suffix = suffixIndex === -1 ? '' : authorityAndSuffix.slice(suffixIndex);

  if (
    schemeSeparatorIndex === -1 ||
    !['http:', 'https:'].includes(site.protocol) ||
    site.username !== '' ||
    site.password !== '' ||
    site.pathname !== '/' ||
    site.search !== '' ||
    site.hash !== '' ||
    !['', '/'].includes(suffix)
  ) {
    throw new UsageError(
      'SITE_URL must be an absolute HTTP(S) origin without credentials, path, query, or fragment.',
    );
  }

  return `${site.origin}/`;
}
