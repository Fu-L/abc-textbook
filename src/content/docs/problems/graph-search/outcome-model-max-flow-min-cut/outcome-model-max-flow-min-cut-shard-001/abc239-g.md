---
title: "ABC239-G — Builder Takahashi"
draft: true
authoringUnit: {"problemId":"abc239-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc239-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc239-editorial-3393-8b25db27b12e56f140fc13d3f51a1d6a8d5bbe8802dcca8557636490785a0838","source-abc239-g-problem-c2dec687fbb50d593b9f97ccdbc655b2cd8d81169f1afb680c2b9b1f335fa1fe"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"中間頂点のin→outだけ有限costにして元辺をINFにすると有限cutは壁集合そのもの。source–sink pathを全て遮るcutと壁集合は相互対応しcost一致。max-flow=min-cutで最小費用、残余到達inかつ非到達outを抽出して具体集合を得る。","sourceRevisionIds":["source-abc239-editorial-3393-8b25db27b12e56f140fc13d3f51a1d6a8d5bbe8802dcca8557636490785a0838","source-abc239-g-problem-c2dec687fbb50d593b9f97ccdbc655b2cd8d81169f1afb680c2b9b1f335fa1fe"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

壁は辺ではなく中間頂点を使用不能にするため、そのままの edge cut では費用を表せない。一方、各頂点を入側と出側に分ければ「その頂点を通る」ことを一本の辺通過へ変えられる。元の無向辺の移動費用は制限したくないので、分割後は u_out→v_in と v_out→u_in に十分大きい容量を置き、壁候補 v だけ v_in→v_out に容量 c_v を置く。max-flow 後に v_in が source 側から到達可能で v_out が到達不能なら、辺 v_in→v_out が minimum cut を横切り、その v が壁として選ばれる。

採用する候補: 頂点分割した network で 1_out から N_in の max-flow/min-cut を求め、残余グラフの到達可能集合から切断頂点を復元する。

有限容量の vertex edge を切ることと壁を建てることが一対一に対応し、最小費用と具体的な頂点集合を同時に得られる。

棄却する候補: 中間頂点の部分集合を列挙し、削除後に1とNが非連結か調べる。

候補が N-2 個あり指数個の集合を検査できない。

2N 頂点の有向 network を作り、中間頂点の in→out に c_v、元辺に対応する両方向 out→in に INF を置く。1_out を source、N_in を sink として max-flow を流し、flow 値と residual reachability で壁頂点列を出力する。

## 典型の発動条件

### 頂点容量の node splitting

発動条件: 経路を遮断する費用が辺でなく頂点に付くとき。

各頂点を in/out に分け、その間の辺容量を頂点選択費用にする。

### minimum cut の復元

発動条件: 最小費用だけでなく、cut に採用した要素集合も要求されるとき。

max-flow 後の residual graph で source reachable 側を求め、reachable→unreachable の有限容量辺を列挙する。

## 問題固有の要素

始点と終点は壁にできないため容量辺を切らせず、source を 1_out、sink を N_in に置けば、元の1-N path と分割 graph の path が交互の形で対応する。

別の問題へ持ち帰る視点: node splitting では端点を含む・除く条件まで見て source/sink を in/out のどちらへ置くか決める。

## 正当性

中間頂点のin→outだけ有限costにして元辺をINFにすると有限cutは壁集合そのもの。source–sink pathを全て遮るcutと壁集合は相互対応しcost一致。max-flow=min-cutで最小費用、残余到達inかつ非到達outを抽出して具体集合を得る。

## 実装上の注意

- INF は全 c_v の和より大きい 64 bit 値にする。元の無向辺から二本の有向辺を作り、復元では中間頂点の in→out だけを候補にする。

## 復習の核

- 元 graph の短い path を一つ選び、分割 graph で in→out と out→in が交互になる対応を書いて、壁一個が全対応 path を切る意味を確認する。

## 計算量と制約

### 時間

元N頂点M辺、split graph V=2N,E=O(N+M)。一般Dinicの安全な上界 O(V²E)=O(N²(N+M))。

### 空間

残余graph、split対応 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 100; N - 1 \leq M \leq \frac{N(N-1)}{2} - 1; 1 \leq a_i \lt b_i \leq N (1 \leq i \leq M); (a_i, b_i) \neq (1, N); The given graph is simple and connected.; 1 \leq c_{i} \leq 10^9 (2 \leq i \leq N-1); c_1 = c_N = 0; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/editorial/3393) — source-abc239-editorial-3393-8b25db27b12e56f140fc13d3f51a1d6a8d5bbe8802dcca8557636490785a0838
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/tasks/abc239_g) — source-abc239-g-problem-c2dec687fbb50d593b9f97ccdbc655b2cd8d81169f1afb680c2b9b1f335fa1fe
