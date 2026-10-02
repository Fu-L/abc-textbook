---
title: "ABC345-G — Sugoroku 5"
draft: true
authoringUnit: {"problemId":"abc345-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc345-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-recursive-divide-and-conquer","unit-threshold-heavy-light"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-recursive-divide-and-conquer","tag-threshold-heavy-light"],"sourceRevisionIds":["source-abc345-editorial-9549-bbf9feee2dc8e8f9bcda8cc5b67eab93e4ae97e10063ff8e34b19b3a9890a8d3","source-abc345-g-problem-7d03c394d2605f58fdd910a1c46dfcc1e42ffb3b14cbd8503c3af52d9d4a26eb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"未到達確率a_nは進行量分布F^nのN未満係数和。F=x(1−x^K)/(K(1−x))を代入し包除で展開すると二項有限和になる。小Kの分割統治も同じFの冪を必要bandで計算するのでa_nが一致する。到達は単調で、時刻n−1未到達からn未到達を引いた差a_{n−1}−a_nが初回到達確率になる。","sourceRevisionIds":["source-abc345-editorial-9549-bbf9feee2dc8e8f9bcda8cc5b67eab93e4ae97e10063ff8e34b19b3a9890a8d3","source-abc345-g-problem-7d03c394d2605f58fdd910a1c46dfcc1e42ffb3b14cbd8503c3af52d9d4a26eb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)
- [平方根・閾値による軽重分類](src/content/docs/learn/modeling/threshold-heavy-light.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

n回後にgoal未到達である確率a_nを使うと、初回到達確率はP_n=a_{n−1}−a_nである。F(x)=K^{−1}(x+…+x^K)を一回の進行量の母関数とすると、a_n=[x^{N−1}]G(x)F(x)^n、G=1+x+…+x^{N−1}。

大KではF=x(1−x^K)/(K(1−x))を展開し、a_n=K^{−n}Σ_j(−1)^j C(n,j)C(N−1−jK,n)を使う。有効なjはO(N/K)個なので全nでO(N²/K)。階乗・逆階乗・Kの逆冪を前計算する。

小Kではdc(l,r,g)を使う。不変条件はgがGF^lの次数N−1へ至る上位係数を表すこと。返り値はF^{r−l} mod x^Nとする。葉r=l+1ではgの最後の係数をa_lとして記録しFを返す。内部ではm=(l+r)//2、p=dc(l,m,g)、g'=g·p（上位の目的次数を保って切り詰める）、q=dc(m,r,g')とし、p·q mod x^Nを返す。初期呼び出しはdc(0,N+1,G)。

各呼び出しで今後掛けるFは高々r−l−1個なので、目的次数N−1から(r−l−1)Kより下の係数は届かない。したがってgは上位min(N,(r−l−1)K+1)項だけ残せる。切り詰め時は係数配列の始点次数も更新し、g·pを計算した後も目的次数N−1までの部分を残す。p,qも次数min(N−1,(区間長)K)で止める。葉から伝わるFの冪とgのwindowを混同しない。

区間長sの節点の畳み込み長はO(min(N,sK))。各深さの合計長はO(NK)、各畳み込みの対数費用と再帰深さからO(NK log²N)。K≈sqrt(N)/log Nを境に二手法を使い分ければO(N^{3/2}log N)。最後に隣接差を出力する。

## 典型の発動条件

### 確率分布の母関数

発動条件: 独立dice和の分布とthreshold未満確率を全step数で求めたい。

一回分Fのn乗係数として位置確率を表し、survival確率a_nへ合計する。

### 疎密による平方分割

発動条件: Kが大きいと係数展開が疎で、小さいと低degree convolution幅が狭い。

O(N^2/K)とO(NK log^2N)の二手法をK閾値で使い分ける。

## 問題固有の要素

absorbing処理を直接母関数に入れず、無吸収のdice和がN未満であるsurvival確率を数えると、min(N,x+y)の挙動を単純な係数prefixへ変えられる。

別の問題へ持ち帰る視点: 到達時刻分布はthreshold未到達確率の隣接差として求めると、吸収Markov過程を通常の和分布へ戻せる。

## 正当性

未到達確率a_nは進行量分布F^nのN未満係数和。F=x(1−x^K)/(K(1−x))を代入し包除で展開すると二項有限和になる。小Kの分割統治も同じFの冪を必要bandで計算するのでa_nが一致する。到達は単調で、時刻n−1未到達からn未到達を引いた差a_{n−1}−a_nが初回到達確率になる。

## 実装上の注意

- a_0=1、n>Nでは不要で、binomialの範囲外項を0にする。P_nのmod減算を正規化し、Kの逆元・逆冪をmod 998244353で扱う。

## 復習の核

- K=1ではP_N=1のみ、N=K、N小で全dice列挙し、ΣP_i=1とa_nの単調差を確認する。

## 計算量と制約

### 時間

O(N+min(N²/K,NK log²N))を目安とする。大Kは有限和、小Kは必要次数bandだけの分割統治NTT。

### 空間

O(N log N)の安全な上界。深さ優先で兄弟を同時展開せず、各深さの生存配列はO(N)、深さO(log N)。全nodeのbandを同時保存しない。

### 制約との対応

公式制約の確認範囲: Time limit: 12 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 2 \times 10^5; N and K are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc345/editorial/9549) — source-abc345-editorial-9549-bbf9feee2dc8e8f9bcda8cc5b67eab93e4ae97e10063ff8e34b19b3a9890a8d3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc345/tasks/abc345_g) — source-abc345-g-problem-7d03c394d2605f58fdd910a1c46dfcc1e42ffb3b14cbd8503c3af52d9d4a26eb
