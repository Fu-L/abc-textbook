---
title: "ABC257-E — Addition and Multiplication 2"
draft: true
authoringUnit: {"problemId":"abc257-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc257-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc257-e-problem-b33005b0902468fb8bbf836f0cf3530048887c4bfa46d52752acafc3b8352eb0","source-abc257-editorial-4136-df45cb5e61aa92019c3173bf77a20a61a9f38c9da0b025e5d6480521f28ab87b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最小費用c_minなら長さL=floor(N/c_min)を達成でき、これより長い数は作れない。 位置pで数字dを選べる条件はC_d+(残り桁数)c_min≤現在予算であり、この条件内の最大dを選べばよい。 残り桁を全て最安費用で埋められる条件を守れば桁数を失わず、各位置で最大数字を選ぶことが辞書順最大化になる。","sourceRevisionIds":["source-abc257-e-problem-b33005b0902468fb8bbf836f0cf3530048887c4bfa46d52752acafc3b8352eb0","source-abc257-editorial-4136-df45cb5e61aa92019c3173bf77a20a61a9f38c9da0b025e5d6480521f28ab87b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 対称操作による状態の正規化。

## 考察

正の整数では桁数が一つ増えるだけでどの同桁数の数より大きくなるため、まず最安数字の費用で作れる最大桁数を確保する必要がある。

採用する候補: 最大桁数を固定して上位桁から最大数字を選ぶ

残り桁を全て最安費用で埋められる条件を守れば桁数を失わず、各位置で最大数字を選ぶことが辞書順最大化になる。

棄却する候補: 現在予算で買える最大数字を毎回選ぶ

高い上位数字を先に選んで総桁数を減らすと、どれほど桁値が高くても最大数にはならない。

最小費用c_minなら長さL=floor(N/c_min)を達成でき、これより長い数は作れない。

位置pで数字dを選べる条件はC_d+(残り桁数)c_min≤現在予算であり、この条件内の最大dを選べばよい。

c_minを求めて桁数L=floor(N/c_min)を固定する。左から各桁について9から1を調べ、C_d+(L-p-1)c_min≤残予算を満たす最初のdを出力して費用を引く。

## 典型の発動条件

### 目的の優先順位分解

発動条件: 数値最大化で桁数が最優先、その後に同桁数の辞書順が効く。

最初に最大長を決定し、長さを保つ制約下で各桁を貪欲に最大化する。

### 実現可能性付き辞書順貪欲

発動条件: 上位位置の選択後に残りを最低費用で完成できるか判定できる。

各候補数字について残余桁の最低必要費用を確認する。

## 問題固有の要素

数字ごとの費用が異なっても、最安数字が保証する最大桁数を壊さない範囲だけで上位桁をupgradeすればよい。

別の問題へ持ち帰る視点: 長さと辞書順の階層目的では、最小完成費用をoracleにして上位から改善する。

## 正当性

最小費用c_minなら長さL=floor(N/c_min)を達成でき、これより長い数は作れない。 位置pで数字dを選べる条件はC_d+(残り桁数)c_min≤現在予算であり、この条件内の最大dを選べばよい。 残り桁を全て最安費用で埋められる条件を守れば桁数を失わず、各位置で最大数字を選ぶことが辞書順最大化になる。

## 実装上の注意

- L≥1はC_i≤Nから保証される。各位置で残り桁数を選択後の個数として計算し、数字は9から1の降順、費用添字はC_1..C_9に合わせる。

## 復習の核

- 小さい予算の全列挙と比較し、最安費用が複数数字にある場合、高い数字へ一部だけ置換できる場合、最後の一桁の境界を確認する。

## 計算量と制約

### 時間

O(9N/cmin)、出力長N/cminに比例。

### 空間

O(N/cmin)、出力文字列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^6; 1 \leq C_i \leq N; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/tasks/abc257_e) — source-abc257-e-problem-b33005b0902468fb8bbf836f0cf3530048887c4bfa46d52752acafc3b8352eb0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/editorial/4136) — source-abc257-editorial-4136-df45cb5e61aa92019c3173bf77a20a61a9f38c9da0b025e5d6480521f28ab87b
