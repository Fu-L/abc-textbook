---
title: "ABC366-F — Maximum Composition"
draft: true
authoringUnit: {"problemId":"abc366-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc366-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-knapsack-resource"],"sourceRevisionIds":["source-abc366-editorial-10646-cce9c13c291c60591c0bfcc4be2a74401d1d89fdd993fae0b53c42322a8c8912","source-abc366-f-problem-90080f7f8506f8e37f734bfd765355c4ec2df0e9951c637fe2158bfe5590f139"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"`f_j∘f_i−f_i∘f_j=B_iB_j(r_j−r_i)`（`r_i=(A_i−1)/B_i`）なので、r_i≤r_jならiを内側、jを外側に置く方が値を下げない。この交換を繰り返すと昇順適用へ整列できる。整列後、各関数を選ぶか捨てるかの全ての部分列を選択数kのDPが一度ずつ扱う。kを降順更新するため同じ関数を重ねて使わず、K個の最大値を返す。","sourceRevisionIds":["source-abc366-editorial-10646-cce9c13c291c60591c0bfcc4be2a74401d1d89fdd993fae0b53c42322a8c8912","source-abc366-f-problem-90080f7f8506f8e37f734bfd765355c4ec2df0e9951c637fe2158bfe5590f139"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

`f_i(x)=A_i x+B_i` とおくと、二関数の交換差は `f_j(f_i(x))−f_i(f_j(x))=B_iB_j((A_j−1)/B_j−(A_i−1)/B_i)`。xに依存しないので、比率 `(A_i−1)/B_i` の昇順に内側から適用するのが最適である。

順序をsortで固定した後は、K個を選ぶ部分列DPにする。`dp[0]=1`、他は未到達とし、各関数を一度処理するごとに選択数kを降順にして `dp[k]=max(dp[k],A_i·dp[k−1]+B_i)`。

例えば `f(x)=2x+1` は比率1、`g(x)=x+2` は比率0。昇順のg,fで適用すると `f(g(1))=7`、逆順は `g(f(1))=5`。

採用する候補: 比率を昇順にsortし、選択個数DPでK関数を選ぶ。

交換差から順序と選択の自由度を分離できる。

棄却する候補: K個の集合とK!通りの適用順を探索する。

順序の支配関係を使わず、列挙量が制約を超える。

## 典型の発動条件

### 隣接交換による最適順序付け

発動条件: 選んだ要素の適用順がpair交換の符号だけで決まるとき。

二要素の順序差を展開し、globalなsort keyを導く。

### 順序固定後の選択DP

発動条件: 最適な相対順が決まり、その列からちょうど少数個を選ぶとき。

採用数だけを状態にして関数適用値を最大化する。

## 問題固有の要素

合成結果は急速に増えるが、順序の優劣が現在値xから独立なので、選択と並べ替えを完全に分離できる。

別の問題へ持ち帰る視点: 関数合成最適化では二関数の交換差を展開し、入力状態が消えるか調べる。

## 正当性

`f_j∘f_i−f_i∘f_j=B_iB_j(r_j−r_i)`（`r_i=(A_i−1)/B_i`）なので、r_i≤r_jならiを内側、jを外側に置く方が値を下げない。この交換を繰り返すと昇順適用へ整列できる。整列後、各関数を選ぶか捨てるかの全ての部分列を選択数kのDPが一度ずつ扱う。kを降順更新するため同じ関数を重ねて使わず、K個の最大値を返す。

## 実装上の注意

- 比率は除算せず `(A_i−1)B_j` と `(A_j−1)B_i` の積で比較し、昇順にする。
- `dp[0]=1`、他は未到達。各関数でkを降順に更新して、同じ関数の再利用を防ぐ。積とDP値は制約に合う整数型で持つ。

## 復習の核

- 二関数だけで両順序を展開しsort不等号の向きを確定する。DPが外側・内側のどちらから合成しているか例で検査する。

## 計算量と制約

### 時間

O(N log N+NK)、関数順sortとK選択DP。

### 空間

O(N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^{5}; 1 \leq K \leq \text{min}(N,10); 1 \leq A_i, B_i \leq 50 (1 \leq i \leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/editorial/10646) — source-abc366-editorial-10646-cce9c13c291c60591c0bfcc4be2a74401d1d89fdd993fae0b53c42322a8c8912
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/tasks/abc366_f) — source-abc366-f-problem-90080f7f8506f8e37f734bfd765355c4ec2df0e9951c637fe2158bfe5590f139
