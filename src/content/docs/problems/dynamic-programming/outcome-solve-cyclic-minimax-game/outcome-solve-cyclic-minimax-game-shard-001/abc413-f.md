---
title: "ABC413-F — No Passage"
draft: true
authoringUnit: {"problemId":"abc413-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-cyclic-minimax-game/outcome-solve-cyclic-minimax-game-shard-001/abc413-f.md","learningOutcomeIds":["outcome-solve-cyclic-minimax-game"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-game-value","unit-state-graph-search"],"excludedTopics":["循環局面の後退解析とminimax距離の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cyclic-minimax-game","tag-state-graph-search"],"sourceRevisionIds":["source-abc413-editorial-13408-cd7c7c368b8c3394a09057f9e21edc8dfb0e06849b10d0912d749b319ba1ff42","source-abc413-f-problem-8805a2f473ce9f9fa49142fa614df418d215a03b5b7f886312e72512ee30c28c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Aokiが一方向を禁止しTakahashiが残り最良を選ぶので非goalの値は隣接値の二番目+1。小さい値順に二隣接が確定した時、その二つへはどちらか一つを必ず選べるため有限上界が得られる。それより小さい値での確定が不可能なのは、その時点で小さい確定値が二つ揃っていないため。goal0から帰納的に最小有限値を確定する。最後まで未確定の領域は各点に有限値側の隣接が高々一つで、Aokiがそれを禁止し永久に閉じ込められる。","sourceRevisionIds":["source-abc413-editorial-13408-cd7c7c368b8c3394a09057f9e21edc8dfb0e06849b10d0912d749b319ba1ff42","source-abc413-f-problem-8805a2f473ce9f9fa49142fa614df418d215a03b5b7f886312e72512ee30c28c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [循環局面の後退解析とminimax距離](src/content/docs/learn/dynamic-programming/cyclic-minimax-game.md)

- 終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [minimax・得点差・局面値を評価するゲームDP](src/content/docs/learn/dynamic-programming/dp-game-value.md) — 状態遷移を設計できることを前提に、双方の最適行動を最大化・最小化として評価する。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

非goal cellの値は、四方向へ進んだ後のdist+1のうち小さい方から二番目になる。Aokiが最良方向を一つ禁止しても、Takahashiは残る中の最良を選ぶからである。 未知値を再帰式から直接解くとcycleするが、有限distの小さい順に確定すると、隣接する有限値が二個確定した瞬間にそのcellの二番目の値も確定する。 盤外方向は動かず同じ状態へ戻るため、有限解を作る有効neighborとは数えない。boundaryで有限neighborが一つしかないcellは、その方向をAokiに禁止されるので到達不能になり得る。 あるcellが確定したとき影響するのは四近傍だけであり、一つのcellはcount=2の一回だけqueueへ入るため、H×Wが900万でも線形処理で済む。

採用する候補: 全goalをdist0として始め、各cellで確定済みneighbor数を数えるretrograde BFS

queueはdist非減少で出るため二個目に確定したneighborのdistが二番目に小さい。countが2になったcellをそのdist+1で確定し、各grid edgeを定数回処理する。

棄却する候補: 各cellのsecond-min方程式を値が変わらなくなるまで反復緩和する

自己参照とcycleがあり収束回数を制約内に保証できず、有限状態がgoalから距離順に広がる単調性を使っていない。

盤外方向は動かず同じ状態へ戻るため、有限解を作る有効neighborとは数えない。boundaryで有限neighborが一つしかないcellは、その方向をAokiに禁止されるので到達不能になり得る。

あるcellが確定したとき影響するのは四近傍だけであり、一つのcellはcount=2の一回だけqueueへ入るため、H×Wが900万でも線形処理で済む。

distを∞、goalsを0でqueueへ入れる。distの小さい順にcell vをpopし、未確定の各grid neighbor uのfixedNeighborCountを増やす。2になった瞬間dist[u]=dist[v]+1としてpushする。最後に有限distを全て加え、∞cellは問題指定どおり0寄与とする。

## 典型の発動条件

### ゲームの後退解析

発動条件: min/max双方の選択がある到達gameで、terminalから勝敗・手数を逆向きに確定できるとき。

goalを基底に、相手が一手を妨害しても残る二番目の遷移値から状態を確定する。

### k-th smallest の多源BFS

発動条件: 状態値がneighbor値の第k小値+1で、値を小さい順に確定できるとき。

各cellはk個目のneighborがpopされた時点でdistを決める。

### 局所count伝播

発動条件: 確定済み後続状態の個数が閾値に達したら前状態が確定するとき。

四近傍の確定countだけを持ち、全cellを一度だけactivateする。

## 問題固有の要素

Aokiが禁止できる方向が一つなので通常の最短路のminimumではなくsecond minimumになり、逆探索では必要な確定neighbor数がちょうど2になる。

別の問題へ持ち帰る視点: 相手が最大b個の行動を潰すreachability gameでは、(b+1)番目の後続値と確定後続数b+1によるretrograde解析を検討する。

## 正当性

Aokiが一方向を禁止しTakahashiが残り最良を選ぶので非goalの値は隣接値の二番目+1。小さい値順に二隣接が確定した時、その二つへはどちらか一つを必ず選べるため有限上界が得られる。それより小さい値での確定が不可能なのは、その時点で小さい確定値が二つ揃っていないため。goal0から帰納的に最小有限値を確定する。最後まで未確定の領域は各点に有限値側の隣接が高々一つで、Aokiがそれを禁止し永久に閉じ込められる。

## 実装上の注意

- goalは隣接countに関係なくdist0で一度だけqueueへ入れる。盤外をneighborとして数えず、同じuを二重確定しない。dist総和は64 bitを使う。

## 復習の核

- cornerにgoal一個、boundaryの一本道、二方向だけgoalへ近づけるcell、到達不能領域を小盤面のvalue iterationと比較する。

## 計算量と制約

### 時間

H×W セル、K goal。各セルを一回確定し各隣接辺を定数回処理して O(HW+K)。

### 空間

距離、確定済み隣接数、queueで O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H \leq 3000; 2 \leq W \leq 3000; 1 \leq K \leq \min(HW,3000); 1 \leq R_i \leq H; 1 \leq C_i \leq W; (R_i,C_i) \neq (R_j,C_j) (1 \leq i < j \leq K); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc413/editorial/13408) — source-abc413-editorial-13408-cd7c7c368b8c3394a09057f9e21edc8dfb0e06849b10d0912d749b319ba1ff42
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc413/tasks/abc413_f) — source-abc413-f-problem-8805a2f473ce9f9fa49142fa614df418d215a03b5b7f886312e72512ee30c28c
