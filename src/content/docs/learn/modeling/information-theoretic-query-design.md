---
title: "情報量下界・query符号設計"
description: "「情報量下界・query符号設計」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 27
---

# 情報量下界・query符号設計

習得対象の目安: **水色（1200–1599）**。応答で区別できる状態数を数え、bit符号化と復号を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 情報量下界・query符号設計

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

応答alphabetとquery回数から識別可能状態数の下界を出し、その下界に一致するcodeword割当と復号を構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 情報量下界・query符号設計の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC337 E 公式問題文](https://atcoder.jp/contests/abc337/tasks/abc337_e)
- [ABC337 E 公式解説](https://atcoder.jp/contests/abc337/editorial/9140)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-information-theoretic-query-design`
