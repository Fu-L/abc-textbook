---
title: "大容量unbounded knapsackのeventual linearity"
description: "「大容量unbounded knapsackのeventual linearity」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 69
---

# 大容量unbounded knapsackのeventual linearity

習得対象の目安: **橙色（2400–2799）**。交換論で例外部分を有限に界し、巨大容量を小さなDPと線形部分へ分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第183単元。技能の説明を学んでから問題一覧へ進んでください。

前: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/) ／ 次: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)

## 概要

### 大容量unbounded knapsackのeventual linearity

最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。

ABC310 Exでは短いコンボの列挙までを固有の前処理とし、時間a・報酬bのitem集合が得られた後を比較する。最大密度item(a*,b*)より劣るitemの列に長さa*の剰余prefix衝突があれば、所要時間がa*の倍数となる部分を基準itemで置換して報酬を減らさずに済む。したがって例外itemを有限個へ界し、有限DPと基準itemの反復を併用する。

ABC415 Gの容量固定で価値を最大化する形式に対し、ABC310 Exは目標価値を満たす時間を最小化する。有限例外の時間・報酬を保持し、残り必要報酬を基準itemで切り上げて満たす。密度greedyだけでは端数を最適化できず、例外上界とceilの処理が正しさに必要である。

### 習得する技能

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。

通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。

### このUnitでは扱わないもの

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
2. [ABC310 Ex「Negative Cost」](https://atcoder.jp/contests/abc310/tasks/abc310_h) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC310 H 公式解説](https://atcoder.jp/contests/abc310/editorial/6794)
- [ABC310 H 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_h)
- [ABC415 G 公式解説](https://atcoder.jp/contests/abc415/editorial/13491)
- [ABC415 G 公式問題文](https://atcoder.jp/contests/abc415/tasks/abc415_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-eventual-unbounded-knapsack`
