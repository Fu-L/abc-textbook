# PR #63 のUnit読書順フォローアップ

PR
#63の初回レビューでは、データ構造・DP・グラフ・組合せ/代数の4章を再編した。追加レビューでは、グラフ章のflow節を基礎と発展に分け、木・文字列・幾何/最適化の3章にも標準典型を先に学ぶ順序を適用した。さらに後続レビューでモデリング章のゲーム不変量を汎用設計手法の後ろへ移したため、読書順を編集した章は計8章となり、数論章は変更しない。

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
- **グラフ**: graph search → state graph → transitive closure → 方向別grid scan → 二部構造 →
  connectivity/DSU/potential → shortest path → DAG/SCC/2-SAT → functional graph/doubling → spanning
  tree/MST → lowlink → Euler/parity → flow/matching導入 → bipartite matching → max-flow/min-cut →
  graph core → cycle space → 単調path縮約・near-tree kernelization・有向walk周期 → lower-bound
  flow・min-cost flow・weighted bipartite matching → planar duality → path matching contraction
  → 一般重み付き完全matching。
- **木**: tree metric → tree aggregation・rooted tree DP・rerooting → Euler
  flattening・LCA・HLD・virtual tree → implicit complete binary tree → laminar containment tree・DSU
  merge tree → balanced separator → additive metric reconstruction → precedence
  contraction・heavy-path DP・static top tree・HLRecDP。
- **文字列**: Trie・prefix matching/Z → 周期 → 回文半径 → suffix array/LCP → finite-state
  automata・pattern automaton・Aho–Corasick・subset construction → Suffix Automaton → run-length
  dynamics → recursive compressed string。
- **幾何・最適化**: 幾何判定・凸領域 → line envelope → basic/separable convex optimization → slope
  trick → fractional programming → isotonic regression/PAV → Lagrangian relaxation → Monge
  optimization → 二変数の凸区分線形整数最適化。
- **組合せ・代数**: 組合せ係数 → 包除 → 約数反転・subset変換 → reflection principle → monoid
  exponentiation・semiring matrix → 線形代数/XOR → Prüfer・orbit
  counting・deletion-contraction・determinant・poset → matroid theory・matroid greedy → generating
  functions以降の発展 → linear matroid intersection。

flow/matchingのUnitは意味上の親子関係を維持する。`flow-matching`の導入とbipartite
matching・max-flow/min-cutを標準toolkitとして連続させ、その後graph core・cycle
space・path構造を学んでからlower-bound flow・min-cost flow・weighted bipartite
matchingへ戻る。`directional-grid-effect-scan`は後続レビューで推移閉包の直後に移し、graph
search群へまとめた。子Unitが読書順上で連続する必要はない。

## 追加レビューの段階的な調整

query章は`range-monoid-aggregation`の直後へ`range-actions`を移し、関数合成・Sparse
Table・SWAG・canonical decomposition・Merge Sort Tree・dynamic Segment
Treeの前に遅延作用を学ぶ。graph章では`directional-grid-effect-scan`をflow系列からgraph
search群へ移し、最新の指定位置を推移閉包の直後にした。その他のquery・graph
Unitは相対順を保ち、各配列全体を契約テストで固定する。

この追加変更でも、`parentId`と前提DAGのdigestは維持する。変更対象外のUnit順・problem
placement・Unit内の問題順は変更しない。

## 追加レビュー: モデリング章

`constructive-witness`の後に`reverse-offline`、`event-sweep`、償却解析、heavy/light、parallel binary
search、`change-impact-localization`を続け、再利用頻度の高い設計toolkitを先に揃える。その後に独立性の高い`game-parity-invariant`を置き、`interactive-protocol`以降の順序は維持する。モデリング章の全Unit順を契約テストで固定し、この1Unitの移動以外に相対順の変更がないことを確認する。意味上の親と直接前提は変更しない。

木では一般木のDP・部分木・祖先・pathの道具を先に揃えてからimplicit complete binary
treeへ進む。文字列ではsuffix array/LCPの後にautomaton群を続け、その後run-lengthやrecursive
compressed stringを置く。幾何/最適化では青色のfractional
programmingを橙色のPAVより前に置く。これらのUnitの意味上の親はそのまま保つ。

## 追加レビュー: グラフ・文字列・組合せ/代数

グラフでは`directional-grid-effect-scan`を`transitive-closure`直後へ移し、flow/matchingの標準系列を分断しない。文字列ではsuffix
array/LCPの後に有限状態・pattern automaton・Aho–Corasick・subset construction・Suffix
Automatonを連続させ、run更新と再帰圧縮文字列を後ろへ置く。組合せ/代数では冒頭を組合せ係数・包除・約数反転・subset変換・反射原理の順にし、monoid
exponentiation以降の相対順を保つ。この3章以外のUnit順、章順、意味階層、前提DAG、所有関係、問題配置は変更しない。

## 階層と順序の扱い

`parentId`は概念上の親子関係、`TEXTBOOK_CHAPTERS.unitIds`は読書順を表す。章目次は読書順を平坦な箇条書きで表示し、章直下でないUnitには概念上の親へのリンクを付ける。親Unitのページでは`parentId`から直接の下位単元を表示し、必須の学習前提は既存の前提DAGで別に示す。

## 検証

変更した章の全Unit読書順をUnitテストで固定し、materialization
contractで章目次の表示順・概念上の親・直接前提を確認する。taxonomyの生成物を再生成し、check
modeで正本との一致を確認する。problem placement、Unit内の問題順、意味上の親指定は変更しない。
