---
title: "ABC243-E — Edge Deletion"
draft: true
authoringUnit: {"problemId":"abc243-e","docPath":"src/content/docs/problems/graph-search/outcome-compute-all-pairs-distance/outcome-compute-all-pairs-distance-shard-001/abc243-e.md","learningOutcomeIds":["outcome-compute-all-pairs-distance"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-change-impact-localization","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-witness-impact-localization"],"sourceRevisionIds":["source-abc243-e-problem-bc310b52f161ee93bfd9d688422df21267853b10cf5de15b07d37f5be4181b41","source-abc243-editorial-3561-242d54ccff8890b54fcc964e9543d50b94004320caf7d06b54a85eba02a6cb1f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"辺両端に対象辺なしの同長以下pathがあれば、全最短路上のその辺を置換できる。正重みなので中間 k を使う距離和≤cの witness が対象辺を循環的に使うことはない。同時削除の成立は代替pathの各辺長が対象辺より小さいことから重み順の帰納法で保証され、必要辺だけで全距離を保つ。","sourceRevisionIds":["source-abc243-e-problem-bc310b52f161ee93bfd9d688422df21267853b10cf5de15b07d37f5be4181b41","source-abc243-editorial-3561-242d54ccff8890b54fcc964e9543d50b94004320caf7d06b54a85eba02a6cb1f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。

先に読む単元:

- [基準witnessから変更影響を局所化する](src/content/docs/learn/modeling/change-impact-localization.md) — 変更前の最適解や実行列をwitnessとして固定し、それが壊れない変更では答えも変わらないことを証明して再計算対象を絞る。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

辺 e=(a,b,c) を削除して距離が変わる可能性を調べるには、まずその両端 a-b の距離だけを見る。元の最短距離が c より短ければ e は最短路に不要で、等しければ長さ c の代替 path の有無が争点になる。全頂点対距離が分かれば、ある中間頂点 k に対して dist[a][k]+dist[k][b]≤c であることが、e を使わない同長以下の二辺以上の path の witness になる。残す必要があるのは、dist[a][b]=c かつ長さ c の二辺以上の代替 path がない辺だけであり、それ以外を全て同時に消しても最短距離を保てる。

採用する候補: Floyd-Warshall で APSP を求め、各辺について短い経路または中間頂点経由の同長経路があるか判定して削除可能数を数える。

一度の距離前計算を全辺へ共有し、辺ごとの必要性を局所条件で判定できる。

棄却する候補: 辺を一本ずつ削除して、その都度全頂点対最短距離を再計算する。

M 回の APSP が必要になり、N=300でも四乗以上の規模になる。

隣接行列を辺長で初期化して Floyd-Warshall を行う。各 (a,b,c) で dist[a][b]<c なら削除可能、そうでなくても a,b 以外の k に dist[a][k]+dist[k][b]≤c があれば削除可能として数える。

## 典型の発動条件

### APSP による辺冗長性判定

発動条件: 全頂点対距離を保ったまま辺を削り、各辺の代替最短路を調べたいとき。

Floyd-Warshall の距離と中間点 witness で、直接辺が必要か判定する。

### 最適解 witness の局所化

発動条件: 全体条件を壊す要素を、要素自身の端点間最適値だけで特徴付けられるとき。

辺 e の必要性を endpoints 間の短路・同長代替路に限定して調べる。

## 問題固有の要素

距離が同じ代替 path もあれば直接辺を消せるため、dist<a weight だけでなく dist=weight の複数経路を中間頂点で検出する。

別の問題へ持ち帰る視点: 冗長性判定では「より良い代替」だけでなく「同値な別 witness」が十分かを目的条件から確認する。

## 正当性

辺両端に対象辺なしの同長以下pathがあれば、全最短路上のその辺を置換できる。正重みなので中間 k を使う距離和≤cの witness が対象辺を循環的に使うことはない。同時削除の成立は代替pathの各辺長が対象辺より小さいことから重み順の帰納法で保証され、必要辺だけで全距離を保つ。

## 実装上の注意

- 距離和は 64 bit と大きい INF を使う。k=a,b の自明な分解を代替 path と数えず、正の辺長により中間 k の二最短路が対象辺を循環的に使わないことを利用する。

## 復習の核

- 三角形で直接辺が最短より長い場合と、別二辺 path と同長の場合を分け、どちらも削除可能だが理由が違うことを確認する。

## 計算量と制約

### 時間

N 頂点、M 辺。Floyd–Warshall O(N³)、各辺の witness 検査 O(MN)。

### 空間

距離行列 O(N²)、辺 O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 300; N-1 \leq M \leq \frac{N(N-1)}{2}; 1 \leq A_i \lt B_i \leq N; 1 \leq C_i \leq 10^9; (A_i, B_i) \neq (A_j, B_j) if i \neq j.; The given graph is connected.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/tasks/abc243_e) — source-abc243-e-problem-bc310b52f161ee93bfd9d688422df21267853b10cf5de15b07d37f5be4181b41
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/editorial/3561) — source-abc243-editorial-3561-242d54ccff8890b54fcc964e9543d50b94004320caf7d06b54a85eba02a6cb1f
