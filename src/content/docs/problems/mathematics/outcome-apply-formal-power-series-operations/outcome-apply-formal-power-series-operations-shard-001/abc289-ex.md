---
title: "ABC289-EX — Trio"
draft: true
authoringUnit: {"problemId":"abc289-ex","docPath":"src/content/docs/problems/mathematics/outcome-apply-formal-power-series-operations/outcome-apply-formal-power-series-operations-shard-001/abc289-ex.md","learningOutcomeIds":["outcome-apply-formal-power-series-operations","outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions","unit-modular-arithmetic","unit-polynomial-convolution"],"excludedTopics":["積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。"],"tagIds":["tag-convolution","tag-formal-power-series","tag-generating-functions","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc289-editorial-5712-16adf05d46e205117be88e47766d3b0603ff75d7e4073d06a70446a1489b3286","source-abc289-ex-problem-0fef6cd4b8486f8ea098b05b0f58627f3ee02107d66c45dcfca9955eb8cdf0b0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各会合経路は初回時刻uを一意に持ち、以後は独立な同位置開始の過程に移るためg=f*h。h(0)=1よりF=G/Hが唯一の初回分布を与える。\n\n固定時刻t・会合位置wの三二項確率を展開すると、分母はq(t+w)r(t−w)へ分かれる。u=t+w,v=t−wの和は2tで、非零条件u≥U,v≥−Lと共通parityからu=U+2a,v=−L+2bとなる。従ってa+b=t−δ、取り出す係数はC[t−δ]である。t≤Tに必要な全a,bを0..T−δへ置くので、到達可能な会合位置を漏らさず一度ずつ足す。δ>Tなら到達区間に共通点がなく、全会合確率は0。以上により圧縮配列で作ったG,Hも正確であり、FPS除算後のT次係数が求める確率となる。","sourceRevisionIds":["source-abc289-editorial-5712-16adf05d46e205117be88e47766d3b0603ff75d7e4073d06a70446a1489b3286","source-abc289-ex-problem-0fef6cd4b8486f8ea098b05b0f58627f3ee02107d66c45dcfca9955eb8cdf0b0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

「初めて会合する」という条件があるので、通常の会合確率から初回会合後の寄与を除く。g(t)をA,B,Cから開始して時刻tに同地点へいる確率、h(t)を全員0開始で同地点へいる確率、f(t)を初めて会合する時刻がtである確率とする。初回時刻uで分類すれば、会合場所は平行移動で0へ戻せ、未来の出目は独立なので

```text
g(t) = Σ_{u=0}^t f(u)h(t−u)
```

となる。h(0)=1だから通常母関数ではF=G/H。直接の除去DPはO(T²)だが、HのFPS逆元と積をT次まで求めればO(T log(T+2))となる。残る課題はG,Hの全係数を同じ時間で作ること。

初期位置X,Y,Zについて、一人がXからt歩でwへ着く確率は2^(−t)C(t,(t+w−X)/2)。二項係数の分子はt!、二つの分母は(t+w−X)/2と(t−w+X)/2の階乗である。q(i)=Π_{P∈{X,Y,Z}}invFact((i−P)/2)、r(i)=Π_{P∈{X,Y,Z}}invFact((i+P)/2)と置く。負または非整数の引数に対するinvFactは0とする。三人の積をwで足すと

```text
p(t) = (t!)³ 2^(−3t) Σ_w q(t+w)r(t−w)
     = (t!)³ 2^(−3t) (q*r)[2t]
```

を得る。qの引数u=t+wとrの引数v=t−wの和が2tという点から畳み込みを発見できる。

負添字のoffsetを曖昧にせず、有効範囲と偶奇を使って配列を作る。L=min(X,Y,Z)、U=max(X,Y,Z)、δ=(U−L)/2は整数。q(u)≠0にはu≥U、r(v)≠0にはv≥−Lが必要で、t≤Tではu+v≤2T。従ってu≤2T+L、v≤2T−U。δ>Tなら全時刻で会合不能なのでpを全0にする。

δ≤Tなら、有効添字はu=U+2a、v=−L+2b、0≤a,b≤T−δに限る。次の非負添字配列を作る。

```text
Q[a] = Π_{P∈{X,Y,Z}} invFact(a+(U−P)/2)
R[b] = Π_{P∈{X,Y,Z}} invFact(b+(P−L)/2)
C = convolution(Q,R)
p(t) = 0                                  (t<δ)
p(t) = (t!)³ 2^(−3t) C[t−δ]              (δ≤t≤T)
```

u+v=U−L+2(a+b)=2tより、読む添字がt−δになる。どの階乗引数もT以下なので前計算は0..Tでよい。A,B,Cに対してこの処理をしてG、0,0,0に対してHを得る。H[0]=1からinverse(H)をT次まで作り、Gとの積のT次を回答する。A=B=CならG=HなのでF=1であり、T=0は1、T>0は0になる。

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

各会合経路は初回時刻uを一意に持ち、以後は独立な同位置開始の過程に移るためg=f*h。h(0)=1よりF=G/Hが唯一の初回分布を与える。

固定時刻t・会合位置wの三二項確率を展開すると、分母はq(t+w)r(t−w)へ分かれる。u=t+w,v=t−wの和は2tで、非零条件u≥U,v≥−Lと共通parityからu=U+2a,v=−L+2bとなる。従ってa+b=t−δ、取り出す係数はC[t−δ]である。t≤Tに必要な全a,bを0..T−δへ置くので、到達可能な会合位置を漏らさず一度ずつ足す。δ>Tなら到達区間に共通点がなく、全会合確率は0。以上により圧縮配列で作ったG,Hも正確であり、FPS除算後のT次係数が求める確率となる。

## 実装上の注意

- 同parityという入力保証からδ,(U−P)/2,(P−L)/2が全て整数になる。δ>Tでは長さT−δ+1の配列を作らず、Gを全0とする。
- Q,Rはa,bの非負添字で保持し、読む係数はt−δ。元の2tという添字を圧縮後へそのまま使わない。
- invFactは0..T、二乗法による逆元は法998244353で行う。H[0]=1、T=0、初期会合、会合可能になる最初の時刻δを確認する。

## 復習の核

- A=B=CならG=HからF=1となりT>0の係数が0になることを確認し、一般例ではq*rのindex・parityとrenewal式のu=t項h(0)=1を照合する。

## 計算量と制約

### 時間

O((T+1) log(T+2))。G,H用に長さ高々T+1の二回の畳み込みを行い、FPS逆元と最終積もT次まで。初期位置の絶対値に比例する配列は不要。

### 空間

O(T+1)。偶奇と平行移動を除いた係数列、階乗・逆階乗表、FPSの作業配列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0 \leq A, B, C, T \leq 10^5; A \equiv B \equiv C \pmod{2}; A, B, C, and T are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/editorial/5712) — source-abc289-editorial-5712-16adf05d46e205117be88e47766d3b0603ff75d7e4073d06a70446a1489b3286
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/tasks/abc289_h) — source-abc289-ex-problem-0fef6cd4b8486f8ea098b05b0f58627f3ee02107d66c45dcfca9955eb8cdf0b0
