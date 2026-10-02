---
title: "ABC358-E — Alphabet Tiles"
draft: true
authoringUnit: {"problemId":"abc358-e","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc358-e.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc358-e-problem-ce60cff63fd0577725456c91d6665c619045aa7e5cae031c6388896e96d4e6c5","source-abc358-editorial-10224-5173bc717de96c786fc42652937e6a6bff489baa562df3ae25093cf36b299e82"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"新文字k個の位置を完成長jからC(j,k)で選び、残りへ旧文字列を順序保持で入れると構成は一意。逆に新文字を全て削除すれば旧文字列へ戻るので重複もない。文字別上限を守る遷移が全使用vectorを覆い、最後に長さ1..Kだけ足して空列を除く。","sourceRevisionIds":["source-abc358-e-problem-ce60cff63fd0577725456c91d6665c619045aa7e5cae031c6388896e96d4e6c5","source-abc358-editorial-10224-5173bc717de96c786fc42652937e6a6bff489baa562df3ae25093cf36b299e82"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

使用済み文字種類1..iと完成文字列長jだけを状態にすれば、次文字をk個使う配置は既存 j−k 文字の間へではなく、完成j位置からk位置を選ぶ C(j,k) 通りで数えられる。

文字種類は26で K≤1000なので、各種類の使用数0..C_iを列挙する O(26K²) DP が十分である。

採用する候補: dp[i][j]を先頭i種類で作る長さj文字列数とし、次文字使用数kごとにbinomial係数で挿入する。

同じ文字のk個は互いに区別しないため位置選択だけで正確に数え、上限制約もk≤C_iで直接表せる。

棄却する候補: 長さごとに26^length文字列を生成し、各文字頻度を検査する。

K=1000で指数的に増え、同じ頻度vectorを持つ多数文字列をまとめて数えていない。

長さjの完成列で新文字の位置k個を選ぶと、残り位置へ以前の文字列を順序保持で一意に埋められるので係数は C(j,k)。

空文字dp[0][0]=1から始めるが、答えでは長さ1..Kだけを合計し空文字を除外する。

factorial/inverse factorialでC(n,k)を前計算する。dp[0]=1とし各文字cについて next[j]=Σ_{k=0}^{min(C_c,j)}dp[j−k]C(j,k) を計算する。26種類後のdp[1..K]を合計する。

## 典型の発動条件

### 同一要素挿入の組合せDP

発動条件: 種類ごとの使用上限があり、順序付き列を全長で数えるとき。

新種類k個の完成位置をbinomialで選び、以前の列を残りへ埋める。

## 問題固有の要素

multinomialを頻度vector全列挙で計算せず、文字種類を一つずつ増やすbinomialの積に分解する。

別の問題へ持ち帰る視点: 順序付きmultiset数え上げは、一種類追加時の位置選択としてDP化すると上限を扱いやすい。

## 正当性

新文字k個の位置を完成長jからC(j,k)で選び、残りへ旧文字列を順序保持で入れると構成は一意。逆に新文字を全て削除すれば旧文字列へ戻るので重複もない。文字別上限を守る遷移が全使用vectorを覆い、最後に長さ1..Kだけ足して空列を除く。

## 実装上の注意

- C_i>KならKへ切り詰めてよい。nextを毎文字0初期化し、空文字を最終答えへ加えない。

## 復習の核

- C(j,k)が「新文字の位置」であることを、小さい既存列へ同じ文字を挿す例で確認する。長さindexを完成後基準に統一する。

## 計算量と制約

### 時間

O(26K²)。各文字使用数を完成長ごとに列挙する。

### 空間

O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq 1000; 0 \leq C_i \leq 1000; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc358/tasks/abc358_e) — source-abc358-e-problem-ce60cff63fd0577725456c91d6665c619045aa7e5cae031c6388896e96d4e6c5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc358/editorial/10224) — source-abc358-editorial-10224-5173bc717de96c786fc42652937e6a6bff489baa562df3ae25093cf36b299e82
