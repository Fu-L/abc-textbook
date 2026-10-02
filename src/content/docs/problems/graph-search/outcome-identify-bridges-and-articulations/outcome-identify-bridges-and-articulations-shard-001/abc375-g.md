---
title: "ABC375-G — Road Blocked 2"
draft: true
authoringUnit: {"problemId":"abc375-g","docPath":"src/content/docs/problems/graph-search/outcome-identify-bridges-and-articulations/outcome-identify-bridges-and-articulations-shard-001/abc375-g.md","learningOutcomeIds":["outcome-identify-bridges-and-articulations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search","unit-weighted-shortest-path"],"excludedTopics":["次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。"],"tagIds":["tag-lowlink-critical-structure","tag-shortest-path"],"sourceRevisionIds":["source-abc375-editorial-11133-4b7e5cfe9584c4fb06ab138b27bf0a6a43fb3b3849ea866173f55f2402ca4a90","source-abc375-g-problem-f352f03c0343c2e161ca8dfcc1c174eab4577a928b1141d454e0ac8c4873ed5f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最短路に使われる辺だけを両端距離等式で抽出する。正重みで距離が単調増加し、この部分graphの全辺は1–N最短path上にある。対象辺を消しても両端がつながるなら代替最短pathがあり、つながらないbridgeなら全最短path必須。よってlowlink bridge判定が答えと一致する。","sourceRevisionIds":["source-abc375-editorial-11133-4b7e5cfe9584c4fb06ab138b27bf0a6a43fb3b3849ea866173f55f2402ca4a90","source-abc375-g-problem-f352f03c0343c2e161ca8dfcc1c174eab4577a928b1141d454e0ac8c4873ed5f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [lowlinkで橋・関節点を特定する](src/content/docs/learn/graph/lowlink-critical-structure.md)

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 考察

辺が全ての 1→N 最短路に含まれるには、まず少なくとも一つの最短路上にある必要がある。そのような辺だけを残すと距離が単調に増える最短路 DAG となる。 辺 (u,v,c) が最短路上にある条件は d1[u]+c+dN[v]=d1[N] または向きを逆にした等式で判定できる。 正重みゆえ最短路辺は d1 の小さい側から大きい側へ向き、最短路部分グラフにおける 1-N 間の必須辺は無向橋として列挙できる。

採用する候補: 1 と N から Dijkstra を行って最短路辺を抽出し、その部分グラフで橋となる辺を Yes と判定する。

最短路辺以外は即 No であり、最短路部分グラフから辺を除いて 1 と N が分断されることが「全最短路に必須」と同値になる。

棄却する候補: 各辺を一つずつ削除して 1→N の最短距離を再計算する。

M 回の Dijkstra が必要で O(M^2 log N) 級となり、N,M≤2×10^5 に間に合わない。

辺 (u,v,c) が最短路上にある条件は d1[u]+c+dN[v]=d1[N] または向きを逆にした等式で判定できる。

正重みゆえ最短路辺は d1 の小さい側から大きい側へ向き、最短路部分グラフにおける 1-N 間の必須辺は無向橋として列挙できる。

両端からの距離を求め、等式を満たす辺で G' を作る。G' に lowlink を適用して橋を列挙し、元の辺が G' の橋なら Yes、それ以外は No とする。

## 典型の発動条件

### 最短路部分グラフ

発動条件: どれか／すべての最短路に辺が含まれるか判定したいとき。

両端距離の等式で候補辺だけを抽出する。

### 橋と必須経路

発動条件: ある二点間の全 path が通る辺を知りたいとき。

候補グラフ上の橋として一括列挙する。

## 問題固有の要素

全最短路の交差を直接数えず、最短路だけからなるグラフへ制限して通常の必須辺問題に戻す。

別の問題へ持ち帰る視点: 距離の等式は候補性、橋は普遍性をそれぞれ担当する二段階判定である。

## 正当性

最短路に使われる辺だけを両端距離等式で抽出する。正重みで距離が単調増加し、この部分graphの全辺は1–N最短path上にある。対象辺を消しても両端がつながるなら代替最短pathがあり、つながらないbridgeなら全最短path必須。よってlowlink bridge判定が答えと一致する。

## 実装上の注意

- 無向辺の両向きの等式を調べ、平行辺がない前提でも DFS の親辺を edge id で除外する。距離は 64 bit で持つ。

## 復習の核

- 「最短路上に一度でも現れる」と「全最短路に現れる」を混同せず、距離等式と橋の二つの必要十分条件を分ける。

## 計算量と制約

### 時間

N 頂点、M 辺。二回Dijkstra O((N+M)log N)、最短路部分graph lowlink O(N+M)。

### 空間

隣接、二距離、最短路graphで O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq A_i < B_i \leq N; All pairs (A_i, B_i) are distinct.; 1 \leq C_i \leq 10^9; City N can be reached from city 1 when all roads are passable.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc375/editorial/11133) — source-abc375-editorial-11133-4b7e5cfe9584c4fb06ab138b27bf0a6a43fb3b3849ea866173f55f2402ca4a90
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc375/tasks/abc375_g) — source-abc375-g-problem-f352f03c0343c2e161ca8dfcc1c174eab4577a928b1141d454e0ac8c4873ed5f
