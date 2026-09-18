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

状態と遷移をグラフへ写し、到達性、距離、連結性の順に構造を調べる。有向グラフではDAGとSCC、無向グラフでは連結成分・橋・全域木を軸に整理し、閉路と次数の構造へ進む。後半は一対一対応から容量付き割当て、費用、双対性へ広げる。matching・flowの各Unitでは、元の問題の制約が頂点・辺・容量のどこに現れるかを確かめる。

### グラフモデルと構造

対象を頂点・辺・木・有向遷移として構造化する。

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
- [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/) — 緑色
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

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f)
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f)
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h)
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f)
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g)
- [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e)
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f)
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g)
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f)
- [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e)

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-graph`
