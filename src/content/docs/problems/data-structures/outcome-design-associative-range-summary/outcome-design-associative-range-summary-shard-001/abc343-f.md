---
title: "ABC343-F — Second Largest Query"
draft: true
authoringUnit: {"problemId":"abc343-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc343-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc343-editorial-9429-f957c82a79fb9fa65f5a79a28c8ef600eed7e0a6018d5e5492765d86106a5cbd","source-abc343-f-problem-118f15a1cd72a4d857e84ed257e673b547e83f09d03607b7bd2a8cf5c9f3a603"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"mergeでは左・右から最大4個の(value,count)候補を集め、同じvalueのcountを合算してdistinct value順の上位二つだけ残せばよい。この演算は区間multisetの要約なので結合順に依存せずassociativeである。 point assignmentとrange queryをどちらもO(log N)で処理し、query結果のsecond countを直接返せる。","sourceRevisionIds":["source-abc343-editorial-9429-f957c82a79fb9fa65f5a79a28c8ef600eed7e0a6018d5e5492765d86106a5cbd","source-abc343-f-problem-118f15a1cd72a4d857e84ed257e673b547e83f09d03607b7bd2a8cf5c9f3a603"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

区間を結合した時の最大・second distinct最大は、左右区間それぞれの上位二distinct値のどれかに限られる。したがって値と出現数のpairを二つだけ持つ情報がsegment treeのmonoidになる。

採用する候補: 各nodeに上位二distinct値と各countを持つsegment tree

point assignmentとrange queryをどちらもO(log N)で処理し、query結果のsecond countを直接返せる。

棄却する候補: query区間を毎回sortまたはfrequency map化する

range長に比例し、Q回の最悪計算量がO(NQ)またはO(QN log N)になる。

mergeでは左・右から最大4個の(value,count)候補を集め、同じvalueのcountを合算してdistinct value順の上位二つだけ残せばよい。この演算は区間multisetの要約なので結合順に依存せずassociativeである。

leafを(A_i,1,-∞,0)で初期化する。merge関数で二nodeの4候補をvalue別に統合し最大二値とcountを返す。type 1はleaf置換、type 2は[l,r)をfoldして第二値のcountを出力し、第二distinct値がなければ0を返す。

## 典型の発動条件

### top-k monoid

発動条件: range queryがdistinct値の上位k個と各frequencyだけを必要とし、kが定数である。

子nodeの候補2k個をmergeし上位kへtruncateするsummaryを持つ。

### point update・range fold

発動条件: 配列一点代入と区間summary queryが混在する。

segment treeのleaf更新とassociative mergeで処理する。

## 問題固有の要素

単なる二番目の要素でなく二番目に大きいdistinct valueなので、同値候補は順位を消費せずcountを合算する必要がある。

別の問題へ持ち帰る視点: order statisticsのrange summaryでは重複の順位定義に応じてvalue統合とmultiplicityを分ける。

## 正当性

mergeでは左・右から最大4個の(value,count)候補を集め、同じvalueのcountを合算してdistinct value順の上位二つだけ残せばよい。この演算は区間multisetの要約なので結合順に依存せずassociativeである。 point assignmentとrange queryをどちらもO(log N)で処理し、query結果のsecond countを直接返せる。

## 実装上の注意

- identityには実入力より小さいsentinelとcount 0を使い、sentinel同士を実候補として数えない。長さ1や全要素同値のqueryは0になる。

## 復習の核

- 全同値、最大値だけ重複、second値が左右nodeに跨る、更新で順位が入れ替わる例をsort真値と比較する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; For type-1 queries, 1 \leq p \leq N.; For type-1 queries, 1 \leq x \leq 10^9.; For type-2 queries, 1 \leq l \leq r \leq N.; There is at least one type-2 query.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/editorial/9429) — source-abc343-editorial-9429-f957c82a79fb9fa65f5a79a28c8ef600eed7e0a6018d5e5492765d86106a5cbd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/tasks/abc343_f) — source-abc343-f-problem-118f15a1cd72a4d857e84ed257e673b547e83f09d03607b7bd2a8cf5c9f3a603
