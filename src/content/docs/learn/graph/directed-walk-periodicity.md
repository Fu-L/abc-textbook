---
title: "有向walkの周期・cycle差分gcd"
description: "「有向walkの周期・cycle差分gcd」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 99
---

# 有向walkの周期・cycle差分gcd

習得対象の目安: **黄色（2000–2399）**。SCC内の閉路長を差分のgcdでまとめ、巨大歩数の到達条件を周期へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 有向walkの周期・cycle差分gcd

往復可能領域でedgeごとのdepth差を集め、そのgcdをclosed walk長の周期として巨大歩数の到達可能性を判定する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（後の章）、[SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

gcd不変量・差分構造・SCC・縮約DAG・トポロジカル順序で得た考え方と実装を再利用し、有向walkの周期・cycle差分gcdの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 有向walkの周期・cycle差分gcdの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-directed-walk-periodicity`
