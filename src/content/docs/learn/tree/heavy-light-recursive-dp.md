---
title: "資源DPを引数で渡すHLRecDP"
description: "「資源DPを引数で渡すHLRecDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 158
---

# 資源DPを引数で渡すHLRecDP

## 概要

### 資源DPを引数で渡すHLRecDP

外部の資源DP配列を受け取って部分木の選択を反映する再帰を設計し、max-plusの子DP併合を避ける。重い子は一回だけ呼び、軽い子の重複呼出しを部分木サイズの半減により評価する。

dfs(v,dp)の引数は外部で既に選んだ候補の資源別最適値であり、返値は部分木vの選択肢も反映した値と定義する。独立な二配列のmax-plus mergeを、選択・非選択のO(X)更新へ展開する。重い子を一回だけ通す評価順を先に導く。

軽い子が半分以下というだけでO(NX log N)にはならない。各軽い子を二回呼ぶABC311 Exでは、サイズnの再帰量に重い子の一回分と軽い子の二回分が加わり、均等二分時は3T(n/2)となる。全heavy path根からの処理も含めO(N^(log₂3)X)を評価する。畳み込みを使う木DPとは別の証明である。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 集合・資源軸のDP、根付き木DP・部分木集約。

資源軸knapsack DP・根付き木DP・部分木集約で得た考え方と実装を再利用し、資源DPを引数で渡すHLRecDPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 資源DPを引数で渡すHLRecDPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC311 H 公式解説](https://atcoder.jp/contests/abc311/editorial/6814)
- [ABC311 H 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-heavy-light-recursive-dp`
