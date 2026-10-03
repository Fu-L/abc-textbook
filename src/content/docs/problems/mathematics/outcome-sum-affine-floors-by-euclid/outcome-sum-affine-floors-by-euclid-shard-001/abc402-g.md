---
title: "ABC402-G — Sum of Prod of Mod of Linear"
draft: true
authoringUnit: {"problemId":"abc402-g","docPath":"src/content/docs/problems/mathematics/outcome-sum-affine-floors-by-euclid/outcome-sum-affine-floors-by-euclid-shard-001/abc402-g.md","learningOutcomeIds":["outcome-sum-affine-floors-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euclidean-floor-sum"],"sourceRevisionIds":["source-abc402-editorial-12688-47b342f1e7fe599b2d9b9a8f0cc0e38a0bdb0b5710deae48ad87f6b65cbf11a3","source-abc402-g-problem-95c89a1ffb525b87d5e7640bde58ffc874c001655cb6d330694ae27f9396d3e1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"剰余積の展開とf_2−f_1∈{0,1}の二乗恒等式は各kで成立する。moment再帰の正規化はf=qk+r+gをそのまま展開したもの。残るgの和は、各高さj+1に達する位置t_j以後のkを数える格子点転置から三つの式を得る。二乗の寄与は高さごとの2j+1であるためG2も正しい。n=0,a0=0,Y=0が基底で、法がEuclid法の剰余へ縮むので再帰は終了する。二つのmomentを明示した積和へ代入すれば、全kの元の剰余積を正確に合計する。","sourceRevisionIds":["source-abc402-editorial-12688-47b342f1e7fe599b2d9b9a8f0cc0e38a0bdb0b5710deae48ad87f6b65cbf11a3","source-abc402-g-problem-95c89a1ffb525b87d5e7640bde58ffc874c001655cb6d330694ae27f9396d3e1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

r_j(k)=(Ak+B_j)−M f_j(k)、f_j(k)=⌊(Ak+B_j)/M⌋と置いて積を展開する。0≤B_1≤B_2<Mへ並べ替えるとf_2−f_1∈{0,1}なので、2f_1f_2=f_1²+f_2²−f_2+f_1。二つの床の積を、単独の床の一乗・二乗へ消せる。必要なものはT0=Σf(k)、T1=Σk f(k)、T2=Σf(k)²の三つだけである。

この三momentをまとめて返すF(n,m,a,b)を作る。kは0≤k<n。S1=n(n−1)/2、S2=n(n−1)(2n−1)/6とする。a=qm+a0、b=rm+b0、0≤a0,b0<mへ床除算で正規化し、g(k)=⌊(a0k+b0)/m⌋のmomentをG0,G1,G2とすると

T0=qS1+rn+G0、T1=qS2+rS1+G1、T2=q²S2+2qrS1+r²n+2qG1+2rG0+G2。

従って係数が法以上の部分を閉形式で取り除ける。n=0またはa0=0ならGは全て0。それ以外ではY=⌊(a0(n−1)+b0)/m⌋とする。Y=0なら同じく全0。床の値を縦に数えると、高さj+1へ初めて届く位置はt_j=⌈(m(j+1)−b0)/a0⌉、0≤j<Y。このtの三momentU0=Σt_j,U1=Σj t_j,U2=Σt_j²は

F(Y,a0,m,m+a0−1−b0)

を再帰呼出しすれば得られる。横方向の和を縦方向へ転置して

G0=nY−U0、G1=Y S1−(U2−U0)/2、G2=nY²−2U1−U0。

一乗の床は高さごとに1、二乗は1+3+…+(2f−1)と分けた式である。再帰の法がmからa0へ小さくなり、次の正規化と合わせてEuclid法と同じO(log M)段になる。通常のfloor_sumだけでは得られない二momentも、この閉じた三成分の再帰で計算できる。

B_jごとにF(N,M,A,B_j)=(T0_j,T1_j,T2_j)を求める。積和の答えは

A²S2+A(B_1+B_2)S1+B_1B_2N
−M[A(T1_1+T1_2)+B_1T0_2+B_2T0_1]
+M²(T2_1+T2_2−T0_2+T0_1)/2。

全項を正確な整数として合成し、最後に出力する。1/2や1/6は整数の恒等式の除算であり、剰余上の逆元ではない。小さいNについて剰余を直接生成すれば各momentと最後の積和を別々に検査できる。

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

剰余積の展開とf_2−f_1∈{0,1}の二乗恒等式は各kで成立する。moment再帰の正規化はf=qk+r+gをそのまま展開したもの。残るgの和は、各高さj+1に達する位置t_j以後のkを数える格子点転置から三つの式を得る。二乗の寄与は高さごとの2j+1であるためG2も正しい。n=0,a0=0,Y=0が基底で、法がEuclid法の剰余へ縮むので再帰は終了する。二つのmomentを明示した積和へ代入すれば、全kの元の剰余積を正確に合計する。

## 実装上の注意

- 三momentの途中値は最終答えより大きい。128bitまたは多倍長整数を使い、床除算は負係数にも数学的なfloorとして実装する。
- Y=0を先に処理して空の再帰を避ける。偶数・6の倍数になる整数式は除算前に全体を作る。

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
