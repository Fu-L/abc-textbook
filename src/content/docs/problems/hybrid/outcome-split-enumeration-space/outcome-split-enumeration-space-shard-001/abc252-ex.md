---
title: "ABC252-EX — K-th beautiful Necklace"
draft: true
authoringUnit: {"problemId":"abc252-ex","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc252-ex.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-trie"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-binary-trie"],"sourceRevisionIds":["source-abc252-editorial-3981-9ae004fee11a4bcddf79782797df62c05bdc9094fd3da4ae7894295d92b348fc","source-abc252-ex-problem-cc5a2f480c4a17997587a18fd8d84e14270465786d6556c6c61c92be6f7ea1ed"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"色数ではなく各色の選択肢数の積を重みとして二群を平衡化することで、左右の列挙数をともに約3^(N/6)へ抑える。 答えの上位ビットを一つ固定するごとに、その接頭辞を作れる左右XORの組数をtrieで数え、Kが入る側だけを残せる。 色群を選択数の積がほぼ等しくなるよう分ければ各側のXOR列挙は全体の平方根規模になり、上位ビットからK番目を数えられる。","sourceRevisionIds":["source-abc252-editorial-3981-9ae004fee11a4bcddf79782797df62c05bdc9094fd3da4ae7894295d92b348fc","source-abc252-ex-problem-cc5a2f480c4a17997587a18fd8d84e14270465786d6556c6c61c92be6f7ea1ed"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

先に読む単元:

- [bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md) — 整数を上位bitから分岐する列として格納し、XOR・大小・最小距離の候補を貪欲に選ぶ。

## 考察

色cからちょうど1枚選ぶ組合せ数は各色の枚数n_cの積であり、総枚数N≤70の下ではこの積は整数分割の評価により高々およそ3^(N/3)に抑えられる。

採用する候補: 積が均衡する二群へのmeet-in-the-middleとXOR trie

色群を選択数の積がほぼ等しくなるよう分ければ各側のXOR列挙は全体の平方根規模になり、上位ビットからK番目を数えられる。

棄却する候補: 全ネックレスのXORを列挙してソート

組合せ数が最大で10^11級になり、列挙も保存もできない。

棄却する候補: 答え候補を二分探索して各回trie全走査

XOR順序は通常の数値閾値との数え上げが複雑で、判定の反復も必要になるため、ビットごとの候補群絞り込みを直接行う方が適する。

色数ではなく各色の選択肢数の積を重みとして二群を平衡化することで、左右の列挙数をともに約3^(N/6)へ抑える。

答えの上位ビットを一つ固定するごとに、その接頭辞を作れる左右XORの組数をtrieで数え、Kが入る側だけを残せる。

色を選択数の積が均衡する二群へ分け、各群で一色一枚を選ぶ全XORを重複込みで列挙する。一方を二進trieへ入れ、上位ビットから1側を選んだ組数を数えてKを更新しながらK番目に大きいXORを確定する。

## 典型の発動条件

### meet-in-the-middle

発動条件: 独立グループごとの選択肢積は大きいが、全体積の平方根なら列挙できる。

色を積で平衡化し、左右の部分XOR列を生成する。

### K番目XORの二進trie

発動条件: 二つの多重集合から一つずつ選んだXORの順位を求めたい。

答え接頭辞に対応するtrie節点群を維持し、各ビットで候補ペア数を数える。

## 問題固有の要素

N≤70で総組合せ数が小さく見えない制約でも、各色枚数の積には整数分割由来の上界があり、その平方根列挙が成立する。

別の問題へ持ち帰る視点: 直積型の選択問題では、要素数ではなく各群の選択肢数の積を見積もって分割と計算量を設計する。

## 正当性

色数ではなく各色の選択肢数の積を重みとして二群を平衡化することで、左右の列挙数をともに約3^(N/6)へ抑える。 答えの上位ビットを一つ固定するごとに、その接頭辞を作れる左右XORの組数をtrieで数え、Kが入る側だけを残せる。 色群を選択数の積がほぼ等しくなるよう分ければ各側のXOR列挙は全体の平方根規模になり、上位ビットからK番目を数えられる。

## 実装上の注意

- 同じXOR値も別の選び方として重複計数し、組数とKは最大10^18を超えないよう飽和させる。色の分割は色数ではなくn_cの積を基準にする。

## 復習の核

- 選択総数が小さい例で全列挙ソートと比較し、同値XORの多重度、各色1枚、積が偏る色分布、K=1とK=総数を確認する。

## 計算量と制約

### 時間

O(B(U+V))、B=60、左右選択数U,Vを積で平衡化、trie順位探索。

### 空間

O(BV+U)、右trieと左XOR list。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq C \leq N \leq 70; 1 \leq D_i \leq C; 0 \leq V_i < 2^{60}; 1 \leq K \leq 10^{18}; There are at least K ways to make a necklace.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/editorial/3981) — source-abc252-editorial-3981-9ae004fee11a4bcddf79782797df62c05bdc9094fd3da4ae7894295d92b348fc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/tasks/abc252_h) — source-abc252-ex-problem-cc5a2f480c4a17997587a18fd8d84e14270465786d6556c6c61c92be6f7ea1ed
