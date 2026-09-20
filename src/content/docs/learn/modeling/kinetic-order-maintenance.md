---
title: "kinetic sorting・交差event順序更新"
description: "「kinetic sorting・交差event順序更新」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 17
---

# kinetic sorting・交差event順序更新

習得対象の目安: **橙色（2400–2799）**。連続的な順序変化を隣接交差に限定し、失効eventと総event数を管理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### kinetic sorting・交差event順序更新

連続parameterで隣接要素の順序が入れ替わる時刻だけをevent化し、次の有効交差を処理して全順序を更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。

event・値順のオフライン走査で得た考え方と実装を再利用し、kinetic sorting・交差event順序更新の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC344 G「Points and Comparison」](https://atcoder.jp/contests/abc344/tasks/abc344_g)
2. [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC257 H 公式解説](https://atcoder.jp/contests/abc257/editorial/4168)
- [ABC257 H 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC344 G 公式解説](https://atcoder.jp/contests/abc344/editorial/9491)
- [ABC344 G 公式問題文](https://atcoder.jp/contests/abc344/tasks/abc344_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-kinetic-order-maintenance`
