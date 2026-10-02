---
title: "ABC390-G — Permutation Concatenation"
draft: true
authoringUnit: {"problemId":"abc390-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc390-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients","tag-contribution-reordering"],"sourceRevisionIds":["source-abc390-editorial-11976-fb24d3a16a0815a303639a818c312a8ec4cabe6b0ae38d5a004bf02acc3cc5fc","source-abc390-g-problem-0efb6c892cf4c2fbca1efc1e7ec7fe51ca8912ef596ab781a05cc96abc582952"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"整数mの寄与はm以後の整数集合の総桁数だけ10冪でずれる。各後方整数を選ぶ/選ばないfactor1+10^{digits}xを掛けると後方個数rと桁shiftの重み和を得る。m自身のfactorを除き、後方順r!と前方順(N−1−r)!を掛けると全順列でのm寄与を一度数える。同桁mの係数は共通なのでcategory総和を掛ければよい。","sourceRevisionIds":["source-abc390-editorial-11976-fb24d3a16a0815a303639a818c312a8ec4cabe6b0ae38d5a004bf02acc3cc5fc","source-abc390-g-problem-0efb6c892cf4c2fbca1efc1e7ec7fe51ca8912ef596ab781a05cc96abc582952"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

permutation中の整数mの寄与は、mより後ろに並ぶ数の総桁数dだけ10^d倍される。後方集合を桁数category別に選ぶと、選択数・順列数・桁shiftを生成関数でまとめられる。

1..N全体の桁数count C_k^0から作るF^0(x)=∏_k(1+10^k x)^{C_k^0}を、m自身の因子(1+10^b x)で割れば、m以外から後方集合を選ぶ係数になる。

採用する候補: 桁数categoryの母関数をconvolutionで作り、各桁数bの因子除算後にfactorial重みとの内積を取る

同じ桁数のmは同一の係数列を共有し、そのm総和だけ掛ければよい。桁数はO(log N)種類で、全体O(N log N)に収まる。

棄却する候補: N!個のpermutationを列挙してdecimal連結値を足す

N=2×10^5で不可能で、各整数の線形な位置寄与を利用していない。

後方にr個を選んだとき、その並べ方r!と前方の(N-1-r)!を係数へ掛ける。

因子は一次式の冪なのでF^0/(1+10^b x)は係数を低次から筆算してO(N)で求められる。

桁数別countから各(1+10^k x)^{C_k^0}を構築し、小次数順convolutionでF^0を得る。bごとに一次因子で割った係数q_rへr!(N-1-r)!を掛けた重みW_bを計算し、b桁のmの総和×W_bを答えへ足す。

## 典型の発動条件

### 要素ごとの線形寄与分解

発動条件: 連結・配置値が各要素の寄与和として表せるとき。

mの右側の総桁数だけを数えて全permutationへ加算する。

### category母関数と因子除去

発動条件: 一要素を除いたsubset生成関数をcategoryごとに多数求めるとき。

全体積から該当一次因子を割り、同categoryで再利用する。

## 問題固有の要素

mごとの差は値mと桁数bだけであり、permutationにおける残り要素配置の全情報をb別の一つの多項式へ集約できる。

別の問題へ持ち帰る視点: 全permutation連結の総和では、一要素をmarkして左右集合を選ぶEGF/OGF係数と両側factorialを組み合わせる。

## 正当性

整数mの寄与はm以後の整数集合の総桁数だけ10冪でずれる。各後方整数を選ぶ/選ばないfactor1+10^{digits}xを掛けると後方個数rと桁shiftの重み和を得る。m自身のfactorを除き、後方順r!と前方順(N−1−r)!を掛けると全順列でのm寄与を一度数える。同桁mの係数は共通なのでcategory総和を掛ければよい。

## 実装上の注意

- 桁数境界10^kと各categoryの整数和をmodで正しく求める。係数index r=0..N-1、factorial積、N=1の空集合を扱う。

## 復習の核

- N≤8で全permutationを直接連結し、N=9/10など桁境界とN=1についてb別重み・category和を照合する。

## 計算量と制約

### 時間

O(N log²N+N log_{10}N)。桁category多項式の合成とcategoryごとの一次除算。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc390/editorial/11976) — source-abc390-editorial-11976-fb24d3a16a0815a303639a818c312a8ec4cabe6b0ae38d5a004bf02acc3cc5fc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc390/tasks/abc390_g) — source-abc390-g-problem-0efb6c892cf4c2fbca1efc1e7ec7fe51ca8912ef596ab781a05cc96abc582952
