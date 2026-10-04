---
title: "ABC414-G — AtCoder Express 4"
draft: true
authoringUnit: {"problemId":"abc414-g","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc414-g.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-segment-tree-canonical-decomposition","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-segment-tree-canonical-decomposition"],"sourceRevisionIds":["source-abc414-editorial-13415-646133a0df99101298dd4bd6ddef428c00978db0f886b827ad90cf9daf76ded8","source-abc414-g-problem-79f582a7b52f95ca6db3d84ac26d9bb4bbea8c837443dbb3b5a0492e442a8da5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"東向き乗車treeは区間東端へのpotential差、降車treeは西端からの差を持つ。任意u→v列車pathの差を足すと中間potentialが相殺されx_v−x_u+cになり元運賃と一致する。西向きも反転で同様。元の全許可区間辺をO(log N)coverで再現し余計な駅へ漏れない。","sourceRevisionIds":["source-abc414-editorial-13415-646133a0df99101298dd4bd6ddef428c00978db0f886b827ad90cf9daf76ded8","source-abc414-g-problem-79f582a7b52f95ca6db3d84ac26d9bb4bbea8c837443dbb3b5a0492e442a8da5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [Segment Treeのcanonical区間分解](src/content/docs/learn/query/segment-tree-canonical-decomposition.md) — 区間monoid要約で得た考え方と実装を再利用し、Segment Treeのcanonical区間分解の発動条件・正当化・境界を重複なく学ぶ。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

東行きtrainのfareはx_t-x_s+c=(x_r-x_s)+(x_L-x_r+c)+(x_t-x_L)と、乗車区間内で東端rまで・train固有部・降車区間の西端Lから、の三非負項に分解できる。区間内の全sから全tへのedgeを張る代わりに、segment tree nodeを経由して各区間をO(log N)個のcanonical nodeへ分解できる。西行きも左右を反転した同じ構造になる。東向きboarding treeではleaf sからnode区間[a,b]の東端bまでのcost x_b-x_sをtree edgeに持たせ、node→Aへx_r-x_bを足すと常にx_r-x_sになる。東向きalighting treeではB→nodeにx_a-x_L、nodeからleaf tへx_t-x_aを持たせる。中間A→Bのx_L-x_r+cと合わせて元fareを過不足なく再現する。

採用する候補: 東西それぞれの距離potential付きin/out segment-tree graphとtrainごとの集約二頂点を作り、拡張graph上でDijkstraする

各trainは乗車区間nodes→A、A→B、B→降車区間nodesのO(log N)辺で全range-to-range fareを厳密に表せる。総辺O(N+M log N)。

棄却する候補: 各trainについて全乗車駅sと全降車駅tの組へfare edgeを追加する

一trainで区間積に比例し、最悪O(MN^2)本となってgraphを構築できない。

station leafを共有／0-cost接続した東向きin/out treeと、左右対称な西向きtreeを構築する。東向き(r<L)trainはcover([l,r]) nodesからA、A→B、Bからcover([L,R]) nodesへ上記potential差weightで接続し、西向きも端点を反転して接続する。station1を始点にDijkstraし各station node距離を出力する。

## 典型の発動条件

### segment tree graph

発動条件: range内の全頂点から／全頂点へのedgeを少数辺で表したいとき。

in-treeとout-treeのcanonical interval nodesをtrain集約頂点へ接続する。

### potential差による距離分解

発動条件: edge costがsource座標とtarget座標の差＋定数で、移動方向が固定されるとき。

区間端までの座標差をtree edgeへ分配し、train固有costを中央edgeへ置く。

### Dijkstra

発動条件: 圧縮後graphの全weightが非負で一始点最短fareを求めるとき。

station1から補助nodeを含むgraphを走査し、station nodeの距離だけ出力する。

## 問題固有の要素

単なる一定weightのrange edgeではなく|x_s-x_t|も、方向固定により三つのpotential差へ分けてsegment tree経路へ埋め込める。

別の問題へ持ち帰る視点: range-to-range costがg(source)+constant+h(target)へ分離できるなら、両側のrange treeと二集約nodeで暗黙complete bipartite edgeを表す。

## 正当性

東向き乗車treeは区間東端へのpotential差、降車treeは西端からの差を持つ。任意u→v列車pathの差を足すと中間potentialが相殺されx_v−x_u+cになり元運賃と一致する。西向きも反転で同様。元の全許可区間辺をO(log N)coverで再現し余計な駅へ漏れない。

## 実装上の注意

- 東西で使う端点と符号を反転し、全edge weightが非負になることを確認する。距離は最大fare累積に備え64 bit、到達不能は-1、各trainのA/B nodeを取り違えない。

## 復習の核

- 一駅区間、東行き／西行き各一件、乗継で方向反転、同じ駅へ複数経路がある小例を全(s,t)edge展開Dijkstraと比較する。

## 計算量と制約

### 時間

N駅M列車。補助頂点V=O(N+M)、辺E=O(N+M log N)。Dijkstra O(E log V)。

### 空間

range tree、列車node、残余でなく最短路graph O(N+M log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 10^5; 1\leq M\leq 10^5; 0\leq x_1 < x_2 < \ldots < x_N \leq 10^{12}; 1\leq l_i\leq r_i\leq N, 1\leq L_i\leq R_i\leq N; r_i\lt L_i or R_i\lt l_i.; 1\leq c_i\leq 10^{12}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc414/editorial/13415) — source-abc414-editorial-13415-646133a0df99101298dd4bd6ddef428c00978db0f886b827ad90cf9daf76ded8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc414/tasks/abc414_g) — source-abc414-g-problem-79f582a7b52f95ca6db3d84ac26d9bb4bbea8c837443dbb3b5a0492e442a8da5
