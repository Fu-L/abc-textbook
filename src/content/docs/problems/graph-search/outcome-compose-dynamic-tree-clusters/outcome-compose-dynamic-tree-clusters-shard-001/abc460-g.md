---
title: "ABC460-G — Vertex Flip Query"
draft: true
authoringUnit: {"problemId":"abc460-g","docPath":"src/content/docs/problems/graph-search/outcome-compose-dynamic-tree-clusters/outcome-compose-dynamic-tree-clusters-shard-001/abc460-g.md","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rerooting","unit-rooted-tree-aggregation"],"excludedTopics":["更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。"],"tagIds":["tag-static-top-tree","tag-rerooting"],"sourceRevisionIds":["source-abc460-editorial-21012-6211d79b0247de51b5bce8908f4941d08e93e10351948ee7572b8ad47d17609a","source-abc460-g-problem-8a4e2da0f88034c47040b8ff47d390445e433f0c72add4595cfba8620b77b27c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"clusterの各境界へ同色pathでつながる頂点重み和と両境界同色連結の情報を持つ。色不一致の境界では寄与を止め、同色なら頂点重複分を調整して加算すると元の同色component和と一致する。両向きを保てば任意query root周辺clusterを正しい向きで合成できる。flip/加算はleaf値だけ変えmerge祖先再計算で不変条件を回復する。","sourceRevisionIds":["source-abc460-editorial-21012-6211d79b0247de51b5bce8908f4941d08e93e10351948ee7572b8ad47d17609a","source-abc460-g-problem-8a4e2da0f88034c47040b8ff47d390445e433f0c72add4595cfba8620b77b27c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、W=(2,3,5),C=(0,0,1)。質問1、flip2、質問1と3、W3へ4加算後質問3。","procedure":["初期1の同色成分は{1,2}で5。","flip2後は{1}と{2,3}で和2,8。","3加算後{2,3}の和は12。"],"executionTarget":null,"expectedResult":"5,2,8,12","verificationStatus":"not_applicable","learningUnitIds":["unit-static-top-tree"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"prerequisiteIds":["unit-rerooting","unit-rooted-tree-aggregation"],"attainmentCondition":"path要約を片方向だけ持てばquery3も正しいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"固定rootのhashは可能でも任意rootでは逆向きにcomponentを合成する必要がある。両boundary向きを保持する。"},"answer":{"reasoningOrVerification":"固定rootのhashは可能でも任意rootでは逆向きにcomponentを合成する必要がある。両boundary向きを保持する。","procedure":["具体例の各状態・寄与を再計算する。","固定rootのhashは可能でも任意rootでは逆向きにcomponentを合成する必要がある。両boundary向きを保持する。"],"expectedResult":"固定rootのhashは可能でも任意rootでは逆向きにcomponentを合成する必要がある。両boundary向きを保持する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rake・compressで動的木DPを保つ](src/content/docs/learn/tree/static-top-tree.md)

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [rerooting・全方位木DP](src/content/docs/learn/tree/rerooting.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 考察

求める値はquery頂点と同色の連結成分の重み和。色flipは複数辺の同色接続を変えるため通常DSUでは分裂を扱えない。重み加算も同じ頂点leaf更新へ統一できる。固定木を深さ対数のStatic Top Treeへ分解し、二boundaryの色・同色連結・各方向の到達重み和を保持する。query頂点を根として周囲clusterを両方向から合成すると同色componentの和を得る。

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

clusterの各境界へ同色pathでつながる頂点重み和と両境界同色連結の情報を持つ。色不一致の境界では寄与を止め、同色なら頂点重複分を調整して加算すると元の同色component和と一致する。両向きを保てば任意query root周辺clusterを正しい向きで合成できる。flip/加算はleaf値だけ変えmerge祖先再計算で不変条件を回復する。

## 実装上の注意

操作は色flip、重み加算、同色component和の三種類。色と重みのどちらの変更もleafを更新する。cluster境界頂点の重複重みを二度加えず、両向きの要約とboundary順を揃える。重み和は64bitで保持する。

## 復習の核

- 小木をcluster分解し、同じpath clusterを両端rootとして評価した二つの要約がreroot queryでどう使われるか確認する。

## 計算量と制約

### 時間

N頂点Q操作。Static Top Tree構築O(N)、flip・重み加算・任意root照会 O(log N)、全体O(N+Qlog N)。

### 空間

木と定数境界要約cluster O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq W_i \leq 10^9; C_i \in \lbrace 0,1 \rbrace; 1 \leq a_i \lt b_i \leq N; The input graph is a tree.; 1 \leq v \leq N; 1 \leq x \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、W=(2,3,5),C=(0,0,1)。質問1、flip2、質問1と3、W3へ4加算後質問3。

1. 初期1の同色成分は{1,2}で5。
2. flip2後は{1}と{2,3}で和2,8。
3. 3加算後{2,3}の和は12。

期待される結果: 5,2,8,12

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

path要約を片方向だけ持てばquery3も正しいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

固定rootのhashは可能でも任意rootでは逆向きにcomponentを合成する必要がある。両boundary向きを保持する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/editorial/21012) — source-abc460-editorial-21012-6211d79b0247de51b5bce8908f4941d08e93e10351948ee7572b8ad47d17609a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc460/tasks/abc460_g) — source-abc460-g-problem-8a4e2da0f88034c47040b8ff47d390445e433f0c72add4595cfba8620b77b27c
