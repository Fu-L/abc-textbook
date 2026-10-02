---
title: "ABC407-E — Most Valuable Parentheses"
draft: true
authoringUnit: {"problemId":"abc407-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc407-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-priority-queue-best-first"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc407-e-problem-142aa7cdf55acfde7d5e2e287f4974df8318542384b1b70c8d4c79c892201fbc","source-abc407-editorial-13106-5e2099b28d8365f9edeaf8a1e74f2037a1759ad055f6de3b1be589764b499f43"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"段階 t で最大候補 x の代わりに y を選んだ解は、x を後でも選ばないなら y→x、後の段階で選ぶなら x と y の選択時刻を交換できる。候補は一度入ると残るので交換後も合法である。 位置 2N は候補に一度も入らず必ず ')' になる。S_1 と N-1 回の選択で '(' の個数は正確に N になる。 早い段階で選べる最大要素を後回しにする解があれば、その段階の選択と後の選択を交換して実行可能性を保ったまま得点を下げずに置換できる。","sourceRevisionIds":["source-abc407-e-problem-142aa7cdf55acfde7d5e2e287f4974df8318542384b1b70c8d4c79c892201fbc","source-abc407-editorial-13106-5e2099b28d8365f9edeaf8a1e74f2037a1759ad055f6de3b1be589764b499f43"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 対称操作による状態の正規化。

## 考察

正しい長さ 2N の括弧列は、各 k=1..N で先頭 2k-1 文字に '(' が少なくとも k 個あり、全体で '(' がちょうど N 個という条件で特徴づけられる。

S_1 を '(' とし、各 k≥2 で位置 2k-2,2k-1 を候補へ加えて一つ選ぶ手続きは、正しい括弧列を漏れなくちょうど表現する。得点は選んだ '(' の A_i の総和である。

採用する候補: 各段階で候補位置のうち A_i 最大のものを '(' にする priority queue 貪欲

早い段階で選べる最大要素を後回しにする解があれば、その段階の選択と後の選択を交換して実行可能性を保ったまま得点を下げずに置換できる。

棄却する候補: balance と使用した '(' の数を状態にして各文字を選ぶ DP

状態数が O(N^2) となり、prefix 条件を二位置ずつの候補選択へ言い換えた交換可能性を利用していない。

段階 t で最大候補 x の代わりに y を選んだ解は、x を後でも選ばないなら y→x、後の段階で選ぶなら x と y の選択時刻を交換できる。候補は一度入ると残るので交換後も合法である。

位置 2N は候補に一度も入らず必ず ')' になる。S_1 と N-1 回の選択で '(' の個数は正確に N になる。

max-heap に A_i を持つ。ans=A_1 として、k=2..N の各段階で A_{2k-2},A_{2k-1} を追加し、最大値を pop して ans に加える。残り位置を ')' とした括弧列が実行可能で、ans が最大得点である。

## 典型の発動条件

### 交換論による貪欲法

発動条件: 一度候補になった要素が後の段階でも選べ、各段階で一つずつ選ぶ最大重み問題のとき。

現在の最大候補を選ばない解との選択時刻交換により、最大値選択を固定する。

### priority queue

発動条件: 候補が追加され続け、各時点で未選択の最大値を取り出したいとき。

二位置を追加して最大 A_i を一つ選ぶ操作を O(log N) で行う。

### 括弧列の prefix 条件

発動条件: 正しい括弧列の構成を balance 非負条件から選択数条件へ変えたいとき。

奇数長 prefix ごとに必要な '(' を一つ確保する段階手続きへ変換する。

## 問題固有の要素

正しい括弧列全体を直接探索せず、二文字ずつ候補を解禁して一個選ぶ matroid 的な手続きに置き換えると、重み最大化が単純な max-heap になる。

別の問題へ持ち帰る視点: prefix 下限制約つきの選択では、締切ごとに新候補を追加し必要個数だけ最良要素を確保する構成を探す。

## 正当性

段階 t で最大候補 x の代わりに y を選んだ解は、x を後でも選ばないなら y→x、後の段階で選ぶなら x と y の選択時刻を交換できる。候補は一度入ると残るので交換後も合法である。 位置 2N は候補に一度も入らず必ず ')' になる。S_1 と N-1 回の選択で '(' の個数は正確に N になる。 早い段階で選べる最大要素を後回しにする解があれば、その段階の選択と後の選択を交換して実行可能性を保ったまま得点を下げずに置換できる。

## 実装上の注意

- A_i の総和は 32 bit を超えるため 64 bit を使う。A_1 を固定で加え、loop の最終段階と 1-index/0-index の位置 2k-2,2k-1 をずらさない。

## 復習の核

- N=1、全 A が同じ、A_{2N} だけ巨大、各 pair の小さい側が後で選ばれる例を全正しい括弧列列挙と比較する。

## 計算量と制約

### 時間

O(N log N)、2N文字の候補maxheap。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 500; 1 \le N \le 2 \times 10^{5}; For each input file, the sum of N over all test cases is at most 2 \times 10^{5}.; 0 \le A_i \le 10^{9} (1 \le i \le 2N); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc407/tasks/abc407_e) — source-abc407-e-problem-142aa7cdf55acfde7d5e2e287f4974df8318542384b1b70c8d4c79c892201fbc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc407/editorial/13106) — source-abc407-editorial-13106-5e2099b28d8365f9edeaf8a1e74f2037a1759ad055f6de3b1be589764b499f43
