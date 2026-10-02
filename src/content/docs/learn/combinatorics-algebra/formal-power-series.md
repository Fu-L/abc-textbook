---
title: "FPS基本演算と多項式の多点評価を行う"
description: "「FPS基本演算と多項式の多点評価を行う」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 206
---

# FPS基本演算と多項式の多点評価を行う

習得対象の目安: **橙色（2400–2799）**。定数項と打切り次数の条件を押さえ、Newton反復で逆数・log・expを構成する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 形式的べき級数の基本演算

定数項条件と次数打切りを確認し、Newton iterationでinverse・log・exp等を畳み込みへ還元する。

### 習得する技能

- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

## 考え方

FPSでは収束を考えず、mod x^N、つまり0,…,N−1次の係数だけを求める。積の低次係数は入力の低次係数だけで決まるので、各段で必要精度に打ち切ってよい。以下では係数を体上で扱い、積分で割る1,…,N−1が可逆であるとする。

### 逆元: 誤差を二乗して精度を倍にする

Aの定数項A_0≠0なら、AB=1を満たす逆元は係数ごとに一意に決まる。B_0=A_0^(-1)、n≥1ではB_n=−A_0^(-1)Σ_{i=1}^n A_i B_{n-i}となるが、直接計算はO(N²)。

AB≡1 mod x^mまで求まったBを、B_new=B(2−AB) mod x^(2m)で更新する。E=1−ABはx^mの倍数なので、1−AB_new=(1−AB)²=E²≡0 mod x^(2m)。これが倍増の不変量である。B=A_0^(-1)、m=1から始め、Aを2m項まで読み、二回の畳み込みと加減算でB_newを求める。最後の精度はmin(2m,N)でよい。

### 対数: 微分・逆元・積分へ分解する

A_0=1のときlog Aを、定数項0かつ(log A)'=A'/Aを満たす級数として定義する。A'=Σ_{i≥1}iA_i x^(i−1)、積分は∫C=Σ_{i≥0}C_i x^(i+1)/(i+1)とし、積分定数は0とする。

log A mod x^Nを求める手順は、A'をN−1項まで作り、逆元A^(-1)との積をmod x^(N−1)で計算し、積分してN項へ戻すことである。微分で精度が一つ下がるので、積をN−1項まで求めれば足りる。A_0≠1では体上のlog A_0を別に定義する必要があり、この基本演算では扱わない。

### 指数: 対数の誤差を掛けて補正する

F_0=0のときexp Fは、B_0=1かつB'=F'Bを満たす級数である。係数ではnB_n=Σ_{i=1}^n iF_i B_{n-i}となり、上の可逆性条件の下で一意に定まる。これはlog B=Fを解くことと同じなので、B=1、m=1から始める。

log B≡F mod x^mを保ち、H=F−log B mod x^(2m)、B_new=B(1+H) mod x^(2m)で更新する。Hはx^mの倍数なので、log(1+H)≡H mod x^(2m)。従ってlog B_new≡log B+H≡F mod x^(2m)となる。これは方程式log B−F=0のNewton補正で、微分が1/Bとなるため補正にBを掛ける。

各段では既知のBを高次0で延長して、その延長のlogを目標精度まで求めてから補正する。未知係数を既知の正解として扱うのではなく、誤差がx^mから始まることを利用する。例えばF=xなら、最初の更新はB=1+x、次はB=1+x+x²/2+x³/6 mod x^4となる。

## 成立条件と計算量

目標精度Nで積分・expを扱うには、標数0の体、または素数標数pでN≤pとすれば1,…,N−1を割れる。逆元だけなら必要なのはA_0の可逆性で、積分の標数条件は不要。畳み込みをNTTで行う場合は、この標数条件に加えて法と変換長の条件も満たす必要がある。

乗算費用をM(n)とする。逆元とexpの倍増各段は定数回の乗算と、expではその段のlog・逆元計算を含めてO(M(m))である。M(n)=O(n log n)なら、M(1)+M(2)+…+M(2^k)=O(2^k k)=O(M(N))となる。logも一回の逆元と乗算でO(M(N))。この和の評価により、倍増の段数だけ機械的にlog Nを掛ける必要はない。単純な畳み込みを使えば同じ式でもO(N²)となる。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)、[NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)。

このUnitを直接前提とする単元: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)、[多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)。

生成関数の係数解釈と高速畳み込みを再利用し、Newton法による逆数・log・expを次数制限付きで実装し、多点評価と補間へ進む。有理母関数の係数抽出と一般FPS合成は独立した節で学ぶ。

### このUnitでは扱わないもの

- 積を一回求めるだけの畳み込み、および生成関数へ符号化するだけで高度な多項式演算を使わない計数。

## 下位単元

- [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/) — 橙色

## 問題一覧

- [ABC289 Ex「Trio」](https://atcoder.jp/contests/abc289/tasks/abc289_h) — 主題: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC297 Ex「Diff Adjacent」](https://atcoder.jp/contests/abc297/tasks/abc297_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。）。 畳み込みと等比点評価を前提に、拡大体で数列の一般項を指数の式へ変換する方法を学ぶ。周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。
- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC449 G「Many Repunit Sum 2」](https://atcoder.jp/contests/abc449/tasks/abc449_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。

## 根拠

- [ABC260 H 公式解説](https://atcoder.jp/contests/abc260/editorial/4434)
- [ABC260 H 公式問題文](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC272 H 公式解説](https://atcoder.jp/contests/abc272/editorial/4963)
- [ABC272 H 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC289 H 公式解説](https://atcoder.jp/contests/abc289/editorial/5712)
- [ABC289 H 公式問題文](https://atcoder.jp/contests/abc289/tasks/abc289_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-formal-power-series`
