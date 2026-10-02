---
title: "半環行列・min-plus/max-min遷移"
description: "「半環行列・min-plus/max-min遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 190
---

# 半環行列・min-plus/max-min遷移

習得対象の目安: **青色（1600–1999）**。行列の和と積を遷移の選択・連結に対応させ、min-plusなどへ一般化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 半環行列・min-plus/max-min遷移

遷移の結合と候補選択を半環の積・和として行列化し、結合則を使って固定長walkを二分累乗または区間積で処理する。

### 習得する技能

- 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。

## 考え方

遷移の合成を行列積で表すとき、候補の集約とpathの連結を二つの演算へ分ける。個数は加算・乗算、最短値はmin・加算など、半環に合う評価を選ぶ。


列ベクトルxを使い、A[v][u]をuからvへの一遷移の値として `(Ax)[v]=⊕_u A[v][u]⊗x[u]` と固定する。Aの後にBを適用する合成は `C[v][u]=⊕_w B[v][w]⊗A[w][u]`、すなわちC=BA。中間状態wで全候補を分けるので、K乗の(v,u)成分はちょうどK辺のwalkの集約になる。identityは対角に積の単位元1、他に和の単位元0を置く。

数え上げでは(⊕,⊗,0,1)=(+,×,0,1)、最短値では(min,+,+∞,0)、非負capacityの最大bottleneckでは(max,min,0,+∞)を使う。和は可換・結合的、積は結合的、積が和へ分配し、0が積で吸収される条件から行列積の結合則を導ける。開始sならx[s]=1、他は0としてA^Kxを戻す。固定長と高々K長は異なり、後者にするには待機遷移が意味を保つことなどを別に示す。

## 成立条件と計算量

d状態の密行列ではO(d³ log K)。零元・単位元・分配則を確認し、到達不能の∞に加算してoverflowさせない。行列の積の方向とベクトルの置き方を固定する。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)。

このUnitを直接前提とする単元: なし。

線形遷移・行列累乗で得た考え方と実装を再利用し、半環行列・min-plus/max-min遷移の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 半環行列・min-plus/max-min遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC445 F「Exactly K Steps 2」](https://atcoder.jp/contests/abc445/tasks/abc445_f) — 主題: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)（遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。）。
- [ABC236 G「Good Vertices」](https://atcoder.jp/contests/abc236/tasks/abc236_g) — 主題: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)（遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)（遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。）。
- [ABC456 F「Plan Holidays」](https://atcoder.jp/contests/abc456/tasks/abc456_f) — 主題: [SWAG・two-stack queue aggregation](/learn/query/swag/)（queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)（遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。）。

## 根拠

- [ABC236 G 公式解説](https://atcoder.jp/contests/abc236/editorial/3286)
- [ABC236 G 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_g)
- [ABC429 F 公式解説](https://atcoder.jp/contests/abc429/editorial/14274)
- [ABC429 F 公式問題文](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC445 F 公式解説](https://atcoder.jp/contests/abc445/editorial/15907)
- [ABC445 F 公式問題文](https://atcoder.jp/contests/abc445/tasks/abc445_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-semiring-matrix-exponentiation`
