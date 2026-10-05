---
title: "ABC362-F — Perfect Matching on a Tree"
draft: true
authoringUnit: {"problemId":"abc362-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc362-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-tree-balanced-separators"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-constructive-witness","tag-tree-balanced-separator"],"sourceRevisionIds":["source-abc362-editorial-10400-67877117f904681bf5f7341a10ea811ab5b7ec1c957d8c63356c59322909a4fe","source-abc362-f-problem-478fb0aa4c449bd520170fcc42b91ee8e62258931e4202c7f8141c16aca91400"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"目的値をpair単位から辺単位へ主客転倒すると、全辺について独立な明確な上界Σmin(c,N−c)が得られる。 各重心子成分が半分以下なので、配列上でfloor(N/2)離れた位置同士は同一blockに入れず、pathは必ず重心側へ抜ける。 全pairが重心を挟む異なる成分に属し、各辺の小さい側の全頂点を外側と組ませて辺ごとの上界を同時達成する。","sourceRevisionIds":["source-abc362-editorial-10400-67877117f904681bf5f7341a10ea811ab5b7ec1c957d8c63356c59322909a4fe","source-abc362-f-problem-478fb0aa4c449bd520170fcc42b91ee8e62258931e4202c7f8141c16aca91400"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。
- [木の均衡分離点から重心分解へ進む](src/content/docs/learn/tree/tree-balanced-separators.md) — 部分木重みから一点の均衡分離点を選ぶ基本を学び、頂点数重みで再帰利用すると各成分が半減して深さを抑えられることを示す。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

matchingの距離総和は、各木辺をまたぐpair数の総和に言い換えられる。辺を切った両側のサイズがc,N−cなら、その辺をまたげるpair数は高々min(c,N−c)である。

重心gを除いた各成分の大きさはfloor(N/2)以下なので、成分ごとに連結した配列を半周ずらしてpairingすると、同じ成分内の二頂点が組にならない。

採用する候補: 重心を求め、子成分単位で並べた頂点列の前半と後半を対応させる。

棄却する候補: 全頂点pairを距離順に並べ、長いものから端点が未使用なら選ぶ。

一般の重み最大matchingの局所貪欲は、長い一組が他の二組を塞ぐため最適性を保証せず、pair列挙も大きい。

部分木サイズから重心gを一つ選ぶ。gを除く各連結成分をDFS順で一つずつ配列Aへ連結し、Nが偶数なら末尾へgを加える。i=0..floor(N/2)−1についてA[i]とA[i+floor(N/2)]をpairとして出力する。

## 典型の発動条件

### 距離和の辺寄与への主客転倒

発動条件: 木上pair距離の和を最大化・最小化するとき。

各辺を何pairが横断するか数え、cut容量から上界を得る。

### 重心blockの半周pairing

発動条件: 各groupの大きさが全体の半分以下で異group同士を完全に組みたいとき。

groupを連結配置し、列の半分だけずらした対応を取る。

## 問題固有の要素

一つのmatchingが全ての辺のcut上界を同時に達成する構成を、重心が保証する。

別の問題へ持ち帰る視点: 上界を辺ごとに足したら、各局所上界を同時達成するglobal structureを探す。

## 正当性

目的値をpair単位から辺単位へ主客転倒すると、全辺について独立な明確な上界Σmin(c,N−c)が得られる。 各重心子成分が半分以下なので、配列上でfloor(N/2)離れた位置同士は同一blockに入れず、pathは必ず重心側へ抜ける。 全pairが重心を挟む異なる成分に属し、各辺の小さい側の全頂点を外側と組ませて辺ごとの上界を同時達成する。

## 実装上の注意

- 奇数Nでは重心を配列へ入れず一頂点を未使用にし、偶数Nでは加えて配列長をNにする。成分の頂点は必ず連続blockとして並べる。

## 復習の核

- path木とstar木で配列blockと半周対応を書き、同一成分pairが生じない証明を確認する。偶奇の重心扱いを分離して実装する。

## 計算量と制約

### 時間

O(N)、重心と子成分DFS列、半周pair。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq u_i < v_i \leq N; The input graph is a tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc362/editorial/10400) — source-abc362-editorial-10400-67877117f904681bf5f7341a10ea811ab5b7ec1c957d8c63356c59322909a4fe
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc362/tasks/abc362_f) — source-abc362-f-problem-478fb0aa4c449bd520170fcc42b91ee8e62258931e4202c7f8141c16aca91400
