---
title: "再帰分割・分割統治"
description: "「再帰分割・分割統治」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 7
---

# 再帰分割・分割統治

習得対象の目安: **水色（1200–1599）**。分割・再帰・併合の役割を分け、重複のない合成と計算量を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 再帰分割・分割統治

大きな問題を同じ形の小問題へ分け、それぞれの答えから元の答えを作る。小さくなる方向に分割し、長さ1などの直接答えられる問題まで進んでから、結果を順に合成する。

### 習得する技能

- 分割・再帰・合成の役割を区別し、子から返す情報と、候補の漏れや重複がない理由を説明できる。
- 各層の合成費用から全体の計算量を求め、発展として時刻順の寄与の集計や、多項式の積の合成へ応用できる。

## 考え方

まず[ABC413 E「Reverse 2^i」](/problems/abc413-e/)の短い列で考える。この問題では、長さ $$2^N$$ の順列に対し、位置 $$a2^b$$ から始まる長さ $$2^b$$ の区間を何度でも反転できる。$$a,b$$ は非負整数で、区間全体が列の中に収まるように選ぶ。位置は0から数える。得られる列のうち、先頭から比較して最初に違う値が小さいもの、つまり辞書順最小の列を求めたい。

長さ4の $$(3,2,4,1)$$ を、左右の $$(3,2)$$ と $$(4,1)$$ に分ける。それぞれをさらに分けると長さ1になり、もう並べ替える必要がない。これが再帰の終点である**葉**に当たる。葉から親へ結果を返すと、次の順で答えが組み上がる。

| 元の区間 | 子から受け取る結果 | 親での合成結果 |
| --- | --- | --- |
| $$(3,2)$$ | $$(3)$$ と $$(2)$$ | $$(2,3)$$ |
| $$(4,1)$$ | $$(4)$$ と $$(1)$$ | $$(1,4)$$ |
| $$(3,2,4,1)$$ | $$(2,3)$$ と $$(1,4)$$ | $$(1,4,2,3)$$ |

ここで重要なのは、左右を最小化したあとに**内部の順序を保ったまま左右を交換できるか**である。左の結果を $$A$$、右を $$B$$ とし、連結を $$A+B$$ と書く。単に全体を反転すると $$\operatorname{rev}(B)+\operatorname{rev}(A)$$ となり、内部まで逆になる。しかし、先に左右をそれぞれ反転してから全体を反転すれば、$$B+A$$ を作れる。$$\operatorname{rev}$$ は列を逆順にする操作であり、この3回の反転はいずれも許された区間への操作である。長さ1の反転は何も変えないので省略してよい。

では、この合成で全候補を扱えているだろうか。許された区間は、二分を繰り返して現れる区間そのものである。ある区間の中では、その全体の反転だけが左右の要素集合を交換し、より短い反転は片側の中に収まる。全体反転を挟んでも、元の左右の集合は一つの塊のままで、中身が混ざらない。また、その反転で生じる子の内部の逆順も、子の区間全体の反転で実現できる。したがって、到達できる列は、子ごとに到達できる並びを左右どちらかの順に連結したものに限られる。逆に、子で実現できる並びの任意の組は、そのまま連結するか、上の3回の反転で左右を交換することで実現できる。

この対応から、左右をその順で置く場合の最小列は $$A+B$$、交換する場合は $$B+A$$ である。各子の最小列だけを返しても、親の最適解を失わない。順列なので $$A$$ と $$B$$ の先頭の値は必ず異なり、小さい先頭を持つ側を前へ置けば辞書順最小になる。長さ1では正しい答えが得られ、正しい子の答えから正しい親の答えを作れるので、根までこの手順を繰り返せる。全候補を実際に列挙する必要はない。

小例では $$(2,3)+(1,4)$$ を交換して $$(1,4,2,3)$$ を得る。$$1,2,3,4$$ の昇順にはできない。元の左右の組 $$\{3,2\}$$ と $$\{4,1\}$$ を崩せないからである。「好きに整列する」のではなく、到達可能な列の構造を使って最小化している。

実装でもこの流れをそのまま使える。区間を受け取り、長さ1ならその列を返す。それ以外なら中央で二分して左右を再帰的に解き、先頭が小さい結果を前へ連結して返す。根の返す列が答えである。分割統治を設計するときは、このように**子の結果の意味と、合成で最適解を落とさない理由**を先に決める。

## 成立条件と計算量

ABC413 Eで、問題文の $$N$$ は長さの指数である。ここでは**列長を $$n=2^N$$** と置き、長さ $$n$$ の区間を解く時間を $$T(n)$$ とする。半分の列を2回解き、合計 $$n$$ 要素をコピーして連結する実装なら、

$$
T(1)=O(1),\qquad T(n)=2T(n/2)+O(n)
$$

となる。上から深さ $$h$$ の層には長さ $$n/2^h$$ の区間が $$2^h$$ 個あり、合成の費用の総和は $$O(n)$$。合成を行う層数は $$\log_2 n=N$$ なので、全体は $$O(n\log n)=O(N2^N)$$ 時間である。葉の処理と出力の $$O(n)$$ もこれに含まれる。

空間は深さ優先で左右を順に構築し、連結後に子の列を解放するなら $$O(n)$$。左の結果を保持して右を計算する間も、待機中の列の長さは $$n/2+n/4+\cdots<n$$ で、現在の結果と連結用の一時領域を加えても $$O(n)$$ に収まる。再帰スタックは $$O(\log n)$$。全節点の列を保持すれば $$O(n\log n)$$ になるので、再帰するだけでは空間の評価は決まらない。

一般の問題でも、同じ形のより小さい問題へ進み、子の結果から必要な解をすべて扱えることが分割統治の条件になる。二分していても、片側にほぼ全要素が残れば深さは対数とは限らない。合成に全組比較が必要な場合や、同じ部分問題を何度も解く場合にも、実際の仕事量から評価し直す。最初に「分割後に何が残り、何を合成するか」を決め、次にその費用を層ごとに数えよう。

### 発展：時刻順の寄与を分割する

ここまででは子の答えを独立に求められた。発展として、右側の計算が左側の結果を必要とする場合を考える。以下はDPと寄与を集計するデータ構造を学んだあとに読むとよい。

状態を時刻順に $$0,1,\ldots,n-1$$ と並べ、$$dp[i]$$ の計算にそれ以前の $$dp[j]$$（$$j<i$$）からの寄与を使うとする。**CDQ分割統治**では、この添字区間を二分し、左の状態を確定させてから、左から右への寄与をまとめて加える。左右を独立に解いて最後に合成するだけでは、右の計算に必要な情報が間に合わない。

具体的には、半開区間 $$[l,r)$$ を扱う `solve(l,r)` で、中央を $$m=\lfloor(l+r)/2\rfloor$$ として次の順に処理する。

1. `solve(l,m)` で左の状態の値を確定する。
2. $$l\leq j<m\leq i<r$$ を満たす左から右への寄与だけを加える。必要な大小条件に沿う座標順の走査とFenwick木などで、全組を比較せずに集計する。一時的に追加したデータは取り消す。
3. `solve(m,r)` を呼び、左から受け取った寄与を含めて右の状態を確定する。

一つの寄与 $$j\to i$$ は、二添字が初めて左右へ分かれる唯一の再帰節点で処理される。その祖先では同じ側に入り、子孫では両方を含む区間がないため、漏れも重複もない。DPではこの一意性に加えて、**左確定→交差更新→右再帰**という依存順も必要になる。DPではない静的な点の組の数え上げなら、値の確定を待たずに済むため、再帰の順序を変えられる場合がある。

同じ層の整列・問い合わせの合計が $$O(n\log n)$$ なら、深さ $$O(\log n)$$ と合わせて全体は $$O(n\log^2 n)$$。整列結果を共有して整列を省けても、Fenwick木などへの問い合わせ費用は残る。左右の寄与が畳み込みになる応用は[Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)へつながる。

### 積木の層ごとの仕事量

もう一つの発展は、多数の多項式の積である。[畳み込み](/learn/combinatorics-algebra/polynomial-convolution/)を学んだあとに、合成費用が線形でない例として読むとよい。たとえば4個の多項式 $$F_1,F_2,F_3,F_4$$ を掛けるなら、左右で $$F_1F_2$$ と $$F_3F_4$$ を作り、その二つを掛ける。このように葉に各多項式、内部節点に子の積を置いた二分木を**積木**と呼ぶ。

計算量では、最後の積の次数だけでなく、各層の積を数える。葉数を $$k$$、葉の次数を $$d_i$$、総和を $$S=\sum_{i=1}^{k}d_i$$ とする。同じ層の部分問題は葉を共有しないため、その層の次数総和は $$S$$ 以下である。結果の次数が $$d$$ の積を $$O((d+1)\log(d+2))$$ で計算できるなら、各層の費用は $$O(S\log(S+1)+k)$$。葉数を均等に二分すれば深さは $$O(\log(k+1))$$ なので、全体は $$O((S\log(S+1)+k)\log(k+1))$$ 時間で抑えられる。次数0の多項式や節点の管理費用も $$k$$ の項に含めている。

各積を次数 $$M$$ で打ち切ると個々の積は短くなるが、全体の次数総和 $$S$$ を $$M$$ で置き換えることはできない。たとえば全 $$k$$ 葉の次数が1で、$$k$$ と $$s$$ が2の冪なら、各部分問題が $$s$$ 葉を持つ層には $$k/s$$ 個の積がある。$$s\leq M$$ ではその層の次数総和は $$k$$ になる。最終積を次数 $$M$$ までしか保持しなくても、その下の層には $$k$$ に比例する仕事が残る。次数の偏りが大きいときは、葉数による二分と次数による均衡を区別する。後者を使うなら重みと分割手順を示し、深さも改めて評価する。

全節点の係数を保持すると空間は $$O(S\log(k+1)+k)$$ になる。深さ優先で子を合成した直後に子の係数列を解放し、乗算の一時領域も次数に比例するなら、$$O(S+k)$$ 空間に抑えられる。待機中の部分木は葉を共有せず、それらの総次数と現在の一時積を合わせても $$O(S)$$、定数項や管理情報を含めても $$O(S+k)$$ だからである。この解放規約まで含めて空間を評価する。積木からさらに剰余を子へ渡す応用は[多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)で扱う。

概念上の親: [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)、[XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)。

pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC413 E「Reverse 2^i」](https://atcoder.jp/contests/abc413/tasks/abc413_e) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h) — 主題: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)（母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。）。追加で学ぶ技能: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)（heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)（隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g) — 主題: [XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)（整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。追加で学ぶ技能: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。）。 畳み込みと等比点評価を前提に、拡大体で数列の一般項を指数の式へ変換する方法を学ぶ。周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

## 根拠

- [ABC413 E 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_e)・[個別公式解説](https://atcoder.jp/contests/abc413/editorial/13406) — 反転区間の構造、左右の交換と辞書順最小列の合成。
- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-recursive-divide-and-conquer`
