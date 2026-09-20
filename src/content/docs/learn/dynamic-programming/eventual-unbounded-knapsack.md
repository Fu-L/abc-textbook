---
title: "大容量unbounded knapsackのeventual linearity"
description: "「大容量unbounded knapsackのeventual linearity」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 70
---

# 大容量unbounded knapsackのeventual linearity

習得対象の目安: **橙色（2400–2799）**。交換論で例外部分を有限に界し、巨大容量を小さなDPと線形部分へ分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 大容量unbounded knapsackのeventual linearity

最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。

ABC310 Exでは短いコンボの列挙までを固有の前処理とし、時間a・報酬bのitem集合が得られた後を比較する。最大密度item(a*,b*)より劣るitemの列に長さa*の剰余prefix衝突があれば、所要時間がa*の倍数となる部分を基準itemで置換して報酬を減らさずに済む。したがって例外itemを有限個へ界し、有限DPと基準itemの反復を併用する。

ABC415 Gの容量固定で価値を最大化する形式に対し、ABC310 Exは目標価値を満たす時間を最小化する。有限例外の時間・報酬を保持し、残り必要報酬を基準itemで切り上げて満たす。密度greedyだけでは端数を最適化できず、例外上界とceilの処理が正しさに必要である。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。

通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。

### このUnitでは扱わないもの

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)
2. [ABC310 Ex「Negative Cost」](https://atcoder.jp/contests/abc310/tasks/abc310_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC310 H 公式解説](https://atcoder.jp/contests/abc310/editorial/6794)
- [ABC310 H 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_h)
- [ABC415 G 公式解説](https://atcoder.jp/contests/abc415/editorial/13491)
- [ABC415 G 公式問題文](https://atcoder.jp/contests/abc415/tasks/abc415_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-eventual-unbounded-knapsack`
