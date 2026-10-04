---
title: "ABC397-E — Path Decomposition of a Tree"
draft: true
authoringUnit: {"problemId":"abc397-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc397-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc397-e-problem-6391988738ab7ffddb6170482d1b9a39b433f5fe46fbe0d30cd85ae1f62672dc","source-abc397-editorial-12452-6f1addea97f53055105b3c7b3d938e0577f71b2db53329cc44e477b36745c994"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"子部分木の境界は親辺一本なので、親へ渡す未完成集合は延長可能な一本道に限られる。K頂点に達すれば完成して切り離し、未達なら未完成子が二本あると親への延長で次数3になるため失敗。完成時だけ子二本まで許す。サイズ超過は不可能。局所判定は子解からの帰納法で必要十分。","sourceRevisionIds":["source-abc397-e-problem-6391988738ab7ffddb6170482d1b9a39b433f5fe46fbe0d30cd85ae1f62672dc","source-abc397-editorial-12452-6f1addea97f53055105b3c7b3d938e0577f71b2db53329cc44e477b36745c994"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

treeをK頂点pathへ分割できるなら、leaf側から見た未確定componentは親方向へ延びる一本のpathでなければならない。subtree内で既にK頂点になったcomponentはその場で切り離せる。K未満なら親へ渡し、K超なら二度と縮められないので失敗である。vで未確定child componentが2本以上ありsize<Kなら、親edgeも加わってdegree≥3となるため一pathにはできない。size=Kならvでの未確定child数が2以下ならcomponentはpathであり、sizeを0へresetして親へ何も渡す。

採用する候補: postorderで未切離しsubtreeのsizeとbranch数を管理し、K到達時にpathとして削除するgreedy tree DP

leafから最初に完成するK頂点componentはどの有効分解でも一pathでなければならず、局所判定・削除を繰り返すことが必要十分でO(NK)=O(vertex数)となる。

棄却する候補: N本のpath候補を列挙してexact coverを解く

path候補数が多く一般の集合分割になり、tree上のleaf-side強制構造を使っていない。

任意rootでpostorderし、vの未削除childのsizeを足してs=1+Σs_childとする。s<Kならactive child≤1、s=Kならactive child≤2を要求して0へ、s>KならNo。root処理後0ならYes。

## 典型の発動条件

### leaf stripping greedy on tree

発動条件: 固定sizeのconnected pathへtree全体を分割するとき。

leaf側で完成した強制componentを順に切り離す。

### open component tree DP

発動条件: 親へ続く未完成部分構造のsizeと形を管理するとき。

一本pathというbranch数制約を持って渡す。

## 問題固有の要素

任意のK-subtreeを探すのでなく、postorderで未処理sizeがKになった瞬間に切ると、親側との選択自由度を残さず必要条件を検査できる。

別の問題へ持ち帰る視点: tree partitionではleaf側の最小未完成componentが全解でどう扱われるかを調べ、強制greedyを作る。

## 正当性

子部分木の境界は親辺一本なので、親へ渡す未完成集合は延長可能な一本道に限られる。K頂点に達すれば完成して切り離し、未達なら未完成子が二本あると親への延長で次数3になるため失敗。完成時だけ子二本まで許す。サイズ超過は不可能。局所判定は子解からの帰納法で必要十分。

## 実装上の注意

- N,Kの記号と実頂点数NKを混同しない。K=1では各頂点が即resetされ、root最終sizeが0か確認する。

## 復習の核

- 頂点数≤12のtreeとK divisorでpath partitionをbacktracking全探索し、branchがK到達前/直後に生じるcaseを比較する。

## 計算量と制約

### 時間

実頂点数 V=NK に対して O(V)。

### 空間

木、未確定サイズと子数で O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N; 1 \leq K; NK \leq 2 \times 10^5; 1 \leq u_i < v_i \leq NK; The given graph is a tree.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc397/tasks/abc397_e) — source-abc397-e-problem-6391988738ab7ffddb6170482d1b9a39b433f5fe46fbe0d30cd85ae1f62672dc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc397/editorial/12452) — source-abc397-editorial-12452-6f1addea97f53055105b3c7b3d938e0577f71b2db53329cc44e477b36745c994
