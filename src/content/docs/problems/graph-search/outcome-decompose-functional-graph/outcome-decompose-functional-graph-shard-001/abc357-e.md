---
title: "ABC357-E — Reachability in Functional Graph"
draft: true
authoringUnit: {"problemId":"abc357-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc357-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc357-e-problem-64307c171532025fae3638a6c13355395f10cf6cbbc3eb9d72269d67bba48256","source-abc357-editorial-10185-02035c2aaf509823d56034c354d137d0ffb8eb747241aa8cb9ca245e69b7a846"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"cycle点の到達集合はcycle全体。木頂点uは自身と後継の到達集合で、自身は後継から戻れないためcount[u]=count[A_u]+1。削除逆順なら後継が先に計算され、全到達pairを始点ごとの和でちょうど一度数える。","sourceRevisionIds":["source-abc357-e-problem-64307c171532025fae3638a6c13355395f10cf6cbbc3eb9d72269d67bba48256","source-abc357-editorial-10185-02035c2aaf509823d56034c354d137d0ffb8eb747241aa8cb9ca245e69b7a846"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

outdegree 1 の functional graph の各弱連結成分は、唯一の有向cycleと、そこへ流れ込むreverse treesからなる。 cycle上の頂点からはcycle長 c 個すべてへ到達し、tree頂点uからはcycle c 個に加えてcycleまでのpath上の depth(u) 個へ到達する。 Kahn法でindegree0を順に除いた後に残る頂点はcycle頂点だけで、各cycleを一周して同じ長さを全頂点へ設定できる。 cycleからreverse graphを外向きにたどると、子uのreachable数は親a_uの値+1となり、共有suffixを一度だけ再利用できる。

採用する候補: indegree削除またはSCCでcycleを特定し、cycle長を基底値としてreverse edge方向へ到達数+1を伝播する。

各頂点・辺を定数回だけ処理し、全uのreachable countを O(N) で得て合計できる。

棄却する候補: 各始点uからa_iを辿り、最初の重複まで訪問数を数える。

長いtailを多数の始点が共有する場合、同じsuffixを繰り返し歩いて O(N²) になる。

Kahn法でindegree0を順に除いた後に残る頂点はcycle頂点だけで、各cycleを一周して同じ長さを全頂点へ設定できる。

cycleからreverse graphを外向きにたどると、子uのreachable数は親a_uの値+1となり、共有suffixを一度だけ再利用できる。

全indegreeとreverse adjacencyを作り、queueでindegree0頂点を削除し順序を保存する。残存未訪問頂点ごとにcycleを列挙して長さ c をansCountへ代入する。削除順を逆にたどり count[u]=count[a_u]+1 とし、全 count を64 bitで合計する。

## 典型の発動条件

### functional graph のcycle peeling

発動条件: 各頂点の遷移先が一意で、cycleと流入木を分離したいとき。

indegree0から除去し、残存部分をcycle、除去逆順をtree DP順とする。

### 共有suffixのDP

発動条件: 各始点の一意な遷移列が途中から合流し、到達数を全点で求めるとき。

次頂点の答え+1を逆topological順に伝える。

## 問題固有の要素

到達可能数はcomponent全体サイズではなく「自分からcycleまでのdepth＋cycle長」で、reverse subtreeの兄弟へは到達しない。

別の問題へ持ち帰る視点: functional graphではundirected componentとdirected reachable setを混同せず、tailとcycleへ分ける。

## 正当性

cycle点の到達集合はcycle全体。木頂点uは自身と後継の到達集合で、自身は後継から戻れないためcount[u]=count[A_u]+1。削除逆順なら後継が先に計算され、全到達pairを始点ごとの和でちょうど一度数える。

## 実装上の注意

- self-loopもcycle長1として扱う。答えは最大N²なので64 bitを使い、peel順を逆にしないまま更新しない。

## 復習の核

- 一成分をcycleと逆向き木に描き、どの頂点へは到達しないかも確認する。peeling後の残存条件と逆順DPをセットで覚える。

## 計算量と制約

### 時間

N 頂点に対して O(N)。

### 空間

出辺、入次数、削除順とcount O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq a_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/tasks/abc357_e) — source-abc357-e-problem-64307c171532025fae3638a6c13355395f10cf6cbbc3eb9d72269d67bba48256
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/editorial/10185) — source-abc357-editorial-10185-02035c2aaf509823d56034c354d137d0ffb8eb747241aa8cb9ca245e69b7a846
