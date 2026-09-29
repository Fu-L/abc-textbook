# PR #63 のUnit読書順フォローアップ

PR
#63の初回レビューでは、データ構造・DP・グラフ・組合せ/代数の4章を再編した。追加レビューでは、グラフ章のflow節を基礎と発展に分け、木・文字列・幾何/最適化の3章にも標準典型を先に学ぶ順序を適用する。これで読書順を編集し直す章は計7章となり、モデリングと数論の2章は変更しない。

判断の基準はDifficulty順ではなく、ABCで身につける再利用頻度の高い標準手法を先に揃え、特殊な構造や専門的な発展へ進むこと。Unit内の問題順は今回の対象外とし、problem
placementと意味上の`parentId`も変更しない。

## 最終読書順

- **データ構造**: 累積和・差分 → 連結リスト → heap・ordered set → 単調stack・queue → Cartesian tree
  → Fenwick Tree → Segment Treeのmonoid集約 → 区間作用（Lazy Segment
  Tree） → 関数合成・静的query・SWAG・区間分解・Merge Sort Tree・動的Segment Tree → run分割管理 →
  bucket・Mo → bitset・trie・bitwise minimax → rolling fingerprint → rollback・永続化 → Segment Tree
  Beats。
- **DP**: 最小十分状態 →
  grid・容量 → 列/区間（sequence・LIS・値域・prefix分割・区間合成・区間拡張） → subset →
  digit/string prefix → carry/mixed radix → 確率 → game → 遷移最適化 → 線形漸化式 → cyclic minimax →
  frontier/profile・Steiner tree・巨大容量knapsack・期待値potential・Conway number games。
- **グラフ**: graph search → 二部構造 → connectivity/DSU/potential → shortest path → DAG/SCC/2-SAT →
  functional graph/doubling → spanning tree/MST → lowlink → Euler/parity → flow/matching導入 →
  bipartite matching → max-flow/min-cut → 方向別grid scan → graph core → cycle space
  → 単調path縮約・near-tree kernelization・有向walk周期 → lower-bound flow・min-cost flow・weighted
  bipartite matching → planar duality → path matching contraction → 一般重み付き完全matching。
- **木**: tree metric → tree aggregation・rooted tree DP・rerooting → Euler
  flattening・LCA・HLD・virtual tree → implicit complete binary tree → laminar containment tree・DSU
  merge tree → balanced separator → additive metric reconstruction → precedence
  contraction・heavy-path DP・static top tree・HLRecDP。
- **文字列**: Trie・prefix matching/Z → 周期 → 回文半径 → suffix array/LCP → run-length dynamics →
  recursive compressed string → finite automaton/Aho–Corasick/subset construction → Suffix
  Automaton。
- **幾何・最適化**: 幾何判定・凸領域 → line envelope → basic/separable convex optimization → slope
  trick → fractional programming → isotonic regression/PAV → Lagrangian relaxation → Monge
  optimization → 二変数の凸区分線形整数最適化。
- **組合せ・代数**: 組合せ係数 → reflection principle → 包除・約数反転・subset変換 → monoid
  exponentiation・semiring matrix → 線形代数/XOR → Prüfer・orbit
  counting・deletion-contraction・determinant・poset → matroid theory・matroid greedy → generating
  functions以降の発展 → linear matroid intersection。

flow/matchingのUnitは意味上の親子関係を維持する。`flow-matching`の導入とbipartite
matching・max-flow/min-cutを標準toolkitの段階に置き、方向別grid scanを挟んでgraph core・cycle
space・path構造を学んだ後にlower-bound flow・min-cost flow・weighted bipartite
matchingへ戻る。子Unitが読書順上で連続する必要はない。

## 追加レビューの2点

query章は`range-monoid-aggregation`の直後へ`range-actions`を移し、関数合成・Sparse
Table・SWAG・canonical decomposition・Merge Sort Tree・dynamic Segment
Treeの前に遅延作用を学ぶ。graph章は`directional-grid-effect-scan`をgraph
search群の外へ出し、max-flow/min-cutとgraph coreの間へ移す。その他のquery・graph
Unitは相対順を保ち、各配列全体を契約テストで固定する。

この追加変更でも、`parentId`と前提DAGのdigestは維持する。変更対象外のUnit順・problem
placement・Unit内の問題順は変更しない。

木では一般木のDP・部分木・祖先・pathの道具を先に揃えてからimplicit complete binary
treeへ進む。文字列ではsuffix array/LCPをrun-lengthやrecursive compressed
stringより前に置く。幾何/最適化では青色のfractional
programmingを橙色のPAVより前に置く。これらのUnitの意味上の親はそのまま保つ。

## 階層と順序の扱い

`parentId`は概念上の親子関係、`TEXTBOOK_CHAPTERS.unitIds`は読書順を表す。章目次は読書順を平坦な箇条書きで表示し、章直下でないUnitには概念上の親へのリンクを付ける。親Unitのページでは`parentId`から直接の下位単元を表示し、必須の学習前提は既存の前提DAGで別に示す。

## 検証

変更した章の主要な読書順をUnitテストで固定し、materialization
contractで章目次の表示順・概念上の親・直接前提を確認する。taxonomyの生成物を再生成し、check
modeで正本との一致を確認する。problem placement、Unit内の問題順、意味上の親指定は変更しない。
