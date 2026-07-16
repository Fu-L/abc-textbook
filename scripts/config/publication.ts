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

  const normalized = `/${trimmed.replace(/^\/+|\/+$/gu, '')}`;
  if (normalized.includes('..') || normalized.includes('\\')) {
    throw new UsageError(`BASE_PATH must be a safe URL path: ${value}`);
  }

  return normalized;
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
