---
title: "ABC270-EX — add 1"
draft: true
authoringUnit: {"problemId":"abc270-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc270-ex.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-linear-recurrence","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-linear-recurrence-matrix","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc270-ex-problem-0b01642c8ebddbe08cc870b2e38f520a70ba664454fa39d28c4064833109dc4d","source-abc270-editorial-4880-5daf49f85c53245b3cda565c56b18dfe60eb5e14c4b8e6c3669f215321f2c989"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最大不足量k=max_i(A_i−C_i)が同じなら次状態分布も同じであり、期待値x_kを一変数へ圧縮できる。A_r<k≤A_{r+1}では、選ぶindexがi≤rならk−1、i>rならA_iへ移るので、x_k=1+(r/N)x_{k−1}+(1/N)Σ_{i>r}x_{A_i}を満たす。y_k=x_{A_N}−x_kと置き、s_r=Σ_{i>r}y_{A_i}を既知として保つと、r y_{k−1}=N y_k−s_r+Nになる。同じrの区間ではaffine recurrenceの係数が一定なので、N/rのgap長乗で一歩ずつの更新をまとめられる。y_{A_N}=0から降順に求め、x_0=0より最後のy_0がx_{A_N}、すなわち初期状態の期待停止回数になる。","sourceRevisionIds":["source-abc270-ex-problem-0b01642c8ebddbe08cc870b2e38f520a70ba664454fa39d28c4064833109dc4d","source-abc270-editorial-4880-5daf49f85c53245b3cda565c56b18dfe60eb5e14c4b8e6c3669f215321f2c989"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

counter vector Cの進捗をk=max_i(A_i−C_i)へ圧縮すると、k≤0が終了条件で、次状態は具体的なCではなくkだけから定まる。

A_r<k≤A_{r+1}なら、選んだindexがi≤rのとき次状態k−1、i>rのときA_iになる。

棄却する候補: 各整数状態k=A_N,…,0について期待値漸化式を一段ずつ評価する。

A_Nが10^18まであり、状態値の幅に比例する処理はできない。

採用する候補: y_k=x_{A_N}−x_kへ変数変換し、rが一定な区間(A_r,A_{r+1}]のaffine recurrenceをgeometric progressionとして累乗で飛ばす。

必要なのはN個のbreakpoint A_iだけとなり、各gapをmodular exponentiationで処理できる。

期待値x_kの漸化式は大きい添字を参照して逆向きだが、y_k=x_{A_N}−x_kなら既知のy_{A_N}=0から降順に計算でき、答えはy_0になる。

s_r=Σ_{i>r}y_{A_i}を保つと区間内で y_{k−1}+c=(N/r)(y_k+c) となり、gap長だけN/rを累乗すればよい。

Markov stateを最大不足量へlumpし、piecewise-constant coefficientのexpectation recurrenceをaffine shiftとfast exponentiationでbreakpoint間ジャンプする。

## 典型の発動条件

### 確率過程の状態圧縮

発動条件: 高次元状態でも終了までの遷移分布が一つのpotentialだけで決まるとき。

全counterの不足量の最大値kだけを状態とし、reset対象のA_iから次状態を分類する。

### 一次漸化式の区間累乗

発動条件: 長大なindex区間でaffine recurrenceの係数が変化しないとき。

定数項をshiftして等比漸化式にし、A_{r+1}−A_r段をmodular powerで一括遷移する。

## 問題固有の要素

rはA_i<kを満たすcounter数であり、Aの値を跨がない間はtransition probabilityとreset先集合が一定である。

別の問題へ持ち帰る視点: 巨大な数直線上のDPは、transition ruleが変わるevent pointsだけを列挙し、同一区間をclosed formで飛ばす。

## 正当性

最大不足量k=max_i(A_i−C_i)が同じなら次状態分布も同じであり、期待値x_kを一変数へ圧縮できる。A_r<k≤A_{r+1}では、選ぶindexがi≤rならk−1、i>rならA_iへ移るので、x_k=1+(r/N)x_{k−1}+(1/N)Σ_{i>r}x_{A_i}を満たす。y_k=x_{A_N}−x_kと置き、s_r=Σ_{i>r}y_{A_i}を既知として保つと、r y_{k−1}=N y_k−s_r+Nになる。同じrの区間ではaffine recurrenceの係数が一定なので、N/rのgap長乗で一歩ずつの更新をまとめられる。y_{A_N}=0から降順に求め、x_0=0より最後のy_0がx_{A_N}、すなわち初期状態の期待停止回数になる。

## 実装上の注意

- Aに重複があってgapが0でも降順index処理を保ち、s_rへy_{A_{r+1}}を正しい時点で追加する。
- inverseを取るrとN−rは1,…,N−1なのでmodulusより小さく非零であることを利用する。

## 復習の核

- 多次元random processでは、終了条件を表すpotentialが次状態の分布まで決めるかを検証する。
- 漸化式の向きが初期条件と逆なら、求める端点との差を新変数にして計算方向を反転する。

## 計算量と制約

### 時間

O(N log Amax)、N breakpoint間のmodular累乗。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 0=A_1\leq A_2\leq \cdots \leq A_N\leq 10^{18}; A_N>0; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/tasks/abc270_h) — source-abc270-ex-problem-0b01642c8ebddbe08cc870b2e38f520a70ba664454fa39d28c4064833109dc4d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/editorial/4880) — source-abc270-editorial-4880-5daf49f85c53245b3cda565c56b18dfe60eb5e14c4b8e6c3669f215321f2c989
