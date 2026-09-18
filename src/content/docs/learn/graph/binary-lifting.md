---
title: "doubling・binary lifting"
description: "「doubling・binary lifting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 102
---

# doubling・binary lifting

習得対象の目安: **水色（1200–1599）**。二の冪回の遷移を合成し、行き先や累積値を対数回で求める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### doubling・binary lifting

決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

決定的遷移の2^k回後と累積値を合成し、巨大回数のjumpを二進分解で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC367 E「Permute K times」](https://atcoder.jp/contests/abc367/tasks/abc367_e)
2. [ABC438 E「Heavy Buckets」](https://atcoder.jp/contests/abc438/tasks/abc438_e)
3. [ABC212 F「Greedy Takahashi」](https://atcoder.jp/contests/abc212/tasks/abc212_f)
4. [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f)
5. [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g)
6. [ABC310 G「Takahashi And Pass-The-Ball Game」](https://atcoder.jp/contests/abc310/tasks/abc310_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)

## 根拠

- [ABC212 F 公式解説](https://atcoder.jp/contests/abc212/editorial/2362)
- [ABC212 F 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_f)
- [ABC254 G 公式解説](https://atcoder.jp/contests/abc254/editorial/4066)
- [ABC254 G 公式問題文](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC310 G 公式解説](https://atcoder.jp/contests/abc310/editorial/6785)
- [ABC310 G 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-binary-lifting`
