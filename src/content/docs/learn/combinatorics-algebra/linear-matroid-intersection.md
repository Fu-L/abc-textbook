---
title: "線形matroid交差の乱択rank判定"
description: "「線形matroid交差の乱択rank判定」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 215
---

# 線形matroid交差の乱択rank判定

習得対象の目安: **赤色（2800以上）**。二つの線形表現から乱択行列を作り、rankと共通独立集合の大きさを対応させる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 線形matroid交差の乱択rank判定

二つの線形matroidの表現A₁,A₂からA₁diag(r)A₂ᵀを作り、有限体上の乱択rankを共通独立集合の最大sizeとして高確率で判定する。

### 習得する技能

- 二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。

## 考え方

二つの線形独立性条件を同時に満たす集合では、それぞれの列ベクトルを組み合わせた行列のrankを使う代数的な特徴付けがある。determinantの項が共通独立集合を表すことを示してから指紋評価を使う。


共通独立size kの列集合Sがあるなら、A₁のあるk行I、A₂のあるk行Jでdet A₁[I,S]とdet A₂[J,S]がともに非零となる。対応するintersection matrixのminorはCauchy–Binetにより `Σ_{|T|=k} det A₁[I,T]·det A₂[J,T]·∏_{e∈T}r_e`。Tごとに異なるsquare-free monomialなので、Sの非零係数が他項と相殺されず、このminorは非零多項式になる。

逆に共通独立size kが無ければ、全Tで少なくとも一方のdetが0だから全k-minorが恒等的に0。従って変数のままのrankが最大共通独立sizeに一致する。独立一様代入は恒等的0を非零にできず過大評価は起こらない。過小評価だけを非零最大minorの次数kと体サイズで界せる。

## 成立条件と計算量

行列の大きさに対する消去費用と、ランダム代入の多項式次数から誤判定率を評価する。rank一回だけで実際の最適集合まで復元できるとは限らない。一般のoracle matroid intersectionと前提を混同しない。

表現行列の列を同じ要素順に揃え、A₁ diag(r_e) A₂ᵀのrankを調べる。Cauchy–Binet展開で、共通独立なr列に対応するminorが非零多項式になる。体から独立一様に選んだr_eで真のrankを過小評価する確率は、そのminorの次数rに対して高々r/|F|。二表現の行数がr程度なら素朴な行列構築O(|E|r²)と消去O(r³)を合わせる。

概念上の親: [Matroidの独立性・greedy・線形交差](/learn/combinatorics-algebra/matroid-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)、[matroid greedy](/learn/combinatorics-algebra/matroid-greedy/)、[乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)。

このUnitを直接前提とする単元: なし。

matroidの独立性・交換公理、線形方程式のrank計算、乱択誤り評価を学んだ後、二つの線形matroidの共通独立rankを一枚の乱択行列へ圧縮する。

### このUnitでは扱わないもの

- 線形matroid交差の乱択rank判定の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)（二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC399 G 公式解説](https://atcoder.jp/contests/abc399/editorial/12546)
- [ABC399 G 公式問題文](https://atcoder.jp/contests/abc399/tasks/abc399_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-linear-matroid-intersection`
