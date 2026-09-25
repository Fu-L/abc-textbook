---
title: "分離凸・凹の単調限界値選択"
description: "「分離凸・凹の単調限界値選択」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 224
---

# 分離凸・凹の単調限界値選択

習得対象の目安: **青色（1600–1999）**。単調な限界費用の列を導き、heapや閾値計数で必要個数を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第110単元。技能の説明を学んでから問題一覧へ進んでください。

前: [文字列周期・primitive word](/learn/string/string-periodicity/) ／ 次: [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)

## 概要

### 分離凸・凹の単調限界値選択

各対象の限界費用が単調増加（または限界利益が単調減少）することを使い、複数の限界値列から必要な上位・下位K項をpriority queue mergeまたは値の閾値計数で選ぶ。

### 習得する技能

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

離散凸・凹の差分が単調になることを確認し、複数の限界値列から必要な上位・下位K項だけをheap mergeまたは閾値計数で選ぶ。

### このUnitでは扱わないもの

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
2. [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
3. [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
4. [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
5. [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC359 F 公式解説](https://atcoder.jp/contests/abc359/editorial/10260)
- [ABC359 F 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC369 G 公式解説](https://atcoder.jp/contests/abc369/editorial/10843)
- [ABC369 G 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-separable-convex-marginals`
