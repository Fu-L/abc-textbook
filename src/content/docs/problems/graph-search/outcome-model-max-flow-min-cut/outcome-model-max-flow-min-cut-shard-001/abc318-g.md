---
title: "ABC318-G — Typical Path Problem"
draft: true
authoringUnit: {"problemId":"abc318-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc318-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc318-editorial-7085-33833b825d1c9ced27b2d5f524fd6210757fdcc2f6ae23f60bd67dbe31353296","source-abc318-g-problem-b99eb01993a865b14e04e67ffcb2c77c8384770c173ec51a8f0ebf4b94438268"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"整数flow2はBからA,Cへの二pathへ分解できる。B以外のvertex容量1が共有を禁じ、sink辺各1が別の終点を強制する。二pathを逆と順に結べばBを通るA–C simple pathであり、逆変換も可能。","sourceRevisionIds":["source-abc318-editorial-7085-33833b825d1c9ced27b2d5f524fd6210757fdcc2f6ae23f60bd67dbe31353296","source-abc318-g-problem-b99eb01993a865b14e04e67ffcb2c77c8384770c173ec51a8f0ebf4b94438268"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

A→…→B→…→C の単純路は、B から A と C へ向かう二本の path が B 以外で頂点を共有しないことと同値である。辺素な二路では不十分で、共有禁止対象は頂点なので、各頂点へ容量1を課す vertex splitting が必要になる。source→B_out だけ容量2、A_out/C_out→sink は各1、他頂点の in→out を1にすれば、終点も異なる二本を要求できる。無向辺 {u,v} は u_out→v_in と v_out→u_in に変換し、flow decomposition から元 graph の内部頂点素な path を復元できる。

採用する候補: 各頂点を in/out に分け容量1の辺で結び、B から A,C へ合計2流す最大流判定を行う。

整数流は二本の path に分解でき、頂点容量により B 以外の共有を正確に禁止できる。流量上限2なので実質 O(N+M) である。

棄却する候補: BFS で B→A の一本を取り、その内部頂点を削除して B→C を探す。

最初に選んだ path が別の選択可能な二路を塞ぐことがあり、任意の一経路を固定する貪欲は完全でない。

2N+2 頂点の network を作る。各 v に v_in→v_out 容量1（B は source から B_out へ容量2）、各無向辺を両方向の out→in 容量1で張る。A_out,C_out から sink へ容量1を張り、max flow が2なら Yes、未満なら No とする。

## 典型の発動条件

### vertex-disjoint paths の最大流帰着

発動条件: 複数 path が端点以外の頂点を共有しない条件を判定するとき。

vertex splitting の内部辺へ容量1を置き、各 path を単位 flow とする。

### 単純路の中心分割

発動条件: 指定三頂点を順に通る一つの単純路の存在を問うとき。

中央頂点で二本に分け、内部頂点素という同値条件へ変える。

## 問題固有の要素

求める一つの path を直接構築するより、B を source とする二 commodity が同じ単一 commodity flow として扱える。

別の問題へ持ち帰る視点: 順序付き指定点 path は中央で切り、disjoint paths の標準帰着が使えないか見る。

## 正当性

整数flow2はBからA,Cへの二pathへ分解できる。B以外のvertex容量1が共有を禁じ、sink辺各1が別の終点を強制する。二pathを逆と順に結べばBを通るA–C simple pathであり、逆変換も可能。

## 実装上の注意

- B の容量だけ2を許し、A/C の sink 辺は別々に1とする。無向辺を両向きに張った残余辺と混同しない。

## 復習の核

- edge-disjoint と vertex-disjoint を区別し、共有禁止箇所に容量を置く。max flow 2から元の二路へ戻せることまで確認する。

## 計算量と制約

### 時間

N頂点M辺、流量上限2。二回augment BFS/DFSで O(N+M)。

### 空間

split graphと残余辺 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2\times 10^5; N-1\leq M\leq\min\left(\frac{N(N-1)}{2},2\times 10^5\right); 1\leq A,B,C\leq N; A, B, and C are all distinct.; 1\leq U_i<V_i\leq N; The pairs (U_i,V_i) are all distinct.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/editorial/7085) — source-abc318-editorial-7085-33833b825d1c9ced27b2d5f524fd6210757fdcc2f6ae23f60bd67dbe31353296
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/tasks/abc318_g) — source-abc318-g-problem-b99eb01993a865b14e04e67ffcb2c77c8384770c173ec51a8f0ebf4b94438268
