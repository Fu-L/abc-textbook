/**
 * Final-taxonomy の `baseline` claim を、共通前提の有限な技能集合へ束縛する。
 *
 * claim の一部だけが基礎技能である場合は登録しない。たとえば「BFS、座標圧縮、
 * ordered map、二分探索」は BFS と二分探索を含むが、claim 全体は共通前提ではない。
 * この表にない claim を語句一致だけで baseline とみなしてはならない。
 */

export type FinalTaxonomyBaselineSkillId =
  | 'skill-programming-basics'
  | 'skill-basic-data-handling'
  | 'skill-complexity-basics'
  | 'skill-prefix-greedy-elementary-dp'
  | 'skill-basic-dfs-bfs'
  | 'skill-elementary-number-theory-testing';

export interface FinalTaxonomyBaselineCategoryDefinition {
  readonly baselineSkillId: FinalTaxonomyBaselineSkillId;
  readonly label: string;
  readonly specBasis: string;
  readonly includedScope: string;
  readonly excludedScope: string;
}

/**
 * `specs/001-build-abc-textbook/spec.md` の Learner and Scope に書かれた
 * 共通前提だけを分割した閉じたカテゴリ集合。
 */
export const FINAL_TAXONOMY_BASELINE_CATEGORIES = Object.freeze({
  'basic-control-and-functions': {
    baselineSkillId: 'skill-programming-basics',
    label: '標準的な制御構造と関数',
    specBasis: '標準入出力、条件分岐、反復、関数を使える。',
    includedScope: '真理値演算、条件分岐、反復、関数による直接的な実装。',
    excludedScope: '対話プロトコル、ライブラリ固有機能、問題固有の状態機械。',
  },
  'integer-string-array-handling': {
    baselineSkillId: 'skill-basic-data-handling',
    label: '整数・文字列・配列の基本操作',
    specBasis: '整数、文字列、配列、連想配列、集合を選択し、走査、更新、集計、並べ替えができる。',
    includedScope: '整数の基本演算、文字列や配列の順逆走査、頻度・最大最小・総和の直接集計。',
    excludedScope: '座標圧縮、bitset、二次元累積和、区分線形化など独立した学習成果になる処理。',
  },
  'map-set-handling': {
    baselineSkillId: 'skill-basic-data-handling',
    label: '連想配列と集合の基本操作',
    specBasis: '整数、文字列、配列、連想配列、集合を選択し、走査、更新、集計、並べ替えができる。',
    includedScope: 'key ごとの頻度・総和の集計、membership 判定、重複排除、集合の直接的な併合。',
    excludedScope:
      'ordered set の predecessor/successor、small-to-large、永続化、hash fingerprint。',
  },
  sorting: {
    baselineSkillId: 'skill-basic-data-handling',
    label: '並べ替え',
    specBasis: '整数、文字列、配列、連想配列、集合を選択し、走査、更新、集計、並べ替えができる。',
    includedScope: '標準 sort と、sort 後の同値要素の集約。',
    excludedScope: '座標圧縮、偏角順、suffix array、特殊な順序の証明。',
  },
  'exhaustive-and-linear-scan-complexity': {
    baselineSkillId: 'skill-complexity-basics',
    label: '全探索・線形走査の計算量',
    specBasis: '制約から全探索、線形走査、二分探索の計算量を見積もれる。',
    includedScope: '小規模な全探索と線形走査、その反復回数の見積り。',
    excludedScope: 'meet-in-the-middle、bitmask 変換、償却解析、出力依存計算量。',
  },
  'binary-search': {
    baselineSkillId: 'skill-complexity-basics',
    label: '二分探索',
    specBasis: '制約から全探索、線形走査、二分探索の計算量を見積もれる。',
    includedScope: 'sort 済み列の lower/upper bound と、整数・実数上の単調な可否境界の二分探索。',
    excludedScope: '並列二分探索、分割統治最適化、凸関数最適化そのもの。',
  },
  'one-dimensional-prefix-sum': {
    baselineSkillId: 'skill-prefix-greedy-elementary-dp',
    label: '一次元累積和',
    specBasis: '累積和、基本的な貪欲法、一次元の初歩的な動的計画法を説明して実装できる。',
    includedScope: '一次元列の区間和・prefix frequency・差分配列からの復元。',
    excludedScope: '二次元累積和、木上累積和、DP 遷移の高度な累積和高速化。',
  },
  'basic-greedy': {
    baselineSkillId: 'skill-prefix-greedy-elementary-dp',
    label: '基本的な貪欲法',
    specBasis: '累積和、基本的な貪欲法、一次元の初歩的な動的計画法を説明して実装できる。',
    includedScope: '局所選択の安全性を交換・削除などの初歩的な議論で示せる貪欲法。',
    excludedScope: 'matroid、高度な構成、問題固有の存在定理を必要とする貪欲法。',
  },
  'elementary-one-dimensional-dp': {
    baselineSkillId: 'skill-prefix-greedy-elementary-dp',
    label: '一次元の初歩的な動的計画法',
    specBasis: '累積和、基本的な貪欲法、一次元の初歩的な動的計画法を説明して実装できる。',
    includedScope: '列を一方向に進む加法的 DP、後ろ向き DP、直前層だけを持つ rolling DP。',
    excludedScope:
      '木・グリッド・部分集合・順列 DP、状態復元を要する組合せ DP、遷移高速化そのもの。',
  },
  'tree-unweighted-grid-dfs-bfs': {
    baselineSkillId: 'skill-basic-dfs-bfs',
    label: '木・重みなしグラフ・グリッドの DFS/BFS',
    specBasis: '木、重みなしグラフ、グリッドに対する深さ優先探索と幅優先探索を実装できる。',
    includedScope:
      '訪問済み管理、親・深さ・距離・連結成分の記録、木の辺数・次数の直接集計、多始点化、固定した禁止頂点を避ける探索。',
    excludedScope: 'SCC、縮約、Euler tour、次数 peeling、重み付き最短路、動的連結性、高度な木 DP。',
  },
  'modular-arithmetic': {
    baselineSkillId: 'skill-elementary-number-theory-testing',
    label: '基本的な剰余演算',
    specBasis:
      '剰余、最大公約数、初歩的な素因数分解を扱い、境界値を含むテストで誤りを切り分けられる。',
    includedScope: '加減乗算の剰余、負値の正規化、単純な漸化式の法計算。',
    excludedScope: '法逆元、高速累乗、剰余確率、組合せ数、有限体、多項式演算。',
  },
  'greatest-common-divisor': {
    baselineSkillId: 'skill-elementary-number-theory-testing',
    label: '最大公約数',
    specBasis:
      '剰余、最大公約数、初歩的な素因数分解を扱い、境界値を含むテストで誤りを切り分けられる。',
    includedScope: 'Euclid の互除法と直接的な gcd 利用。',
    excludedScope: '拡張 Euclid、CRT、一次不定方程式、群論的な位数計算。',
  },
  'elementary-prime-factorization': {
    baselineSkillId: 'skill-elementary-number-theory-testing',
    label: '初歩的な素因数分解',
    specBasis:
      '剰余、最大公約数、初歩的な素因数分解を扱い、境界値を含むテストで誤りを切り分けられる。',
    includedScope: '試し割りによる素因数と指数の列挙。',
    excludedScope: '高速素因数分解、篩の発展利用、乗法的関数、離散対数。',
  },
  'boundary-value-testing': {
    baselineSkillId: 'skill-elementary-number-theory-testing',
    label: '境界値テスト',
    specBasis:
      '剰余、最大公約数、初歩的な素因数分解を扱い、境界値を含むテストで誤りを切り分けられる。',
    includedScope: '空・最小・最大付近や off-by-one を含む小規模テスト。',
    excludedScope: '乱択検証、形式検証、問題固有の反例生成法。',
  },
} as const satisfies Readonly<Record<string, FinalTaxonomyBaselineCategoryDefinition>>);

export type FinalTaxonomyBaselineCategoryId = keyof typeof FINAL_TAXONOMY_BASELINE_CATEGORIES;

export type FinalTaxonomyInventoryClaimPath =
  `/typicalTechniques/${number}` | `/prerequisiteCandidates/${number}`;

export interface FinalTaxonomyBaselineClaimClassification {
  readonly key: string;
  readonly problemId: string;
  readonly claimPath: FinalTaxonomyInventoryClaimPath;
  readonly categoryIds: readonly FinalTaxonomyBaselineCategoryId[];
}

export const finalTaxonomyBaselineClaimKey = (problemId: string, claimPath: string): string =>
  `${problemId}${claimPath}`;

const claim = (
  problemId: string,
  claimPath: FinalTaxonomyInventoryClaimPath,
  ...categoryIds: readonly FinalTaxonomyBaselineCategoryId[]
): FinalTaxonomyBaselineClaimClassification => ({
  key: finalTaxonomyBaselineClaimKey(problemId, claimPath),
  problemId,
  claimPath,
  categoryIds,
});

const c = claim;

/**
 * T159 proposal で baseline とされた全 claim を精読し、claim 全体が上記カテゴリだけで
 * 説明できる行だけを残した allowlist。高度な要素との混合 claim は意図的に含めない。
 */
const BASELINE_CLAIM_CLASSIFICATIONS = [
  c('abc212-e', '/typicalTechniques/1', 'elementary-one-dimensional-dp'),
  c('abc212-e', '/prerequisiteCandidates/1', 'modular-arithmetic'),
  c('abc212-f', '/typicalTechniques/1', 'binary-search'),
  c('abc212-f', '/prerequisiteCandidates/0', 'binary-search'),
  c('abc214-f', '/prerequisiteCandidates/1', 'one-dimensional-prefix-sum'),
  c('abc219-e', '/typicalTechniques/1', 'tree-unweighted-grid-dfs-bfs'),
  c('abc222-e', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c(
    'abc230-f',
    '/prerequisiteCandidates/0',
    'one-dimensional-prefix-sum',
    'elementary-one-dimensional-dp',
  ),
  c('abc233-e', '/prerequisiteCandidates/0', 'integer-string-array-handling'),
  c(
    'abc234-e',
    '/prerequisiteCandidates/0',
    'integer-string-array-handling',
    'boundary-value-testing',
  ),
  c('abc241-f', '/typicalTechniques/1', 'binary-search', 'map-set-handling'),
  c('abc248-e', '/prerequisiteCandidates/2', 'map-set-handling'),
  c('abc250-e', '/prerequisiteCandidates/1', 'map-set-handling'),
  c('abc251-f', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc253-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc254-e', '/typicalTechniques/1', 'integer-string-array-handling'),
  c('abc254-e', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc254-e', '/prerequisiteCandidates/1', 'tree-unweighted-grid-dfs-bfs'),
  c('abc255-e', '/prerequisiteCandidates/1', 'integer-string-array-handling', 'map-set-handling'),
  c('abc255-g', '/prerequisiteCandidates/1', 'sorting', 'binary-search', 'map-set-handling'),
  c('abc259-e', '/prerequisiteCandidates/1', 'map-set-handling'),
  c('abc260-e', '/typicalTechniques/1', 'one-dimensional-prefix-sum'),
  c('abc269-f', '/typicalTechniques/1', 'integer-string-array-handling'),
  c('abc278-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc280-f', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc282-ex', '/typicalTechniques/2', 'one-dimensional-prefix-sum', 'binary-search'),
  c('abc282-ex', '/prerequisiteCandidates/1', 'one-dimensional-prefix-sum', 'binary-search'),
  c('abc284-f', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc285-f', '/prerequisiteCandidates/1', 'integer-string-array-handling', 'sorting'),
  c('abc288-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc289-g', '/prerequisiteCandidates/1', 'sorting', 'binary-search'),
  c('abc294-f', '/prerequisiteCandidates/0', 'sorting', 'binary-search'),
  c('abc295-f', '/typicalTechniques/0', 'one-dimensional-prefix-sum'),
  c('abc298-f', '/prerequisiteCandidates/0', 'map-set-handling', 'sorting'),
  c('abc300-f', '/prerequisiteCandidates/0', 'one-dimensional-prefix-sum', 'binary-search'),
  c('abc302-e', '/typicalTechniques/0', 'map-set-handling'),
  c('abc303-e', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs', 'modular-arithmetic'),
  c('abc303-f', '/prerequisiteCandidates/0', 'integer-string-array-handling', 'binary-search'),
  c('abc304-e', '/typicalTechniques/1', 'map-set-handling'),
  c('abc305-e', '/prerequisiteCandidates/1', 'tree-unweighted-grid-dfs-bfs'),
  c('abc305-f', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc309-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc310-e', '/prerequisiteCandidates/0', 'basic-control-and-functions'),
  c('abc312-e', '/prerequisiteCandidates/0', 'integer-string-array-handling'),
  c('abc312-e', '/prerequisiteCandidates/1', 'integer-string-array-handling', 'sorting'),
  c('abc312-f', '/prerequisiteCandidates/0', 'one-dimensional-prefix-sum'),
  c('abc313-e', '/prerequisiteCandidates/1', 'elementary-one-dimensional-dp', 'modular-arithmetic'),
  c('abc314-e', '/prerequisiteCandidates/1', 'elementary-one-dimensional-dp'),
  c('abc315-e', '/prerequisiteCandidates/1', 'tree-unweighted-grid-dfs-bfs'),
  c('abc318-e', '/prerequisiteCandidates/0', 'integer-string-array-handling'),
  c('abc319-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc319-f', '/prerequisiteCandidates/1', 'tree-unweighted-grid-dfs-bfs'),
  c('abc321-e', '/prerequisiteCandidates/2', 'integer-string-array-handling'),
  c('abc324-e', '/prerequisiteCandidates/0', 'integer-string-array-handling'),
  c(
    'abc324-e',
    '/prerequisiteCandidates/1',
    'integer-string-array-handling',
    'one-dimensional-prefix-sum',
  ),
  c('abc325-f', '/prerequisiteCandidates/2', 'integer-string-array-handling'),
  c('abc328-e', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc329-f', '/prerequisiteCandidates/0', 'map-set-handling'),
  c('abc330-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc330-f', '/prerequisiteCandidates/1', 'one-dimensional-prefix-sum'),
  c('abc331-e', '/prerequisiteCandidates/1', 'map-set-handling'),
  c('abc334-e', '/typicalTechniques/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc351-e', '/prerequisiteCandidates/1', 'sorting', 'one-dimensional-prefix-sum'),
  c('abc355-e', '/prerequisiteCandidates/0', 'one-dimensional-prefix-sum'),
  c(
    'abc356-e',
    '/prerequisiteCandidates/0',
    'integer-string-array-handling',
    'one-dimensional-prefix-sum',
  ),
  c('abc359-f', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c(
    'abc359-g',
    '/prerequisiteCandidates/1',
    'integer-string-array-handling',
    'tree-unweighted-grid-dfs-bfs',
  ),
  c('abc361-e', '/prerequisiteCandidates/1', 'tree-unweighted-grid-dfs-bfs'),
  c('abc363-e', '/prerequisiteCandidates/0', 'tree-unweighted-grid-dfs-bfs'),
  c('abc363-f', '/prerequisiteCandidates/0', 'integer-string-array-handling'),
  c('abc367-f', '/prerequisiteCandidates/1', 'one-dimensional-prefix-sum'),
  c('abc368-f', '/prerequisiteCandidates/1', 'elementary-prime-factorization'),
  c('abc370-e', '/prerequisiteCandidates/0', 'one-dimensional-prefix-sum'),
  c('abc384-f', '/prerequisiteCandidates/1', 'integer-string-array-handling', 'map-set-handling'),
  c('abc385-e', '/prerequisiteCandidates/0', 'integer-string-array-handling', 'sorting'),
  c('abc387-e', '/typicalTechniques/1', 'modular-arithmetic'),
  c('abc387-e', '/prerequisiteCandidates/1', 'integer-string-array-handling'),
  c('abc402-f', '/typicalTechniques/1', 'binary-search'),
  c('abc428-f', '/typicalTechniques/2', 'binary-search'),
  c('abc430-f', '/typicalTechniques/0', 'integer-string-array-handling'),
  c(
    'abc433-f',
    '/typicalTechniques/2',
    'integer-string-array-handling',
    'one-dimensional-prefix-sum',
  ),
] as const satisfies readonly FinalTaxonomyBaselineClaimClassification[];

const buildBaselineClaimRegistry = (
  classifications: readonly FinalTaxonomyBaselineClaimClassification[],
): Readonly<Record<string, FinalTaxonomyBaselineClaimClassification>> => {
  const registry: Record<string, FinalTaxonomyBaselineClaimClassification> = {};

  for (const classification of classifications) {
    if (classification.categoryIds.length === 0) {
      throw new Error(`FINAL_TAXONOMY_BASELINE_CATEGORY_MISSING: ${classification.key}`);
    }
    if (registry[classification.key] !== undefined) {
      throw new Error(`FINAL_TAXONOMY_BASELINE_CLAIM_DUPLICATE: ${classification.key}`);
    }
    if (new Set(classification.categoryIds).size !== classification.categoryIds.length) {
      throw new Error(`FINAL_TAXONOMY_BASELINE_CATEGORY_DUPLICATE: ${classification.key}`);
    }
    registry[classification.key] = Object.freeze({
      ...classification,
      categoryIds: Object.freeze([...classification.categoryIds]),
    });
  }

  return Object.freeze(registry);
};

export const FINAL_TAXONOMY_BASELINE_CLAIM_REGISTRY = buildBaselineClaimRegistry(
  BASELINE_CLAIM_CLASSIFICATIONS,
);

export const FINAL_TAXONOMY_BASELINE_CLAIMS = Object.freeze(
  Object.values(FINAL_TAXONOMY_BASELINE_CLAIM_REGISTRY),
);

export const findFinalTaxonomyBaselineClaim = (
  problemId: string,
  claimPath: string,
): FinalTaxonomyBaselineClaimClassification | undefined =>
  FINAL_TAXONOMY_BASELINE_CLAIM_REGISTRY[finalTaxonomyBaselineClaimKey(problemId, claimPath)];

export const isFinalTaxonomyBaselineClaim = (problemId: string, claimPath: string): boolean =>
  findFinalTaxonomyBaselineClaim(problemId, claimPath) !== undefined;
