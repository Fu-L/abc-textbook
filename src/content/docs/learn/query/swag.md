---
title: "SWAG・two-stack queue aggregation"
description: "SWAG・two-stack queue aggregationの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 188
---

# SWAG・two-stack queue aggregation

## 概要

### SWAG・two-stack queue aggregation

queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 区間monoid要約。

区間monoid要約で得た考え方と実装を再利用し、SWAG・two-stack queue aggregationの発動条件・正当化・境界を重複なく学ぶ。

- SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC456 F「Plan Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC456 F 公式解説](https://atcoder.jp/contests/abc456/editorial/19850)
- [ABC456 F 公式問題文](https://atcoder.jp/contests/abc456/tasks/abc456_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-swag`
