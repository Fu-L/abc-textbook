import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import prettier from 'prettier';
import { canonicalDigest, canonicalJson } from '../../src/lib/domain/canonical-json.js';
import { loadFullPublicProjection } from '../../src/lib/catalog/full-public-projection.js';
import { catalogContentDigest } from '../../src/lib/catalog/build-catalog.js';
import {
  calculateActualContentFileInventory,
  deriveCatalogEvidenceTrustContext,
} from '../../src/lib/catalog/evidence-inventory.js';
import {
  assertSeedRelease,
  createSeedReleaseManifest,
  INITIAL_BOOTSTRAP_ID,
  INITIAL_RELEASE_MANIFEST,
  INITIAL_RELEASE_CHECKS,
  seedReleaseSummary,
} from '../../src/lib/catalog/seed-release.js';
import { PublicationUpdateSchema } from '../../src/lib/domain/schema-parts/release.js';
import { ContentWorkManifestSchema } from '../../src/lib/domain/schema-parts/review-evidence.js';
import { fileSha } from '../verify/initial-release-evidence.js';

export const writeSeedJson = async (file: string, value: unknown) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    await prettier.format(JSON.stringify(value), {
      ...(await prettier.resolveConfig(file)),
      filepath: file,
    }),
  );
};

export const prepareSeedRelease = async (
  mode: 'inputs' | 'evidence',
  version?: string,
  soloMaintainer = false,
) => {
  const projection = await loadFullPublicProjection({ usePreparedRelease: false });
  const catalog = structuredClone(projection.catalog);
  assertSeedRelease(catalog);
  const read = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(file, 'utf8')) as unknown;
  const old = (await read('docs/verification/releases/catalog.json').catch(() => null)) as
    typeof catalog | null;
  const createdAt = old?.release.validatedAt ?? new Date().toISOString();
  const manifest = ContentWorkManifestSchema.parse(
    createSeedReleaseManifest(catalog, createdAt, soloMaintainer),
  );
  const subjectFiles = await calculateActualContentFileInventory(process.cwd());
  const subjectDigest = canonicalDigest(subjectFiles);
  const releaseVersion =
    version ?? old?.release.version ?? createdAt.slice(0, 10).replaceAll('-', '.');
  Object.assign(catalog.release, {
    version: releaseVersion,
    validatedAt: createdAt,
    publicationEffectiveAt: createdAt,
    manifestDigest: manifest.digest,
    contentFileInventoryDigest: subjectDigest,
    changelogPath: 'docs/verification/releases/change-summary.json',
    humanContentReviewEvidenceRefs: [],
  });
  catalog.release.contentSnapshotDigest = catalogContentDigest(catalog);
  const checks = [];
  if (mode === 'evidence') {
    // Execute the advertised read-only command rather than label the --write
    // audit as a different command. The browser command is recorded by that audit.
    const corpusCheck = await promisify(execFile)(
      'npm',
      ['run', 'verify:initial-release', '--', '--check'],
      {
        maxBuffer: 4 * 1024 * 1024,
        timeout: 60_000,
      },
    );
    const corpusCompletedAt = new Date().toISOString();
    const corpusRawPath = 'docs/verification/releases/checks/raw-initial-corpus.txt';
    await mkdir(path.dirname(corpusRawPath), { recursive: true });
    await writeFile(corpusRawPath, corpusCheck.stdout + corpusCheck.stderr);
    const matrix = (await read('docs/verification/initial-release/matrix.json')) as {
      status: string;
      generatedAt: string;
      browserResults: { path: string; digest: string };
    };
    if (matrix.status !== 'passed') throw new Error('INITIAL_AUDIT_NOT_PASSED');
    const rawBrowser = await readFile(matrix.browserResults.path);
    if (fileSha(rawBrowser) !== matrix.browserResults.digest)
      throw new Error('INITIAL_BROWSER_REPORT_STALE');
    const observations: {
      problemId: string;
      browser: string;
      durationMs: number;
      preserved: boolean;
    }[] = [];
    const collect = (value: unknown): void => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      const record = value as Record<string, unknown>;
      if (record.name === 'sc012-observation' && typeof record.body === 'string')
        observations.push(
          JSON.parse(
            Buffer.from(record.body, 'base64').toString('utf8'),
          ) as (typeof observations)[number],
        );
      Object.values(record).forEach(collect);
    };
    const browserReport = JSON.parse(rawBrowser.toString('utf8')) as {
      stats: { startTime: string; duration: number };
    };
    collect(browserReport);
    const browserCompletedAt = new Date(
      Date.parse(browserReport.stats.startTime) + browserReport.stats.duration,
    ).toISOString();
    const expectedObservations = ['chromium', 'firefox', 'webkit'].flatMap((browser) =>
      ['abc212-e', 'abc315-ex', 'abc466-f', 'abc466-g'].map(
        (problemId) => `${browser}:${problemId}`,
      ),
    );
    if (
      canonicalJson(observations.map((item) => `${item.browser}:${item.problemId}`).sort()) !==
        canonicalJson(expectedObservations.sort()) ||
      observations.some(
        (item) => !item.preserved || item.durationMs < 0 || item.durationMs > 30_000,
      )
    )
      throw new Error('INITIAL_SC012_OBSERVATIONS_INCOMPLETE');
    await writeSeedJson('docs/verification/learner-outcomes/initial-release/sc-012.json', {
      schemaVersion: '1.0.0',
      criterion: 'SC-012',
      subjectDigest,
      status: 'automated_route_and_persistence_passed',
      humanTimingAccepted: false,
      limitation:
        'Browser automation measures control operations after page readiness; it does not measure human reading or human operation time.',
      routeInventory: catalog.problems.map((problem) => `/problems/${problem.id}/`),
      rawResult: matrix.browserResults,
      observations,
      retiredCriteria: { 'SC-009': 'owner-retired', 'SC-010': 'owner-retired' },
    });
    for (const [checkId, command] of INITIAL_RELEASE_CHECKS) {
      const rawResultPath =
        checkId === 'check-initial-corpus' ? corpusRawPath : matrix.browserResults.path;
      const resultPath = `docs/verification/releases/checks/${checkId}.json`;
      const check = {
        schemaVersion: '1.0.0',
        checkId,
        command,
        subjectDigest,
        exitCode: 0,
        passed: true,
        completedAt: checkId === 'check-initial-corpus' ? corpusCompletedAt : browserCompletedAt,
      };
      await writeSeedJson(resultPath, check);
      checks.push({
        ...check,
        resultPath,
        resultDigest: fileSha(await readFile(resultPath)),
        rawResultPath,
        rawResultDigest: fileSha(await readFile(rawResultPath)),
      });
    }
  }
  const references = checks.map(
    ({ schemaVersion: _schema, rawResultPath: _raw, rawResultDigest: _digest, ...check }) => {
      void _schema;
      void _raw;
      void _digest;
      return check;
    },
  );
  catalog.release.validationSummary = {
    checkCount: references.length,
    passedCheckCount: references.length,
    blockingFindingCount: 0,
    evidenceDigests: references.map((check) => check.resultDigest),
    checks: references,
  };
  const problemResults = catalog.problems.map((problem) => ({
    problemId: problem.id,
    passed: mode === 'evidence',
    findingCodes: mode === 'evidence' ? [] : ['RELEASE_CHECKS_PENDING'],
    remediation:
      mode === 'evidence' ? null : 'Run current-subject release audits before importing review.',
  }));
  const update = PublicationUpdateSchema.parse({
    schemaVersion: '2.0.0',
    updateId: INITIAL_BOOTSTRAP_ID,
    kind: 'bootstrap',
    baseReleaseVersion: null,
    contestId: null,
    sourceSetFingerprint: projection.digest,
    advancedSlotLabels: catalog.advancedSlotRegistry.labels,
    targetProblemIds: catalog.problems.map((problem) => problem.id),
    operations: [],
    authoringResults: catalog.authoringUnits.map((unit) => ({
      problemId: unit.problemId,
      slotLabel: catalog.problems.find((problem) => problem.id === unit.problemId)?.slotLabel,
      resultType: 'authoring_unit_draft',
      draftPath: unit.docPath,
      packetPath: null,
      templatePath: null,
      reasonCode: null,
      reason: null,
      retryCondition: null,
    })),
    correctionImpactIds: [],
    validationSummary: {
      checkIds: INITIAL_RELEASE_CHECKS.map(([id]) => id),
      problemResults,
      blockingFindingCount: 0,
      aggregatePassed: mode === 'evidence',
      resultDigest: canonicalDigest(problemResults),
    },
    state: 'ON_HOLD',
    createdAt,
    updatedAt: createdAt,
    fixtureMode: false,
  });
  // Prepared scope is held until genuine policy-selected review; no approval is generated here.
  await writeSeedJson(INITIAL_RELEASE_MANIFEST, manifest);
  await writeSeedJson(`staging/updates/${INITIAL_BOOTSTRAP_ID}/manifest.json`, update);
  await writeSeedJson('docs/verification/releases/catalog.json', catalog);
  await writeSeedJson(
    'docs/verification/releases/change-summary.json',
    seedReleaseSummary(catalog),
  );
  await writeSeedJson('docs/verification/releases/evidence-inventory.json', {
    subjectDigest,
    checks: references,
    reviews: [],
  });
  if (mode === 'evidence') {
    const inventory = deriveCatalogEvidenceTrustContext({ catalog, workManifest: manifest });
    await writeSeedJson('docs/reviews/human-content/initial-release/inventory.json', {
      status: 'pending_human_review',
      ...inventory,
      checks,
      lineage: [
        'docs/verification/bootstrap/us1.json',
        'docs/verification/bootstrap/learning-unit-content.json',
      ],
      agentQualityAcceptanceIsHumanApproval: false,
    });
    await writeSeedJson('docs/reviews/human-content/releases/merge-review.json', {
      status: 'pending_human_review',
      mergeApproved: false,
      subjectDigest,
      subjectFiles,
      workManifestPath: INITIAL_RELEASE_MANIFEST,
      workManifestDigest: manifest.digest,
      inventoryPath: 'docs/reviews/human-content/initial-release/inventory.json',
      requiredPolicy: manifest.reviewPolicy,
      applicableChecks: checks,
    });
  }
  return {
    status: 'prepared',
    productionReleaseApproved: false,
    subjectDigest,
    problems: 868,
    updateId: INITIAL_BOOTSTRAP_ID,
    cutoffAt: catalog.release.cutoffAt,
    mode,
  };
};
