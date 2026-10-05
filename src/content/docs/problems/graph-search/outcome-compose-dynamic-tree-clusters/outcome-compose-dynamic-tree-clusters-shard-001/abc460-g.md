---
title: "ABC460-G — Vertex Flip Query"
draft: true
authoringUnit: {"problemId":"abc460-g","docPath":"src/content/docs/problems/graph-search/outcome-compose-dynamic-tree-clusters/outcome-compose-dynamic-tree-clusters-shard-001/abc460-g.md","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rerooting","unit-rooted-tree-aggregation"],"excludedTopics":["更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。"],"tagIds":["tag-static-top-tree","tag-rerooting"],"sourceRevisionIds":["source-abc460-editorial-21012-6211d79b0247de51b5bce8908f4941d08e93e10351948ee7572b8ad47d17609a","source-abc460-g-problem-8a4e2da0f88034c47040b8ff47d390445e433f0c72add4595cfba8620b77b27c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"子clusterは内部頂点が重ならず、交わるのはboundaryだけである。合成時の定数サイズgraphは、子が表す同色pathと共有頂点での接続を全て表すため、その連結成分は親の同色componentと一致する。内部重みは子のcomponentごとに一度、内部化する共有頂点について一度だけ加えるので重複しない。帰納的に全boundary色割当の表が正しい。色・重みは所有mergeに固定され、他の表ではboundary変数として扱われるため、一点更新の祖先再計算で全不変条件が回復する。queryでvをboundaryへ残した再合成は同じ不変条件を使い、最後に全体のv同色componentを得る。","sourceRevisionIds":["source-abc460-editorial-21012-6211d79b0247de51b5bce8908f4941d08e93e10351948ee7572b8ad47d17609a","source-abc460-g-problem-8a4e2da0f88034c47040b8ff47d390445e433f0c72add4595cfba8620b77b27c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rake・compressで動的木DPを保つ](src/content/docs/learn/tree/static-top-tree.md)

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

先に読む単元:

- [rerooting・全方位木DP](src/content/docs/learn/tree/rerooting.md) — 根付き木DP・部分木集約で得た考え方と実装を再利用し、rerooting・全方位木DPの発動条件・正当化・境界を重複なく学ぶ。
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 考察

固定木を頂点数の重みでbalancedなStatic Top Treeへ分解する。単にheavy pathを個数の半分で割ると深さlog²Nになる場合があるので、配下の頂点数による重み付きrake/compressを使い、深さO(log N)を保証する。構築方法は学習UnitとABC351 Gのrake/compressへ接続する。

cluster Cは外側との接点であるboundaryを高々二つ持つ。boundaryの色はまだ固定せず、各色割当（高々4通り）について、(1)boundary同士が同色pathで連結か、(2)各boundaryの同色componentに含まれる内部頂点の重み和、を保存する。boundary自身の重みは含めない。同じcomponentに両boundaryが入る場合は同じ集合の和なので、後のmergeで二つを足さない。内部に閉じてboundaryへ届かないcomponentは将来のqueryへ寄与しない。

C1,C2が頂点wで合流するとき、wと外側boundaryだけの定数サイズgraphを作る。各子の連結フラグを辺として同色componentをunionし、子に含まれる内部componentの重みを一度ずつ足す。wが親の内部になるなら、その色をC_wへ固定し重みW_wを一度加える。wが親boundaryに残るなら色は割当変数のままで、重みもまだ加えない。これを親boundaryの全色割当で実行するのがrake/compressの合成式である。

各頂点の色・重みは、その頂点が初めて内部になるmerge（または全体のrootを閉じる位置）にだけ所有させる。boundaryでは全色を仮定しているため、色flipを辺ごとの更新へ展開する必要はない。所有nodeを変更し祖先を再計算するとO(log N)で更新できる。

頂点vのcomponent和を求めるときは、vの所有nodeから根へ至るO(log N)個の兄弟clusterを再合成し、vを最後までboundaryとして残す。途中ではvと元のboundaryが高々三つなので、定数サイズ表で合成できる。全体をboundary v一つへ閉じ、色をC_vに固定した内部和にW_vを一度加える。照会後に元のclusterは変更しない。

## 典型の発動条件

### static top tree

発動条件: 固定treeの局所更新に対しglobalまたは部分tree DPを動的維持したいとき。

treeを深さ対数のcluster二分木へ分解してsegment tree同様に再計算する。

### 動的rerooting DP

発動条件: 更新後に任意頂点をrootとしたtree DP値を取得したいとき。

clusterの両boundary向き要約を持ち、root周囲成分をO(log N)個で合成する。

## 問題固有の要素

tree DPの動的化は、DP式だけでなくtree自体をbalancedなmerge treeへ持ち上げることで一点更新を局所化できる。

別の問題へ持ち帰る視点: rerootingを動的にするには、一方向要約ではなくboundaryごとの向きを反転可能な要約が必要になる。

## 正当性

子clusterは内部頂点が重ならず、交わるのはboundaryだけである。合成時の定数サイズgraphは、子が表す同色pathと共有頂点での接続を全て表すため、その連結成分は親の同色componentと一致する。内部重みは子のcomponentごとに一度、内部化する共有頂点について一度だけ加えるので重複しない。帰納的に全boundary色割当の表が正しい。色・重みは所有mergeに固定され、他の表ではboundary変数として扱われるため、一点更新の祖先再計算で全不変条件が回復する。queryでvをboundaryへ残した再合成は同じ不変条件を使い、最後に全体のv同色componentを得る。

## 実装上の注意

boundaryの重みを子にも親にも含めない。内部化するnodeが一度だけ所有する。同色連結した二boundaryの内部和を二重加算しない。queryでは照会頂点を追加boundaryに残し、最終的にその色を固定する。和は64bit、分解の深さは頂点数の重みで保証する。

## 復習の核

- 小木をcluster分解し、同じpath clusterを両端rootとして評価した二つの要約がreroot queryでどう使われるか確認する。

## 計算量と制約

### 時間

N頂点Q操作。Static Top Tree構築O(N)、flip・重み加算・任意root照会 O(log N)、全体O(N+Qlog N)。

### 空間

木と定数境界要約cluster O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq W_i \leq 10^9; C_i \in \lbrace 0,1 \rbrace; 1 \leq a_i \lt b_i \leq N; The input graph is a tree.; 1 \leq v \leq N; 1 \leq x \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/editorial/21012) — source-abc460-editorial-21012-6211d79b0247de51b5bce8908f4941d08e93e10351948ee7572b8ad47d17609a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/tasks/abc460_g) — source-abc460-g-problem-8a4e2da0f88034c47040b8ff47d390445e433f0c72add4595cfba8620b77b27c
