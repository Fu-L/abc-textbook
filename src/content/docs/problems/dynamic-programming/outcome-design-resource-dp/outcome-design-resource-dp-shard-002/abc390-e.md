---
title: "ABC390-E — Vitamin Balance"
draft: true
authoringUnit: {"problemId":"abc390-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc390-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-greedy-exchange"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc390-e-problem-ff538ec602655c71a960fa1cdb5b342bee885a3ca3b3f8ac9c995c50e01b488f","source-abc390-editorial-12052-d2b96777a9a281f05dd871151cf1083aedf3d0e96e2deb15a64d7da9cfb8a7ab"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各種類のbudget以下最大量列は単調。現minimumでない列のincrementはminimumを上げないため、minimum列へのincrementを先に交換できる。この交換を繰り返すとX手greedy順が最適配分のminimumを保って到達する。各budget列は独立knapsackなので返すminimumは実現可能。","sourceRevisionIds":["source-abc390-e-problem-ff538ec602655c71a960fa1cdb5b342bee885a3ca3b3f8ac9c995c50e01b488f","source-abc390-editorial-12052-d2b96777a9a281f05dd871151cf1083aedf3d0e96e2deb15a64d7da9cfb8a7ab"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

各foodはvitamin一種類だけなので、vitaminごとの選択はcalorie予算配分を除けば独立である。まず各種類について予算s以下で得られる最大量M_v[s]を0/1 knapsackで作れる。 残る目的max_{s1+s2+s3=X}min(M1[s1],M2[s2],M3[s3])は三つの非減少列へのbudget配分であり、現在値が最小の列へ次の1 calorieを渡すwater-filling greedyが使える。 各M_v[s]はexact calorie DPのprefix maximumを取って「s以下」へ直すことで非減少になる。 tieした最小列のどれを増やしてもよく、X回後の三予算に対するminimumが最適値になる。

採用する候補: vitamin別0/1 knapsackを行い、三列の現在最小値へcalorieを一単位ずつ配る

DPがO(NX)、配分がO(X)で済む。最小でない列へ先に予算を足しても現在のminimumを改善せず、後でそのincrementを最小列側と交換できる。

棄却する候補: food全体で三vitamin摂取量を状態に持つ多次元knapsack

摂取量A_iが大きく状態空間を制約できず、種類間の独立性を捨てている。

各M_v[s]はexact calorie DPのprefix maximumを取って「s以下」へ直すことで非減少になる。

tieした最小列のどれを増やしてもよく、X回後の三予算に対するminimumが最適値になる。

v=1,2,3ごとに該当foodだけで0/1 knapsackし、budget prefix max M_vを作る。s_v=0からX回、M_v[s_v]が最小のvを一つ選んでs_v++し、最後の三値のminを答える。

## 典型の発動条件

### category分離knapsack

発動条件: itemが一categoryだけへ価値を与え、category間は総budgetのみ共有するとき。

categoryごとの価値-予算frontierを独立計算する。

### water-filling greedy

発動条件: 複数の非減少関数のminimumを総resource制約下で最大化するとき。

現在最小の関数へresourceを配る。

## 問題固有の要素

三vitaminを同時にDPせず、それぞれのPareto frontier M_v[s]だけ作れば、結合は一次元budgetの配分問題になる。

別の問題へ持ち帰る視点: 複数objectiveのmax-minでは、各objectiveのresource-response curveを先に求めてから公平配分する。

## 正当性

各種類のbudget以下最大量列は単調。現minimumでない列のincrementはminimumを上げないため、minimum列へのincrementを先に交換できる。この交換を繰り返すとX手greedy順が最適配分のminimumを保って到達する。各budget列は独立knapsackなので返すminimumは実現可能。

## 実装上の注意

- exact DPの到達不能値を0と混同せず、予算以下配列へ変換してからgreedyする。s_v=Xでそれ以上進めない境界も扱う。

## 復習の核

- X≤12でfood subset全探索と全(s1,s2,s3)列挙を行い、step状のM_vとtieが多いcaseでgreedyを比較する。

## 計算量と制約

### 時間

N food、予算X。種類別0/1 knapsack O(NX)、配分greedy O(X)。

### 空間

三種類のbudget最良列 O(X)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5000; 1 \leq X \leq 5000; 1 \leq V_i \leq 3; 1 \leq A_i \leq 2 \times 10^5; 1 \leq C_i \leq X; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc390/tasks/abc390_e) — source-abc390-e-problem-ff538ec602655c71a960fa1cdb5b342bee885a3ca3b3f8ac9c995c50e01b488f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc390/editorial/12052) — source-abc390-editorial-12052-d2b96777a9a281f05dd871151cf1083aedf3d0e96e2deb15a64d7da9cfb8a7ab
