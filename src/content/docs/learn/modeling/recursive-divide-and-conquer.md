---
title: "再帰分割・分割統治"
description: "「再帰分割・分割統治」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
headingAliases:
  "再帰分割分割統治-1": "二つの答えを受け取ったら何が足りないか"
  "発展時刻順の寄与を分割する": "確定した左から未確定の右へ寄与を渡す"
  "積木の層ごとの仕事量": "大きな積を均等な大きさの積へ分ける"
sidebar:
  order: 7
---

# 再帰分割・分割統治

習得対象の目安: **水色（1200–1599）**。分割・再帰・併合の役割を分け、重複のない合成と計算量を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

概念上の親: [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 概要

大きい問題を同じ形の小問題へ分け、その答えを合わせて元の答えを作る。分割統治では、「小問題を解けたとして何ができるか」を先に考えると、再帰の戻り値と合成手順を設計しやすい。

分割しただけでは速くならない。小問題どうしが担う範囲を分け、境界をまたぐ仕事を小さい費用で処理し、再帰全体で同じ仕事を何回行うかを数える。

### 習得する技能

- 分割・再帰・合成の役割を区別し、子から返す情報と、候補の漏れや重複がない理由を説明できる。
- 各層の合成費用から全体の計算量を求め、発展として時刻順の寄与の集計や、多項式の積の合成へ応用できる。

## 考え方

### 二つの答えを受け取ったら、何が足りないか

列 `4, 1, 3, 2` の逆転数を求めたい。逆転とは、左にある値が右にある値より大きい組である。半分に切ると、左内部の `4 > 1` が1組、右内部の `3 > 2` が1組ある。しかしそれだけでは、左の4と右の3・2の2組を取り逃す。

そこで、逆転を「左内部」「右内部」「左から右へまたぐ」の三つへ分ける。前二つは再帰に任せ、親ではまたぐ組だけを数える。子から個数だけを返してもまたぐ組を高速には数えにくいので、整列済みの値列も返してもらう。

小例で子から返るのは `1, 4` と `2, 3`。二列を昇順に併合しよう。次の左値が次の右値以下なら左を取り出す。左値の方が大きいなら、その右値は未処理の左値すべてより小さいので、左の残り個数を逆転数へ足して右を取り出す。この例では右の2と3を取り出すたびに1を足し、内部の2組と合わせて4組になる。

同じ値を左から先に取り出すのは、等しい組を逆転として数えないためである。片側を使い切った後は、もう一方の残りをそのまま出力する。各要素を一度ずつ取り出すので、併合とまたぐ組の集計は、二列の長さの和に比例する。

### 葉・分割・合成を同じ約束でつなぐ

この解法の小問題を「区間内の逆転数と、その区間の整列済み列を返す」と定義する。長さ0または1なら、逆転数0とその列を返す。長いなら中央で二分し、両方を同じ関数へ渡す。戻ってきた列を併合し、左右内部とまたぐ分の個数を足す。

正当性は区間長について帰納的に示せる。葉では明らかである。左右で正しい結果が得られたとすると、内部の逆転は各子が一回ずつ数える。残る逆転は必ず左と右をまたぎ、併合時に右要素を取り出す瞬間に一度だけ数えられる。この三分類は排反かつ網羅的なので、親も正しい。

同じ組が複数階層で数えられないかも確認しよう。二位置は、再帰木のどこかで初めて別の子へ分かれる。その一箇所だけで「またぐ組」になる。さらに上では同じ子の内部として既に集計された値を受け取るだけなので、再び直接数えない。

### 合成が並べ替えとは限らない

[ABC413 E](/problems/abc413-e/)では、0始まりの開始位置が区間長の倍数であり、その長さが2冪である区間を反転できる。全体を左右半分へ分けたとき、半分より小さい操作は片側の内部だけに作用し、全体の反転は二つの半分を丸ごと入れ替える。従って左右の要素を任意に混ぜることはできない。

左右それぞれを内部の操作で辞書順最小にして、その二列をどちらの順で連結するか選ぶ。左右をそれぞれ反転してから全体を反転すれば、内部の向きを戻しつつ二列を交換できるため、どちらの連結順も実現できる。

例えば `3, 1, 4, 2` は、左が `1, 3`、右が `2, 4` に最小化される。先頭が小さい左を先にして `1, 3, 2, 4` を得る。全体を `1, 2, 3, 4` へsortする方法では、操作で到達できる集合を保存していない。順列では左右の先頭値が異なるので、連結順の比較は先頭だけで決まる。

分割後の部分解が独立であることと、その最適解どうしを合わせて全体の最適解にできることは、問題の操作・評価から証明する。単に左右を別々に最小化すればよい、という一般則ではない。

### 確定した左から、未確定の右へ寄与を渡す

時刻順の状態に、前の状態から後の状態への寄与がある場合にも分割統治を使える。区間を左右へ分けると、遷移は左内部・右内部・左から右への三種類に分かれる。時刻を逆に戻る遷移がないことが、この分け方の前提になる。

左側の値が右側の計算に必要なDPなら、処理順は「左を解く → 左から右への寄与を反映する → 右を解く」である。右を先に解くと、まだ渡されていない左の値を使わずに答えを確定してしまう。逆転数のような静的な集計とは違い、両子を先に解けばよいわけではない。

この形をCDQ分割統治と呼ぶ。分割をまたぐ寄与を、座標で並べた走査、Fenwick Tree、畳み込みなどでまとめられるときに候補になる。各遷移の両端が初めて別の子へ分かれる一箇所で処理する、と考えると重複除去の根拠もつく。[ABC213 H](/problems/abc213-h/)などの時刻方向の畳み込みへ進む際も、どの値が確定済みかを先に確かめよう。

一時的な集計用の木へ左側の情報を入れたなら、右への寄与を配列などへ反映した後、その一時追加を取り消してから右を再帰的に解く。別の再帰区間の情報が残ると、同じ寄与を二度加えてしまうことがある。各層で合計 $$O(n)$$ 個の要素に対して $$O(\log n)$$ の問い合わせを行い、整列なども $$O(n\log n)$$ 以内なら、その層の費用は $$O(n\log n)$$。層数と合わせた全体の上界は $$O(n\log^2 n)$$ になる。集計器の操作が変われば、この費用も評価し直す。

## 成立条件と計算量

均等に二分し、長さ $$n$$ の併合を $$O(n)$$ 時間で行う場合、同じ深さの区間長の合計は $$n$$。深さは $$O(\log n)$$ なので、全体は $$O(n\log n)$$ 時間である。逆転数の解法も、ABC413 Eで毎回列を連結する解法もこの評価になる。

空間は実装による。逆転数では入力配列と一つの作業配列を使い、深さ優先で区間を処理すれば $$O(n)$$。各再帰の戻り値を新しく作る方法でも、不要になった子の列を解放しながら処理すれば同時に生きる要素数を $$O(n)$$ に抑えられる。全ノードの列を保存し続けるなら、層ごとに $$O(n)$$ なので $$O(n\log n)$$ 空間になる。再帰stackだけを全空間として報告しない。

### 大きな積を、均等な大きさの積へ分ける

多項式 $$\prod_{i=1}^n (x-a_i)$$ を作る場合、短い因子を一つずつ掛ける代わりに、半分ずつの積を求めて最後に掛ける積木を作れる。各ノードは担当する因子の積を返し、葉は一因子とする。因子が左右に一度ずつ所属し、多項式の積が結合的なので、根の値は目的の積になる。

次数 $$k$$ 程度の積に $$M(k)=O(k\log k)$$ の高速な乗算を使えるとする。大きさ $$k$$ のノードが一層に $$O(n/k)$$ 個なら、その層は $$O(n\log k)$$ 時間。全層を足すと $$O(n\log^2 n)$$ になる。高速乗算自体の成立条件は[畳み込み](/learn/combinatorics-algebra/polynomial-convolution/)で確認する。

後で余りを子へ配るremainder treeなどに使うため全ノードを残す場合は、係数の保存に $$O(n\log n)$$ 空間を使う。積を一つ作るだけで子を解放できる場合は、作業領域を含め線形空間に抑えられる実装もある。何を後で再利用するかで保存規約を決める。

一次因子に限らず、$$k$$ 個の多項式の次数の合計を $$S$$ としても、同じ層の部分木は元の因子を共有しないため、次数の合計は高々 $$S$$ である。次数 $$d$$ の積を $$O((d+1)\log(d+2))$$ で計算できれば、次数が正のノードの費用は層全体で $$O(S\log(S+1))$$、次数0の積や管理の費用も層当たり $$O(k)$$ で抑えられる。因子数を均等に二分する深さ $$O(\log(k+1))$$ の木なら、全体の上界は

$$
O\bigl((S\log(S+1)+k)\log(k+1)\bigr).
$$

全ノードを残す空間は $$O(S\log(k+1)+k)$$。子を使い終えたら解放し、乗算の作業領域も係数数に比例するなら、入力因子を含めて $$O(S+k)$$ 空間にできる。待機している別の部分木は因子を共有しないため、その次数の和を $$S$$ へ課金でき、定数項とノードの管理費用は $$k$$ へ課金できる。

各積を次数 $$D$$ までで打ち切っても、入力全体の総次数 $$S$$ を $$D$$ で置き換えることはできない。一次因子が大量にあれば、切り捨てが起こる前の下層では因子数に比例する仕事が残る。因子数を均等に分ける方法と、次数を重みとして分ける方法も別であり、後者なら分割手順と深さの上界を改めて示す。積木の再利用先は[多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)で扱う。

分割が偏る場合には層数が増える。常に大きさ1と $$n-1$$ に分け、各回に $$O(n)$$ 仕事をすれば $$O(n^2)$$ である。最小要素などをpivotにする解法では、最悪の分割形を調べ、短い側だけを走査するなどの別の総量評価が必要になる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)、[XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)。

再帰、整列、帰納法と計算量を前提とする。逆転数の小例で「分割・子の戻り値・またぐ仕事」を確かめた後、主配置問題の操作や幾何的条件に合わせた分割へ進もう。CDQと積木は、時刻の依存や代数的な合成まで広げた発展である。

関数の形を先に書くより、「子に何を約束してもらえば親が解けるか」を一文で定義してみよう。その約束が、葉の処理、戻り値、合成の正当性をそろえる軸になる。

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

- [ABC413 E 公式解説](https://atcoder.jp/contests/abc413/editorial/13406)

- [ABC413 E 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_e)・[個別公式解説](https://atcoder.jp/contests/abc413/editorial/13406) — 反転区間の構造、左右の交換と辞書順最小列の合成。
- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-recursive-divide-and-conquer`
