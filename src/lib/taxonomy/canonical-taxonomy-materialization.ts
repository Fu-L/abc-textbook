import type { z } from 'zod';
import { CANONICAL_UNIT_CONTENT } from './canonical-unit-content.js';
import { PROBLEM_READING_ORDER_REASON } from './problem-reading-order.js';
import { TEXTBOOK_CHAPTERS, textbookIndex } from './textbook-order.js';
import { isCurriculumUnit } from './learning-unit-order.js';
import { unitLearningTarget } from './unit-learning-targets.js';

import { canonicalDigest, canonicalJson } from '../domain/canonical-json.js';
import {
  CanonicalLearningOrderSchema,
  CanonicalProblemPlacementPolicySchema,
  CorrectionImpactSchema,
  FinalTaxonomyBuildSchema,
  LearningOutcomeSchema,
  LearningUnitSchema,
  ProblemAnalysisRecordSchema,
  ProblemPlacementDecisionTableSchema,
  ProblemSchema,
  SourceRevisionSchema,
  TechniqueTagSchema,
} from '../domain/schema-parts/catalog.js';

type FinalTaxonomyBuild = z.infer<typeof FinalTaxonomyBuildSchema>;
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
const REQUIRED_DOCUMENT_SECTIONS = ['## 概要', '## 前提と範囲', '## 問題一覧', '## 根拠'] as const;

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

interface ChildLearningUnitLink {
  readonly id: string;
  readonly title: string;
  readonly documentPath: string;
  readonly depth: number;
  readonly isGuide: boolean;
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

const yamlString = (value: string): string => JSON.stringify(value);

const markdownList = (items: readonly string[], emptyText = 'なし'): string =>
  items.length === 0 ? `- ${emptyText}` : items.map((item) => `- ${item}`).join('\n');

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

const renderLearningUnitDocument = (input: {
  readonly unit: LearningUnit;
  readonly tags: readonly TechniqueTag[];
  readonly childUnits: readonly ChildLearningUnitLink[];
  readonly prerequisiteTitles: readonly string[];
  readonly chapterLinks: readonly string[];
  readonly sources: readonly SourceRevision[];
  readonly problems: ReadonlyMap<string, Problem>;
  readonly sourceBuild: { readonly id: string; readonly digest: string };
}): string => {
  const { unit } = input;
  const chapter = TEXTBOOK_CHAPTERS.find(({ id }) => id === unit.id);
  const target = unitLearningTarget(unit.id);
  const targetLabel = isCurriculumUnit(unit) ? '習得対象の目安' : '導入対象の目安';
  const problemLinks = (ids: readonly string[]): string[] =>
    ids.map((id) => {
      const problem = input.problems.get(id);
      if (problem === undefined)
        throw new CanonicalTaxonomyMaterializationError('CANONICAL_UNIT_PROBLEM_UNKNOWN', id);
      return `[${problemLabel(problem)}](${problem.officialUrl})`;
    });
  return [
    '---',
    `title: ${yamlString(unit.title)}`,
    `description: ${yamlString(`「${unit.title}」で学ぶ概念と、基礎から応用へ進む問題一覧。`)}`,
    'draft: true',
    'sidebar:',
    `  order: ${String(textbookIndex(unit.id))}`,
    '---',
    '',
    `# ${unit.title}`,
    '',
    `${targetLabel}: **${target.color}（${target.rating}）**。${target.reason}`,
    '',
    '対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。',
    '',
    ...(unit.id === 'unit-chapter-modeling'
      ? [
          '## 本書の読み方',
          '',
          '本書は、親Unitに続けてその子Unitをまとめ、同じ対象や原理の基本から発展までを連続して読める構成です。章の目次の字下げは親子関係を表します。各Unitの習得対象と追加前提を確認し、今必要な範囲を選んでください。',
          '',
          '「習得対象の目安」は、その色付近の読者がUnitの中心概念を道具として身につける時期を示します。習得とは、標準形の発動条件・不変量・計算量を説明し、実装またはライブラリへの還元ができることです。掲載問題のDifficulty、全問正解に必要なレート、初見で発展解法を発見する難しさは評価に含めません。',
          '',
          '色と数値の境界は[AtCoder公式のAlgorithmレーティング区分](https://info.atcoder.jp/overview/contest/rating)に合わせています。各Unitへの割当ては、前提知識の量、標準形の実装・正当化に必要な理解、他分野への応用範囲を共通基準にした本書の編集判断です。AtCoder公式の履修基準ではありません。',
          '',
          '| 習得対象 | レーティング | 本書での判断の軸・代表例 |',
          '| --- | --- | --- |',
          '| 茶色 | 400–799 | 基本操作を直接使う。累積和・差分、要素索引と連結リスト。 |',
          '| 緑色 | 800–1199 | 状態・順序・計算量を明示する。基本DP、DSU、最短路、二分探索。 |',
          '| 水色 | 1200–1599 | 標準的な抽象化と不変量を使う。Fenwick Tree、LIS、桁DP、SCC。 |',
          '| 青色 | 1600–1999 | 複数の標準技能をつなぎ、作用や還元を設計する。遅延Segment Tree、2-SAT、HLD。 |',
          '| 黄色 | 2000–2399 | 代数的表現や構造定理を使う。畳み込み、母関数、最小費用流、重心分解。 |',
          '| 橙色 | 2400–2799 | 複雑な合成や償却・双対性まで理解する。FPS、Segment Tree Beats、Aliens trick。 |',
          '| 赤色 | 2800以上 | 専門理論を必要に応じて習得する。一般重み付きmatching、FPS合成、線形matroid交差。 |',
          '',
          '章や案内節の「導入対象」は、その見取り図を理解する目安です。子Unitには独立した対象色を付けています。親を読んだ後、高い色の子をいったん飛ばして次のまとまりへ進んで構いません。赤色の専門Unitも、全てを習得することがその色になる条件という意味ではありません。',
          '',
          '表示色は先取りを制限するものではありません。自分の色以下でも未習なら優先して補い、高い色でも必要になったUnitから読んでください。親子のまとまりを優先するため、前提が後の節や章にある場合はリンク先を案内します。未習の前提を補ってから戻るか、その子Unitを後回しにしてください。',
          '',
          'ARC・AGC・CF Div. 1・UCUPなどの難問へ進む際には、解法を再現した後で、成立条件を一つ外すと何が壊れるか、他の章の表現へ写せるかを考えてください。たとえばDP遷移を区間要約・行列・多項式へ写す、割当てをmatching・flowへ写す、といった接続を自分で導けるようにすることが目標です。',
          '',
          '## 全体の構成',
          '',
          ...input.chapterLinks.map((link, index) => `${String(index + 1)}. ${link}`),
          '',
        ]
      : []),
    '## 概要',
    '',
    ...(chapter === undefined ? [] : [chapter.introduction, '']),
    ...input.tags.flatMap((tag) => [`### ${tag.name}`, '', tag.definition, '']),
    ...(CANONICAL_UNIT_CONTENT[unit.id] ?? []).flatMap((paragraph) => [paragraph, '']),
    ...(input.tags.length === 0 ? [unit.orderReason, ''] : []),
    '## 前提と範囲',
    '',
    `共通前提: ${unit.baselineId} (${unit.baselineVersion})。`,
    '',
    `追加前提: ${input.prerequisiteTitles.join('、') || 'なし'}。`,
    '',
    ...(input.tags.length > 0 ? [unit.orderReason, ''] : []),
    '### このUnitでは扱わないもの',
    '',
    markdownList(unit.excludedTopics),
    '',
    ...(input.childUnits.length === 0
      ? []
      : [
          chapter === undefined ? '## 下位単元' : '## 章の構成',
          '',
          ...input.childUnits.map(
            (child) =>
              `${'  '.repeat(child.depth)}- [${child.title}](/learn/${child.documentPath.replace(/^src\/content\/docs\/learn\//u, '').replace(/(?:\/index)?\.md$/u, '')}/) — ${unitLearningTarget(child.id).color}${child.isGuide ? '（導入）' : ''}`,
          ),
          '',
        ]),
    '## 問題一覧',
    '',
    '基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。',
    '',
    ...(unit.directProblemIds?.length
      ? problemLinks(unit.directProblemIds).map((link, i) => `${String(i + 1)}. ${link}`)
      : ['この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。']),
    '',
    '各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。',
    '',
    ...(unit.relatedProblemIds?.length
      ? [
          '## 関連問題',
          '',
          '以下はこの技能を用い、解説本文を別の単元に配置する問題です。',
          '',
          markdownList(problemLinks(unit.relatedProblemIds)),
          '',
        ]
      : []),
    '## 根拠',
    '',
    markdownList(input.sources.map((source) => `[${sourceRevisionLabel(source)}](${source.url})`)),
    '',
    `Canonical taxonomy: FinalTaxonomyBuild \`${input.sourceBuild.id}\` digest \`${input.sourceBuild.digest}\` / LearningUnit \`${unit.id}\``,
    '',
  ].join('\n');
};

const canonicalCorrectionImpacts = (
  build: FinalTaxonomyBuild,
  learningUnits: readonly CanonicalLearningUnitOutput[],
): CorrectionImpact[] => {
  const learningUnitById = new Map(learningUnits.map((output) => [output.value.id, output.value]));
  return build.correctionImpacts.map((impact) => {
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
        return [{ ownerType: 'learning_unit' as const, learningUnitId: unit.id, path: 'content' }];
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
  const unitCandidateById = new Map(
    unitCandidates.map((candidate) => [candidate.entity.id, candidate]),
  );
  const problemById = new Map(input.problems.map((problem) => [problem.id, problem]));
  const sourceById = new Map(input.sources.map((source) => [source.id, source]));
  const unitById = new Map(
    unitCandidates.map(({ entity }) => [entity.id, { id: entity.id, parentId: entity.parentId }]),
  );
  const unitLink = (unit: (typeof unitCandidates)[number]['entity']): string =>
    `[${unit.title}](/learn/${learningUnitDocumentPath(unit, unitById)
      .replace(/^src\/content\/docs\/learn\//u, '')
      .replace(/(?:\/index)?\.md$/u, '')}/)`;
  const chapterLinks = TEXTBOOK_CHAPTERS.flatMap(({ id }) => {
    const chapter = unitCandidateById.get(id);
    return chapter === undefined ? [] : [unitLink(chapter.entity)];
  });
  const learningUnits: CanonicalLearningUnitOutput[] = unitCandidates
    .map((candidate) => {
      const unit = candidate.entity;
      const chapterUnitIds = new Set<string>(
        TEXTBOOK_CHAPTERS.find(({ id }) => id === unit.id)?.unitIds,
      );
      const childUnits = unitCandidates
        .filter(({ entity }) =>
          unit.kind === 'chapter' ? chapterUnitIds.has(entity.id) : entity.parentId === unit.id,
        )
        .map(({ entity }) => {
          let depth = 0;
          let parentId = entity.parentId;
          while (parentId !== null && parentId !== unit.id) {
            depth += 1;
            parentId = unitById.get(parentId)?.parentId ?? null;
          }
          return {
            id: entity.id,
            title: entity.title,
            documentPath: learningUnitDocumentPath(entity, unitById),
            depth,
            isGuide: !isCurriculumUnit(entity),
            learningOutcomeIds: entity.learningOutcomeIds,
            ownedLearningOutcomeIds: entity.ownedLearningOutcomeIds,
            excludedTopics: entity.excludedTopics,
            orderReason: entity.orderReason,
          };
        })
        .sort((left, right) => textbookIndex(left.id) - textbookIndex(right.id));
      const sourceRevisionIds = unit.sourceRevisionIds;
      const documentPath = learningUnitDocumentPath(unit, unitById);
      const materializedUnit = LearningUnitSchema.parse({
        ...unit,
        sourceRevisionIds,
        contentPhase: 'canonical_skeleton',
        docPath: documentPath,
        examples: [],
        exercises: [],
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
      const prerequisiteTitles = materializedUnit.additionalPrerequisiteUnitIds.map((id) => {
        const prerequisite = unitCandidateById.get(id);
        if (prerequisite === undefined) return id;
        const forwardReference =
          textbookIndex(id) > textbookIndex(unit.id)
            ? rootChapterId(id, unitById) === rootChapterId(unit.id, unitById)
              ? '（後の節）'
              : '（後の章）'
            : '';
        return `${unitLink(prerequisite.entity)}${forwardReference}`;
      });
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
          problems: problemById,
          childUnits,
          prerequisiteTitles,
          chapterLinks,
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
    .filter(({ entity }) => build.standardOrder.includes(entity.id))
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
      'T049 taxonomy decisions and CorrectionImpact mapping completeness only. CorrectionImpact target verification stays pending until Problem authoring, content review, and the T160 derived-index projection are complete.',
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
      'T047–T050 canonical taxonomy, placement policy, and publication-disabled LearningUnit skeleton only. Full Unit expansion, content verification, Problem explanation authoring, and public projection remain deferred.',
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
    problemReadingOrderReason: PROBLEM_READING_ORDER_REASON,
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
      directlyPlacedProblems: learningUnits.reduce(
        (count, { value }) => count + (value.directProblemIds?.length ?? 0),
        0,
      ),
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

    if (
      output.value.contentPhase === 'canonical_skeleton' &&
      (output.value.examples.length || output.value.exercises.length)
    ) {
      diagnostics.push(`UNIT_SKELETON_UNEXPECTED_BLOCKS:${output.value.id}`);
    }
  }
  for (const { id } of actualTags) {
    if (directTagOwnerCount.get(id) !== 1) diagnostics.push(`TAG_OWNER_COUNT:${id}`);
  }
  for (const { id } of actualOutcomes) {
    if (directOutcomeOwnerCount.get(id) !== 1) diagnostics.push(`OUTCOME_OWNER_COUNT:${id}`);
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
    const expectedPresentationUnitId = assignedOutcomeIds
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
