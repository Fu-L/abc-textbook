---
title: "ABC291-F — Teleporter and Closed off"
draft: true
authoringUnit: {"problemId":"abc291-f","docPath":"src/content/docs/problems/graph-search/outcome-relax-in-dependency-order/outcome-relax-in-dependency-order-shard-001/abc291-f.md","learningOutcomeIds":["outcome-relax-in-dependency-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc291-editorial-5846-807b8ff2df16d15a085f79f2697170001c9cb78cecc76b0c60285c608a44aae5","source-abc291-f-problem-d3425db927cfe56c02dc45c664a9289789ebf0fc8683c87aebbb40642e31321a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"番号増加pathがkを避けると一意の辺i→jでi<k<jを跨ぐ。その前後はkを訪れられない番号域なので元の最短prefix/suffixを独立に使える。全crossing辺の最小が漏れなく最短避難pathを与える。","sourceRevisionIds":["source-abc291-editorial-5846-807b8ff2df16d15a085f79f2697170001c9cb78cecc76b0c60285c608a44aae5","source-abc291-f-problem-d3425db927cfe56c02dc45c664a9289789ebf0fc8683c87aebbb40642e31321a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

都市番号は常に増え、一度kを避ける経路は必ずi<k<jとなる一本のテレポーターでkを飛び越す。 辺長が高々M≤10なので、kを跨ぐ辺候補はO(M^2)個しかなく、全kでも十分小さい。

採用する候補: 前後最短DPとkを跨ぐ辺の列挙

1→iとj→Nの最短回数を共通前計算し、辺i→jを中央に置く候補だけを各kで比較すればよい。

棄却する候補: kごとにグラフから頂点を消して最短路

N回の探索が必要で、同じ前後経路を再計算してしまう。

辺長が高々M≤10なので、kを跨ぐ辺候補はO(M^2)個しかなく、全kでも十分小さい。

dp0[i]とdp1[i]を前後から計算し、各kについて存在するi→jでi<k<jかつj-i≤Mを列挙してdp0[i]+1+dp1[j]の最小を取る。

## 典型の発動条件

### DAG最短路DP

発動条件: 全辺が小さい番号から大きい番号へ向く。

前向きdp0と後ろ向きdp1を番号順に計算する。

### 障害点を跨ぐ境界分解

発動条件: 単調路から一頂点を除く。

除去頂点の左から右へ直接飛ぶ一辺を境に前後最短路を結合する。

## 問題固有の要素

避ける頂点ごとの経路全体ではなく、その頂点を跨ぐ唯一の辺だけを列挙すればよい。

別の問題へ持ち帰る視点: 単調DAGの一点回避は境界横断辺で前後DPを接合する。

## 正当性

番号増加pathがkを避けると一意の辺i→jでi<k<jを跨ぐ。その前後はkを訪れられない番号域なので元の最短prefix/suffixを独立に使える。全crossing辺の最小が漏れなく最短避難pathを与える。

## 実装上の注意

- 到達不能INFを含む和を除外し、i<k<jとj-i≤Mの添字境界を守る。

## 復習の核

- 小さいDAGで頂点削除BFSと照合し、飛越辺なし、複数候補同値、M=1に近い境界を確認する。

## 計算量と制約

### 時間

都市N、最大jumpM。前後DP O(NM)、各禁止都市で crossing候補 O(M²)、全体 O(NM²)。

### 空間

入力 O(NM)、前後DP O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 10^5; 1\leq M\leq 10; M<N; S_i is a string of length M consisting of 0 and 1.; If i+j>N, then the j-th character of S_i is 0.; N and M are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/editorial/5846) — source-abc291-editorial-5846-807b8ff2df16d15a085f79f2697170001c9cb78cecc76b0c60285c608a44aae5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/tasks/abc291_f) — source-abc291-f-problem-d3425db927cfe56c02dc45c664a9289789ebf0fc8683c87aebbb40642e31321a
