---
title: "ABC411-E — E [max]"
draft: true
authoringUnit: {"problemId":"abc411-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc411-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions","outcome-maintain-modular-product-under-factor-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-dynamic-modular-product","tag-event-sweep","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc411-e-problem-98ce674015aab1611529fc1107e1c9bbe341e40cf8e2c43b601192197f7c29dd","source-abc411-editorial-13361-ed54805abf99dcee9f98de109c9c1471239666baf86409bc6803ad047a16aefd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"threshold v で dice j が許す面数を B_j とすると P[max≤v]=Π_j B_j/6^N。各 B_j は0..6だけなので非零積は逆元で差し替えられる。 同じ値の全faceを一群として B_j を更新してからその threshold の CDF を評価する。途中で評価すると同値面を別の最大値として誤分割する。 E=S_max-Σ_i(S_{i+1}-S_i)P[max≤S_i] とし、zero count と非零 B_j の積を管理すれば、全 distinct threshold を O(N log N) で処理できる。","sourceRevisionIds":["source-abc411-e-problem-98ce674015aab1611529fc1107e1c9bbe341e40cf8e2c43b601192197f7c29dd","source-abc411-editorial-13361-ed54805abf99dcee9f98de109c9c1471239666baf86409bc6803ad047a16aefd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。
- 法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

最大値が値 S_i に等しい確率を直接数えるより、P[max≤S_i] を使えば各 dice が S_i 以下を出す独立確率の積になる。

全6N面の値を昇順 sweep すると、各 dice の「現在値以下の面数」B_j はその dice の面を通過したときだけ増え、更新総数は6N回である。

採用する候補: 期待値を CDF の差分和から部分和変形し、threshold sweep で Π_j(B_j/6) を更新する

棄却する候補: N 個の dice の出目6^N通りを列挙して最大値を平均する

独立性を積の CDF に変換せず、N=10^5 では候補数が指数的になる。

(faceValue,dieId) の6N組を sortし、同値groupごとに各 cnt[die] を増やす。積 product と cnt=0 の dice 数 zeros を更新し、CDF=zeros>0なら0、そうでなければ product·6^{-N} とする。隣のdistinct値との差×CDFを最大面値から引いて期待値を得る。

## 典型の発動条件

### CDF による最大値の期待値

発動条件: 独立変数の最大値の期待値を求め、閾値以下確率が簡単なとき。

P[max=value] をCDF差へ変え、summation by partsで隣接値gapとの積にする。

### event sweep

発動条件: 閾値に応じて各対象の離散countが少数回だけ変化するとき。

面値を昇順にまとめ、該当diceの≤threshold面数だけ更新する。

### 零を含む積の動的管理

発動条件: 因子を割り算で更新したいが0因子があり得るとき。

zero factor数と非零因子積を分け、zero数が0のときだけ積を利用する。

## 問題固有の要素

6N×N の閾値表を作らず、各面が一度だけ起こすcount更新から全diceのCDF積を保つ。

別の問題へ持ち帰る視点: 独立確率の積をthreshold sweepする際は、各変数のCDFが変わるeventだけ処理し、0因子数を別管理する。

## 正当性

threshold v で dice j が許す面数を B_j とすると P[max≤v]=Π_j B_j/6^N。各 B_j は0..6だけなので非零積は逆元で差し替えられる。 同じ値の全faceを一群として B_j を更新してからその threshold の CDF を評価する。途中で評価すると同値面を別の最大値として誤分割する。 E=S_max-Σ_i(S_{i+1}-S_i)P[max≤S_i] とし、zero count と非零 B_j の積を管理すれば、全 distinct threshold を O(N log N) で処理できる。

## 実装上の注意

- 同値面を必ずbatch更新し、old count=0 のとき逆元0を取らない。6^{-N}を一度掛け、値差と期待値はmodへ写す。distinct値が一つだけの式も扱う。

## 復習の核

- N=1、全face同値、dice内重複、最小thresholdで一部diceがcount0のままの例を6^N全列挙と比較する。

## 計算量と制約

### 時間

O(N log N)、6N面をsort、各面countの更新O(1)。

### 空間

O(N)、面event。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^5; 1\leq A_{i,j} \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/tasks/abc411_e) — source-abc411-e-problem-98ce674015aab1611529fc1107e1c9bbe341e40cf8e2c43b601192197f7c29dd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/editorial/13361) — source-abc411-editorial-13361-ed54805abf99dcee9f98de109c9c1471239666baf86409bc6803ad047a16aefd
