---
title: "乱択の成功条件と誤り確率を設計する"
description: "「乱択の成功条件と誤り確率を設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 24
---

# 乱択の成功条件と誤り確率を設計する

習得対象の目安: **青色（1600–1999）**。一回の成功確率と試行回数を結び付け、乱択が許す誤りを評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第96単元。技能の説明を学んでから問題一覧へ進んでください。

前: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/) ／ 次: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)

## 概要

### 乱択・Monte Carloアルゴリズム

乱数で候補またはfingerprintを選び、成功条件と誤り確率を評価して反復や事後検証を設計する。

### 習得する技能

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

### このUnitでは扱わないもの

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 下位単元

- [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/) — 黄色

## 問題一覧

1. [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
2. [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。既習技能: 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g) — 主題: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)。既習技能: 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。 / 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC272 G 公式解説](https://atcoder.jp/contests/abc272/editorial/4981)
- [ABC272 G 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-randomized-algorithms`
