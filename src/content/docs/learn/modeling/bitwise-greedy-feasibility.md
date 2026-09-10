---
title: "bitwise greedyによるmask最適化"
description: "bitwise greedyによるmask最適化の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 86
---

# bitwise greedyによるmask最適化

## 概要

### bitwise greedyによるmask最適化

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC408 E 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC408 E 公式解説](https://atcoder.jp/contests/abc408/editorial/13159)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-bitwise-greedy-feasibility`
