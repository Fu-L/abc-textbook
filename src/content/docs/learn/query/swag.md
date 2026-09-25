---
title: "SWAG・two-stack queue aggregation"
description: "「SWAG・two-stack queue aggregation」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 42
---

# SWAG・two-stack queue aggregation

習得対象の目安: **青色（1600–1999）**。非可換な結合順を二つのstackで保ち、窓の集約を償却定数時間にする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第134単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Aho–Corasick](/learn/string/aho-corasick/) ／ 次: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)

## 概要

### SWAG・two-stack queue aggregation

queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。

### 習得する技能

- queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [区間monoid要約](/learn/query/range-monoid-aggregation/)。

区間monoid要約で得た考え方と実装を再利用し、SWAG・two-stack queue aggregationの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC456 F「Plan Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_f) — 主題: [SWAG・two-stack queue aggregation](/learn/query/swag/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC456 F 公式解説](https://atcoder.jp/contests/abc456/editorial/19850)
- [ABC456 F 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-swag`
