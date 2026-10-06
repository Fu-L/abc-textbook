---
title: "ABC476 G — Increasing Popcount"
draft: true
authoringUnit: {"problemId":"abc476-g","docPath":"src/content/docs/problems/updates/abc476-g.md","learningOutcomeIds":["outcome-optimize-poset-antichain-by-dilworth","outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-poset-dilworth-antichain","tag-combinatorial-coefficients","tag-finite-field-subspace-counting","tag-stirling-transform"],"sourceRevisionIds":["source-abc476-g-problem-47e7b472df7860935b28151e54b7997d1f8e5fabe8677c854b8d190efec9369c","source-abc476-editorial-25751-e2ecd4cd1b0f5951f2d5cc7eaa26812f714ae7b1aaab5d2cd9a3e7a5192b3d49"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ラベルごとの添字列と鎖が一対一であり、Dilworthにより最小ラベル数は最大反鎖長。dyadic blockの低位bit上で非増加popcount列は集合包含の反鎖だからLYMの上限が適用でき、単一層が達成する。旧列の下限uを固定した任意の最適層j≤uに対しD[j]≥D[u]なので、単一層を直接列挙する遷移で上限を達成できる。suffix最大は全許容層を漏れなく集約する。","sourceRevisionIds":["source-abc476-g-problem-47e7b472df7860935b28151e54b7997d1f8e5fabe8677c854b8d190efec9369c","source-abc476-editorial-25751-e2ecd4cd1b0f5951f2d5cc7eaa26812f714ae7b1aaab5d2cd9a3e7a5192b3d49"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[半順序・Dilworth・最大反鎖](src/content/docs/learn/combinatorics-algebra/poset-dilworth-antichain.md)

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。
- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

## 考察

同じラベルを付ける添字列は、添字順かつpopcount狭義増加の鎖である。ラベル数最小化はこの半順序の最小鎖被覆。Dilworthにより最大反鎖、すなわち添字が増える一方でpopcountが非増加となる部分列の最大長へ帰着する。

[L,R]を、2^b長で開始位置がその倍数であるdyadic blockへ分ける。高位bitが固定される一ブロックでは、popcountは固定分c+低位b bitのpopcount。許容popcount範囲[a,z]の非増加部分列の最大長は max_{a≤c+k≤z}C(b,k)。理由は、その部分列をbit集合にすると反鎖で、LYM不等式Σ1/C(b,k)≤1が上限を与え、最大の一層を全て選べば達するため。

D[z]を処理済みprefix内で全popcountがz以上となる非増加部分列の最大長とする。ブロックの固定高位popcountをcとし、最後をt以上とすると、旧列の最後をu以上（u≥t）へ制限したD[u]に、ブロック内の[t,u]層の最大二項係数を足せる。一見O(B³)だが、この層内最大は少し整理できる。

このブロック内で選ぶ最適層をjとすれば、旧列の最後≥jであるD[j]にC(b,j−c)を足す。候補E[j]=D[j]+C(b,j−c)を各j=c,…,c+bで作り、next[t]=max(D[t],max_{j≥t}E[j])をsuffix最大で計算する。これは各ブロック O(B)。L,R≤10^18ならB≤60、ブロック数 O(B)で O(B²)。最終D[0]が答え。

## 典型の発動条件

最小鎖被覆を最大反鎖へ変え、巨大整数区間を高位bit固定のblockへ分割する。各blockの極値を層の二項係数へ圧縮してDPでつなぐ。

## 問題固有の要素

popcountが非増加なら包含関係が生じないため、Boolean格子のLYM不等式を使える。単なるpopcount頻度最大だけでは一般区間の境界を扱えない。

## 正当性

ラベルごとの添字列と鎖が一対一であり、Dilworthにより最小ラベル数は最大反鎖長。dyadic blockの低位bit上で非増加popcount列は集合包含の反鎖だからLYMの上限が適用でき、単一層が達成する。旧列の下限uを固定した任意の最適層j≤uに対しD[j]≥D[u]なので、単一層を直接列挙する遷移で上限を達成できる。suffix最大は全許容層を漏れなく集約する。

## 実装上の注意

二項係数・答えはmodを取らない64 bit整数。L=Rのblock長1も処理する。DPは旧配列から新配列へ更新する。

## 復習の核

巨大区間を桁DPだけで考えず、規則的な完全blockの答えを数論・組合せの定理で求め、境界だけを連結する。

## 計算量と制約

### 時間

B=ceil(log2(R+1))≤60として二項係数前計算 O(B²)、各テスト O(B²)。

### 空間

二項係数表 O(B²)、DP配列 O(B)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 10^4; 1\le L \le R\le 10^{18}; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc476/tasks/abc476_g)
- [公式解説](https://atcoder.jp/contests/abc476/editorial/25751)
