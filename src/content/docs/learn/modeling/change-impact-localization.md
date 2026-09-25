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

## 標準履修順

第93単元。技能の説明を学んでから問題一覧へ進んでください。

前: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/) ／ 次: [乗法的位数から最小周期を求める](/learn/number-theory/multiplicative-order-periods/)

## 概要

### 基準解による変更影響の局所化

変更前の解・実行列をwitnessとし、それを壊さない変更では答えが変わらないと示して再計算対象を絞る。

### 習得する技能

- 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。

### このUnitでは扱わないもの

- 存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。

## 問題一覧

1. [ABC279 E「Cheating Amidakuji」](https://atcoder.jp/contests/abc279/tasks/abc279_e) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)。
2. [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。
3. [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC243 E 公式問題文](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC243 E 公式解説](https://atcoder.jp/contests/abc243/editorial/3561)
- [ABC279 E 公式問題文](https://atcoder.jp/contests/abc279/tasks/abc279_e)
- [ABC279 E 公式解説](https://atcoder.jp/contests/abc279/editorial/5289)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-change-impact-localization`
