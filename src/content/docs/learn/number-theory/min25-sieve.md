---
title: "Min_25・Lucy DP型の総和篩"
description: "「Min_25・Lucy DP型の総和篩」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 181
---

# Min_25・Lucy DP型の総和篩

習得対象の目安: **赤色（2800以上）**。商の異なる値を状態とする篩を構築し、乗法的関数の総和を高速に計算する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第193単元。技能の説明を学んでから問題一覧へ進んでください。

前: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/) ／ 次: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)

## 概要

### Min_25・Lucy DP型の総和篩

floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。

### 習得する技能

- floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)。

素因数・約数分解で得た考え方と実装を再利用し、Min_25・Lucy DP型の総和篩の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g) — 主題: [Min_25・Lucy DP型の総和篩](/learn/number-theory/min25-sieve/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC370 G 公式解説](https://atcoder.jp/contests/abc370/editorial/10869)
- [ABC370 G 公式問題文](https://atcoder.jp/contests/abc370/tasks/abc370_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-min25-sieve`
