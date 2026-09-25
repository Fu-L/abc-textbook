---
title: "グラフアルゴリズム"
description: "「グラフアルゴリズム」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 85
---

# グラフアルゴリズム

導入対象の目安: **緑色（800–1199）**。状態と遷移を頂点と辺で表し、距離・連結性・向きの違いを整理する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

状態と遷移をグラフへ写し、探索による到達性と二部彩色から始めて、距離、連結性の順に構造を調べる。有向グラフではDAGとSCC、無向グラフでは連結成分・橋・全域木を軸に整理し、閉路と次数の構造へ進む。後半は一対一対応から容量付き割当て、費用、双対性へ広げる。matching・flowの各Unitでは、元の問題の制約が頂点・辺・容量のどこに現れるかを確かめる。

### グラフモデルと構造

対象を頂点・辺・木・有向遷移として構造化する。

### 習得する技能

- 対象を頂点と辺に対応させ、利用するグラフ性質を示せる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

対象を頂点と辺へ写して到達可能性を扱えるようにし、連結性・最短路・木・フローへ進む土台を作る。

### このUnitでは扱わないもの

- なし

## 章の構成

- [状態グラフ探索・到達関係](/learn/graph/graph-search/) — 緑色（導入）
  - [状態グラフのモデリングと探索](/learn/graph/state-graph-search/) — 緑色
  - [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/) — 水色
  - [推移閉包](/learn/graph/transitive-closure/) — 水色
- [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/) — 緑色
- [重み付き最短路・経路復元・差分制約](/learn/graph/shortest-path-certificates/) — 緑色（導入）
  - [最短路モデル](/learn/graph/weighted-shortest-path/) — 緑色
  - [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/) — 水色
  - [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/) — 青色
- [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/) — 水色（導入）
  - [DAGのtopological processing](/learn/graph/dag-topological-processing/) — 緑色
  - [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/) — 水色
  - [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/) — 水色
  - [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/) — 黄色
  - [2-SAT・含意グラフ](/learn/graph/two-sat/) — 青色
- [一意な後続・サイクル・ダブリング](/learn/graph/functional-graph/) — 水色（導入）
  - [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/) — 水色
  - [doubling・binary lifting](/learn/graph/binary-lifting/) — 水色
- [連結成分を管理し縮約する](/learn/graph/connectivity/) — 緑色（導入）
  - [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/) — 緑色
  - [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/) — 水色
  - [potential・weighted DSU](/learn/graph/potential-dsu/) — 青色
- [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/) — 青色
- [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/) — 青色
- [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/) — 水色
  - [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/) — 青色
- [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/) — 青色
- [次数構造からgraph coreまたは小さなkernelへ縮約する](/learn/graph/graph-core-peeling/) — 水色（導入）
  - [graph core・leaf peeling](/learn/graph/graph-core/) — 水色
  - [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/) — 黄色
- [次数parityからwalkや選択辺集合を判定・構成する](/learn/graph/euler-degree/) — 水色（導入）
  - [Euler trail・circuit](/learn/graph/euler-trail-circuit/) — 水色
  - [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/) — 青色
- [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/) — 青色（導入）
  - [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/) — 青色
  - [最大流・最小カット](/learn/graph/max-flow-min-cut/) — 青色
  - [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/) — 黄色
  - [最小費用流・circulation](/learn/graph/min-cost-flow/) — 黄色
  - [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/) — 黄色
  - [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/) — 赤色
  - [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/) — 橙色
- [平面graph双対・cut/path対応](/learn/graph/planar-duality/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 dp_i=1+max_{a_j>a_i,同じ行または列}dp_j型の遷移を行別・列別最大へ圧縮する。遷移先がなければ0。同値のbatchでは全取得を済ませてから更新し、狭義不等号を保つ。sort後の集約はO(N)。
- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)。既習技能: 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h) — 主題: [DAGのtopological processing](/learn/graph/dag-topological-processing/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。 / 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 二部matchingを既習として、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。周期的な候補時刻の圧縮とmatchingによる可否を組み合わせ、単調な判定を二分探索へ接続する。
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)。既習技能: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g) — 主題: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。既習技能: 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。 / 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 / 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 / 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。
- [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 / DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g) — 主題: [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f) — 主題: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-graph`
