import type { ProblemAuthoringUnit } from '../domain/schema-parts/authoring-unit.js';
import type {
  AuthoringInputPacket,
  NormalizedAuthoringSource,
} from './explanation-authoring-skill.js';
import { validateAuthoringInput } from './explanation-authoring-skill.js';
import type { ProblemShardContext } from './problem-shard-context.js';
import type { ProblemShard } from './problem-shard-index.js';
import {
  renderProblemAuthoringDocument,
  type ProblemAuthoringDetails,
} from './problem-authoring-document.js';

export const authorProblemInShard = (
  context: ProblemShardContext,
  shard: ProblemShard,
  problemId: string,
  details: ProblemAuthoringDetails,
) => {
  const problem = context.context.corpus.problems.find((p) => p.entity.id === problemId)?.entity;
  const inventory = context.context.records.find((p) => p.problemId === problemId);
  const placement = context.policy.placements.find((p) => p.problemId === problemId);
  const home = context.units.find((u) => u.id === shard.homeUnitId);
  if (!problem || !inventory || !placement || !home || !shard.problemIds.includes(problemId))
    throw new Error(`SHARD_INPUT_MISSING:${problemId}`);
  if (!problem.constraintsSummary) throw new Error(`SHARD_CONSTRAINTS_MISSING:${problemId}`);
  if (placement.kind !== 'full')
    throw new Error(`SHARD_ABBREVIATED_REUSE_EVIDENCE_REQUIRED:${problemId}`);
  const outcomeIds = [placement.primaryOutcomeId, ...placement.additionalPrimaryOutcomeIds];
  const sources: NormalizedAuthoringSource[] = inventory.sourceRevisionIds.map((id) => {
    const source = context.context.corpus.sources.find((s) => s.entity.id === id);
    if (
      !source ||
      !['official_problem', 'official_editorial'].includes(source.entity.sourceKind) ||
      source.entity.officialTaskId !== problem.officialTaskId
    )
      throw new Error(`SHARD_SOURCE_TASK_MISMATCH:${problemId}:${id}`);
    return {
      sourceRevisionId: id,
      path: source.path,
      sourceKind: source.entity.sourceKind as 'official_problem' | 'official_editorial',
      officialTaskId: problem.officialTaskId,
      checkedAt: source.entity.checkedAt,
      termsCheckedAt: source.entity.termsCheckedAt,
      allowedUses: [
        'constraint_reference',
        'technical_claim',
        'example_verification',
        'answer_verification',
      ],
    };
  });
  const prerequisiteUnits = [
    ...new Set([
      ...(details.additionalPrerequisiteUnitIds ?? [
        ...context.build.learningUnitPrerequisites
          .filter((e) => e.nodeId === home.id)
          .map((e) => e.prerequisiteId),
        ...placement.supportingOutcomeIds.flatMap((id) =>
          context.units.filter((u) => u.ownedLearningOutcomeIds?.includes(id)).map((u) => u.id),
        ),
      ]),
    ]),
  ]
    .filter((id) => id !== home.id)
    .sort();
  const tagIds = [...new Set([...placement.primaryTagIds, ...placement.supportingTagIds])];
  const input: AuthoringInputPacket = {
    problemId,
    learningOutcomeIds: outcomeIds,
    baseline: { id: home.baselineId, version: home.baselineVersion },
    additionalPrerequisiteUnitIds: prerequisiteUnits,
    excludedTopics: home.excludedTopics,
    tagIds,
    constraints: [problem.constraintsSummary],
    placementCandidate: { primaryProblemId: null, comparison: null, additionalElement: null },
    technicalClaims: [
      { text: details.correctness, sourceRevisionIds: inventory.sourceRevisionIds },
    ],
    sources,
    skill: context.skill,
  };
  const validation = validateAuthoringInput(input, context.skill);
  if (validation.status !== 'ready')
    throw new Error(`SHARD_INPUT_BLOCKED:${problemId}:${JSON.stringify(validation.diagnostics)}`);
  const technique = inventory.typicalTechniques
    .map((t) => `### ${t.name}\n\n発動条件: ${t.trigger}\n\n${t.application}`)
    .join('\n\n');
  const specific = inventory.problemSpecificInsights
    .map((t) => `${t.insight}\n\n別の問題へ持ち帰る視点: ${t.reusablePerspective}`)
    .join('\n\n');
  const docPath = shard.documentPaths[shard.problemIds.indexOf(problemId)];
  if (!docPath) throw new Error(`SHARD_DOCUMENT_PATH_MISSING:${problemId}`);
  const unit: ProblemAuthoringUnit = {
    problemId,
    docPath,
    learningOutcomeIds: outcomeIds,
    baselineId: home.baselineId,
    baselineVersion: home.baselineVersion,
    additionalPrerequisiteUnitIds: prerequisiteUnits,
    excludedTopics: home.excludedTopics,
    tagIds,
    sourceRevisionIds: inventory.sourceRevisionIds,
    skill: context.skill,
    revision: 1,
    kind: 'full',
    primaryProblemId: null,
    differenceSummary: null,
    sections: {
      reasoning: details.reasoning,
      technique,
      problemSpecificElements: specific,
      reviewAdvice: inventory.reviewAdvice.map((t) => `- ${t.text}`).join('\n'),
      correctness: details.correctness,
      complexity: { time: details.time, space: details.space },
      constraintConsistency:
        details.constraintConsistency ?? `公式制約の確認範囲: ${problem.constraintsSummary}`,
      implementationNotes: inventory.implementationConcerns.map((t) => `- ${t.text}`).join('\n'),
      ...details.sectionOverrides,
    },
    claims: [
      {
        key: 'correctness',
        text: details.correctness,
        sourceRevisionIds: inventory.sourceRevisionIds,
        authorId: 'person-codex',
        verificationStatus: details.holdReason ? 'unverified' : 'verified',
      },
    ],
    examples: details.example
      ? [
          {
            key: 'worked',
            learningOutcomeIds: outcomeIds,
            learningUnitIds: [home.id],
            kind: 'illustrative',
            language: '日本語・数式',
            omissions: ['実行プログラムは省略。小例の手計算を示す。'],
            environment: '紙と筆記具、または数式を評価できる計算機',
            input: details.example.input,
            procedure: details.example.procedure,
            executionTarget: null,
            expectedResult: details.example.expectedResult,
            verificationStatus: 'not_applicable',
          },
        ]
      : [],
    exercises: details.exercise
      ? [
          {
            key: 'transfer',
            learningOutcomeIds: outcomeIds,
            prerequisiteIds: prerequisiteUnits,
            attainmentCondition: details.exercise.prompt,
            assessment: {
              method: '理由・境界・反例を言葉や式で説明する。',
              successCondition: details.exercise.expectedResult,
            },
            answer: {
              reasoningOrVerification: details.exercise.answer,
              procedure: ['具体例の各状態・寄与を再計算する。', details.exercise.answer],
              expectedResult: details.exercise.expectedResult,
              verificationStatus: details.holdReason ? 'pending' : 'passed',
            },
          },
        ]
      : [],
  };
  // Coefficient extraction, e.g. [x^N](1+x), is prose mathematics, not a Markdown link.
  for (const [key, value] of Object.entries(unit.sections)) {
    if (typeof value === 'string')
      unit.sections[key] = value.replace(/(?<!\\)(\[[^\]\n]+\])\((?!https?:|src\/|#)/gu, '\\$1(');
  }
  const label = (id: string): string => {
    const u = context.units.find((x) => x.id === id);
    if (!u) throw new Error(`SHARD_LINK_UNIT_MISSING:${id}`);
    return `[${u.title}](${u.docPath})`;
  };
  const prerequisiteLabel = (id: string): string => {
    const u = context.units.find((x) => x.id === id);
    if (!u) throw new Error(`SHARD_LINK_UNIT_MISSING:${id}`);
    return `${label(id)} — ${u.learningRationale}`;
  };
  const links = {
    home: `体系上の位置: ${label(home.id)}`,
    outcomes: outcomeIds.map((id) => {
      const o = context.outcomes.find((x) => x.id === id);
      if (!o) throw new Error(`SHARD_OUTCOME_MISSING:${id}`);
      return o.statement;
    }),
    prerequisites: prerequisiteUnits.map(prerequisiteLabel),
    sources: inventory.sourceRevisionIds.map((id) => {
      const source = context.context.corpus.sources.find((x) => x.entity.id === id);
      if (!source) throw new Error(`SHARD_SOURCE_MISSING:${id}`);
      const s = source.entity;
      return `[${s.sourceKind === 'official_problem' ? '公式問題' : '個別公式解説'}（${s.checkedAt}確認）](${s.url}) — ${id}`;
    }),
  };
  const title = `${problemId.toUpperCase()} — ${problem.title}`;
  return {
    unit,
    input,
    title,
    links,
    document: renderProblemAuthoringDocument(unit, title, links),
  };
};
