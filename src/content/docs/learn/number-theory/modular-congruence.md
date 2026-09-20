---
title: "一次合同・CRTで解の類を統合する"
description: "「一次合同・CRTで解の類を統合する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 168
---

# 一次合同・CRTで解の類を統合する

習得対象の目安: **青色（1600–1999）**。一次合同の可解条件を確認し、非互いに素な法も含めてCRTで統合する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 一次合同・CRT

一次合同のgcd可解性を判定し、互いに素でない法も含めて複数の剰余類を一つへ統合する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)、[法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

法上の演算とBézout等式を使えることを前提に、一次合同の可解性を判定して複数条件をCRTで統合する。

### このUnitでは扱わないもの

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 問題一覧

1. [ABC460 E「x + y ≡ x + y」](https://atcoder.jp/contests/abc460/tasks/abc460_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g)
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g)

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC286 F 公式解説](https://atcoder.jp/contests/abc286/editorial/5588)
- [ABC286 F 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC371 G 公式解説](https://atcoder.jp/contests/abc371/editorial/10927)
- [ABC371 G 公式問題文](https://atcoder.jp/contests/abc371/tasks/abc371_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-modular-congruence`
