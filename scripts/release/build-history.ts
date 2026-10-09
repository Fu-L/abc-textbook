import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import {
  buildAdministratorHoldSummary,
  buildReleaseHistory,
  type PublicReleaseHistoryEntry,
  PublicReleaseHistorySchema,
} from '../../src/lib/catalog/build-release-history.js';
import {
  PublicationUpdateSchema,
  ReleaseMetadataSchema,
} from '../../src/lib/domain/schema-parts/release.js';
import { parseKeyValueArguments } from '../corpus/cli-support.js';
import { SafePathSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';
import { canonicalJson } from '../../src/lib/domain/canonical-json.js';
import type { BuildPublication } from '../config/publication.js';
import { CatalogReleaseSchema } from '../../src/lib/domain/schema-parts/catalog.js';

/** Build identity is shared by the catalog and metadata; it is not host success. */
export function createBuildReleaseMetadata(catalogRelease: unknown, publication: BuildPublication) {
  if (!publication.commit || !publication.runUrl) return null;
  const release = CatalogReleaseSchema.parse(catalogRelease);
  if (release.version !== publication.version || release.publicationStatus !== 'prepared')
    throw new Error('PUBLICATION_METADATA_CATALOG_MISMATCH');
  return ReleaseMetadataSchema.parse({
    schemaVersion: '1.0.0',
    version: release.version,
    cutoffAt: release.cutoffAt,
    commit: publication.commit,
    validationResultsUrl: publication.runUrl,
    changeSummary: {
      updateIds: release.updateIds,
      addedProblemIds: release.addedProblemIds,
      changedProblemIds: release.changedProblemIds,
      withdrawnProblemIds: release.withdrawnProblemIds,
      taxonomyChanges: release.taxonomyChanges.map(({ summary }) => summary),
    },
  });
}

/** Replace stale copied metadata after build; local output has no such file. */
export async function writeBuildReleaseMetadata(
  directory: URL,
  publication: BuildPublication | null,
) {
  const target = new URL('release-metadata.json', directory);
  if (!publication) {
    await rm(target, { force: true });
    return;
  }
  const catalog = JSON.parse(await readFile(new URL('data/catalog.json', directory), 'utf8')) as {
    release: unknown;
  };
  const metadata = createBuildReleaseMetadata(catalog.release, publication);
  await writeFile(target, `${JSON.stringify(metadata, null, 2)}\n`);
}

const exec = promisify(execFile);
/** The input is the host's already-published metadata history. Each catalog is
 * read at its own exact commit, so later canonical changes cannot rewrite it.
 */
export const loadGitReleaseHistory = async (input: {
  readonly metadata: readonly unknown[];
  readonly repositoryRoot?: string;
  readonly catalogPath?: string;
  readonly previous?: readonly PublicReleaseHistoryEntry[];
  readonly confirmHostPublication?: (commit: string) => Promise<unknown>;
}) => {
  const root = input.repositoryRoot ?? process.cwd();
  const catalogPath = input.catalogPath ?? 'docs/verification/releases/catalog.json';
  const records = [];
  for (const candidate of input.metadata) {
    const metadata = ReleaseMetadataSchema.parse(candidate);
    try {
      const { stdout: commit } = await exec(
        'git',
        ['rev-parse', '--verify', `${metadata.commit}^{commit}`],
        { cwd: root },
      );
      if (commit.trim() !== metadata.commit) throw new Error('Commit ID mismatch.');
    } catch (error) {
      throw new Error('RELEASE_HISTORY_UNKNOWN_COMMIT', { cause: error });
    }
    const { stdout } = await exec('git', ['show', `${metadata.commit}:${catalogPath}`], {
      cwd: root,
      maxBuffer: 128 * 1024 * 1024,
    });
    const catalog = CatalogSchema.parse(JSON.parse(stdout) as unknown);
    if (catalog.release.publicationStatus === 'prepared' && input.confirmHostPublication) {
      const confirmed = await input.confirmHostPublication(metadata.commit);
      if (
        !confirmed ||
        canonicalJson(ReleaseMetadataSchema.parse(confirmed)) !== canonicalJson(metadata)
      )
        throw new Error('RELEASE_HISTORY_HOST_NOT_CONFIRMED');
      // Host success changes the history projection, never the original Git catalog.
      catalog.release.publicationStatus = 'published';
    }
    records.push({ metadata, catalog });
  }
  return buildReleaseHistory(records, input.previous);
};

const writeProjection = async (file: string, value: unknown) => {
  const bytes = `${JSON.stringify(value, null, 2)}\n`;
  try {
    if ((await readFile(file, 'utf8')) === bytes) return;
  } catch {
    /* First projection. */
  }
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${String(process.pid)}.tmp`;
  try {
    await writeFile(temporary, bytes, { flag: 'wx' });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseKeyValueArguments(process.argv.slice(2), [
      '--releases',
      '--updates',
      '--public-output',
      '--hold-output',
      '--catalog',
      '--host',
    ]);
    const releasesPath = args.get('--releases');
    const updatesPath = args.get('--updates');
    const publicOutput = args.get('--public-output');
    const holdOutput = args.get('--hold-output');
    if (
      !releasesPath ||
      !updatesPath ||
      !publicOutput ||
      !holdOutput ||
      !holdOutput.startsWith('staging/') ||
      publicOutput.startsWith('staging/') ||
      publicOutput === holdOutput
    )
      throw new Error(
        'Usage: release:history --releases HOST_HISTORY.json --updates UPDATE_LIST.json --public-output PATH --hold-output staging/PATH [--catalog PATH]',
      );
    SafePathSchema.parse(publicOutput);
    SafePathSchema.parse(holdOutput);
    const parse = async (file: string): Promise<unknown> =>
      JSON.parse(await readFile(file, 'utf8')) as unknown;
    const metadata = await parse(releasesPath);
    const updateValues = await parse(updatesPath);
    if (!Array.isArray(metadata) || !Array.isArray(updateValues))
      throw new Error('History and update inputs must be arrays.');
    let previous: readonly PublicReleaseHistoryEntry[] = [];
    try {
      const existing: unknown = JSON.parse(await readFile(publicOutput, 'utf8'));
      previous = PublicReleaseHistorySchema.parse(existing);
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
    const catalogPath = args.get('--catalog');
    const host = args.get('--host');
    if (host && host !== 'cloudflare-pages') throw new Error('RELEASE_HISTORY_HOST_INVALID');
    const { CloudflarePagesTarget } = host
      ? await import('../../src/lib/deployment/cloudflare-pages-target.js')
      : { CloudflarePagesTarget: undefined };
    const target = CloudflarePagesTarget
      ? new CloudflarePagesTarget({
          repositoryRoot: process.cwd(),
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
          apiToken: process.env.CLOUDFLARE_API_TOKEN ?? '',
          project: process.env.CLOUDFLARE_PAGES_PROJECT ?? '',
          origin: process.env.SITE_URL ?? '',
        })
      : undefined;
    const history = await loadGitReleaseHistory({
      metadata,
      previous,
      ...(catalogPath ? { catalogPath } : {}),
      ...(target
        ? { confirmHostPublication: (commit: string) => target.getDeployment(commit) }
        : {}),
    });
    const holds = buildAdministratorHoldSummary(
      updateValues.map((value: unknown) => PublicationUpdateSchema.parse(value)),
    );
    // Validate both inputs before writing either projection. Separate files,
    // not a multi-directory publication transaction.
    await writeProjection(publicOutput, history);
    await writeProjection(holdOutput, holds);
    console.log(
      JSON.stringify({
        command: 'release:history',
        releaseCount: history.length,
        holdCount: holds.length,
      }),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
