---
title: "ABC342-G — Retroactive Range Chmax"
draft: true
authoringUnit: {"problemId":"abc342-g","docPath":"src/content/docs/problems/data-structures/outcome-decompose-ranges-into-segment-tree-nodes/outcome-decompose-ranges-into-segment-tree-nodes-shard-001/abc342-g.md","learningOutcomeIds":["outcome-decompose-ranges-into-segment-tree-nodes"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset","unit-range-monoid-aggregation"],"excludedTopics":["Segment Treeのcanonical区間分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-segment-tree-canonical-decomposition","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc342-editorial-9373-764095d523625c3183a5d63be514e88bebed61dcbf54caf6a44d2858ff2554fa","source-abc342-g-problem-6d1d89d0ef3e51dcb1469dc44e3f72736049b1cb797cde428a8aa509495ef2a7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"任意区間[l,r)はsegment treeのO(log N)個のdisjoint canonical intervalに分解できる。点iを覆う更新は、その分解nodeのうちroot-to-leaf path上にあるものとしてちょうど一度現れるため、path上node最大の最大が全active xの最大になる。 range追加・取消をO(log N) nodeへの挿入削除、point取得をroot-to-leaf上の最大へ分解できる。","sourceRevisionIds":["source-abc342-editorial-9373-764095d523625c3183a5d63be514e88bebed61dcbf54caf6a44d2858ff2554fa","source-abc342-g-problem-6d1d89d0ef3e51dcb1469dc44e3f72736049b1cb797cde428a8aa509495ef2a7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-ranges-into-segment-tree-nodes"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2,3)、更新u1=[1,2]へ5、u2=[2,3]へ5、u1だけ取消。","procedure":["両更新後は(5,5,5)。","u1の登録一個ずつだけを削除すると位置2にはu2が残る。"],"executionTarget":null,"expectedResult":"取消後の位置2は5、位置1は1。","verificationStatus":"not_applicable","learningUnitIds":["unit-segment-tree-canonical-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-ranges-into-segment-tree-nodes"],"prerequisiteIds":["unit-ordered-set-multiset","unit-range-monoid-aggregation"],"attainmentCondition":"同値5をnodeから全てeraseしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"更新IDが異なる同値登録は別物なので一個だけ消す。全消去すると有効なu2まで失われる。"},"answer":{"reasoningOrVerification":"更新IDが異なる同値登録は別物なので一個だけ消す。全消去すると有効なu2まで失われる。","procedure":["具体例の各状態・寄与を再計算する。","更新IDが異なる同値登録は別物なので一個だけ消す。全消去すると有効なu2まで失われる。"],"expectedResult":"更新IDが異なる同値登録は別物なので一個だけ消す。全消去すると有効なu2まで失われる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Segment Treeのcanonical区間分解](src/content/docs/learn/query/segment-tree-canonical-decomposition.md)

- 区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- Segment Treeのcanonical区間分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

range chmax操作は互いに可換で、現在のA_iは初期値とiを覆う未取消操作のxの最大値だけで決まる。したがって操作順を再実行する必要はなく、activeなrange値のpoint stabbing maximumを管理すればよい。

採用する候補: segment treeのcanonical nodeごとにdeletable max multisetを持つ

range追加・取消をO(log N) nodeへの挿入削除、point取得をroot-to-leaf上の最大へ分解できる。

棄却する候補: 取消のたびに初期配列から全active操作を再適用する

一回の取消がO(NQ)級になり、Q=2×10^5では不可能である。

任意区間[l,r)はsegment treeのO(log N)個のdisjoint canonical intervalに分解できる。点iを覆う更新は、その分解nodeのうちroot-to-leaf path上にあるものとしてちょうど一度現れるため、path上node最大の最大が全active xの最大になる。

各segment nodeにmultiset、または追加heapと削除heapのlazy deletion pairを置く。type 1の(l,r,x)をcanonical nodesへ挿入しoperation IDに情報を保存する。type 2では同じ分解nodeからxを削除する。type 3ではA_iとleafからrootまでの各node現在maxの最大を出力する。

## 典型の発動条件

### segment tree区間分解

発動条件: range objectをpoint queryで参照し、後から同じobjectを削除したい。

rangeをO(log N) canonical nodeに登録し、point pathだけを走査する。

### deletable priority queue

発動条件: 各nodeで値の挿入・指定値削除・最大取得を行う。

multisetを使うか、追加heapと削除heapのtop一致を遅延相殺する。

## 問題固有の要素

chmaxの合成が単なるmaxで可換・冪等なので、retroactive cancellation後の値もactive x集合だけから復元でき、時系列情報を持たなくてよい。

別の問題へ持ち帰る視点: 可換なrange作用の取消は、作用parameterのmultisetを空間分解nodeに保持するとonline化できる。

## 正当性

任意区間[l,r)はsegment treeのO(log N)個のdisjoint canonical intervalに分解できる。点iを覆う更新は、その分解nodeのうちroot-to-leaf path上にあるものとしてちょうど一度現れるため、path上node最大の最大が全active xの最大になる。 range追加・取消をO(log N) nodeへの挿入削除、point取得をroot-to-leaf上の最大へ分解できる。

## 実装上の注意

- type 2はquery番号で元のl,r,xを参照し、同じxが複数operationにあるため一個だけ削除する。空nodeの最大はidentityとして扱う。

## 復習の核

- 同じxの重複、nested/disjoint ranges、最大操作の取消で次点が現れる、初期A_iが全active xより大きい例をnaive再計算と比較する。

## 計算量と制約

### 時間

Q操作O(Q log N log Q)、取消対応multiset版。点取得O(log N)。

### 空間

O(N+Q log N)、登録が置かれるcanonical node数。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq A_i\leq10^9\ (1\leq i\leq N); 1\leq Q\leq2\times10^5; In a type-1 operation, 1\leq l\leq r\leq N and 1\leq x\leq10^9.; In a type-2 operation, i is not greater than the number of operations given before, and 1\leq i.; In a type-2 operation, the i-th operation is of type 1.; In type-2 operations, the same i does not appear multiple times.; In a type-3 operation, 1\leq i\leq N.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2,3)、更新u1=[1,2]へ5、u2=[2,3]へ5、u1だけ取消。

1. 両更新後は(5,5,5)。
2. u1の登録一個ずつだけを削除すると位置2にはu2が残る。

期待される結果: 取消後の位置2は5、位置1は1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同値5をnodeから全てeraseしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

更新IDが異なる同値登録は別物なので一個だけ消す。全消去すると有効なu2まで失われる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc342/editorial/9373) — source-abc342-editorial-9373-764095d523625c3183a5d63be514e88bebed61dcbf54caf6a44d2858ff2554fa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc342/tasks/abc342_g) — source-abc342-g-problem-6d1d89d0ef3e51dcb1469dc44e3f72736049b1cb797cde428a8aa509495ef2a7
