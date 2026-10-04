---
title: "ABC244-F — Shortest Good Path"
draft: true
authoringUnit: {"problemId":"abc244-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc244-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc244-editorial-3599-31e608c39483172c4cb03453b14f042db185c12a49bdcbabfa8376f5cf85173c","source-abc244-f-problem-c639916f8a5ebb1a57e4806bd1bbe3cc4dc29844dbc86760776cc36b6fe3cdd6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"parityと末尾が同じwalkは将来延長で同じparity変化を受けるので状態統合可能。単頂点walkを距離1で全始点初期化し、訪問先bitをxorする単位遷移はwalk長を保つ。各maskの末尾最小が最短goodwalk、mask0の空walkは0。","sourceRevisionIds":["source-abc244-editorial-3599-31e608c39483172c4cb03453b14f042db185c12a49bdcbabfa8376f5cf85173c","source-abc244-f-problem-c639916f8a5ebb1a57e4806bd1bbe3cc4dc29844dbc86760776cc36b6fe3cdd6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

## 考察

good 条件が区別するのは各頂点の訪問回数の偶奇だけで、同じ parity mask と末尾頂点に到達した二つの path は、その後の最適延長について等価である。隣接頂点 u を末尾へ追加すると、末尾は u になり mask の u bit だけが反転するため、状態遷移は単位重み graph になる。target mask S の最短長は min_last dist[S][last] であり、mask=0 だけは singleton からの BFS ではなく空 path の長さ0を採用する。

採用する候補: (mask,last) を頂点とする graph を作り、全 singleton state を距離1の source とした multi-source BFS で全状態の最短長を求める。

N≤17 により N·2^N 状態を持て、全 parity pattern の最短 path を一度の探索で共有できる。

棄却する候補: 各 S ごとに独立して path を探索し、訪問回数を記録する。

target mask が2^N個あり、探索を繰り返すと状態空間を指数回重複して調べる。

各 v について dist[1<<v][v]=1 を queue に入れる。状態 (mask,v) から各 neighbor u へ (mask xor (1<<u),u) を距離+1で緩和し、BFS 後に mask=1..2^N-1 の min_v dist と mask0の0を合計する。

## 典型の発動条件

### bitmask parity state

発動条件: 各要素の使用回数 mod 2 が条件で、操作が一要素の parity を反転するとき。

訪問 parity 全体を bitmask にし、操作対象 bit を XOR する。

### product graph の multi-source BFS

発動条件: 開始状態が複数あり、全 target state の単位重み最短距離をまとめて求めたいとき。

全初期状態を正しい初期距離で queue に入れ、一回の BFS を行う。

## 問題固有の要素

path は頂点の重複を許すため、単純 path では届かない parity mask もあり、履歴を mask と last だけへ圧縮して再訪を積極的に使う。

別の問題へ持ち帰る視点: walk の最短化では、単純 path 仮定を置く前に再訪が状態量を改善・反転する役割を持つか確認する。

## 正当性

parityと末尾が同じwalkは将来延長で同じparity変化を受けるので状態統合可能。単頂点walkを距離1で全始点初期化し、訪問先bitをxorする単位遷移はwalk長を保つ。各maskの末尾最小が最短goodwalk、mask0の空walkは0。

## 実装上の注意

- 問題の length は edge 数でなく sequence 要素数なので singleton の初期距離は1である。mask0の答えは空列0とし、dist 配列の index 順と bit 番号を揃える。

## 復習の核

- 同じ mask でも末尾が違うと次の合法遷移が違う例を作り、mask だけでは状態が足りない理由を確認する。

## 計算量と制約

### 時間

N 頂点、M 辺。状態N2^N、全transition O(M2^N)。

### 空間

distとqueue O(N2^N)、隣接O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 17; N-1 \leq M \leq \frac{N(N-1)}{2}; 1 \leq u_i, v_i \leq N; The given graph is simple and connected.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/editorial/3599) — source-abc244-editorial-3599-31e608c39483172c4cb03453b14f042db185c12a49bdcbabfa8376f5cf85173c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/tasks/abc244_f) — source-abc244-f-problem-c639916f8a5ebb1a57e4806bd1bbe3cc4dc29844dbc86760776cc36b6fe3cdd6
