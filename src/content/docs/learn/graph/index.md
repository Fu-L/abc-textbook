---
title: "グラフアルゴリズム"
description: "グラフアルゴリズムの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 2
---

# グラフアルゴリズム

## 概要

### グラフモデルと構造

対象を頂点・辺・木・有向遷移として構造化する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

対象を頂点と辺へ写して到達可能性を扱えるようにし、連結性・最短路・木・フローへ進む土台を作る。

- なし

## 下位単元

- [状態グラフ探索・到達関係](/learn/graph/graph-search/)
- [連結成分を管理し縮約する](/learn/graph/connectivity/)
- [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)
- [一意な後続・サイクル・ダブリング](/learn/graph/functional-graph/)
- [重み付き最短路・経路復元・差分制約](/learn/graph/shortest-path-certificates/)
- [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/)
- [次数parityからwalkや選択辺集合を判定・構成する](/learn/graph/euler-degree/)
- [次数構造からgraph coreまたは小さなkernelへ縮約する](/learn/graph/graph-core-peeling/)
- [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)
- [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)
- [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)
- [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)
- [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)
- [平面graph双対・cut/path対応](/learn/graph/planar-duality/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f)
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f)
- [ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g)
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g)
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e)
- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e)
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e)
- [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h)
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e)
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h)
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g)
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g)
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e)
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e)
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f)
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f)
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g)
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f)
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g)
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g)
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f)
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g)
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g)
- [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e)
- [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e)

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-chapter-graph`
