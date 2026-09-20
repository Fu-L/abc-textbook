---
title: "parallel binary search・多数境界の判定共有"
description: "「parallel binary search・多数境界の判定共有」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 19
---

# parallel binary search・多数境界の判定共有

習得対象の目安: **青色（1600–1999）**。offline処理と二分探索を組み合わせ、複数queryで判定器の走査を共有する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### parallel binary search・多数境界の判定共有

多数queryの未知境界をmidごとにbucketし、更新を一方向に進める判定器を各roundで共有する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。

単一queryの単調境界を二分探索できるようになった後、多数queryのmidをroundごとに束ね、一方向更新できる判定器を共有する。

### このUnitでは扱わないもの

- parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g)
2. [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC233 H 公式解説](https://atcoder.jp/contests/abc233/editorial/3168)
- [ABC233 H 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC394 G 公式解説](https://atcoder.jp/contests/abc394/editorial/12282)
- [ABC394 G 公式問題文](https://atcoder.jp/contests/abc394/tasks/abc394_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-parallel-binary-search`
