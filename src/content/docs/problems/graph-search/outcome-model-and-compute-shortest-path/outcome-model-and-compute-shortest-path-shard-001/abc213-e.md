---
title: "ABC213-E — Stronger Takahashi"
draft: true
authoringUnit: {"problemId":"abc213-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc213-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc213-e-problem-624292782f4c8b364f18dc594853524d1d33202469ad5e99cae8bafb8fdb49cf","source-abc213-editorial-2397-60e8361c70415c0dfa7bed299c0772eb609d9a5146949cc6a4184e0d40204db0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"一回のパンチで到達できる範囲への重み1辺は、その場でパンチを使えば実現できる。逆に実操作では、選んだ2×2領域を初めて使う直前までパンチを遅らせられる。その領域を抜けるまでの移動は、パンチ地点から重み1辺でまとめて表せ、元から通路の移動は重み0辺で表せる。既に壊した壁の上を歩く区間も同じ一回のパンチ辺に含められるため、どの実操作列も同数以下の重みを持つgraph walkへ写る。従ってgraph最短距離と最小パンチ数が一致し、0-1 BFSが答えを返す。","sourceRevisionIds":["source-abc213-e-problem-624292782f4c8b364f18dc594853524d1d33202469ad5e99cae8bafb8fdb49cf","source-abc213-editorial-2397-60e8361c70415c0dfa7bed299c0772eb609d9a5146949cc6a4184e0d40204db0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

元から通路への上下左右移動を0-cost edgeにする。壁を壊す一回の操作では、現在地に隣接する2×2領域の和集合へ進めるので、その到着候補にcost1 edgeを張る。この範囲は相対座標が|dr|,|dc|≤2かつmin(|dr|,|dc|)≤1のマスで、元の壁か通路かを問わない。

破壊した壁集合を状態に加えず、この固定0/1 graphを0-1 BFSで探索する。cost0はdequeの前、cost1は後ろへ追加し、SからTまでの最小費用を求める。

## 典型の発動条件

### 0-1 BFS

発動条件: グラフの辺重みが 0 と 1 だけで、頂点までの最小費用を求めるとき。

無料の徒歩移動を deque の前、有料のパンチ移動を後ろへ追加して最小パンチ数を更新する。

### 操作履歴の辺への圧縮

発動条件: 環境を変更する操作があるが、必要になる直前へ遅延しても最適性が失われないとき。

破壊済み壁集合を持たず、パンチ一回後に到達できる一定範囲のマスへ重み 1 の辺を張る。

## 問題固有の要素

2×2 のパンチ領域を現在位置に隣接させて選べば、一回のパンチで 5×5 近傍の四隅を除く範囲へ移れる。

別の問題へ持ち帰る視点: 局所的な破壊操作では、操作領域そのものより「現在地から一操作後に到達できる位置集合」を列挙すると状態を減らせる。

## 正当性

一回のパンチで到達できる範囲への重み1辺は、その場でパンチを使えば実現できる。逆に実操作では、選んだ2×2領域を初めて使う直前までパンチを遅らせられる。その領域を抜けるまでの移動は、パンチ地点から重み1辺でまとめて表せ、元から通路の移動は重み0辺で表せる。既に壊した壁の上を歩く区間も同じ一回のパンチ辺に含められるため、どの実操作列も同数以下の重みを持つgraph walkへ写る。従ってgraph最短距離と最小パンチ数が一致し、0-1 BFSが答えを返す。

## 実装上の注意

- パンチ候補は縦横差がともに 2 以下の範囲から四隅を除き、各候補について盤外かだけを確認する。
- 徒歩の重み 0 辺は到着先が通路の場合だけ張り、パンチの重み 1 辺では元の壁判定を条件にしない。

## 復習の核

- 破壊状態が指数的に見えたら、破壊を必要になる瞬間まで延期できるかを検討し、位置だけの状態へ戻せないか考える。
- パンチ範囲の図を単に暗記せず、現在地に隣接する各 2×2 領域から到達可能な相対位置の和集合として復元する。

## 計算量と制約

### 時間

H×W、定数個の0/1隣接transition。01-BFS O(HW)。

### 空間

盤面、dist、deque O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H,W \leq 500; H and W are integers.; S_{i,j} is . or #.; S_{1,1} and S_{H,W} are ..

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/tasks/abc213_e) — source-abc213-e-problem-624292782f4c8b364f18dc594853524d1d33202469ad5e99cae8bafb8fdb49cf
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/editorial/2397) — source-abc213-editorial-2397-60e8361c70415c0dfa7bed299c0772eb609d9a5146949cc6a4184e0d40204db0
