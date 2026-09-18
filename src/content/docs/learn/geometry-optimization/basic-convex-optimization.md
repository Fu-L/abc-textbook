---
title: "一次元凸・単峰最適化"
description: "「一次元凸・単峰最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 223
---

# 一次元凸・単峰最適化

習得対象の目安: **青色（1600–1999）**。単峰性や差分の単調性を証明し、三分探索・整数境界で最適点を求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 一次元凸・単峰最適化

差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e)
2. [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
3. [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
4. [ABC224 G「Roll or Increment」](https://atcoder.jp/contests/abc224/tasks/abc224_g)
5. [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g)
6. [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g)
7. [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
8. [ABC314 Ex「Disk and Segments」](https://atcoder.jp/contests/abc314/tasks/abc314_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)
- [ABC229 G 公式解説](https://atcoder.jp/contests/abc229/editorial/2963)
- [ABC229 G 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC240 F 公式解説](https://atcoder.jp/contests/abc240/editorial/3422)
- [ABC240 F 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-basic-convex-optimization`
