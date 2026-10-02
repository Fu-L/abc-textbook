---
title: "ABC422-F — Eat and Ride"
draft: true
authoringUnit: {"problemId":"abc422-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc422-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-contribution-reordering"],"sourceRevisionIds":["source-abc422-editorial-13819-43cd7ccc61b34cfce0f6748f44eb22d9a44bddf46c576379acd043608947ce01","source-abc422-f-problem-25719361ea0a28492ed20a978afd491f51075fed0c262009e3945e8a26d1c0c1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長さlの道の燃料はΣ_{j=0}^{l−1}(l−j)W_{v_j}へ順序を入れ替えられる。残りn辺の状態から一歩進む重みnW_vはこの式の一項である。全初期残歩数0..N−1からcost0で始めると各長さのpathを同一DPで比較できる。正の体重増分により閉路を削除すれば後の体重も辺数も減って燃料は増えないため最適は単純path、長さ≤N−1。従ってlayer0の最小が全最適を網羅する。","sourceRevisionIds":["source-abc422-editorial-13819-43cd7ccc61b34cfce0f6748f44eb22d9a44bddf46c576379acd043608947ce01","source-abc422-f-problem-25719361ea0a28492ed20a978afd491f51075fed0c262009e3945e8a26d1c0c1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

path上で頂点vを訪れた後に残りedge数がnなら、W_vは以後n回の燃料へ寄与しnW_vとなる。最適pathはcycleを除けるため長さはN-1以下である。 最初にpath長d枚のticketを持ち、vertex uでn枚ならnW_uを払いedgeを渡ってn-1枚にする表現は、元の各W_uが残り全edgeで消費される総額と一致する。

採用する候補: (vertex,残りticket数)のlayered DAG DP

edge移動ごとにticketが1減るためacyclicで、全path長候補をO(NM)で同時に評価できる。

棄却する候補: 通常edge weightによる一回のDijkstra

edge costがそれまで訪れたvertex weight累積に依存し、現在vertexだけではMarkovな固定重みにならない。

最初にpath長d枚のticketを持ち、vertex uでn枚ならnW_uを払いedgeを渡ってn-1枚にする表現は、元の各W_uが残り全edgeで消費される総額と一致する。

全n=0..N-1のstate(1,n)をcost0にし、nを大から小へ処理する。元edgeu-vごとに(u,n)→(v,n-1) cost nW_uと逆向きをrelaxし、最終layer0の各vertex距離を出す。rolling layerでspaceを抑える。

## 典型の発動条件

### 時間展開DAG

発動条件: 遷移回数上限があり、step残数が必ず1減る。

vertex×remaining stepsへ展開して依存costを固定edge weightにする。

### 寄与の順序交換

発動条件: 累積weightをedgeごとに足す目的をvertexごとの残り回数寄与へ変える。

pathの二重和をW_v×後続edge数として数え直す。

## 問題固有の要素

開始ticket数を0…N-1全て許すことで、到達先ごとに最適path長を別に選べる。

別の問題へ持ち帰る視点: 可変長pathは全layerのsource初期化で一つのDAG shortest pathへ統合できる。

## 正当性

長さlの道の燃料はΣ_{j=0}^{l−1}(l−j)W_{v_j}へ順序を入れ替えられる。残りn辺の状態から一歩進む重みnW_vはこの式の一項である。全初期残歩数0..N−1からcost0で始めると各長さのpathを同一DPで比較できる。正の体重増分により閉路を削除すれば後の体重も辺数も減って燃料は増えないため最適は単純path、長さ≤N−1。従ってlayer0の最小が全最適を網羅する。

## 実装上の注意

- 同じlayer内でedgeを連鎖させず必ずn→n-1へ遷移する。costは最大級なので64bitとINF guardを使う。

## 復習の核

- path/cycle graphで全simple pathを列挙し、ticket DPと元costを比較する。

## 計算量と制約

### 時間

元 graph N頂点 M辺。残歩数 N層、各層 O(N+M) 更新で O(N(N+M))。

### 空間

rolling二層距離とgraphで O(N+M)、出力 N個。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le5000; 1\le M\le5000; 1\le W _ i\le10 ^ 9\ (1\le i\le N); 1\le u _ i\le v _ i\le N\ (1\le i\le M); The given graph is connected.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc422/editorial/13819) — source-abc422-editorial-13819-43cd7ccc61b34cfce0f6748f44eb22d9a44bddf46c576379acd043608947ce01
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc422/tasks/abc422_f) — source-abc422-f-problem-25719361ea0a28492ed20a978afd491f51075fed0c262009e3945e8a26d1c0c1
