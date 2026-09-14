---
title: "グラフアルゴリズム"
description: "「グラフアルゴリズム」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 9
---

# グラフアルゴリズム

## 概要

### グラフモデルと構造

対象を頂点・辺・木・有向遷移として構造化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

対象を頂点と辺へ写して到達可能性を扱えるようにし、連結性・最短路・木・フローへ進む土台を作る。

### このUnitでは扱わないもの

- なし

## 下位単元

- [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)
- [状態グラフ探索・到達関係](/learn/graph/graph-search/)
- [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/)
- [連結成分を管理し縮約する](/learn/graph/connectivity/)
- [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)
- [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)
- [一意な後続・サイクル・ダブリング](/learn/graph/functional-graph/)
- [次数構造からgraph coreまたは小さなkernelへ縮約する](/learn/graph/graph-core-peeling/)
- [重み付き最短路・経路復元・差分制約](/learn/graph/shortest-path-certificates/)
- [次数parityからwalkや選択辺集合を判定・構成する](/learn/graph/euler-degree/)
- [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)
- [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)
- [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)
- [平面graph双対・cut/path対応](/learn/graph/planar-duality/)

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
