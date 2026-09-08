import type { z } from 'zod';
import { CANONICAL_GUIDED_EXAMPLES } from './canonical-guided-examples.js';
import { CANONICAL_OUTCOME_NOTES } from './canonical-outcome-notes.js';

import { canonicalDigest, canonicalJson } from '../domain/canonical-json.js';
import {
  CanonicalLearningOrderSchema,
  CanonicalProblemPlacementPolicySchema,
  CorrectionImpactSchema,
  FinalTaxonomyBuildSchema,
  LearningOutcomeSchema,
  LearningUnitSchema,
  type ProblemAnalysisClaimRefSchema,
  ProblemAnalysisRecordSchema,
  ProblemPlacementDecisionTableSchema,
  ProblemSchema,
  SourceRevisionSchema,
  TechniqueTagSchema,
} from '../domain/schema-parts/catalog.js';

type FinalTaxonomyBuild = z.infer<typeof FinalTaxonomyBuildSchema>;
type ProblemAnalysisClaimRef = z.infer<typeof ProblemAnalysisClaimRefSchema>;
type ProblemAnalysisRecord = z.infer<typeof ProblemAnalysisRecordSchema>;
type Problem = z.infer<typeof ProblemSchema>;
type SourceRevision = z.infer<typeof SourceRevisionSchema>;
type ProblemPlacementDecisionTable = z.infer<typeof ProblemPlacementDecisionTableSchema>;
type TechniqueTag = z.infer<typeof TechniqueTagSchema>;
type LearningOutcome = z.infer<typeof LearningOutcomeSchema>;
type LearningUnit = z.infer<typeof LearningUnitSchema>;
type CanonicalLearningOrder = z.infer<typeof CanonicalLearningOrderSchema>;
type CanonicalProblemPlacementPolicy = z.infer<typeof CanonicalProblemPlacementPolicySchema>;
type CorrectionImpact = z.infer<typeof CorrectionImpactSchema>;
type CorrectionImpactLocator = CorrectionImpact['affectedContentLocators'][number];

const PREVIEW_ID_PATTERN = /(?:^|-)(?:preview|provisional)(?:-|$)/u;
const REQUIRED_DOCUMENT_SECTIONS = [
  '## この単元でできるようになること',
  '## 発動条件と見分け方',
  '## ガイド例',
  '## 到達確認',
  '## 解答と自己評価基準',
  '## 根拠',
] as const;

const UNIT_KIND_LABEL = {
  chapter: '章',
  section: '節',
  subsection: '小節',
} as const;

const SOURCE_KIND_LABEL = {
  official_problem: '公式問題文',
  official_editorial: '公式解説',
  official_contest: '公式コンテスト情報',
  other_official: 'その他の公式資料',
} as const;

export const CANONICAL_TAXONOMY_BUILD_PATH = 'staging/taxonomy/initial/final-taxonomy-build.json';
export const CANONICAL_LEARNING_ORDER_PATH = 'src/content/policies/learning-order.json';
export const CANONICAL_PROBLEM_PLACEMENTS_PATH = 'src/content/policies/problem-placements.json';
export const CANONICAL_PROBLEM_PLACEMENT_EVIDENCE_PATH =
  'docs/verification/bootstrap/problem-placements.json';
export const CANONICAL_TAXONOMY_MATERIALIZATION_EVIDENCE_PATH =
  'docs/verification/bootstrap/canonical-taxonomy-materialization.json';

export class CanonicalTaxonomyMaterializationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(`${code}: ${message}`);
    this.code = code;
    this.name = 'CanonicalTaxonomyMaterializationError';
  }
}

export interface CanonicalTaxonomyMaterializationInput {
  readonly build: FinalTaxonomyBuild;
  readonly records: readonly ProblemAnalysisRecord[];
  readonly problems: readonly Problem[];
  readonly sources: readonly SourceRevision[];
  readonly placementDecisionTable: ProblemPlacementDecisionTable;
  readonly singleProblemTagIds: readonly string[];
}

export interface CanonicalJsonOutput<Value> {
  readonly relativePath: string;
  readonly value: Value;
}

export interface CanonicalLearningUnitOutput extends CanonicalJsonOutput<LearningUnit> {
  readonly documentPath: string;
  readonly document: string;
}

export interface CanonicalTaxonomyMaterialization {
  readonly tags: readonly CanonicalJsonOutput<TechniqueTag>[];
  readonly learningOutcomes: readonly CanonicalJsonOutput<LearningOutcome>[];
  readonly learningUnits: readonly CanonicalLearningUnitOutput[];
  readonly learningOrder: CanonicalLearningOrder;
  readonly problemPlacementPolicy: CanonicalProblemPlacementPolicy;
  readonly problemPlacementEvidence: Readonly<Record<string, unknown>>;
  readonly materializationEvidence: Readonly<Record<string, unknown>>;
}

interface LearningActivity {
  readonly outcome: LearningOutcome;
  readonly record: ProblemAnalysisRecord;
  readonly problem: Problem;
  readonly evidenceClaims: readonly string[];
  readonly assessmentRecord: ProblemAnalysisRecord | null;
  readonly assessmentProblem: Problem | null;
  readonly assessmentEvidenceClaims: readonly string[];
  readonly assessmentKind: 'transfer_problem' | 'boundary_transformation';
}

interface ChildLearningUnitLink {
  readonly id: string;
  readonly title: string;
  readonly documentPath: string;
  readonly globalIndex: number;
  readonly learningOutcomeIds: readonly string[];
  readonly ownedLearningOutcomeIds: readonly string[];
  readonly excludedTopics: readonly string[];
  readonly orderReason: string;
}

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortedUnique = (values: readonly string[]): string[] =>
  [...new Set(values)].sort(compareCodeUnits);

const outputById = <Value extends { readonly id: string }>(
  root: string,
  values: readonly Value[],
): CanonicalJsonOutput<Value>[] =>
  [...values]
    .sort((left, right) => compareCodeUnits(left.id, right.id))
    .map((value) => ({ relativePath: `${root}/${value.id}.json`, value }));

const buildSourceReference = (build: FinalTaxonomyBuild) => {
  if (build.acceptedAt === null) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_BUILD_NOT_ACCEPTED',
      'An acceptedAt timestamp is required.',
    );
  }
  return { id: build.id, digest: build.buildDigest, acceptedAt: build.acceptedAt };
};

const assertMaterializationInput = (
  input: CanonicalTaxonomyMaterializationInput,
): CanonicalTaxonomyMaterializationInput => {
  if (
    input.build.status !== 'accepted' ||
    input.build.acceptedAt === null ||
    !input.build.canonicalMaterializationAllowed
  ) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_BUILD_NOT_ACCEPTED',
      'T047–T050 require one accepted FinalTaxonomyBuild with materialization enabled.',
    );
  }
  const previewCandidate = input.build.finalCandidates.find(({ entity }) =>
    PREVIEW_ID_PATTERN.test(entity.id),
  );
  if (previewCandidate !== undefined) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_PREVIEW_ENTITY_REJECTED',
      previewCandidate.entity.id,
    );
  }
  const parsedBuild = FinalTaxonomyBuildSchema.safeParse(input.build);
  if (!parsedBuild.success) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_BUILD_SCHEMA_INVALID',
      parsedBuild.error.message,
    );
  }
  const records = input.records.map((record) => ProblemAnalysisRecordSchema.parse(record));
  const problems = input.problems.map((problem) => ProblemSchema.parse(problem));
  const sources = input.sources.map((source) => SourceRevisionSchema.parse(source));
  const placementDecisionTable = ProblemPlacementDecisionTableSchema.parse(
    input.placementDecisionTable,
  );
  const singletonAllowlist = new Set(input.singleProblemTagIds);
  const rejectedSingleton = parsedBuild.data.finalCandidates.find(
    (candidate) =>
      candidate.kind === 'tag' &&
      candidate.entity.representativeProblemIds.length === 1 &&
      !singletonAllowlist.has(candidate.entity.id),
  );
  if (rejectedSingleton !== undefined) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_SINGLE_PROBLEM_TAG_REJECTED',
      rejectedSingleton.entity.id,
    );
  }
  return {
    build: parsedBuild.data,
    records,
    problems,
    sources,
    placementDecisionTable,
    singleProblemTagIds: sortedUnique(input.singleProblemTagIds),
  };
};

const rootChapterId = (
  unitId: string,
  unitById: ReadonlyMap<string, { readonly id: string; readonly parentId: string | null }>,
): string => {
  const visited = new Set<string>();
  let current = unitById.get(unitId);
  while (current?.parentId !== null && current !== undefined) {
    if (visited.has(current.id)) {
      throw new CanonicalTaxonomyMaterializationError('CANONICAL_UNIT_HIERARCHY_CYCLE', unitId);
    }
    visited.add(current.id);
    const parent = unitById.get(current.parentId);
    if (parent === undefined) {
      throw new CanonicalTaxonomyMaterializationError(
        'CANONICAL_UNIT_PARENT_UNKNOWN',
        current.parentId,
      );
    }
    current = parent;
  }
  if (current === undefined) {
    throw new CanonicalTaxonomyMaterializationError('CANONICAL_UNIT_UNKNOWN', unitId);
  }
  return current.id;
};

const learningUnitDocumentPath = (
  unit: { readonly id: string; readonly kind: 'chapter' | 'section' | 'subsection' },
  unitById: ReadonlyMap<string, { readonly id: string; readonly parentId: string | null }>,
): string => {
  const chapterId = rootChapterId(unit.id, unitById);
  const directory = chapterId.replace(/^unit-chapter-/u, '');
  return unit.kind === 'chapter'
    ? `src/content/docs/learn/${directory}/index.md`
    : `src/content/docs/learn/${directory}/${unit.id.replace(/^unit-/u, '')}.md`;
};

const rankedRecordsForOutcome = (input: {
  readonly outcomeId: string;
  readonly unitProblemIds: readonly string[];
  readonly outcomeEvidenceProblemIds: readonly string[];
  readonly primaryProblemIds: ReadonlySet<string>;
  readonly supportingProblemIds: ReadonlySet<string>;
  readonly recordByProblemId: ReadonlyMap<string, ProblemAnalysisRecord>;
}): ProblemAnalysisRecord[] => {
  const unitProblemSet = new Set(input.unitProblemIds);
  const selection = CANONICAL_GUIDED_EXAMPLES[input.outcomeId];
  if (selection === undefined) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_GUIDE_SELECTION_MISSING',
      input.outcomeId,
    );
  }
  const evidenceIndex = new Map<string, number>();
  for (const [index, problemId] of input.outcomeEvidenceProblemIds.entries()) {
    if (!evidenceIndex.has(problemId)) evidenceIndex.set(problemId, index);
  }
  const records = [...evidenceIndex]
    .flatMap(([problemId, index]) => {
      const record = input.recordByProblemId.get(problemId);
      return record === undefined || !unitProblemSet.has(problemId) ? [] : [{ record, index }];
    })
    .sort((left, right) => {
      const rank = (problemId: string): number =>
        problemId === selection.problemId
          ? -1
          : input.primaryProblemIds.has(problemId)
            ? 0
            : input.supportingProblemIds.has(problemId)
              ? 1
              : 2;
      return rank(left.record.problemId) - rank(right.record.problemId) || left.index - right.index;
    })
    .map(({ record }) => record);
  if (records[0]?.problemId !== selection.problemId) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_UNIT_ACTIVITY_SOURCE_MISSING',
      input.outcomeId,
    );
  }
  return records;
};

const valueAtClaimPath = (record: ProblemAnalysisRecord, claimPath: string): unknown =>
  claimPath
    .slice(1)
    .split('/')
    .reduce<unknown>((value, segment) => {
      if (value === null || typeof value !== 'object') return undefined;
      return (value as Readonly<Record<string, unknown>>)[segment];
    }, record);

const claimText = (record: ProblemAnalysisRecord, reference: ProblemAnalysisClaimRef): string => {
  const value = valueAtClaimPath(record, reference.claimPath);
  if (value === null || typeof value !== 'object') {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_OUTCOME_EVIDENCE_POINTER_INVALID',
      `${reference.problemId}${reference.claimPath}`,
    );
  }
  const claim = value as Readonly<Record<string, unknown>>;
  if (typeof claim.text === 'string') return claim.text;
  if (typeof claim.approach === 'string' && typeof claim.decisionReason === 'string') {
    return `${claim.approach} — ${claim.decisionReason}`;
  }
  if (
    typeof claim.name === 'string' &&
    typeof claim.trigger === 'string' &&
    typeof claim.application === 'string'
  ) {
    return `${claim.name}: ${claim.trigger} 適用: ${claim.application}`;
  }
  if (typeof claim.insight === 'string' && typeof claim.reusablePerspective === 'string') {
    return `${claim.insight} 再利用の観点: ${claim.reusablePerspective}`;
  }
  const complexity = [
    typeof claim.time === 'string' ? `時間 ${claim.time}` : null,
    typeof claim.space === 'string' ? `空間 ${claim.space}` : null,
  ].filter((part): part is string => part !== null);
  if (complexity.length > 0) return complexity.join('、');
  throw new CanonicalTaxonomyMaterializationError(
    'CANONICAL_OUTCOME_EVIDENCE_POINTER_UNRENDERABLE',
    `${reference.problemId}${reference.claimPath}`,
  );
};

const evidenceClaimsForRecord = (
  references: readonly ProblemAnalysisClaimRef[],
  record: ProblemAnalysisRecord,
): string[] => {
  const claims = references
    .filter(({ problemId }) => problemId === record.problemId)
    .map((reference) => claimText(record, reference));
  const result = [...new Set(claims)];
  if (result.length === 0) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_OUTCOME_EVIDENCE_MISSING',
      record.problemId,
    );
  }
  return result;
};

const activityProcedure = (record: ProblemAnalysisRecord): string[] => {
  const adopted = record.reasoningPath.candidateApproaches.find(
    ({ decision }) => decision === 'adopted',
  );
  return [
    ...record.reasoningPath.observations.slice(0, 2).map(({ text }) => `観察: ${text}`),
    ...record.reasoningPath.keyInsights.slice(0, 2).map(({ text }) => `着眼: ${text}`),
    ...(adopted === undefined ? [] : [`方針: ${adopted.approach}（${adopted.decisionReason}）`]),
    `接続: ${record.reasoningPath.algorithmConnection.text}`,
  ];
};

const transferAnswerProcedure = (
  record: ProblemAnalysisRecord,
  evidenceClaims: readonly string[],
): string[] => {
  const complexity = [
    record.asymptoticComplexity?.time === undefined
      ? null
      : `時間計算量 ${record.asymptoticComplexity.time}`,
    record.asymptoticComplexity?.space === undefined
      ? null
      : `空間計算量 ${record.asymptoticComplexity.space}`,
  ].filter((part): part is string => part !== null);
  return [
    ...evidenceClaims.map((claim) => `対象技能が担う箇所: ${claim}`),
    `転移題材の解法接続: ${record.reasoningPath.algorithmConnection.text}`,
    '転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。',
    '対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。',
    '不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。',
    complexity.length === 0
      ? '対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。'
      : `${complexity.join('、')}を問題制約と照合し、対象技能が律速かを確認する。`,
  ];
};

const yamlString = (value: string): string => JSON.stringify(value);

const markdownList = (items: readonly string[], emptyText = 'なし'): string =>
  items.length === 0 ? `- ${emptyText}` : items.map((item) => `- ${item}`).join('\n');

const withoutTerminalPunctuation = (value: string): string => value.replace(/[。．.!?！？]+$/u, '');

const problemLabel = (problem: Problem): string =>
  `${problem.contestId.toUpperCase()} ${problem.slotLabel}「${problem.title}」`;

const sourceRevisionLabel = (source: SourceRevision): string => {
  const taskLabel =
    source.officialTaskId === null
      ? null
      : source.officialTaskId
          .replace(/^abc(\d+)_/u, 'ABC$1 ')
          .replaceAll('_', ' ')
          .toUpperCase();
  const subject = taskLabel ?? source.contestId?.toUpperCase() ?? 'AtCoder';
  return `${subject} ${SOURCE_KIND_LABEL[source.sourceKind]}`;
};

const unitRoleDescription = (
  kind: LearningUnit['kind'],
  ownedOutcomeCount: number,
  childCount: number,
): string => {
  if (kind === 'chapter') {
    return '分野全体の索引として、技能の境界と学ぶ順序を俯瞰します。各技能の定義を混同せず、必要な節・小節へ降りるための地図として使ってください。';
  }
  if (childCount > 0 && ownedOutcomeCount === 0) {
    return '下位単元が扱う技能を比較し、発動条件・不変量・計算量の違いから学習経路を選ぶための構造単元です。';
  }
  if (childCount > 0) {
    return '同じ対象を扱う技能を比較し、どの発動条件・不変量・計算量の違いで使い分けるかを学びます。';
  }
  return '一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。';
};

const exerciseForOutcome = (unit: LearningUnit, outcomeId: string) => {
  const exercise = unit.exercises.find(
    ({ learningOutcomeIds, learningUnitRole }) =>
      learningUnitRole === 'outcome_attainment' && learningOutcomeIds.includes(outcomeId),
  );
  if (exercise === undefined) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_UNIT_EXERCISE_MISSING',
      `${unit.id}/${outcomeId}`,
    );
  }
  return exercise;
};

const renderLearningUnitDocument = (input: {
  readonly unit: LearningUnit;
  readonly tags: readonly TechniqueTag[];
  readonly outcomes: readonly LearningOutcome[];
  readonly activities: readonly LearningActivity[];
  readonly childUnits: readonly ChildLearningUnitLink[];
  readonly prerequisiteTitles: readonly string[];
  readonly sources: readonly SourceRevision[];
  readonly sourceBuild: { readonly id: string; readonly digest: string };
}): string => {
  const { unit, tags } = input;
  const activities = input.activities;
  const outcomes = activities.map(({ outcome }) => outcome);
  const guidedExamples = activities
    .map(({ outcome, record, problem, evidenceClaims }, index) => {
      const selection = CANONICAL_GUIDED_EXAMPLES[outcome.id];
      if (selection?.walkthrough !== undefined) {
        return [
          `### 例 ${String(index + 1)} — ${withoutTerminalPunctuation(outcome.statement)}`,
          '',
          `題材: [${problemLabel(problem)}](${problem.officialUrl})`,
          '',
          `選定理由: ${selection.rationale}`,
          '',
          `この例で扱う範囲: ${selection.scope}`,
          '',
          '#### このOutcomeを支える根拠',
          '',
          markdownList([selection.rationale]),
          '',
          '#### 観察から手順へ',
          '',
          markdownList(selection.walkthrough),
        ].join('\n');
      }
      const rejected = record.reasoningPath.candidateApproaches.filter(
        ({ decision }) => decision === 'rejected',
      );
      const adopted = record.reasoningPath.candidateApproaches.filter(
        ({ decision }) => decision === 'adopted',
      );
      return [
        `### 例 ${String(index + 1)} — ${withoutTerminalPunctuation(outcome.statement)}`,
        '',
        `題材: [${problemLabel(problem)}](${problem.officialUrl})`,
        '',
        `選定理由: ${CANONICAL_GUIDED_EXAMPLES[outcome.id]?.rationale ?? ''}`,
        '',
        `この例で扱う範囲: ${CANONICAL_GUIDED_EXAMPLES[outcome.id]?.scope ?? ''}`,
        '',
        '#### このOutcomeを支える根拠',
        '',
        markdownList(evidenceClaims),
        '',
        '#### 観察',
        '',
        markdownList(record.reasoningPath.observations.map(({ text }) => text)),
        '',
        '#### 候補を比較する',
        '',
        markdownList([
          ...adopted.map(
            ({ approach, decisionReason }) => `**採用**: ${approach} — ${decisionReason}`,
          ),
          ...rejected.map(
            ({ approach, decisionReason }) => `**棄却**: ${approach} — ${decisionReason}`,
          ),
        ]),
        '',
        '#### 鍵となる着眼',
        '',
        markdownList(record.reasoningPath.keyInsights.map(({ text }) => text)),
        '',
        '#### アルゴリズムへ接続する',
        '',
        record.reasoningPath.algorithmConnection.text,
      ].join('\n');
    })
    .join('\n\n');
  const attainmentChecks = activities
    .map(({ outcome, problem, assessmentProblem, assessmentKind }, index) => {
      const exercise = exerciseForOutcome(unit, outcome.id);
      const subject = assessmentProblem ?? problem;
      return [
        `### 到達確認 ${String(index + 1)} — ${withoutTerminalPunctuation(outcome.statement)}`,
        '',
        `${assessmentKind === 'transfer_problem' ? '転移題材' : '境界検証の元題材'}: [${problemLabel(subject)}](${subject.officialUrl})`,
        '',
        `**課題**: ${exercise.assessment.method}`,
        '',
        `**合格条件**: ${exercise.assessment.successCondition}`,
      ].join('\n');
    })
    .join('\n\n');
  const answers = activities
    .map(({ outcome, assessmentEvidenceClaims }, index) => {
      const exercise = exerciseForOutcome(unit, outcome.id);
      return [
        `<details><summary>到達確認 ${String(index + 1)} の解答基準 — ${withoutTerminalPunctuation(outcome.statement)}</summary>`,
        '',
        '**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。',
        '',
        exercise.answer.reasoningOrVerification,
        '',
        '根拠として照合する観点:',
        '',
        markdownList(assessmentEvidenceClaims),
        '',
        markdownList(exercise.answer.procedure),
        '',
        `期待する到達点: ${exercise.answer.expectedResult}`,
        '',
        '</details>',
      ].join('\n');
    })
    .join('\n\n');
  const sourceList = input.sources.map(
    (source) => `[${sourceRevisionLabel(source)}](${source.url})`,
  );
  const childUnitNavigation = input.childUnits.map((child, index) => {
    const filename = child.documentPath.split('/').at(-1);
    if (filename === undefined) {
      throw new CanonicalTaxonomyMaterializationError('CANONICAL_UNIT_DOCUMENT_PATH', child.id);
    }
    return `${String(index + 1)}. [${child.title}](./${filename})（標準順 ${String(child.globalIndex + 1)}）— ${child.orderReason}`;
  });
  const childUnitComparison = input.childUnits.map((child) => {
    const directlyOwnedOutcomes = child.ownedLearningOutcomeIds.flatMap((outcomeId) => {
      const outcome = input.outcomes.find(({ id }) => id === outcomeId);
      return outcome === undefined ? [] : [outcome.statement];
    });
    const directTarget =
      directlyOwnedOutcomes.length === 0
        ? `${String(child.learningOutcomeIds.length)}個の下位Outcomeへ進むための構造索引`
        : directlyOwnedOutcomes.map(withoutTerminalPunctuation).join('／');
    return `- **${child.title}** — 直接到達点: ${directTarget}。近いが対象外: ${child.excludedTopics[0] ?? '下位単元の定義に当てはまらない問題'}`;
  });
  const routingExercise = unit.exercises.find(
    ({ learningUnitRole }) => learningUnitRole === 'curriculum_routing',
  );
  const routingSection =
    input.childUnits.length === 0 || routingExercise === undefined
      ? []
      : [
          '## 下位単元を使い分ける比較例',
          '',
          '未知問を見たときは、手法名を思い出す前に「対象」「操作」「保つ量」「求める量」を書き出します。それぞれの下位単元が要求する発動条件と照合し、採用する経路だけでなく、近い候補を棄却する理由も残してください。',
          '',
          childUnitComparison.join('\n'),
          '',
          `**比較の到達点**: ${routingExercise.attainmentCondition}`,
          '',
        ];
  const routingAttainment =
    routingExercise === undefined
      ? []
      : [
          '### 学習経路の選択',
          '',
          `**課題**: ${routingExercise.assessment.method}`,
          '',
          `**合格条件**: ${routingExercise.assessment.successCondition}`,
          '',
        ];
  const routingAnswer =
    routingExercise === undefined
      ? []
      : [
          '<details><summary>学習経路の選択の解答基準</summary>',
          '',
          '**検証状態**: `pending` — これは T057 の学習経路レビュー前に使う自己評価基準であり、検証済みとは扱いません。',
          '',
          routingExercise.answer.reasoningOrVerification,
          '',
          markdownList(routingExercise.answer.procedure),
          '',
          `期待する到達点: ${routingExercise.answer.expectedResult}`,
          '',
          '</details>',
          '',
        ];
  return [
    '---',
    `title: ${yamlString(unit.title)}`,
    `description: ${yamlString(`前提から${unit.title}を見抜き、方針へ接続して検証するための学習単位。`)}`,
    'draft: true',
    'sidebar:',
    `  order: ${String(unit.globalIndex)}`,
    '---',
    '',
    `# ${unit.title}`,
    '',
    `このページは **${UNIT_KIND_LABEL[unit.kind]}** です。${unitRoleDescription(unit.kind, outcomes.length, input.childUnits.length)}`,
    '',
    '読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。',
    '',
    '## この単元でできるようになること',
    '',
    markdownList(
      outcomes.map(({ statement }) => statement),
      '直接所有するOutcomeはありません。この単元では下位単元の選択と学習順を扱います。',
    ),
    '',
    '## 前提・学習順・対象外',
    '',
    `- 共通前提: \`${unit.baselineId}\` version \`${unit.baselineVersion}\``,
    `- 追加前提: ${input.prerequisiteTitles.length === 0 ? 'なし' : input.prerequisiteTitles.join('、')}`,
    `- この位置で学ぶ理由: ${unit.orderReason}`,
    '',
    '### この単元では扱わない範囲',
    '',
    markdownList(unit.excludedTopics, 'なし'),
    '',
    ...(input.childUnits.length > 0
      ? [
          '## 下位単元と学習順',
          '',
          unit.kind === 'chapter'
            ? '以下は canonical standard order に沿った章内カリキュラムです。定義・証明・実装境界・Outcome到達確認は各リンク先で扱い、この章では経路選択に必要な境界を示します。'
            : '以下の小節を canonical standard order に沿って学びます。共通する対象と、各小節で追加される発動条件を区別してください。',
          '',
          childUnitNavigation.join('\n'),
          '',
        ]
      : []),
    '## 発動条件と見分け方',
    '',
    ...tags.flatMap((tag) => [
      `### ${tag.name}`,
      '',
      tag.definition,
      '',
      `検索語: ${[...tag.aliases, ...tag.formerNames].join('、') || 'なし'}`,
      '',
    ]),
    tags.length === 0
      ? 'この構造単元はTagを直接所有しません。下位単元の定義と対象外を比較して学習経路を選びます。'
      : '未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。',
    '',
    '## ガイド例',
    '',
    ...outcomes.flatMap(({ id }) => {
      const notes = CANONICAL_OUTCOME_NOTES[id];
      return notes === undefined ? [] : ['### 正当化と転用の境界', '', markdownList(notes), ''];
    }),
    guidedExamples || '- 通常のOutcomeガイド例は下位単元で扱います。',
    '',
    ...routingSection,
    '',
    '## 転用するときの確認',
    '',
    markdownList(
      activities.flatMap(({ record }) => [
        ...record.typicalTechniques.map(
          ({ name, trigger, application }) => `**${name}**: ${trigger} 適用: ${application}`,
        ),
        ...record.problemSpecificInsights.map(({ reusablePerspective }) => reusablePerspective),
        ...record.reviewAdvice.map(({ text }) => text),
      ]),
    ),
    '',
    '## 到達確認',
    '',
    attainmentChecks || '- 直接所有するOutcomeの到達確認はありません。',
    '',
    ...routingAttainment,
    '',
    '## 解答と自己評価基準',
    '',
    answers || '- 直接所有するOutcomeの解答基準はありません。',
    '',
    ...routingAnswer,
    '',
    '## 根拠',
    '',
    markdownList(sourceList),
    '',
    `Canonical taxonomy: FinalTaxonomyBuild \`${input.sourceBuild.id}\` digest \`${input.sourceBuild.digest}\` / LearningUnit \`${unit.id}\``,
    '',
  ].join('\n');
};

const finalOutcomeIdsForImpact = (
  build: FinalTaxonomyBuild,
  impactId: string,
): readonly string[] => {
  const candidateById = new Map(
    build.finalCandidates.map((candidate) => [candidate.entity.id, candidate]),
  );
  return sortedUnique(
    build.integrationMap.entries
      .filter(({ correctionImpactIds }) => correctionImpactIds.includes(impactId))
      .flatMap(({ finalEntityIds }) => finalEntityIds)
      .flatMap((entityId) => {
        const candidate = candidateById.get(entityId);
        if (candidate === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_CORRECTION_TARGET_UNKNOWN',
            `${impactId}/${entityId}`,
          );
        }
        return candidate.kind === 'outcome'
          ? [candidate.entity.id]
          : candidate.entity.learningOutcomeIds;
      }),
  );
};

const canonicalCorrectionImpacts = (
  build: FinalTaxonomyBuild,
  learningUnits: readonly CanonicalLearningUnitOutput[],
): CorrectionImpact[] => {
  const learningUnitById = new Map(learningUnits.map((output) => [output.value.id, output.value]));
  return build.correctionImpacts.map((impact) => {
    const impactedOutcomeIds = new Set(finalOutcomeIdsForImpact(build, impact.id));
    const locators = impact.surfaceAssessments.flatMap<CorrectionImpactLocator>((assessment) => {
      if (assessment.ownerType === 'problem') {
        if (assessment.surface === 'placement') {
          return [
            {
              ownerType: 'problem_placement' as const,
              problemId: assessment.problemId,
              path: CANONICAL_PROBLEM_PLACEMENTS_PATH,
            },
          ];
        }
        const path =
          assessment.surface === 'body'
            ? 'sections.reasoning'
            : assessment.surface === 'example'
              ? 'examples.taxonomy-integration'
              : assessment.surface === 'exercise'
                ? 'exercises.taxonomy-integration'
                : assessment.surface === 'answer'
                  ? 'exercises.taxonomy-integration.answer'
                  : null;
        return path === null
          ? []
          : [{ ownerType: 'problem' as const, problemId: assessment.problemId, path }];
      }
      if (assessment.ownerType === 'learning_unit_candidate') {
        if (assessment.surface === 'body') {
          return [
            {
              ownerType: 'learning_unit' as const,
              learningUnitId: assessment.learningUnitId,
              path: 'content' as const,
            },
          ];
        }
        if (
          assessment.surface !== 'example' &&
          assessment.surface !== 'exercise' &&
          assessment.surface !== 'answer'
        ) {
          return [];
        }
        const unit = learningUnitById.get(assessment.learningUnitId);
        if (unit === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_CORRECTION_UNIT_UNKNOWN',
            `${impact.id}/${assessment.learningUnitId}`,
          );
        }
        const ownedImpactedOutcomeIds = new Set(
          (unit.ownedLearningOutcomeIds ?? []).filter((outcomeId) =>
            impactedOutcomeIds.has(outcomeId),
          ),
        );
        const paths =
          assessment.surface === 'example'
            ? unit.examples
                .filter(({ learningOutcomeIds, learningUnitRole }) =>
                  learningUnitRole === 'curriculum_routing'
                    ? learningOutcomeIds.some((outcomeId) => impactedOutcomeIds.has(outcomeId))
                    : learningUnitRole === 'guided_outcome' &&
                      learningOutcomeIds.some((outcomeId) =>
                        ownedImpactedOutcomeIds.has(outcomeId),
                      ),
                )
                .map(({ key }) => `examples.${key}`)
            : unit.exercises
                .filter(({ learningOutcomeIds, learningUnitRole }) =>
                  learningUnitRole === 'curriculum_routing'
                    ? learningOutcomeIds.some((outcomeId) => impactedOutcomeIds.has(outcomeId))
                    : learningUnitRole === 'outcome_attainment' &&
                      learningOutcomeIds.some((outcomeId) =>
                        ownedImpactedOutcomeIds.has(outcomeId),
                      ),
                )
                .map(({ key }) =>
                  assessment.surface === 'answer' ? `exercises.${key}.answer` : `exercises.${key}`,
                );
        if (paths.length === 0) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_CORRECTION_BLOCK_MISSING',
            `${impact.id}/${assessment.learningUnitId}/${assessment.surface}`,
          );
        }
        return paths.map((path) => ({
          ownerType: 'learning_unit' as const,
          learningUnitId: assessment.learningUnitId,
          path,
        }));
      }
      return [];
    });
    const uniqueLocators = [
      ...new Map(locators.map((locator) => [canonicalJson(locator), locator])).values(),
    ];
    const sourceRevisionId = impact.sourceRevisionIds[0];
    if (sourceRevisionId === undefined || uniqueLocators.length === 0) {
      throw new CanonicalTaxonomyMaterializationError(
        'CANONICAL_CORRECTION_IMPACT_INCOMPLETE',
        impact.id,
      );
    }
    return CorrectionImpactSchema.parse({
      id: impact.id,
      sourceRevisionId,
      sourceRevisionIds: impact.sourceRevisionIds,
      changeSummary: impact.changeSummary,
      affectedContentLocators: uniqueLocators,
      affectedLearningUnitOrderIds: impact.affectedLearningUnitOrderIds,
      derivedIndexPaths: impact.derivedIndexPaths,
      verificationStatus: 'pending',
    });
  });
};

export const buildCanonicalTaxonomyMaterialization = (
  rawInput: CanonicalTaxonomyMaterializationInput,
): CanonicalTaxonomyMaterialization => {
  const input = assertMaterializationInput(rawInput);
  const { build } = input;
  const sourceBuild = buildSourceReference(build);
  const tagCandidates = build.finalCandidates.filter(
    (candidate): candidate is Extract<(typeof build.finalCandidates)[number], { kind: 'tag' }> =>
      candidate.kind === 'tag',
  );
  const outcomeCandidates = build.finalCandidates.filter(
    (
      candidate,
    ): candidate is Extract<(typeof build.finalCandidates)[number], { kind: 'outcome' }> =>
      candidate.kind === 'outcome',
  );
  const unitCandidates = build.finalCandidates.filter(
    (candidate): candidate is Extract<(typeof build.finalCandidates)[number], { kind: 'unit' }> =>
      candidate.kind === 'unit',
  );
  const tags = tagCandidates.map(({ entity }) => TechniqueTagSchema.parse(entity));
  const outcomes = outcomeCandidates.map(({ entity }) => LearningOutcomeSchema.parse(entity));
  const tagById = new Map(tags.map((tag) => [tag.id, tag]));
  const outcomeById = new Map(outcomes.map((outcome) => [outcome.id, outcome]));
  const outcomeCandidateById = new Map(
    outcomeCandidates.map((candidate) => [candidate.entity.id, candidate]),
  );
  const unitCandidateById = new Map(
    unitCandidates.map((candidate) => [candidate.entity.id, candidate]),
  );
  const recordByProblemId = new Map(input.records.map((record) => [record.problemId, record]));
  const problemById = new Map(input.problems.map((problem) => [problem.id, problem]));
  const sourceById = new Map(input.sources.map((source) => [source.id, source]));
  const unitById = new Map(
    unitCandidates.map(({ entity }) => [entity.id, { id: entity.id, parentId: entity.parentId }]),
  );
  const primaryProblemIdsByOutcomeId = new Map<string, Set<string>>();
  const supportingProblemIdsByOutcomeId = new Map<string, Set<string>>();
  const addPlacementProblem = (
    index: Map<string, Set<string>>,
    outcomeId: string,
    problemId: string,
  ): void => {
    const problemIds = index.get(outcomeId) ?? new Set<string>();
    problemIds.add(problemId);
    index.set(outcomeId, problemIds);
  };
  for (const placement of build.placements) {
    for (const outcomeId of [
      placement.primaryOutcomeId,
      ...placement.additionalPrimaryOutcomeIds,
    ]) {
      addPlacementProblem(primaryProblemIdsByOutcomeId, outcomeId, placement.problemId);
    }
    for (const outcomeId of placement.supportingOutcomeIds) {
      addPlacementProblem(supportingProblemIdsByOutcomeId, outcomeId, placement.problemId);
    }
  }

  const learningUnits: CanonicalLearningUnitOutput[] = unitCandidates
    .map((candidate) => {
      const unit = candidate.entity;
      const childUnits = unitCandidates
        .filter(({ entity }) => entity.parentId === unit.id)
        .map(({ entity }) => ({
          id: entity.id,
          title: entity.title,
          documentPath: learningUnitDocumentPath(entity, unitById),
          globalIndex: entity.globalIndex,
          learningOutcomeIds: entity.learningOutcomeIds,
          ownedLearningOutcomeIds: entity.ownedLearningOutcomeIds,
          excludedTopics: entity.excludedTopics,
          orderReason: entity.orderReason,
        }))
        .sort((left, right) => left.globalIndex - right.globalIndex);
      const activities: LearningActivity[] = unit.ownedLearningOutcomeIds.map((outcomeId) => {
        const outcome = outcomeById.get(outcomeId);
        const outcomeCandidate = outcomeCandidateById.get(outcomeId);
        if (outcome === undefined || outcomeCandidate === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_UNIT_OUTCOME_UNKNOWN',
            `${unit.id}/${outcomeId}`,
          );
        }
        const rankedRecords = rankedRecordsForOutcome({
          outcomeId,
          unitProblemIds: unit.problemIds,
          outcomeEvidenceProblemIds: outcomeCandidate.evidenceRefs.map(
            ({ problemId }) => problemId,
          ),
          primaryProblemIds: primaryProblemIdsByOutcomeId.get(outcomeId) ?? new Set<string>(),
          supportingProblemIds: supportingProblemIdsByOutcomeId.get(outcomeId) ?? new Set<string>(),
          recordByProblemId,
        });
        const record = rankedRecords[0];
        if (record === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_UNIT_ACTIVITY_SOURCE_MISSING',
            `${unit.id}/${outcomeId}`,
          );
        }
        const problem = problemById.get(record.problemId);
        if (problem === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_UNIT_PROBLEM_UNKNOWN',
            record.problemId,
          );
        }
        const assessmentRecord = rankedRecords.find(({ problemId }) => {
          const selected = CANONICAL_GUIDED_EXAMPLES[outcomeId]?.assessmentProblemId;
          return selected === undefined ? problemId !== record.problemId : problemId === selected;
        });
        const assessmentProblem =
          assessmentRecord === undefined ? undefined : problemById.get(assessmentRecord.problemId);
        if (assessmentRecord !== undefined && assessmentProblem === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_UNIT_PROBLEM_UNKNOWN',
            assessmentRecord.problemId,
          );
        }
        return {
          outcome,
          record,
          problem,
          evidenceClaims: evidenceClaimsForRecord(outcomeCandidate.evidenceRefs, record),
          assessmentRecord: assessmentRecord ?? null,
          assessmentProblem: assessmentProblem ?? null,
          assessmentEvidenceClaims:
            assessmentRecord === undefined
              ? evidenceClaimsForRecord(outcomeCandidate.evidenceRefs, record)
              : evidenceClaimsForRecord(outcomeCandidate.evidenceRefs, assessmentRecord),
          assessmentKind:
            assessmentRecord === undefined ? 'boundary_transformation' : 'transfer_problem',
        };
      });
      const guidedExamples = activities.map(({ outcome, record, problem }) => ({
        key: `guided-${outcome.id}`,
        learningUnitRole: 'guided_outcome' as const,
        learningOutcomeIds: [outcome.id],
        kind: 'illustrative' as const,
        language: '日本語（考察手順）',
        omissions: [
          CANONICAL_GUIDED_EXAMPLES[outcome.id]?.scope ?? '',
          '問題固有の完全実装と入出力仕様は、後続のProblem解説で扱う。',
        ],
        environment: '対象学習者の共通前提を満たす紙上検討または任意の競技プログラミング環境',
        input: `${problemLabel(problem)}について、${record.reasoningPath.observations[0]?.text ?? outcome.statement}`,
        procedure: CANONICAL_GUIDED_EXAMPLES[outcome.id]?.walkthrough ?? activityProcedure(record),
        executionTarget: null,
        expectedResult: outcome.statement,
        verificationStatus: 'not_applicable' as const,
      }));
      const attainmentExercises = activities.map(
        ({
          outcome,
          problem,
          assessmentRecord,
          assessmentProblem,
          assessmentEvidenceClaims,
          assessmentKind,
        }) => ({
          key: `attainment-${outcome.id}`,
          learningUnitRole: 'outcome_attainment' as const,
          learningOutcomeIds: [outcome.id],
          prerequisiteIds: sortedUnique([
            unit.baselineId,
            ...unit.additionalPrerequisiteUnitIds,
            ...outcome.prerequisiteOutcomeIds,
          ]),
          attainmentCondition:
            assessmentKind === 'transfer_problem'
              ? `学習成果「${withoutTerminalPunctuation(outcome.statement)}」をガイドとは別の題材で再現し、発動条件と成立理由を説明できる。`
              : `学習成果「${withoutTerminalPunctuation(outcome.statement)}」の発動条件を一つ崩したときの破綻点を特定し、適用境界を説明できる。`,
          assessment: {
            method:
              CANONICAL_GUIDED_EXAMPLES[outcome.id]?.assessmentMethod ??
              (assessmentKind === 'transfer_problem' && assessmentProblem !== null
                ? `${problemLabel(assessmentProblem)}を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。`
                : `${problemLabel(problem)}で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。`),
            successCondition: `手法名の列挙に留まらず、学習成果「${withoutTerminalPunctuation(outcome.statement)}」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。`,
          },
          answer: {
            reasoningOrVerification:
              assessmentRecord === null
                ? '単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。'
                : `別題材では次の直接根拠を対象技能として切り出す: ${withoutTerminalPunctuation(assessmentEvidenceClaims.join('／'))}。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。`,
            procedure:
              CANONICAL_GUIDED_EXAMPLES[outcome.id]?.assessmentProcedure ??
              (assessmentRecord === null
                ? [
                    '元の方針が必要とする対象・操作・不変量・目標を分けて書く。',
                    '発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。',
                    '元の正当化のうち最初に成立しなくなる命題を指摘する。',
                    '計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。',
                    '条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。',
                  ]
                : transferAnswerProcedure(assessmentRecord, assessmentEvidenceClaims)),
            expectedResult:
              assessmentKind === 'transfer_problem'
                ? outcome.statement
                : `${withoutTerminalPunctuation(outcome.statement)}の適用可能範囲と破綻条件を反例付きで説明できる。`,
            verificationStatus: 'pending' as const,
          },
        }),
      );
      const routingExamples =
        childUnits.length === 0
          ? []
          : [
              {
                key: 'curriculum-routing',
                learningUnitRole: 'curriculum_routing' as const,
                learningOutcomeIds: sortedUnique(
                  childUnits.flatMap(({ learningOutcomeIds }) => learningOutcomeIds),
                ),
                kind: 'illustrative' as const,
                language: '日本語（学習経路の比較）',
                omissions: [
                  '各Outcomeの証明・実装・問題固有の完全解説は、それを直接所有する下位単元で扱う。',
                ],
                environment: '紙上での未知問のモデル化と候補比較',
                input: `${unit.title}の範囲に属する未知問を一問選び、対象・操作・保つ量・求める量を抽出する。`,
                procedure: childUnits.map((child) => {
                  const directTarget =
                    child.ownedLearningOutcomeIds.length === 0
                      ? `${String(child.learningOutcomeIds.length)}個の下位Outcomeへの索引`
                      : `${String(child.ownedLearningOutcomeIds.length)}個の直接所有Outcome`;
                  return `${child.title}: ${directTarget}、学ぶ理由「${withoutTerminalPunctuation(child.orderReason)}」、対象外「${withoutTerminalPunctuation(child.excludedTopics[0] ?? '定義に当てはまらない問題')}」を照合する。`;
                }),
                executionTarget: null,
                expectedResult:
                  '下位単元を一つ以上の根拠とともに選び、近い不採用候補との境界を説明できる。',
                verificationStatus: 'not_applicable' as const,
              },
            ];
      const routingExercises =
        childUnits.length === 0
          ? []
          : [
              {
                key: 'curriculum-routing',
                learningUnitRole: 'curriculum_routing' as const,
                learningOutcomeIds: sortedUnique(
                  childUnits.flatMap(({ learningOutcomeIds }) => learningOutcomeIds),
                ),
                prerequisiteIds: sortedUnique([
                  unit.baselineId,
                  ...unit.additionalPrerequisiteUnitIds,
                ]),
                attainmentCondition:
                  '未知問の構造から下位単元の候補を絞り、採用・棄却を発動条件と対象外の両方で説明できる。',
                assessment: {
                  method:
                    '未知問を一問選び、各下位単元に対して「発動条件を満たす」「対象外に該当する」「情報不足」のいずれかを判定し、標準順に沿って最初に学ぶ単元を選ぶ。',
                  successCondition:
                    '採用単元には必要な対象・操作・不変量を対応付け、少なくとも一つの近い候補には反例または条件不足を示す。',
                },
                answer: {
                  reasoningOrVerification:
                    '正解は一つの単元名ではなく、問題構造と各候補の定義・対象外との照合である。下位単元のOutcome自体の到達確認はそれぞれの所有Unitで行う。',
                  procedure: [
                    '問題を対象・操作・保つ量・求める量へ分解する。',
                    '各下位単元の発動条件を一つずつ照合し、不足情報を明示する。',
                    '採用候補の成立理由と、近い候補の最初の破綻点を対にする。',
                    '前提DAGと標準順を確認し、選んだ経路の最初の単元を決める。',
                  ],
                  expectedResult:
                    '未知問に対する学習経路を、発動条件・棄却理由・前提順とともに再現できる。',
                  verificationStatus: 'pending' as const,
                },
              },
            ];
      const examples = [...guidedExamples, ...routingExamples];
      const exercises = [...attainmentExercises, ...routingExercises];
      const sourceRevisionIds = sortedUnique([
        ...unit.sourceRevisionIds,
        ...activities.flatMap(({ record, assessmentRecord }) => [
          ...record.sourceRevisionIds,
          ...(assessmentRecord?.sourceRevisionIds ?? []),
        ]),
      ]);
      const documentPath = learningUnitDocumentPath(unit, unitById);
      const materializedUnit = LearningUnitSchema.parse({
        ...unit,
        sourceRevisionIds,
        contentPhase: 'canonical_skeleton',
        docPath: documentPath,
        examples,
        exercises,
      });
      const materializedTags = (materializedUnit.ownedTagIds ?? []).map((tagId) => {
        const tag = tagById.get(tagId);
        if (tag === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_UNIT_TAG_UNKNOWN',
            `${unit.id}/${tagId}`,
          );
        }
        return tag;
      });
      const prerequisiteTitles = materializedUnit.additionalPrerequisiteUnitIds.map(
        (prerequisiteId) => unitCandidateById.get(prerequisiteId)?.entity.title ?? prerequisiteId,
      );
      const materializedSources = materializedUnit.sourceRevisionIds.map((sourceId) => {
        const source = sourceById.get(sourceId);
        if (source === undefined) {
          throw new CanonicalTaxonomyMaterializationError(
            'CANONICAL_UNIT_SOURCE_UNKNOWN',
            `${unit.id}/${sourceId}`,
          );
        }
        return source;
      });
      return {
        relativePath: `src/content/learning-units/${materializedUnit.id}.json`,
        value: materializedUnit,
        documentPath,
        document: renderLearningUnitDocument({
          unit: materializedUnit,
          tags: materializedTags,
          outcomes: materializedUnit.learningOutcomeIds.map((outcomeId) => {
            const outcome = outcomeById.get(outcomeId);
            if (outcome === undefined) {
              throw new CanonicalTaxonomyMaterializationError(
                'CANONICAL_UNIT_OUTCOME_UNKNOWN',
                `${unit.id}/${outcomeId}`,
              );
            }
            return outcome;
          }),
          activities,
          childUnits,
          prerequisiteTitles,
          sources: materializedSources,
          sourceBuild,
        }),
      };
    })
    .sort((left, right) => compareCodeUnits(left.value.id, right.value.id));

  const learningOutcomePrerequisites = outcomeCandidates.flatMap(({ entity }) =>
    entity.prerequisiteOutcomeIds.map((prerequisiteId) => ({
      nodeId: entity.id,
      prerequisiteId,
    })),
  );
  const orderReasons = unitCandidates
    .map(({ entity }) => ({
      unitId: entity.id,
      globalIndex: entity.globalIndex,
      reason: entity.orderReason,
    }))
    .sort((left, right) => left.globalIndex - right.globalIndex);
  const learningOrder = CanonicalLearningOrderSchema.parse({
    schemaVersion: '1.0.0',
    sourceBuild,
    tagPrerequisites: build.tagPrerequisites,
    learningOutcomePrerequisites,
    learningUnitPrerequisites: build.learningUnitPrerequisites,
    standardOrder: build.standardOrder,
    orderReasons,
    tagDagDigest: canonicalDigest(build.tagPrerequisites),
    learningOutcomeDagDigest: canonicalDigest(learningOutcomePrerequisites),
    learningUnitDagDigest: canonicalDigest(build.learningUnitPrerequisites),
    orderDigest: canonicalDigest(build.standardOrder),
  });
  const correctionImpacts = canonicalCorrectionImpacts(build, learningUnits);
  const problemPlacementPolicy = CanonicalProblemPlacementPolicySchema.parse({
    schemaVersion: '1.0.0',
    sourceBuild,
    decisionTable: {
      path: 'src/content/policies/problem-placement.json',
      version: input.placementDecisionTable.version,
      digest: input.placementDecisionTable.digest,
    },
    placements: build.placements,
    correctionImpacts,
    previewTaxonomyChanges: build.correctionImpacts,
    placementDigest: canonicalDigest(build.placements),
    correctionImpactDigest: canonicalDigest(correctionImpacts),
    previewTaxonomyChangeDigest: canonicalDigest(build.correctionImpacts),
  });

  const outputs = {
    tags: outputById('src/content/tags', tags),
    learningOutcomes: outputById('src/content/learning-outcomes', outcomes),
    learningUnits,
    learningOrder,
    problemPlacementPolicy,
  };
  const diagnostics = validateCanonicalMaterialization(input, {
    ...outputs,
    problemPlacementEvidence: {},
    materializationEvidence: {},
  });
  if (diagnostics.length > 0) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_MATERIALIZATION_INVALID',
      diagnostics.join('; '),
    );
  }
  const placementKindCounts = Object.fromEntries(
    ['full', 'similar', 'supplement'].map((kind) => [
      kind,
      build.placements.filter((placement) => placement.kind === kind).length,
    ]),
  );
  const placementProblemIds = build.placements.map(({ problemId }) => problemId);
  const placementChecks = [
    { checkId: 'accepted-build-binding', passed: build.status === 'accepted' },
    {
      checkId: 'one-placement-per-problem',
      passed:
        new Set(placementProblemIds).size === placementProblemIds.length &&
        placementProblemIds.length === input.problems.length,
    },
    {
      checkId: 'primary-supporting-tag-disjointness',
      passed: build.placements.every(({ primaryTagIds, supportingTagIds }) =>
        primaryTagIds.every((tagId) => !supportingTagIds.includes(tagId)),
      ),
    },
    {
      checkId: 'canonical-outcome-closure',
      passed: build.placements.every((placement) =>
        [
          placement.primaryOutcomeId,
          ...placement.additionalPrimaryOutcomeIds,
          ...placement.supportingOutcomeIds,
        ].every((outcomeId) => outcomeById.has(outcomeId)),
      ),
    },
    {
      checkId: 'unique-primary-outcome-review-unit',
      passed: build.placements.every(
        ({ primaryOutcomeId, learningUnitIds, presentationUnitId }) =>
          outcomeById.has(primaryOutcomeId) && learningUnitIds.includes(presentationUnitId),
      ),
    },
    {
      checkId: 'full-similar-supplement-decision-evidence',
      passed: build.placements.every((placement) => {
        const identityContract =
          placement.kind === 'full'
            ? placement.primaryProblemId === null &&
              placement.sharedOutcomeIds.length === 0 &&
              placement.additionalElement === null
            : placement.primaryProblemId !== null &&
              placement.sharedOutcomeIds.length > 0 &&
              (placement.kind === 'similar'
                ? placement.additionalElement === null
                : placement.additionalElement !== null);
        const referencedEvidenceIds = new Set(
          placement.analysisEvidenceRefs.flatMap(({ evidenceIds }) => evidenceIds),
        );
        return (
          identityContract &&
          placement.analysisEvidenceRefs.length > 0 &&
          placement.evidenceIds.length > 0 &&
          placement.evidenceIds.every((evidenceId) => referencedEvidenceIds.has(evidenceId)) &&
          placement.claimDispositions.length > 0
        );
      }),
    },
    {
      checkId: 'preview-correction-impact-mapping-coverage',
      passed:
        correctionImpacts.length === build.correctionImpacts.length &&
        correctionImpacts.every(({ verificationStatus }) => verificationStatus === 'pending'),
    },
  ];
  if (placementChecks.some(({ passed }) => !passed)) {
    throw new CanonicalTaxonomyMaterializationError(
      'CANONICAL_PLACEMENT_EVIDENCE_FAILED',
      placementChecks
        .filter(({ passed }) => !passed)
        .map(({ checkId }) => checkId)
        .join(','),
    );
  }
  const problemPlacementEvidence = {
    schemaVersion: '1.0.0',
    evidenceId: 'bootstrap-canonical-problem-placements',
    status: 'passed',
    evidenceScope:
      'T049 taxonomy decisions and CorrectionImpact mapping completeness only. CorrectionImpact target verification stays pending until Problem authoring, executable attainment review, and the T160 derived-index projection are complete.',
    deferredVerificationTaskIds: [
      'T057',
      'T058',
      ...Array.from({ length: 14 }, (_, index) => `T${String(index + 65).padStart(3, '0')}`),
      'T160',
    ],
    sourceBuild,
    problemCount: build.placements.length,
    uniqueProblemCount: new Set(build.placements.map(({ problemId }) => problemId)).size,
    primaryOutcomeReviewUnitBindingCount: build.placements.length,
    placementKindCounts,
    tagAssignmentCount: build.placements.reduce(
      (sum, placement) => sum + placement.primaryTagIds.length + placement.supportingTagIds.length,
      0,
    ),
    correctionImpactCount: correctionImpacts.length,
    previewTaxonomyChangeCount: build.correctionImpacts.length,
    placementDigest: problemPlacementPolicy.placementDigest,
    correctionImpactDigest: problemPlacementPolicy.correctionImpactDigest,
    checks: placementChecks,
  };
  const materializationDigests = {
    tags: canonicalDigest(outputs.tags.map(({ value }) => value)),
    learningOutcomes: canonicalDigest(outputs.learningOutcomes.map(({ value }) => value)),
    learningUnits: canonicalDigest(learningUnits.map(({ value }) => value)),
    learningDocuments: canonicalDigest(
      learningUnits.map(({ documentPath, document }) => ({ documentPath, document })),
    ),
    learningOrderDigest: canonicalDigest(learningOrder),
    problemPlacementPolicyDigest: canonicalDigest(problemPlacementPolicy),
  };
  const materializationSubject = { sourceBuild, ...materializationDigests };
  const materializationEvidence = {
    schemaVersion: '1.0.0',
    evidenceId: 'bootstrap-canonical-taxonomy-materialization',
    status: 'passed',
    evidenceScope:
      'T047–T050 canonical taxonomy, placement policy, and publication-disabled LearningUnit skeleton only. Full Unit expansion, executable attainment verification, Problem explanation authoring, and public projection remain deferred.',
    deferredCompletionTaskIds: [
      'T055',
      'T056',
      'T057',
      'T058',
      'T059',
      ...Array.from({ length: 14 }, (_, index) => `T${String(index + 65).padStart(3, '0')}`),
      'T155',
      'T156',
      'T157',
      'T158',
      'T160',
    ],
    sourceBuild,
    taskIds: ['T047', 'T048', 'T049', 'T050'],
    counts: {
      tags: outputs.tags.length,
      learningOutcomes: outputs.learningOutcomes.length,
      learningUnits: learningUnits.length,
      learningDocuments: learningUnits.length,
      directlyOwnedTags: learningUnits.reduce(
        (count, { value }) => count + (value.ownedTagIds?.length ?? 0),
        0,
      ),
      directlyOwnedLearningOutcomes: learningUnits.reduce(
        (count, { value }) => count + (value.ownedLearningOutcomeIds?.length ?? 0),
        0,
      ),
      guidedOutcomeExamples: learningUnits.reduce(
        (count, { value }) =>
          count +
          value.examples.filter(({ learningUnitRole }) => learningUnitRole === 'guided_outcome')
            .length,
        0,
      ),
      outcomeAttainmentExercises: learningUnits.reduce(
        (count, { value }) =>
          count +
          value.exercises.filter(
            ({ learningUnitRole }) => learningUnitRole === 'outcome_attainment',
          ).length,
        0,
      ),
      curriculumRoutingUnits: learningUnits.filter(({ value }) =>
        value.examples.some(({ learningUnitRole }) => learningUnitRole === 'curriculum_routing'),
      ).length,
      placements: build.placements.length,
      correctionImpacts: correctionImpacts.length,
    },
    paths: {
      tags: 'src/content/tags',
      learningOutcomes: 'src/content/learning-outcomes',
      learningUnits: 'src/content/learning-units',
      learningDocuments: 'src/content/docs/learn',
      learningOrder: CANONICAL_LEARNING_ORDER_PATH,
      problemPlacements: CANONICAL_PROBLEM_PLACEMENTS_PATH,
      problemPlacementEvidence: CANONICAL_PROBLEM_PLACEMENT_EVIDENCE_PATH,
      materializationEvidence: CANONICAL_TAXONOMY_MATERIALIZATION_EVIDENCE_PATH,
    },
    digests: materializationDigests,
    materializationDigest: canonicalDigest(materializationSubject),
  };
  return {
    ...outputs,
    problemPlacementEvidence,
    materializationEvidence,
  };
};

export const validateCanonicalMaterialization = (
  input: CanonicalTaxonomyMaterializationInput,
  result: CanonicalTaxonomyMaterialization,
): string[] => {
  const diagnostics: string[] = [];
  const expectedTags = input.build.finalCandidates
    .filter((candidate) => candidate.kind === 'tag')
    .map(({ entity }) => entity)
    .sort((left, right) => compareCodeUnits(left.id, right.id));
  const expectedOutcomes = input.build.finalCandidates
    .filter((candidate) => candidate.kind === 'outcome')
    .map(({ entity }) => entity)
    .sort((left, right) => compareCodeUnits(left.id, right.id));
  const expectedUnits = new Map(
    input.build.finalCandidates
      .filter((candidate) => candidate.kind === 'unit')
      .map(({ entity }) => [entity.id, entity]),
  );
  const actualTags = result.tags.map(({ value }) => value);
  const actualOutcomes = result.learningOutcomes.map(({ value }) => value);
  const sourceIds = new Set(input.sources.map(({ id }) => id));
  const directTagOwnerCount = new Map<string, number>();
  const directOutcomeOwnerCount = new Map<string, number>();
  const guidedOutcomeCount = new Map<string, number>();
  const attainmentOutcomeCount = new Map<string, number>();
  const increment = (counts: Map<string, number>, id: string): void => {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  };
  if (canonicalJson(actualTags) !== canonicalJson(expectedTags)) diagnostics.push('TAG_DRIFT');
  if (canonicalJson(actualOutcomes) !== canonicalJson(expectedOutcomes)) {
    diagnostics.push('OUTCOME_DRIFT');
  }
  if (result.learningUnits.length !== expectedUnits.size) diagnostics.push('UNIT_COUNT_MISMATCH');
  for (const output of result.learningUnits) {
    const expected = expectedUnits.get(output.value.id);
    if (expected === undefined) {
      diagnostics.push(`UNIT_UNKNOWN:${output.value.id}`);
      continue;
    }
    const fixedProjection = Object.fromEntries(
      Object.entries(output.value).filter(
        ([field]) =>
          !['contentPhase', 'docPath', 'examples', 'exercises', 'sourceRevisionIds'].includes(
            field,
          ),
      ),
    );
    const expectedProjection = Object.fromEntries(
      Object.entries(expected).filter(([field]) => field !== 'sourceRevisionIds'),
    );
    if (canonicalJson(fixedProjection) !== canonicalJson(expectedProjection)) {
      diagnostics.push(`UNIT_TAXONOMY_DRIFT:${output.value.id}`);
    }
    if (
      expected.sourceRevisionIds.some(
        (sourceId) => !output.value.sourceRevisionIds.includes(sourceId),
      )
    ) {
      diagnostics.push(`UNIT_SOURCE_COVERAGE:${output.value.id}`);
    }
    if (output.value.sourceRevisionIds.some((sourceId) => !sourceIds.has(sourceId))) {
      diagnostics.push(`UNIT_SOURCE_UNKNOWN:${output.value.id}`);
    }
    if (output.value.docPath !== output.documentPath) {
      diagnostics.push(`UNIT_DOCUMENT_PATH:${output.value.id}`);
    }
    if (
      REQUIRED_DOCUMENT_SECTIONS.some((section) => !output.document.includes(section)) ||
      !output.document.includes('\ndraft: true\n') ||
      output.document.includes('objectPatterns') ||
      output.document.includes('triggerPatterns')
    ) {
      diagnostics.push(`UNIT_DOCUMENT_STRUCTURE:${output.value.id}`);
    }
    const ownedTagIds = output.value.ownedTagIds;
    const ownedOutcomeIds = output.value.ownedLearningOutcomeIds;
    if (
      ownedTagIds === undefined ||
      ownedOutcomeIds === undefined ||
      output.value.contentPhase === undefined
    ) {
      diagnostics.push(`UNIT_OWNERSHIP_MISSING:${output.value.id}`);
      continue;
    }
    for (const tagId of ownedTagIds) increment(directTagOwnerCount, tagId);
    for (const outcomeId of ownedOutcomeIds) increment(directOutcomeOwnerCount, outcomeId);

    const guidedExamples = output.value.examples.filter(
      ({ learningUnitRole }) => learningUnitRole === 'guided_outcome',
    );
    const routingExamples = output.value.examples.filter(
      ({ learningUnitRole }) => learningUnitRole === 'curriculum_routing',
    );
    const attainmentExercises = output.value.exercises.filter(
      ({ learningUnitRole }) => learningUnitRole === 'outcome_attainment',
    );
    const routingExercises = output.value.exercises.filter(
      ({ learningUnitRole }) => learningUnitRole === 'curriculum_routing',
    );
    const guidedOutcomeIds = guidedExamples.flatMap(({ learningOutcomeIds }) => learningOutcomeIds);
    const attainmentOutcomeIds = attainmentExercises.flatMap(
      ({ learningOutcomeIds }) => learningOutcomeIds,
    );
    for (const outcomeId of guidedOutcomeIds) increment(guidedOutcomeCount, outcomeId);
    for (const outcomeId of attainmentOutcomeIds) increment(attainmentOutcomeCount, outcomeId);
    if (
      output.value.examples.some(({ learningUnitRole }) => learningUnitRole === undefined) ||
      guidedExamples.some(
        ({ key, learningOutcomeIds }) =>
          learningOutcomeIds.length !== 1 || key !== `guided-${learningOutcomeIds[0] ?? ''}`,
      ) ||
      canonicalJson(sortedUnique(guidedOutcomeIds)) !== canonicalJson(sortedUnique(ownedOutcomeIds))
    ) {
      diagnostics.push(`UNIT_GUIDED_OUTCOME_OWNERSHIP:${output.value.id}`);
    }
    if (
      output.value.exercises.some(({ learningUnitRole }) => learningUnitRole === undefined) ||
      attainmentExercises.some(
        ({ key, learningOutcomeIds }) =>
          learningOutcomeIds.length !== 1 || key !== `attainment-${learningOutcomeIds[0] ?? ''}`,
      ) ||
      canonicalJson(sortedUnique(attainmentOutcomeIds)) !==
        canonicalJson(sortedUnique(ownedOutcomeIds))
    ) {
      diagnostics.push(`UNIT_ATTAINMENT_OUTCOME_OWNERSHIP:${output.value.id}`);
    }

    const children = [...expectedUnits.values()].filter(
      ({ parentId }) => parentId === output.value.id,
    );
    const routedOutcomeIds = sortedUnique(
      children.flatMap(({ learningOutcomeIds }) => learningOutcomeIds),
    );
    const expectedRoutingCount = children.length === 0 ? 0 : 1;
    if (
      routingExamples.length !== expectedRoutingCount ||
      routingExercises.length !== expectedRoutingCount ||
      routingExamples.some(
        ({ key, learningOutcomeIds }) =>
          key !== 'curriculum-routing' ||
          canonicalJson(sortedUnique(learningOutcomeIds)) !== canonicalJson(routedOutcomeIds),
      ) ||
      routingExercises.some(
        ({ key, learningOutcomeIds }) =>
          key !== 'curriculum-routing' ||
          canonicalJson(sortedUnique(learningOutcomeIds)) !== canonicalJson(routedOutcomeIds),
      )
    ) {
      diagnostics.push(`UNIT_CURRICULUM_ROUTING:${output.value.id}`);
    }
    if (
      (output.value.contentPhase === 'canonical_skeleton' &&
        output.value.exercises.some(({ answer }) => answer.verificationStatus !== 'pending')) ||
      output.value.examples.length !== ownedOutcomeIds.length + expectedRoutingCount ||
      output.value.exercises.length !== ownedOutcomeIds.length + expectedRoutingCount
    ) {
      diagnostics.push(`UNIT_ACTIVITY_COUNT_OR_STATUS:${output.value.id}`);
    }
    if (children.length > 0 !== output.document.includes('## 下位単元を使い分ける比較例')) {
      diagnostics.push(`UNIT_ROUTING_DOCUMENT:${output.value.id}`);
    }
  }
  for (const { id } of actualTags) {
    if (directTagOwnerCount.get(id) !== 1) diagnostics.push(`TAG_OWNER_COUNT:${id}`);
  }
  for (const { id } of actualOutcomes) {
    if (directOutcomeOwnerCount.get(id) !== 1) diagnostics.push(`OUTCOME_OWNER_COUNT:${id}`);
    if (guidedOutcomeCount.get(id) !== 1) diagnostics.push(`OUTCOME_GUIDED_COUNT:${id}`);
    if (attainmentOutcomeCount.get(id) !== 1) diagnostics.push(`OUTCOME_ATTAINMENT_COUNT:${id}`);
  }
  if (
    canonicalJson(result.learningOrder.tagPrerequisites) !==
      canonicalJson(input.build.tagPrerequisites) ||
    canonicalJson(result.learningOrder.learningUnitPrerequisites) !==
      canonicalJson(input.build.learningUnitPrerequisites) ||
    canonicalJson(result.learningOrder.standardOrder) !== canonicalJson(input.build.standardOrder)
  ) {
    diagnostics.push('LEARNING_ORDER_DRIFT');
  }
  if (
    canonicalJson(result.problemPlacementPolicy.placements) !==
    canonicalJson(input.build.placements)
  ) {
    diagnostics.push('PLACEMENT_DRIFT');
  }
  const outcomeIds = new Set(actualOutcomes.map(({ id }) => id));
  if (
    result.problemPlacementPolicy.placements.some((placement) =>
      [
        placement.primaryOutcomeId,
        ...placement.additionalPrimaryOutcomeIds,
        ...placement.supportingOutcomeIds,
      ].some((outcomeId) => !outcomeIds.has(outcomeId)),
    )
  ) {
    diagnostics.push('PLACEMENT_OUTCOME_UNKNOWN');
  }
  const ownerUnitIdsByOutcomeId = new Map(
    actualOutcomes.map(({ id }) => [
      id,
      result.learningUnits
        .filter(({ value }) => value.ownedLearningOutcomeIds?.includes(id) === true)
        .map(({ value }) => value.id),
    ]),
  );
  const standardOrderIndex = new Map(
    result.learningOrder.standardOrder.map((unitId, index) => [unitId, index]),
  );
  for (const placement of result.problemPlacementPolicy.placements) {
    const primaryOutcomeIds = [
      placement.primaryOutcomeId,
      ...placement.additionalPrimaryOutcomeIds,
    ];
    const assignedOutcomeIds = [...primaryOutcomeIds, ...placement.supportingOutcomeIds];
    const expectedUnitIds = sortedUnique(
      assignedOutcomeIds.flatMap((outcomeId) => ownerUnitIdsByOutcomeId.get(outcomeId) ?? []),
    );
    if (canonicalJson(sortedUnique(placement.learningUnitIds)) !== canonicalJson(expectedUnitIds)) {
      diagnostics.push(`PLACEMENT_UNIT_OWNERSHIP:${placement.problemId}`);
    }
    const expectedPresentationUnitId = primaryOutcomeIds
      .flatMap((outcomeId) => ownerUnitIdsByOutcomeId.get(outcomeId) ?? [])
      .sort(
        (left, right) =>
          (standardOrderIndex.get(left) ?? Number.POSITIVE_INFINITY) -
            (standardOrderIndex.get(right) ?? Number.POSITIVE_INFINITY) ||
          compareCodeUnits(left, right),
      )
      .at(-1);
    if (placement.presentationUnitId !== expectedPresentationUnitId) {
      diagnostics.push(`PLACEMENT_PRESENTATION_OWNER:${placement.problemId}`);
    }
  }
  if (
    canonicalJson(result.problemPlacementPolicy.previewTaxonomyChanges) !==
      canonicalJson(input.build.correctionImpacts) ||
    canonicalJson(result.problemPlacementPolicy.correctionImpacts) !==
      canonicalJson(canonicalCorrectionImpacts(input.build, result.learningUnits))
  ) {
    diagnostics.push('CORRECTION_IMPACT_DRIFT');
  }
  return diagnostics;
};
