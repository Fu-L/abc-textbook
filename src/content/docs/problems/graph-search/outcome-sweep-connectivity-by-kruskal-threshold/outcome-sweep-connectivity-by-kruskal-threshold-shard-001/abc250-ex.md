---
title: "ABC250-EX — Trespassing Takahashi"
draft: true
authoringUnit: {"problemId":"abc250-ex","docPath":"src/content/docs/problems/graph-search/outcome-sweep-connectivity-by-kruskal-threshold/outcome-sweep-connectivity-by-kruskal-threshold-shard-001/abc250-ex.md","learningOutcomeIds":["outcome-sweep-connectivity-by-kruskal-threshold","outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-event-sweep","unit-spanning-tree-optimization"],"excludedTopics":["Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-kruskal-threshold-sweep","tag-shortest-path","tag-dsu-components","tag-event-sweep"],"sourceRevisionIds":["source-abc250-editorial-3908-84b6822e58413631cb174d16a53162ff86c33af8a99cf464a2417867f42fe2eb","source-abc250-ex-problem-1b94344ef7430d7cd6a14d6af42b9dc930ae092021b163973b8890d38e62fa93"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"最寄り家Voronoi領域を境界edgeで結ぶ候補距離d[a]+w+d[b]は実家間path長を与える。任意家間最短pathを領域ごと分けると必要な境界候補はそのpath長以下なので同閾値の連結性を再現できる。閾値順DSUで独立質問を正確に判定する。","sourceRevisionIds":["source-abc250-editorial-3908-84b6822e58413631cb174d16a53162ff86c33af8a99cf464a2417867f42fe2eb","source-abc250-ex-problem-1b94344ef7430d7cd6a14d6af42b9dc930ae092021b163973b8890d38e62fa93"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Kruskal順の閾値DSU sweep](src/content/docs/learn/graph/kruskal-threshold-sweep.md)

- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。
- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md) — 貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。

## 考察

家同士の最短距離がt以下かという完全グラフを直接作らなくても、各頂点から最寄りの家までの距離を原グラフの辺へ加えた値で、家集合の連結が起きる閾値を表せる。全ての家を始点にしたDijkstraで各頂点の最寄り家距離d[v]を一度に求められる。原辺(a,b,c)にd[a]+c+d[b]を付けると、その辺を境に二つの最寄り家領域を結ぶ経路長の候補になり、閾値以下の連結成分だけが必要になる。

採用する候補: 多始点Dijkstraと辺の閾値順DSU

各原辺に両端から最寄りの家までの距離を足した候補値を付け、質問のt以下の辺だけを統合すると家間距離グラフの連結性を再現できる。

棄却する候補: 全ての家の組の最短距離を計算して完全グラフを作る

K始点の最短路とK^2辺が必要になり、頂点・家が2×10^5級では扱えない。

K個の家を同時に始点としてDijkstraを行い、各辺の変換重みd[a]+c+d[b]を求めて昇順に並べる。質問もt順に処理し、重み≤tの辺をDSUへ追加して指定された家x,yの連結を判定する。

## 典型の発動条件

### 多始点Dijkstra

発動条件: 多数の特別頂点のいずれかまでの最短距離を全頂点で求めたい。

全ての家を距離0でキューへ入れ、最寄り家までの距離場を作る。

### オフライン閾値連結

発動条件: 辺の採用条件が質問パラメータt以下で単調に増える。

変換辺と質問を昇順に走査し、DSUで連結成分を増分管理する。

## 問題固有の要素

家間の距離完全グラフの閾値連結は、最寄り家への距離場で重み付けした元の疎グラフ上の連結へ置き換えられる。

別の問題へ持ち帰る視点: 距離閉包全体ではなく、その閾値連結だけを問うなら、多始点距離と境界辺の候補で十分なことがある。

## 正当性

最寄り家Voronoi領域を境界edgeで結ぶ候補距離d[a]+w+d[b]は実家間path長を与える。任意家間最短pathを領域ごと分けると必要な境界候補はそのpath長以下なので同閾値の連結性を再現できる。閾値順DSUで独立質問を正確に判定する。

## 実装上の注意

- 距離と変換重みは64ビットで保持し、同じtの質問では重みがt以下の辺を全て追加してから判定する。到達不能距離を足さないようにする。

## 復習の核

- 小さいグラフで全家間最短距離から作った完全グラフの連結性と比較し、同値の辺、複数の最寄り家がある頂点、x=yを確認する。

## 計算量と制約

### 時間

N頂点M辺、家K、質問Q。multi-source Dijkstra O((N+M)log N)、変換辺/質問sort O((M+Q)log(M+Q))、DSU O((M+Q)α(N))。

### 空間

元辺、距離/最寄り家、変換辺と質問 O(N+M+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 7 sec; Memory limit: 1024 MiB; Constraints: 2 \leq K \leq N \leq 2 \times 10^5; N-1 \leq M \leq \min (2 \times 10^5, \frac{N(N-1)}{2}); 1 \leq a_i \lt b_i \leq N; If i \neq j, then (a_i,b_i) \neq (a_j,b_j).; 1 \leq c_i \leq 10^9; One can travel from any point to any other point using some number of roads.; 1 \leq Q \leq 2 \times 10^5; 1 \leq x_i \lt y_i \leq K; 1 \leq t_1 \leq \ldots \leq t_Q \leq 10^{15}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/editorial/3908) — source-abc250-editorial-3908-84b6822e58413631cb174d16a53162ff86c33af8a99cf464a2417867f42fe2eb
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/tasks/abc250_h) — source-abc250-ex-problem-1b94344ef7430d7cd6a14d6af42b9dc930ae092021b163973b8890d38e62fa93
