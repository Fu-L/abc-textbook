---
title: "ABC395-E — Flip Edge"
draft: true
authoringUnit: {"problemId":"abc395-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc395-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc395-e-problem-402e6ff6530462ac78b572a07feba8ec267525d08b57b227f3b6f2a8b1a8b4c1","source-abc395-editorial-12343-9640f20e4e80dbab11d63e9d138eb9d07c59938d706e16cad9cac9c5981f93f1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"反転偶奇が辺方向を完全に決める。合法操作と二層pathは移動cost1、反転costXを保って相互変換できるため二終点状態の最小距離が答え。非負costなのでDijkstraで確定可能。","sourceRevisionIds":["source-abc395-e-problem-402e6ff6530462ac78b572a07feba8ec267525d08b57b227f3b6f2a8b1a8b4c1","source-abc395-editorial-12343-9640f20e4e80dbab11d63e9d138eb9d07c59938d706e16cad9cac9c5981f93f1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

全edge反転操作で必要なのは反転回数そのものでなく偶奇だけで、偶数回なら元向き、奇数回なら逆向きである。(現在頂点,反転parity)をstateにすれば、移動cost1とparity切替costXはいずれも通常の有向edgeになる。元edgeu→vはparity0でu→v、parity1でv→uとして二layerへ張る。各頂点vでlayer間をcostXの双方向edgeで結べば、任意時点の全edge反転を表せる。

採用する候補: 元/反転の二layer graphを構築してDijkstra法を行う

全操作列とlayer graph上のpathがcostを保って一対一対応し、2N頂点・2M+2N辺の非負最短路として解ける。

棄却する候補: 反転回数を固定して元graph/逆graphの到達性を交互に探索する

移動と反転の最適な挿入位置を別々に列挙する必要があり、同じstateを重複探索する。

2N state graphを作り、(1,0)からDijkstraする。移動edgeはcost1、(v,0)↔(v,1)はcostXとし、min(dist[N,0],dist[N,1])を出力する。

## 典型の発動条件

### 状態拡張最短路

発動条件: global modeが少数状態で、操作により切り替わるとき。

頂点×反転parityをgraph stateにする。

### layered graph

発動条件: mode別に利用可能edge方向が変わるとき。

各mode内edgeとmode切替edgeを分ける。

## 問題固有の要素

全graphへ作用する操作でも、その効果が反転偶奇だけならglobal履歴を一bitのpath stateへ閉じ込められる。

別の問題へ持ち帰る視点: 操作回数のmod小数だけが将来の遷移を決めるなら、頂点との直積graphを作る。

## 正当性

反転偶奇が辺方向を完全に決める。合法操作と二層pathは移動cost1、反転costXを保って相互変換できるため二終点状態の最小距離が答え。非負costなのでDijkstraで確定可能。

## 実装上の注意

- answerは両parityのN stateのminを取る。距離はXとpath長の和なので64 bitで持ち、元edgeの逆layer方向を取り違えない。

## 復習の核

- Xが非常に小さい/大きい、反転を連続二回するpath、逆向きedgeだけで到達する小graphを操作列全探索と比較する。

## 計算量と制約

### 時間

N 頂点、M 有向辺。2N状態Dijkstra O((N+M)log N)。

### 空間

二層graphと距離 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq X \leq 10^9; 1 \leq u _ i \leq N \ (1 \leq i \leq M); 1 \leq v _ i \leq N \ (1 \leq i \leq M); For the given graph, it is guaranteed that you can reach vertex N from vertex 1 by the operations described.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc395/tasks/abc395_e) — source-abc395-e-problem-402e6ff6530462ac78b572a07feba8ec267525d08b57b227f3b6f2a8b1a8b4c1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc395/editorial/12343) — source-abc395-editorial-12343-9640f20e4e80dbab11d63e9d138eb9d07c59938d706e16cad9cac9c5981f93f1
