---
title: '探索空間を分けて照合・再帰分割する'
description: '「探索空間を分けて照合・再帰分割する」で学ぶ概念と、基礎から応用へ進む問題一覧。'
draft: false
sidebar:
  order: 6
---

# 探索空間を分けて照合・再帰分割する

導入対象の目安:
**水色（1200–1599）**。探索空間を独立に分ける場合と、再帰的な小問題へ分ける場合を区別する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

全体を一度に調べるのが難しいときは、**小さい部分について何を求めれば、全体の答えを復元できるか**を考える。部分ごとの計算が軽く、復元も軽ければ、扱える入力を大きくできる。

この単元では、二つの分け方を区別する。一つは、選択を左右へ分けて列挙し、条件を満たす組を検索する方法。もう一つは、同じ形の小問題を再帰的に解き、左右の答えと境界をまたぐ処理から親の答えを作る方法である。分割点を決めるだけでなく、分割後に残す情報と合成の費用まで設計する。

## 考え方

### 選択を分け、相手に必要な条件を求める

四つの値 $$(2,5,1,6)$$
からいくつか選び、和を8にする方法を数えよう。素朴には、それぞれを選ぶかどうかの $$2^4=16$$
通りを調べる。

ここで、前の二つと後ろの二つを別々に扱ってみる。左の部分和は $$(0,2,5,7)$$、右の部分和は
$$(0,1,6,7)$$
である。左で2を作ったなら、右では6を探せばよい。左で7を作ったなら、右では1を探す。該当する選び方は、値2と6を選ぶもの、値2と5と1を選ぶものの2通りになる。

なぜこれで全部を数えたことになるのか。元の選択は「左で選んだ添字の集合」と「右で選んだ添字の集合」にただ一通りに分かれる。逆に左右の選択を一つずつ取れば、元の選択がただ一つ決まる。この対応を作ったうえで、**左右の全組を試さず、必要な相手を検索する**のが半分全列挙の核心である。

各要素を選ぶかどうかの $$n$$ 個の決定を、左の $$k$$ 個と右の $$n-k$$ 個へ分けると、列挙数は $$2^k$$
と $$2^{n-k}$$ になる。ただし、列挙後に全組を比較すれば $$2^k2^{n-k}=2^n$$
に戻ってしまう。和が目標値 $$T$$ になる条件なら、左の和 $$x$$ に必要な右の和を $$T-x$$
と書き、整列した配列などで探す。この「照合条件を簡単に書けるか」が最初の判断になる。

### 小問題の答えに、合成に必要な情報を添える

次は列 $$(4,1,3,2)$$
にある転倒を数えよう。転倒とは、左にある要素の値が右にある要素の値より大きい添字の組である。

中央で分けると、転倒には「左半分の内部」「右半分の内部」「左から右をまたぐもの」の三種類がある。左の
$$(4,1)$$ には1個、右の $$(3,2)$$
にも1個ある。しかし、この二つの個数だけでは、左右をまたぐ転倒が何個あるか分からない。

そこで、子の答えとして個数に加えて整列済みの列を返す。左右は $$(1,4)$$ と $$(2,3)$$
になる。これを小さい順に併合するとき、右の2を取り出す段階では左に4が残っているので、転倒が1個見つかる。右の3についても1個見つかり、合計は
$$1+1+2=4$$ 個になる。

整列も同じ方法で左右へ分けられ、長さ1ならすでに整列済みで転倒は0個である。小問題を解いて必要な情報を返し、親で合成する流れを長さ1まで繰り返せる。これが分割統治である。重要なのは再帰を書くことよりも、「子が何を返せば、親の未処理分を安く求められるか」を決めることだ。

## 成立条件と計算量

### 何を小さくし、どこに費用が残るか

| 判断する点     | 半分全列挙                                                   | 再帰分割・分割統治                                       |
| -------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 分割するもの   | 選択、経路、操作列などの探索空間                             | 入力区間、値の集合、時刻区間などの小問題                 |
| 子から残すもの | 合法な相手を探すための値・境界情報と、必要なら個数や復元情報 | 部分問題の答えと、親の処理に必要な整列列・表など         |
| 合成の工夫     | 全組比較を検索や走査へ置き換える                             | 左右内部の答えに、境界をまたぐ分を加えるなどして親を解く |
| 正しさの確認   | 元の対象と左右の組がどう対応するか                           | 各対象をどの再帰呼出しが担当するか、子の結果だけで十分か |

二択が $$n$$
回ある半分全列挙では、左右の列挙数を近づけると大きい側を抑えられる。片側を整列し、他方の各候補について二分探索するなら、均等分割で時間は
$$O(n2^{\lceil n/2\rceil})$$、入力と列挙結果を含む空間は $$O(n+2^{\lceil n/2\rceil})$$
になる。実際には一候補の生成や比較にかかる費用も必要で、長い盤面や文字列を扱うならその長さも数える。

一方、長さ $$n$$ の列をほぼ半分ずつに分け、合計 $$O(n)$$
で合成する分割統治では、同じ深さにある区間の長さの合計が $$n$$ になる。深さは $$O(\log n)$$
なので、全体は $$O(n\log n)$$ 時間になる。転倒数の例では、入力・併合用配列と再帰スタックを合わせて
$$O(n)$$
空間で実行できる。合成のために全要素対を調べるならこの評価は使えず、分割が偏る場合も深さを数え直す。

### 分け方を選ぶための問い

全選択は多いが半分ずつなら列挙でき、片側から相手の条件を簡単に書けるなら、[半分全列挙](/learn/modeling/meet-in-the-middle/)へ進もう。[ABC271 F](/problems/abc271-f/)では経路を途中のマスで分け、位置とXORを照合する。[ABC326 F](/problems/abc326-f/)では移動を軸ごとに整理してから、符号の選択を分ける。「入力の中央」が適切な分割とは限らない。

同じ形の小問題が現れ、その答えや要約から親を安く処理できるなら、[再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)を考える。[ABC413 E](/problems/abc413-e/)では区間内で作れる最小の列を返し、[ABC426 G](/problems/abc426-g/)では中央をまたぐ問い合わせをその場で処理する。子の答えを単純に足す場合に限られない。

両者は組み合わせることもできる。再帰の一段で左右の候補を照合してもよい。手法名を決める前に、分けた後に必要な情報、漏れと重複のない対応、合成も含めた計算量の三つを説明できるようにしよう。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 候補数を制約・生成パラメータ・有限caseで直接界して全列挙する探索、軽重分類による償却解析、および入力木・trie・区間DPの構造をそのまま辿るだけの再帰。

## 下位単元

- [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/) — 水色
- [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

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

- [ABC426 G 公式問題文](https://atcoder.jp/contests/abc426/tasks/abc426_g)・[個別公式解説](https://atcoder.jp/contests/abc426/editorial/14152) — 中央をまたぐ問い合わせの担当と容量別の表。
- [ABC326 F 公式問題文](https://atcoder.jp/contests/abc326/tasks/abc326_f)・[個別公式解説](https://atcoder.jp/contests/abc326/editorial/7476) — 軸ごとの分解と符号付き和の照合。
- [ABC271 F 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_f)・[個別公式解説](https://atcoder.jp/contests/abc271/editorial/4925) — 中央での経路分割とXORの照合。
- [ABC413 E 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_e)・[個別公式解説](https://atcoder.jp/contests/abc413/editorial/13406) — 左右の最小列を合成する分割統治。
- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-divide-enumeration`
