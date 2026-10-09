import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { catalogContentDigest } from '../../src/lib/catalog/build-catalog.js';
import type { z } from 'zod';
import { CatalogSchema } from '../../src/lib/domain/schema-parts/catalog.js';

import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { deriveCatalogEvidenceTrustContext } from '../../src/lib/catalog/evidence-inventory.js';
import { calculateContentWorkManifestScopeDigest } from '../../src/lib/validation/content-work-manifest.js';
import {
  deriveExecutableExampleInventory,
  executableExampleInventoryDigest,
} from '../../src/lib/catalog/build-catalog.js';
import { makeTrustedCatalog } from '../fixtures/trusted-catalog.js';

const execFileAsync = promisify(execFile);
const sha = (character: string): string => character.repeat(64);
const calculateContentSubjectDigest = (files: readonly unknown[]): string => canonicalDigest(files);

describe('catalog CLI current canonical content', () => {
  let root: string;
  let catalog: z.infer<typeof CatalogSchema>;
  const run = async (script: string, args: string[]) =>
    execFileAsync(
      process.execPath,
      [
        '--import',
        path.resolve('node_modules/tsx/dist/loader.mjs'),
        path.resolve(`scripts/catalog-${script}.ts`),
        ...args,
      ],
      { cwd: root, maxBuffer: 4 * 1024 * 1024 },
    )
      .then(({ stdout, stderr }) => ({ code: 0, stdout, stderr }))
      .catch((error: unknown) => error as { code: number; stdout: string; stderr: string });
  const writeCatalog = async (value = catalog) =>
    writeFile(path.join(root, 'catalog.json'), JSON.stringify(value));

  beforeAll(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'abc-catalog-current-'));
    await mkdir(path.join(root, 'staging'));
    await cp('src/content', path.join(root, 'src/content'), { recursive: true });
    catalog = (await loadFullPublicProjection({ repositoryRoot: root, usePreparedRelease: false }))
      .catalog;
    for (const key of ['manifestDigest', 'contentFileInventoryDigest', 'contentSnapshotDigest'])
      Reflect.deleteProperty(catalog.release, key);
    await writeCatalog();
  }, 60_000);
  afterAll(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('builds and validates without Git, manifest, review or evidence inventory', async () => {
    expect(await run('validate', ['--input', 'catalog.json'])).toMatchObject({
      code: 0,
      stdout: 'CATALOG_VALID\n',
    });
    expect(
      await run('build', ['--input', 'catalog.json', '--output', 'output.json']),
    ).toMatchObject({ code: 0 });
    const output = CatalogSchema.parse(
      JSON.parse(await readFile(path.join(root, 'output.json'), 'utf8')) as unknown,
    );
    expect(canonicalDigest(output)).toBe(canonicalDigest(catalog));
    const before = await readFile(path.join(root, 'output.json'));
    const overwrite = await run('build', ['--input', 'catalog.json', '--output', 'output.json']);
    expect(overwrite.code).toBe(70);
    expect(overwrite.stderr).toContain('EEXIST');
    expect((await readFile(path.join(root, 'output.json'))).equals(before)).toBe(true);
  }, 60_000);

  it.each(['validate', 'build'])(
    'rejects malformed and unknown arguments for %s',
    async (script) => {
      const required =
        script === 'build'
          ? ['--input', 'catalog.json', '--output', 'unused.json']
          : ['--input', 'catalog.json'];
      for (const args of [
        [...required, '--unknown', 'value'],
        [...required, '--input', 'catalog.json'],
        [...required, '--evidence-inventory'],
        ['--input', '--output', 'unused.json'],
        [...required, '--evidence-inventory', '--unknown'],
      ])
        expect(await run(script, args)).toMatchObject({ code: 64 });
    },
    60_000,
  );

  it.each([
    ['type', 'CATALOG_SCHEMA_INVALID'],
    ['duplicate', 'DUPLICATE_PROBLEM_ID'],
    ['reference', 'CATALOG_REFERENCE_MISSING'],
    ['tag-cycle', 'DEPENDENCY_CYCLE'],
    ['outcome-cycle', 'DEPENDENCY_CYCLE'],
    ['placement', 'CATALOG_CANONICAL_DRIFT'],
    ['claim', 'AUTHORING_CLAIM_NOT_VERIFIED'],
  ])(
    'rejects %s even without an inventory',
    async (kind, diagnostic) => {
      const changed = structuredClone(catalog);
      const problem = changed.problems[0];
      const tag = changed.tags[0];
      const outcome = changed.learningOutcomes[0];
      const placement = changed.placements[0];
      const claim = changed.authoringUnits[0]?.claims[0];
      if (!problem || !tag || !outcome || !placement || !claim)
        throw new Error('Missing fixture entities.');
      if (kind === 'type') Reflect.set(problem, 'title', 42);
      if (kind === 'duplicate') changed.problems.push(structuredClone(problem));
      if (kind === 'reference') problem.sourceRevisionIds = ['unknown-source'];
      if (kind === 'tag-cycle') tag.prerequisiteTagIds = [tag.id];
      if (kind === 'outcome-cycle') outcome.prerequisiteOutcomeIds = [outcome.id];
      if (kind === 'placement') placement.rationale += ' Drift';
      if (kind === 'claim') claim.verificationStatus = 'unverified';
      await writeCatalog(changed);
      for (const script of ['validate', 'build']) {
        const args = [
          '--input',
          'catalog.json',
          ...(script === 'build' ? ['--output', 'invalid.json'] : []),
        ];
        const result = await run(script, args);
        expect(result.code).toBe(2);
        expect(result.stderr).toContain(diagnostic);
      }
      await writeCatalog();
    },
    60_000,
  );

  it('rejects a Unit prerequisite cycle in the canonical policy', async () => {
    const file = path.join(root, 'src/content/policies/learning-prerequisites.json');
    const before = await readFile(file);
    const value = JSON.parse(before.toString()) as {
      learningUnitPrerequisites: { nodeId: string; prerequisiteId: string }[];
      learningUnitDagDigest: string;
    };
    const id = catalog.learningUnits[0]?.id;
    if (!id) throw new Error('Missing fixture Unit.');
    value.learningUnitPrerequisites.push({ nodeId: id, prerequisiteId: id });
    value.learningUnitDagDigest = canonicalDigest(value.learningUnitPrerequisites);
    await writeFile(file, JSON.stringify(value));
    expect(await run('validate', ['--input', 'catalog.json'])).toMatchObject({ code: 2 });
    await writeFile(file, before);
  }, 60_000);

  it('checks current prose and rejects a stale serialized document', async () => {
    const unit = catalog.authoringUnits[0];
    if (!unit || typeof unit.sections.reasoning !== 'string')
      throw new Error('Missing fixture prose.');
    const file = path.join(root, unit.docPath);
    const before = await readFile(file, 'utf8');
    await rm(file);
    expect(await run('validate', ['--input', 'catalog.json'])).toMatchObject({ code: 2 });
    await writeFile(
      file,
      before.replace(unit.sections.reasoning, `${unit.sections.reasoning}\n訂正した着想。`),
    );
    const updated = (
      await loadFullPublicProjection({ repositoryRoot: root, usePreparedRelease: false })
    ).catalog;
    // New content is accepted with no new work/review ledger.
    updated.release.contentSnapshotDigest = catalogContentDigest(updated);
    await writeCatalog(updated);
    expect(await run('validate', ['--input', 'catalog.json'])).toMatchObject({ code: 0 });
    await writeCatalog();
    const stale = await run('validate', ['--input', 'catalog.json']);
    expect(stale.code).toBe(2);
    expect(stale.stderr).toContain('CATALOG_CANONICAL_DRIFT');
    await writeFile(file, before);
  }, 60_000);
});

describe('catalog validation CLI evidence boundary', () => {
  let repositoryRoot: string;

  beforeEach(async () => {
    repositoryRoot = await mkdtemp(path.join(tmpdir(), 'abc-textbook-cli-evidence-'));
    await mkdir(path.join(repositoryRoot, 'staging'));
  });

  afterEach(async () => {
    await rm(repositoryRoot, { recursive: true, force: true });
  });

  const writeJson = async (relativePath: string, value: unknown): Promise<string> => {
    const contents = `${JSON.stringify(value, null, 2)}\n`;
    const absolutePath = path.join(repositoryRoot, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, contents, 'utf8');
    return createHash('sha256').update(contents).digest('hex');
  };

  // This compatibility test reconstructs the full legacy release twice.
  // Allow for the slower disk and CPU of the release-baseline CI runner.
  it('accepts the retained legacy inventory and rejects an invalid legacy field', async () => {
    // Clone existing inputs into a disposable Git repository; no new review/check receipts.
    const snapshot = path.join(repositoryRoot, 'snapshot');
    await execFileAsync('git', ['clone', '--shared', '--quiet', '--no-checkout', '.', snapshot]);
    await execFileAsync('git', ['reset', '--mixed', '--quiet', 'HEAD'], { cwd: snapshot });
    // Only materialize inputs read by the old consumer; historical build artifacts are unnecessary.
    await execFileAsync(
      'git',
      [
        'restore',
        '--source=HEAD',
        '--worktree',
        '--',
        'src/content',
        'docs/work-manifests',
        'docs/verification/releases',
        'docs/reviews/agent-content/initial-release',
        'docs/verification/initial-release',
        'docs/verification/bootstrap/us1.json',
        'docs/verification/bootstrap/learning-unit-content.json',
        'docs/verification/bootstrap/problem-authoring-units.json',
        '.specify/memory/constitution.md',
        '.specify/templates',
        'staging/updates',
      ],
      { cwd: snapshot },
    );
    await execFileAsync('git', ['update-ref', 'refs/remotes/origin/main', 'HEAD'], {
      cwd: snapshot,
    });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '--allow-empty',
        '-m',
        'Legacy validation fixture',
      ],
      { cwd: snapshot },
    );
    const inputPath = 'docs/verification/releases/catalog.json';
    const evidencePath = 'docs/verification/releases/evidence-inventory.json';
    const original = CatalogSchema.parse(
      JSON.parse(await readFile(path.join(snapshot, inputPath), 'utf8')) as unknown,
    );
    // The legacy CLI never accepted a prepared projection as a published release.
    // Remove that marker in the fixture while retaining the old actual evidence values.
    Reflect.deleteProperty(original.release, 'publicationStatus');
    original.release.contentSnapshotDigest = catalogContentDigest(original);
    await writeFile(path.join(snapshot, inputPath), JSON.stringify(original));
    const invoke = (script: string, extra: string[] = []) =>
      execFileAsync(
        process.execPath,
        [
          '--import',
          path.resolve('node_modules/tsx/dist/loader.mjs'),
          path.resolve(`scripts/catalog-${script}.ts`),
          '--input',
          inputPath,
          '--evidence-inventory',
          evidencePath,
          ...extra,
        ],
        { cwd: snapshot },
      );
    expect((await invoke('validate')).stdout).toBe('CATALOG_VALID\n');
    const evidence = JSON.parse(
      await readFile(path.join(snapshot, evidencePath), 'utf8'),
    ) as Record<string, unknown>;
    evidence.checks = 'invalid';
    await writeFile(path.join(snapshot, evidencePath), JSON.stringify(evidence));
    const error = await invoke('validate').catch(
      (value: unknown) => value as { code: number; stderr: string },
    );
    expect(error).toMatchObject({ code: 2 });
    expect(error.stderr).toContain('EVIDENCE_INVENTORY_SCHEMA_INVALID');
  }, 120_000);

  it('fails closed for a normal weekly-update fixture when evidence omits a required check', async () => {
    const contentPath = 'src/content/docs/index.md';
    const baseContent = '# Catalog fixture base\n';
    const content = '# Catalog fixture\n';
    await mkdir(path.join(repositoryRoot, 'src/content/docs'), { recursive: true });
    await writeFile(path.join(repositoryRoot, contentPath), baseContent, 'utf8');
    const contentFiles = [
      {
        path: contentPath,
        sha256: createHash('sha256').update(content).digest('hex'),
        byteLength: Buffer.byteLength(content),
      },
    ];
    const subjectDigest = calculateContentSubjectDigest(contentFiles);
    const checkPath = 'docs/verification/check-catalog.json';
    const check = {
      schemaVersion: '1.0.0',
      checkId: 'check-catalog',
      command: 'npm run test:contract',
      subjectDigest,
      exitCode: 0,
      passed: true,
      completedAt: '2026-07-17T12:00:00+09:00',
    };
    const checkDigest = await writeJson(checkPath, check);
    const applicableChecks = [
      {
        checkId: check.checkId,
        command: check.command,
        subjectDigest: check.subjectDigest,
        exitCode: check.exitCode,
        passed: check.passed,
        completedAt: check.completedAt,
        resultPath: checkPath,
        resultDigest: checkDigest,
        executedByReviewerId: 'person-author',
      },
    ];
    const reviewPath = 'docs/reviews/human-content/review-catalog.json';
    const review: Record<string, unknown> = {
      schemaVersion: '3.0.0',
      id: 'human-content-review-catalog',
      scopeType: 'release',
      scopeId: 'release-2026-07-17',
      releaseVersion: '2026.07.17',
      subjectDigest,
      inventoryPath: 'docs/verification/review-inventory.json',
      inventoryDigest: '',
      reviewPolicy: { requiredMode: 'self', riskReasons: [] } as const,
      reviewMode: 'self',
      applicableChecks,
      applicableCheckCount: 1,
      passedApplicableCheckCount: 1,
      reviewerExecutedCheckSetDigest: canonicalDigest(applicableChecks),
      authors: [{ personId: 'person-author', authoredItemIds: ['human-review-item-catalog'] }],
      reviewer: { personId: 'person-author', mode: 'self' },
      reviewItems: [
        {
          reviewItemId: 'human-review-item-catalog',
          kind: 'non_automatable_claim',
          subjectPaths: ['src/content/docs/index.md'],
          authorIds: ['person-author'],
          learningOutcomeIds: [],
          reviewerId: 'person-author',
          reviewBasis: 'Compared the claim with its source.',
          decision: 'approved',
          findings: [],
          reviewedAt: '2026-07-17T12:30:00+09:00',
        },
      ],
      inventoryItemCount: 1,
      reviewedItemCount: 1,
      approvedItemCount: 1,
      changesRequestedItemCount: 0,
      unreviewedItemCount: 0,
      outcomeCoverageReview: {
        reviewerId: 'person-author',
        authorIds: ['person-author'],
        decision: 'no_outcome_impact_confirmed',
        learningOutcomeIds: [],
        subjectPaths: ['src/content/docs/index.md'],
        rationale: 'The content does not change an observable learning outcome.',
        noOutcomeImpactRationale: 'No learning outcome changes.',
        confirmedAt: '2026-07-17T12:30:00+09:00',
      },
      outcomeCoverageConfirmed: true,
      aggregatePassed: true,
      generatedAt: '2026-07-17T12:31:00+09:00',
      evidenceDigest: '',
    };
    const manifestScope = {
      taskId: 'T024',
      requiredRequirementIds: ['FR-026'],
      learningOutcomeIds: [],
      reviewPolicy: { requiredMode: 'self', riskReasons: [] } as const,
      reviewUnits: [
        {
          reviewUnitId: 'RU-T024-catalog',
          changeKind: 'documentation',
          paths: ['src/content/docs/index.md'],
          itemIds: ['human-review-item-catalog'],
          requirementIds: ['FR-026'],
          learningOutcomeIds: [],
          outcomeImpact: { kind: 'none', rationale: 'No learner outcome changes.' },
          dependencyReviewUnitIds: [],
          checkIds: ['check-catalog', 'check-lint'],
          evidenceRoles: ['non_automatable_claim'],
          maintenanceBenefit: null,
          owner: 'person-author',
          status: 'complete',
        },
      ],
    };
    const workManifest: Record<string, unknown> = {
      schemaVersion: '2.0.0',
      manifestId: 'work-manifest-T024-catalog',
      ...manifestScope,
      scopeDigest: calculateContentWorkManifestScopeDigest(manifestScope),
      digest: '',
      changeKind: 'documentation',
      outcomeImpact: { kind: 'none', rationale: 'No learner outcome changes.' },
      maintenanceBenefit: null,
      state: 'complete',
      createdAt: '2026-07-17T10:00:00+09:00',
      updatedAt: '2026-07-17T11:00:00+09:00',
    };
    workManifest.digest = digestWithoutField(workManifest, 'digest');
    const catalog = makeTrustedCatalog({
      releaseKind: 'incremental',
      manifestDigest: workManifest.digest,
      contentFileInventoryDigest: subjectDigest,
      contentSnapshotDigest: subjectDigest,
      updateIds: ['update-foundation'],
    });
    catalog.release.validationSummary = {
      checkCount: 2,
      passedCheckCount: 2,
      blockingFindingCount: 0,
      evidenceDigests: [checkDigest, sha('8')],
      checks: [
        {
          checkId: check.checkId,
          command: check.command,
          subjectDigest,
          resultPath: checkPath,
          resultDigest: checkDigest,
          exitCode: 0,
          passed: true,
          completedAt: check.completedAt,
        },
        {
          checkId: 'check-lint',
          command: 'npm run lint',
          subjectDigest,
          resultPath: 'docs/verification/check-lint.json',
          resultDigest: sha('8'),
          exitCode: 0,
          passed: true,
          completedAt: check.completedAt,
        },
      ],
    };
    const baseCatalog = structuredClone(catalog);
    baseCatalog.release.version = '2026.07.16';
    const explanation = catalog.authoringUnits[0];
    if (!explanation) throw new Error('Fixture explanation is missing.');
    explanation.revision = 2;
    review.inventoryDigest = deriveCatalogEvidenceTrustContext({
      catalog,
      workManifest,
    }).inventoryDigest;
    review.evidenceDigest = digestWithoutField(review, 'evidenceDigest');
    const reviewDigest = await writeJson(reviewPath, review);
    const releaseReviewRef = catalog.release.humanContentReviewEvidenceRefs[0];
    if (releaseReviewRef) releaseReviewRef.digest = reviewDigest;
    const executableExampleEvidencePath = 'docs/verification/executable-examples.json';
    const executableInventory = deriveExecutableExampleInventory(catalog);
    const executableExampleEvidence = {
      schemaVersion: '3.0.0' as const,
      releaseDigest: sha('a'),
      subjectDigest: catalog.release.contentSnapshotDigest,
      inventoryDigest: executableExampleInventoryDigest(catalog),
      inventoryCount: executableInventory.length,
      checkedCount: executableInventory.length,
      passedCount: executableInventory.length,
      failedCount: 0,
      aggregatePassed: true,
      items: executableInventory.map((item, index) => ({
        ...item,
        subjectDigest: catalog.release.contentSnapshotDigest,
        releaseDigest: sha('a'),
        environment: 'Node.js fixture',
        command: 'node fixture.js',
        expectedResult: '1',
        actualResult: '1',
        exitCode: 0,
        passed: true,
        executedAt: '2026-07-17T12:30:00+09:00',
        resultDigest: sha(String(index + 1)),
        evidencePath: executableExampleEvidencePath,
      })),
      generatedAt: '2026-07-17T12:31:00+09:00',
    };
    const executableExampleEvidenceDigest = await writeJson(
      executableExampleEvidencePath,
      executableExampleEvidence,
    );
    const inventoryPath = 'docs/verification/release-evidence-inventory.json';
    await writeJson(inventoryPath, {
      subjectDigest,
      checks: [
        {
          checkId: check.checkId,
          command: check.command,
          subjectDigest,
          resultPath: checkPath,
          resultDigest: checkDigest,
          exitCode: 0,
          passed: true,
          completedAt: check.completedAt,
        },
      ],
      reviews: [
        {
          evidenceId: review.id,
          path: reviewPath,
          digest: reviewDigest,
          subjectDigest,
          authorIds: ['person-author'],
          reviewerIds: ['person-author'],
          reviewMode: 'self',
          aggregatePassed: true,
        },
      ],
      executableExampleEvidence: {
        path: executableExampleEvidencePath,
        digest: executableExampleEvidenceDigest,
        subjectDigest: catalog.release.contentSnapshotDigest,
      },
    });
    const manifestPath = 'docs/work-manifests/catalog/manifest.json';
    await writeJson(manifestPath, workManifest);
    await writeJson('staging/updates/update-foundation.json', {
      schemaVersion: '2.0.0',
      updateId: 'update-foundation',
      kind: 'taxonomy',
      baseReleaseVersion: '2026.07.16',
      contestId: null,
      sourceSetFingerprint: sha('1'),
      advancedSlotLabels: [],
      targetProblemIds: ['abc212-x45'],
      operations: [
        {
          operationId: 'operation-replace-explanation',
          entityType: 'authoring_unit',
          entityId: 'abc212-x45',
          action: 'replace',
          path: contentPath,
          beforeDigest: createHash('sha256').update(baseContent).digest('hex'),
          afterDigest: createHash('sha256').update(content).digest('hex'),
          affectedEntities: [
            {
              entityType: 'authoring_unit',
              entityId: 'abc212-x45',
              action: 'replace',
            },
          ],
          affectedProblemIds: ['abc212-x45'],
        },
      ],
      authoringResults: [
        {
          problemId: 'abc212-x45',
          slotLabel: 'E',
          resultType: 'authoring_unit_draft',
          draftPath: 'src/content/docs/index.md',
          packetPath: null,
          templatePath: null,
          reasonCode: null,
          reason: null,
          retryCondition: null,
        },
      ],
      correctionImpactIds: [],
      validationSummary: {
        checkIds: ['check-catalog'],
        problemResults: [
          { problemId: 'abc212-x45', passed: true, findingCodes: [], remediation: null },
        ],
        blockingFindingCount: 0,
        aggregatePassed: true,
        resultDigest: sha('2'),
      },
      state: 'ELIGIBLE_FOR_BATCH',
      createdAt: '2026-07-17T10:00:00+09:00',
      updatedAt: '2026-07-17T11:00:00+09:00',
      fixtureMode: false,
    });
    await writeJson('catalog.json', baseCatalog);
    await execFileAsync('git', ['init'], { cwd: repositoryRoot });
    await execFileAsync('git', ['add', 'catalog.json', contentPath], { cwd: repositoryRoot });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '--allow-empty',
        '-m',
        'freeze base',
      ],
      { cwd: repositoryRoot },
    );
    await execFileAsync('git', ['add', manifestPath], { cwd: repositoryRoot });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '-m',
        'freeze manifest',
      ],
      { cwd: repositoryRoot },
    );
    const { stdout: baseCommit } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: repositoryRoot,
    });
    await execFileAsync('git', ['update-ref', 'refs/remotes/origin/main', baseCommit.trim()], {
      cwd: repositoryRoot,
    });
    await execFileAsync(
      'git',
      [
        '-c',
        'user.name=Fixture',
        '-c',
        'user.email=fixture@example.com',
        'commit',
        '--allow-empty',
        '-m',
        'current release state',
      ],
      { cwd: repositoryRoot },
    );
    await writeFile(path.join(repositoryRoot, contentPath), content, 'utf8');
    await writeJson('catalog.json', catalog);

    const scriptPath = path.resolve('scripts/catalog-validate.ts');
    const tsxLoaderPath = path.resolve('node_modules/tsx/dist/loader.mjs');
    const error = await execFileAsync(
      process.execPath,
      [
        '--import',
        tsxLoaderPath,
        scriptPath,
        '--input',
        'catalog.json',
        '--evidence-inventory',
        inventoryPath,
      ],
      { cwd: repositoryRoot },
    ).catch((value: unknown) => value as { code: number; stderr: string });

    expect(error.stderr).toMatch(/REVIEWER_CHECK_INVENTORY_INVALID/u);
    expect(error).toMatchObject({ code: 2 });
  });
});
