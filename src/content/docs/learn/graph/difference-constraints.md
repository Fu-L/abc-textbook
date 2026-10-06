---
title: "difference constraints・不等式系の最短路化"
description: "「difference constraints・不等式系の最短路化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 99
---

# difference constraints・不等式系の最短路化

習得対象の目安: **青色（1600–1999）**。不等式を辺へ変換し、負閉路と可解性・最適なpotentialの関係を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### difference constraints・不等式系の最短路化

差の上界 x_v-x_u≤c を有向辺 u→v の重みcへ写し、Bellman–Ford等の緩和と負閉路から可解性・極値・具体解を求める。

### 習得する技能

- 差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。

## 考え方

x_v−x_u≤wを辺u→vの費用wへ写す。距離の三角不等式が制約を満たすので、最短距離をポテンシャルとして解を構成できる。負閉路の辺の制約を足すと0<0の矛盾になる。


全頂点の初期値を0にし、全辺の `x_v←min(x_v,x_u+c)` をBellman–Fordで反復すれば、仮想始点からの0辺を明示的に作らず同じ判定になる。V回目にも更新があれば負閉路で不可能、更新が止まれば全不等式を満たす具体解xになる。

実行可能な系で基準x_s=0からx_tの最大値を求める場合は、s→tの任意のpathの制約和からx_t≤path費用。従って到達可能なら最大値は最短距離d(s,t)である。この値は達成できる。到達可能集合には距離を置き、到達不能集合には全系の一実行可能解を十分大きく平行移動すればよい。到達可能集合から外へ出る辺はなく、外からの辺の上界はこの移動で緩む。tへ届かなければ、到達不能集合を任意に大きく動かせるので上へ非有界。最小値は逆にt→sの距離から−d(t,s)、到達不能なら下へ非有界となる。単なる実行可能解の一成分値を極値とは呼ばない。

## 成立条件と計算量

super sourceから全頂点へ0辺を張れば全成分を検査でき、Bellman–FordでO(VE)。等式は二本の不等式へ分ける。実行可能解と目的関数の最適化は別で、自由な平行移動の扱いも確認する。

概念上の親: [重み付き最短路・経路復元・差分制約](/learn/graph/shortest-path-certificates/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最短路の緩和と負閉路を理解した後、差の不等式を辺へ写して制約系の可解性・極値・具体解を同じ不変条件で求める。

### このUnitでは扱わないもの

- difference constraints・不等式系の最短路化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)（差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)（差の不等式をconstraint graphへ変換し、緩和と負閉路判定により可解性・極値・具体解を求められる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC404 G 公式解説](https://atcoder.jp/contests/abc404/editorial/12867)
- [ABC404 G 公式問題文](https://atcoder.jp/contests/abc404/tasks/abc404_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-difference-constraints`
