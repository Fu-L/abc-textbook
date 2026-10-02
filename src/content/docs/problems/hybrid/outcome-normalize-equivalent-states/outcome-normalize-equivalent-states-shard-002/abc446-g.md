---
title: "ABC446-G — 221 Subsequence"
draft: true
authoringUnit: {"problemId":"abc446-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-002/abc446-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc446-editorial-16371-7e2dc85c07817b4f562f8b85ebccbeff91d4ca31241e7a4e9ef0df77a9872b6c","source-abc446-g-problem-37f1079958d3a19d18560c59f5699b3a1c2bca70a9712cbbda23a45c3d983770"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各値列には辞書順最小の貪欲添字列が一意に対応するため、値列を添字表現 P として重複なく数えられる。 C_p-A_p≥0 のとき、同値の (C_p-A_p) 回目と次の出現位置の間だけが直前末尾の許容範囲になる。 選んだ値をちょうど A_p 個追加するための前回位置条件が同値な開区間になり、point add・range sum または累積和で全遷移を高速化できる。","sourceRevisionIds":["source-abc446-editorial-16371-7e2dc85c07817b4f562f8b85ebccbeff91d4ca31241e7a4e9ef0df77a9872b6c","source-abc446-g-problem-37f1079958d3a19d18560c59f5699b3a1c2bca70a9712cbbda23a45c3d983770"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

同じ値が連続する block の末尾だけを抜き出すと、221 部分列の貪欲な最小添字列は、その末尾列 P に対する局所的な出現回数条件から一意に復元できる。

採用する候補: 各位置 p の値 A_p の prefix 出現回数 C_p から、直前 block 末尾が入れる一つの連続 index 区間を求め、dp[p] をその区間の dp 和として計算する。

選んだ値をちょうど A_p 個追加するための前回位置条件が同値な開区間になり、point add・range sum または累積和で全遷移を高速化できる。

棄却する候補: 全ての部分列を列挙し、各 run 長が値と一致する221数列か判定する。

部分列は2^N通りあり、同じ値列を作る複数の添字列も重複して数えてしまう。

各値列には辞書順最小の貪欲添字列が一意に対応するため、値列を添字表現 P として重複なく数えられる。

C_p-A_p≥0 のとき、同値の (C_p-A_p) 回目と次の出現位置の間だけが直前末尾の許容範囲になる。

値ごとの出現位置列と各 p の C_p を前計算する。番兵 dp[0]=1 を置き、p 昇順に許容左開右開区間を出現位置から得て range sum を dp[p] とし、point add する。dp[1..N] の総和を返す。

## 典型の発動条件

### 正準表現による部分列数え上げ

発動条件: 同じ値列を作る添字列が複数あり、distinct な部分列を数えたいとき。

各値列の辞書順最小添字列だけを数える。

### DP の区間和遷移

発動条件: 直前状態の許容 index が連続区間になるとき。

Fenwick tree・segment tree・累積和で遷移和を取得する。

## 問題固有の要素

run 制約を run の最後だけの列へ圧縮すると、各 block 内の添字は貪欲規則から自動的に決まる。

別の問題へ持ち帰る視点: distinct 部分列では値列ごとの正準な添字表現を定め、その表現が満たす条件を DP にする。

## 正当性

各値列には辞書順最小の貪欲添字列が一意に対応するため、値列を添字表現 P として重複なく数えられる。 C_p-A_p≥0 のとき、同値の (C_p-A_p) 回目と次の出現位置の間だけが直前末尾の許容範囲になる。 選んだ値をちょうど A_p 個追加するための前回位置条件が同値な開区間になり、point add・range sum または累積和で全遷移を高速化できる。

## 実装上の注意

- 出現回数0の番兵位置を0として扱い、区間の厳密不等号を Fenwick の半開範囲へ正しく変換する。答えから空列を除く。

## 復習の核

- 一つの run が値 x を x 個持つ条件から前回末尾の許容区間を導き、正準化が重複計数を除く理由を説明する。

## 計算量と制約

### 時間

O(N log N)、値別出現列とrange-sum DP。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 500\,000; 1 \leq A_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/editorial/16371) — source-abc446-editorial-16371-7e2dc85c07817b4f562f8b85ebccbeff91d4ca31241e7a4e9ef0df77a9872b6c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc446/tasks/abc446_g) — source-abc446-g-problem-37f1079958d3a19d18560c59f5699b3a1c2bca70a9712cbbda23a45c3d983770
