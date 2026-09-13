---
title: "matroid greedy"
description: "matroid greedyの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 165
---

# matroid greedy

## 概要

### matroid greedy

独立集合族の交換公理を確認し、重み順に独立性oracleを通すgreedyが最適基底を作ることを証明する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 交換論から選択順を導く。

Matroidの独立集合族と交換公理を定義した後、重み順greedyが最適基底を作る必要十分な構造を証明する。

- matroid greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC236 F 公式解説](https://atcoder.jp/contests/abc236/editorial/3287)
- [ABC236 F 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-matroid-greedy`
