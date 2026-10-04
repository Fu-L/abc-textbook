---
title: "ABC299-G — Minimum Permutation"
draft: true
authoringUnit: {"problemId":"abc299-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc299-g.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc299-editorial-6252-55d61d29022d60ea020340b687cb855075ccbde03c500c53f4557ff40796c8f7","source-abc299-g-problem-9bc46c6b96b4bfb589e507c4e019637bbdf246dfa1da30b2811e62e72c107a48"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"未選択値をすべて残すには、最も早い最後の出現を越える前に一つ選ばなければならない。その範囲の最小値を選ぶと、他の実行可能な先頭より辞書順で悪くならず、残りの各値の出現も残る。同じ議論を残りに繰り返せる。","sourceRevisionIds":["source-abc299-editorial-6252-55d61d29022d60ea020340b687cb855075ccbde03c500c53f4557ff40796c8f7","source-abc299-g-problem-9bc46c6b96b4bfb589e507c4e019637bbdf246dfa1da30b2811e62e72c107a48"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

次に選べる範囲は、未選択値の最終出現位置の最小rまでであり、そこを越すとrの値を二度と選べなくなる。

採用する候補: 最終出現境界内の最小値を貪欲選択

実現可能な先頭候補の中で最小値を最左位置から選べば辞書順最小となり、選択値を以後無効化して同じ問題を繰り返せる。

棄却する候補: 各値の最初の出現をそのまま採用

将来必要な値の最終出現を越えない範囲でより小さい別値を先に選べる。

r=min last[value]が「今必ず一つ選ぶ」deadlineで、prefix[ptr,r]の最小値が最適な次要素になる。

各値のlastを求め、未選択値の最小lastを境界rにする。segment tree/heapで現在位置..rの(value,index)最小を選び、位置を進め、その値の全出現を無効化してM回繰り返す。

## 典型の発動条件

### deadline付き辞書順貪欲

発動条件: 各種類を一度選ぶsubsequenceで、未選択種類ごとに最終機会がある。

最小deadlineまでの最小値を次に選ぶ。

### range minimum with deletions

発動条件: 可動prefixの最小(value,index)を反復取得し特定値を除く。

segment treeやheapのlazy deletionを使う。

## 問題固有の要素

全種類を残す実現可能性が、未選択値の最終出現の最小という単一境界で表せる。

別の問題へ持ち帰る視点: subsequence辞書順最小は将来要素のdeadlineを制約に貪欲する。

## 正当性

未選択値をすべて残すには、最も早い最後の出現を越える前に一つ選ばなければならない。その範囲の最小値を選ぶと、他の実行可能な先頭より辞書順で悪くならず、残りの各値の出現も残る。同じ議論を残りに繰り返せる。

## 実装上の注意

- 同じ最小値は最左indexを選び、選択済み値の全位置をINF化し、境界集合からlastを削除する。

## 復習の核

- 小列の全subsequenceと比較し、同値多数、last境界直前の最小値、既選択値が範囲最小になる例を確認する。

## 計算量と制約

### 時間

O(N log N)、全出現を一度ずつ無効化しM回range-min。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 2 \times 10^5; 1 \leq A_i \leq M; Every integer between 1 and M, inclusive, appears at least once in A.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/editorial/6252) — source-abc299-editorial-6252-55d61d29022d60ea020340b687cb855075ccbde03c500c53f4557ff40796c8f7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/tasks/abc299_g) — source-abc299-g-problem-9bc46c6b96b4bfb589e507c4e019637bbdf246dfa1da30b2811e62e72c107a48
