---
title: "ABC392-F — Insert"
draft: true
authoringUnit: {"problemId":"abc392-f","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-002/abc392-f.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc392-editorial-12145-445d321e81594035b30924e7b75bfa6caefdf30ca487bdcd898557192838566c","source-abc392-f-problem-7960d080321bdc2198bcb5bf95b6b91511eb57189a943c0f3bf2ee17d8a8ddb4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"逆順時点の空き枠数はちょうどiなので、制約1≤P_i≤iによりP_i番目の空きが必ず存在する。 求めたposition posへanswer[pos]=iと書き、Fenwickへ-1すれば以後のrankから消える。 prefix sumがP_i以上となる最小indexをO(log N)で求め、点を0へ更新できるので全体O(N log N)で最終位置を確定できる。","sourceRevisionIds":["source-abc392-editorial-12145-445d321e81594035b30924e7b75bfa6caefdf30ca487bdcd898557192838566c","source-abc392-f-problem-7960d080321bdc2198bcb5bf95b6b91511eb57189a943c0f3bf2ee17d8a8ddb4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

先に読む単元:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

forward挿入では後続操作が既存要素の位置をずらすため、平衡木なしに配列へ直接insertすると二次になる。

操作を逆順に見ると、最終N枠のうち現在空いているP_i番目の枠が要素iの最終位置であり、その枠を削除するだけになる。

採用する候補: N個の空き枠をFenwick treeで管理し、i=N..1にP_i番目の1をorder-statistic searchする

棄却する候補: vectorのP_i位置へiを順に挿入する

各挿入でsuffixをshiftし、N=5×10^5ではΘ(N²)になる。

長さNのFenwickを全て1で初期化する。i=N..1についてFenwickのlower_bound(P_i)でposを求め、ans[pos]=i、add(pos,-1)とする。ansを順に出力する。

## 典型の発動条件

### 操作の逆転

発動条件: forward insertが後続要素を広範囲に動かすとき。

最終枠からrank指定で削除する過程へ変える。

### Fenwick treeのk-th search

発動条件: 動的0/1列からk番目の有効indexを求めたいとき。

prefix sum lower_boundをbinary liftingで行う。

## 問題固有の要素

挿入された値そのものの大小順ではなく、最終的な空きpositionを逆から割り当てると、位置ずれを明示的に処理せずに済む。

別の問題へ持ち帰る視点: rank位置への逐次挿入は、全slotを先に用意して逆順にk-th空きを埋める定番変換を試す。

## 正当性

逆順時点の空き枠数はちょうどiなので、制約1≤P_i≤iによりP_i番目の空きが必ず存在する。 求めたposition posへanswer[pos]=iと書き、Fenwickへ-1すれば以後のrankから消える。 prefix sumがP_i以上となる最小indexをO(log N)で求め、点を0へ更新できるので全体O(N log N)で最終位置を確定できる。

## 実装上の注意

- P_iは1-indexed rankで、Fenwick lower_boundの返すindex規約を合わせる。全1初期化をO(N)またはN回addで正しく行う。

## 復習の核

- N≤9でvector insert結果と比較し、P_i=1が連続するcase、P_i=iが連続するcase、Fenwick境界indexを確認する。

## 計算量と制約

### 時間

O(N log N)、空きrank Fenwick kth。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5\times 10^5; 1 \leq P_i \leq i; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/editorial/12145) — source-abc392-editorial-12145-445d321e81594035b30924e7b75bfa6caefdf30ca487bdcd898557192838566c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/tasks/abc392_f) — source-abc392-f-problem-7960d080321bdc2198bcb5bf95b6b91511eb57189a943c0f3bf2ee17d8a8ddb4
