---
title: "多項式の多点評価・補間"
description: "「多項式の多点評価・補間」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 206
---

# 多項式の多点評価・補間

習得対象の目安: **橙色（2400–2799）**。一般点の積木・剰余木と等比点のchirp-zを比較し、評価点の構造から変形と計算量を選ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第191単元。技能の説明を学んでから問題一覧へ進んでください。

前: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/) ／ 次: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)

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

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [FPS演算・多点評価・合成を行う](/learn/combinatorics-algebra/formal-power-series/)、[再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)。

形式的べき級数の基本演算・再帰分割・分割統治で得た考え方と実装を再利用し、多項式の多点評価・補間の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。 拡大体・畳み込み・等比点評価を既習として接続する。拡大体で数列の一般項を指数の式へ変換し、周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。
2. [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 根拠

- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-polynomial-multipoint-evaluation`
