---
title: "連結成分を管理し縮約する"
description: "「連結成分を管理し縮約する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 24
---

# 連結成分を管理し縮約する

## 概要

連結成分を探索できるようになった後、成分縮約、差分辺のpotential累積、辺追加に対する付加情報つきDSU管理を学ぶ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 距離・訪問順を求める探索、および有向グラフの強連結成分と順序。

## 下位単元

- [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)
- [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)
- [potential・weighted DSU](/learn/graph/potential-dsu/)

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f)
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f)
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e)
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
- [ABC286 G「Unique Walk」](https://atcoder.jp/contests/abc286/tasks/abc286_g)
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h)
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e)
- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f)
- [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f)
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e)
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e)
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
- [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e)
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f)

## 根拠

- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)
- [ABC226 E 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 E 公式解説](https://atcoder.jp/contests/abc226/editorial/2889)
- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-connectivity`
