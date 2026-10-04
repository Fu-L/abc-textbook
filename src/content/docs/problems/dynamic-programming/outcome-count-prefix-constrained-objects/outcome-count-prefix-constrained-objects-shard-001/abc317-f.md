---
title: "ABC317-F — Nim"
draft: true
authoringUnit: {"problemId":"abc317-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc317-f.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-inclusion-exclusion"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp","tag-inclusion-exclusion"],"sourceRevisionIds":["source-abc317-editorial-7018-59f2e40fd912bf2f18cedcd4e3f0039a8109edf8d2ad2da774b80d5447eea11e","source-abc317-f-problem-6862e5cd34f93d52dda06534a17093682d439c6782da35441e03760d73741976"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各bitでxor0の4通りだけを遷移に使うため、DPが数える三つ組はxor条件を満たし、剰余0かつ上限以下の組を全て一度ずつ数える。Zでは0も許す。一つだけ0の三つ組は、残り二数が等しい正の共通倍数であり、各零位置iについて `floor(N/lcm(A_j,A_k))` 個ある。これらの集合は二つ以上0の組を共有しない。全0だけは三つの集合に重複して含まれるため、全体で `Σ` と全0一個を引けば、正整数の三つ組だけが残る。","sourceRevisionIds":["source-abc317-editorial-7018-59f2e40fd912bf2f18cedcd4e3f0039a8109edf8d2ad2da774b80d5447eea11e","source-abc317-f-problem-6862e5cd34f93d52dda06534a17093682d439c6782da35441e03760d73741976"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md) — 単純に足すと重複する条件を交差構造ごとに補正し、包除・Möbius反転へ一般化する。

## 考察

bit DPでは各bitのxorが0となる4通り `000,011,101,110` だけを試し、各数の上限比較flagと `A_i` による剰余を更新する。まず `0≤X_i≤N` の三つ組を数え、その個数をZとする。

正整数だけにする補正は簡単である。一つの数が0なら、xor条件から残り二数は等しい。0の位置iを決めると、共通値は `A_j` と `A_k` の両方の倍数なので `floor(N/lcm(A_j,A_k))` 通り。二つの0がある場合は三つとも0なので、この重複だけを最後に一度引く。

よって答えは `Z−1−Σ_{j<k} floor(N/lcm(A_j,A_k))`。

採用する候補: LSB-firstで三数のbitを同時に決め、上限flagと剰余を持つDP

`A_i≤10` なので剰余状態積は小さく、60bitの走査で足りる。

棄却する候補: 各数の倍数を列挙してxor条件を照合する。

Nは10^18まであり、候補を列挙できない。

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

各bitでxor0の4通りだけを遷移に使うため、DPが数える三つ組はxor条件を満たし、剰余0かつ上限以下の組を全て一度ずつ数える。Zでは0も許す。一つだけ0の三つ組は、残り二数が等しい正の共通倍数であり、各零位置iについて `floor(N/lcm(A_j,A_k))` 個ある。これらの集合は二つ以上0の組を共有しない。全0だけは三つの集合に重複して含まれるため、全体で `Σ` と全0一個を引けば、正整数の三つ組だけが残る。

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
