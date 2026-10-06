import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { discoverContests } from '../update-abc/discover.js';
import { acquireOfficialMetadata } from '../update-abc/acquire.js';
import { prepareAuthoringResults } from '../update-abc/author.js';
import { stagePublicationUpdate } from '../update-abc/stage.js';
import { validatePreparedUpdate } from '../update-abc/validate.js';
import { GitDeploymentAdapter } from '../../src/lib/deployment/git-deployment-adapter.js';
import type { ReleaseMetadata } from '../../src/lib/domain/schema-parts/release.js';
import { exportLearningRecords } from '../../src/lib/learning-records/export.js';
import { applyLearningRecordImport } from '../../src/lib/learning-records/import-apply.js';
import { previewLearningRecordImport } from '../../src/lib/learning-records/import-preview.js';
import { InMemoryLearningRecordDatabase } from '../../tests/fixtures/in-memory-learning-record-database.js';
import { assertAudit, type FullProjection } from './initial-release-audits.js';

const exec = promisify(execFile);

/** Uses real shared update and backup functions and real temporary Git commits.
 * Source acquisition and the hosting target are offline fixtures; neither is production. */
export const simulateZeroCostYear = async (projection: FullProjection) => {
  const root = await mkdtemp(path.join(tmpdir(), 'abc-zero-cost-year-'));
  const git = async (args: string[]) => (await exec('git', args, { cwd: root })).stdout.trim();
  const records = projection.ui.problems.slice(0, 120).map((problem) => ({
    problemId: problem.id,
    status: 'completed' as const,
    statusUpdatedAt: '2026-07-29T10:00:00+09:00',
    needsReview: true,
    needsReviewUpdatedAt: '2026-07-29T11:00:00+09:00',
  }));
  const ids = new Set(projection.ui.problems.map((problem) => problem.id));
  const database = new InMemoryLearningRecordDatabase(records);
  const histories = new Map<string, ReleaseMetadata>();
  let deployed = '';
  const adapter = new GitDeploymentAdapter(root, {
    getDeployment: (commit) => Promise.resolve(histories.get(commit)),
    deployCommit: async ({ release }) => {
      deployed = await git(['show', `${release.commit}:site.json`]);
      await writeFile(path.join(root, 'served.json'), deployed);
      histories.set(release.commit, release);
      return { deploymentUrl: `https://localhost/simulation/${release.commit}` };
    },
  });
  const weeks = [];
  const skill = projection.catalog.authoringUnits[0];
  if (!skill) throw new Error('SIMULATION_SKILL_MISSING');
  try {
    await git(['init']);
    await git(['config', 'user.name', 'Offline simulation']);
    await git(['config', 'user.email', 'simulation@example.test']);
    let previousCommit: string | undefined;
    let previousContent: string | undefined;
    for (let week = 0; week < 52; week++) {
      const endedAt = new Date(Date.UTC(2027, 0, 2 + 7 * week, 13, 40)).toISOString();
      const contest = {
        contestId: `abc${String(500 + week)}`,
        startsAt: new Date(Date.parse(endedAt) - 100 * 60_000).toISOString(),
        endsAt: endedAt,
        tasks: ['A', 'D', 'E', 'F', 'G', 'I', 'Ex'].map((label) => ({
          label,
          sourceRevisionId: `source-simulation-${String(week)}-${label.toLowerCase()}`,
        })),
      };
      const discovered = discoverContests({
        contests: [contest],
        mode: 'latest-ended',
        now: endedAt,
      });
      assertAudit(discovered.length === 1, 'AUDIT_WEEKLY_DISCOVERY');
      const acquired = await acquireOfficialMetadata(contest);
      assertAudit(
        acquired.status === 'acquired' && acquired.problemIds.length === 5,
        'AUDIT_WEEKLY_ACQUISITION',
      );
      const authoring = prepareAuthoringResults({
        skill: {
          name: 'abc-explanation-author',
          version: skill.skill.version,
          digest: skill.skill.digest,
        },
        targets: acquired.problemIds.map((problemId, index) => ({
          problemId,
          slotLabel: acquired.advancedSlotLabels[index] ?? '',
          draftPath: `staging/simulation/${problemId}.md`,
        })),
      });
      assertAudit(
        authoring.every((result) => result.resultType === 'authoring_unit_draft'),
        'AUDIT_WEEKLY_AUTHORING',
      );
      const input = {
        previewId: 'zero-cost-simulation',
        contestId: contest.contestId,
        sourceSetFingerprint: acquired.sourceSetFingerprint,
        targetProblemIds: acquired.problemIds,
        operations: acquired.problemIds.map((problemId) => ({
          entityType: 'problem' as const,
          entityId: problemId,
          action: 'add' as const,
          path: `staging/previews/zero-cost-simulation/${problemId}.json`,
          beforeDigest: null,
          afterDigest: canonicalDigest({ problemId, source: acquired.sourceSetFingerprint }),
          affectedProblemIds: [problemId],
        })),
      };
      const staged = stagePublicationUpdate(input);
      assertAudit(
        canonicalDigest(staged) === canonicalDigest(stagePublicationUpdate(input)),
        'AUDIT_WEEKLY_IDEMPOTENCY',
      );
      const validation = validatePreparedUpdate({
        problems: acquired.problemIds.map((problemId) => ({
          problemId,
          sourceAvailable: true,
          explanationComplete: true,
          examplesValid: true,
          placementIds: ['placement-simulation'],
          crossReferencesValid: true,
        })),
        taxonomyEdges: [],
        reachableProblemIds: acquired.problemIds,
        indexedProblemIds: acquired.problemIds,
        catalogProblemIds: acquired.problemIds,
      });
      assertAudit(validation.aggregatePassed, 'AUDIT_WEEKLY_VALIDATION');
      const content = JSON.stringify({ week: week + 1, staged, authoring, validation });
      await writeFile(path.join(root, 'site.json'), content);
      await git(['add', 'site.json']);
      await git([
        '-c',
        `user.name=Offline simulation`,
        'commit',
        '-m',
        `simulation week ${String(week + 1)}`,
      ]);
      const commit = await git(['rev-parse', 'HEAD']);
      const release: ReleaseMetadata = {
        schemaVersion: '1.0.0',
        version: endedAt.slice(0, 10).replaceAll('-', '.'),
        cutoffAt: endedAt,
        commit,
        changeSummary: {
          updateIds: [staged.updateId],
          addedProblemIds: [...acquired.problemIds],
          changedProblemIds: [],
          withdrawnProblemIds: [],
          taxonomyChanges: [],
        },
        validationResultsUrl: 'https://localhost/simulation/checks',
      };
      await adapter.deploy(release);
      assertAudit(
        deployed === content &&
          (await readFile(path.join(root, 'served.json'), 'utf8')) === content,
        'AUDIT_WEEKLY_STATIC_DEPLOY',
      );
      if (previousCommit) {
        await adapter.rollback(previousCommit);
        assertAudit(deployed === previousContent, 'AUDIT_WEEKLY_ROLLBACK');
        await adapter.deploy(release);
      }
      const backup = await exportLearningRecords(database, {
        catalogVersion: release.version,
        catalogProblemIds: ids,
        exportedAt: endedAt,
      });
      const restored = new InMemoryLearningRecordDatabase();
      await applyLearningRecordImport(
        restored,
        previewLearningRecordImport(backup, [], ids),
        'newer-wins',
      );
      assertAudit(
        canonicalDigest(
          [...restored.records.values()].sort((a, b) =>
            a.problemId.localeCompare(b.problemId, 'en'),
          ),
        ) ===
          canonicalDigest(
            [...records].sort((a, b) => a.problemId.localeCompare(b.problemId, 'en')),
          ),
        'AUDIT_WEEKLY_BACKUP',
      );
      weeks.push({
        week: week + 1,
        endedAt,
        updateId: staged.updateId,
        inputDigest: staged.inputDigest,
        validationDigest: validation.resultDigest,
        servedDigest: canonicalDigest(deployed),
        backupDigest: canonicalDigest(backup),
        restoredRecordCount: restored.records.size,
        rollbackPassed: week > 0,
        requiredCostJPY: 0,
      });
      previousCommit = commit;
      previousContent = content;
    }
    assertAudit(
      histories.size === 52 && new Set(weeks.map((week) => week.updateId)).size === 52,
      'AUDIT_52_WEEKS',
    );
    return {
      generatorVersion: 'zero-cost-year-v1',
      weeks,
      totalRequiredCostJPY: 0,
      model: {
        acquisition: 'offline official task fixtures with no paid API',
        preparation: 'local shared CLI functions',
        review:
          'maintainer time; automatic validation plus simulated review, no human approval asserted',
        merge: 'temporary local Git commits',
        deployment: 'local static target, no hosting subscription',
        backup: 'local JSON',
      },
      excludedExistingCosts: ['existing computer', 'electricity', 'ordinary internet access'],
      optionalServicesRequired: false,
      productionApproval: false,
      limitations:
        'This deterministic simulation verifies the local zero-cost path and rollback/backup interfaces. It does not guarantee future hosting prices, live source availability, or completion of new prose by a paid generator.',
    };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};
