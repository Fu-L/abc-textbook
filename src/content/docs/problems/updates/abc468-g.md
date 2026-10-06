---
title: "ABC468 G — Restricted Permutation"
draft: true
authoringUnit: {"problemId":"abc468-g","docPath":"src/content/docs/problems/updates/abc468-g.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-combinatorial-coefficients","tag-finite-field-subspace-counting","tag-stirling-transform"],"sourceRevisionIds":["source-abc468-g-problem-2c78561debee8e6b9757a4a7d8176d2357558d04fca83af875e6dd94ca454bde","source-abc468-editorial-23741-288f32350099a2a87fbc290f5f2cea27b0433bd5f2fbfc48064129a0cfdb55b2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最初に連続ブロックとなるkは各順列について一意で、その内部順と圧縮後の順列も一意に復元できるので漸化式に重複がない。指定された連続ブロックの間では圧縮した旧ブロックを最小要素として同じ局所問題が現れ、相互に独立な挿入が一意に復元できるため積で数えられる。","sourceRevisionIds":["source-abc468-g-problem-2c78561debee8e6b9757a4a7d8176d2357558d04fca83af875e6dd94ca454bde","source-abc468-editorial-23741-288f32350099a2a87fbc290f5f2cea27b0433bd5f2fbfc48064129a0cfdb55b2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

## 考察

小さい値1,…,kが連続ブロックになるかを指定して順列を数える。最小値1は常に一頂点ブロックで、全N値も必ず一ブロックなので、S_1またはS_Nがxなら0。

指定のoの位置を1=a_1<…<a_m=Nとする。値の小さい順に挿入して順列を作ると、直前のo位置までの値は一つの連続ブロックとして扱える。次のo位置までの間は、そのブロックを一要素へ圧縮し、新しく挿入する値を相対順位で付け直す。途中で小さい値全体がブロックになることを禁じ、最後にだけなる局所順列をd_nとすれば、区間ごとの選択は独立で答えは Π d_{a_{j+1}−a_j+1}。ブロックの内部順序は前段で既に選んでおり、ここで重ねて数えない。

d_nを求める。任意のn要素順列で、1,…,kが連続になる最初のk≥2を分類キーにする。このkの内部順はd_k通り。そのブロックを一要素と残りn−k要素を並べる順序は(n−k+1)!通り。従って n!=Σ_{k=2}^n d_k(n−k+1)!。

d_1=1として、n≥2では d_n=n!−Σ_{k=2}^{n−1}d_k(n−k+1)! を昇順に計算する。N≤2000なのでこの O(N²) 漸化式で十分であり、FPSで加速する必要はない。

## 典型の発動条件

全体を最初の構造完成位置で一意に分類し、完成した構造を一要素へ圧縮する。既知の全数から早く完成する場合を引く漸化式が使える。

## 問題固有の要素

oの位置でだけ小さい値が一ブロックになるため、隣接o間で同じ局所問題が繰り返される。

## 正当性

最初に連続ブロックとなるkは各順列について一意で、その内部順と圧縮後の順列も一意に復元できるので漸化式に重複がない。指定された連続ブロックの間では圧縮した旧ブロックを最小要素として同じ局所問題が現れ、相互に独立な挿入が一意に復元できるため積で数えられる。

## 実装上の注意

N=1でS=oなら空積1。dの和はk=2から始め、d_1を混ぜない。引き算はmod正規化。

## 復習の核

『最初に成立する場所』を分類キーにすれば排反になる。圧縮したブロックを内部で再び数えない。

## 計算量と制約

### 時間

階乗 O(N)、dの二重和 O(N²)、最後の積 O(N)。

### 空間

階乗とdの表 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2000; S_i is a string of length N consisting of o and x.

## 出典

- [公式問題](https://atcoder.jp/contests/abc468/tasks/abc468_g)
- [公式解説](https://atcoder.jp/contests/abc468/editorial/23741)
