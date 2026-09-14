---
title: "根付き木DP・部分木集約"
description: "「根付き木DP・部分木集約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 58
---

# 根付き木DP・部分木集約

## 概要

### 根付き木DP・部分木集約

子部分木の状態をbottom-upに合成し、親へ渡す最小十分なopen/closed状態や要約を設計する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC239 E「Subtree K-th Max」](https://atcoder.jp/contests/abc239/tasks/abc239_e)
2. [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e)
3. [ABC391 E「Hierarchical Majority Vote」](https://atcoder.jp/contests/abc391/tasks/abc391_e)
4. [ABC397 E「Path Decomposition of a Tree」](https://atcoder.jp/contests/abc397/tasks/abc397_e)
5. [ABC409 E「Pair Annihilation」](https://atcoder.jp/contests/abc409/tasks/abc409_e)
6. [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
7. [ABC259 F「Select Edges」](https://atcoder.jp/contests/abc259/tasks/abc259_f)
8. [ABC263 F「Tournament」](https://atcoder.jp/contests/abc263/tasks/abc263_f)
9. [ABC287 F「Components」](https://atcoder.jp/contests/abc287/tasks/abc287_f)
10. [ABC378 F「Add One Edge 2」](https://atcoder.jp/contests/abc378/tasks/abc378_f)
11. [ABC394 F「Alkane」](https://atcoder.jp/contests/abc394/tasks/abc394_f)
12. [ABC416 F「Paint Tree 2」](https://atcoder.jp/contests/abc416/tasks/abc416_f)
13. [ABC447 F「Centipede Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_f)
14. [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g)
15. [ABC248 G「GCD cost on the tree」](https://atcoder.jp/contests/abc248/tasks/abc248_g)
16. [ABC312 G「Avoid Straight Line」](https://atcoder.jp/contests/abc312/tasks/abc312_g)
17. [ABC264 Ex「Perfect Binary Tree」](https://atcoder.jp/contests/abc264/tasks/abc264_h)
18. [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC329 G「Delivery on Tree」](https://atcoder.jp/contests/abc329/tasks/abc329_g)
- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f)
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f)
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f)

## 根拠

- [ABC239 E 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_e)
- [ABC239 E 公式解説](https://atcoder.jp/contests/abc239/editorial/3385)
- [ABC246 G 公式解説](https://atcoder.jp/contests/abc246/editorial/3706)
- [ABC246 G 公式問題文](https://atcoder.jp/contests/abc246/tasks/abc246_g)
- [ABC248 G 公式解説](https://atcoder.jp/contests/abc248/editorial/3795)
- [ABC248 G 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-rooted-tree-aggregation`
