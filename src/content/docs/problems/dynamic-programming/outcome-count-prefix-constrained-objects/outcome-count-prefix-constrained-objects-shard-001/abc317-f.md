---
title: "ABC317-F — Nim"
draft: true
authoringUnit: {"problemId":"abc317-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc317-f.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-inclusion-exclusion"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp","tag-inclusion-exclusion"],"sourceRevisionIds":["source-abc317-editorial-7018-59f2e40fd912bf2f18cedcd4e3f0039a8109edf8d2ad2da774b80d5447eea11e","source-abc317-f-problem-6862e5cd34f93d52dda06534a17093682d439c6782da35441e03760d73741976"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各bitでxor0となる三bit組は000,011,101,110の四つだけなので、この選択を続ければxor条件を常に保つ。各数の剰余は立てたbitの2^b mod A_iを足すことで正確に更新される。LSBから処理する比較flagは、新しい上位bitがNと異なる時にそのbitで大小を上書きし、同じ時は旧flagを保つ。この更新により最終flagが各数≤Nを表す。最終剰余0の個数から、全0と一要素0の重複を包除で除けば、正整数だけの対象triple数が得られる。","sourceRevisionIds":["source-abc317-editorial-7018-59f2e40fd912bf2f18cedcd4e3f0039a8109edf8d2ad2da774b80d5447eea11e","source-abc317-f-problem-6862e5cd34f93d52dda06534a17093682d439c6782da35441e03760d73741976"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

対象外:

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

X_1 xor X_2 xor X_3=0 は各 bit で選ぶ三 bit の xor が0という局所条件である。一方、倍数条件は下位 bit を決めるたび現在の剰余を更新すれば追える。

N≤10^18 に対する上限制約を下位 bit から扱うため、各 x_i の確定下位 n bit が N の下位 n bit 以下かという flag を持つと、次 bit 追加時に大小関係を更新できる。

採用する候補: 三数の bit を LSB から同時に決め、各上限 flag と A_i 剰余を持つ 60 桁 DP を行う。

各桁の bit 組は xor=0 の4通りに限られ、A_i≤10 なので剰余状態積も最大1000と小さい。

棄却する候補: A_i の倍数をそれぞれ N/A_i 個列挙し、xor 条件を二数組から照合する。

N が10^18で倍数列挙は不可能であり、xor の bit ごとの独立性を使えていない。

下位桁 DP では新しい上位 bit が異なればそこで大小が決まり、同じなら旧 flag を引き継ぐため、通常のMSB digit DPとは flag 更新の向きが異なる。

bit b を立てると剰余へ 2^n mod A_i を加えるので、各 A_i に対する二冪剰余を順次更新できる。

dp[lessEq flags 3個][r1][r2][r3] を0 bitから始める。n=0..59 で xor が0となる bit triple を列挙し、N の n bit と旧下位比較から新 flag を更新、r_i←r_i+b_i2^n mod A_i とする。60桁後に全 x_i≤N・剰余0の状態を取り、x_i=0 を含む組を包除または直接補正して正整数だけにする。

## 典型の発動条件

### LSB-first digit DP

発動条件: bitwise 条件は各桁局所だが、剰余を下位桁から加算する方が自然なとき。

下位 prefix と上限下位 prefix の比較 flag を持ち、上位 bit 追加で更新する。

### 複数整数の同期 bit DP

発動条件: 複数数の xor/and 等が桁ごとに条件を課すとき。

同じ桁の bit tuple をまとめて列挙し、各数固有の剰余・上限状態を直積する。

## 問題固有の要素

A_i≤10 という制約は値列挙ではなく、三つの剰余状態の直積 ∏A_i を小さくするためにある。

別の問題へ持ち帰る視点: digit DP の状態数は桁数だけでなく、付随する modulus の積を見て方向を選ぶ。

## 正当性

各bitでxor0となる三bit組は000,011,101,110の四つだけなので、この選択を続ければxor条件を常に保つ。各数の剰余は立てたbitの2^b mod A_iを足すことで正確に更新される。LSBから処理する比較flagは、新しい上位bitがNと異なる時にそのbitで大小を上書きし、同じ時は旧flagを保つ。この更新により最終flagが各数≤Nを表す。最終剰余0の個数から、全0と一要素0の重複を包除で除けば、正整数だけの対象triple数が得られる。

## 実装上の注意

- 0≤x≤N を数えた後の正数補正を忘れない。LSB comparison flag の遷移は全小例を列挙して検証し、60 bit で N の最高bitを覆う。

## 復習の核

- MSB-first の tight を惰性で使わず、剰余更新と xor に自然な LSB-first を検討する。下位比較 flag の意味を式で固定してから遷移を書く。

## 計算量と制約

### 時間

O(BA1A2A3)、B=60、各bit tripleは四通り、比較flagは八通り。

### 空間

O(A1A2A3)、bit方向rolling。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{18}; 1 \leq A_i \leq 10; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/editorial/7018) — source-abc317-editorial-7018-59f2e40fd912bf2f18cedcd4e3f0039a8109edf8d2ad2da774b80d5447eea11e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/tasks/abc317_f) — source-abc317-f-problem-6862e5cd34f93d52dda06534a17093682d439c6782da35441e03760d73741976
