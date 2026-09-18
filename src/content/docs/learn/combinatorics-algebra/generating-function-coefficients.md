---
title: "母関数方程式・高度な係数抽出"
description: "「母関数方程式・高度な係数抽出」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 208
---

# 母関数方程式・高度な係数抽出

難度の目安: **専門**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 母関数方程式・高度な係数抽出

暗黙方程式の反転、微分恒等式の係数比較、Euler積の疎な展開を使い分け、必要次数の係数を求める。

母関数を立てた後、式の形から係数抽出法を選ぶ。F=xΦ(F)にはLagrange反転 [x^n]F=(1/n)[t^(n−1)]Φ(t)^nを使う。Fの定数項は0、Φの定数項は可逆として一意な形式的解を扱い、法上ではnで割れる範囲を確認する。

ABC222 Hでは反転後にP(x)^m、P=1+3x+x²、m=2Nの係数u_kを求める。P U′=m P′ Uの係数比較から k u_k=3(m+1−k)u_(k−1)+(2m+2−k)u_(k−2)。u_0=1、負添字は0とし、答えはu_(N−1)/N。反転で求める係数を変える工程と、微分で係数漸化式を得る工程を分ける。

ABC230 Hでは対数微分から係数再帰を得た後、その畳み込みをオンラインに計算する。係数漸化式の導出と、既に得た漸化式の高速評価は別の技能である。

ABC279 ExではEulerの五角数定理 ∏_{i≥1}(1−x^i)=1+Σ_{t≥1}(−1)^t(x^{t(3t−1)/2}+x^{t(3t+1)/2})を使う。必要次数d以下にはO(√d)項しかない。有限積を延長するときは追加因子の最小次数がdを超えることを確認する。各項に掛ける巨大引数の二項係数は、組合せ係数の節のLucasの定理へ接続する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、母関数方程式・高度な係数抽出の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC222 H「Beautiful Binary Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_h)
2. [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h)
3. [ABC279 Ex「Sum of Prod of Min」](https://atcoder.jp/contests/abc279/tasks/abc279_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC222 H 公式解説](https://atcoder.jp/contests/abc222/editorial/2742)
- [ABC222 H 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC279 H 公式解説](https://atcoder.jp/contests/abc279/editorial/5290)
- [ABC279 H 公式問題文](https://atcoder.jp/contests/abc279/tasks/abc279_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-generating-function-coefficients`
