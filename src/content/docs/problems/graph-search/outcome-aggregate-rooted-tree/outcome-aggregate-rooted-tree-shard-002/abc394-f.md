---
title: "ABC394-F — Alkane"
draft: true
authoringUnit: {"problemId":"abc394-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc394-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc394-editorial-12283-9e8571a67606edb0bccda0297d83e847959ade1d8be2cc5bd09640e922dc4649","source-abc394-f-problem-1f2184925d9f211ba2d82c8f61da0fd467a120bd7c86f6a34980aa4dcab2c8fa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"親辺込み部分解では頂点は子0個の葉または子3個の次数4内部点である。子解は独立なので上位3個が最適。完成根は子4個の内部点の場合と子1個の葉の場合を検査する。これで任意の採用木の最高点を網羅し、サイズ5以上の最大値が条件を満たす。","sourceRevisionIds":["source-abc394-editorial-12283-9e8571a67606edb0bccda0297d83e847959ade1d8be2cc5bd09640e922dc4649","source-abc394-f-problem-1f2184925d9f211ba2d82c8f61da0fd467a120bd7c86f6a34980aa4dcab2c8fa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

treeのsubgraphがconnectedなら選んだ頂点集合に対するedgeは一意で、各頂点の採用degreeを1または4にすればよい。親edgeを使う向き付き部分解では、頂点vはleafとして子0個を選ぶか、degree4として子3個を選ぶかの二択になる。dp[v]は親edge込みでvの最終degreeが1または4になる部分木なので、値1か1+上位3 child dpである。完成alkaneの最上位vは親edgeを持たないためdegree4なら上位4 child dpを結ぶ。頂点数5以上ならdegree4を少なくとも一つ含む。

採用する候補: 親へ接続する広義alkaneの最大sizeをtree DPし、top vertexで4枝を結合する

各vでchild dpの大きい3本または4本だけが必要で、全edgeを定数回処理してO(N)で最大subtreeを求められる。

棄却する候補: alkane候補の頂点subsetを列挙してdegreeを検査する

treeでもconnected subsetは指数個あり、degree条件の局所性を利用していない。

頂点数5以上ならdegree4を少なくとも一つ含む。

任意rootでpostorderする。各vの正のchild dpを降順に取り、dp[v]=max(1,1+top3 sum)を計算する。同時にvを完成rootとする1+top4 sum等で最大を更新し、最大が5未満なら-1を出す。

## 典型の発動条件

### tree DPのopen/closed state

発動条件: 親辺を後から接続してdegree条件が完成する部分構造を扱うとき。

親接続ありdpと完成root評価を分ける。

### 上位k childの選択

発動条件: nodeが固定本数の枝だけ採用し、枝寄与が独立加法的なとき。

child dpの上位3/4本だけを足す。

## 問題固有の要素

degree 1/4条件を親辺の有無で分解すると、内部nodeの必要child数が常に3、完成rootだけ4となる。

別の問題へ持ち帰る視点: 固定degree部分木では、parent connectionを一本予約したopen stateを設計すると局所遷移になる。

## 正当性

親辺込み部分解では頂点は子0個の葉または子3個の次数4内部点である。子解は独立なので上位3個が最適。完成根は子4個の内部点の場合と子1個の葉の場合を検査する。これで任意の採用木の最高点を網羅し、サイズ5以上の最大値が条件を満たす。

## 実装上の注意

- dp[v]=1のleaf選択は常に可能だが、完成答えはdegree4頂点を含むsize≥5だけ。child数不足時にtop3/4を使わない。

## 復習の核

- path、star(degree3/4/5)、二つの高degree頂点を結ぶ木を手計算し、size1の広義解を誤って答えにしないことを確認する。

## 計算量と制約

### 時間

N 頂点。子上位4個の走査保持なら O(N)、全子 sort なら O(N log N)。

### 空間

木と親辺込み DP で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i, B_i \leq N; The given graph is an undirected tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc394/editorial/12283) — source-abc394-editorial-12283-9e8571a67606edb0bccda0297d83e847959ade1d8be2cc5bd09640e922dc4649
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc394/tasks/abc394_f) — source-abc394-f-problem-1f2184925d9f211ba2d82c8f61da0fd467a120bd7c86f6a34980aa4dcab2c8fa
