import { describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parse as parseYaml } from 'yaml';

import {
  normalizeBasePath,
  resolvePort,
  resolveSite,
  resolveBuildPublication,
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
    '/abc text',
    '/教材',
    '/abc"x',
    "/abc'x",
    '/abc<page>',
    ' /abc',
    '/abc ',
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

describe('build publication identity', () => {
  const head = 'a'.repeat(40);
  const env = {
    GITHUB_ACTIONS: 'true',
    GITHUB_REPOSITORY: 'Fu-L/abc-textbook',
    GITHUB_RUN_ID: '123',
    GITHUB_SHA: head,
    ABC_TEXTBOOK_RUN_CREATED_AT: '2026-10-09T23:59:00Z',
  };
  const resolve = (overrides: NodeJS.ProcessEnv = {}) =>
    resolveBuildPublication({
      env: { ...env, ...overrides },
      head,
      historyVersions: [],
    });
  it('uses the original UTC run date and keeps the version across attempts', () => {
    expect(resolve().version).toBe('2026.10.09-r123');
    expect(resolve({ GITHUB_RUN_ATTEMPT: '2' })).toEqual(resolve());
    expect(resolve({ GITHUB_RUN_ID: '124' }).version).toBe('2026.10.09-r124');
    expect(resolve({ GITHUB_RUN_ID: '125' }).runUrl).toBe(
      'https://github.com/Fu-L/abc-textbook/actions/runs/125',
    );
  });
  it.each(['GITHUB_REPOSITORY', 'GITHUB_RUN_ID', 'GITHUB_SHA', 'ABC_TEXTBOOK_RUN_CREATED_AT'])(
    'rejects missing Actions input %s without falling back',
    (key) => {
      expect(() => resolve({ [key]: undefined })).toThrow('PUBLICATION_ACTIONS_INPUT_INVALID');
    },
  );
  it.each([
    { GITHUB_RUN_ID: '0' },
    { GITHUB_RUN_ID: '12x' },
    { GITHUB_REPOSITORY: 'missing-owner' },
    { GITHUB_SHA: 'b'.repeat(40) },
    { ABC_TEXTBOOK_RUN_CREATED_AT: '2026-02-30T00:00:00Z' },
    { ABC_TEXTBOOK_RUN_CREATED_AT: '2026-10-09T25:00:00Z' },
    { ABC_TEXTBOOK_RUN_CREATED_AT: '2026-10-09' },
  ])('rejects malformed or mismatched Actions input %j', (overrides) => {
    expect(() => resolve(overrides)).toThrow('PUBLICATION_ACTIONS_INPUT_INVALID');
  });
  it('uses the last history version locally, without any run or metadata identity', () => {
    expect(
      resolveBuildPublication({
        env: {},
        head,
        historyVersions: ['2026.10.08', '2026.10.09-r123'],
      }),
    ).toEqual({ version: '2026.10.09-r123' });
    expect(
      resolveBuildPublication({
        env: {},
        head,
        historyVersions: [],
        baselineVersion: '2026.10.08',
      }),
    ).toEqual({ version: '2026.10.08' });
    expect(() => resolveBuildPublication({ env: {}, head, historyVersions: [] })).toThrow(
      'PUBLICATION_BASELINE_MISSING',
    );
  });
});

// Execute the workflow's actual input script with disposable API responses.
describe('standard Pages workflow', () => {
  const workflow = parseYaml(readFileSync('.github/workflows/ci.yml', 'utf8')) as {
    concurrency: { group: string; 'cancel-in-progress': string };
    jobs: Record<
      string,
      {
        needs?: string;
        outputs?: Record<string, string>;
        if?: string;
        permissions?: Record<string, string>;
        environment?: { name: string };
        steps: { uses?: string; run?: string; if?: string; with?: Record<string, string> }[];
      }
    >;
  };
  const required = <T>(value: T | undefined): T => {
    if (value === undefined) throw new Error('Missing workflow field');
    return value;
  };
  const verify = required(workflow.jobs.verify);
  const deploy = required(workflow.jobs.deploy);
  const steps = verify.steps;
  const upload = required(
    steps.find(({ uses }) => uses?.startsWith('actions/upload-pages-artifact@')),
  );
  const configure = required(
    steps.find(({ uses }) => uses?.startsWith('actions/configure-pages@')),
  );
  const deployment = required(
    deploy.steps.find(({ uses }) => uses?.startsWith('actions/deploy-pages@')),
  );
  const script = required(
    required(required(steps.find(({ uses }) => uses === 'actions/github-script@v7')).with).script,
  );
  const canRun = (
    expression: string,
    event: string,
    ref: string,
    successful: boolean,
    publication: boolean,
  ) =>
    Boolean(
      runInNewContext(`(${expression.slice(3, -2)})`, {
        success: () => successful,
        github: { event_name: event, ref },
        steps: { scope: { outputs: { publication: String(publication) } } },
        needs: {
          verify: {
            result: successful ? 'success' : 'failure',
            outputs: { publication: String(publication) },
          },
        },
      }) as unknown,
    );

  it.each([
    ['push', 'refs/heads/main', true, true, true],
    ['pull_request', 'refs/pull/1/merge', true, true, false],
    ['push', 'refs/heads/main', true, false, false],
    ['push', 'refs/heads/main', false, true, false],
  ])(
    'gates upload/configure/deploy for %s %s success=%s publication=%s',
    (event, ref, success, publication, expected) => {
      for (const expression of [required(upload.if), required(configure.if), required(deploy.if)])
        expect(canRun(expression, event, ref, success, publication)).toBe(expected);
    },
  );
  it('removes the legacy production workflow after standard Pages succeeded', () => {
    expect(existsSync('.github/workflows/production-deploy.yml')).toBe(false);
  });
  it('deploys only the same run/SHA/attempt artifact after the baseline succeeds', () => {
    expect(deploy.needs).toBe('verify');
    expect(required(upload.with).path).toBe('dist');
    expect(required(upload.with).name).toBe(required(verify.outputs)['artifact-name']);
    expect(required(deployment.with).artifact_name).toBe(
      '${{ needs.verify.outputs.artifact-name }}',
    );
    const scope = steps.find(({ run }) => run?.includes('npm run verify:fast'));
    expect(scope?.run).toContain(
      'artifact-name=github-pages-$GITHUB_SHA-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT',
    );
    expect(deploy.steps.some(({ run }) => run?.includes('build'))).toBe(false);
    expect(deploy.permissions).toMatchObject({ pages: 'write', 'id-token': 'write' });
    expect(required(deploy.environment).name).toBe('github-pages');
    expect(workflow.concurrency['cancel-in-progress']).toBe(
      "${{ github.ref != 'refs/heads/main' }}",
    );
    expect(workflow.concurrency.group).toContain('production-deploy');
  });
  it.each(['same SHA', 'new main', 'API failure'])(
    'checks current main when only deploy is rerun: %s',
    async (scenario) => {
      const guard = required(deploy.steps.find(({ uses }) => uses === 'actions/github-script@v7'));
      expect(deploy.steps.indexOf(guard)).toBe(deploy.steps.indexOf(deployment) - 1);
      expect(guard.if).toBeUndefined();
      expect(deployment.if).toBeUndefined();
      expect(required(deploy.permissions).contents).toBe('read');

      const sha = 'a'.repeat(40);
      const getRef = vi.fn().mockImplementation(() =>
        scenario === 'API failure'
          ? Promise.reject(Error('API unavailable'))
          : Promise.resolve({
              data: { object: { sha: scenario === 'same SHA' ? sha : 'b'.repeat(40) } },
            }),
      );
      const deployArtifact = vi.fn();
      const rerunDeploy = async () => {
        await (runInNewContext(`(async () => {${required(required(guard.with).script)}})()`, {
          github: { rest: { git: { getRef } } },
          context: { repo: { owner: 'Fu-L', repo: 'abc-textbook' }, sha },
        }) as Promise<void>);
        deployArtifact(required(deployment.with).artifact_name);
      };

      // The original successful verify/upload are not rerun in any of these cases.
      expect(canRun(required(deploy.if), 'push', 'refs/heads/main', true, true)).toBe(true);
      if (scenario === 'same SHA') {
        await rerunDeploy();
        expect(deployArtifact).toHaveBeenCalledWith('${{ needs.verify.outputs.artifact-name }}');
      } else {
        await expect(rerunDeploy()).rejects.toThrow(
          scenario === 'new main' ? 'Current main differs from this run' : 'API unavailable',
        );
        expect(deployArtifact).not.toHaveBeenCalled();
      }
      expect(getRef).toHaveBeenCalledExactlyOnceWith({
        owner: 'Fu-L',
        repo: 'abc-textbook',
        ref: 'heads/main',
      });
    },
  );
  it('uses real run creation time and the latest successful deployment outside this run', async () => {
    const exported: Record<string, string> = {};
    const statuses = new Map([
      [1, [{ state: 'failure' }]],
      [
        2,
        [
          {
            state: 'success',
            log_url: 'https://github.com/Fu-L/abc-textbook/actions/runs/123/job/1',
          },
        ],
      ],
      [
        3,
        [
          {
            state: 'success',
            log_url: 'https://github.com/Fu-L/abc-textbook/actions/runs/122/job/1',
          },
        ],
      ],
    ]);
    const list = Object.assign(
      (_fn: unknown, input: { deployment_id: number }) =>
        Promise.resolve(statuses.get(input.deployment_id)),
      {
        iterator: async function* () {
          yield await Promise.resolve({
            data: [1, 2, 3].map((id) => ({ id, sha: String(id).repeat(40) })),
          });
        },
      },
    );
    const github = {
      rest: {
        actions: {
          getWorkflowRun: () =>
            Promise.resolve({ data: { id: 123, created_at: '2026-10-09T00:00:00Z' } }),
        },
        repos: { listDeployments: {}, listDeploymentStatuses: {} },
      },
      paginate: list,
    };
    const execute = (github: unknown, context: unknown, core: unknown): Promise<void> =>
      runInNewContext(`(async () => {${script}})()`, { github, context, core }) as Promise<void>;
    const context = {
      repo: { owner: 'Fu-L', repo: 'abc-textbook' },
      runId: 123,
      eventName: 'push',
      ref: 'refs/heads/main',
    };
    const core = {
      exportVariable: (key: string, value: string) => {
        exported[key] = value;
      },
      warning: vi.fn(),
    };
    await execute(github, context, core);
    expect(exported).toEqual({
      ABC_TEXTBOOK_RUN_CREATED_AT: '2026-10-09T00:00:00Z',
      ABC_TEXTBOOK_PUBLICATION_BASE_SHA: '3'.repeat(40),
    });
    github.rest.actions.getWorkflowRun = () => Promise.reject(Error('API unavailable'));
    await expect(execute(github, context, core)).rejects.toThrow('API unavailable');
    github.rest.actions.getWorkflowRun = () =>
      Promise.resolve({ data: { id: 123, created_at: '' } });
    await expect(execute(github, context, core)).rejects.toThrow('Run identity unavailable');
  });
});
