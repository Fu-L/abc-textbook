---
title: "Euler trail・circuit"
description: "「Euler trail・circuit」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 116
---

# Euler trail・circuit

習得対象の目安: **水色（1200–1599）**。次数条件を理解し、辺を一度ずつ使うHierholzer法を実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Euler trail・circuit

全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Euler trail・circuitの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC286 G「Unique Walk」](https://atcoder.jp/contests/abc286/tasks/abc286_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g)

## 根拠

- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC286 G 公式解説](https://atcoder.jp/contests/abc286/editorial/5573)
- [ABC286 G 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_g)
- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-euler-trail-circuit`
