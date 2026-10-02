---
title: "ABC320-E — Somen Nagashi"
draft: true
authoringUnit: {"problemId":"abc320-e","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc320-e.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset","unit-priority-queue-best-first"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-ordered-set-multiset","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc320-e-problem-12283801c6795f9728446ffd483e652ec89d9b9d9905e5e0d79f5a7727acb16d","source-abc320-editorial-7125-606774792fcfd0b76f743eab75028895ecdc10a505dbd84e14df2a86807d39e6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"そうめん時刻T_iはstrictly increasingなので、入力をそのまま主event順として使い、return heapからtime≤T_iをすべて移すだけでよい。 列が空ならeventは誰にも影響せず、新しいreturn eventも生成しない。 最小番号の取得・削除と時刻以下の復帰をどちらも対数時間で処理できる。","sourceRevisionIds":["source-abc320-e-problem-12283801c6795f9728446ffd483e652ec89d9b9d9905e5e0d79f5a7727acb16d","source-abc320-editorial-7125-606774792fcfd0b76f743eab75028895ecdc10a505dbd84e14df2a86807d39e6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

列にいる人は常に元の番号順に並ぶため、そうめんを受け取るfrontは在列者の最小番号である。

列を離れた人は決まった時刻T_i+S_iに戻るので、各そうめん時刻より前にreturn eventを時刻順で反映すれば現在の列を復元できる。

return時刻がそうめん時刻と同じならその人は既に列にいる扱いなので、同時刻ではreturnを先に処理する必要がある。

採用する候補: 在列者を番号ordered set、離脱者をreturn時刻min-heapで管理し、そうめんeventを時刻順にsimulationする。

最小番号の取得・削除と時刻以下の復帰をどちらも対数時間で処理できる。

棄却する候補: 各そうめん時刻に全N人を番号順に走査して在列者を探す。

N,Mとも2×10^5で、先頭付近が長く不在だと二次走査になる。

棄却する候補: 一度受け取った人をqueue末尾へ戻す。

復帰位置は受取順の末尾ではなく元の番号順であり、return時刻も人ごとに異なる。

そうめん時刻T_iはstrictly increasingなので、入力をそのまま主event順として使い、return heapからtime≤T_iをすべて移すだけでよい。

列が空ならeventは誰にも影響せず、新しいreturn eventも生成しない。

available setを{1..N}、return min-heapを空、answerを0で初期化する。各(T_i,W_i,S_i)の前にheap先頭のreturnTime≤T_iを全てpopしてpersonをavailableへ戻す。availableが非空なら最小personをeraseしanswerへW_iを加え、(T_i+S_i,person)をheapへpushする。最後に全answerを出力する。

## 典型の発動条件

### event sweep

発動条件: 時刻付き到着・復帰と入力済みeventを順にsimulationするとき。

次の主event前にpriority queueから期限到来eventを処理する。

### ordered setでの最優先対象

発動条件: active集合から最小IDを取り出し、後で再挿入するとき。

在列者のbeginをfront personとして使う。

## 問題固有の要素

列の物理的な詰め直しをsimulationせず、「在列中の番号集合の昇順」が列そのものを完全に表す。

別の問題へ持ち帰る視点: 順序が固定keyで復元できる待ち行列では、位置更新ではなくactive key集合として管理する。

## 正当性

そうめん時刻T_iはstrictly increasingなので、入力をそのまま主event順として使い、return heapからtime≤T_iをすべて移すだけでよい。 列が空ならeventは誰にも影響せず、新しいreturn eventも生成しない。 最小番号の取得・削除と時刻以下の復帰をどちらも対数時間で処理できる。

## 実装上の注意

- returnTime==T_iも先に復帰させるためheap条件を<ではなく≤にする。
- 獲得量累積とreturn時刻は32bitを超え得るので64bit整数を使う。

## 復習の核

- 人の復帰とそうめんが同時刻の例、列が空の例、番号の大きい人が先に復帰する例を追ってevent順とset最小値を確認する。

## 計算量と制約

### 時間

O((N+M)log N)、Mそうめんevent、各受取は一returnを生成。

### 空間

O(N+M)、通常heapの同時entry数≤N。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 0 <T_1 <\ldots < T_M \leq 10^9; 1 \leq S_i \leq 10^9; 1 \leq W_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc320/tasks/abc320_e) — source-abc320-e-problem-12283801c6795f9728446ffd483e652ec89d9b9d9905e5e0d79f5a7727acb16d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc320/editorial/7125) — source-abc320-editorial-7125-606774792fcfd0b76f743eab75028895ecdc10a505dbd84e14df2a86807d39e6
