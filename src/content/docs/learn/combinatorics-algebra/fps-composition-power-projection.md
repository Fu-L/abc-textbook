---
title: "FPS合成・power projection"
description: "「FPS合成・power projection」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 214
---

# FPS合成・power projection

習得対象の目安: **赤色（2800以上）**。FPS合成と転置の対応を理解し、block分割や有理関数への還元を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### FPS合成・power projection

FPSの合成は、内側の級数を固定すると外側の係数についての線形変換になる。その転置であるpower projectionを有理関数の係数抽出として高速に解き、計算手順を転置して合成へ戻す。

### 習得する技能

- 多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

合成をそのまま展開すると、内側の級数の冪を何本も扱うことになる。ここでは「各冪を係数付きで足して合成を作る」と「出力の次数に付けた重みを冪ごとに集める」を同じ行列の二つの作用として捉える。後者を先に高速化できれば、転置によって前者の合成も高速化できる。

精度を $$\bmod x^{N+1}$$、つまり $$0,\ldots,N$$ 次までとし、内側の級数 $$g$$ は $$g(0)=0$$ を満たすものに固定する。外側の級数を $$f(x)=\sum_{k=0}^N f_kx^k$$ とすると、

$$
f(g(x))=\sum_{k=0}^N f_k g(x)^k\pmod{x^{N+1}}
$$

である。$$g$$ が固定されているので、これは入力 $$f_k$$ の線形結合である。行を出力の次数 $$j$$、列を冪の指数 $$k$$ として、

$$
A_{j,k}=[x^j]g(x)^k\qquad(0\leq j,k\leq N)
$$

と置く。以下、配列は低次数から並べ、行列を掛けるときは列ベクトルとして読む。

### 同じ行列で合成と重みの集約を見る

$$N=3$$、$$g=x+x^2$$ とする。精度 $$\bmod x^4$$ で各列を作ると、

$$
\begin{aligned}
g^0&=1, & g^1&=x+x^2,\\
g^2&=x^2+2x^3, & g^3&=x^3
\end{aligned}
$$

なので、対応する行列は

$$
A=\begin{pmatrix}
1&0&0&0\\
0&1&0&0\\
0&1&1&0\\
0&0&2&1
\end{pmatrix}
$$

となる。例えば $$f=(1,2,3,4)$$、すなわち $$f(x)=1+2x+3x^2+4x^3$$ を入力すると、

$$
Af=(1,2,5,10)
$$

を得る。これは $$f(g)=1+2g+3g^2+4g^3$$ の係数列である。例えば $$x^3$$ の係数は、行列の $$j=3$$ の行と $$f$$ の積 $$2\cdot3+1\cdot4=10$$ で求まる。

今度は、出力の各次数に付ける重みを $$w=(5,6,7,8)$$ とする。同じ行列の**列ごと**に重み付き和を取ると、

$$
q_k=\sum_{j=0}^N w_j[x^j]g(x)^k
$$

となる。これが $$q=A^T w$$、すなわちpower projectionである。上の4列に $$w$$ を掛けると、

$$
\begin{aligned}
q_0&=5, & q_1&=6+7=13,\\
q_2&=7+2\cdot8=23, & q_3&=8
\end{aligned}
$$

より $$A^T w=(5,13,23,8)$$ を得る。合成では $$f$$ が入力、power projectionでは $$w$$ が入力であり、どちらでも $$g$$ は固定する。

転置の意味は、内積（同じ位置の積の総和）でも確認できる。

$$
\begin{aligned}
(Af)\cdot w&=1\cdot5+2\cdot6+5\cdot7+10\cdot8=132,\\
f\cdot(A^T w)&=1\cdot5+2\cdot13+3\cdot23+4\cdot8=132
\end{aligned}
$$

一般にも両辺は $$\sum_{j,k}w_j A_{j,k}f_k$$ である。「出力へ掛けた重みを、各入力が寄与した倍率に沿って集め直す」のが転置だと読める。

転置と合成逆関数は目的が異なる。合成逆関数は $$s(0)=0$$、$$g(s(x))=x$$ を満たす級数 $$s$$ で、$$g$$ の一次係数が可逆なときに存在する。この例では $$s=x-x^2+2x^3\pmod{x^4}$$ となり、これを使えば合成済みの $$f(g)$$ から $$f$$ を復元できる。一方、$$A^T w$$ は重みの集約であり、合成の入力を復元してはいない。転置自体には $$g$$ の一次係数の可逆性も要らない。

### 有理関数の係数抽出へ移す

重み付き和を多項式積の一つの係数へ移すには、**重みの並びを反転する**。$$g$$ の冪の $$x^j$$ 係数と掛けたい $$w_j$$ を $$x^{N-j}$$ に置けば、積で次数が $$N$$ にそろう。

$$
h(x)=\sum_{j=0}^N w_jx^{N-j},\qquad q_k=[x^N](h(x)g(x)^k)
$$

先ほどの $$w=(5,6,7,8)$$ なら、$$h$$ の係数列は $$(8,7,6,5)$$、つまり $$h=8+7x+6x^2+5x^3$$ である。同じ例で $$x^3$$ の係数を拾うと、

$$
\begin{aligned}
[x^3]h&=5,\\
[x^3]hg&=6\cdot1+7\cdot1=13,\\
[x^3]hg^2&=7\cdot1+8\cdot2=23,\\
[x^3]hg^3&=8\cdot1=8
\end{aligned}
$$

となり、$$A^T w$$ と一致する。この反転は、重み付き和を係数抽出に書き直すための並べ替えである。行列の行と列を入れ替える転置とは区別する。

次に、冪の指数 $$k$$ を記録する変数 $$y$$ を導入する。幾何級数としてまとめると、求める列は

$$
\sum_{k\geq0}q_ky^k=[x^N]\frac{h(x)}{1-yg(x)}
$$

となる。$$g(0)=0$$ なら $$g^k$$ の最小次数は $$k$$ 以上なので、$$k>N$$ の係数は0である。これで多数の冪を別々に計算する要求を、一つの有理関数の係数抽出へ移せた。小行列はこの対応を確認するためのものであり、高速算法では行列や全ての冪を明示的に作らない。

[Bostan–Mori](/learn/combinatorics-algebra/bostan-mori/)の係数抽出を、係数環が $$y$$ の多項式である場合へ拡張する。初期値 $$P(x,y)=h(x)$$、$$Q(x,y)=1-yg(x)$$、$$n=N$$ から、$$n>0$$ の間、次を繰り返す。

1. $$R(x,y)=Q(-x,y)$$ を作り、$$U=PR$$、$$V=QR$$ を計算する。$$V$$ は $$x$$ の偶数次数だけを持つ。
2. $$n$$ の偶奇を $$\varepsilon=n\bmod2$$ とし、分子からその偶奇の係数、分母から偶数次数の係数を取り出す。

   $$
   \begin{aligned}
   P_{\mathrm{new}}(x,y)&=\sum_{i\geq0}([x^{2i+\varepsilon}]U)x^i,\\
   Q_{\mathrm{new}}(x,y)&=\sum_{i\geq0}([x^{2i}]V)x^i
   \end{aligned}
   $$

3. $$n\leftarrow\lfloor n/2\rfloor$$ として、更新した $$P,Q$$ の $$x$$ 次数を $$n$$ 以下へ切り詰める。$$y$$ 次数も $$N$$ 以下へ切り詰めてよい。

$$P/Q=PR/(QR)$$ で分母が $$x$$ について偶数になるため、欲しい係数の偶奇だけを残して $$x$$ 添字を半分にできる。各段で求める値 $$[x^n](P/Q)$$ が保たれる。$$n=0$$ になったら $$P(0,y)/Q(0,y)\bmod y^{N+1}$$ を返す。これが全ての $$q_k$$ を格納する列である。

### 転置して合成を得る

上の算法で $$Q,R$$ は $$g$$ だけから決まる。入力 $$h$$ に依存する $$P$$ の処理は、固定した $$R$$ との積、係数の抽出・切詰め、最後の固定級数 $$Q(0,y)^{-1}$$ による乗算という線形操作である。入力の反転 $$w\mapsto h$$ も含めた手順が $$A^T$$ を表すので、**実行順を逆にし、各操作を転置する**と $$(A^T)^T=A$$、すなわち合成が得られる。

まず固定列 $$r=(2,3)$$ との積を、小配列で見る。入力 $$v=(v_0,v_1)$$ の積の係数列は

$$
u=(2v_0,\ 3v_0+2v_1,\ 3v_1)
$$

である。出力に重み $$z=(5,6,7)$$ を掛けると、$$v_0$$ に戻る重みは $$2\cdot5+3\cdot6=28$$、$$v_1$$ に戻る重みは $$2\cdot6+3\cdot7=33$$ となる。この転置は、次の相互相関である。配列の範囲外の値は0とする。

$$
u_k=\sum_i v_i r_{k-i}
\quad\longrightarrow\quad
(\text{転置後の出力})_i=\sum_k z_k r_{k-i}
$$

相互相関も、固定列を反転して畳み込めば計算できる。上の例では反転列 $$(3,2)$$ と $$z$$ の畳み込みが $$(15,28,33,14)$$ になり、その添字1,2を取ればよい。一般に $$r$$ の長さを $$L$$ とすると、反転列との積の添字 $$i+L-1$$ が転置後の第 $$i$$ 成分になる。二変数の固定多項式との積も、両方向の添字について同じように転置する。

次に、偶奇抽出 $$u_i=v_{2i+\varepsilon}$$ を考える。奇数側を取る例では、配列と重みは次のように対応する。

$$
\begin{aligned}
(v_0,v_1,v_2,v_3)&\longmapsto(v_1,v_3),\\
(z_0,z_1)&\longmapsto(0,z_0,0,z_1)\quad(\text{転置})
\end{aligned}
$$

抽出先の重みを、抽出元の位置 $$2i+\varepsilon$$ へ戻す「散布」である。偶数側なら $$(z_0,0,z_1,0)$$ に散布する。どちらも元の長さの配列を0で初期化する。捨てた係数を復元する逆演算ではなく、使った位置だけに重みを戻している。切詰めの転置も同じ理由で、切詰め前の長さへの0埋めとなる。

一般の基本更新 $$u\leftarrow u+\alpha v$$ を転置すると、対応する重みの更新は $$v\leftarrow v+\alpha u$$ になる。倍率 $$\alpha$$ はそのままであり、逆元を取って割る操作にはならない。

合成を実装するときは、まず $$g$$ から各段の $$R$$、次数、抽出する偶奇と配列の形を保存する。合成の入力 $$f$$ を最後の $$y$$ 方向の乗算の転置へ渡し、切詰めの転置、散布、固定 $$R$$ との積の転置を、段の逆順に行う。最後に得た $$h$$ の各係数への重みを反転すると、合成の係数列 $$Af$$ になる。これは入力の反転 $$w\mapsto h$$ の転置も反転だからである。$$g$$ 自身は固定係数なので、その分母更新へ入力の重みを流してはいけない。

## 成立条件と計算量

段 $$t$$ では $$x$$ 次数が $$O(N/2^t)$$、$$y$$ 次数が $$O(2^t)$$。保持する長方形配列の面積は $$O(N)$$ で、積の一時配列も定数倍の面積になる。二変数積は、単項式 $$x^iy^j$$ を一次元の添字 $$iS+j$$ へ埋め込むなどして計算できる。ここでstride（$$x$$ 添字が1増えるときの間隔）$$S$$ は、**積の** $$y$$ 次数より大きく取る。これにより $$y$$ 添字の和が隣の $$x$$ の領域へ入り込むことを防ぐ。さらにNTT長を、埋め込み後の積が折り返さない長さまで確保する。

各段の積は長さ $$O(N)$$ の畳み込みなので $$O(N\log N)$$ 時間。段数は $$O(\log N)$$、最後の $$y$$ 方向の級数除算も $$O(N\log N)$$ なので、power projectionも転置した合成も全体で $$O(N\log^2 N)$$ 時間となる。各段を保存する素直な合成実装の空間は $$O(N\log N)$$ である。$$N=0$$ なら縮約を行わず、定数項だけを返す。

$$g(0)\ne0$$ では、外側の一般の無限FPSの高次項も合成結果の低次へ寄与するため、有限精度の入力だけでは結果が定まらない。$$f$$ が有限多項式なら別途[Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/)で定数項を処理する。高速積に使う法が必要なNTT長に対応すること、最終除算の分母の定数項が可逆であることも確認する。この還元と転置の対応は[ABC387 G公式解説](https://atcoder.jp/contests/abc387/editorial/11727)を参照できる。上の小行列・小配列と合成逆関数の例は、本書で対応を確かめるために補った例である。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)。

このUnitを直接前提とする単元: なし。

形式的べき級数の基本演算で得た考え方と実装を再利用し、FPS合成・power projectionの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- FPS合成・power projectionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC387 G「Prime Circuit」](https://atcoder.jp/contests/abc387/tasks/abc387_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC387 G 公式解説](https://atcoder.jp/contests/abc387/editorial/11727)
- [ABC387 G 公式問題文](https://atcoder.jp/contests/abc387/tasks/abc387_g)
- [ABC439 G 公式解説](https://atcoder.jp/contests/abc439/editorial/14995)
- [ABC439 G 公式問題文](https://atcoder.jp/contests/abc439/tasks/abc439_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-fps-composition-power-projection`
