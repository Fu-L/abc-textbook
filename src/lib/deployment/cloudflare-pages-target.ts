import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { canonicalJson } from '../domain/canonical-json.js';
import { ReleaseMetadataSchema, type ReleaseMetadata } from '../domain/schema-parts/release.js';
import type { CommitDeploymentRequest, CommitDeploymentTarget } from './git-deployment-adapter.js';

const exec = promisify(execFile);
export const WRANGLER_VERSION = '4.148.0';
export interface PagesDeployment {
  readonly id: string;
  readonly url: string;
  readonly environment: string;
  readonly latest_stage: { readonly name: string; readonly status: string };
  readonly deployment_trigger: { readonly metadata: { readonly commit_hash?: string } };
}
export const successfulProductionDeployment = (deployment: PagesDeployment, commit: string) =>
  deployment.environment === 'production' &&
  deployment.latest_stage.name === 'deploy' &&
  deployment.latest_stage.status === 'success' &&
  deployment.deployment_trigger.metadata.commit_hash === commit;

/** Direct Upload: the exact Git checkout is built in isolation, then submitted
 * to the host. Host success records are the only source of rollback metadata.
 */
export class CloudflarePagesTarget implements CommitDeploymentTarget {
  constructor(
    private readonly config: {
      repositoryRoot: string;
      accountId: string;
      apiToken: string;
      project: string;
      origin: string;
    },
  ) {
    if (
      !/^[a-z0-9-]+$/u.test(config.project) ||
      !/^[a-f0-9]{32}$/u.test(config.accountId) ||
      !config.apiToken ||
      new URL(config.origin).protocol !== 'https:' ||
      new URL(config.origin).pathname !== '/' ||
      new URL(config.origin).search ||
      new URL(config.origin).hash
    )
      throw new Error('PAGES_CONFIGURATION_INVALID');
  }

  private async history(): Promise<PagesDeployment[]> {
    const deployments: PagesDeployment[] = [];
    for (let page = 1; ; page += 1) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/pages/projects/${this.config.project}/deployments?per_page=100&page=${String(page)}`,
        {
          headers: { Authorization: `Bearer ${this.config.apiToken}` },
        },
      );
      if (!response.ok) throw new Error(`PAGES_HISTORY_HTTP_${String(response.status)}`);
      const body = (await response.json()) as { success: boolean; result: PagesDeployment[] };
      if (!body.success || !Array.isArray(body.result)) throw new Error('PAGES_HISTORY_INVALID');
      deployments.push(...body.result);
      if (body.result.length < 100) return deployments;
    }
  }

  async getDeployment(commit: string): Promise<ReleaseMetadata | undefined> {
    for (const deployment of await this.history()) {
      if (!successfulProductionDeployment(deployment, commit)) continue;
      const url = new URL(deployment.url);
      if (url.protocol !== 'https:' || !url.hostname.endsWith('.pages.dev'))
        throw new Error('PAGES_HISTORY_URL_INVALID');
      const response = await fetch(new URL('/release-metadata.json', url));
      if (!response.ok) continue;
      const metadata = ReleaseMetadataSchema.parse(await response.json());
      if (metadata.commit === commit) return metadata;
    }
    return undefined;
  }

  async deployCommit(request: CommitDeploymentRequest) {
    const directory = await mkdtemp(path.join(tmpdir(), 'abc-pages-deploy-'));
    const checkout = path.join(directory, 'repository');
    const run = (program: string, args: string[], cwd = checkout) =>
      exec(program, args, {
        cwd,
        maxBuffer: 64 * 1024 * 1024,
        timeout: 600_000,
        env: {
          ...process.env,
          SITE_URL: this.config.origin,
          BASE_PATH: '/',
          ASTRO_TELEMETRY_DISABLED: '1',
          CLOUDFLARE_ACCOUNT_ID: this.config.accountId,
          CLOUDFLARE_API_TOKEN: this.config.apiToken,
        },
      });
    try {
      await run(
        'git',
        [
          'clone',
          '--quiet',
          '--shared',
          '--no-checkout',
          '--',
          this.config.repositoryRoot,
          checkout,
        ],
        this.config.repositoryRoot,
      );
      await run('git', ['checkout', '--quiet', '--detach', request.release.commit]);
      await run('npm', ['ci']);
      await run('npm', ['run', 'build']);
      await run('npm', ['run', 'link:check:built']);
      await mkdir(path.join(checkout, 'dist'), { recursive: true });
      await writeFile(
        path.join(checkout, 'dist/release-metadata.json'),
        `${JSON.stringify(request.release, null, 2)}\n`,
      );
      const files = (
        await readdir(path.join(checkout, 'dist'), { recursive: true, withFileTypes: true })
      ).filter((file) => file.isFile());
      if (files.length > 20_000) throw new Error('PAGES_FILE_COUNT_LIMIT');
      for (const file of files)
        if ((await readFile(path.join(file.parentPath, file.name))).length > 25 * 1024 * 1024)
          throw new Error('PAGES_FILE_SIZE_LIMIT');
      await run('npm', [
        'exec',
        '--yes',
        `--package=wrangler@${WRANGLER_VERSION}`,
        '--',
        'wrangler',
        'pages',
        'deploy',
        'dist',
        '--project-name',
        this.config.project,
        '--branch',
        'main',
        '--commit-hash',
        request.release.commit,
        '--commit-dirty=false',
      ]);
      const recorded = await this.getDeployment(request.release.commit);
      if (!recorded || canonicalJson(recorded) !== canonicalJson(request.release))
        throw new Error('PAGES_SUCCESS_NOT_CONFIRMED');
      const live = await fetch(new URL('/release-metadata.json', this.config.origin));
      if (
        !live.ok ||
        canonicalJson(ReleaseMetadataSchema.parse(await live.json())) !==
          canonicalJson(request.release)
      )
        throw new Error('PAGES_PRODUCTION_ORIGIN_NOT_CONFIRMED');
      return { deploymentUrl: this.config.origin };
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }
}
