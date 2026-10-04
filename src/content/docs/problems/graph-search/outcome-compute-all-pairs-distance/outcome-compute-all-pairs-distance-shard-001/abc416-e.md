---
title: "ABC416-E — Development"
draft: true
authoringUnit: {"problemId":"abc416-e","docPath":"src/content/docs/problems/graph-search/outcome-compute-all-pairs-distance/outcome-compute-all-pairs-distance-shard-001/abc416-e.md","learningOutcomeIds":["outcome-compute-all-pairs-distance"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc416-e-problem-d0213006b42ade435c4d82062e596bb88e0fc8daa09ff1eb8148bf011495855b","source-abc416-editorial-13536-14e98e1d6c7b3d87f4b6d704d63bd0be9524047bd30d39af71692ce80fef0a56"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"空港a→sky→bは正確に費用Tとなる。非負グラフへ辺u→vを追加した最短路は、辺を使わない旧pathか、一度だけ使う旧i→u、新辺、旧v→jに分けられる。二有向辺を順に追加すれば道路と空港の追加も厳密に反映できる。都市間だけ合計して補助頂点を目的値へ含めない。","sourceRevisionIds":["source-abc416-e-problem-d0213006b42ade435c4d82062e596bb88e0fc8daa09ff1eb8148bf011495855b","source-abc416-editorial-13536-14e98e1d6c7b3d87f4b6d704d63bd0be9524047bd30d39af71692ce80fef0a56"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

airport間のcomplete graphを明示すると追加のたび二次本増えるが、sky頂点を一つ置きairport→skyをT、sky→airportを0とすれば任意airport間T時間を二辺で表せる。 既知のall-pairs shortest distanceへ有向edge u→v,weight wを一つ追加した後のsimple最短路は、そのedgeを使わないかdist[i][u]+w+dist[v][j]として一度使うかである。 airport a→sky→b のcostはT+0=Tで、skyを中継して何空港を使っても負辺がないため正しい最短路表現を保つ。 undirected road追加はx→yとy→xを順に処理でき、非負辺なので新辺を往復してさらに短くなるcycleはない。airport追加も同様に二辺更新する。

採用する候補: skyを含むN+1頂点の距離行列をFloyd-Warshallで初期化し、各追加edgeをO(N^2)でincremental更新する

roadは両向き二辺、airportはskyとの二有向辺として追加するだけなので、Q≤1000でもO(N^3+N^2Q)に収まる。

棄却する候補: airport追加ごとに新airportと全既存airportの航路edgeを追加し、それぞれincremental APSP更新する

airport一件でO(N)辺、その各辺にO(N^2)を掛けると全体O(N^4)規模になる。

airport a→sky→b のcostはT+0=Tで、skyを中継して何空港を使っても負辺がないため正しい最短路表現を保つ。

undirected road追加はx→yとy→xを順に処理でき、非負辺なので新辺を往復してさらに短くなるcycleはない。airport追加も同様に二辺更新する。

頂点0..N-1にsky=Nを加え、road両向きと既存airportのa→sky(T),sky→a(0)を入れてFloyd-Warshallする。query1は二有向edge、query2はskyとの二edgeを各dist[i][j]=min(dist[i][j],dist[i][u]+w+dist[v][j])で全pair更新する。query3は都市間の有限distだけ合計する。

## 典型の発動条件

### hub頂点によるclique圧縮

発動条件: ある頂点集合の任意二点間を同一costで移動でき、集合が動的に増えるとき。

skyへのT辺とskyからの0辺でairport cliqueをstarへ置換する。

### incremental APSP

発動条件: edge追加だけがあり頂点数が数百のall-pairs shortest pathを保つとき。

一新辺を通る候補を全(i,j)へO(1)ずつ緩和する。

### Floyd-Warshall

発動条件: 初期graphの全頂点対距離が必要でNが500程度のとき。

skyを含む距離行列の初期closureをO(N^3)で作る。

## 問題固有の要素

有向weight T/0のhubにより、airport同士の一律T travelを正確に表しながらairport追加を二edgeへ固定できる。

別の問題へ持ち帰る視点: 動的clique edge追加では、共通移動costをenter/exit costへ分けたhub表現で更新本数を削減する。

## 正当性

空港a→sky→bは正確に費用Tとなる。非負グラフへ辺u→vを追加した最短路は、辺を使わない旧pathか、一度だけ使う旧i→u、新辺、旧v→jに分けられる。二有向辺を順に追加すれば道路と空港の追加も厳密に反映できる。都市間だけ合計して補助頂点を目的値へ含めない。

## 実装上の注意

- INFを足す前に到達性を確認し、距離・全pair和は64 bitにする。type3はskyを除くN都市だけを数え、unreachable pairは0、同airportの再追加も害なく処理する。

## 復習の核

- airport0/1個、同都市airport再追加、既存最短より長いroad、roadとflightを混ぜる例を毎回Floyd再計算と比較する。

## 計算量と制約

### 時間

都市 N、操作 Q。sky込み Floyd O(N³)、追加辺一回 O(N²)、全体 O(N³+QN²)。回答全pair和も O(N²)。

### 空間

sky込み距離行列 O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 500; 0 \leq M \leq 10^5; 1 \leq A_i < B_i \leq N; 1 \leq C_i \leq 10^9; 0 \leq K \leq N; 1 \leq T \leq 10^9; 1 \leq D_1 < \dots < D_K \leq N; 1 \leq Q \leq 1000; For type 1 queries: 1\leq x < y \leq N, 1 \leq t \leq 10^9.; For type 2 queries: 1 \leq x \leq N.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc416/tasks/abc416_e) — source-abc416-e-problem-d0213006b42ade435c4d82062e596bb88e0fc8daa09ff1eb8148bf011495855b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc416/editorial/13536) — source-abc416-editorial-13536-14e98e1d6c7b3d87f4b6d704d63bd0be9524047bd30d39af71692ce80fef0a56
