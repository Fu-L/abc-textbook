---
title: "ABC373-E — How to Win the Election"
draft: true
authoringUnit: {"problemId":"abc373-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc373-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc373-e-problem-24a0916bd01b93bcaee356f649208d7c1b0d607b32eedb5794a50aaa4d23df51","source-abc373-editorial-11044-013abfd5e18e9e91bb7b8ec8a413682acb30bf7359b64ecdbfadc5a672648a4b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"候補を落とすには他の M 人を t より真に多い t+1 票へする必要があり、そのための追加票が残票以下かが反例の存在条件になる。 必要票 Σmax(0,t+1-A_j) は、昇順列で t 未満の範囲を二分探索し、個数×(t+1)-区間和として求められる。 保証可能性が x に対して単調で、妨害対象は候補自身を除く現在上位 M 人に固定できるため、一判定を O(log N) にできる。","sourceRevisionIds":["source-abc373-e-problem-24a0916bd01b93bcaee356f649208d7c1b0d607b32eedb5794a50aaa4d23df51","source-abc373-editorial-11044-013abfd5e18e9e91bb7b8ec8a413682acb30bf7359b64ecdbfadc5a672648a4b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

候補 i に追加 x 票を与えた後の票数を t とすると、落選させる最悪配分は他の現在上位 M 人を t+1 まで引き上げることに票を集中させる。x を増やすほどこの妨害は難しくなる。

採用する候補: 各候補について保証に必要な追加票 x を二分探索し、ソート済み票列と累積和で上位 M 人を t+1 へ上げる最小必要票を判定する。

保証可能性が x に対して単調で、妨害対象は候補自身を除く現在上位 M 人に固定できるため、一判定を O(log N) にできる。

棄却する候補: 残票の全配分を列挙し、候補が必ず上位 M 位以内かを確認する。

配分数は組合せ爆発し、残票 K が10^12なので列挙も票数 DP も成立しない。

候補を落とすには他の M 人を t より真に多い t+1 票へする必要があり、そのための追加票が残票以下かが反例の存在条件になる。

必要票 Σmax(0,t+1-A_j) は、昇順列で t 未満の範囲を二分探索し、個数×(t+1)-区間和として求められる。

A を元 index 付きで昇順 sort し累積和を作る。各候補と x に対し、候補自身を除いた上位 M 人への最小妨害票を区間和で算出し、候補へ使った分を除く残票と比較する。単調境界を二分探索する。

## 典型の発動条件

### 答えの二分探索と最悪配分

発動条件: 資源を自分へ追加したとき、どの敵対配分にも耐える最小量を求めるとき。

失敗させる最安の反例を計算し、その不可能化を単調判定にする。

## 問題固有の要素

「保証」を直接証明せず、落選させる配分が存在するかという反例最小化へ裏返す。

別の問題へ持ち帰る視点: 敵対者は既に大きい候補から選ぶのが最安であり、対象集合はほぼ連続区間になる。

## 正当性

候補を落とすには他の M 人を t より真に多い t+1 票へする必要があり、そのための追加票が残票以下かが反例の存在条件になる。 必要票 Σmax(0,t+1-A_j) は、昇順列で t 未満の範囲を二分探索し、個数×(t+1)-区間和として求められる。 保証可能性が x に対して単調で、妨害対象は候補自身を除く現在上位 M 人に固定できるため、一判定を O(log N) にできる。

## 実装上の注意

- 自分が上位 M 人に含まれる場合は一人分を次点と差し替える。N=M の全員当選、追加上限、t+1 の overflow を個別に扱う。

## 復習の核

- 判定式で「自分へ x 票」「他人へ使える残票」「他の M 人を t+1 にする費用」の三量を混同せず書き出す。

## 計算量と制約

### 時間

O(N log N+N log R log N)、Rは残票数、各安全性判定O(log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 2 \times 10^5; 1 \leq K \leq 10^{12}; 0 \leq A_i \leq 10^{12}; \displaystyle{\sum_{i=1}^{N} A_i} \leq K; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc373/tasks/abc373_e) — source-abc373-e-problem-24a0916bd01b93bcaee356f649208d7c1b0d607b32eedb5794a50aaa4d23df51
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc373/editorial/11044) — source-abc373-editorial-11044-013abfd5e18e9e91bb7b8ec8a413682acb30bf7359b64ecdbfadc5a672648a4b
