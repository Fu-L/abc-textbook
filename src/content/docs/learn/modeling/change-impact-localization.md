---
title: "基準witnessから変更影響を局所化する"
description: "「基準witnessから変更影響を局所化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 13
---

# 基準witnessから変更影響を局所化する

習得対象の目安: **青色（1600–1999）**。一つの証拠が残る変更を特定し、答えが変わり得る部分だけを再計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 基準解による変更影響の局所化

変更前の解・実行列をwitnessとし、それを壊さない変更では答えが変わらないと示して再計算対象を絞る。

### 習得する技能

- 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。

### このUnitでは扱わないもの

- 存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。

## 問題一覧

- [ABC279 E「Cheating Amidakuji」](https://atcoder.jp/contests/abc279/tasks/abc279_e) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。
- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。追加で学ぶ技能: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。）。既習技能: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)（基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。）。

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC243 E 公式問題文](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC243 E 公式解説](https://atcoder.jp/contests/abc243/editorial/3561)
- [ABC279 E 公式問題文](https://atcoder.jp/contests/abc279/tasks/abc279_e)
- [ABC279 E 公式解説](https://atcoder.jp/contests/abc279/editorial/5289)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-change-impact-localization`
