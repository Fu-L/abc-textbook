---
title: "ABC351-G — Hash on Tree"
draft: true
authoringUnit: {"problemId":"abc351-g","docPath":"src/content/docs/problems/graph-search/outcome-compose-dynamic-tree-clusters/outcome-compose-dynamic-tree-clusters-shard-001/abc351-g.md","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-heavy-light-decomposition","unit-rooted-tree-aggregation"],"excludedTopics":["更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。"],"tagIds":["tag-static-top-tree","tag-heavy-light-decomposition"],"sourceRevisionIds":["source-abc351-editorial-9868-860696c2a3056d2d8d8b9c37b1d6efe15564a3b3db133c5619ab4686c81b1c2e","source-abc351-g-problem-db5ec50bcd9264b8596fd6a75bb905bf447b1f1de9e684cb4f1d3be444486fa9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"heavyな子だけを変数に残した木DPはアフィン変換になり、compressの式はF_p(F_c(x))を展開したもの。lightな子の独立な寄与は積なのでrakeで結合できる。各頂点を一度含むcluster分解を帰納的に合成すれば元の木DPと同じ値になる。合成の括弧付けを変更しても、アフィン合成と積の結合則により結果は保存される。重みで釣り合わせた合成木の高さがO(log N)なので、一点変更の影響を受ける合成ノードもO(log N)個である。","sourceRevisionIds":["source-abc351-editorial-9868-860696c2a3056d2d8d8b9c37b1d6efe15564a3b3db133c5619ab4686c81b1c2e","source-abc351-g-problem-db5ec50bcd9264b8596fd6a75bb905bf447b1f1de9e684cb4f1d3be444486fa9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rake・compressで動的木DPを保つ](src/content/docs/learn/tree/static-top-tree.md)

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

先に読む単元:

- [Heavy-Light Decomposition](src/content/docs/learn/tree/heavy-light-decomposition.md) — ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、Heavy-Light Decompositionの発動条件・正当化・境界を重複なく学ぶ。
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 考察

葉ではf_v=A_v、非葉ではf_v=A_v+Π_{子w}f_wという木DPである。一点更新は祖先全体へ波及する。深さNの鎖と次数Nの星の両方を速く処理するには、計算の依存関係そのものを浅い二分木へ組み直す必要がある。

重軽分解し、各頂点のlightな子の値の積をm_vとする。heavyな子の値xを未確定のまま残すと、頂点の変換はF_v(x)=m_v x+A_vになる。heavy pathの最下端の葉だけはF_v(x)=A_vとする。lightな子がない積は1、ただし葉のDPに空積1を足してはならない。

path clusterは未接続の下端の値xから上端へのアフィン変換(a,b)、point clusterはlight部分木の値の積mを持つ。根側pと子側cのcompressは(a_p a_c,a_p b_c+b_p)、rakeはm_1m_2、lightな子の完成pathをpointへ変えるときはその値bを渡す。頂点を追加すれば(m,A_v)、葉なら(0,A_v)になる。積を保持するので、値0の子があっても除算は不要である。

compressはheavy path順を保ち、rakeはlight部分木をまとめる。この二種の合成を、要素数ではなく各clusterが含む元の頂点数を重みにして二分する。例えばpathの重み付き中央の頂点を分離し、左右を再帰的に合成する。rakeも子の部分木サイズを使って重みを釣り合わせる。重みwの部品が全体Wへ合流する深さはO(1+log(W/w))となる。heavy pathをまたぐ各段の比は望遠鏡的に相殺し、light辺の段数もO(log N)なので、一頂点から合成木の根までO(log N)である。

初期化後はA_vを持つ葉の変換だけを更新し、合成木の親を辿って再計算する。根の定数成分がf_rootである。この構造がstatic top treeであり、木の辺追加・削除は必要ない。

## 典型の発動条件

### Static Top Tree による動的木 DP

発動条件: 木構造は固定で頂点値だけ更新され、全体の木 DP 値を毎回求めるとき。

木を深さ O(log N) の二分 cluster merge tree に変換し、DP 合成則を載せる。

### path cluster の affine 作用

発動条件: 一つの未確定 boundary 値を通じて cluster 外部と接続し、DP 式が一次式に閉じるとき。

cluster を ax+b として表し、compress を関数合成にする。

## 問題固有の要素

木 DP の式を速くするのでなく、「木を組み立てる計算グラフ」自体を平衡二分木へ変える発想が核心である。

別の問題へ持ち帰る視点: 静的構造・動的ラベルの全体 DP では、再計算依存 DAG を balance できないか考える。

## 正当性

heavyな子だけを変数に残した木DPはアフィン変換になり、compressの式はF_p(F_c(x))を展開したもの。lightな子の独立な寄与は積なのでrakeで結合できる。各頂点を一度含むcluster分解を帰納的に合成すれば元の木DPと同じ値になる。合成の括弧付けを変更しても、アフィン合成と積の結合則により結果は保存される。重みで釣り合わせた合成木の高さがO(log N)なので、一点変更の影響を受ける合成ノードもO(log N)個である。

## 実装上の注意

- compressの順序は根側の関数が外側、子側が内側。一般には交換できない。
- 葉はf=Aであり、非葉の式へ空積を入れたA+1ではない。
- 各heavy pathを単純な要素数で二分すると全体の高さはO(log²N)になり得る。O(log N)更新を主張するならclusterの頂点数で釣り合わせる。

## 復習の核

木DPの未確定な境界値を変数として残し、有限個の係数で閉じた変換になるかを考える。static top treeはその変換の合成順を平衡化する道具である。

## 計算量と制約

### 時間

N頂点Q更新。balanced Static Top Tree構築 O(N)、各leaf更新O(log N)、全体 O(N+Qlog N)。

### 空間

木とO(N)個定数情報clusterで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq p_i < i; 0 \leq A_i < 998244353; 1 \leq v \leq N; 0 \leq x < 998244353; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/editorial/9868) — source-abc351-editorial-9868-860696c2a3056d2d8d8b9c37b1d6efe15564a3b3db133c5619ab4686c81b1c2e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/tasks/abc351_g) — source-abc351-g-problem-db5ec50bcd9264b8596fd6a75bb905bf447b1f1de9e684cb4f1d3be444486fa9
