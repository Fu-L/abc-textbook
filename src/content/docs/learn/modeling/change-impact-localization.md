---
title: "基準witnessから変更影響を局所化する"
description: "基準witnessから変更影響を局所化するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 88
---

# 基準witnessから変更影響を局所化する

## 概要

### 基準解による変更影響の局所化

変更前の解・実行列をwitnessとし、それを壊さない変更では答えが変わらないと示して再計算対象を絞る。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。

- 存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC279 E「Cheating Amidakuji」](https://atcoder.jp/contests/abc279/tasks/abc279_e)
2. [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e)
3. [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g)

## 根拠

- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC243 E 公式問題文](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC243 E 公式解説](https://atcoder.jp/contests/abc243/editorial/3561)
- [ABC279 E 公式問題文](https://atcoder.jp/contests/abc279/tasks/abc279_e)
- [ABC279 E 公式解説](https://atcoder.jp/contests/abc279/editorial/5289)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-change-impact-localization`
