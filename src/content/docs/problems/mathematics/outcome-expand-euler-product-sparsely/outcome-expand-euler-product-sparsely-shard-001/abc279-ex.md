---
title: "ABC279-EX — Sum of Prod of Min"
draft: true
authoringUnit: {"problemId":"abc279-ex","docPath":"src/content/docs/problems/mathematics/outcome-expand-euler-product-sparsely/outcome-expand-euler-product-sparsely-shard-001/abc279-ex.md","learningOutcomeIds":["outcome-expand-euler-product-sparsely"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions"],"excludedTopics":["母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-function-coefficients","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc279-editorial-5290-5a65ca8395c9d2fad6bc31056f401b8415bb0f4275c14878aea98dfbd2d40b88","source-abc279-ex-problem-23a78a33a742148d71c9f1f19a378907e506745b7fa6cc46b96f23443970ae65"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各因子Σ_{s≥1}min(k,s)x^s=x(1−x^k)/(1−x)²なので全積はx^NΠ_{k≤N}(1−x^k)/(1−x)^{2N}。d=M−N≤Nの範囲ではk>Nの因子は低次を変えず無限Euler積へ替えられる。五角数定理で非零項だけを出し、残りの係数を巨大二項係数としてLucasで正確に評価すれば目的の重み和を得る。","sourceRevisionIds":["source-abc279-editorial-5290-5a65ca8395c9d2fad6bc31056f401b8415bb0f4275c14878aea98dfbd2d40b88","source-abc279-ex-problem-23a78a33a742148d71c9f1f19a378907e506745b7fa6cc46b96f23443970ae65"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [母関数方程式・高度な係数抽出](src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md)

- Eulerの五角数定理により∏(1−x^i)を符号付きの疎な係数列へ展開し、必要次数までのO(√N)項で係数抽出できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md) — 高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。

## 考察

各S_kの寄与min(k,S_k)を係数とする生成関数を掛ければ、ΣS_k=Mの重み総和は積のx^M係数になる。

d=M-N≤Nなので、各要素から最低1を引いた後に必要な次数はN以下に限られ、有限積∏_{i=1}^N(1-x^i)を無限積へ置き換えても低次係数は変わらない。

採用する候補: 各factorをx(1-x^k)/(1-x)^2へ変形し、Eulerの五角数定理で分子の疎な係数だけ列挙し、分母係数をLucas定理の二項係数で足す。

Nが10^12でも必要な分子項は√N個で、巨大引数の組合せを小さい法200003のdigitごとに計算できる。

棄却する候補: kと現在sumを持つknapsack DPで生成関数の係数を順に更新する。

N,Mが10^12で状態もfactor数も列挙できない。

Σ_{s≥1}min(k,s)x^sは係数差分を2回取るとx-x^{k+1}となり、x(1-x^k)/(1-x)^2を得る。

Euler積の非零次数はgeneralized pentagonal numbers t(3t±1)/2、係数は(-1)^tなのでd以下に疎にしか現れない。

\[x^{d-e}](1-x)^{-2N}=C(M+N-e-1,2N-1)であり、prime modulusのLucas定理で巨大Nのまま求められる。

d=M-Nとし、e=0およびt(3t±1)/2≤dを列挙する。符号(-1)^tを掛けたC(M+N-e-1,2N-1)をmod200003で加算する。二項係数は0…p-1のfactorial/逆factorialを前計算してLucasで評価する。

## 典型の発動条件

### 重み付き列の生成関数

発動条件: 独立な各位置の値と重みの積を、総和条件の下で合計するとき。

位置kのΣ weight(s)x^sを作り、全factor積の指定係数を取る。

### Euler pentagonal number theorem

発動条件: partition関連の∏(1-x^i)が現れ、低次係数だけ必要なとき。

無限積をgeneralized pentagonal number上の疎な±1級数へ展開する。

### Lucas theorem

発動条件: prime pを法とする二項係数の上下引数が非常に大きいとき。

base-p digitごとの小二項係数の積として計算する。

## 問題固有の要素

M≤2Nにより必要次数d≤Nとなるため、有限Euler積のtailを捨てて有名な無限積公式をそのまま使える。

別の問題へ持ち帰る視点: 有限積を無限積へ延長する際は、求める係数次数より追加factorの最小次数が大きいかを確認する。

## 正当性

各因子Σ_{s≥1}min(k,s)x^s=x(1−x^k)/(1−x)²なので全積はx^NΠ_{k≤N}(1−x^k)/(1−x)^{2N}。d=M−N≤Nの範囲ではk>Nの因子は低次を変えず無限Euler積へ替えられる。五角数定理で非零項だけを出し、残りの係数を巨大二項係数としてLucasで正確に評価すれば目的の重み和を得る。

## 実装上の注意

- generalized pentagonal numberはtの±側t(3t-1)/2,t(3t+1)/2を重複なく列挙し、e=0の符号は+1とする。
- 通常のmod998244353ではなくp=200003でfactorialと全演算を行い、巨大な二項引数には64 bitを使う。

## 復習の核

- k=3の係数列1,2,3,3,…へ(1-x)を2回掛けてx-x^4になることと、d≤Nが無限積化を許す理由を確認する。

## 計算量と制約

### 時間

O(p+√(M−N) log_p(N+M))、p=200003。五角数だけ列挙してLucasを適用する。

### 空間

O(p)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{12}; N \leq M \leq 2N; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/editorial/5290) — source-abc279-editorial-5290-5a65ca8395c9d2fad6bc31056f401b8415bb0f4275c14878aea98dfbd2d40b88
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/tasks/abc279_h) — source-abc279-ex-problem-23a78a33a742148d71c9f1f19a378907e506745b7fa6cc46b96f23443970ae65
