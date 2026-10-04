---
title: "ABC266-F — Well-defined Path Queries on a Namori"
draft: true
authoringUnit: {"problemId":"abc266-f","docPath":"src/content/docs/problems/graph-search/outcome-peel-graph-core/outcome-peel-graph-core-shard-001/abc266-f.md","learningOutcomeIds":["outcome-peel-graph-core"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["単一サイクル成分とgraph coreの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-graph-core-peeling"],"sourceRevisionIds":["source-abc266-f-problem-5992d9a9ee4e8b9a4ce33e0323027d0a7fde7d95662c312f5641ce75e3fada26","source-abc266-editorial-4698-46499cc8514943a5473d140e1c568a02ae8abf14da72fdb07742342c3d5c219c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一意cycleを除く枝は木でcycle根へ唯一のpathを持つ。同じ根の木内はunique path、異なる根間はcycle両方向の二path。cycle頂点を別rootとして枝全体へラベルを伝えると一致判定が必要十分。","sourceRevisionIds":["source-abc266-f-problem-5992d9a9ee4e8b9a4ce33e0323027d0a7fde7d95662c312f5641ce75e3fada26","source-abc266-editorial-4698-46499cc8514943a5473d140e1c568a02ae8abf14da72fdb07742342c3d5c219c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単一サイクル成分とgraph core](src/content/docs/learn/graph/graph-core.md)

- 連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。

## 考察

連結N頂点N辺の無向グラフは閉路をちょうど一つ持ち、その各閉路頂点へ木が付いたなもりグラフである。 同じ閉路頂点に付く木の中の二頂点間は一意pathだが、異なる閉路根に属すれば閉路を回る二方向がある。 leaf pruning後に残る2-coreはこのグラフでは唯一のcycleそのものである。

棄却する候補: 各queryで一方からDFSし、単純pathを二本以上見つけるまで探索する。

Q回の全グラフ探索は大きく、単純path列挙自体も不要である。

採用する候補: 次数1頂点を反復削除してcycle頂点を抽出し、各cycle頂点からcycle辺を越えない探索で全頂点へ根labelを付ける。

queryの一意性は二頂点の所属cycle根labelが等しいかだけで判定できる。

leaf pruning後に残る2-coreはこのグラフでは唯一のcycleそのものである。

unicyclic graphをcore cycleとrooted-tree componentsへ分解し、path multiplicity queryをcomponent label equalityへ圧縮する。

## 典型の発動条件

### 次数1除去によるcycle抽出

発動条件: 連結unicyclic graphの唯一cycle上の頂点を求めたいとき。

degree 1をqueueへ入れ、削除に伴い新たにdegree 1になった頂点を反復処理する。

### core頂点を根とする成分labeling

発動条件: cycleやcoreの各頂点に木が付いた構造で、どの根へ属すかを多数照会するとき。

各core頂点を異なるsourceとして、core間辺を使わずDFS/BFSしてroot labelを配る。

## 問題固有の要素

cycle上の頂点自身も自分を根labelとして持つため、cycle頂点とその付属木の頂点のqueryも同じ等値判定で扱える。

別の問題へ持ち帰る視点: core+branches分解ではcore要素も各branch componentの代表として含めると境界caseを統一できる。

## 正当性

一意cycleを除く枝は木でcycle根へ唯一のpathを持つ。同じ根の木内はunique path、異なる根間はcycle両方向の二path。cycle頂点を別rootとして枝全体へラベルを伝えると一致判定が必要十分。

## 実装上の注意

- pruningでは現在degreeを減らし、queueから除かれなかった頂点をcycle flagとして残す。
- label探索では隣接する別cycle頂点へ進まず、各非cycle頂点を一度だけ訪問する。

## 復習の核

- N頂点N辺の連結グラフを見たら、唯一cycleと付属木へ分解してqueryの本質を探す。
- path本数を直接数えず、cycleへ入るrootが同じかどうかで代替できないか確認する。

## 計算量と制約

### 時間

N 頂点N辺、Q質問。leaf peelingとrootラベル O(N)、各質問 O(1)。

### 空間

木付きcyclegraph、ラベル O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2 \times 10^5; 1 \leq u_i < v_i\leq N; (u_i,v_i) \neq (u_j,v_j) if i \neq j.; G is a connected simple undirected graph with N vertices and N edges.; 1 \leq Q \leq 2 \times 10^5; 1 \leq x_i < y_i\leq N; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/tasks/abc266_f) — source-abc266-f-problem-5992d9a9ee4e8b9a4ce33e0323027d0a7fde7d95662c312f5641ce75e3fada26
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc266/editorial/4698) — source-abc266-editorial-4698-46499cc8514943a5473d140e1c568a02ae8abf14da72fdb07742342c3d5c219c
