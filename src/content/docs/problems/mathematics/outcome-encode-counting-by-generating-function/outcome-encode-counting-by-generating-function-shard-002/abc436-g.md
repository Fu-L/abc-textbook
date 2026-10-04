---
title: "ABC436-G — Linear Inequation"
draft: true
authoringUnit: {"problemId":"abc436-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc436-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-transition-optimization"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc436-editorial-14748-d9d1d8c863414f6d5468cf6b316754d131fd18addc8995826a59796ad00276b3","source-abc436-g-problem-b283eaa6b2ba6c8af928d4ea6f1f3ad1b43b6d4dd7ca5183d4e02adfeec2f278"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"X=2Q+Rのbit分解は一意であり、最下位bitの和sをS_s通りで分類するとf(t)=Σ_s S_s f(⌊(t−s)/2⌋)。同じ上限qへの係数を集めたc'_qはこの恒等式の線形結合なので値を保つ。逆順Sとの畳み込みと二係数の取出しは、そのc'_qを正確に計算する。負の上限のfは0なので負添字を捨ててよく、帯の外も全て0である。最大添字が半分以下へ縮み、最後の上限0では全X_i=0だけが合法なのでc_0が答えになる。","sourceRevisionIds":["source-abc436-editorial-14748-d9d1d8c863414f6d5468cf6b316754d131fd18addc8995826a59796ad00276b3","source-abc436-g-problem-b283eaa6b2ba6c8af928d4ea6f1f3ad1b43b6d4dd7ca5183d4e02adfeec2f278"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

この解説で扱わないこと:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

f(t)をA·X≤tを満たす非負整数ベクトル数とする。各X_iの最下位bitを分けてX=2Q+R、R_i∈{0,1}とすると、f(t)=Σ_s S_s f(⌊(t−s)/2⌋)。ここでS_sはA·R=sの個数で、S(x)=Π_i(1+x^{A_i})の係数である。W=ΣA_i≤10^4なので、Sは0/1部分和DPを降順更新してO(NW)で構築できる。

この式を一つのtに再帰するだけでは分岐が増える。そこで求めたい値をΣ_t c_t f(t)という線形結合で保持する。初期はc_M=1だけ。代入して同じ新しい上限qをまとめると

c'_q=Σ_s S_s(c_{2q+s}+c_{2q+1+s})

になる。負上限のfは0なのでq<0を捨て、最大添字が0になるまで反復すれば、f(0)=1よりc_0が答えとなる。

Mの大きさの配列を作ってはいけない。非零係数が含まれる添字帯[l,h]と、その帯だけの配列を持つ。初期はl=h=Mで配列[1]。一回後の帯は[max(0,⌊(l−W)/2⌋),⌊h/2⌋]で、その外は0。幅がwなら新幅は高々⌈(w+W)/2⌉+1なので、配列長としての初期幅1から常にW+2以下になる。添字の大きさと配列の長さを分けることが核心である。

帯配列C_j=c_{l+j}とSの逆順列Srev_j=S_{W−j}を畳み込む。結果Zについてu_k=Σ_s S_s c_{k+s}=Z_{k+W−l}（配列外は0）だから、c'_q=Z_{2q+W−l}+Z_{2q+1+W−l}を新帯へ取り出す。毎回O(W)長のNTTだけで済む。hは半分以下へ縮むため反復は高々O(log M)回。h=0ならc_0を返す。

例えばA=(2),M=5ならS=1+x²、最初はc_2=c_1=1となる。次はc_1=1,c_0=2、最後はc_0=3で、X_1=0,1,2の三通りに一致する。

## 典型の発動条件

### 基数分解による再帰

発動条件: 非負整数変数の重み付き不等式で上限 M が非常に大きいとき。

各変数を quotient と digit に分け、上限を 1/d へ縮める再帰式を作る。

### 線形結合の係数遷移

発動条件: 同じ再帰関数 f の多数の引数評価を個別に展開すると重複が大きいとき。

Σc_i f(i) 全体を一度に次の係数列へ移し、最終的な基底値だけ読む。

### 多項式畳み込み

発動条件: 独立な digit の重み和分布や係数列との shift 和を高速に求めるとき。

各 R_i の生成多項式を積み、変換式の Σ_s を convolution で処理する。

## 問題固有の要素

巨大上限の格子点計数を、全変数の下位桁分布と上位桁の同型問題へ分解する。

別の問題へ持ち帰る視点: 再帰値の集合を直接 memoize せず、必要評価の係数分布を逆向きに伝播すると添字範囲を制御できる。

## 正当性

X=2Q+Rのbit分解は一意であり、最下位bitの和sをS_s通りで分類するとf(t)=Σ_s S_s f(⌊(t−s)/2⌋)。同じ上限qへの係数を集めたc'_qはこの恒等式の線形結合なので値を保つ。逆順Sとの畳み込みと二係数の取出しは、そのc'_qを正確に計算する。負の上限のfは0なので負添字を捨ててよく、帯の外も全て0である。最大添字が半分以下へ縮み、最後の上限0では全X_i=0だけが合法なのでc_0が答えになる。

## 実装上の注意

- 係数の添字のoffset l,hは64bit、配列長はO(W)。負の床除算と0への切取りを区別する。
- 畳み込みの取出し添字を帯offsetから計算する。範囲外の係数を0とし、個数は998244353で保持する。

## 復習の核

- c'_q の添字式を小さな d,N で愚直比較し、反復終了時に負添字寄与が f=0 として消えることを確認する。

## 計算量と制約

### 時間

O(NW+W log(W+1) log(M+1))、W=ΣA_i≤10^4。採用したd=2の桁分布は0/1部分和DPでO(NW)、帯の幅はW+2以下で、各縮約はO(W log(W+1))のNTT。M≤10^18でも縮約は高々60回。

### 空間

O(W+N)。桁分布と添字帯の係数・NTT作業配列だけを持ち、M長の配列を作らない。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le100; 1\le A _ i\le100\ (1\le i\le N); 1\le M\le10 ^ {18}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/editorial/14748) — source-abc436-editorial-14748-d9d1d8c863414f6d5468cf6b316754d131fd18addc8995826a59796ad00276b3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/tasks/abc436_g) — source-abc436-g-problem-b283eaa6b2ba6c8af928d4ea6f1f3ad1b43b6d4dd7ca5183d4e02adfeec2f278
