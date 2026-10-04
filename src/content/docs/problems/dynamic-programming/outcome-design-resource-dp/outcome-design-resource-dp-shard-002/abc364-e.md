---
title: "ABC364-E — Maximum Glutton"
draft: true
authoringUnit: {"problemId":"abc364-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc364-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc364-e-problem-f289fab9c8381e2b4f56dcd0a8aede73e15a87dea934c8f489c8e1d2581d1bb0","source-abc364-editorial-10550-6bd9421e81822ad43403ee3bc7600cc7eae49364d5f67e86c9a5e3dc896a7e25"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"countと甘さを固定して塩気最小だけ持つと、他の候補は両制約への余裕で劣る。全料理の選択/非選択を旧行から更新して最大feasible count kを得る。実際はそのk個の後に閾値を超す一皿も食べられるため min(k+1,N)。","sourceRevisionIds":["source-abc364-e-problem-f289fab9c8381e2b4f56dcd0a8aede73e15a87dea934c8f489c8e1d2581d1bb0","source-abc364-editorial-10550-6bd9421e81822ad43403ee3bc7600cc7eae49364d5f67e86c9a5e3dc896a7e25"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

食事が終了するのは、直前までの甘さまたはしょっぱさが上限を超えた後である。したがって最後に食べる一皿を除いた集合の二合計はX,Y以下である。 二合計を上限内に保って選べる最大皿数をmとすると、答えは全皿を選べる場合を除いてm+1である。最後の一皿の値は上限内である必要がない。 dp[k][a]を甘さ合計aでk皿選ぶ最小しょっぱさとすれば、bを足す通常0/1 knapsackで存在性を圧縮できる。 m<Nなら上限内集合を先に食べ、未選択の任意一皿を最後に食べることでm+1皿を必ず達成できる。

採用する候補: 選択個数と甘さ合計をkey、最小しょっぱさをvalueとするknapsack DPでmを求め、min(m+1,N)を返す。

大きい二予算の片方を最小化valueへ移し、Nが小さいことを状態軸として活用できる。

棄却する候補: 甘さ合計・しょっぱさ合計の二次元表に最大個数を持つ。

XとYがともに10000で積の状態数が大きく、料理数80という小さい軸を使えていない。

dp[k][a]を甘さ合計aでk皿選ぶ最小しょっぱさとすれば、bを足す通常0/1 knapsackで存在性を圧縮できる。

m<Nなら上限内集合を先に食べ、未選択の任意一皿を最後に食べることでm+1皿を必ず達成できる。

dp[0][0]=0、他を∞とする。各料理(A_i,B_i)についてkと甘さaを降順に走査し、dp[k+1][a+A_i]をdp[k][a]+B_iでmin更新する。a≤Xかつdp[k][a]≤Yとなる最大kを探し、min(k+1,N)を出力する。

## 典型の発動条件

### DPのkey-value交換

発動条件: 二つの資源上限の積が大きいが、選択個数が小さいとき。

一方の資源と個数をindexにし、もう一方の最小消費をvalueにする。

### 停止直前集合への変換

発動条件: 閾値超過を起こす最後の操作も回数に含まれるとき。

最後の一手を外したfeasible集合を最適化し、答えへ一つ戻す。

## 問題固有の要素

制約を満たす皿数そのものではなく、その直後に閾値を超える一皿も食べ終えられるため+1が付く。

別の問題へ持ち帰る視点: processが違反検出後に停止するなら、違反を起こしたactionが成果に含まれるか確認する。

## 正当性

countと甘さを固定して塩気最小だけ持つと、他の候補は両制約への余裕で劣る。全料理の選択/非選択を旧行から更新して最大feasible count kを得る。実際はそのk個の後に閾値を超す一皿も食べられるため min(k+1,N)。

## 実装上の注意

- 0/1選択なのでkとaを降順更新する。a+A_iはXを超える状態を保持せず、答えの+1はNでcapする。

## 復習の核

- 「食べられる」と「次を選べる」の時点を区別し、N=1や全皿が上限内の例で+1処理を確認する。

## 計算量と制約

### 時間

N料理、甘上限X。選択個数×甘さ DP O(N²X)。

### 空間

count×甘さ O(NX)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 80; 1 \leq A_i, B_i \leq 10000; 1 \leq X, Y \leq 10000; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc364/tasks/abc364_e) — source-abc364-e-problem-f289fab9c8381e2b4f56dcd0a8aede73e15a87dea934c8f489c8e1d2581d1bb0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc364/editorial/10550) — source-abc364-editorial-10550-6bd9421e81822ad43403ee3bc7600cc7eae49364d5f67e86c9a5e3dc896a7e25
