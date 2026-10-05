---
title: "ABC307-F — Virus 2"
draft: true
authoringUnit: {"problemId":"abc307-f","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc307-f.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-priority-queue-best-first","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-amortized-monotone-progress","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc307-f-problem-b0089329ba5360617439d21241faf8ca5a32cab672d1540920bcbb7b8136db5c","source-abc307-editorial-6665-f55fde8a54ace843278f8e65b3dbebe27cc579af05ff928f75e6bf0aa7618166"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"dayのsourceは前日まで感染した全頂点で距離0。persistent queueに未感染へ出るedgeを残し、その日の許容Xまで局所Dijkstraするとまさに距離ballを得る。day内新感染からの距離は累積し、次dayには0へリセットする境界情報だけ再利用するため閾値が上下しても正しい。","sourceRevisionIds":["source-abc307-f-problem-b0089329ba5360617439d21241faf8ca5a32cab672d1540920bcbb7b8136db5c","source-abc307-editorial-6665-f55fde8a54ace843278f8e65b3dbebe27cc579af05ff928f75e6bf0aa7618166"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md) — 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

day iの新規感染集合は、前日までの感染verticesをmulti-sourceとするdistance≤X_iのDijkstra ballである。毎日既感染verticesをdistance 0で確定し直す部分は同じなので、感染領域から未感染側へ出るboundary edgesをpersistent priority queueに残せる。当日local Dijkstraで確定したvertexはday iと記録し、そのincident edgesをlocalにはcurrent distance+w、future boundaryにはfresh distance wとして役割別に扱う。priority queue topがX_iを超えたらその日には以後到達不能で、未処理boundary candidatesは次の日へそのまま持ち越せる。

棄却する候補: 各dayに全既感染verticesからmulti-source Dijkstraを最初から実行する。

最悪D(N+M) log Nとなる。

採用する候補: 全日共有のboundary queueと当日用distance queueを持ち、key≤X_iのboundary seedsだけを移してcapped Dijkstraを継続する。

vertexは感染時一度、edgeはboundary/local expansionで全期間定数回しか処理されず償却できる。

## 典型の発動条件

### Dijkstra frontierの再利用

発動条件: source集合が単調に増えるthreshold reachabilityを複数roundで処理するとき。

既確定領域のboundary candidatesを全round共有heapに保持する。

### 全期間での辺処理償却

発動条件: 各vertexが一度だけactiveになり、その時だけincident edgesを展開するprocess。

infection day確定時にedgeを追加し、stale heap entriesをskipして総push数をO(M)に抑える。

## 問題固有の要素

同じ日に感染したvertexはその日の距離探索をさらに中継できるが、次日以降は全員が新しいdistance-0 sourcesになるため二種類のheap keyが必要になる。

別の問題へ持ち帰る視点: round内距離と次roundのsourceからの距離を混同せず、local propagationとpersistent boundaryを分ける。

## 正当性

dayのsourceは前日まで感染した全頂点で距離0。persistent queueに未感染へ出るedgeを残し、その日の許容Xまで局所Dijkstraするとまさに距離ballを得る。day内新感染からの距離は累積し、次dayには0へリセットする境界情報だけ再利用するため閾値が上下しても正しい。

## 実装上の注意

- 既感染vertexへのheap entryはpop時に捨て、day-local distance arrayは当日触れたverticesだけresetする。
- edge weightsとX_iは10^9でpath sumは32 bitを超えるため64 bitを使う。

## 復習の核

- 増加source集合に対する反復shortest pathは、毎回確定済みdistance 0領域を再走査せずfrontierを保存する。
- round内でのみ累積するdistanceと、次roundでresetされるdistanceの意味を別queueで表す。

## 計算量と制約

### 時間

N頂点M辺、日数D。感染時展開とpersistent boundary各辺定数回、heap操作 O((N+M)log(N+M)+D)。

### 空間

隣接、infection day、二frontier heap O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N\leq 3\times 10^5; 0 \leq M\leq 3\times 10^5; 1 \leq U_i < V_i\leq N; All (U_i,V_i) are different.; 1\leq W_i\leq 10^9; 1 \leq K\leq N; 1\leq A_1<A_2<\cdots<A_K\leq N; 1 \leq D\leq 3\times 10^5; 1\leq X_i\leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/tasks/abc307_f) — source-abc307-f-problem-b0089329ba5360617439d21241faf8ca5a32cab672d1540920bcbb7b8136db5c
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc307/editorial/6665) — source-abc307-editorial-6665-f55fde8a54ace843278f8e65b3dbebe27cc579af05ff928f75e6bf0aa7618166
