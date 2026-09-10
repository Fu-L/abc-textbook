---
title: "backtracking・可逆な探索状態"
description: "backtracking・可逆な探索状態の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 87
---

# backtracking・可逆な探索状態

## 概要

### backtracking・可逆な探索状態

再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- backtracking・可逆な探索状態の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)

## 根拠

- [ABC284 E 公式問題文](https://atcoder.jp/contests/abc284/tasks/abc284_e)
- [ABC284 E 公式解説](https://atcoder.jp/contests/abc284/editorial/5494)
- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-backtracking-search`
