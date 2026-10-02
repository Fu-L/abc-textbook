---
title: "ABC235-G — Gardens"
draft: true
authoringUnit: {"problemId":"abc235-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc235-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-transition-optimization","unit-modular-arithmetic"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-dp-transition-acceleration","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc235-editorial-3252-e156873af08601dc484d0ce3da61dd8d27ddda8414b6756079ad415e547689b7","source-abc235-g-problem-ff02f7865679f2725f215161406783f97b2ef351e4e8c2fbd85cecabc3dd6249"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"空の庭を禁止する包除で、利用可能庭i個に各種類を植える方法は独立なF_A(i)F_B(i)F_C(i)になる。Pascal則でF_M(i+1)=2F_M(i)−C(i,M)となるため全項を正確に更新できる。Σ(−1)^{N−i}C(N,i)の重み付けでは空庭を持つ配置が相殺され、全庭非空だけ一度残る。","sourceRevisionIds":["source-abc235-editorial-3252-e156873af08601dc484d0ce3da61dd8d27ddda8414b6756079ad415e547689b7","source-abc235-g-problem-ff02f7865679f2725f215161406783f97b2ef351e4e8c2fbd85cecabc3dd6249"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

各種類は一庭に高々一本なので、その種類を植える方法は使用する庭の部分集合を上限本数以内で選ぶことに等しい。

三種類の庭部分集合の和集合が全 N 庭になる条件は直接扱いにくいが、特定の庭集合を全て空にする方法は種類ごとに独立に数えられる。

棄却する候補: 庭を順に見て各種類を植えるかの 7 通りを選び、残り苗数を状態にする DP を行う。

A,B,C の三次元残量状態が N の三乗規模になり、N＝500 万では扱えない。

採用する候補: 空の庭がない条件を包除し、使用可能な i 庭から各種類を上限 M 本まで置く部分集合数 F_M(i) の積を符号付きで足す。

空に固定した庭を除けば三種類は独立になり、F_M の全 i を Pascal 恒等式の一次再帰で列挙できる。

F_M(i)＝Σ_{j=0}^{min(i,M)}C(i,j) は F_M(i＋1)＝2F_M(i)−C(i,M) を満たし、二項係数 prefix を毎回足し直さず更新できる。

苗を全て使う必要はないため、各種類の因子は C(i,M) ではなく 0 本から上限までの二項係数和になる。

全庭非空を空庭事象の inclusion-exclusion へ変え、各項 C(N,i)F_A(i)F_B(i)F_C(i) を、三つの打切り二項和の同時一次更新で走査する。

## 典型の発動条件

### 全位置被覆への包除原理

発動条件: 全ての位置が少なくとも一種類に選ばれる条件があり、特定位置を未選択にすると種類間が独立になるとき。

使用可能な庭数 i ごとの独立選択数を、空庭数の符号付き二項係数で合成する。

### 打切り二項係数和の逐次更新

発動条件: F_M(n)=Σ_{j≤M}C(n,j) を連続する全 n について必要とするとき。

Pascal の式から 2F_M(n) から境界 C(n,M) を引く再帰で一つ先を求める。

## 問題固有の要素

庭を空にする事象へ反転すると、リンゴ・バナナ・サクランボの配置が三つの独立な部分集合選択へ完全に分離する。

別の問題へ持ち帰る視点: 複数集合の union が全集合という条件は、未被覆要素の包除により各集合の選択を独立化できる。

## 正当性

空の庭を禁止する包除で、利用可能庭i個に各種類を植える方法は独立なF_A(i)F_B(i)F_C(i)になる。Pascal則でF_M(i+1)=2F_M(i)−C(i,M)となるため全項を正確に更新できる。Σ(−1)^{N−i}C(N,i)の重み付けでは空庭を持つ配置が相殺され、全庭非空だけ一度残る。

## 実装上の注意

- C(i,M) は i＜M なら 0 とし、F_M(0)＝1 から A・B・C の三系列を同じ i で更新する。
- 包除項の符号は使用可能庭数 i に対する (−1)^{N−i} とし、減算を法の非負範囲へ戻す。

## 復習の核

- 全位置が非空という AND 条件が種類を絡めるなら、空位置を固定した包除で種類ごとの選択が積になるかを見る。
- 二項係数の prefix 和を全 n で使うときは、Pascal 図上で一段増やした差分となる境界項を探す。

## 計算量と制約

### 時間

O(N)。三つの打切り二項和を一次更新する。

### 空間

O(N)。階乗・逆階乗または逆元表を用いる。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^6; 0 \leq A \leq N; 0 \leq B \leq N; 0 \leq C \leq N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/editorial/3252) — source-abc235-editorial-3252-e156873af08601dc484d0ce3da61dd8d27ddda8414b6756079ad415e547689b7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/tasks/abc235_g) — source-abc235-g-problem-ff02f7865679f2725f215161406783f97b2ef351e4e8c2fbd85cecabc3dd6249
