---
title: "ABC230-G — GCD Permutation"
draft: true
authoringUnit: {"problemId":"abc230-g","docPath":"src/content/docs/problems/mathematics/outcome-invert-divisor-lattice-by-mobius/outcome-invert-divisor-lattice-by-mobius-shard-001/abc230-g.md","learningOutcomeIds":["outcome-invert-divisor-lattice-by-mobius"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prime-divisor"],"excludedTopics":["約数格子のzeta・Möbius反転の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-divisor-mobius-inversion","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc230-editorial-3020-ec517a24bce91d242fbba4dc1bd314898db627e75b53e4c2944927428ba3bbfd","source-abc230-g-problem-9175b9a0825f6ecfa8907cce11e41b2f669f7a733b383504f6992705fa48edae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非互いに素の指示関数は−Σ_{d|gcd,d>1}μ(d)。添字と値の両条件を展開するとa|iかつb|P_iの集合からi≤jを選ぶc(c+1)/2が現れる。μ=0の約数を省いても値は変わらず、符号付き和が両条件を満たす組だけを残す。","sourceRevisionIds":["source-abc230-editorial-3020-ec517a24bce91d242fbba4dc1bd314898db627e75b53e4c2944927428ba3bbfd","source-abc230-g-problem-9175b9a0825f6ecfa8907cce11e41b2f669f7a733b383504f6992705fa48edae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [約数格子のzeta・Möbius反転](src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)

- 約数/倍数方向の累積値とexact gcd・period値をnumber-theoretic Möbius関数または格子反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

## 考察

GCD(i,j)≠1 は、i と j が共通して持つ 2 以上の約数の存在条件であり、P_i,P_j 側も同じ形をしている。

各 GCD の「1 でない」を約数上の符号和で指示できれば、二条件の積を a,b の倍数である位置数へ交換して集約できる。

棄却する候補: 全ての i≤j を列挙し、二つの最大公約数を個別に計算する。

位置対が N の二乗規模あり、N＝20 万では調べられない。

採用する候補: 約数和が n≥2 の指示関数になる修正 Möbius 係数を両軸に適用し、a の倍数位置を走査して P_i の square-free 約数 b ごとの個数を集計する。

条件を約数対 (a,b) ごとの位置集合へ分解でき、非零係数を持つ b の個数が各 P_i で少ない。

num(a,b) を i が a の倍数かつ P_i が b の倍数となる位置数とすると、i≤j の組数は num(a,b)(num(a,b)＋1)/2 になる。

修正係数は 1 を除く square-free 数だけで非零になり、20 万以下では相異なる素因数が高々 6 個なので列挙約数は高々 63 個である。

二つの非互いに素条件を修正 Möbius 反転で約数対へ展開し、倍数走査と P_i の非零 square-free 約数列挙から num(a,b) の三角数を符号付き加算する。

## 典型の発動条件

### Möbius 反転による GCD 条件の指示化

発動条件: GCD が 1、または 1 でないという条件を約数の倍数条件へ分解したいとき。

約数和が n≥2 で 1 となる修正係数を使い、両 GCD 条件を独立な約数和へ展開する。

### 倍数走査と square-free 約数列挙

発動条件: 非零 Möbius 係数を持つ約数だけを各値について集計すればよいとき。

固定 a の倍数位置 i を巡り、P_i の相異なる素因数部分集合から b を生成してカウンタを増やす。

## 問題固有の要素

二条件が位置 i と値 P_i に分かれており、P が順列なので各値の素因数分解・約数列を一度だけ前計算して再利用できる。

別の問題へ持ち帰る視点: 順列上で添字と値の算術条件が並ぶ問題は、添字側を倍数走査し値側を前計算テーブルで処理する二軸分解を検討する。

## 正当性

非互いに素の指示関数は−Σ_{d|gcd,d>1}μ(d)。添字と値の両条件を展開するとa|iかつb|P_iの集合からi≤jを選ぶc(c+1)/2が現れる。μ=0の約数を省いても値は変わらず、符号付き和が両条件を満たす組だけを残す。

## 実装上の注意

- i＝j も数えるため個数 c から c(c＋1)/2 を使い、通常の二要素組 c(c−1)/2 と取り違えない。
- a ごとの b カウンタは触れた添字だけを記録して初期化し、N×N の全消去を発生させない。

## 復習の核

- GCD 条件が複数あるときは、各条件を約数指示関数へ展開して和の順序を交換した後に残る集計量を定義する。
- 約数列挙の計算量は約数個数全体でなく、係数が非零な square-free 約数の個数を素因数数から評価する。

## 計算量と制約

### 時間

O(N log N·2^ωmax+N log log N)、ωmax≤6。

### 空間

O(N+Σ_i2^{ω(P_i)})。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; (P_1,P_2,\ldots,P_N) is a permutation of (1,2,\ldots,N).; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/editorial/3020) — source-abc230-editorial-3020-ec517a24bce91d242fbba4dc1bd314898db627e75b53e4c2944927428ba3bbfd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/tasks/abc230_g) — source-abc230-g-problem-9175b9a0825f6ecfa8907cce11e41b2f669f7a733b383504f6992705fa48edae
