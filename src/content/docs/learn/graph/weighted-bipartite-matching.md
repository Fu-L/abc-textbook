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

## 概要

### 重み付き二部完全matching

assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。

### 習得する技能

- assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)。

このUnitを直接前提とする単元: なし。

二部matching・Hall・Kőnigで得た考え方と実装を再利用し、重み付き二部完全matchingの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC373 G「No Cross Matching」](https://atcoder.jp/contests/abc373/tasks/abc373_g) — 主題: [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/)（assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC373 G 公式解説](https://atcoder.jp/contests/abc373/editorial/11045)
- [ABC373 G 公式問題文](https://atcoder.jp/contests/abc373/tasks/abc373_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f0eec02dfa63f231848b86a0ef7f12f402ae50d89fbdbe50631d1be7cf3483fe` / LearningUnit `unit-weighted-bipartite-matching`
