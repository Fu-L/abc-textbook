---
title: "slope trick"
description: "「slope trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 226
---

# slope trick

習得対象の目安: **黄色（2000–2399）**。区分線形凸関数を折れ点で表し、関数への操作をheapの更新へ写す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### slope trick

区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。

### 習得する技能

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

DPの状態が座標xに依存していても、値f(x)が区分線形凸関数なら全座標を列挙せず折点だけを持てる。ここでは傾きが整数で、全実数上で有限かつ下に有界な関数を、重複を許す二つの折点集合L,Rと定数cで表す。

`f(x)=c+Σ_{l∈L}max(l−x,0)+Σ_{r∈R}max(x−r,0)`

不変量は`max L≤min R`。Lはmax-heap、Rはmin-heapに入れ、cは関数の最小値である。最小点の区間は`[max L,min R]`で、空のLの端点は−∞、空のRの端点は+∞と読む。折点を通過するたび傾きは1増えるが、左右の項の意味は異なる。`max(l−x,0)`はx<lで傾き−1、`max(x−r,0)`はx>rで傾き+1を与える。

### 片側線形関数と絶対値の追加

`max(a−x,0)`を加えるには、まずaをRに挿入し、その最小値bを取り出してLに挿入し、`c+=a−b`とする。b≤aなので増分は非負。aが元のmin R以上なら、交差した二つの項を次の恒等式で並べ直している。

`max(a−x,0)+max(x−b,0)=(a−b)+max(b−x,0)+max(x−a,0)`（b≤a）

aが元のmin R以下ならb=aとなり、そのままLに追加される。どちらの場合もLとRの順序と関数の値を保つ。対称に、`max(x−a,0)`を加えるにはaをLに挿入し、その最大値bをRへ移し、`c+=b−a`とする。

`|x−a|=max(a−x,0)+max(x−a,0)`なので、絶対値追加はこの二操作を続けて行う。追加される傾きはx<aで−1、x>aで+1であり、左側の傾きは1減り、右側は1増える。たとえばf(x)=0に|x|を加えるとL=R={0},c=0となり、左の傾き−1、右の傾き+1を表せる。

### 最小化と平行移動

prefix minimum `g(x)=min_{y≤x}f(y)`は、最小点より左でf(x)、最小点以降でcになる。したがってRを空にし、Lとcを保つ。suffix minimum `min_{y≥x}f(y)`ならLを空にする。単に全体の最小値を求める場合はcを読む。

平行移動`g(x)=f(x−δ)`はL,Rの全折点にδを加える。より一般にa≤bのもとで`g(x)=min_{x−b≤y≤x−a}f(y)`なら、Lの折点にa、Rの折点にbを加え、cを保つ。左の減少部分は区間の右端で、右の増加部分は区間の左端で最小化され、最小点区間は`[max L+a,min R+b]`へ広がるためである。ABC217 Hの移動可能時間Δtに対してはa=−Δt,b=Δtとなる。

### 大きな傾きは重み付き折点で持つ

係数wが大きい`w|x−a|`をw個の単位折点へ展開すると、操作数が重み総和に依存する。同じ座標の傾き増分を一つのevent `(z,w)`として持つ。全実数上の表現なら`f(x)=β+αx+Σw max(x−z,0)`とし、初期の傾きα、切片β、座標zで増える傾きw>0を保存する。`c|x−a|=ca−cx+2c max(x−a,0)`なので、追加は`β+=ca, α−=c`とevent `(a,2c)`の挿入である。折点の位置だけでなく重みと関数値を保つことが不可欠になる。

最小点は累積重みを加えた傾きが負から非負になる位置で求まる。値は`β+αx+xΣ_{z≤x}w−Σ_{z≤x}wz`で評価できる。左右の傾きを制限する更新では、端のeventを重みごとに削り、必要なら最後のeventを部分的に残す。左端から重みδを削る際は`α+=δ, β−=δz`として右側の関数値を保存する。どの値を保存するかはDPの遷移から決める。

非負整数j上の減少凸関数なら、`d(j)=f(j)−f(j+1)`と`f(0)`を持つ表現も便利である。event `(z,w)`を`w=d(z−1)−d(z)`と定義すれば、`f(j)=f(0)−d(0)j+Σw max(j−z,0)`となる。隣のeventまで進む間の値の変化は「距離×現在の傾き」で計算でき、そこで重み分だけ傾きを変える。実数上の傾きとこの整数差分ではeventの境界を混同せず、葉の初期値、eventの削除・挿入、終了時の値まで一貫した規約を使う。ABC275 ExとABC406 Gの本文で、それぞれの更新と復元へ接続する。

### 有限domainの整数凹列を扱う

最大化DPの凹列は符号反転で凸性とつながるが、到達不能な位置と整数性も保持する。有限domain[l,r]の外を−∞、初期状態を一点[m,m]とするなら、実際の点列をdequeへ持つ方法がある。点(x,y)の実値をy+s x+tとすれば一次加算はs,tだけで行え、隣接点間の整数傾きで整数位置の値を復元できる。

非負状態へ切断するとき、非負値vから負傾き−dで右へ進めるのはfloor(v/d)歩までである。左側も正傾きdの線分から同じ床除算で戻る。新端点には残りv−d·floor(v/d)を保存する。負の点をpopし、丸め後の端を挿入することで空・一点domainまで扱う。実数交点を残して翌日に更新すると、本来存在しない整数状態を作り得る。

gが凹ならmax_{z≥x}(g(z)−C(z−x))は、g(z)−Czが増える左側線分を除き、その最大点から傾きCで左へ延長した形になる。延長距離にもfloor(v/C)を使う。凸性・凹性の証明だけでなく、domainの切断と整数遷移の一致が必要である。一日に定数個の点だけ生成し、各点を一度だけpopする更新なら、heapを使う基本形とは別にdeque全体を償却線形時間で処理できる。

## 成立条件と計算量

N回の片側線形関数・絶対値追加では折点はO(N)個で、各追加は定数回のheap操作によりO(log N)、全体O(N log N)、空間O(N)。左右それぞれのshift量を持ち、heapには「実座標−shift」を保存すれば、平行移動や区間内最小化はO(1)で更新できる。prefix minimumで不要になったheapの解放に線形時間を要する実装でも、各折点の削除は一度なので解放の総費用はO(N)である。

整数傾きは同じ折点の重複で表すため、大きな重みを一個ずつ展開する場合はその個数も計算量に含む。座標範囲の制限や「初期状態はx=0だけ有限」というDPはこの有限関数の表現だけでは直接表せず、別途その制約を表現する必要がある。更新が凸性と上の表現を保つことを遷移式から確認する。

概念上の親: [凸性・傾き・限界費用・slope trick](/learn/geometry-optimization/discrete-convex/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)。

このUnitを直接前提とする単元: なし。

一次元凸・単峰最適化で得た考え方と実装を再利用し、slope trickの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC217 H「Snuketoon」](https://atcoder.jp/contests/abc217/tasks/abc217_h) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC250 G 公式解説](https://atcoder.jp/contests/abc250/editorial/3929)
- [ABC250 G 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_g)
- [ABC275 H 公式解説](https://atcoder.jp/contests/abc275/editorial/5128)
- [ABC275 H 公式問題文](https://atcoder.jp/contests/abc275/tasks/abc275_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-slope-trick`
