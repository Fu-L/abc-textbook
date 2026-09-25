---
title: "固定線形遷移を巨大回数進める"
description: "「固定線形遷移を巨大回数進める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 84
---

# 固定線形遷移を巨大回数進める

習得対象の目安: **青色（1600–1999）**。固定線形遷移を行列や漸化式へ写し、巨大回数の反復を二分累乗する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第97単元。技能の説明を学んでから問題一覧へ進んでください。

前: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/) ／ 次: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)

## 概要

### 線形遷移・行列累乗

固定線形遷移を行列または線形漸化式として巨大回数進める。

### 習得する技能

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。

### このUnitでは扱わないもの

- 一般のDP遷移の区間集約・単調最適化。

## 問題一覧

1. [ABC293 E「Geometric Progression」](https://atcoder.jp/contests/abc293/tasks/abc293_e) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。
2. [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
3. [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。
4. [ABC258 Ex「Odd Steps」](https://atcoder.jp/contests/abc258/tasks/abc258_h) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。
5. [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。
6. [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。
7. [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。
8. [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。 / 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。 / bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC256 G 公式解説](https://atcoder.jp/contests/abc256/editorial/4130)
- [ABC256 G 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC258 H 公式解説](https://atcoder.jp/contests/abc258/editorial/4214)
- [ABC258 H 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-linear-recurrence`
