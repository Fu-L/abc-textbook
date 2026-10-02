---
title: "ABC392-G — Fine Triplets"
draft: true
authoringUnit: {"problemId":"abc392-g","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc392-g.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc392-editorial-12175-d00afb91d1eb85a0a43b828ca1e68d4aff9b65365ce8a51e2724334e95acd568","source-abc392-g-problem-0ecceae1087a498df7b9a28343f0cd4bd59d0a352b474711ebed70002f6dbc4b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二乗係数2BはA+C=2Bの順序付きpair数。distinct集合では(B,B)がちょうど1個入り、残りは(A,C)と(C,A)のpairである。これを引いて2で割るとA<B<Cの等差tripletを一度得る。各tripletの中項Bは一意なのでB全体の和にも重複はない。","sourceRevisionIds":["source-abc392-editorial-12175-d00afb91d1eb85a0a43b828ca1e68d4aff9b65365ce8a51e2724334e95acd568","source-abc392-g-problem-0ecceae1087a498df7b9a28343f0cd4bd59d0a352b474711ebed70002f6dbc4b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

等差三項条件は2B=A+Cである。集合indicator多項式F(x)=Σ_{s∈S}x^sを二乗すると、係数[x^k]F²がA+C=kとなる順序付きpair数になる。

B∈Sを固定すると係数[x^{2B}]には(A,C)と(C,A)が両方入り、さらに無効な(B,B)が一つ含まれる。

採用する候補: 集合indicatorを自己convolutionし、各Bの2B係数から自己pairを引いて2で割る

最大値10^6までの一回のNTTで全sum別pair数をO(V log V)で得られ、N個のBを線形走査できる。

棄却する候補: 各A<B<Cのtripletを列挙して差を比較する

候補がΘ(N³)でN=10^6には到底間に合わない。

Sの要素はdistinctなので(B,B)の係数寄与は必ず1である。

残った順序付きpairはA≠Cで二つ一組になり、一方が自動的にA<B<Cを満たすので整数として半分にする。

maxSまでの0/1係数配列fを作り、convolution(f,f)を求める。各B∈Sについて(conv[2B]-1)/2を整数で答えへ足す。

## 典型の発動条件

### 加法pair countingのconvolution

発動条件: 集合から二要素を選び和ごとの個数を一括で求めるとき。

indicator多項式の積の係数を使う。

### ordered/unordered補正

発動条件: convolutionが順序付きpairと自己pairを数えるとき。

対角を引いて対称な二重countを2で割る。

## 問題固有の要素

中心Bを跨ぐ左右距離一致は差を直接数えるより、端点和2Bとしてadditive convolutionへ変えると全Bを同時に処理できる。

別の問題へ持ち帰る視点: 三項等差・中点条件は2middle=end1+end2へ移項し、和convolutionを検討する。

## 正当性

二乗係数2BはA+C=2Bの順序付きpair数。distinct集合では(B,B)がちょうど1個入り、残りは(A,C)と(C,A)のpairである。これを引いて2で割るとA<B<Cの等差tripletを一度得る。各tripletの中項Bは一意なのでB全体の和にも重複はない。

## 実装上の注意

- 係数は最大Nで998244353未満なのでmod convolution結果を整数countとして使える。2Bまで配列長を確保し、通常整数で2除算する。

## 復習の核

- 小集合で全triplet列挙し、Bが端点、(B,B)だけが存在、左右pairが複数あるcaseの係数補正を確認する。

## 計算量と制約

### 時間

O(V log V+N)、V=max S。indicator二乗をNTTで計算する。

### 空間

O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 10^6; 1 \le S_i \le 10^6; The elements of S are distinct.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/editorial/12175) — source-abc392-editorial-12175-d00afb91d1eb85a0a43b828ca1e68d4aff9b65365ce8a51e2724334e95acd568
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc392/tasks/abc392_g) — source-abc392-g-problem-0ecceae1087a498df7b9a28343f0cd4bd59d0a352b474711ebed70002f6dbc4b
