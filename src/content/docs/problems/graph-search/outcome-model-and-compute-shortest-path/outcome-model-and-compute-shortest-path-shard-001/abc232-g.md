---
title: "ABC232-G — Modulo Shortest Path"
draft: true
authoringUnit: {"problemId":"abc232-g","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc232-g.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-coordinate-compression"],"sourceRevisionIds":["source-abc232-editorial-3141-2951a49cd33bc935f5823eafcf19bc0beab84b703bd3957a9ff08215c41b6b98","source-abc232-g-problem-57304d62b13d759e52b9e4264b402d227ea4d3c3650e3c74ed8f871cd3110e52"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"元辺costは出発座標−A_iから到着B_jへの正方向円周距離。この移動を隣接圧縮座標の差分辺で分解するとcostが一致する。元→出発、到着→元の0辺で元pathを再現し、逆に補助pathの円周区間を元辺へ畳めるので最短距離を保つ。","sourceRevisionIds":["source-abc232-editorial-3141-2951a49cd33bc935f5823eafcf19bc0beab84b703bd3957a9ff08215c41b6b98","source-abc232-g-problem-57304d62b13d759e52b9e4264b402d227ea4d3c3650e3c74ed8f871cd3110e52"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

辺 i→j の重み (A_i＋B_j) mod M は、円周 0,…,M−1 上で座標 (−A_i) mod M から B_j まで正方向へ進む距離である。 各元頂点は一つの出発座標へ重み 0 で入り、一つの到着座標から重み 0 で出られると考えると、N² 本の辺を共通の円周移動へまとめられる。 円周上で途中に必要座標を挟んでも距離の和は変わらないため、全 M 座標を作らずソート済みの必要座標間だけを結べばよい。

棄却する候補: 完全有向グラフの全 N(N−1) 辺を生成してダイクストラ法を行う。

頂点対ごとの辺数と走査時間が二乗規模になり、N＝20 万では保持できない。

採用する候補: 必要な (−A_i) mod M と B_i だけを円周座標ノードとして圧縮し、隣接座標間の時計回り辺と元頂点への 0 辺から疎な等価グラフを作る。

任意の元辺の重みを円周上の経路長として再現でき、座標ノードと辺は入力数に比例する。

円周上で途中に必要座標を挟んでも距離の和は変わらないため、全 M 座標を作らずソート済みの必要座標間だけを結べばよい。

加法 mod M の完全グラフ辺を円周距離へ因数分解し、座標圧縮した循環補助グラフ上の通常の非負最短路としてダイクストラ法を適用する。

## 典型の発動条件

### 密グラフの補助頂点による疎化

発動条件: 全点対の辺重みが出発側パラメータと到着側パラメータを共有構造上で合成して表せるとき。

元頂点を円周上の入口・出口座標へ接続し、共通の座標間移動辺を全ペアで共有する。

### 循環座標圧縮

発動条件: 巨大な剰余環上を単調に進むが、立ち寄る必要がある座標は入力由来の少数だけのとき。

必要座標をソート・重複除去し、各座標から次座標へ剰余差を重みにした循環辺を張る。

## 問題固有の要素

(A_i＋B_j) mod M の始点を A_i ではなく −A_i と置くことで、式が円周上の前進距離そのものになる。

別の問題へ持ち帰る視点: mod を含む二項式の重みは、一方を符号反転した円周座標間距離として表せないか試す。

## 正当性

元辺costは出発座標−A_iから到着B_jへの正方向円周距離。この移動を隣接圧縮座標の差分辺で分解するとcostが一致する。元→出発、到着→元の0辺で元pathを再現し、逆に補助pathの円周区間を元辺へ畳めるので最短距離を保つ。

## 実装上の注意

- 同じ剰余座標は一ノードへ統合し、最後の座標から最初への辺重みも (first−last) mod M として張る。
- 元問題は i≠j だが補助グラフには自己へ戻る経路も生じる。重みが非負なので自己周回は最短距離を改善せず、異頂点間の距離を変えない。

## 復習の核

- N² 辺でも重み式が出発項＋到着項なら、共有できる中間状態を作って辺を経路へ分解する。
- 剰余差の補助グラフでは、最大座標から最小座標への wrap-around 辺を忘れず円周を閉じる。

## 計算量と制約

### 時間

元N頂点、相異なる円周座標V≤2N。sort O(N log N)、補助graph Dijkstra O(N log N)。

### 空間

元点と圧縮座標、O(N)辺で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 2 \leq M \leq 10^9; 0 \leq A_i, B_j < M; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/editorial/3141) — source-abc232-editorial-3141-2951a49cd33bc935f5823eafcf19bc0beab84b703bd3957a9ff08215c41b6b98
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/tasks/abc232_g) — source-abc232-g-problem-57304d62b13d759e52b9e4264b402d227ea4d3c3650e3c74ed8f871cd3110e52
