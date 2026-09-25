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

## 概要

### 線形遷移・行列累乗

固定線形遷移を行列または線形漸化式として巨大回数進める。

### 習得する技能

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)。

一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。

### このUnitでは扱わないもの

- 一般のDP遷移の区間集約・単調最適化。

## 問題一覧

- [ABC293 E「Geometric Progression」](https://atcoder.jp/contests/abc293/tasks/abc293_e) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC258 Ex「Odd Steps」](https://atcoder.jp/contests/abc258/tasks/abc258_h) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)（P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC256 G 公式解説](https://atcoder.jp/contests/abc256/editorial/4130)
- [ABC256 G 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC258 H 公式解説](https://atcoder.jp/contests/abc258/editorial/4214)
- [ABC258 H 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-linear-recurrence`
