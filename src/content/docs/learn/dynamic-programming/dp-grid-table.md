---
title: "グリッド・多次元表の局所DPを設計する"
description: "「グリッド・多次元表の局所DPを設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 61
---

# グリッド・多次元表の局所DPを設計する

習得対象の目安: **緑色（800–1199）**。二次元以上の添字と依存順を定め、隣接状態から表を埋める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### グリッド・多次元表の局所DP

グリッド経路や多次元表の依存関係をDAG順に並べ、隣接する小さな状態集合から各セル・各添字を更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。

### このUnitでは扱わないもの

- 一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。

## 問題一覧

1. [ABC311 E「Defect-free Squares」](https://atcoder.jp/contests/abc311/tasks/abc311_e)
2. [ABC415 E「Hungry Takahashi」](https://atcoder.jp/contests/abc415/tasks/abc415_e)
3. [ABC443 E「Climbing Silver」](https://atcoder.jp/contests/abc443/tasks/abc443_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 H「Count Multiset」](https://atcoder.jp/contests/abc221/tasks/abc221_h)
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f)
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f)
- [ABC358 G「AtCoder Tour」](https://atcoder.jp/contests/abc358/tasks/abc358_g)
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e)

## 根拠

- [ABC221 H 公式解説](https://atcoder.jp/contests/abc221/editorial/2719)
- [ABC221 H 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_h)
- [ABC227 F 公式解説](https://atcoder.jp/contests/abc227/editorial/2914)
- [ABC227 F 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_f)
- [ABC311 E 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_e)
- [ABC311 E 公式解説](https://atcoder.jp/contests/abc311/editorial/6819)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-grid-table`
