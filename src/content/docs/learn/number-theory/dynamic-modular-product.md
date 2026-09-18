---
title: "可逆な非零剰余と剰余 0 因子を含む法上の動的積"
description: "「可逆な非零剰余と剰余 0 因子を含む法上の動的積」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 167
---

# 可逆な非零剰余と剰余 0 因子を含む法上の動的積

習得対象の目安: **水色（1200–1599）**。逆元で除ける因子を確認し、0の個数と非零因子の積を分けて更新する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 法上の動的積・剰余 0 因子の分離

取り得る因子のうち法 m で非零となるものがすべて可逆であることを確認し、因子の差し替えを「剰余 0 の因子数」と「非零因子の積」に分け、可逆な旧因子を逆元で外して新因子を掛ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

通常の法上演算と逆元の存在条件を前提に、取り得る因子のうち法 m で非零となるものがすべて可逆（典型的には素数法）かを確認する。剰余 0 だけは逆元を持たないため、その個数と可逆な非零剰余因子の積へ状態を分けて因子差し替えを定数時間で処理する。

### このUnitでは扱わないもの

- 因子が変化しない一回限りの積、和やmin/maxの更新、任意区間積を求めるSegment Tree、および合成数法で非零の非可逆因子も差し替える一般の場合。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC456 G「Count Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_g)

## 根拠

- [ABC405 G 公式解説](https://atcoder.jp/contests/abc405/editorial/12997)
- [ABC405 G 公式問題文](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC411 E 公式問題文](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC411 E 公式解説](https://atcoder.jp/contests/abc411/editorial/13361)
- [ABC456 G 公式解説](https://atcoder.jp/contests/abc456/editorial/19853)
- [ABC456 G 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dynamic-modular-product`
