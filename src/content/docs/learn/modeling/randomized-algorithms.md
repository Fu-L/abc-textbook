---
title: "乱択の成功条件と誤り確率を設計する"
description: "乱択の成功条件と誤り確率を設計するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 77
---

# 乱択の成功条件と誤り確率を設計する

## 概要

### 乱択・Monte Carloアルゴリズム

乱数で候補またはfingerprintを選び、成功条件と誤り確率を評価して反復や事後検証を設計する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 下位単元

- [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g)
2. [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC272 G 公式解説](https://atcoder.jp/contests/abc272/editorial/4981)
- [ABC272 G 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-randomized-algorithms`
