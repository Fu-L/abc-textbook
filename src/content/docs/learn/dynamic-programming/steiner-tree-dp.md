---
title: "Steiner tree subset DP"
description: "「Steiner tree subset DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 82
---

# Steiner tree subset DP

習得対象の目安: **橙色（2400–2799）**。terminal集合の分割と多始点最短路を交互に使い、部分解の合成を正当化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Steiner tree subset DP

terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。

### 習得する技能

- terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

端子集合Sをつなぎ、根位置vで終わる最小費用dp[S][v]を持つ。同じvで集合を二分して合成し、その後最短路で根位置を動かす。


非負辺重みの無向graphで端子t_0,…,t_{k−1}をつなぐ。dp[∅][v]=0、singletonはその端子だけ0、他∞から始める。非空maskを要素数昇順に処理し、全非空proper submask Aについて `base[v]=min(base[v],dp[A][v]+dp[mask\A][v])`。そのbaseを全vの初期距離として多始点Dijkstraし、結果をdp[mask][v]にする。singletonもこの最短路緩和を行う。

任意の端子木を根vから見ると、最初の分岐または端子で端子集合を二つに分け、そこまでのpathを外へ付ける形に分解できる。逆に二木のunionと追加pathは端子をつなぎ、重複辺は非負なので除いて費用を下げられる。両方向から最適値が一致する。答えはmin_v dp[全mask][v]。merge元と最短路親を記録すれば辺集合を復元し、重複辺を一つへまとめられる。

## 成立条件と計算量

k端子・V頂点E辺なら典型的にO(3^k V+2^k(E+V) log V)。非負重みを仮定する最短路部分と集合合成を区別する。端子重複、単点集合の初期値、同じ集合の根移動を一巡で共有する。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[最短路モデル](/learn/graph/weighted-shortest-path/)（後の章）。

このUnitを直接前提とする単元: なし。

最短路モデル・部分集合・bitmask状態DPで得た考え方と実装を再利用し、Steiner tree subset DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)（terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)（terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC364 G 公式解説](https://atcoder.jp/contests/abc364/editorial/10547)
- [ABC364 G 公式問題文](https://atcoder.jp/contests/abc364/tasks/abc364_g)
- [ABC395 G 公式解説](https://atcoder.jp/contests/abc395/editorial/12307)
- [ABC395 G 公式問題文](https://atcoder.jp/contests/abc395/tasks/abc395_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-steiner-tree-dp`
