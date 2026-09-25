---
title: "母関数方程式・高度な係数抽出"
description: "「母関数方程式・高度な係数抽出」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 209
---

# 母関数方程式・高度な係数抽出

習得対象の目安: **橙色（2400–2799）**。Lagrange反転・微分による係数比較・Euler積を、式の条件に合わせて選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第192単元。技能の説明を学んでから問題一覧へ進んでください。

前: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/) ／ 次: [Min_25・Lucy DP型の総和篩](/learn/number-theory/min25-sieve/)

## 概要

### 母関数方程式・高度な係数抽出

暗黙方程式の反転、微分恒等式の係数比較、Euler積の疎な展開を使い分け、必要次数の係数を求める。

母関数を立てた後、式の形から係数抽出法を選ぶ。F=xΦ(F)にはLagrange反転 [x^n]F=(1/n)[t^(n−1)]Φ(t)^nを使う。Fの定数項は0、Φの定数項は可逆として一意な形式的解を扱い、法上ではnで割れる範囲を確認する。

ABC222 Hでは反転後にP(x)^m、P=1+3x+x²、m=2Nの係数u_kを求める。P U′=m P′ Uの係数比較から k u_k=3(m+1−k)u_(k−1)+(2m+2−k)u_(k−2)。u_0=1、負添字は0とし、答えはu_(N−1)/N。反転で求める係数を変える工程と、微分で係数漸化式を得る工程を分ける。

ABC230 Hでは対数微分から係数再帰を得た後、その畳み込みをオンラインに計算する。係数漸化式の導出と、既に得た漸化式の高速評価は別の技能である。

ABC279 ExではEulerの五角数定理 ∏_{i≥1}(1−x^i)=1+Σ_{t≥1}(−1)^t(x^{t(3t−1)/2}+x^{t(3t+1)/2})を使う。必要次数d以下にはO(√d)項しかない。有限積を延長するときは追加因子の最小次数がdを超えることを確認する。各項に掛ける巨大引数の二項係数は、組合せ係数の節のLucasの定理へ接続する。

### 習得する技能

- 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。
- Eulerの五角数定理により∏(1−x^i)を符号付きの疎な係数列へ展開し、必要次数までのO(√N)項で係数抽出できる。
- F=xΦ(F)からLagrange反転 [x^n]F=[t^(n−1)]Φ(t)^n/nを導き、形式的条件と法上の除算可能性を確認して係数問題へ変換できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、母関数方程式・高度な係数抽出の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC279 Ex「Sum of Prod of Min」](https://atcoder.jp/contests/abc279/tasks/abc279_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)。既習技能: 素数pのもとでn,kをp進展開し、Lucasの定理 C(n,k)=∏C(n_i,k_i) mod pで、n≥pでも階乗の零除算を避けて計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。
2. [ABC222 H「Beautiful Binary Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。
3. [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC222 H 公式解説](https://atcoder.jp/contests/abc222/editorial/2742)
- [ABC222 H 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC279 H 公式解説](https://atcoder.jp/contests/abc279/editorial/5290)
- [ABC279 H 公式問題文](https://atcoder.jp/contests/abc279/tasks/abc279_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-generating-function-coefficients`
