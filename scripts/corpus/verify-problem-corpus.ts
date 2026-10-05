import { execFile } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import prettier from 'prettier';

import {
  PROBLEM_SHARD_INDEX_PATH,
  type ProblemShardIndex,
} from '../../src/lib/authoring/problem-shard-index.js';
import {
  readShardJson,
  shardFileDigest,
  verifyFrozenProblemShardContext,
} from '../../src/lib/authoring/problem-shard-context.js';
import { readProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import {
  resolveProblemLocator,
  assertCurrentAgentQualityReview,
  buildProblemOutcomeCoverage,
  validateJoinedProblemDocuments,
  type JoinedProblemDocument,
} from '../../src/lib/authoring/verify-problem-corpus.js';
import { buildProblemContent } from '../../src/lib/catalog/build-problem-content.js';
import { canonicalDigest, digestWithoutField } from '../../src/lib/domain/canonical-json.js';
import { GlossarySchema } from '../../src/lib/domain/schema-parts/catalog.js';

const run = promisify(execFile);
const ROOT = 'docs/verification/bootstrap';
const REVIEW_ROOT = 'docs/reviews/human-content/bootstrap/problem-authoring-units';
const mode = process.argv[2] ?? '--check';
if (process.argv.length > 3 || !['--check', '--write'].includes(mode)) {
  console.error('Usage: verify-problem-corpus [--check | --write]');
  process.exitCode = 64;
} else {
  try {
    // Each existing shard is rebuilt in memory and independently compared with its evidence
    // before any joined output is constructed. No canonical/index/private artifact is changed.
    const commands = [];
    for (const script of ['author-problem-shards', 'verify-full-learning-units']) {
      const commandArgs = ['--import', 'tsx', `scripts/corpus/${script}.ts`, '--check'];
      const { stdout } = await run(process.execPath, commandArgs, { maxBuffer: 4 * 1024 * 1024 });
      commands.push({
        command: `node ${commandArgs.join(' ')}`,
        exitCode: 0,
        observed: stdout.trim(),
        digest: shardFileDigest(stdout),
      });
      console.error(`${script}: passed`);
    }
    const index = await readShardJson<ProblemShardIndex>(PROBLEM_SHARD_INDEX_PATH);
    const context = await verifyFrozenProblemShardContext(index);
    const glossary = GlossarySchema.parse(await readShardJson('src/content/glossary/terms.json'));
    const learningContent = await readShardJson<{ subjectDigest: string }>(
      `${ROOT}/learning-unit-content.json`,
    );
    const documents: (JoinedProblemDocument & { digest: string })[] = [];
    const shards = [];
    const inputs = [];
    for (const shard of index.shards) {
      const manifest = await readShardJson<{ digest: string }>(`${shard.workPath}/manifest.json`);
      const input = await readShardJson<{ packets: unknown[] }>(`${shard.workPath}/input.json`);
      const checks = await readShardJson<{ subjectDigest: string }>(
        `${shard.workPath}/checks.json`,
      );
      const review = await readShardJson<{
        subjectDigest: string;
        authoringHolds: string[];
        riskReasons: string[];
        sourceVerifications: unknown[];
        reviewItems: { problemId: string; path: string; learningOutcomeIds: string[] }[];
      }>(`${shard.workPath}/review.json`);
      if (review.authoringHolds.length)
        throw new Error(`PROBLEM_JOIN_AUTHORING_HOLD:${shard.shardId}`);
      const shardDocuments = [];
      for (const path of shard.documentPaths) {
        const text = await readFile(path, 'utf8');
        const parsed = readProblemAuthoringDocument(text);
        const document = {
          unit: parsed.unit,
          path,
          body: parsed.body,
          digest: shardFileDigest(text),
        };
        documents.push(document);
        shardDocuments.push({
          problemId: parsed.unit.problemId,
          path,
          digest: document.digest,
          contentLocators: {
            claim: {
              ownerType: 'problem',
              problemId: parsed.unit.problemId,
              path,
              key: 'correctness',
            },
          },
          sourceRevisionIds: parsed.unit.sourceRevisionIds,
          learningOutcomeIds: parsed.unit.learningOutcomeIds,
        });
      }
      // The independent verifier has already checked all current artifact contents. Bind the
      // join to that same subject rather than trusting a stored "passed" flag.
      const subjectDigest = canonicalDigest({
        indexDigest: index.indexDigest,
        manifestDigest: manifest.digest,
        documents: shardDocuments,
        inputPackets: input.packets,
      });
      if (subjectDigest !== checks.subjectDigest || subjectDigest !== review.subjectDigest)
        throw new Error(`PROBLEM_JOIN_SHARD_SUBJECT:${shard.shardId}`);
      const outcomeIds = [...new Set(shardDocuments.flatMap((d) => d.learningOutcomeIds))].sort();
      shards.push({
        shardId: shard.shardId,
        domain: shard.domain,
        primaryOutcomeId: shard.primaryOutcomeId,
        subjectDigest,
        problemIds: shard.problemIds,
        learningOutcomeIds: outcomeIds,
        status: 'passed',
        riskReasons: review.riskReasons,
        sourceVerifications: review.sourceVerifications,
        reviewInventoryDigest: canonicalDigest(review),
      });
      inputs.push({
        shardId: shard.shardId,
        subjectDigest,
        manifestDigest: manifest.digest,
        checksDigest: canonicalDigest(checks),
        reviewDigest: canonicalDigest(review),
      });
    }
    const discoveredPaths = (await readdir('src/content/docs/problems', { recursive: true }))
      .filter((p) => p.endsWith('.md'))
      .map((p) => `src/content/docs/problems/${p}`)
      .sort();
    validateJoinedProblemDocuments({
      expectedDocuments: index.shards.flatMap((s) =>
        s.problemIds.map((problemId, i) => ({ problemId, path: s.documentPaths[i] ?? '' })),
      ),
      documents,
      discoveredPaths,
    });
    const projection = buildProblemContent({
      problemIds: context.context.corpus.problems.map((p) => p.entity.id),
      documents: documents.map((d) => d.unit),
      placements: context.policy.placements,
      units: context.units,
    });
    const subjectDigest = canonicalDigest({
      indexDigest: index.indexDigest,
      learningUnitSubjectDigest: learningContent.subjectDigest,
      skill: context.skill,
      glossaryDigest: glossary.digest,
      inputs,
      projectionDigest: canonicalDigest(projection),
    });

    // Re-run the independent finite-model regressions from the corpus prose reviews.
    // They test boundaries/coefficients/order against a different model, not a second copy
    // of the prose algorithm. They support, but do not replace, the general proofs.
    const mathematicalChecks = [];
    const files = (await readdir(ROOT))
      .filter((p) => /^pr65-(?:review\d+-)?mathematical-checks\.py$/u.test(p))
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    if (files.length !== 20) throw new Error('PROBLEM_JOIN_MATHEMATICAL_REGRESSION_INVENTORY');
    for (const file of files) {
      const path = `${ROOT}/${file}`;
      const { stdout, stderr } = await run('python3', [path], { maxBuffer: 4 * 1024 * 1024 });
      mathematicalChecks.push({
        path,
        scriptDigest: shardFileDigest(await readFile(path, 'utf8')),
        exitCode: 0,
        observed: stdout.trim(),
        stderr: stderr.trim(),
        resultDigest: shardFileDigest(stdout + stderr),
      });
      console.error(`${file}: passed`);
    }
    const proseReviews = [];
    for (const file of (await readdir(ROOT))
      .filter((p) => /^pr65-review(?:\d+)?-corrections\.md$/u.test(p))
      .sort()) {
      const path = `${ROOT}/${file}`;
      proseReviews.push({ path, digest: shardFileDigest(await readFile(path, 'utf8')) });
    }
    const qualityReviewPath = 'docs/reviews/agent-content/bootstrap/problem-corpus-quality.json';
    const qualityReview = await readShardJson<{
      subjectDigest: string;
      reviewMode: string;
      status: string;
      unresolvedFindingCount: number;
    }>(qualityReviewPath);
    assertCurrentAgentQualityReview(qualityReview, subjectDigest);
    const qualityReviewDigest = canonicalDigest(qualityReview);
    const qualityBasisDigest = canonicalDigest({
      mathematicalChecks,
      proseReviews,
      qualityReviewDigest,
    });
    const policy = {
      decisionSource: 'owner_instruction_issue_48',
      reviewMode: 'agent_quality_review',
      humanApproval: false,
      humanReviewRequired: false,
      sc009Required: false,
      reason:
        '個人用教材として本人の自己評価・承認ゲートを今回の要件から外し、本文の品質と全件検証で受け入れる。',
      scope:
        'T072–T078 initial Problem corpus acceptance. No production merge/deploy approval is asserted.',
    };
    const evidence = (value: Record<string, unknown>) => {
      const result = {
        schemaVersion: '1.0.0',
        subjectDigest,
        indexDigest: index.indexDigest,
        ...value,
      };
      return { ...result, evidenceDigest: canonicalDigest(result) };
    };
    const artifacts: { path: string; value: unknown }[] = [];
    const emit = (path: string, value: unknown) => artifacts.push({ path, value });
    const byProblem = new Map(documents.map((d) => [d.unit.problemId, d]));
    const examples = documents.flatMap((d) =>
      d.unit.examples.map((example) => ({
        ownerType: 'problem',
        problemId: d.unit.problemId,
        path: d.path,
        exampleKey: example.key,
        ...example,
      })),
    );
    const unitExamples = context.units.flatMap((u) =>
      u.examples.map((example) => ({
        ownerType: 'learning_unit',
        learningUnitId: u.id,
        path: u.docPath,
        exampleKey: example.key,
        ...example,
      })),
    );
    // Current accepted corpus has no executable blocks. Refuse future additions until their
    // declared environment, input, procedure and observed result are actually executed.
    if (examples.length || unitExamples.length)
      throw new Error('PROBLEM_JOIN_NEW_EXAMPLE_EXECUTION_OR_REVIEW_REQUIRED');
    emit(
      `${ROOT}/examples.json`,
      evidence({
        status: 'not_applicable',
        executableCount: 0,
        items: [],
        basis:
          '全Problem/Unitのowner付きinventoryと本文fenceを確認。実行例は0件。text fenceは考察中の疑似コードであり実行成功を主張しない。',
        owners: documents.map((d) => ({
          ownerType: 'problem',
          problemId: d.unit.problemId,
          path: d.path,
          example: { status: 'not_applicable', reason: 'No example block.' },
          answer: { status: 'not_applicable', reason: 'No exercise/answer block.' },
        })),
      }),
    );
    const abbreviated = context.policy.placements.filter((p) => p.kind !== 'full');
    if (abbreviated.length) throw new Error('PROBLEM_JOIN_NON_FULL_REASSESSMENT_REQUIRED');
    emit(
      `${ROOT}/problem-placement-reassessment.json`,
      evidence({
        status: 'passed',
        placementDigest: index.inputs.placementDigest,
        taxonomyEvidencePath: `${ROOT}/problem-placements.json`,
        fullCount: documents.length,
        nonFullCount: 0,
        items: [],
        dimensions: [
          'algorithm',
          'proof',
          'complexity',
          'constraints',
          'prerequisites',
          'implementation',
          'learning_outcomes',
        ],
        basis:
          '全868問が独立full本文。Unit/tagの類似を省略根拠にせず、非fullが追加されたら比較と独立full primaryの証跡を要求する。',
      }),
    );
    const correctionImpacts = context.policy.correctionImpacts.map((impact) => ({
      id: impact.id,
      targets: impact.affectedContentLocators.map((locator) => {
        if (locator.ownerType === 'problem') {
          const document = byProblem.get(locator.problemId);
          if (!document) throw new Error(`PROBLEM_JOIN_CORRECTION_OWNER:${locator.problemId}`);
          if (resolveProblemLocator(document.unit, locator.path))
            return {
              locator,
              status: 'verified',
              documentPath: document.path,
              documentDigest: document.digest,
            };
          // T049's preview placeholders were deliberately removed in #47. Their absence is
          // checked on the actual owner; never invent an example/answer to satisfy the locator.
          if (
            [
              'examples.taxonomy-integration',
              'exercises.taxonomy-integration',
              'exercises.taxonomy-integration.answer',
            ].includes(locator.path) &&
            !document.unit.examples.length &&
            !document.unit.exercises.length
          )
            return {
              locator,
              status: 'not_applicable',
              documentPath: document.path,
              documentDigest: document.digest,
              reason:
                'T049 preview-only optional block retired by the #47/#48 owner writing policy; current owner has no examples/exercises. T160 must account for this retirement when rebinding indexes.',
            };
          throw new Error(`PROBLEM_JOIN_CORRECTION_TARGET:${locator.problemId}:${locator.path}`);
        }
        if (locator.ownerType === 'learning_unit') {
          const unit = context.units.find((u) => u.id === locator.learningUnitId);
          if (!unit || locator.path !== 'content')
            throw new Error(`PROBLEM_JOIN_CORRECTION_UNIT:${locator.learningUnitId}`);
          return { locator, status: 'verified', documentPath: unit.docPath };
        }
        return { locator, status: 'verified' };
      }),
      derivedIndexes: impact.derivedIndexPaths.map((path) => ({
        path,
        status: 'pending',
        ownerTaskId: 'T160',
      })),
      status: 'pending',
    }));
    const documentInventory = documents.map((d) => ({
      problemId: d.unit.problemId,
      path: d.path,
      digest: d.digest,
      claimLocators: d.unit.claims.map((c) => ({
        ownerType: 'problem',
        problemId: d.unit.problemId,
        path: d.path,
        key: c.key,
      })),
      sourceRevisionIds: d.unit.sourceRevisionIds,
      learningOutcomeIds: d.unit.learningOutcomeIds,
    }));
    emit(
      `${ROOT}/problem-authoring-units.json`,
      evidence({
        status: 'passed',
        problemCount: documents.length,
        duplicateProblemCount: 0,
        orphanProblemCount: 0,
        discoveredDocumentCount: discoveredPaths.length,
        skill: context.skill,
        glossaryDigest: glossary.digest,
        documents: documentInventory,
        correctionImpacts,
        publication: { status: 'pending', ownerTaskId: 'T160' },
      }),
    );
    emit(
      `${ROOT}/problem-authoring-unit-shards.json`,
      evidence({ status: 'passed', shardCount: shards.length, shards }),
    );
    emit(
      `${ROOT}/problem-content-projection.json`,
      evidence({
        status: 'passed',
        projectionDigest: canonicalDigest(projection),
        items: projection,
        publicPipelineSwitch: 'pending_T160',
      }),
    );
    emit(
      `${ROOT}/problem-corpus-check-results.json`,
      evidence({
        status: 'passed',
        runtime: { node: process.version, pythonMinimum: '3.9' },
        commands,
        mathematicalChecks,
        proseReviews,
        qualityBasisDigest,
        qualityReviewPath,
        qualityReviewDigest,
        limitations:
          'Finite regression checks do not prove arbitrary-input correctness. General arguments remain in the source-bound Problem prose and the tracked full-corpus prose reviews.',
      }),
    );
    for (const shard of shards) {
      emit(
        `${REVIEW_ROOT}/${shard.shardId}.json`,
        evidence({
          shardId: shard.shardId,
          shardSubjectDigest: shard.subjectDigest,
          status: 'accepted',
          policy,
          riskReasons: shard.riskReasons,
          sourceVerifications: shard.sourceVerifications,
          priorReviewInventoryDigest: shard.reviewInventoryDigest,
          qualityBasisDigest,
          basis: [
            'current_subject_independent_shard_verification',
            'tracked_full_corpus_prose_review_and_corrections',
            'independent_mathematical_regressions',
            'claim_body_and_source_binding',
            'primary_outcome_home_coverage_related_reading_order',
          ],
          items: shard.problemIds.map((id) => ({
            problemId: id,
            documentDigest: byProblem.get(id)?.digest ?? '',
            learningOutcomeIds: byProblem.get(id)?.unit.learningOutcomeIds ?? [],
            status: 'accepted',
          })),
          unresolvedFindingCount: 0,
        }),
      );
    }
    emit('docs/verification/learner-outcomes/bootstrap/sc-009.json', {
      schemaVersion: '3.0.0',
      criterionId: 'SC-009',
      status: 'not_required_by_owner',
      scope: 'initial_problem_corpus',
      decisionSource: 'owner_instruction_issue_48',
      reason: policy.reason,
      replacementEvidencePaths: [
        `${ROOT}/problem-authoring-units.json`,
        `${ROOT}/problem-corpus-check-results.json`,
        `${ROOT}/us1.json`,
      ],
    });
    const acceptance = evidence({
      status: 'accepted',
      policy,
      problemCount: documents.length,
      shardCount: shards.length,
      outcomeCoverage: buildProblemOutcomeCoverage({
        outcomes: context.outcomes,
        units: context.units,
        placements: context.policy.placements,
      }),
      learningOutcomeIds: context.outcomes.map((o) => o.id).sort(),
      problemDeclaredOutcomeIds: [
        ...new Set(documentInventory.flatMap((d) => d.learningOutcomeIds)),
      ].sort(),
      qualityBasisDigest,
      fullVerificationCommand: 'npm run verify:fast',
      fullVerificationEvidencePath: `${ROOT}/problem-corpus-verify-fast.json`,
      acceptanceMatrix: ['T072', 'T073', 'T074', 'T075', 'T076', 'T077', 'T078'].map((taskId) => ({
        taskId,
        status: taskId === 'T077' ? 'not_required_by_owner' : 'passed',
      })),
      unresolvedFindingCount: 0,
      publicProjection: 'pending_T160',
      correctionImpactStatus: 'pending_T160',
    });
    emit(`${ROOT}/us1.json`, acceptance);
    emit(
      'docs/reviews/human-content/bootstrap/us1/merge-review.json',
      evidence({
        status: 'content_accepted',
        reviewMode: 'agent_quality_review',
        humanApproval: false,
        mergeApproved: false,
        policy,
        acceptanceDigest: acceptance.evidenceDigest,
        basis:
          'Current corpus quality acceptance under the owner instruction; not a HumanContentReviewEvidence/MergeReviewEvidence or a production release approval.',
      }),
    );
    for (const artifact of artifacts) {
      if (mode === '--write') {
        await mkdir(artifact.path.slice(0, artifact.path.lastIndexOf('/')), { recursive: true });
        await writeFile(
          artifact.path,
          await prettier.format(JSON.stringify(artifact.value), {
            ...(await prettier.resolveConfig(artifact.path)),
            filepath: artifact.path,
          }),
        );
      } else {
        const actual = await readShardJson<Record<string, unknown>>(artifact.path);
        // Node's supported patch version may differ on CI. It is execution metadata, not content.
        if (artifact.path.endsWith('problem-corpus-check-results.json')) {
          const expected = artifact.value as Record<string, unknown>;
          const runtime = actual.runtime;
          const current: Record<string, unknown> = { ...expected, runtime };
          current.evidenceDigest = digestWithoutField(current, 'evidenceDigest');
          if (canonicalDigest(actual) !== canonicalDigest(current))
            throw new Error(`PROBLEM_JOIN_EVIDENCE_STALE:${artifact.path}`);
        } else if (canonicalDigest(actual) !== canonicalDigest(artifact.value))
          throw new Error(`PROBLEM_JOIN_EVIDENCE_STALE:${artifact.path}`);
      }
    }
    console.log(
      JSON.stringify({
        status: 'accepted',
        subjectDigest,
        indexDigest: index.indexDigest,
        shards: shards.length,
        problems: documents.length,
        mathematicalRegressions: mathematicalChecks.length,
        reviewMode: policy.reviewMode,
        publicProjection: 'pending_T160',
      }),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
