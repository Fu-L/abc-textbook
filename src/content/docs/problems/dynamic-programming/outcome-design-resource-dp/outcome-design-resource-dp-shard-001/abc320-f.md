---
title: "ABC320-F — Fuel Round Trip"
draft: true
authoringUnit: {"problemId":"abc320-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc320-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc320-editorial-7167-8dd6ca4160c25c43cdf355c2143ba482043c92d64e858f47e3dbce2f421831c0","source-abc320-f-problem-d19cf850f87884c29f311fddf735094aaf3418d2435ad4e15a6a565a4d01bf4f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"往路と復路の同じstationを一緒に処理し、往路給油後fuelと復路給油前fuelを状態とする。station間距離の消費は往路を順向き、復路を逆向きに加減するため、往復の時間差を状態の二fuelだけへ閉じ込められる。各stationの選択は不使用・往路給油・復路給油の三つで、同stationを二度買う遷移はない。給油min(H,f+F)の逆像は結果H未満なら一つ、Hなら区間H−F..Hなので、この全逆像を試せば全往復を覆う。折り返しで二fuelを接続した最小費用が実際の旅程と一対一になる。","sourceRevisionIds":["source-abc320-editorial-7167-8dd6ca4160c25c43cdf355c2143ba482043c92d64e858f47e3dbce2f421831c0","source-abc320-f-problem-d19cf850f87884c29f311fddf735094aaf3418d2435ad4e15a6a565a4d01bf4f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

同じstationは往路・復路のどちらか一度しか使えないため、両方向を別々に最適化すると使用競合を表せない。

外側へcoordinateを進めながら、同じ位置での往路fuelと復路fuelを同時に状態へ持てば、stationを未使用・往路使用・復路使用の3択として一度だけ処理できる。

turnaround X_Nでは往路到着時と復路出発時のfuelが同一なので、2つのfuel状態が等しいことが終端条件になる。

採用する候補: 位置iと往路fuel j・復路fuel kを持つ二方向同時DPで、各stationの3択を遷移する。

容量H≤300を二次状態に使い、round tripの共有station制約とturnaround接続を局所化できる。

棄却する候補: 往路と復路の最小給油費を独立に求めて足す。

同じstationを両方で選ぶ解が混ざり、各station一度という制約を破る。

棄却する候補: 現在fuelが少なくなったら直前stationで給油するgreedy。

容量上限による切捨てと復路用にstationを残す価値があり、局所的な不足だけでは最適側を決められない。

dp_i[j][k]で、station iを使う場合のjを往路使用後、kを復路使用前と非対称に定義すると、同じ給油操作を順方向DPでinvertして扱える。

復路側を外向きに逆算すると、距離dだけ内側へ走る前のfuelはk+dであり、Hを超える状態は不可能になる。

復路給油後がHなら給油前はH-F_i..Hのどれでもよく、H未満ならちょうど給油後-F_iという飽和の逆像を列挙する。

X_0=0とし、初期状態は往路fuel H、帰宅時fuel k=0..Hを費用0で許す。位置iへ距離d進むたび、往路はj-d≥0、復路逆算はk+d≤Hへ移す。station i<Nでは未使用、往路使用でjをmin(j+F_i,H)、復路使用で「給油後fuel」から可能な給油前kを逆算する3遷移を行い、使用時だけP_iを加える。X_Nまで進めた後、min_j dp_N[j][j]を答え、なければ-1。

## 典型の発動条件

### 往復を同時に見るDP

発動条件: 往路と復路が同じresourceや施設の一度使用制約を共有するとき。

同じ位置で両方向のresource量をpair状態にする。

### 操作の逆像遷移

発動条件: 一方向DPで逆向き行程の非可逆なcap操作を扱うとき。

min(k+F,H)の結果から可能な操作前fuelを列挙する。

### capacity付きresource DP

発動条件: resource上限Hが小さく、移動消費と補充を正確に追うとき。

fuel pairを0..Hで全列挙する。

## 問題固有の要素

復路を時間順に進めるのでなくX_0から外側へ逆算することで、各stationの往路・復路利用を同じDP layerで排他的に決められる。

別の問題へ持ち帰る視点: 往復で共有する局所選択は、片側を逆時間にして同じ空間位置で突き合わせると局所遷移になる。

## 正当性

往路と復路の同じstationを一緒に処理し、往路給油後fuelと復路給油前fuelを状態とする。station間距離の消費は往路を順向き、復路を逆向きに加減するため、往復の時間差を状態の二fuelだけへ閉じ込められる。各stationの選択は不使用・往路給油・復路給油の三つで、同stationを二度買う遷移はない。給油min(H,f+F)の逆像は結果H未満なら一つ、Hなら区間H−F..Hなので、この全逆像を試せば全往復を覆う。折り返しで二fuelを接続した最小費用が実際の旅程と一対一になる。

## 実装上の注意

- 復路給油後がHのcaseだけ給油前fuelに幅が生じ、単にH-F_iへ固定すると遷移を落とす。
- 各layerはINFで初期化し、station Nには給油選択を適用せずturnaround fuel一致だけを見る。
- 初期の復路帰宅時fuelは0..Hのどれでもよいため、dp_0[H][k]=0を全kに設定する。

## 復習の核

- Hへ飽和する復路給油を含む1-station例で、帰宅時fuelから外向きに逆算し、turnaroundでj=kになるまでの状態を手計算する。

## 計算量と制約

### 時間

O(NH²)、往路/復路fuelの二軸。飽和逆像は給油後Hの一境界列だけなので全列挙もO(H²)。

### 空間

O(H²)、station方向rolling。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, H \leq 300; 0 < X_1 < X_2 < \ldots < X_N \leq 10^5; 1 \leq P_i \leq 10^5; 1 \leq F_i \leq H; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc320/editorial/7167) — source-abc320-editorial-7167-8dd6ca4160c25c43cdf355c2143ba482043c92d64e858f47e3dbce2f421831c0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc320/tasks/abc320_f) — source-abc320-f-problem-d19cf850f87884c29f311fddf735094aaf3418d2435ad4e15a6a565a4d01bf4f
