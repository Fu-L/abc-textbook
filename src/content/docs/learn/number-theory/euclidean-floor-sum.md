---
title: "格子点転置によるfloor_sum"
description: "「格子点転置によるfloor_sum」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 174
---

# 格子点転置によるfloor_sum

難度の目安: **応用**。段階の説明は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 格子点転置によるfloor_sum

一次式の床和を格子点数とみなし、整数部分の取り出しと領域の転置でEuclid互除法型に再帰する。商一定区間の列挙とは異なり、傾きと法の交換が計算量を決める。

標準の床和F(n,m,a,b)=Σ_{i=0}^{n−1}floor((ai+b)/m)を、格子点数を保つ引数変換から導く。ABC443 Gは標準式の利用、ABC283 Exはbitごとの指示値への分解、ABC402 Gは床和の一般化を練習する問題である。以下では同じFを再利用する式を比較する。

定義: n≥0,m>0。a=qm+a′,b=rm+b′（0≤a′,b′<m）と分け、F=q·n(n−1)/2+rn+F(n,m,a′,b′)。負の係数でもfloor除算で非負剰余を取れば同じ式。

転置: 正規化後a>0としてy=floor((an+b)/m),c=(an+b) mod m。Fは0≤i<nかつ1≤j、mj≤ai+bの格子点数。iをn−1−iに反転し、jをy−tと書くと各t=0,…,y−1で許されるiの数はfloor((mt+c)/a)。従ってF(n,m,a,b)=F(y,a,m,c)。

終了と計算量: a=0なら正規化後の和は0。y=0でも0。転置後の法はa<mとなり、次の係数正規化でm mod aが現れる。Euclid互除法と同じ引数減少なので反復はO(log m)。

ABC283 Exでは対象列v=b+Miのbit kの指示値がfloor((v+2^k)/2^{k+1})−floor(v/2^{k+1})。この二つのFを計算し、bitごとの寄与を足す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一次式の床和を格子点数とみなし、整数部分の取り出しと領域の転置でEuclid互除法型に再帰する。商一定区間の列挙とは異なり、傾きと法の交換が計算量を決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

1. [ABC443 G「Another Mod of Linear Problem」](https://atcoder.jp/contests/abc443/tasks/abc443_g)
2. [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g)
3. [ABC402 G「Sum of Prod of Mod of Linear」](https://atcoder.jp/contests/abc402/tasks/abc402_g)
4. [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g)

## 根拠

- [ABC283 H 公式解説](https://atcoder.jp/contests/abc283/editorial/5432)
- [ABC283 H 公式問題文](https://atcoder.jp/contests/abc283/tasks/abc283_h)
- [ABC313 G 公式解説](https://atcoder.jp/contests/abc313/editorial/6896)
- [ABC313 G 公式問題文](https://atcoder.jp/contests/abc313/tasks/abc313_g)
- [ABC372 G 公式解説](https://atcoder.jp/contests/abc372/editorial/10973)
- [ABC372 G 公式問題文](https://atcoder.jp/contests/abc372/tasks/abc372_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-euclidean-floor-sum`
