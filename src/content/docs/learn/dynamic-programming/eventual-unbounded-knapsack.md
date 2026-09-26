---
title: "大容量unbounded knapsackのeventual linearity"
description: "「大容量unbounded knapsackのeventual linearity」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 68
---

# 大容量unbounded knapsackのeventual linearity

習得対象の目安: **橙色（2400–2799）**。交換論で例外部分を有限に界し、巨大容量を小さなDPと線形部分へ分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 大容量unbounded knapsackのeventual linearity

最大密度item以外の総使用量を剰余と交換論で有限に界し、小容量prefixだけをDPした後の巨大capacityを基準itemの反復で埋める。

ABC310 Exでは短いコンボの列挙までを固有の前処理とし、時間a・報酬bのitem集合が得られた後を比較する。最大密度item(a*,b*)より劣るitemの列に長さa*の剰余prefix衝突があれば、所要時間がa*の倍数となる部分を基準itemで置換して報酬を減らさずに済む。したがって例外itemを有限個へ界し、有限DPと基準itemの反復を併用する。

ABC415 Gの容量固定で価値を最大化する形式に対し、ABC310 Exは目標価値を満たす時間を最小化する。有限例外の時間・報酬を保持し、残り必要報酬を基準itemで切り上げて満たす。密度greedyだけでは端数を最適化できず、例外上界とceilの処理が正しさに必要である。

### 習得する技能

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)。

このUnitを直接前提とする単元: なし。

通常のunbounded knapsackを設計できるようになった後、最大密度itemへの交換で非基準部分を有限prefixへ閉じ込め、巨大capacityのlinear tailを証明する。

### このUnitでは扱わないもの

- 大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)（剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC310 Ex「Negative Cost」](https://atcoder.jp/contests/abc310/tasks/abc310_h) — 主題: [大容量unbounded knapsackのeventual linearity](/learn/dynamic-programming/eventual-unbounded-knapsack/)（剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC310 H 公式解説](https://atcoder.jp/contests/abc310/editorial/6794)
- [ABC310 H 公式問題文](https://atcoder.jp/contests/abc310/tasks/abc310_h)
- [ABC415 G 公式解説](https://atcoder.jp/contests/abc415/editorial/13491)
- [ABC415 G 公式問題文](https://atcoder.jp/contests/abc415/tasks/abc415_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `0692598e2b508b9bccbb426948385d8984441e84e8e74454a1951e10156ee9ff` / LearningUnit `unit-eventual-unbounded-knapsack`
