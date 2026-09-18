---
title: "gcd不変量・差分構造"
description: "「gcd不変量・差分構造」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 163
---

# gcd不変量・差分構造

習得対象の目安: **水色（1200–1599）**。差や周期をgcdにまとめ、共通因子と剰余類が保存する条件を示す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### gcd不変量・差分構造

差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G「222」](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC248 G「GCD cost on the tree」](https://atcoder.jp/contests/abc248/tasks/abc248_g)
- [ABC254 F「Rectangle GCD」](https://atcoder.jp/contests/abc254/tasks/abc254_f)
- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC248 G 公式解説](https://atcoder.jp/contests/abc248/editorial/3795)
- [ABC248 G 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-gcd-structure`
