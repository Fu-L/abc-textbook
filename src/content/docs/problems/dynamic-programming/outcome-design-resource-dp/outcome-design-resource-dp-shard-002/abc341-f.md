---
title: "ABC341-F — Breakdown"
draft: true
authoringUnit: {"problemId":"abc341-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc341-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dag-topological-processing","unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-dag-topological-processing"],"sourceRevisionIds":["source-abc341-editorial-9319-c2b0e9dbc56db339bda0518027c8dc5caad4b31760a71c1288b9fca5b28dd5cd","source-abc341-f-problem-84d3b92c05bd3e31d944be2d3ad095c7de0164eb8a5929504ae55cb49acd0f1e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頂点vの一pieceを除くとまず一操作を得て、選んだ隣接集合Sの各頂点へpieceが独立に置かれる。条件ΣW_u<W_vから全選択頂点はvより小さいweightであり、その後の最大操作数dp[u]は既に確定している。従ってdp[v]=1+max Σdp[u]はweight W_u・価値dp[u]・容量W_v−1の0/1 knapsackに等しい。各pieceは他pieceの存在で選択条件を変えないので、初期A_v個のpieceの寄与も線形に加算でき、ΣA_v dp[v]が全操作数の最大となる。","sourceRevisionIds":["source-abc341-editorial-9319-c2b0e9dbc56db339bda0518027c8dc5caad4b31760a71c1288b9fca5b28dd5cd","source-abc341-f-problem-84d3b92c05bd3e31d944be2d3ad095c7de0164eb8a5929504ae55cb49acd0f1e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

一つのpieceから派生する操作木は他のpieceと相互作用せず、頂点vのpiece一つが生む最大操作回数dp[v]を求めれば答えはΣA_vdp[v]になる。子として置けるのは重みがW_v未満の隣接頂点だけである。

採用する候補: W昇順に頂点を処理し、各頂点で0/1 knapsackを解く

dp[v]はstrictly smaller weightのdpだけに依存し、選択集合のweight制約をknapsackとして正確に最大化できる。

棄却する候補: 各操作をpieceごとに実際にsimulationする

pieceが分岐して数が増え、A_iも10^9まであるため操作列を陽に生成できない。

vの一回目の除去で1操作を得た後、選んだ隣接集合Sの各pieceは独立にdp[u]回寄与するのでdp[v]=1+max_{ΣW_u<W_v}Σdp[u]である。これはcost W_u、value dp[u]、capacity W_v-1の0/1 knapsackになる。

頂点をW昇順に並べる。各vについて長さW_vのknapsack配列を0初期化し、W_u<W_vの全neighbor uをitemとしてcapacity降順にvalue dp[u]を更新する。dp[v]=1+max tableとし、全頂点後にΣdp[v]A_vを計算する。

## 典型の発動条件

### 依存順付きvertex DP

発動条件: 遷移先のweightが必ず現在より小さく、再帰がwell-foundedである。

W昇順をtopological orderとして小weight頂点のdpを先に確定する。

### 頂点ごとの0/1 knapsack

発動条件: 隣接候補から各頂点を高々一度選び、weight和のstrict上限下でvalue和を最大化する。

capacity W_v-1でneighborをitemとして一次元knapsackを行う。

## 問題固有の要素

piecesの由来を分けて考えると最大操作回数が線形に加算され、巨大な初期個数A_vは最後の内積にだけ現れる。

別の問題へ持ち帰る視点: 独立に分岐するprocessは、一個あたりの最適価値を求めて初期multiplicityで重み付けできる。

## 正当性

頂点vの一pieceを除くとまず一操作を得て、選んだ隣接集合Sの各頂点へpieceが独立に置かれる。条件ΣW_u<W_vから全選択頂点はvより小さいweightであり、その後の最大操作数dp[u]は既に確定している。従ってdp[v]=1+max Σdp[u]はweight W_u・価値dp[u]・容量W_v−1の0/1 knapsackに等しい。各pieceは他pieceの存在で選択条件を変えないので、初期A_v個のpieceの寄与も線形に加算でき、ΣA_v dp[v]が全操作数の最大となる。

## 実装上の注意

- strict inequalityなのでcapacityはW_v-1で、W_u≥W_vのneighborはitemにしない。knapsackはcapacity降順に更新し同じneighborの重複使用を防ぐ。

## 復習の核

- Sが空しか選べない頂点、同じWの隣接、複数neighborのknapsack選択、A_v=0を小規模再帰探索と比較する。

## 計算量と制約

### 時間

O(N log N+MWmax)、各辺の小weight側をitemとするknapsack。

### 空間

O(N+M+Wmax)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \leq N \leq 5000; 1 \leq M \leq \min \lbrace N(N-1)/2, 5000 \rbrace; 1 \leq u_i, v_i \leq N; u_i \neq v_i; i \neq j \implies \lbrace u_i, v_i \rbrace \neq \lbrace u_j, v_j \rbrace; 1 \leq W_i \leq 5000; 0 \leq A_i \leq 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc341/editorial/9319) — source-abc341-editorial-9319-c2b0e9dbc56db339bda0518027c8dc5caad4b31760a71c1288b9fca5b28dd5cd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc341/tasks/abc341_f) — source-abc341-f-problem-84d3b92c05bd3e31d944be2d3ad095c7de0164eb8a5929504ae55cb49acd0f1e
