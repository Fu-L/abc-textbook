---
title: "ABC276-G — Count Sequences"
draft: true
authoringUnit: {"problemId":"abc276-g","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc276-g.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc276-editorial-5168-502ce674e16c416fc1f9f6562b75f2450e2715c73de44c5f5d30a4b238b8c778","source-abc276-g-problem-fa716d725f2c9a5e1b8fed032c7d2f43c5312c70e114b1ccbd8c3c1771002f7a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"差分は非負で総和a_N≤M、隣接mod3の相違は二番目以降の差分余りが1または2であることと同値。余り1のr位置を選べば余り和sが決まり、残る3の倍数分はN個の非負変数の総和≤tになる。stars-and-barsのC(N+t,N)で数え、全余り選択を合計すれば各列を一度だけ復元できる。","sourceRevisionIds":["source-abc276-editorial-5168-502ce674e16c416fc1f9f6562b75f2450e2715c73de44c5f5d30a4b238b8c778","source-abc276-g-problem-fa716d725f2c9a5e1b8fed032c7d2f43c5312c70e114b1ccbd8c3c1771002f7a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

非減少列Aを差分b_1=a_1,b_i=a_i-a_{i-1}へ変えると、b_i≥0かつΣb_i=a_N≤Mになる。

隣接するaのmod 3が異なる条件は、i≥2でb_iが3の倍数でない、すなわち余り1または2であることに等しい。

採用する候補: b_i=3y_i+x_iと分解し、x_1∈{0,1,2}とx_2…x_N中の余り1の個数を列挙し、残るyの個数をstars and barsで加算する。

余り列2^{N-1}通りを同じ和ごとに二項係数へ集約し、巨大なN,Mでも一次元和にできる。

棄却する候補: 位置、最後の余り、現在値を持つDPで非減少列を数える。

N,Mがともに10^7で、N×M状態は作れない。

x_2,…,x_Nのうち余り1がr個なら、その選び方はC(N-1,r)、余り和はx_1+r+2(N-1-r)だけで決まる。

余り和sを固定した後、Σy_i≤floor((M-s)/3)を満たす非負N変数の個数はC(N+t,N)である。

factorialとinverse factorialを必要上限まで前計算する。x_1=0,1,2とr=0,…,N-1を走査し、s=x_1+2(N-1)-r≤MならC(N-1,r)·C(N+floor((M-s)/3),N)を加える。

## 典型の発動条件

### 差分列への変換

発動条件: 非減少列と隣接差に関する条件が同時にあるとき。

a_i-a_{i-1}を非負変数にし、最終上限を差分和の上限へ変える。

### 剰余部分と商の分離

発動条件: 非負整数変数のmod条件と総和上限を数えるとき。

b_i=mod·y_i+x_iとして余りpatternを集約し、商をstars and barsで数える。

### stars and bars

発動条件: 非負整数N変数の総和が上限t以下となる個数が必要なとき。

slack用の1変数を加えC(N+t,N)として求める。

## 問題固有の要素

余り1/2の並び順は差分和に影響せず、余り1の個数rだけで商側の自由度が決まる。

別の問題へ持ち帰る視点: 指数個のカテゴリ列でも、後段の数え上げがカテゴリ別個数だけに依存するならmultinomial/binomialで圧縮する。

## 正当性

差分は非負で総和a_N≤M、隣接mod3の相違は二番目以降の差分余りが1または2であることと同値。余り1のr位置を選べば余り和sが決まり、残る3の倍数分はN個の非負変数の総和≤tになる。stars-and-barsのC(N+t,N)で数え、全余り選択を合計すれば各列を一度だけ復元できる。

## 実装上の注意

- t<0の項は加えず、factorial上限N+floor(M/3)程度を事前に確定する。
- N,Mは10^7なので配列要素型と複数配列のmemoryを見積もり、不要なDP表を持たない。

## 復習の核

- N=3でx_2,x_3∈{1,2}の4patternを余り1の個数別にまとめ、C(2,r)と余り和の式が一致するか確かめる。

## 計算量と制約

### 時間

O(N+M)。余り1個数rと初項余りの3caseを列挙し階乗表を作る。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^7; 1 \leq M \leq 10^7; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/editorial/5168) — source-abc276-editorial-5168-502ce674e16c416fc1f9f6562b75f2450e2715c73de44c5f5d30a4b238b8c778
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc276/tasks/abc276_g) — source-abc276-g-problem-fa716d725f2c9a5e1b8fed032c7d2f43c5312c70e114b1ccbd8c3c1771002f7a
