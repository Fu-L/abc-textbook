import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { materializeObservedMetadataBatch } from '../../src/lib/corpus/materialization.js';
import type { CorpusMetadataBatch } from '../../src/lib/corpus/types.js';
import {
  LearningUnitSchema,
  LearningOutcomeSchema,
} from '../../src/lib/domain/schema-parts/catalog.js';
import { renderProblemAuthoringDocument } from '../../src/lib/authoring/problem-authoring-document.js';
import { ProblemAuthoringUnitSchema } from '../../src/lib/domain/schema-parts/authoring-unit.js';
import { shardFileDigest } from '../../src/lib/authoring/problem-shard-context.js';
import { CATCH_UP_ROOT, UpdateAuthoringSchema, writeUpdateJson } from './catch-up.js';
import { parseKeyValueArguments, requiredArgument } from '../corpus/cli-support.js';

/** Deterministic packaging of reviewed, individually authored prose; no text generation. */
const ProseSchema = z.strictObject({
  problemId: z.string(),
  homeUnitId: z.string(),
  reasoning: z.string().min(1),
  correctness: z.string().min(1),
  time: z.string().min(1),
  space: z.string().min(1),
  technique: z.string().min(1),
  problemSpecificElements: z.string().min(1),
  implementationNotes: z.string().min(1),
  reviewAdvice: z.string().min(1),
});
const primaryOverrides: Record<string, string> = {
  'abc467-e': 'outcome-partition-at-critical-integer-boundaries',
  'abc468-g': 'outcome-formulate-combinatorial-coefficients',
  'abc469-f': 'outcome-construct-optimal-spanning-tree',
  'abc470-e': 'outcome-solve-stochastic-recurrence',
  'abc470-f': 'outcome-augment-components-with-metadata',
  'abc472-e': 'outcome-color-and-classify-bipartite-components',
  'abc475-f': 'outcome-normalize-equivalent-states',
  'abc477-e': 'outcome-model-and-compute-shortest-path',
};
const supportingUnits: Record<string, string[]> = {
  'abc467-f': ['unit-greedy-exchange'],
  'abc469-f': ['unit-prime-divisor'],
  'abc470-f': ['unit-combinatorial-coefficients'],
  'abc473-g': ['unit-dp-stochastic'],
  'abc476-f': ['unit-contribution-reordering'],
  'abc476-g': ['unit-combinatorial-coefficients'],
  'abc477-f': ['unit-range-actions'],
  'abc477-g': ['unit-tree-euler-flattening', 'unit-tree-ancestor-lca'],
};

try {
  const args = parseKeyValueArguments(process.argv.slice(2), ['--contest']);
  const contestId = requiredArgument(args, '--contest');
  const artifact = JSON.parse(
    await readFile(`${CATCH_UP_ROOT}/metadata/${contestId}.json`, 'utf8'),
  ) as CorpusMetadataBatch;
  const metadata = materializeObservedMetadataBatch(artifact);
  const skill = (
    JSON.parse(
      await readFile('docs/verification/bootstrap/problem-authoring-units.json', 'utf8'),
    ) as { skill: { name: string; version: string; digest: string } }
  ).skill;
  const items = [];
  for (const problem of metadata.problems) {
    const prose = ProseSchema.parse(
      JSON.parse(await readFile(`${CATCH_UP_ROOT}/prose/${problem.id}.json`, 'utf8')) as unknown,
    );
    if (prose.problemId !== problem.id) throw new Error('AUTHOR_PROSE_IDENTITY');
    const unit = LearningUnitSchema.parse(
      JSON.parse(
        await readFile(`src/content/learning-units/${prose.homeUnitId}.json`, 'utf8'),
      ) as unknown,
    );
    const primaryOutcomeId = primaryOverrides[problem.id] ?? unit.ownedLearningOutcomeIds?.[0];
    if (!primaryOutcomeId || !unit.ownedLearningOutcomeIds?.includes(primaryOutcomeId))
      throw new Error('AUTHOR_OUTCOME_OWNER');
    const support = await Promise.all(
      (supportingUnits[problem.id] ?? []).map(async (id) =>
        LearningUnitSchema.parse(
          JSON.parse(await readFile(`src/content/learning-units/${id}.json`, 'utf8')) as unknown,
        ),
      ),
    );
    const supportOutcomes = support.map(
      (u) =>
        u.ownedLearningOutcomeIds?.find(
          (id) => id === 'outcome-formulate-combinatorial-coefficients',
        ) ??
        u.ownedLearningOutcomeIds?.find(
          (id) => id === 'outcome-propagate-probability-distribution',
        ) ??
        u.ownedLearningOutcomeIds?.[0],
    );
    if (supportOutcomes.some((id) => !id)) throw new Error('AUTHOR_SUPPORT_OWNER');
    const outcomes = [primaryOutcomeId, ...(supportOutcomes as string[])];
    const primaryTags = unit.ownedTagIds ?? [];
    const supportingTags = support.flatMap((u) => u.ownedTagIds ?? []);
    const tags = [...primaryTags, ...supportingTags];
    const sourceIds = [...problem.sourceRevisionIds];
    const evidenceId = `evidence-${problem.id}-solution`;
    const evidenceIds = [evidenceId];
    const claim = (text: string) => ({ text, evidenceIds });
    const inventory = {
      problemId: problem.id,
      sourceRevisionIds: sourceIds,
      evidence: [
        {
          id: evidenceId,
          sourceRevisionIds: sourceIds,
          rationale: `公式制約と解法の根拠を照合し、${prose.problemSpecificElements}`,
        },
      ],
      reasoningPath: {
        observations: [claim(prose.reasoning.split('\n\n')[0] ?? prose.reasoning)],
        candidateApproaches: [
          {
            approach: prose.technique,
            decision: 'adopted',
            decisionReason: prose.correctness,
            evidenceIds,
          },
        ],
        keyInsights: [claim(prose.problemSpecificElements)],
        algorithmConnection: claim(prose.reasoning),
      },
      typicalTechniques: [
        { name: unit.title, trigger: prose.technique, application: prose.reasoning, evidenceIds },
      ],
      problemSpecificInsights: [
        {
          insight: prose.problemSpecificElements,
          reusablePerspective: prose.reviewAdvice,
          evidenceIds,
        },
      ],
      asymptoticComplexity: { time: prose.time, space: prose.space, evidenceIds },
      prerequisiteCandidates: [],
      implementationConcerns: [claim(prose.implementationNotes)],
      outcomeCandidates: [claim(prose.technique)],
      reviewAdvice: [claim(prose.reviewAdvice)],
      authorId: 'person-codex',
      reviewStatus: 'reviewed',
      reviewFindings: [],
    };
    const pointer = (claimPath: string) => ({
      problemId: problem.id,
      claimPath,
      evidenceIds,
      sourceRevisionIds: sourceIds,
    });
    const dispositions = [
      ...[
        '/reasoningPath/keyInsights/0',
        '/reasoningPath/algorithmConnection',
        '/typicalTechniques/0',
        '/outcomeCandidates/0',
      ].map((p) => ({
        claimRef: pointer(p),
        kind: 'primary',
        tagIds: primaryTags,
        rationale: prose.technique,
      })),
      ...[
        '/reasoningPath/observations/0',
        '/reasoningPath/candidateApproaches/0',
        '/problemSpecificInsights/0',
        '/asymptoticComplexity',
        '/implementationConcerns/0',
        '/reviewAdvice/0',
      ].map((p) => ({
        claimRef: pointer(p),
        kind: 'problem_specific',
        tagIds: [],
        rationale: prose.problemSpecificElements,
      })),
    ];
    const placement = {
      id: `placement-${problem.id}`,
      problemId: problem.id,
      policyVersion: '1.0.0',
      kind: 'full',
      primaryProblemId: null,
      sharedOutcomeIds: [],
      comparison: {
        method: prose.technique,
        proof: prose.correctness,
        complexity: prose.time,
        constraints: problem.constraintsSummary,
        prerequisites: unit.title,
        implementation: prose.implementationNotes,
      },
      additionalElement: null,
      rationale: `${prose.reviewAdvice} 主たる学習成果を「${unit.title}」に置き、この問題の導出と正当性を独立した全文解説として残す。`,
      evidenceIds,
      primaryTagIds: primaryTags,
      supportingTagIds: supportingTags,
      primaryOutcomeId,
      additionalPrimaryOutcomeIds: [],
      supportingOutcomeIds: supportOutcomes,
      adHocElements: [prose.problemSpecificElements],
      claimDispositions: dispositions,
      analysisEvidenceRefs: dispositions.map((d) => d.claimRef),
    };
    const documentPath = `src/content/docs/problems/updates/${problem.id}.md`;
    const packet = {
      problemId: problem.id,
      learningOutcomeIds: outcomes,
      baseline: { id: unit.baselineId, version: unit.baselineVersion },
      additionalPrerequisiteUnitIds: [],
      excludedTopics: [],
      tagIds: tags,
      constraints: [problem.constraintsSummary],
      placementCandidate: { primaryProblemId: null, comparison: null, additionalElement: null },
      technicalClaims: [{ text: prose.correctness, sourceRevisionIds: sourceIds }],
      sources: metadata.sources
        .filter((s) => sourceIds.includes(s.id))
        .map((s) => ({
          sourceRevisionId: s.id,
          path: `src/content/sources/updates/${s.id}.json`,
          sourceKind: s.sourceKind,
          officialTaskId: s.officialTaskId,
          checkedAt: s.checkedAt,
          termsCheckedAt: s.termsCheckedAt,
          allowedUses: [
            'constraint_reference',
            'technical_claim',
            'example_verification',
            'answer_verification',
          ],
        })),
      skill,
    };
    const document = ProblemAuthoringUnitSchema.parse({
      problemId: problem.id,
      docPath: documentPath,
      learningOutcomeIds: outcomes,
      baselineId: unit.baselineId,
      baselineVersion: unit.baselineVersion,
      additionalPrerequisiteUnitIds: [],
      excludedTopics: [],
      tagIds: tags,
      sourceRevisionIds: sourceIds,
      skill,
      revision: 1,
      claims: [
        {
          key: 'correctness',
          text: prose.correctness,
          sourceRevisionIds: sourceIds,
          authorId: 'person-codex',
          verificationStatus: 'verified',
        },
      ],
      examples: [],
      exercises: [],
      kind: 'full',
      primaryProblemId: null,
      differenceSummary: null,
      sections: {
        reasoning: prose.reasoning,
        technique: prose.technique,
        problemSpecificElements: prose.problemSpecificElements,
        reviewAdvice: prose.reviewAdvice,
        correctness: prose.correctness,
        complexity: { time: prose.time, space: prose.space },
        constraintConsistency: problem.constraintsSummary,
        implementationNotes: prose.implementationNotes,
      },
    });
    const outcomeEntities = await Promise.all(
      outcomes.map(async (id) =>
        LearningOutcomeSchema.parse(
          JSON.parse(await readFile(`src/content/learning-outcomes/${id}.json`, 'utf8')) as unknown,
        ),
      ),
    );
    const text = renderProblemAuthoringDocument(
      document,
      `${contestId.toUpperCase()} ${problem.slotLabel} — ${problem.title}`,
      {
        home: `[${unit.title}](${unit.docPath})`,
        outcomes: outcomeEntities.map((o) => o.statement),
        sources: metadata.sources
          .filter((s) => sourceIds.includes(s.id))
          .map(
            (s) => `[${s.sourceKind === 'official_problem' ? '公式問題' : '公式解説'}](${s.url})`,
          ),
        prerequisites: support.map((u) => `[${u.title}](${u.docPath})`),
      },
    );
    await mkdir(path.dirname(documentPath), { recursive: true });
    await writeFile(documentPath, text);
    const riskReasons =
      problem.id === 'abc478-f'
        ? ['official_source_conflict']
        : ['abc467-e', 'abc476-f', 'abc478-g'].includes(problem.id)
          ? ['independent_proof']
          : [];
    items.push({
      packet,
      inventory,
      placement,
      documentPath,
      documentDigest: shardFileDigest(text),
      review: {
        mode: riskReasons.length ? 'third_party' : 'self',
        reviewMode: 'agent_quality_review',
        humanApproval: false,
        riskReasons,
        basis: `owner_instruction_issue_48: agent quality review; original derivation, constraint/complexity/source consistency and boundary checks. ${prose.reviewAdvice}`,
      },
    });
  }
  const result = UpdateAuthoringSchema.parse({ schemaVersion: '1.0.0', contestId, items });
  await writeUpdateJson(`${CATCH_UP_ROOT}/authoring/${contestId}.json`, result);
  console.log(`${contestId}: ${String(items.length)} authored documents packaged`);
} catch (error) {
  console.error(error);
  process.exitCode = 2;
}
