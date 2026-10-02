---
title: "FPS合成・power projection"
description: "「FPS合成・power projection」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 214
---

# FPS合成・power projection

習得対象の目安: **赤色（2800以上）**。FPS合成と転置の対応を理解し、block分割や有理関数への還元を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### FPS合成・power projection

多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。

### 習得する技能

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

精度をx^{N+1}未満とし、g(0)=0を仮定する。gを固定して `A_{j,k}=[x^j]g(x)^k`（0≤j,k≤N）と置く。fの係数ベクトルへAを掛けると `Σ_k A_{j,k}f_k=[x^j]f(g(x))`、重みwへAᵀを掛けると `q_k=Σ_j w_j[x^j]g(x)^k` となる。後者がpower projectionである。

### 有理関数の係数抽出へ移す

`h(x)=Σ_{j=0}^N w_j x^{N-j}` と置くと `q_k=[x^N](h(x)g(x)^k)`。したがって求める列の生成関数は `Σ_{k≥0}q_k y^k=[x^N]h(x)/(1-yg(x))` である。g(0)=0なのでk>Nでは係数が0になり、無限和も有限精度で扱える。

[Bostan–Mori](/learn/combinatorics-algebra/bostan-mori/)の係数抽出を、係数環がyの多項式である場合へ拡張する。初期値 `P(x,y)=h(x), Q(x,y)=1-yg(x), n=N` から次を繰り返す。

1. `R(x,y)=Q(-x,y)` を作り、`U=PR, V=QR` を計算する。Vはxの偶数次数だけを持つ。
2. nの偶奇をεとし、`P_new(x,y)=Σ_{i≥0}[x^{2i+ε}]U · x^i`、`Q_new(x,y)=Σ_{i≥0}[x^{2i}]V · x^i` とする。
3. `n←floor(n/2)` として、P,Qのx次数をn以下へ切り詰める。y次数もN以下へ切り詰めてよい。

`P/Q=PR/(QR)` で分母がxについて偶数になるため、欲しい係数の偶奇だけを残してx添字を半分にできる。n=0で `P(0,y)/Q(0,y) mod y^{N+1}` を返す。これが全q_kを格納する列である。

### 転置して合成を得る

上の算法でQ,Rはgだけから決まる。hに依存するPの処理は、固定Rとの積、係数の抽出・切詰め、最後の固定級数による乗算という線形操作である。これらを逆順に転置すればAの作用、すなわち合成が得られる。

具体的には、偶奇抽出 `u_i←v_{2i+ε}` の転置は、0で初期化した配列の `v_{2i+ε}←u_i` という散布。固定列rとの積 `u_k=Σ_i v_i r_{k-i}` の転置は `v_i=Σ_k u_k r_{k-i}` という相互相関で、rを反転して畳み込める。切詰めの転置は0埋め、入力hの反転の転置も反転である。一般の基本更新 `u←u+αv` は `v←v+αu` に転置する。逆演算としてαで割る操作ではない。

合成を実装するときは、gから各段のRと次数を保存し、最後のy方向の乗算を転置してから、散布と相互相関を段の逆順に行い、最後にx係数を反転する。g自身は固定係数なので、その分母更新へ入力の重みを流してはいけない。

## 成立条件と計算量

段tではx次数がO(N/2^t)、y次数がO(2^t)。長方形配列の面積はO(N)で、積の一時配列も定数倍の面積になる。二変数積は、y方向のstrideを積のy次数より大きくして一次元へ埋め込むなど、O(N log N)の畳み込みで計算できる。O(log N)段なのでpower projectionも転置した合成もO(N log² N)時間。各段を保存する素直な合成実装の空間はO(N log N)である。

g(0)≠0では、一般の無限FPSの合成は有限精度の入力だけで定まらない。fが有限多項式なら別途Taylor shiftで定数項を処理する。高速積に使う法とNTT長、最終除算の定数項の可逆性も確認する。この還元と転置の対応は[ABC387 G公式解説](https://atcoder.jp/contests/abc387/editorial/11727)を参照できる。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)。

このUnitを直接前提とする単元: なし。

形式的べき級数の基本演算で得た考え方と実装を再利用し、FPS合成・power projectionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC387 G 公式解説](https://atcoder.jp/contests/abc387/editorial/11727)
- [ABC387 G 公式問題文](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G 公式解説](https://atcoder.jp/contests/abc439/editorial/14995)
- [ABC439 G 公式問題文](https://atcoder.jp/contests/abc439/tasks/abc439_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-fps-composition-power-projection`
