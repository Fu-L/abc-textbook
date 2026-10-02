---
title: "ABC427-G — Takahashi's Expectation 2"
draft: true
authoringUnit: {"problemId":"abc427-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc427-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-monotone-search"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-amortized-monotone-progress","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc427-editorial-14187-6859ca900ec077c45ab4ddab0902e2fe562c9bad8c2277792e47014ba7e5d4fd","source-abc427-g-problem-d5d44c48d7ef725e694608a0cce391a30f2bd165e4fa2794b3e40c274cb2d2d1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"良い列ではテンションが下がる判定から上がる判定へ切り替わる位置が高々一度なので、その境界を二分探索して最終値を計算できる。 列の連結は関数合成 t_{P++Q}=t_Q∘t_P であり、部分列を等価列へ置換しても全体の作用は変わらない。 良い列どうしの正規化マージはソート列のマージと同様に O(|P|+|Q|) で行える。 良い列への問い合わせは二分探索で処理でき、追加は償却 O(log M)、全体問い合わせは O((log M)^2) になる。","sourceRevisionIds":["source-abc427-editorial-14187-6859ca900ec077c45ab4ddab0902e2fe562c9bad8c2277792e47014ba7e5d4fd","source-abc427-g-problem-d5d44c48d7ef725e694608a0cce391a30f2bd165e4fa2794b3e40c274cb2d2d1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

プレゼント列は初期テンション T から最終値への関数を表す。隣接する悪い組 (p,q) は、長さを保ったまま等価な良い組 (q-A,max(q,p-B)) へ局所変換できる。

採用する候補: 各ブロックを等価な良い列 P_i+A≤P_{i+1} に正規化し、二進カウンタのように同じ長さのブロックを線形マージする。

良い列への問い合わせは二分探索で処理でき、追加は償却 O(log M)、全体問い合わせは O((log M)^2) になる。

棄却する候補: 追加のたびに全プレゼント列を保持し、質問ごとに先頭からテンションをシミュレーションする。

質問一回が現在の列長に比例し、多数のクエリに耐えない。

良い列ではテンションが下がる判定から上がる判定へ切り替わる位置が高々一度なので、その境界を二分探索して最終値を計算できる。

列の連結は関数合成 t_{P++Q}=t_Q∘t_P であり、部分列を等価列へ置換しても全体の作用は変わらない。

良い列どうしの正規化マージはソート列のマージと同様に O(|P|+|Q|) で行える。

長さが互いに異なる 2 冪の良い列ブロックを保持する。追加を長さ 1 の良い列とし、同長ブロックがある間は順序を保って結合・正規化する。質問では古いブロックから順に、各良い列上の切替位置を二分探索してテンションを更新する。

## 典型の発動条件

### 関数としての列の正規形

発動条件: 列が状態への作用を表し、局所的な等価変換で照会しやすい形へ直せるとき。

プレゼント列を全初期値 T に対して同じ結果を返す良い列へ正規化する。

### 二進カウンタ型ブロック分解

発動条件: 末尾追加があり、同サイズの要約を線形時間でマージできるとき。

2 冪長の良い列を高々一つずつ持ち、carry のようにマージして償却計算量を抑える。

### 単調境界の二分探索

発動条件: 正規化後の列で判定結果が一度だけ切り替わるとき。

テンションが下がる区間と上がる区間の境界を探し、まとめて作用を計算する。

## 問題固有の要素

保存すべきものは値列そのものより、任意の T への作用を保つ照会容易な代表列である。

別の問題へ持ち帰る視点: 合成可能な正規形と二進ブロックを組み合わせると、オンライン追加と全体作用の照会を両立できる。

## 正当性

良い列ではテンションが下がる判定から上がる判定へ切り替わる位置が高々一度なので、その境界を二分探索して最終値を計算できる。 列の連結は関数合成 t_{P++Q}=t_Q∘t_P であり、部分列を等価列へ置換しても全体の作用は変わらない。 良い列どうしの正規化マージはソート列のマージと同様に O(|P|+|Q|) で行える。 良い列への問い合わせは二分探索で処理でき、追加は償却 O(log M)、全体問い合わせは O((log M)^2) になる。

## 実装上の注意

- ブロックの連結順序を時系列どおりに保つ。局所変換の max(q,p-B) と q-A、良い条件 P_i+A≤P_{i+1} の不等号を取り違えない。

## 復習の核

- 正規化マージがすべての初期 T で作用を保存すること、質問時にブロックを古い順へ関数合成していることを確認する。

## 計算量と制約

### 時間

追加全体O(N log N)、Q質問O(Q log²N)、長さ2冪の各blockでO(log blocksize)探索。

### 空間

O(N)、block総長は追加数。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le A\le10 ^ 9; 1\le B\le10 ^ 9; -10 ^ 9\le P _ i\le10 ^ 9\ (1\le i\le N); 1\le Q\le2\times10 ^ 5; T _ i=1 or T _ i=2\ (1\le i\le Q); There exists an integer i\ (1\le i\le Q) such that T _ i=2.; If T _ i=1, then -10 ^ 9\le X _ i\le10 ^ 9. (1\le i\le Q); If T _ i=2, then -10 ^ {12}\le X _ i\le10 ^ {12}. (1\le i\le Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/editorial/14187) — source-abc427-editorial-14187-6859ca900ec077c45ab4ddab0902e2fe562c9bad8c2277792e47014ba7e5d4fd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/tasks/abc427_g) — source-abc427-g-problem-d5d44c48d7ef725e694608a0cce391a30f2bd165e4fa2794b3e40c274cb2d2d1
