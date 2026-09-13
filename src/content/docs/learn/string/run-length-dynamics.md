---
title: "run-length状態の動的遷移"
description: "run-length状態の動的遷移の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 150
---

# run-length状態の動的遷移

## 概要

### run-length状態の動的遷移

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC313 E「Duplicate」](https://atcoder.jp/contests/abc313/tasks/abc313_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC313 E 公式問題文](https://atcoder.jp/contests/abc313/tasks/abc313_e)
- [ABC313 E 公式解説](https://atcoder.jp/contests/abc313/editorial/6911)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-run-length-dynamics`
