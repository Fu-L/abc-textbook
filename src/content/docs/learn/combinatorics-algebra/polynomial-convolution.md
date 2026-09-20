---
title: "NTT・FFTで畳み込みと相互相関を求める"
description: "「NTT・FFTで畳み込みと相互相関を求める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 202
---

# NTT・FFTで畳み込みと相互相関を求める

習得対象の目安: **黄色（2000–2399）**。係数積和へ還元し、NTT・FFTの法・長さ・次数の条件を理解して利用する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 畳み込み・相互相関

係数積和または反転列とのcorrelationを多項式積へ写し、必要な次数範囲をNTT/FFTで計算する。

ABC291 Gの巡回shiftごとのbitwise ORの総和を考える。観察: a_i,b_iをそのbitが0である指示変数とする。shift sでORが0の個数はR_s=Σ_{i=0}^{N-1}a_{(i+s) mod N}b_i。全shiftを直接計算するとO(N²)。

変換: aを2周並べてu、bを反転してv_j=b_{N-1-j}とする。多項式U(x)V(x)の係数c_tはΣ_{p+q=t}u_pv_q。t=N-1+sならp=i+s,q=N-1-iとなり、c_{N-1+s}=R_sを得る。

出力: 各bitの寄与は2^bit·(N-R_s)。5 bitの寄与をshiftごとに足してから最大化する。bitごとに最適shiftを選ぶことはできない。

計算量と境界: 5回の通常畳み込みでO(N log N)。各係数はN以下なので法998244353で正確に復元できる。N=1とs=N-1で反転位置と参照係数を手計算する。

ABC265 Exは通常の畳み込みだけの導入には用いない。Conwayの数ゲーム、Grundy数、XOR畳み込みを学んだ後に、整数和とXORという異なる合成則を同時に保持する複合問題として取り組む。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

係数積和を多項式積へ写し、NTT・FFTで畳み込みや反転した列との相互相関を高速に求める。

### このUnitでは扱わないもの

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 下位単元

- [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/) — 橙色
- [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/) — 橙色

## 問題一覧

1. [ABC291 G「OR Sum」](https://atcoder.jp/contests/abc291/tasks/abc291_g)
2. [ABC307 Ex「Marquee」](https://atcoder.jp/contests/abc307/tasks/abc307_h)
3. [ABC278 Ex「make 1」](https://atcoder.jp/contests/abc278/tasks/abc278_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC235 Ex「Painting Weighted Graph」](https://atcoder.jp/contests/abc235/tasks/abc235_h)
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h)
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h)
- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h)
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h)
- [ABC303 Ex「Constrained Tree Degree」](https://atcoder.jp/contests/abc303/tasks/abc303_h)
- [ABC309 Ex「Simple Path Counting Problem」](https://atcoder.jp/contests/abc309/tasks/abc309_h)
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h)
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g)
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g)
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g)
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g)
- [ABC392 G「Fine Triplets」](https://atcoder.jp/contests/abc392/tasks/abc392_g)
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g)
- [ABC422 G「Balls and Boxes」](https://atcoder.jp/contests/abc422/tasks/abc422_g)
- [ABC432 G「Sum of Binom(A, B)」](https://atcoder.jp/contests/abc432/tasks/abc432_g)
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g)
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)

## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC235 H 公式解説](https://atcoder.jp/contests/abc235/editorial/3250)
- [ABC235 H 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-polynomial-convolution`
