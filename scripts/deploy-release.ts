import { readFile } from 'node:fs/promises';
import { parseKeyValueArguments } from './corpus/cli-support.js';
import { GitDeploymentAdapter } from '../src/lib/deployment/git-deployment-adapter.js';
import { CloudflarePagesTarget } from '../src/lib/deployment/cloudflare-pages-target.js';

try {
  const args = parseKeyValueArguments(process.argv.slice(2), ['--metadata', '--rollback-to']);
  const metadata = args.get('--metadata');
  const rollback = args.get('--rollback-to');
  if (Boolean(metadata) === Boolean(rollback))
    throw new Error('DEPLOY_ARGUMENTS: select --metadata or --rollback-to');
  const target = new CloudflarePagesTarget({
    repositoryRoot: process.cwd(),
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN ?? '',
    project: process.env.CLOUDFLARE_PAGES_PROJECT ?? '',
    origin: process.env.SITE_URL ?? '',
  });
  const adapter = new GitDeploymentAdapter(process.cwd(), target);
  const result = rollback
    ? await adapter.rollback(rollback)
    : await adapter.deploy(JSON.parse(await readFile(metadata ?? '', 'utf8')) as unknown);
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
