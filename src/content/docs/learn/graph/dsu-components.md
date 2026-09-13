---
title: "DSUによる連結成分管理・縮約"
description: "DSUによる連結成分管理・縮約の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 23
---

# DSUによる連結成分管理・縮約

## 概要

### DSUによる連結成分管理・縮約

辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC276 E「Round Trip」](https://atcoder.jp/contests/abc276/tasks/abc276_e)
2. [ABC279 F「BOX」](https://atcoder.jp/contests/abc279/tasks/abc279_f)
3. [ABC304 E「Good Graph」](https://atcoder.jp/contests/abc304/tasks/abc304_e)
4. [ABC372 E「K-th Largest Connected Components」](https://atcoder.jp/contests/abc372/tasks/abc372_e)
5. [ABC420 E「Reachability Query」](https://atcoder.jp/contests/abc420/tasks/abc420_e)
6. [ABC238 E「Range Sums」](https://atcoder.jp/contests/abc238/tasks/abc238_e)
7. [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e)
8. [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e)
9. [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g)
10. [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e)
11. [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e)
12. [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
13. [ABC335 E「Non-Decreasing Colorful Path」](https://atcoder.jp/contests/abc335/tasks/abc335_e)

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-dsu-components`
