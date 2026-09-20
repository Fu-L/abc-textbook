---
title: "区間拡張DP"
description: "「区間拡張DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 68
---

# 区間拡張DP

習得対象の目安: **青色（1600–1999）**。訪問済み範囲と現在の端で履歴を圧縮し、移動が往復しても非循環なDPを作る。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 区間拡張DP

訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。

数直線上で隣の未訪問点へ進むとき、訪問済みの点は連続区間になる。dp[l][r][side]で訪問済み範囲と現在いる端を表し、l−1またはr+1へ進む。区間長が増えるので、移動方向が左右へ反転してもDPの依存は循環しない。

ABC273 Fでは壁を越えるのに必要な鍵が訪問済み区間にあるかを判定する。続くABC219 Hでは将来回収する本数kを追加し、移動距離dによる損失k·dを評価する。区間の左右を独立に解いて合成するDPとは、状態の意味も遷移方向も異なる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

DPの最小十分状態で得た考え方と実装を再利用し、区間拡張DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f)
2. [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)
- [ABC273 F 公式解説](https://atcoder.jp/contests/abc273/editorial/5034)
- [ABC273 F 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-dp-interval-expansion`
