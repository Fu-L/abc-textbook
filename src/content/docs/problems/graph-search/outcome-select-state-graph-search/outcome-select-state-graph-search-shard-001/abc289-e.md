---
title: "ABC289-E — Swap Places"
draft: true
authoringUnit: {"problemId":"abc289-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc289-e.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc289-e-problem-0a4e1dff9cb9abbea54c09115823b35955c8dff42df604789622e9836c48af09","source-abc289-editorial-5726-2208a3d56b3cfb0f7cc7690336323f83880ed60654819f8d17bb6eb5a8faa24a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同時移動後の二位置が未来の合法性を完全に決める。neighbor pairで異色destinationだけ通すことで一回の操作とtransitionが一致し、cost1のBFSが最小同時手数。初期(1,N)から目的(N,1)を探す。","sourceRevisionIds":["source-abc289-e-problem-0a4e1dff9cb9abbea54c09115823b35955c8dff42df604789622e9836c48af09","source-abc289-editorial-5726-2208a3d56b3cfb0f7cc7690336323f83880ed60654819f8d17bb6eb5a8faa24a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

1回の同時移動後の状況はTakahashiの頂点uとAokiの頂点vのpairだけで決まり、状態数はN^2に収まる。 状態(u,v)からはx∈adj(u),y∈adj(v)かつC_x≠C_yのときだけ(x,y)へ遷移し、各遷移costは1である。 全状態から調べるneighbor pair数の総和はΣ_{u,v}deg(u)deg(v)=(2M)^2なので、product graphを明示的に全密生成しなくても制約内で列挙できる。 元graphの1本ずつのedge選択をCartesian productにすると、2人のsimultaneous moveが通常の1-step edgeになる。 color条件は現在位置ではなく移動先x,yに課されるため、neighbor pair生成後にC_x≠C_yをfilterする。

採用する候補: 2人の現在頂点pairを頂点とするproduct graph上で、(1,N)から(N,1)へBFSする。

同時性と移動先color制約を1本の状態遷移に正確に表し、unit costの最小手数を得られる。

棄却する候補: 各人について1→NとN→1の最短pathを独立に求め、長さを合わせる。

各時刻の2つの移動先colorが異なるという結合制約を独立pathでは保証できない。

棄却する候補: N^2状態間の全pairを調べて遷移matrixを構築する。

状態対はN^4個だが、実際の遷移は元graphのadjacency pairだけを走査すればよい。

元graphの1本ずつのedge選択をCartesian productにすると、2人のsimultaneous moveが通常の1-step edgeになる。

color条件は現在位置ではなく移動先x,yに課されるため、neighbor pair生成後にC_x≠C_yをfilterする。

distをN×Nの-1で初期化し、queueへ(1,N)を距離0で入れる。popした(u,v)についてadj[u]×adj[v]を走査し、色が異なる未訪問(x,y)へdist+1で遷移する。BFS終了後のdist[N][1]を出力し、未訪問なら-1とする。test caseごとに配列を初期化する。

## 典型の発動条件

### product graph BFS

発動条件: 複数主体が同期して動き、次状態が各主体位置のtupleで決まるとき。

位置pairを1頂点として同時遷移をunit edgeへ変換する。

### 次数和による遷移総数評価

発動条件: 各tuple状態でadjacency集合の直積を列挙するとき。

Σdegの積へ総列挙量を因数分解してMだけで上界を出す。

## 問題固有の要素

N^2状態という見かけだけでなく、各状態のdeg(u)deg(v)を全体で足すと4M^2になるため、疎な元graphの利点がproduct graphでも残る。

別の問題へ持ち帰る視点: 直積遷移の計算量は最大次数で粗く掛けず、全状態にわたる積和を次数和へ変形して評価する。

## 正当性

同時移動後の二位置が未来の合法性を完全に決める。neighbor pairで異色destinationだけ通すことで一回の操作とtransitionが一致し、cost1のBFSが最小同時手数。初期(1,N)から目的(N,1)を探す。

## 実装上の注意

- N^2距離arrayのflatten indexをu*N+vなどで一貫させ、test case間でvisitedを残さない。
- 移動先2頂点のcolorが異なるかを判定し、元graphがundirectedなのでadjacencyを両方向へ追加する。

## 復習の核

- 片方だけなら到達できるが同時color条件で詰まる小graphを作り、(u,v)から生成するadj[u]×adj[v]とgoal pairの順序を確認する。

## 計算量と制約

### 時間

N 頂点、M 無向辺。状態N²、neighbor pair総数(2M)²、全体 O(N²+M²)。

### 空間

pair distとqueue O(N²)、元隣接 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 1000; 2 \leq N \leq 2000; 1 \leq M \leq \min(\frac{N(N-1)}{2}, 2000); C_i \in \lbrace 0, 1 \rbrace; 1 \leq u_i, v_i \leq N; The graph given in the input is simple.; All values in the input are integers.; The sum of N over all test cases does not exceed 2000.; The sum of M over all test cases does not exceed 2000.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/tasks/abc289_e) — source-abc289-e-problem-0a4e1dff9cb9abbea54c09115823b35955c8dff42df604789622e9836c48af09
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/editorial/5726) — source-abc289-editorial-5726-2208a3d56b3cfb0f7cc7690336323f83880ed60654819f8d17bb6eb5a8faa24a
