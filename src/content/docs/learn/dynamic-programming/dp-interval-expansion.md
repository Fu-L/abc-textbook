---
title: "区間拡張DP"
description: "区間拡張DPの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 105
---

# 区間拡張DP

## 概要

### 区間拡張DP

訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。

数直線上で隣の未訪問点へ進むとき、訪問済みの点は連続区間になる。dp[l][r][side]で訪問済み範囲と現在いる端を表し、l−1またはr+1へ進む。区間長が増えるので、移動方向が左右へ反転してもDPの依存は循環しない。

ABC273 Fでは壁を越えるのに必要な鍵が訪問済み区間にあるかを判定する。続くABC219 Hでは将来回収する本数kを追加し、移動距離dによる損失k·dを評価する。区間の左右を独立に解いて合成するDPとは、状態の意味も遷移方向も異なる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 最小十分状態からDPを設計する。

DPの最小十分状態で得た考え方と実装を再利用し、区間拡張DPの発動条件・正当化・境界を重複なく学ぶ。

- 区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f)
2. [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)
- [ABC273 F 公式解説](https://atcoder.jp/contests/abc273/editorial/5034)
- [ABC273 F 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1c747d7235424cdb69761dd4e23c049268d95ccb300fc9d49802f379e3df1861` / LearningUnit `unit-dp-interval-expansion`
