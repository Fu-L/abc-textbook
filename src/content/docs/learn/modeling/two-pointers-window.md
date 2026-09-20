---
title: "尺取り法・sliding windowで連続区間を走査する"
description: "「尺取り法・sliding windowで連続区間を走査する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 15
---

# 尺取り法・sliding windowで連続区間を走査する

習得対象の目安: **緑色（800–1199）**。窓の条件とpointerが戻らない理由を定め、全体の走査回数を数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 尺取り法・sliding window

一列の連続窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

### このUnitでは扱わないもの

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 問題一覧

1. [ABC294 E「2xN Grid」](https://atcoder.jp/contests/abc294/tasks/abc294_e)
2. [ABC260 E「At Least One」](https://atcoder.jp/contests/abc260/tasks/abc260_e)
3. [ABC215 F「Dist Max 2」](https://atcoder.jp/contests/abc215/tasks/abc215_f)
4. [ABC337 F「Usual Color Ball Problems」](https://atcoder.jp/contests/abc337/tasks/abc337_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e)
- [ABC290 E「Make it Palindrome」](https://atcoder.jp/contests/abc290/tasks/abc290_e)
- [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g)
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g)
- [ABC365 G「AtCoder Office」](https://atcoder.jp/contests/abc365/tasks/abc365_g)
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e)
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f)
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g)
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g)
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f)
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e)
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f)
- [ABC455 G「Balanced Subarrays」](https://atcoder.jp/contests/abc455/tasks/abc455_g)

## 根拠

- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)
- [ABC250 F 公式解説](https://atcoder.jp/contests/abc250/editorial/3928)
- [ABC250 F 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC258 E 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC258 E 公式解説](https://atcoder.jp/contests/abc258/editorial/4215)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-two-pointers-window`
