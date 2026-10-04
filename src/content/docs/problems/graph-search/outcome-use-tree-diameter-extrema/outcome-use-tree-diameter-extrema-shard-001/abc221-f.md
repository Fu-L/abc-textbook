---
title: "ABC221-F — Diameter set"
draft: true
authoringUnit: {"problemId":"abc221-f","docPath":"src/content/docs/problems/graph-search/outcome-use-tree-diameter-extrema/outcome-use-tree-diameter-extrema-shard-001/abc221-f.md","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-metric-diameter","tag-contribution-reordering"],"sourceRevisionIds":["source-abc221-editorial-2723-01dbf678db5978ad71d6df2181e0715eae7f3cf04da07171bc34889c9fd67072","source-abc221-f-problem-512793d11e35b885d25db8856f0a858005fae5fecc133200f64901b517e322ea"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全選択pairが直径距離Dなら端点は中心から半径D/2の点で、同branch二点はD未満になるため高々一つ。奇数中心辺なら両側一点ずつ、偶数中心頂点なら各branchの0/1選択を独立に掛け、0点1点集合を引く。これでsize≥2全有効集合を一意に数える。","sourceRevisionIds":["source-abc221-editorial-2723-01dbf678db5978ad71d6df2181e0715eae7f3cf04da07171bc34889c9fd67072","source-abc221-f-problem-512793d11e35b885d25db8856f0a858005fae5fecc133200f64901b517e322ea"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。

この解説で扱わないこと:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

任意の二赤頂点間距離が木の直径 D なので、赤頂点は直径 path の中心から最大半径にある必要がある。同じ中心側の成分から二頂点を選ぶと path が中心を通らず距離が D 未満になる。 D が奇数なら中心は一本の辺で二成分、D が偶数なら中心は一頂点で隣接 branch が複数ある。サンプル2のように偶数直径では異なる三 branch 以上から一頂点ずつ選ぶ集合も有効になる。 奇数 D では中心辺を切った両側から距離 (D-1)/2 の頂点を一つずつ選ぶしかなく、答えは二側の個数の積になる。 偶数 D では中心 C の各 branch i にある距離 D/2 の頂点数を M_i とすると、各 branch から0または1頂点を選ぶ総数 ∏(M_i+1) から選択数0と1を除けばよい。

採用する候補: 直径 path とその中心を求め、中心辺の両側または中心頂点の各 branch で、中心から距離 D/2 相当の頂点数を数えて組合せを計算する。

全ての赤頂点対が直径になる条件を、中心からの距離と「同じ branch から高々一つ」という独立な選択条件へ変えられる。

棄却する候補: 直径を成す頂点対だけを数え、それを赤集合の個数とする。

D が偶数のときは異なる三つ以上の branch から一頂点ずつ選んだ集合も全ての対が距離 D となり、二頂点集合だけでは不足する。

奇数 D では中心辺を切った両側から距離 (D-1)/2 の頂点を一つずつ選ぶしかなく、答えは二側の個数の積になる。

偶数 D では中心 C の各 branch i にある距離 D/2 の頂点数を M_i とすると、各 branch から0または1頂点を選ぶ総数 ∏(M_i+1) から選択数0と1を除けばよい。

任意点から最遠点 X、X から最遠点 Y を求めて直径 path を復元する。D が奇数なら中央辺を越えない DFS で両側の対象深さ個数を数えて積を取る。偶数なら中心の各隣接 branch ごとに対象深さ個数 M_i を数え、∏(M_i+1)-1-ΣM_i を法 998244353 で求める。

## 典型の発動条件

### 木の直径と中心

発動条件: 全頂点対の最大距離や、互いの距離が直径に等しい頂点集合を扱うとき。

二回の最遠点探索で直径 path を得て、中心頂点または中心辺を基準に構造を分ける。

### branch 独立な選択数え上げ

発動条件: 中心を除く各成分から高々一要素を独立に選べるとき。

各 branch の「選ばない1通り＋候補数」を掛け、必要な選択個数未満の項を引く。

## 問題固有の要素

直径の偶奇が、赤集合をちょうど二側から選ぶ積と、複数 branch から選べる積-minus-small-cases に分ける。

別の問題へ持ち帰る視点: 木の等距離条件では path の中点が頂点か辺かを最初に分け、同じ中心成分内の二点が条件を満たせるか調べる。

## 正当性

全選択pairが直径距離Dなら端点は中心から半径D/2の点で、同branch二点はD未満になるため高々一つ。奇数中心辺なら両側一点ずつ、偶数中心頂点なら各branchの0/1選択を独立に掛け、0点1点集合を引く。これでsize≥2全有効集合を一意に数える。

## 実装上の注意

- 奇数の場合は中央辺を探索で横断せず、偶数の場合は branch ごとに独立して距離 D/2-1 を数える。積・差し引きは負にならないよう法を正規化する。

## 復習の核

- 中心が辺の path 木と中心が頂点の star を並べ、同じ側・同じ branch から二点選ぶと距離が短くなることを確認する。

## 計算量と制約

### 時間

N頂点。直径と中央branch距離集計 O(N)。

### 空間

木、距離、直径path O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq U_i,V_i \leq N; U_i \neq V_i; All values in input are integers.; The given graph is a tree.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc221/editorial/2723) — source-abc221-editorial-2723-01dbf678db5978ad71d6df2181e0715eae7f3cf04da07171bc34889c9fd67072
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc221/tasks/abc221_f) — source-abc221-f-problem-512793d11e35b885d25db8856f0a858005fae5fecc133200f64901b517e322ea
