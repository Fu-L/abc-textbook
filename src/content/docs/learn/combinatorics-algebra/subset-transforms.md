---
title: "subset zeta・Möbius変換"
description: "「subset zeta・Möbius変換」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 187
---

# subset zeta・Möbius変換

習得対象の目安: **青色（1600–1999）**。集合の包含方向に一bitずつ和を集め、zeta変換と逆変換を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### subset zeta・Möbius変換

「集合がちょうど一致するものの値」が分かっているとき、「その部分集合すべての値の和」を全ての集合について求めたい。集合をbitmaskで表し、一つのbitずつ和を集めると、部分集合を毎回列挙するより速く計算できる。この操作がsubset zeta変換であり、和から元の値を復元する操作がsubset Möbius変換である。逆向きに、上位集合すべての和を求めるsuperset版も同じ考え方で導ける。

全ての部分集合を包含関係で結んだ構造をBoolean latticeと呼ぶ。この単元では、その構造をbitごとの足し算・引き算として扱う。

### 習得する技能

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 元の値と部分集合和

要素数を $$N$$ とし、全体集合を $$U=\{0,1,\ldots,N-1\}$$ とする。集合 $$S\subseteq U$$ を、含む要素の位置だけbitが1の整数で表す。例えば2 bitでは、右からbit 0、bit 1と数え、`00` は空集合、`01` は $$\{0\}$$、`10` は $$\{1\}$$、`11` は $$\{0,1\}$$ を表す。以下では、同じ $$S$$ を集合としても配列の添字としても使う。

元の配列 $$f[S]$$ は「集合がちょうど $$S$$ であるものの値」を持つ。一方、求める配列は

$$
F[S]=\sum_{T\subseteq S}f[T]
$$

であり、「集合が $$S$$ の範囲内に収まるものの値の合計」を持つ。例えば $$f[\varnothing]=1$$、$$f[\{0\}]=2$$、$$f[\{1\}]=4$$、$$f[\{0,1\}]=8$$ とすると、次のように変わる。

| mask | 集合 $$S$$ | 元の値 $$f[S]$$ | 部分集合和 $$F[S]$$ |
| ---- | ---------- | --------------- | ------------------- |
| `00` | $$\varnothing$$ | 1 | 1 |
| `01` | $$\{0\}$$ | 2 | $$1+2=3$$ |
| `10` | $$\{1\}$$ | 4 | $$1+4=5$$ |
| `11` | $$\{0,1\}$$ | 8 | $$1+2+4+8=15$$ |

`01` の値は、集合がちょうど $$\{0\}$$ の分だけなら2、空集合の分も含めるなら3である。この「ちょうど」と「範囲内」の区別が、変換前後の配列の意味になる。

全ての $$S$$ について部分集合 $$T$$ を個別に列挙すると、組 $$T\subseteq S$$ は $$3^N$$ 個ある。各要素に「$$S$$ にもない」「$$S$$ だけにある」「$$T$$ にもある」の3通りがあるためである。これを減らすため、部分集合を選ぶ操作をbitごとに分け、途中の和を共有する。

### 一つのbitを処理した後の意味

作業用配列を $$a=f$$ で初期化する。bit 0を処理する段では、そのbitが1の集合へ、bit 0を取り除いた集合の値を加える。2 bitの例なら、`00` から `01` へ、`10` から `11` へ加える。次にbit 1について、`00` から `10` へ、`01` から `11` へ加える。

| 処理後の配列 | `00` | `01` | `10` | `11` |
| ------------ | ---- | ---- | ---- | ---- |
| 初期値 | 1 | 2 | 4 | 8 |
| bit 0の処理後 | 1 | 3 | 4 | 12 |
| bit 1の処理後 | 1 | 3 | 5 | 15 |

bit 0だけを処理した時点の `11` は、$$f[\{1\}]+f[\{0,1\}]=12$$ である。処理済みのbit 0は含んでも含まなくてもよいが、未処理のbit 1は必ず含む。まだ全ての部分集合の和ではない。

一般に、処理済みbitの集合を $$P$$ とすると、配列が保つ不変量は

$$
a_P[S]=\sum_{\substack{T\subseteq S\\T\setminus P=S\setminus P}}f[T]
$$

となる。つまり、$$S$$ に含まれる処理済みbitは取り除いてもよく、未処理bitは $$S$$ と一致させる。$$S$$ にないbitを新たに含めることはない。添字の $$P$$ は説明用であり、実装では配列を段ごとに作り直す必要はない。

初期状態は $$P=\varnothing$$ なので $$T=S$$ しか選べず、確かに $$a=f$$ でよい。次に未処理のbit $$b$$ を処理する。$$b\in S$$ なら、集めたい部分集合を「$$b$$ を含むもの」と「含まないもの」に分けられる。前者は現在の $$a_P[S]$$、後者は $$a_P[S\setminus\{b\}]$$ に既に集まっている。両者は重ならないので、

$$
a_{P\cup\{b\}}[S]=a_P[S]+a_P[S\setminus\{b\}]
$$

と更新すればよい。$$b\notin S$$ なら、そのbitを含む部分集合はなく、値を変えない。これで不変量を次の段へ引き継げる。全bitの処理後は $$P=U$$ となり、未処理bitの条件がなくなるので $$a[S]=F[S]$$ が得られる。

### 同じ配列へ上書きする

具体的には、外側のループで $$b=0,1,\ldots,N-1$$ を選び、内側で全mask $$S$$ を走査する。bit $$b$$ が1の $$S$$ だけで `a[S] += a[S XOR (1 << b)]` を行う。集合から $$b$$ を取り除く操作が、この条件下ではbitごとのXORに一致する。

加算元のbit $$b$$ は0なので、その段では更新されない。また、各加算先はその段で一度しか更新しない。従って常に処理前の二つの値を使え、同じ配列へ上書きしてよい。**一つのbitの段の中では**、maskを昇順・降順のどちらで走査してもよい。bitを外側に置くのは、一段を終えてから次の不変量へ進むためである。

### 減算で元の配列へ戻す

一つのbitに注目すると、bitが0の側の値を $$x$$、1の側を $$y$$ とした更新は

$$
(x,y)\longmapsto(x,x+y)
$$

である。0の側は変わらないため、1の側から0の側を引けば $$y$$ が復元できる。そこで $$a=F$$ から始め、同じ組に対する更新を `a[S] -= a[S XOR (1 << b)]` に替える。これがsubset Möbius変換である。

一般に、操作を取り消すなら実行順を逆にすればよい。この変換では異なるbitの段が可換なので、加算時と同じbit順でも戻せる。実際、二つのbitだけが異なる4か所の値を `00`, `01`, `10`, `11` の順に $$x,y,z,w$$ とすると、どちらのbitから加算しても結果は $$x,x+y,x+z,x+y+z+w$$ になる。減算についても同様に、どちらの順でも $$x,y-x,z-x,w-y-z+x$$ になる。他のbitを固定すれば常にこの4か所に分けられるため、段の順序を入れ替えても結果は変わらない。

先ほどの例で、加算時と同じくbit 0、bit 1の順に引くと、次のように元へ戻る。

| 処理後の配列 | `00` | `01` | `10` | `11` |
| ------------ | ---- | ---- | ---- | ---- |
| 部分集合和 | 1 | 3 | 5 | 15 |
| bit 0の減算後 | 1 | 2 | 5 | 10 |
| bit 1の減算後 | 1 | 2 | 4 | 8 |

この逆変換は、集合上の包除原理による

$$
f[S]=\sum_{T\subseteq S}(-1)^{|S\setminus T|}F[T]
$$

をbitごとの減算へ分解したものでもある。$$|S\setminus T|$$ は $$S$$ にあって $$T$$ にない要素の個数を表す。

### 上位集合から和を集める

今度は「集合が $$S$$ を全て含むものの値の合計」、すなわち

$$
G[S]=\sum_{T\supseteq S}f[T]
$$

を求める。2 bitの例では、`00`, `01`, `10`, `11` の順に $$15,10,12,8$$ となる。例えば `01` には `01` と `11` の値が入り、`11` には自分自身の値だけが入る。

この場合は、処理済みbitについて「含めたままにするか、さらに追加するか」を選ぶ。未処理bitを $$S$$ と一致させる点は同じで、途中の和に含まれるのは $$T\supseteq S$$ かつ $$T\setminus P=S\setminus P$$ を満たす集合である。次のbit $$b$$ が $$S$$ にないとき、$$b$$ を含まない分は現在の $$a[S]$$ に、含む分は $$a[S\cup\{b\}]$$ に集まっている。従ってbit $$b$$ が0の $$S$$ だけを更新し、`a[S] += a[S OR (1 << b)]` とする。

2 bitなら、bit 0の段で `01` から `00`、`11` から `10` へ加えて $$3,2,12,8$$、bit 1の段で `10` から `00`、`11` から `01` へ加えて $$15,10,12,8$$ になる。部分集合和とは伝播の向きも更新する側も逆である。

加算元はbit $$b$$ が1なので、その段では変化しない。上書き可能な理由はsubset版と同じである。superset Möbius変換も同じbitごとの組で加算を減算へ替えればよく、段が可換なので同じbit順でも逆順でも戻せる。

## 成立条件と計算量

発動条件は、全maskについて「部分集合の値の和」または「上位集合の値の和」が必要であり、元の値が $$2^N$$ 要素の配列に収まることである。和を求める集合が包含関係以外の条件で制限される場合は、同じ伝播がその条件を保つかを改めて確認する。

加減算を定数時間とすれば、どの変換も $$N$$ 段それぞれで $$2^N$$ 個のmaskを走査するため、時間は $$O(N2^N)$$、配列の空間は $$O(2^N)$$ である。$$N=0$$ では空集合だけの配列となり、更新なしで変換も逆変換も完了する。subset和では空集合の値が全maskへ伝わり、全体集合の値は自分自身にだけ入る。superset和ではこの関係が逆になる。

和と逆変換を扱う値には、整数や法上の整数など、可換な加算と加法逆元を持つものを使える。法上の減算では負の値を正規化する。除算は使わないので、法が素数である必要はない。加法逆元が必要なのは、足した値を引いて一段を取り消すためである。

一方、部分集合全体の最小値を求めるだけなら、同じsubset方向で加算を `min` に替えられる。しかし、最小値から元の値を復元することは一般にはできない。1 bitの元配列が $$[1,2]$$ でも $$[1,3]$$ でも、部分集合の最小値は $$[1,1]$$ となり、情報が失われるからである。集約できることと、逆変換できることを区別する。

問題へ進む際は、集めたい条件をまず包含関係で書く。ABC349 FではORがちょうど一致する個数と、ORがあるmaskの範囲内に収まる個数を行き来する。ABC295 Exでは、あるmaskからその部分集合へ寄与を配るので、受け取る集合を固定すると上位集合から和を集める向きになる。ただし同問では固定マスによる制約もあり、bitごとの遷移をその条件に合わせて組み込む。

概念上の親: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。

このUnitを直接前提とする単元: [subset convolution](/learn/combinatorics-algebra/subset-convolution/)。

集合上の包除原理・部分集合・bitmask状態DPで得た考え方と実装を再利用し、subset zeta・Möbius変換の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC423 F「Loud Cicada」](https://atcoder.jp/contests/abc423/tasks/abc423_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC349 F「Subsequence LCM」](https://atcoder.jp/contests/abc349/tasks/abc349_f) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC295 Ex「E or m」](https://atcoder.jp/contests/abc295/tasks/abc295_h) — 主題: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。既習技能: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC295 H 公式解説](https://atcoder.jp/contests/abc295/editorial/6036)
- [ABC295 H 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_h)
- [ABC349 F 公式解説](https://atcoder.jp/contests/abc349/editorial/9771)
- [ABC349 F 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-subset-transforms`
