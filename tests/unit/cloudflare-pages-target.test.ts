import { describe, expect, it, vi } from 'vitest';
import {
  CloudflarePagesTarget,
  successfulProductionDeployment,
} from '../../src/lib/deployment/cloudflare-pages-target.js';

describe('real Pages publication history', () => {
  it('requires production deploy success at the exact SHA', () => {
    const entry = {
      id: 'host-id',
      url: 'https://deployment.project.pages.dev',
      environment: 'production',
      latest_stage: { name: 'deploy', status: 'success' },
      deployment_trigger: { metadata: { commit_hash: 'a'.repeat(40) } },
    };
    expect(successfulProductionDeployment(entry, 'a'.repeat(40))).toBe(true);
    for (const changed of [
      { ...entry, environment: 'preview' },
      { ...entry, latest_stage: { name: 'deploy', status: 'failure' } },
      { ...entry, latest_stage: { name: 'build', status: 'success' } },
    ])
      expect(successfulProductionDeployment(changed, 'a'.repeat(40))).toBe(false);
    expect(successfulProductionDeployment(entry, 'b'.repeat(40))).toBe(false);
  });
  it('does not accept an unpublished rollback target', async () => {
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true, result: [] })));
    try {
      const target = new CloudflarePagesTarget({
        repositoryRoot: '.',
        accountId: 'a'.repeat(32),
        apiToken: 'fixture-not-a-secret',
        project: 'fixture',
        origin: 'https://fixture.pages.dev',
      });
      expect(await target.getDeployment('a'.repeat(40))).toBeUndefined();
    } finally {
      fetch.mockRestore();
    }
  });
});
