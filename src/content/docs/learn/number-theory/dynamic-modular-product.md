---
title: "可逆な非零剰余と剰余 0 因子を含む法上の動的積"
description: "可逆な非零剰余と剰余 0 因子を含む法上の動的積の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 38
---

# 可逆な非零剰余と剰余 0 因子を含む法上の動的積

## 概要

### 法上の動的積・剰余 0 因子の分離

取り得る因子のうち法 m で非零となるものがすべて可逆であることを確認し、因子の差し替えを「剰余 0 の因子数」と「非零因子の積」に分け、可逆な旧因子を逆元で外して新因子を掛ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 法上の四則演算・高速累乗・逆元。

通常の法上演算と逆元の存在条件を前提に、取り得る因子のうち法 m で非零となるものがすべて可逆（典型的には素数法）かを確認する。剰余 0 だけは逆元を持たないため、その個数と可逆な非零剰余因子の積へ状態を分けて因子差し替えを定数時間で処理する。

- 因子が変化しない一回限りの積、和やmin/maxの更新、任意区間積を求めるSegment Tree、および合成数法で非零の非可逆因子も差し替える一般の場合。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-dynamic-modular-product`
