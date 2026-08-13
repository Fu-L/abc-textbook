import { deterministicTopologicalOrder } from '../validation/validate.js';
import {
  FINAL_TAG_FORMER_NAMES,
  FINAL_TAG_LEARNER_ALIASES,
  FINAL_TAG_REPRESENTATIVE_PROBLEM_IDS,
} from './final-taxonomy-content.js';
import { FINAL_TAXONOMY_CLAIM_DECISIONS_212_299 } from './final-taxonomy-claims-212-299.js';
import { FINAL_TAXONOMY_CLAIM_DECISIONS_300_383 } from './final-taxonomy-claims-300-383.js';
import { FINAL_TAXONOMY_CLAIM_DECISIONS_384_466 } from './final-taxonomy-claims-384-466.js';
import { CURATED_PRIMARY_TAG_ASSIGNMENTS_212_299 } from './final-taxonomy-decisions-212-299.js';
import { CURATED_PRIMARY_TAG_ASSIGNMENTS_300_383 } from './final-taxonomy-decisions-300-383.js';
import { CURATED_PRIMARY_TAG_ASSIGNMENTS_384_466 } from './final-taxonomy-decisions-384-466.js';

export type TaxonomyIntegrationAction = 'promote' | 'merge' | 'split' | 'retire';
export type TaxonomyEntityKind = 'tag' | 'outcome' | 'unit';

export interface ProblemAnalysisEvidenceInput {
  readonly id: string;
  readonly sourceRevisionIds: readonly string[];
  readonly rationale: string;
}

export interface ProblemAnalysisClaimInput {
  readonly text: string;
  readonly evidenceIds: readonly string[];
}

export interface ProblemAnalysisInput {
  readonly problemId: string;
  readonly sourceRevisionIds: readonly string[];
  readonly evidence: readonly ProblemAnalysisEvidenceInput[];
  readonly reasoningPath: {
    readonly observations: readonly ProblemAnalysisClaimInput[];
    readonly candidateApproaches: readonly {
      readonly approach: string;
      readonly decision: 'adopted' | 'rejected';
      readonly decisionReason: string;
      readonly evidenceIds: readonly string[];
    }[];
    readonly keyInsights: readonly ProblemAnalysisClaimInput[];
    readonly algorithmConnection: ProblemAnalysisClaimInput;
  };
  readonly typicalTechniques: readonly {
    readonly name: string;
    readonly trigger: string;
    readonly application: string;
    readonly evidenceIds: readonly string[];
  }[];
  readonly problemSpecificInsights: readonly {
    readonly insight: string;
    readonly reusablePerspective: string;
    readonly evidenceIds: readonly string[];
  }[];
  readonly prerequisiteCandidates: readonly ProblemAnalysisClaimInput[];
  readonly outcomeCandidates: readonly ProblemAnalysisClaimInput[];
  readonly authorId: string;
  readonly reviewStatus: 'draft' | 'reviewed' | 'changes_requested';
  readonly reviewFindings: readonly string[];
}

export interface SemanticSignaturePolicy {
  readonly objectPatterns: readonly string[];
  readonly triggerPatterns: readonly string[];
  readonly invariantPatterns: readonly string[];
  readonly goalPatterns: readonly string[];
  readonly excludedPatterns: readonly string[];
  readonly minimumDimensions: 1 | 2 | 3 | 4;
  readonly requireObjectForStrictRecall: boolean;
}

export interface FinalTaxonomyTagPolicy {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  /** Learner-facing search terms. Regex-only recall patterns stay in strictRecallTerms. */
  readonly aliases: readonly string[];
  /** Names that were once presented as this exact concept, not split-source labels. */
  readonly formerNames: readonly string[];
  readonly representativeProblemIds: readonly string[];
  readonly parentId: string | null;
  readonly prerequisiteTagIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly learningUnitCandidateIds: readonly string[];
  readonly strictRecallTerms: readonly string[];
  readonly semanticSignature: SemanticSignaturePolicy;
  readonly primaryEligible: boolean;
  readonly primaryPriority: number;
}

export interface ObservableOutcomePolicy {
  readonly id: string;
  readonly statement: string;
  readonly prerequisiteOutcomeIds: readonly string[];
  readonly scopeTagIds: readonly string[];
  readonly learningUnitCandidateIds: readonly string[];
}

export interface MetadataLearningUnitCandidate {
  readonly id: string;
  readonly kind: 'chapter' | 'section' | 'subsection';
  readonly title: string;
  readonly parentId: string | null;
  readonly additionalPrerequisiteUnitIds: readonly string[];
  readonly tagIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly problemIds: readonly string[];
  readonly stageRank: number;
  readonly difficultyRank: number;
  readonly representativeRank: number;
  readonly orderReason: string;
  readonly excludedTopics: readonly string[];
}

export interface OwnerQualifiedEvidenceReference {
  readonly owner: {
    readonly kind: 'problem_analysis';
    readonly problemId: string;
  };
  readonly evidenceId: string;
  readonly sourceRevisionIds: readonly string[];
}

export interface OwnerQualifiedClaimReference {
  readonly owner: {
    readonly kind: 'problem_analysis';
    readonly problemId: string;
  };
  readonly claimPath: string;
  readonly text: string;
  readonly evidenceRefs: readonly OwnerQualifiedEvidenceReference[];
}

export interface AdHocElementProjection {
  readonly text: string;
  readonly reusablePerspective: string;
  readonly claimRef: OwnerQualifiedClaimReference;
}

export type InventoryClaimDispositionKind =
  'primary' | 'supporting' | 'same_tag' | 'baseline' | 'problem_specific';

export interface InventoryClaimDisposition {
  readonly claimRef: OwnerQualifiedClaimReference;
  readonly kind: InventoryClaimDispositionKind;
  readonly tagIds: readonly string[];
  readonly rationale: string;
}

export interface CuratedInventoryClaimDisposition {
  readonly claimPath: string;
  readonly kind: InventoryClaimDispositionKind;
  readonly tagIds: readonly string[];
}

export interface CuratedProblemClaimDecision {
  readonly primaryOutcomeId: string;
  readonly additionalPrimaryOutcomeIds: readonly string[];
  readonly dispositions: readonly CuratedInventoryClaimDisposition[];
  readonly supportingOutcomeIdsByTag: Readonly<Record<string, readonly string[]>>;
}

export interface SupportingTagDecision {
  readonly tagId: string;
  readonly outcomeIds: readonly string[];
  readonly selectionRationale: string;
  readonly decisionBasis: readonly OwnerQualifiedClaimReference[];
}

export interface FinalPrimaryDecision {
  readonly problemId: string;
  readonly primaryOutcomeId: string;
  readonly primaryTagIds: readonly string[];
  readonly additionalPrimaryOutcomeIds: readonly string[];
  readonly supportingTagIds: readonly string[];
  readonly supportingOutcomeIds: readonly string[];
  readonly supportingTagDecisions: readonly SupportingTagDecision[];
  readonly learningUnitCandidateIds: readonly string[];
  readonly presentationUnitId: string;
  readonly decisionKind: 'explicit_inventory_assignment' | 'curated_semantic_override';
  readonly ambiguityStatus: 'proposed_assignment' | 'curated_override';
  readonly selectionRationale: string;
  readonly decisionAuthorId: string;
  readonly acceptanceStatus: 'proposed';
  readonly decisionBasis: readonly OwnerQualifiedClaimReference[];
  readonly claimDispositions: readonly InventoryClaimDisposition[];
  readonly adHocElements: readonly AdHocElementProjection[];
  readonly sourceRevisionIds: readonly string[];
}

export interface FullCorpusPrimaryDecisionTable {
  readonly schemaVersion: '1.0.0';
  readonly policyVersion: '1.0.0';
  readonly problemCount: number;
  readonly decisions: readonly FinalPrimaryDecision[];
}

export interface CuratedPrimaryOverride {
  readonly problemId: string;
  readonly primaryTagId: string;
  readonly primaryOutcomeId: string;
  readonly additionalPrimaryTagIds?: readonly string[];
  readonly rationale: string;
  readonly decisionAuthorId: string;
}

export interface PreviewFinalDecision {
  readonly previewEntityId: string;
  readonly previewEntityKind: TaxonomyEntityKind;
  readonly action: TaxonomyIntegrationAction;
  readonly finalEntityIds: readonly string[];
  readonly affectedProblemIds: readonly string[];
  readonly representativeProblemIds: readonly string[];
  readonly splitAssignments: readonly {
    readonly finalEntityId: string;
    readonly problemIds: readonly string[];
    readonly representativeProblemIds: readonly string[];
  }[];
  readonly aliasesOrRedirects: readonly string[];
  readonly evidenceOwnerProblemIds: readonly string[];
  readonly rationale: string;
  readonly reviewMode: 'third_party';
}

interface LearningUnitSeed {
  readonly id: string;
  readonly kind: MetadataLearningUnitCandidate['kind'];
  readonly title: string;
  readonly parentId: string | null;
  readonly prerequisiteIds: readonly string[];
  readonly stageRank: number;
  readonly difficultyRank: number;
  readonly representativeRank: number;
  readonly orderReason: string;
  readonly excludedTopics: readonly string[];
}

const UNIT_EXCLUDED_TOPICS: Readonly<Record<string, readonly string[]>> = {
  'unit-monotone-search': [
    '連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。',
  ],
  'unit-two-pointers-window': ['値域上の真偽境界を探す二分探索・パラメトリックサーチ。'],
  'unit-events-offline': [
    '入力順のまま処理でき、イベント整列や寄与順の交換を要しないオンライン更新。',
  ],
  'unit-normalization': ['交換論による貪欲順の証明。'],
  'unit-greedy-exchange': ['対称操作による状態の正規化。'],
  'unit-divide-enumeration': ['軽重分類や変化回数によって総仕事量を界す償却解析。'],
  'unit-decomposition-amortization': [
    '探索空間を分けて候補を列挙・照合するmeet-in-the-middleや分割統治。',
  ],
  'unit-dp-state-design': ['状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。'],
  'unit-dp-subset-resource': ['入力順や区間端点だけを状態にし、集合・容量軸を持たないDP。'],
  'unit-dp-sequence-interval': ['bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。'],
  'unit-dp-digit-string': [
    '桁・繰り上がり・上限との一致を状態に持たない、一般の文字列オートマトン。',
  ],
  'unit-dp-stochastic': ['二人零和ゲームの勝敗・Grundy数。'],
  'unit-dp-game': ['得点差・最適手数・partisan局面値を求めるminimax評価。'],
  'unit-dp-game-value': ['勝敗だけを分類する通常の後退解析・Grundy数。'],
  'unit-dp-transition-optimization': ['固定線形遷移の巨大回累乗。'],
  'unit-linear-recurrence': ['一般のDP遷移の区間集約・単調最適化。'],
  'unit-graph-search': ['非負重み付き距離の緩和・確定と最短路certificateの復元。'],
  'unit-shortest-path-certificates': ['辺重みや最短距離を扱わず、到達可否だけを求める探索。'],
  'unit-connectivity': ['距離・訪問順を求める探索、および有向グラフの強連結成分と順序。'],
  'unit-directed-condensation': ['無向辺追加だけを扱うDSU連結成分管理。'],
  'unit-functional-graph': ['各頂点から複数の後続を選べる一般のグラフ探索・強連結成分への縮約。'],
  'unit-tree-metric': ['根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。'],
  'unit-tree-aggregation': ['木上パスの連続区間分解と、重心による再帰分解。'],
  'unit-flow-matching': ['Eulerウォークの次数・偶奇条件。'],
  'unit-euler-degree': ['容量付きフロー・マッチング・最小カットへの帰着。'],
  'unit-tree-decomposition': ['重心による成分サイズの半減と再帰分解。'],
  'unit-tree-balanced-separators': ['LCA・HLDによる固定木上パスの区間分解。'],
  'unit-lowlink-critical-structure': [
    '次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。',
  ],
  'unit-graph-core-peeling': ['DFS時刻とlowlink値による橋・関節点の判定。'],
  'unit-prefix-aggregate': ['オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。'],
  'unit-monoid-segment-tree': ['Fenwick Treeで保つ重み付き接頭辞統計。'],
  'unit-weighted-prefix-fenwick': ['一般のモノイドによるSegment Treeの区間要約。'],
  'unit-range-actions': ['過去の版の保存・rollback・構造共有。'],
  'unit-persistence-rollback': ['区間更新作用の遅延評価。'],
  'unit-linked-list-index': ['全候補の大小順や区間集約を保つ平衡木・heap。'],
  'unit-ordered-set-heap': ['支配関係で一度捨てた候補を戻さない単調stack・queue。'],
  'unit-monotone-stack-queue': ['全候補から極値を反復取得するheap・ordered set。'],
  'unit-mo-offline-range': ['オンラインのpriority queue・multiset、および単調stack・queue。'],
  'unit-trie-prefix': ['failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。'],
  'unit-string-prefix-automata': ['接尾辞・LCPの索引、文字列hash、回文半径。'],
  'unit-suffix-lcp-index': ['rolling hashによる一致比較と回文半径。'],
  'unit-string-hash': ['全接尾辞の辞書順索引と回文半径。'],
  'unit-palindrome-radius': ['一般の部分文字列hash比較と、接尾辞・LCPの索引。'],
  'unit-recursive-compressed-string': ['明示された文字列への接尾辞索引の構築。'],
  'unit-modular-arithmetic': ['剰余列・冪の周期利用、および素因数ごとの指数分解・約数列挙。'],
  'unit-modular-periodicity': [
    '逆元・一次合同・CRTによる合同条件の統合、および巡回群の位数を使う計数。',
  ],
  'unit-gcd-diophantine': [
    '連分数・Stern–Brocotによる有理近似、および複数の合同類をCRTで統合する構成。',
  ],
  'unit-rational-approximation': [
    '整除性や一次不定方程式の可解判定だけを行う問題、および合同類をCRTで統合する構成。',
  ],
  'unit-prime-divisor': ['床関数や整数根の値が一定となる区間への分割。'],
  'unit-integer-boundary-blocks': ['素因数指数による整数条件の分解。'],
  'unit-cyclic-group-exponent-counting': ['乗法的位数から最小周期だけを求める問題。'],
  'unit-multiplicative-order-periods': ['約数格子上の指数計数・包除。'],
  'unit-combinatorial-coefficients': ['重なりを交互加減する包除・Möbius反転。'],
  'unit-inclusion-exclusion': ['選択順を二項係数だけで式化する数え上げ。'],
  'unit-polynomial-convolution': ['行列消去・階数・XOR基底。'],
  'unit-linear-algebra-xor': ['通常の多項式畳み込み・生成関数と、幾何の面積行列式。'],
  'unit-geometry-primitives': ['凸包の境界候補列挙・半平面交差。'],
  'unit-convex-geometry': ['凸性を使わない一般のイベント走査・座標圧縮。'],
  'unit-discrete-convex': ['真偽値の単調境界探索と、交換論だけで決まる貪欲順。'],
  'unit-constructive-witness': ['存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。'],
};

const excludedTopicsFor = (
  id: string,
  kind: MetadataLearningUnitCandidate['kind'],
): readonly string[] => (kind === 'chapter' ? [] : (UNIT_EXCLUDED_TOPICS[id] ?? []));

const chapter = (id: string, title: string, representativeRank: number): LearningUnitSeed => ({
  id,
  kind: 'chapter',
  title,
  parentId: null,
  prerequisiteIds: [],
  stageRank: 0,
  difficultyRank: 0,
  representativeRank,
  orderReason: '',
  excludedTopics: excludedTopicsFor(id, 'chapter'),
});

const section = (
  id: string,
  title: string,
  parentId: string,
  prerequisiteIds: readonly string[],
  stageRank: number,
  difficultyRank: number,
  representativeRank: number,
): LearningUnitSeed => ({
  id,
  kind: 'section',
  title,
  parentId,
  prerequisiteIds,
  stageRank,
  difficultyRank,
  representativeRank,
  orderReason: '',
  excludedTopics: excludedTopicsFor(id, 'section'),
});

const LEARNING_UNIT_SEEDS: readonly LearningUnitSeed[] = [
  chapter('unit-chapter-modeling', 'モデル変換とアルゴリズム設計', 0),
  chapter('unit-chapter-dynamic-programming', '動的計画法', 1),
  chapter('unit-chapter-graph', 'グラフ・木構造', 2),
  chapter('unit-chapter-query', 'データ構造と問い合わせ', 3),
  chapter('unit-chapter-string', '文字列アルゴリズム', 4),
  chapter('unit-chapter-math-geometry', '数学・数え上げ・幾何', 5),
  section(
    'unit-monotone-search',
    '単調境界を証明して探索する',
    'unit-chapter-modeling',
    [],
    1,
    0,
    0,
  ),
  section(
    'unit-two-pointers-window',
    '尺取り法・sliding windowで連続区間を走査する',
    'unit-chapter-modeling',
    [],
    1,
    0,
    1,
  ),
  section(
    'unit-events-offline',
    'イベント・寄与・時間の向きを組み替える',
    'unit-chapter-modeling',
    [],
    1,
    1,
    1,
  ),
  section('unit-normalization', '同値な状態を正規化する', 'unit-chapter-modeling', [], 1, 1, 2),
  section('unit-greedy-exchange', '交換論から選択順を導く', 'unit-chapter-modeling', [], 1, 1, 3),
  section(
    'unit-divide-enumeration',
    '探索空間を分けて列挙・分割統治する',
    'unit-chapter-modeling',
    [],
    2,
    2,
    4,
  ),
  section(
    'unit-decomposition-amortization',
    '軽重分類と償却解析で総仕事量を抑える',
    'unit-chapter-modeling',
    [],
    2,
    2,
    5,
  ),
  section(
    'unit-dp-state-design',
    '最小十分状態からDPを設計する',
    'unit-chapter-dynamic-programming',
    [],
    1,
    0,
    0,
  ),
  section(
    'unit-dp-subset-resource',
    '集合・資源軸のDP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    2,
    1,
    1,
  ),
  section(
    'unit-dp-sequence-interval',
    '列・区間・分割のDP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    2,
    1,
    2,
  ),
  section(
    'unit-dp-digit-string',
    '桁・繰り上がり・接頭辞制約を状態にするDP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    3,
    2,
    3,
  ),
  section(
    'unit-dp-stochastic',
    '確率過程・期待値DP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    2,
    2,
    4,
  ),
  section(
    'unit-dp-game',
    'ゲーム状態の勝敗とGrundy数',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    2,
    2,
    5,
  ),
  section(
    'unit-dp-game-value',
    'minimax・得点差・局面値を評価するゲームDP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    2,
    2,
    6,
  ),
  section(
    'unit-dp-transition-optimization',
    'DP遷移を因数分解・集約して加速する',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    3,
    3,
    7,
  ),
  section(
    'unit-linear-recurrence',
    '固定線形遷移を巨大回数進める',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
    3,
    3,
    8,
  ),
  section('unit-graph-search', '状態グラフ探索と到達関係', 'unit-chapter-graph', [], 1, 0, 0),
  section(
    'unit-shortest-path-certificates',
    '重み付き最短路・経路復元・変更影響',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    2,
    1,
  ),
  section(
    'unit-connectivity',
    '連結成分を管理する',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    1,
    2,
  ),
  section(
    'unit-directed-condensation',
    '有向グラフの閉路を整理しDAG順に処理する',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    2,
    3,
  ),
  section(
    'unit-functional-graph',
    '一意な後続・サイクル・ダブリング',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    1,
    4,
  ),
  section(
    'unit-tree-metric',
    '木の直径・中心・最遠点を端点で捉える',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    1,
    5,
  ),
  section(
    'unit-tree-aggregation',
    '木DP・集約・rerooting',
    'unit-chapter-graph',
    ['unit-graph-search', 'unit-dp-state-design'],
    2,
    2,
    6,
  ),
  section(
    'unit-tree-decomposition',
    '木上のパスを祖先関係と連続区間に分解する',
    'unit-chapter-graph',
    [],
    3,
    3,
    7,
  ),
  section(
    'unit-tree-balanced-separators',
    '重心を分離点として木を再帰分解する',
    'unit-chapter-graph',
    [],
    3,
    3,
    8,
  ),
  section(
    'unit-flow-matching',
    'フロー・マッチング・カットへ帰着する',
    'unit-chapter-graph',
    ['unit-graph-search'],
    3,
    3,
    9,
  ),
  section(
    'unit-euler-degree',
    '次数の偶奇からウォークの成立性を特徴付ける',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    2,
    10,
  ),
  section(
    'unit-lowlink-critical-structure',
    'lowlinkで橋・関節点を特定する',
    'unit-chapter-graph',
    ['unit-graph-search'],
    3,
    4,
    11,
  ),
  section(
    'unit-graph-core-peeling',
    '次数構造からgraph coreまたは小さなkernelへ縮約する',
    'unit-chapter-graph',
    ['unit-graph-search'],
    2,
    2,
    12,
  ),
  section(
    'unit-prefix-aggregate',
    '累積和・差分によって静的な区間情報を線形化する',
    'unit-chapter-query',
    [],
    1,
    0,
    0,
  ),
  section(
    'unit-monoid-segment-tree',
    'モノイドとして区間要約を設計する',
    'unit-chapter-query',
    [],
    2,
    2,
    1,
  ),
  section(
    'unit-weighted-prefix-fenwick',
    '重み付き接頭辞統計をFenwick Treeで保つ',
    'unit-chapter-query',
    ['unit-prefix-aggregate'],
    2,
    2,
    2,
  ),
  section(
    'unit-range-actions',
    '区間更新を要約へ作用させる',
    'unit-chapter-query',
    ['unit-monoid-segment-tree'],
    3,
    3,
    3,
  ),
  section(
    'unit-persistence-rollback',
    '構造を共有して過去の版を保存・復元する',
    'unit-chapter-query',
    [],
    2,
    2,
    4,
  ),
  section(
    'unit-linked-list-index',
    '要素索引と連結リストで局所linkを更新する',
    'unit-chapter-query',
    [],
    1,
    1,
    5,
  ),
  section(
    'unit-ordered-set-heap',
    'heap・ordered setで全候補の極値を保つ',
    'unit-chapter-query',
    [],
    2,
    2,
    6,
  ),
  section(
    'unit-monotone-stack-queue',
    '支配関係から不要な候補を単調stack・queueで削る',
    'unit-chapter-query',
    [],
    2,
    2,
    7,
  ),
  section(
    'unit-mo-offline-range',
    'Moの順序で区間問い合わせの差分を更新する',
    'unit-chapter-query',
    [],
    3,
    3,
    8,
  ),
  section('unit-trie-prefix', 'Trieで共有接頭辞を索引化する', 'unit-chapter-string', [], 1, 1, 0),
  section(
    'unit-string-prefix-automata',
    '接頭辞の一致状態とオートマトン',
    'unit-chapter-string',
    [],
    1,
    1,
    1,
  ),
  section(
    'unit-suffix-lcp-index',
    '接尾辞の順序とLCPを索引化する',
    'unit-chapter-string',
    [],
    2,
    2,
    2,
  ),
  section(
    'unit-string-hash',
    'Fingerprintで列・集合・式の同値性を比較する',
    'unit-chapter-query',
    [],
    2,
    2,
    9,
  ),
  section(
    'unit-palindrome-radius',
    '回文半径と左右対称区間を特定する',
    'unit-chapter-string',
    [],
    2,
    2,
    3,
  ),
  section(
    'unit-recursive-compressed-string',
    '圧縮・反復・再帰文字列へ問い合わせる',
    'unit-chapter-string',
    [],
    4,
    2,
    2,
  ),
  section(
    'unit-modular-arithmetic',
    '逆元・一次合同・CRTで合同条件を統合する',
    'unit-chapter-math-geometry',
    ['unit-gcd-diophantine'],
    2,
    2,
    0,
  ),
  section(
    'unit-modular-periodicity',
    '剰余周期と指数法則を利用する',
    'unit-chapter-math-geometry',
    [],
    2,
    1,
    0,
  ),
  section(
    'unit-gcd-diophantine',
    'gcdと整数解の成立条件',
    'unit-chapter-math-geometry',
    [],
    1,
    1,
    1,
  ),
  section(
    'unit-rational-approximation',
    '連分数・Stern–Brocotで有理近似する',
    'unit-chapter-math-geometry',
    ['unit-gcd-diophantine'],
    2,
    2,
    2,
  ),
  section('unit-prime-divisor', '素因数分解と約数構造', 'unit-chapter-math-geometry', [], 2, 2, 2),
  section(
    'unit-integer-boundary-blocks',
    '整数境界と同値区間を正確に分ける',
    'unit-chapter-math-geometry',
    [],
    2,
    2,
    3,
  ),
  section(
    'unit-cyclic-group-exponent-counting',
    '巡回群を指数化して数える',
    'unit-chapter-math-geometry',
    ['unit-modular-periodicity', 'unit-prime-divisor', 'unit-inclusion-exclusion'],
    3,
    3,
    4,
  ),
  section(
    'unit-multiplicative-order-periods',
    '乗法的位数から最小周期を求める',
    'unit-chapter-math-geometry',
    ['unit-gcd-diophantine', 'unit-modular-periodicity', 'unit-prime-divisor'],
    5,
    3,
    3,
  ),
  section(
    'unit-combinatorial-coefficients',
    '組合せ係数と対称性で数える',
    'unit-chapter-math-geometry',
    [],
    1,
    2,
    6,
  ),
  section(
    'unit-inclusion-exclusion',
    '包除・Möbius反転で重複を補正する',
    'unit-chapter-math-geometry',
    [],
    2,
    2,
    7,
  ),
  section(
    'unit-polynomial-convolution',
    '生成関数・多項式・畳み込みで数える',
    'unit-chapter-math-geometry',
    ['unit-combinatorial-coefficients'],
    3,
    4,
    8,
  ),
  section(
    'unit-linear-algebra-xor',
    '線形方程式・分離可能変換・行列式計数へ変換する',
    'unit-chapter-math-geometry',
    [],
    3,
    4,
    9,
  ),
  section(
    'unit-geometry-primitives',
    '幾何の基本判定と座標変換',
    'unit-chapter-math-geometry',
    [],
    1,
    1,
    10,
  ),
  section(
    'unit-convex-geometry',
    '凸幾何と直線包絡から境界候補を選ぶ',
    'unit-chapter-math-geometry',
    ['unit-geometry-primitives'],
    2,
    3,
    11,
  ),
  section(
    'unit-discrete-convex',
    '凸性・傾き・限界費用・slope trick',
    'unit-chapter-math-geometry',
    [],
    3,
    4,
    12,
  ),
  section(
    'unit-constructive-witness',
    '成立証明から構成解を復元する',
    'unit-chapter-modeling',
    [],
    3,
    3,
    4,
  ),
];

const UNIT_ORDER_REASONS: Readonly<Record<string, string>> = {
  'unit-chapter-modeling':
    '問題文の操作を再利用可能な対象・不変量へ言い換え、探索・貪欲・分割手法を選ぶ共通の視点を最初に作る。',
  'unit-chapter-dynamic-programming':
    '状態と遷移の設計を共通言語にし、集合・列・確率・ゲーム・遷移高速化へ進む土台を作る。',
  'unit-chapter-graph':
    '対象を頂点と辺へ写して到達可能性を扱えるようにし、連結性・最短路・木・フローへ進む土台を作る。',
  'unit-chapter-query':
    '問い合わせに必要な要約と更新規則を見抜く視点を先に学び、目的に合うデータ構造の選択へつなげる。',
  'unit-chapter-string':
    '接頭辞・接尾辞・一致長などの文字列状態を共通言語にし、各種の照合・索引法へ進む土台を作る。',
  'unit-chapter-math-geometry':
    '条件を合同式・数え上げ・線形代数・幾何の構造へ翻訳する視点を先に持ち、分野別の道具へ進む。',
  'unit-monotone-search':
    '判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。',
  'unit-two-pointers-window':
    '窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。',
  'unit-events-offline':
    '入力順に固執せず、時刻・座標・寄与の順を並べ替えることで、更新や集計を一方向の走査へ変換する。',
  'unit-normalization':
    '対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。',
  'unit-greedy-exchange': '局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。',
  'unit-divide-enumeration':
    '全探索を半分または再帰部分へ分け、列挙結果を重複なく合成して扱える入力規模を広げる。',
  'unit-decomposition-amortization':
    '各操作ではなく操作列全体の変化回数を数え、軽重分類や一度限りの移動で総計算量を抑える。',
  'unit-constructive-witness':
    '存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。',
  'unit-dp-state-design':
    '初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。',
  'unit-dp-subset-resource':
    '最小十分状態を設計できるようになった後、集合bitmaskや容量を軸にした遷移と更新順へ進む。',
  'unit-dp-sequence-interval':
    '状態設計を土台に、列順を保つ選択と区間の分割点という二つの合成方法を学ぶ。',
  'unit-dp-digit-string':
    '状態設計を土台に、上限との一致・桁・繰り上がりを有限状態として持つ数え上げへ進む。',
  'unit-dp-stochastic':
    '状態と遷移を定義できることを前提に、確率遷移から期待値・到達確率の方程式を立てる。',
  'unit-dp-game':
    '状態遷移を設計できることを前提に、後続状態の勝敗やGrundy数から現在局面を分類する。',
  'unit-dp-game-value':
    '状態遷移を設計できることを前提に、双方の最適行動を最大化・最小化として評価する。',
  'unit-dp-transition-optimization':
    '正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。',
  'unit-linear-recurrence':
    '一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。',
  'unit-graph-search':
    '既知のDFS・BFS実装を土台に、問題の状態を頂点、合法操作を辺として設計し、必要なら中継点を順に許可して到達関係全体を求める。',
  'unit-shortest-path-certificates':
    '状態グラフを構成できた後、辺重みと緩和条件を加えて最短距離を求め、距離等式から経路や変更影響を復元する。',
  'unit-connectivity':
    '連結成分を探索できるようになった後、差分辺のpotential累積と、辺追加に対する成分・付加情報のDSU管理を学ぶ。',
  'unit-directed-condensation':
    '到達可能性を理解した後、相互到達する頂点を強連結成分へまとめ、DAG順の伝播へ変換する。',
  'unit-functional-graph':
    '状態グラフを理解した後、後続が一意という制約からcycleと流入木への分解やダブリングを導く。',
  'unit-tree-metric':
    '木を探索して距離を求められることを前提に、直径の二端点が最遠候補を代表する性質と、中心による分岐の整理を学ぶ。',
  'unit-tree-aggregation':
    '探索で親子関係を作りDP状態を定義できた後、子側の集約と親側への差し替えで木全体の値を求める。',
  'unit-tree-decomposition':
    '基本的な木DFSと祖先関係を使い、木上パスをLCA・HLD・virtual treeの少数区間へ分解する。',
  'unit-tree-balanced-separators':
    '部分木サイズから重心を選び、除去後の各成分が半分以下になることを使って再帰の深さを抑える。',
  'unit-flow-matching':
    '頂点と辺のモデルを作れることを前提に、選択制約を容量・カット・マッチングへ翻訳する。',
  'unit-euler-degree':
    'グラフを探索できることを前提に、全辺を使うwalkを次数の偶奇と連結性で特徴付ける。',
  'unit-lowlink-critical-structure':
    'DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。',
  'unit-graph-core-peeling':
    '連結性を探索できることを前提に、低次数頂点を反復削除してcycle coreや小さなkernelを露出させる。',
  'unit-prefix-aggregate':
    '配列の線形走査と加減算を土台に、静的区間量を接頭辞の差へ変換する最初の要約法として学ぶ。',
  'unit-monoid-segment-tree':
    '結合則を持つ要約を定義し、区間を分割・合成して動的な問い合わせへ答える。',
  'unit-weighted-prefix-fenwick':
    '静的な接頭辞差分を理解した後、点更新を伴う重み付き接頭辞統計をFenwick Treeで保つ。',
  'unit-range-actions':
    '結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。',
  'unit-persistence-rollback':
    '更新で変わる箇所を局所化し、未変更部分の共有または履歴の巻き戻しで過去の版を扱う。',
  'unit-linked-list-index':
    '配列やmapの索引を使い、順序全体を走査せず前後linkだけを更新して列を保つ。',
  'unit-ordered-set-heap':
    '比較可能な候補全体から極値・順位・隣接を繰り返し取り出すため、動的な順序を保つ。',
  'unit-monotone-stack-queue':
    '候補の支配関係を証明し、不要になった要素を一度だけ捨てて線形処理へ変える。',
  'unit-mo-offline-range':
    '区間への要素の追加・削除を定義し、問い合わせ順を並べ替えて端点移動の総量を抑える。',
  'unit-trie-prefix':
    '文字ごとの遷移を配列やmapで持ち、複数文字列の共有接頭辞を木として索引化する。',
  'unit-string-prefix-automata':
    '接頭辞と接尾辞の一致長を状態化し、失敗時の遷移を再利用して照合を線形化する。',
  'unit-suffix-lcp-index':
    '全接尾辞の辞書順と隣接LCPを索引化し、部分文字列の出現範囲・順位・個数へ答える。',
  'unit-string-hash':
    '列・集合・式を合成可能なfingerprintへ写し、衝突条件を意識して同値性を比較する。',
  'unit-palindrome-radius': '各中心の左右一致を半径としてまとめ、回文区間の判定と列挙へ利用する。',
  'unit-recursive-compressed-string':
    '明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。',
  'unit-gcd-diophantine':
    '最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。',
  'unit-rational-approximation':
    'Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。',
  'unit-modular-arithmetic':
    'gcdとBézoutで一次合同の可解性を扱えた後、逆元を構成し、複数の合同条件をCRTで統合する。',
  'unit-modular-periodicity':
    '剰余列や冪が有限状態で周期化することを示し、周期前計算や指数法則で巨大な反復を短縮する。',
  'unit-prime-divisor':
    '初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。',
  'unit-integer-boundary-blocks':
    'floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。',
  'unit-cyclic-group-exponent-counting':
    '合同算術・素因数と約数・包除を組み合わせ、巡回群の元を指数と約数格子で数える。',
  'unit-multiplicative-order-periods':
    '合同算術と約数分解を使えることを前提に、最小周期を乗法的位数へ帰着して約数から絞る。',
  'unit-combinatorial-coefficients':
    '選び方の重複を二項係数で整理し、対称操作で同一視する対象は固定点平均でorbitを数える。',
  'unit-inclusion-exclusion':
    '単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。',
  'unit-polynomial-convolution':
    '組合せ係数で局所選択を式化した後、その合成を生成関数の積と畳み込みへ持ち上げる。',
  'unit-linear-algebra-xor':
    '制約や多次元変換を線形方程式・基底・軸別変換・行列式へ写し、消去と分離によって解く。',
  'unit-geometry-primitives':
    '座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。',
  'unit-convex-geometry':
    '向きと交差を判定できた後、凸境界へ候補を絞り、直線包絡から最適候補を選ぶ。',
  'unit-discrete-convex':
    '目的関数の凸・凹性と傾き変化を捉え、breakpointや限界費用から最適点を求める。',
};

interface TagSeed {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly parentId: string | null;
  readonly outcomeIds: readonly string[];
  readonly unitIds: readonly string[];
  readonly recall: readonly string[];
  readonly object: readonly string[];
  readonly trigger: readonly string[];
  readonly invariant: readonly string[];
  readonly goal: readonly string[];
  readonly exclude?: readonly string[];
  readonly minimumDimensions?: 1 | 2 | 3 | 4;
  readonly requireObjectForStrictRecall?: boolean;
  readonly prerequisiteTagIds?: readonly string[];
  readonly primaryEligible?: boolean;
  readonly priority?: number;
}

const defineTag = (seed: TagSeed): FinalTaxonomyTagPolicy => ({
  id: seed.id,
  name: seed.name,
  definition: seed.definition,
  aliases: FINAL_TAG_LEARNER_ALIASES[seed.id] ?? [],
  formerNames: FINAL_TAG_FORMER_NAMES[seed.id] ?? [],
  representativeProblemIds: FINAL_TAG_REPRESENTATIVE_PROBLEM_IDS[seed.id] ?? [],
  parentId: seed.parentId,
  prerequisiteTagIds: seed.prerequisiteTagIds ?? [],
  learningOutcomeIds: seed.outcomeIds,
  learningUnitCandidateIds: seed.unitIds,
  strictRecallTerms: seed.recall,
  semanticSignature: {
    objectPatterns: seed.object,
    triggerPatterns: seed.trigger,
    invariantPatterns: seed.invariant,
    goalPatterns: seed.goal,
    excludedPatterns: seed.exclude ?? [],
    minimumDimensions: seed.minimumDimensions ?? 2,
    requireObjectForStrictRecall: seed.requireObjectForStrictRecall ?? false,
  },
  primaryEligible: seed.primaryEligible ?? true,
  primaryPriority: seed.priority ?? 50,
});

const TAG_SEEDS: readonly TagSeed[] = [
  {
    id: 'tag-model-reduction',
    name: 'モデル変換',
    definition: '問題固有の操作を再利用可能な構造・順序・境界の問題へ変換する。',
    parentId: null,
    outcomeIds: ['outcome-identify-reusable-abstraction'],
    unitIds: ['unit-chapter-modeling'],
    recall: ['model reduction', 'モデル変換'],
    object: ['操作', '状態', '制約'],
    trigger: ['言い換え', '変換', '帰着'],
    invariant: ['同値', '保たれ'],
    goal: ['モデル', '抽象化'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-dp-state-transition',
    name: 'DP状態と遷移',
    definition: '未来に必要な情報を状態とし、遷移と基底を設計する。',
    parentId: null,
    outcomeIds: ['outcome-design-state-transition'],
    unitIds: ['unit-chapter-dynamic-programming'],
    recall: ['dynamic programming', '動的計画', '\\bdp\\b'],
    object: ['状態', 'state'],
    trigger: ['遷移', 'transition'],
    invariant: ['未来', '最適部分構造'],
    goal: ['動的計画', '\\bdp\\b'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-graph-model-structure',
    name: 'グラフモデルと構造',
    definition: '対象を頂点・辺・木・有向遷移として構造化する。',
    parentId: null,
    outcomeIds: ['outcome-model-and-exploit-graph'],
    unitIds: ['unit-chapter-graph'],
    recall: ['graph model', 'グラフモデル'],
    object: ['頂点', '辺', 'グラフ', '木'],
    trigger: ['接続', '到達', '経路'],
    invariant: ['連結', '距離', '部分木'],
    goal: ['グラフ', '経路', '連結'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-query-sufficient-aggregate',
    name: '更新可能な最小十分要約',
    definition: '問い合わせの答えを合成でき、更新で保てる十分な統計量を導く。',
    parentId: null,
    outcomeIds: ['outcome-derive-updateable-aggregate'],
    unitIds: ['unit-chapter-query'],
    recall: ['十分統計', '区間要約', 'range aggregate', 'aggregate under update'],
    object: ['区間', 'query', '問い合わせ', '統計量'],
    trigger: ['更新', '合成', 'クエリ'],
    invariant: ['要約', '十分', '統計'],
    goal: ['区間', '問い合わせ', 'query'],
    primaryEligible: false,
    priority: 22,
  },
  {
    id: 'tag-string-state-representation',
    name: '文字列状態表現',
    definition: '一致・接辞・反復を十分な文字列状態へ圧縮する。',
    parentId: null,
    outcomeIds: ['outcome-model-string-state'],
    unitIds: ['unit-chapter-string'],
    recall: ['string algorithm', '文字列アルゴリズム'],
    object: ['文字列', 'string', '部分文字列'],
    trigger: ['一致', '辞', '回文', '反復'],
    invariant: ['prefix', 'suffix', '最長共通'],
    goal: ['検索', '比較', '一致'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-math-geometry-transformation',
    name: '数学・幾何への変換',
    definition: '条件を整数・代数・数え上げ・幾何の判定式へ変換する。',
    parentId: null,
    outcomeIds: ['outcome-transform-to-math-structure'],
    unitIds: ['unit-chapter-math-geometry'],
    recall: ['mathematical reduction', '数学的帰着'],
    object: ['整数', '座標', '場合の数'],
    trigger: ['式', '合同', '幾何'],
    invariant: ['数学的', '不変量'],
    goal: ['計数', '判定', '最適化'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-monotone-threshold-search',
    name: '単調境界探索',
    definition: '可否または値の単調性を証明し、最初・最後の成立点を探す。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-prove-and-search-threshold'],
    unitIds: ['unit-monotone-search'],
    recall: [
      '答え.?(の)?二分探索',
      '二分探索',
      'binary search',
      'parametric search',
      'パラメトリックサーチ',
    ],
    object: ['境界', '上限', '下限', '答え'],
    trigger: ['単調', '可否判定', '二分探索'],
    invariant: ['以上なら', '以下なら', '成立する最'],
    goal: ['最小化', '最大化', '境界'],
    priority: 80,
  },
  {
    id: 'tag-two-pointers-window',
    name: '尺取り法・sliding window',
    definition:
      '一列の連続窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進める。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-maintain-monotone-window'],
    unitIds: ['unit-two-pointers-window'],
    recall: [
      '尺取り',
      '双指針',
      '二ポインタ',
      '二点法',
      'two.?pointer',
      'sliding window',
      '区間の突き合わせ',
    ],
    object: ['区間', '連続', '両端', '列'],
    trigger: ['右端', '左端', '尺取り', '単調に進'],
    invariant: ['窓', '突き合わせ', '一度ずつ'],
    goal: ['区間数', '区間の長さ', '区間ごと'],
    priority: 78,
  },
  {
    id: 'tag-sweep-coordinate-compression',
    name: 'イベント走査・座標圧縮',
    definition: 'イベント座標を離散化・整列し、走査中に有効な情報を更新する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-linearize-events'],
    unitIds: ['unit-events-offline'],
    recall: [
      '座標圧縮',
      '走査線',
      'sweep line',
      'event sweep',
      'イベント走査',
      'イベント列挙',
      'interval event',
      'offline.*sweep',
      'オフライン.*走査',
      '平面走査',
    ],
    object: ['座標', 'event', '区間', '時刻'],
    trigger: ['sort', 'ソート', '圧縮', 'sweep', '差分'],
    invariant: ['active', '隣接座標', '座標間'],
    goal: ['全体', '面積', '同時', '区間'],
    priority: 72,
  },
  {
    id: 'tag-reverse-offline',
    name: '逆向きのオフライン処理',
    definition:
      '時間依存を逆走査・逆操作・last-write時刻で単調または静的な処理へ変換し、元の時点の答えを復元する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-reverse-update-time'],
    unitIds: ['unit-events-offline'],
    recall: [
      '逆順処理',
      '逆走査',
      'last.?write',
      '時間を逆',
      'クエリの逆読み',
      '逆過程',
      '逆再生',
      '操作の逆転',
    ],
    object: ['削除', '更新', '時間', 'query', 'paint', 'row', 'column', '上書き'],
    trigger: ['逆順', '逆から', '逆走査', 'offline', 'last.?write'],
    invariant: ['追加だけ', '復元', '将来', '未処理', '未確定', '最後のpaint'],
    goal: ['各時点', '時系列', 'クエリ'],
    priority: 74,
  },
  {
    id: 'tag-contribution-reordering',
    name: '寄与の数え上げと順序交換',
    definition:
      '答えを要素・組・連結成分ごとの独立な局所寄与へ分解し、和または積の集計順序を交換する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-reorder-counting-contributions'],
    unitIds: ['unit-events-offline'],
    recall: [
      '寄与度',
      '寄与を数え',
      '数え上げ順序',
      'contribution',
      '主客転倒',
      '指示変数',
      '期待値の線形性',
      '寄与分解',
    ],
    object: ['合計', '組', '対', '要素'],
    trigger: ['寄与', '数え上げ順序', '二重和'],
    invariant: ['独立', '何回数え', '係数'],
    goal: ['総和', '場合の数', '期待値'],
    priority: 67,
  },
  {
    id: 'tag-symmetry-invariant-normalization',
    name: '対称性・不変量・正規化',
    definition:
      '対称操作で同値な配置を標準形へ移すか、群作用の固定点を数えて同値類の個数を求める。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-normalize-equivalent-states', 'outcome-count-orbits-by-fixed-points'],
    unitIds: ['unit-normalization', 'unit-combinatorial-coefficients'],
    recall: [
      '正規化',
      '対称性',
      'canonical',
      'mirror strategy',
      'reflection.*合成',
      '平行移動対称性',
      'burnside',
      'polya',
    ],
    object: ['配置', '状態', 'ラベル', '差分', 'parity', '偶奇', 'checkerboard'],
    trigger: ['同値', '対称', '平移', '入れ替え', 'parity.*分', '偶数.*奇数', '群作用'],
    invariant: ['不変', '標準形', '差だけ', '等差数列', 'arithmetic progression', '固定点'],
    goal: ['状態数', '判定', '圧縮', '定数時間', '合計', 'orbit数'],
    priority: 64,
  },
  {
    id: 'tag-greedy-exchange-order',
    name: '貪欲法と交換論',
    definition:
      '局所選択の交換または候補の支配関係から、調べる順序・残す候補・定数個のcaseを確定する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-prove-greedy-order'],
    unitIds: ['unit-greedy-exchange'],
    recall: ['貪欲', 'greedy', '交換論', '交換法', 'exchange argument', 'uncrossing'],
    object: ['選択', '順序', 'ソート', '割り当て'],
    trigger: ['小さい順', '大きい順', '局所', '交換'],
    invariant: ['悪化しない', '最適解', '先に選'],
    goal: ['最小', '最大', '構成'],
    priority: 70,
  },
  {
    id: 'tag-divide-enumerate',
    name: '構造化列挙・分割統治',
    definition:
      '少数の生成パラメータへ落として候補を直接列挙するか、探索空間を独立な集合へ分けて照合・再帰分割する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-split-enumeration-space', 'outcome-divide-search-space-recursively'],
    unitIds: ['unit-divide-enumeration'],
    recall: [
      'meet.?in.?the.?middle',
      '半分.*全列挙',
      '分割列挙',
      'divide.?and.?conquer',
      '分割統治',
      'pivot',
      'baby.?step.?giant.?step',
      '\\bbsgs\\b',
      '構造化.*生成全探索',
      '生成全探索',
    ],
    object: ['部分集合', '候補', '探索空間', '選択', 'path', '経路', 'xor'],
    trigger: ['半分', '列挙', '組合せを分', 'anti-diagonal', '中央.*分'],
    invariant: ['合成', '独立', '照合'],
    goal: ['存在判定', '個数', '最適値'],
    priority: 68,
  },
  {
    id: 'tag-amortized-heavy-light',
    name: '軽重分解と償却解析',
    definition:
      '大小・軽重・倍化・一方向の移動や削除回数で分解し、操作列全体の仕事量を有界化する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-bound-total-work'],
    unitIds: ['unit-decomposition-amortization'],
    recall: [
      '償却',
      'amortized',
      '軽重分解',
      'sqrt decomposition',
      '平方分割',
      'バケット分解',
      'small.?to.?large',
      'harmonic.*amortization',
    ],
    object: ['操作回数', '次数', '大小', '更新'],
    trigger: ['軽い', '重い', '平方分割', '倍化'],
    invariant: ['合計で', '高々', '一回しか'],
    goal: ['計算量', '全query', '高速化'],
    priority: 63,
  },
  {
    id: 'tag-dp-state-equivalence',
    name: 'DPの最小十分状態',
    definition: '将来の選択肢と答えが同じprefixを同一状態に縮約する。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-minimal-sufficient-state'],
    unitIds: ['unit-dp-state-design'],
    recall: [
      '状態圧縮',
      '圧縮.?dp',
      '状態設計',
      '最小十分状態',
      '履歴.*圧縮',
      '同値.*state',
      'state.?space.*縮小',
      'myhill.?nerode',
    ],
    object: ['状態', 'prefix', '未来', '過去'],
    trigger: ['動的計画', '\\bdp\\b', '遷移'],
    invariant: ['十分', '最後', '同一視', '圧縮'],
    goal: ['場合の数', '最適', '可否', '状態数'],
    priority: 28,
  },
  {
    id: 'tag-subset-bitmask-transform',
    name: '部分集合・bitmask変換',
    definition: '集合の所属をbitmaskで表し、部分集合間の遷移や変換を行う。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-enumerate-subset-state-space'],
    unitIds: ['unit-dp-subset-resource'],
    recall: [
      'bit.?dp',
      'bitmask',
      '部分集合.?dp',
      'subset.?dp',
      'submask',
      '集合状態.?dp',
      'subset transform',
      'subset convolution',
      'zeta transform',
      'ゼータ変換',
    ],
    object: ['部分集合', '集合', 'bitmask', 'mask'],
    trigger: ['2\\^', '集合を表', '部分集合列挙'],
    invariant: ['mask', '包含関係', '選択済み'],
    goal: ['列挙', '場合の数', '最小'],
    priority: 84,
  },
  {
    id: 'tag-knapsack-resource',
    name: '資源軸knapsack DP',
    definition: '容量・時間・個数などの有界資源を軸に選択の価値を更新する。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-resource-dp'],
    unitIds: ['unit-dp-subset-resource'],
    recall: ['knapsack', 'ナップサック', '容量.?dp', '資源.?dp', 'resource.?dp', '部分和.?dp'],
    object: ['容量', '重さ', '価値', '上限', '資源'],
    trigger: ['選ぶ', '使う', '配る', '選択'],
    invariant: ['合計', '以下', '使用済み'],
    goal: ['最大価値', '最小コスト', '可否'],
    priority: 77,
  },
  {
    id: 'tag-sequence-subsequence-dp',
    name: '列・subsequence DP',
    definition: '列のprefixや最後に選んだ要素を状態にし、順序を保つ選択を組み立てる。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-order-preserving-dp'],
    unitIds: ['unit-dp-sequence-interval'],
    recall: ['subsequence', '部分列', '\\blis\\b', '列.?dp', 'マッチング.?dp'],
    object: ['列', 'prefix', '部分列', '順序'],
    trigger: ['左から', '選ぶ', '最後の要素', '一致'],
    invariant: ['順序を保', '最長', '末尾'],
    goal: ['長さ', '個数', '最適'],
    priority: 66,
  },
  {
    id: 'tag-interval-partition-dp',
    name: '区間・分割DP',
    definition: '区間またはprefixの分割点を遷移にし、局所解の合成を行う。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-interval-split-dp'],
    unitIds: ['unit-dp-sequence-interval'],
    recall: ['区間.?dp', '分割.?dp', 'interval.?dp', 'マージ.?dp'],
    object: ['区間', '分割', '括弧', 'prefix'],
    trigger: ['切れ目', '左端', '右端', '区切る'],
    invariant: ['部分区間', '合成', '独立'],
    goal: ['最小', '場合の数', 'コスト'],
    priority: 76,
  },
  {
    id: 'tag-digit-automaton-dp',
    name: '桁・繰り上がり・automaton DP',
    definition:
      '数値や文字列を接頭辞から構成し、上限との一致・繰り上がり・残数・automaton状態を保つ。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-count-prefix-constrained-objects'],
    unitIds: ['unit-dp-digit-string'],
    recall: ['桁.?dp', 'digit.?dp', 'automaton.?dp', 'オートマトン.?dp'],
    object: ['桁', '上限', '数字列', '十進表記', '混合基数'],
    trigger: ['prefix', '未満フラグ', '残数', '桁ごと', '繰り上がり', '繰り下がり'],
    invariant: ['上限と一致', '先頭ゼロ', 'automaton', 'carry'],
    goal: ['以下の個数', '条件を満たす数', '辞書順', '最小コスト'],
    exclude: ['syntax', '文法', '構文木', 'parser'],
    requireObjectForStrictRecall: true,
    priority: 82,
  },
  {
    id: 'tag-stochastic-expectation-dp',
    name: '確率・期待値DP',
    definition: '確率遷移に対する期待値・分布・到達確率の再帰式を解く。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-solve-stochastic-recurrence'],
    unitIds: ['unit-dp-stochastic'],
    recall: [
      '期待値.?dp',
      '確率.?dp',
      '期待値',
      '確率漸化式',
      'stochastic',
      'markov',
      'random walk.*dp',
      'optimal stopping',
    ],
    object: ['確率', '期待値', '分布', 'ランダム'],
    trigger: ['等確率', '遷移確率', '期待値の線形性'],
    invariant: ['期待回数', '吸収', '確率分布'],
    goal: ['期待値', '確率', '分布'],
    priority: 86,
  },
  {
    id: 'tag-game-grundy-dp',
    name: 'game状態・Grundy DP',
    definition: '各状態の勝敗またはGrundy数を後続状態から求める。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-classify-game-states'],
    unitIds: ['unit-dp-game'],
    recall: [
      'grundy',
      '\\bnim\\b',
      'ゲーム.?dp',
      '勝敗.?dp',
      'winning.?losing',
      '勝ち.?負け',
      '後退解析',
      'normal.?play',
      'impartial',
    ],
    object: ['ゲーム', '手番', '先手', '後手', '石'],
    trigger: ['勝ち', '負け', 'mex', '手を選'],
    invariant: ['grundy', 'xor', '後続状態'],
    goal: ['勝者', '勝てる', 'grundy'],
    exclude: ['minimax path', 'bottleneck path'],
    priority: 85,
  },
  {
    id: 'tag-game-value-dp',
    name: 'minimax・局面値ゲームDP',
    definition: '両者が異なる目的で最適に手を選ぶ局面を、得点差・手数・勝敗値のminimaxで評価する。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-evaluate-adversarial-game-value'],
    unitIds: ['unit-dp-game-value'],
    recall: ['minimax', 'ミニマックス', '得点差', 'partisan', 'ゲーム木', '最悪応答', '零和.?game'],
    object: ['ゲーム', '手番', '局面', '得点', '先手', '後手'],
    trigger: ['最大化', '最小化', '互いに最適', '最善手'],
    invariant: ['局面値', '得点差', '手番ごとの目的'],
    goal: ['最終得点', '勝敗', '最適手数', 'ゲームの値'],
    priority: 86,
  },
  {
    id: 'tag-dp-transition-acceleration',
    name: 'DP遷移の集約・高速化',
    definition: '同じ形の遷移をprefix、単調構造、剰余類などでまとめる。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-factor-and-accelerate-transitions'],
    unitIds: ['unit-dp-transition-optimization'],
    recall: [
      'dp高速化',
      '遷移の高速化',
      'convex hull trick',
      'divide.?and.?conquer optimization',
      'monge',
      'sliding sum',
      '遷移の区間和',
      'dp.*総和圧縮',
    ],
    object: ['dp', '遷移', '状態数', '遷移元'],
    trigger: ['全遷移', '二重ループ', '遷移をまとめ'],
    invariant: ['最小値', '同じ係数', '区間和', '単調'],
    goal: ['高速化', '計算量', '更新'],
    priority: 79,
  },
  {
    id: 'tag-linear-recurrence-matrix',
    name: '線形遷移・行列累乗',
    definition: '固定線形遷移を行列または線形漸化式として巨大回数進める。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-accelerate-fixed-linear-transition'],
    unitIds: ['unit-linear-recurrence'],
    recall: [
      '行列累乗',
      '行列高速べき',
      'matrix exponentiation',
      'matrix.*binary exponentiation',
      '遷移行列',
      '転送行列',
      'min.?plus.*行列',
      'linear recurrence',
      'affine recurrence',
      'kitamasa',
      '線形漸化式',
    ],
    object: ['行列', '線形遷移', '漸化式', '巨大な回数'],
    trigger: ['累乗', '二分べき', '同じ遷移'],
    invariant: ['線形', '固定行列', '特性多項式'],
    goal: ['n回後', '巨大', '高速化'],
    priority: 88,
  },
  {
    id: 'tag-reachability-bfs',
    name: '状態グラフ探索・推移閉包',
    definition:
      '状態を頂点、一手を辺として探索するか、中継頂点を順に許可して重みなしの到達関係を推移閉包として求める。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-select-state-graph-search', 'outcome-compute-transitive-closure'],
    unitIds: ['unit-graph-search'],
    recall: [
      'breadth.?first',
      '\\bbfs\\b',
      '幅優先探索',
      'depth.?first',
      '\\bdfs\\b',
      'backtracking',
      'バックトラック',
      'flood fill',
      'transitive closure',
      '推移閉包',
      '連結成分labeling',
      '多始点.*探索',
    ],
    object: ['状態', '頂点', 'マス', 'グリッド', 'グラフ'],
    trigger: ['到達', '隣接', '探索', '追加される辺'],
    invariant: ['queue', '距離順', '訪問済み', '未到達', '訪問状態を戻す'],
    goal: ['到達判定', '最小手数', '連結領域', '単純pathの列挙'],
    priority: 58,
  },
  {
    id: 'tag-shortest-path',
    name: '最短路モデル',
    definition: '重み付きグラフに帰着し、距離の確定条件に応じた最短路法を選ぶ。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-model-and-compute-shortest-path'],
    unitIds: ['unit-shortest-path-certificates'],
    recall: [
      'dijkstra',
      'bellman.?ford',
      'warshall.?floyd',
      'floyd.?warshall',
      'floyd',
      '0.?1 bfs',
      'bottleneck path',
      '\\bapsp\\b',
      'metric closure',
      '最短路',
      '最短距離',
    ],
    object: ['距離', 'distance', 'コスト', '重み', '道', 'path', '辺', 'dijkstra'],
    trigger: ['最短', '最小コスト', '移動', 'threshold', 'multi.?source', 'frontier'],
    invariant: ['距離確定', '緩和', 'dist', 'priority queue', '確定したvertex'],
    goal: ['最短距離', '最小時間', '最小コスト'],
    exclude: ['最短(式|文字列)', '構文', 'syntax'],
    priority: 75,
  },
  {
    id: 'tag-shortest-path-certificate',
    name: '最短路を証明する木・経路の復元',
    definition: '最短距離の等式を満たす辺から、親・木・実現経路を選ぶ。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-shortest-path'],
    outcomeIds: ['outcome-build-shortest-path-certificate'],
    unitIds: ['unit-shortest-path-certificates'],
    recall: ['最短路木', '経路復元', 'shortest.?path tree', 'predecessor'],
    object: ['最短距離', '親辺', 'parent', '経路'],
    trigger: ['復元', '辺を出力', '木を構成'],
    invariant: ['dist.*\\+', '最短路上', '距離等式'],
    goal: ['辺の集合', '経路出力', '構成'],
    priority: 92,
  },
  {
    id: 'tag-witness-impact-localization',
    name: '基準解による変更影響の局所化',
    definition: '基準となる解に含まれない変更は答えを変えないと示し、再計算対象を絞る。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-shortest-path-certificate'],
    outcomeIds: ['outcome-localize-change-impact-by-witness'],
    unitIds: ['unit-shortest-path-certificates'],
    recall: ['辺削除ごとの最短路', 'replacement paths', '影響範囲', 'witness'],
    object: ['辺削除', '変更', '基準解', '経路'],
    trigger: ['各辺', '除いたとき', '再計算'],
    invariant: ['基準経路に含まれない', 'witness', '答えは変わらない'],
    goal: ['変更後の答え', '各削除', '影響'],
    priority: 95,
  },
  {
    id: 'tag-dsu-connectivity',
    name: 'DSU・差分辺グラフによる成分管理',
    definition:
      'DSUによる成分併合、または差分辺グラフの探索により、連結性、頂点間potential、成分metadata・merge履歴を保つ。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-maintain-connectivity-components',
      'outcome-maintain-potential-differences',
      'outcome-augment-components-with-metadata',
    ],
    unitIds: ['unit-connectivity'],
    recall: [
      'union.?find',
      '\\bdsu\\b',
      '素集合データ構造',
      '連結成分の併合',
      'weighted union',
      '重み付きunion',
      'potential dsu',
      'disjoint set union',
      'kruskal',
      'minimum spanning tree',
      'maximum spanning tree',
      '最小全域木',
    ],
    object: ['連結成分', '頂点', '辺', '集合'],
    trigger: ['辺追加', 'merge', 'union', '同じ成分'],
    invariant: ['root', 'leader', '成分サイズ'],
    goal: ['連結判定', '成分数', 'サイズ'],
    priority: 83,
  },
  {
    id: 'tag-directed-condensation-toposort',
    name: '有向グラフの閉路・SCC・DAG順序',
    definition: '有向グラフの閉路と依存関係を整理し、必要なら強連結成分へ縮約してDAG順に処理する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-condense-and-order-directed-graph'],
    unitIds: ['unit-directed-condensation'],
    recall: [
      '強連結成分',
      '\\bscc\\b',
      'トポロジカル',
      'topological',
      '連結成分の?縮約',
      '\\bdag\\b',
    ],
    object: ['有向グラフ', '頂点', '有向辺', 'dag'],
    trigger: ['相互到達', '依存関係', '順序'],
    invariant: ['scc', '縮約', '入次数', '閉路なし'],
    goal: ['順序', '最長路', '到達関係', '成分'],
    priority: 84,
  },
  {
    id: 'tag-functional-graph-doubling',
    name: '関数グラフ・ダブリング',
    definition:
      '後続が一意な遷移について、cycle/tree構造の分解と、必要な巨大回数jumpを区別して設計する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-decompose-functional-graph', 'outcome-jump-deterministic-transition'],
    unitIds: ['unit-functional-graph'],
    recall: [
      'functional graph',
      '関数グラフ',
      'doubling',
      'ダブリング',
      '二分lifting',
      'binary lifting',
      '写像反復',
    ],
    object: ['次の状態', '後続が一つ', '置換', 'cycle'],
    trigger: ['k回', '巨大回', '反復', '遷移先'],
    invariant: ['cycle', '2のべき', '一意な後続'],
    goal: ['k回後', '到達時間', '周期'],
    priority: 87,
  },
  {
    id: 'tag-tree-metric-diameter',
    name: '木の直径・中心・最遠点',
    definition:
      '木距離の最遠点性質を使い、直径端点・中心・部分集合の最遠pairを少数の端点で代表する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-use-tree-diameter-extrema'],
    unitIds: ['unit-tree-metric'],
    recall: [
      '木の直径',
      'tree diameter',
      'diameter endpoint',
      '直径端点',
      '木の中心',
      'tree center',
      'eccentricity',
      '最遠点',
    ],
    object: ['木', '距離', '直径', '中心', '端点'],
    trigger: ['最遠', '最大距離', '直径', '中心'],
    invariant: ['直径端点', '二端点', '中点', 'eccentricity'],
    goal: ['最遠点', '最大距離', '中心', '直径'],
    priority: 82,
  },
  {
    id: 'tag-tree-aggregation-reroot',
    name: '木DP・部分木集約・全方位木DP',
    definition:
      '根付き木の子側情報を合成し、必要な問題だけ親側の差し替えやcluster結合で全体の値を更新する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-aggregate-rooted-tree',
      'outcome-reroot-tree-aggregation',
      'outcome-compose-dynamic-tree-clusters',
    ],
    unitIds: ['unit-tree-aggregation'],
    recall: [
      '木.?dp',
      'tree.?dp',
      'subtree.?dp',
      '部分木.*dp',
      'postorder.?dp',
      'reroot',
      '全方位木.?dp',
      'top tree',
      'static top tree',
      'implicit complete binary tree',
      '暗黙.*完全二分木',
    ],
    object: ['木', '親', '子', '部分木'],
    trigger: ['根付け', '子の答え', '全頂点を根'],
    invariant: ['親側', '子側', '合成', '部分木サイズ'],
    goal: ['各頂点', '距離和', '部分木', '木全体'],
    priority: 81,
  },
  {
    id: 'tag-tree-path-decomposition',
    name: '木上パスの分解・LCA・HLD',
    definition:
      '木上のパスを祖先関係・Euler順の連続区間・virtual treeへ分解し、query・数え上げを処理する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-decompose-tree-path-queries'],
    unitIds: ['unit-tree-decomposition'],
    recall: [
      'heavy.?light',
      'heavy path',
      '\\bhld\\b',
      '\\blca\\b',
      '最小共通祖先',
      'オイラーツアー',
      'euler.?tour',
      'virtual tree',
      '仮想木',
      'subtree.*区間',
    ],
    object: ['木', 'path', '経路', '祖先'],
    trigger: ['頂点間', '経路上', '部分木区間'],
    invariant: ['depth', 'ancestor', '軽い辺', '訪問順'],
    goal: ['path query', '祖先判定', '経路の和'],
    priority: 89,
  },
  {
    id: 'tag-tree-balanced-separator',
    name: '重心separatorによる木の再帰分解',
    definition:
      '各成分のサイズを半分以下にする重心をseparatorとし、除去後の成分を再帰的に分解する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-build-balanced-separator-decomposition'],
    unitIds: ['unit-tree-balanced-separators'],
    recall: ['centroid decomposition', '\\bcentroid\\b', '重心', 'tree separator', '重心分解木'],
    object: ['木', '連結成分', '部分木サイズ', '重心'],
    trigger: ['除いた各成分', '再帰', 'separator', '半分以下'],
    invariant: ['成分サイズ', '高さ.*log', '重心', '親を設定'],
    goal: ['分解木', '親配列', '距離query', '構成'],
    priority: 92,
  },
  {
    id: 'tag-flow-matching-cut',
    name: 'flow・matching・cut帰着',
    definition: '容量制約付きの選択・対応付け・排反をnetwork flowまたはmatchingに帰着する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-reduce-selection-to-network-optimization'],
    unitIds: ['unit-flow-matching'],
    recall: [
      'max.?flow',
      '最大流',
      'min.?cut',
      '最小カット',
      '二部マッチング',
      '二部.*matching',
      '(perfect|bipartite|weighted) matching',
      'min.?cost flow',
      '最小費用流',
      'graph cut',
      'node splitting',
      '頂点容量',
      'min.?cost.?slope',
      'lower bound.*flow',
    ],
    object: ['容量', '対応付け', '左右', '選択'],
    trigger: ['同時に選べない', '一対一', '流す'],
    invariant: ['flow', 'cut', '増加路', 'マッチ'],
    goal: ['最大数', '最小削除', '割り当て'],
    priority: 90,
  },
  {
    id: 'tag-euler-degree-parity',
    name: 'Eulerウォークと次数の偶奇',
    definition:
      '全辺ウォークの成立性、または選択辺集合の次数parity制約を、次数と連結性から特徴付ける。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-characterize-walk-by-degrees'],
    unitIds: ['unit-euler-degree'],
    recall: [
      'eulerian',
      'オイラー路',
      'オイラー閉路',
      '一筆書き',
      '次数の偶奇',
      '奇数次数',
      'best theorem',
      'best定理',
      'euler trail',
      'hierholzer',
    ],
    object: ['辺', '次数', 'walk', '頂点'],
    trigger: ['全辺', '一度ずつ', '次数'],
    invariant: ['偶数次数', '奇数次数', '連結'],
    goal: ['一筆書き', '経路構成', '成立判定'],
    priority: 85,
  },
  {
    id: 'tag-lowlink-critical-structure',
    name: 'lowlinkによる橋・関節点の検出',
    definition: 'DFS木の到達時刻とlowlink値から、除去で連結性が変わる辺・頂点を特定する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-identify-bridges-and-articulations'],
    unitIds: ['unit-lowlink-critical-structure'],
    recall: ['lowlink', '橋', '\\bbridge\\b', '関節点', 'articulation', '二辺連結'],
    object: ['グラフ', 'dfs木', '辺', '頂点', 'back edge'],
    trigger: ['除去すると切断', '橋', '関節点', '連結成分が増え'],
    invariant: ['low', 'ord', '到達時刻', '先祖への辺'],
    goal: ['bridge', '関節点', '二辺連結成分', 'critical edge'],
    priority: 91,
  },
  {
    id: 'tag-graph-core-peeling',
    name: '葉刈り・graph core・kernel縮約',
    definition:
      '次数条件を満たさない頂点を反復削除してcycle coreを特定するか、答えを保つdegree-2 chain縮約によって小さなgraph kernelを構成する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-reduce-graph-by-peeling-or-kernelization'],
    unitIds: ['unit-graph-core-peeling'],
    recall: [
      'leaf pruning',
      '葉刈り',
      '\\bk.?core\\b',
      'peeling',
      'kernelization',
      'カーネル化',
      'degree.?2 chain',
      'cycle rank',
      'leaf stripping',
      'core peeling',
    ],
    object: ['グラフ', '次数', '葉', 'cycle', 'core', 'terminal', 'chain', 'parameter'],
    trigger: ['leaf.*削除', '葉を削除', '次数.*未満', '反復削除', 'chain.*縮約', '余分なedge'],
    invariant: ['残る頂点', 'cycle上', '次数条件', 'core', 'simple path集合', 'cycle rank'],
    goal: ['cycleを特定', '残存成分', 'core', '構造分解', '小kernel', 'path列挙'],
    priority: 93,
  },
  {
    id: 'tag-prefix-difference',
    name: '累積和・差分配列',
    definition:
      '連続区間の情報または一括加算を接頭辞・端点の差へ変換し、query・数え上げ・復元に使う。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-linearize-static-range-information'],
    unitIds: ['unit-prefix-aggregate'],
    recall: [
      '累積和',
      'prefix.?sum',
      'prefix.?和',
      'prefix.?差',
      'prefix.?difference',
      '差分配列',
      'いもす法',
      'difference array',
    ],
    object: ['区間', '合計', '配列', 'prefix', 'rectangle', '矩形', 'grid'],
    trigger: ['連続区間', '一括加算', '区間和', '4.*corner', 'rectangle.*query'],
    invariant: ['prefixの差', '差分', '左端と右端', 'total.*inside', '補集合'],
    goal: ['区間和', '各位置の値', '集計', 'distinct', '種類数'],
    priority: 72,
  },
  {
    id: 'tag-fenwick-weighted-prefix',
    name: 'Fenwick Treeと重み付き接頭辞統計',
    definition: '動的な接頭辞和を複数本組み合わせ、次数付きの区間式を評価する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-maintain-weighted-prefix-statistics'],
    unitIds: ['unit-weighted-prefix-fenwick'],
    recall: ['fenwick', 'binary indexed tree', '\\bbit\\b', '重み付き累積和'],
    object: ['prefix', '添字付き和', '重み', '配列'],
    trigger: ['point update', '一点更新', '接頭辞和', '累積和'],
    invariant: ['複数本の', '係数', 'bit'],
    goal: ['区間式', '動的和', 'query'],
    exclude: ['bit.?mask', 'bit.?dp', 'bitset'],
    priority: 86,
  },
  {
    id: 'tag-monoid-segment-tree',
    name: '結合的要約・Segment Tree・SWAG',
    definition:
      '結合的な演算と単位元を持つ要約を設計し、prefix fold・Segment Tree・SWAGの適切な形で保つ。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-design-associative-range-summary'],
    unitIds: ['unit-monoid-segment-tree'],
    recall: [
      'segment.?tree',
      'セグメント.?木',
      '線分木',
      'monoid',
      'モノイド',
      '\\brmq\\b',
      'range.?minimum.?query',
      'sparse table',
      '\\bswag\\b',
    ],
    object: ['区間', '要約', 'ノード', '配列'],
    trigger: ['point update', '更新', '区間query', '合成'],
    invariant: ['結合法則', '単位元', 'merge'],
    goal: ['区間の', '全体の値', 'query'],
    priority: 85,
  },
  {
    id: 'tag-lazy-segment-action',
    name: '遅延評価する区間作用',
    definition: '区間更新を要約へ作用させ、作用の合成を遅延評価する。',
    parentId: 'tag-query-sufficient-aggregate',
    prerequisiteTagIds: ['tag-monoid-segment-tree'],
    outcomeIds: ['outcome-design-range-update-action'],
    unitIds: ['unit-range-actions'],
    recall: [
      'lazy segment',
      'lazy propagation',
      'lazy.*tree',
      '遅延評価',
      '区間更新セグ木',
      'dual segment',
    ],
    object: ['区間更新', '遅延値', '区間要約'],
    trigger: ['range update', '区間加算', '区間代入'],
    invariant: ['作用', '合成順', 'lazy'],
    goal: ['更新とquery', '区間操作'],
    priority: 91,
  },
  {
    id: 'tag-persistent-rollback',
    name: '永続化・rollback・構造共有',
    definition: '過去の版を壊さずに根や差分を共有し、変更部分だけを記録して保存・復元する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-share-or-revert-versions'],
    unitIds: ['unit-persistence-rollback'],
    recall: ['persistent', '永続', 'rollback', 'structural sharing', '\\bundo\\b', 'save.?load'],
    object: ['version', '過去状態', 'snapshot', 'parent pointer'],
    trigger: ['戻る', '復元', 'save', 'load', '分岐'],
    invariant: ['immutable', '共有', 'root', '変更履歴'],
    goal: ['過去の値', '状態保存', 'バージョン'],
    priority: 94,
  },
  {
    id: 'tag-linked-list-index',
    name: '索引付き連結リスト',
    definition: '要素IDから前後linkへ直接到達し、挿入・削除で影響する局所的なlinkだけを更新する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-maintain-local-sequence-links'],
    unitIds: ['unit-linked-list-index'],
    recall: [
      'linked list',
      '連結リスト',
      '双方向リスト',
      'prev.*next',
      '前後.*link',
      'next配列',
      'key.?to.?node',
      '\\bsplice\\b',
    ],
    object: ['列', '要素', '前', '後', 'link', 'node'],
    trigger: ['直後に挿入', '削除', '前後をつなぐ', '局所更新'],
    invariant: ['prev', 'next', '隣接関係', 'head', 'tail'],
    goal: ['列を復元', '挿入削除', '順序を出力'],
    priority: 88,
  },
  {
    id: 'tag-ordered-set-heap',
    name: 'heap・ordered setによる全候補の順序管理',
    definition: '現在の全候補の中から極値・順位・隣接候補を反復取得し、挿入・削除に追従する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-maintain-dynamic-order-statistics'],
    unitIds: ['unit-ordered-set-heap'],
    recall: [
      'priority queue',
      '優先度付きキュー',
      'ordered.?multiset',
      'two.?multiset',
      '二つのmultiset',
      'multiset.*(insert|erase|lower.?bound|smallest|largest|top.?k|min|max)',
      'ordered set',
      'balanced tree',
      'balanced binary search tree',
      'order statistics',
      '\\bheap\\b',
      'ヒープ',
      '平衡二分',
    ],
    object: ['最大', '最小', '隣', '候補', 'top.?k', 'frontier'],
    trigger: ['挿入', '削除', '次に大きい', '極値', 'point update', '更新', 'top.?k'],
    invariant: ['順序', 'size k', 'boundary', '二つのmultiset', '未処理の最小'],
    goal: ['最大値', '最小値', '隣接', '次の要素', 'largest k', 'top.?k'],
    exclude: ['heap.?index', 'complete binary tree', '完全二分木'],
    priority: 73,
  },
  {
    id: 'tag-monotone-stack-queue',
    name: '単調stack・queueによる支配候補の削除',
    definition:
      '順序に走査し、新しい要素に支配された候補を二度と必要にならないことを示して一度だけ削除する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-prune-dominated-candidates-once'],
    unitIds: ['unit-monotone-stack-queue'],
    recall: [
      'monotone stack',
      'monotonic stack',
      '単調stack',
      '単調スタック',
      'monotone queue',
      '単調queue',
      '単調キュー',
      '単調deque',
      'sliding.?maximum',
      'sliding.?minimum',
      'histogram',
      'ヒストグラム',
    ],
    object: ['次に大きい', '次に小さい', '窓', '高さ', '候補'],
    trigger: ['pop', '後ろから削除', '支配', '次に大きい', '各要素を一度'],
    invariant: ['単調', '不要になった候補', '二度と戻らない', 'stack'],
    goal: ['nearest greater', '次の要素', '区間最大', '各prefix'],
    priority: 88,
  },
  {
    id: 'tag-mo-offline-range',
    name: "Mo's algorithmによるオフライン区間問い合わせ",
    definition:
      '区間問い合わせを端点の移動量が小さい順に並べ、一要素の追加・削除で答えを更新する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-schedule-range-query-updates'],
    unitIds: ['unit-mo-offline-range'],
    recall: ['mo.?s algorithm', "mo's", 'mo法', 'ムーのアルゴリズム'],
    object: ['区間query', '左端', '右端', '数列'],
    trigger: ['offline', 'クエリを並べ', '追加と削除'],
    invariant: ['区間の差分', '端点移動', 'block'],
    goal: ['各区間', '異なる値', '頻度'],
    priority: 93,
  },
  {
    id: 'tag-trie-prefix',
    name: 'Trieによる共有接頭辞の索引',
    definition:
      '文字列集合の各文字遷移を木として共有し、prefix通過数・prefix DP・辞書順探索をnode上で処理する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-index-shared-prefixes-with-trie'],
    unitIds: ['unit-trie-prefix'],
    recall: ['\\btrie\\b', 'トライ木', 'prefix tree', '接頭辞木'],
    object: ['文字列集合', '接頭辞', '文字', 'node'],
    trigger: ['共通prefix', '一文字ずつ挿入', '辞書を構築'],
    invariant: ['通過数', '子への文字遷移', 'prefix node'],
    goal: ['共通接頭辞', '辞書順', 'prefix query', '文字列変換'],
    priority: 91,
  },
  {
    id: 'tag-prefix-matching-automata',
    name: '接頭辞一致・文字列automaton',
    definition: '現在の一致長を接頭辞と接尾辞の関係で更新し、一致を線形に追跡する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-build-prefix-match-state'],
    unitIds: ['unit-string-prefix-automata'],
    recall: [
      '\\bkmp\\b',
      'z.?algorithm',
      'zアルゴリズム',
      'prefix function',
      '接頭辞と接尾辞',
      'aho.?corasick',
      'z.?array',
      'z.?配列',
      'failure function',
    ],
    object: ['文字列', 'prefix', '接頭辞', '一致長'],
    trigger: ['pattern', '一致', '重なり', '接尾辞'],
    invariant: ['failure', 'z値', '最長の一致'],
    goal: ['検索', '出現位置', '構成可能'],
    priority: 88,
  },
  {
    id: 'tag-suffix-lcp-index',
    name: '接尾辞順序・LCP索引',
    definition:
      '全接尾辞の辞書順とLCPを索引化し、部分文字列の順序・出現範囲・順位・distinct数を求める。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-build-suffix-lcp-index'],
    unitIds: ['unit-suffix-lcp-index'],
    recall: ['suffix array', '接尾辞配列', '\\blcp\\b', 'lcp.?array', 'lcp配列', 'suffix tree'],
    object: ['suffix', '接尾辞', '部分文字列', '文字列'],
    trigger: ['辞書順', 'lcp', '出現範囲', '全rotation'],
    invariant: ['suffix rank', '最長共通接頭辞', '隣接suffix'],
    goal: ['辞書順比較', '出現数', 'rotation.*数え'],
    priority: 87,
  },
  {
    id: 'tag-string-hash-equality',
    name: 'Fingerprint・rolling hashによる同値比較',
    definition:
      '文字列・列・multiset・大整数式を合成可能なfingerprintへ写し、衝突条件を管理して同値性を比較する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-compare-objects-by-fingerprint'],
    unitIds: ['unit-string-hash'],
    recall: ['rolling hash', 'ローリングハッシュ', 'string hash', 'fingerprint'],
    object: ['部分文字列', '文字列', '列', 'multiset', '積', 'hash', 'fingerprint'],
    trigger: ['一致判定', '複数回比較', '積が等しい', 'multisetが等しい', '前計算'],
    invariant: ['hashの差', '基数', '法', '乱数値の和', '衝突確率'],
    goal: ['一致', '同値', '最長共通', '比較query'],
    priority: 84,
  },
  {
    id: 'tag-palindrome-radius',
    name: '回文半径・Manacher',
    definition: '各中心の最大回文半径を左右対称性と既知区間の再利用で線形に求める。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-characterize-palindrome-intervals'],
    unitIds: ['unit-palindrome-radius'],
    recall: ['manacher', '回文半径'],
    object: ['回文', '中心', '左右対称', '文字列'],
    trigger: ['回文判定', '対称', '反転して一致', '半径'],
    invariant: ['最右端', '鏡像', '半径', '中心'],
    goal: ['回文数', '最長回文', '回文区間'],
    priority: 86,
  },
  {
    id: 'tag-recursive-compressed-string',
    name: '再帰・圧縮・入れ子文字列の走査',
    definition:
      '明示展開できない反復・再帰文字列をblockで追跡するか、対応括弧で入れ子区間を飛び越えて作用を合成する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-query-recursively-defined-string'],
    unitIds: ['unit-recursive-compressed-string'],
    recall: [
      'run.?length',
      '\\brle\\b',
      'ランレングス',
      'ラン長圧縮',
      'compressed string',
      '圧縮文字列',
      '再帰文字列',
      '巨大.*concat文字列',
      '暗黙文字列',
      '\\brope\\b',
    ],
    object: ['文字列', '反復', 'block', '長さ', 'concat', 'dag'],
    trigger: ['展開できない', '実体化せず', '連続個数', '反転', '連結', '文字参照'],
    invariant: ['block', '長さだけ', '再帰定義', 'saturat', 'included length'],
    goal: ['k文字目', '比較', '等しい長さ', 'query'],
    priority: 82,
  },
  {
    id: 'tag-modular-crt',
    name: '合同算術・周期・CRT',
    definition:
      '剰余類上の演算・周期前計算・巨大指数の簡約を行い、必要な問題では逆元・一次合同・CRTで解を構成する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-solve-modular-constraints', 'outcome-exploit-modular-periodicity'],
    unitIds: ['unit-modular-arithmetic', 'unit-modular-periodicity'],
    recall: [
      'chinese remainder',
      '\\bcrt\\b',
      '中国剰余定理',
      '合同式',
      '一次合同',
      'モジュラ逆元',
      'fermat',
      'オイラーの定理',
      'lcm.*周期',
      'modular inverse',
      '法逆元',
      'modular exponentiation',
      '剰余高速累乗',
      'modular arithmetic',
    ],
    object: ['余り', '法', 'mod', '合同'],
    trigger: ['複数の法', '逆元', '割り算', '一致'],
    invariant: ['gcd', '互いに素', '合同類'],
    goal: ['整数解', '最小の解', '余り'],
    priority: 82,
  },
  {
    id: 'tag-gcd-diophantine',
    name: 'Euclid・gcd・有理近似',
    definition:
      'Euclid互除法から、整除・差分の周期・Bézout整数解・連分数による最良有理近似を導く。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: [
      'outcome-characterize-integer-solvability',
      'outcome-reduce-integer-structure-by-gcd',
      'outcome-approximate-rational-by-euclid',
    ],
    unitIds: ['unit-gcd-diophantine', 'unit-rational-approximation'],
    recall: [
      'greatest common divisor',
      '\\bgcd\\b',
      '最大公約数',
      'euclid',
      'ユークリッド',
      'bezout',
      '不定方程式',
      'continued fraction',
      '連分数',
      'stern.?brocot',
    ],
    object: ['整数', '整除', '倍数', '線形結合'],
    trigger: ['割り切れる', '何回で', '整数解'],
    invariant: ['gcd', '最大公約数', '線形結合'],
    goal: ['成立判定', '最小値', '整数解'],
    priority: 73,
  },
  {
    id: 'tag-prime-divisor-decomposition',
    name: '素因数・約数分解',
    definition: '整数の条件を素数ごとの指数や約数格子の条件に分解する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-decompose-by-prime-or-divisor'],
    unitIds: ['unit-prime-divisor'],
    recall: [
      '素因数分解',
      'prime factor',
      '約数列挙',
      '\\bdivisor\\b',
      '素数篩',
      '\\bsieve\\b',
      'trial.?division',
      'エラトステネス',
    ],
    object: ['素数', '約数', '倍数', '素因数'],
    trigger: ['割り切る', '因数分解', '約数を列挙'],
    invariant: ['素因数ごと', '指数', '一意分解'],
    goal: ['個数', '和', '成立判定'],
    priority: 78,
  },
  {
    id: 'tag-integer-boundary-blocks',
    name: '整数境界・同値区間分割',
    definition:
      'floor値・整数根・表記桁数・圧縮block内の式が変わる整数境界を正確に分け、区間ごとに処理する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: [
      'outcome-partition-integer-parameter-ranges',
      'outcome-evaluate-compressed-integer-blocks',
    ],
    unitIds: ['unit-integer-boundary-blocks'],
    recall: [
      'floor.?quotient',
      'floor.?sum',
      '商が一定',
      '整数平方根',
      '整数k乗根',
      '底の列挙',
      '整数境界',
      'ceil division',
      '天井除算',
    ],
    object: ['floor', '商', '累乗', '基数', '桁数', '整数根'],
    trigger: ['値が変わる境界', '同じ商', 'オーバーフローしない'],
    invariant: ['区間内で一定', '整数誤差', '境界'],
    goal: ['列挙', '個数', '最大の整数'],
    priority: 81,
  },
  {
    id: 'tag-cyclic-group-order',
    name: '巡回群・位数・乗法的位数',
    definition: '乗法群や巡回部分群を指数化し、位数と約数格子から計数または周期を求める。',
    parentId: 'tag-math-geometry-transformation',
    prerequisiteTagIds: ['tag-modular-crt', 'tag-prime-divisor-decomposition'],
    outcomeIds: [
      'outcome-count-through-cyclic-exponents',
      'outcome-find-period-by-multiplicative-order',
    ],
    unitIds: ['unit-cyclic-group-exponent-counting', 'unit-multiplicative-order-periods'],
    recall: [
      '乗法的位数',
      'multiplicative order',
      '巡回群',
      '原始根',
      'primitive root',
      '群の位数',
      'baby.?step.?giant.?step',
      '\\bbsgs\\b',
      'discrete log',
    ],
    object: ['乗法群', '巡回群', '余り', '指数', 'レピュニット'],
    trigger: ['べき乗', '乗法的位数', '周期', '生成元'],
    invariant: ['a\\^', '最小の正の整数', '群の位数', '指数'],
    goal: ['最小周期', '個数', '長さ', '巡回'],
    exclude: [
      'primitive word',
      '原始語',
      '文字列の周期',
      'primitive root.*文字列',
      '文字列.*primitive root',
      '反復文字列',
      'syntax',
      '構文',
    ],
    requireObjectForStrictRecall: true,
    priority: 96,
  },
  {
    id: 'tag-combinatorial-coefficients',
    name: '組合せ係数・数え上げ',
    definition: '選択順・順列・分配を二項係数や階乗と対称性で式化する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-formulate-combinatorial-coefficients'],
    unitIds: ['unit-combinatorial-coefficients'],
    recall: [
      '組合せ',
      'binomial',
      '二項係数',
      '二項分布',
      '階乗',
      '重複組合せ',
      'stars.?and.?bars',
      'pr.fer',
      'multinomial',
      '多項係数',
    ],
    object: ['選び方', '並べ方', '場合の数', '個数'],
    trigger: ['何通り', '選ぶ', '分配', '順列'],
    invariant: ['ncr', '階乗', '対称性'],
    goal: ['場合の数', '総数', '確率'],
    priority: 55,
  },
  {
    id: 'tag-inclusion-exclusion',
    name: '包除・Möbius反転',
    definition: '条件集合の重なりを交互加減または約数格子上の反転で補正する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-correct-overlap-by-inversion'],
    unitIds: ['unit-inclusion-exclusion'],
    recall: ['包除', '包含排除', 'inclusion.?exclusion', 'm.bius', 'メビウス反転', '約数反転'],
    object: ['集合', '倍数', '約数', '条件'],
    trigger: ['少なくとも一つ', '重複', 'すべてから引く'],
    invariant: ['交互符号', 'mobius', '部分集'],
    goal: ['重複なく数え', '互いに素', '正確な個数'],
    priority: 87,
  },
  {
    id: 'tag-convolution-fps',
    name: '畳み込み・生成関数・FPS',
    definition: '組合せの合成を係数列の畳み込みとして符号化し、多項式演算で計算する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-encode-counting-by-generating-function'],
    unitIds: ['unit-polynomial-convolution'],
    recall: [
      'convolution',
      '畳み込み',
      '\\bntt\\b',
      '\\bfft\\b',
      '形式的べき級数',
      '\\bfps\\b',
      '生成関数',
      '母関数',
      'generating function',
      '生成多項式',
    ],
    object: ['係数', '多項式', '数列', '生成関数'],
    trigger: ['畳み込み', '係数の積', '分割の合成'],
    invariant: ['係数', '次数', '多項式積'],
    goal: ['係数列', '場合の数', '高速化'],
    priority: 91,
  },
  {
    id: 'tag-linear-algebra-xor',
    name: '線形方程式・基底・分離可能変換',
    definition:
      '体上の構造を線形方程式・基底へ写すか、Walsh変換やKronecker積型変換を小さな軸別変換へ分離して解く。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: [
      'outcome-transform-to-linear-system-or-rank',
      'outcome-factor-separable-linear-transform',
    ],
    unitIds: ['unit-linear-algebra-xor'],
    recall: [
      'gaussian elimination',
      'ガウスの消去法',
      'xor basis',
      'linear basis',
      '線形独立',
      '行列のrank',
      'walsh',
      'hadamard',
      'xor convolution',
      'kronecker',
      'tensor product',
      '掃き出し',
      '線形基底',
    ],
    object: ['行列', 'ベクトル', 'xor', '方程式'],
    trigger: ['線形結合', '連立方程式', '基底', '軸ごとの変換'],
    invariant: ['rank', '線形独立', '行基本変形', 'テンソル積'],
    goal: ['解の個数', '最大xor', '可解性', '正逆変換'],
    priority: 89,
  },
  {
    id: 'tag-determinant-counting',
    name: '行列式による数え上げ',
    definition:
      '非交差経路やspanning treeなどの組合せ対象を行列式に対応させ、LGV補題・行列木定理で数える。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-count-combinatorial-objects-by-determinant'],
    unitIds: ['unit-linear-algebra-xor'],
    recall: ['determinant', '行列式', 'matrix.?tree', '行列木定理', '\\blgv\\b'],
    object: ['行列', '経路', '全域木', 'spanning tree', '有向木'],
    trigger: ['非交差', '木の個数', '行列式展開', 'laplacian'],
    invariant: ['符号付き置換', 'minor', '余因子', '行列式'],
    goal: ['場合の数', '全域木数', '経路族の個数'],
    priority: 92,
  },
  {
    id: 'tag-geometry-orientation-transform',
    name: '幾何の基本判定・配置・座標変換',
    definition:
      '交差・方向・距離・接触条件を、外積、端点順、格子占有または変換後座標の局所判定にする。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-reduce-geometry-to-algebraic-predicates'],
    unitIds: ['unit-geometry-primitives'],
    recall: [
      'cross product',
      '外積',
      'orientation',
      '幾何的変換',
      'マンハッタン距離',
      'manhattan distance',
      'chebyshev',
      '座標変換',
      'chord crossing',
      'voxel',
    ],
    object: ['点', '線分', '直線', '座標', '距離', '弦', '立方体', '面'],
    trigger: ['交差', '接触', '左側', '方向', '回転', '幾何', '端点順'],
    invariant: ['cross', '符号', '端点の交互性', '六近傍', 'x\\+y', 'x-y'],
    goal: ['判定', '距離', '交点', '隣接面', '移動コスト'],
    priority: 76,
  },
  {
    id: 'tag-convex-hull-halfplane',
    name: '凸包・半平面・幾何境界',
    definition: '点・半平面の幾何的な内外と交差を整理し、凸境界上の候補だけを調べる。',
    parentId: 'tag-math-geometry-transformation',
    prerequisiteTagIds: ['tag-geometry-orientation-transform'],
    outcomeIds: ['outcome-restrict-geometric-candidates-to-boundary'],
    unitIds: ['unit-convex-geometry'],
    recall: ['convex hull', '凸包', 'half.?plane', '半平面', '回転キャリパー'],
    object: ['点集合', '多角形', '直線', '境界'],
    trigger: ['内側', '外側', '極値', '支配'],
    invariant: ['凸', 'cross', '境界上', '接線'],
    goal: ['面積', '最適点', '含まれる', '候補絞り込み'],
    priority: 88,
  },
  {
    id: 'tag-convex-hull-trick',
    name: 'Convex Hull Trick・直線包絡',
    definition: '一次関数の候補を傾き・交点順に管理し、各query点で最小または最大となる直線を選ぶ。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-optimize-by-line-envelope'],
    unitIds: ['unit-convex-geometry'],
    recall: ['convex hull trick', '\\bcht\\b', 'li chao', '直線包絡'],
    object: ['直線', '一次関数', '傾き', '切片', 'query点'],
    trigger: ['最小値query', '最大値query', '直線を追加', 'dp遷移'],
    invariant: ['傾き順', '交点順', '下側包絡', '上側包絡'],
    goal: ['最適値', 'dp高速化', '線形関数の極値'],
    priority: 93,
  },
  {
    id: 'tag-discrete-convex-marginal',
    name: '凸最適化・傾き・限界費用',
    definition:
      '凸・凹性から傾き、breakpoint、Lagrange penaltyまたは限界費用を追い、連続・離散の最適点を絞る。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-exploit-convexity'],
    unitIds: ['unit-discrete-convex'],
    recall: [
      'slope trick',
      'スロープトリック',
      '離散凸',
      '限界費用',
      'convex cost',
      '三分探索',
      'ternary search',
      'aliens trick',
      'aliens?.?dp',
      'lagrangian relaxation',
      'pool adjacent violators',
      'l1 clamp',
    ],
    object: ['配分', '個数', '凸関数', '費用'],
    trigger: ['一つ追加', '均す', '傾き', '二次'],
    invariant: ['限界費用', '単調な差分', '凸'],
    goal: ['最小費用', '最適配分', '総和'],
    priority: 86,
  },
  {
    id: 'tag-constructive-witness',
    name: '構成解・witness復元',
    definition: '成立条件の証明が与える局所操作やparentを記録し、実際の解を復元する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-recover-valid-witness'],
    unitIds: ['unit-constructive-witness'],
    recall: ['構成問題', '構成解', 'constructive'],
    object: ['出力', '操作列', '配置', '順列', '経路'],
    trigger: ['実際に構成', '任意の一つ', '手順を出力'],
    invariant: ['成立条件', 'parent', '記録'],
    goal: ['解を出力', '復元', '配置を求め'],
    priority: 45,
  },
];

export const FINAL_TAXONOMY_TAGS: readonly FinalTaxonomyTagPolicy[] = TAG_SEEDS.map(defineTag);

export const NON_PRIMARY_TAG_IDS = FINAL_TAXONOMY_TAGS.filter((tag) => !tag.primaryEligible).map(
  (tag) => tag.id,
);

const OUTCOME_STATEMENTS: Readonly<Record<string, string>> = {
  'outcome-identify-reusable-abstraction':
    '問題固有の語を再利用可能な対象・操作・不変量に置き換えられる。',
  'outcome-design-state-transition': '未来に十分な状態と、状態間の完全な遷移を説明できる。',
  'outcome-model-and-exploit-graph': '対象を頂点と辺に対応させ、利用するグラフ性質を示せる。',
  'outcome-derive-updateable-aggregate': '問い合わせに十分で、更新と合成で保てる要約を導ける。',
  'outcome-model-string-state': '一致・接頭辞・接尾辞・反復に必要な文字列状態を特定できる。',
  'outcome-transform-to-math-structure': '条件を整数・代数・数え上げ・幾何の構造へ変換できる。',
  'outcome-prove-and-search-threshold':
    '判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。',
  'outcome-maintain-monotone-window':
    '一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。',
  'outcome-linearize-events':
    'イベントを離散化・整列し、走査中に有効な情報と端点処理を設計できる。',
  'outcome-reverse-update-time':
    '時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。',
  'outcome-reorder-counting-contributions':
    '答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。',
  'outcome-normalize-equivalent-states': '対称操作で同値な状態の標準形と不変量を選べる。',
  'outcome-count-orbits-by-fixed-points':
    '群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。',
  'outcome-prove-greedy-order':
    '局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。',
  'outcome-split-enumeration-space':
    '候補を直接構造化列挙するか、探索空間を小集合に分けて列挙結果を照合できる。',
  'outcome-divide-search-space-recursively':
    'pivot・上位bit・短い側を選ぶ基準を示し、重複なく部分問題へ再帰分割できる。',
  'outcome-bound-total-work':
    '軽重・倍化・単調な一度限りの移動や削除から、操作列全体の仕事量の上界を説明できる。',
  'outcome-design-minimal-sufficient-state':
    '採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。',
  'outcome-enumerate-subset-state-space':
    'bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。',
  'outcome-design-resource-dp': '資源軸の上限と更新順を選び、選択の重複を避けられる。',
  'outcome-design-order-preserving-dp': '列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。',
  'outcome-design-interval-split-dp':
    '区間または接頭辞の分割点を列挙し、小問題の答えを合成できる。',
  'outcome-count-prefix-constrained-objects':
    '上限との一致・繰り上がり・残数などを状態にし、個数または最適値を求められる。',
  'outcome-solve-stochastic-recurrence': '確率遷移から期待値または到達確率の再帰式を立てて解ける。',
  'outcome-classify-game-states':
    '後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。',
  'outcome-evaluate-adversarial-game-value':
    '手番ごとの最大化・最小化を定義し、得点差・手数・partisan局面値を後続状態から評価できる。',
  'outcome-factor-and-accelerate-transitions':
    '高価なDP遷移の共通項を因数分解・集約し、等価性と計算量を示せる。',
  'outcome-accelerate-fixed-linear-transition':
    '固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。',
  'outcome-select-state-graph-search':
    '状態・重みなし辺・訪問条件を定義し、BFS・DFS・backtrackingから目的に合う探索を選べる。',
  'outcome-compute-transitive-closure':
    '各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。',
  'outcome-model-and-compute-shortest-path':
    '移動を重み付き辺に対応させ、緩和と距離確定条件を説明できる。',
  'outcome-build-shortest-path-certificate':
    '距離等式を満たす親辺を選び、最短路の木または経路を復元できる。',
  'outcome-localize-change-impact-by-witness':
    '基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。',
  'outcome-maintain-connectivity-components':
    '静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。',
  'outcome-maintain-potential-differences':
    '差分辺を累積するグラフ探索、またはDSUの親辺にpotential差を持たせ、同一成分内の頂点間差と矛盾を判定できる。',
  'outcome-augment-components-with-metadata':
    'DSUの根へ成分metadataまたはmerge履歴を集約し、併合後の代表情報を答えられる。',
  'outcome-condense-and-order-directed-graph':
    '有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。',
  'outcome-decompose-functional-graph':
    '後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。',
  'outcome-jump-deterministic-transition':
    '一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。',
  'outcome-use-tree-diameter-extrema':
    '二回の木探索で直径端点を求め、任意点の最遠候補・木の中心・部分集合の直径を少数の端点で代表できる。',
  'outcome-aggregate-rooted-tree':
    '根付き木で子側の状態を合成するか暗黙木の祖先・子孫方向を分け、部分木・距離層・木全体の値を求められる。',
  'outcome-reroot-tree-aggregation':
    '子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。',
  'outcome-compose-dynamic-tree-clusters':
    '境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。',
  'outcome-decompose-tree-path-queries':
    '木上のパスを祖先関係・連続区間・virtual treeへ分解し、問い合わせまたは数え上げを処理できる。',
  'outcome-build-balanced-separator-decomposition':
    '各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。',
  'outcome-reduce-selection-to-network-optimization':
    '選択制約を容量・カット・マッチングに対応させ、最適値と具体的な選択を復元できる。',
  'outcome-characterize-walk-by-degrees':
    '全辺ウォークの成立条件または選択辺集合の次数parity条件を定式化し、連結性・奇数次数・葉からの処理で判定または構成できる。',
  'outcome-identify-bridges-and-articulations':
    'DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。',
  'outcome-reduce-graph-by-peeling-or-kernelization':
    '削除可能な葉・低次数頂点を反復除去してcycle coreと各頂点の所属を特定するか、terminal以外の葉除去とdegree-2 chain縮約によってcycle rankに依存する小kernelを構成できる。',
  'outcome-linearize-static-range-information':
    '区間情報を接頭辞の差または端点差分へ変換し、query・数え上げ・復元へ利用できる。',
  'outcome-maintain-weighted-prefix-statistics':
    '必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。',
  'outcome-design-associative-range-summary':
    '要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。',
  'outcome-design-range-update-action':
    '更新作用の合成順と要約への適用を定義し、遅延評価で保てる。',
  'outcome-share-or-revert-versions':
    '変化しない部分を共有する根や変更履歴を使い、過去の版を保存・復元できる。',
  'outcome-maintain-local-sequence-links':
    '要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。',
  'outcome-maintain-dynamic-order-statistics':
    'heap・ordered set・区間集合で極値・順位・隣接関係を保ち、更新・query・探索を処理できる。',
  'outcome-prune-dominated-candidates-once':
    '候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。',
  'outcome-schedule-range-query-updates':
    '区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。',
  'outcome-index-shared-prefixes-with-trie':
    '文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。',
  'outcome-build-prefix-match-state':
    '接頭辞と接尾辞の一致長を状態にし、failure linkまたはZ値を線形時間で構成できる。',
  'outcome-build-suffix-lcp-index':
    '接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。',
  'outcome-compare-objects-by-fingerprint':
    '衝突条件を明示したfingerprintを構成し、文字列・列・multiset・大整数式の同値性を比較できる。',
  'outcome-characterize-palindrome-intervals':
    '各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。',
  'outcome-query-recursively-defined-string':
    '圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。',
  'outcome-solve-modular-constraints':
    '合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。',
  'outcome-exploit-modular-periodicity':
    '剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。',
  'outcome-characterize-integer-solvability':
    '整除条件や一次不定方程式の可解性をgcdで特徴付けられる。',
  'outcome-reduce-integer-structure-by-gcd':
    'gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。',
  'outcome-approximate-rational-by-euclid':
    'Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。',
  'outcome-decompose-by-prime-or-divisor':
    '整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。',
  'outcome-partition-integer-parameter-ranges':
    '床関数をconstant quotient blockまたはfloor-sum再帰で処理し、整数根・桁数の境界も誤差なく扱える。',
  'outcome-evaluate-compressed-integer-blocks':
    '圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。',
  'outcome-count-through-cyclic-exponents':
    '巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。',
  'outcome-find-period-by-multiplicative-order':
    '合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。',
  'outcome-formulate-combinatorial-coefficients':
    '選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。',
  'outcome-correct-overlap-by-inversion':
    '条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。',
  'outcome-encode-counting-by-generating-function':
    '組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。',
  'outcome-transform-to-linear-system-or-rank':
    '制約を線形結合・基底へ変換するか、XOR畳み込みをWalsh–Hadamard変換で点ごとの積へ移し、逆変換まで求められる。',
  'outcome-factor-separable-linear-transform':
    'Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。',
  'outcome-count-combinatorial-objects-by-determinant':
    '非交差経路またはspanning treeを行列のminorへ対応させ、行列式から個数を求められる。',
  'outcome-reduce-geometry-to-algebraic-predicates':
    '幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。',
  'outcome-restrict-geometric-candidates-to-boundary':
    '目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。',
  'outcome-optimize-by-line-envelope':
    '一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。',
  'outcome-exploit-convexity':
    '凸・凹性を示し、傾き・breakpoint・Lagrange penalty・限界費用から連続または離散の最適点を求められる。',
  'outcome-recover-valid-witness':
    '成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。',
};

const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));

const OUTCOME_PREREQUISITE_IDS: Readonly<Record<string, readonly string[]>> = {
  'outcome-build-shortest-path-certificate': ['outcome-model-and-compute-shortest-path'],
  'outcome-localize-change-impact-by-witness': ['outcome-build-shortest-path-certificate'],
  'outcome-design-range-update-action': ['outcome-design-associative-range-summary'],
  'outcome-use-tree-diameter-extrema': ['outcome-select-state-graph-search'],
  'outcome-solve-modular-constraints': ['outcome-characterize-integer-solvability'],
  'outcome-count-through-cyclic-exponents': [
    'outcome-exploit-modular-periodicity',
    'outcome-decompose-by-prime-or-divisor',
    'outcome-correct-overlap-by-inversion',
  ],
  'outcome-find-period-by-multiplicative-order': [
    'outcome-characterize-integer-solvability',
    'outcome-exploit-modular-periodicity',
    'outcome-decompose-by-prime-or-divisor',
  ],
  'outcome-restrict-geometric-candidates-to-boundary': [
    'outcome-reduce-geometry-to-algebraic-predicates',
  ],
};

const OUTCOME_LEARNING_UNIT_IDS: Readonly<Record<string, readonly string[]>> = {
  'outcome-normalize-equivalent-states': ['unit-normalization'],
  'outcome-count-orbits-by-fixed-points': ['unit-combinatorial-coefficients'],
  'outcome-solve-modular-constraints': ['unit-modular-arithmetic'],
  'outcome-exploit-modular-periodicity': ['unit-modular-periodicity'],
  'outcome-characterize-integer-solvability': ['unit-gcd-diophantine'],
  'outcome-reduce-integer-structure-by-gcd': ['unit-gcd-diophantine'],
  'outcome-approximate-rational-by-euclid': ['unit-rational-approximation'],
  'outcome-count-through-cyclic-exponents': ['unit-cyclic-group-exponent-counting'],
  'outcome-find-period-by-multiplicative-order': ['unit-multiplicative-order-periods'],
};

export const FINAL_TAXONOMY_OUTCOMES: readonly ObservableOutcomePolicy[] =
  FINAL_TAXONOMY_TAGS.flatMap((tag) =>
    tag.learningOutcomeIds.map((outcomeId) => ({
      id: outcomeId,
      statement: OUTCOME_STATEMENTS[outcomeId] ?? '',
      prerequisiteOutcomeIds: [...(OUTCOME_PREREQUISITE_IDS[outcomeId] ?? [])].sort(),
      scopeTagIds: [tag.id],
      learningUnitCandidateIds:
        OUTCOME_LEARNING_UNIT_IDS[outcomeId] ?? tag.learningUnitCandidateIds,
    })),
  );

export const NON_PRIMARY_OUTCOME_IDS = FINAL_TAXONOMY_OUTCOMES.filter((outcome) =>
  outcome.scopeTagIds.some((tagId) => NON_PRIMARY_TAG_IDS.includes(tagId)),
).map((outcome) => outcome.id);

const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));

const orderedUnitSeeds = deterministicTopologicalOrder(LEARNING_UNIT_SEEDS, (unit) => [
  unit.stageRank,
  unit.difficultyRank,
  unit.representativeRank,
]);

export const FINAL_LEARNING_UNIT_CANDIDATES: readonly MetadataLearningUnitCandidate[] =
  orderedUnitSeeds.map((unit) => ({
    id: unit.id,
    kind: unit.kind,
    title: unit.title,
    parentId: unit.parentId,
    additionalPrerequisiteUnitIds: unit.prerequisiteIds,
    tagIds: FINAL_TAXONOMY_TAGS.filter((tag) => tag.learningUnitCandidateIds.includes(unit.id)).map(
      (tag) => tag.id,
    ),
    learningOutcomeIds: FINAL_TAXONOMY_OUTCOMES.filter((outcome) =>
      outcome.learningUnitCandidateIds.includes(unit.id),
    ).map((outcome) => outcome.id),
    problemIds: [],
    stageRank: unit.stageRank,
    difficultyRank: unit.difficultyRank,
    representativeRank: unit.representativeRank,
    orderReason: UNIT_ORDER_REASONS[unit.id] ?? '',
    excludedTopics: unit.excludedTopics,
  }));

export const FINAL_LEARNING_UNIT_ORDER_POLICY = {
  policyVersion: '1.0.0' as const,
  hardConstraint: 'additionalPrerequisiteUnitIds',
  tieBreakRanks: ['stageRank', 'difficultyRank', 'representativeRank', 'id'] as const,
  orderedUnitIds: orderedUnitSeeds.map((unit) => unit.id),
};

const learningUnitOrderIndex = new Map(
  FINAL_LEARNING_UNIT_ORDER_POLICY.orderedUnitIds.map((unitId, index) => [unitId, index]),
);

const latestLearningUnitId = (unitIds: readonly string[]): string => {
  const latest = [...unitIds]
    .sort(
      (left, right) =>
        (learningUnitOrderIndex.get(left) ?? -1) - (learningUnitOrderIndex.get(right) ?? -1) ||
        compareIds(left, right),
    )
    .at(-1);
  if (latest === undefined) throw new Error('FINAL_TAXONOMY_PRESENTATION_UNIT_MISSING');
  return latest;
};

export const KNOWN_UNMATCHED_CURATED_OVERRIDE_PROBLEM_IDS = [
  'abc273-e',
  'abc293-f',
  'abc419-g',
  'abc284-f',
  'abc258-f',
  'abc294-e',
  'abc359-e',
  'abc446-f',
  'abc450-e',
] as const;

export const CURATED_PRIMARY_OVERRIDES: readonly CuratedPrimaryOverride[] = [
  {
    problemId: 'abc273-e',
    primaryTagId: 'tag-persistent-rollback',
    primaryOutcomeId: 'outcome-share-or-revert-versions',
    rationale: 'SAVE/LOADは列本体ではなくpersistent stackのrootを共有する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc293-f',
    primaryTagId: 'tag-integer-boundary-blocks',
    primaryOutcomeId: 'outcome-partition-integer-parameter-ranges',
    rationale: '基数ごとの桁数境界とoverflowしない整数評価が主である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc419-g',
    primaryTagId: 'tag-graph-core-peeling',
    primaryOutcomeId: 'outcome-reduce-graph-by-peeling-or-kernelization',
    rationale:
      'terminal以外の葉を落とし、degree-2 chainを縮約してcycle rankだけに依存する小kernelを作ることが主である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc284-f',
    primaryTagId: 'tag-prefix-matching-automata',
    primaryOutcomeId: 'outcome-build-prefix-match-state',
    rationale: '前後の一致長をprefix matchingで一括検証する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc258-f',
    primaryTagId: 'tag-geometry-orientation-transform',
    primaryOutcomeId: 'outcome-reduce-geometry-to-algebraic-predicates',
    rationale: '幹線の候補座標へ幾何移動を変換する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc294-e',
    primaryTagId: 'tag-two-pointers-window',
    primaryOutcomeId: 'outcome-maintain-monotone-window',
    rationale: 'run-length blockの左右端を同時に進め、重なる長さを集計する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc359-e',
    primaryTagId: 'tag-monotone-stack-queue',
    primaryOutcomeId: 'outcome-prune-dominated-candidates-once',
    rationale: '単調stackに不要になった高さ候補を捨てながらprefix答を保つ。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc446-f',
    primaryTagId: 'tag-reachability-bfs',
    primaryOutcomeId: 'outcome-select-state-graph-search',
    rationale: '辺追加に応じて新たに到達した状態だけをqueueで展開する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc450-e',
    primaryTagId: 'tag-recursive-compressed-string',
    primaryOutcomeId: 'outcome-query-recursively-defined-string',
    rationale: '再帰的に定義された文字列を展開せずblock長で位置を追跡する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc217-e',
    primaryTagId: 'tag-amortized-heavy-light',
    primaryOutcomeId: 'outcome-bound-total-work',
    rationale:
      'queueとpriority queue間の一括移動を各要素一回に抑え、全操作の仕事量を償却で閉じる。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc279-e',
    primaryTagId: 'tag-witness-impact-localization',
    primaryOutcomeId: 'outcome-localize-change-impact-by-witness',
    rationale:
      '全swap結果を基準witnessとし、省略したswapが触れる二labelだけへ変更影響を局所化する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc265-g',
    primaryTagId: 'tag-lazy-segment-action',
    primaryOutcomeId: 'outcome-design-range-update-action',
    rationale: '三値の写像更新を区間要約への作用として閉じ、反転数queryと合成する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc270-ex',
    primaryTagId: 'tag-stochastic-expectation-dp',
    primaryOutcomeId: 'outcome-solve-stochastic-recurrence',
    rationale: '巨大thresholdまでの確率過程をbreakpointごとの期待値再帰に圧縮する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc270-g',
    primaryTagId: 'tag-divide-enumerate',
    primaryOutcomeId: 'outcome-split-enumeration-space',
    rationale: 'affine合同数列の到達indexをbaby-step/giant-stepの二集合に分けて照合する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc272-e',
    primaryTagId: 'tag-amortized-heavy-light',
    primaryOutcomeId: 'outcome-bound-total-work',
    rationale: 'mexに関係する値だけをsparse eventとして列挙し、全出現数を O(N log N) に抑える。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc272-f',
    primaryTagId: 'tag-suffix-lcp-index',
    primaryOutcomeId: 'outcome-build-suffix-lcp-index',
    rationale: '二つの文字列の全rotationを共通suffix index上の辞書順比較に変換する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc272-g',
    primaryTagId: 'tag-prime-divisor-decomposition',
    primaryOutcomeId: 'outcome-decompose-by-prime-or-divisor',
    rationale:
      '同一余りを作るmodulusは値の差の素因数に限られるため、random sampling後の本質的な候補は素因数分解である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc282-ex',
    primaryTagId: 'tag-divide-enumerate',
    primaryOutcomeId: 'outcome-divide-search-space-recursively',
    rationale: 'minimum pivotでsubarrayを分け、短い側だけを列挙して反対側のprefix境界と照合する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc291-ex',
    primaryTagId: 'tag-tree-balanced-separator',
    primaryOutcomeId: 'outcome-build-balanced-separator-decomposition',
    rationale:
      '各連結成分で最大部分木サイズが半分以下になる重心を選び、除去後の成分へ再帰して重心分解木の親配列を復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc292-f',
    primaryTagId: 'tag-monotone-threshold-search',
    primaryOutcomeId: 'outcome-prove-and-search-threshold',
    rationale: '正三角形の辺長を固定した可置判定の単調性から最大境界を求める。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc297-e',
    primaryTagId: 'tag-ordered-set-heap',
    primaryOutcomeId: 'outcome-maintain-dynamic-order-statistics',
    rationale: '作れる金額の暗黙グラフfrontierから最小候補を順に確定し、K番目までだけ列挙する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc307-ex',
    primaryTagId: 'tag-convolution-fps',
    primaryOutcomeId: 'outcome-encode-counting-by-generating-function',
    rationale: 'wildcard patternと各marquee stateの不一致数を係数列の畳み込みとして一括計算する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc308-e',
    primaryTagId: 'tag-contribution-reordering',
    primaryOutcomeId: 'outcome-reorder-counting-contributions',
    rationale: '各Eを中心に左M・右Xの組を数え、mexの寄与としてlinear scan中に合算する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc311-e',
    primaryTagId: 'tag-dp-state-equivalence',
    primaryOutcomeId: 'outcome-design-minimal-sufficient-state',
    rationale: '各右下端で未来の数え上げに十分な情報を最大正方形の辺長一つに圧縮する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc324-g',
    primaryTagId: 'tag-amortized-heavy-light',
    primaryOutcomeId: 'outcome-bound-total-work',
    rationale: 'sequence splitごとに短い側だけを移し、各elementの移動回数を倍化で対数回に抑える。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc325-e',
    primaryTagId: 'tag-shortest-path',
    primaryOutcomeId: 'outcome-model-and-compute-shortest-path',
    rationale: '乗り換え点を一つ選ぶ問題をcar側とtrain側の二本の最短距離の和に変換する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc332-g',
    primaryTagId: 'tag-flow-matching-cut',
    primaryOutcomeId: 'outcome-reduce-selection-to-network-optimization',
    rationale:
      '巨大な構造化networkをmin-cutへ双対化し、容量をknapsackとpiecewise-linear sweepへ圧縮する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc339-e',
    primaryTagId: 'tag-sequence-subsequence-dp',
    primaryOutcomeId: 'outcome-design-order-preserving-dp',
    rationale: '最後の値だけを状態にし、値差D以下の過去状態からsubsequence長を更新する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc342-e',
    primaryTagId: 'tag-shortest-path',
    primaryOutcomeId: 'outcome-model-and-compute-shortest-path',
    rationale: '時刻逆向の最短路型緩和に変換し、各辺で乗れる最後の離散出発境界を求める。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc343-f',
    primaryTagId: 'tag-monoid-segment-tree',
    primaryOutcomeId: 'outcome-design-associative-range-summary',
    rationale: '最大値・次点値と各頻度だけを保つ結合的な区間要約を設計する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc350-e',
    primaryTagId: 'tag-stochastic-expectation-dp',
    primaryOutcomeId: 'outcome-solve-stochastic-recurrence',
    rationale: '各Nから0への確率遷移と確定操作の期待費用再帰を立て、小さい方を選ぶ。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc357-f',
    primaryTagId: 'tag-lazy-segment-action',
    primaryOutcomeId: 'outcome-design-range-update-action',
    rationale: '二列の区間加算を四成分要約への閉じた作用として設計する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc363-f',
    primaryTagId: 'tag-constructive-witness',
    primaryOutcomeId: 'outcome-recover-valid-witness',
    rationale: '回文乗算式の文法を左右因子の再帰にし、parent選択から具体的な式を復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc391-f',
    primaryTagId: 'tag-ordered-set-heap',
    primaryOutcomeId: 'outcome-maintain-dynamic-order-statistics',
    rationale:
      '三次元の単調gridから最大frontierとその隣接候補だけをheapに保ち、上位K個を列挙する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc394-f',
    primaryTagId: 'tag-tree-aggregation-reroot',
    primaryOutcomeId: 'outcome-aggregate-rooted-tree',
    rationale: '親への接続を予約した部分木状態を子側から合成し、最大tree subgraphを得る。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc439-f',
    primaryTagId: 'tag-contribution-reordering',
    primaryOutcomeId: 'outcome-reorder-counting-contributions',
    rationale: '門松条件を両端の上り・下りと内部の自由選択に分け、端点寄与として再順序化する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc224-g',
    primaryTagId: 'tag-discrete-convex-marginal',
    primaryOutcomeId: 'outcome-exploit-convexity',
    rationale: '期待費用を一変数の下に凸な関数へ圧縮し、実数最小点の近傍整数だけを評価する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc233-f',
    primaryTagId: 'tag-constructive-witness',
    primaryOutcomeId: 'outcome-recover-valid-witness',
    rationale:
      '連結成分のspanning treeを葉から固定し、各駒の移動pathを実際の交換列として復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc238-g',
    primaryTagId: 'tag-prime-divisor-decomposition',
    primaryOutcomeId: 'outcome-decompose-by-prime-or-divisor',
    rationale: '区間積の立方数性を素数ごとの指数 mod 3 に分解し、XOR fingerprintで一括比較する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc257-ex',
    primaryTagId: 'tag-convex-hull-halfplane',
    primaryOutcomeId: 'outcome-restrict-geometric-candidates-to-boundary',
    rationale: 'K個和の候補を線形評価の上側凸境界に限定し、支持方向のevent順に走査する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc277-ex',
    primaryTagId: 'tag-directed-condensation-toposort',
    primaryOutcomeId: 'outcome-condense-and-order-directed-graph',
    rationale:
      '整数変数のthresholdをboolean化し、2-SAT implication graphのSCCで可解性を判定して具体解を復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc281-f',
    primaryTagId: 'tag-divide-enumerate',
    primaryOutcomeId: 'outcome-divide-search-space-recursively',
    rationale: 'XORの最上位bitで候補集合を二分し、支配されるgroupを捨てて小さい側だけを再帰する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc306-f',
    primaryTagId: 'tag-contribution-reordering',
    primaryOutcomeId: 'outcome-reorder-counting-contributions',
    rationale:
      'merged rank sumをset内定数項とset間pair寄与に分け、後続setのprefix頻度として集計する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc312-e',
    primaryTagId: 'tag-geometry-orientation-transform',
    primaryOutcomeId: 'outcome-reduce-geometry-to-algebraic-predicates',
    rationale:
      '小さい整数座標空間をvoxelに離散化し、各occupied cellの六近傍だけを調べて面接触を判定する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc312-f',
    primaryTagId: 'tag-greedy-exchange-order',
    primaryOutcomeId: 'outcome-prove-greedy-order',
    rationale: '開封容量があるときは最大缶、ないときは最大openerを取る交換可能な順序を証明する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc313-f',
    primaryTagId: 'tag-divide-enumerate',
    primaryOutcomeId: 'outcome-split-enumeration-space',
    rationale: '二分したP/Qの小さい側を指数化し、P subset列挙とQ-mask DPを大小で使い分ける。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc320-f',
    primaryTagId: 'tag-knapsack-resource',
    primaryOutcomeId: 'outcome-design-resource-dp',
    rationale:
      '容量付きfuelを往路・復路の二資源軸とし、一度だけ使えるstation選択を同時DPで管理する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc337-f',
    primaryTagId: 'tag-two-pointers-window',
    primaryOutcomeId: 'outcome-maintain-monotone-window',
    rationale:
      '各rotationに対してM個目のchance ballまでの最小windowを尺取りし、収納数を差分更新する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc407-f',
    primaryTagId: 'tag-contribution-reordering',
    primaryOutcomeId: 'outcome-reorder-counting-contributions',
    rationale:
      '各要素がwindow maximumになる数を台形寄与に分解し、window長軸の二階差分に再順序化する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc412-g',
    primaryTagId: 'tag-flow-matching-cut',
    primaryOutcomeId: 'outcome-reduce-selection-to-network-optimization',
    rationale:
      'degree上限とparityをlabel copy間の最小重みperfect matchingに帰着し、辺選択コストとして解く。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc427-e',
    primaryTagId: 'tag-reachability-bfs',
    primaryOutcomeId: 'outcome-select-state-graph-search',
    rationale:
      '一様な風操作後の盤面を初期矩形と累積変位の六変数状態に圧縮し、BFSで最小回数を求める。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc222-g',
    primaryTagId: 'tag-cyclic-group-order',
    primaryOutcomeId: 'outcome-find-period-by-multiplicative-order',
    rationale:
      '反復桁の割り切れを 10 の乗法的位数へ変換し、Euler関数の約数を昇順検査して最小桁数を確定する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc212-g',
    primaryTagId: 'tag-cyclic-group-order',
    primaryOutcomeId: 'outcome-count-through-cyclic-exponents',
    rationale: '原始根の指数へ写し、gcdごとの到達可能数を約数格子上の包除で重複なく集計する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc312-ex',
    primaryTagId: 'tag-symmetry-invariant-normalization',
    primaryOutcomeId: 'outcome-normalize-equivalent-states',
    rationale:
      '反復文字列をZ値で一意なprimitive rootと指数へ正規化し、同じroot内の衝突を倍数候補の償却探索で解く。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc403-f',
    primaryTagId: 'tag-dp-state-equivalence',
    primaryOutcomeId: 'outcome-design-minimal-sufficient-state',
    rationale:
      '値に加えて式・項という構文カテゴリを最小十分状態にし、加算分割と約数遷移から最短式を復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc305-ex',
    primaryTagId: 'tag-discrete-convex-marginal',
    primaryOutcomeId: 'outcome-exploit-convexity',
    rationale:
      '分割数へのpenaltyを入れたAliens DPの値を凸双対として捉え、budgetを満たす最小日数を傾き境界から復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc232-h',
    primaryTagId: 'tag-constructive-witness',
    primaryOutcomeId: 'outcome-recover-valid-witness',
    rationale:
      '対称変換で終点を境界から外す再帰不変条件を保ち、長方形全体を巡るHamilton pathを具体的に復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc394-g',
    primaryTagId: 'tag-dsu-connectivity',
    primaryOutcomeId: 'outcome-maintain-connectivity-components',
    rationale:
      '通行高度thresholdごとに辺を降順追加してendpoint連結性をDSUで共有し、parallel binary searchの全queryを判定する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc218-f',
    primaryTagId: 'tag-witness-impact-localization',
    primaryOutcomeId: 'outcome-localize-change-impact-by-witness',
    additionalPrimaryTagIds: ['tag-shortest-path-certificate'],
    rationale:
      '一本の最短路をcertificateとして復元し、そのwitnessを壊す路上辺だけへ削除後BFSの再計算を局所化する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc280-g',
    primaryTagId: 'tag-inclusion-exclusion',
    primaryOutcomeId: 'outcome-correct-overlap-by-inversion',
    additionalPrimaryTagIds: ['tag-geometry-orientation-transform'],
    rationale:
      'hex距離を三座標のChebyshev距離へ変換し、各subsetを最小座標tupleで一意に分類して、三つの境界面を満たす条件を包除する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc331-f',
    primaryTagId: 'tag-monoid-segment-tree',
    primaryOutcomeId: 'outcome-design-associative-range-summary',
    rationale:
      '順方向・逆方向hashと基数冪を結合的な区間要約にし、1点更新後もsegment treeのmergeで回文判定を保つ。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc349-g',
    primaryTagId: 'tag-palindrome-radius',
    primaryOutcomeId: 'outcome-characterize-palindrome-intervals',
    rationale:
      'Manacher型のmirror再利用で必要な対称pairだけを列挙し、各中心の指定回文半径を等式・不等式制約へ変換する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc308-ex',
    primaryTagId: 'tag-shortest-path-certificate',
    primaryOutcomeId: 'outcome-build-shortest-path-certificate',
    rationale:
      '根ごとのshortest-path treeをcertificateとし、異branch辺と二本のtree pathからminimum rooted cycleを復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc335-g',
    primaryTagId: 'tag-cyclic-group-order',
    primaryOutcomeId: 'outcome-count-through-cyclic-exponents',
    rationale:
      '各要素の乗法的位数を素因数ごとに削減し、冪到達関係を位数の整除へ写して約数latticeのzeta集計で数える。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc453-f',
    primaryTagId: 'tag-constructive-witness',
    primaryOutcomeId: 'outcome-recover-valid-witness',
    rationale:
      '重み付きcentroidを一度だけseparatorとして選び、leaf groupをheap順に彩色して具体構成を復元する。再帰的な重心分解は行わない。',
    decisionAuthorId: 'person-maintainer',
  },
];

export const EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS: Readonly<Record<string, string>> =
  Object.freeze({
    ...CURATED_PRIMARY_TAG_ASSIGNMENTS_212_299,
    ...CURATED_PRIMARY_TAG_ASSIGNMENTS_300_383,
    ...CURATED_PRIMARY_TAG_ASSIGNMENTS_384_466,
  });

export const PREVIEW_FINAL_TAXONOMY_DECISIONS: readonly PreviewFinalDecision[] = [
  {
    previewEntityId: 'provisional-tag-multiplicative-order-counting',
    previewEntityKind: 'tag',
    action: 'split',
    finalEntityIds: [
      'tag-cyclic-group-order',
      'tag-gcd-diophantine',
      'tag-prime-divisor-decomposition',
      'tag-inclusion-exclusion',
    ],
    affectedProblemIds: ['abc212-g', 'abc222-g'],
    representativeProblemIds: ['abc212-g', 'abc222-g', 'abc246-f', 'abc335-g'],
    splitAssignments: [
      {
        finalEntityId: 'tag-cyclic-group-order',
        problemIds: ['abc212-g', 'abc222-g'],
        representativeProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
      },
      {
        finalEntityId: 'tag-gcd-diophantine',
        problemIds: ['abc212-g', 'abc222-g'],
        representativeProblemIds: ['abc212-g', 'abc222-g'],
      },
      {
        finalEntityId: 'tag-prime-divisor-decomposition',
        problemIds: ['abc212-g', 'abc222-g'],
        representativeProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
      },
      {
        finalEntityId: 'tag-inclusion-exclusion',
        problemIds: ['abc212-g'],
        representativeProblemIds: ['abc212-g', 'abc246-f'],
      },
    ],
    aliasesOrRedirects: ['乗法的構造と位数による数え上げ'],
    evidenceOwnerProblemIds: ['abc212-g', 'abc222-g', 'abc246-f', 'abc335-g'],
    rationale:
      '群構造は共通するが、数え上げと最小周期は別outcomeで、補助的なgcd・素因数・包除も独立Tagに保つ。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'outcome-provisional-multiplicative-order-counting',
    previewEntityKind: 'outcome',
    action: 'split',
    finalEntityIds: [
      'outcome-count-through-cyclic-exponents',
      'outcome-find-period-by-multiplicative-order',
    ],
    affectedProblemIds: ['abc212-g', 'abc222-g'],
    representativeProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
    splitAssignments: [
      {
        finalEntityId: 'outcome-count-through-cyclic-exponents',
        problemIds: ['abc212-g'],
        representativeProblemIds: ['abc212-g', 'abc335-g'],
      },
      {
        finalEntityId: 'outcome-find-period-by-multiplicative-order',
        problemIds: ['abc222-g'],
        representativeProblemIds: ['abc222-g', 'abc335-g'],
      },
    ],
    aliasesOrRedirects: ['乗法的構造を指数と位数で説明して数える'],
    evidenceOwnerProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
    rationale: '観察可能な発動能力が「指数による計数」と「乗法的位数による周期決定」で異なる。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-unit-multiplicative-order-counting',
    previewEntityKind: 'unit',
    action: 'split',
    finalEntityIds: ['unit-cyclic-group-exponent-counting', 'unit-multiplicative-order-periods'],
    affectedProblemIds: ['abc212-g', 'abc222-g'],
    representativeProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
    splitAssignments: [
      {
        finalEntityId: 'unit-cyclic-group-exponent-counting',
        problemIds: ['abc212-g'],
        representativeProblemIds: ['abc212-g', 'abc335-g'],
      },
      {
        finalEntityId: 'unit-multiplicative-order-periods',
        problemIds: ['abc222-g'],
        representativeProblemIds: ['abc222-g', 'abc335-g'],
      },
    ],
    aliasesOrRedirects: ['乗法的構造を指数と位数へ写す'],
    evidenceOwnerProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
    rationale: '教材の発動・導出順が異なるため別Unitにする。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-tag-compressed-dp-state',
    previewEntityKind: 'tag',
    action: 'promote',
    finalEntityIds: ['tag-dp-state-equivalence'],
    affectedProblemIds: ['abc215-e', 'abc232-e'],
    representativeProblemIds: ['abc215-e', 'abc232-e'],
    splitAssignments: [],
    aliasesOrRedirects: ['同値性によるDP状態圧縮'],
    evidenceOwnerProblemIds: ['abc215-e', 'abc232-e'],
    rationale: '異なる問題対象を「未来に必要な履歴だけに圧縮する」共通原理へ正規化できる。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'outcome-provisional-compressed-dp-state',
    previewEntityKind: 'outcome',
    action: 'promote',
    finalEntityIds: ['outcome-design-minimal-sufficient-state'],
    affectedProblemIds: ['abc215-e', 'abc232-e'],
    representativeProblemIds: ['abc215-e', 'abc232-e'],
    splitAssignments: [],
    aliasesOrRedirects: ['同値類から未来に十分なDP状態を設計する'],
    evidenceOwnerProblemIds: ['abc215-e', 'abc232-e'],
    rationale: '両問で観察可能な能力は最小十分状態の設計で一致する。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-unit-compressed-dp-state',
    previewEntityKind: 'unit',
    action: 'merge',
    finalEntityIds: ['unit-dp-state-design'],
    affectedProblemIds: ['abc215-e', 'abc232-e'],
    representativeProblemIds: ['abc215-e', 'abc232-e'],
    splitAssignments: [],
    aliasesOrRedirects: ['同値類からDP状態を設計する'],
    evidenceOwnerProblemIds: ['abc215-e', 'abc232-e'],
    rationale: '独立UnitではなくDP状態設計の中核に統合する。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-tag-shortest-path-structure',
    previewEntityKind: 'tag',
    action: 'split',
    finalEntityIds: ['tag-shortest-path-certificate', 'tag-witness-impact-localization'],
    affectedProblemIds: ['abc218-f', 'abc252-e'],
    representativeProblemIds: ['abc218-f', 'abc243-e', 'abc252-e', 'abc308-ex'],
    splitAssignments: [
      {
        finalEntityId: 'tag-witness-impact-localization',
        problemIds: ['abc218-f'],
        representativeProblemIds: ['abc218-f', 'abc243-e'],
      },
      {
        finalEntityId: 'tag-shortest-path-certificate',
        problemIds: ['abc218-f', 'abc252-e'],
        representativeProblemIds: ['abc218-f', 'abc252-e', 'abc308-ex'],
      },
    ],
    aliasesOrRedirects: ['最短路の構造復元と再利用'],
    evidenceOwnerProblemIds: ['abc218-f', 'abc243-e', 'abc252-e', 'abc308-ex'],
    rationale:
      '変更影響をwitnessで局所化する能力と、距離等式からcertificateを構成する能力を分ける。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'outcome-provisional-shortest-path-structure',
    previewEntityKind: 'outcome',
    action: 'split',
    finalEntityIds: [
      'outcome-build-shortest-path-certificate',
      'outcome-localize-change-impact-by-witness',
    ],
    affectedProblemIds: ['abc218-f', 'abc252-e'],
    representativeProblemIds: ['abc218-f', 'abc243-e', 'abc252-e', 'abc308-ex'],
    splitAssignments: [
      {
        finalEntityId: 'outcome-localize-change-impact-by-witness',
        problemIds: ['abc218-f'],
        representativeProblemIds: ['abc218-f', 'abc243-e'],
      },
      {
        finalEntityId: 'outcome-build-shortest-path-certificate',
        problemIds: ['abc252-e'],
        representativeProblemIds: ['abc252-e', 'abc308-ex'],
      },
    ],
    aliasesOrRedirects: ['最短路witnessから構造を復元し変更影響を絞る'],
    evidenceOwnerProblemIds: ['abc218-f', 'abc243-e', 'abc252-e', 'abc308-ex'],
    rationale: '同じ最短路基盤でも到達目標は別能力である。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-unit-shortest-path-structure',
    previewEntityKind: 'unit',
    action: 'merge',
    finalEntityIds: ['unit-shortest-path-certificates'],
    affectedProblemIds: ['abc218-f', 'abc252-e'],
    representativeProblemIds: ['abc218-f', 'abc243-e', 'abc252-e', 'abc308-ex'],
    splitAssignments: [],
    aliasesOrRedirects: ['最短路の構造復元と再利用'],
    evidenceOwnerProblemIds: ['abc218-f', 'abc243-e', 'abc252-e', 'abc308-ex'],
    rationale: '最短路witnessの利用という同一教材セクション内で別outcomeとして扱う。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-tag-range-aggregate-under-updates',
    previewEntityKind: 'tag',
    action: 'promote',
    finalEntityIds: ['tag-query-sufficient-aggregate'],
    affectedProblemIds: ['abc223-f', 'abc256-f'],
    representativeProblemIds: ['abc223-f', 'abc256-f'],
    splitAssignments: [],
    aliasesOrRedirects: ['更新可能な区間集約の設計'],
    evidenceOwnerProblemIds: ['abc223-f', 'abc256-f'],
    rationale: '括弧monoidと重み付きprefix統計を「更新で保てる十分要約」の共通Tagにまとめる。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'outcome-provisional-range-aggregate-under-updates',
    previewEntityKind: 'outcome',
    action: 'promote',
    finalEntityIds: ['outcome-derive-updateable-aggregate'],
    affectedProblemIds: ['abc223-f', 'abc256-f'],
    representativeProblemIds: ['abc223-f', 'abc256-f'],
    splitAssignments: [],
    aliasesOrRedirects: ['更新下で問い合わせに十分な要約を導く'],
    evidenceOwnerProblemIds: ['abc223-f', 'abc256-f'],
    rationale: '共通の観察可能な能力は更新可能な最小十分要約の導出である。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-unit-range-aggregate-under-updates',
    previewEntityKind: 'unit',
    action: 'split',
    finalEntityIds: ['unit-monoid-segment-tree', 'unit-weighted-prefix-fenwick'],
    affectedProblemIds: ['abc223-f', 'abc256-f'],
    representativeProblemIds: ['abc223-f', 'abc256-f'],
    splitAssignments: [
      {
        finalEntityId: 'unit-monoid-segment-tree',
        problemIds: ['abc223-f'],
        representativeProblemIds: ['abc223-f'],
      },
      {
        finalEntityId: 'unit-weighted-prefix-fenwick',
        problemIds: ['abc256-f'],
        representativeProblemIds: ['abc256-f'],
      },
    ],
    aliasesOrRedirects: ['更新可能な区間集約の設計'],
    evidenceOwnerProblemIds: ['abc223-f', 'abc256-f'],
    rationale: '要約の導出は共通でも、monoid合成と重み付きprefix式は導出・実装順が異なる。',
    reviewMode: 'third_party',
  },
];

const compareIds = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;
const sortedUnique = (values: readonly string[]): string[] => [...new Set(values)].sort(compareIds);

export const FINAL_TAXONOMY_CLAIM_DECISIONS: Readonly<Record<string, CuratedProblemClaimDecision>> =
  Object.freeze({
    ...FINAL_TAXONOMY_CLAIM_DECISIONS_212_299,
    ...FINAL_TAXONOMY_CLAIM_DECISIONS_300_383,
    ...FINAL_TAXONOMY_CLAIM_DECISIONS_384_466,
  });

const evidenceReferences = (
  record: ProblemAnalysisInput,
  evidenceIds: readonly string[],
): readonly OwnerQualifiedEvidenceReference[] => {
  const evidenceById = new Map(record.evidence.map((evidence) => [evidence.id, evidence]));
  return sortedUnique(evidenceIds).map((evidenceId) => {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) {
      throw new Error(`FINAL_TAXONOMY_UNKNOWN_EVIDENCE: ${record.problemId}/${evidenceId}`);
    }
    return {
      owner: { kind: 'problem_analysis', problemId: record.problemId },
      evidenceId,
      sourceRevisionIds: sortedUnique(evidence.sourceRevisionIds),
    };
  });
};

const claimReference = (
  record: ProblemAnalysisInput,
  claimPath: string,
  text: string,
  evidenceIds: readonly string[],
): OwnerQualifiedClaimReference => ({
  owner: { kind: 'problem_analysis', problemId: record.problemId },
  claimPath,
  text,
  evidenceRefs: evidenceReferences(record, evidenceIds),
});

const inventoryClaimReference = (
  record: ProblemAnalysisInput,
  claimPath: string,
): OwnerQualifiedClaimReference => {
  const match = /^\/(typicalTechniques|prerequisiteCandidates)\/(0|[1-9]\d*)$/u.exec(claimPath);
  if (!match) {
    throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_PATH_INVALID: ${record.problemId}${claimPath}`);
  }
  const index = Number(match[2]);
  if (match[1] === 'typicalTechniques') {
    const technique = record.typicalTechniques[index];
    if (!technique) {
      throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_PATH_STALE: ${record.problemId}${claimPath}`);
    }
    return claimReference(
      record,
      claimPath,
      `${technique.name}: ${technique.application}`,
      technique.evidenceIds,
    );
  }
  const prerequisite = record.prerequisiteCandidates[index];
  if (!prerequisite) {
    throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_PATH_STALE: ${record.problemId}${claimPath}`);
  }
  return claimReference(record, claimPath, prerequisite.text, prerequisite.evidenceIds);
};

const decisionBasisFor = (
  record: ProblemAnalysisInput,
  primaryClaimPaths: readonly string[],
): readonly OwnerQualifiedClaimReference[] => {
  const observations = record.reasoningPath.observations.map((claim, index) =>
    claimReference(
      record,
      `/reasoningPath/observations/${String(index)}`,
      claim.text,
      claim.evidenceIds,
    ),
  );
  const adoptedApproaches = record.reasoningPath.candidateApproaches.flatMap((candidate, index) =>
    candidate.decision === 'adopted'
      ? [
          claimReference(
            record,
            `/reasoningPath/candidateApproaches/${String(index)}`,
            candidate.approach,
            candidate.evidenceIds,
          ),
        ]
      : [],
  );
  if (adoptedApproaches.length === 0) {
    throw new Error(`FINAL_TAXONOMY_ADOPTED_APPROACH_MISSING: ${record.problemId}`);
  }
  const keyInsights = record.reasoningPath.keyInsights.map((claim, index) =>
    claimReference(
      record,
      `/reasoningPath/keyInsights/${String(index)}`,
      claim.text,
      claim.evidenceIds,
    ),
  );
  const algorithmConnection = claimReference(
    record,
    '/reasoningPath/algorithmConnection',
    record.reasoningPath.algorithmConnection.text,
    record.reasoningPath.algorithmConnection.evidenceIds,
  );
  const outcome = record.outcomeCandidates[0];
  if (!outcome) throw new Error(`FINAL_TAXONOMY_OUTCOME_CLAIM_MISSING: ${record.problemId}`);
  if (primaryClaimPaths.length === 0) {
    throw new Error(`FINAL_TAXONOMY_PRIMARY_CLAIM_MISSING: ${record.problemId}`);
  }
  return [
    ...observations,
    ...adoptedApproaches,
    ...keyInsights,
    algorithmConnection,
    ...primaryClaimPaths.map((claimPath) => inventoryClaimReference(record, claimPath)),
    claimReference(record, '/outcomeCandidates/0', outcome.text, outcome.evidenceIds),
  ];
};

const supportingDecisionBasisFor = (
  record: ProblemAnalysisInput,
  claimDecision: CuratedProblemClaimDecision,
  tagId: string,
): readonly OwnerQualifiedClaimReference[] => {
  const result = claimDecision.dispositions
    .filter(({ kind, tagIds }) => kind === 'supporting' && tagIds.includes(tagId))
    .map(({ claimPath }) => inventoryClaimReference(record, claimPath));
  if (result.length === 0) {
    throw new Error(`FINAL_TAXONOMY_SUPPORT_EVIDENCE_MISSING: ${record.problemId}/${tagId}`);
  }
  return result;
};

const dispositionRationale = (kind: InventoryClaimDispositionKind): string => {
  switch (kind) {
    case 'primary':
      return 'reviewed Inventoryの対象・操作・不変量・目的を照合し、主たる正式Tagへ明示的に結び付けた。';
    case 'supporting':
      return '主解法とは別に実際に用いる再利用可能な技能として、補助Tagと先行Unitへ明示的に結び付けた。';
    case 'same_tag':
      return '主たるTagの同じ学習成果に包含される補足的なclaimとして明示した。';
    case 'baseline':
      return '対象学習者が開始時点で備える共通前提に含まれることを確認した。';
    case 'problem_specific':
      return '全Inventoryとの照合後も独立した正式Tagへ一般化せず、このProblem固有の要素として明示した。';
  }
};

const claimDispositionsFor = (
  record: ProblemAnalysisInput,
  claimDecision: CuratedProblemClaimDecision,
  primaryTagIds: readonly string[],
): readonly InventoryClaimDisposition[] => {
  const expectedPaths = sortedUnique([
    ...record.typicalTechniques.map((_, index) => `/typicalTechniques/${String(index)}`),
    ...record.prerequisiteCandidates.map((_, index) => `/prerequisiteCandidates/${String(index)}`),
  ]);
  const actualPaths = sortedUnique(claimDecision.dispositions.map(({ claimPath }) => claimPath));
  if (
    expectedPaths.length !== actualPaths.length ||
    expectedPaths.some((claimPath, index) => claimPath !== actualPaths[index])
  ) {
    throw new Error(
      `FINAL_TAXONOMY_CURATED_CLAIM_COVERAGE: ${record.problemId}; expected=[${expectedPaths.join(',')}]; actual=[${actualPaths.join(',')}]`,
    );
  }
  const dispositionKeys = claimDecision.dispositions.map(
    ({ claimPath, kind, tagIds }) =>
      `${claimPath}\u0000${kind}\u0000${sortedUnique(tagIds).join('\u0000')}`,
  );
  if (new Set(dispositionKeys).size !== dispositionKeys.length) {
    throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_DUPLICATE: ${record.problemId}`);
  }
  for (const claimPath of actualPaths) {
    const kinds = new Set(
      claimDecision.dispositions
        .filter((disposition) => disposition.claimPath === claimPath)
        .map((disposition) => disposition.kind),
    );
    if (kinds.size > 1 && (kinds.has('baseline') || kinds.has('problem_specific'))) {
      throw new Error(
        `FINAL_TAXONOMY_CURATED_CLAIM_TERMINAL_ROLE_CONFLICT: ${record.problemId}${claimPath}`,
      );
    }
  }
  const primarySet = new Set(primaryTagIds);
  const dispositions = claimDecision.dispositions.map(
    ({ claimPath, kind, tagIds }): InventoryClaimDisposition => {
      const normalizedTagIds = sortedUnique(tagIds);
      if (
        ((kind === 'baseline' || kind === 'problem_specific') && normalizedTagIds.length > 0) ||
        ((kind === 'primary' || kind === 'supporting' || kind === 'same_tag') &&
          normalizedTagIds.length === 0) ||
        ((kind === 'primary' || kind === 'same_tag') &&
          normalizedTagIds.some((tagId) => !primarySet.has(tagId))) ||
        (kind === 'supporting' &&
          normalizedTagIds.some(
            (tagId) => primarySet.has(tagId) || tagById.get(tagId)?.primaryEligible !== true,
          ))
      ) {
        throw new Error(
          `FINAL_TAXONOMY_CURATED_CLAIM_ROLE_INVALID: ${record.problemId}${claimPath}/${kind}/${normalizedTagIds.join(',')}`,
        );
      }
      if (kind === 'primary' && !claimPath.startsWith('/typicalTechniques/')) {
        throw new Error(
          `FINAL_TAXONOMY_PRIMARY_CLAIM_NOT_TECHNIQUE: ${record.problemId}${claimPath}`,
        );
      }
      return {
        claimRef: inventoryClaimReference(record, claimPath),
        kind,
        tagIds: normalizedTagIds,
        rationale: dispositionRationale(kind),
      };
    },
  );
  const primaryDispositionTagIds = new Set(
    dispositions.flatMap(({ kind, tagIds }) => (kind === 'primary' ? tagIds : [])),
  );
  const supportingTagIds = sortedUnique(
    dispositions.flatMap(({ kind, tagIds }) => (kind === 'supporting' ? tagIds : [])),
  );
  if (primaryTagIds.some((tagId) => !primaryDispositionTagIds.has(tagId))) {
    throw new Error(`FINAL_TAXONOMY_PRIMARY_DISPOSITION_MISSING: ${record.problemId}`);
  }
  const outcomeTagIds = Object.keys(claimDecision.supportingOutcomeIdsByTag).sort(compareIds);
  if (
    supportingTagIds.length !== outcomeTagIds.length ||
    supportingTagIds.some((tagId, index) => tagId !== outcomeTagIds[index])
  ) {
    throw new Error(`FINAL_TAXONOMY_SUPPORTING_OUTCOME_COVERAGE: ${record.problemId}`);
  }
  return dispositions;
};

const adHocElementsFor = (record: ProblemAnalysisInput): readonly AdHocElementProjection[] =>
  record.problemSpecificInsights.map((insight, index) => ({
    text: insight.insight,
    reusablePerspective: insight.reusablePerspective,
    claimRef: claimReference(
      record,
      `/problemSpecificInsights/${String(index)}`,
      insight.insight,
      insight.evidenceIds,
    ),
  }));

export const buildFullCorpusPrimaryDecisionTable = (
  records: readonly ProblemAnalysisInput[],
): FullCorpusPrimaryDecisionTable => {
  const policyDiagnostics = validateFinalTaxonomyPolicy();
  if (policyDiagnostics.length > 0) {
    throw new Error(`FINAL_TAXONOMY_POLICY_INVALID: ${policyDiagnostics.join('; ')}`);
  }
  if (records.length !== 868) {
    throw new Error(
      `FINAL_TAXONOMY_CORPUS_COUNT: expected 868, received ${String(records.length)}`,
    );
  }
  const overrideByProblemId = new Map(
    CURATED_PRIMARY_OVERRIDES.map((override) => [override.problemId, override]),
  );
  const explicitTagByProblemId = new Map(Object.entries(EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS));
  const claimDecisionByProblemId = new Map(Object.entries(FINAL_TAXONOMY_CLAIM_DECISIONS));
  if (explicitTagByProblemId.size !== records.length) {
    throw new Error(
      `FINAL_TAXONOMY_EXPLICIT_ASSIGNMENT_COUNT: expected ${String(records.length)}, received ${String(explicitTagByProblemId.size)}`,
    );
  }
  const recordProblemIds = new Set(records.map((record) => record.problemId));
  const missingExplicitAssignments = records
    .filter((record) => !explicitTagByProblemId.has(record.problemId))
    .map((record) => record.problemId)
    .sort(compareIds);
  const unknownExplicitAssignments = [...explicitTagByProblemId.keys()]
    .filter((problemId) => !recordProblemIds.has(problemId))
    .sort(compareIds);
  if (missingExplicitAssignments.length > 0 || unknownExplicitAssignments.length > 0) {
    throw new Error(
      `FINAL_TAXONOMY_EXPLICIT_ASSIGNMENT_COVERAGE: missing=[${missingExplicitAssignments.join(',')}]; unknown=[${unknownExplicitAssignments.join(',')}]`,
    );
  }
  const missingClaimDecisions = records
    .filter((record) => !claimDecisionByProblemId.has(record.problemId))
    .map((record) => record.problemId)
    .sort(compareIds);
  const unknownClaimDecisions = [...claimDecisionByProblemId.keys()]
    .filter((problemId) => !recordProblemIds.has(problemId))
    .sort(compareIds);
  if (missingClaimDecisions.length > 0 || unknownClaimDecisions.length > 0) {
    throw new Error(
      `FINAL_TAXONOMY_CURATED_CLAIM_DECISION_COVERAGE: missing=[${missingClaimDecisions.join(',')}]; unknown=[${unknownClaimDecisions.join(',')}]`,
    );
  }
  const seenProblemIds = new Set<string>();
  const decisions = [...records]
    .sort((left, right) => compareIds(left.problemId, right.problemId))
    .map((record): FinalPrimaryDecision => {
      if (seenProblemIds.has(record.problemId)) {
        throw new Error(`FINAL_TAXONOMY_DUPLICATE_PROBLEM: ${record.problemId}`);
      }
      seenProblemIds.add(record.problemId);
      if (record.reviewStatus !== 'reviewed' || record.reviewFindings.length > 0) {
        throw new Error(`FINAL_TAXONOMY_UNREVIEWED_ANALYSIS: ${record.problemId}`);
      }
      const claimDecision = claimDecisionByProblemId.get(record.problemId);
      if (!claimDecision) {
        throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_DECISION_MISSING: ${record.problemId}`);
      }
      const override = overrideByProblemId.get(record.problemId);
      const explicitPrimaryTagId = explicitTagByProblemId.get(record.problemId);
      const primaryTag = override
        ? tagById.get(override.primaryTagId)
        : explicitPrimaryTagId
          ? tagById.get(explicitPrimaryTagId)
          : undefined;
      if (!primaryTag?.primaryEligible) {
        throw new Error(`FINAL_TAXONOMY_SEMANTIC_ASSIGNMENT_MISSING: ${record.problemId}`);
      }
      const primaryOutcomeId = claimDecision.primaryOutcomeId;
      if (!primaryOutcomeId || !primaryTag.learningOutcomeIds.includes(primaryOutcomeId)) {
        throw new Error(
          `FINAL_TAXONOMY_PRIMARY_OUTCOME_INVALID: ${record.problemId}/${primaryOutcomeId}`,
        );
      }
      if (override && override.primaryOutcomeId !== primaryOutcomeId) {
        throw new Error(
          `FINAL_TAXONOMY_OVERRIDE_OUTCOME_STALE: ${record.problemId}/${override.primaryOutcomeId}/${primaryOutcomeId}`,
        );
      }
      const additionalPrimaryTagIds = override?.additionalPrimaryTagIds ?? [];
      for (const tagId of additionalPrimaryTagIds) {
        if (!tagById.get(tagId)?.primaryEligible) {
          throw new Error(
            `FINAL_TAXONOMY_ADDITIONAL_PRIMARY_TAG_INVALID: ${record.problemId}/${tagId}`,
          );
        }
      }
      const primaryTagIds = sortedUnique([primaryTag.id, ...additionalPrimaryTagIds]);
      const claimDispositions = claimDispositionsFor(record, claimDecision, primaryTagIds);
      const primaryClaimPaths = sortedUnique(
        claimDispositions.flatMap(({ claimRef, kind }) =>
          kind === 'primary' ? [claimRef.claimPath] : [],
        ),
      );
      const decisionBasis = decisionBasisFor(record, primaryClaimPaths);
      const additionalPrimaryOutcomeIds = sortedUnique(claimDecision.additionalPrimaryOutcomeIds);
      if (
        additionalPrimaryOutcomeIds.includes(primaryOutcomeId) ||
        additionalPrimaryOutcomeIds.some((outcomeId) =>
          primaryTagIds.every(
            (tagId) => !tagById.get(tagId)?.learningOutcomeIds.includes(outcomeId),
          ),
        ) ||
        primaryTagIds.some((tagId) => {
          const outcomeIds = tagById.get(tagId)?.learningOutcomeIds ?? [];
          return ![primaryOutcomeId, ...additionalPrimaryOutcomeIds].some((outcomeId) =>
            outcomeIds.includes(outcomeId),
          );
        })
      ) {
        throw new Error(`FINAL_TAXONOMY_ADDITIONAL_PRIMARY_OUTCOME_INVALID: ${record.problemId}`);
      }
      const supportingTagIds = sortedUnique(
        claimDispositions.flatMap(({ kind, tagIds }) => (kind === 'supporting' ? tagIds : [])),
      );
      const supportingTagDecisions = supportingTagIds.map((tagId): SupportingTagDecision => {
        const tag = tagById.get(tagId);
        if (!tag) {
          throw new Error(`FINAL_TAXONOMY_SUPPORTING_TAG_INVALID: ${record.problemId}/${tagId}`);
        }
        const outcomeIds = sortedUnique(claimDecision.supportingOutcomeIdsByTag[tagId] ?? []);
        if (outcomeIds.length === 0) {
          throw new Error(
            `FINAL_TAXONOMY_SUPPORTING_OUTCOME_MISSING: ${record.problemId}/${tagId}`,
          );
        }
        for (const outcomeId of outcomeIds) {
          if (!tag.learningOutcomeIds.includes(outcomeId)) {
            throw new Error(
              `FINAL_TAXONOMY_SUPPORTING_OUTCOME_INVALID: ${record.problemId}/${tagId}/${outcomeId}`,
            );
          }
        }
        return {
          tagId,
          outcomeIds,
          selectionRationale: `reviewed Inventoryの明示claim dispositionに基づき、${tagId} / ${outcomeIds.join(',')} を補助技能として使う。`,
          decisionBasis: supportingDecisionBasisFor(record, claimDecision, tagId),
        };
      });
      const supportingOutcomeIds = sortedUnique(
        supportingTagDecisions.flatMap((decision) => decision.outcomeIds),
      ).filter(
        (outcomeId) =>
          outcomeId !== primaryOutcomeId && !additionalPrimaryOutcomeIds.includes(outcomeId),
      );
      const assignedOutcomeIds = sortedUnique([
        primaryOutcomeId,
        ...additionalPrimaryOutcomeIds,
        ...supportingOutcomeIds,
      ]);
      const learningUnitCandidateIds = sortedUnique([
        ...assignedOutcomeIds.flatMap(
          (outcomeId) => outcomeById.get(outcomeId)?.learningUnitCandidateIds ?? [],
        ),
      ]);
      if (learningUnitCandidateIds.length === 0) {
        throw new Error(`FINAL_TAXONOMY_LEARNING_UNIT_MISSING: ${record.problemId}`);
      }
      return {
        problemId: record.problemId,
        primaryOutcomeId,
        primaryTagIds,
        additionalPrimaryOutcomeIds,
        supportingTagIds,
        supportingOutcomeIds,
        supportingTagDecisions,
        learningUnitCandidateIds,
        presentationUnitId: latestLearningUnitId(learningUnitCandidateIds),
        decisionKind: override ? 'curated_semantic_override' : 'explicit_inventory_assignment',
        ambiguityStatus: override ? 'curated_override' : 'proposed_assignment',
        selectionRationale: override
          ? override.rationale
          : `Inventoryの採用方針「${record.reasoningPath.candidateApproaches.find((candidate) => candidate.decision === 'adopted')?.approach ?? ''}」、解法への接続「${record.reasoningPath.algorithmConnection.text}」、学習成果「${record.outcomeCandidates[0]?.text ?? ''}」を照合し、${primaryTag.id} / ${primaryOutcomeId} をproposal上のprimary配置とした。第三者acceptance前の明示assignmentである。`,
        decisionAuthorId: override?.decisionAuthorId ?? record.authorId,
        acceptanceStatus: 'proposed',
        decisionBasis,
        claimDispositions,
        adHocElements: adHocElementsFor(record),
        sourceRevisionIds: sortedUnique(record.sourceRevisionIds),
      };
    });
  const unappliedOverrides = CURATED_PRIMARY_OVERRIDES.filter(
    (override) => !seenProblemIds.has(override.problemId),
  );
  if (unappliedOverrides.length > 0) {
    throw new Error(
      `FINAL_TAXONOMY_OVERRIDE_TARGET_MISSING: ${unappliedOverrides.map((override) => override.problemId).join(',')}`,
    );
  }
  const unappliedExplicitAssignments = [...explicitTagByProblemId.keys()].filter(
    (problemId) => !seenProblemIds.has(problemId),
  );
  if (unappliedExplicitAssignments.length > 0) {
    throw new Error(
      `FINAL_TAXONOMY_EXPLICIT_ASSIGNMENT_TARGET_MISSING: ${unappliedExplicitAssignments.join(',')}`,
    );
  }
  return {
    schemaVersion: '1.0.0',
    policyVersion: '1.0.0',
    problemCount: decisions.length,
    decisions,
  };
};

const unitById = new Map(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [unit.id, unit]));
const unitAndAncestors = (unitId: string): readonly string[] => {
  const result = [unitId];
  let current = unitById.get(unitId)?.parentId ?? null;
  while (current !== null) {
    result.push(current);
    current = unitById.get(current)?.parentId ?? null;
  }
  return result;
};

export const materializeLearningUnitCandidates = (
  decisions: readonly FinalPrimaryDecision[],
): readonly MetadataLearningUnitCandidate[] => {
  const problemsByUnitId = new Map<string, string[]>();
  for (const decision of decisions) {
    for (const directUnitId of decision.learningUnitCandidateIds) {
      for (const unitId of unitAndAncestors(directUnitId)) {
        const problemIds = problemsByUnitId.get(unitId) ?? [];
        problemIds.push(decision.problemId);
        problemsByUnitId.set(unitId, problemIds);
      }
    }
  }
  return FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => ({
    ...unit,
    problemIds: sortedUnique(problemsByUnitId.get(unit.id) ?? []),
  }));
};

export const validateFinalTaxonomyPolicy = (): readonly string[] => {
  const diagnostics: string[] = [];
  const duplicateIds = (ids: readonly string[]): readonly string[] =>
    ids.filter((id, index) => ids.indexOf(id) !== index);
  if (PREVIEW_FINAL_TAXONOMY_DECISIONS.length !== 12) {
    diagnostics.push(`PREVIEW_DECISION_COUNT:${String(PREVIEW_FINAL_TAXONOMY_DECISIONS.length)}`);
  }
  for (const id of duplicateIds(FINAL_TAXONOMY_TAGS.map((tag) => tag.id)))
    diagnostics.push(`DUPLICATE_TAG:${id}`);
  for (const id of duplicateIds(FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id)))
    diagnostics.push(`DUPLICATE_OUTCOME:${id}`);
  for (const id of duplicateIds(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => unit.id)))
    diagnostics.push(`DUPLICATE_UNIT:${id}`);
  const knownTagIds = new Set(FINAL_TAXONOMY_TAGS.map((tag) => tag.id));
  const knownOutcomeIds = new Set(FINAL_TAXONOMY_OUTCOMES.map((outcome) => outcome.id));
  const knownUnitIds = new Set(FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => unit.id));
  for (const unitId of Object.keys(UNIT_ORDER_REASONS)) {
    if (!knownUnitIds.has(unitId)) diagnostics.push(`UNKNOWN_UNIT_ORDER_REASON:${unitId}`);
  }
  for (const unitId of Object.keys(UNIT_EXCLUDED_TOPICS)) {
    if (!knownUnitIds.has(unitId)) diagnostics.push(`UNKNOWN_UNIT_EXCLUDED_TOPICS:${unitId}`);
  }
  for (const outcomeId of Object.keys(OUTCOME_PREREQUISITE_IDS)) {
    if (!knownOutcomeIds.has(outcomeId)) {
      diagnostics.push(`UNKNOWN_OUTCOME_PREREQUISITE_OWNER:${outcomeId}`);
    }
  }
  for (const outcomeId of Object.keys(OUTCOME_LEARNING_UNIT_IDS)) {
    if (!knownOutcomeIds.has(outcomeId))
      diagnostics.push(`UNKNOWN_OUTCOME_UNIT_OWNER:${outcomeId}`);
  }
  for (const tag of FINAL_TAXONOMY_TAGS) {
    if (tag.aliases.length === 0) diagnostics.push(`TAG_ALIASES_MISSING:${tag.id}`);
    if (tag.representativeProblemIds.length < 2) {
      diagnostics.push(`TAG_REPRESENTATIVES_INSUFFICIENT:${tag.id}`);
    }
    if (tag.parentId !== null && !knownTagIds.has(tag.parentId))
      diagnostics.push(`UNKNOWN_PARENT:${tag.id}/${tag.parentId}`);
    for (const prerequisiteId of tag.prerequisiteTagIds) {
      if (!knownTagIds.has(prerequisiteId))
        diagnostics.push(`UNKNOWN_TAG_PREREQUISITE:${tag.id}/${prerequisiteId}`);
    }
    for (const outcomeId of tag.learningOutcomeIds) {
      if (!knownOutcomeIds.has(outcomeId))
        diagnostics.push(`UNKNOWN_TAG_OUTCOME:${tag.id}/${outcomeId}`);
    }
    for (const unitId of tag.learningUnitCandidateIds) {
      if (!knownUnitIds.has(unitId)) diagnostics.push(`UNKNOWN_TAG_UNIT:${tag.id}/${unitId}`);
    }
    for (const pattern of [
      ...tag.strictRecallTerms,
      ...tag.semanticSignature.objectPatterns,
      ...tag.semanticSignature.triggerPatterns,
      ...tag.semanticSignature.invariantPatterns,
      ...tag.semanticSignature.goalPatterns,
      ...tag.semanticSignature.excludedPatterns,
    ]) {
      try {
        new RegExp(pattern, 'iu');
      } catch {
        diagnostics.push(`INVALID_PATTERN:${tag.id}/${pattern}`);
      }
    }
  }
  for (const outcomeId of Object.keys(OUTCOME_STATEMENTS)) {
    if (!knownOutcomeIds.has(outcomeId)) diagnostics.push(`UNUSED_OUTCOME_STATEMENT:${outcomeId}`);
  }
  for (const outcome of FINAL_TAXONOMY_OUTCOMES) {
    if (!outcome.statement.trim()) diagnostics.push(`OUTCOME_STATEMENT_MISSING:${outcome.id}`);
    if (outcome.scopeTagIds.length === 0) diagnostics.push(`OUTCOME_SCOPE_MISSING:${outcome.id}`);
    if (outcome.learningUnitCandidateIds.length === 0)
      diagnostics.push(`OUTCOME_UNIT_MISSING:${outcome.id}`);
    for (const prerequisiteId of outcome.prerequisiteOutcomeIds) {
      if (!knownOutcomeIds.has(prerequisiteId))
        diagnostics.push(`UNKNOWN_OUTCOME_PREREQUISITE:${outcome.id}/${prerequisiteId}`);
    }
    for (const unitId of outcome.learningUnitCandidateIds) {
      if (!knownUnitIds.has(unitId))
        diagnostics.push(`UNKNOWN_OUTCOME_UNIT:${outcome.id}/${unitId}`);
    }
  }
  for (const unit of FINAL_LEARNING_UNIT_CANDIDATES) {
    if (!unit.orderReason.trim()) diagnostics.push(`UNIT_ORDER_REASON_MISSING:${unit.id}`);
    if (/(?:unit|tag|outcome)-/u.test(unit.orderReason)) {
      diagnostics.push(`UNIT_ORDER_REASON_INTERNAL_ID:${unit.id}`);
    }
    if (unit.kind !== 'chapter' && unit.excludedTopics.length === 0) {
      diagnostics.push(`UNIT_EXCLUDED_TOPICS_MISSING:${unit.id}`);
    }
    if (
      unit.excludedTopics.some((topic) =>
        topic.includes('このsectionの観察可能なOutcomeを発動しない'),
      )
    ) {
      diagnostics.push(`UNIT_EXCLUDED_TOPICS_GENERIC:${unit.id}`);
    }
    if (unit.parentId !== null && !knownUnitIds.has(unit.parentId)) {
      diagnostics.push(`UNKNOWN_UNIT_PARENT:${unit.id}/${unit.parentId}`);
    }
  }
  for (const [orderReason, count] of new Map(
    FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [
      unit.orderReason,
      FINAL_LEARNING_UNIT_CANDIDATES.filter(
        (candidate) => candidate.orderReason === unit.orderReason,
      ).length,
    ]),
  )) {
    if (count > 1) diagnostics.push(`UNIT_ORDER_REASON_REUSED:${orderReason}`);
  }
  try {
    deterministicTopologicalOrder(
      FINAL_TAXONOMY_TAGS.map((tag) => ({ id: tag.id, prerequisiteIds: tag.prerequisiteTagIds })),
    );
    deterministicTopologicalOrder(
      FINAL_TAXONOMY_OUTCOMES.map((outcome) => ({
        id: outcome.id,
        prerequisiteIds: outcome.prerequisiteOutcomeIds,
      })),
    );
    deterministicTopologicalOrder(
      FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => ({
        id: unit.id,
        prerequisiteIds: unit.additionalPrerequisiteUnitIds,
      })),
    );
  } catch (error) {
    diagnostics.push(`DEPENDENCY_DAG:${error instanceof Error ? error.message : String(error)}`);
  }
  const forbiddenGenericPrimaryIds = [
    'tag-model-reduction',
    'tag-dp-state-transition',
    'tag-graph-model-structure',
    'tag-query-sufficient-aggregate',
    'tag-string-state-representation',
    'tag-math-geometry-transformation',
  ];
  for (const tagId of forbiddenGenericPrimaryIds) {
    if (tagById.get(tagId)?.primaryEligible) diagnostics.push(`GENERIC_PRIMARY_ENABLED:${tagId}`);
  }
  if (
    new Set(CURATED_PRIMARY_OVERRIDES.map(({ problemId }) => problemId)).size !==
    CURATED_PRIMARY_OVERRIDES.length
  ) {
    diagnostics.push('CURATED_PRIMARY_OVERRIDE_DUPLICATE');
  }
  for (const override of CURATED_PRIMARY_OVERRIDES) {
    const tag = tagById.get(override.primaryTagId);
    if (!tag?.learningOutcomeIds.includes(override.primaryOutcomeId)) {
      diagnostics.push(`OVERRIDE_TARGET_INVALID:${override.problemId}`);
    }
  }
  for (const [problemId, tagId] of Object.entries(EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS)) {
    if (tagById.get(tagId)?.primaryEligible !== true) {
      diagnostics.push(`EXPLICIT_ASSIGNMENT_TAG_INVALID:${problemId}/${tagId}`);
    }
  }
  if (
    Object.keys(FINAL_TAXONOMY_CLAIM_DECISIONS).length !==
    Object.keys(EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS).length
  ) {
    diagnostics.push(
      `CURATED_CLAIM_DECISION_COUNT:${String(Object.keys(FINAL_TAXONOMY_CLAIM_DECISIONS).length)}`,
    );
  }
  const overrideByProblemId = new Map(
    CURATED_PRIMARY_OVERRIDES.map((override) => [override.problemId, override]),
  );
  for (const [problemId, claimDecision] of Object.entries(FINAL_TAXONOMY_CLAIM_DECISIONS)) {
    const override = overrideByProblemId.get(problemId);
    const primaryTagId =
      override?.primaryTagId ?? EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS[problemId];
    const primaryTag = primaryTagId === undefined ? undefined : tagById.get(primaryTagId);
    if (!primaryTag?.learningOutcomeIds.includes(claimDecision.primaryOutcomeId)) {
      diagnostics.push(
        `CURATED_CLAIM_PRIMARY_OUTCOME_INVALID:${problemId}/${claimDecision.primaryOutcomeId}`,
      );
    }
    const primaryTagIds = [primaryTagId, ...(override?.additionalPrimaryTagIds ?? [])].filter(
      (tagId): tagId is string => tagId !== undefined,
    );
    const primaryOutcomeIds = [
      claimDecision.primaryOutcomeId,
      ...claimDecision.additionalPrimaryOutcomeIds,
    ];
    if (
      new Set(primaryOutcomeIds).size !== primaryOutcomeIds.length ||
      claimDecision.additionalPrimaryOutcomeIds.some((outcomeId) =>
        primaryTagIds.every((tagId) => !tagById.get(tagId)?.learningOutcomeIds.includes(outcomeId)),
      ) ||
      primaryTagIds.some((tagId) =>
        primaryOutcomeIds.every(
          (outcomeId) => !tagById.get(tagId)?.learningOutcomeIds.includes(outcomeId),
        ),
      )
    ) {
      diagnostics.push(`CURATED_CLAIM_ADDITIONAL_PRIMARY_OUTCOME_INVALID:${problemId}`);
    }
    for (const [tagId, outcomeIds] of Object.entries(claimDecision.supportingOutcomeIdsByTag)) {
      const supportingTag = tagById.get(tagId);
      if (
        supportingTag?.primaryEligible !== true ||
        outcomeIds.length === 0 ||
        outcomeIds.some((outcomeId) => !supportingTag.learningOutcomeIds.includes(outcomeId))
      ) {
        diagnostics.push(`CURATED_CLAIM_SUPPORTING_OUTCOME_INVALID:${problemId}/${tagId}`);
      }
    }
  }
  for (const decision of PREVIEW_FINAL_TAXONOMY_DECISIONS) {
    if (decision.aliasesOrRedirects.length === 0) {
      diagnostics.push(`PREVIEW_LEGACY_ALIAS_MISSING:${decision.previewEntityId}`);
    }
    for (const targetId of decision.finalEntityIds) {
      const known =
        decision.previewEntityKind === 'tag'
          ? knownTagIds.has(targetId)
          : decision.previewEntityKind === 'outcome'
            ? knownOutcomeIds.has(targetId)
            : knownUnitIds.has(targetId);
      if (!known)
        diagnostics.push(`PREVIEW_TARGET_UNKNOWN:${decision.previewEntityId}/${targetId}`);
    }
  }
  return sortedUnique(diagnostics);
};
