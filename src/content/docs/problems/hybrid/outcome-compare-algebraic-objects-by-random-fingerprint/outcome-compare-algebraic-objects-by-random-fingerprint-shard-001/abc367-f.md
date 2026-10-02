---
title: "ABC367-F — Rearrange Query"
draft: true
authoringUnit: {"problemId":"abc367-f","docPath":"src/content/docs/problems/hybrid/outcome-compare-algebraic-objects-by-random-fingerprint/outcome-compare-algebraic-objects-by-random-fingerprint-shard-001/abc367-f.md","learningOutcomeIds":["outcome-compare-algebraic-objects-by-random-fingerprint"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-randomized-algorithms"],"excludedTopics":["乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-randomized-algebraic-fingerprint","tag-randomized-algorithm"],"sourceRevisionIds":["source-abc367-editorial-10692-0beae3b613a8298bf519f4a89d605337b00f9c020b9b1a41c16c96881f64c1b4","source-abc367-f-problem-e1f97a2452f0b6a07da9585002ebd9d8c9958d71a394beeeffc14028ef82b3f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"XOR hashでは同じ値が偶数回で消えるためmultiset頻度を表せないが、random weightの加算なら出現回数に比例して寄与する。 prefixH[i+1]=prefixH[i]+h(A_i)とすれば、[l,r]のhashはprefixH[r]−prefixH[l−1]で得られる。 multiplicityを加法的に反映し、各queryを定数回のprefix差へ落とせる確率的判定である。","sourceRevisionIds":["source-abc367-editorial-10692-0beae3b613a8298bf519f4a89d605337b00f9c020b9b1a41c16c96881f64c1b4","source-abc367-f-problem-e1f97a2452f0b6a07da9585002ebd9d8c9958d71a394beeeffc14028ef82b3f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択代数fingerprint](src/content/docs/learn/modeling/randomized-algebraic-fingerprint.md)

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md)

対象外:

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

二つの区間を並べ替えて一致できる条件は、長さと各値の出現回数が一致すること、すなわちmultiset equalityである。順序情報は不要である。

各値vへ独立なrandom weight h(v)を割り当て、区間hashを重みの和とすれば、同じmultisetは必ず同じ値になり、異なるものの衝突確率を小さくできる。

採用する候補: A,Bそれぞれでrandom value hashのprefix sumを作り、区間長とhash差を比較する。

multiplicityを加法的に反映し、各queryを定数回のprefix差へ落とせる確率的判定である。

棄却する候補: queryごとに両区間をcopyしてsortし、一致するか比較する。

長い区間queryが多数あると同じ要素を何度もsortし、入力上限に間に合わない。

XOR hashでは同じ値が偶数回で消えるためmultiset頻度を表せないが、random weightの加算なら出現回数に比例して寄与する。

prefixH[i+1]=prefixH[i]+h(A_i)とすれば、[l,r]のhashはprefixH[r]−prefixH[l−1]で得られる。

値1..Nへ十分広いrandom hashを割り当て、AとBのhash prefix sumを構築する。各queryで区間長が異なればNo、同じなら二つの区間hashを差分で求め、一致時Yes、不一致時Noを返す。必要なら独立hashを複数併用する。

## 典型の発動条件

### Zobrist型multiset hashing

発動条件: 静的列の多数区間について順序を無視した一致判定をしたいとき。

要素ごとのrandom weightを加算して頻度vectorのfingerprintを作る。

### hash prefix sum

発動条件: 加法的区間fingerprintを高速に取り出すとき。

列prefixを前計算し、二端点の差でquery hashを得る。

## 問題固有の要素

順序を無視するためpolynomial rolling hashではなく、加算の可換性を持つhashが必要である。

別の問題へ持ち帰る視点: 比較対象の同値関係に合わせ、hashの演算も順序依存か可換かを選ぶ。

## 正当性

XOR hashでは同じ値が偶数回で消えるためmultiset頻度を表せないが、random weightの加算なら出現回数に比例して寄与する。 prefixH[i+1]=prefixH[i]+h(A_i)とすれば、[l,r]のhashはprefixH[r]−prefixH[l−1]で得られる。 multiplicityを加法的に反映し、各queryを定数回のprefix差へ落とせる確率的判定である。

## 実装上の注意

- 乱数seed・bit幅を選び衝突確率を十分下げる。overflowを意図したunsigned加算か素数modかを統一し、区間indexのinclusive境界を合わせる。

## 復習の核

- 同値な並べ替え例と、同じ和だが異なるmultisetの例で通常和との差を確認する。確率解法であることとhash生成方法をレビュー時に明示する。

## 計算量と制約

### 時間

O(N+Q)、固定数のrandom hash。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,Q\leq 2\times 10^5; 1\leq A_i,B_i\leq N; 1\leq l_i \leq r_i\leq N; 1\leq L_i \leq R_i\leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc367/editorial/10692) — source-abc367-editorial-10692-0beae3b613a8298bf519f4a89d605337b00f9c020b9b1a41c16c96881f64c1b4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc367/tasks/abc367_f) — source-abc367-f-problem-e1f97a2452f0b6a07da9585002ebd9d8c9958d71a394beeeffc14028ef82b3f9
