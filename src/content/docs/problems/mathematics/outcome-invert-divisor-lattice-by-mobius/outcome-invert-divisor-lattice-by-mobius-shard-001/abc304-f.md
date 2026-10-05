---
title: "ABC304-F — Shift Table"
draft: true
authoringUnit: {"problemId":"abc304-f","docPath":"src/content/docs/problems/mathematics/outcome-invert-divisor-lattice-by-mobius/outcome-invert-divisor-lattice-by-mobius-shard-001/abc304-f.md","learningOutcomeIds":["outcome-invert-divisor-lattice-by-mobius"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-prime-divisor"],"excludedTopics":["約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-divisor-mobius-inversion","tag-modular-arithmetic","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc304-editorial-6511-ddd57c50291556fbe38e4db2238919b9c70daa74e48096ec0d0655b1d6fa718e","source-abc304-f-problem-b902c20c4f077e5c415a49f03de5f281397ae7faba2c8df6f44fecad1b786fe1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"周期tでは同剰余classが同じ勤務状態を持つ。高橋が全日出勤するclassだけ青木欠勤を選べるので候補数は2^p。各列の最小周期sは一意でs|tだからA_t=Σ_{s|t}M_s。約数昇順で真約数を引くとexact最小周期の分布が得られ、t<Nだけ足すと繰返しshiftを数える。","sourceRevisionIds":["source-abc304-editorial-6511-ddd57c50291556fbe38e4db2238919b9c70daa74e48096ec0d0655b1d6fa718e","source-abc304-f-problem-b902c20c4f077e5c415a49f03de5f281397ae7faba2c8df6f44fecad1b786fe1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [約数格子のzeta・Möbius反転](src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)

- 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

## 考察

青木のshiftが周期tを持つなら、最初のt日だけで全N日が決まる。tはNの約数だけを考えればよく、各剰余類で青木が欠勤できるかは、その類の全日に高橋が出勤するかだけで決まる。

採用する候補: 各周期の個数を数え、約数DPで最小周期別へ反転する

周期tのshift数A_tは2の冪で直接求まり、A_t=Σ_{s|t}M_sから重複を正確に除ける。

棄却する候補: 全ての青木の2^N通りのshiftを生成して最小周期を調べる

N日分の二択列挙は指数時間であり、周期による同値な繰り返しを利用できない。

周期tの各剰余類では青木の出勤は常に選べ、欠勤はその類の全日で高橋が出勤する場合だけ選べる。そのような剰余類がp個ならA_t=2^pである。一方、周期tを持つshiftは一意な最小周期s|tを持つためA_t=Σ_{s|t}M_sとなる。

Nの約数tを昇順に列挙する。各tについて全剰余類を調べ、欠勤を選べる類の数pからA_t=2^pを求める。M_t=A_t-Σ_{s|t,s<t}M_sをmod 998244353で計算し、t≠NのM_tを合計する。

## 典型の発動条件

### 周期列の剰余類分解

発動条件: 長さNの列が周期tを持ち、tがNを割り切る。

位置をmod tの剰余類へまとめ、先頭t個の選択が全列を一意に決めることを使う。

### 約数DPによる最小周期の抽出

発動条件: 周期tを持つ対象の数には、最小周期がtの真の対象だけでなく全ての約数周期が含まれる。

約数を昇順に処理し、A_tから既計算の真約数sのM_sを引く。

## 問題固有の要素

青木がある剰余類で欠勤を選ぶと、その類の全日に欠勤が繰り返されるため、高橋の勤務条件は一日ではなく剰余類全体のANDとして判定する。

別の問題へ持ち帰る視点: 周期制約下の局所選択は、各residue classで繰り返される全位置の条件を集約して独立な自由度を数える。

## 正当性

周期tでは同剰余classが同じ勤務状態を持つ。高橋が全日出勤するclassだけ青木欠勤を選べるので候補数は2^p。各列の最小周期sは一意でs|tだからA_t=Σ_{s|t}M_s。約数昇順で真約数を引くとexact最小周期の分布が得られ、t<Nだけ足すと繰返しshiftを数える。

## 実装上の注意

- t=Nは答えの合計から除くが、約数関係の計算自体ではM_Nも定義できる。減算ごとにmodを正規化し、剰余類の全位置を漏れなく調べる。

## 復習の核

- Nの小さい全binary shiftを列挙し、全日高橋勤務、欠勤可能な剰余類が0個、Nが素数、複数の真約数を持つ場合でM_tと答えを比較する。

## 計算量と制約

### 時間

O(Nτ(N)+τ(N)²)。各約数周期の全位置を調べて約数反転する。

### 空間

O(N+τ(N))。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 2 and 10^5, inclusive.; S is a string of length N consisting of # and ..

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/editorial/6511) — source-abc304-editorial-6511-ddd57c50291556fbe38e4db2238919b9c70daa74e48096ec0d0655b1d6fa718e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/tasks/abc304_f) — source-abc304-f-problem-b902c20c4f077e5c415a49f03de5f281397ae7faba2c8df6f44fecad1b786fe1
