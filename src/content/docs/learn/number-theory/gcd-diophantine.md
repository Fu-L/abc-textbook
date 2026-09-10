---
title: "gcdと整数解の成立条件"
description: "gcdと整数解の成立条件の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 19
---

# gcdと整数解の成立条件

## 概要

### Bézout等式・一次不定方程式

整数線形結合がgcdの倍数全体になることを使い、一次不定方程式の可解性と解のparameter表示を得る。

ABC340 Fの整数座標の三角形を例に、一次不定方程式へ帰着する。観察: 原点、(X,Y)、(A,B)の三角形の面積は|XB−YA|/2。面積1にはXB−YA=2または−2が必要で、符号反転で対応するから2を解けばよい。

可解性: g=gcd(|X|,|Y|)はXB−YAを割る。逆にgが2を割れば、拡張EuclidでXu+Yv=gを作り、B=2u/g,A=−2v/gとすれば解になる。ゼロ座標も扱い、両方0なら解なし。

一般解: 一解(A0,B0)からA=A0+(X/g)t、B=B0+(Y/g)t（tは整数）。二解の差の方程式と互いに素なX/g,Y/gから、これが全解だと示す。

確認: 元の外積に代入し、出力上限も確認する。符号付き入力には絶対値で求めた係数へ符号を戻す。EuclidはO(log max(|X|,|Y|))。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。

- 連分数・Stern–Brocotによる有理近似、および複数の合同類をCRTで統合する構成。

## 下位単元

- [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC340 F「S = 1」](https://atcoder.jp/contests/abc340/tasks/abc340_f)
2. [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g)
3. [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
4. [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC212 G「Power Pair」](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G「222」](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC248 G「GCD cost on the tree」](https://atcoder.jp/contests/abc248/tasks/abc248_g)
- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g)
- [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e)
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g)
- [ABC460 E「x + y ≡ x + y」](https://atcoder.jp/contests/abc460/tasks/abc460_e)

## 根拠

- [ABC212 G 公式解説](https://atcoder.jp/contests/abc212/editorial/2289)
- [ABC212 G 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_g)
- [ABC222 G 公式解説](https://atcoder.jp/contests/abc222/editorial/2750)
- [ABC222 G 公式問題文](https://atcoder.jp/contests/abc222/tasks/abc222_g)
- [ABC248 G 公式解説](https://atcoder.jp/contests/abc248/editorial/3795)
- [ABC248 G 公式問題文](https://atcoder.jp/contests/abc248/tasks/abc248_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-gcd-diophantine`
