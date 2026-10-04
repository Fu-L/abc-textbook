---
title: "ABC325-F — Sensor Optimization Dilemma"
draft: true
authoringUnit: {"problemId":"abc325-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc325-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc325-editorial-7449-74ad2d2c5ccbb452ed7693aeb096d054c62cf569d6af4a3d8b61974855dfae26","source-abc325-f-problem-028bd12fa00570715edd9a40ccdb9bb363d331a16b8dc6034f7cda9a54ee84f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"第一sensor個数を固定すると未覆長を覆う第二の最小数は切上げで一意。同じ第一使用数で第二使用数が少ない解は将来の容量にも費用にも優越する。従って第二数をDP値にして全第一配分を列挙すれば両上限を満たす最小costを得る。","sourceRevisionIds":["source-abc325-editorial-7449-74ad2d2c5ccbb452ed7693aeb096d054c62cf569d6af4a3d8b61974855dfae26","source-abc325-f-problem-028bd12fa00570715edd9a40ccdb9bb363d331a16b8dc6034f7cda9a54ee84f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

各sectionは独立にsensor本数を割り当てるが、typeごとの総使用上限K_1,K_2だけがsection間を結ぶ。 processed section数とtype-1使用数を固定したとき、type-2使用数が多い状態は少ない状態に常に劣るため最小値1つだけ残せる。 section長Dへtype-1をk個使うと、残りlength max(D-kL_1,0)を覆うtype-2最小数はceil(残り/L_2)で一意に決まる。 同じjでtype-2使用数が小さい状態は、費用も上限制約も必ず有利なので完全なdominance関係になる。 type-1をsection長以上に過剰配置する必要はないが、単純に0..残りK_1を列挙しても状態上限内である。

採用する候補: dp[j]をtype-1をj個使ったときのtype-2最小使用数とし、sectionごとにtype-1割当kを列挙する。

3次元の両sensor数状態をdominanceで2次元へ圧縮し、最後にcostを正確に評価できる。

棄却する候補: section数・type-1数・type-2数を全て状態にするDP。

K_1K_2の積まで状態が増えるが、同じtype-1数ならtype-2最小だけで十分である。

棄却する候補: 1mあたりpriceが安いsensorだけを各sectionで優先する。

sectionごとの切上げ余りと各typeの総個数上限により、局所単価順が全体最適を保証しない。

同じjでtype-2使用数が小さい状態は、費用も上限制約も必ず有利なので完全なdominance関係になる。

type-1をsection長以上に過剰配置する必要はないが、単純に0..残りK_1を列挙しても状態上限内である。

dp[0]=0、他INFで始める。各D_iについてnextをINFにし、既使用jと当sectionへ使うk=0..K_1-jを列挙する。need2=max(0,D_i-kL_1)をL_2で切上げ、next[j+k]=min(next[j+k],dp[j]+need2)とする。全section後、dp[j]≤K_2の状態からjC_1+dp[j]C_2を最小化し、なければ-1。

## 典型の発動条件

### resource一方の最小値DP

発動条件: 2種類resourceの総上限があり、一方の使用数固定時に他方が少ないほど常に有利なとき。

type-1数をindex、type-2最小数をvalueにする。

### section内割当の全探索

発動条件: 小さい個数上限resourceを各groupへ何個配るか決めるとき。

当sectionのkを列挙し残りresourceをgreedyに算出する。

### ceil coverage

発動条件: 長さを固定能力Lの同種sensorで過不足を許して覆うとき。

(remaining+L-1)/Lで必要数を得る。

## 問題固有の要素

priceではなく使用個数をDP valueにすることで、type-2の上限判定とcost計算を最後まで両立し、同じtype-1数の状態を1つへまとめられる。

別の問題へ持ち帰る視点: 複数resource最適化では、固定したstate resourceに対して他resourceの最小使用量がdominance指標にならないか探す。

## 正当性

第一sensor個数を固定すると未覆長を覆う第二の最小数は切上げで一意。同じ第一使用数で第二使用数が少ない解は将来の容量にも費用にも優越する。従って第二数をDP値にして全第一配分を列挙すれば両上限を満たす最小costを得る。

## 実装上の注意

- dp値がK_2を超えた状態はINFとしてcapすると無駄な遷移を減らせる。
- 最終costは最大10^12規模なので64bit整数を使い、DPのINF加算を避ける。

## 復習の核

- 各sectionで切上げ余りが異なる小例を使い、同じtype-1総数でもtype-2使用数の小さい状態だけ残してよいことを確認する。

## 計算量と制約

### 時間

N section、第一sensor上限K1。各状態で追加k列挙 O(NK1²)。

### 空間

rolling first個数→最小second数 O(K1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 100; 1\leq D_i,L_j \leq 10^5; 1\leq C_j \leq 10^9; 1\leq K_j \leq 10^3; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc325/editorial/7449) — source-abc325-editorial-7449-74ad2d2c5ccbb452ed7693aeb096d054c62cf569d6af4a3d8b61974855dfae26
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc325/tasks/abc325_f) — source-abc325-f-problem-028bd12fa00570715edd9a40ccdb9bb363d331a16b8dc6034f7cda9a54ee84f9
