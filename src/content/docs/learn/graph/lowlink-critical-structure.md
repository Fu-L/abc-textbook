---
title: "lowlinkで橋・関節点を特定する"
description: "「lowlinkで橋・関節点を特定する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 108
---

# lowlinkで橋・関節点を特定する

習得対象の目安: **青色（1600–1999）**。DFS木と後退辺を区別し、lowlinkの不変量から橋・関節点を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### lowlinkによる橋・関節点の検出

DFS木の到達時刻とlowlink値から、除去で連結性が変わる辺・頂点を特定する。

### 習得する技能

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: なし。

DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。

### このUnitでは扱わないもの

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 問題一覧

- [ABC334 G「Christmas Color Grid 2」](https://atcoder.jp/contests/abc334/tasks/abc334_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。
- [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。 両端からのDijkstraで距離を前計算し、d_s[u]+w(u,v)+d_t[v]=d_s[t]を満たす辺だけで最短路部分グラフを作る。そのグラフでlowlinkによる橋判定を学び、橋と全最短路に不可欠な辺を対応させる。元グラフの橋判定とは違う。正重みによる距離の増加を使って対応を証明する。
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。追加で学ぶ技能: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC334 G 公式解説](https://atcoder.jp/contests/abc334/editorial/8980)
- [ABC334 G 公式問題文](https://atcoder.jp/contests/abc334/tasks/abc334_g)
- [ABC375 G 公式解説](https://atcoder.jp/contests/abc375/editorial/11133)
- [ABC375 G 公式問題文](https://atcoder.jp/contests/abc375/tasks/abc375_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `7fd0d20393e1ee2f28bfe43444ff43159e5d8f980ff2ec7298a591ed3f297b32` / LearningUnit `unit-lowlink-critical-structure`
