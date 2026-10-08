import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { cpus, totalmem } from 'node:os';
import { promisify } from 'node:util';
import prettier from 'prettier';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import {
  assertAudit,
  auditCompleteness,
  auditOptionalBlocks,
  auditSources,
  auditTaxonomy,
} from './initial-release-audits.js';
import {
  AUDIT_ROOT,
  AUDIT_TASKS,
  assertAuditEvidence,
  auditInputSubject,
  fileSha,
  type AuditCommand,
} from './initial-release-evidence.js';
import {
  auditPublicArtifacts,
  auditLocalDependencies,
  groupBundleDecisions,
} from './initial-release-public.js';
import { benchmarkInitialRelease } from './initial-release-performance.js';
import { simulateZeroCostYear } from './initial-release-zero-cost.js';

// The optional initial audit retains its full historical checks independently of normal CI.
const INITIAL_VERIFICATION_STEPS = [
  { id: 'lint', script: 'lint' },
  { id: 'format', script: 'format:check' },
  { id: 'check', script: 'check' },
  { id: 'test', script: 'test' },
  { id: 'corpus', script: 'corpus:verify' },
  { id: 'problem-metrics', script: 'corpus:verify-atcoder-problems-metrics' },
  { id: 'authoring', script: 'corpus:verify-authoring' },
  { id: 'taxonomy', script: 'preview:taxonomy' },
  { id: 'final-taxonomy', script: 'corpus:final-taxonomy' },
  { id: 'canonical-taxonomy', script: 'corpus:materialize-taxonomy' },
  { id: 'full-learning-content', script: 'corpus:verify-learning-units' },
  { id: 'problem-shard-index', script: 'corpus:verify-problem-shard-index' },
  { id: 'problem-shards', script: 'corpus:verify-problem-shards' },
  { id: 'problem-corpus', script: 'corpus:verify-problem-corpus' },
  { id: 'learning-content', script: 'preview:learning-content' },
  { id: 'build', script: 'build' },
  { id: 'full-projections', script: 'corpus:verify-full-projections' },
  { id: 'links', script: 'link:check:built' },
  { id: 'e2e', script: 'test:e2e:built' },
];

const exec = promisify(execFile);
const mode = process.argv[2] ?? '--check';
const writeJson = async (file: string, value: unknown) => {
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  await writeFile(
    file,
    await prettier.format(JSON.stringify(value), {
      ...(await prettier.resolveConfig(file)),
      filepath: file,
    }),
  );
};
const readJson = async (file: string): Promise<unknown> =>
  JSON.parse(await readFile(file, 'utf8')) as unknown;

try {
  if (process.argv.length > 3 || !['--check', '--write'].includes(mode)) {
    process.exitCode = 64;
    throw new Error('Usage: verify:initial-release [--check | --write]');
  }
  assertAudit(process.version.startsWith('v24.'), 'AUDIT_NODE_24_REQUIRED');
  const inputSubject = await auditInputSubject();
  const projection = await loadFullPublicProjection();
  const checks = {
    completeness: auditCompleteness(projection.catalog),
    sources: auditSources(projection),
    optional: auditOptionalBlocks(projection),
  };
  if (mode === '--check') {
    for (const [taskId, name] of AUDIT_TASKS) {
      const evidence = assertAuditEvidence(
        await readJson(`${AUDIT_ROOT}/${name}.json`),
        taskId,
        inputSubject.digest,
        projection.digest,
      );
      if (taskId === 'T134')
        assertAudit(
          canonicalDigest(evidence.checks) === canonicalDigest(checks.completeness),
          'AUDIT_COMPLETENESS_EVIDENCE',
        );
      if (taskId === 'T136')
        assertAudit(
          canonicalDigest(evidence.checks) === canonicalDigest(checks.sources),
          'AUDIT_SOURCES_EVIDENCE',
        );
      if (taskId === 'T137')
        assertAudit(
          canonicalDigest(evidence.checks) === canonicalDigest(checks.optional),
          'AUDIT_EXAMPLES_EVIDENCE',
        );
    }
    const matrix = (await readJson(`${AUDIT_ROOT}/matrix.json`)) as {
      status: string;
      scope: string;
      inputSubject: { digest: string };
      sourceProjectionDigest: string;
      reports: { taskId: string; path: string; digest: string }[];
      evidenceDigest: string;
      testResults: { path: string; digest: string };
      browserResults: { path: string; digest: string };
    };
    const { evidenceDigest, ...unsigned } = matrix;
    assertAudit(
      matrix.status === 'passed' &&
        matrix.scope === 'canonical-full-corpus' &&
        canonicalDigest(unsigned) === evidenceDigest &&
        matrix.inputSubject.digest === inputSubject.digest &&
        matrix.sourceProjectionDigest === projection.digest,
      'AUDIT_MATRIX_SUBJECT',
    );
    assertAudit(
      matrix.reports.length === 10 &&
        matrix.reports.every((report, index) => {
          const task = AUDIT_TASKS[index];
          return report.taskId === task?.[0] && report.path === `${AUDIT_ROOT}/${task[1]}.json`;
        }),
      'AUDIT_MATRIX_TASKS',
    );
    for (const report of matrix.reports)
      assertAudit(
        fileSha(await readFile(report.path)) === report.digest,
        `AUDIT_MATRIX_REPORT:${report.taskId}`,
      );
    for (const report of [matrix.testResults, matrix.browserResults])
      assertAudit(
        fileSha(await readFile(report.path)) === report.digest,
        'AUDIT_RAW_RESULT_DIGEST',
      );
    console.log(
      JSON.stringify({
        status: 'passed',
        mode,
        inputSubject,
        sourceProjectionDigest: projection.digest,
        tasks: 10,
      }),
    );
  } else {
    const commands = new Map<string, AuditCommand>();
    const rawOutputs = new Map<string, string>();
    const run = async (program: string, args: string[]): Promise<AuditCommand> => {
      const command = [program === process.execPath ? 'node' : program, ...args].join(' ');
      console.error(`Checking: ${command}`);
      const start = performance.now();
      try {
        const { stdout, stderr } = await exec(program, args, {
          maxBuffer: 64 * 1024 * 1024,
          timeout: 300_000,
          env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
        });
        rawOutputs.set(command, stdout);
        return {
          command,
          exitCode: 0,
          durationMs: performance.now() - start,
          outputDigest: fileSha(stdout + stderr),
          outputBytes: Buffer.byteLength(stdout + stderr),
          observed: (stdout + stderr).slice(-1800).trim(),
        };
      } catch (error) {
        const failure = error as Error & { stdout?: string; stderr?: string };
        let failedTests: string | undefined;
        if (args.includes('--reporter=json') && failure.stdout) {
          try {
            const report = JSON.parse(failure.stdout) as {
              testResults?: {
                name: string;
                status: string;
                message?: string;
                assertionResults: { fullName: string; status: string; failureMessages: string[] }[];
              }[];
            };
            failedTests = JSON.stringify(
              report.testResults?.flatMap<unknown>((file) => {
                const assertions = file.assertionResults
                  .filter((test) => test.status === 'failed')
                  .map((test) => ({ file: file.name, ...test }));
                return assertions.length || file.status !== 'failed'
                  ? assertions
                  : [
                      {
                        file: file.name,
                        suiteFailure: true,
                        message:
                          file.message ??
                          'Suite failed before individual assertions; check setup hooks.',
                      },
                    ];
              }),
            );
          } catch {
            // Keep native output when the failed command did not finish its JSON report.
          }
        }
        throw new Error(
          `${command} failed: ${failure.message}\n${failedTests ?? failure.stdout?.slice(-3000) ?? ''}\n${failure.stderr?.slice(-3000) ?? ''}`,
          { cause: error },
        );
      }
    };
    let unitReport: unknown;
    let browserReport: unknown;
    for (const step of INITIAL_VERIFICATION_STEPS) {
      if (step.id === 'test') {
        const result = await run(process.execPath, [
          'node_modules/vitest/vitest.mjs',
          'run',
          '--reporter=json',
        ]);
        unitReport = JSON.parse(rawOutputs.get(result.command) ?? '') as unknown;
        commands.set(step.id, result);
      } else if (step.id === 'e2e') {
        const result = await run(process.execPath, [
          'node_modules/@playwright/test/cli.js',
          'test',
          '--workers=3',
          '--reporter=json',
        ]);
        browserReport = JSON.parse(rawOutputs.get(result.command) ?? '') as unknown;
        commands.set(step.id, result);
      } else commands.set(step.id, await run('npm', ['run', step.script]));
    }
    commands.set('schema', await run('npm', ['run', 'schema:check']));
    const unit = unitReport as {
      numFailedTests: number;
      numPendingTests: number;
      numPassedTests: number;
      testResults: { name: string; status: string; assertionResults: { status: string }[] }[];
    };
    assertAudit(
      unit.numFailedTests === 0 &&
        unit.numPendingTests === 0 &&
        unit.numPassedTests > 0 &&
        unit.testResults.every((result) => result.status === 'passed'),
      'AUDIT_UNIT_TEST_AGGREGATE',
    );
    const browser = browserReport as {
      errors: unknown[];
      stats: { expected: number; unexpected: number; flaky: number; skipped: number };
      suites: unknown[];
    };
    assertAudit(
      browser.errors.length === 0 &&
        browser.stats.unexpected === 0 &&
        browser.stats.skipped === 0 &&
        browser.stats.flaky === 0 &&
        browser.stats.expected > 0,
      'AUDIT_BROWSER_AGGREGATE',
    );
    const publicChecks = await auditPublicArtifacts(projection);
    const dependencies = await auditLocalDependencies();
    const taxonomy = await auditTaxonomy(projection);
    const performanceChecks = await benchmarkInitialRelease(projection, run);
    console.error('Checking: deterministic 52-week local update/deploy/backup simulation');
    const year = await simulateZeroCostYear(projection);
    assertAudit(
      canonicalDigest(inputSubject) === canonicalDigest(await auditInputSubject()),
      'AUDIT_CANONICAL_INPUT_CHANGED',
    );
    const generatedAt = new Date().toISOString();
    const testSummary = {
      passedTests: unit.numPassedTests,
      files: unit.testResults.map((result) => ({
        path: result.name.replace(`${process.cwd()}/`, ''),
        status: result.status,
        tests: result.assertionResults.length,
      })),
    };
    const browserSummary = {
      ...browser.stats,
      engines: ['chromium', 'firefox', 'webkit'],
      rawReportPath: `${AUDIT_ROOT}/browser-results.json`,
    };
    await writeJson(browserSummary.rawReportPath, browserReport);
    const testPath = `${AUDIT_ROOT}/test-results.json`;
    await writeJson(testPath, testSummary);
    const refs = (ids: string[]) =>
      ids.map((id) => {
        const command = commands.get(id);
        if (!command) throw new Error(`AUDIT_COMMAND_MISSING:${id}`);
        return command;
      });
    const data: Record<string, { commands: AuditCommand[]; checks: unknown }> = {
      T133: {
        commands: refs(['schema', 'test']),
        checks: {
          canonicalSchemaCount: 18,
          testResultsPath: testPath,
          unknownFieldAndDriftTests: true,
        },
      },
      T134: {
        commands: refs(['corpus', 'problem-metrics', 'problem-corpus', 'full-projections']),
        checks: checks.completeness,
      },
      T135: {
        commands: refs([
          'authoring',
          'final-taxonomy',
          'canonical-taxonomy',
          'full-learning-content',
          'problem-shard-index',
          'problem-shards',
        ]),
        checks: {
          ...taxonomy,
          integrationEvidencePath:
            'docs/verification/previews/initial-v1/taxonomy-integration.json',
          integrationEvidenceDigest: fileSha(
            await readFile('docs/verification/previews/initial-v1/taxonomy-integration.json'),
          ),
          basis:
            'Preview integration is lineage only; complete canonical inventory, final accepted taxonomy and joined full-authoring owners supply the final completeness boundary.',
        },
      },
      T136: { commands: refs(['corpus', 'authoring', 'problem-corpus']), checks: checks.sources },
      T137: {
        commands: refs(['full-learning-content', 'problem-corpus']),
        checks: checks.optional,
      },
      T138: {
        commands: refs(['build', 'links', 'e2e']),
        checks: {
          ...browserSummary,
          staticRoutes: publicChecks.routeCount,
          textAlternativeImageCount: publicChecks.imageCount,
          browserCoverage:
            'All shared route templates including non-preview Problems, narrow full-authoring Unit and no-JavaScript pages. Static headings, images, links and closure cover every generated route.',
        },
      },
      T139: {
        commands: refs(['test', 'e2e']),
        checks: {
          ...browserSummary,
          canonicalProblemControls: publicChecks.sharedControlCount,
          backupRecordCount: 120,
          testResultsPath: testPath,
          basis:
            'Full-route shared control markers/module delivery plus three-engine non-preview records, independent timestamps, real 120-record download/restore, migration and atomic injected-failure regressions.',
        },
      },
      T140: {
        commands: refs(['build', 'full-projections', 'links', 'e2e']),
        checks: {
          ...publicChecks,
          routeChunkDecisions: undefined,
          preparedProjection: true,
          productionReleaseApproved: false,
        },
      },
      T141: {
        commands: performanceChecks.commands,
        checks: {
          ...performanceChecks,
          commands: undefined,
          environment: {
            node: process.version,
            npm: (await exec('npm', ['--version'])).stdout.trim(),
            os: `${process.platform}-${process.arch}`,
            cpu: cpus()[0]?.model,
            logicalCores: cpus().length,
            memoryGiB: totalmem() / 1024 ** 3,
            concurrency:
              'Build repetitions and filter measurements executed sequentially on the same machine.',
          },
        },
      },
      T142: {
        commands: refs(['test', 'build', 'e2e']),
        checks: {
          ...year,
          clientBundles: groupBundleDecisions(publicChecks.routeChunkDecisions),
          dependencies,
          dependencyLockDigest: fileSha(await readFile('package-lock.json')),
          dependencyModel:
            'Locked local open-source runtime/build tools; no generator API, hosted backend, account, telemetry or paid service required by the tested local path.',
        },
      },
    };
    const reports = [];
    for (const [taskId, name] of AUDIT_TASKS) {
      const task = data[taskId];
      if (!task) throw new Error(`AUDIT_TASK_MISSING:${taskId}`);
      // JSON serialization removes intentionally omitted intermediate arrays.
      const unsigned = JSON.parse(
        JSON.stringify({
          schemaVersion: '1.0.0',
          taskId,
          status: 'passed',
          scope: 'canonical-full-corpus',
          inputSubject,
          sourceProjectionDigest: projection.digest,
          generatedAt,
          ...task,
        }),
      ) as Record<string, unknown>;
      const evidence = { ...unsigned, evidenceDigest: canonicalDigest(unsigned) };
      assertAuditEvidence(evidence, taskId, inputSubject.digest, projection.digest);
      const file = `${AUDIT_ROOT}/${name}.json`;
      await writeJson(file, evidence);
      reports.push({ taskId, path: file, digest: fileSha(await readFile(file)) });
      console.error(`${taskId}: passed (${name})`);
    }
    const matrix = {
      schemaVersion: '1.0.0',
      status: 'passed',
      scope: 'canonical-full-corpus',
      inputSubject,
      sourceProjectionDigest: projection.digest,
      generatedAt,
      reports,
      testResults: { path: testPath, digest: fileSha(await readFile(testPath)) },
      browserResults: {
        path: browserSummary.rawReportPath,
        digest: fileSha(await readFile(browserSummary.rawReportPath)),
      },
      productionReleaseApproved: false,
      nextGate: 'Issue #53 seed release gate, then Issue #54 deployment',
    };
    await writeJson(`${AUDIT_ROOT}/matrix.json`, {
      ...matrix,
      evidenceDigest: canonicalDigest(matrix),
    });
    console.log(
      JSON.stringify({
        status: 'passed',
        mode,
        tasks: 10,
        inputSubject,
        sourceProjectionDigest: projection.digest,
        problems: projection.ui.problems.length,
        units: projection.ui.learningUnits.length,
        filterP95Ms: performanceChecks.filterMeasurement.p95Ms,
      }),
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  if (mode === '--write')
    await writeJson(`${AUDIT_ROOT}/matrix.json`, {
      schemaVersion: '1.0.0',
      status: 'on_hold',
      generatedAt: new Date().toISOString(),
      reason: (error instanceof Error ? error.message : String(error)).split('\n')[0],
    });
  process.exitCode ??= 2;
}
