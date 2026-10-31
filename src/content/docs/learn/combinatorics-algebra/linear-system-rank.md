---
title: "線形方程式・rank"
description: "「線形方程式・rank」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 192
---

# 線形方程式・rank

習得対象の目安: **青色（1600–1999）**。体上の消去法を実装し、rankから可解性と自由度を判断する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 線形方程式・rank

制約を体上の連立一次方程式へ写し、ガウスの消去法（Gaussian
elimination）でrank・可解性・解空間の自由度を求める。独立な式を残すと、自由に選ぶ変数と、それに従って決まる変数が分かれる。

### 習得する技能

- 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 二つの式でピボットと自由変数を追う

[親単元](/learn/combinatorics-algebra/linear-algebra-xor/)の小例を使う。未知数 $$x_1,x_2,x_3$$
は0か1で、条件は

$$
\begin{aligned}
x_1\oplus x_2&=1,\\
x_2\oplus x_3&=0
\end{aligned}
$$

である。$$\oplus$$ はXORを表す。0と1を要素とする体 $$\mathbb F_2$$
では、加算も減算もXORであり、唯一の非零元1の逆元は1である。

各式の係数を一行に並べ、右辺も末尾に付けたものを拡大行列と呼ぶ。縦線の左に $$x_1,x_2,x_3$$
の係数、右に定数を書くと、

$$
\left[\begin{array}{ccccc}
1&1&0&\mid&1\\
0&1&1&\mid&0
\end{array}\right]
$$

となる。一行目の $$x_1$$
の係数1を、消去の基準になる**ピボット**に選ぶ。二行目はその列が既に0なので変える必要はない。次に二行目の
$$x_2$$ の係数1をピボットにし、一行目へ二行目を右辺ごとXORする。

$$
\left[\begin{array}{ccccc}
1&0&1&\mid&1\\
0&1&1&\mid&0
\end{array}\right]
$$

この操作は、一行目を $$x_1\oplus x_3=1$$
に置き換えたことに対応する。同じ二行目をもう一度XORすれば元へ戻るので、解集合を変えていない。

ピボット列は $$x_1,x_2$$ の二つで、係数行列のrankは2になる。$$x_3$$
を決める新しい行は残っていないので、$$x_3$$ が**自由変数**である。残った二行は

$$
x_1=1\oplus x_3,\qquad x_2=x_3
$$

と読める。$$x_3=t\in\mathbb F_2$$ と自由に選べば、他の二変数が一意に決まる。

### 特解とkernelから全解を表す

自由変数を0にすると、元の式の特解 $$(1,0,0)$$
が得られる。次に右辺を両方0へ置き換えた同次方程式を考える。右辺0のまま同じ行操作を行うと
$$x_1=x_3,\ x_2=x_3$$ となるため、その全解は $$(0,0,0)$$ と $$(1,1,1)$$ である。この集合が係数行列の
**kernel（核）** で、非零ベクトル $$(1,1,1)$$ 一つが基底になる。

特解へkernelのベクトルを足しても、左辺の値は変わらない。逆に、元の二つの解の差は同次方程式を満たす。したがって、元の全解はちょうど「特解＋kernel」であり、この例では成分ごとのXORで

$$
(x_1,x_2,x_3)=(1,0,0)\oplus t(1,1,1)
\qquad(t\in\{0,1\})
$$

と書ける。具体的には $$t=0$$ で $$(1,0,0)$$、$$t=1$$ で $$(0,1,1)$$ となり、解は $$2^{3-2}=2$$
通りである。自由度は1であって、三変数を別々に選べるわけではない。一般にも、特解から部分空間を平行移動した解集合を**アフィン空間**と呼ぶ。右辺が非零なら、全解そのものが原点を含む部分空間になるとは限らない。

### 条件を追加すると、自由度が残っていても矛盾する

ここへ $$x_1\oplus x_3=0$$ を追加する。係数だけを見ると、追加行 $$(1,0,1)$$
は元の二行のXORである。しかし、元の二式をXORした右辺は1なので、新しい右辺0とは一致しない。

消去後の一行目は $$[1,0,1\mid1]$$ だった。追加行 $$[1,0,1\mid0]$$ へこれをXORすると、次の行が残る。

$$
\left[\begin{array}{ccccc}
0&0&0&\mid&1
\end{array}\right]
$$

これは $$0=1$$
を要求する**矛盾行**で、解は一つもない。係数行列のrankは2のままで、同次方程式のkernelにも自由度1が残るが、元の方程式の解数を
$$2^{3-2}$$
と数えてはいけない。可解性を確認して初めて自由度から解数を求められる。追加条件の右辺も1なら零行
$$0=0$$ になり、元の二解を保つ。

### 一般の行列でも同じ操作で解を戻す

係数行列を $$r\times c$$ の $$A$$、右辺ベクトルを $$b$$、未知ベクトルを $$x$$ とし、$$Ax=b$$
を解く。ここでは行・列番号を0始まりとする。拡大行列 $$[A\mid b]$$ を作り、確定したピボット行数を
$$p=0$$ として、列 $$j=0,\ldots,c-1$$ を順に調べる。

1. 行 $$p$$ 以降に $$A_{i,j}\ne0$$ の行を探す。なければ、この列の変数は自由変数として次の列へ進む。
2. 見つかった行 $$i$$ と行 $$p$$ を交換する。行 $$p$$ 全体をピボットの逆元倍して、$$A_{p,j}=1$$
   にする。
3. 他の各行 $$k$$ から、$$A_{k,j}$$ 倍した行 $$p$$ を**右辺も含めて**引き、その列を0にする。
4. 行 $$p$$ に対応するピボット列 $$j$$ を記録し、$$p$$ を1増やす。

行の交換、非零倍、他の行の倍数の加減は全て可逆であり、解集合を保つ。各ピボット列は対応行だけが1となり、残りの未確定行では処理済みの列が全て0になる。従って得られた非零の係数行は独立で、最後の
$$p$$ が係数行列のrankである。

係数が全て0で右辺だけ非零の行があれば解なし。それ以外では、自由列の集合を $$F$$
とし、各自由変数を任意に選べる。消去後の行 $$i$$ に対応するピボット列を $$j$$ とすると、その変数は

$$
x_j=b_i-\sum_{f\in F}A_{i,f}x_f
$$

で一意に戻る。小例のように全ての他行から消してあれば、右辺に他のピボット変数は残らない。下側の行だけを消す実装では、後ろのピボット行から後退代入し、既に求めた変数の寄与も引く必要がある。

自由変数を全て0にすれば特解を得る。kernelの基底は、右辺を0とし、自由変数を一つだけ1、他を0にして戻したベクトルを、自由列ごとに一本ずつ作る。各ベクトルの自由列部分は異なる単位ベクトルなので独立であり、任意の同次解はその自由変数の値を係数とした組合せで表せる。したがってkernelの次元は
$$c-p$$。解が存在するとき、全解は特解＋kernelであり、要素数 $$q$$ の有限体 $$\mathbb F_q$$ 上なら
$$q^{c-p}$$ 通りとなる。

### 問題の構成へどうつなぐか

[ABC366 G「XOR Neighbors」](/problems/abc366-g/)では、頂点に書く整数の各ビットについて隣接XOR条件が同次方程式になる。kernelの基底を求め、その各ベクトルを異なる出力ビットへ割り当てる。基底のどれにも1が現れない頂点は、どの同次解でも0なので非零整数を置けない。ここでは
**kernelの一ベクトルの座標が頂点、複数の基底をまとめる方向が整数のビット**である。係数の演算は
$$\mathbb F_2$$ 上、最後の出力整数の組立てはビットの格納（bit packing）として区別する。

[ABC276 Ex「Construct a Matrix」](/problems/abc276-ex/)では、非零の積を2の個数の偶奇へ変え、二次元累積XORの四隅を未知数にする。この式には非零の右辺もあるので、矛盾を調べたうえで特解を一つ得ればよい。0を要求する積の条件は別に扱い、求めた特解からマスの値を復元する。小例の特解の復元が構成の一部となる接続である。

## 成立条件と計算量

体上では全ての非零元に逆元があるため、上の正規化と消去が使える。合成数を法とする剰余では非零ピボットも可逆とは限らず、この手順や解数の式をそのまま使えない。浮動小数点で実数の方程式を扱う場合は、ピボットの選択と誤差の扱いが別途必要になる。

$$r\times c$$ 行列の素朴な消去は、高々 $$\min(r,c)$$ 個のピボットで各 $$r$$ 行の $$O(c)$$
要素を更新するため、$$O(rc\min(r,c))$$ 回の体演算を使う。拡大行列の保存に $$O(r(c+1))$$
の空間を使う。消去後に特解を一本出すには $$O(c)$$
時間、kernelの基底を全て明示して保存するには、追加で $$O(c(c-\operatorname{rank}A))$$
時間・空間が必要になる。解集合全体を列挙しなくても、この基底で表せる。

$$\mathbb F_2$$ では行の加減算をビット列のXORでまとめられる。1語のビット数を $$w$$
とすると、右辺を含む一行のXORは $$O(\lceil(c+1)/w\rceil)$$
かかる。ピボット探索・係数検査の費用もあるため、消去全体は

$$
O\left(rc+r\min(r,c)\left\lceil\frac{c+1}{w}\right\rceil\right)
$$

と評価できる。有限体 $$\mathbb F_q$$ での解数 $$q^{c-\operatorname{rank}A}$$
は、矛盾行がない場合の式である。

概念上の親: [線形方程式・基底・分離可能変換へ変換する](/learn/combinatorics-algebra/linear-algebra-xor/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)、[線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)、[一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)。

制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 線形方程式・rankの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC323 G「Inversion of Tree」](https://atcoder.jp/contests/abc323/tasks/abc323_g) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [factorial convolutionによる多項式Taylor shift](/learn/combinatorics-algebra/polynomial-taylor-shift/)（二項係数を階乗で分離し、係数列の反転と一回の畳み込みから P(x+a) の全係数を準線形時間で復元できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)（二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC366 G 公式問題文](https://atcoder.jp/contests/abc366/tasks/abc366_g)・[公式解説](https://atcoder.jp/contests/abc366/editorial/10641)
  — 各ビットの同次方程式、kernelの基底による非零条件の判定と出力の構成。
- [ABC276 H 公式解説](https://atcoder.jp/contests/abc276/editorial/5169)
- [ABC276 H 公式問題文](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC299 H 公式解説](https://atcoder.jp/contests/abc299/editorial/6260)
- [ABC299 H 公式問題文](https://atcoder.jp/contests/abc299/tasks/abc299_h)
- [ABC323 G 公式解説](https://atcoder.jp/contests/abc323/editorial/7356)
- [ABC323 G 公式問題文](https://atcoder.jp/contests/abc323/tasks/abc323_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-linear-system-rank`
