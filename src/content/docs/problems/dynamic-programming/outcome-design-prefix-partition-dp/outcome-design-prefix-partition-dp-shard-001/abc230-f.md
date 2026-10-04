---
title: "ABC230-F — Predilection"
draft: true
authoringUnit: {"problemId":"abc230-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc230-f.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition"],"sourceRevisionIds":["source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c","source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"選んだ切れ目のprefix和列から、隣り合う差を取るとブロック和列が一意に決まり、逆にブロック和の累積和から切れ目列が復元される。したがって異なる完成列とprefix和列の異なる部分列は一対一に対応する。新しい値 `v` を末尾に付けると部分列数は倍になるが、`v` の前回出現位置までに作られた部分列は同じ列を再生成する。その数を `last[v]` として引き、現在の旧 `D` を次の `last[v]` に保存するため、各部分列を一度だけ数える。","sourceRevisionIds":["source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c","source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

切れ目を置いた位置の元prefix和を `p_1,…,p_{N−1}` とする。ブロック和列を累積すると切れ目のprefix和列になり、差分を取ればブロック和列へ戻る。よって異なる完成列の個数は、prefix和列の異なる部分列の個数（空部分列を含む）に等しい。

異なる部分列数は `D=1`（空部分列）・未登録の `last[v]=0` から始める。値 `v` を読むたび `old=D` とし、`D←2D−last[v]`、`last[v]←old` と更新する。全ての既存部分列へ `v` を付けることで倍増し、前回位置までに作った分だけ重複として引く。

採用する候補: 内部prefix和のdistinct subsequence DP

切れ目や操作列を列挙せず、同じ完成ブロック和列を一つのprefix和部分列として数える。

棄却する候補: 各境界を残すか消すか全列挙し、完成列を集合で重複排除する。

境界選択は指数個で、完成列の保存・比較もできない。

内部prefix和N−1個を処理したDが答えである。全体和p_Nは完成列の最後として固定されるため、部分列DPには入れない。

## 典型の発動条件

### 完成物を一意に符号化する

発動条件: 操作列や分割の仕方が違っても同じ完成列を作るとき。

ブロック和の累積和へ写し、完成列の相違をprefix和部分列の相違へ変える。

### 異なる部分列のDP

発動条件: 同じ値が繰り返し現れ、位置選択の数と値列の種類数が一致しないとき。

新しい値を末尾に付ける全候補から、その値の前回出現で既に生成した個数を引く。lastには位置でなく、その時点の更新前のDを保存する。

## 問題固有の要素

切れ目のprefix和列とブロック和列は、累積和と差分で相互に復元できる。元の要素に負値や0があっても、この対応自体は変わらない。

別の問題へ持ち帰る視点: 分割の結果を数えるときは、境界の位置から別の一意な値列へ写し、既知の重複除去DPに接続できないか考える。

## 正当性

選んだ切れ目のprefix和列から、隣り合う差を取るとブロック和列が一意に決まり、逆にブロック和の累積和から切れ目列が復元される。したがって異なる完成列とprefix和列の異なる部分列は一対一に対応する。新しい値 `v` を末尾に付けると部分列数は倍になるが、`v` の前回出現位置までに作られた部分列は同じ列を再生成する。その数を `last[v]` として引き、現在の旧 `D` を次の `last[v]` に保存するため、各部分列を一度だけ数える。

## 実装上の注意

- 内部prefix和だけを64bitで計算する。N=1なら処理対象は空で、初期D=1がそのまま答えになる。
- 未登録lastは0。old=Dを保存してからDを更新し、last[v]=oldとする。全演算をmod 998244353で行い、減算を非負に戻す。

## 復習の核

- 操作結果を数えるときは、同じ結果を生む分割の小例から、何を一意な符号にできるか考える。
- 異なる部分列DPでは、重複分を「同じ末尾値の前回生成数」で引く。位置と個数を混同しない。

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
