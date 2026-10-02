---
title: "lowlinkで橋・関節点を特定する"
description: "「lowlinkで橋・関節点を特定する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 110
---

# lowlinkで橋・関節点を特定する

習得対象の目安: **青色（1600–1999）**。DFS木と後退辺を区別し、lowlinkの不変量から橋・関節点を判定する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### lowlinkによる橋・関節点の検出

DFS木の到達時刻とlowlink値から、除去で連結性が変わる辺・頂点を特定する。

### 習得する技能

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

## 考え方

### tinとlowの更新

無向graphの各辺にIDを付け、全成分でDFS森を作る。tin[v]はvへ初めて入った時刻で、時刻は全探索を通して一つずつ増やす。low[v]は、vからDFS木を下り、その後高々一本の非木辺を通って到達できる頂点のtinの最小値とする。木を下らない場合も含み、初期値は `low[v]=tin[v]` である。

vの各隣接辺(v,u)を見て、vへ入った親辺のIDだけは除く。uが未訪問ならDFSし、戻った後に `low[v]=min(low[v],low[u])`。訪問済みなら `low[v]=min(low[v],tin[u])` とする。無向DFSに異なる枝間の横断辺はなく、祖先への辺が迂回路を与える。既訪問の子孫への辺はtin[u]>tin[v]なので最小値を下げない。親頂点への別の平行辺は正しい迂回路なので飛ばさない。

### 橋と関節点の違い

木辺(v,u)が橋である条件は `low[u]>tin[v]`。u部分木からvまたはその祖先への別の辺がないので、この辺を除くと切れる。low[u]=tin[v]ならvへの別の辺で戻れて橋ではない。

非根vが関節点である条件は、DFS子uの少なくとも一つについて `low[u]≥tin[v]`。v自身を取り除くと、vへ戻るだけの辺も使えず、その子部分木が親側から切れる。どの子も厳密に古い祖先へ戻れれば、vを通らず全子部分木を親側へ接続できる。

DFS根には親側がないので条件が変わる。根が関節点であるのはDFS木の子が二つ以上のときだけ。子が一つなら根を消しても全残り頂点はその子部分木でつながる。子が二つなら両部分木の間に辺はない（あればDFSで同じ子へ入る）ため、根の除去で分離する。元から非連結なら各DFS根で同じ判定を行う。橋の辺ID・関節点の頂点IDを保存して、削除候補や縮約の入力へ戻す。

## 成立条件と計算量

各辺・頂点を定数回処理してO(V+E)時間・空間。自己loopはlowを下げず橋でもない。根の子数はgraph上の次数ではなくDFS木の子数である。橋の厳密不等号と非根関節点の広義不等号を区別する。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: なし。

DFS木を作れることを前提に、到達時刻とlowlink値から橋・関節点を判定する。

### このUnitでは扱わないもの

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 問題一覧

- [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。 両端からのDijkstraで距離を前計算し、d_s[u]+w(u,v)+d_t[v]=d_s[t]を満たす辺だけで最短路部分グラフを作る。そのグラフでlowlinkによる橋判定を学び、橋と全最短路に不可欠な辺を対応させる。元グラフの橋判定とは違う。正重みによる距離の増加を使って対応を証明する。
- [ABC334 G「Christmas Color Grid 2」](https://atcoder.jp/contests/abc334/tasks/abc334_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。追加で学ぶ技能: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC334 G 公式解説](https://atcoder.jp/contests/abc334/editorial/8980)
- [ABC334 G 公式問題文](https://atcoder.jp/contests/abc334/tasks/abc334_g)
- [ABC375 G 公式解説](https://atcoder.jp/contests/abc375/editorial/11133)
- [ABC375 G 公式問題文](https://atcoder.jp/contests/abc375/tasks/abc375_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-lowlink-critical-structure`
