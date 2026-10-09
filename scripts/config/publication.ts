export class UsageError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

export interface BuildPublication {
  readonly version: string;
  readonly runUrl?: string;
  readonly commit?: string;
  readonly createdAt?: string;
}

/** A rerun keeps its original UTC date and run ID, even across midnight. */
export function resolveBuildPublication(input: {
  readonly env: NodeJS.ProcessEnv;
  readonly head: string;
  readonly historyVersions: readonly string[];
  readonly baselineVersion?: string;
}): BuildPublication {
  const { env, head } = input;
  if (env.GITHUB_ACTIONS !== 'true') {
    const version = input.historyVersions.at(-1) ?? input.baselineVersion;
    if (!version || !/^\d{4}\.\d{2}\.\d{2}(?:-r[1-9]\d*)?$/u.test(version))
      throw new UsageError(
        'PUBLICATION_BASELINE_MISSING: release history or baseline catalog version is required.',
      );
    return { version };
  }
  const createdAt = env.ABC_TEXTBOOK_RUN_CREATED_AT;
  if (
    !env.GITHUB_REPOSITORY ||
    !/^[\w.-]+\/[\w.-]+$/u.test(env.GITHUB_REPOSITORY) ||
    !env.GITHUB_RUN_ID ||
    !/^[1-9]\d*$/u.test(env.GITHUB_RUN_ID) ||
    !env.GITHUB_SHA ||
    !/^[a-f0-9]{40}$/u.test(env.GITHUB_SHA) ||
    env.GITHUB_SHA !== head ||
    !createdAt ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u.test(createdAt) ||
    !Number.isFinite(Date.parse(createdAt)) ||
    new Date(createdAt).toISOString() !== createdAt.replace('Z', '.000Z')
  )
    throw new UsageError(
      'PUBLICATION_ACTIONS_INPUT_INVALID: repository, run ID, run created_at and exact checkout SHA are required.',
    );
  return {
    version: `${createdAt.slice(0, 10).replaceAll('-', '.')}-r${env.GITHUB_RUN_ID}`,
    createdAt,
    commit: env.GITHUB_SHA,
    runUrl: `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`,
  };
}

/**
 * 公開先がルートでもサブパスでも、Astroへ渡すbaseの形式を統一する。
 */
export function normalizeBasePath(value: string): string {
  if (value === '' || value === '/') {
    return '/';
  }

  const unsafeUrlSyntax = /[\\%?#]/u;
  const hasEmptySegment = value.startsWith('//') || value.endsWith('//') || value.includes('//');
  const pathWithoutBoundarySlashes = value.replace(/^\/|\/$/gu, '');
  const segments = pathWithoutBoundarySlashes.split('/');
  // Astro/Starlightのbaseで確実に扱えるASCII URL unreserved文字だけを許可する。
  const safeSegment = /^[A-Za-z0-9._~-]+$/u;

  if (
    containsControlCharacter(value) ||
    unsafeUrlSyntax.test(value) ||
    hasEmptySegment ||
    segments.some(
      (segment) =>
        segment === '' || segment === '.' || segment === '..' || !safeSegment.test(segment),
    )
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
