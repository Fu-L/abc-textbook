---
title: "格子点転置によるfloor_sum"
description: "「格子点転置によるfloor_sum」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 173
---

# 格子点転置によるfloor_sum

習得対象の目安: **黄色（2000–2399）**。床和を格子点数へ写し、傾きと法の交換からEuclid型の再帰を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 格子点転置によるfloor_sum

一次式の床和を格子点数とみなし、整数部分の取り出しと領域の転置でEuclid互除法型に再帰する。商一定区間の列挙とは異なり、傾きと法の交換が計算量を決める。

標準の床和F(n,m,a,b)=Σ_{i=0}^{n−1}floor((ai+b)/m)を、格子点数を保つ引数変換から導く。ABC443 Gは標準式の利用、ABC283 Exはbitごとの指示値への分解、ABC402 Gは床和の一般化を練習する問題である。以下では同じFを再利用する式を比較する。

定義: n≥0,m>0。a=qm+a′,b=rm+b′（0≤a′,b′<m）と分け、F=q·n(n−1)/2+rn+F(n,m,a′,b′)。負の係数でもfloor除算で非負剰余を取れば同じ式。

転置: 正規化後a>0としてy=floor((an+b)/m),c=(an+b) mod m。Fは0≤i<nかつ1≤j、mj≤ai+bの格子点数。iをn−1−iに反転し、jをy−tと書くと各t=0,…,y−1で許されるiの数はfloor((mt+c)/a)。従ってF(n,m,a,b)=F(y,a,m,c)。

終了と計算量: a=0なら正規化後の和は0。y=0でも0。転置後の法はa<mとなり、次の係数正規化でm mod aが現れる。Euclid互除法と同じ引数減少なので反復はO(log m)。

ABC283 Exでは対象列v=b+Miのbit kの指示値がfloor((v+2^k)/2^{k+1})−floor(v/2^{k+1})。この二つのFを計算し、bitごとの寄与を足す。

### 習得する技能

- Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

一次式の床和を格子点数とみなし、整数部分の取り出しと領域の転置でEuclid互除法型に再帰する。商一定区間の列挙とは異なり、傾きと法の交換が計算量を決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC443 G「Another Mod of Linear Problem」](https://atcoder.jp/contests/abc443/tasks/abc443_g) — 主題: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。
- [ABC402 G「Sum of Prod of Mod of Linear」](https://atcoder.jp/contests/abc402/tasks/abc402_g) — 主題: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。
- [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h) — 主題: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。
- [ABC372 G「Ax + By < C」](https://atcoder.jp/contests/abc372/tasks/abc372_g) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)（一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。）。既習技能: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。

## 根拠

- [ABC283 H 公式解説](https://atcoder.jp/contests/abc283/editorial/5432)
- [ABC283 H 公式問題文](https://atcoder.jp/contests/abc283/tasks/abc283_h)
- [ABC313 G 公式解説](https://atcoder.jp/contests/abc313/editorial/6896)
- [ABC313 G 公式問題文](https://atcoder.jp/contests/abc313/tasks/abc313_g)
- [ABC372 G 公式解説](https://atcoder.jp/contests/abc372/editorial/10973)
- [ABC372 G 公式問題文](https://atcoder.jp/contests/abc372/tasks/abc372_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `33e4c8113deec1ccee9b61a9379e197530cbd5a6fb918e3b477bf71e2a2003da` / LearningUnit `unit-euclidean-floor-sum`
