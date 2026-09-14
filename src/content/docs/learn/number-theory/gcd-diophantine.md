---
title: "gcdと整数解の成立条件"
description: "「gcdと整数解の成立条件」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 20
---

# gcdと整数解の成立条件

## 概要

### Bézout等式・一次不定方程式

整数線形結合がgcdの倍数全体になることを使い、一次不定方程式の可解性と解のparameter表示を得る。

差や周期をgcdでまとめると整数解の必要条件が見える。ここでは一歩進め、Bézoutの等式からその条件が十分であることを示し、具体解と全解を構成する。gcd不変量の抽出とは数論章内の別の技能として学ぶ。

ABC340 Fの整数座標の三角形を例に、一次不定方程式へ帰着する。観察: 原点、(X,Y)、(A,B)の三角形の面積は|XB−YA|/2。面積1にはXB−YA=2または−2が必要で、符号反転で対応するから2を解けばよい。

可解性: g=gcd(|X|,|Y|)はXB−YAを割る。逆にgが2を割れば、拡張EuclidでXu+Yv=gを作り、B=2u/g,A=−2v/gとすれば解になる。ゼロ座標も扱い、両方0なら解なし。

一般解: 一解(A0,B0)からA=A0+(X/g)t、B=B0+(Y/g)t（tは整数）。二解の差の方程式と互いに素なX/g,Y/gから、これが全解だと示す。

確認: 元の外積に代入し、出力上限も確認する。符号付き入力には絶対値で求めた係数へ符号を戻す。EuclidはO(log max(|X|,|Y|))。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。

### このUnitでは扱わないもの

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC340 F「S = 1」](https://atcoder.jp/contests/abc340/tasks/abc340_f)
2. [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
- [ABC460 E「x + y ≡ x + y」](https://atcoder.jp/contests/abc460/tasks/abc460_e)

## 根拠

- [ABC271 H 公式解説](https://atcoder.jp/contests/abc271/editorial/4932)
- [ABC271 H 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC315 G 公式解説](https://atcoder.jp/contests/abc315/editorial/6994)
- [ABC315 G 公式問題文](https://atcoder.jp/contests/abc315/tasks/abc315_g)
- [ABC340 F 公式解説](https://atcoder.jp/contests/abc340/editorial/9250)
- [ABC340 F 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-gcd-diophantine`
