---
title: "疎なkeyの順序を保ってdense indexへ圧縮する"
description: "「疎なkeyの順序を保ってdense indexへ圧縮する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
headingAliases:
  "座標値の順序保存圧縮": "値ごとの個数を登場する値だけで管理する"
sidebar:
  order: 4
---

# 疎なkeyの順序を保ってdense indexへ圧縮する

習得対象の目安: **緑色（800–1199）**。整列と二分探索を使い、大小関係と実際の距離を区別して添字化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

値が10億まであっても、入力に現れる値が数十万種類なら、10億要素の配列を用意する必要はない。登場する値だけを昇順に並べ、0から始まる連続した順位へ置き換えれば、値ごとの情報を小さな配列で管理できる。この変換を**座標圧縮**という。座標以外にも、点数・価格・時刻など、比較や検索に使う値に利用する。

ただし、順位の差は元の値の差を表さない。**等しいか、どちらが小さいかを順位で判断し、距離や金額を計算するときは元の値を使う。** この役割分担を守ることで、値域が広い問題を、登場する値の種類数に応じた処理へ変えられる。

この単元では、圧縮表の作り方から、同じ値の集計、範囲の境界、将来の更新値、距離を残す場合までを扱う。圧縮後の配列を高速に集計するデータ構造は、後の単元へつなぐ。

### 習得する技能

- 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。

## 考え方

### 値ごとの個数を、登場する値だけで管理する

列を左から読み、各位置で「それより前に現れた、自分以下の値の個数」を求めたいとする。例として、列 `(40, 10, 40, 1000)` を使う。

値をそのまま添字にすると、0から1000までの配列を用意することになる。しかし、更新する場所は10・40・1000だけである。大きさの順に並べて番号を付ければ、次の3要素で足りる。

| 元の値 | 圧縮後の順位 |
| --- | ---: |
| 10 | 0 |
| 40 | 1 |
| 1000 | 2 |

列は `(1, 0, 1, 2)` に変わる。**ソートするのは対応表を作るための値のコピーであり、処理する列の順番は変えない。** また、二つの40は同じ順位1へ写すが、列の要素を一つに減らすわけではない。

順位0・1・2の出現数を並べた配列を、最初は `(0, 0, 0)` とする。ある値を読むたびに、その順位以下の個数を合計し、それから自分の順位の個数を1増やす。

| 読んだ値 | 数えた個数 | 追加後の出現数 |
| --- | ---: | --- |
| 40 | 0 | (0, 1, 0) |
| 10 | 0 | (1, 1, 0) |
| 40 | 2 | (1, 2, 0) |
| 1000 | 3 | (1, 2, 1) |

3個目の40では、以前の10と40の両方を数えるので2個になる。合計は5であり、元の列でも順位の列でも、添字 $$i<j$$ かつ値 $$A_i\leq A_j$$ を満たす組は同じ5組である。ここで $$A_i$$ は元の列の $$i$$ 番目の値を表す。自分自身を数えないために、問い合わせてから追加する順序も守る。

### ソートと重複除去が、大小関係と等値性を保存する

一般に、使う値をすべて集めてソートし、重複を取り除いた配列を $$X$$ とする。その要素数を $$K$$ とし、添字は0から始める。

$$
X_0<X_1<\cdots<X_{K-1}
$$

$$X_r=x$$ となる唯一の添字 $$r$$ を、値 $$x$$ の順位 $$\operatorname{rank}(x)$$ と定める。先ほどの例では $$X=(10,40,1000)$$ であり、$$\operatorname{rank}(40)=1$$ となる。この定義は、$$X$$ に含まれる値に対して使う。

ソート後の値は厳密に増加するため、登録された任意の二値 $$x,y$$ について、次が両方向に成り立つ。

$$
x=y\iff\operatorname{rank}(x)=\operatorname{rank}(y)
$$

$$
x<y\iff\operatorname{rank}(x)<\operatorname{rank}(y)
$$

したがって、元の値で大小や等しさを調べていた条件は、順位で同じように判定できる。比較する値の間に、入力に現れない整数が何個あるかは、この判定には関係しない。

圧縮表を作った後、各値の順位は $$X$$ 上の二分探索で求められる。具体的には、$$x$$ 以上の最初の要素の位置を返す `lower_bound(X, x)` を使う。$$x$$ が登録済みなら、その位置がちょうど順位になる。負数でも0でも、比較して並べられるなら同じ手順を使える。

### 値の範囲を、添字の区間へ写す

ここから、$$X$$ の先頭 $$t$$ 要素に対応する出現数の合計を $$P(t)$$ と書く。つまり、順位が $$0\leq r<t$$ の要素を数える。$$P(0)=0$$ で、$$P(K)$$ は現在の全要素数である。

登録済みの値 $$x$$ の順位が $$r$$ なら、$$x$$ 未満の個数は $$P(r)$$、$$x$$ 以下の個数は $$P(r+1)$$ である。等号を含めるかどうかが、問い合わせる区間の端を一つ変える。

問い合わせの境界は、登録されていない値でもよい。`lower_bound(X, x)` は $$x$$ 未満の登録値の種類数、`upper_bound(X, x)` は $$x$$ 以下の登録値の種類数を返すので、その返り値をそのまま $$P$$ の引数にできる。

例えば $$X=(10,40,1000)$$ に25は含まれないが、25未満の登録値は10だけなので、`lower_bound(X, 25)` は1である。表の最後の出現数 `(1, 2, 1)` なら、25未満の要素数は $$P(1)=1$$ になる。

下限 $$L$$、上限 $$R$$ が $$L\leq R$$ を満たすとする。半開区間 $$[L,R)$$、すなわち $$L\leq x<R$$ に入る要素数を考える。左端の位置を $$\ell=\operatorname{lower\_bound}(X,L)$$、右端の位置を $$u=\operatorname{lower\_bound}(X,R)$$ とすれば、答えは次になる。

$$
P(u)-P(\ell)
$$

右端も含む $$[L,R]$$ なら、上の式の右端側だけ `upper_bound(X, R)` に変える。境界が最小値より小さければ返り値は0、最大値より大きければ $$K$$ となる。$$K$$ は要素の添字としては範囲外だが、区間の右端としては正しい。該当する値がなければ両端が同じ位置となり、差は0になる。

このように境界を二分探索で決めるだけなら、すべての問い合わせの境界値を圧縮表へ追加する必要はない。一方、その座標に情報を書き込むなら、書き込む場所として登録が必要になる。

### 将来使う値も集めてから、対応表を固定する

初期状態が10と40だけでも、後から25を挿入する操作があるなら、初めに10・25・40をまとめて圧縮する。初期値だけで対応表を作り、途中から25を差し込むと、40の順位が1から2へ変わってしまう。すでに配列へ保存した情報との対応が崩れる。

操作列が事前にすべて分かるなら、初期値と、追加・変更後に現れる値を先に集める。対応表を作った後は、**操作を元の順番で実行する**。先読みは添字を決めるためであり、問い合わせ時点で存在しない要素を先に有効にすることではない。

未知の値がオンラインで到着する場合、固定した圧縮表をそのまま使うことはできない。等値性だけが必要なら連想配列、大小関係も必要なら順序付きの集合や木などが候補になる。将来値を先読みできるかは、座標圧縮を選ぶ判断材料である。

### 距離を使うなら、順位と元の値を分けて持つ

10・40・1000の順位は0・1・2だが、元の差は30と960である。順位差はいずれも1なので、順位を引き算して長さを計算してはいけない。値の和・積・差・剰余・XORも、一般には保存されない。

距離が必要なら、$$X$$ を残しておく。順位 $$r,s$$ に対応する元の値の差は $$X_s-X_r$$ で計算できる。順位を保存場所に使い、元の値を量の計算に使うのである。

特に、線分の被覆長や経過時間を数えるときは、**圧縮した点と、その間の区間を区別する**。端点が $$X_0,\ldots,X_{K-1}$$ なら、隣り合う端点の間には $$K-1$$ 個の区間がある。区間番号 $$r$$ は半開区間 $$[X_r,X_{r+1})$$ を表し、その幅は $$X_{r+1}-X_r$$ になる。

先ほどの対応表なら、区間0は $$[10,40)$$ で幅30、区間1は $$[40,1000)$$ で幅960。両方を覆った長さは $$30+960=990$$ であり、区間数の2ではない。被覆数が正の区間だけ、その幅を加えれば元の長さを復元できる。

この表現が使えるのは、必要なすべての境界を集め、隣接する端点の間では被覆状態などの判定が変わらない場合である。整数の閉区間 $$[L,R]$$ に含まれる整数を数えるなら、整数点 $$x$$ を単位区間 $$[x,x+1)$$ に対応させ、境界を $$L,R+1$$ とする方法がある。この場合は $$R+1$$ の整数幅にも注意する。

グリッドの移動では、元の隣接関係や障害物の間を通れるかも必要になる。点の順位が隣り合うことだけでは、元のマスが隣り合うとはいえない。周辺座標も残す設計や、間隔を辺の重みとして持つ設計など、移動の対応を別に確かめる必要がある。端点を集めるだけで任意の経路問題まで保存できるわけではない。

### 圧縮は、集計や探索を行うための準備になる

冒頭の出現数の例では、圧縮後の配列の先頭から毎回合計しても正しい。ただし、それでは問い合わせ一回が $$O(K)$$ 時間である。[Fenwick Treeによる重み付きprefix集約](/learn/query/weighted-prefix-fenwick/)を使えば、一点への加算と先頭区間の合計を、それぞれ $$O(\log(K+1))$$ 時間で扱える。圧縮は値域を小さくし、データ構造はその上の操作を速くする、という二段階を分けて考える。

[ABC221 E](/problems/abc221-e/)では、部分列の両端の値の大小を調べながら、過去の添字に由来する重みを集計する。値を順位へ写せば、「今の値以下」という範囲をprefixとして問い合わせられる。同じ値の要素は同じ順位で重みを足し、取り出した位置の違いは重みに残す。[公式解説](https://atcoder.jp/contests/abc221/editorial/2718)の圧縮と集計がこの役割に対応する。

[ABC231 F](/problems/abc231-f/)では、二つの値に関する不等式を同時に満たす組を数える。各軸の大小と等号は圧縮で保存できるが、等しい値をどの順に処理し、同じ組が複数あるとき何通りとして数えるかは別に決める必要がある。[公式解説](https://atcoder.jp/contests/abc231/editorial/3059)では、一方の軸で並べ、もう一方の軸をデータ構造で集計する。

[ABC232 G](/problems/abc232-g/)では、円周上の必要な座標だけを残し、その間をまとめた辺に元の距離を持たせる。頂点番号を小さくしても、辺の重みまで1に置き換えることはできない。[公式解説](https://atcoder.jp/contests/abc232/editorial/3141)は、「不要な中間点を省くこと」と「その間を移動する費用を残すこと」を併用する例になっている。

ここまでは、必要な値や座標が分かっているところから始めた。これに対して、[ABC374 F](/problems/abc374-f/)のように、巨大な時刻の範囲から「最適解が使う候補時刻だけ」を先に導く問題もある。この候補の絞り込みには独立した証明が必要であり、順位を付ける操作だけでは得られない。候補発見は[問題解説](/problems/abc374-f/)と[公式解説](https://atcoder.jp/contests/abc374/editorial/11095)で扱う。圧縮した後も、待ち時間や次に出荷できる時刻は元の時刻で計算する。

## 成立条件と計算量

使う前に、更新する値を事前に列挙できるか、圧縮後に何を判定・計算するかを確認する。比較だけなら順位で足りる。距離・金額・区間長も使うなら元の値や幅を持つ。経路を扱うなら、元の移動と圧縮後の移動が対応することまで示す。

集めた値が一つ以上ある場合を考え、圧縮表を作るために集めた値の総数を $$M$$、重複除去後の種類数を $$K$$、実行する更新・問い合わせの数を $$Q$$ とする。比較を定数時間で行える整数を扱う場合、ソートと重複除去は $$O(M\log(M+1))$$ 時間、二分探索による一つの値の順位取得は $$O(\log(K+1))$$ 時間である。元の値の大きさそのものは、配列の要素数にならない。

圧縮後にFenwick Treeなどで各操作を対数時間で処理するなら、前処理を含む全体は

$$
O(M\log(M+1)+Q\log(K+1))
$$

時間となる。全操作を保存してから圧縮する説明では、値の作業用配列と操作列も含め、全空間は $$O(M+Q+K)$$。圧縮表とデータ構造の領域だけなら $$O(K)$$ だが、先読みの保存領域を除いて全空間と呼ばない。

すべての値が等しければ $$K=1$$ で、全要素は順位0へ集まる。入力に値が一つもなければ $$K=0$$ なので、要素への更新はせず、空の範囲の集計を0として扱う。この場合は圧縮表の探索をせず、問い合わせ列を $$O(Q)$$ 時間で処理できる。重複除去は値の種類を減らす操作であり、元の要素数や重みまで減らす操作ではない。

[状態の正規化](/learn/modeling/normalization/)では、問題上同じとみなせる対象を一つの形へまとめた。座標圧縮では、登録した異なる値を異なる順位へ写す。答えに必要な情報を選ぶという考え方は共通するが、圧縮したからといって値の異なる対象を同一視してよいわけではない。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。

### このUnitでは扱わないもの

- 値・時刻順にactive集合を増減するevent sweep、および固定配列・行列を入力順のまま読むだけのscan。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。）。
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g) — 主題: [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f) — 主題: [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)（訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。）。
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。）。
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 周期性による候補時刻の圧縮と単調判定の二分探索を前提に、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。リールと時刻の一対一対応を二部matchingで判定することが主題。
- [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g) — 主題: [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/)（区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g) — 主題: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。）。
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。

## 根拠

- [ABC221 E 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 E 公式解説](https://atcoder.jp/contests/abc221/editorial/2718)
- [ABC231 F 公式解説](https://atcoder.jp/contests/abc231/editorial/3059)
- [ABC231 F 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC232 G 公式解説](https://atcoder.jp/contests/abc232/editorial/3141)
- [ABC232 G 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-coordinate-compression`
