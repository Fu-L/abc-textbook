---
title: "ABC214-H — Collecting"
draft: true
authoringUnit: {"problemId":"abc214-h","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc214-h.md","learningOutcomeIds":["outcome-model-min-cost-flow","outcome-condense-and-order-directed-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow","tag-scc-condensation"],"sourceRevisionIds":["source-abc214-editorial-2441-461a7a0ecf3623a4c3930aa6115ae0e0085418e7a1a22e6b3d76980e46d99418","source-abc214-h-problem-30de4d02cd6fe40dd4d97c88747f89d283e9e0de105422d6fb18d0bdd684c24e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"SCC内の巡回と出口への移動により、成分経路と回収報酬を相互に実現できる。整数容量のDAG網の流れはK本のsource–sink経路へ分解でき、任意の元のK人経路も網へ写せる。各訪問成分は容量1の無料辺を高々一回使い、正重みなので最小費用では訪問した成分の一単位を必ず無料にできる。移動・終了費用の望遠和は一経路につきP_Cからその訪問重みを引いた値となり、再通過費用で余分な報酬を相殺すると総費用KP_C−訪問成分の重み和を得る。従って費用最小化と報酬最大化は両方向に一致する。全元費用が非負なので初期potential0が有効で、その後の残余最短路法も最小費用を保つ。","sourceRevisionIds":["source-abc214-editorial-2441-461a7a0ecf3623a4c3930aa6115ae0e0085418e7a1a22e6b3d76980e46d99418","source-abc214-h-problem-30de4d02cd6fe40dd4d97c88747f89d283e9e0de105422d6fb18d0bdd684c24e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。

先に読む単元:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md) — 状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

強連結成分に一度入れば、成分内を巡って全ての落とし物を回収し、任意の出口まで進める。SCCを一頂点へ縮約し、重みX_uを合計する。始点（元の頂点1）の成分から到達できない成分を除くと、問題はDAG上で同じ始点からK本の経路を選び、訪れた頂点の重みを一度だけ得る問題になる。

各人の最長路を独立に選ぶと重複報酬を数えてしまう。頂点uをin_u,out_uへ分け、容量1・費用−X_uの辺と容量K・費用0の辺を並べれば、K単位の最小費用流で共有報酬を表せる。ただしこの網には負の元辺がある。非負元費用の最小費用流へ直接渡せるように、全重みを毎回の基準にして「飛ばした重みを払う」網へ変形する。

到達可能SCCをトポロジカル順に1,…,Cと番号化する。始点成分は他の全成分へ到達できるので必ず1に置ける。P_0=0、P_u=Σ_{i=1}^u X_iとする。source、sinkと各成分のin,outを作り、次の元辺を張る。

| 辺 | 容量 | 費用 |
| --- | --- | --- |
| source→in_1 | K | 0=P_0 |
| in_u→out_u（最初の通過） | 1 | 0 |
| in_u→out_u（再通過） | K | X_u |
| out_u→in_v（DAG辺u→v） | K | P_{v−1}−P_u |
| out_u→sink（任意のu） | K | P_C−P_u |

全ての費用は非負である。始点をsとして一般の番号順を使うならsource→in_sの費用はP_{s−1}。ただしここでは到達不能成分を除くためs=1である。始点で止まる経路もout_1→sinkで表せ、全員が同じ経路を使っても容量Kの再通過辺があるのでK単位を必ず流せる。

一本の成分経路u_1=1<u_2<…<u_rについて、source辺・移動辺・終了辺の費用の和は望遠和により

```text
Σ_{j=1}^{r−1}(P_{u_{j+1}−1}−P_{u_j}) + P_C−P_{u_r}
= P_C−Σ_{j=1}^r X_{u_j}
```

となる。通過する各頂点では、最初の一単位が無料、残る単位はX_uを払う。n_u回通る頂点の寄与を全経路で足すと、飛ばした重みのKP_C−Σ_u n_uX_uに、再通過費用Σ_{n_u>0}(n_u−1)X_uを足すため、総費用はKP_C−Σ_{n_u>0}X_u。従って最小費用c_minから答えKP_C−c_minを得る。

例えば辺1→2,1→3、重み(2,5,7)、K=2とする。両経路を1→3にすると、各経路が成分2を飛ばす費用5と再通過の2+7により費用19、回収報酬は2×14−19=9。一経路ずつ1→2,1→3へ分ければ、飛ばす費用7+5と始点の再通過費用2で費用14、回収報酬14となり、全重みを一度ずつ回収する最適解へ接続する。

元辺が非負なので初期potentialを0としてDijkstraによる逐次最短路法を始められる。残余逆辺の負費用は、更新したpotentialによる非負縮約費用で扱う。整数容量、必要流量K≤10から増加回数は高々Kで、Bellman–FordによるO(VE)の初期化は不要である。

## 典型の発動条件

### SCC 縮約

発動条件: 有向グラフで同一強連結成分内を自由に巡回でき、頂点資源をまとめて回収できるとき。

各成分の落とし物数を合計して一頂点にし、成分間辺だけからなる DAG を構成する。

### 一度だけ得る頂点報酬の最小費用流

発動条件: 複数の経路が頂点を共有できるが、その価値は全経路を通じて一回だけ加算されるとき。

頂点分割後に容量 1 と無限容量の二辺を置き、K 単位の流れで経路と報酬共有を表す。

## 問題固有の要素

全頂点重みを各流量の基準得点とし、経路が飛ばしたトポロジカル区間の重みを費用にすると、答えは K×重み総和から最小費用を引いて復元できる。

別の問題へ持ち帰る視点: 負報酬が最短路処理を難しくするときは、全候補の定数報酬から未取得分を非負費用として引く再表現を探す。

## 正当性

SCC内の巡回と出口への移動により、成分経路と回収報酬を相互に実現できる。整数容量のDAG網の流れはK本のsource–sink経路へ分解でき、任意の元のK人経路も網へ写せる。各訪問成分は容量1の無料辺を高々一回使い、正重みなので最小費用では訪問した成分の一単位を必ず無料にできる。移動・終了費用の望遠和は一経路につきP_Cからその訪問重みを引いた値となり、再通過費用で余分な報酬を相殺すると総費用KP_C−訪問成分の重み和を得る。従って費用最小化と報酬最大化は両方向に一致する。全元費用が非負なので初期potential0が有効で、その後の残余最短路法も最小費用を保つ。

## 実装上の注意

- SCC番号の実装規約に依存せず、到達可能な縮約DAGをトポロジカル順に並べ直してPを作る。
- 容量無限の代用はK。各in→outには無料容量1と費用X_uの再通過容量Kを置く。
- out_u→sinkを全uに張り、任意位置での終了を表す。元のDAG辺を飛ばす架空の移動辺は追加しない。
- KP_Cと総費用は64bit整数。最短路のpotentialと到達不能distの加算も同じ幅で扱う。

## 復習の核

- 複数人が同じ資源を一度だけ回収する問題では、各人別 DP より先に「最初の一流量だけ安い容量 1 辺」を検討する。
- 負辺除去の式は、一本の経路について取得重みと飛ばした区間費用の和が全重みになることから確認する。

## 計算量と制約

### 時間

元N頂点M辺、到達可能SCC数C、縮約辺E、K人。SCC・到達・トポロジカル順・prefix・網構築はO(N+M)。網は2C+2頂点、O(C+E)辺で全元費用が非負だから初期potential0。高々K回のDijkstra増加にO(K(C+E)log(C+1))、全体O(N+M+K(C+E)log(C+1))。

### 空間

元/縮約graphとnetwork O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq K \leq 10; 1 \leq A_i, B_i \leq N; A_i \neq B_i; A_i \neq A_j or B_i \neq B_j, if i \neq j.; 1 \leq X_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2441) — source-abc214-editorial-2441-461a7a0ecf3623a4c3930aa6115ae0e0085418e7a1a22e6b3d76980e46d99418
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_h) — source-abc214-h-problem-30de4d02cd6fe40dd4d97c88747f89d283e9e0de105422d6fb18d0bdd684c24e
