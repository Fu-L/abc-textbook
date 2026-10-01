---
title: "多項式の多点評価・補間"
description: "「多項式の多点評価・補間」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 207
---

# 多項式の多点評価・補間

習得対象の目安: **橙色（2400–2799）**。一般点の積木・剰余木と等比点のchirp-zを比較し、評価点の構造から変形と計算量を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 多項式の多点評価・補間

一般点ではproduct tree・remainder tree、等比点ではchirp-z変換を使い、評価点の構造に応じて多項式を一括評価する。

### 一般点：積木と剰余木

任意の点x_iについて葉をX−x_iとするproduct treeを作り、親の剰余を子の積で割った剰余へ送る。葉の定数がf(x_i)になる。次数nと点数mが同程度ならO(M(n) log n)、NTTを用いてO(n log² n)。評価点の規則性を仮定しない。ABC272 Exでは計数DPを評価値へ変換する前段の式も別に導く。

### 等比点：chirp-z変換

x_k=a r^kならf(x_k)=Σ_j c_j a^j r^{jk}。jk=C(j+k,2)−C(j,2)−C(k,2)を使い、c_j a^j r^{−C(j,2)}とr^{C(t,2)}の相関へ直す。係数列を反転して一回の畳み込みを行い、r^{−C(k,2)}を掛ければよい。r≠0なら平方根を導入せず任意の体で成立する。r=0は点aと0の直接評価へ分ける。計算量O(M(n+m))で、一般多点評価のlog因子を不要にする。

ABC381 Gでは、拡大体で数列を表す→等比的な因子積を倍化構築する→block始点で等比点評価する、という接続までを学ぶ。評価算法を知るだけで積の高速計算が終わるわけではない。拡大体の積は基礎体の複数の畳み込みへ分解する。

### 習得する技能

- 評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。
- 任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。

## 考え方

評価点x_iに対応するX−x_iの積木を作り、fを各部分木の積で割った剰余を下へ送る。葉では定数剰余がf(x_i)になる。

## 成立条件と計算量

次数と点数がN程度ならO(M(N) log N)。等比点にはchirp-zによるO(M(N))の方法があるが、比率が非零である条件を確認する。評価点重複は評価できても補間の一意性とは別である。

概念上の親: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)、[再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。

このUnitを直接前提とする単元: なし。

形式的べき級数の基本演算・再帰分割・分割統治で得た考え方と実装を再利用し、多項式の多点評価・補間の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。）。 畳み込みと等比点評価を前提に、拡大体で数列の一般項を指数の式へ変換する方法を学ぶ。周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。

## 根拠

- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-polynomial-multipoint-evaluation`
