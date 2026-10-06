---
title: "ABC473 E — K-Divisible Subarrays"
draft: true
authoringUnit: {"problemId":"abc473-e","docPath":"src/content/docs/problems/updates/abc473-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc473-e-problem-808f7da61d8e7a2dc4ecc6f28c1f43e1276daa8fb5c5dc4ad004d7ed86a6a29a","source-abc473-editorial-24877-41ab4e8d258ec7729e7085eb9b4573f127e5e1b3092781e268ca2d336d64e7f0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"倍数和条件は二つの累積剰余の等しさと同値。得点区間は非重複に選ばれ、逆に任意の非重複倍数和区間集合の間と両端を得点なし区間で埋めれば分割を作れる。最早終了を選ぶ交換で最適個数は保たれ、その後は同じ問題へ戻るので貪欲が正しい。","sourceRevisionIds":["source-abc473-e-problem-808f7da61d8e7a2dc4ecc6f28c1f43e1276daa8fb5c5dc4ad004d7ed86a6a29a","source-abc473-editorial-24877-41ab4e8d258ec7729e7085eb9b4573f127e5e1b3092781e268ca2d336d64e7f0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

## 考察

Kの倍数和区間は、mod Kの累積和S_l=S_rとなる二つの切れ目で表せる。得点を持たない区間は隙間を埋めるだけなので、問題は互いに重ならない倍数和区間を最大個数選ぶ区間スケジューリングになる。

最も早く終わる倍数和区間を選べば、それより遅く終わる最初の選択を置き換えても、後続区間の余地は減らない。右端を左から走査し、最後に選んだ右端t以降の累積剰余を集合へ入れる。S_rが集合内にあれば区間を一つ確定し、得点を増やし、候補集合をS_rだけへリセットする。S_rは次区間の左端として再利用できるので、空集合にしてはならない。

候補剰余は初めにS_0=0。重複まで同じ剰余が何度も出る状況でも、最初の重複で直ちに区間を選ぶので、リセット間の候補は重複しない。K≤10^9のため長さK配列は作らず、集合か座標圧縮を使う。集合のクリア総量は各prefix一度の挿入に抑えられる。

## 典型の発動条件

区間分割を、利益を持つ非重複区間の選択へ言い換える。累積和の合同条件と最早終了貪欲を組み合わせる。

## 問題固有の要素

得点なし区間の存在を許すので、選択区間間の隙間を残せる。右端prefixは次の左端に共有できる。

## 正当性

倍数和条件は二つの累積剰余の等しさと同値。得点区間は非重複に選ばれ、逆に任意の非重複倍数和区間集合の間と両端を得点なし区間で埋めれば分割を作れる。最早終了を選ぶ交換で最適個数は保たれ、その後は同じ問題へ戻るので貪欲が正しい。

## 実装上の注意

長さ0の区間を数えない。A_i=0なら一要素で得点になり、K=1なら全要素を独立に選べる。

## 復習の核

分割の全切れ目を決める前に、得点を生む区間だけを抜き出しても目的値を保存するか確かめる。

## 計算量と制約

### 時間

平衡木集合なら O(N log N)。hash集合なら期待 O(N)。

### 空間

集合 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le K\le10 ^ 9; 0\le A _ i\lt K; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc473/tasks/abc473_e)
- [公式解説](https://atcoder.jp/contests/abc473/editorial/24877)
