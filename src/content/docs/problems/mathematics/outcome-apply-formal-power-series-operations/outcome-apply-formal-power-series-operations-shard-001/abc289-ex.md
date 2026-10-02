---
title: "ABC289-EX — Trio"
draft: true
authoringUnit: {"problemId":"abc289-ex","docPath":"src/content/docs/problems/mathematics/outcome-apply-formal-power-series-operations/outcome-apply-formal-power-series-operations-shard-001/abc289-ex.md","learningOutcomeIds":["outcome-apply-formal-power-series-operations","outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions","unit-modular-arithmetic","unit-polynomial-convolution"],"excludedTopics":["積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。"],"tagIds":["tag-convolution","tag-formal-power-series","tag-generating-functions","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc289-editorial-5712-16adf05d46e205117be88e47766d3b0603ff75d7e4073d06a70446a1489b3286","source-abc289-ex-problem-0fef6cd4b8486f8ea098b05b0f58627f3ee02107d66c45dcfca9955eb8cdf0b0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最初の会合時刻uで経路を分類すると、その後の再会は平行移動不変な同位置開始のhに従うためg=f*h。h(0)=1なので形式級数の逆元がありf=g/hで一意に求まる。各時刻のg,hは三人の二項分布の積を位置で足したもので、逆階乗列の畳み込みへの変形は同じ和を係数として表す。","sourceRevisionIds":["source-abc289-editorial-5712-16adf05d46e205117be88e47766d3b0603ff75d7e4073d06a70446a1489b3286","source-abc289-ex-problem-0fef6cd4b8486f8ea098b05b0f58627f3ee02107d66c45dcfca9955eb8cdf0b0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [FPS基本演算と多項式の多点評価を行う](src/content/docs/learn/combinatorics-algebra/formal-power-series.md)

- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- 積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。

## 考察

g(t)を初期位置A,B,Cから時刻tに同一点へいる確率、h(t)を全員0開始で同一点へいる確率、f(t)を初めて同一点へ着く確率とする。

最初の集合時刻uで分けると、その後は平行移動不変な0,0,0開始の再会確率になるため、g(t)=Σ_{u=0}^t f(u)h(t-u)が成り立つ。

1人がXからt歩後にwへいる確率は2^{-t}C(t,(t+w-X)/2)で、3人分のwに関する和は2列のconvolutionへ変形できる。

採用する候補: 通常会合確率G,HをNTT畳み込みで列挙し、renewal方程式F·H=Gを形式的冪級数の逆元で解く。

first-time条件をFPS除算へ分離し、位置和と時刻畳み込みの両方を高速な多項式演算で処理できる。

棄却する候補: f(t)=g(t)-Σ_{u<t}f(u)h(t-u)をtごとに直接計算する。

T≤10^5で全過去uを走査するとO(T^2)になる。

棄却する候補: 3人の絶対位置tupleを時刻ごとに確率DPする。

random walkの到達位置範囲が時刻とともに広がり、三次元状態を保持する必要が生じる。

h(0)=1なのでHの定数項はinvertibleであり、生成関数ではrenewal convolutionがF(x)H(x)=G(x)、すなわちF=G/Hになる。

q(i)=1/(((i-A)/2)!((i-B)/2)!((i-C)/2)!)、r(i)=1/(((i+A)/2)!((i+B)/2)!((i+C)/2)!)と置くと、会合確率p(t)は(t!)^3/2^{3t}·(q*r)[2t]になる。

負または非整数のfactorial引数を0と定義すれば、到達不能な位置とparity不一致を同じ係数列で自動的に除外できる。

factorial・inverse factorialと2の逆冪を前計算する。初期位置(X,Y,Z)について有効parityだけq,r配列へinverse factorial積を入れ、NTT convolutionのindex 2t（offset採用時はその補正位置）からp(t)を復元する。この処理を(A,B,C)でG、(0,0,0)でHに行う。HのFPS inverseを次数Tまで求め、Gと掛けたFのx^T係数を出力する。

## 典型の発動条件

### first-return renewal equation

発動条件: 通常の到達確率から初回到達時刻分布を求め、到達後の過程がrestartできるとき。

最初の到達時刻で分解してG=F·Hを立てる。

### 形式的冪級数の逆元

発動条件: 未知列とのconvolution方程式で既知kernelの定数項が非zeroなとき。

F=G·H^{-1}を必要次数まで計算する。

### binomial random-walk kernelの畳み込み

発動条件: 複数walkが同一点へいる確率を位置wについて総和するとき。

t+wとt-wへ変数分離し、qとrのconvolution係数として取り出す。

## 問題固有の要素

集合地点そのものを状態に残さず、最初に集合した後は3人が同一点開始という相対配置だけへrestartするため、kernel hは場所に依存しない。

別の問題へ持ち帰る視点: Markov過程の初回eventでは、event後の状態が対称性で標準状態へ正規化できるとrenewal convolutionが得られる。

## 正当性

最初の会合時刻uで経路を分類すると、その後の再会は平行移動不変な同位置開始のhに従うためg=f*h。h(0)=1なので形式級数の逆元がありf=g/hで一意に求まる。各時刻のg,hは三人の二項分布の積を位置で足したもので、逆階乗列の畳み込みへの変形は同じ和を係数として表す。

## 実装上の注意

- q,rの添字は負になり得る表現なので、共通offsetを入れ、convolution後に欲しい2tのindexへoffset和を足して参照する。
- factorial引数のparityが合わない項や0未満の項は必ず0とし、A,B,Cが同parityという保証を利用する。
- H[0]=1を確認してT+1項のinverseを取り、convolution結果はdegree Tまでtruncateする。
- 確率係数へ(t!)^3と2^{-3t}をmod 998244353で掛ける。

## 復習の核

- A=B=CならG=HからF=1となりT>0の係数が0になることを確認し、一般例ではq*rのindex・parityとrenewal式のu=t項h(0)=1を照合する。

## 計算量と制約

### 時間

O(L log L)、L=O(T+max(A,B,C))はNTT用係数列長。FPS逆元も次数Tまで。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0 \leq A, B, C, T \leq 10^5; A \equiv B \equiv C \pmod{2}; A, B, C, and T are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/editorial/5712) — source-abc289-editorial-5712-16adf05d46e205117be88e47766d3b0603ff75d7e4073d06a70446a1489b3286
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/tasks/abc289_h) — source-abc289-ex-problem-0fef6cd4b8486f8ea098b05b0f58627f3ee02107d66c45dcfca9955eb8cdf0b0
