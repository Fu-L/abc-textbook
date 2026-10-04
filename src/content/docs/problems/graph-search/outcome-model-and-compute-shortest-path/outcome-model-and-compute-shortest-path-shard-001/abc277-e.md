---
title: "ABC277-E — Crystal Switches"
draft: true
authoringUnit: {"problemId":"abc277-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc277-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc277-e-problem-5fd6f47054e6357210bc28f89e696a6bbc68ee3694420e2e65f169375a9326ba","source-abc277-editorial-5204-9f1b83876c5a570274814530d6aa3abd7d02126577dc192eb2446c0c9fd44fc8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"switch全反転は偶奇だけで通行可能辺集合を決める。各合法操作列は同costの二層path、二層pathは合法移動・switch列に戻せる。移動1、switch0なので01-BFSの距離が最小Move回数。","sourceRevisionIds":["source-abc277-e-problem-5fd6f47054e6357210bc28f89e696a6bbc68ee3694420e2e65f169375a9326ba","source-abc277-editorial-5204-9f1b83876c5a570274814530d6aa3abd7d02126577dc192eb2446c0c9fd44fc8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

全edgeの通行可否はswitchを押した回数の偶奇だけで決まり、過去の押下時刻や回数そのものは不要である。 Moveだけが答えの費用を1増やし、switch押下は何回行っても費用0なので、遷移costは0/1になる。 入力edge a_iは初期状態parity0でa_i=1なら使え、parity1ではa_i=0なら使えるため、各edgeは対応する一方のlayerだけに置かれる。 目的頂点Nではparityを問わないので、(N,0),(N,1)の短い方が答えになる。

採用する候補: 状態を(vertex,switch parity)の2層にし、通行可能edgeをcost1、switch頂点の層間をcost0として01-BFSする。

globalなedge反転を2N状態の局所遷移へ変え、求めるMove回数をそのまま最短距離にできる。

棄却する候補: switchを押す時点の全組合せを列挙し、各固定passability graphで経路探索する。

訪問途中に何度でも押せるため候補列が指数的で、経路と押下を分離できない。

入力edge a_iは初期状態parity0でa_i=1なら使え、parity1ではa_i=0なら使えるため、各edgeは対応する一方のlayerだけに置かれる。

目的頂点Nではparityを問わないので、(N,0),(N,1)の短い方が答えになる。

(1,0)を距離0で開始する。各入力edgeを使用可能なparity層のcost1辺にし、各switch sを(s,0)↔(s,1)のcost0辺にする。dequeで01-BFSし、Nの2状態が未到達なら-1を出す。

## 典型の発動条件

### 状態空間のlayer化

発動条件: global modeが少数で、同じ頂点でもmodeにより使える遷移が変わるとき。

switch偶奇を2層として元graphを複製する。

### 01-BFS

発動条件: 操作costが0と1だけで、最小costを求めるとき。

押下をdeque前方、移動を後方へ緩和する。

## 問題固有の要素

全edgeの一斉反転は巨大なgraph更新ではなく、現在modeを反転する0-cost層間edgeとして表せる。

別の問題へ持ち帰る視点: global toggle操作では、対象を実際に更新せずtoggle回数mod周期を状態に追加する。

## 正当性

switch全反転は偶奇だけで通行可能辺集合を決める。各合法操作列は同costの二層path、二層pathは合法移動・switch列に戻せる。移動1、switch0なので01-BFSの距離が最小Move回数。

## 実装上の注意

- edgeを置くlayerは、parity0ならa=1、parity1ならa=0であり、1-a_iというindex規約を取り違えない。
- switchが始点や終点にある場合もcost0遷移を許し、訪問済みだけでなく距離改善でdequeへ入れる。

## 復習の核

- a=1とa=0のedgeを1本ずつ持つ小graphで、各parity層にどちらが現れ、switch edgeがどう接続するか描く。

## 計算量と制約

### 時間

N頂点M辺、2N状態、O(M+N)辺。01-BFSで O(N+M)。

### 空間

二層dist、adjacency、deque O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 0 \leq K \leq N; 1 \leq u_i, v_i \leq N; u_i \neq v_i; a_i \in \lbrace 0, 1\rbrace; 1 \leq s_1 \lt s_2 \lt \cdots \lt s_K \leq N; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/tasks/abc277_e) — source-abc277-e-problem-5fd6f47054e6357210bc28f89e696a6bbc68ee3694420e2e65f169375a9326ba
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc277/editorial/5204) — source-abc277-editorial-5204-9f1b83876c5a570274814530d6aa3abd7d02126577dc192eb2446c0c9fd44fc8
