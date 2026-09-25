---
title: "Segment Treeのcanonical区間分解"
description: "「Segment Treeのcanonical区間分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 43
---

# Segment Treeのcanonical区間分解

習得対象の目安: **青色（1600–1999）**。区間を少数のnodeへ分解する性質を、値の集約以外の配置にも使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第111単元。技能の説明を学んでから問題一覧へ進んでください。

前: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/) ／ 次: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)

## 概要

### Segment Treeのcanonical区間分解

区間をO(log N)個のcanonical nodeへ分解し、range object・生存時間・range edgeを少数のnodeへ配置する。

### 習得する技能

- 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

区間monoid要約で得た考え方と実装を再利用し、Segment Treeのcanonical区間分解の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Segment Treeのcanonical区間分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC342 G「Retroactive Range Chmax」](https://atcoder.jp/contests/abc342/tasks/abc342_g) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。
2. [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

## 根拠

- [ABC244 H 公式解説](https://atcoder.jp/contests/abc244/editorial/3602)
- [ABC244 H 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC342 G 公式解説](https://atcoder.jp/contests/abc342/editorial/9373)
- [ABC342 G 公式問題文](https://atcoder.jp/contests/abc342/tasks/abc342_g)
- [ABC363 G 公式解説](https://atcoder.jp/contests/abc363/editorial/10451)
- [ABC363 G 公式問題文](https://atcoder.jp/contests/abc363/tasks/abc363_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-segment-tree-canonical-decomposition`
