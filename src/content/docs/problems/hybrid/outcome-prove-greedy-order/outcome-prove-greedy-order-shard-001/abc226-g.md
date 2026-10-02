---
title: "ABC226-G — The baggage"
draft: true
authoringUnit: {"problemId":"abc226-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc226-g.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc226-editorial-2893-076ae72bda5cc8a1b8ee64def3d23a6ba381b9bb1921e492f8a0941f3b95f5a3","source-abc226-g-problem-db27166d4299d8860197e33fc6c7489032bd1c44693888a1e988e8aa9a7b4e61"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重さ5・4・3の荷物は一人が高々一個しか持てないため、5→体力5、4→体力4の後5、3→体力3の後5、最後に4という順で割り当てても実現可能解を失わない。 重さ3を体力4へ載せる人数を最後に抑えることが、残余体力の奇数個数を最小化し、重さ2を載せられるfloor(残余体力/2)の総和を最大化する。 種類数が定数であり、重い荷物の必要条件と重さ2に使える偶数容量を最大化する交換論法により、各bucket間の一括移動だけで実現可能性を判定できる。","sourceRevisionIds":["source-abc226-editorial-2893-076ae72bda5cc8a1b8ee64def3d23a6ba381b9bb1921e492f8a0941f3b95f5a3","source-abc226-g-problem-db27166d4299d8860197e33fc6c7489032bd1c44693888a1e988e8aa9a7b4e61"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 対称操作による状態の正規化。

## 考察

荷物重量と体力は1から5の五種類しかない一方、個数は10^16なので個人・荷物単位のマッチングは作れない。総重量だけでは、体力3の人に重さ2を二個載せられないような容量の断片化を判定できない。

採用する候補: 体力別の人数を残り体力bucketとして持ち、重さ5、4、3、2、1の順に、将来の小荷物を最も収めやすく保つ固定順で個数をまとめて割り当てる。

種類数が定数であり、重い荷物の必要条件と重さ2に使える偶数容量を最大化する交換論法により、各bucket間の一括移動だけで実現可能性を判定できる。

棄却する候補: 荷物の総重量が全員の体力総和以下かだけを確認する。

総余力が十分でも一人の上限をまたいで荷物を分割できず、例えば体力3へ重さ2を二個は載せられないため十分条件にならない。

重さ5・4・3の荷物は一人が高々一個しか持てないため、5→体力5、4→体力4の後5、3→体力3の後5、最後に4という順で割り当てても実現可能解を失わない。

重さ3を体力4へ載せる人数を最後に抑えることが、残余体力の奇数個数を最小化し、重さ2を載せられるfloor(残余体力/2)の総和を最大化する。

人数bucketを用い、5→5、4→4,5、3→3,5,4、2→残り体力2以上、1→残り体力1以上の順でmin個ずつ一括消費し、最後に荷物が残らないか確認する。

## 典型の発動条件

### 定数種類のbucket貪欲

発動条件: 値・容量の種類が小さな定数で個数だけが巨大であり、同じ種類の対象を区別する必要がないとき。

残り容量ごとの人数と重量ごとの荷物数だけを持ち、一回のmin演算で同種の割当てをまとめて進める。

### 残余容量の断片化を守る交換論法

発動条件: 総容量だけでは不十分で、次に置く荷物が特定の剰余・最小bucketを必要とするとき。

重い荷物の割当て順を交換し、重さ2に使える偶数部分の総量を最大に保つ順序を選ぶ。

## 問題固有の要素

重さ3を載せる先は強い人から単純に使うのではなく、体力5を体力4より先に使うことで、後の重さ2に使えない余り1を増やさずに済む。

別の問題へ持ち帰る視点: bin packing型の貪欲順は残余総和だけでなく、次の品物単位に対する余りの剰余分布まで比較する。

## 正当性

重さ5・4・3の荷物は一人が高々一個しか持てないため、5→体力5、4→体力4の後5、3→体力3の後5、最後に4という順で割り当てても実現可能解を失わない。 重さ3を体力4へ載せる人数を最後に抑えることが、残余体力の奇数個数を最小化し、重さ2を載せられるfloor(残余体力/2)の総和を最大化する。 種類数が定数であり、重い荷物の必要条件と重さ2に使える偶数容量を最大化する交換論法により、各bucket間の一括移動だけで実現可能性を判定できる。

## 実装上の注意

- 個数は10^16なので全bucketと重量和を64 bitで持ち、各割当てはmin個を一括で移す。重さ3の体力5・4への順序を入れ替えない。

## 復習の核

- 総重量条件だけで満足せず、次に重い単位が入る『まとまった残余容量』を何個残せるかまで追う。

## 計算量と制約

### 時間

O(1)、重量/体力値域1..5の固定bucket。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 5\times 10^4; 0 \leq A_i,B_i \leq 10^{16}; 1 \leq A_1+A_2+A_3+A_4+A_5; 1 \leq B_1+B_2+B_3+B_4+B_5; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/editorial/2893) — source-abc226-editorial-2893-076ae72bda5cc8a1b8ee64def3d23a6ba381b9bb1921e492f8a0941f3b95f5a3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/tasks/abc226_g) — source-abc226-g-problem-db27166d4299d8860197e33fc6c7489032bd1c44693888a1e988e8aa9a7b4e61
