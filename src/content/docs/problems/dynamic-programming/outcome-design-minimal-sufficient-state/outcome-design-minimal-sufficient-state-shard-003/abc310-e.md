---
title: "ABC310-E — NAND repeatedly"
draft: true
authoringUnit: {"problemId":"abc310-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc310-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc310-e-problem-f2927b0359bb36b1994aa8571b67f18c439768beab5d4039fef78349c294794b","source-abc310-editorial-6784-a46512a53029c8d50e7fcb5089853b29b9081838e7484e6853edbf730cfbb93c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"NANDの出力は前結果と次bitだけで決まる。全左端の前結果数をzero/oneへ分け、次bit0では全延長が1、次bit1では前結果を反転する。singletonを足すと各右端の全区間を厳密に生成しone合計が目的数。","sourceRevisionIds":["source-abc310-e-problem-f2927b0359bb36b1994aa8571b67f18c439768beab5d4039fef78349c294794b","source-abc310-editorial-6784-a46512a53029c8d50e7fcb5089853b29b9081838e7484e6853edbf730cfbb93c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

右端 i を固定すると、各左端からの NAND の畳み込み結果は 0 か 1 の二種類しかない。新しい bit を右へ付けたとき、必要なのは各結果の個数であって左端そのものではない。 NAND は入力 bit が 0 なら過去の結果をすべて 1 にし、1 なら過去の 0/1 を 1/0 に反転させるため、二個の count を定数時間で更新できる。 前段で結果 r だった各部分文字列は append した bit b により r NAND b へ一斉に移るので、個数の遷移として扱える。 長さ 1 の新しい部分文字列は演算を行わず bit 自身が値になるため、既存区間の写像とは別に一個加える。

採用する候補: 各右端で NAND 結果が 0/1 になる部分文字列数だけを持ち、新しい文字による写像で更新する。

結果空間が二値に閉じ、全左端の状態を同値類二つへ完全に集約できるので O(N) になる。

棄却する候補: 全区間について左から NAND を計算し直して 1 になるものを数える。

区間数だけで Θ(N²) あり、N=10^6 の制約を満たせない。

前段で結果 r だった各部分文字列は append した bit b により r NAND b へ一斉に移るので、個数の遷移として扱える。

長さ 1 の新しい部分文字列は演算を行わず bit 自身が値になるため、既存区間の写像とは別に一個加える。

zero,one を直前位置で終わる部分文字列の結果別個数とする。b=0 なら (zero,one)=(1,zero+one)、b=1 なら (zero,one)=(one,zero+1) と更新し、毎回 one を答えへ加える。

## 典型の発動条件

### 終点を伸ばす区間 DP の集約

発動条件: 全部分配列を数えるが、末尾要素の追加後の状態が小さい有限集合に閉じるとき。

左端を列挙せず、直前の各状態に属する区間数をまとめて遷移させる。

## 問題固有の要素

非結合な NAND でも評価順が問題文で固定されているため、現在値だけを状態にした逐次更新が成立する。

別の問題へ持ち帰る視点: 演算が結合的かより、prefix の評価結果から次結果が決まる有限オートマトンかを確認する。

## 正当性

NANDの出力は前結果と次bitだけで決まる。全左端の前結果数をzero/oneへ分け、次bit0では全延長が1、次bit1では前結果を反転する。singletonを足すと各右端の全区間を厳密に生成しone合計が目的数。

## 実装上の注意

- 更新前の zero と one を同時に参照するので一時変数を使う。答えは部分文字列数規模になるため 64 bit 整数で保持する。

## 復習の核

- 小さい真理値表を実際に書き、append が各状態をどこへ写すかを確認する。長さ1の区間を遷移へ入れ忘れない。

## 計算量と制約

### 時間

bit列長N。末尾位置ごと二集約で O(N)。

### 空間

zero,one,total O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq10^6; S is a string of length N consisting of 0 and 1.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/tasks/abc310_e) — source-abc310-e-problem-f2927b0359bb36b1994aa8571b67f18c439768beab5d4039fef78349c294794b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc310/editorial/6784) — source-abc310-editorial-6784-a46512a53029c8d50e7fcb5089853b29b9081838e7484e6853edbf730cfbb93c
