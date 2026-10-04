---
title: "ABC455-F — Merge Slimes 2"
draft: true
authoringUnit: {"problemId":"abc455-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc455-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-modular-arithmetic","unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc455-editorial-19241-da4989a5ebdd44c503c9363a958049ed6ec3f1adcafafec35f4534d0ffedbc7d","source-abc455-f-problem-76c0283331a2cf3cb4b1a40e1c35a7935555beb137dc24ad0e9e5e21b01cf28e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"異なる初期groupの二人pairは、その二groupが初めてmergeされる一回だけcostへ数えられるため順序不変である。 range add後の二乗和更新には更新前sumを使うので、式を計算してからsumを書き換える。 Bへd加算したとき ΣB は sum+d×len、ΣB^2 は sumSq+2d×sum+d^2×len と定数情報で更新でき、node mergeも各momentの和で閉じる。","sourceRevisionIds":["source-abc455-editorial-19241-da4989a5ebdd44c503c9363a958049ed6ec3f1adcafafec35f4534d0ffedbc7d","source-abc455-f-problem-76c0283331a2cf3cb4b1a40e1c35a7935555beb137dc24ad0e9e5e21b01cf28e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

一群になるまで slime をmergeする総costはmerge順に依存せず、初期size B_m の異group pair総数 ((ΣB)^2-ΣB^2)/2 に等しい。

採用する候補: 各segment tree nodeに要素数、区間和、二乗和を持ち、range addのlazy作用で和と二乗和を更新してquery区間の閉形式costを返す。

棄却する候補: 各query区間の slime sizeを取り出し、priority queue等でmerge順をsimulationする。

区間長に比例する処理をQ回行ううえ、merge順探索は不要な再計算で二乗規模になる。

leafを(len=1,sum=A_i,sumSq=A_i^2)で初期化する。lazy dのapplyで二momentを公式更新し、range addを処理する。query nodeの S,Q から (S^2-Q)/2 をmodulus上で返す。

## 典型の発動条件

### 操作順不変量のpair寄与

発動条件: cluster merge costが二群sizeの積で与えられるとき。

初期要素pairが初めて同群になる一回へ寄与を割り当てる。

### moment付きlazy segment tree

発動条件: range add下で区間の和と二乗和を問い合わせたいとき。

0次・1次・2次momentを二項展開で更新する。

## 問題固有の要素

merge過程の最適化に見えても、各元要素pairの寄与回数を数えると操作順が消える場合がある。

別の問題へ持ち帰る視点: 多項式統計へのrange addは、必要次数までのmomentを持てば二項定理で作用が閉じる。

## 正当性

異なる初期groupの二人pairは、その二groupが初めてmergeされる一回だけcostへ数えられるため順序不変である。 range add後の二乗和更新には更新前sumを使うので、式を計算してからsumを書き換える。 Bへd加算したとき ΣB は sum+d×len、ΣB^2 は sumSq+2d×sum+d^2×len と定数情報で更新でき、node mergeも各momentの和で閉じる。

## 実装上の注意

- sumSq更新でold sumを保持し、d^2×lenを十分広い整数またはmod乗算で計算する。2のinverseと負modを正規化する。

## 復習の核

- 三groupの異group pairをmerge順二通りで数え、range addの二乗展開をnode値へ代入して確認する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq Q \leq 10^5; 1 \leq l_q \leq r_q \leq N; 1 \leq a_q \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc455/editorial/19241) — source-abc455-editorial-19241-da4989a5ebdd44c503c9363a958049ed6ec3f1adcafafec35f4534d0ffedbc7d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc455/tasks/abc455_f) — source-abc455-f-problem-76c0283331a2cf3cb4b1a40e1c35a7935555beb137dc24ad0e9e5e21b01cf28e
