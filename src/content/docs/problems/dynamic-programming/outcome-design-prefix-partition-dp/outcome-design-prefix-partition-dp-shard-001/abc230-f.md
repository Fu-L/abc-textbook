---
title: "ABC230-F — Predilection"
draft: true
authoringUnit: {"problemId":"abc230-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc230-f.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition"],"sourceRevisionIds":["source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c","source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"選んだ切れ目のprefix和列から、隣り合う差を取るとブロック和列が一意に決まり、逆にブロック和の累積和から切れ目列が復元される。したがって異なる完成列とprefix和列の異なる部分列は一対一に対応する。新しい値 `v` を末尾に付けると部分列数は倍になるが、`v` の前回出現位置までに作られた部分列は同じ列を再生成する。その数を `last[v]` として引き、現在の旧 `D` を次の `last[v]` に保存するため、各部分列を一度だけ数える。","sourceRevisionIds":["source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c","source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

切れ目を置いた位置の元prefix和を `p_1,…,p_{N−1}` とする。ブロック和列を累積すると切れ目のprefix和列になり、差分を取ればブロック和列へ戻る。よって異なる完成列の個数は、prefix和列の異なる部分列の個数（空部分列を含む）に等しい。

異なる部分列数は `D=1`（空部分列）から始める。値 `v` を読むたび `old=D` とし、`D←2D−last[v]`、`last[v]←old` と更新する。前回の `v` 以降に作った部分列へ `v` を付けることで倍増し、前回位置までに作った分だけ重複として引く。

採用する候補: 内部prefix和のdistinct subsequence DP

切れ目や操作列を列挙せず、同じ完成ブロック和列を一つのprefix和部分列として数える。

棄却する候補: 各境界を残すか消すか全列挙し、完成列を集合で重複排除する。

境界選択は指数個で、完成列の保存・比較もできない。

## 典型の発動条件

### 生成過程の正規形による重複排除

発動条件: 複数の操作列が同じ完成物を作り、操作列数と完成物数が一致しないとき。

左から目標要素を確定する貪欲規則を固定し、完成列ごとに一つの操作列だけを数える。

### prefix 和の最新出現位置

発動条件: 0 和区間の存在が遷移可能範囲の境界を決めるとき。

同じ prefix 和の直前位置を連想配列で取得し、DP の区間和を累積和で求める。

## 問題固有の要素

未対応の末尾が残っても、その総和が 0 なら最後の完成値へ吸収して同じ列を作れるため、答えも 0 和 suffix に対応する DP の和になる。

別の問題へ持ち帰る視点: 正規化した生成過程に余りが生じる場合、余りが完成物を変えない条件を終端条件として別に数える。

## 正当性

選んだ切れ目のprefix和列から、隣り合う差を取るとブロック和列が一意に決まり、逆にブロック和の累積和から切れ目列が復元される。したがって異なる完成列とprefix和列の異なる部分列は一対一に対応する。新しい値 `v` を末尾に付けると部分列数は倍になるが、`v` の前回出現位置までに作られた部分列は同じ列を再生成する。その数を `last[v]` として引き、現在の旧 `D` を次の `last[v]` に保存するため、各部分列を一度だけ数える。

## 実装上の注意

- prefix 和は負にも 32 bit 範囲外にもなるため 64 bit のキーを使い、現在位置を計算した後に最新位置を更新する。
- DP・その累積和・最後の 0 和 suffix の添字基準を揃え、全体和が 0 の場合の先頭境界も含める。

## 復習の核

- 操作結果を数える問題では、操作列の列挙前に同じ結果を生む操作順・分割の例を作って一意性を検査する。
- 0 和区間が重複の原因なら、同じ prefix 和の「最新」出現がどの古い遷移を代表して消すかを追う。

## 計算量と制約

### 時間

ordered map使用でO(N log N)、平均O(1)hash mapなら期待O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; |A_i| \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/editorial/91) — source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/tasks/abc230_f) — source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba
