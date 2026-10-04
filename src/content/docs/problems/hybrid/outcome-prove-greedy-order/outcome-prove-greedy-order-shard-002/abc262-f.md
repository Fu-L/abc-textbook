---
title: "ABC262-F — Erase and Rotate"
draft: true
authoringUnit: {"problemId":"abc262-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc262-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc262-f-problem-e97d9131710ad7ff7ac0ab7616fd67a116b4f8df7a6289f54313e1c37043b87a","source-abc262-editorial-4504-fa00567abe2f9d20ce2bfdad3b0955cae6283d3d8c422a1f3fef480ede8090b7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"削除と回転を交換し、回転を先、削除を後にする正規形へ移せる。回転で前へ運んだ要素を削除する場合は、その要素を回転前に削除し、その分だけ回転を減らせるため、同じ残存列を同じ以下の操作数で作れる。固定した先頭候補の後は、回転済み部分の削除を0、元の前半の削除を1とした費用付き区間の最小値を次に取るのが辞書順最適である。実現可能な先頭値は回転なしと末尾側の最小値に限られるため、この二候補を比較すれば全ての最適列を覆う。","sourceRevisionIds":["source-abc262-f-problem-e97d9131710ad7ff7ac0ab7616fd67a116b4f8df7a6289f54313e1c37043b87a","source-abc262-editorial-4504-fa00567abe2f9d20ce2bfdad3b0955cae6283d3d8c422a1f3fef480ede8090b7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

正の回転回数で先頭に来る要素は、末尾K個のどれかである。回転を一回以上使うなら、その範囲の最小値以外を先頭にする候補は辞書順で負ける。回転なしでは先頭候補は先頭K+1個なので、ここでも最小値だけ残せばよい。

末尾から `p_i` を先頭へ運ぶ回転数を `r=N−i+1` とする。回転後の順序は `p_i,…,p_N,p_1,…,p_{i−1}`。回転で前へ運ばれた `p_{i+1}…p_N` の削除は、回転前に削除すると必要な回転も一つ減るため、残り予算 `K−r` を消費しない。一方、元の前半 `p_1…p_{i−1}` を飛ばす削除は一回ずつこの予算を使う。

したがって、次の値は「回転済み部分の飛ばしを0、元の前半の飛ばしを1」と数え、累積費用が残予算以内の範囲の最小値を選べばよい。選んだ位置までに飛ばした元の前半要素数だけ予算を減らす。これにより回転候補にも削除だけの辞書順貪欲を適用できる。

採用する候補: 回転なしの先頭最小値と、末尾側の先頭最小値だけを作り、費用付きの削除貪欲で比較する。

棄却する候補: 回転回数 r=0,…,K を全て固定して各候補を独立に構築する。

候補ごとの線形走査では二乗規模になる。

## 典型の発動条件

### 辞書順最小部分列の貪欲法

発動条件: 順序を保ったまま一定数まで要素を削除し、残る列を辞書順最小にしたいとき。

削除可能範囲内の最小値を次要素に選び、飛ばした要素数だけ予算を消費する。

### 操作交換による正規形

発動条件: 削除と並べ替え操作の順序が多数あるが、局所交換で同じ結果・同じ以下の費用に揃えられるとき。

回転を先、削除を後に集約し、回転済み要素の削除を回転前削除へ対応させる。

### RMQ を使う貪欲シミュレーション

発動条件: 単調に進む候補区間から最小要素と位置を繰り返し取得するとき。

Segment Tree またはスライド最小値で次に採用する要素を高速取得する。

## 問題固有の要素

正の回転候補では先頭へ来た要素を削除しないため、末尾 K 要素中の最小値を先頭にする回転だけを残せる。

別の問題へ持ち帰る視点: 辞書順最適化では、実現可能な先頭値を先に最小化すると後続探索の候補を大幅に削れる。

## 正当性

削除と回転を交換し、回転を先、削除を後にする正規形へ移せる。回転で前へ運んだ要素を削除する場合は、その要素を回転前に削除し、その分だけ回転を減らせるため、同じ残存列を同じ以下の操作数で作れる。固定した先頭候補の後は、回転済み部分の削除を0、元の前半の削除を1とした費用付き区間の最小値を次に取るのが辞書順最適である。実現可能な先頭値は回転なしと末尾側の最小値に限られるため、この二候補を比較すれば全ての最適列を覆う。

## 実装上の注意

- 回転候補では、`K−r` を元の前半から飛ばせる個数として持つ。次要素を選ぶ範囲では回転済み部分の飛ばしを費用0、元の前半の飛ばしを費用1とし、予算更新も後者だけ数える。
- 回転なし候補と回転候補を同じ長さの配列とみなさず、残り操作を列末尾の削除に使った後、通常の辞書順で比較する。

## 復習の核

- 複数種類の操作が任意順なら、操作同士を交換して代表的な順序へ正規化できるか証明する。
- 辞書順最小化では後続を作り込む前に、実現可能な先頭値ごとの支配関係で候補数を絞る。

## 計算量と制約

### 時間

O(N log N)、候補回転と削除greedyをrange-minで行う。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq K \leq N-1; 1 \leq p_i \leq N; (p_1,p_2,\ldots,p_N) contains 1,2,\ldots,N exactly once each.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/tasks/abc262_f) — source-abc262-f-problem-e97d9131710ad7ff7ac0ab7616fd67a116b4f8df7a6289f54313e1c37043b87a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/editorial/4504) — source-abc262-editorial-4504-fa00567abe2f9d20ce2bfdad3b0955cae6283d3d8c422a1f3fef480ede8090b7
