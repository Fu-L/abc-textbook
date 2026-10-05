---
title: "ABC328-F — Good Set Query"
draft: true
authoringUnit: {"problemId":"abc328-f","docPath":"src/content/docs/problems/graph-search/outcome-maintain-potential-differences/outcome-maintain-potential-differences-shard-001/abc328-f.md","learningOutcomeIds":["outcome-maintain-potential-differences"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-graph-potential-propagation"],"excludedTopics":["potential・weighted DSUの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-potential-dsu"],"sourceRevisionIds":["source-abc328-editorial-7656-bdf5103565963552cb1c95c00e1e3e5fd3b142434aa7c8d7642bfd9d4626ee28","source-abc328-f-problem-cec6ce239a8d4fe18e7b82b8f6adc77f8efb52ab84c3aa5f67a5a8d9262a0f58"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同成分なら既存差が一意で一致制約だけを採用できる。別成分の絶対offsetは自由なので新差に合わせて全成分offsetを移せる。root差を正しい符号で置きunionすれば既存差と新差が同時に保存され、逐次accept判定が厳密。","sourceRevisionIds":["source-abc328-editorial-7656-bdf5103565963552cb1c95c00e1e3e5fd3b142434aa7c8d7642bfd9d4626ee28","source-abc328-f-problem-cec6ce239a8d4fe18e7b82b8f6adc77f8efb52ab84c3aa5f67a5a8d9262a0f58"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [potential・weighted DSU](src/content/docs/learn/graph/potential-dsu.md)

- DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [静的graph等式制約のpotential伝播](src/content/docs/learn/graph/graph-potential-propagation.md) — 通常のDFS・BFSを土台に、辺等式からroot-relative potentialを静的に伝播し、cycle整合性と成分offsetの自由度を分離する。

## 考察

accepted constraint X_a-X_b=dは頂点a,b間のpotential差を固定するedgeであり、同じconnected component内の任意2頂点差は既存constraintから一意に決まる。a,bが別componentなら両componentの絶対offsetは自由なので、新しいdは常に矛盾なく両者を接続できる。同componentなら既に決まるX_a-X_bとdが一致するときだけconstraintを追加できる。find時にparent pathの差も加算して圧縮すれば、pot[v]=X_v-X_rootを取得でき、同rootならX_a-X_b=pot[a]-pot[b]である。別rootをmergeするときはconstraint式から新しいroot間potentialを逆算し、union by sizeで向きを反転する場合はその符号も反転する。

採用する候補: rootからのpotential差を持つweighted Union-Findで、各queryの既知差判定とconstraint unionを行う。

通常DSUの連結性に数値差を追加し、Q≤2×10^5をほぼ定数償却で順にsimulationできる。

棄却する候補: accepted constraint graphへedgeを追加し、queryごとにDFSしてa-bの差を求める。

長いcomponentを毎回辿るとNQ規模になり、過去queryの計算を再利用できない。

棄却する候補: 通常のUnion-Findでa,bが同componentかだけを見る。

同componentへ追加するconstraintが既知差と一致するかという矛盾判定にpotential値が必要である。

weighted DSUをN頂点で初期化する。query(a,b,d)ごとにfindして、rootが同じならpot[a]-pot[b]==dのときだけindexをanswerへ追加する。rootが異なるなら常にindexを追加し、X_a-X_b=dを満たすroot間差を設定してsizeの小さいrootを大きいrootへmergeする。最後にaccepted indexを順に出力する。

## 典型の発動条件

### weighted Union-Find

発動条件: onlineに差分等式pot(a)-pot(b)=dを追加し整合性を判定するとき。

parent edgeへpotential差を持たせ、rootからの差をpath compressionで集約する。

### 相対offsetの自由度

発動条件: 別connected component間にはまだ絶対基準関係がない差分constraint系。

最初の接続constraintは任意dでcomponent offsetを定められる。

## 問題固有の要素

good setを直接解方程式として持たず、constraint graphの各componentに1つだけ残る平行移動自由度と、component内の一意な差をDSUへ符号化する。

別の問題へ持ち帰る視点: 差分方程式系では絶対値でなくroot基準potentialを管理するとonline unionと矛盾検出ができる。

## 正当性

同成分なら既存差が一意で一致制約だけを採用できる。別成分の絶対offsetは自由なので新差に合わせて全成分offsetを移せる。root差を正しい符号で置きunionすれば既存差と新差が同時に保存され、逐次accept判定が厳密。

## 実装上の注意

- potの定義をX_v-X_rootなどに固定し、merge式とsame-root比較の符号を小例で統一する。
- potential差は最大Q×10^9級になり得るため64bit整数を使う。
- rejectしたconstraintはDSUへ追加せず、後続queryの基準集合を変えない。

## 復習の核

- X_1-X_2=3、X_2-X_3=-1からX_1-X_3=2を導く三角形で、accepted/rejected queryとpotential符号を確認する。

## 計算量と制約

### 時間

N 変数、Q 制約。weighted DSU O((N+Q)α(N))、出力 O(Q)。

### 空間

親、potential、採用index O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \leq N, Q \leq 2 \times 10^5; 1 \leq a_i, b_i \leq N; -10^9 \leq d_i \leq 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc328/editorial/7656) — source-abc328-editorial-7656-bdf5103565963552cb1c95c00e1e3e5fd3b142434aa7c8d7642bfd9d4626ee28
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc328/tasks/abc328_f) — source-abc328-f-problem-cec6ce239a8d4fe18e7b82b8f6adc77f8efb52ab84c3aa5f67a5a8d9262a0f58
