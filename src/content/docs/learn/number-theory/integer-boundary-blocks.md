---
title: "整数境界と同値区間を正確に分ける"
description: "整数境界と同値区間を正確に分けるの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 49
---

# 整数境界と同値区間を正確に分ける

## 概要

### 整数境界・同値区間分割

floor値・整数根・表記桁数・圧縮block内の式が変わる整数境界を正確に分け、区間ごとに処理する。

商floor(N/i)が一定の区間をまとめる手法と、一次式の床和F(n,m,a,b)=Σ_{i=0}^{n−1}floor((ai+b)/m)をEuclid互除法型に計算する手法は別である。後者は次の引数変換を使う。

定義: n≥0,m>0。a=qm+a′,b=rm+b′（0≤a′,b′<m）と分け、F=q·n(n−1)/2+rn+F(n,m,a′,b′)。負の係数でもfloor除算で非負剰余を取れば同じ式。

転置: 正規化後a>0としてy=floor((an+b)/m),c=(an+b) mod m。Fは0≤i<nかつ1≤j、mj≤ai+bの格子点数。iをn−1−iに反転し、jをy−tと書くと各t=0,…,y−1で許されるiの数はfloor((mt+c)/a)。従ってF(n,m,a,b)=F(y,a,m,c)。

終了と計算量: a=0なら正規化後の和は0。y=0でも0。転置後の法はa<mとなり、次の係数正規化でm mod aが現れる。Euclid互除法と同じ引数減少なので反復はO(log m)。

ABC283 Exでは対象列v=b+Miのbit kの指示値がfloor((v+2^k)/2^{k+1})−floor(v/2^{k+1})。この二つのFを計算し、bitごとの寄与を足す。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。

- 素因数指数による整数条件の分解。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC253 G「Swap Many Times」](https://atcoder.jp/contests/abc253/tasks/abc253_g)
2. [ABC356 E「Max/Min」](https://atcoder.jp/contests/abc356/tasks/abc356_e)
3. [ABC402 G「Sum of Prod of Mod of Linear」](https://atcoder.jp/contests/abc402/tasks/abc402_g)
4. [ABC414 E「Count A%B=C」](https://atcoder.jp/contests/abc414/tasks/abc414_e)
5. [ABC443 G「Another Mod of Linear Problem」](https://atcoder.jp/contests/abc443/tasks/abc443_g)
6. [ABC230 E「Fraction Floor Sum」](https://atcoder.jp/contests/abc230/tasks/abc230_e)
7. [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f)
8. [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h)
9. [ABC452 E「You WILL Like Sigma Problem」](https://atcoder.jp/contests/abc452/tasks/abc452_e)
10. [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
11. [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g)
12. [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h)
13. [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g)
- [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g)
- [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g)
- [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f)
- [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g)
- [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g)
- [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f)

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC230 E 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_e)
- [ABC230 E 公式解説](https://atcoder.jp/contests/abc230/editorial/3015)
- [ABC239 H 公式解説](https://atcoder.jp/contests/abc239/editorial/3357)
- [ABC239 H 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-integer-boundary-blocks`
