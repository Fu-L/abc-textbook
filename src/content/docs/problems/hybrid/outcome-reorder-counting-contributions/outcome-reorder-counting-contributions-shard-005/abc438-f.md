---
title: "ABC438-F — Sum of Mex"
draft: true
authoringUnit: {"problemId":"abc438-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-005/abc438-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation","unit-tree-ancestor-lca"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-rooted-tree-aggregation","tag-tree-ancestor-lca"],"sourceRevisionIds":["source-abc438-editorial-14945-5b550b2de40d2ca4f196bf74e42d0f92dd97ea873ccf9c1f5404cd218db4f85a","source-abc438-f-problem-33efc20bf1a34d46b6cc580c1b44876a5bccb6ce94cd9910ebf6de744700d238"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"mexのtail条件f(i,j)≥kは頂点0,…,k−1が全てpath上にあること。必須集合が一本のpathへ含まれる間はその両端だけを保持でき、三叉になったら以後の集合も含められない。端点が異なれば両端から外へ伸びる二成分から選ぶendpoint pairが必須pathを含む全候補と一対一対応する。同端点の場合はその頂点を避ける各隣接成分内のpairを全pairから引く。これをk=1..Nで足してmex総和となる。","sourceRevisionIds":["source-abc438-editorial-14945-5b550b2de40d2ca4f196bf74e42d0f92dd97ea873ccf9c1f5404cd218db4f85a","source-abc438-f-problem-33efc20bf1a34d46b6cc580c1b44876a5bccb6ce94cd9910ebf6de744700d238"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"三頂点path0-1-2、i≤jのpath mexを足す。","procedure":["0を含むpathは00,01,02でmex1,2,3。","残り11,12,22のmexは0。c1,c2,c3は3,2,1。"],"executionTarget":null,"expectedResult":"mex総和6。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-rooted-tree-aggregation","unit-tree-ancestor-lca"],"attainmentCondition":"必須頂点が三叉の別々の枝へ広がったら後のkで復活するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一つのpathで三枝を含められず、必須集合は増えるだけなので以後のtail countは全て0。"},"answer":{"reasoningOrVerification":"一つのpathで三枝を含められず、必須集合は増えるだけなので以後のtail countは全て0。","procedure":["具体例の各状態・寄与を再計算する。","一つのpathで三枝を含められず、必須集合は増えるだけなので以後のtail countは全て0。"],"expectedResult":"一つのpathで三枝を含められず、必須集合は増えるだけなので以後のtail countは全て0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)
- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

mexは0から始まるのでtail count c_kは必須頂点0,…,k−1を含むpath数である。kの走査では頂点k−1を追加する。必須集合の最小pathの両端を距離等式で維持し、分岐したら以後0。異端点なら両外側成分sizeの積、同端点ならその頂点を含む全unordered pair数を用いてc_kを得る。

## 典型の発動条件

### tail-sum 公式

発動条件: 非負整数値の総和を閾値以上となる対象数へ変換したいとき。

mex の値 k ごとの直接分類を、0…k-1 が全てパスにある条件へ変える。

### パス集合の増分維持

発動条件: 木上の頂点を一つずつ追加し、それら全てを含む一本のパスが存在するか判定するとき。

現在の極端二頂点だけを持ち、新頂点が延長可能か LCA/距離で調べる。

### 部分木サイズによるパス包含組数

発動条件: 固定パスを包含する端点対の個数を数えるとき。

両端の外側成分サイズを求め、その直積として数える。

## 問題固有の要素

mex 総和を閾値条件へ変えると、『小番号頂点集合が一本の木パスに載るか』という幾何的な増分問題になる。

別の問題へ持ち帰る視点: 木上の点集合がパスに収まるなら、集合の情報はその最小包含パスの二端点へ圧縮できる。

## 正当性

mexのtail条件f(i,j)≥kは頂点0,…,k−1が全てpath上にあること。必須集合が一本のpathへ含まれる間はその両端だけを保持でき、三叉になったら以後の集合も含められない。端点が異なれば両端から外へ伸びる二成分から選ぶendpoint pairが必須pathを含む全候補と一対一対応する。同端点の場合はその頂点を避ける各隣接成分内のpairを全pairから引く。これをk=1..Nで足してmex総和となる。

## 実装上の注意

- 頂点番号 k の追加と c_k が要求する集合 0…k-1 の添字をずらさない。x=y の退化ケース、i≤j の unordered pair 数、根方向成分サイズを正しく数える。

## 復習の核

- tail-sum の k と端点更新順、固定 x-y パスを含む端点対の成分積が i≤j を一度ずつ数えることを確認する。

## 計算量と制約

### 時間

O(N log N)、LCAと各端点更新・外側成分取得。

### 空間

O(N log N)、binary lifting。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le 2\times 10^5; 0\le u_i < v_i < N; The graph given in the input is a tree.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

三頂点path0-1-2、i≤jのpath mexを足す。

1. 0を含むpathは00,01,02でmex1,2,3。
2. 残り11,12,22のmexは0。c1,c2,c3は3,2,1。

期待される結果: mex総和6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

必須頂点が三叉の別々の枝へ広がったら後のkで復活するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一つのpathで三枝を含められず、必須集合は増えるだけなので以後のtail countは全て0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/editorial/14945) — source-abc438-editorial-14945-5b550b2de40d2ca4f196bf74e42d0f92dd97ea873ccf9c1f5404cd218db4f85a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/tasks/abc438_f) — source-abc438-f-problem-33efc20bf1a34d46b6cc580c1b44876a5bccb6ce94cd9910ebf6de744700d238
