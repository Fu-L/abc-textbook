---
title: "ABC303-EX — Constrained Tree Degree"
draft: true
authoringUnit: {"problemId":"abc303-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-labeled-trees-by-prufer-code/outcome-encode-labeled-trees-by-prufer-code-shard-001/abc303-ex.md","learningOutcomeIds":["outcome-encode-labeled-trees-by-prufer-code"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions","unit-modular-arithmetic","unit-polynomial-convolution"],"excludedTopics":["Prüfer code・次数制約付きlabel木の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-prufer-code","tag-combinatorial-coefficients","tag-convolution","tag-generating-functions","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc303-editorial-6425-145eaa525a03e51f289be86aa8bfc1fdac81daaab3e0b34cba01fe494b1a4506","source-abc303-ex-problem-267a3028ae4d2520204c715bf88d04e5e0021b870033e77b67444f1502079e89"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Prüfer codeはlabel付き木と長さN−2列の全単射で、各labelの出現数は次数−1。Fの各r次係数1/r!をN個掛けたN−2次係数は許容出現vectorのΠ1/r!の和になる。最後に(N−2)!を掛けると各vectorのcode列の多項係数を回復し、従って許容次数の全木を一度数える。","sourceRevisionIds":["source-abc303-editorial-6425-145eaa525a03e51f289be86aa8bfc1fdac81daaab3e0b34cba01fe494b1a4506","source-abc303-ex-problem-267a3028ae4d2520204c715bf88d04e5e0021b870033e77b67444f1502079e89"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Prüfer code・次数制約付きlabel木](src/content/docs/learn/combinatorics-algebra/prufer-code.md)

- Prüfer列とlabel付き木の全単射、および各labelの出現回数=次数-1を使って次数制約を係数条件へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- Prüfer code・次数制約付きlabel木の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

label付き木を直接数える代わりにPrüfer codeへ写すと、長さN-2の列で頂点iの出現回数がdeg(i)-1になる。全頂点に同じ許容次数集合が課される条件は、各文字の許容出現回数へ独立化できる。

採用する候補: Prüfer codeと指数型母関数の係数を計算する

次数制約を各labelの出現回数制約へ変換し、多項式のN乗の一係数として全木をまとめて数えられる。

棄却する候補: N頂点の木を列挙して各次数を検査する

label付き木はN^(N-2)個あり、列挙も個別の次数検査も制約に対して不可能である。

許容出現回数集合R={d-1 | dは許容次数}に対しF(x)=Σ_{r∈R}x^r/r!と置く。各labelの出現回数を合計N-2にするmultinomial係数が係数へ組み込まれるため、答えは(N-2)!·[x^(N-2)]F(x)^Nとなる。

factorialと逆factorialを前計算して次数N-2以下のFを作る。F^Nをbinary exponentiationとNTT畳み込みで計算し、各積をN-2次で打ち切る。最後にx^(N-2)の係数へ(N-2)!を掛ける。

## 典型の発動条件

### Prüfer code

発動条件: label付き木の次数だけに条件があり、辺配置を直接扱う必要がない。

木を長さN-2のlabel列へ全単射で移し、deg(i)-1をlabel iの出現数として扱う。

### 指数型母関数と高速多項式冪

発動条件: 各labelに同じ出現回数制約があり、総出現数を固定してmultinomialに重み付けしたい。

1/r!を係数とする多項式をN乗し、NTTで必要次数まで高速に畳み込む。

## 問題固有の要素

通常型母関数ではなく1/r!を係数にすると、係数抽出後の(N-2)!が各出現回数配分に正しいmultinomial係数を与える。

別の問題へ持ち帰る視点: 区別される位置へ種類別個数を割り当てる数え上げは、指数型母関数で独立条件を積へ分離できる。

## 正当性

Prüfer codeはlabel付き木と長さN−2列の全単射で、各labelの出現数は次数−1。Fの各r次係数1/r!をN個掛けたN−2次係数は許容出現vectorのΠ1/r!の和になる。最後に(N−2)!を掛けると各vectorのcode列の多項係数を回復し、従って許容次数の全木を一度数える。

## 実装上の注意

- N=2ではcode長が0なので定数項を正しく扱う。Fと全中間多項式を次数N-2で切り、許容次数dは出現回数d-1へずらす。

## 復習の核

- N≤6で全Prüfer列を列挙し、許容次数が空に近い場合、次数1のみ、全次数許容、N=2を係数式と比較する。

## 計算量と制約

### 時間

O(N log N·log N)。F^Nの二分累乗ごとにN次打切りNTTを行う。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 2\times 10^5; 1\leq K \leq N-1; 1\leq S_1 < S_2 < \ldots < S_K \leq N-1; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/editorial/6425) — source-abc303-editorial-6425-145eaa525a03e51f289be86aa8bfc1fdac81daaab3e0b34cba01fe494b1a4506
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/tasks/abc303_h) — source-abc303-ex-problem-267a3028ae4d2520204c715bf88d04e5e0021b870033e77b67444f1502079e89
