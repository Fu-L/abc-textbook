---
title: "label付き連結成分分解・exponential formula"
description: "「label付き連結成分分解・exponential formula」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 203
---

# label付き連結成分分解・exponential formula

習得対象の目安: **黄色（2000–2399）**。根を含む成分や成分集合の一意な分解から、指数型母関数やsubset再帰を立てる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### label付き連結成分分解・exponential formula

最小ラベルを含む連結成分を一意に切り出し、全構造と連結な構造の個数を結び付ける。ラベル集合をサイズだけで扱えるなら指数型母関数へ、扱えないなら部分集合DPへ進む。

### 習得する技能

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。

## 考え方

全体を直接数えにくくても、「一つの連結成分」と「残り」を独立に選べるなら、成分ごとの数え上げへ分解できる。ただし、どの成分を最初に選ぶか自由にすると同じ構造を何度も数えてしまう。最小ラベルを含む成分に固定すると、切り出す成分が一つに決まる。

以下では固定された $$n$$ 個のラベル上の全構造数を $$a_n$$、連結な構造数を $$c_n$$ とする。同じサイズならラベル集合によらず同じ個数であり、各構造が連結成分の集合へ一意に分かれ、成分間の制約なく合成できる場合を扱う。空構造は一通りなので $$a_0=1$$、空の連結成分は存在しないので $$c_0=0$$ とする。

### 最小ラベルのある成分を固定する

独自の小例として、ラベル $$\{1,2,3\}$$ 上の全単純無向グラフを数える。辺の候補は $$\{1,2\},\{1,3\},\{2,3\}$$ の三つで、それぞれ使うか使わないか選べるから $$a_3=2^3=8$$。連結にするには辺が2本以上必要であり、2本を選ぶ三通りと、3本すべてを使う一通りから $$c_3=4$$ となる。単頂点は辺がなくても連結なので $$c_1=1$$、二頂点ではその間の辺が必要なので $$c_2=1$$ である。

8個をラベル1の属する成分で分類する。その成分の頂点集合を $$T$$、サイズを $$k$$ とすると、次の表になる。成分から外へ出る辺はすべて使わず、残りの頂点間の辺だけを自由に選ぶ。

| $$k$$ | $$T$$ の候補 | $$c_k$$ | $$a_{3-k}$$ | 合計 |
| --- | --- | --- | --- | --- |
| 1 | $$\{1\}$$ | 1 | 2 | 2 |
| 2 | $$\{1,2\}$$ または $$\{1,3\}$$ | 各1 | 各1 | 2 |
| 3 | $$\{1,2,3\}$$ | 4 | 1 | 4 |

一行目では、残りの辺 $$\{2,3\}$$ を使っても使わなくてもよい。残り全体が連結である必要はないため、ここに使うのは $$c_2=1$$ でなく $$a_2=2$$ である。二行目では成分のラベル集合が二通りある。三行目の残りは空集合だが、何も作らない一通りとして $$a_0=1$$ を掛ける。こうして $$a_3=2+2+4=8$$ となり、逆に $$c_3=8-2-2=4$$ とも求められる。

一般に、ラベル1を含む成分のサイズを $$k$$ とすると、残りの $$k-1$$ ラベルの選び方は $$\binom{n-1}{k-1}$$ 通りである。その集合上で $$c_k$$ 通りの成分を作り、残ったラベル上で $$a_{n-k}$$ 通りの構造を作るので、

$$
a_n=\sum_{k=1}^n\binom{n-1}{k-1}c_k a_{n-k}
$$

を得る。各構造のラベル1の成分は一意であり、逆に選んだ成分と残りを合わせれば元の構造を復元できる。この対応により漏れも重複もない。小例のサイズ2の係数は $$\binom{2}{1}=2$$ に当たる。

全構造数が先に分かる場合、$$k=n$$ の項が $$c_n a_0=c_n$$ なので、

$$
c_n=a_n-\sum_{k=1}^{n-1}\binom{n-1}{k-1}c_k a_{n-k}
$$

として $$n=1,2,\ldots$$ の順に復元できる。

### 指数型生成関数とsubset再帰

このラベル分配を階乗で正規化すると、[前単元のEGFの積](/learn/combinatorics-algebra/generating-functions/)へつながる。

$$
A(x)=\sum_{n\geq 0}a_n\frac{x^n}{n!},\qquad
C(x)=\sum_{n\geq 1}c_n\frac{x^n}{n!}
$$

と置く。漸化式を $$(n-1)!$$ で割ると、各項は $$c_k/(k-1)!$$ と $$a_{n-k}/(n-k)!$$ の積になる。これは形式微分した級数の $$x^{n-1}$$ 係数の比較であり、$$A'=C'A$$ を表す。初期値 $$A(0)=1,C(0)=0$$ と合わせて $$A=\exp C$$、逆に $$C=\log A$$ となる。

同じ式を成分の集合からも導ける。$$j$$ 個の成分を順序付きで並べるとEGFは $$C(x)^j$$ となる。それぞれの成分は非空で互いに異なるラベル集合を持つため、同じ成分集合に対応する並べ方はちょうど $$j!$$ 通りある。順序を忘れて全成分数を足すと

$$
A(x)=\sum_{j\geq 0}\frac{C(x)^j}{j!}=\exp C(x)
$$

を得る。$$j=0$$ の項は空構造の1である。

先ほどのグラフでは、低次の項は

$$
C(x)=x+\frac{x^2}{2!}+4\frac{x^3}{3!}+O(x^4)
$$

となる。$$x^3$$ へ寄与するのは成分数1、2、3の項だけである。2成分の場合、サイズ1と2を並べる順序は二通りある。従って $$[x^3]C(x)^2=2\cdot 1\cdot(1/2!)=1$$ となり、順序を忘れるため $$2!$$ で割ると $$1/2$$ を得る。三つの成分数からの寄与を足すと、

$$
\begin{aligned}
[x^3]\exp C(x)
&=\frac{4}{3!}+\frac{1}{2!}+\frac{1}{3!}\\
&=\frac{2}{3}+\frac{1}{2}+\frac{1}{6}=\frac{4}{3}.
\end{aligned}
$$

これは通常の係数であり、個数へ戻すには $$3!$$ を掛ける。各項はそれぞれ、連結グラフ4個、辺が1本だけのグラフ3個、辺のないグラフ1個に対応し、合計は $$3!\cdot(4/3)=8$$ となる。ここでの分類は**成分数**による $$4+3+1$$ であり、前の表の**ラベル1の成分サイズ**による $$2+2+4$$ とは分類の軸が違う。同じ8個を二通りの一意な分解で数えている。

成分数を変数 $$u$$ の次数でも記録すれば $$A(x,u)=\exp(uC(x))$$、成分数がちょうど $$j$$ の構造のEGFは $$C(x)^j/j!$$ である。個数を取り出すときは、ここでも $$n![x^n]$$ を使う。

一方、使える辺がラベルごとに違うと、サイズだけでは情報を失う。例えば、辺を $$\{1,2\},\{2,3\}$$ だけに制限したパスの部分グラフを考える。同じ二頂点集合でも、$$\{1,2\}$$ 上の連結グラフは1個、$$\{1,3\}$$ 上では0個であり、全グラフ数もそれぞれ2個と1個になる。サイズ2の共通の値 $$c_2,a_2$$ は定められない。

この場合は、頂点集合そのものを状態に持つ。集合 $$S$$ 上の全構造数を $$a[S]$$、連結構造数を $$c[S]$$ とする。$$a[\emptyset]=1,c[\emptyset]=0$$ とし、非空集合について

$$
a[S]=\sum_{\substack{T\subseteq S\\ \min(S)\in T}}
c[T]a[S\setminus T]
$$

と分解する。二項係数でラベル集合の選択をまとめる代わりに、各 $$T$$ を直接列挙して、それぞれの内部構造数を使う。パスの全体集合では、ラベル1の成分が $$\{1\},\{1,2\},\{1,3\},\{1,2,3\}$$ となる場合が順に $$2,1,0,1$$ 通りなので、合計は $$4=2^2$$ となる。

$$a[S]$$ が既知なら、$$T=S$$ の項を移して $$c[S]$$ を求める。真部分集合の値だけを参照するので、集合サイズの昇順で計算すればよい。[ABC213 G](https://atcoder.jp/contests/abc213/tasks/abc213_g)では、入力グラフで使える辺が頂点集合ごとに違うため、この部分集合DPが必要になる。

### 符号付きの連結グラフへ特殊化する

上の分解は個数だけでなく、成分ごとに積となる重み和にも使える。単純グラフの重みを $$(-1)^{\text{辺数}}$$ とすると、全グラフの重み和 $$a_n$$ は $$a_0=a_1=1$$、$$n\geq 2$$ では0になる。一つの辺の候補を固定し、その有無を反転すると、グラフが逆符号の対になって相殺するためである。

連結グラフの符号和を $$h(n)$$ とすれば、最小ラベルの成分を固定した式は、$$n\geq 2$$ について

$$
0=\sum_{k=1}^n\binom{n-1}{k-1}h(k)a_{n-k}
$$

となる。補集合サイズが2以上の項は消え、$$0=h(n)+(n-1)h(n-1)$$ だけが残る。$$h(1)=1$$ から

$$
h(n)=(-1)^{n-1}(n-1)!
$$

を得る。

[ABC236 Ex](https://atcoder.jp/contests/abc236/editorial/3289)では、等値条件として選んだ辺の成分 $$T$$ ごとに、共通値を $$g(T)$$ 通り選べる。そこで $$c[T]=g(T)h(|T|)$$ を集合分割の重みとして使う。空分割の重みを $$dp[\emptyset]=1$$ とし、非空集合では最小ラベルを含む $$T\subseteq S$$ を列挙して

$$
dp[S]=\sum_{\substack{T\subseteq S\\ \min(S)\in T}}
c[T]dp[S\setminus T]
$$

とする。$$T=S$$ も含めるので、全体が一成分の項も空集合の基底から生成できる。成分内部の相殺を導くことと、分割を重複なく合成することは別々に確認する。

## 成立条件と計算量

サイズだけの漸化式は、必要な二項係数と全構造数が得られていれば、次数 $$N$$ まで $$O(N^2)$$ 時間で計算できる。二項係数を表で前計算する場合は、その構築も $$O(N^2)$$ 時間・空間である。階乗と逆階乗を使える場合は、係数を必要時に求め、配列を $$O(N)$$ 空間にできる。

部分集合の再帰をすべての $$S$$ について直接評価すると、$$O(3^N)$$ 時間・$$O(2^N)$$ 空間になる。各ラベルの所属は「$$T$$ 内・$$S\setminus T$$ 内・$$S$$ 外」の三通りであり、最小ラベルの制限を付けてもこの上界に収まる。いずれも $$a_n$$ や $$a[S]$$、成分重みを用意する費用は別途加える。$$\exp,\log$$ で高速化する場合の費用はFPS演算に依存する。

EGFによる計算では階乗や整数による除算が必要なので、素数法 $$p$$ なら必要な次数が $$p$$ 未満か確認する。$$n!$$ が可逆でない法でも、二項係数を用いた整数の漸化式自体は成立する。空集合は一通りの構造として扱う一方、連結成分にはしない。

また、成分間の辺・順序・相互制約を別に選ぶ必要がある場合は、$$A=\exp C$$ をそのまま使えない。グラフの例では異なる成分間の辺はすべて「使わない」と一意に決まっていた。成分数制約なら $$u$$ を追加するように、何を独立に選べるのかを先に確認する。復習では、**最小ラベルで切り出す成分を一意にし、同サイズのラベル集合を同じ個数として扱えるか確かめる**ことを核にする。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。

このUnitを直接前提とする単元: なし。

生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、label付き連結成分分解・exponential formulaの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC318 Ex「Count Strong Test Cases」](https://atcoder.jp/contests/abc318/tasks/abc318_h) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC327 G「Many Good Tuple Problems」](https://atcoder.jp/contests/abc327/tasks/abc327_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（連結二部グラフの二つの彩色が部の交換だけで対応することを使い、彩色付きの計数から同じグラフの重複を補正できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 Ex「Distinct Multiples」](https://atcoder.jp/contests/abc236/tasks/abc236_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。
- [ABC253 Ex「We Love Forest」](https://atcoder.jp/contests/abc253/tasks/abc253_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。

## 根拠

3ラベル上の全単純グラフの分類、EGFの低次展開、パスとの比較は本単元の独自例である。部分集合による成分分解はABC213 G、符号和の利用はABC236 Exの公式解説と照合した。

- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC236 H 公式解説](https://atcoder.jp/contests/abc236/editorial/3289)
- [ABC236 H 公式問題文](https://atcoder.jp/contests/abc236/tasks/abc236_h)
- [ABC253 H 公式解説](https://atcoder.jp/contests/abc253/editorial/4023)
- [ABC253 H 公式問題文](https://atcoder.jp/contests/abc253/tasks/abc253_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-labeled-component-decomposition`
