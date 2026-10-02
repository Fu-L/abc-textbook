---
title: "ABC278-EX — make 1"
draft: true
authoringUnit: {"problemId":"abc278-ex","docPath":"src/content/docs/problems/mathematics/outcome-count-finite-field-subspaces-by-rank/outcome-count-finite-field-subspaces-by-rank-shard-001/abc278-ex.md","learningOutcomeIds":["outcome-count-finite-field-subspaces-by-rank"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-polynomial-convolution"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-finite-field-subspace-counting","tag-combinatorial-coefficients","tag-convolution","tag-stirling-transform"],"sourceRevisionIds":["source-abc278-editorial-5210-0f1a56156ff30245ba49db87069bf35c61ea37eecc6e019379bf06fedd2ac83b","source-abc278-ex-problem-49227ad1d2ec3968bf08a7cbc0c1fab87d217b52980f2097766caae5bfd774f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"goodは単位vector1がspanに含まれること。既に長さN−1でgoodなdistinct列は未使用値をどれだけ追加してもgoodで、拡張数は2^B−N+1。したがってgood distinct長Nの数からこの拡張数を引くと初回goodだけ残る。重複ありの列とdistinct値列の関係は等値位置の集合分割のStirling変換であり、逆変換は同じspan条件を保ってdistinct分布を復元する。","sourceRevisionIds":["source-abc278-editorial-5210-0f1a56156ff30245ba49db87069bf35c61ea37eecc6e019379bf06fedd2ac83b","source-abc278-ex-problem-49227ad1d2ec3968bf08a7cbc0c1fab87d217b52980f2097766caae5bfd774f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 生成ベクトルのspan条件をrank別の部分空間数へ変換し、有限体上のGaussian binomial係数で各rankの寄与を数えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

各cardをB-bitのF_2 vectorとみなすと、sequenceがgoodであることはunit vector 1が選択vectorのspanに含まれることと同値である。

final length Nとは、長さNで初めてgoodになることなので、distinct-card good列N個から、既にN-1でgoodなprefixの全extensionを引けばよい。

採用する候補: bad distinct列数F(s)を、with-replacement bad列数G(s)とのStirling変換で求める。G(s)はrank別部分空間数をq=2のGaussian binomialで表し、convolutionで全sを列挙する。

distinct制約・span条件・巨大BをそれぞれStirling反転、q-binomial、NTTへ分解できる。

棄却する候補: distinct cardを順に選び、現在のlinear basisそのものを状態としてDPする。

B≤10^7で部分空間の種類数が莫大で、basis状態を列挙できない。

targetはGoodDistinct(N)−GoodDistinct(N-1)·(2^B-N+1)で、後者は既にgoodなprefixが未使用cardのどれを追加してもgoodなままだからである。

replacement列を等値位置のset partitionでdistinct値列へ潰すとG(s)=Σ_t {s\brace t}F(t)となり、signed first-kind Stirling数でFへ反転できる。

rank rでspanがvector 1を含まない行列数は、B-1次元側の部分空間選択とq-binomialを用いる公式に集約される。

q=2のq-factorialと逆元を前計算し、rank式をconvolution形へ整理してG(1…N)をNTTで求める。必要なsigned Stirling係数でF(N),F(N-1)を反転し、distinct全列−Fからgood列を作って初回goodの差を取る。

## 典型の発動条件

### 線形span条件への翻訳

発動条件: subset xorで特定vectorを作れるかを数えるとき。

整数をF_2 vectorとみなし、targetがrow spanに属するかで分類する。

### q-binomial coefficient

発動条件: 有限体上のrank・部分空間の個数を数え、q^n-q^mの積が現れるとき。

q-factorialを前計算してdimension別部分空間数とrank行列数を評価する。

### Stirling変換

発動条件: with-replacement列とdistinct要素列を、等値位置のpartition数を介して変換するとき。

second-kindで集約し、signed first-kindで反転する。

## 問題固有の要素

『初めてgood』はgood N列からgood prefixの自由extensionを引け、bad列のdistinct制約はreplacement列とのStirling変換で外せる。

別の問題へ持ち帰る視点: 停止時刻付き列数え上げでは、吸収性を使ったprefix差と、distinct/repetitionのpartition変換を別々に検討する。

## 正当性

goodは単位vector1がspanに含まれること。既に長さN−1でgoodなdistinct列は未使用値をどれだけ追加してもgoodで、拡張数は2^B−N+1。したがってgood distinct長Nの数からこの拡張数を引くと初回goodだけ残る。重複ありの列とdistinct値列の関係は等値位置の集合分割のStirling変換であり、逆変換は同じspan条件を保ってdistinct分布を復元する。

## 実装上の注意

- rank rの範囲は0≤r≤min(s,B-1)で、q-factorialの負indexを参照しない。
- 2^B、falling factorial、q-factorialはいずれもmod998244353で管理し、最終差を非負剰余へ正規化する。

## 復習の核

- B=2,N=2でbad spanがunit vector1を含まない列を手で分類し、distinct版Fとreplacement版Gの違いを確認する。

## 計算量と制約

### 時間

O(N log²N+min(N,B))の高速Stirling反転・q係数畳み込みを用いる。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq B \leq 10^7; N \leq 2^B; N and B are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/editorial/5210) — source-abc278-editorial-5210-0f1a56156ff30245ba49db87069bf35c61ea37eecc6e019379bf06fedd2ac83b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/tasks/abc278_h) — source-abc278-ex-problem-49227ad1d2ec3968bf08a7cbc0c1fab87d217b52980f2097766caae5bfd774f7
