---
title: "最大流・最小カット"
description: "「最大流・最小カット」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 121
---

# 最大流・最小カット

難度の目安: **標準**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最大流・最小カット

選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。

ABC241 Gを容量付き割当の導入にする。候補選手の勝数を最大化した後、残る未確定試合をそれぞれ一単位の供給とし、試合頂点から対戦する二選手へ容量1の辺を張る。各選手からsinkへの容量は候補の勝数未満に収める残り勝数枠とする。負の枠があれば不可能で、全試合分の流量が流れれば割当が存在する。

同じ選手へ複数試合の勝利を割り当てられるため、選手側の容量は1とは限らない。一対一matchingとの違いを容量条件で確認してから、頂点容量の分割やmin-cutによる選択問題へ進む。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC225 G「X」](https://atcoder.jp/contests/abc225/tasks/abc225_g)
2. [ABC239 G「Builder Takahashi」](https://atcoder.jp/contests/abc239/tasks/abc239_g)
3. [ABC241 G「Round Robin」](https://atcoder.jp/contests/abc241/tasks/abc241_g)
4. [ABC259 G「Grid Card Game」](https://atcoder.jp/contests/abc259/tasks/abc259_g)
5. [ABC318 G「Typical Path Problem」](https://atcoder.jp/contests/abc318/tasks/abc318_g)
6. [ABC326 G「Unlock Achievement」](https://atcoder.jp/contests/abc326/tasks/abc326_g)
7. [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
8. [ABC347 G「Grid Coloring 2」](https://atcoder.jp/contests/abc347/tasks/abc347_g)
9. [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g)
10. [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
- [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g)
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g)

## 根拠

- [ABC225 G 公式解説](https://atcoder.jp/contests/abc225/editorial/2854)
- [ABC225 G 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_g)
- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC239 G 公式解説](https://atcoder.jp/contests/abc239/editorial/3393)
- [ABC239 G 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-max-flow-min-cut`
