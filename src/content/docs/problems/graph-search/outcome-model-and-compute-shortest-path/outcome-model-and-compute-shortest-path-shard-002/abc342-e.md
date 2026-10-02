---
title: "ABC342-E — Last Train"
draft: true
authoringUnit: {"problemId":"abc342-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc342-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc342-e-problem-5af07c51272a224f3fb56629683fd300920ff307e4ec6225148234c99d00dd1b","source-abc342-editorial-9396-2117f3e6d05c8d4d50dc830879890840382f6b4ee4618a37455c4db9c4f408f6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"到着先の許容最遅Tから逆算した各scheduleの最遅 departure が最善。移動・待機で時刻は増えるため、その候補はTを超えずmaxheapで確定した駅を後から改善できない。終点∞からの逆向きDijkstraが全合法routeの最遅開始を得る。","sourceRevisionIds":["source-abc342-e-problem-5af07c51272a224f3fb56629683fd300920ff307e4ec6225148234c99d00dd1b","source-abc342-editorial-9396-2117f3e6d05c8d4d50dc830879890840382f6b4ee4618a37455c4db9c4f408f6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

station Bから時刻TまでにNへ到達できると分かっている時、schedule A→Bで使う価値があるのはarrival t+c≤Tを満たす最も遅いdepartureだけである。これにより最新出発時刻を大きい順に確定するDijkstra型探索になる。 scheduleのdepartureはl+djで、Bのdeadline Tに接続可能な最大jはmin(k-1,floor((T-c-l)/d))である。j≥0ならそのdepartureがAの候補となり、それより早い同schedule便はlatest値を改善しない。

採用する候補: 逆辺を辿るmax-heap Dijkstraで各stationのlatest feasible timeを求める

等差scheduleから条件内の最終便をO(1)計算し、確定済みstationからpredecessorへ単調に緩和できる。

棄却する候補: 各train便を個別頂点・辺として展開する

一情報あたりk_iが10^9まであり、全便の列挙は不可能である。

scheduleのdepartureはl+djで、Bのdeadline Tに接続可能な最大jはmin(k-1,floor((T-c-l)/d))である。j≥0ならそのdepartureがAの候補となり、それより早い同schedule便はlatest値を改善しない。

各Bに入るschedule情報をreverse adjacencyへ持つ。f[N]=十分大きい∞、他=-∞としてmax-heapにNを入れる。最大Tのstation Bを取り出し未確定なら確定し、各(A→B)について上式のjとcandidate departureを求めf[A]をchmaxしてheapへ入れる。1…N-1を値またはUnreachableで出す。

## 典型の発動条件

### latest-time版Dijkstra

発動条件: 各状態の評価が到達可能な最遅時刻で、後段deadlineから前段の最適時刻が単調に決まる。

min距離の代わりにmax時刻をpriority queueで確定し、逆向きに緩和する。

### 等差scheduleのfloor検索

発動条件: 大量の出発時刻l,l+d,…に対しdeadline以下の最後の一つが欲しい。

floor divisionでindexを求め0…k-1へclampする。

## 問題固有の要素

時間を逆向きに見ると「待てるなら早い便より遅い便が常に有利」になり、一scheduleをdeadlineごとの一便へ圧縮できる。

別の問題へ持ち帰る視点: 時刻表最適化では待機可能性を使い、同一路線の支配される便を算術的に選別する。

## 正当性

到着先の許容最遅Tから逆算した各scheduleの最遅 departure が最善。移動・待機で時刻は増えるため、その候補はTを超えずmaxheapで確定した駅を後から改善できない。終点∞からの逆向きDijkstraが全合法routeの最遅開始を得る。

## 実装上の注意

- T-c<lなら利用可能便なし。∞からの計算とl+(k-1)dは64bitで扱い、priority queueの古いentryをf値比較で捨てる。

## 復習の核

- 最終便ちょうど接続、一本前しか間に合わない、乗換同時刻、cycleを含む路線、到達不能を便列挙可能な小例と比較する。

## 計算量と制約

### 時間

N駅、M schedule。各schedule定数時間算術とmaxheapで O((N+M)log N)。

### 空間

逆隣接と最新時刻、heap O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq2\times10 ^ 5; 1\leq M\leq2\times10 ^ 5; 1\leq l _ i,d _ i,k _ i,c _ i\leq10 ^ 9\ (1\leq i\leq M); 1\leq A _ i,B _ i\leq N\ (1\leq i\leq M); A _ i\neq B _ i\ (1\leq i\leq M); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc342/tasks/abc342_e) — source-abc342-e-problem-5af07c51272a224f3fb56629683fd300920ff307e4ec6225148234c99d00dd1b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc342/editorial/9396) — source-abc342-editorial-9396-2117f3e6d05c8d4d50dc830879890840382f6b4ee4618a37455c4db9c4f408f6
