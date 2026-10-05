---
title: "ABC383-F — Diversity"
draft: true
authoringUnit: {"problemId":"abc383-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc383-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc383-editorial-11543-469a2a268432e665cd71d9e0a5fadbd51552d07d27c532787834bef3176a4afb","source-abc383-f-problem-23cb991da11a36cac8f24478e4a39b588ecd6b35bf7540dad1c0861b1d621d3d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"色groupの一品目購入にだけ色bonusを加え、同group追加では加えない。group処理前dpと処理中curを分けるとこの区別を正確にできる。予算降順で各商品一度、全groupで全subsetを覆いbonusを各使用色一回だけ数える。","sourceRevisionIds":["source-abc383-editorial-11543-469a2a268432e665cd71d9e0a5fadbd51552d07d27c532787834bef3176a4afb","source-abc383-f-problem-23cb991da11a36cac8f24478e4a39b588ecd6b35bf7540dad1c0861b1d621d3d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

色bonus Kは同じ色の商品を一つでも買ったとき一度だけ加わる。通常の0/1 knapsackへ各商品ごとにbonusを足すと重複計上するため、色単位で遷移を分ける必要がある。色cを処理中、遷移元が前色までのdpならその色の初購入、処理中配列なら二個目以降と区別できる。各色開始時にprevを保存し、商品jではprev[p-P_j]+U_j+Kが初購入、cur[p-P_j]+U_jが同色追加に対応する。価格pを降順に走査して、同じ商品を同一色内で複数回使うunbounded遷移を防ぐ。

採用する候補: 商品を色ごとにまとめ、初購入だけKを足すgrouped 0/1 knapsackを行う

予算Xを一次元に保ちながら、色を使ったかという状態を処理前dpと処理中dpの二層で正確に表せ、O(NX)に収まる。

棄却する候補: 商品ごとに価値U_i+Kとして通常のknapsackをする

同色を複数買うたびKを加えてしまい、diversity bonusの一回性を表せない。

色別商品listを作る。dp[0]=0から色ごとにcur=dpを用意し、各商品を予算降順で「初購入」と「追加購入」の二経路から更新する。色終了後curを次のdpとする。

## 典型の発動条件

### grouped knapsack

発動条件: groupを一度でも選ぶbonus/costがあり、その後のitem寄与と異なるとき。

前group層と現group層を使い分け、最初の一品だけKを加える。

### 0/1 knapsackの降順更新

発動条件: 各itemを高々一度選ぶ予算DPをin-place更新するとき。

予算を大きい方から走査して同一itemの再利用を防ぐ。

## 問題固有の要素

「色を使ったか」のbitを全色分持たず、色を連続処理する順序によって一時的な二状態へ圧縮できる。

別の問題へ持ち帰る視点: groupに属するitemをまとめて処理すれば、group初回だけの効果を全体状態へ追加せず表せる。

## 正当性

色groupの一品目購入にだけ色bonusを加え、同group追加では加えない。group処理前dpと処理中curを分けるとこの区別を正確にできる。予算降順で各商品一度、全groupで全subsetを覆いbonusを各使用色一回だけ数える。

## 実装上の注意

- 存在しない色も安全にskipし、初購入遷移は必ず色処理前dpから取る。満足度は64 bit整数で持つ。

## 復習の核

- 同色を二つ買う場合、異色を一つずつ買う場合、K=大値の小例を全subset列挙と比較し、bonusが各色ちょうど一回かを確認する。

## 計算量と制約

### 時間

N商品、予算X。色sort O(N log N)、group knapsack O(NX)。

### 空間

予算DP二層 O(X)、商品O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 500; 1 \leq X \leq 50000; 1 \leq K \leq 10^9; 1 \leq P_i \leq X (1 \leq i \leq N); 1 \leq U_i \leq 10^9 (1 \leq i \leq N); 1 \leq C_i \leq N (1 \leq i \leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/editorial/11543) — source-abc383-editorial-11543-469a2a268432e665cd71d9e0a5fadbd51552d07d27c532787834bef3176a4afb
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/tasks/abc383_f) — source-abc383-f-problem-23cb991da11a36cac8f24478e4a39b588ecd6b35bf7540dad1c0861b1d621d3d
