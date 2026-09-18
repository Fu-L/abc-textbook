---
title: "値域集約による部分列DP"
description: "「値域集約による部分列DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 65
---

# 値域集約による部分列DP

習得対象の目安: **水色（1200–1599）**。列DPの遷移を値域の集約へ写し、Segment Treeと更新順を組み合わせる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 値域集約による部分列DP

末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。

処理済みprefixについて、末尾の値vごとの最良長best[v]を持つ。直前値として許される区間の最大値に1を足し、現在値へchmaxする。列の順序は左からの処理で守り、値の条件は区間queryで守る。

ABC339 Eでは直前値が[A_i−D,A_i+D]にあることが条件である。末尾が小さいほど有利とは限らず、LISのtailsには圧縮できない。ABC360 Gでは未変更・変更済みの状態を分け、各値域構造を同じ要素から二度遷移させない更新順も確かめる。

ABC354 Fの採用解法では左右から値域最大DPを行い、l_i+r_i−1=Lで最長解に属し得る位置を判定する。この所属条件とLISの計算法は別の観察であり、基本LISのtailsを使う別実装と区別する。ABC240 Exでは部分文字列を辞書順に処理し、選択済みの最後の右端位置を集約軸にする。ABC410 Gでは右端順に処理し、左端位置の範囲を集約する。集約する座標は入力の数値そのものとは限らず、次の候補との接続条件から決める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)、[区間monoid要約](/learn/query/range-monoid-aggregation/)。

区間monoid要約・列・subsequence DPで得た考え方と実装を再利用し、値域集約による部分列DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e)
2. [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
3. [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
4. [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
5. [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC240 H 公式解説](https://atcoder.jp/contests/abc240/editorial/3428)
- [ABC240 H 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC339 E 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_e)
- [ABC339 E 公式解説](https://atcoder.jp/contests/abc339/editorial/9210)
- [ABC354 F 公式解説](https://atcoder.jp/contests/abc354/editorial/10027)
- [ABC354 F 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-value-range`
