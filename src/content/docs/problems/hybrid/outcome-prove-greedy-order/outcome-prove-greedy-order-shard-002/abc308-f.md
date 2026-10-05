---
title: "ABC308-F — Vouchers"
draft: true
authoringUnit: {"problemId":"abc308-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc308-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-event-sweep"],"sourceRevisionIds":["source-abc308-f-problem-1aa0efcfc13890447bf2c87ac81e1acace336befecdcabcb51d676ba83dd987a","source-abc308-editorial-6706-55d3ddad700f31c3b0a39ef7482a7f89e8a64d0bce740d6b153ec0f6afb6bdc7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"現在itemに使ったcouponはより高価な将来itemにも使えるため、optimal solutionの現在item用couponとheap最大couponを交換してもfeasibilityを保ちdiscountは減らない。 heapがemptyならcouponなしで買い、全item処理後に残るcouponsは使えなくても問題ない。 期限上限のないthreshold matchingではeligible couponを最も早いitemに使っても将来の適用可能性を失わず、最大D選択がexchange-optimalである。","sourceRevisionIds":["source-abc308-f-problem-1aa0efcfc13890447bf2c87ac81e1acace336befecdcabcb51d676ba83dd987a","source-abc308-editorial-6706-55d3ddad700f31c3b0a39ef7482a7f89e8a64d0bce740d6b153ec0f6afb6bdc7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

base payment ΣPは固定なので、minimum paymentはeligible item-coupon matchingのtotal discountを最大化する問題である。

itemsをprice昇順に見ると、threshold L≤Pを満たすcoupon集合は単調に増える。

棄却する候補: item-coupon bipartite graphでmaximum-weight matchingを一般algorithmで解く。

N,M=20万だがthreshold eligibilityの特殊構造を使っていない。

採用する候補: itemsをprice順、couponsをL順にsortし、各itemまでにeligibleになったDをmax-heapへ入れて最大discountを一つ使う。

nested threshold eligibilityを持つmaximum-discount matchingをsorted sweepとmax-priority greedyで解く。

## 典型の発動条件

### threshold解禁とpriority queue

発動条件: 対象をkey順に処理すると利用可能optionsが追加されるだけで減らないとき。

L≤current priceのcouponsをheapへ追加し、best discountをpopする。

### 交換法によるgreedy matching

発動条件: 現在eligibleなoptionはすべて将来対象にもeligibleで、rewardだけが異なるとき。

現在はmaximum reward optionを選んでもoptimal matchingへ交換できることを示す。

## 問題固有の要素

D_i≤L_iによりdiscount後価格はnonnegativeだが、greedyの正当性自体はtotal discount最大化とnested eligibilityに依存する。

別の問題へ持ち帰る視点: 支払最小化は固定baseからbenefitsを引く形へ変え、benefit matchingとして考える。

## 正当性

現在itemに使ったcouponはより高価な将来itemにも使えるため、optimal solutionの現在item用couponとheap最大couponを交換してもfeasibilityを保ちdiscountは減らない。 heapがemptyならcouponなしで買い、全item処理後に残るcouponsは使えなくても問題ない。 期限上限のないthreshold matchingではeligible couponを最も早いitemに使っても将来の適用可能性を失わず、最大D選択がexchange-optimalである。

## 実装上の注意

- coupon pointerをL昇順で一度だけ進め、各itemでL≤Pの全couponをpushしてからpopする。
- ΣPとΣDは32 bitを超えるため64 bitでbase−discountを計算する。

## 復習の核

- cost問題を固定baseと選択benefitsへ分け、最大化すべき量を明確にする。
- eligibility setsがnestedなら、scan時点で解禁済みoptionsのbestを使うexchange proofを試す。

## 計算量と制約

### 時間

O((N+M)log(N+M))、価格sort・coupon解禁・maxheap。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,M\leq 2\times 10^5; 1\leq P_i\leq 10^9; 1\leq D_i \leq L_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/tasks/abc308_f) — source-abc308-f-problem-1aa0efcfc13890447bf2c87ac81e1acace336befecdcabcb51d676ba83dd987a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/editorial/6706) — source-abc308-editorial-6706-55d3ddad700f31c3b0a39ef7482a7f89e8a64d0bce740d6b153ec0f6afb6bdc7
