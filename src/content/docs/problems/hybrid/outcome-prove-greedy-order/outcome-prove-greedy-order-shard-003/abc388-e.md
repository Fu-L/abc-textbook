---
title: "ABC388-E — Simultaneous Kagamimochi"
draft: true
authoringUnit: {"problemId":"abc388-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc388-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-search"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc388-e-problem-58cfdf1ac841ef4f66e880f4cbe6cb2c4453df6feb38924782bc1f32005b321f","source-abc388-editorial-11901-e2fa9408a0fa74b2bc0da25b91cb0d18fd626ea3c05d14bb311e2e75cae3ac4c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"任意解の上段をより小さい先頭要素へ、下段をより大きい末尾要素へ置換しても2倍条件を保つ。 sorted同順位pairが全て成立すれば構成でき、一箇所でも失敗すれば順序保存matchingは存在しない。 可否がKについて単調で、一回O(K)の判定をO(log N)回行うO(N log N)が制約内に収まる。","sourceRevisionIds":["source-abc388-e-problem-58cfdf1ac841ef4f66e880f4cbe6cb2c4453df6feb38924782bc1f32005b321f","source-abc388-editorial-11901-e2fa9408a0fa74b2bc0da25b91cb0d18fd626ea3c05d14bb311e2e75cae3ac4c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- 対称操作による状態の正規化。

## 考察

Aは昇順で、K組作るなら上段を先頭K個、下段を末尾K個へ交換しても条件を悪化させない。

二集合を決めた後は小さい順同士をpairにできることと任意matchingの存在が同値なので、K個可能かはK本の不等式だけで判定できる。

採用する候補: K個可能かを先頭K・末尾Kの同順位pairで判定し、Kを二分探索する

可否がKについて単調で、一回O(K)の判定をO(log N)回行うO(N log N)が制約内に収まる。

棄却する候補: 餅を頂点とする二部matchingを毎回求める

sorted orderの交換論によりmatching graphを構築する必要がなく、一般matchingは過剰である。

任意解の上段をより小さい先頭要素へ、下段をより大きい末尾要素へ置換しても2倍条件を保つ。

sorted同順位pairが全て成立すれば構成でき、一箇所でも失敗すれば順序保存matchingは存在しない。

lo=0,hi=N/2+1で最大Kを二分探索する。判定ではi=0..K-1について上A[i]と下A[N-K+i]が鏡餅条件を満たすか全て確認する。

## 典型の発動条件

### 交換論によるextreme選択

発動条件: 大小条件付きで二集合から同数をpairingするとき。

小さい側は全体の先頭、大きい側は末尾へ置換する。

### 単調可否の二分探索

発動条件: k個作れるなら任意の少ない個数も作れるとき。

最大KをYes/No境界として探す。

## 問題固有の要素

選ぶ集合とpairingの二段階を、極端集合への交換とsorted matchingの二つの交換論で完全に固定できる。

別の問題へ持ち帰る視点: 順序付き二部matchingでは、最小同士のgreedy pairがHall条件を一次元化することがある。

## 正当性

任意解の上段をより小さい先頭要素へ、下段をより大きい末尾要素へ置換しても2倍条件を保つ。 sorted同順位pairが全て成立すれば構成でき、一箇所でも失敗すれば順序保存matchingは存在しない。 可否がKについて単調で、一回O(K)の判定をO(log N)回行うO(N log N)が制約内に収まる。

## 実装上の注意

- K=0を常に可能とし、下段開始N-Kと上段終了Kが重ならない範囲K≤N/2だけを探す。積2A[i]は64 bitで比較する。

## 復習の核

- N≤12で全matchingを列挙し、重複値、等号2A=bottom、奇数Nについて判定関数と最大Kを比較する。

## 計算量と制約

### 時間

O(N log N)、各K判定O(K)、sorted入力。

### 空間

O(N)、入力のみ。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5 \times 10^5; 1 \leq A_i \leq 10^9 \ (1 \leq i \leq N); A_i \leq A_{i+1} \ (1 \leq i < N); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/tasks/abc388_e) — source-abc388-e-problem-58cfdf1ac841ef4f66e880f4cbe6cb2c4453df6feb38924782bc1f32005b321f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/editorial/11901) — source-abc388-editorial-11901-e2fa9408a0fa74b2bc0da25b91cb0d18fd626ea3c05d14bb311e2e75cae3ac4c
