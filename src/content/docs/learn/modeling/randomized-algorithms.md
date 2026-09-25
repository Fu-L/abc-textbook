---
title: "乱択の成功条件と誤り確率を設計する"
description: "「乱択の成功条件と誤り確率を設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 23
---

# 乱択の成功条件と誤り確率を設計する

習得対象の目安: **青色（1600–1999）**。一回の成功確率と試行回数を結び付け、乱択が許す誤りを評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 乱択・Monte Carloアルゴリズム

乱数で候補またはfingerprintを選び、成功条件と誤り確率を評価して反復や事後検証を設計する。

### 習得する技能

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)、[乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。

乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

### このUnitでは扱わないもの

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 下位単元

- [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/) — 黄色

## 問題一覧

- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)（二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC272 G 公式解説](https://atcoder.jp/contests/abc272/editorial/4981)
- [ABC272 G 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `bc3fd38aa082c37e76f0829dcc0cff7e6d53e5b699f0b15c0b0432ab980d791f` / LearningUnit `unit-randomized-algorithms`
