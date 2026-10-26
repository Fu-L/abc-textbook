---
title: "固定線形遷移を巨大回数進める"
description: "「固定線形遷移を巨大回数進める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 79
---

# 固定線形遷移を巨大回数進める

習得対象の目安: **青色（1600–1999）**。固定線形遷移を行列や漸化式へ写し、巨大回数の反復を二分累乗する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 線形遷移・行列累乗

一歩先の各状態が、今の状態の固定された線形和で決まるとき、その更新を行列で表せる。同じ更新を一歩ずつ繰り返す代わりに、2歩・4歩・8歩と進む行列を作り、必要な回数を組み合わせて巨大な時刻まで進める。

### 習得する技能

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 考え方

### 一歩の更新から行列を作る

まず、次の各成分が「更新前のどの成分を何倍して足したものか」を書く。状態数を $$d$$、時刻 $$t$$ の状態を列ベクトル $$v_t$$ とし、成分の添字は0始まりとする。行列の成分は `T[to][from]`、つまり遷移先を行、遷移元を列に置く。

$$
\begin{aligned}
v_{t+1}[i]&=\sum_{j=0}^{d-1}T[i][j]v_t[j],\\
v_{t+1}&=Tv_t
\end{aligned}
$$

右辺はすべて更新前の値で評価する。一つの配列を順に上書きすると新旧の値が混ざるので、次のベクトルを別に作ってから置き換える。この規約では、行列 $$A$$ の更新の後に $$B$$ の更新を行う合成は $$B(Av)=(BA)v$$ となる。行ベクトルを使う解説では、行列を転置し、掛ける向きも読み替える。

たとえば [ABC293 E](https://atcoder.jp/contests/abc293/tasks/abc293_e) の等比和を、小さい例として公比3で考える。最初の $$t$$ 項の和を $$a_t$$ とすると、

$$
\begin{aligned}
a_t&=\sum_{i=0}^{t-1}3^i,\quad a_0=0,\\
a_{t+1}&=3a_t+1
\end{aligned}
$$

となる。定数項の $$+1$$ も線形和へ含めるため、常に1の成分を追加する。更新後の第一成分は $$3a+1\cdot1$$、第二成分は $$0\cdot a+1\cdot1=1$$ なので、

$$
v_t=\begin{pmatrix}a_t\\1\end{pmatrix},\qquad
T=\begin{pmatrix}3&1\\0&1\end{pmatrix}
$$

と書ける。$$v_{t+1}=Tv_t$$ に従って初期状態から一歩ずつ進むと、

$$
\begin{aligned}
\begin{pmatrix}0\\1\end{pmatrix}
&\longrightarrow\begin{pmatrix}1\\1\end{pmatrix}
\longrightarrow\begin{pmatrix}4\\1\end{pmatrix}\\
&\longrightarrow\begin{pmatrix}13\\1\end{pmatrix}
\longrightarrow\begin{pmatrix}40\\1\end{pmatrix}
\end{aligned}
$$

となり、一歩後は1、二歩後は4、四歩後は40である。[個別公式解説](https://atcoder.jp/contests/abc293/editorial/5955) と同じ構成で、公比を入力値 $$A$$ に戻せば左上の3を $$A$$ に変えるだけでよい。法 $$M$$ での余りを求める場合は各加算・乗算のたびに剰余を取る。除算を使わないので、$$M$$ が合成数でも、$$A-1$$ の逆元が存在しなくても使える。

### 二乗で歩幅を倍にし、回数のbitを選ぶ

二歩分は $$T^2=TT$$、四歩分は $$T^4=T^2T^2$$ として、一つ前の行列を二乗して作れる。先ほどの例では、

$$
T^2=\begin{pmatrix}9&4\\0&1\end{pmatrix},\qquad
T^4=\begin{pmatrix}81&40\\0&1\end{pmatrix}
$$

であり、どちらも初期ベクトルへ一度掛けるだけで、それぞれ二歩後・四歩後の状態を返す。

求める回数を非負整数 $$K$$ とする。たとえば $$K=13=1+4+8$$ なら、二進表記は $$1101_2$$ である。1・2・4・8歩分の行列を作り、bitが立っている1・4・8歩分だけを状態へ適用する。

$$
v_0\ \xrightarrow{T}\ v_1
\ \xrightarrow{T^4}\ v_5
\ \xrightarrow{T^8}\ v_{13}
$$

一般の手順も同じである。

1. 現在の状態を $$w=v_0$$、現在の歩幅の行列を $$P=T$$ とする。
2. $$K$$ のbitを下位から調べる。今のbitが1なら、まず $$w\leftarrow Pw$$ としてその歩幅を進める。0なら状態は変えない。
3. 次のbitがあれば、$$P\leftarrow PP$$ と二乗して歩幅を倍にし、次のbitへ進む。すべてのbitを処理したら $$w$$ が答えの状態である。

最下位を0番目として、$$j$$ 番目のbitを処理する直前には、$$P=T^{2^j}$$ であり、$$w$$ はそれまでに選んだ歩幅の合計だけ進めた状態になっている。bitが1ならその歩幅を足し、二乗すれば次の歩幅になるため、最後にはちょうど $$K$$ 歩進む。各行列が同じ $$T$$ の冪なので、この合成で $$T^K v_0$$ を得られる。等比和の例なら、この最終ベクトルの第一成分を取り出す。

$$K=0$$ なら一度も更新せず $$v_0$$ を返す。行列としては $$T^0=I$$、すなわち対角成分が1、他が0の単位行列の作用である。$$K=1$$ では一歩の更新だけを行う。

### 過去の値を状態にする線形漸化式

次数 $$d\geq1$$ の線形漸化式

$$
a_n=\sum_{j=1}^{d}c_j a_{n-j}\qquad(n\geq d)
$$

でも、次の値に必要な直近の $$d$$ 個を状態として残せばよい。係数 $$c_1,\ldots,c_d$$ は時刻によらず固定されているとする。

$$
v_n=(a_n,a_{n-1},\ldots,a_{n-d+1})^{\mathsf T}
$$

ここで右肩の $$\mathsf T$$ は転置を表し、括弧内を列に並べる。新しい第一成分は係数付きの和、残りは以前の値を一つずつ後ろへ移したものなので、遷移行列の第一行は $$(c_1,\ldots,c_d)$$、第二行以降は一つ左下の成分だけが1となる。この形の行列をcompanion行列という。$$d=2$$ なら具体的に、

$$
\begin{pmatrix}a_{n+1}\\a_n\end{pmatrix}
=\begin{pmatrix}c_1&c_2\\1&0\end{pmatrix}
\begin{pmatrix}a_n\\a_{n-1}\end{pmatrix}
$$

である。初期値 $$a_0,\ldots,a_{d-1}$$ が与えられたとき、初期ベクトルは $$v_{d-1}$$。$$K\geq d-1$$ なら $$T^{K-(d-1)}v_{d-1}$$ の第一成分が $$a_K$$ であり、それより小さい $$K$$ は与えられた初期値から直接返す。

### 特性多項式の剰余で一つの項を求める

漸化式の係数が分かっていて一つの項 $$a_K$$ が欲しいときは、状態を行列で進めるほかに、多項式で計算を圧縮する方法がある。次の多項式をこの漸化式の特性多項式とする。

$$
h(X)=X^d-c_1X^{d-1}-\cdots-c_d
$$

$$X^K$$ を $$h(X)$$ で割った剰余を

$$
r(X)=X^K\bmod h(X)=\sum_{i=0}^{d-1}r_iX^i
$$

とおくと、答えは初期値の線形和になる。

$$
a_K=\sum_{i=0}^{d-1}r_i a_i
$$

この理由を確認する。任意の非負整数 $$s$$ について、$$X^s h(X)$$ の各 $$X^i$$ を $$a_i$$ に置き換えて係数付きで足すと、

$$
a_{s+d}-\sum_{j=1}^{d}c_j a_{s+d-j}=0
$$

となる。したがって、これらの線形結合である $$h(X)$$ の任意の多項式倍も、同じ置き換えで0になる。$$X^K-r(X)$$ は $$h(X)$$ の倍数なので、$$a_K-\sum_i r_i a_i=0$$ が得られる。

剰余は、行列の代わりに多項式を二分累乗して求める。答え用の多項式を1、現在の冪を $$X\bmod h(X)$$ から始め、各bitでの乗算・二乗のたびに $$h(X)$$ の剰余へ戻す。次数が $$d$$ 未満の多項式同士を掛けた後、次数 $$m\geq d$$ の項を高い方から

$$
X^m\equiv\sum_{j=1}^{d}c_jX^{m-j}\pmod{h(X)}
$$

で消していけばよい。積と剰余への整理はそれぞれ素朴な実装で $$O(d^2)$$、最後の初期値との積和は $$O(d)$$ で済む。これにより、既知の係数・初期値から $$K\geq1$$ の項を $$O(d^2\log(K+1))$$ 時間、逐次二乗なら $$O(d)$$ 空間で求められる。$$K=0$$ は初期値をそのまま返す。$$h$$ の最高次係数が1なので、この整理にも除算や逆元は不要である。

この高速化は、漸化式を使って保持する量を多項式の係数へ変えた結果である。一般の密行列のまま、掛ける相手をベクトルに変えるだけで同じ全体計算量になるわけではない。

## 成立条件と計算量

まず、状態を固定すれば同じ線形更新が毎回使えることを確認する。係数が時刻や状態値で変わる場合、一つの固定行列をそのまま累乗することはできない。周期をまとめる、必要な情報を状態へ加えるなどの再定式化が必要になる。

[ABC258 Ex](https://atcoder.jp/contests/abc258/tasks/abc258_h) のように、通常の遷移が続く巨大な区間の間に少数の禁止位置がある場合は、同じ遷移が続く区間だけを累乗で飛ばす。例外位置では別の更新を行い、次の固定区間へ進む。異なる行列を含むので、列ベクトルなら後の更新を左へ掛ける順序も守る。

一般の $$d\times d$$ 密行列を素朴に扱う場合、費用は次のように分かれる。各加算・乗算を定数時間と数える。

| 処理 | 時間 |
| --- | --- |
| 遷移係数を列挙し、密行列へ格納する | 問題固有の係数計算に加え、格納領域の初期化に $$O(d^2)$$ |
| $$T,T^2,T^4,\ldots$$ を二乗で用意する | 一回 $$O(d^3)$$、全体で $$O(d^3\log(K+1))$$ |
| bitが1の冪行列を一つの状態ベクトルへ掛ける | 一回 $$O(d^2)$$、全体で $$O(d^2\log(K+1))$$ |

$$K\geq1$$ では、行列を用意する費用も含めると、問題固有の係数計算に加えて全体で $$O(d^3\log(K+1))$$ 時間となる。**$$O(d^2\log(K+1))$$ は、必要な冪行列がすでにある場合に、一つの初期ベクトルを進める費用だけ**である。元の行列が疎でも、二乗した行列まで疎とは限らない。

すべての冪行列を保存すれば、$$K\geq1$$ で $$O(d^2\log(K+1))$$ 空間を使い、同じ遷移を使う別の初期ベクトルにも再利用できる。一つのベクトルだけを進めるなら、その場で二乗しながら適用して古い行列を捨てればよい。現在の行列・積の作業領域・状態ベクトルだけなので、追加空間は $$O(d^2)$$ で済む。$$K=0$$ なら行列の構築や二乗は不要で、初期ベクトルを返すだけである。

既知の線形漸化式に対する特性多項式剰余法は、上で導いた別の選択肢である。漸化式の係数を求める処理が別途必要なら、その前処理も加える。問題に応じて「何を一歩とするか」「何回進むか」「最終状態のどの成分・成分和が答えか」を決めてから、状態数と前処理を含めた費用を見積もる。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/)。

一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。

### このUnitでは扱わないもの

- 一般のDP遷移の区間集約・単調最適化。

## 問題一覧

- [ABC293 E「Geometric Progression」](https://atcoder.jp/contests/abc293/tasks/abc293_e) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC256 G「Black and White Stones」](https://atcoder.jp/contests/abc256/tasks/abc256_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC258 Ex「Odd Steps」](https://atcoder.jp/contests/abc258/tasks/abc258_h) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC245 Ex「Product Modulo 2」](https://atcoder.jp/contests/abc245/tasks/abc245_h) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC300 Ex「Fibonacci: Revisited」](https://atcoder.jp/contests/abc300/tasks/abc300_h) — 主題: [Bostan–Mori・有理生成関数の係数抽出](/learn/combinatorics-algebra/bostan-mori/)（P(x)/Q(x)のN次係数をQ(-x)との積の偶奇係数へ半減し、対数段で巨大indexへ進む。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

## 根拠

- [ABC245 H 公式解説](https://atcoder.jp/contests/abc245/editorial/3636)
- [ABC245 H 公式問題文](https://atcoder.jp/contests/abc245/tasks/abc245_h)
- [ABC256 G 公式解説](https://atcoder.jp/contests/abc256/editorial/4130)
- [ABC256 G 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_g)
- [ABC258 H 公式解説](https://atcoder.jp/contests/abc258/editorial/4214)
- [ABC258 H 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_h)
- [ABC293 E 公式解説](https://atcoder.jp/contests/abc293/editorial/5955)
- [ABC293 E 公式問題文](https://atcoder.jp/contests/abc293/tasks/abc293_e)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-linear-recurrence`
