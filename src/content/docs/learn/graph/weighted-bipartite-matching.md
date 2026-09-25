---
title: "重み付き二部完全matching"
description: "「重み付き二部完全matching」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 124
---

# 重み付き二部完全matching

習得対象の目安: **黄色（2000–2399）**。assignmentの双対potentialとtight edgeを理解し、Hungarian法や費用流を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第178単元。技能の説明を学んでから問題一覧へ進んでください。

前: [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/) ／ 次: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)

## 概要

### 重み付き二部完全matching

assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。

### 習得する技能

- assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。

二部matching・Hall・Kőnigで得た考え方と実装を再利用し、重み付き二部完全matchingの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC373 G「No Cross Matching」](https://atcoder.jp/contests/abc373/tasks/abc373_g) — 主題: [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC373 G 公式解説](https://atcoder.jp/contests/abc373/editorial/11045)
- [ABC373 G 公式問題文](https://atcoder.jp/contests/abc373/tasks/abc373_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-weighted-bipartite-matching`
