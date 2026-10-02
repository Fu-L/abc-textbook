---
title: "ABC351-G — Hash on Tree"
draft: true
authoringUnit: {"problemId":"abc351-g","docPath":"src/content/docs/problems/graph-search/outcome-compose-dynamic-tree-clusters/outcome-compose-dynamic-tree-clusters-shard-001/abc351-g.md","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-heavy-light-decomposition","unit-rooted-tree-aggregation"],"excludedTopics":["更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。"],"tagIds":["tag-static-top-tree","tag-heavy-light-decomposition"],"sourceRevisionIds":["source-abc351-editorial-9868-860696c2a3056d2d8d8b9c37b1d6efe15564a3b3db133c5619ab4686c81b1c2e","source-abc351-g-problem-db5ec50bcd9264b8596fd6a75bb905bf447b1f1de9e684cb4f1d3be444486fa9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"葉はf=A、非葉はA+子積とする公式baseを保持する。point clusterは子積、path clusterは未接続子値xに作用するax+bなのでrakeは積、compressはaffine合成となる。各mergeが元DPの局所計算と一致する帰納法でroot hashを保ち、一点更新の影響はmerge祖先だけ。","sourceRevisionIds":["source-abc351-editorial-9868-860696c2a3056d2d8d8b9c37b1d6efe15564a3b3db133c5619ab4686c81b1c2e","source-abc351-g-problem-db5ec50bcd9264b8596fd6a75bb905bf447b1f1de9e684cb4f1d3be444486fa9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"root1、子2,3、A=(2,3,4)。A2を5へ更新。","procedure":["葉f2=3,f3=4で旧root2+12=14。","葉2を5へ更新。","新root2+5×4。"],"executionTarget":null,"expectedResult":"22","verificationStatus":"not_applicable","learningUnitIds":["unit-static-top-tree"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compose-dynamic-tree-clusters"],"prerequisiteIds":["unit-heavy-light-decomposition","unit-rooted-tree-aggregation"],"attainmentCondition":"葉にもA+空積1を使ってよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。公式baseはf(leaf)=A。空積1を加えると二葉例のroot値が別物になる。"},"answer":{"reasoningOrVerification":"不可。公式baseはf(leaf)=A。空積1を加えると二葉例のroot値が別物になる。","procedure":["具体例の各状態・寄与を再計算する。","不可。公式baseはf(leaf)=A。空積1を加えると二葉例のroot値が別物になる。"],"expectedResult":"不可。公式baseはf(leaf)=A。空積1を加えると二葉例のroot値が別物になる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rake・compressで動的木DPを保つ](src/content/docs/learn/tree/static-top-tree.md)

- 境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [Heavy-Light Decomposition](src/content/docs/learn/tree/heavy-light-decomposition.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 更新を伴わない一回の木DP、および木上pathだけを列へ分けるHeavy-Light Decomposition。

## 考察

各頂点更新は祖先の hash に影響する。公式の定義は葉なら f(v)=A_v、非葉なら f(v)=A_v+∏f(child) である。鎖では祖先数、星では子積再計算が大きいので単純更新では遅い。light子の積を係数にするとheavy pathの作用はax+bで閉じる。rakeの積とcompressのaffine合成を頂点数balancedなStatic Top Treeでまとめ、一点変更は深さ対数のmerge祖先だけ再計算する。

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

葉はf=A、非葉はA+子積とする公式baseを保持する。point clusterは子積、path clusterは未接続子値xに作用するax+bなのでrakeは積、compressはaffine合成となる。各mergeが元DPの局所計算と一致する帰納法でroot hashを保ち、一点更新の影響はmerge祖先だけ。

## 実装上の注意

葉はA_vを直接返し、空積1を加算しない。path clusterの近端/遠端を固定し、compressは実際の作用順でaffine合成する。0係数を含めて逆元に頼らずrake積を維持する。法998244353で正規化する。

## 復習の核

- まず五つの cluster 操作ごとに情報の意味を式で検証し、その後に平衡化へ進む。特に葉の例と一子の鎖で affine 係数を手計算する。

## 計算量と制約

### 時間

N頂点Q更新。balanced Static Top Tree構築 O(N)、各leaf更新O(log N)、全体 O(N+Qlog N)。

### 空間

木とO(N)個定数情報clusterで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq p_i < i; 0 \leq A_i < 998244353; 1 \leq v \leq N; 0 \leq x < 998244353; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

root1、子2,3、A=(2,3,4)。A2を5へ更新。

1. 葉f2=3,f3=4で旧root2+12=14。
2. 葉2を5へ更新。
3. 新root2+5×4。

期待される結果: 22

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

葉にもA+空積1を使ってよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。公式baseはf(leaf)=A。空積1を加えると二葉例のroot値が別物になる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/editorial/9868) — source-abc351-editorial-9868-860696c2a3056d2d8d8b9c37b1d6efe15564a3b3db133c5619ab4686c81b1c2e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc351/tasks/abc351_g) — source-abc351-g-problem-db5ec50bcd9264b8596fd6a75bb905bf447b1f1de9e684cb4f1d3be444486fa9
