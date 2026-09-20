---
title: "fractional programming・比率parametric search"
description: "「fractional programming・比率parametric search」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 229
---

# fractional programming・比率parametric search

習得対象の目安: **青色（1600–1999）**。分母の正性を確認し、比率を加法的な判定へ変換して二分探索する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### fractional programming・比率parametric search

比率目標xに対して各寄与をbenefit-x·costへ変換し、和が非負かという単調な加法最適化へ帰着する。

分母Bが正の比率A/Bをx以上にできるかは、A−xB≥0に変換する。比率そのものは加算できなくても、変換後のスコアは要素・辺ごとに足せる。分母の符号と単調性を確認してから二分探索する。

ABC236 Eの平均値側は各要素をA_i−xに置き換え、選択制約のDPでスコア最大値を求める。中央値側はA_i≥xを+1、それ以外を−1とする個数比較であり、比率の線形化とは区別する。

ABC324 Fでは各辺の利得−x·費用をDAG上で最大化する。ABC294 Fでは砂糖量−x·総重量を各溶液に割り当て、二つのスコアの和が非負となる組数を整列と二分探索で数える。同じ変換の後に、最適化と計数という異なる判定器を接続する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。

単調境界探索で得た考え方と実装を再利用し、fractional programming・比率parametric searchの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
2. [ABC294 F「Sugar Water 2」](https://atcoder.jp/contests/abc294/tasks/abc294_f)
3. [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC236 E 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_e)
- [ABC236 E 公式解説](https://atcoder.jp/contests/abc236/editorial/3279)
- [ABC294 F 公式解説](https://atcoder.jp/contests/abc294/editorial/6007)
- [ABC294 F 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_f)
- [ABC324 F 公式解説](https://atcoder.jp/contests/abc324/editorial/7405)
- [ABC324 F 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-fractional-parametric-search`
