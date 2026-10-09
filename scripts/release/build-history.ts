import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, stat, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { z } from 'zod';
import { resolveBuildPublication } from '../config/publication.js';
import { isHistoryOnlyPublication, type VerificationChange } from '../verify/runner.js';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import {
  appendReleaseHistory,
  buildReleaseHistory,
  type PublicReleaseHistoryEntry,
  PublicReleaseHistorySchema,
} from '../../src/lib/catalog/build-release-history.js';
import { ReleaseMetadataSchema } from '../../src/lib/domain/schema-parts/release.js';
import { parseKeyValueArguments } from '../corpus/cli-support.js';
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
    if (metadata.version.includes('-r')) throw Error('RELEASE_HISTORY_ARTIFACT_REQUIRED');
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

export interface ConfirmedPublication {
  readonly version: string;
  readonly commit: string;
  readonly runUrl: string;
  readonly publishedAt: string;
  readonly artifactName: string | null;
  readonly historyOnly: boolean;
}
export interface DeliveredRelease {
  readonly catalog: unknown;
  readonly metadata: unknown;
}

const gitCommit = async (commit: string, root: string) => {
  try {
    const result = await exec('git', ['rev-parse', '--verify', `${commit}^{commit}`], {
      cwd: root,
    });
    if (result.stdout.trim() !== commit) throw Error('Commit mismatch');
  } catch (error) {
    throw new Error('RELEASE_HISTORY_UNKNOWN_COMMIT', { cause: error });
  }
};

/** API responses are standard Actions and github-pages deployment records, never receipts. */
export async function confirmPagesPublication(input: {
  repository: string;
  runId: string;
  repositoryRoot?: string;
  api: (endpoint: string) => Promise<unknown>;
  readDeploymentLog: (jobId: number) => Promise<string>;
}): Promise<ConfirmedPublication> {
  if (!/^[\w.-]+\/[\w.-]+$/u.test(input.repository) || !/^[1-9]\d*$/u.test(input.runId))
    throw Error('RELEASE_HISTORY_HOST_NOT_CONFIRMED');
  const prefix = `repos/${input.repository}`;
  const run = z
    .object({
      id: z.number(),
      head_sha: z.string(),
      head_branch: z.string(),
      event: z.string(),
      path: z.string(),
      status: z.string(),
      conclusion: z.string().nullable(),
      html_url: z.string(),
      created_at: z.string(),
    })
    .parse(await input.api(`${prefix}/actions/runs/${input.runId}`));
  if (
    String(run.id) !== input.runId ||
    run.head_branch !== 'main' ||
    run.event !== 'push' ||
    run.path !== '.github/workflows/ci.yml' ||
    run.status !== 'completed' ||
    run.conclusion !== 'success' ||
    run.html_url !== `https://github.com/${input.repository}/actions/runs/${input.runId}`
  )
    throw Error('RELEASE_HISTORY_HOST_NOT_CONFIRMED');
  const publication = resolveBuildPublication({
    head: run.head_sha,
    historyVersions: [],
    env: {
      GITHUB_ACTIONS: 'true',
      GITHUB_SHA: run.head_sha,
      GITHUB_RUN_ID: input.runId,
      GITHUB_REPOSITORY: input.repository,
      ABC_TEXTBOOK_RUN_CREATED_AT: run.created_at,
    },
  });
  const { jobs } = z
    .object({
      jobs: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          head_sha: z.string(),
          status: z.string(),
          conclusion: z.string().nullable(),
        }),
      ),
    })
    .parse(await input.api(`${prefix}/actions/runs/${input.runId}/jobs?filter=all&per_page=100`));
  const successfulJobs = jobs.filter(
    (job) =>
      job.head_sha === run.head_sha && job.status === 'completed' && job.conclusion === 'success',
  );
  if (!successfulJobs.some((job) => job.name === 'Verify (release baseline)'))
    throw Error('RELEASE_HISTORY_HOST_NOT_CONFIRMED');
  const deployments = z
    .array(z.object({ id: z.number(), sha: z.string() }))
    .parse(await input.api(`${prefix}/deployments?environment=github-pages&per_page=100`));
  const successes = [];
  for (const deployment of deployments) {
    const statuses = z
      .array(
        z.object({
          state: z.string(),
          created_at: z.string(),
          log_url: z.string().nullable().optional(),
          target_url: z.string().nullable().optional(),
        }),
      )
      .parse(
        await input.api(`${prefix}/deployments/${String(deployment.id)}/statuses?per_page=100`),
      );
    for (const status of statuses.filter((status) => status.state === 'success')) {
      const job = successfulJobs.find(
        (job) =>
          job.name === 'Deploy GitHub Pages' &&
          [status.log_url, status.target_url].includes(`${run.html_url}/job/${String(job.id)}`),
      );
      successes.push({ ...status, sha: deployment.sha, job });
    }
  }
  successes.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const deployed = successes.find((status) => status.sha === run.head_sha && status.job);
  if (!deployed?.job || !Number.isFinite(Date.parse(deployed.created_at)))
    throw Error('RELEASE_HISTORY_HOST_NOT_CONFIRMED');
  const baseline = successes.find(
    (status) =>
      Date.parse(status.created_at) < Date.parse(deployed.created_at) &&
      ![status.log_url, status.target_url].some((url) => url?.startsWith(`${run.html_url}/`)),
  );
  let changes: VerificationChange[] | null = null;
  if (baseline && /^[a-f0-9]{40}$/u.test(baseline.sha)) {
    try {
      const { stdout } = await exec(
        'git',
        ['diff', '--name-status', '--no-renames', '-z', baseline.sha, run.head_sha],
        { cwd: input.repositoryRoot ?? process.cwd() },
      );
      const fields = stdout.split('\0');
      if (fields.pop() === '' && fields.length % 2 === 0)
        changes = Array.from({ length: fields.length / 2 }, (_, i) => ({
          status: fields[i * 2] ?? '',
          file: fields[i * 2 + 1] ?? '',
        }));
    } catch {
      /* Unknown scope is an ordinary publication. */
    }
  }
  let artifactName: string | null = null;
  try {
    const log = await input.readDeploymentLog(deployed.job.id);
    const matches = [
      ...log.matchAll(/artifact_name: (github-pages-[a-f0-9]{40}-[1-9]\d*-[1-9]\d*)/gu),
    ];
    const name = matches.at(-1)?.[1];
    if (name?.startsWith(`github-pages-${run.head_sha}-${input.runId}-`)) artifactName = name;
  } catch {
    /* Logs may have expired; the matching public JSON remains a fallback. */
  }
  return {
    version: publication.version,
    commit: run.head_sha,
    runUrl: run.html_url,
    publishedAt: deployed.created_at,
    artifactName,
    historyOnly: isHistoryOnlyPublication(changes),
  };
}

/** Append one confirmed run; null input acquisition defers only its history entry. */
export async function loadPublishedReleaseHistory(input: {
  runId: string;
  previous: readonly PublicReleaseHistoryEntry[];
  repositoryRoot?: string;
  confirmPublication: (runId: string) => Promise<ConfirmedPublication>;
  readArtifact: (publication: ConfirmedPublication) => Promise<DeliveredRelease | null>;
  readPublic: () => Promise<DeliveredRelease | null>;
}) {
  PublicReleaseHistorySchema.parse(input.previous);
  const publication = await input.confirmPublication(input.runId);
  await gitCommit(publication.commit, input.repositoryRoot ?? process.cwd());
  if (publication.historyOnly) return { status: 'history-only', history: input.previous };
  let source = 'artifact';
  let pair = await input.readArtifact(publication);
  if (!pair) {
    source = 'public';
    pair = await input.readPublic();
  }
  if (!pair) return { status: 'deferred', history: input.previous };
  const metadata = ReleaseMetadataSchema.parse(pair.metadata);
  if (
    metadata.version !== publication.version ||
    metadata.commit !== publication.commit ||
    metadata.validationResultsUrl !== publication.runUrl
  )
    throw Error('RELEASE_HISTORY_IDENTITY_MISMATCH');
  const history = appendReleaseHistory(pair, input.previous);
  const last = input.previous.at(-1);
  if (history !== input.previous && last?.version.includes('-r')) {
    const previousRunId = z.string().parse(last.version.split('-r')[1]);
    const previousPublication = await input.confirmPublication(previousRunId);
    if (
      previousPublication.commit !== last.commit ||
      previousPublication.runUrl !== last.validationResultsUrl ||
      Date.parse(previousPublication.publishedAt) >= Date.parse(publication.publishedAt)
    )
      throw Error('RELEASE_HISTORY_PUBLICATION_ORDER');
  }
  return { status: history === input.previous ? 'unchanged' : 'appended', source, history };
}

/** Download one selected standard artifact into disposable storage; never regenerate it. */
export async function readPagesArtifact(
  repository: string,
  runId: string,
  publication: ConfirmedPublication,
  savedDirectory?: string,
): Promise<DeliveredRelease | null> {
  if (!publication.artifactName && !savedDirectory) return null;
  const temporary = savedDirectory ?? (await mkdtemp(path.join(os.tmpdir(), 'abc-pages-history-')));
  try {
    if (!savedDirectory && publication.artifactName)
      try {
        await exec(
          'gh',
          [
            'run',
            'download',
            runId,
            '--repo',
            repository,
            '--name',
            publication.artifactName,
            '--dir',
            temporary,
          ],
          { maxBuffer: 1024 * 1024 },
        );
      } catch {
        return null;
      }
    const archive = path.join(temporary, 'artifact.tar');
    // Acquisition failure permits fallback; malformed/acquired JSON must be rejected.
    try {
      await stat(archive);
    } catch {
      return null;
    }
    const read = async (member: string): Promise<unknown> => {
      const { stdout } = await exec('tar', ['-xOf', archive, member], {
        maxBuffer: 128 * 1024 * 1024,
      });
      return JSON.parse(stdout) as unknown;
    };
    return {
      catalog: await read('./data/catalog.json'),
      metadata: await read('./release-metadata.json'),
    };
  } finally {
    if (!savedDirectory) await rm(temporary, { recursive: true, force: true });
  }
}

export async function readPublicRelease(): Promise<DeliveredRelease | null> {
  const root = 'https://fu-l.github.io/abc-textbook/';
  const responses = await Promise.all(
    ['data/catalog.json', 'release-metadata.json'].map(async (file) => {
      try {
        return await fetch(root + file, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
      } catch {
        return null;
      }
    }),
  );
  const [catalogResponse, metadataResponse] = responses;
  if (!catalogResponse?.ok || !metadataResponse?.ok) return null;
  return {
    catalog: (await catalogResponse.json()) as unknown,
    metadata: (await metadataResponse.json()) as unknown,
  };
}

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
      '--run',
      '--public-output',
      '--artifact-dir',
    ]);
    const runId = args.get('--run'),
      publicOutput = args.get('--public-output');
    if (!runId || !/^[1-9]\d*$/u.test(runId) || !publicOutput)
      throw Error(
        'Usage: release:history --run SUCCESSFUL_MAIN_RUN_ID --public-output EXISTING_INDEX.json [--artifact-dir DOWNLOADED_PAGES_ARTIFACT_DIR]',
      );
    // Require the existing index; never rebuild or silently replace it with an empty array.
    const previous = PublicReleaseHistorySchema.parse(
      JSON.parse(await readFile(publicOutput, 'utf8')) as unknown,
    );
    const repository = 'Fu-L/abc-textbook';
    const result = await loadPublishedReleaseHistory({
      runId,
      previous,
      confirmPublication: (runId) =>
        confirmPagesPublication({
          repository,
          runId,
          api: async (endpoint) => {
            const { stdout } = await exec('gh', ['api', '--paginate', '--slurp', endpoint], {
              maxBuffer: 16 * 1024 * 1024,
            });
            const pages = JSON.parse(stdout) as unknown[];
            if (endpoint.includes('/jobs?'))
              return {
                jobs: pages.flatMap(
                  (page) => z.object({ jobs: z.array(z.unknown()) }).parse(page).jobs,
                ),
              };
            if (endpoint.includes('/deployments'))
              return pages.flatMap((page) => z.array(z.unknown()).parse(page));
            return pages[0];
          },
          readDeploymentLog: async (jobId) =>
            (
              await exec(
                'gh',
                ['run', 'view', runId, '--repo', repository, '--job', String(jobId), '--log'],
                { maxBuffer: 16 * 1024 * 1024 },
              )
            ).stdout,
        }),
      readArtifact: (publication) =>
        readPagesArtifact(repository, runId, publication, args.get('--artifact-dir')),
      readPublic: readPublicRelease,
    });
    if (result.status === 'appended') await writeProjection(publicOutput, result.history);
    console.log(
      JSON.stringify({
        command: 'release:history',
        status: result.status,
        ...('source' in result ? { source: result.source } : {}),
        releaseCount: result.history.length,
      }),
    );
    if (result.status === 'deferred') process.exitCode = 2;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
