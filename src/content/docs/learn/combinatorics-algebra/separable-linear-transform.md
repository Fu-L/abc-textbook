---
title: "分離可能線形変換・Walsh–Hadamard変換"
description: "「分離可能線形変換・Walsh–Hadamard変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 194
---

# 分離可能線形変換・Walsh–Hadamard変換

習得対象の目安: **黄色（2000–2399）**。各軸の小変換へ分離し、Walsh–Hadamard変換とXOR畳み込みを導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 分離可能線形変換・Walsh–Hadamard変換

Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。

### 習得する技能

- Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

## 考え方

N=2^B個の係数をB bitのmaskで添字付けする。各bitへ同じ2×2行列 `H=((1,1),(1,-1))` を作用させると、全体の変換はそのB個のKronecker積になる。巨大な密行列を作る必要はない。

### 各軸の更新と逆変換

bit b=0,…,B-1について、そのbitが0の各mask sを走査する。更新前の二値を `u=a[s], v=a[s|(1<<b)]` と保存し、同時に `(a[s],a[s|(1<<b)])=(u+v,u-v)` と置き換える。strideで書くなら幅2^bの二blockを一組とし、同じblock内offset同士を更新する。

全bitを処理した配列は `â[t]=Σ_s (-1)^{popcount(s&t)}a[s]` となる。各軸で、tのbitが0なら和、1なら差を選ぶためである。また `H²=2I` なので、同じ変換をもう一度行い、各要素をNで割れば元へ戻る。逆変換には2が可逆な係数環を使う。標数2ではこの行列は可逆にならない。

### XOR畳み込みが点ごとの積になる理由

`c[k]=Σ_{i xor j=k} a[i]b[j]` を求める。符号関数 `χ_t(s)=(-1)^{popcount(s&t)}` は `χ_t(i xor j)=χ_t(i)χ_t(j)` を満たす。よって `ĉ[t]=Σ_{i,j}a[i]b[j]χ_t(i xor j)=â[t]b̂[t]` となる。

a,bを変換し、同じ添字の要素を掛け、逆変換するという三段階で求められる。通常の多項式積が添字の加算を使うのに対し、こちらはXORを使うため、NTTと入れ替えてはいけない。

## 成立条件と計算量

各bitでN/2組を定数時間で更新するので、正変換・逆変換はO(NB)=O(N log N)、補助空間O(1)である。配列長は2冪へ0埋めする。逆変換の除算は法上ならNの逆元を掛ける。

一般の各軸幅bの密な小変換では、N/b本の長さbの列をO(b²)で変換するため、一軸O(Nb)、d軸O(Ndb)。異なる軸の操作は可換だが、添字の格納順と各軸の小行列は固定する。転置は小行列の転置、逆変換は小行列の逆行列であり、両者が同じとは限らない。

概念上の親: [線形方程式・基底・分離可能変換へ変換する](/learn/combinatorics-algebra/linear-algebra-xor/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

Kronecker積型の多次元変換を各軸の小変換へ分離し、XOR convolution等をpointwise積へ移す。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC288 G「3^N Minesweeper」](https://atcoder.jp/contests/abc288/tasks/abc288_g) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。
- [ABC212 H「Nim Counting」](https://atcoder.jp/contests/abc212/tasks/abc212_h) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。既習技能: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC367 G「Sum of (XOR^K or 0)」](https://atcoder.jp/contests/abc367/tasks/abc367_g) — 主題: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。既習技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。
- [ABC265 Ex「No-capture Lance Game」](https://atcoder.jp/contests/abc265/tasks/abc265_h) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [独立な数ゲームの和](/learn/dynamic-programming/conway-number-games/)（全ての後続局面が数で、左選択肢の全値が右選択肢の全値より小さいことを確認し、その間の最も単純な二進有理数を局面値とする。独立和は厳密な数の加算で評価する。一般のpartisan gameは数とは限らず、この規則を適用しない。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。） / [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。

## 根拠

- [ABC212 H 公式解説](https://atcoder.jp/contests/abc212/editorial/2359)
- [ABC212 H 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_h)
- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC265 H 公式解説](https://atcoder.jp/contests/abc265/editorial/4577)
- [ABC265 H 公式問題文](https://atcoder.jp/contests/abc265/tasks/abc265_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-separable-linear-transform`
