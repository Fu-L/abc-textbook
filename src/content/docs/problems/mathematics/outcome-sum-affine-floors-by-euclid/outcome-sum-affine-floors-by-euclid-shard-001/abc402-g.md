---
title: "ABC402-G — Sum of Prod of Mod of Linear"
draft: true
authoringUnit: {"problemId":"abc402-g","docPath":"src/content/docs/problems/mathematics/outcome-sum-affine-floors-by-euclid/outcome-sum-affine-floors-by-euclid-shard-001/abc402-g.md","learningOutcomeIds":["outcome-sum-affine-floors-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euclidean-floor-sum"],"sourceRevisionIds":["source-abc402-editorial-12688-47b342f1e7fe599b2d9b9a8f0cc0e38a0bdb0b5710deae48ad87f6b65cbf11a3","source-abc402-g-problem-95c89a1ffb525b87d5e7640bde58ffc874c001655cb6d330694ae27f9396d3e1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"剰余r_j=u_j−Mf_jを展開すると二次多項式とfloor momentへ分かれる。B_1≤B_2ではc=f_2−f_1∈{0,1}なのでc²=c、従って2f_1f_2=f_1²+f_2²−f_2+f_1になる。積floorを単独二乗momentへ変えた恒等式は各kで成立し、Euclid型moment再帰で総和をexactに求められる。","sourceRevisionIds":["source-abc402-editorial-12688-47b342f1e7fe599b2d9b9a8f0cc0e38a0bdb0b5710deae48ad87f6b65cbf11a3","source-abc402-g-problem-95c89a1ffb525b87d5e7640bde58ffc874c001655cb6d330694ae27f9396d3e1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [格子点転置によるfloor_sum](src/content/docs/learn/number-theory/euclidean-floor-sum.md)

- Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

r_b(k)=(Ak+B)-M floor((Ak+B)/M)と展開すると、求める積和はkの二次多項式和、k^p floor、そして二つのfloorの積和へ分かれる。

B1≤B2なら二floorの差cは0または1だけでc(c-1)=0。これを展開するとfloor積を各floorの一乗・二乗の線形結合へ消去できる。

採用する候補: 剰余積を一般化floor sum f_{p,q}の有限な線形結合へ変形してEuclid再帰で計算する

必要次数p,q≤2は定数で、各case O(log M)。T=10^5でもNを走査せず処理できる。

棄却する候補: k=0..N-1を各test caseで直接走査して剰余積を足す

T×Nは最大10^11で間に合わず、linear floorの周期/Euclid構造を使っていない。

floor差が0/1なのは0≤B2-B1<Mで同じAkを加えるため、一つのM境界しか跨がないことによる。

通常のΣk^0,k,k²とf_{p,q}(N,M,A,B)をexact integerで組み合わせ、floor積の1/2は全体が偶数になる恒等式から安全に割れる。

必要ならB1,B2をswapする。剰余積展開のpolynomial項を閉形式で求め、各mixed項を一般化floor sumへ渡す。floor1·floor2は差cの恒等式でq=1,2の単独floor和へ置換し、全項を64/128 bit整数で合成する。

## 典型の発動条件

### generalized floor sum

発動条件: Σk^p floor((Ak+B)/M)^qを巨大Nで求めたいとき。

Euclidean algorithm型再帰でO(log M)計算する。

### 差がbinaryな二floorの積消去

発動条件: 同じlinear numeratorでoffsetだけが一mod未満異なる二floorがあるとき。

差c∈{0,1}のc(c-1)=0を展開する。

## 問題固有の要素

二つのfloorの積は一般の二変量集計に見えるが、offset差がM未満という入力正規化により単独momentだけへ還元できる。

別の問題へ持ち帰る視点: floor積では二floorの差の値域を先に調べ、小集合なら満たす低次数多項式恒等式でcross termを消す。

## 正当性

剰余r_j=u_j−Mf_jを展開すると二次多項式とfloor momentへ分かれる。B_1≤B_2ではc=f_2−f_1∈{0,1}なのでc²=c、従って2f_1f_2=f_1²+f_2²−f_2+f_1になる。積floorを単独二乗momentへ変えた恒等式は各kで成立し、Euclid型moment再帰で総和をexactに求められる。

## 実装上の注意

- 最終値は非常に大きいので128 bit以上または多倍長整数を使う。B順swap、1/2の除算順、A=0,M=1を検証する。

## 復習の核

- 小N,M全探索とrandom比較し、B1=B2、B差M-1、A=0、wrapが毎step起きるcaseで各展開項を照合する。

## 計算量と制約

### 時間

各case O(log M)の固定次数一般化floor_sum再帰。

### 空間

O(log M)、反復実装なら定数個のmoment状態。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 10^5; 1\le N\le 10^6; 1\le M\le 10^6; 0\le A,B_1,B_2 < M; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc402/editorial/12688) — source-abc402-editorial-12688-47b342f1e7fe599b2d9b9a8f0cc0e38a0bdb0b5710deae48ad87f6b65cbf11a3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc402/tasks/abc402_g) — source-abc402-g-problem-95c89a1ffb525b87d5e7640bde58ffc874c001655cb6d330694ae27f9396d3e1
