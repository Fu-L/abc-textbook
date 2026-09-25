import { deterministicTopologicalOrder } from '../validation/validate.js';
import {
  FINAL_TAG_DIRECTED_RELATION_SEEDS,
  FINAL_TAG_FORMER_NAMES,
  FINAL_TAG_LEARNER_ALIASES,
  FINAL_TAG_REPRESENTATIVE_PROBLEM_IDS,
  FINAL_TAG_SYMMETRIC_RELATION_SEEDS,
  type FinalTagRelationType,
} from './final-taxonomy-content.js';
import { FINAL_TAXONOMY_BASELINE_CLAIM_REGISTRY } from './final-taxonomy-baseline.js';
import { FINAL_TAXONOMY_CLAIM_DECISIONS_212_299 } from './final-taxonomy-claims-212-299.js';
import { FINAL_TAXONOMY_CLAIM_DECISIONS_300_383 } from './final-taxonomy-claims-300-383.js';
import { FINAL_TAXONOMY_CLAIM_DECISIONS_384_466 } from './final-taxonomy-claims-384-466.js';
import { FINAL_MULTI_PRIMARY_CLAIM_OUTCOME_BINDINGS } from './final-taxonomy-claim-outcome-bindings.js';
import { CURATED_PRIMARY_TAG_ASSIGNMENTS_212_299 } from './final-taxonomy-decisions-212-299.js';
import { CURATED_PRIMARY_TAG_ASSIGNMENTS_300_383 } from './final-taxonomy-decisions-300-383.js';
import { CURATED_PRIMARY_TAG_ASSIGNMENTS_384_466 } from './final-taxonomy-decisions-384-466.js';

const compareIds = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

export type TaxonomyIntegrationAction = 'promote' | 'merge' | 'split' | 'retire';
export type TaxonomyEntityKind = 'tag' | 'outcome' | 'unit';

/** Semantic rules used when turning reviewed Inventory claims into textbook placements. */
export const FINAL_TAXONOMY_PLACEMENT_PRINCIPLES = Object.freeze({
  outcome:
    'Outcomeは問題の解法を横断して分類する原子的技能のmetadataとし、発動条件・正当化・実装が異なる技能を「または」で束ねない。',
  tag: 'Tagは未知問を見たときのrecognition・retrieval単位とし、発動条件・正当化原理・実装templateのいずれかが大きく異なるなら分割する。',
  learningUnit:
    'LearningUnitはmental modelとtransferを作る教材上の圧縮単位とし、比較学習が有効なsibling Tagだけを同じsectionのsubsectionとして束ねる。',
  primary:
    '主解法の成立と計算量を決め、読者が解後に再利用可能な形で説明・実装できる技能だけをprimaryにする。',
  supporting:
    '主解法とは別の観察可能な技能を実際に発動するときだけsupportingとし、用語が説明に現れるだけではUnitを付与しない。',
  homeAndReadiness:
    'Problemの唯一のhomeはprimary Outcomeのowner Unitとする。additional primaryは追加で学ぶ技能、supportingは解法の再構成・実装に必要な既習技能として別々に保持し、どちらもhome placementを変えない。Problem固有のsupportingを理由にUnit prerequisiteを追加しない。',
  prerequisite:
    'curriculum prerequisiteは論理的な最小依存ではなく、先に学ぶことで後続Unitの説明・実装・考察が自然になり、重複を避けて段階的に到達できるときの教材上のprecedence constraintとする。その技能自体の習得に必要な前提だけを課し、特定Problemのreadinessを修正するためにTag・Outcome全体の前提を強めない。問題固有の複合前提はrequired Outcome集合で表し、単なる併用・類似・対比はtyped relationへ分離する。',
  relatedTags:
    'Tag間のcontrast・analogy・specialization・extension・reduction・often_combined・implementation_substrateはcurriculum prerequisiteと独立に保持し、未知問で再利用すべき思考が区別できる具体的理由を付ける。specializationは変形なしに成り立つ狭い一種、extensionは新しい目的・制約・操作・interfaceを加える拡張、reductionはsourceからtargetへの意味保存変換に限る。該当関係がないTagは空配列のままとする。',
  naming:
    '固有算法名をalias・recallに置くのは、その算法の適用条件と正当性を説明できるOutcomeとUnitが現corpusにある場合だけとする。',
  fallback:
    '対象読者の共通前提はbaseline、独立した再利用技能にならない問題固有の工夫はproblem_specificにする。単一Problemの解法を入力語だけ言い換えた抽象化は、別の未知問で使える発動条件・不変量・実装templateを独立に示せない限りTag・Outcome・Unitへ昇格させない。',
  boundaries:
    '候補数を直接界す独立工程の列挙、二集合を照合するmeet-in-the-middle、可逆写像の反復到達時刻を平方根分割するBaby-Step Giant-Stepを区別し、部分集合・約数・DP遷移などの専用primary技能だけで列挙を説明し切れる場合はgenericなbounded列挙を重ねない。座標圧縮とevent sweepと単純scan、数値上限のtight・started・剰余・digit maskを持つ桁DPと有限automaton上のDPと整除鎖・加算式のcarryだけを下位桁から渡すDP、概念上のLCAと実装するancestor・Euler・HLD・virtual tree、存在判定だけの解法と親・選択記録から具体解を復元する構成法を区別する。',
});

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
  readonly implementationConcerns: readonly ProblemAnalysisClaimInput[];
  readonly outcomeCandidates: readonly ProblemAnalysisClaimInput[];
  readonly authorId: string;
  readonly reviewStatus: 'draft' | 'reviewed' | 'changes_requested';
  readonly reviewFindings: readonly string[];
}

/** Internal RegExp sources for machine recognition; never learner-facing prose by themselves. */
export interface SemanticSignaturePolicy {
  readonly objectPatterns: readonly string[];
  readonly triggerPatterns: readonly string[];
  readonly invariantPatterns: readonly string[];
  readonly goalPatterns: readonly string[];
  readonly excludedPatterns: readonly string[];
  readonly minimumDimensions: 1 | 2 | 3 | 4;
  readonly requireObjectForStrictRecall: boolean;
}

export interface FinalTaxonomyTagRelationPolicy {
  readonly tagId: string;
  readonly type: FinalTagRelationType;
  readonly rationale: string;
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
  /** Direct reusable-skill prerequisites for this Tag; display order is managed separately. */
  readonly prerequisiteTagIds: readonly string[];
  readonly relatedTags: readonly FinalTaxonomyTagRelationPolicy[];
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
  readonly tagIds: readonly string[];
  readonly ownedTagIds: readonly string[];
  readonly learningOutcomeIds: readonly string[];
  readonly ownedLearningOutcomeIds: readonly string[];
  readonly problemIds: readonly string[];
  readonly learningRationale: string;
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

export interface ReadinessPrimaryOverride {
  readonly primaryOutcomeId: string;
  readonly rationale: string;
  readonly decisionAuthorId: string;
}

/** Legacy metadata only; every problem now preserves its semantic primary. */
export const READINESS_PRIMARY_OVERRIDES: Readonly<Record<string, ReadinessPrimaryOverride>> = {};

export interface FinalPrimaryDecision {
  readonly problemId: string;
  readonly primaryOutcomeId: string;
  readonly primaryTagIds: readonly string[];
  readonly additionalPrimaryOutcomeIds: readonly string[];
  readonly supportingTagIds: readonly string[];
  readonly supportingOutcomeIds: readonly string[];
  readonly supportingTagDecisions: readonly SupportingTagDecision[];
  readonly primaryOverride?: ReadinessPrimaryOverride;
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
  readonly learningRationale: string;
  readonly excludedTopics: readonly string[];
}

const UNIT_EXCLUDED_TOPICS: Readonly<Record<string, readonly string[]>> = {
  'unit-monotone-search': [
    '連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。',
  ],
  'unit-two-pointers-window': ['値域上の真偽境界を探す二分探索・パラメトリックサーチ。'],
  'unit-event-sweep': [
    '更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。',
  ],
  'unit-reverse-offline': [
    '値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。',
  ],
  'unit-contribution-reordering': [
    'active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。',
  ],
  'unit-coordinate-compression': [
    '値・時刻順にactive集合を増減するevent sweep、および固定配列・行列を入力順のまま読むだけのscan。',
  ],
  'unit-normalization': ['交換論による貪欲順の証明。'],
  'unit-greedy-exchange': ['対称操作による状態の正規化。'],
  'unit-bounded-enumeration': [
    '探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。',
  ],
  'unit-divide-enumeration': [
    '候補数を制約・生成パラメータ・有限caseで直接界して全列挙する探索、軽重分類による償却解析、および入力木・trie・区間DPの構造をそのまま辿るだけの再帰。',
  ],
  'unit-decomposition-amortization': [
    '探索空間を分けて候補を列挙・照合するmeet-in-the-middleや分割統治。',
  ],
  'unit-change-impact-localization': [
    '存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。',
  ],
  'unit-randomized-algorithms': [
    '誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。',
  ],
  'unit-interactive-protocol': [
    '入力を最初からすべて読める通常問題、および問い合わせ上限やflushを持たない模擬入出力。',
  ],
  'unit-dp-state-design': ['状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。'],
  'unit-dp-grid-table': [
    '一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。',
  ],
  'unit-dp-subset-resource': ['使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。'],
  'unit-dp-sequence-interval': ['bitmask集合や容量だけを状態にし、列順・区間分割を持たないDP。'],
  'unit-dp-digit-string': [
    '整除鎖・加算式のcarryだけを下位桁から渡すDP、および接頭辞状態を使わない一般の表DP。',
  ],
  'unit-dp-carry-mixed-radix': [
    '数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。',
  ],
  'unit-dp-stochastic': ['二人零和ゲームの勝敗・Grundy数。'],
  'unit-dp-game': ['有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。'],
  'unit-dp-game-value': ['勝敗だけを分類する通常の後退解析・Grundy数。'],
  'unit-dp-transition-optimization': ['固定線形遷移の巨大回累乗。'],
  'unit-linear-recurrence': ['一般のDP遷移の区間集約・単調最適化。'],
  'unit-graph-search': [
    '非負重み付き距離の緩和・確定と最短路certificateの復元。',
    'eventをsortしてactive集合を増減するsweep line。',
  ],
  'unit-shortest-path-certificates': [
    '辺重みや最短距離を扱わず、到達可否だけを求める探索、および最短路に限らない一般の変更影響解析。',
  ],
  'unit-connectivity': ['距離・訪問順を求める探索、および有向グラフの強連結成分と順序。'],
  'unit-bipartite-structure': [
    '重み付き最短路、一般の彩色問題、および容量付きmatching・min-cutの最適化。',
  ],
  'unit-spanning-tree-optimization': [
    '任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。',
  ],
  'unit-directed-condensation': ['無向辺追加だけを扱うDSU連結成分管理。'],
  'unit-functional-graph': ['各頂点から複数の後続を選べる一般のグラフ探索・強連結成分への縮約。'],
  'unit-tree-metric': ['根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。'],
  'unit-tree-aggregation': [
    'heap番号で暗黙に表された完全二分木の区間算術、木上パスの連続区間分解、重心による再帰分解、および更新のためのTop Tree cluster化。',
  ],
  'unit-implicit-binary-tree': [
    '子を明示した一般木の木DP・rerooting、およびLCA・Euler順・HLD・virtual treeを実装するpath query。完全二分木でも個々の頂点を列挙する処理。',
  ],
  'unit-static-top-tree': [
    '更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。',
  ],
  'unit-flow-matching': ['Eulerウォークの次数・偶奇条件。'],
  'unit-euler-degree': ['容量付きフロー・マッチング・最小カットへの帰着。'],
  'unit-tree-decomposition': [
    'LCAという概念で対象を一意分類するだけで、ancestor query・Euler区間化・HLD・virtual treeを実装利用しない数え上げ、および重心による再帰分解。',
  ],
  'unit-tree-balanced-separators': ['LCA・HLDによる固定木上パスの区間分解。'],
  'unit-cycle-space-basis': [
    'ord/lowを用いた橋・関節点の検出、および偶数次数辺集合のcycle-space構造を使わない単なるcycle検出。',
  ],
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
  'unit-bitset-word-parallel': [
    '集合状態そのものを一つずつ遷移するbitmask DP、および単一整数のbit演算だけで完結する処理。',
  ],
  'unit-cartesian-tree': [
    '最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。',
  ],
  'unit-binary-trie': ['文字列の共有接頭辞を索引化するTrie、および集合bitmaskの部分集合DP。'],
  'unit-trie-prefix': ['failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。'],
  'unit-string-prefix-automata': [
    '接尾辞・LCPの索引、文字列hash、回文半径。KMPのfailure linkによる逐次照合も本Unitの対象に含めない。',
  ],
  'unit-string-automata': [
    '数値上限・桁・繰り上がりを状態にする桁DP、および接頭辞一致長だけを求めるKMP・Z法。',
  ],
  'unit-suffix-automaton': [
    '接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。',
  ],
  'unit-suffix-lcp-index': ['rolling hashによる一致比較と回文半径。'],
  'unit-string-hash': ['全接尾辞の辞書順索引と回文半径。'],
  'unit-palindrome-radius': ['一般の部分文字列hash比較と、接尾辞・LCPの索引。'],
  'unit-recursive-compressed-string': ['明示された文字列への接尾辞索引の構築。'],
  'unit-modular-arithmetic': [
    '法 m で剰余 0 となる因子数と可逆な非零剰余因子の積を分けて因子差し替えを処理する動的積、複数の合同条件を統合する一次合同・CRT、および剰余列の最小周期を求める問題。',
  ],
  'unit-dynamic-modular-product': [
    '因子が変化しない一回限りの積、和やmin/maxの更新、任意区間積を求めるSegment Tree、および合成数法で非零の非可逆因子も差し替える一般の場合。',
  ],
  'unit-modular-product-foundations': [
    '一次合同・CRT、剰余列の周期、乗法的位数、および法をまたいだ合同条件の統合。',
  ],
  'unit-modular-congruence': [
    '可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。',
  ],
  'unit-modular-periodicity': [
    '逆元・一次合同・CRTによる合同条件の統合、および巡回群の位数を使う計数。',
  ],
  'unit-gcd-diophantine': [
    '差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。',
  ],
  'unit-gcd-structure': [
    'Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。',
  ],
  'unit-numerical-semigroup-reachability': [
    '負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。',
  ],
  'unit-rational-approximation': [
    'Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。',
  ],
  'unit-stern-brocot-ancestry': [
    '分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。',
  ],
  'unit-prime-divisor': ['床関数や整数根の値が一定となる区間への分割。'],
  'unit-integer-boundary-blocks': ['素因数指数による整数条件の分解。'],
  'unit-cyclic-group-exponent-counting': ['乗法的位数から最小周期だけを求める問題。'],
  'unit-multiplicative-order-periods': ['約数格子上の指数計数・包除。'],
  'unit-combinatorial-coefficients': ['重なりを交互加減する包除・Möbius反転。'],
  'unit-inclusion-exclusion': ['選択順を二項係数だけで式化する数え上げ。'],
  'unit-polynomial-convolution': [
    '組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。',
  ],
  'unit-generating-functions': [
    '係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。',
  ],
  'unit-formal-power-series': [
    '積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。',
  ],
  'unit-linear-algebra-xor': [
    '行列式による全域木・非交差pathの計数は行列式計数の単元で扱う。通常の多項式畳み込み・生成関数と、幾何の面積行列式も対象外とする。',
  ],
  'unit-matroid-theory': [
    '線形方程式一般、graph matching一般、および交換公理を用いない単なる貪欲選択。',
  ],
  'unit-finite-field-extension': [
    '素数法上の通常の四則演算だけで閉じる計算、および環上で逆元の存在を仮定できない演算。',
  ],
  'unit-geometry-primitives': ['凸包の境界候補列挙・半平面交差。'],
  'unit-convex-geometry': [
    '直線群の最小値・最大値queryはConvex Hull Trick・直線包絡で扱う。凸性を使わない一般のevent sweepや座標圧縮も対象外とする。',
  ],
  'unit-discrete-convex': ['真偽値の単調境界探索と、交換論だけで決まる貪欲順。'],
  'unit-constructive-witness': ['存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。'],
};

const excludedTopicsFor = (
  id: string,
  kind: MetadataLearningUnitCandidate['kind'],
): readonly string[] => (kind === 'chapter' ? [] : (UNIT_EXCLUDED_TOPICS[id] ?? []));

const chapter = (id: string, title: string): LearningUnitSeed => ({
  id,
  kind: 'chapter',
  title,
  parentId: null,
  prerequisiteIds: [],
  learningRationale: '',
  excludedTopics: excludedTopicsFor(id, 'chapter'),
});

const section = (
  id: string,
  title: string,
  parentId: string,
  prerequisiteIds: readonly string[],
): LearningUnitSeed => ({
  id,
  kind: 'section',
  title,
  parentId,
  prerequisiteIds,
  learningRationale: '',
  excludedTopics: excludedTopicsFor(id, 'section'),
});

const subsection = (
  id: string,
  title: string,
  parentId: string,
  prerequisiteIds: readonly string[],
): LearningUnitSeed => ({
  id,
  kind: 'subsection',
  title,
  parentId,
  prerequisiteIds,
  learningRationale: '',
  excludedTopics: excludedTopicsFor(id, 'subsection'),
});

const LEGACY_LEARNING_UNIT_SEEDS: readonly LearningUnitSeed[] = [
  chapter('unit-chapter-modeling', 'モデル変換とアルゴリズム設計'),
  chapter('unit-chapter-dynamic-programming', '動的計画法'),
  chapter('unit-chapter-graph', 'グラフ・木構造'),
  chapter('unit-chapter-query', 'データ構造と問い合わせ'),
  chapter('unit-chapter-string', '文字列アルゴリズム'),
  chapter('unit-chapter-math-geometry', '数学・数え上げ・幾何'),
  section('unit-monotone-search', '単調境界を証明して探索する', 'unit-chapter-modeling', []),
  section(
    'unit-two-pointers-window',
    '尺取り法・sliding windowで連続区間を走査する',
    'unit-chapter-modeling',
    [],
  ),
  section('unit-event-sweep', 'event順にactive集合を更新する', 'unit-chapter-modeling', []),
  section('unit-reverse-offline', '時間を逆向きにして未来依存を消す', 'unit-chapter-modeling', []),
  section(
    'unit-contribution-reordering',
    '局所寄与へ分解して集計順を交換する',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-coordinate-compression',
    '疎なkeyの順序を保ってdense indexへ圧縮する',
    'unit-chapter-modeling',
    [],
  ),
  section('unit-normalization', '同値な状態を正規化する', 'unit-chapter-modeling', []),
  section('unit-greedy-exchange', '交換論から選択順を導く', 'unit-chapter-modeling', []),
  section(
    'unit-bounded-enumeration',
    '候補数を界して全列挙・有限case分解する',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-divide-enumeration',
    '探索空間を分けて照合・再帰分割する',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-decomposition-amortization',
    '軽重分類と償却解析で総仕事量を抑える',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-change-impact-localization',
    '基準witnessから変更影響を局所化する',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-randomized-algorithms',
    '乱択の成功条件と誤り確率を設計する',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-interactive-protocol',
    '対話protocolを守って情報を取得する',
    'unit-chapter-modeling',
    [],
  ),
  section(
    'unit-dp-state-design',
    '最小十分状態からDPを設計する',
    'unit-chapter-dynamic-programming',
    [],
  ),
  section(
    'unit-dp-grid-table',
    'グリッド・多次元表の局所DPを設計する',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
  ),
  section('unit-dp-subset-resource', '資源・容量DP', 'unit-chapter-dynamic-programming', [
    'unit-dp-state-design',
  ]),
  section(
    'unit-dp-sequence-interval',
    '列・区間・分割のDP',
    'unit-chapter-dynamic-programming',
    [],
  ),
  section(
    'unit-dp-digit-string',
    '接頭辞から更新する有限状態DP',
    'unit-chapter-dynamic-programming',
    [],
  ),
  section(
    'unit-dp-carry-mixed-radix',
    '繰り上がり・借り・混合基数を状態にするDP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
  ),
  section('unit-dp-stochastic', '確率過程・期待値DP', 'unit-chapter-dynamic-programming', [
    'unit-dp-state-design',
  ]),
  section('unit-dp-game', 'ゲーム状態の勝敗とGrundy数', 'unit-chapter-dynamic-programming', [
    'unit-dp-state-design',
  ]),
  section(
    'unit-dp-game-value',
    'minimax・得点差・局面値を評価するゲームDP',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
  ),
  section(
    'unit-dp-transition-optimization',
    'DP遷移を因数分解・集約して加速する',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
  ),
  section(
    'unit-linear-recurrence',
    '固定線形遷移を巨大回数進める',
    'unit-chapter-dynamic-programming',
    ['unit-dp-state-design'],
  ),
  section('unit-graph-search', '状態グラフ探索・到達関係', 'unit-chapter-graph', []),
  section(
    'unit-shortest-path-certificates',
    '重み付き最短路・経路復元・差分制約',
    'unit-chapter-graph',
    [],
  ),
  section('unit-connectivity', '連結成分を管理し縮約する', 'unit-chapter-graph', []),
  section('unit-bipartite-structure', '二部彩色と成分構造を扱う', 'unit-chapter-graph', []),
  section(
    'unit-spanning-tree-optimization',
    'cut・cycle性質から最適全域木を構成する',
    'unit-chapter-graph',
    ['unit-greedy-exchange'],
  ),
  section(
    'unit-directed-condensation',
    'SCCで閉路・DAG順・2-SATを処理する',
    'unit-chapter-graph',
    [],
  ),
  section('unit-functional-graph', '一意な後続・サイクル・ダブリング', 'unit-chapter-graph', []),
  section('unit-tree-metric', '木距離を基準点・直径・中心から捉える', 'unit-chapter-graph', []),
  section('unit-tree-aggregation', '木DP・集約・rerooting', 'unit-chapter-graph', []),
  section(
    'unit-implicit-binary-tree',
    '対称性・深さ・label区間で巨大な完全二分木を数える',
    'unit-chapter-graph',
    [],
  ),
  section('unit-static-top-tree', 'rake・compressで動的木DPを保つ', 'unit-chapter-graph', []),
  section('unit-tree-decomposition', '包含木の構築とancestor・path分解', 'unit-chapter-graph', []),
  section(
    'unit-tree-balanced-separators',
    '木の均衡分離点から重心分解へ進む',
    'unit-chapter-graph',
    [],
  ),
  section('unit-flow-matching', 'フロー・マッチング・カットへ帰着する', 'unit-chapter-graph', []),
  section(
    'unit-euler-degree',
    '次数parityからwalkや選択辺集合を判定・構成する',
    'unit-chapter-graph',
    [],
  ),
  section(
    'unit-lowlink-critical-structure',
    'lowlinkで橋・関節点を特定する',
    'unit-chapter-graph',
    [],
  ),
  section(
    'unit-graph-core-peeling',
    '閉路数・次数構造からgraph coreとkernelを調べる',
    'unit-chapter-graph',
    [],
  ),
  section(
    'unit-prefix-aggregate',
    '一次元・二次元累積和と差分で区間情報を線形化する',
    'unit-chapter-query',
    [],
  ),
  section('unit-monoid-segment-tree', '結合的要約と列・区間の合成', 'unit-chapter-query', []),
  section(
    'unit-weighted-prefix-fenwick',
    '反転数・重み付き接頭辞統計をFenwick Treeで保つ',
    'unit-chapter-query',
    ['unit-prefix-aggregate'],
  ),
  section('unit-range-actions', '区間更新を要約へ作用させる', 'unit-chapter-query', []),
  section(
    'unit-persistence-rollback',
    '構造を共有して過去の版を保存・復元する',
    'unit-chapter-query',
    [],
  ),
  section(
    'unit-linked-list-index',
    '要素索引と連結リストで局所linkを更新する',
    'unit-chapter-query',
    [],
  ),
  section(
    'unit-ordered-set-heap',
    'heap・ordered setで全候補の極値を保つ',
    'unit-chapter-query',
    [],
  ),
  section(
    'unit-monotone-stack-queue',
    '支配関係から不要な候補を単調stack・queueで削る',
    'unit-chapter-query',
    [],
  ),
  section(
    'unit-mo-offline-range',
    'Moの順序で区間問い合わせの差分を更新する',
    'unit-chapter-query',
    [],
  ),
  section(
    'unit-bitset-word-parallel',
    'bitsetで集合演算をword並列化する',
    'unit-chapter-query',
    [],
  ),
  section('unit-cartesian-tree', '大小関係をCartesian treeへ変換する', 'unit-chapter-query', [
    'unit-monotone-stack-queue',
  ]),
  section('unit-binary-trie', 'bit列をTrieで索引化する', 'unit-chapter-query', []),
  section('unit-trie-prefix', 'Trieで共有接頭辞を索引化する', 'unit-chapter-string', []),
  section('unit-string-prefix-automata', '接頭辞との一致長を再利用する', 'unit-chapter-string', []),
  section(
    'unit-string-automata',
    '禁止・要求patternを有限状態へ圧縮する',
    'unit-chapter-string',
    [],
  ),
  section(
    'unit-suffix-automaton',
    'Suffix Automatonで部分文字列集合を表す',
    'unit-chapter-string',
    [],
  ),
  section('unit-suffix-lcp-index', '接尾辞の順序とLCPを索引化する', 'unit-chapter-string', []),
  section(
    'unit-string-hash',
    'Rolling fingerprintで列の同値性を比較する',
    'unit-chapter-query',
    [],
  ),
  section('unit-palindrome-radius', '回文半径と左右対称区間を特定する', 'unit-chapter-string', []),
  section(
    'unit-recursive-compressed-string',
    '圧縮・反復・再帰文字列へ問い合わせる',
    'unit-chapter-string',
    [],
  ),
  section(
    'unit-modular-arithmetic',
    '法上の四則演算・高速累乗・逆元',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-modular-congruence',
    '一次合同・CRTで解の類を統合する',
    'unit-chapter-math-geometry',
    ['unit-gcd-diophantine', 'unit-modular-arithmetic'],
  ),
  section(
    'unit-modular-periodicity',
    '剰余周期と指数法則を利用する',
    'unit-chapter-math-geometry',
    [],
  ),
  section('unit-gcd-diophantine', 'gcdと整数解の成立条件', 'unit-chapter-math-geometry', []),
  section(
    'unit-numerical-semigroup-reachability',
    '数値半群のconductor以後を一括到達とみなす',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-rational-approximation',
    '連分数・Stern–Brocotで有理近似する',
    'unit-chapter-math-geometry',
    [],
  ),
  section('unit-prime-divisor', '素因数分解と約数構造', 'unit-chapter-math-geometry', []),
  section(
    'unit-integer-boundary-blocks',
    '整数境界と同値区間を正確に分ける',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-cyclic-group-exponent-counting',
    '巡回群を指数化して数える',
    'unit-chapter-math-geometry',
    ['unit-multiplicative-order-periods'],
  ),
  section(
    'unit-multiplicative-order-periods',
    '乗法的位数から最小周期を求める',
    'unit-chapter-math-geometry',
    ['unit-modular-arithmetic', 'unit-prime-divisor'],
  ),
  section(
    'unit-combinatorial-coefficients',
    '組合せ係数と対称性で数える',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-inclusion-exclusion',
    '包除・Möbius反転で重複を補正する',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-polynomial-convolution',
    'NTT・FFTで畳み込みと相互相関を求める',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-generating-functions',
    '組合せを生成関数へ符号化する',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-formal-power-series',
    'FPS演算・多点評価・合成を行う',
    'unit-chapter-math-geometry',
    ['unit-generating-functions'],
  ),
  section(
    'unit-linear-algebra-xor',
    '線形方程式・基底・分離可能変換へ変換する',
    'unit-chapter-math-geometry',
    [],
  ),
  section(
    'unit-finite-field-extension',
    '拡大有限体の表現と四則演算を構成する',
    'unit-chapter-math-geometry',
    ['unit-modular-arithmetic'],
  ),
  section('unit-geometry-primitives', '幾何の基本判定と座標変換', 'unit-chapter-math-geometry', []),
  section('unit-convex-geometry', '凸境界・半平面制約を扱う', 'unit-chapter-math-geometry', []),
  section(
    'unit-discrete-convex',
    '凸性・傾き・限界費用・slope trick',
    'unit-chapter-math-geometry',
    [],
  ),
  section('unit-constructive-witness', '成立証明から構成解を復元する', 'unit-chapter-modeling', []),
];

const UNIT_LEARNING_RATIONALES: Readonly<Record<string, string>> = {
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
  'unit-event-sweep':
    '値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。',
  'unit-reverse-offline':
    '削除・上書き・未来依存を含む更新列を逆向きに読み、追加だけ・first-writeだけなどの単調な処理へ変換して元の時刻へ答えを戻す。',
  'unit-contribution-reordering':
    '数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。',
  'unit-coordinate-compression':
    '保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。',
  'unit-normalization':
    '対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。',
  'unit-greedy-exchange': '局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。',
  'unit-bounded-enumeration':
    '候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。',
  'unit-divide-enumeration':
    '探索空間を独立な二集合または再帰部分へ分けるか、部分結果をbalancedな積木・remainder tree・CDQで合成し、重複なく扱える入力規模を広げる。',
  'unit-decomposition-amortization':
    '各操作ではなく操作列全体の変化回数を数え、軽重分類や一度限りの移動で総計算量を抑える。',
  'unit-change-impact-localization':
    '変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。',
  'unit-randomized-algorithms':
    '乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。',
  'unit-interactive-protocol':
    '問い合わせ形式・回数上限・応答依存性・flushを明示し、通常のアルゴリズムをjudgeとの対話列として安全に実行する。',
  'unit-constructive-witness':
    '存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。',
  'unit-dp-state-design':
    '初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。',
  'unit-dp-grid-table':
    '状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。',
  'unit-dp-subset-resource':
    '最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。',
  'unit-eventual-unbounded-knapsack':
    '通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。',
  'unit-dp-sequence-interval':
    '状態設計を土台に、列の選択、LISの支配関係、prefix分割、独立な区間の合成、訪問済み区間の拡張を別の依存構造として比較する。',
  'unit-dp-digit-string':
    '状態設計を土台に、接頭辞から決まる有限統計を更新するという共通像を作り、数値上限の桁DPと有限automaton DPの境界を比較する。',
  'unit-digit-dp':
    '接頭辞状態DPの共通像を得た後、数値上限とのtight・started・剰余・digit maskだけを状態にして、上限以下の整数を数える。',
  'unit-automaton-dp':
    '有限pattern automatonの完全遷移を構成できるようになった後、位置・長さとの直積状態で受理列を数え、桁上限がある場合だけ桁DPと組み合わせる。',
  'unit-dp-carry-mixed-radix':
    '状態設計を土台に、整除鎖の丸めや複数項の加算で次の桁へ渡すcarryだけを有限状態として保つ。',
  'unit-polynomial-taylor-shift':
    '畳み込みと二項係数の階乗表示を理解した後、二項展開の添字を反転して P(x+a) の全係数を一回の畳み込みへ落とす。多点評価や一般FPS合成とは目的を区別する。',
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
    '既知のDFS・BFS実装を土台に、長距離効果は探索前の方向別scanで静的な通行条件へ変換し、問題の状態を頂点、合法操作を辺として設計して到達関係を求める。',
  'unit-directional-grid-effect-scan':
    '各行・各列を固定方向に一度ずつscanし、定数方向へ伸びる効果をblockerまで一括伝播する。効果を止める属性と、その後の処理で禁止する属性を分離する。',
  'unit-shortest-path-certificates':
    '辺重みに応じた距離計算、距離等式による経路復元、差の不等式を緩和へ写す制約系への応用を順に学ぶ。',
  'unit-weighted-shortest-path':
    '基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。',
  'unit-shortest-path-reconstruction':
    '最短距離を計算できるようになった後、距離等式を満たす親辺を記録して最短路木・実現経路を復元する。',
  'unit-difference-constraints':
    '最短路の緩和と負閉路を理解した後、差の不等式を辺へ写して制約系の可解性・極値・具体解を同じ不変条件で求める。',
  'unit-connectivity':
    '連結成分を探索できるようになった後、成分縮約、差分辺のpotential累積、辺追加に対する付加情報つきDSU管理を学ぶ。',
  'unit-graph-potential-propagation':
    '通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。',
  'unit-kruskal-threshold-sweep':
    'DSUによる成分管理とMSTのcut・cycle性質を学んだ後、辺重み順のprefixが閾値部分graphと一致する不変条件からminimax連結時刻をquery・集計へ使う。',
  'unit-parallel-binary-search':
    '単一queryの単調境界を二分探索できるようになった後、多数queryのmidをroundごとに束ね、一方向更新できる判定器を共有する。',
  'unit-bipartite-structure':
    '無向グラフを探索できることを前提に、辺をまたぐたび色を反転し、矛盾検出と成分ごとの二部サイズ集約を行う。',
  'unit-spanning-tree-optimization':
    '貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。',
  'unit-directed-condensation':
    '到達可能性を理解した後、相互到達する頂点を強連結成分へまとめ、DAG順の伝播またはimplication graphの矛盾判定へ使う。',
  'unit-functional-graph':
    '状態グラフを理解した後、後続が一意という制約からcycleと流入木への分解やダブリングを導く。',
  'unit-tree-metric':
    '木を探索して基準点からの距離を求められることを前提に、一意経路から得る距離labelと、直径端点・中心が距離構造を代表する性質を学ぶ。',
  'unit-tree-aggregation':
    '探索で親子関係を作りDP状態を定義できた後、子側の集約と親側への差し替えで木全体の値を求める。',
  'unit-implicit-binary-tree':
    '指数個の頂点を持つ完全二分木を展開せず、深さごとの対称性と2冪で集約するか、heap番号の祖先移動と深さ別子孫label区間で数える。',
  'unit-static-top-tree':
    '木DPの合成則を理解した後、境界頂点つきclusterをrake・compressし、局所変更を根まで再合成する。',
  'unit-tree-decomposition':
    '基本的な木DFSを土台に、laminar区間をstackで包含木へ変換し、binary liftingでancestor・LCAを問い合わせ、Euler in/outで部分木を区間化し、HLDでpathをheavy path列へ分け、対象頂点と必要なLCAだけをvirtual treeへ縮約する。',
  'unit-laminar-interval-containment-tree':
    '非交差区間族を括弧列として走査し、stack topを直接包含親にして包含関係を木へ変換する。その後の包含差分queryをLCAや木上距離へ接続する。',
  'unit-tree-balanced-separators':
    '部分木重みから一点の均衡分離点を選ぶ基本を学び、頂点数重みで再帰利用すると各成分が半減して深さを抑えられることを示す。',
  'unit-flow-matching':
    '頂点と辺のモデルを作れることを前提に、選択制約を容量・カット・マッチングへ翻訳する。',
  'unit-euler-degree':
    'グラフを探索できることを前提に、全辺walkの成立性や選択辺集合の端点条件を次数parityで特徴付け、葉から判定・構成する。',
  'unit-cycle-space-basis':
    '無向graphを探索してspanning forestを構築できることを土台に、偶数次数辺集合をF_2上のcycle spaceとして捉え、fundamental cycle basisとdim C(G)=M-N+C（Cは連結成分数）を導き、path族への単射へ接続する。',
  'unit-lowlink-critical-structure':
    'DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。',
  'unit-graph-core-peeling':
    '連結成分のcycle rankを辺数と頂点数から読み、必要なら低次数頂点を反復削除してcycle coreや小さなkernelを露出させる。',
  'unit-prefix-aggregate':
    '一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。',
  'unit-monoid-segment-tree':
    '結合則を持つ要約という共通像から、Segment Tree・Sparse Table・SWAG・有限関数合成が使う分解方法の違いを比較する。',
  'unit-weighted-prefix-fenwick':
    '静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。',
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
  'unit-bitset-word-parallel':
    '集合の交差・和・shiftを機械語word単位で同時処理し、要素ごとの走査をword幅だけ短縮する。',
  'unit-cartesian-tree':
    '単調stackの支配関係を親子関係へ持ち上げ、配列の区間極値を部分木境界として分割処理へ使う。',
  'unit-binary-trie':
    '整数を上位bitから分岐する列として格納し、XOR・大小・最小距離の候補を貪欲に選ぶ。',
  'unit-trie-prefix':
    '文字ごとの遷移を配列やmapで持ち、複数文字列の共有接頭辞を木として索引化する。',
  'unit-string-prefix-automata':
    '各位置から接頭辞との一致長を求める。既に得られた一致区間の情報を再利用し、Z algorithmで全位置を線形時間に処理する。',
  'unit-string-automata':
    '未来の禁止・要求pattern到達や複数pattern一致だけを決める進行段階・接尾辞状態を作り、遷移表上のDP・行列計算へ接続する。',
  'unit-suffix-automaton':
    '有限状態で文字列を読む視点を土台に、endpos同値類・suffix link・cloneで全部分文字列を線形状態数に圧縮する。',
  'unit-suffix-lcp-index':
    '全接尾辞の辞書順と隣接LCPを索引化し、部分文字列の出現範囲・順位・個数へ答える。',
  'unit-string-hash':
    '列の順序と長さを保つrolling fingerprintを作り、連結・部分列の切り出し・回文比較へ使う。集合や代数式の乱択fingerprintは乱択アルゴリズムの単元で扱う。',
  'unit-palindrome-radius': '各中心の左右一致を半径としてまとめ、回文区間の判定と列挙へ利用する。',
  'unit-recursive-compressed-string':
    '明示展開できない文字列をblock長と再帰構造で表し、位置を構成要素へ降ろして照会する。',
  'unit-gcd-diophantine':
    '最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。',
  'unit-numerical-semigroup-reachability':
    '生成元をgcdで正規化し、非負整数結合の到達集合がconductor以後の全整数を含むことを示して巨大距離を有限prefixへ縮約する。',
  'unit-rational-approximation':
    'Euclid互除法の商列を連分数・Stern–Brocot区間として読み替え、分母制約下の最良近似を求める。',
  'unit-modular-arithmetic':
    '剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。',
  'unit-dynamic-modular-product':
    '通常の法上演算と逆元の存在条件を前提に、取り得る因子のうち法 m で非零となるものがすべて可逆（典型的には素数法）かを確認する。剰余 0 だけは逆元を持たないため、その個数と可逆な非零剰余因子の積へ状態を分けて因子差し替えを定数時間で処理する。',
  'unit-modular-product-foundations':
    '法上の基本演算を先に確立し、そのうえで「積から旧因子を逆元で外す」操作に必要な可逆性と、法 m で剰余 0 となる因子では逆元が存在しない境界を独立した動的保守技能として学ぶ。',
  'unit-modular-congruence':
    '法上の演算とBézout等式を使えることを前提に、一次合同の可解性を判定して複数条件をCRTで統合する。',
  'unit-modular-periodicity':
    '剰余列や冪が有限状態で周期化することを示し、周期前計算や指数法則で巨大な反復を短縮する。',
  'unit-prime-divisor':
    '初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。',
  'unit-integer-boundary-blocks':
    'floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。',
  'unit-cyclic-group-exponent-counting':
    '乗法的位数とその約数分類を先に学び、巡回群の元を指数へ写して位数別に重複なく数える。個別問題で必要な約数Möbius反転はsupporting readinessとして接続する。',
  'unit-multiplicative-order-periods':
    '合同算術と約数分解を使えることを前提に、最小周期を乗法的位数へ帰着して約数から絞る。',
  'unit-combinatorial-coefficients':
    '選び方の重複を二項係数で整理し、対称操作で同一視する対象は固定点平均でorbitを数える。',
  'unit-inclusion-exclusion':
    '単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。',
  'unit-polynomial-convolution':
    '係数積和を多項式積へ写し、NTT・FFTで畳み込みや反転した列との相互相関を高速に求める。',
  'unit-generating-functions':
    '高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。',
  'unit-baby-step-giant-step':
    '有限集合上の可逆な作用と逆作用を定義し、離散対数やaffine反復を含む反復到達時刻をbaby/giantの衝突へ変換して平方根時間で求める。合同算術が必要な問題では個別のreadinessとして接続する。',
  'unit-min-weight-general-perfect-matching':
    '二部matchingでは表せないpairing模型を作った後、奇cycleを扱うweighted blossomまたは重み付きTutte多項式で最小重みまで求める。',
  'unit-path-matching-contraction':
    'path matchingの交互構造を使い、最小edgeの採用後も残りの全cardinality最適値を保存する補正縮約を導いてheapと双方向linkで実装する。',
  'unit-matroid-greedy':
    'Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。',
  'unit-linear-matroid-intersection':
    'matroidの独立性・交換公理、線形方程式のrank計算、乱択誤り評価を学んだ後、二つの線形matroidの共通独立rankを一枚の乱択行列へ圧縮する。',
  'unit-formal-power-series':
    '生成関数の係数解釈と高速畳み込みを再利用し、Newton法による逆数・log・expと多点評価・合成を次数制限付きで実装する。',
  'unit-linear-algebra-xor':
    '制約を線形方程式へ写して解空間とrankを調べ、XORの生成可能性を基底で表す。多次元の線形変換は軸別に分離して計算する。行列式による数え上げは別の単元で扱う。',
  'unit-matroid-theory':
    '独立集合族と交換公理を共通言語にし、単一matroidの重み付き基底と、現corpusで観測された二つの線形matroidの共通rank判定を分けて学ぶ。',
  'unit-finite-field-extension':
    '素体上の演算を土台に、既約関係で元を標準化し、加減乗除が閉じる拡大体として扱う。',
  'unit-geometry-primitives':
    '座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。',
  'unit-convex-geometry':
    '向きと交差を判定できた後、点集合を凸包へ絞る方法と、半平面の共通部分として実行可能領域を表す方法を学ぶ。直線群の最小値・最大値queryは直線包絡の単元で扱う。',
  'unit-discrete-convex':
    '目的関数の凸・凹性と傾き変化を捉え、breakpointや限界費用から最適点を求める。',
  'unit-separable-convex-marginals':
    '離散凸・凹の差分が単調になることを確認し、複数の限界値列から必要な上位・下位K項だけをheap mergeまたは閾値計数で選ぶ。',
};

/** Marks prose-like mathematical notation as literal text inside RegExp-source fields. */
const escapeRegexLiteral = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

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
  /** Content kept beside newly refined seeds; legacy content remains in the reviewed registry. */
  readonly aliases?: readonly string[];
  readonly formerNames?: readonly string[];
  readonly representativeProblemIds?: readonly string[];
}

const finalTagRelationsById = (): Readonly<
  Record<string, readonly FinalTaxonomyTagRelationPolicy[]>
> => {
  const relations = new Map<string, FinalTaxonomyTagRelationPolicy[]>();
  const append = (sourceTagId: string, relation: FinalTaxonomyTagRelationPolicy): void => {
    const current = relations.get(sourceTagId) ?? [];
    current.push(relation);
    relations.set(sourceTagId, current);
  };
  for (const seed of FINAL_TAG_SYMMETRIC_RELATION_SEEDS) {
    append(seed.sourceTagId, {
      tagId: seed.targetTagId,
      type: seed.type,
      rationale: seed.rationale,
    });
    append(seed.targetTagId, {
      tagId: seed.sourceTagId,
      type: seed.type,
      rationale: seed.rationale,
    });
  }
  for (const seed of FINAL_TAG_DIRECTED_RELATION_SEEDS) {
    append(seed.sourceTagId, {
      tagId: seed.targetTagId,
      type: seed.type,
      rationale: seed.rationale,
    });
  }
  return Object.fromEntries(
    [...relations.entries()].map(([tagId, tagRelations]) => [
      tagId,
      [...tagRelations].sort(
        (left, right) =>
          (left.tagId < right.tagId ? -1 : left.tagId > right.tagId ? 1 : 0) ||
          (left.type < right.type ? -1 : left.type > right.type ? 1 : 0),
      ),
    ]),
  );
};

const FINAL_TAG_RELATIONS_BY_ID = finalTagRelationsById();

const defineTag = (seed: TagSeed): FinalTaxonomyTagPolicy => ({
  id: seed.id,
  name: seed.name,
  definition: seed.definition,
  aliases: seed.aliases ?? FINAL_TAG_LEARNER_ALIASES[seed.id] ?? [seed.name],
  formerNames: seed.formerNames ?? FINAL_TAG_FORMER_NAMES[seed.id] ?? [],
  representativeProblemIds:
    seed.representativeProblemIds ?? FINAL_TAG_REPRESENTATIVE_PROBLEM_IDS[seed.id] ?? [],
  parentId: seed.parentId,
  prerequisiteTagIds: seed.prerequisiteTagIds ?? [],
  relatedTags: FINAL_TAG_RELATIONS_BY_ID[seed.id] ?? [],
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
    id: 'tag-event-sweep',
    name: 'event・値順のオフライン走査',
    definition:
      '値・時刻・座標順にeventを並べ、同値eventの処理順を定めてactive集合や集約を増分更新する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-linearize-events'],
    unitIds: ['unit-event-sweep'],
    recall: [
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
    object: ['event', '区間', '時刻', '値', 'threshold'],
    trigger: ['sort', 'ソート', 'sweep', 'activate', 'deactivate'],
    invariant: ['active', '同値eventの順序', '処理済み境界'],
    goal: ['全体', '面積', '同時', '区間'],
    exclude: ['座標圧縮だけ', 'sort.?uniqueだけ', '固定.*方向.*scanだけ', '単純scanだけ'],
    priority: 72,
  },
  {
    id: 'tag-coordinate-compression',
    name: '座標・値の順序保存圧縮',
    definition:
      '疎な初期値・将来更新値・event座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写す。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-compress-sparse-keys'],
    unitIds: ['unit-coordinate-compression'],
    recall: ['座標圧縮', '値圧縮', 'coordinate compression', 'rank compression', 'sort.?unique'],
    object: ['座標', '値', 'key', '更新値', '疎な状態'],
    trigger: ['sort', 'unique', '大小関係だけ', '将来のqueryを先読み'],
    invariant: ['順序を保つ', '等値性を保つ', 'dense index', '有限候補'],
    goal: ['配列添字化', 'Fenwick Tree', 'Segment Tree', '有限状態化'],
    exclude: ['固定.*方向.*scanだけ', '単純scanだけ', 'linear scan only'],
    priority: 73,
  },
  {
    id: 'tag-reverse-offline',
    name: '逆向きのオフライン処理',
    definition:
      '時間依存を逆走査・逆操作・last-write時刻で単調または静的な処理へ変換し、元の時点の答えを復元する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-reverse-update-time'],
    unitIds: ['unit-reverse-offline'],
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
      '数える対象を要素・組・値・区間ごとに一意に固定し、その対象を含む選択の個数や指示変数の期待値を先に集計する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-reorder-counting-contributions'],
    unitIds: ['unit-contribution-reordering'],
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
    object: ['合計', '組', '対', '要素', '値', '区間', '指示変数'],
    trigger: ['寄与', '数え上げ順序', '二重和', '対象を固定', '期待値の線形性'],
    invariant: ['一意', '重複', '何回数え', '含まれる回数', '係数'],
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
    id: 'tag-bounded-enumeration',
    name: '有界全列挙・有限case分解',
    definition:
      '制約や生成パラメータから候補総数を界すか、鳩ノ巣原理で成功前の失敗回数を界して探索する。',
    parentId: 'tag-model-reduction',
    outcomeIds: [
      'outcome-enumerate-bounded-candidates-or-cases',
      'outcome-enumerate-subsets-by-mask',
    ],
    unitIds: ['unit-bounded-enumeration'],
    recall: [
      '生成全探索',
      '全組合せ',
      '固定size.*列挙',
      'bounded exhaustive search',
      'brute force',
      '有限.*case',
      '定数個.*場合分け',
    ],
    object: ['候補', '組合せ', '生成パラメータ', '配置', 'case'],
    trigger: ['候補数', '高々', '固定個', '全て試す', '場合分け'],
    invariant: ['漏れなく', '重複なく', '候補総数の上界'],
    goal: ['最適値', '存在判定', '構成', '全caseの評価'],
    exclude: ['meet.?in.?the.?middle', '半分.*列挙', 'divide.?and.?conquer', '分割統治'],
    priority: 67,
  },
  {
    id: 'tag-divide-enumerate',
    name: '分割列挙・分割統治',
    definition:
      '探索空間を独立に列挙できる集合へ分けて照合するか、pivot・bit・短い側で再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで合成する。',
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
      'product tree',
      'subproduct',
      'remainder tree',
      '積木',
      '\\bcdq\\b',
      'balanced.*merge',
    ],
    object: [
      '部分集合',
      '候補',
      '探索空間',
      '選択',
      'path',
      '経路',
      'xor',
      '多項式',
      'event',
      'target',
    ],
    trigger: [
      '半分',
      '列挙',
      '組合せを分',
      'anti-diagonal',
      '中央.*分',
      '再帰分割',
      'balanced',
      'product tree',
    ],
    invariant: ['合成', '独立', '照合', '重複なく', 'balanced'],
    goal: ['存在判定', '個数', '最適値', '一括評価', '高速合成'],
    exclude: [
      '固定size.*全列挙',
      '生成パラメータ.*全探索',
      '有限.*case',
      '入力木.*そのまま.*再帰',
      'trie.*そのまま.*再帰',
      '区間DP.*分割点',
      '重心分解',
    ],
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
    id: 'tag-randomized-algorithm',
    name: '乱択・Monte Carloアルゴリズム',
    definition:
      '乱数で候補またはfingerprintを選び、成功条件と誤り確率を評価して反復や事後検証を設計する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-design-and-bound-randomized-algorithm'],
    unitIds: ['unit-randomized-algorithms'],
    recall: ['randomized algorithm', '乱択', 'monte.?carlo', 'las.?vegas', 'random sampling'],
    object: ['乱数', 'sample', '候補', '確率変数'],
    trigger: ['ランダムに選', '乱択', '試行を繰り返', 'sampling'],
    invariant: ['誤り確率', '高確率', '独立試行', '事後検証'],
    goal: ['高確率で発見', '衝突回避', '候補を得る'],
    priority: 93,
  },
  {
    id: 'tag-interactive-protocol',
    name: '対話protocolとquery設計',
    definition:
      'judgeとの問い合わせ・応答列をprotocolどおり実行し、回数上限内で必要な情報を識別する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-maintain-interactive-query-protocol'],
    unitIds: ['unit-interactive-protocol'],
    recall: ['interactive', 'インタラクティブ', '対話型', 'flush', 'query protocol'],
    object: ['judge', 'query', '応答', '問い合わせ回数'],
    trigger: ['問い合わせを出力', '応答を読む', '対話', 'flush'],
    invariant: ['protocol', '回数上限', '応答に応じて', '終了宣言'],
    goal: ['情報を特定', '答えを宣言', 'query数を抑える'],
    priority: 98,
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
    id: 'tag-grid-table-dp',
    name: 'グリッド・多次元表の局所DP',
    definition:
      'グリッド経路や多次元表の依存関係をDAG順に並べ、隣接する小さな状態集合から各セル・各添字を更新する。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-grid-table-dp'],
    unitIds: ['unit-dp-grid-table'],
    recall: ['grid.?dp', 'グリッド.?DP', '二次元.?DP', 'table.?dp', '格子経路.?DP'],
    object: ['グリッド', '表', '行', '列', 'セル', 'DAG'],
    trigger: ['上と左', '近傍状態', '行ごとに', '小さい添字から', '単調経路'],
    invariant: ['依存先を計算済み', '局所遷移', 'DAG順', '境界の番兵'],
    goal: ['経路の最適値', '最大正方形', '多次元状態の値', '場合の数'],
    priority: 72,
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
    unitIds: ['unit-dp-sequence'],
    recall: ['subsequence', '部分列', '\\blis\\b', '列.?dp', 'マッチング.?dp'],
    object: ['列', 'prefix', '部分列', '順序'],
    trigger: ['左から', '選ぶ', '最後の要素', '一致'],
    invariant: ['順序を保', '最長', '末尾'],
    goal: ['長さ', '個数', '最適'],
    priority: 66,
  },
  {
    id: 'tag-interval-partition-dp',
    name: '区間合成・領域分割DP',
    definition: '区間・長方形の分割点を遷移にし、互いに独立な小領域の解を合成する。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-interval-split-dp'],
    unitIds: ['unit-dp-interval-composition'],
    recall: ['区間.?dp', '分割.?dp', 'interval.?dp', 'マージ.?dp'],
    object: ['区間', '分割', '括弧', 'prefix'],
    trigger: ['切れ目', '左端', '右端', '区切る'],
    invariant: ['部分区間', '合成', '独立'],
    goal: ['最小', '場合の数', 'コスト'],
    priority: 76,
  },
  {
    id: 'tag-carry-mixed-radix-dp',
    name: '繰り上がり・混合基数DP',
    definition:
      '整除鎖の丸め、支払いと釣銭、複数項の加算を下位桁から処理し、次の桁へ渡すcarry・borrowだけを状態に保つ。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-design-carry-or-mixed-radix-dp'],
    unitIds: ['unit-dp-carry-mixed-radix'],
    recall: [
      'carry.?dp',
      '繰り上がり.?dp',
      '繰り下がり.?dp',
      '混合基数',
      'mixed.?radix',
      '支払い.*釣銭',
    ],
    object: ['桁', 'carry', 'borrow', '額面', '整除鎖', '混合基数'],
    trigger: ['下位桁から', '繰り上がり', '切り上げ', '切り下げ', '釣銭'],
    invariant: ['次桁へのcarry', '整除関係', '端数', '有限carry vector'],
    goal: ['最小枚数', '加算制約', '可解性', '解数'],
    exclude: ['tight', '未満フラグ', '文字列automaton'],
    priority: 81,
  },
  {
    id: 'tag-digit-dp',
    name: '上限制約付き桁DP',
    definition:
      '数値上限以下の桁列を接頭辞から構成し、tight・started・剰余・digit maskなど将来に必要な有限統計を保つ。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-count-prefix-constrained-objects'],
    unitIds: ['unit-digit-dp'],
    recall: ['桁.?dp', 'digit.?dp', 'tight.?dp', '未満フラグ'],
    object: ['桁', '上限', '数字列', '十進表記', '二進表記'],
    trigger: ['prefix', '未満フラグ', '剰余', '桁ごと', 'leading zero'],
    invariant: ['上限と一致', '先頭ゼロ', 'tight flag', 'started flag'],
    goal: ['以下の個数', '条件を満たす数', '値の総和'],
    exclude: [
      'syntax',
      '文法',
      '構文木',
      'parser',
      'carryだけ',
      '混合基数',
      '禁止pattern',
      'automaton state',
    ],
    requireObjectForStrictRecall: true,
    priority: 82,
  },
  {
    id: 'tag-stochastic-expectation-dp',
    name: '確率・期待値DP',
    definition: '確率遷移に対する期待値・分布・到達確率の再帰式を解く。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: [
      'outcome-propagate-probability-distribution',
      'outcome-solve-stochastic-recurrence',
      'outcome-optimize-stochastic-actions',
    ],
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
    name: '有限局面DAGのminimax',
    definition:
      '必ず終了するゲームの局面DAGで、終端利得と各手番の最大化・最小化から局面値を求める。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-evaluate-adversarial-game-value'],
    unitIds: ['unit-dp-game-value'],
    recall: ['minimax', 'ミニマックス', '得点差', 'ゲーム木', '最悪応答', '零和.?game'],
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
    outcomeIds: [
      'outcome-factor-and-accelerate-transitions',
      'outcome-subtract-exception-transitions',
      'outcome-normalize-common-dp-action',
      'outcome-compress-dp-sufficient-aggregates',
      'outcome-slide-transition-recurrence',
      'outcome-close-eventual-dp-tail',
    ],
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
      '必要なら方向別scanで長い静的制約を通行可否へ前処理し、状態を頂点、一手を辺として探索するか、中継頂点を順に許可して到達関係を求める。',
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
    invariant: ['queue', '距離順', '訪問済み', '未到達', '外部からの到達', '訪問状態を戻す'],
    goal: ['到達判定', '最小手数', '連結領域', '穴の検出', '単純pathの列挙'],
    priority: 58,
  },
  {
    id: 'tag-shortest-path',
    name: '最短路モデル',
    definition: '重み付きグラフに帰着し、距離の確定条件に応じた最短路法を選ぶ。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-model-and-compute-shortest-path',
      'outcome-relax-in-dependency-order',
      'outcome-detect-improving-cycles',
      'outcome-compute-all-pairs-distance',
    ],
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
    definition:
      '変更前の解・実行列をwitnessとし、それを壊さない変更では答えが変わらないと示して再計算対象を絞る。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-localize-change-impact-by-witness'],
    unitIds: ['unit-change-impact-localization'],
    recall: ['replacement paths', '変更影響', '感度解析', 'witness'],
    object: ['変更', '削除', '基準解', '実行列', 'witness'],
    trigger: ['各操作を除く', '一箇所変更', '再計算'],
    invariant: ['witnessが壊れない', '基準解に含まれない', '答えは変わらない'],
    goal: ['変更後の答え', '各削除', '影響範囲'],
    priority: 95,
  },
  {
    id: 'tag-dsu-connectivity',
    name: '連結成分の管理・縮約とDSU',
    definition:
      '探索またはDSUで連結成分を同定・併合し、頂点間potential、成分metadata・merge履歴、成分間の縮約辺を保つ。',
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
      'component contraction',
      '連結成分.*縮約',
    ],
    object: ['連結成分', '頂点', '辺', '集合', '縮約グラフ'],
    trigger: ['辺追加', 'merge', 'union', '同じ成分', '成分ごとにまとめる'],
    invariant: ['root', 'leader', '成分サイズ', '同じ成分内を一頂点にする'],
    goal: ['連結判定', '成分数', 'サイズ', '成分間の辺'],
    priority: 83,
  },
  {
    id: 'tag-bipartite-structure',
    name: '二部グラフの彩色と成分構造',
    definition:
      '無向グラフを二色に塗れる条件を探索で検証し、各連結成分の二部サイズ・反転対称性を集約する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-color-and-classify-bipartite-components'],
    unitIds: ['unit-bipartite-structure'],
    recall: ['bipartite graph', '二部グラフ', '二部彩色', '2.?coloring', 'odd cycle'],
    object: ['無向グラフ', '連結成分', '二つの部', '頂点色'],
    trigger: ['隣接頂点を異なる色', '二色に塗る', '奇閉路', '部ごとの個数'],
    invariant: ['辺の両端は異色', '成分ごとに色反転できる', '奇閉路がない'],
    goal: ['二部性判定', '二部サイズ', '彩色の復元', '成分型の分類'],
    priority: 82,
  },
  {
    id: 'tag-spanning-tree-optimization',
    name: '最小・最大全域木とcut・cycle性質',
    definition:
      '辺重み順の成分併合を交換論で正当化し、最小または最大全域木を構成して辺の採否を判定する。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-dsu-connectivity', 'tag-greedy-exchange-order'],
    outcomeIds: ['outcome-construct-optimal-spanning-tree'],
    unitIds: ['unit-spanning-tree-optimization'],
    recall: [
      'kruskal',
      'minimum spanning tree',
      'maximum spanning tree',
      '最小全域木',
      '最大全域木',
      '\\bmst\\b',
    ],
    object: ['重み付き無向グラフ', '辺重み', '全域木', 'spanning tree'],
    trigger: ['重み順に辺', '連結成分を結ぶ', '辺を採用できる'],
    invariant: ['cut property', 'cycle property', '採用辺は閉路を作らない'],
    goal: ['最小重み', '最大重み', '全域木', '辺の採否'],
    priority: 94,
  },
  {
    id: 'tag-directed-condensation-toposort',
    name: '有向グラフの閉路・SCC・DAG順序・2-SAT',
    definition:
      '有向グラフの閉路と依存関係を整理し、強連結成分への縮約、DAG順の処理、またはimplication graphによる2-SAT判定を行う。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-condense-and-order-directed-graph',
      'outcome-encode-threshold-constraints-as-two-sat',
    ],
    unitIds: ['unit-directed-condensation'],
    recall: [
      '強連結成分',
      '\\bscc\\b',
      'トポロジカル',
      'topological',
      '連結成分の?縮約',
      '\\bdag\\b',
      '2.?sat',
      'implication graph',
      '含意グラフ',
    ],
    object: ['有向グラフ', '頂点', '有向辺', 'dag', 'boolean命題'],
    trigger: ['相互到達', '依存関係', '順序', '二項clause', 'implication'],
    invariant: ['scc', '縮約', '入次数', '閉路なし', '変数と否定が別SCC'],
    goal: ['順序', '最長路', '到達関係', '成分', '充足割当'],
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
    name: '木距離・直径・中心・最遠点',
    definition:
      '木の一意経路距離を少数の基準点から一括計算し、距離label・直径端点・中心・最遠点性質で頂点集合の距離条件を整理する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-use-tree-diameter-extrema'],
    unitIds: ['unit-tree-metric'],
    recall: [
      '木距離',
      'tree metric',
      '木の直径',
      'tree diameter',
      'diameter endpoint',
      '直径端点',
      '木の中心',
      'tree center',
      'eccentricity',
      '最遠点',
    ],
    object: ['木', '距離', '基準点', '直径', '中心', '端点'],
    trigger: ['木上の距離条件', '基準点からの距離', '最遠', '最大距離', '直径', '中心'],
    invariant: ['一意経路', '基準点からの距離label', '直径端点', '二端点', '中点'],
    goal: ['頂点分類', '距離条件', '最遠点', '最大距離', '中心', '直径'],
    priority: 82,
  },
  {
    id: 'tag-implicit-binary-tree-arithmetic',
    name: '暗黙・対称な完全二分木の深さ算術',
    definition:
      '巨大な完全二分木を展開せず、同じ深さの対称性と2冪で集約するか、heap番号の祖先移動と深さdの子孫label区間を使って数える。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-count-implicit-binary-tree-layers'],
    unitIds: ['unit-implicit-binary-tree'],
    recall: [
      'implicit complete binary tree',
      '暗黙.*完全二分木',
      '完全二分木.*深さ.*集約',
      'heap index',
      'heap番号',
      '子孫.*区間',
    ],
    object: ['完全二分木', '深さ', 'heap番号', '共通祖先', '子孫'],
    trigger: [
      '頂点数が指数的',
      '深さだけで同型',
      '2倍',
      '2v',
      escapeRegexLiteral('2v+1'),
      'ancestorを上る',
    ],
    invariant: [
      '同じ深さの部分木は同型',
      '深さdの子孫は2冪個または連続区間',
      escapeRegexLiteral('親はfloor(v/2)'),
    ],
    goal: ['距離層の個数', '頂点対の個数', '子孫数', '深さ別集約'],
    priority: 80,
  },
  {
    id: 'tag-tree-aggregation-reroot',
    name: '木DP・部分木集約・全方位木DP',
    definition:
      '根付き木の子側情報を合成し、必要な問題だけ親側の差し替えやcluster結合で全体の値を更新する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-aggregate-rooted-tree', 'outcome-reroot-tree-aggregation'],
    unitIds: ['unit-tree-aggregation'],
    recall: [
      '木.?dp',
      'tree.?dp',
      'subtree.?dp',
      '部分木.*dp',
      'postorder.?dp',
      'reroot',
      '全方位木.?dp',
    ],
    object: ['木', '親', '子', '部分木'],
    trigger: ['根付け', '子の答え', '全頂点を根'],
    invariant: ['親側', '子側', '合成', '部分木サイズ'],
    goal: ['各頂点', '距離和', '部分木', '木全体'],
    priority: 81,
  },
  {
    id: 'tag-static-top-tree',
    name: 'Static Top Treeによる動的木DP',
    definition:
      '境界頂点つきtree clusterをrake・compressで二分合成し、局所更新後の木DP値を根まで再計算する。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-tree-aggregation-reroot'],
    outcomeIds: ['outcome-compose-dynamic-tree-clusters'],
    unitIds: ['unit-static-top-tree'],
    recall: ['top tree', 'static top tree', 'rake.?compress', 'tree contraction'],
    object: ['木', 'cluster', '境界頂点', '木DP'],
    trigger: ['頂点更新', '辺更新', 'rake', 'compress'],
    invariant: ['境界頂点', 'cluster合成', '二分木', '局所再計算'],
    goal: ['更新後の木全体', '動的木DP', '全体の値'],
    priority: 97,
  },
  {
    id: 'tag-tree-path-decomposition',
    name: '祖先query・Euler順・HLD・virtual tree',
    definition:
      'binary lifting等でancestor/LCAを実際に問い合わせるか、Euler順・HLD・virtual treeへ木構造を明示的に分解してquery・数え上げを処理する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-answer-tree-ancestor-queries',
      'outcome-flatten-tree-by-euler-order',
      'outcome-apply-heavy-light-decomposition',
      'outcome-build-virtual-tree',
    ],
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
    name: '木の均衡分離点と重心分解',
    definition:
      '非負重みの各成分を半分以下にする一点を選ぶ。頂点数を重みとし各成分で繰り返すと、対数深さの重心分解を得る。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-find-weighted-balanced-separator',
      'outcome-build-balanced-separator-decomposition',
    ],
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
    outcomeIds: [
      'outcome-reduce-selection-to-network-optimization',
      'outcome-characterize-bipartite-feasibility-by-hall',
    ],
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
      '一次元区間や多次元直方体の情報、または一括加算を接頭辞・端点の差へ変換し、query・数え上げ・復元に使う。',
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
    name: 'Fenwick Tree・反転数・重み付き接頭辞統計',
    definition:
      '値や座標の頻度を動的な接頭辞和で数えて反転数を求めるか、複数本を組み合わせて次数付きの区間式を評価する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-maintain-weighted-prefix-statistics'],
    unitIds: ['unit-weighted-prefix-fenwick'],
    recall: ['fenwick', 'binary indexed tree', '\\bbit\\b', '重み付き累積和', '反転数'],
    object: ['prefix', '添字付き和', '頻度', '反転数', '重み', '配列'],
    trigger: ['point update', '一点更新', '接頭辞和', '累積和', '左側に大きい値'],
    invariant: ['処理済み頻度', '複数本の', '係数', 'bit'],
    goal: ['反転数', '区間式', '動的和', 'query'],
    exclude: ['bit.?mask', 'bit.?dp', 'bitset'],
    priority: 86,
  },
  {
    id: 'tag-monoid-segment-tree',
    name: '区間分解・結合的要約・Segment Tree・SWAG',
    definition:
      '区間をO(log N)個のcanonical nodeへ分解するか、結合的な演算と単位元を持つ要約を設計し、Segment Tree・prefix fold・SWAGの適切な形で扱う。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: [
      'outcome-design-associative-range-summary',
      'outcome-decompose-ranges-into-segment-tree-nodes',
    ],
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
      'canonical (?:cover|node)',
      'segment.?tree graph',
      '時間.*segment.?tree',
      '区間.*分解',
    ],
    object: ['区間', '要約', 'ノード', '配列', 'range object', '時間軸', '区間グラフ'],
    trigger: [
      'point update',
      '更新',
      '区間query',
      '合成',
      'canonical node',
      'range edge',
      '生存区間',
    ],
    invariant: ['結合法則', '単位元', 'merge', 'canonical cover', 'O\\(log N\\)'],
    goal: ['区間の', '全体の値', 'query', 'range object', 'range-edge graph', '時間区間'],
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
    id: 'tag-bitset-word-parallel',
    name: 'bitsetによるword並列集合演算',
    definition:
      '真偽集合をbit列へ詰め、交差・和・shift・popcountをword単位で実行して遷移や組数計算を加速する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-accelerate-set-operations-with-bitsets'],
    unitIds: ['unit-bitset-word-parallel'],
    recall: ['bitset', 'word.?parallel', 'bit parallel', 'ビット集合', 'popcount'],
    object: ['集合', '隣接集合', '真偽配列', 'bit列'],
    trigger: ['集合の積', '一括shift', 'bitset.*and', 'word単位'],
    invariant: ['各bitが要素', 'word幅', 'popcount'],
    goal: ['共通要素数', '到達集合', '遷移高速化'],
    exclude: ['binary indexed tree', 'fenwick'],
    priority: 92,
  },
  {
    id: 'tag-cartesian-tree',
    name: 'Cartesian treeによる区間極値分解',
    definition: '配列順と値のheap順を同時に保つ木を構成し、区間極値を根とする再帰分割へ変換する。',
    parentId: 'tag-query-sufficient-aggregate',
    prerequisiteTagIds: ['tag-monotone-stack-queue'],
    outcomeIds: ['outcome-build-cartesian-tree-decomposition'],
    unitIds: ['unit-cartesian-tree'],
    recall: ['cartesian tree', 'デカルト木', 'min.?cartesian', 'max.?cartesian'],
    object: ['配列', '区間最小', '区間最大', '木'],
    trigger: ['最小値の位置で分割', '単調stackで親', '大小関係を木'],
    invariant: ['inorderが元の順序', 'heap order', '部分木が連続区間'],
    goal: ['区間を再帰分割', '最近小さい要素', '部分問題の合成'],
    priority: 94,
  },
  {
    id: 'tag-binary-trie',
    name: 'binary Trieによるbit列索引',
    definition:
      '整数を上位bitから分岐するTrieへ格納し、XOR・大小・距離条件に合う候補をbitごとに選ぶ。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-query-bitwise-order-with-trie'],
    unitIds: ['unit-binary-trie'],
    recall: ['binary trie', 'bitwise trie', 'xor trie', '01.?trie'],
    object: ['整数集合', 'bit列', 'xor', '上位bit'],
    trigger: ['bitごとに分岐', 'xorを最小', 'xorを最大', '二進Trie'],
    invariant: ['部分木の要素数', '共通上位bit', '0と1の子'],
    goal: ['最小xor', '最大xor', 'k番目', '条件を満たす整数'],
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
    id: 'tag-string-automata',
    name: '有限文字列automaton・Aho–Corasick・SAM',
    definition:
      '未来の文字追加に対して同じ受理・違反判定をする履歴を有限状態へ圧縮し、禁止・要求pattern・複数pattern・全部分文字列を遷移グラフで扱う。',
    parentId: 'tag-string-state-representation',
    outcomeIds: [
      'outcome-build-finite-string-automaton',
      'outcome-build-multi-pattern-automaton',
      'outcome-build-suffix-automaton',
    ],
    unitIds: ['unit-string-automata', 'unit-suffix-automaton'],
    recall: [
      'aho.?corasick',
      'suffix automaton',
      '接尾辞automaton',
      '有限automaton',
      '\\bsam\\b',
      'failure link',
    ],
    object: ['文字列集合', 'pattern', '進行段階', '接尾辞状態', 'automaton', '部分文字列'],
    trigger: [
      '一文字追加',
      '禁止・要求subsequence',
      '禁止部分文字列',
      '複数pattern',
      '全部分文字列',
    ],
    invariant: ['未来等価', '有限状態', 'failure link', 'suffix link', 'endpos', 'clone'],
    goal: [
      '回避する文字列数',
      'pattern進行',
      'pattern出現集合',
      '部分文字列の遷移',
      '状態数を圧縮',
    ],
    requireObjectForStrictRecall: true,
    priority: 96,
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
    id: 'tag-modular-arithmetic',
    name: '法上の四則演算・高速累乗・逆元',
    definition:
      '剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算・確率を計算する。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: ['outcome-compute-in-modular-arithmetic'],
    unitIds: ['unit-modular-arithmetic'],
    recall: [
      'modular arithmetic',
      'modular inverse',
      'モジュラ逆元',
      '法逆元',
      'modular exponentiation',
      '剰余高速累乗',
      'modint',
    ],
    object: ['剰余', '法', 'mod', '逆元', '確率'],
    trigger: ['法で割る', '逆元を掛ける', '二分累乗', 'modを取る'],
    invariant: ['合同類', '逆元の存在', '乗法単位元', '正規化'],
    goal: ['法上の値', '剰余での確率', '巨大冪', '法上の除算'],
    priority: 78,
  },
  {
    id: 'tag-dynamic-modular-product',
    name: '法上の動的積・剰余 0 因子の分離',
    definition:
      '取り得る因子のうち法 m で非零となるものがすべて可逆であることを確認し、因子の差し替えを「剰余 0 の因子数」と「非零因子の積」に分け、可逆な旧因子を逆元で外して新因子を掛ける。',
    parentId: 'tag-modular-arithmetic',
    prerequisiteTagIds: ['tag-modular-arithmetic'],
    outcomeIds: ['outcome-maintain-modular-product-under-factor-updates'],
    unitIds: ['unit-dynamic-modular-product'],
    recall: [
      'dynamic modular product',
      'zero.?aware.*product',
      '0.*因子.*個数',
      '非零因子積',
      '法上の動的積',
    ],
    object: ['因子', '積', '剰余', 'mod', '更新'],
    trigger: ['因子.*差し替', '一因子.*更新', '積.*更新', '0.*逆元', '0.*除けない'],
    invariant: ['0.*因子.*個数', '非零因子積', '非零.*可逆', 'zero count'],
    goal: ['更新後.*積', '動的.*積', '法上.*積'],
    exclude: ['加算だけ', '積を更新しない', 'すべての因子を毎回走査'],
    priority: 84,
  },
  {
    id: 'tag-modular-crt',
    name: '一次合同・剰余周期・CRT',
    definition: '一次合同の可解性を判定して複数の合同類をCRTで統合するか、剰余列の周期を利用する。',
    parentId: 'tag-math-geometry-transformation',
    prerequisiteTagIds: ['tag-modular-arithmetic'],
    outcomeIds: ['outcome-solve-modular-constraints', 'outcome-exploit-modular-periodicity'],
    unitIds: ['unit-modular-congruence', 'unit-modular-periodicity'],
    recall: [
      'chinese remainder',
      '\\bcrt\\b',
      '中国剰余定理',
      '合同式',
      '一次合同',
      'fermat',
      'オイラーの定理',
      'lcm.*周期',
    ],
    object: ['余り', '法', 'mod', '合同'],
    trigger: ['複数の法', '一次合同', '周期', '一致'],
    invariant: ['gcd', '互いに素', '合同類'],
    goal: ['整数解', '最小の解', '余り'],
    priority: 82,
  },
  {
    id: 'tag-gcd-diophantine',
    name: 'Euclid・gcd・数値半群・有理近似',
    definition:
      'Euclid互除法から、整除・差分の周期・Bézout整数解、正の生成元の非負整数結合がconductor以後を覆う性質、連分数による最良有理近似を導く。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: [
      'outcome-characterize-integer-solvability',
      'outcome-reduce-integer-structure-by-gcd',
      'outcome-bound-reachability-in-numerical-semigroup',
      'outcome-approximate-rational-by-euclid',
    ],
    unitIds: [
      'unit-gcd-diophantine',
      'unit-numerical-semigroup-reachability',
      'unit-rational-approximation',
    ],
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
      'numerical semigroup',
      '数値半群',
      'frobenius coin',
      'フロベニウス',
      'conductor',
    ],
    object: ['整数', '整除', '倍数', '線形結合', '正の生成元', '到達距離', 'step長'],
    trigger: ['割り切れる', '何回で', '整数解', '任意回加える', '十分大きい距離'],
    invariant: ['gcd', '最大公約数', '線形結合', 'conductor以後', 'Frobenius数'],
    goal: ['成立判定', '最小値', '整数解', '到達可能性', '有限prefix'],
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
    outcomeIds: [
      'outcome-formulate-combinatorial-coefficients',
      'outcome-compute-binomial-by-lucas',
    ],
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
    definition:
      '係数積和を高速畳み込みで計算し、生成関数への符号化、FPS演算、多点評価・合成へ発展させる。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: [
      'outcome-compute-convolution-or-correlation',
      'outcome-encode-counting-by-generating-function',
      'outcome-apply-formal-power-series-operations',
      'outcome-evaluate-and-compose-polynomials',
    ],
    unitIds: [
      'unit-polynomial-convolution',
      'unit-generating-functions',
      'unit-formal-power-series',
    ],
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
    trigger: ['畳み込み', '係数の積', '分割の合成', '逆数', '多点評価', '多項式合成'],
    invariant: ['係数', '次数制限', '多項式積', '形式的等式'],
    goal: ['係数列', '場合の数', '相互相関', 'FPSの値', '高速化'],
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
    id: 'tag-finite-field-extension',
    name: '拡大有限体の表現と演算',
    definition:
      '素体上の多項式剰余または基底座標で有限体の元を表し、標準化された加減乗除を構成する。',
    parentId: 'tag-math-geometry-transformation',
    prerequisiteTagIds: ['tag-modular-arithmetic'],
    outcomeIds: ['outcome-compute-in-finite-field-extension'],
    unitIds: ['unit-finite-field-extension'],
    recall: [
      'extension field',
      'finite field extension',
      '拡大有限体',
      'quadratic extension',
      'nim product',
    ],
    object: ['有限体', '基底', '既約多項式', '拡大次数', 'nim積'],
    trigger: ['根を添加', '多項式で割った余り', '基底係数', '体を拡大'],
    invariant: ['標準形', '演算で閉じる', '零でない元は可逆', '既約関係'],
    goal: ['体上の四則演算', '平方根を表現', '有限体で計算'],
    priority: 98,
  },
  {
    id: 'tag-determinant-counting',
    name: '行列式による数え上げ',
    definition:
      '非交差経路やspanning treeなどの組合せ対象を行列式に対応させ、LGV補題・行列木定理で数える。',
    parentId: 'tag-math-geometry-transformation',
    outcomeIds: [
      'outcome-count-nonintersecting-paths-by-lgv',
      'outcome-count-combinatorial-objects-by-determinant',
    ],
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
    name: '凸包・半平面制約・幾何境界',
    definition:
      '凸境界上へ候補を限定するか、凸多角形を向き付き辺の半平面制約の共通部分として表し、平行な制約を最も強い右辺へ集約する。',
    parentId: 'tag-math-geometry-transformation',
    prerequisiteTagIds: ['tag-geometry-orientation-transform'],
    outcomeIds: [
      'outcome-restrict-geometric-candidates-to-boundary',
      'outcome-represent-convex-intersection-by-halfplanes',
    ],
    unitIds: ['unit-convex-geometry'],
    recall: ['convex hull', '凸包', 'half.?plane', '半平面', '回転キャリパー'],
    object: ['点集合', '凸多角形', '直線', '半平面', '境界'],
    trigger: ['内側', '外側', '極値', '支配', '全ての平行移動後', '線形不等式'],
    invariant: ['凸', 'cross', '境界上', '接線', '同じ法線の最強制約'],
    goal: ['面積', '最適点', '包含判定', '候補絞り込み', '共通部分'],
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
      '絶対値和の中央値性や一般の凸・凹性から、傾き、breakpoint、Lagrange penaltyまたは限界費用を追い、連続・離散の最適点を絞る。',
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
      'median.*l1',
      '中央値.*絶対値',
    ],
    object: ['配分', '個数', '座標', '絶対値和', '凸関数', '費用'],
    trigger: ['中央値', '一つ追加', '均す', '傾き', '二次'],
    invariant: ['左右の個数', '限界費用', '単調な差分', '凸'],
    goal: ['L1距離和', '最小費用', '最適配分', '総和'],
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

/**
 * The first full-corpus draft intentionally kept broad buckets while every claim was being
 * dispositioned.  The accepted proposal must expose recognition-sized tags instead.  Keeping
 * the source seeds above makes the source-backed regex review auditable; only the refined seeds
 * below are exported as canonical candidates.
 */
const RETIRED_COARSE_TAG_IDS = new Set([
  'tag-math-geometry-transformation',
  'tag-symmetry-invariant-normalization',
  'tag-divide-enumerate',
  'tag-amortized-heavy-light',
  'tag-subset-bitmask-transform',
  'tag-reachability-bfs',
  'tag-directed-condensation-toposort',
  'tag-functional-graph-doubling',
  'tag-dsu-connectivity',
  'tag-tree-aggregation-reroot',
  'tag-tree-path-decomposition',
  'tag-flow-matching-cut',
  'tag-euler-degree-parity',
  'tag-graph-core-peeling',
  'tag-monoid-segment-tree',
  'tag-ordered-set-heap',
  'tag-persistent-rollback',
  'tag-prefix-matching-automata',
  'tag-string-automata',
  'tag-string-hash-equality',
  'tag-gcd-diophantine',
  'tag-modular-crt',
  'tag-cyclic-group-order',
  'tag-inclusion-exclusion',
  'tag-convolution-fps',
  'tag-linear-algebra-xor',
  'tag-convex-hull-halfplane',
  'tag-discrete-convex-marginal',
]);

const FINAL_TAG_PARENT_OVERRIDES: Readonly<Record<string, string>> = {
  'tag-tree-metric-diameter': 'tag-tree-model-structure',
  'tag-implicit-binary-tree-arithmetic': 'tag-tree-model-structure',
  'tag-static-top-tree': 'tag-tree-model-structure',
  'tag-tree-balanced-separator': 'tag-tree-model-structure',
  'tag-modular-arithmetic': 'tag-number-theory-structure',
  'tag-prime-divisor-decomposition': 'tag-number-theory-structure',
  'tag-integer-boundary-blocks': 'tag-number-theory-structure',
  'tag-finite-field-extension': 'tag-number-theory-structure',
  'tag-combinatorial-coefficients': 'tag-combinatorics-algebra-structure',
  'tag-determinant-counting': 'tag-combinatorics-algebra-structure',
  'tag-geometry-orientation-transform': 'tag-geometry-optimization-structure',
  'tag-convex-hull-trick': 'tag-geometry-optimization-structure',
};

const FINAL_TAG_UNIT_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
  'tag-convex-hull-trick': ['unit-line-envelope'],
  'tag-determinant-counting': ['unit-determinant-counting'],
  'tag-shortest-path': ['unit-weighted-shortest-path'],
  'tag-shortest-path-certificate': ['unit-shortest-path-reconstruction'],
};

const FINAL_TAG_CURRICULUM_PREREQUISITE_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
  // The cut/cycle property is the MST prerequisite. DSU belongs to the Kruskal subsection only.
  'tag-spanning-tree-optimization': ['tag-greedy-exchange-order'],
  'tag-lazy-segment-action': ['tag-range-monoid-aggregation'],
  'tag-static-top-tree': ['tag-rooted-tree-aggregation'],
  'tag-cyclic-exponent-counting': [],
  'tag-formal-power-series': ['tag-convolution'],
  'tag-polynomial-multipoint-evaluation': ['tag-recursive-divide-and-conquer'],
  'tag-bostan-mori': [],
};

/**
 * Pedagogical precedence added after auditing the complete Tag/Outcome/Unit graph.
 * These edges need not be logical necessities: each one lets the later Unit reuse a mental model,
 * proof pattern, or implementation developed in the earlier Unit without repeating it.
 */
const FINAL_TAG_CURRICULUM_PREREQUISITE_ADDITIONS: Readonly<Record<string, readonly string[]>> = {
  'tag-grid-table-dp': ['tag-dp-state-equivalence'],
  'tag-knapsack-resource': ['tag-dp-state-equivalence'],
  'tag-sequence-subsequence-dp': ['tag-dp-state-equivalence'],
  'tag-interval-partition-dp': ['tag-dp-state-equivalence'],
  'tag-carry-mixed-radix-dp': ['tag-dp-state-equivalence'],
  'tag-digit-dp': ['tag-dp-state-equivalence'],
  'tag-stochastic-expectation-dp': ['tag-dp-state-equivalence'],
  'tag-game-grundy-dp': ['tag-dp-state-equivalence'],
  'tag-game-value-dp': ['tag-dp-state-equivalence'],
  'tag-dp-transition-acceleration': ['tag-dp-state-equivalence'],
  'tag-linear-recurrence-matrix': ['tag-dp-state-equivalence'],
  'tag-subset-bitmask-dp': ['tag-dp-state-equivalence'],
  'tag-automaton-dp': ['tag-dp-state-equivalence'],
  'tag-shortest-path': ['tag-state-graph-search'],
  'tag-dag-topological-processing': ['tag-state-graph-search'],
  'tag-scc-condensation': ['tag-dag-topological-processing'],
  'tag-functional-graph-decomposition': ['tag-state-graph-search'],
  'tag-lowlink-critical-structure': ['tag-state-graph-search'],
  'tag-max-flow-min-cut': ['tag-state-graph-search'],
  'tag-graph-potential-propagation': ['tag-state-graph-search'],
  'tag-potential-dsu': ['tag-dsu-components', 'tag-graph-potential-propagation'],
  'tag-rooted-tree-aggregation': ['tag-dp-state-equivalence'],
  'tag-heavy-path-tree-dp': ['tag-rooted-tree-aggregation'],
  'tag-tree-ancestor-lca': ['tag-binary-lifting'],
  'tag-heavy-light-decomposition': ['tag-tree-ancestor-lca', 'tag-tree-euler-flattening'],
  'tag-bipartite-matching-hall': ['tag-bipartite-structure'],
  'tag-min-weight-general-perfect-matching': ['tag-bipartite-matching-hall'],
  'tag-degree-parity-subgraph': ['tag-euler-trail-circuit'],
  'tag-near-tree-kernelization': ['tag-cycle-space-basis', 'tag-graph-core-peeling'],
  'tag-planar-duality': ['tag-max-flow-min-cut', 'tag-shortest-path'],
  'tag-kruskal-threshold-sweep': ['tag-spanning-tree-optimization'],
  'tag-additive-tree-metric-reconstruction': ['tag-tree-metric-diameter'],
  'tag-path-matching-contraction': ['tag-greedy-exchange-order', 'tag-priority-queue-best-first'],
  'tag-fenwick-weighted-prefix': ['tag-prefix-difference'],
  'tag-segment-tree-canonical-decomposition': ['tag-range-monoid-aggregation'],
  'tag-static-sorted-range-index': ['tag-segment-tree-canonical-decomposition'],
  'tag-idempotent-overlap-range-query': ['tag-range-monoid-aggregation'],
  'tag-ordered-interval-partition': ['tag-ordered-set-multiset'],
  'tag-automaton-subset-construction': ['tag-finite-pattern-automaton'],
  'tag-aho-corasick': ['tag-finite-pattern-automaton'],
  'tag-suffix-automaton': ['tag-finite-pattern-automaton'],
  'tag-string-periodicity': ['tag-z-algorithm-prefix-matching'],
  'tag-baby-step-giant-step': ['tag-modular-arithmetic'],
  'tag-numerical-semigroup': ['tag-bezout-diophantine'],
  'tag-cyclic-exponent-counting': ['tag-multiplicative-order'],
  'tag-group-action-orbit-counting': ['tag-state-normalization'],
  'tag-subset-zeta-mobius-transform': ['tag-inclusion-exclusion', 'tag-subset-bitmask-dp'],
  'tag-subset-convolution': ['tag-subset-zeta-mobius-transform'],
  'tag-determinant-counting': ['tag-linear-system-rank'],
  'tag-generating-functions': ['tag-combinatorial-coefficients'],
  'tag-formal-power-series': ['tag-generating-functions'],
  'tag-polynomial-multipoint-evaluation': ['tag-formal-power-series'],
  'tag-bostan-mori': ['tag-generating-functions'],
  'tag-matroid-greedy': ['tag-greedy-exchange-order'],
  'tag-linear-matroid-intersection': ['tag-matroid-greedy'],
  'tag-reflection-principle': ['tag-combinatorial-coefficients'],
  'tag-labeled-component-decomposition': ['tag-generating-functions'],
  'tag-poset-dilworth-antichain': ['tag-bipartite-matching-hall', 'tag-sequence-subsequence-dp'],
  'tag-semiring-matrix-exponentiation': ['tag-linear-recurrence-matrix'],
  'tag-monge-optimization': ['tag-dp-transition-acceleration'],
  'tag-cyclic-order-crossing': ['tag-geometry-orientation-transform'],
};

const REFINED_TAG_SEEDS: readonly TagSeed[] = [
  {
    id: 'tag-euclidean-floor-sum',
    name: '格子点転置によるfloor_sum',
    definition:
      '一次式の床和を格子点数とみなし、整数部分の取り出しと領域の転置でEuclid互除法型に再帰する。商一定区間の列挙とは異なり、傾きと法の交換が計算量を決める。',
    parentId: 'tag-number-theory-structure',
    outcomeIds: ['outcome-sum-affine-floors-by-euclid'],
    unitIds: ['unit-euclidean-floor-sum'],
    recall: ['floor_sum', 'Euclidean floor sum', '床和'],
    object: ['affine floor sum', '格子点領域'],
    trigger: ['一次式の床の総和', '巨大な整数区間'],
    invariant: ['格子点数保存', 'Euclid型の引数減少'],
    goal: ['対数時間の床和', '重み付き床和'],
    priority: 81,
  },
  {
    id: 'tag-value-bucket-aggregation',
    name: '値軸のbucket分割と区間集約',
    definition:
      '値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-aggregate-value-prefix-by-buckets'],
    unitIds: ['unit-value-bucket-aggregation'],
    recall: ['sqrt decomposition', '値軸平方根分割', 'bucket aggregate'],
    object: ['値prefix', 'block要約'],
    trigger: ['queryより更新が多い', '定数時間の点更新'],
    invariant: ['完全blockと端数', '値別頻度の集約'],
    goal: ['頻度和と積', '更新queryの計算量配分'],
    priority: 75,
  },
  {
    id: 'tag-additive-expectation-potential',
    name: '期待値の頻度圧縮と加法的ポテンシャル',
    definition:
      '種類名に関する対称性を使い、高次元の期待残り費用を頻度別関数の和へ分離する。一種類の一段方程式を自己ループも含めて解き、終端で定数を較正する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-stochastic-expectation-dp'],
    outcomeIds: ['outcome-decompose-expectation-by-additive-potential'],
    unitIds: ['unit-additive-expectation-potential'],
    recall: ['additive potential', '期待値の頻度圧縮'],
    object: ['種類別個数', '一変数関数の和'],
    trigger: ['種類名に対する対称性', '周辺遷移が個数だけで決まる'],
    invariant: ['期待ドリフト', '終端ポテンシャル', '一段方程式'],
    goal: ['吸収時間の期待値', '高次元状態の分離'],
    priority: 90,
  },
  {
    id: 'tag-conway-number-games',
    name: '独立な数ゲームの和',
    definition:
      '全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-game-value-dp'],
    outcomeIds: ['outcome-add-conway-number-games'],
    unitIds: ['unit-conway-number-games'],
    recall: ['Conway number', 'simplicity rule', '二進有理数'],
    object: ['独立な列ゲーム'],
    trigger: ['左右選択肢の順序'],
    invariant: ['数としての独立和'],
    goal: ['和の符号で勝敗'],
    priority: 90,
  },
  {
    id: 'tag-cyclic-minimax-game',
    name: '循環局面の後退解析とminimax距離',
    definition:
      '終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-game-value-dp'],
    outcomeIds: ['outcome-solve-cyclic-minimax-game'],
    unitIds: ['unit-cyclic-minimax-game'],
    recall: ['retrograde analysis', 'AND OR game', 'minimax distance'],
    object: ['循環する局面グラフ'],
    trigger: ['無限継続が可能'],
    invariant: ['OR最小とAND全後続'],
    goal: ['有限性と最適利得'],
    priority: 90,
  },
  {
    id: 'tag-heavy-light-recursive-dp',
    name: '資源DPを引数で渡すHLRecDP',
    definition:
      '外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。',
    parentId: 'tag-tree-model-structure',
    prerequisiteTagIds: ['tag-rooted-tree-aggregation', 'tag-knapsack-resource'],
    outcomeIds: ['outcome-pass-resource-dp-through-heavy-recursion'],
    unitIds: ['unit-heavy-light-recursive-dp'],
    recall: ['HLRecDP', 'heavy light recursive DP'],
    object: ['木上資源DP'],
    trigger: ['高価なmax-plus merge'],
    invariant: ['重い子の呼出し一回'],
    goal: ['再帰呼出し総量'],
    priority: 90,
  },
  {
    id: 'tag-stern-brocot-ancestry',
    name: 'Stern–Brocot木の経路と祖先',
    definition:
      '隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-gcd-structure'],
    outcomeIds: ['outcome-traverse-stern-brocot-ancestors'],
    unitIds: ['unit-stern-brocot-ancestry'],
    recall: ['Stern Brocot ancestor', 'mediant', '連分数経路'],
    object: ['既約正有理数'],
    trigger: ['mediant挿入'],
    invariant: ['隣接分数の行列式1'],
    goal: ['祖先集合と経路'],
    priority: 90,
  },
  {
    id: 'tag-bitwise-minimax-partition',
    name: '上位bitの支配関係によるXOR minimax',
    definition:
      '最大XORを最小にする共通maskを求めるとき、最上位bitで値を二群へ分ける。一群だけならそのbitを相殺し、両群なら最大値のそのbitは必ず1なので、どちらの群を最大側にするかを再帰的に比較する。',
    parentId: 'tag-query-sufficient-aggregate',
    prerequisiteTagIds: [],
    outcomeIds: ['outcome-minimize-maximum-xor-by-bit-partition'],
    unitIds: ['unit-bitwise-minimax-partition'],
    recall: ['XOR minimax', 'bitwise partition'],
    object: ['整数集合と共通mask'],
    trigger: ['最大XORの最小化'],
    invariant: ['上位bitが下位bit総和を支配'],
    goal: ['minimax値'],
    priority: 90,
  },
  {
    id: 'tag-tree-model-structure',
    name: '木モデルと構造',
    definition: '木固有の根・部分木・path・separator構造へ問題を写し、利用する性質を選ぶ。',
    parentId: null,
    outcomeIds: ['outcome-model-and-exploit-tree'],
    unitIds: ['unit-chapter-tree'],
    recall: ['tree algorithm', '木アルゴリズム'],
    object: ['木', '根', '部分木', 'path'],
    trigger: ['木として', '根付き', '木上'],
    invariant: ['一意経路', '親子', '部分木'],
    goal: ['木構造へ変換', '木の性質'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-number-theory-structure',
    name: '数論構造への変換',
    definition: '整数条件を合同・整除・指数・約数格子などの数論構造へ変換する。',
    parentId: null,
    outcomeIds: ['outcome-transform-to-number-theory'],
    unitIds: ['unit-chapter-number-theory'],
    recall: ['number theory', '数論'],
    object: ['整数', '剰余', '約数'],
    trigger: ['整除', '合同', '周期'],
    invariant: ['gcd', '剰余類', '指数'],
    goal: ['整数条件を変換'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-combinatorics-algebra-structure',
    name: '組合せ・多項式・線形代数への変換',
    definition: '数え上げや遷移を係数列・多項式・線形写像へ変換する。',
    parentId: null,
    outcomeIds: ['outcome-transform-to-combinatorics-algebra'],
    unitIds: ['unit-chapter-combinatorics-algebra'],
    recall: ['combinatorics', 'polynomial algorithms', 'linear algebra', '組合せ論'],
    object: ['組合せ対象', '多項式', '行列'],
    trigger: ['係数', '線形', '数え上げ'],
    invariant: ['次数', 'rank', '全単射'],
    goal: ['代数化', '係数を求める'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-geometry-optimization-structure',
    name: '幾何・凸最適化への変換',
    definition: '配置・距離・目的関数を幾何predicateや凸構造へ変換する。',
    parentId: null,
    outcomeIds: ['outcome-transform-to-geometry-optimization'],
    unitIds: ['unit-chapter-geometry-optimization'],
    recall: ['geometry', 'convex optimization', '幾何', '凸最適化'],
    object: ['点', '直線', '目的関数'],
    trigger: ['配置', '距離', '最適化'],
    invariant: ['向き', '凸', '境界'],
    goal: ['幾何へ変換', '最適点'],
    primaryEligible: false,
    priority: 0,
  },
  {
    id: 'tag-state-normalization',
    name: '状態・配置の正規化',
    definition: '対称操作で同値な状態を一意な標準形へ写し、重複した探索・数え上げを除く。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-normalize-equivalent-states'],
    unitIds: ['unit-normalization'],
    recall: ['canonicalization', 'state normalization', '標準形'],
    object: ['状態', '配置', '列'],
    trigger: ['同値', '対称', '代表'],
    invariant: ['標準形', '同値類'],
    goal: ['重複除去', '状態圧縮'],
    priority: 48,
  },
  {
    id: 'tag-group-action-orbit-counting',
    name: '群作用・軌道数え上げ',
    definition: '群作用の固定点を作用素のcycle typeごとに数え、BurnsideまたはPólyaで軌道数を得る。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-count-orbits-by-fixed-points'],
    unitIds: ['unit-orbit-counting'],
    recall: ['Burnside', 'Pólya', 'orbit counting', '群作用'],
    object: ['群作用', '固定点', '軌道'],
    trigger: ['回転同一視', '置換同一視', '対称性で割る'],
    invariant: ['固定点', 'cycle type'],
    goal: ['軌道数', '非同値な個数'],
    priority: 82,
  },
  {
    id: 'tag-meet-in-the-middle',
    name: 'meet-in-the-middle・半分全列挙',
    definition: '探索対象を独立に列挙できる二集合へ分け、値・mask・境界を照合して指数を半減する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-split-enumeration-space'],
    unitIds: ['unit-meet-in-the-middle'],
    recall: ['meet.?in.?the.?middle', '\\bMITM\\b', '半分全列挙'],
    object: ['部分集合', '候補集合', '左右集合'],
    trigger: ['半分', '二集合', '照合'],
    invariant: ['独立列挙', '合成条件'],
    goal: ['候補照合', '指数探索'],
    priority: 67,
  },
  {
    id: 'tag-baby-step-giant-step',
    name: 'Baby-Step Giant-Step・可逆作用の反復到達探索',
    definition:
      '有限群の累乗または有限集合上の可逆写像fについてf^t(s)=gをt=iB+jへ分け、target側のinverse baby stepとstart側のgiant stepをhash照合して到達時刻を平方根時間で求める。',
    parentId: 'tag-number-theory-structure',
    outcomeIds: ['outcome-find-orbit-hit-by-bsgs'],
    unitIds: ['unit-baby-step-giant-step'],
    recall: ['Baby.?Step Giant.?Step', '\\bBSGS\\b', 'baby step', 'giant step'],
    object: ['有限群または有限orbit', '可逆写像', 'group action', 'start', 'target'],
    trigger: [
      escapeRegexLiteral('f^t(s)=g'),
      escapeRegexLiteral('g^t=h'),
      'affine合同漸化式',
      '離散対数',
      '反復到達時刻',
    ],
    invariant: [escapeRegexLiteral('t=iB+j'), 'inverse baby table', 'forward giant sequence'],
    goal: ['最小到達時刻', '平方根時間のorbit探索'],
    priority: 90,
  },
  {
    id: 'tag-recursive-divide-and-conquer',
    name: '再帰分割・分割統治',
    definition: 'pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-divide-search-space-recursively'],
    unitIds: ['unit-recursive-divide-and-conquer'],
    recall: ['divide and conquer', '\\bCDQ\\b', '分割統治', 'product tree', 'remainder tree'],
    object: ['区間', '再帰木', 'pivot'],
    trigger: ['左右へ分割', '中央', 'pivot'],
    invariant: ['一意な部分問題', '因果順'],
    goal: ['再帰合成', '重複削減'],
    priority: 69,
  },
  {
    id: 'tag-amortized-monotone-progress',
    name: '単調進行による償却解析',
    definition: '要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-bound-monotone-total-work'],
    unitIds: ['unit-amortized-monotone-progress'],
    recall: ['amortized analysis', 'potential method', '償却解析', '調和級数'],
    object: ['操作列', '要素', '候補'],
    trigger: ['一度だけ', '単調に減る', '移動回数'],
    invariant: ['potential', '総削除回数'],
    goal: ['総計算量', '償却上界'],
    priority: 66,
  },
  {
    id: 'tag-small-to-large',
    name: 'small-to-large・DSU on Tree',
    definition:
      '小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-merge-small-into-large'],
    unitIds: ['unit-small-to-large'],
    recall: ['small.?to.?large', 'DSU on Tree', 'sack technique'],
    object: ['集合', 'map', '部分木container'],
    trigger: ['merge', '小さい側', 'container swap'],
    invariant: ['所属サイズの増大', '消滅要素への課金', '分割時の半減'],
    goal: ['集合併合', '部分木集約'],
    priority: 72,
  },
  {
    id: 'tag-threshold-heavy-light',
    name: '平方根・閾値による軽重分類',
    definition: '頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-balance-heavy-light-threshold'],
    unitIds: ['unit-threshold-heavy-light'],
    recall: ['sqrt decomposition', '平方根分割', 'frequency decomposition', '次数平方分割'],
    object: ['頻度', '次数', 'query'],
    trigger: ['heavy', 'light', '閾値'],
    invariant: ['heavy個数', 'light総和'],
    goal: ['計算量均衡', '更新高速化'],
    priority: 74,
  },
  {
    id: 'tag-heavy-path-tree-dp',
    name: 'heavy path上の多項式木DP',
    definition:
      'heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-accelerate-tree-dp-by-heavy-path'],
    unitIds: ['unit-heavy-path-tree-dp'],
    prerequisiteTagIds: ['tag-convolution'],
    recall: ['heavy path polynomial DP', 'heavy path tree DP'],
    object: ['木DP', 'heavy path', 'light subtree'],
    trigger: ['path recurrence', '部分木多項式', 'heavy child'],
    invariant: ['light辺のsize総和', 'path合成'],
    goal: ['木DP高速化', '多項式DP'],
    priority: 91,
  },
  {
    id: 'tag-subset-bitmask-dp',
    name: '部分集合・bitmask状態DP',
    definition: '各bitの意味を固定し、訪問集合・選択集合・frontierなどの部分集合状態間を遷移する。',
    parentId: 'tag-dp-state-transition',
    outcomeIds: ['outcome-enumerate-subset-state-space'],
    unitIds: ['unit-dp-subset-state'],
    recall: ['bitmask DP', 'subset DP', 'bit DP', '部分集合DP'],
    object: ['bitmask', '部分集合', '訪問集合'],
    trigger: ['小さいN', '集合状態', 'submask'],
    invariant: ['bitの意味', '集合包含'],
    goal: ['部分集合状態', '全訪問'],
    priority: 62,
  },
  {
    id: 'tag-subset-zeta-mobius-transform',
    name: 'subset zeta・Möbius変換',
    definition:
      'Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-apply-subset-zeta-mobius-transform'],
    unitIds: ['unit-subset-transforms'],
    recall: ['subset zeta', 'subset Möbius', 'superset Möbius', '高速ゼータ変換'],
    object: ['subset function', 'mask頻度', 'Boolean lattice'],
    trigger: ['全submask和', '全superset和', 'exact mask'],
    invariant: ['包含順序', 'zetaとinverse'],
    goal: ['subset aggregate', 'exact値復元'],
    priority: 86,
  },
  {
    id: 'tag-subset-convolution',
    name: 'subset convolution',
    definition: '互いに素な部分集合分割に沿う畳み込みをrank別zeta変換などで高速に計算する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-compute-subset-convolution'],
    unitIds: ['unit-subset-convolution'],
    recall: ['subset convolution', '部分集合畳み込み'],
    object: ['subset function', '集合分割'],
    trigger: ['disjoint union', 'Sを二分', '部分集合分割'],
    invariant: ['rank', 'disjointness'],
    goal: ['集合分割畳み込み'],
    priority: 94,
  },
  {
    id: 'tag-directional-grid-effect-scan',
    name: '方向別grid scanによる長距離効果の前計算',
    definition:
      '各行・各列を効果の向きにscanし、最後のblockerまたはactive emitterだけを保って、直線状に続く監視・照射・到達禁止効果を全体線形時間で印付ける。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-precompute-directional-grid-effects'],
    unitIds: ['unit-directional-grid-effect-scan'],
    recall: ['directional grid scan', 'ray sweep', '四方向scan', '視線の前計算'],
    object: ['grid rows and columns', 'directed emitter', 'blocker', 'affected cells'],
    trigger: ['直線効果がblockerまで続く', '方向種類が定数個', 'rayを個別に伸ばすと二乗'],
    invariant: ['現在activeな方向', '各cellを定数回処理', 'blocker属性と禁止属性の分離'],
    goal: ['全効果領域の線形時間marking', '後段探索の静的障害化'],
    exclude: ['単なる全cell走査', '効果の向きが状態ごとに変わるray tracing'],
    priority: 72,
  },
  {
    id: 'tag-state-graph-search',
    name: '状態グラフのモデリングと探索',
    definition:
      '暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-select-state-graph-search'],
    unitIds: ['unit-state-graph-search'],
    recall: ['state graph', 'implicit graph', 'BFS', 'DFS', '状態空間探索'],
    object: ['状態', '遷移', 'グリッド'],
    trigger: ['最小手数', '到達可能', '暗黙graph'],
    invariant: ['visited', '探索frontier'],
    goal: ['到達判定', '最短手数'],
    priority: 43,
  },
  {
    id: 'tag-transitive-closure',
    name: '推移閉包',
    definition: '各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-compute-transitive-closure'],
    unitIds: ['unit-transitive-closure'],
    recall: ['transitive closure', 'Warshall', '推移閉包'],
    object: ['有向graph', '到達関係'],
    trigger: ['全頂点対', '到達可能性'],
    invariant: ['中継許可集合', 'closure'],
    goal: ['到達行列'],
    priority: 55,
  },
  {
    id: 'tag-scc-condensation',
    name: 'SCC・縮約DAG・トポロジカル順序',
    definition: '強連結成分を一頂点へ縮約し、閉路を除いたDAG上の順序・DP・coverへ変換する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-condense-and-order-directed-graph'],
    unitIds: ['unit-scc-condensation'],
    recall: ['SCC', 'strongly connected components', 'condensation DAG', 'topological sort'],
    object: ['有向graph', '強連結成分', 'DAG'],
    trigger: ['閉路', '相互到達', '依存順'],
    invariant: ['成分内同値', 'DAG順'],
    goal: ['縮約', '順序付け'],
    priority: 71,
  },
  {
    id: 'tag-two-sat',
    name: '2-SAT・含意グラフ',
    definition:
      '二値選択のclauseを含意辺へ変換し、literalと否定literalのSCC関係から可解性と代入を得る。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-scc-condensation'],
    outcomeIds: ['outcome-encode-threshold-constraints-as-two-sat'],
    unitIds: ['unit-two-sat'],
    recall: ['2-SAT', 'implication graph', '含意グラフ'],
    object: ['literal', 'clause', 'boolean'],
    trigger: ['二択', '少なくとも一方', 'threshold boolean'],
    invariant: ['否定literal', 'SCC順'],
    goal: ['充足可能性', '具体代入'],
    priority: 84,
  },
  {
    id: 'tag-functional-graph-decomposition',
    name: '関数グラフのcycle・tree分解',
    definition: '各頂点の後続が一意なgraphをcycleと流入treeへ分解し、前周期・周期を処理する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-decompose-functional-graph'],
    unitIds: ['unit-functional-graph-decomposition'],
    recall: ['functional graph', '関数グラフ', 'cycle peeling'],
    object: ['一意な後続', 'cycle', '軌道'],
    trigger: ['写像反復', '各頂点から一辺'],
    invariant: ['前周期', 'cycle'],
    goal: ['軌道分解', '周期処理'],
    priority: 60,
  },
  {
    id: 'tag-binary-lifting',
    name: 'doubling・binary lifting',
    definition: '決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-jump-deterministic-transition'],
    unitIds: ['unit-binary-lifting'],
    recall: ['doubling', 'binary lifting', 'ダブリング'],
    object: ['写像', 'ancestor', '決定的遷移'],
    trigger: ['K回後', '巨大回数', 'jump'],
    invariant: ['2冪合成', '結合順'],
    goal: ['高速jump', '累積遷移'],
    priority: 64,
  },
  {
    id: 'tag-dsu-components',
    name: 'DSUによる連結成分管理・縮約',
    definition: '辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-maintain-connectivity-components',
      'outcome-augment-components-with-metadata',
    ],
    unitIds: ['unit-dsu-components'],
    recall: ['DSU', 'Union.?Find', 'disjoint set union', 'component contraction'],
    object: ['無向graph', '連結成分', '代表元'],
    trigger: ['辺追加', '同値', 'component merge'],
    invariant: ['root', 'component metadata'],
    goal: ['連結判定', '成分縮約'],
    priority: 58,
  },
  {
    id: 'tag-potential-dsu',
    name: 'potential・weighted DSU',
    definition: '親へのpotential差を保ち、同一成分内の差制約と矛盾をmerge・queryできる。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-maintain-potential-differences'],
    unitIds: ['unit-potential-dsu'],
    recall: ['weighted Union.?Find', 'potential DSU', '重み付きUnion-Find'],
    object: ['差制約', 'potential', '成分'],
    trigger: ['相対差', 'offset', '矛盾'],
    invariant: ['rootへのpotential', 'cycle和'],
    goal: ['差query', '整合性判定'],
    priority: 73,
  },
  {
    id: 'tag-rooted-tree-aggregation',
    name: '根付き木DP・部分木集約',
    definition:
      '子部分木の状態をbottom-upに合成し、親へ渡す最小十分なopen/closed状態や要約を設計する。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-aggregate-rooted-tree'],
    unitIds: ['unit-rooted-tree-aggregation'],
    recall: ['tree DP', 'subtree DP', '木DP'],
    object: ['根付き木', '部分木', '子状態'],
    trigger: ['部分木ごと', 'bottom-up'],
    invariant: ['親へのinterface', '子の独立性'],
    goal: ['部分木集約', '木上数え上げ'],
    priority: 63,
  },
  {
    id: 'tag-rerooting',
    name: 'rerooting・全方位木DP',
    definition:
      '辺の両側情報とprefix/suffix合成を用いて、全ての根に対する木DP値を線形または準線形時間で得る。',
    parentId: 'tag-tree-model-structure',
    prerequisiteTagIds: ['tag-rooted-tree-aggregation'],
    outcomeIds: ['outcome-reroot-tree-aggregation'],
    unitIds: ['unit-rerooting'],
    recall: ['rerooting', 'all-direction tree DP', '全方位木DP'],
    object: ['木', '根', '辺の両側'],
    trigger: ['全頂点を根', '根を移す'],
    invariant: ['親側情報', '除外合成'],
    goal: ['全根の答え'],
    priority: 75,
  },
  {
    id: 'tag-laminar-interval-containment-tree',
    name: 'laminar区間族の包含木構築',
    definition:
      '互いに素または包含関係にある区間を端点順に走査し、stackで直接包含する親を定めてdummy root付き包含木を作り、点を最小包含区間へ対応させる。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-build-laminar-interval-containment-tree'],
    unitIds: ['unit-laminar-interval-containment-tree'],
    recall: ['laminar family tree', 'interval containment tree', 'laminar区間', '包含木'],
    object: [
      'laminar intervals',
      'opening and closing endpoints',
      'containment parent',
      'dummy root',
    ],
    trigger: ['区間同士が非交差', '包含関係をqueryで再利用', '点を最小包含区間へ写す'],
    invariant: [
      'open intervals form one ancestor stack',
      'stack top is direct parent',
      'subtree equals containment',
    ],
    goal: ['包含木構築', '区間queryの木上path化'],
    exclude: ['値の大小から作るCartesian tree', '交差する一般区間のoverlap graph'],
    priority: 84,
  },
  {
    id: 'tag-tree-ancestor-lca',
    name: 'ancestor query・LCA',
    definition: '根付き木の祖先関係を時刻またはbinary liftingで索引化し、LCAと木上距離を答える。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-answer-tree-ancestor-queries'],
    unitIds: ['unit-tree-ancestor-lca'],
    recall: ['LCA', 'lowest common ancestor', 'ancestor query'],
    object: ['根付き木', '祖先', '二頂点'],
    trigger: ['共通祖先', '木上距離'],
    invariant: ['深さ', '祖先表'],
    goal: ['LCA', 'ancestor判定'],
    priority: 68,
  },
  {
    id: 'tag-tree-euler-flattening',
    name: 'Euler順による部分木区間化',
    definition: 'DFS入退時刻で各部分木を連続区間へ写し、配列上の更新・集約へ変換する。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-flatten-tree-by-euler-order'],
    unitIds: ['unit-tree-euler-flattening'],
    recall: ['Euler tour flattening', 'DFS order', '部分木区間'],
    object: ['部分木', 'DFS順', 'tin/tout'],
    trigger: ['subtree query', '部分木更新'],
    invariant: ['連続区間', '入退時刻'],
    goal: ['配列化', '区間query'],
    priority: 67,
  },
  {
    id: 'tag-heavy-light-decomposition',
    name: 'Heavy-Light Decomposition',
    definition: '木上pathをO(log N)本の連続区間へ分解し、配列data structure上のqueryへ変換する。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-apply-heavy-light-decomposition'],
    unitIds: ['unit-heavy-light-decomposition'],
    recall: ['Heavy.?Light Decomposition', '\\bHLD\\b', 'HL分解'],
    object: ['木上path', 'heavy path'],
    trigger: ['path query', 'path update'],
    invariant: ['heavy edge', 'chain head'],
    goal: ['path区間分解'],
    priority: 80,
  },
  {
    id: 'tag-virtual-tree',
    name: 'virtual tree・auxiliary tree',
    definition: '選択頂点と隣接LCAだけをEuler順にstack接続し、必要な祖先関係を保つ小木を構築する。',
    parentId: 'tag-tree-model-structure',
    prerequisiteTagIds: ['tag-tree-ancestor-lca', 'tag-tree-euler-flattening'],
    outcomeIds: ['outcome-build-virtual-tree'],
    unitIds: ['unit-virtual-tree'],
    recall: ['virtual tree', 'auxiliary tree', '仮想木'],
    object: ['選択頂点', 'LCA', 'Euler順'],
    trigger: ['少数頂点だけ', '色ごと', '重要頂点'],
    invariant: ['祖先関係', '隣接LCA'],
    goal: ['小さな誘導木', '部分集合query'],
    priority: 87,
  },
  {
    id: 'tag-max-flow-min-cut',
    name: '最大流・最小カット',
    definition:
      '選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-model-max-flow-min-cut'],
    unitIds: ['unit-max-flow-min-cut'],
    recall: ['max.?flow', 'min.?cut', '最大流', '最小カット', 'maximum closure'],
    object: ['capacity network', 'source', 'sink', 'cut'],
    trigger: ['容量', '二値選択', '排反', 'closure'],
    invariant: ['flow conservation', 'residual graph', 'cut capacity'],
    goal: ['最大選択', '最小除去', 'cut復元'],
    priority: 86,
  },
  {
    id: 'tag-flow-feasibility-lower-bounds',
    name: '下限制約付きflowの実現可能性',
    definition:
      '各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-max-flow-min-cut'],
    outcomeIds: ['outcome-solve-flow-with-lower-bounds'],
    unitIds: ['unit-flow-lower-bounds'],
    recall: ['lower.?bound.*flow', 'circulation with demands', '下限付きflow'],
    object: ['有向辺', '下限', '上限', '頂点需要'],
    trigger: ['各辺に最低量', 'flow feasibility', '需要を満たす'],
    invariant: ['flow conservation', '需要balance', 'super source'],
    goal: ['実現可能性', '整数flow構成'],
    priority: 91,
  },
  {
    id: 'tag-bipartite-matching-hall',
    name: '二部matching・Hall・Kőnig',
    definition:
      '左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: [
      'outcome-solve-bipartite-matching',
      'outcome-characterize-bipartite-feasibility-by-hall',
    ],
    unitIds: ['unit-bipartite-matching'],
    recall: ['bipartite matching', '二部マッチング', 'Hall', 'Kőnig', 'path cover'],
    object: ['左右頂点集合', '対応辺', 'matching'],
    trigger: ['一対一割当', '近傍集合', 'path cover'],
    invariant: ['交互路', 'augmenting path', 'Hall condition'],
    goal: ['最大matching', '完全割当', '最小被覆'],
    priority: 81,
  },
  {
    id: 'tag-min-cost-flow',
    name: '最小費用流・circulation',
    definition:
      '流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-max-flow-min-cut', 'tag-shortest-path'],
    outcomeIds: ['outcome-model-min-cost-flow'],
    unitIds: ['unit-min-cost-flow'],
    recall: ['min.?cost flow', 'minimum cost circulation', '最小費用流', 'min.?cost.?slope'],
    object: ['costed edge', 'flow', 'residual network'],
    trigger: ['割当費用', '流量別', '利益最大化'],
    invariant: ['reduced cost', 'potential', 'residual cycle'],
    goal: ['最小費用', '最大利益', 'slope'],
    priority: 92,
  },
  {
    id: 'tag-weighted-bipartite-matching',
    name: '重み付き二部完全matching',
    definition:
      'assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-bipartite-matching-hall'],
    outcomeIds: ['outcome-solve-weighted-bipartite-matching'],
    unitIds: ['unit-weighted-bipartite-matching'],
    recall: ['Hungarian algorithm', 'assignment problem', 'weighted bipartite matching'],
    object: ['cost matrix', '左右頂点', 'perfect matching'],
    trigger: ['全頂点を対応', '割当費用', 'uncrossing'],
    invariant: ['dual potential', 'tight edge'],
    goal: ['最小重み完全matching'],
    priority: 95,
  },
  {
    id: 'tag-min-weight-general-perfect-matching',
    name: '一般グラフの最小重み完全matching',
    definition:
      '奇cycleを含む一般グラフで全頂点をpairにし、weighted blossomまたは重み付きTutte多項式の最小次数からperfect matchingの重みを最小化する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-solve-min-weight-general-perfect-matching'],
    unitIds: ['unit-min-weight-general-perfect-matching'],
    recall: [
      'weighted blossom',
      'minimum.?weight perfect matching',
      'weighted Tutte',
      '一般グラフ.*最小重み.*matching',
    ],
    object: ['重み付き一般グラフ', 'odd cycle', 'perfect matching'],
    trigger: ['二部でない', '全頂点をpair', 'degree stub', 'pairing cost'],
    invariant: ['alternating forest', 'blossom dual', 'Tutte polynomial degree'],
    goal: ['最小重みperfect matching'],
    priority: 99,
  },
  {
    id: 'tag-euler-trail-circuit',
    name: 'Euler trail・circuit',
    definition:
      '全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-construct-euler-trail-or-circuit'],
    unitIds: ['unit-euler-trail-circuit'],
    recall: ['Euler trail', 'Euler circuit', 'Hierholzer', 'オイラー路', '一筆書き'],
    object: ['辺', 'walk', '次数'],
    trigger: ['全辺を一度', '一筆書き'],
    invariant: ['連結性', '入出次数差', '未使用辺'],
    goal: ['trail判定', 'walk構成'],
    priority: 76,
  },
  {
    id: 'tag-degree-parity-subgraph',
    name: '指定次数parityの部分グラフ構成',
    definition:
      '選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-construct-degree-parity-subgraph'],
    unitIds: ['unit-degree-parity-subgraph'],
    recall: ['degree parity subgraph', 'T-join', '次数の偶奇', '奇数次数'],
    object: ['選択辺集合', '頂点次数', 'forest'],
    trigger: ['次数を奇数に', '偶奇を指定'],
    invariant: ['奇数頂点数は偶数', '葉から確定'],
    goal: ['辺集合構成', 'parity条件'],
    priority: 73,
  },
  {
    id: 'tag-euler-circuit-counting',
    name: 'BEST定理によるEuler circuit数え上げ',
    definition:
      '有向Euler graphのcircuit数をrooted arborescenceの行列式と各頂点の出辺順列へ分解して数える。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-euler-trail-circuit', 'tag-determinant-counting'],
    outcomeIds: ['outcome-count-euler-circuits-by-best'],
    unitIds: ['unit-euler-circuit-counting'],
    recall: ['BEST theorem', 'BEST定理', 'Euler circuit counting'],
    object: ['有向Euler graph', 'arborescence', '出次数'],
    trigger: ['Euler閉路の個数', 'de Bruijn'],
    invariant: ['行列木', '出辺順列'],
    goal: ['Euler circuit数'],
    priority: 97,
  },
  {
    id: 'tag-cycle-space-basis',
    name: 'cycle space・fundamental cycle basis',
    definition:
      '無向graphで全頂点が偶数次数となる辺集合をF_2上のcycle space C(G)として扱い、連結成分数C、spanning forest F、各non-tree edge eが作る唯一のcycleからfundamental cycle basisとdim C(G)=M-N+Cを導く。連結graphではC=1なのでM-N+1となる。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-use-cycle-space-basis'],
    unitIds: ['unit-cycle-space-basis'],
    recall: ['cycle space', 'cycle basis', 'fundamental cycle', 'サイクル空間', 'サイクル基底'],
    object: ['無向graph', '連結成分', '辺集合', 'spanning forest', 'non-tree edge', 's-t path'],
    trigger: [
      escapeRegexLiteral('M-N+Cが小さい'),
      '辺集合をXOR',
      'cycle族',
      'simple path数を抑える',
    ],
    invariant: [
      '全頂点の次数が偶数',
      '対称差に関して閉じる',
      escapeRegexLiteral('dim C(G)=M-N+C'),
      'P XOR P_0',
    ],
    goal: ['cycle basis構築', 'cycle空間の列挙', 'simple path数の上界'],
    priority: 92,
  },
  {
    id: 'tag-graph-core-peeling',
    name: '単一サイクル成分とgraph core',
    definition:
      '連結成分の辺数と頂点数からcycle rankを判定し、必要なら葉を反復削除してcycle coreと削除順を得る。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-peel-graph-core'],
    unitIds: ['unit-graph-core'],
    recall: ['unicyclic', 'E=V', 'leaf peeling', 'leaf stripping', 'k.?core', '葉刈り'],
    object: ['graph', 'degree', 'core', '連結成分', '辺数', '頂点数'],
    trigger: ['辺数と頂点数', 'E=V', '葉を反復削除', '次数未満を除去'],
    invariant: ['cycle rank', '現在次数', '削除queue'],
    goal: ['単一cycle', 'cycle core', '残存頂点'],
    priority: 69,
  },
  {
    id: 'tag-near-tree-kernelization',
    name: 'near-tree graphのkernel化',
    definition:
      'terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-kernelize-near-tree-graph'],
    unitIds: ['unit-near-tree-kernelization'],
    recall: ['kernelization', 'near.?tree', 'degree.?2 chain', 'cycle rank'],
    object: ['terminal', 'chain', 'small kernel'],
    trigger: ['木に少数辺追加', 'chainを縮約'],
    invariant: ['答え保存', 'cycle rank'],
    goal: ['parameterized kernel', 'path候補列挙'],
    priority: 94,
  },
  {
    id: 'tag-range-monoid-aggregation',
    name: '区間monoid要約',
    definition:
      'queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-design-associative-range-summary'],
    unitIds: ['unit-range-monoid-aggregation'],
    recall: ['monoid segment tree', 'モノイド', 'segment tree fold', '線分木'],
    object: ['区間', '要約', 'monoid'],
    trigger: ['point update', 'range fold', '非可換合成'],
    invariant: ['結合法則', '単位元', '順序'],
    goal: ['区間query', '境界探索'],
    priority: 75,
  },
  {
    id: 'tag-segment-tree-canonical-decomposition',
    name: 'Segment Treeのcanonical区間分解',
    definition:
      '区間をO(log N)個のcanonical nodeへ分解し、range object・生存時間・range edgeを少数のnodeへ配置する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-decompose-ranges-into-segment-tree-nodes'],
    unitIds: ['unit-segment-tree-canonical-decomposition'],
    recall: ['canonical cover', 'segment tree graph', 'time segment tree', '区間分解'],
    object: ['区間', 'canonical node', '時間軸'],
    trigger: ['区間へ登録', 'range edge', '生存区間'],
    invariant: [escapeRegexLiteral('O(log N) nodes'), '完全被覆'],
    goal: ['offline dynamic', '区間object配置'],
    priority: 78,
  },
  {
    id: 'tag-static-sorted-range-index',
    name: '静的sorted range index・Merge Sort Tree',
    definition:
      '各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-build-static-sorted-range-index'],
    unitIds: ['unit-static-sorted-range-index'],
    recall: ['merge sort tree', 'range tree', 'static sorted range index'],
    object: ['静的配列', 'sorted node array', 'prefix sum'],
    trigger: ['区間内で値以下', 'range count', 'range sum'],
    invariant: ['node内sort順', 'canonical cover'],
    goal: ['値域付き区間query'],
    priority: 86,
  },
  {
    id: 'tag-idempotent-overlap-range-query',
    name: '冪等演算のoverlap range query・Sparse Table',
    definition:
      '冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-answer-idempotent-range-query'],
    unitIds: ['unit-idempotent-overlap-range-query'],
    recall: ['sparse table', 'overlapping decomposition', 'RMQ', '冪等'],
    object: ['静的配列', '2冪区間', 'idempotent operation'],
    trigger: ['更新なし', 'min/max/gcd', '重複して覆う'],
    invariant: [escapeRegexLiteral('f(x,x)=x'), 'floor log'],
    goal: [escapeRegexLiteral('O(1) range query'), 'query family構成'],
    priority: 72,
  },
  {
    id: 'tag-swag',
    name: 'SWAG・two-stack queue aggregation',
    definition:
      'queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。',
    parentId: 'tag-query-sufficient-aggregate',
    prerequisiteTagIds: ['tag-range-monoid-aggregation'],
    outcomeIds: ['outcome-maintain-queue-aggregate-with-swag'],
    unitIds: ['unit-swag'],
    recall: ['SWAG', 'sliding window aggregation', 'two stack queue'],
    object: ['queue', 'two stacks', 'monoid aggregate'],
    trigger: ['両端が一方向', 'sliding window fold'],
    invariant: ['front積', 'back積', '要素移動一回'],
    goal: ['queue aggregate'],
    priority: 88,
  },
  {
    id: 'tag-finite-function-composition',
    name: '有限関数・作用の合成',
    definition:
      '小さな有限集合上の関数を遷移表として表し、適用順を保ってprefix・区間の作用を合成する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-compose-finite-functions'],
    unitIds: ['unit-finite-function-composition'],
    recall: ['finite function composition', 'function monoid', '有限写像の合成'],
    object: ['有限状態', '関数表', '作用列'],
    trigger: ['操作を順に適用', 'bitごとに関数化'],
    invariant: ['合成順', '閉包'],
    goal: ['prefix作用', '区間作用'],
    priority: 64,
  },
  {
    id: 'tag-priority-queue-best-first',
    name: 'priority queue・best-first列挙',
    definition:
      '現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-enumerate-frontier-best-first'],
    unitIds: ['unit-priority-queue-best-first'],
    recall: ['priority queue', 'heap', 'best.?first', 'k-way merge', '優先度付きキュー'],
    object: ['候補frontier', 'heap', '暗黙graph'],
    trigger: ['最小から順', '上位K個', '閾値で解禁'],
    invariant: ['未確定候補の極値', '重複排除'],
    goal: ['k番目', 'best-first探索'],
    priority: 57,
  },
  {
    id: 'tag-ordered-set-multiset',
    name: 'ordered set・multisetの動的順序管理',
    definition:
      '比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-maintain-ordered-set-statistics'],
    unitIds: ['unit-ordered-set-multiset'],
    recall: ['ordered set', 'multiset', 'balanced BST', 'order statistics'],
    object: ['動的集合', '重複値', '隣接要素'],
    trigger: ['前後の値', 'insert/erase', 'k-smallest'],
    invariant: ['sort順', '集合間balance'],
    goal: ['順位', '近傍', 'top-K集約'],
    priority: 60,
  },
  {
    id: 'tag-ordered-interval-partition',
    name: 'ordered interval partition・ODT',
    definition:
      '互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-maintain-ordered-interval-partition'],
    unitIds: ['unit-ordered-interval-partition'],
    recall: ['ordered disjoint tree', '\\bODT\\b', 'interval set', 'run interval'],
    object: ['互いに素な区間', 'run', '境界'],
    trigger: ['区間をsplit', '同値runをmerge'],
    invariant: ['非交差', '最大run', '隣接merge'],
    goal: ['range代入', '動的区間管理'],
    priority: 79,
  },
  {
    id: 'tag-persistence',
    name: '永続data structure・structural sharing',
    definition:
      '変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-persist-data-structure-versions'],
    unitIds: ['unit-persistence'],
    recall: ['persistent data structure', '永続', 'structural sharing', 'path copying'],
    object: ['version root', 'immutable node', '共有部分'],
    trigger: ['過去versionをquery', '分岐する履歴', 'SAVE/LOAD'],
    invariant: ['旧node不変', 'rootごとの版'],
    goal: ['version保存', '過去query'],
    priority: 84,
  },
  {
    id: 'tag-rollback',
    name: 'rollback・DFS入退場の状態復元',
    definition:
      '更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。',
    parentId: 'tag-query-sufficient-aggregate',
    outcomeIds: ['outcome-rollback-reversible-updates'],
    unitIds: ['unit-rollback'],
    recall: ['rollback DSU', 'undo stack', 'rollback data structure', '巻き戻し'],
    object: ['変更履歴', 'snapshot', 'DFS path'],
    trigger: ['退場時に戻す', 'offline dynamic', '分岐探索'],
    invariant: ['変更差分', 'stack height'],
    goal: ['状態復元', '時間分割'],
    priority: 83,
  },
  {
    id: 'tag-z-algorithm-prefix-matching',
    name: 'Z algorithmによるprefix matching',
    definition:
      '各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-build-prefix-match-state'],
    unitIds: ['unit-z-algorithm'],
    recall: ['Z algorithm', 'Zアルゴリズム', 'Z array', 'Z配列'],
    object: ['文字列', 'prefix', '一致長'],
    trigger: ['各位置とprefixを比較', '前後を連結して照合'],
    invariant: ['Z-box', '最右一致区間'],
    goal: ['全位置のprefix一致長'],
    priority: 71,
  },
  {
    id: 'tag-finite-pattern-automaton',
    name: '有限状態automatonの構成',
    definition:
      '文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-build-finite-string-automaton'],
    unitIds: ['unit-finite-pattern-automaton'],
    recall: ['finite automaton', 'DFA', 'Myhill.?Nerode', '有限オートマトン'],
    object: ['有限状態', '接尾辞または圧縮DP row', '受理・集計状態'],
    trigger: ['禁止pattern', '要求subsequence', '一文字更新が有限種類', '未来等価'],
    invariant: ['有限状態', '完全遷移', '受理条件'],
    goal: ['文字列状態圧縮', 'automaton構築'],
    priority: 74,
  },
  {
    id: 'tag-automaton-subset-construction',
    name: '非決定性automatonのsubset construction',
    definition:
      '同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-determinize-automaton-by-subsets'],
    unitIds: ['unit-automaton-subset-construction'],
    recall: ['subset construction', 'powerset construction', 'NFA to DFA'],
    object: ['NFA状態集合', 'DFA state', 'transition'],
    trigger: ['複数状態へ遷移', '非決定性'],
    invariant: ['到達可能状態集合', '言語同値'],
    goal: ['決定化', '有限状態DP'],
    priority: 82,
  },
  {
    id: 'tag-aho-corasick',
    name: 'Aho–Corasick',
    definition:
      '複数patternのTrieへfailure linkとoutput情報を加え、最長接尾辞状態を文字ごとに更新する。',
    parentId: 'tag-string-state-representation',
    prerequisiteTagIds: ['tag-trie-prefix'],
    outcomeIds: ['outcome-build-multi-pattern-automaton'],
    unitIds: ['unit-aho-corasick'],
    recall: ['Aho.?Corasick', 'AC automaton', '多pattern照合'],
    object: ['pattern trie', 'failure link', 'output set'],
    trigger: ['複数pattern', '辞書中の接尾辞'],
    invariant: ['最長suffix state', 'failure tree'],
    goal: ['複数pattern一致状態'],
    priority: 88,
  },
  {
    id: 'tag-automaton-dp',
    name: 'automaton上のDP・行列遷移',
    definition:
      '位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-finite-pattern-automaton'],
    outcomeIds: ['outcome-run-dp-on-finite-automaton'],
    unitIds: ['unit-automaton-dp'],
    recall: ['automaton DP', 'DFA DP', 'transfer matrix automaton'],
    object: ['automaton state', '文字位置', '遷移表'],
    trigger: ['長さLの文字列数', 'patternを避ける', 'graph walkと有限状態'],
    invariant: ['prefix後の状態', '受理集合'],
    goal: ['文字列数え上げ', '最適walk'],
    priority: 80,
  },
  {
    id: 'tag-suffix-automaton',
    name: 'Suffix Automaton',
    definition:
      'endpos同値類をstateとし、suffix linkとcloneで全部分文字列の遷移を線形状態数へ圧縮する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-build-suffix-automaton'],
    unitIds: ['unit-suffix-automaton'],
    recall: ['Suffix Automaton', '\\bSAM\\b', '接尾辞オートマトン'],
    object: ['substring', 'endpos class', 'suffix link'],
    trigger: ['全部分文字列', '文字追加online'],
    invariant: ['max length', 'link length', 'clone'],
    goal: ['部分文字列DAG', 'distinct substring'],
    priority: 93,
  },
  {
    id: 'tag-sequence-fingerprint',
    name: '列・文字列のrolling fingerprint',
    definition:
      '順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-compare-sequences-by-rolling-fingerprint'],
    unitIds: ['unit-sequence-fingerprint'],
    recall: ['rolling hash', 'polynomial hash', 'sequence fingerprint'],
    object: ['列', '部分文字列', 'prefix hash'],
    trigger: ['substring equality', 'LCP query', '連結hash'],
    invariant: ['順序付き連結則', '衝突確率'],
    goal: ['列一致', 'LCP'],
    priority: 73,
  },
  {
    id: 'tag-randomized-algebraic-fingerprint',
    name: '乱択代数fingerprint',
    definition:
      'multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。',
    parentId: 'tag-model-reduction',
    prerequisiteTagIds: ['tag-randomized-algorithm'],
    outcomeIds: ['outcome-compare-algebraic-objects-by-random-fingerprint'],
    unitIds: ['unit-randomized-algebraic-fingerprint'],
    recall: ['Zobrist hash', 'multiset hash', 'algebraic fingerprint', 'random evaluation'],
    object: ['multiset', '指数vector', '多項式値'],
    trigger: ['順序を無視', '完全冪判定', '式の積が等しい'],
    invariant: ['線形/乗法的合成', '衝突上界'],
    goal: ['集合同値query', '確率的等価判定'],
    priority: 87,
  },
  {
    id: 'tag-modular-congruence-crt',
    name: '一次合同・CRT',
    definition:
      '一次合同のgcd可解性を判定し、互いに素でない法も含めて複数の剰余類を一つへ統合する。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-modular-arithmetic', 'tag-bezout-diophantine'],
    outcomeIds: ['outcome-solve-modular-constraints'],
    unitIds: ['unit-modular-congruence'],
    recall: ['Chinese remainder theorem', '\\bCRT\\b', '中国剰余定理', '一次合同'],
    object: ['合同式', '法', '剰余類'],
    trigger: ['複数の法', 'ax=b mod m'],
    invariant: ['gcd整合性', 'lcm法'],
    goal: ['合同解構成', '最小非負解'],
    priority: 78,
  },
  {
    id: 'tag-modular-periodicity',
    name: '剰余周期・指数法則',
    definition:
      '有限剰余状態の周期またはFermat/Euler型指数簡約を示し、巨大な反復やtower exponentを短縮する。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-modular-arithmetic'],
    outcomeIds: ['outcome-exploit-modular-periodicity'],
    unitIds: ['unit-modular-periodicity'],
    recall: ['modular period', 'Fermat theorem', 'Euler theorem', '剰余周期'],
    object: ['剰余列', '巨大指数', '有限状態'],
    trigger: ['反復回数が巨大', '指数を法で簡約'],
    invariant: ['周期', '前周期', '可逆性'],
    goal: ['巨大反復の値'],
    priority: 65,
  },
  {
    id: 'tag-bezout-diophantine',
    name: 'Bézout等式・一次不定方程式',
    definition:
      '整数線形結合がgcdの倍数全体になることを使い、一次不定方程式の可解性と解のparameter表示を得る。',
    parentId: 'tag-number-theory-structure',
    outcomeIds: ['outcome-characterize-integer-solvability'],
    unitIds: ['unit-gcd-diophantine'],
    recall: ['Bézout', 'extended Euclid', 'linear Diophantine', '一次不定方程式'],
    object: ['整数係数', 'gcd', '線形結合'],
    trigger: [escapeRegexLiteral('ax+by=c'), '整数解'],
    invariant: ['gcd divides c', '一般解'],
    goal: ['可解判定', '整数解構成'],
    priority: 69,
  },
  {
    id: 'tag-gcd-structure',
    name: 'gcd不変量・差分構造',
    definition: '差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。',
    parentId: 'tag-number-theory-structure',
    outcomeIds: ['outcome-reduce-integer-structure-by-gcd'],
    unitIds: ['unit-gcd-structure'],
    recall: ['gcd invariant', 'range gcd', '最大公約数不変量'],
    object: ['整数列', '差分', '共通因子'],
    trigger: ['全要素へ同じ加算', '差が不変', '共通に割る'],
    invariant: ['gcd', '差分'],
    goal: ['range gcd', '整数構造縮約'],
    priority: 54,
  },
  {
    id: 'tag-numerical-semigroup',
    name: '数値半群・conductor',
    definition:
      '正の生成元の非負整数結合がconductor以後を全て覆うことを示し、巨大な到達判定を有限prefixへ縮約する。',
    parentId: 'tag-number-theory-structure',
    outcomeIds: ['outcome-bound-reachability-in-numerical-semigroup'],
    unitIds: ['unit-numerical-semigroup-reachability'],
    recall: ['numerical semigroup', 'Frobenius coin', 'conductor', '数値半群'],
    object: ['正の生成元', '非負整数結合', '到達集合'],
    trigger: ['任意回加える', '十分大きい全て'],
    invariant: ['gcd正規化', 'residue shortest path'],
    goal: ['巨大距離の到達判定'],
    priority: 83,
  },
  {
    id: 'tag-rational-approximation',
    name: '連分数・Stern–Brocot有理近似',
    definition: 'Euclidの商列またはStern–Brocot区間を辿り、分母制約下の最良有理近似を求める。',
    parentId: 'tag-number-theory-structure',
    outcomeIds: ['outcome-approximate-rational-by-euclid'],
    unitIds: ['unit-rational-approximation'],
    recall: ['continued fraction', 'Stern.?Brocot', '連分数', 'Farey'],
    object: ['有理数', '分母上限', 'Euclid商'],
    trigger: ['最良近似', '既約分数の順序'],
    invariant: ['隣接分数の行列式', '区間包含'],
    goal: ['制約付き近似', '分数探索'],
    priority: 82,
  },
  {
    id: 'tag-cyclic-exponent-counting',
    name: '巡回群の指数化・位数別数え上げ',
    definition: '巡回部分群の元を指数へ写し、gcd・位数・約数格子で分類して重複なく数える。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-modular-arithmetic', 'tag-prime-divisor-decomposition'],
    outcomeIds: ['outcome-count-through-cyclic-exponents'],
    unitIds: ['unit-cyclic-group-exponent-counting'],
    recall: ['cyclic group counting', 'primitive root', '巡回群', '生成元'],
    object: ['巡回群', '指数', '位数'],
    trigger: ['冪で全要素を表す', '位数ごとに分類'],
    invariant: ['gcd of exponent', 'divisor lattice'],
    goal: ['群上の数え上げ'],
    priority: 88,
  },
  {
    id: 'tag-multiplicative-order',
    name: '乗法的位数・最小周期',
    definition:
      '合同反復の最小正周期をmultiplicative orderへ帰着し、群位数の約数を割り落として求める。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-modular-arithmetic', 'tag-prime-divisor-decomposition'],
    outcomeIds: ['outcome-find-period-by-multiplicative-order'],
    unitIds: ['unit-multiplicative-order-periods'],
    recall: ['multiplicative order', '乗法的位数', 'repunits period'],
    object: ['可逆剰余', '冪列', '群位数'],
    trigger: [escapeRegexLiteral('a^k=1の最小k'), '最小周期'],
    invariant: ['order divides group order'],
    goal: ['周期長'],
    priority: 86,
  },
  {
    id: 'tag-finite-field-frobenius',
    name: '標数pのFrobenius恒等式による反復高速化',
    definition:
      '標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-modular-arithmetic'],
    outcomeIds: ['outcome-accelerate-iteration-by-characteristic-p-frobenius'],
    unitIds: ['unit-finite-field-frobenius'],
    recall: ['Frobenius identity', 'Freshman dream', '標数p'],
    object: ['多項式', 'シフト演算', 'ラン長圧縮'],
    trigger: ['隣接和反復', 'pの冪ジャンプ'],
    invariant: ['二項係数消滅', 'run数上界'],
    goal: ['反復区間圧縮'],
    priority: 97,
  },
  {
    id: 'tag-inclusion-exclusion',
    name: '集合上の包除原理',
    definition:
      '条件集合の交差をsubsetごとに数え、交互符号で「少なくとも一つ」「全てを避ける」対象を重複なく数える。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-correct-overlap-by-inversion'],
    unitIds: ['unit-inclusion-exclusion'],
    recall: ['inclusion.?exclusion', '包除原理', '包含排除'],
    object: ['条件集合', '交差', 'subset'],
    trigger: ['少なくとも一つ', '重複して数える'],
    invariant: ['交互符号', 'intersection lattice'],
    goal: ['重複補正', 'exact count'],
    priority: 68,
  },
  {
    id: 'tag-divisor-mobius-inversion',
    name: '約数格子のzeta・Möbius反転',
    definition:
      '約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-prime-divisor-decomposition'],
    outcomeIds: ['outcome-invert-divisor-lattice-by-mobius'],
    unitIds: ['unit-divisor-mobius-inversion'],
    recall: ['Möbius inversion', 'divisor zeta', '約数Möbius', 'メビウス反転'],
    object: ['約数格子', '倍数和', 'Möbius関数'],
    trigger: ['gcdがexactly', '最小周期', '全倍数の和'],
    invariant: ['divisibility order', 'zeta inverse'],
    goal: ['exact値復元', 'gcd別数え上げ'],
    priority: 83,
  },
  {
    id: 'tag-convolution',
    name: '畳み込み・相互相関',
    definition:
      '係数積和または反転列とのcorrelationを多項式積へ写し、必要な次数範囲をNTT/FFTで計算する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-compute-convolution-or-correlation'],
    unitIds: ['unit-polynomial-convolution'],
    recall: ['convolution', '畳み込み', '\\bNTT\\b', '\\bFFT\\b', 'correlation'],
    object: ['係数列', '多項式', '積和'],
    trigger: [escapeRegexLiteral('i+j=k'), 'shiftごとの一致数'],
    invariant: ['係数積', '次数範囲'],
    goal: ['係数列', '相互相関'],
    priority: 78,
  },
  {
    id: 'tag-generating-functions',
    name: '生成関数による組合せ構造の符号化',
    definition:
      '和・積・sequence・set・cycleなどの組合せ構成を係数列の演算へ翻訳し、欲しい個数を係数として抽出する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-encode-counting-by-generating-function'],
    unitIds: ['unit-generating-functions'],
    recall: ['generating function', '母関数', '生成関数', 'exponential formula'],
    object: ['組合せclass', '係数列', 'OGF/EGF'],
    trigger: ['独立な合成', '連結成分へ分解'],
    invariant: ['sizeに対する係数', '全単射'],
    goal: ['数え上げ式', '係数抽出'],
    priority: 77,
  },
  {
    id: 'tag-formal-power-series',
    name: '形式的べき級数の基本演算',
    definition:
      '定数項条件と次数打切りを確認し、Newton iterationでinverse・log・exp等を畳み込みへ還元する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-convolution'],
    outcomeIds: ['outcome-apply-formal-power-series-operations'],
    unitIds: ['unit-formal-power-series'],
    recall: ['formal power series', '\\bFPS\\b', '形式的べき級数', 'Newton iteration'],
    object: ['formal series', 'truncation degree', 'constant term'],
    trigger: ['inverse/log/exp', '次数を倍増'],
    invariant: [escapeRegexLiteral('mod x^n'), 'Newton誤差次数'],
    goal: ['FPS演算'],
    priority: 90,
  },
  {
    id: 'tag-polynomial-multipoint-evaluation',
    name: '多項式の多点評価・補間',
    definition:
      '一般点ではproduct tree・remainder tree、等比点ではchirp-z変換を使い、評価点の構造に応じて多項式を一括評価する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-convolution', 'tag-recursive-divide-and-conquer'],
    outcomeIds: [
      'outcome-evaluate-polynomial-at-many-points',
      'outcome-evaluate-at-geometric-points',
    ],
    unitIds: ['unit-polynomial-multipoint-evaluation'],
    recall: ['multipoint evaluation', 'product tree', 'remainder tree', '多点評価'],
    object: ['polynomial', 'evaluation points', '積木'],
    trigger: ['多数の点で評価', '補間'],
    invariant: ['remainder mod subtree product'],
    goal: ['多点評価', '補間'],
    priority: 94,
  },
  {
    id: 'tag-polynomial-taylor-shift',
    name: 'factorial convolutionによる多項式Taylor shift',
    definition:
      'P(x+a) の全係数を二項展開し、階乗倍した係数列と a^i/i! の反転畳み込みへ変換して準線形時間で求める。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-combinatorial-coefficients', 'tag-convolution'],
    outcomeIds: ['outcome-shift-polynomial-by-factorial-convolution'],
    unitIds: ['unit-polynomial-taylor-shift'],
    recall: ['Taylor shift', 'polynomial shift', 'factorial convolution', '多項式平行移動'],
    object: ['polynomial coefficients', 'shift parameter', 'factorial-scaled sequence'],
    trigger: [
      escapeRegexLiteral('P(x+a) の全係数'),
      '一つの平行移動を高速化',
      'binomial expansion becomes convolution',
    ],
    invariant: ['binomial coefficient factorization', 'coefficient reversal', 'degree bound'],
    goal: ['shifted polynomial coefficients', '準線形Taylor shift'],
    exclude: ['多数の点での値だけを求める', escapeRegexLiteral('一般の f(g(x)) を計算する')],
    priority: 95,
  },
  {
    id: 'tag-fps-composition-power-projection',
    name: 'FPS合成・power projection',
    definition:
      '多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-formal-power-series'],
    outcomeIds: ['outcome-compose-series-and-project-powers'],
    unitIds: ['unit-fps-composition-power-projection'],
    recall: ['power projection', 'polynomial composition', 'FPS composition', '多項式合成'],
    object: ['formal series', 'composition', 'linear functional'],
    trigger: [escapeRegexLiteral('f(g(x))'), escapeRegexLiteral('g(x)^kの係数pairing')],
    invariant: ['degree truncation', 'transposed map'],
    goal: ['高速合成', 'power projection'],
    priority: 99,
  },
  {
    id: 'tag-bostan-mori',
    name: 'Bostan–Mori・有理生成関数の係数抽出',
    definition: 'P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-convolution'],
    outcomeIds: ['outcome-extract-rational-series-coefficient'],
    unitIds: ['unit-bostan-mori'],
    recall: ['Bostan.?Mori', 'rational generating function coefficient'],
    object: ['rational series', 'numerator', 'denominator'],
    trigger: ['巨大N次係数', '線形漸化式の項'],
    invariant: ['偶奇係数', escapeRegexLiteral('Q(x)Q(-x)')],
    goal: ['N次係数'],
    priority: 96,
  },
  {
    id: 'tag-relaxed-convolution',
    name: 'Relaxed・online convolution',
    definition:
      '係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-convolution'],
    outcomeIds: ['outcome-compute-online-relaxed-convolution'],
    unitIds: ['unit-relaxed-convolution'],
    recall: ['relaxed convolution', 'online convolution', 'CDQ convolution'],
    object: ['online coefficient sequence', 'causal convolution', 'blocks'],
    trigger: ['次係数が過去係数に依存', 'online recurrence'],
    invariant: ['未確定係数を読まない', 'block schedule'],
    goal: ['online畳み込み'],
    priority: 96,
  },
  {
    id: 'tag-linear-system-rank',
    name: '線形方程式・rank',
    definition:
      '制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-solve-linear-system-and-rank'],
    unitIds: ['unit-linear-system-rank'],
    recall: ['Gaussian elimination', 'row reduction', 'rank', '掃き出し法'],
    object: ['matrix', 'linear equations', 'vector space'],
    trigger: ['線形制約', '解の個数'],
    invariant: ['row space', 'pivot', 'rank-nullity'],
    goal: ['可解性', 'rank', '解空間'],
    priority: 73,
  },
  {
    id: 'tag-xor-linear-basis',
    name: 'XOR線形基底',
    definition:
      '整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-maintain-xor-linear-basis'],
    unitIds: ['unit-xor-linear-basis'],
    recall: ['XOR basis', 'linear basis', '線形基底'],
    object: ['bit vector', 'pivot bit', 'basis'],
    trigger: ['XORで生成', '独立なら追加'],
    invariant: ['異なる最高bit', 'span'],
    goal: ['最大XOR', 'rank', '表現判定'],
    priority: 79,
  },
  {
    id: 'tag-separable-linear-transform',
    name: '分離可能線形変換・Walsh–Hadamard変換',
    definition:
      'Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-factor-separable-linear-transform'],
    unitIds: ['unit-separable-linear-transform'],
    recall: ['Walsh.?Hadamard', '\\bWHT\\b', 'XOR convolution', 'Kronecker product'],
    object: ['tensor index', 'axis transform', 'XOR convolution'],
    trigger: ['各bit軸で同じ変換', 'XOR畳み込み'],
    invariant: ['separability', 'inverse scaling'],
    goal: ['高速線形変換', 'XOR convolution'],
    priority: 87,
  },
  {
    id: 'tag-matroid-greedy',
    name: 'matroid greedy',
    definition:
      '独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-optimize-weighted-matroid-basis'],
    unitIds: ['unit-matroid-greedy'],
    recall: ['matroid greedy', 'weighted matroid basis', 'マトロイド'],
    object: ['ground set', 'independence oracle', 'basis'],
    trigger: ['独立性を保って選ぶ', '交換公理'],
    invariant: ['augmentation property', 'rank'],
    goal: ['最小重み基底'],
    priority: 92,
  },
  {
    id: 'tag-linear-matroid-intersection',
    name: '線形matroid交差の乱択rank判定',
    definition:
      '二つの線形matroidの表現A₁,A₂からA₁diag(r)A₂ᵀを作り、有限体上の乱択rankを共通独立集合の最大sizeとして高確率で判定する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-linear-system-rank', 'tag-randomized-algorithm'],
    outcomeIds: ['outcome-test-linear-matroid-intersection-rank'],
    unitIds: ['unit-linear-matroid-intersection'],
    recall: [
      'linear matroid intersection',
      'randomized matroid intersection rank',
      '線形matroid交差',
    ],
    object: ['two linear matroids', 'representation matrices', 'common independent set'],
    trigger: ['二種類の線形独立性', 'graphic and partition matroid', '構成不要のintersection rank'],
    invariant: ['symbolic rank', 'Schwartz.?Zippel', 'common independent rank'],
    goal: ['最大共通独立size', 'intervalごとの存在判定'],
    priority: 100,
  },
  {
    id: 'tag-rsk-young-tableaux',
    name: 'Robinson–Schensted対応・Young tableau',
    definition:
      '順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-translate-sequences-by-rsk'],
    unitIds: ['unit-rsk-young-tableaux'],
    recall: ['Robinson.?Schensted', '\\bRSK\\b', 'Young tableau', 'Young diagram'],
    object: ['permutation', 'Young shape', 'tableau'],
    trigger: ['LISとLDSを同時制約', 'shapeで分類'],
    invariant: ['row/column増加', 'Schensted theorem'],
    goal: ['順列数え上げ', 'shape DP'],
    priority: 99,
  },
  {
    id: 'tag-deletion-contraction',
    name: '削除・縮約recurrence',
    definition:
      '辺を削除する場合と縮約する場合へ対象を分け、graph polynomialや連結構造のrecurrenceを立てる。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-recur-by-edge-deletion-contraction'],
    unitIds: ['unit-deletion-contraction'],
    recall: ['deletion.?contraction', '削除縮約', 'Tutte recurrence'],
    object: ['graph edge', 'graph polynomial', 'minor'],
    trigger: ['辺を使う/使わない', '縮約して同一視'],
    invariant: ['minor relation', 'base cases'],
    goal: ['graph polynomial recurrence'],
    priority: 91,
  },
  {
    id: 'tag-convex-boundary-hull',
    name: '凸包・支持方向・境界候補',
    definition:
      '内部点が線形/凸目的に不要なことを示し、orientation順で凸境界を構成して支持方向ごとの極値を得る。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-geometry-orientation-transform'],
    outcomeIds: ['outcome-restrict-geometric-candidates-to-boundary'],
    unitIds: ['unit-convex-boundary-hull'],
    recall: ['convex hull', 'support function', 'rotating calipers', '凸包'],
    object: ['点集合', '凸境界', '支持方向'],
    trigger: ['線形評価の極値', '内部候補を捨てる'],
    invariant: ['orientation', 'convex turn'],
    goal: ['境界列挙', '極値候補'],
    priority: 80,
  },
  {
    id: 'tag-half-plane-constraints',
    name: '半平面制約・凸領域の共通部分',
    definition:
      '向き付き直線の左側を線形不等式とし、平行制約を最強の境界へ集約して凸領域の包含・共通部分を扱う。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-geometry-orientation-transform'],
    outcomeIds: ['outcome-represent-convex-intersection-by-halfplanes'],
    unitIds: ['unit-half-plane-constraints'],
    recall: ['half-plane intersection', '半平面交差', 'linear inequalities geometry'],
    object: ['oriented line', 'half-plane', 'convex polygon'],
    trigger: ['全辺の左側', '平行移動後も包含'],
    invariant: ['法線方向', 'strongest parallel constraint'],
    goal: ['凸領域包含', '共通部分'],
    priority: 89,
  },
  {
    id: 'tag-basic-convex-optimization',
    name: '一次元凸・単峰最適化',
    definition:
      '差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。',
    parentId: 'tag-geometry-optimization-structure',
    outcomeIds: ['outcome-optimize-univariate-convex-function'],
    unitIds: ['unit-basic-convex-optimization'],
    recall: ['convex optimization', 'ternary search', 'unimodal', '凸関数'],
    object: ['one-variable objective', 'integer/real domain'],
    trigger: ['下に凸', '単峰', '二次費用'],
    invariant: ['単調な傾き', '局所=大域最適'],
    goal: ['最小点', '最大点'],
    priority: 61,
  },
  {
    id: 'tag-slope-trick',
    name: 'slope trick',
    definition:
      '区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-basic-convex-optimization'],
    outcomeIds: ['outcome-maintain-piecewise-linear-convex-function'],
    unitIds: ['unit-slope-trick'],
    recall: ['slope trick', 'スロープトリック', 'piecewise linear convex'],
    object: ['凸区分線形関数', 'breakpoints', 'slope'],
    trigger: ['絶対値costを順次追加', 'prefix minimum'],
    invariant: ['傾き単調', '左右heap balance'],
    goal: ['最小値', '最適解復元'],
    priority: 89,
  },
  {
    id: 'tag-lagrangian-relaxation',
    name: 'Lagrangian relaxation・Aliens trick',
    definition:
      '個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-basic-convex-optimization'],
    outcomeIds: ['outcome-optimize-by-lagrangian-relaxation'],
    unitIds: ['unit-lagrangian-relaxation'],
    recall: ['Lagrangian relaxation', 'Aliens trick', 'Aliens DP', 'ラグランジュ緩和'],
    object: ['cardinality constraint', 'penalty λ', 'optimization oracle'],
    trigger: ['ちょうどK個', '個数制約を外す'],
    invariant: ['離散凸性', '双対ギャップなし', '選択数の単調性', 'dual bound', 'tie break'],
    goal: ['制約付き最適値'],
    priority: 93,
  },
  {
    id: 'tag-monge-optimization',
    name: 'Monge・monotone minima最適化',
    definition:
      'quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。',
    parentId: 'tag-geometry-optimization-structure',
    outcomeIds: ['outcome-optimize-monge-transitions'],
    unitIds: ['unit-monge-optimization'],
    recall: ['Monge array', 'monotone minima', 'SMAWK', 'concave convolution'],
    object: ['cost matrix', 'DP transition', 'argmin'],
    trigger: ['四点不等式', 'concave max-plus convolution'],
    invariant: ['totally monotone', 'argmin monotonicity'],
    goal: ['遷移高速化', 'row minima'],
    priority: 94,
  },
  {
    id: 'tag-isotonic-regression-pav',
    name: 'isotonic regression・PAV',
    definition:
      '単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-basic-convex-optimization'],
    outcomeIds: ['outcome-solve-isotonic-regression-by-pav'],
    unitIds: ['unit-isotonic-regression'],
    recall: ['pool adjacent violators', '\\bPAV\\b', 'isotonic regression', '単調回帰'],
    object: ['ordered variables', 'convex losses', 'blocks'],
    trigger: ['x1<=x2<=...', '隣接最適値が逆転'],
    invariant: ['block optimum order', 'pooled sufficient statistic'],
    goal: ['単調制約最適化'],
    priority: 94,
  },
  {
    id: 'tag-separable-convex-marginals',
    name: '分離凸・凹の単調限界値選択',
    definition:
      '各対象の限界費用が単調増加（または限界利益が単調減少）することを使い、複数の限界値列から必要な上位・下位K項をpriority queue mergeまたは値の閾値計数で選ぶ。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-basic-convex-optimization'],
    outcomeIds: ['outcome-allocate-by-convex-marginal-costs'],
    unitIds: ['unit-separable-convex-marginals'],
    recall: [
      'marginal cost greedy',
      'monotone marginal selection',
      'separable convex allocation',
      '限界費用',
      '限界利益',
    ],
    object: [
      'resources',
      'separable convex costs',
      'separable concave rewards',
      'marginal sequence',
    ],
    trigger: ['一単位ずつ配る', '複数の単調列から上位K項', '離散凸', '離散凹'],
    invariant: ['限界値の単調性', 'k-way mergeまたは閾値別個数'],
    goal: ['最小配分費用', '最大総利益'],
    priority: 77,
  },
  {
    id: 'tag-dag-topological-processing',
    name: 'DAGのtopological processing',
    definition:
      '依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-process-dag-in-topological-order'],
    unitIds: ['unit-dag-topological-processing'],
    recall: ['topological sort', 'DAG scheduling', 'トポロジカルソート'],
    object: ['DAG', 'dependency', 'indegree'],
    trigger: ['依存順', '閉路なし', '前提を先に'],
    invariant: ['processed prefix has no incoming edge'],
    goal: ['順序構成', 'DAG伝播'],
    priority: 56,
  },
  {
    id: 'tag-directed-core-peeling',
    name: '有向cycle検出・sink/source peeling',
    definition:
      '三色DFSのrecursion stackまたは入次数・出次数零の反復削除により有向cycleを検出し、必要ならcycleへ到達するcoreと処理可能なDAG部分を分離する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-peel-directed-graph-toward-cycles'],
    unitIds: ['unit-directed-core-peeling'],
    recall: [
      'directed cycle detection',
      'three.?color DFS',
      'sink peeling',
      'source peeling',
      'Kahn elimination',
    ],
    object: ['directed graph', 'source/sink', 'cycle core'],
    trigger: ['有向cycleが一つでも存在', '出次数0を削除', 'cycleに残る頂点'],
    invariant: ['DFS recursion stack', 'remaining indegree/outdegree'],
    goal: ['cycle存在判定', 'cycle core', '削除順'],
    priority: 62,
  },
  {
    id: 'tag-monotone-path-contraction',
    name: '単調path contraction・DSU jump',
    definition:
      '一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-contract-monotone-paths-with-jump-pointers'],
    unitIds: ['unit-monotone-path-contraction'],
    recall: ['DSU jump', 'next unprocessed pointer', 'path compression jump'],
    object: ['path', 'next pointer', 'contracted vertices'],
    trigger: ['処理済み区間を飛ばす', '単調にmerge'],
    invariant: ['各頂点を一度だけ削除', '代表は次未処理'],
    goal: ['path更新高速化', '単調縮約'],
    priority: 72,
  },
  {
    id: 'tag-dsu-merge-tree',
    name: 'DSU merge tree・Kruskal reconstruction tree',
    definition:
      '成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。',
    parentId: 'tag-tree-model-structure',
    prerequisiteTagIds: ['tag-dsu-components'],
    outcomeIds: ['outcome-build-component-merge-tree'],
    unitIds: ['unit-dsu-merge-tree'],
    recall: ['DSU merge tree', 'Kruskal reconstruction tree', '統合木'],
    object: ['components', 'merge event', 'reconstruction tree'],
    trigger: ['閾値順に併合', '併合履歴をquery'],
    invariant: ['ancestor means component inclusion', 'merge timestamp'],
    goal: ['threshold connectivity', '履歴木DP'],
    priority: 85,
  },
  {
    id: 'tag-steiner-tree-dp',
    name: 'Steiner tree subset DP',
    definition:
      'terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-shortest-path', 'tag-subset-bitmask-dp'],
    outcomeIds: ['outcome-solve-steiner-tree-by-subset-dp'],
    unitIds: ['unit-steiner-tree-dp'],
    recall: ['Dreyfus.?Wagner', 'Steiner tree DP', 'シュタイナー木DP'],
    object: ['terminals', 'subset', 'meeting vertex'],
    trigger: ['少数terminalを連結', 'subset merge plus shortest path'],
    invariant: ['connected subgraph for mask ending at v'],
    goal: ['最小Steiner tree'],
    priority: 91,
  },
  {
    id: 'tag-dynamic-segment-tree',
    name: '動的・implicit Segment Tree',
    definition:
      '巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。',
    parentId: 'tag-query-sufficient-aggregate',
    prerequisiteTagIds: ['tag-range-monoid-aggregation'],
    outcomeIds: ['outcome-maintain-sparse-domain-segment-tree'],
    unitIds: ['unit-dynamic-segment-tree'],
    recall: ['dynamic segment tree', 'implicit segment tree', '疎Segment Tree'],
    object: ['large coordinate domain', 'allocated nodes', 'range summary'],
    trigger: ['座標域が巨大', 'onlineで座標出現'],
    invariant: ['未生成nodeは単位要約'],
    goal: ['疎な更新/query'],
    priority: 83,
  },
  {
    id: 'tag-segment-tree-beats',
    name: 'Segment Tree Beats',
    definition:
      'nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。',
    parentId: 'tag-query-sufficient-aggregate',
    prerequisiteTagIds: ['tag-range-monoid-aggregation'],
    outcomeIds: ['outcome-prune-range-actions-by-node-invariant'],
    unitIds: ['unit-segment-tree-beats'],
    recall: ['Segment Tree Beats', 'range chmin chmax'],
    object: ['range extrema', 'second extrema', 'lazy action'],
    trigger: ['range chmin/chmax', '値域更新'],
    invariant: ['最大値個数', '作用可能条件', 'potential decrease'],
    goal: ['非自明range update'],
    priority: 90,
  },
  {
    id: 'tag-parallel-binary-search',
    name: 'parallel binary search・多数境界の判定共有',
    definition:
      '多数queryの未知境界をmidごとにbucketし、更新を一方向に進める判定器を各roundで共有する。',
    parentId: 'tag-model-reduction',
    prerequisiteTagIds: ['tag-monotone-threshold-search'],
    outcomeIds: ['outcome-share-threshold-checks-by-parallel-binary-search'],
    unitIds: ['unit-parallel-binary-search'],
    recall: [
      'parallel binary search',
      '並列二分探索',
      'simultaneous binary search',
      'batched monotone search',
    ],
    object: ['many monotone queries', 'threshold events', 'shared checker'],
    trigger: ['queryごとに最小時刻', '判定器を共有'],
    invariant: ['各queryのlo/hi', 'event pointer monotone'],
    goal: ['全queryの境界'],
    priority: 80,
  },
  {
    id: 'tag-planar-duality',
    name: '平面graph双対・cut/path対応',
    definition:
      '埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-dualize-planar-cut-to-path'],
    unitIds: ['unit-planar-duality'],
    recall: ['planar dual graph', '平面双対', 'cut path duality'],
    object: ['plane embedding', 'faces', 'dual edges'],
    trigger: ['平面gridのcut', 'outer face'],
    invariant: ['primal edge dual correspondence'],
    goal: ['cutをpathへ変換'],
    priority: 92,
  },
  {
    id: 'tag-bitwise-greedy-feasibility',
    name: 'bitwise greedyによるmask最適化',
    definition:
      '上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-optimize-mask-by-bitwise-feasibility'],
    unitIds: ['unit-bitwise-greedy-feasibility'],
    recall: ['bitwise greedy', 'mask feasibility greedy', '上位bitから貪欲'],
    object: ['bitmask objective', 'feasibility oracle'],
    trigger: ['AND/OR/XOR値を最適化', '上位bit優先'],
    invariant: ['prefix bits fixed', 'oracle monotonicity'],
    goal: ['最適mask'],
    priority: 74,
  },
  {
    id: 'tag-string-periodicity',
    name: '文字列周期・primitive word',
    definition:
      'prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-normalize-string-to-primitive-period'],
    unitIds: ['unit-string-periodicity'],
    recall: ['primitive word', 'string period', 'minimal period', '原始語'],
    object: ['string', 'period', 'primitive root'],
    trigger: ['同じblockの反復', '最小周期'],
    invariant: ['period divides length', 'border relation'],
    goal: ['primitive word', '周期正規化'],
    priority: 75,
  },
  {
    id: 'tag-run-length-dynamics',
    name: 'run-length状態の動的遷移',
    definition:
      '同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。',
    parentId: 'tag-string-state-representation',
    outcomeIds: ['outcome-evolve-run-length-encoded-state'],
    unitIds: ['unit-run-length-dynamics'],
    recall: ['run-length dynamics', 'RLE state', 'run merge split'],
    object: ['runs', 'symbol', 'run length'],
    trigger: ['同じ値の連続block', '局所操作でrunが変化'],
    invariant: ['隣接runは異値', '最大圧縮'],
    goal: ['圧縮状態simulation'],
    priority: 70,
  },
  {
    id: 'tag-min25-sieve',
    name: 'Min_25・Lucy DP型の総和篩',
    definition:
      'floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-prime-divisor-decomposition'],
    outcomeIds: ['outcome-sum-multiplicative-function-by-min25-sieve'],
    unitIds: ['unit-min25-sieve'],
    recall: ['Min_25 sieve', 'Lucy DP', 'summatory multiplicative function'],
    object: ['multiplicative function', 'prime powers', 'quotient blocks'],
    trigger: ['Nまでの乗法的関数和', 'Nが大きい'],
    invariant: ['floor quotient states', 'smallest prime factor'],
    goal: ['prefix sum of multiplicative function'],
    priority: 98,
  },
  {
    id: 'tag-gaussian-integers-two-squares',
    name: 'Gaussian整数・二平方和',
    definition:
      'Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。',
    parentId: 'tag-number-theory-structure',
    prerequisiteTagIds: ['tag-prime-divisor-decomposition'],
    outcomeIds: ['outcome-represent-integers-as-two-squares'],
    unitIds: ['unit-gaussian-integers-two-squares'],
    recall: ['Gaussian integers', 'sum of two squares', '二平方和'],
    object: [escapeRegexLiteral('a+bi'), 'norm', 'prime factorization'],
    trigger: [escapeRegexLiteral('x^2+y^2=n'), '複素整数で因数分解'],
    invariant: ['multiplicative norm', 'conjugate factors'],
    goal: ['二平方和表現'],
    priority: 98,
  },
  {
    id: 'tag-prufer-code',
    name: 'Prüfer code・次数制約付きlabel木',
    definition:
      'label付き木を長さN-2の列へ全単射し、頂点の出現回数=次数-1として次数条件を独立な係数条件へ変換する。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-combinatorial-coefficients'],
    outcomeIds: ['outcome-encode-labeled-trees-by-prufer-code'],
    unitIds: ['unit-prufer-code'],
    recall: ['Prüfer code', 'Prufer sequence', '次数制約付き木'],
    object: ['label付き木', '次数列', '長さN-2の列'],
    trigger: ['各頂点の次数条件', 'label付き木を数える'],
    invariant: ['出現回数=次数-1', '木との全単射'],
    goal: ['次数制約付き木の数え上げ'],
    priority: 94,
  },
  {
    id: 'tag-directed-walk-periodicity',
    name: '有向walkの周期・cycle差分gcd',
    definition:
      '往復可能領域でedgeごとのdepth差を集め、そのgcdをclosed walk長の周期として巨大歩数の到達可能性を判定する。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-scc-condensation', 'tag-gcd-structure'],
    outcomeIds: ['outcome-compute-directed-walk-period'],
    unitIds: ['unit-directed-walk-periodicity'],
    recall: ['directed graph period', 'cycle length gcd', '有向walkの周期'],
    object: ['strongly connected region', 'closed walk', 'depth difference'],
    trigger: ['巨大回数のwalk', '戻れる歩数の合同類'],
    invariant: ['cycle差分のgcd', 'eventual periodicity'],
    goal: ['walk長到達可能性', 'graph period'],
    priority: 92,
  },
  {
    id: 'tag-reflection-principle',
    name: '鏡像法・reflection principle',
    definition:
      '境界を初めて破るpathを鏡像pathへ写す符号付き全単射により、壁付きwalkを無境界または巡回畳み込みへ変換する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-remove-boundaries-by-reflection'],
    unitIds: ['unit-reflection-principle'],
    recall: ['reflection principle', 'mirror method', '鏡像法'],
    object: ['lattice path', 'absorbing boundary', 'reflected path'],
    trigger: ['壁を越えないwalk', '境界条件を消す'],
    invariant: ['first boundary crossing', '符号付き全単射'],
    goal: ['境界付き数え上げ', '巡回化'],
    priority: 91,
  },
  {
    id: 'tag-labeled-component-decomposition',
    name: 'label付き連結成分分解・exponential formula',
    definition:
      'rootを含む連結成分または成分集合を一意に切り出し、全構造とconnected構造の関係をsubset DPや指数型母関数で解く。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-count-labeled-structures-by-components'],
    unitIds: ['unit-labeled-component-decomposition'],
    recall: ['exponential formula', 'connected component DP', 'labelled connected structures'],
    object: ['label付き構造', 'connected component', 'root component'],
    trigger: ['連結なものだけ数える', '成分集合へ分解'],
    invariant: ['最小labelを含む成分の一意性', 'SET of connected components'],
    goal: ['connected構造の数え上げ', '成分数別集計'],
    priority: 93,
  },
  {
    id: 'tag-fractional-parametric-search',
    name: 'fractional programming・比率parametric search',
    definition:
      '比率目標xに対して各寄与をbenefit-x·costへ変換し、和が非負かという単調な加法最適化へ帰着する。',
    parentId: 'tag-geometry-optimization-structure',
    prerequisiteTagIds: ['tag-monotone-threshold-search'],
    outcomeIds: ['outcome-optimize-ratio-by-parametric-search'],
    unitIds: ['unit-fractional-parametric-search'],
    recall: ['fractional programming', 'parametric search for ratio', '比率最適化'],
    object: ['benefit/cost ratio', 'parameter x', 'additive objective'],
    trigger: ['比の最大最小', '平均値の最適化'],
    invariant: ['benefit-x·cost', 'feasibility monotonicity'],
    goal: ['最適比率', '最大平均'],
    priority: 89,
  },
  {
    id: 'tag-information-theoretic-query-design',
    name: '情報量下界・query符号設計',
    definition:
      '応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-design-query-code-by-information-bound'],
    unitIds: ['unit-information-theoretic-query-design'],
    recall: ['information lower bound', 'binary incidence code', '情報量下界'],
    object: ['hidden state', 'query response', 'codeword'],
    trigger: ['最小query数', '全候補を一意に識別'],
    invariant: ['response strings are distinct', escapeRegexLiteral('alphabet^queries >= states')],
    goal: ['最適query設計', '一意復号'],
    priority: 84,
  },
  {
    id: 'tag-cyclic-order-crossing',
    name: '円環順序・chord交差',
    definition:
      '円周上の端点順をcutで線形化し、二chordの端点交互配置またはlaminar括弧構造として交差を判定・数え上げる。',
    parentId: 'tag-geometry-optimization-structure',
    outcomeIds: ['outcome-detect-crossing-by-cyclic-order'],
    unitIds: ['unit-cyclic-order-crossing'],
    recall: ['circular order', 'chord crossing', '端点交互配置'],
    object: ['circle endpoints', 'chords', 'laminar intervals'],
    trigger: ['円周上の線分交差', '円環をcut'],
    invariant: ['alternating endpoints', 'properly nested intervals'],
    goal: ['交差判定', '交差数え上げ'],
    priority: 82,
  },
  {
    id: 'tag-kinetic-order-maintenance',
    name: 'kinetic sorting・交差event順序更新',
    definition:
      '連続parameterで隣接要素の順序が入れ替わる時刻だけをevent化し、次の有効交差を処理して全順序を更新する。',
    parentId: 'tag-model-reduction',
    prerequisiteTagIds: ['tag-event-sweep'],
    outcomeIds: ['outcome-maintain-order-through-crossing-events'],
    unitIds: ['unit-kinetic-order-maintenance'],
    recall: ['kinetic sorting', 'kinetic tournament', '交差event'],
    object: ['moving order', 'adjacent pair', 'crossing time'],
    trigger: ['parameterとともに順序が変化', '全pairを列挙できない'],
    invariant: ['next valid adjacent crossing', 'local swap'],
    goal: ['時間変化する順位', '交差集計'],
    priority: 94,
  },
  {
    id: 'tag-poset-dilworth-antichain',
    name: '半順序・Dilworth・最大反鎖',
    definition:
      '比較可能性をposetとして明示し、antichain・chain cover・LDS・bipartite matching/min-cutの双対関係を選んで最適化する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-optimize-poset-antichain-by-dilworth'],
    unitIds: ['unit-poset-dilworth-antichain'],
    recall: ['Dilworth theorem', 'maximum antichain', 'minimum chain cover'],
    object: ['partially ordered set', 'chain', 'antichain'],
    trigger: ['包含関係', '先後制約', '比較不能集合'],
    invariant: ['max antichain=min chain cover', 'comparability DAG'],
    goal: ['最大反鎖', '最小chain分割'],
    priority: 93,
  },
  {
    id: 'tag-tree-precedence-contraction',
    name: '01 on Tree・親先行順序のcluster縮約',
    definition:
      '親が子より先という順序制約の下でclusterの交換比較量を導き、priority queueとDSUで最良clusterを親へ縮約する。',
    parentId: 'tag-tree-model-structure',
    prerequisiteTagIds: ['tag-greedy-exchange-order', 'tag-dsu-components'],
    outcomeIds: ['outcome-optimize-tree-order-by-cluster-contraction'],
    unitIds: ['unit-tree-precedence-contraction'],
    recall: ['01 on Tree', 'tree precedence scheduling', 'cluster contraction'],
    object: ['rooted tree precedence', 'cluster statistics', 'parent merge'],
    trigger: ['親を子より先に並べる', '期待探索順'],
    invariant: ['pairwise exchange ratio', 'contracted parent relation'],
    goal: ['制約付き最適順序'],
    priority: 96,
  },
  {
    id: 'tag-frontier-profile-dp',
    name: 'frontier/profile DP・境界状態圧縮',
    definition:
      '走査済み領域と未走査領域の境界だけに未来へ影響する色・値の使用済みフラグ・接続partitionを保持し、必要なら同値な接続ラベルを正規化して幅指数で遷移する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-dp-state-equivalence'],
    outcomeIds: ['outcome-design-frontier-profile-dp'],
    unitIds: ['unit-frontier-profile-dp'],
    recall: ['frontier DP', 'profile DP', 'plug DP'],
    object: [
      'grid sweep frontier',
      'connectivity partition',
      'profile mask',
      '帯状matchingの使用済み値',
    ],
    trigger: ['一辺だけ小さい盤面', '局所制約と全体連結性', '対角近傍に限られる許可辺'],
    invariant: ['future interface only', 'closed component condition', '窓外の使用済み値を忘れる'],
    goal: ['幅指数DP', '盤面数え上げ', '帯状部分matchingの計数'],
    priority: 90,
  },
  {
    id: 'tag-semiring-matrix-exponentiation',
    name: '半環行列・min-plus/max-min遷移',
    definition:
      '遷移の結合と候補選択を半環の積・和として行列化し、結合則を使って固定長walkを二分累乗または区間積で処理する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-exponentiate-transition-over-semiring'],
    unitIds: ['unit-semiring-matrix-exponentiation'],
    recall: ['semiring matrix', 'min-plus matrix', 'max-min matrix'],
    object: ['transition matrix', 'semiring', 'fixed-length walk'],
    trigger: ['ちょうどK回の遷移', 'min-plus/max-min composition'],
    invariant: ['associative matrix product', 'semiring identity'],
    goal: ['巨大回数遷移', '固定長path最適化'],
    priority: 91,
  },
  {
    id: 'tag-monoid-exponentiation',
    name: 'monoid exponentiation・連結演算doubling',
    definition:
      '長さ・値・補助剰余を含む要約の結合則と単位元を定義し、巨大な反復連結を二分累乗する。',
    parentId: 'tag-combinatorics-algebra-structure',
    outcomeIds: ['outcome-exponentiate-associative-composition'],
    unitIds: ['unit-monoid-exponentiation'],
    recall: ['monoid exponentiation', 'concatenation doubling', '連結演算のdoubling'],
    object: ['associative summary', 'concatenation', 'binary power'],
    trigger: ['同じblockを巨大回反復', '値を構築せず連結'],
    invariant: ['associativity', 'summary is closed under concatenation'],
    goal: ['反復連結の評価'],
    priority: 87,
  },
  {
    id: 'tag-additive-tree-metric-reconstruction',
    name: '加法的tree metric復元',
    definition:
      '全点対距離行列の加法性から葉の接続先とedge長を決め、候補木の全距離を再計算して存在を完全検証する。',
    parentId: 'tag-tree-model-structure',
    outcomeIds: ['outcome-reconstruct-tree-from-distance-matrix'],
    unitIds: ['unit-additive-tree-metric-reconstruction'],
    recall: ['additive tree metric', 'tree reconstruction from distances', '距離行列から木復元'],
    object: ['distance matrix', 'weighted tree', 'leaf attachment'],
    trigger: ['全点対距離から木を復元', 'additive metric'],
    invariant: ['path distance additivity', 'positive edge lengths'],
    goal: ['木の復元', '存在判定'],
    priority: 95,
  },
  {
    id: 'tag-graph-potential-propagation',
    name: '静的graph等式制約のpotential伝播',
    definition:
      '可逆な加法・XOR演算で x_v=x_u⊙w と書ける辺等式をDFS/BFSで伝播し、cycle整合性を検査して各連結成分の解をroot offset一つで表す。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-propagate-static-graph-potentials'],
    unitIds: ['unit-graph-potential-propagation'],
    recall: ['graph potential', 'potential.?DFS', 'xor potential graph', '差分等式.*DFS'],
    object: ['辺等式制約', '加法群またはXOR群', 'root-relative potential'],
    trigger: ['x_v=x_u⊙w', '全制約が静的', '成分ごとの自由offset'],
    invariant: ['path potential', 'cycle consistency', 'component-wide offset'],
    goal: ['可解性判定', '相対値復元', '成分offsetの最適化'],
    exclude: ['online union/query', '不等式の上界', 'negative cycle'],
    priority: 86,
  },
  {
    id: 'tag-difference-constraints',
    name: 'difference constraints・不等式系の最短路化',
    definition:
      '差の上界 x_v-x_u≤c を有向辺 u→v の重みcへ写し、Bellman–Ford等の緩和と負閉路から可解性・極値・具体解を求める。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-shortest-path'],
    outcomeIds: ['outcome-solve-difference-constraints'],
    unitIds: ['unit-difference-constraints'],
    recall: ['difference constraints', '差分制約', '差の不等式', 'negative cycle constraints'],
    object: ['variables', 'x_v-x_u<=c', 'constraint graph'],
    trigger: ['差の上界または下界', 'prefix sum inequality', '整数列の区間個数制約'],
    invariant: ['edge relaxation preserves every upper bound', 'negative cycle iff infeasible'],
    goal: ['可解性判定', '変数の極値', '制約を満たす列の構成'],
    exclude: ['等式だけのpotential伝播', 'online union/query'],
    priority: 93,
  },
  {
    id: 'tag-kruskal-threshold-sweep',
    name: 'Kruskal順の閾値DSU sweep',
    definition:
      '辺とqueryを重み順に並べ、同重みの処理順を明示してDSU成分とmetadataを更新し、二点が初めて連結するminimax閾値で判定・pairing・集計を行う。',
    parentId: 'tag-graph-model-structure',
    prerequisiteTagIds: ['tag-dsu-components'],
    outcomeIds: ['outcome-sweep-connectivity-by-kruskal-threshold'],
    unitIds: ['unit-kruskal-threshold-sweep'],
    recall: [
      'Kruskal sweep',
      'weight-sorted offline connectivity sweep',
      '重み順Union-Find',
      'minimax threshold',
    ],
    object: ['weighted undirected graph', 'threshold components', 'component metadata'],
    trigger: ['重みw未満または以下で連結', '最初に連結する時刻', '成分併合時に需要を相殺'],
    invariant: ['processed edges equal the threshold subgraph', 'merge time is minimax distance'],
    goal: ['MST採用可能性', '閾値別連結判定', '最早可能なcomponent pairing'],
    exclude: ['再構成木を明示して後からquery', '単にMST重みを求めるだけ'],
    priority: 93,
  },
  {
    id: 'tag-path-matching-contraction',
    name: 'path matchingのheap縮約greedy',
    definition:
      'pathの非隣接edgeからk本を選ぶ最小重みmatchingを、最小edgeの採用と近傍二辺の補正縮約 w_l+w_r-w_i により全cardinalityについて順に求める。',
    parentId: 'tag-graph-model-structure',
    outcomeIds: ['outcome-optimize-path-matching-by-contraction'],
    unitIds: ['unit-path-matching-contraction'],
    recall: ['path matching contraction', 'minimum k-matching on a path', '非隣接選択.*heap縮約'],
    object: ['weighted path edges', 'nonadjacent selection', 'linked alive edges'],
    trigger: ['pathから隣接しないk辺', '全kの最小費用', '最小辺を選んで近傍を縮約'],
    invariant: [
      '補正edge preserves every remaining optimum',
      'selected prefix is optimal by cardinality',
    ],
    goal: ['cardinality別最小matching費用'],
    priority: 99,
  },
  {
    id: 'tag-eventual-unbounded-knapsack',
    name: '大容量unbounded knapsackのeventual linearity',
    definition:
      '最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-knapsack-resource'],
    outcomeIds: ['outcome-stabilize-unbounded-knapsack-by-best-density'],
    unitIds: ['unit-eventual-unbounded-knapsack'],
    recall: [
      'large-capacity unbounded knapsack',
      'eventual linearity knapsack',
      'best density item',
    ],
    object: ['unbounded items', 'huge capacity', 'small integer weights'],
    trigger: ['capacityがDP不能に大きい', 'best value/weight item', '非基準itemを有限回へ交換'],
    invariant: ['prefix residue collision', 'non-best total weight is bounded', 'linear tail'],
    goal: ['巨大capacityの最大価値'],
    priority: 97,
  },
  {
    id: 'tag-backtracking-search',
    name: 'backtracking・可逆な探索状態',
    definition:
      '再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。',
    parentId: 'tag-model-reduction',
    outcomeIds: ['outcome-enumerate-by-reversible-backtracking'],
    unitIds: ['unit-backtracking-search'],
    recall: ['backtracking', 'mark and unmark DFS', 'バックトラック'],
    object: ['search tree', 'current path', 'used set'],
    trigger: ['単純pathを列挙', '選択を戻して別branch'],
    invariant: ['used means current recursion path', 'push/pop symmetry'],
    goal: ['制約付き列挙', '解候補探索'],
    priority: 78,
  },
  {
    id: 'tag-dp-prefix-partition',
    name: 'prefix分割DP',
    definition: '列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-dp-state-equivalence'],
    outcomeIds: ['outcome-design-prefix-partition-dp'],
    unitIds: ['unit-dp-prefix-partition'],
    recall: ['prefix分割DP', '最後のブロック', 'batch DP'],
    object: ['prefix', '連続ブロック', '切れ目'],
    trigger: ['最後の区間を固定', '到着順にまとめる', '分割を数える'],
    invariant: ['処理済みprefix', '最後の切れ目の一意性'],
    goal: ['分割の最適値', '分割数'],
    priority: 80,
  },
  {
    id: 'tag-dp-interval-expansion',
    name: '区間拡張DP',
    definition: '訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-dp-state-equivalence'],
    outcomeIds: ['outcome-design-interval-expansion-dp'],
    unitIds: ['unit-dp-interval-expansion'],
    recall: ['区間拡張DP', 'visited interval', 'endpoint DP'],
    object: ['数直線', '訪問済み区間', '左右の端'],
    trigger: ['未訪問の隣点', '鍵と壁', '移動と時間損失'],
    invariant: ['訪問済み範囲の連続性', '区間長の増加'],
    goal: ['最短移動', '最大回収価値'],
    priority: 80,
  },
  {
    id: 'tag-lis-state',
    name: 'LIS・末尾の支配関係',
    definition:
      '同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-sequence-subsequence-dp'],
    outcomeIds: ['outcome-design-lis-frontier'],
    unitIds: ['unit-dp-lis'],
    recall: ['LIS', 'tails', '最小末尾', 'patience sorting'],
    object: ['部分列', '末尾', '二次元順序'],
    trigger: ['順序を保って延長', '末尾の大小で支配'],
    invariant: ['長さ別最小末尾', '末尾の支配関係'],
    goal: ['最長部分列', '最適解への所属', '復元'],
    priority: 80,
  },
  {
    id: 'tag-value-range-dp',
    name: '値域集約による部分列DP',
    definition:
      '末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。',
    parentId: 'tag-dp-state-transition',
    prerequisiteTagIds: ['tag-sequence-subsequence-dp', 'tag-range-monoid-aggregation'],
    outcomeIds: ['outcome-aggregate-subsequence-transitions-by-value'],
    unitIds: ['unit-dp-value-range'],
    recall: ['値域DP', '値別最良長', 'Segment Tree上のDP'],
    object: ['部分列', '直前値', '値域'],
    trigger: ['直前値を範囲制約', '値ごとの最適値'],
    invariant: ['処理済みprefixの値別最良状態', '許容区間の集約'],
    goal: ['最長部分列', '範囲遷移の高速化'],
    priority: 80,
  },
  {
    id: 'tag-generating-function-coefficients',
    name: '母関数方程式・高度な係数抽出',
    definition:
      '暗黙方程式の反転、微分恒等式の係数比較、Euler積の疎な展開を使い分け、必要次数の係数を求める。',
    parentId: 'tag-combinatorics-algebra-structure',
    prerequisiteTagIds: ['tag-generating-functions'],
    outcomeIds: [
      'outcome-invert-generating-function-equation',
      'outcome-derive-coefficient-recurrence-by-differentiation',
      'outcome-expand-euler-product-sparsely',
    ],
    unitIds: ['unit-generating-function-coefficients'],
    recall: ['Lagrange反転', '対数微分', 'Euler積', '五角数定理'],
    object: ['暗黙母関数', '係数列', '形式的無限積'],
    trigger: [escapeRegexLiteral('F=xΦ(F)'), '微分恒等式', 'partitionの積'],
    invariant: ['形式的係数一致', '必要次数より先の項の不寄与'],
    goal: ['係数漸化式', '疎な係数抽出'],
    priority: 80,
  },
];

const refinedLegacyTagSeeds = TAG_SEEDS.filter((seed) => !RETIRED_COARSE_TAG_IDS.has(seed.id)).map(
  (seed): TagSeed => ({
    ...seed,
    parentId: FINAL_TAG_PARENT_OVERRIDES[seed.id] ?? seed.parentId,
    unitIds: FINAL_TAG_UNIT_OVERRIDES[seed.id] ?? seed.unitIds,
  }),
);

const REFINED_TAG_REPRESENTATIVE_PROBLEM_IDS: Readonly<Record<string, readonly string[]>> = {
  'tag-conway-number-games': ['abc229-h', 'abc265-ex'],
  'tag-cyclic-minimax-game': ['abc261-ex', 'abc413-f'],
  'tag-heavy-light-recursive-dp': ['abc311-ex'],
  'tag-stern-brocot-ancestry': ['abc273-ex'],
  'tag-bitwise-minimax-partition': ['abc281-f'],
  'tag-tree-model-structure': ['abc220-f', 'abc239-e'],
  'tag-number-theory-structure': ['abc222-g', 'abc254-f'],
  'tag-combinatorics-algebra-structure': ['abc230-h', 'abc276-ex'],
  'tag-geometry-optimization-structure': ['abc251-g', 'abc257-ex'],
  'tag-state-normalization': ['abc242-e', 'abc296-f'],
  'tag-group-action-orbit-counting': ['abc284-ex', 'abc428-g'],
  'tag-meet-in-the-middle': ['abc271-f', 'abc300-g'],
  'tag-baby-step-giant-step': ['abc270-g'],
  'tag-recursive-divide-and-conquer': ['abc282-ex', 'abc304-g'],
  'tag-amortized-monotone-progress': ['abc217-e', 'abc256-ex'],
  'tag-small-to-large': ['abc324-g', 'abc329-f'],
  'tag-threshold-heavy-light': ['abc219-g', 'abc335-f'],
  'tag-heavy-path-tree-dp': ['abc269-ex'],
  'tag-subset-bitmask-dp': ['abc232-f', 'abc301-e'],
  'tag-subset-zeta-mobius-transform': ['abc295-ex', 'abc349-f'],
  'tag-subset-convolution': ['abc294-ex'],
  'tag-directional-grid-effect-scan': ['abc317-e'],
  'tag-state-graph-search': ['abc302-f', 'abc427-e'],
  'tag-transitive-closure': ['abc287-ex', 'abc292-e'],
  'tag-scc-condensation': ['abc214-h', 'abc306-g'],
  'tag-two-sat': ['abc277-ex'],
  'tag-functional-graph-decomposition': ['abc357-e', 'abc387-f'],
  'tag-binary-lifting': ['abc310-g', 'abc438-e'],
  'tag-dsu-components': ['abc235-e', 'abc408-e'],
  'tag-potential-dsu': ['abc328-f', 'abc466-g'],
  'tag-rooted-tree-aggregation': ['abc239-e', 'abc394-f'],
  'tag-rerooting': ['abc220-f', 'abc223-g'],
  'tag-laminar-interval-containment-tree': ['abc405-f'],
  'tag-tree-ancestor-lca': ['abc298-ex', 'abc405-f'],
  'tag-tree-euler-flattening': ['abc240-e', 'abc294-g', 'abc406-f'],
  'tag-heavy-light-decomposition': ['abc351-g'],
  'tag-virtual-tree': ['abc340-g'],
  'tag-max-flow-min-cut': ['abc241-g', 'abc225-g', 'abc239-g'],
  'tag-flow-feasibility-lower-bounds': ['abc285-g'],
  'tag-bipartite-matching-hall': ['abc274-g', 'abc401-g'],
  'tag-min-cost-flow': ['abc214-h', 'abc407-g'],
  'tag-weighted-bipartite-matching': ['abc373-g'],
  'tag-min-weight-general-perfect-matching': ['abc412-g'],
  'tag-euler-trail-circuit': ['abc227-h', 'abc286-g'],
  'tag-degree-parity-subgraph': ['abc345-f'],
  'tag-euler-circuit-counting': ['abc336-g'],
  'tag-cycle-space-basis': ['abc419-g'],
  'tag-graph-core-peeling': ['abc226-e', 'abc266-f', 'abc267-e'],
  'tag-near-tree-kernelization': ['abc419-g'],
  'tag-range-monoid-aggregation': ['abc223-f', 'abc343-f'],
  'tag-segment-tree-canonical-decomposition': ['abc342-g', 'abc414-g'],
  'tag-static-sorted-range-index': ['abc339-g'],
  'tag-idempotent-overlap-range-query': ['abc282-f', 'abc282-ex'],
  'tag-swag': ['abc456-f'],
  'tag-finite-function-composition': ['abc261-e'],
  'tag-priority-queue-best-first': ['abc297-e', 'abc391-f'],
  'tag-ordered-set-multiset': ['abc281-e', 'abc306-e'],
  'tag-ordered-interval-partition': ['abc255-ex', 'abc380-e'],
  'tag-persistence': ['abc273-e', 'abc453-g'],
  'tag-rollback': ['abc302-ex', 'abc363-g'],
  'tag-z-algorithm-prefix-matching': ['abc257-g', 'abc284-f'],
  'tag-finite-pattern-automaton': ['abc305-g', 'abc418-g'],
  'tag-automaton-subset-construction': ['abc228-g'],
  'tag-aho-corasick': ['abc419-f', 'abc458-f'],
  'tag-automaton-dp': ['abc305-g', 'abc418-g'],
  'tag-suffix-automaton': ['abc433-g'],
  'tag-sequence-fingerprint': ['abc274-ex', 'abc331-f'],
  'tag-randomized-algebraic-fingerprint': ['abc238-g', 'abc339-f'],
  'tag-modular-congruence-crt': ['abc245-ex', 'abc286-f'],
  'tag-modular-periodicity': ['abc228-e', 'abc319-e'],
  'tag-bezout-diophantine': ['abc271-ex', 'abc459-g'],
  'tag-gcd-structure': ['abc254-f', 'abc438-g'],
  'tag-numerical-semigroup': ['abc388-f'],
  'tag-rational-approximation': ['abc333-g', 'abc408-g'],
  'tag-cyclic-exponent-counting': ['abc212-g', 'abc335-g'],
  'tag-multiplicative-order': ['abc222-g', 'abc335-g'],
  'tag-finite-field-frobenius': ['abc251-ex'],
  'tag-inclusion-exclusion': ['abc246-f', 'abc462-g'],
  'tag-divisor-mobius-inversion': ['abc230-g', 'abc361-f'],
  'tag-convolution': ['abc307-ex', 'abc392-g'],
  'tag-generating-functions': ['abc225-h', 'abc385-g'],
  'tag-formal-power-series': ['abc318-ex', 'abc387-g'],
  'tag-polynomial-multipoint-evaluation': ['abc272-ex', 'abc381-g'],
  'tag-polynomial-taylor-shift': ['abc323-g'],
  'tag-fps-composition-power-projection': ['abc387-g', 'abc439-g'],
  'tag-bostan-mori': ['abc300-ex'],
  'tag-relaxed-convolution': ['abc213-h', 'abc315-ex', 'abc230-h'],
  'tag-linear-system-rank': ['abc276-ex', 'abc366-g'],
  'tag-xor-linear-basis': ['abc223-h', 'abc249-g'],
  'tag-separable-linear-transform': ['abc220-h', 'abc288-g', 'abc367-g'],
  'tag-matroid-greedy': ['abc236-f'],
  'tag-linear-matroid-intersection': ['abc399-g'],
  'tag-rsk-young-tableaux': ['abc378-g'],
  'tag-deletion-contraction': ['abc294-ex'],
  'tag-convex-boundary-hull': ['abc257-ex', 'abc341-g'],
  'tag-half-plane-constraints': ['abc251-g'],
  'tag-basic-convex-optimization': ['abc224-g', 'abc314-ex'],
  'tag-slope-trick': ['abc217-h', 'abc406-g'],
  'tag-lagrangian-relaxation': ['abc305-ex', 'abc400-g'],
  'tag-monge-optimization': ['abc348-g', 'abc383-g'],
  'tag-isotonic-regression-pav': ['abc459-f'],
  'tag-separable-convex-marginals': ['abc216-e', 'abc359-f', 'abc389-e'],
  'tag-dag-topological-processing': ['abc304-ex', 'abc315-e'],
  'tag-directed-core-peeling': ['abc245-f', 'abc456-e'],
  'tag-monotone-path-contraction': ['abc295-g'],
  'tag-dsu-merge-tree': ['abc235-ex', 'abc314-f'],
  'tag-steiner-tree-dp': ['abc364-g', 'abc395-g'],
  'tag-dynamic-segment-tree': ['abc403-g'],
  'tag-segment-tree-beats': ['abc430-g'],
  'tag-parallel-binary-search': ['abc233-ex', 'abc394-g'],
  'tag-planar-duality': ['abc413-g'],
  'tag-bitwise-greedy-feasibility': ['abc408-e'],
  'tag-string-periodicity': ['abc312-ex'],
  'tag-run-length-dynamics': ['abc313-e'],
  'tag-min25-sieve': ['abc370-g'],
  'tag-gaussian-integers-two-squares': ['abc444-g'],
  'tag-prufer-code': ['abc303-ex'],
  'tag-directed-walk-periodicity': ['abc306-g'],
  'tag-reflection-principle': ['abc309-ex'],
  'tag-labeled-component-decomposition': ['abc213-g', 'abc321-g', 'abc327-g'],
  'tag-fractional-parametric-search': ['abc236-e', 'abc324-f', 'abc294-f'],
  'tag-information-theoretic-query-design': ['abc337-e'],
  'tag-cyclic-order-crossing': ['abc263-ex', 'abc338-e', 'abc424-f'],
  'tag-kinetic-order-maintenance': ['abc344-g', 'abc257-ex'],
  'tag-poset-dilworth-antichain': ['abc237-ex', 'abc354-g', 'abc457-g'],
  'tag-tree-precedence-contraction': ['abc376-g'],
  'tag-frontier-profile-dp': ['abc248-f', 'abc379-g', 'abc309-g', 'abc296-ex'],
  'tag-euclidean-floor-sum': ['abc443-g', 'abc283-ex', 'abc402-g'],
  'tag-value-bucket-aggregation': ['abc405-g'],
  'tag-additive-expectation-potential': ['abc249-ex'],
  'tag-semiring-matrix-exponentiation': ['abc236-g', 'abc429-f', 'abc445-f'],
  'tag-monoid-exponentiation': ['abc448-e'],
  'tag-additive-tree-metric-reconstruction': ['abc451-e'],
  'tag-graph-potential-propagation': ['abc352-f', 'abc396-e'],
  'tag-difference-constraints': ['abc216-g', 'abc404-g'],
  'tag-kruskal-threshold-sweep': ['abc235-e', 'abc250-ex', 'abc301-ex', 'abc383-e'],
  'tag-path-matching-contraction': ['abc464-g', 'abc218-h'],
  'tag-eventual-unbounded-knapsack': ['abc415-g', 'abc310-ex'],
  'tag-backtracking-search': ['abc284-e', 'abc419-g'],
};

export const FINAL_TAXONOMY_TAGS: readonly FinalTaxonomyTagPolicy[] = [
  ...refinedLegacyTagSeeds,
  ...REFINED_TAG_SEEDS,
].map((seed) => {
  const representativeProblemIds =
    seed.representativeProblemIds ?? REFINED_TAG_REPRESENTATIVE_PROBLEM_IDS[seed.id];
  const prerequisiteTagIds = [
    ...new Set([
      ...(FINAL_TAG_CURRICULUM_PREREQUISITE_OVERRIDES[seed.id] ?? seed.prerequisiteTagIds ?? []),
      ...(FINAL_TAG_CURRICULUM_PREREQUISITE_ADDITIONS[seed.id] ?? []),
    ]),
  ].sort();
  return defineTag({
    ...seed,
    prerequisiteTagIds,
    ...(representativeProblemIds === undefined ? {} : { representativeProblemIds }),
  });
});

export const NON_PRIMARY_TAG_IDS = FINAL_TAXONOMY_TAGS.filter((tag) => !tag.primaryEligible).map(
  (tag) => tag.id,
);

const OUTCOME_STATEMENTS: Readonly<Record<string, string>> = {
  'outcome-evaluate-polynomial-at-many-points':
    '任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。',
  'outcome-subtract-exception-transitions':
    '全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。',
  'outcome-normalize-common-dp-action':
    '全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。',
  'outcome-compress-dp-sufficient-aggregates':
    '遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。',
  'outcome-slide-transition-recurrence':
    '隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。',
  'outcome-close-eventual-dp-tail':
    '余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。',
  'outcome-relax-in-dependency-order':
    'DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。',
  'outcome-detect-improving-cycles':
    '辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。',
  'outcome-compute-all-pairs-distance':
    '許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。',
  'outcome-find-weighted-balanced-separator':
    '非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。',
  'outcome-evaluate-at-geometric-points':
    '評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。',
  'outcome-enumerate-subsets-by-mask':
    '集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。',

  'outcome-invert-generating-function-equation':
    'F=xΦ(F)からLagrange反転 [x^n]F=[t^(n−1)]Φ(t)^n/nを導き、形式的条件と法上の除算可能性を確認して係数問題へ変換できる。',
  'outcome-derive-coefficient-recurrence-by-differentiation':
    '母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。',
  'outcome-expand-euler-product-sparsely':
    'Eulerの五角数定理により∏(1−x^i)を符号付きの疎な係数列へ展開し、必要次数までのO(√N)項で係数抽出できる。',
  'outcome-compute-binomial-by-lucas':
    '素数pのもとでn,kをp進展開し、Lucasの定理 C(n,k)=∏C(n_i,k_i) mod pで、n≥pでも階乗の零除算を避けて計算できる。',
  'outcome-propagate-probability-distribution':
    '互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。',
  'outcome-optimize-stochastic-actions':
    '意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。',
  'outcome-count-nonintersecting-paths-by-lgv':
    'DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。',
  'outcome-sum-affine-floors-by-euclid':
    'Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。',
  'outcome-identify-reusable-abstraction':
    '問題固有の語を再利用可能な対象・操作・不変量に置き換えられる。',
  'outcome-precompute-directional-grid-effects':
    '各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。',
  'outcome-build-laminar-interval-containment-tree':
    'laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。',
  'outcome-propagate-static-graph-potentials':
    '辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。',
  'outcome-solve-difference-constraints':
    '差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。',
  'outcome-sweep-connectivity-by-kruskal-threshold':
    '同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。',
  'outcome-optimize-path-matching-by-contraction':
    '重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。',
  'outcome-stabilize-unbounded-knapsack-by-best-density':
    '剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。',
  'outcome-share-threshold-checks-by-parallel-binary-search':
    '各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。',
  'outcome-allocate-by-convex-marginal-costs':
    '分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。',
  'outcome-shift-polynomial-by-factorial-convolution':
    '二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。',
  'outcome-solve-min-weight-general-perfect-matching':
    '一般グラフの最小重み完全matchingをweighted blossomまたは重み付きTutte多項式へ帰着し、存在判定だけでなく最小重みまで求められる。',
  'outcome-test-linear-matroid-intersection-rank':
    '二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。',
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
    '値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。',
  'outcome-compress-sparse-keys':
    '初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。',
  'outcome-reverse-update-time':
    '時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。',
  'outcome-reorder-counting-contributions':
    '数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。',
  'outcome-peel-graph-core':
    '連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。',
  'outcome-normalize-equivalent-states': '対称操作で同値な状態の標準形と不変量を選べる。',
  'outcome-count-orbits-by-fixed-points':
    '群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。',
  'outcome-prove-greedy-order':
    '局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。',
  'outcome-enumerate-bounded-candidates-or-cases':
    '制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。',
  'outcome-split-enumeration-space':
    '探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。',
  'outcome-find-orbit-hit-by-bsgs':
    '有限群の累乗または可逆な有限orbitについて、反復到達時刻をbaby/giant幅へ分解し、逆向きbaby tableと前向きgiant sequenceの衝突からindexを復元できる。',
  'outcome-divide-search-space-recursively':
    'pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。',
  'outcome-bound-total-work':
    '軽重・倍化・単調な一度限りの移動や削除から、操作列全体の仕事量の上界を説明できる。',
  'outcome-design-and-bound-randomized-algorithm':
    '乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。',
  'outcome-maintain-interactive-query-protocol':
    '問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。',
  'outcome-design-minimal-sufficient-state':
    '採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。',
  'outcome-design-grid-table-dp':
    'グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。',
  'outcome-enumerate-subset-state-space':
    'bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。',
  'outcome-design-resource-dp': '資源軸の上限と更新順を選び、選択の重複を避けられる。',
  'outcome-design-order-preserving-dp': '列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。',
  'outcome-design-interval-split-dp':
    '区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。',
  'outcome-design-carry-or-mixed-radix-dp':
    '整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。',
  'outcome-count-prefix-constrained-objects':
    '数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。',
  'outcome-solve-stochastic-recurrence':
    '状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。',
  'outcome-decompose-expectation-by-additive-potential':
    '対称な確率過程の期待費用を頻度別関数の和へ分離し、自己ループを含む一段方程式と終端の較正から吸収までの期待費用を求められる。',
  'outcome-aggregate-value-prefix-by-buckets':
    '値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。',
  'outcome-classify-game-states':
    '後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。',
  'outcome-evaluate-adversarial-game-value':
    '有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。',
  'outcome-factor-and-accelerate-transitions':
    '素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。',
  'outcome-accelerate-fixed-linear-transition':
    '固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。',
  'outcome-select-state-graph-search':
    '暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。',
  'outcome-compute-transitive-closure':
    '各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。',
  'outcome-model-and-compute-shortest-path':
    '非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。',
  'outcome-build-shortest-path-certificate':
    '距離等式を満たす親辺を選び、最短路の木または経路を復元できる。',
  'outcome-localize-change-impact-by-witness':
    '基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。',
  'outcome-maintain-connectivity-components':
    '静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。',
  'outcome-maintain-potential-differences':
    'DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。',
  'outcome-augment-components-with-metadata':
    '成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。',
  'outcome-color-and-classify-bipartite-components':
    '各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。',
  'outcome-construct-optimal-spanning-tree':
    'cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。',
  'outcome-condense-and-order-directed-graph':
    '有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。',
  'outcome-encode-threshold-constraints-as-two-sat':
    '整数変数をthreshold命題列へ符号化し、単調性と二項制約をimplication graphへ張り、SCCから可否と充足割当を復元できる。',
  'outcome-decompose-functional-graph':
    '後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。',
  'outcome-jump-deterministic-transition':
    '一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。',
  'outcome-use-tree-diameter-extrema':
    '一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。',
  'outcome-count-implicit-binary-tree-layers':
    '同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。',
  'outcome-aggregate-rooted-tree':
    '根付き木で子側の状態を合成し、部分木または木全体の値を求められる。',
  'outcome-reroot-tree-aggregation':
    '子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。',
  'outcome-compose-dynamic-tree-clusters':
    '境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。',
  'outcome-answer-tree-ancestor-queries':
    'binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。',
  'outcome-flatten-tree-by-euler-order':
    'Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。',
  'outcome-apply-heavy-light-decomposition':
    'heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。',
  'outcome-build-virtual-tree':
    '対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。',
  'outcome-build-balanced-separator-decomposition':
    '各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。',
  'outcome-reduce-selection-to-network-optimization':
    '選択制約を容量・カット・マッチングに対応させ、最適値と具体的な選択を復元できる。',
  'outcome-characterize-bipartite-feasibility-by-hall':
    '二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。',
  'outcome-characterize-walk-by-degrees':
    '全辺ウォークの成立条件または選択辺集合の次数parity条件を定式化し、連結性・奇数次数・葉からの処理で判定または構成できる。',
  'outcome-identify-bridges-and-articulations':
    'DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。',
  'outcome-use-cycle-space-basis':
    '無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。',
  'outcome-reduce-graph-by-peeling-or-kernelization':
    '削除可能な葉・低次数頂点を反復除去してcycle coreと各頂点の所属を特定するか、terminal以外の葉除去とdegree-2 chain縮約によってcycle rankに依存する小kernelを構成できる。',
  'outcome-linearize-static-range-information':
    '各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。',
  'outcome-maintain-weighted-prefix-statistics':
    '処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。',
  'outcome-design-associative-range-summary':
    '要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。',
  'outcome-decompose-ranges-into-segment-tree-nodes':
    '区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。',
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
  'outcome-accelerate-set-operations-with-bitsets':
    '集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。',
  'outcome-build-cartesian-tree-decomposition':
    '配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。',
  'outcome-query-bitwise-order-with-trie':
    '整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。',
  'outcome-index-shared-prefixes-with-trie':
    '文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。',
  'outcome-build-prefix-match-state':
    '既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。',
  'outcome-build-finite-string-automaton':
    '未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。',
  'outcome-peel-directed-graph-toward-cycles':
    '三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。',
  'outcome-build-multi-pattern-automaton':
    '複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。',
  'outcome-build-suffix-automaton':
    'endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。',
  'outcome-build-suffix-lcp-index':
    '接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。',
  'outcome-compare-objects-by-fingerprint':
    '衝突条件を明示したfingerprintを構成し、文字列・列・multiset・大整数式の同値性を比較できる。',
  'outcome-characterize-palindrome-intervals':
    '各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。',
  'outcome-query-recursively-defined-string':
    '圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。',
  'outcome-compute-in-modular-arithmetic':
    '剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。',
  'outcome-maintain-modular-product-under-factor-updates':
    '法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。',
  'outcome-solve-modular-constraints':
    '合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。',
  'outcome-exploit-modular-periodicity':
    '剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。',
  'outcome-characterize-integer-solvability':
    '整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。',
  'outcome-reduce-integer-structure-by-gcd':
    'gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。',
  'outcome-bound-reachability-in-numerical-semigroup':
    '正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。',
  'outcome-approximate-rational-by-euclid':
    'Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。',
  'outcome-decompose-by-prime-or-divisor':
    '整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。',
  'outcome-partition-integer-parameter-ranges':
    'floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。',
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
  'outcome-compute-convolution-or-correlation':
    '係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。',
  'outcome-apply-formal-power-series-operations':
    '定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。',
  'outcome-evaluate-and-compose-polynomials':
    '積木・剰余木などの分割統治を設計し、多点評価・補間・power projection・多項式合成を計算できる。',
  'outcome-transform-to-linear-system-or-rank':
    '制約を線形結合・基底へ変換するか、XOR畳み込みをWalsh–Hadamard変換で点ごとの積へ移し、逆変換まで求められる。',
  'outcome-factor-separable-linear-transform':
    'Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。',
  'outcome-compute-in-finite-field-extension':
    '基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。',
  'outcome-count-combinatorial-objects-by-determinant':
    '辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。',
  'outcome-reduce-geometry-to-algebraic-predicates':
    '幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。',
  'outcome-restrict-geometric-candidates-to-boundary':
    '目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。',
  'outcome-represent-convex-intersection-by-halfplanes':
    '凸多角形を向き付き辺の線形半平面制約へ変換し、平行移動後も左辺が同じ制約を最強の右辺へ集約して共通部分への包含を判定できる。',
  'outcome-optimize-by-line-envelope':
    '一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。',
  'outcome-exploit-convexity':
    '絶対値和を中央値で最小化するか、凸・凹性を示し、傾き・breakpoint・Lagrange penalty・限界費用から連続または離散の最適点を求められる。',
  'outcome-recover-valid-witness':
    '成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。',
  'outcome-encode-labeled-trees-by-prufer-code':
    'Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。',
  'outcome-compute-directed-walk-period':
    '往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。',
  'outcome-remove-boundaries-by-reflection':
    '最初に境界を破るpathとの鏡像対応を構成し、壁付きwalkの数え上げを符号付きの無境界問題へ変換できる。',
  'outcome-count-labeled-structures-by-components':
    '最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。',
  'outcome-optimize-ratio-by-parametric-search':
    '比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。',
  'outcome-design-query-code-by-information-bound':
    '応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。',
  'outcome-detect-crossing-by-cyclic-order':
    '円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。',
  'outcome-maintain-order-through-crossing-events':
    '隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。',
  'outcome-optimize-poset-antichain-by-dilworth':
    '対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。',
  'outcome-optimize-tree-order-by-cluster-contraction':
    '親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。',
  'outcome-design-frontier-profile-dp':
    '未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。',
  'outcome-exponentiate-transition-over-semiring':
    '遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。',
  'outcome-exponentiate-associative-composition':
    '反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。',
  'outcome-reconstruct-tree-from-distance-matrix':
    '加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。',
  'outcome-enumerate-by-reversible-backtracking':
    '再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。',
};

const tagById = new Map(FINAL_TAXONOMY_TAGS.map((tag) => [tag.id, tag]));

const OUTCOME_PREREQUISITE_IDS: Readonly<Record<string, readonly string[]>> = {
  'outcome-solve-difference-constraints': ['outcome-detect-improving-cycles'],
  'outcome-build-balanced-separator-decomposition': ['outcome-find-weighted-balanced-separator'],
  'outcome-optimize-stochastic-actions': ['outcome-solve-stochastic-recurrence'],
  'outcome-maintain-modular-product-under-factor-updates': [
    'outcome-compute-in-modular-arithmetic',
  ],
  'outcome-build-shortest-path-certificate': ['outcome-model-and-compute-shortest-path'],
  'outcome-construct-optimal-spanning-tree': ['outcome-prove-greedy-order'],
  'outcome-compose-dynamic-tree-clusters': ['outcome-aggregate-rooted-tree'],
  'outcome-build-cartesian-tree-decomposition': ['outcome-prune-dominated-candidates-once'],
  'outcome-design-range-update-action': ['outcome-design-associative-range-summary'],
  'outcome-solve-modular-constraints': [
    'outcome-characterize-integer-solvability',
    'outcome-compute-in-modular-arithmetic',
  ],
  'outcome-compute-in-finite-field-extension': ['outcome-compute-in-modular-arithmetic'],
  'outcome-restrict-geometric-candidates-to-boundary': [
    'outcome-reduce-geometry-to-algebraic-predicates',
  ],
  'outcome-represent-convex-intersection-by-halfplanes': [
    'outcome-reduce-geometry-to-algebraic-predicates',
  ],
  'outcome-encode-labeled-trees-by-prufer-code': ['outcome-formulate-combinatorial-coefficients'],
  'outcome-compute-directed-walk-period': [
    'outcome-condense-and-order-directed-graph',
    'outcome-reduce-integer-structure-by-gcd',
  ],
  'outcome-optimize-ratio-by-parametric-search': ['outcome-prove-and-search-threshold'],
  'outcome-maintain-order-through-crossing-events': ['outcome-linearize-events'],
  'outcome-optimize-tree-order-by-cluster-contraction': [
    'outcome-augment-components-with-metadata',
    'outcome-prove-greedy-order',
  ],
  'outcome-design-frontier-profile-dp': [
    'outcome-design-minimal-sufficient-state',
    'outcome-design-grid-table-dp',
    'outcome-enumerate-subset-state-space',
  ],
};

const OUTCOME_LEARNING_UNIT_IDS: Readonly<Record<string, readonly string[]>> = {
  'outcome-linearize-events': ['unit-event-sweep'],
  'outcome-reverse-update-time': ['unit-reverse-offline'],
  'outcome-reorder-counting-contributions': ['unit-contribution-reordering'],
  'outcome-normalize-equivalent-states': ['unit-normalization'],
  'outcome-count-orbits-by-fixed-points': ['unit-orbit-counting'],
  'outcome-build-prefix-match-state': ['unit-z-algorithm'],
  'outcome-build-finite-string-automaton': ['unit-finite-pattern-automaton'],
  'outcome-build-multi-pattern-automaton': ['unit-aho-corasick'],
  'outcome-build-suffix-automaton': ['unit-suffix-automaton'],
  'outcome-compute-in-modular-arithmetic': ['unit-modular-arithmetic'],
  'outcome-maintain-modular-product-under-factor-updates': ['unit-dynamic-modular-product'],
  'outcome-solve-modular-constraints': ['unit-modular-congruence'],
  'outcome-exploit-modular-periodicity': ['unit-modular-periodicity'],
  'outcome-characterize-integer-solvability': ['unit-gcd-diophantine'],
  'outcome-reduce-integer-structure-by-gcd': ['unit-gcd-structure'],
  'outcome-bound-reachability-in-numerical-semigroup': ['unit-numerical-semigroup-reachability'],
  'outcome-approximate-rational-by-euclid': ['unit-rational-approximation'],
  'outcome-count-through-cyclic-exponents': ['unit-cyclic-group-exponent-counting'],
  'outcome-find-period-by-multiplicative-order': ['unit-multiplicative-order-periods'],
  'outcome-compute-convolution-or-correlation': ['unit-polynomial-convolution'],
  'outcome-encode-counting-by-generating-function': ['unit-generating-functions'],
  'outcome-apply-formal-power-series-operations': ['unit-formal-power-series'],
};

export const FINAL_TAXONOMY_OUTCOMES: readonly ObservableOutcomePolicy[] =
  FINAL_TAXONOMY_TAGS.flatMap((tag) =>
    tag.learningOutcomeIds.map((outcomeId) => ({
      id: outcomeId,
      statement:
        OUTCOME_STATEMENTS[outcomeId] ??
        `${tag.definition}その発動条件、正当性、計算量を説明し、未知問へ実装できる。`,
      prerequisiteOutcomeIds: [
        ...new Set([
          ...(OUTCOME_PREREQUISITE_IDS[outcomeId] ?? []),
          ...tag.prerequisiteTagIds.flatMap(
            (prerequisiteTagId) =>
              FINAL_TAXONOMY_TAGS.find(
                (candidateTag) => candidateTag.id === prerequisiteTagId,
              )?.learningOutcomeIds.filter(
                (id) =>
                  (outcomeId !== 'outcome-count-euler-circuits-by-best' ||
                    id !== 'outcome-count-nonintersecting-paths-by-lgv') &&
                  (prerequisiteTagId !== 'tag-shortest-path' ||
                    id === 'outcome-model-and-compute-shortest-path'),
              ) ?? [],
          ),
        ]),
      ].sort(),
      scopeTagIds: [tag.id],
      learningUnitCandidateIds:
        OUTCOME_LEARNING_UNIT_IDS[outcomeId] ?? tag.learningUnitCandidateIds,
    })),
  );

export const NON_PRIMARY_OUTCOME_IDS = FINAL_TAXONOMY_OUTCOMES.filter((outcome) =>
  outcome.scopeTagIds.some((tagId) => NON_PRIMARY_TAG_IDS.includes(tagId)),
).map((outcome) => outcome.id);

/**
 * Keep narrow but learner-visible skills distinct when this 868-problem window contains one
 * canonical exercise. The build gate requires each exception to have exactly one Problem and
 * reports it once another exercise appears.
 */
export const SINGLE_PROBLEM_OUTCOME_IDS: readonly string[] = [
  'outcome-enumerate-subsets-by-mask',
  'outcome-evaluate-polynomial-at-many-points',
  'outcome-close-eventual-dp-tail',
  'outcome-evaluate-at-geometric-points',
  'outcome-find-weighted-balanced-separator',
  'outcome-decompose-expectation-by-additive-potential',
  'outcome-aggregate-value-prefix-by-buckets',
  'outcome-invert-generating-function-equation',
  'outcome-expand-euler-product-sparsely',
  'outcome-compute-binomial-by-lucas',
  'outcome-count-nonintersecting-paths-by-lgv',
  'outcome-accelerate-tree-dp-by-heavy-path',
  'outcome-pass-resource-dp-through-heavy-recursion',
  'outcome-traverse-stern-brocot-ancestors',
  'outcome-minimize-maximum-xor-by-bit-partition',
  'outcome-precompute-directional-grid-effects',
  'outcome-build-laminar-interval-containment-tree',
  'outcome-use-cycle-space-basis',
  'outcome-find-orbit-hit-by-bsgs',
  'outcome-apply-heavy-light-decomposition',
  'outcome-build-static-sorted-range-index',
  'outcome-build-suffix-automaton',
  'outcome-build-virtual-tree',
  'outcome-compose-finite-functions',
  'outcome-compute-subset-convolution',
  'outcome-construct-degree-parity-subgraph',
  'outcome-contract-monotone-paths-with-jump-pointers',
  'outcome-count-euler-circuits-by-best',
  'outcome-accelerate-iteration-by-characteristic-p-frobenius',
  'outcome-determinize-automaton-by-subsets',
  'outcome-dualize-planar-cut-to-path',
  'outcome-encode-labeled-trees-by-prufer-code',
  'outcome-encode-threshold-constraints-as-two-sat',
  'outcome-evolve-run-length-encoded-state',
  'outcome-extract-rational-series-coefficient',
  'outcome-exponentiate-associative-composition',
  'outcome-compute-directed-walk-period',
  'outcome-design-query-code-by-information-bound',
  'outcome-kernelize-near-tree-graph',
  'outcome-maintain-queue-aggregate-with-swag',
  'outcome-maintain-sparse-domain-segment-tree',
  'outcome-normalize-string-to-primitive-period',
  'outcome-bound-reachability-in-numerical-semigroup',
  'outcome-optimize-mask-by-bitwise-feasibility',
  'outcome-optimize-weighted-matroid-basis',
  'outcome-prune-range-actions-by-node-invariant',
  'outcome-recur-by-edge-deletion-contraction',
  'outcome-represent-convex-intersection-by-halfplanes',
  'outcome-represent-integers-as-two-squares',
  'outcome-reconstruct-tree-from-distance-matrix',
  'outcome-remove-boundaries-by-reflection',
  'outcome-solve-flow-with-lower-bounds',
  'outcome-solve-min-weight-general-perfect-matching',
  'outcome-solve-isotonic-regression-by-pav',
  'outcome-test-linear-matroid-intersection-rank',
  'outcome-solve-weighted-bipartite-matching',
  'outcome-sum-multiplicative-function-by-min25-sieve',
  'outcome-translate-sequences-by-rsk',
  'outcome-optimize-tree-order-by-cluster-contraction',
  'outcome-shift-polynomial-by-factorial-convolution',
];
export const SINGLE_PROBLEM_UNIT_IDS: readonly string[] = [
  'unit-additive-expectation-potential',
  'unit-value-bucket-aggregation',
  'unit-heavy-path-tree-dp',
  'unit-heavy-light-recursive-dp',
  'unit-stern-brocot-ancestry',
  'unit-bitwise-minimax-partition',
  'unit-additive-tree-metric-reconstruction',
  'unit-directional-grid-effect-scan',
  'unit-laminar-interval-containment-tree',
  'unit-cycle-space-basis',
  'unit-baby-step-giant-step',
  'unit-automaton-subset-construction',
  'unit-bitwise-greedy-feasibility',
  'unit-bostan-mori',
  'unit-degree-parity-subgraph',
  'unit-deletion-contraction',
  'unit-directed-walk-periodicity',
  'unit-dynamic-segment-tree',
  'unit-euler-circuit-counting',
  'unit-finite-field-frobenius',
  'unit-finite-function-composition',
  'unit-flow-lower-bounds',
  'unit-gaussian-integers-two-squares',
  'unit-min-weight-general-perfect-matching',
  'unit-half-plane-constraints',
  'unit-heavy-light-decomposition',
  'unit-information-theoretic-query-design',
  'unit-isotonic-regression',
  'unit-matroid-greedy',
  'unit-linear-matroid-intersection',
  'unit-min25-sieve',
  'unit-monoid-exponentiation',
  'unit-monotone-path-contraction',
  'unit-near-tree-kernelization',
  'unit-numerical-semigroup-reachability',
  'unit-planar-duality',
  'unit-polynomial-taylor-shift',
  'unit-prufer-code',
  'unit-reflection-principle',
  'unit-rsk-young-tableaux',
  'unit-run-length-dynamics',
  'unit-segment-tree-beats',
  'unit-static-sorted-range-index',
  'unit-string-periodicity',
  'unit-subset-convolution',
  'unit-suffix-automaton',
  'unit-swag',
  'unit-two-sat',
  'unit-tree-precedence-contraction',
  'unit-virtual-tree',
  'unit-weighted-bipartite-matching',
];
export const SINGLE_PROBLEM_TAG_IDS: readonly string[] = [
  'tag-additive-expectation-potential',
  'tag-value-bucket-aggregation',
  'tag-heavy-path-tree-dp',
  'tag-heavy-light-recursive-dp',
  'tag-stern-brocot-ancestry',
  'tag-bitwise-minimax-partition',
  'tag-additive-tree-metric-reconstruction',
  'tag-directional-grid-effect-scan',
  'tag-laminar-interval-containment-tree',
  'tag-cycle-space-basis',
  'tag-baby-step-giant-step',
  'tag-automaton-subset-construction',
  'tag-bitwise-greedy-feasibility',
  'tag-bostan-mori',
  'tag-degree-parity-subgraph',
  'tag-deletion-contraction',
  'tag-directed-walk-periodicity',
  'tag-dynamic-segment-tree',
  'tag-euler-circuit-counting',
  'tag-finite-field-frobenius',
  'tag-finite-function-composition',
  'tag-flow-feasibility-lower-bounds',
  'tag-gaussian-integers-two-squares',
  'tag-min-weight-general-perfect-matching',
  'tag-half-plane-constraints',
  'tag-heavy-light-decomposition',
  'tag-information-theoretic-query-design',
  'tag-isotonic-regression-pav',
  'tag-matroid-greedy',
  'tag-linear-matroid-intersection',
  'tag-min25-sieve',
  'tag-monoid-exponentiation',
  'tag-monotone-path-contraction',
  'tag-near-tree-kernelization',
  'tag-numerical-semigroup',
  'tag-planar-duality',
  'tag-polynomial-taylor-shift',
  'tag-prufer-code',
  'tag-reflection-principle',
  'tag-rsk-young-tableaux',
  'tag-run-length-dynamics',
  'tag-segment-tree-beats',
  'tag-static-sorted-range-index',
  'tag-string-periodicity',
  'tag-subset-convolution',
  'tag-suffix-automaton',
  'tag-swag',
  'tag-two-sat',
  'tag-tree-precedence-contraction',
  'tag-virtual-tree',
  'tag-weighted-bipartite-matching',
];

const outcomeById = new Map(FINAL_TAXONOMY_OUTCOMES.map((outcome) => [outcome.id, outcome]));

const REFINED_CHAPTER_SEEDS: readonly LearningUnitSeed[] = [
  {
    ...chapter('unit-chapter-tree', '木構造'),
    learningRationale:
      '一般グラフから独立させ、根・部分木・一意path・separatorという木固有の不変量を体系的に積み上げる。',
  },
  {
    ...chapter('unit-chapter-number-theory', '数論'),
    learningRationale:
      '整数条件をgcd・合同・素因数指数・約数格子へ翻訳し、有限状態化と反転の基礎を作る。',
  },
  {
    ...chapter('unit-chapter-combinatorics-algebra', '組合せ・多項式・線形代数'),
    learningRationale: '数え上げを全単射・係数列・線形写像へ変換し、高速変換と構造定理へ接続する。',
  },
  {
    ...chapter('unit-chapter-geometry-optimization', '幾何・凸最適化'),
    learningRationale:
      'orientationなどの幾何predicateから凸境界・傾き・dual penaltyへ進み、候補を構造的に削減する。',
  },
];

const REFINED_SECTION_SEEDS: readonly LearningUnitSeed[] = [
  section(
    'unit-modular-product-foundations',
    '法上の演算と積の保守',
    'unit-chapter-number-theory',
    [],
  ),
  subsection(
    'unit-dynamic-modular-product',
    '可逆な非零剰余と剰余 0 因子を含む法上の動的積',
    'unit-modular-product-foundations',
    ['unit-modular-arithmetic'],
  ),
  section(
    'unit-matroid-theory',
    'Matroidの独立性・greedy・線形交差',
    'unit-chapter-combinatorics-algebra',
    [],
  ),
];

const LEGACY_UNIT_PARENT_OVERRIDES: Readonly<Record<string, string>> = {
  'unit-tree-metric': 'unit-chapter-tree',
  'unit-tree-aggregation': 'unit-chapter-tree',
  'unit-implicit-binary-tree': 'unit-chapter-tree',
  'unit-static-top-tree': 'unit-chapter-tree',
  'unit-tree-decomposition': 'unit-chapter-tree',
  'unit-tree-balanced-separators': 'unit-chapter-tree',
  'unit-gcd-diophantine': 'unit-chapter-number-theory',
  'unit-numerical-semigroup-reachability': 'unit-chapter-number-theory',
  'unit-rational-approximation': 'unit-chapter-number-theory',
  'unit-modular-arithmetic': 'unit-modular-product-foundations',
  'unit-modular-congruence': 'unit-chapter-number-theory',
  'unit-modular-periodicity': 'unit-chapter-number-theory',
  'unit-prime-divisor': 'unit-chapter-number-theory',
  'unit-integer-boundary-blocks': 'unit-chapter-number-theory',
  'unit-cyclic-group-exponent-counting': 'unit-chapter-number-theory',
  'unit-multiplicative-order-periods': 'unit-chapter-number-theory',
  'unit-finite-field-extension': 'unit-chapter-number-theory',
  'unit-combinatorial-coefficients': 'unit-chapter-combinatorics-algebra',
  'unit-inclusion-exclusion': 'unit-chapter-combinatorics-algebra',
  'unit-polynomial-convolution': 'unit-chapter-combinatorics-algebra',
  'unit-generating-functions': 'unit-chapter-combinatorics-algebra',
  'unit-formal-power-series': 'unit-chapter-combinatorics-algebra',
  'unit-linear-algebra-xor': 'unit-chapter-combinatorics-algebra',
  'unit-geometry-primitives': 'unit-chapter-geometry-optimization',
  'unit-convex-geometry': 'unit-chapter-geometry-optimization',
  'unit-discrete-convex': 'unit-chapter-geometry-optimization',
};

const REFINED_UNIT_PARENT_OVERRIDES: Readonly<Record<string, string>> = {
  'unit-dp-sequence': 'unit-dp-sequence-interval',
  'unit-dp-prefix-partition': 'unit-dp-sequence-interval',
  'unit-dp-interval-composition': 'unit-dp-sequence-interval',
  'unit-dp-interval-expansion': 'unit-dp-sequence-interval',
  'unit-dp-lis': 'unit-dp-sequence-interval',
  'unit-dp-value-range': 'unit-dp-sequence-interval',
  'unit-meet-in-the-middle': 'unit-divide-enumeration',
  'unit-recursive-divide-and-conquer': 'unit-divide-enumeration',
  'unit-amortized-monotone-progress': 'unit-decomposition-amortization',
  'unit-small-to-large': 'unit-decomposition-amortization',
  'unit-threshold-heavy-light': 'unit-decomposition-amortization',
  'unit-heavy-path-tree-dp': 'unit-tree-aggregation',
  'unit-eventual-unbounded-knapsack': 'unit-dp-subset-resource',
  'unit-state-graph-search': 'unit-graph-search',
  'unit-directional-grid-effect-scan': 'unit-graph-search',
  'unit-transitive-closure': 'unit-graph-search',
  'unit-weighted-shortest-path': 'unit-shortest-path-certificates',
  'unit-shortest-path-reconstruction': 'unit-shortest-path-certificates',
  'unit-difference-constraints': 'unit-shortest-path-certificates',
  'unit-scc-condensation': 'unit-directed-condensation',
  'unit-two-sat': 'unit-directed-condensation',
  'unit-dag-topological-processing': 'unit-directed-condensation',
  'unit-directed-core-peeling': 'unit-directed-condensation',
  'unit-functional-graph-decomposition': 'unit-functional-graph',
  'unit-binary-lifting': 'unit-functional-graph',
  'unit-dsu-components': 'unit-connectivity',
  'unit-potential-dsu': 'unit-connectivity',
  'unit-graph-potential-propagation': 'unit-connectivity',
  'unit-kruskal-threshold-sweep': 'unit-spanning-tree-optimization',
  'unit-rooted-tree-aggregation': 'unit-tree-aggregation',
  'unit-rerooting': 'unit-tree-aggregation',
  'unit-tree-ancestor-lca': 'unit-tree-decomposition',
  'unit-laminar-interval-containment-tree': 'unit-tree-decomposition',
  'unit-tree-euler-flattening': 'unit-tree-decomposition',
  'unit-heavy-light-decomposition': 'unit-tree-decomposition',
  'unit-virtual-tree': 'unit-tree-decomposition',
  'unit-max-flow-min-cut': 'unit-flow-matching',
  'unit-flow-lower-bounds': 'unit-flow-matching',
  'unit-bipartite-matching': 'unit-flow-matching',
  'unit-min-cost-flow': 'unit-flow-matching',
  'unit-weighted-bipartite-matching': 'unit-flow-matching',
  'unit-min-weight-general-perfect-matching': 'unit-flow-matching',
  'unit-path-matching-contraction': 'unit-flow-matching',
  'unit-euler-trail-circuit': 'unit-euler-degree',
  'unit-degree-parity-subgraph': 'unit-euler-degree',
  'unit-graph-core': 'unit-graph-core-peeling',
  'unit-near-tree-kernelization': 'unit-graph-core-peeling',
  'unit-range-monoid-aggregation': 'unit-monoid-segment-tree',
  'unit-segment-tree-canonical-decomposition': 'unit-monoid-segment-tree',
  'unit-static-sorted-range-index': 'unit-monoid-segment-tree',
  'unit-idempotent-overlap-range-query': 'unit-monoid-segment-tree',
  'unit-swag': 'unit-monoid-segment-tree',
  'unit-finite-function-composition': 'unit-monoid-segment-tree',
  'unit-dynamic-segment-tree': 'unit-monoid-segment-tree',
  'unit-segment-tree-beats': 'unit-range-actions',
  'unit-priority-queue-best-first': 'unit-ordered-set-heap',
  'unit-ordered-set-multiset': 'unit-ordered-set-heap',
  'unit-ordered-interval-partition': 'unit-ordered-set-heap',
  'unit-persistence': 'unit-persistence-rollback',
  'unit-rollback': 'unit-persistence-rollback',
  'unit-z-algorithm': 'unit-string-prefix-automata',
  'unit-finite-pattern-automaton': 'unit-string-automata',
  'unit-automaton-subset-construction': 'unit-string-automata',
  'unit-aho-corasick': 'unit-string-automata',
  'unit-digit-dp': 'unit-dp-digit-string',
  'unit-automaton-dp': 'unit-dp-digit-string',
  'unit-sequence-fingerprint': 'unit-string-hash',
  'unit-randomized-algebraic-fingerprint': 'unit-randomized-algorithms',
  'unit-gcd-structure': 'unit-chapter-number-theory',
  'unit-divisor-mobius-inversion': 'unit-inclusion-exclusion',
  'unit-subset-transforms': 'unit-inclusion-exclusion',
  'unit-subset-convolution': 'unit-subset-transforms',
  'unit-polynomial-multipoint-evaluation': 'unit-formal-power-series',
  'unit-polynomial-taylor-shift': 'unit-polynomial-convolution',
  'unit-fps-composition-power-projection': 'unit-formal-power-series',
  'unit-bostan-mori': 'unit-formal-power-series',
  'unit-relaxed-convolution': 'unit-polynomial-convolution',
  'unit-linear-system-rank': 'unit-linear-algebra-xor',
  'unit-xor-linear-basis': 'unit-linear-algebra-xor',
  'unit-separable-linear-transform': 'unit-linear-algebra-xor',
  'unit-matroid-greedy': 'unit-matroid-theory',
  'unit-linear-matroid-intersection': 'unit-matroid-theory',
  'unit-convex-boundary-hull': 'unit-convex-geometry',
  'unit-half-plane-constraints': 'unit-convex-geometry',
  'unit-basic-convex-optimization': 'unit-discrete-convex',
  'unit-slope-trick': 'unit-discrete-convex',
  'unit-lagrangian-relaxation': 'unit-discrete-convex',
  'unit-monge-optimization': 'unit-discrete-convex',
  'unit-isotonic-regression': 'unit-discrete-convex',
  'unit-separable-convex-marginals': 'unit-discrete-convex',
  'unit-directed-walk-periodicity': 'unit-directed-condensation',
  'unit-frontier-profile-dp': 'unit-dp-state-design',
  'unit-additive-expectation-potential': 'unit-dp-stochastic',
  'unit-kinetic-order-maintenance': 'unit-event-sweep',
  'unit-cyclic-order-crossing': 'unit-geometry-primitives',
};

const rootChapterIdForTag = (tagId: string): string => {
  let current = tagById.get(tagId);
  while (current?.parentId) current = tagById.get(current.parentId);
  switch (current?.id) {
    case 'tag-dp-state-transition':
      return 'unit-chapter-dynamic-programming';
    case 'tag-graph-model-structure':
      return 'unit-chapter-graph';
    case 'tag-tree-model-structure':
      return 'unit-chapter-tree';
    case 'tag-query-sufficient-aggregate':
      return 'unit-chapter-query';
    case 'tag-string-state-representation':
      return 'unit-chapter-string';
    case 'tag-number-theory-structure':
      return 'unit-chapter-number-theory';
    case 'tag-combinatorics-algebra-structure':
      return 'unit-chapter-combinatorics-algebra';
    case 'tag-geometry-optimization-structure':
      return 'unit-chapter-geometry-optimization';
    default:
      return 'unit-chapter-modeling';
  }
};

const refinedLegacyUnitSeeds = LEGACY_LEARNING_UNIT_SEEDS.filter(
  (unit) => unit.id !== 'unit-chapter-math-geometry',
).map((unit): LearningUnitSeed => ({
  ...unit,
  kind: unit.id === 'unit-modular-arithmetic' ? 'subsection' : unit.kind,
  title: unit.id === 'unit-chapter-graph' ? 'グラフアルゴリズム' : unit.title,
  parentId: LEGACY_UNIT_PARENT_OVERRIDES[unit.id] ?? unit.parentId,
}));

const declaredUnitIds = new Set([
  ...refinedLegacyUnitSeeds.map((unit) => unit.id),
  ...REFINED_CHAPTER_SEEDS.map((unit) => unit.id),
  ...REFINED_SECTION_SEEDS.map((unit) => unit.id),
]);
const autoRefinedUnitSeeds: LearningUnitSeed[] = [];
for (const tag of FINAL_TAXONOMY_TAGS) {
  for (const unitId of tag.learningUnitCandidateIds) {
    if (declaredUnitIds.has(unitId)) continue;
    declaredUnitIds.add(unitId);
    const explicitParentId = REFINED_UNIT_PARENT_OVERRIDES[unitId];
    const parentId = explicitParentId ?? rootChapterIdForTag(tag.id);
    const parentIsChapter = parentId.startsWith('unit-chapter-');
    const prerequisiteIds = [
      ...new Set(
        tag.prerequisiteTagIds.flatMap(
          (prerequisiteTagId) => tagById.get(prerequisiteTagId)?.learningUnitCandidateIds ?? [],
        ),
      ),
    ]
      .sort()
      .filter((prerequisiteUnitId) => prerequisiteUnitId !== unitId);
    const prerequisiteNames = tag.prerequisiteTagIds.flatMap((prerequisiteTagId) => {
      const prerequisiteTag = tagById.get(prerequisiteTagId);
      return prerequisiteTag === undefined ? [] : [prerequisiteTag.name];
    });
    autoRefinedUnitSeeds.push({
      id: unitId,
      kind: parentIsChapter ? 'section' : 'subsection',
      title: tag.name,
      parentId,
      prerequisiteIds,
      learningRationale:
        prerequisiteNames.length === 0
          ? `${tag.definition}その発動条件と正当化原理を比較可能な独立教材として学ぶ。`
          : `${prerequisiteNames.join('・')}で得た考え方と実装を再利用し、${tag.name}の発動条件・正当化・境界を重複なく学ぶ。`,
      excludedTopics: UNIT_EXCLUDED_TOPICS[unitId] ?? [
        `${tag.name}の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。`,
      ],
    });
  }
}

const BASE_LEARNING_UNIT_SEEDS: readonly LearningUnitSeed[] = [
  ...refinedLegacyUnitSeeds,
  ...REFINED_CHAPTER_SEEDS,
  ...REFINED_SECTION_SEEDS,
  ...autoRefinedUnitSeeds,
];

const parentUnitIdById = new Map(BASE_LEARNING_UNIT_SEEDS.map((unit) => [unit.id, unit.parentId]));
const unitIsSameOrDescendant = (unitId: string, ancestorUnitId: string): boolean => {
  const visited = new Set<string>();
  let currentId: string | null = unitId;
  while (currentId !== null && !visited.has(currentId)) {
    if (currentId === ancestorUnitId) return true;
    visited.add(currentId);
    currentId = parentUnitIdById.get(currentId) ?? null;
  }
  return false;
};

const derivedPrerequisiteUnitIdsByUnitId = new Map<string, Set<string>>();
for (const outcome of FINAL_TAXONOMY_OUTCOMES) {
  for (const unitId of outcome.learningUnitCandidateIds) {
    const prerequisiteUnitIds = derivedPrerequisiteUnitIdsByUnitId.get(unitId) ?? new Set<string>();
    for (const prerequisiteOutcomeId of outcome.prerequisiteOutcomeIds) {
      for (const prerequisiteUnitId of outcomeById.get(prerequisiteOutcomeId)
        ?.learningUnitCandidateIds ?? []) {
        if (prerequisiteUnitId !== unitId) {
          prerequisiteUnitIds.add(prerequisiteUnitId);
        }
      }
    }
    derivedPrerequisiteUnitIdsByUnitId.set(unitId, prerequisiteUnitIds);
  }
}

const LEARNING_UNIT_SEEDS: readonly LearningUnitSeed[] = BASE_LEARNING_UNIT_SEEDS.map((unit) => ({
  ...unit,
  prerequisiteIds: [
    ...new Set([
      ...unit.prerequisiteIds,
      ...(derivedPrerequisiteUnitIdsByUnitId.get(unit.id) ?? []),
    ]),
  ].sort(),
}));

export const FINAL_LEARNING_UNIT_CANDIDATES: readonly MetadataLearningUnitCandidate[] =
  LEARNING_UNIT_SEEDS.map((unit) => ({
    id: unit.id,
    kind: unit.kind,
    title: unit.title,
    parentId: unit.parentId,
    tagIds: FINAL_TAXONOMY_TAGS.filter((tag) =>
      tag.learningUnitCandidateIds.some((tagUnitId) => unitIsSameOrDescendant(tagUnitId, unit.id)),
    ).map((tag) => tag.id),
    ownedTagIds: FINAL_TAXONOMY_TAGS.filter((tag) =>
      tag.learningUnitCandidateIds.includes(unit.id),
    ).map((tag) => tag.id),
    learningOutcomeIds: FINAL_TAXONOMY_OUTCOMES.filter((outcome) =>
      outcome.learningUnitCandidateIds.some((outcomeUnitId) =>
        unitIsSameOrDescendant(outcomeUnitId, unit.id),
      ),
    ).map((outcome) => outcome.id),
    ownedLearningOutcomeIds: FINAL_TAXONOMY_OUTCOMES.filter((outcome) =>
      outcome.learningUnitCandidateIds.includes(unit.id),
    ).map((outcome) => outcome.id),
    problemIds: [],
    learningRationale: UNIT_LEARNING_RATIONALES[unit.id] ?? unit.learningRationale,
    excludedTopics: unit.excludedTopics,
  }));

export const FINAL_LEARNING_UNIT_PREREQUISITES = LEARNING_UNIT_SEEDS.flatMap(
  ({ id, prerequisiteIds }) =>
    prerequisiteIds.map((prerequisiteId) => ({ nodeId: id, prerequisiteId })),
).sort(
  (left, right) =>
    compareIds(left.nodeId, right.nodeId) || compareIds(left.prerequisiteId, right.prerequisiteId),
);

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

const RAW_CURATED_PRIMARY_OVERRIDES: readonly CuratedPrimaryOverride[] = [
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
      'cycle spaceとfundamental cycle basisから次元K=M-N+1とsimple path数の2^K上界を導き、terminal以外の葉除去とdegree-2 chain縮約でKだけに依存する小kernelを作る。理論的な候補数評価と高速化の両方をco-primaryとし、Homeは後者とする。',
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
    primaryTagId: 'tag-randomized-algorithm',
    primaryOutcomeId: 'outcome-design-and-bound-randomized-algorithm',
    rationale:
      'majority集合から候補差をsamplingする成功確率を評価し、素因数候補を決定的に検証するMonte Carlo設計が主である。',
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
    primaryOutcomeId: 'outcome-compute-convolution-or-correlation',
    rationale:
      'wildcard patternと各marquee stateの不一致数を反転した係数列の相互相関として一括計算する。',
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
    additionalPrimaryTagIds: ['tag-grid-table-dp'],
    rationale:
      '各右下端で未来の数え上げに十分な情報を最大正方形の辺長一つに圧縮し、三近傍から更新するgrid table DPとして実装する。',
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
    primaryTagId: 'tag-randomized-algorithm',
    primaryOutcomeId: 'outcome-design-and-bound-randomized-algorithm',
    rationale:
      '素因数指数ベクトルを乱択XOR fingerprintへ写し、非零ベクトルが零へ衝突する確率を評価する設計が主である。',
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
    primaryOutcomeId: 'outcome-encode-threshold-constraints-as-two-sat',
    rationale:
      '整数変数のthresholdをboolean化し、2-SAT implication graphのSCCで可解性を判定して具体解を復元する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc281-f',
    primaryTagId: 'tag-binary-trie',
    primaryOutcomeId: 'outcome-query-bitwise-order-with-trie',
    rationale:
      '整数集合を上位bitで分岐するbinary Trieとして再帰し、共通XOR後の最大値を小さくする分岐を選ぶ。',
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
  {
    problemId: 'abc228-e',
    primaryTagId: 'tag-modular-crt',
    primaryOutcomeId: 'outcome-exploit-modular-periodicity',
    additionalPrimaryTagIds: ['tag-modular-arithmetic'],
    rationale:
      'Fermat周期による巨大指数の簡約が主であり、内外二段の剰余累乗を二分累乗で計算する技能も主解法に不可欠である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc274-ex',
    primaryTagId: 'tag-string-hash-equality',
    primaryOutcomeId: 'outcome-compare-objects-by-fingerprint',
    additionalPrimaryTagIds: ['tag-finite-field-extension'],
    rationale:
      'rolling hashによるLCP比較が主であり、XORを加法として保つnimber fieldの選択がhash合成を成立させる独立の典型技能である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc305-f',
    primaryTagId: 'tag-reachability-bfs',
    primaryOutcomeId: 'outcome-select-state-graph-search',
    additionalPrimaryTagIds: ['tag-interactive-protocol'],
    rationale:
      '未訪問頂点を辿るonline DFSが主であり、訪問時だけ得られる隣接情報と実移動を対話protocolとして維持する技能も不可欠である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc355-e',
    primaryTagId: 'tag-constructive-witness',
    primaryOutcomeId: 'outcome-recover-valid-witness',
    additionalPrimaryTagIds: ['tag-interactive-protocol'],
    rationale:
      '境界graphの最短路から質問列を復元する構成が主であり、辺の向きに応じて応答を合成する対話protocolも典型技能として発動する。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc398-e',
    primaryTagId: 'tag-game-grundy-dp',
    primaryOutcomeId: 'outcome-classify-game-states',
    additionalPrimaryTagIds: ['tag-bipartite-structure'],
    rationale:
      '合法手数のparityによるgame分類が主であり、connected bipartite graphの一意彩色から合法なcross-part辺を確定する技能も主解法を担う。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc398-g',
    primaryTagId: 'tag-game-grundy-dp',
    primaryOutcomeId: 'outcome-classify-game-states',
    additionalPrimaryTagIds: ['tag-bipartite-structure'],
    rationale:
      '残手数parityによるgame分類が主であり、彩色反転自由度を含むbipartite componentの型分類も独立した典型技能である。',
    decisionAuthorId: 'person-maintainer',
  },
  {
    problemId: 'abc411-e',
    primaryTagId: 'tag-contribution-reordering',
    primaryOutcomeId: 'outcome-reorder-counting-contributions',
    additionalPrimaryTagIds: ['tag-dynamic-modular-product'],
    rationale:
      'CDF差分による期待値寄与の並べ替えが主であり、素数法で剰余 0 の因子数と可逆な非零剰余因子の積を分離して法上の動的積を保つ技能も主解法に不可欠である。',
    decisionAuthorId: 'person-maintainer',
  },
];

const RAW_EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS: Readonly<Record<string, string>> =
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
      'tag-cyclic-exponent-counting',
      'tag-multiplicative-order',
      'tag-prime-divisor-decomposition',
      'tag-divisor-mobius-inversion',
    ],
    affectedProblemIds: ['abc212-g', 'abc222-g'],
    representativeProblemIds: ['abc212-g', 'abc222-g', 'abc230-g', 'abc335-g'],
    splitAssignments: [
      {
        finalEntityId: 'tag-cyclic-exponent-counting',
        problemIds: ['abc212-g'],
        representativeProblemIds: ['abc212-g', 'abc335-g'],
      },
      {
        finalEntityId: 'tag-multiplicative-order',
        problemIds: ['abc222-g'],
        representativeProblemIds: ['abc222-g', 'abc335-g'],
      },
      {
        finalEntityId: 'tag-prime-divisor-decomposition',
        problemIds: ['abc212-g', 'abc222-g'],
        representativeProblemIds: ['abc212-g', 'abc222-g', 'abc335-g'],
      },
      {
        finalEntityId: 'tag-divisor-mobius-inversion',
        problemIds: ['abc212-g'],
        representativeProblemIds: ['abc212-g', 'abc230-g'],
      },
    ],
    aliasesOrRedirects: ['乗法的構造と位数による数え上げ'],
    evidenceOwnerProblemIds: ['abc212-g', 'abc222-g', 'abc230-g', 'abc335-g'],
    rationale:
      '群構造は共通するが、指数化した数え上げと最小周期は別Outcomeで、補助的な素因数分解・約数Möbius反転も独立Tagに保つ。',
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
    representativeProblemIds: ['abc218-f', 'abc252-e', 'abc279-e', 'abc308-ex'],
    splitAssignments: [
      {
        finalEntityId: 'tag-witness-impact-localization',
        problemIds: ['abc218-f'],
        representativeProblemIds: ['abc218-f', 'abc279-e'],
      },
      {
        finalEntityId: 'tag-shortest-path-certificate',
        problemIds: ['abc218-f', 'abc252-e'],
        representativeProblemIds: ['abc218-f', 'abc252-e', 'abc308-ex'],
      },
    ],
    aliasesOrRedirects: ['最短路の構造復元と再利用'],
    evidenceOwnerProblemIds: ['abc218-f', 'abc252-e', 'abc279-e', 'abc308-ex'],
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
    representativeProblemIds: ['abc218-f', 'abc252-e', 'abc279-e', 'abc308-ex'],
    splitAssignments: [
      {
        finalEntityId: 'outcome-localize-change-impact-by-witness',
        problemIds: ['abc218-f'],
        representativeProblemIds: ['abc218-f', 'abc279-e'],
      },
      {
        finalEntityId: 'outcome-build-shortest-path-certificate',
        problemIds: ['abc252-e'],
        representativeProblemIds: ['abc252-e', 'abc308-ex'],
      },
    ],
    aliasesOrRedirects: ['最短路witnessから構造を復元し変更影響を絞る'],
    evidenceOwnerProblemIds: ['abc218-f', 'abc252-e', 'abc279-e', 'abc308-ex'],
    rationale: '同じ最短路基盤でも到達目標は別能力である。',
    reviewMode: 'third_party',
  },
  {
    previewEntityId: 'provisional-unit-shortest-path-structure',
    previewEntityKind: 'unit',
    action: 'split',
    finalEntityIds: ['unit-change-impact-localization', 'unit-shortest-path-reconstruction'],
    affectedProblemIds: ['abc218-f', 'abc252-e'],
    representativeProblemIds: ['abc218-f', 'abc252-e', 'abc279-e', 'abc308-ex'],
    splitAssignments: [
      {
        finalEntityId: 'unit-change-impact-localization',
        problemIds: ['abc218-f'],
        representativeProblemIds: ['abc218-f', 'abc279-e'],
      },
      {
        finalEntityId: 'unit-shortest-path-reconstruction',
        problemIds: ['abc218-f', 'abc252-e'],
        representativeProblemIds: ['abc218-f', 'abc252-e', 'abc308-ex'],
      },
    ],
    aliasesOrRedirects: ['最短路の構造復元と再利用'],
    evidenceOwnerProblemIds: ['abc218-f', 'abc252-e', 'abc279-e', 'abc308-ex'],
    rationale:
      '一般のwitnessによる変更影響局所化と、最短距離等式からcertificateを復元する教材を分ける。',
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
    finalEntityIds: ['unit-range-monoid-aggregation', 'unit-weighted-prefix-fenwick'],
    affectedProblemIds: ['abc223-f', 'abc256-f'],
    representativeProblemIds: ['abc223-f', 'abc256-f'],
    splitAssignments: [
      {
        finalEntityId: 'unit-range-monoid-aggregation',
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

const sortedUnique = (values: readonly string[]): string[] => [...new Set(values)].sort(compareIds);

const RAW_FINAL_TAXONOMY_CLAIM_DECISIONS: Readonly<Record<string, CuratedProblemClaimDecision>> =
  Object.freeze({
    ...FINAL_TAXONOMY_CLAIM_DECISIONS_212_299,
    ...FINAL_TAXONOMY_CLAIM_DECISIONS_300_383,
    ...FINAL_TAXONOMY_CLAIM_DECISIONS_384_466,
  });

interface OutcomeRefinementGroup {
  readonly from: string;
  readonly to: string;
  readonly problemIds: readonly string[];
}

/**
 * Every entry below was checked against the complete 868-problem Inventory.  It is deliberately
 * problem-qualified: a broad draft Outcome is never split by a keyword heuristic at build time.
 */
const OUTCOME_REFINEMENT_GROUPS: readonly OutcomeRefinementGroup[] = [
  {
    from: 'outcome-design-interval-split-dp',
    to: 'outcome-design-prefix-partition-dp',
    problemIds: ['abc230-f', 'abc262-ex', 'abc285-e', 'abc288-f', 'abc466-e'],
  },
  {
    from: 'outcome-design-interval-split-dp',
    to: 'outcome-design-interval-expansion-dp',
    problemIds: ['abc219-h', 'abc273-f'],
  },
  {
    from: 'outcome-design-order-preserving-dp',
    to: 'outcome-design-lis-frontier',
    problemIds: ['abc369-f', 'abc393-f', 'abc439-e'],
  },
  {
    from: 'outcome-design-order-preserving-dp',
    to: 'outcome-aggregate-subsequence-transitions-by-value',
    problemIds: ['abc240-ex', 'abc339-e', 'abc354-f', 'abc360-g', 'abc410-g'],
  },
  {
    from: 'outcome-encode-counting-by-generating-function',
    to: 'outcome-invert-generating-function-equation',
    problemIds: ['abc222-h'],
  },
  {
    from: 'outcome-encode-counting-by-generating-function',
    to: 'outcome-expand-euler-product-sparsely',
    problemIds: ['abc279-ex'],
  },
  {
    from: 'outcome-encode-counting-by-generating-function',
    to: 'outcome-derive-coefficient-recurrence-by-differentiation',
    problemIds: ['abc230-h'],
  },
  {
    from: 'outcome-prove-and-search-threshold',
    to: 'outcome-optimize-ratio-by-parametric-search',
    problemIds: ['abc236-e', 'abc294-f'],
  },

  {
    from: 'outcome-evaluate-adversarial-game-value',
    to: 'outcome-add-conway-number-games',
    problemIds: ['abc229-h', 'abc265-ex'],
  },
  {
    from: 'outcome-evaluate-adversarial-game-value',
    to: 'outcome-solve-cyclic-minimax-game',
    problemIds: ['abc261-ex', 'abc413-f'],
  },
  {
    from: 'outcome-approximate-rational-by-euclid',
    to: 'outcome-traverse-stern-brocot-ancestors',
    problemIds: ['abc273-ex'],
  },
  {
    from: 'outcome-query-bitwise-order-with-trie',
    to: 'outcome-minimize-maximum-xor-by-bit-partition',
    problemIds: ['abc281-f'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-enumerate-bounded-candidates-or-cases',
    problemIds: ['abc219-e'],
  },
  {
    from: 'outcome-jump-deterministic-transition',
    to: 'outcome-decompose-functional-graph',
    problemIds: ['abc377-e'],
  },
  {
    from: 'outcome-prove-greedy-order',
    to: 'outcome-optimize-path-matching-by-contraction',
    problemIds: ['abc218-h'],
  },
  {
    from: 'outcome-prove-greedy-order',
    to: 'outcome-stabilize-unbounded-knapsack-by-best-density',
    problemIds: ['abc310-ex'],
  },
  {
    from: 'outcome-bound-total-work',
    to: 'outcome-pass-resource-dp-through-heavy-recursion',
    problemIds: ['abc311-ex'],
  },
  {
    from: 'outcome-split-enumeration-space',
    to: 'outcome-find-orbit-hit-by-bsgs',
    problemIds: ['abc270-g'],
  },
  {
    from: 'outcome-bound-total-work',
    to: 'outcome-balance-heavy-light-threshold',
    problemIds: ['abc219-g', 'abc259-ex', 'abc335-f', 'abc345-g', 'abc350-g', 'abc365-g'],
  },
  {
    from: 'outcome-bound-total-work',
    to: 'outcome-accelerate-tree-dp-by-heavy-path',
    problemIds: ['abc269-ex'],
  },
  {
    from: 'outcome-bound-total-work',
    to: 'outcome-merge-small-into-large',
    problemIds: [
      'abc273-ex',
      'abc275-ex',
      'abc324-g',
      'abc329-f',
      'abc369-g',
      'abc411-f',
      'abc451-f',
      'abc454-g',
      'abc462-g',
    ],
  },
  {
    from: 'outcome-bound-total-work',
    to: 'outcome-bound-monotone-total-work',
    problemIds: [
      'abc217-e',
      'abc255-ex',
      'abc256-ex',
      'abc295-g',
      'abc302-e',
      'abc305-f',
      'abc307-f',
      'abc312-ex',
      'abc319-g',
      'abc368-g',
      'abc403-e',
      'abc417-g',
      'abc421-f',
      'abc426-f',
      'abc427-g',
      'abc428-f',
      'abc430-g',
      'abc435-e',
    ],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-model-min-cost-flow',
    problemIds: ['abc214-h', 'abc224-h', 'abc231-h', 'abc247-g', 'abc407-g', 'abc421-g'],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-solve-weighted-bipartite-matching',
    problemIds: ['abc373-g'],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-optimize-by-lagrangian-relaxation',
    problemIds: ['abc393-g'],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-solve-min-weight-general-perfect-matching',
    problemIds: ['abc412-g'],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-solve-flow-with-lower-bounds',
    problemIds: ['abc285-g'],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-solve-bipartite-matching',
    problemIds: [
      'abc274-g',
      'abc313-ex',
      'abc317-g',
      'abc320-g',
      'abc374-g',
      'abc401-g',
      'abc445-g',
      'abc461-g',
    ],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-model-max-flow-min-cut',
    problemIds: [
      'abc241-g',
      'abc437-g',
      'abc225-g',
      'abc227-h',
      'abc239-g',
      'abc259-g',
      'abc263-g',
      'abc318-g',
      'abc326-g',
      'abc332-g',
      'abc347-g',
      'abc397-g',
      'abc413-g',
    ],
  },
  {
    from: 'outcome-characterize-walk-by-degrees',
    to: 'outcome-construct-euler-trail-or-circuit',
    problemIds: ['abc227-h', 'abc286-g', 'abc336-g'],
  },
  {
    from: 'outcome-characterize-walk-by-degrees',
    to: 'outcome-construct-degree-parity-subgraph',
    problemIds: ['abc345-f'],
  },
  {
    from: 'outcome-reduce-graph-by-peeling-or-kernelization',
    to: 'outcome-peel-graph-core',
    problemIds: ['abc266-f'],
  },
  {
    from: 'outcome-reduce-graph-by-peeling-or-kernelization',
    to: 'outcome-kernelize-near-tree-graph',
    problemIds: ['abc419-g'],
  },
  {
    from: 'outcome-maintain-dynamic-order-statistics',
    to: 'outcome-maintain-ordered-interval-partition',
    problemIds: ['abc255-ex', 'abc256-ex', 'abc380-e', 'abc435-e', 'abc465-g'],
  },
  {
    from: 'outcome-maintain-dynamic-order-statistics',
    to: 'outcome-enumerate-frontier-best-first',
    problemIds: [
      'abc214-e',
      'abc217-e',
      'abc218-h',
      'abc249-f',
      'abc250-g',
      'abc252-f',
      'abc297-e',
      'abc304-ex',
      'abc305-e',
      'abc307-f',
      'abc308-f',
      'abc319-f',
      'abc320-e',
      'abc331-e',
      'abc342-g',
      'abc359-f',
      'abc373-f',
      'abc376-e',
      'abc376-g',
      'abc384-e',
      'abc391-f',
      'abc407-e',
      'abc409-f',
      'abc433-e',
      'abc440-e',
    ],
  },
  {
    from: 'outcome-maintain-dynamic-order-statistics',
    to: 'outcome-maintain-ordered-set-statistics',
    problemIds: [
      'abc218-g',
      'abc245-e',
      'abc268-ex',
      'abc273-ex',
      'abc275-ex',
      'abc281-e',
      'abc306-e',
      'abc308-g',
      'abc314-g',
      'abc319-g',
      'abc324-g',
      'abc330-e',
      'abc356-f',
      'abc364-f',
      'abc368-g',
      'abc406-g',
      'abc407-f',
      'abc418-f',
      'abc431-g',
      'abc440-f',
      'abc444-e',
    ],
  },
  {
    from: 'outcome-share-or-revert-versions',
    to: 'outcome-persist-data-structure-versions',
    problemIds: ['abc273-e', 'abc453-g'],
  },
  {
    from: 'outcome-share-or-revert-versions',
    to: 'outcome-rollback-reversible-updates',
    problemIds: ['abc218-g', 'abc302-ex', 'abc363-g'],
  },
  {
    from: 'outcome-compare-objects-by-fingerprint',
    to: 'outcome-compare-sequences-by-rolling-fingerprint',
    problemIds: ['abc274-ex', 'abc331-f'],
  },
  {
    from: 'outcome-compare-objects-by-fingerprint',
    to: 'outcome-compare-algebraic-objects-by-random-fingerprint',
    problemIds: ['abc238-g', 'abc339-f', 'abc367-f', 'abc455-g'],
  },
  {
    from: 'outcome-exploit-convexity',
    to: 'outcome-maintain-piecewise-linear-convex-function',
    problemIds: ['abc217-h', 'abc250-g', 'abc275-ex', 'abc406-g', 'abc458-g'],
  },
  {
    from: 'outcome-exploit-convexity',
    to: 'outcome-optimize-by-lagrangian-relaxation',
    problemIds: ['abc305-ex', 'abc355-g', 'abc393-g', 'abc400-g'],
  },
  {
    from: 'outcome-exploit-convexity',
    to: 'outcome-optimize-monge-transitions',
    problemIds: ['abc348-g', 'abc383-g'],
  },
  {
    from: 'outcome-exploit-convexity',
    to: 'outcome-solve-isotonic-regression-by-pav',
    problemIds: ['abc459-f'],
  },
  {
    from: 'outcome-exploit-convexity',
    to: 'outcome-allocate-by-convex-marginal-costs',
    problemIds: ['abc359-f', 'abc369-g', 'abc373-f', 'abc389-e'],
  },
  {
    from: 'outcome-exploit-convexity',
    to: 'outcome-optimize-univariate-convex-function',
    problemIds: [
      'abc224-g',
      'abc229-g',
      'abc240-f',
      'abc263-g',
      'abc314-ex',
      'abc330-f',
      'abc459-g',
      'abc462-e',
    ],
  },
  {
    from: 'outcome-transform-to-linear-system-or-rank',
    to: 'outcome-maintain-xor-linear-basis',
    problemIds: ['abc223-h', 'abc249-g', 'abc283-g', 'abc451-g'],
  },
  {
    from: 'outcome-transform-to-linear-system-or-rank',
    to: 'outcome-factor-separable-linear-transform',
    problemIds: ['abc212-h', 'abc220-h', 'abc265-ex', 'abc367-g'],
  },
  {
    from: 'outcome-transform-to-linear-system-or-rank',
    to: 'outcome-propagate-static-graph-potentials',
    problemIds: ['abc396-e'],
  },
  {
    from: 'outcome-transform-to-linear-system-or-rank',
    to: 'outcome-optimize-weighted-matroid-basis',
    problemIds: ['abc236-f'],
  },
  {
    from: 'outcome-transform-to-linear-system-or-rank',
    to: 'outcome-test-linear-matroid-intersection-rank',
    problemIds: ['abc399-g'],
  },
  {
    from: 'outcome-transform-to-linear-system-or-rank',
    to: 'outcome-solve-linear-system-and-rank',
    problemIds: ['abc276-ex', 'abc278-ex', 'abc323-g', 'abc366-g', 'abc412-g'],
  },
  {
    from: 'outcome-evaluate-and-compose-polynomials',
    to: 'outcome-evaluate-polynomial-at-many-points',
    problemIds: ['abc272-ex', 'abc323-g'],
  },
  {
    from: 'outcome-evaluate-and-compose-polynomials',
    to: 'outcome-compose-series-and-project-powers',
    problemIds: ['abc387-g', 'abc439-g'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-compute-subset-convolution',
    problemIds: ['abc294-ex'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-determinize-automaton-by-subsets',
    problemIds: ['abc228-g'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-apply-subset-zeta-mobius-transform',
    problemIds: ['abc215-h', 'abc295-ex', 'abc349-f', 'abc423-f'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-solve-steiner-tree-by-subset-dp',
    problemIds: ['abc364-g', 'abc395-g'],
  },
  {
    from: 'outcome-correct-overlap-by-inversion',
    to: 'outcome-invert-divisor-lattice-by-mobius',
    problemIds: ['abc212-g', 'abc230-g', 'abc304-f', 'abc335-g', 'abc361-f'],
  },
  {
    from: 'outcome-correct-overlap-by-inversion',
    to: 'outcome-apply-subset-zeta-mobius-transform',
    problemIds: ['abc423-f'],
  },
  {
    from: 'outcome-condense-and-order-directed-graph',
    to: 'outcome-process-dag-in-topological-order',
    problemIds: ['abc277-f', 'abc291-e', 'abc304-ex', 'abc315-e'],
  },
  {
    from: 'outcome-condense-and-order-directed-graph',
    to: 'outcome-peel-directed-graph-toward-cycles',
    problemIds: ['abc245-f', 'abc456-e'],
  },
  {
    from: 'outcome-condense-and-order-directed-graph',
    to: 'outcome-contract-monotone-paths-with-jump-pointers',
    problemIds: ['abc295-g'],
  },
  {
    from: 'outcome-condense-and-order-directed-graph',
    to: 'outcome-solve-bipartite-matching',
    problemIds: ['abc374-g'],
  },
  {
    from: 'outcome-design-associative-range-summary',
    to: 'outcome-compose-finite-functions',
    problemIds: ['abc261-e'],
  },
  {
    from: 'outcome-design-associative-range-summary',
    to: 'outcome-build-static-sorted-range-index',
    problemIds: ['abc339-g'],
  },
  {
    from: 'outcome-design-associative-range-summary',
    to: 'outcome-maintain-queue-aggregate-with-swag',
    problemIds: ['abc456-f'],
  },
  {
    from: 'outcome-design-associative-range-summary',
    to: 'outcome-maintain-sparse-domain-segment-tree',
    problemIds: ['abc403-g'],
  },
  {
    from: 'outcome-design-range-update-action',
    to: 'outcome-prune-range-actions-by-node-invariant',
    problemIds: ['abc430-g'],
  },
  {
    from: 'outcome-recover-valid-witness',
    to: 'outcome-answer-idempotent-range-query',
    problemIds: ['abc282-f'],
  },
  {
    from: 'outcome-recover-valid-witness',
    to: 'outcome-select-state-graph-search',
    problemIds: ['abc355-e'],
  },
  {
    from: 'outcome-design-minimal-sufficient-state',
    to: 'outcome-determinize-automaton-by-subsets',
    problemIds: ['abc228-g'],
  },
  {
    from: 'outcome-accelerate-fixed-linear-transition',
    to: 'outcome-accelerate-iteration-by-characteristic-p-frobenius',
    problemIds: ['abc251-ex'],
  },
  {
    from: 'outcome-evaluate-compressed-integer-blocks',
    to: 'outcome-maintain-ordered-interval-partition',
    problemIds: ['abc251-ex'],
  },
  {
    from: 'outcome-count-combinatorial-objects-by-determinant',
    to: 'outcome-count-euler-circuits-by-best',
    problemIds: ['abc336-g'],
  },
  {
    from: 'outcome-factor-and-accelerate-transitions',
    to: 'outcome-optimize-monge-transitions',
    problemIds: ['abc348-g'],
  },
  {
    from: 'outcome-maintain-connectivity-components',
    to: 'outcome-share-threshold-checks-by-parallel-binary-search',
    problemIds: ['abc394-g'],
  },
  {
    from: 'outcome-maintain-connectivity-components',
    to: 'outcome-optimize-mask-by-bitwise-feasibility',
    problemIds: ['abc408-e'],
  },
  {
    from: 'outcome-maintain-connectivity-components',
    to: 'outcome-dualize-planar-cut-to-path',
    problemIds: ['abc413-g'],
  },
  {
    from: 'outcome-maintain-connectivity-components',
    to: 'outcome-build-component-merge-tree',
    problemIds: ['abc314-f'],
  },
  {
    from: 'outcome-construct-optimal-spanning-tree',
    to: 'outcome-sweep-connectivity-by-kruskal-threshold',
    problemIds: ['abc235-e', 'abc383-e'],
  },
  {
    from: 'outcome-normalize-equivalent-states',
    to: 'outcome-normalize-string-to-primitive-period',
    problemIds: ['abc312-ex'],
  },
  {
    from: 'outcome-query-recursively-defined-string',
    to: 'outcome-evolve-run-length-encoded-state',
    problemIds: ['abc313-e'],
  },
  {
    from: 'outcome-evaluate-and-compose-polynomials',
    to: 'outcome-extract-rational-series-coefficient',
    problemIds: ['abc300-ex'],
  },
  {
    from: 'outcome-encode-counting-by-generating-function',
    to: 'outcome-extract-rational-series-coefficient',
    problemIds: ['abc300-ex'],
  },
  {
    from: 'outcome-compute-convolution-or-correlation',
    to: 'outcome-compute-online-relaxed-convolution',
    problemIds: ['abc213-h', 'abc230-h', 'abc281-ex', 'abc315-ex', 'abc357-g'],
  },
  {
    from: 'outcome-decompose-by-prime-or-divisor',
    to: 'outcome-sum-multiplicative-function-by-min25-sieve',
    problemIds: ['abc370-g'],
  },
  {
    from: 'outcome-decompose-by-prime-or-divisor',
    to: 'outcome-represent-integers-as-two-squares',
    problemIds: ['abc444-g'],
  },
  {
    from: 'outcome-optimize-by-line-envelope',
    to: 'outcome-restrict-geometric-candidates-to-boundary',
    problemIds: ['abc341-g'],
  },
  {
    from: 'outcome-reduce-geometry-to-algebraic-predicates',
    to: 'outcome-enumerate-bounded-candidates-or-cases',
    problemIds: ['abc312-e'],
  },
  {
    from: 'outcome-jump-deterministic-transition',
    to: 'outcome-solve-modular-constraints',
    problemIds: ['abc371-g'],
  },
  {
    from: 'outcome-solve-modular-constraints',
    to: 'outcome-exploit-modular-periodicity',
    problemIds: ['abc319-e'],
  },
  {
    from: 'outcome-prune-dominated-candidates-once',
    to: 'outcome-solve-isotonic-regression-by-pav',
    problemIds: ['abc459-f'],
  },
  {
    from: 'outcome-aggregate-rooted-tree',
    to: 'outcome-flatten-tree-by-euler-order',
    problemIds: ['abc240-e'],
  },
  {
    from: 'outcome-augment-components-with-metadata',
    to: 'outcome-build-component-merge-tree',
    problemIds: ['abc314-f'],
  },
  {
    from: 'outcome-compute-convolution-or-correlation',
    to: 'outcome-encode-labeled-trees-by-prufer-code',
    problemIds: ['abc303-ex'],
  },
  {
    from: 'outcome-encode-counting-by-generating-function',
    to: 'outcome-encode-labeled-trees-by-prufer-code',
    problemIds: ['abc303-ex'],
  },
  {
    from: 'outcome-reduce-integer-structure-by-gcd',
    to: 'outcome-compute-directed-walk-period',
    problemIds: ['abc306-g'],
  },
  {
    from: 'outcome-bound-reachability-in-numerical-semigroup',
    to: 'outcome-compute-directed-walk-period',
    problemIds: ['abc306-g'],
  },
  {
    from: 'outcome-compute-convolution-or-correlation',
    to: 'outcome-remove-boundaries-by-reflection',
    problemIds: ['abc309-ex'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-count-labeled-structures-by-components',
    problemIds: ['abc213-g', 'abc236-ex', 'abc253-ex', 'abc321-g'],
  },
  {
    from: 'outcome-formulate-combinatorial-coefficients',
    to: 'outcome-count-labeled-structures-by-components',
    problemIds: ['abc327-g'],
  },
  {
    from: 'outcome-prove-and-search-threshold',
    to: 'outcome-optimize-ratio-by-parametric-search',
    problemIds: ['abc324-f'],
  },
  {
    from: 'outcome-recover-valid-witness',
    to: 'outcome-design-query-code-by-information-bound',
    problemIds: ['abc337-e'],
  },
  {
    from: 'outcome-reduce-geometry-to-algebraic-predicates',
    to: 'outcome-detect-crossing-by-cyclic-order',
    problemIds: ['abc338-e'],
  },
  {
    from: 'outcome-linearize-events',
    to: 'outcome-maintain-order-through-crossing-events',
    problemIds: ['abc344-g'],
  },
  {
    from: 'outcome-reduce-selection-to-network-optimization',
    to: 'outcome-optimize-poset-antichain-by-dilworth',
    problemIds: ['abc237-ex', 'abc354-g'],
  },
  {
    from: 'outcome-design-order-preserving-dp',
    to: 'outcome-optimize-poset-antichain-by-dilworth',
    problemIds: ['abc457-g'],
  },
  {
    from: 'outcome-prove-greedy-order',
    to: 'outcome-optimize-tree-order-by-cluster-contraction',
    problemIds: ['abc376-g'],
  },
  {
    from: 'outcome-design-minimal-sufficient-state',
    to: 'outcome-design-frontier-profile-dp',
    problemIds: ['abc248-f', 'abc296-ex', 'abc379-g'],
  },
  {
    from: 'outcome-accelerate-fixed-linear-transition',
    to: 'outcome-exponentiate-transition-over-semiring',
    problemIds: ['abc236-g', 'abc445-f'],
  },
  {
    from: 'outcome-accelerate-fixed-linear-transition',
    to: 'outcome-exponentiate-associative-composition',
    problemIds: ['abc448-e'],
  },
  {
    from: 'outcome-recover-valid-witness',
    to: 'outcome-reconstruct-tree-from-distance-matrix',
    problemIds: ['abc451-e'],
  },
  {
    from: 'outcome-condense-and-order-directed-graph',
    to: 'outcome-process-dag-in-topological-order',
    problemIds: ['abc324-f'],
  },
  {
    from: 'outcome-select-state-graph-search',
    to: 'outcome-enumerate-by-reversible-backtracking',
    problemIds: ['abc284-e'],
  },
  {
    from: 'outcome-model-and-compute-shortest-path',
    to: 'outcome-solve-difference-constraints',
    problemIds: ['abc216-g', 'abc404-g'],
  },
  {
    from: 'outcome-maintain-potential-differences',
    to: 'outcome-propagate-static-graph-potentials',
    problemIds: ['abc280-f', 'abc352-f'],
  },
  {
    from: 'outcome-maintain-dynamic-order-statistics',
    to: 'outcome-optimize-path-matching-by-contraction',
    problemIds: ['abc464-g'],
  },
  {
    from: 'outcome-design-resource-dp',
    to: 'outcome-stabilize-unbounded-knapsack-by-best-density',
    problemIds: ['abc415-g'],
  },
  {
    from: 'outcome-build-finite-string-automaton',
    to: 'outcome-run-dp-on-finite-automaton',
    problemIds: ['abc391-g'],
  },
  {
    from: 'outcome-count-combinatorial-objects-by-determinant',
    to: 'outcome-count-nonintersecting-paths-by-lgv',
    problemIds: ['abc216-h'],
  },
  {
    from: 'outcome-partition-integer-parameter-ranges',
    to: 'outcome-sum-affine-floors-by-euclid',
    problemIds: ['abc283-ex', 'abc313-g', 'abc372-g', 'abc402-g', 'abc443-g'],
  },
  {
    from: 'outcome-solve-stochastic-recurrence',
    to: 'outcome-propagate-probability-distribution',
    problemIds: [
      'abc226-h',
      'abc271-g',
      'abc275-e',
      'abc277-g',
      'abc298-e',
      'abc300-e',
      'abc310-f',
      'abc323-e',
      'abc326-e',
      'abc333-f',
      'abc360-e',
    ],
  },
  {
    from: 'outcome-solve-stochastic-recurrence',
    to: 'outcome-optimize-stochastic-actions',
    problemIds: [
      'abc266-e',
      'abc314-e',
      'abc342-f',
      'abc350-e',
      'abc402-e',
      'abc404-f',
      'abc421-e',
    ],
  },
  {
    from: 'outcome-linearize-events',
    to: 'outcome-maintain-order-through-crossing-events',
    problemIds: ['abc257-ex'],
  },
];

const outcomeRefinementByKey = new Map<string, string>();
for (const group of [
  ...OUTCOME_REFINEMENT_GROUPS,
  {
    from: 'outcome-factor-and-accelerate-transitions',
    to: 'outcome-subtract-exception-transitions',
    problemIds: ['abc212-e', 'abc370-e', 'abc319-g'],
  },
  {
    from: 'outcome-factor-and-accelerate-transitions',
    to: 'outcome-normalize-common-dp-action',
    problemIds: ['abc372-f', 'abc457-f', 'abc435-g'],
  },
  {
    from: 'outcome-factor-and-accelerate-transitions',
    to: 'outcome-compress-dp-sufficient-aggregates',
    problemIds: ['abc224-e', 'abc243-g', 'abc288-f', 'abc338-g'],
  },
  {
    from: 'outcome-factor-and-accelerate-transitions',
    to: 'outcome-slide-transition-recurrence',
    problemIds: ['abc235-g', 'abc333-f'],
  },
  {
    from: 'outcome-factor-and-accelerate-transitions',
    to: 'outcome-close-eventual-dp-tail',
    problemIds: ['abc358-g'],
  },
  {
    from: 'outcome-model-and-compute-shortest-path',
    to: 'outcome-relax-in-dependency-order',
    problemIds: ['abc271-e', 'abc291-f', 'abc429-f'],
  },
  {
    from: 'outcome-model-and-compute-shortest-path',
    to: 'outcome-detect-improving-cycles',
    problemIds: ['abc264-g', 'abc393-g'],
  },
  {
    from: 'outcome-model-and-compute-shortest-path',
    to: 'outcome-compute-all-pairs-distance',
    problemIds: [
      'abc243-e',
      'abc261-g',
      'abc286-e',
      'abc338-f',
      'abc369-e',
      'abc375-f',
      'abc416-e',
    ],
  },
  {
    from: 'outcome-build-balanced-separator-decomposition',
    to: 'outcome-find-weighted-balanced-separator',
    problemIds: ['abc453-f'],
  },
  {
    from: 'outcome-enumerate-subset-state-space',
    to: 'outcome-enumerate-subsets-by-mask',
    problemIds: ['abc246-f'],
  },
  {
    from: 'outcome-evaluate-and-compose-polynomials',
    to: 'outcome-evaluate-at-geometric-points',
    problemIds: ['abc381-g'],
  },
]) {
  for (const problemId of group.problemIds) {
    const key = `${problemId}\u0000${group.from}`;
    const previous = outcomeRefinementByKey.get(key);
    if (previous !== undefined && previous !== group.to) {
      throw new Error(`FINAL_TAXONOMY_CONFLICTING_REFINEMENT:${problemId}/${group.from}`);
    }
    outcomeRefinementByKey.set(key, group.to);
  }
}

const refineOutcomeId = (problemId: string, outcomeId: string): string =>
  outcomeRefinementByKey.get(`${problemId}\u0000${outcomeId}`) ?? outcomeId;

const primaryOutcomeAdditionsByProblemId: Readonly<Record<string, readonly string[]>> = {
  'abc222-h': ['outcome-derive-coefficient-recurrence-by-differentiation'],
  'abc228-g': ['outcome-run-dp-on-finite-automaton'],
  'abc301-f': ['outcome-run-dp-on-finite-automaton'],
  'abc305-g': ['outcome-run-dp-on-finite-automaton'],
  'abc355-g': ['outcome-optimize-monge-transitions'],
  'abc357-g': ['outcome-compute-online-relaxed-convolution'],
  'abc418-g': ['outcome-run-dp-on-finite-automaton'],
  'abc419-f': ['outcome-run-dp-on-finite-automaton'],
  'abc419-g': ['outcome-use-cycle-space-basis'],
  'abc458-f': ['outcome-run-dp-on-finite-automaton'],
};

const additionalPrimaryOutcomeRemovalsByProblemId: Readonly<Record<string, readonly string[]>> = {
  'abc300-ex': ['outcome-compute-convolution-or-correlation'],
  'abc315-ex': ['outcome-encode-counting-by-generating-function'],
};

interface SupportingOutcomeAddition {
  readonly outcomeId: string;
  readonly claimPaths: readonly string[];
}

const supportingOutcomeAdditionsByProblemId: Readonly<
  Record<string, readonly SupportingOutcomeAddition[]>
> = {
  'abc279-ex': [
    {
      outcomeId: 'outcome-compute-binomial-by-lucas',
      claimPaths: ['/typicalTechniques/2', '/prerequisiteCandidates/2'],
    },
  ],
  'abc213-g': [
    {
      outcomeId: 'outcome-enumerate-subset-state-space',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc237-ex': [
    {
      outcomeId: 'outcome-solve-bipartite-matching',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc228-g': [
    { outcomeId: 'outcome-enumerate-subset-state-space', claimPaths: ['/typicalTechniques/2'] },
  ],
  'abc236-f': [
    {
      outcomeId: 'outcome-maintain-xor-linear-basis',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc263-ex': [
    {
      outcomeId: 'outcome-detect-crossing-by-cyclic-order',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc285-g': [
    {
      outcomeId: 'outcome-model-max-flow-min-cut',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc294-ex': [
    {
      outcomeId: 'outcome-recur-by-edge-deletion-contraction',
      claimPaths: ['/typicalTechniques/0'],
    },
  ],
  'abc314-f': [
    {
      outcomeId: 'outcome-augment-components-with-metadata',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc295-ex': [
    { outcomeId: 'outcome-enumerate-subset-state-space', claimPaths: ['/typicalTechniques/0'] },
  ],
  'abc296-ex': [
    {
      outcomeId: 'outcome-design-minimal-sufficient-state',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc300-ex': [
    {
      outcomeId: 'outcome-compute-convolution-or-correlation',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc303-ex': [
    {
      outcomeId: 'outcome-compute-convolution-or-correlation',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
    {
      outcomeId: 'outcome-encode-counting-by-generating-function',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc306-g': [
    {
      outcomeId: 'outcome-reduce-integer-structure-by-gcd',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc309-ex': [
    {
      outcomeId: 'outcome-compute-convolution-or-correlation',
      claimPaths: [
        '/typicalTechniques/1',
        '/prerequisiteCandidates/0',
        '/prerequisiteCandidates/1',
      ],
    },
  ],
  'abc315-ex': [
    {
      outcomeId: 'outcome-compute-convolution-or-correlation',
      claimPaths: ['/prerequisiteCandidates/0'],
    },
    {
      outcomeId: 'outcome-encode-counting-by-generating-function',
      claimPaths: ['/typicalTechniques/1'],
    },
  ],
  'abc321-g': [
    {
      outcomeId: 'outcome-enumerate-subset-state-space',
      claimPaths: [
        '/typicalTechniques/1',
        '/typicalTechniques/2',
        '/prerequisiteCandidates/1',
        '/prerequisiteCandidates/2',
      ],
    },
  ],
  'abc324-f': [
    {
      outcomeId: 'outcome-prove-and-search-threshold',
      claimPaths: [
        '/typicalTechniques/2',
        '/prerequisiteCandidates/1',
        '/prerequisiteCandidates/2',
      ],
    },
  ],
  'abc327-g': [
    {
      outcomeId: 'outcome-formulate-combinatorial-coefficients',
      claimPaths: ['/typicalTechniques/2', '/typicalTechniques/3', '/prerequisiteCandidates/2'],
    },
  ],
  'abc336-g': [
    {
      outcomeId: 'outcome-count-combinatorial-objects-by-determinant',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc344-g': [
    {
      outcomeId: 'outcome-linearize-events',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc354-g': [
    {
      outcomeId: 'outcome-model-max-flow-min-cut',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc374-g': [
    {
      outcomeId: 'outcome-condense-and-order-directed-graph',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
    {
      outcomeId: 'outcome-compute-transitive-closure',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc376-g': [
    {
      outcomeId: 'outcome-prove-greedy-order',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc379-g': [
    {
      outcomeId: 'outcome-design-minimal-sufficient-state',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc393-g': [
    { outcomeId: 'outcome-model-min-cost-flow', claimPaths: ['/prerequisiteCandidates/0'] },
  ],
  'abc394-g': [
    {
      outcomeId: 'outcome-maintain-connectivity-components',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc399-g': [
    {
      outcomeId: 'outcome-solve-linear-system-and-rank',
      claimPaths: ['/typicalTechniques/2', '/prerequisiteCandidates/1'],
    },
  ],
  'abc408-e': [
    {
      outcomeId: 'outcome-maintain-connectivity-components',
      claimPaths: ['/typicalTechniques/1', '/typicalTechniques/2', '/prerequisiteCandidates/0'],
    },
  ],
  'abc413-g': [
    {
      outcomeId: 'outcome-maintain-connectivity-components',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc424-f': [
    {
      outcomeId: 'outcome-detect-crossing-by-cyclic-order',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc429-f': [
    {
      outcomeId: 'outcome-exponentiate-transition-over-semiring',
      claimPaths: ['/typicalTechniques/0', '/prerequisiteCandidates/0'],
    },
  ],
  'abc448-e': [
    {
      outcomeId: 'outcome-compute-in-modular-arithmetic',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc451-e': [
    {
      outcomeId: 'outcome-recover-valid-witness',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
  'abc457-g': [
    {
      outcomeId: 'outcome-design-order-preserving-dp',
      claimPaths: ['/typicalTechniques/1', '/prerequisiteCandidates/0'],
    },
  ],
};

type ClaimDispositionRoleOverride = 'primary' | 'supporting';
const claimDispositionRoleOverrides: Readonly<Record<string, ClaimDispositionRoleOverride>> = {
  [`abc213-g\u0000/typicalTechniques/0\u0000same_tag`]: 'primary',
  [`abc213-g\u0000/typicalTechniques/1\u0000primary`]: 'supporting',
  [`abc213-g\u0000/prerequisiteCandidates/0\u0000same_tag`]: 'supporting',
  [`abc303-ex\u0000/typicalTechniques/1\u0000primary`]: 'supporting',
  [`abc309-ex\u0000/typicalTechniques/0\u0000problem_specific`]: 'primary',
  [`abc309-ex\u0000/typicalTechniques/1\u0000primary`]: 'supporting',
  [`abc327-g\u0000/typicalTechniques/2\u0000primary`]: 'supporting',
  [`abc327-g\u0000/typicalTechniques/3\u0000same_tag`]: 'supporting',
  [`abc337-e\u0000/typicalTechniques/0\u0000problem_specific`]: 'primary',
  [`abc374-g\u0000/typicalTechniques/0\u0000primary`]: 'supporting',
  [`abc374-g\u0000/typicalTechniques/1\u0000supporting`]: 'primary',
};

const primaryClaimPathAdditionsByProblemId: Readonly<Record<string, readonly string[]>> = {
  'abc303-ex': ['/typicalTechniques/0'],
  'abc327-g': ['/typicalTechniques/1'],
};

const tagIdsByOutcomeId = new Map<string, string[]>();
for (const tag of FINAL_TAXONOMY_TAGS) {
  for (const outcomeId of tag.learningOutcomeIds) {
    tagIdsByOutcomeId.set(outcomeId, [...(tagIdsByOutcomeId.get(outcomeId) ?? []), tag.id]);
  }
}

const primaryTagIdsForOutcomeIds = (outcomeIds: readonly string[]): readonly string[] =>
  sortedUnique(
    outcomeIds.flatMap((outcomeId) =>
      (tagIdsByOutcomeId.get(outcomeId) ?? []).filter(
        (tagId) => tagById.get(tagId)?.primaryEligible === true,
      ),
    ),
  );

const uniquePrimaryTagIdForOutcome = (problemId: string, outcomeId: string): string => {
  const tagIds = primaryTagIdsForOutcomeIds([outcomeId]);
  const tagId = tagIds[0];
  if (tagIds.length !== 1 || tagId === undefined) {
    throw new Error(
      `FINAL_TAXONOMY_CLAIM_OUTCOME_OWNER_NOT_UNIQUE:${problemId}/${outcomeId}/${tagIds.join(',')}`,
    );
  }
  return tagId;
};

const normalizeMultiPrimaryClaimDecision = (
  problemId: string,
  raw: CuratedProblemClaimDecision,
  primaryOutcomeId: string,
  additionalPrimaryOutcomeIds: readonly string[],
): CuratedProblemClaimDecision => {
  const bindings = FINAL_MULTI_PRIMARY_CLAIM_OUTCOME_BINDINGS[problemId];
  if (bindings === undefined) {
    throw new Error(`FINAL_TAXONOMY_MULTI_PRIMARY_CLAIM_BINDINGS_MISSING:${problemId}`);
  }

  const primaryOutcomeIds = sortedUnique([primaryOutcomeId, ...additionalPrimaryOutcomeIds]);
  const primaryOutcomeIdSet = new Set(primaryOutcomeIds);
  const primaryTagIds = primaryOutcomeIds.map((outcomeId) =>
    uniquePrimaryTagIdForOutcome(problemId, outcomeId),
  );
  const primaryTagIdSet = new Set(primaryTagIds);
  const rawClaimPaths = new Set(raw.dispositions.map(({ claimPath }) => claimPath));
  const boundClaimPaths = new Set(Object.keys(bindings));
  const dispositionByKey = new Map<string, CuratedInventoryClaimDisposition>();
  const supportingOutcomeIdsByTagMutable = new Map<string, Set<string>>();
  const primaryBoundOutcomeIds = new Set<string>();

  const addDisposition = (disposition: CuratedInventoryClaimDisposition): void => {
    const tagIds = sortedUnique(disposition.tagIds);
    const normalized = { ...disposition, tagIds };
    const key = `${normalized.claimPath}\u0000${normalized.kind}\u0000${tagIds.join('\u0000')}`;
    dispositionByKey.set(key, normalized);
  };

  const supportingTagIdsByRawTag = new Map<string, readonly string[]>();
  for (const [rawTagId, rawOutcomeIds] of Object.entries(raw.supportingOutcomeIdsByTag)) {
    const supportingOutcomeIds = sortedUnique(
      rawOutcomeIds
        .map((outcomeId) => refineOutcomeId(problemId, outcomeId))
        .filter((outcomeId) => !primaryOutcomeIdSet.has(outcomeId)),
    );
    const tagIds = sortedUnique(
      supportingOutcomeIds.map((outcomeId) => uniquePrimaryTagIdForOutcome(problemId, outcomeId)),
    );
    supportingTagIdsByRawTag.set(rawTagId, tagIds);
    for (const outcomeId of supportingOutcomeIds) {
      const tagId = uniquePrimaryTagIdForOutcome(problemId, outcomeId);
      const outcomes = supportingOutcomeIdsByTagMutable.get(tagId) ?? new Set<string>();
      outcomes.add(outcomeId);
      supportingOutcomeIdsByTagMutable.set(tagId, outcomes);
    }
  }

  for (const [claimPath, claimBindings] of Object.entries(bindings)) {
    if (!rawClaimPaths.has(claimPath)) {
      throw new Error(`FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_PATH_UNKNOWN:${problemId}${claimPath}`);
    }
    const bindingKeys = new Set<string>();
    for (const binding of claimBindings) {
      const outcomeIds = sortedUnique(binding.outcomeIds);
      if (outcomeIds.length === 0) {
        throw new Error(
          `FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_OUTCOME_EMPTY:${problemId}${claimPath}`,
        );
      }
      const bindingKey = `${binding.kind}\u0000${outcomeIds.join('\u0000')}`;
      if (bindingKeys.has(bindingKey)) {
        throw new Error(`FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_DUPLICATE:${problemId}${claimPath}`);
      }
      bindingKeys.add(bindingKey);

      const isPrimaryRole = binding.kind === 'primary' || binding.kind === 'same_tag';
      if (
        outcomeIds.some((outcomeId) =>
          isPrimaryRole ? !primaryOutcomeIdSet.has(outcomeId) : primaryOutcomeIdSet.has(outcomeId),
        )
      ) {
        throw new Error(
          `FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_ROLE_INVALID:${problemId}${claimPath}/${binding.kind}/${outcomeIds.join(',')}`,
        );
      }
      if (binding.kind === 'primary' && !claimPath.startsWith('/typicalTechniques/')) {
        throw new Error(
          `FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_PRIMARY_PATH_INVALID:${problemId}${claimPath}`,
        );
      }

      const tagIds = sortedUnique(
        outcomeIds.map((outcomeId) => uniquePrimaryTagIdForOutcome(problemId, outcomeId)),
      );
      if (
        isPrimaryRole
          ? tagIds.some((tagId) => !primaryTagIdSet.has(tagId))
          : tagIds.some((tagId) => primaryTagIdSet.has(tagId))
      ) {
        throw new Error(
          `FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_TAG_ROLE_INVALID:${problemId}${claimPath}/${binding.kind}/${tagIds.join(',')}`,
        );
      }
      if (binding.kind === 'primary') {
        for (const outcomeId of outcomeIds) primaryBoundOutcomeIds.add(outcomeId);
      }
      if (binding.kind === 'supporting') {
        for (const outcomeId of outcomeIds) {
          const tagId = uniquePrimaryTagIdForOutcome(problemId, outcomeId);
          const outcomes = supportingOutcomeIdsByTagMutable.get(tagId) ?? new Set<string>();
          outcomes.add(outcomeId);
          supportingOutcomeIdsByTagMutable.set(tagId, outcomes);
        }
      }
      addDisposition({ claimPath, kind: binding.kind, tagIds });
    }
  }

  for (const outcomeId of primaryOutcomeIds) {
    if (!primaryBoundOutcomeIds.has(outcomeId)) {
      throw new Error(
        `FINAL_TAXONOMY_MULTI_PRIMARY_OUTCOME_CLAIM_MISSING:${problemId}/${outcomeId}`,
      );
    }
  }

  for (const disposition of raw.dispositions) {
    if (boundClaimPaths.has(disposition.claimPath)) {
      if (disposition.kind === 'baseline' || disposition.kind === 'problem_specific') {
        throw new Error(
          `FINAL_TAXONOMY_MULTI_PRIMARY_BINDING_TERMINAL_CONFLICT:${problemId}${disposition.claimPath}`,
        );
      }
      continue;
    }
    if (disposition.kind === 'primary' || disposition.kind === 'same_tag') {
      throw new Error(
        `FINAL_TAXONOMY_MULTI_PRIMARY_RAW_BINDING_MISSING:${problemId}${disposition.claimPath}/${disposition.kind}`,
      );
    }
    if (disposition.kind === 'baseline' || disposition.kind === 'problem_specific') {
      addDisposition({ ...disposition, tagIds: [] });
      continue;
    }

    const tagIds = sortedUnique(
      disposition.tagIds.flatMap((rawTagId) => supportingTagIdsByRawTag.get(rawTagId) ?? []),
    );
    if (tagIds.length === 0) {
      throw new Error(
        `FINAL_TAXONOMY_MULTI_PRIMARY_SUPPORT_BINDING_MISSING:${problemId}${disposition.claimPath}`,
      );
    }
    addDisposition({ ...disposition, tagIds });
  }

  for (const addition of supportingOutcomeAdditionsByProblemId[problemId] ?? []) {
    if (primaryOutcomeIdSet.has(addition.outcomeId)) continue;
    const tagId = uniquePrimaryTagIdForOutcome(problemId, addition.outcomeId);
    if (primaryTagIdSet.has(tagId)) {
      throw new Error(
        `FINAL_TAXONOMY_MULTI_PRIMARY_SUPPORT_OVERLAP:${problemId}/${addition.outcomeId}`,
      );
    }
    const outcomes = supportingOutcomeIdsByTagMutable.get(tagId) ?? new Set<string>();
    outcomes.add(addition.outcomeId);
    supportingOutcomeIdsByTagMutable.set(tagId, outcomes);
    for (const claimPath of addition.claimPaths) {
      if (boundClaimPaths.has(claimPath)) continue;
      addDisposition({ claimPath, kind: 'supporting', tagIds: [tagId] });
    }
  }

  return {
    primaryOutcomeId,
    additionalPrimaryOutcomeIds,
    dispositions: [...dispositionByKey.values()],
    supportingOutcomeIdsByTag: Object.fromEntries(
      [...supportingOutcomeIdsByTagMutable.entries()]
        .filter(([, outcomeIds]) => outcomeIds.size > 0)
        .sort(([left], [right]) => compareIds(left, right))
        .map(([tagId, outcomeIds]) => [tagId, [...outcomeIds].sort(compareIds)]),
    ),
  };
};

const normalizeClaimDecision = (
  problemId: string,
  raw: CuratedProblemClaimDecision,
): CuratedProblemClaimDecision => {
  const primaryOutcomeId = refineOutcomeId(problemId, raw.primaryOutcomeId);
  const removedAdditionalPrimaryOutcomeIds = new Set(
    additionalPrimaryOutcomeRemovalsByProblemId[problemId] ?? [],
  );
  const additionalPrimaryOutcomeIds = sortedUnique([
    ...raw.additionalPrimaryOutcomeIds.map((outcomeId) => refineOutcomeId(problemId, outcomeId)),
    ...(primaryOutcomeAdditionsByProblemId[problemId] ?? []),
  ]).filter(
    (outcomeId) =>
      outcomeId !== primaryOutcomeId && !removedAdditionalPrimaryOutcomeIds.has(outcomeId),
  );
  const primaryTagIds = primaryTagIdsForOutcomeIds([
    primaryOutcomeId,
    ...additionalPrimaryOutcomeIds,
  ]);
  if (additionalPrimaryOutcomeIds.length > 0) {
    return normalizeMultiPrimaryClaimDecision(
      problemId,
      raw,
      primaryOutcomeId,
      additionalPrimaryOutcomeIds,
    );
  }
  if (FINAL_MULTI_PRIMARY_CLAIM_OUTCOME_BINDINGS[problemId] !== undefined) {
    throw new Error(`FINAL_TAXONOMY_STALE_MULTI_PRIMARY_BINDINGS:${problemId}`);
  }
  if (primaryTagIds.length !== 1) {
    throw new Error(
      `FINAL_TAXONOMY_SINGLE_PRIMARY_TAG_OWNER_NOT_UNIQUE:${problemId}/${primaryOutcomeId}/${primaryTagIds.join(',')}`,
    );
  }

  const supportingOutcomeIdsByTagMutable = new Map<string, Set<string>>();
  const finalSupportingTagIdsByRawTag = new Map<string, readonly string[]>();
  for (const [rawTagId, rawOutcomeIds] of Object.entries(raw.supportingOutcomeIdsByTag)) {
    const allNormalizedOutcomeIds = sortedUnique(
      rawOutcomeIds.map((outcomeId) => refineOutcomeId(problemId, outcomeId)),
    );
    const overlapsPrimary = allNormalizedOutcomeIds.some(
      (outcomeId) =>
        outcomeId === primaryOutcomeId || additionalPrimaryOutcomeIds.includes(outcomeId),
    );
    const normalizedOutcomeIds = allNormalizedOutcomeIds.filter(
      (outcomeId) =>
        outcomeId !== primaryOutcomeId && !additionalPrimaryOutcomeIds.includes(outcomeId),
    );
    const normalizedTagIds = overlapsPrimary
      ? primaryTagIds
      : primaryTagIdsForOutcomeIds(normalizedOutcomeIds);
    finalSupportingTagIdsByRawTag.set(rawTagId, normalizedTagIds);
    for (const tagId of normalizedTagIds) {
      if (primaryTagIds.includes(tagId)) continue;
      const outcomes = supportingOutcomeIdsByTagMutable.get(tagId) ?? new Set<string>();
      for (const outcomeId of normalizedOutcomeIds) {
        if (tagById.get(tagId)?.learningOutcomeIds.includes(outcomeId)) outcomes.add(outcomeId);
      }
      supportingOutcomeIdsByTagMutable.set(tagId, outcomes);
    }
  }

  const addedSupportingTagIdsByClaimPath = new Map<string, string[]>();
  for (const addition of supportingOutcomeAdditionsByProblemId[problemId] ?? []) {
    const tagIds = primaryTagIdsForOutcomeIds([addition.outcomeId]).filter(
      (tagId) => !primaryTagIds.includes(tagId),
    );
    for (const tagId of tagIds) {
      const outcomes = supportingOutcomeIdsByTagMutable.get(tagId) ?? new Set<string>();
      outcomes.add(addition.outcomeId);
      supportingOutcomeIdsByTagMutable.set(tagId, outcomes);
    }
    for (const claimPath of addition.claimPaths) {
      addedSupportingTagIdsByClaimPath.set(
        claimPath,
        sortedUnique([...(addedSupportingTagIdsByClaimPath.get(claimPath) ?? []), ...tagIds]),
      );
    }
  }

  const dispositionByKey = new Map<string, CuratedInventoryClaimDisposition>();
  for (const disposition of raw.dispositions) {
    let normalizedDisposition: CuratedInventoryClaimDisposition;
    const addedSupportingTagIds = addedSupportingTagIdsByClaimPath.get(disposition.claimPath) ?? [];
    const roleOverride =
      claimDispositionRoleOverrides[
        `${problemId}\u0000${disposition.claimPath}\u0000${disposition.kind}`
      ];
    if (roleOverride === 'primary') {
      normalizedDisposition = { ...disposition, kind: 'primary', tagIds: primaryTagIds };
    } else if (roleOverride === 'supporting') {
      if (addedSupportingTagIds.length === 0) {
        throw new Error(
          `FINAL_TAXONOMY_SUPPORTING_ROLE_OVERRIDE_TARGET_MISSING:${problemId}${disposition.claimPath}`,
        );
      }
      normalizedDisposition = {
        ...disposition,
        kind: 'supporting',
        tagIds: addedSupportingTagIds,
      };
    } else if (
      (disposition.kind === 'baseline' || disposition.kind === 'problem_specific') &&
      addedSupportingTagIds.length > 0
    ) {
      normalizedDisposition = { ...disposition, kind: 'supporting', tagIds: addedSupportingTagIds };
    } else if (disposition.kind === 'baseline' || disposition.kind === 'problem_specific') {
      normalizedDisposition = { ...disposition, tagIds: [] };
    } else if (disposition.kind === 'primary' || disposition.kind === 'same_tag') {
      normalizedDisposition = { ...disposition, tagIds: primaryTagIds };
    } else {
      const normalizedTagIds = sortedUnique(
        disposition.tagIds.flatMap((rawTagId) => finalSupportingTagIdsByRawTag.get(rawTagId) ?? []),
      );
      normalizedDisposition = normalizedTagIds.some((tagId) => primaryTagIds.includes(tagId))
        ? { ...disposition, kind: 'same_tag', tagIds: primaryTagIds }
        : { ...disposition, tagIds: normalizedTagIds };
    }
    const key = `${normalizedDisposition.claimPath}\u0000${normalizedDisposition.kind}\u0000${normalizedDisposition.tagIds.join('\u0000')}`;
    dispositionByKey.set(key, normalizedDisposition);
    if (
      addedSupportingTagIds.length > 0 &&
      normalizedDisposition.kind !== 'supporting' &&
      normalizedDisposition.kind !== 'baseline' &&
      normalizedDisposition.kind !== 'problem_specific'
    ) {
      const addedDisposition: CuratedInventoryClaimDisposition = {
        claimPath: disposition.claimPath,
        kind: 'supporting',
        tagIds: addedSupportingTagIds,
      };
      const addedKey = `${addedDisposition.claimPath}\u0000supporting\u0000${addedDisposition.tagIds.join('\u0000')}`;
      dispositionByKey.set(addedKey, addedDisposition);
    }
  }
  for (const claimPath of primaryClaimPathAdditionsByProblemId[problemId] ?? []) {
    const sourceDisposition = raw.dispositions.find(
      (disposition) => disposition.claimPath === claimPath,
    );
    if (sourceDisposition === undefined) {
      throw new Error(
        `FINAL_TAXONOMY_PRIMARY_ROLE_ADDITION_SOURCE_MISSING:${problemId}${claimPath}`,
      );
    }
    const addedDisposition: CuratedInventoryClaimDisposition = {
      ...sourceDisposition,
      kind: 'primary',
      tagIds: primaryTagIds,
    };
    const addedKey = `${claimPath}\u0000primary\u0000${primaryTagIds.join('\u0000')}`;
    dispositionByKey.set(addedKey, addedDisposition);
  }
  const dispositions = [...dispositionByKey.values()];

  return {
    primaryOutcomeId,
    additionalPrimaryOutcomeIds,
    dispositions,
    supportingOutcomeIdsByTag: Object.fromEntries(
      [...supportingOutcomeIdsByTagMutable.entries()]
        .filter(([, outcomeIds]) => outcomeIds.size > 0)
        .sort(([left], [right]) => compareIds(left, right))
        .map(([tagId, outcomeIds]) => [tagId, [...outcomeIds].sort(compareIds)]),
    ),
  };
};

const rawAssignmentProblemIds = Object.keys(RAW_EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS).sort(
  compareIds,
);
const rawClaimDecisionProblemIds = Object.keys(RAW_FINAL_TAXONOMY_CLAIM_DECISIONS).sort(compareIds);
if (
  rawAssignmentProblemIds.length !== rawClaimDecisionProblemIds.length ||
  rawAssignmentProblemIds.some(
    (problemId, index) => problemId !== rawClaimDecisionProblemIds[index],
  )
) {
  throw new Error('FINAL_TAXONOMY_RAW_ASSIGNMENT_CLAIM_COVERAGE_MISMATCH');
}

export const FINAL_TAXONOMY_CLAIM_DECISIONS: Readonly<Record<string, CuratedProblemClaimDecision>> =
  Object.freeze(
    Object.fromEntries(
      Object.entries(RAW_FINAL_TAXONOMY_CLAIM_DECISIONS).map(([problemId, decision]) => [
        problemId,
        normalizeClaimDecision(problemId, decision),
      ]),
    ),
  );

export const EXPLICIT_CURATED_PRIMARY_TAG_ASSIGNMENTS: Readonly<Record<string, string>> =
  Object.freeze(
    Object.fromEntries(
      Object.entries(FINAL_TAXONOMY_CLAIM_DECISIONS).map(([problemId, decision]) => {
        const tagId = primaryTagIdsForOutcomeIds([decision.primaryOutcomeId])[0];
        if (tagId === undefined) {
          throw new Error(`FINAL_TAXONOMY_REFINED_PRIMARY_TAG_MISSING:${problemId}`);
        }
        return [problemId, tagId];
      }),
    ),
  );

export const CURATED_PRIMARY_OVERRIDES: readonly CuratedPrimaryOverride[] =
  RAW_CURATED_PRIMARY_OVERRIDES.map((override) => {
    const decision = FINAL_TAXONOMY_CLAIM_DECISIONS[override.problemId];
    if (!decision) return override;
    const primaryTagId = primaryTagIdsForOutcomeIds([decision.primaryOutcomeId])[0];
    const additionalPrimaryTagIds = primaryTagIdsForOutcomeIds(
      decision.additionalPrimaryOutcomeIds,
    );
    if (primaryTagId === undefined) return override;
    return {
      ...override,
      primaryTagId,
      primaryOutcomeId: decision.primaryOutcomeId,
      ...(additionalPrimaryTagIds.length > 0 ? { additionalPrimaryTagIds } : {}),
    };
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
  const match =
    /^\/(typicalTechniques|prerequisiteCandidates|implementationConcerns)\/(0|[1-9]\d*)$/u.exec(
      claimPath,
    );
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
  if (match[1] === 'prerequisiteCandidates') {
    const prerequisite = record.prerequisiteCandidates[index];
    if (!prerequisite) {
      throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_PATH_STALE: ${record.problemId}${claimPath}`);
    }
    return claimReference(record, claimPath, prerequisite.text, prerequisite.evidenceIds);
  }
  const concern = record.implementationConcerns[index];
  if (!concern) {
    throw new Error(`FINAL_TAXONOMY_CURATED_CLAIM_PATH_STALE: ${record.problemId}${claimPath}`);
  }
  return claimReference(record, claimPath, concern.text, concern.evidenceIds);
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
  const outcomes = record.outcomeCandidates.map((outcome, index) =>
    claimReference(
      record,
      `/outcomeCandidates/${String(index)}`,
      outcome.text,
      outcome.evidenceIds,
    ),
  );
  if (outcomes.length === 0) {
    throw new Error(`FINAL_TAXONOMY_OUTCOME_CLAIM_MISSING: ${record.problemId}`);
  }
  if (primaryClaimPaths.length === 0) {
    throw new Error(`FINAL_TAXONOMY_PRIMARY_CLAIM_MISSING: ${record.problemId}`);
  }
  return [
    ...observations,
    ...adoptedApproaches,
    ...keyInsights,
    algorithmConnection,
    ...primaryClaimPaths.map((claimPath) => inventoryClaimReference(record, claimPath)),
    ...outcomes,
  ];
};

const supportingDecisionBasisFor = (
  record: ProblemAnalysisInput,
  claimDecision: CuratedProblemClaimDecision,
  tagId: string,
): readonly OwnerQualifiedClaimReference[] => {
  const dispositionBasis = claimDecision.dispositions
    .filter(({ kind, tagIds }) => kind === 'supporting' && tagIds.includes(tagId))
    .map(({ claimPath }) => inventoryClaimReference(record, claimPath));
  if (dispositionBasis.length === 0) {
    throw new Error(`FINAL_TAXONOMY_SUPPORT_EVIDENCE_MISSING: ${record.problemId}/${tagId}`);
  }
  return dispositionBasis.sort((left, right) => compareIds(left.claimPath, right.claimPath));
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
  const missingRequiredPaths = expectedPaths.filter(
    (claimPath) => !actualPaths.includes(claimPath),
  );
  if (missingRequiredPaths.length > 0) {
    throw new Error(
      `FINAL_TAXONOMY_CURATED_CLAIM_COVERAGE: ${record.problemId}; missing=[${missingRequiredPaths.join(',')}]; actual=[${actualPaths.join(',')}]`,
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
      const baselineClassification =
        kind === 'baseline'
          ? FINAL_TAXONOMY_BASELINE_CLAIM_REGISTRY[`${record.problemId}${claimPath}`]
          : undefined;
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

      if (kind === 'baseline' && baselineClassification === undefined) {
        throw new Error(`FINAL_TAXONOMY_BASELINE_SCOPE_INVALID: ${record.problemId}${claimPath}`);
      }
      return {
        claimRef: inventoryClaimReference(record, claimPath),
        kind,
        tagIds: normalizedTagIds,
        rationale:
          baselineClassification === undefined
            ? dispositionRationale(kind)
            : `${dispositionRationale(kind)} 共通前提カテゴリ: ${baselineClassification.categoryIds.join(', ')}。`,
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
      const readinessOverride = READINESS_PRIMARY_OVERRIDES[record.problemId];
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
      const additionalPrimaryTagIds = sortedUnique(
        claimDecision.additionalPrimaryOutcomeIds.flatMap((outcomeId) =>
          (outcomeById.get(outcomeId)?.scopeTagIds ?? []).filter(
            (tagId) => tagById.get(tagId)?.primaryEligible === true,
          ),
        ),
      ).filter((tagId) => tagId !== primaryTag.id);
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
      const primaryOwnerUnitIds = outcomeById.get(primaryOutcomeId)?.learningUnitCandidateIds ?? [];
      if (primaryOwnerUnitIds.length !== 1) {
        throw new Error(
          `FINAL_TAXONOMY_PRIMARY_OUTCOME_OWNER_INVALID: ${record.problemId}/${primaryOutcomeId}`,
        );
      }
      return {
        problemId: record.problemId,
        primaryOutcomeId,
        primaryTagIds,
        additionalPrimaryOutcomeIds,
        supportingTagIds,
        supportingOutcomeIds,
        supportingTagDecisions,
        ...(readinessOverride === undefined
          ? {}
          : {
              primaryOverride: readinessOverride,
            }),
        decisionKind:
          override || readinessOverride
            ? 'curated_semantic_override'
            : 'explicit_inventory_assignment',
        ambiguityStatus: override || readinessOverride ? 'curated_override' : 'proposed_assignment',
        selectionRationale: readinessOverride
          ? readinessOverride.rationale
          : override
            ? override.rationale
            : `Inventoryの採用方針「${record.reasoningPath.candidateApproaches.find((candidate) => candidate.decision === 'adopted')?.approach ?? ''}」、解法への接続「${record.reasoningPath.algorithmConnection.text}」、学習成果「${record.outcomeCandidates[0]?.text ?? ''}」を照合し、${primaryTag.id} / ${primaryOutcomeId} をFinalTaxonomyBuildのreview対象となるprimary候補として明示した。`,
        decisionAuthorId:
          readinessOverride?.decisionAuthorId ?? override?.decisionAuthorId ?? record.authorId,
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
  const actualBaselineClaimKeys = sortedUnique(
    decisions.flatMap((decision) =>
      decision.claimDispositions.flatMap(({ claimRef, kind }) =>
        kind === 'baseline' ? [`${decision.problemId}${claimRef.claimPath}`] : [],
      ),
    ),
  );
  const classifiedBaselineClaimKeys = Object.keys(FINAL_TAXONOMY_BASELINE_CLAIM_REGISTRY).sort(
    compareIds,
  );
  if (
    actualBaselineClaimKeys.length !== classifiedBaselineClaimKeys.length ||
    actualBaselineClaimKeys.some(
      (claimKey, index) => claimKey !== classifiedBaselineClaimKeys[index],
    )
  ) {
    throw new Error(
      `FINAL_TAXONOMY_BASELINE_CLASSIFICATION_COVERAGE: actual=[${actualBaselineClaimKeys.join(',')}]; classified=[${classifiedBaselineClaimKeys.join(',')}]`,
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
    const primaryOwnerUnitIds =
      outcomeById.get(decision.primaryOutcomeId)?.learningUnitCandidateIds ?? [];
    if (primaryOwnerUnitIds.length !== 1) {
      throw new Error(
        `FINAL_TAXONOMY_PRIMARY_OUTCOME_OWNER_INVALID: ${decision.problemId}/${decision.primaryOutcomeId}`,
      );
    }
    for (const directUnitId of primaryOwnerUnitIds) {
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
  const sameIdSet = (left: readonly string[], right: readonly string[]): boolean => {
    const normalizedLeft = sortedUnique(left);
    const normalizedRight = sortedUnique(right);
    return (
      normalizedLeft.length === normalizedRight.length &&
      normalizedLeft.every((id, index) => id === normalizedRight[index])
    );
  };
  const directTagOwnerUnitIds = (tagId: string): string[] =>
    FINAL_LEARNING_UNIT_CANDIDATES.filter((unit) => unit.ownedTagIds.includes(tagId)).map(
      (unit) => unit.id,
    );
  const directOutcomeOwnerUnitIds = (outcomeId: string): string[] =>
    FINAL_LEARNING_UNIT_CANDIDATES.filter((unit) =>
      unit.ownedLearningOutcomeIds.includes(outcomeId),
    ).map((unit) => unit.id);
  for (const tag of FINAL_TAXONOMY_TAGS) {
    const ownerUnitIds = directTagOwnerUnitIds(tag.id);
    if (
      tag.learningUnitCandidateIds.length !== 1 ||
      new Set(tag.learningUnitCandidateIds).size !== 1 ||
      ownerUnitIds.length !== 1 ||
      !sameIdSet(tag.learningUnitCandidateIds, ownerUnitIds)
    ) {
      diagnostics.push(
        `TAG_DIRECT_UNIT_OWNER_INVALID:${tag.id}/${tag.learningUnitCandidateIds.join(',')}/${ownerUnitIds.join(',')}`,
      );
    }
  }
  for (const outcome of FINAL_TAXONOMY_OUTCOMES) {
    const ownerUnitIds = directOutcomeOwnerUnitIds(outcome.id);
    const scopeTagOwnerUnitIds = outcome.scopeTagIds.flatMap((tagId) =>
      directTagOwnerUnitIds(tagId),
    );
    if (
      outcome.learningUnitCandidateIds.length !== 1 ||
      new Set(outcome.learningUnitCandidateIds).size !== 1 ||
      ownerUnitIds.length !== 1 ||
      !sameIdSet(outcome.learningUnitCandidateIds, ownerUnitIds)
    ) {
      diagnostics.push(
        `OUTCOME_DIRECT_UNIT_OWNER_INVALID:${outcome.id}/${outcome.learningUnitCandidateIds.join(',')}/${ownerUnitIds.join(',')}`,
      );
    }
    if (!sameIdSet(outcome.learningUnitCandidateIds, scopeTagOwnerUnitIds)) {
      diagnostics.push(
        `OUTCOME_UNIT_SCOPE_MISMATCH:${outcome.id}/${outcome.learningUnitCandidateIds.join(',')}/${sortedUnique(scopeTagOwnerUnitIds).join(',')}`,
      );
    }
  }
  for (const unit of FINAL_LEARNING_UNIT_CANDIDATES) {
    const children = FINAL_LEARNING_UNIT_CANDIDATES.filter(
      (candidate) => candidate.parentId === unit.id,
    );
    const expectedTagIds = sortedUnique([
      ...unit.ownedTagIds,
      ...children.flatMap((child) => child.tagIds),
    ]);
    const expectedOutcomeIds = sortedUnique([
      ...unit.ownedLearningOutcomeIds,
      ...children.flatMap((child) => child.learningOutcomeIds),
    ]);
    if (unit.ownedTagIds.some((tagId) => !unit.tagIds.includes(tagId))) {
      diagnostics.push(`UNIT_OWNED_TAG_NOT_NAVIGABLE:${unit.id}`);
    }
    if (
      unit.ownedLearningOutcomeIds.some((outcomeId) => !unit.learningOutcomeIds.includes(outcomeId))
    ) {
      diagnostics.push(`UNIT_OWNED_OUTCOME_NOT_NAVIGABLE:${unit.id}`);
    }
    if (!sameIdSet(unit.tagIds, expectedTagIds)) {
      diagnostics.push(`UNIT_TAG_NAVIGATION_ROLLUP_INVALID:${unit.id}`);
    }
    if (!sameIdSet(unit.learningOutcomeIds, expectedOutcomeIds)) {
      diagnostics.push(`UNIT_OUTCOME_NAVIGATION_ROLLUP_INVALID:${unit.id}`);
    }
    if (
      unit.ownedTagIds.length === 0 &&
      unit.ownedLearningOutcomeIds.length === 0 &&
      children.length === 0
    ) {
      diagnostics.push(`OWNERLESS_LEAF_UNIT:${unit.id}`);
    }
  }
  for (const [ownerId, prerequisiteIds] of Object.entries({
    ...FINAL_TAG_CURRICULUM_PREREQUISITE_OVERRIDES,
    ...FINAL_TAG_CURRICULUM_PREREQUISITE_ADDITIONS,
  })) {
    if (!knownTagIds.has(ownerId)) diagnostics.push(`UNKNOWN_TAG_PREREQUISITE_OWNER:${ownerId}`);
    for (const prerequisiteId of prerequisiteIds) {
      if (!knownTagIds.has(prerequisiteId)) {
        diagnostics.push(`UNKNOWN_TAG_PREREQUISITE_TARGET:${ownerId}/${prerequisiteId}`);
      }
    }
  }
  const allRelationSeeds = [
    ...FINAL_TAG_SYMMETRIC_RELATION_SEEDS,
    ...FINAL_TAG_DIRECTED_RELATION_SEEDS,
  ];
  for (const relation of allRelationSeeds) {
    if (!knownTagIds.has(relation.sourceTagId)) {
      diagnostics.push(`UNKNOWN_TAG_RELATION_SOURCE:${relation.sourceTagId}`);
    }
    if (!knownTagIds.has(relation.targetTagId)) {
      diagnostics.push(`UNKNOWN_TAG_RELATION_TARGET:${relation.targetTagId}`);
    }
    if (relation.sourceTagId === relation.targetTagId) {
      diagnostics.push(`SELF_TAG_RELATION:${relation.sourceTagId}/${relation.type}`);
    }
    if (!relation.rationale.trim()) {
      diagnostics.push(
        `TAG_RELATION_RATIONALE_MISSING:${relation.sourceTagId}/${relation.type}/${relation.targetTagId}`,
      );
    }
  }
  const retiredLegacyOutcomeIds = new Set([
    'outcome-bound-total-work',
    'outcome-characterize-walk-by-degrees',
    'outcome-compare-objects-by-fingerprint',
    'outcome-evaluate-and-compose-polynomials',
    'outcome-exploit-convexity',
    'outcome-maintain-dynamic-order-statistics',
    'outcome-reduce-graph-by-peeling-or-kernelization',
    'outcome-reduce-selection-to-network-optimization',
    'outcome-share-or-revert-versions',
    'outcome-transform-to-linear-system-or-rank',
    'outcome-transform-to-math-structure',
  ]);
  for (const outcomeId of SINGLE_PROBLEM_OUTCOME_IDS) {
    if (!knownOutcomeIds.has(outcomeId)) {
      diagnostics.push(`UNKNOWN_SINGLE_PROBLEM_OUTCOME:${outcomeId}`);
    }
  }
  for (const unitId of SINGLE_PROBLEM_UNIT_IDS) {
    if (!knownUnitIds.has(unitId)) diagnostics.push(`UNKNOWN_SINGLE_PROBLEM_UNIT:${unitId}`);
  }
  for (const tagId of SINGLE_PROBLEM_TAG_IDS) {
    if (!knownTagIds.has(tagId)) diagnostics.push(`UNKNOWN_SINGLE_PROBLEM_TAG:${tagId}`);
  }
  for (const unitId of Object.keys(UNIT_LEARNING_RATIONALES)) {
    if (!knownUnitIds.has(unitId) && unitId !== 'unit-chapter-math-geometry')
      diagnostics.push(`UNKNOWN_UNIT_LEARNING_RATIONALE:${unitId}`);
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
    if (!Object.prototype.hasOwnProperty.call(FINAL_TAG_LEARNER_ALIASES, tag.id)) {
      diagnostics.push(`TAG_LEARNER_ALIASES_UNCURATED:${tag.id}`);
    }
    if (tag.aliases.length === 0) diagnostics.push(`TAG_ALIASES_MISSING:${tag.id}`);
    const minimumRepresentativeCount = SINGLE_PROBLEM_TAG_IDS.includes(tag.id) ? 1 : 2;
    if (tag.representativeProblemIds.length < minimumRepresentativeCount) {
      diagnostics.push(`TAG_REPRESENTATIVES_INSUFFICIENT:${tag.id}`);
    }
    if (tag.parentId !== null && !knownTagIds.has(tag.parentId))
      diagnostics.push(`UNKNOWN_PARENT:${tag.id}/${tag.parentId}`);
    for (const prerequisiteId of tag.prerequisiteTagIds) {
      if (!knownTagIds.has(prerequisiteId))
        diagnostics.push(`UNKNOWN_TAG_PREREQUISITE:${tag.id}/${prerequisiteId}`);
    }
    const relationKeys = tag.relatedTags.map(({ tagId, type }) => `${tagId}\u0000${type}`);
    for (const duplicateRelation of duplicateIds(relationKeys)) {
      diagnostics.push(`DUPLICATE_TAG_RELATION:${tag.id}/${duplicateRelation}`);
    }
    for (const relation of tag.relatedTags) {
      if (!knownTagIds.has(relation.tagId)) {
        diagnostics.push(`UNKNOWN_TAG_RELATION:${tag.id}/${relation.tagId}`);
      }
      if (relation.tagId === tag.id)
        diagnostics.push(`SELF_TAG_RELATION:${tag.id}/${relation.type}`);
      if (
        (['contrast', 'analogy', 'often_combined'] as const).includes(
          relation.type as 'contrast' | 'analogy' | 'often_combined',
        ) &&
        !FINAL_TAXONOMY_TAGS.find((candidate) => candidate.id === relation.tagId)?.relatedTags.some(
          (reverse) => reverse.tagId === tag.id && reverse.type === relation.type,
        )
      ) {
        diagnostics.push(`ASYMMETRIC_TAG_RELATION:${tag.id}/${relation.type}/${relation.tagId}`);
      }
    }
    const recognitionDimensions = [
      tag.semanticSignature.objectPatterns,
      tag.semanticSignature.triggerPatterns,
      tag.semanticSignature.invariantPatterns,
      tag.semanticSignature.goalPatterns,
    ];
    if (recognitionDimensions.some((patterns) => patterns.length === 0)) {
      diagnostics.push(`TAG_SEMANTIC_SIGNATURE_INCOMPLETE:${tag.id}`);
    }
    if (
      tag.semanticSignature.minimumDimensions >
      recognitionDimensions.filter((patterns) => patterns.length > 0).length
    ) {
      diagnostics.push(`TAG_SEMANTIC_SIGNATURE_DIMENSION_INVALID:${tag.id}`);
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
    if (!knownOutcomeIds.has(outcomeId) && !retiredLegacyOutcomeIds.has(outcomeId))
      diagnostics.push(`UNUSED_OUTCOME_STATEMENT:${outcomeId}`);
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
    if (!unit.learningRationale.trim())
      diagnostics.push(`UNIT_LEARNING_RATIONALE_MISSING:${unit.id}`);
    if (/(?:unit|tag|outcome)-/u.test(unit.learningRationale)) {
      diagnostics.push(`UNIT_LEARNING_RATIONALE_INTERNAL_ID:${unit.id}`);
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
  for (const [learningRationale, count] of new Map(
    FINAL_LEARNING_UNIT_CANDIDATES.map((unit) => [
      unit.learningRationale,
      FINAL_LEARNING_UNIT_CANDIDATES.filter(
        (candidate) => candidate.learningRationale === unit.learningRationale,
      ).length,
    ]),
  )) {
    if (count > 1) diagnostics.push(`UNIT_LEARNING_RATIONALE_REUSED:${learningRationale}`);
  }
  for (const { nodeId, prerequisiteId } of FINAL_LEARNING_UNIT_PREREQUISITES) {
    if (!knownUnitIds.has(nodeId)) {
      diagnostics.push(`UNKNOWN_UNIT_PREREQUISITE_OWNER:${nodeId}`);
    }
    if (!knownUnitIds.has(prerequisiteId)) {
      diagnostics.push(`UNKNOWN_UNIT_PREREQUISITE_TARGET:${nodeId}/${prerequisiteId}`);
    }
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
        prerequisiteIds: FINAL_LEARNING_UNIT_PREREQUISITES.filter(
          ({ nodeId }) => nodeId === unit.id,
        ).map(({ prerequisiteId }) => prerequisiteId),
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
    const primaryTagIds = [
      primaryTagId,
      ...claimDecision.additionalPrimaryOutcomeIds.flatMap(
        (outcomeId) => outcomeById.get(outcomeId)?.scopeTagIds ?? [],
      ),
    ].filter((tagId): tagId is string => tagId !== undefined);
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
