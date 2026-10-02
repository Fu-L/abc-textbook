---
title: "ABC441-G — Takoyaki and Flip"
draft: true
authoringUnit: {"problemId":"abc441-g","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc441-g.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc441-editorial-15103-53734a38f511a7b1b7f989c215be897bae76dac5c7e5ee46f8df14a502c06245","source-abc441-g-problem-6b1f42602dae00eb8633de4f6741c2c4433f2b299f53f8ca86aea2176c99a261"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"後段の反転回数 c が0なら以前の追加 b は残って d と加算され、c>0なら以前の追加は消えて d だけが残る。 区間要約 (最大値,表数,裏数) は反転 parity と表向き皿の有無に応じて、最大値を 0・b・旧最大+b のいずれかへ更新できる。 区間要約から任意の (a,b) 後の要約を定数時間で計算でき、作用合成も結合的なので遅延伝播の要件を満たす。","sourceRevisionIds":["source-abc441-editorial-15103-53734a38f511a7b1b7f989c215be897bae76dac5c7e5ee46f8df14a502c06245","source-abc441-g-problem-6b1f42602dae00eb8633de4f6741c2c4433f2b299f53f8ca86aea2176c99a261"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

一つの区間に作用した複数更新は、最後の反転より前の追加が消えるため「a 回反転した後に b 個追加する」という組 (a,b) へ圧縮できる。作用の合成は順序依存だが結合的である。

採用する候補: 区間の最大値と表向き・裏向きの皿数を segment tree に持ち、更新作用 (a,b) の合成則を lazy tag として実装する。

区間要約から任意の (a,b) 後の要約を定数時間で計算でき、作用合成も結合的なので遅延伝播の要件を満たす。

棄却する候補: 反転または追加のたびに区間内の各皿の向きと個数を直接更新する。

一回の query が Θ(N) 要素へ及び得るため、Q=2×10^5 では総更新量が二乗になる。

後段の反転回数 c が0なら以前の追加 b は残って d と加算され、c>0なら以前の追加は消えて d だけが残る。

区間要約 (最大値,表数,裏数) は反転 parity と表向き皿の有無に応じて、最大値を 0・b・旧最大+b のいずれかへ更新できる。

各 node に最大たこ焼き数と両向きの皿数を保存する。追加を (0,b)、反転を (1,0) とし、node 要約への action と oldTag⊕newTag の合成を定義して range apply、全体 max query を処理する。

## 典型の発動条件

### 作用モノイド付き lazy segment tree

発動条件: 区間更新が順序依存でも、有限情報へ圧縮して結合的に合成できるとき。

更新列を (反転回数,最後の反転後の追加量) として tag に保持する。

## 問題固有の要素

操作履歴はすべて保持せず、将来の結果に残る最後のリセット以後だけを作用として要約できる。

別の問題へ持ち帰る視点: lazy 作用では node 情報だけでなく、old と new の tag をどちらの順に合成するかを代数的に先に定める。

## 正当性

後段の反転回数 c が0なら以前の追加 b は残って d と加算され、c>0なら以前の追加は消えて d だけが残る。 区間要約 (最大値,表数,裏数) は反転 parity と表向き皿の有無に応じて、最大値を 0・b・旧最大+b のいずれかへ更新できる。 区間要約から任意の (a,b) 後の要約を定数時間で計算でき、作用合成も結合的なので遅延伝播の要件を満たす。

## 実装上の注意

- tag の合成は非可換なので old⊕new の順を逆にしない。表向き枚数0の区間では追加が最大値へ影響しない分岐も必要。

## 復習の核

- 短い操作列「追加→反転→追加」と「反転→追加→追加」を合成式へ代入し、tag と node action の双方を照合する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le Q\le2\times10 ^ 5; In all queries, 1\le L\le R\le N.; In type 1 queries, 1\le X\le10 ^ 9.; There is at least one type 3 query.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/editorial/15103) — source-abc441-editorial-15103-53734a38f511a7b1b7f989c215be897bae76dac5c7e5ee46f8df14a502c06245
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/tasks/abc441_g) — source-abc441-g-problem-6b1f42602dae00eb8633de4f6741c2c4433f2b299f53f8ca86aea2176c99a261
