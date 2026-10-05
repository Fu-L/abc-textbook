---
title: "ABC459-G — Golf 2"
draft: true
authoringUnit: {"problemId":"abc459-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-two-variable-convex-lattice-function/outcome-optimize-two-variable-convex-lattice-function-shard-001/abc459-g.md","learningOutcomeIds":["outcome-optimize-two-variable-convex-lattice-function","outcome-characterize-integer-solvability"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["一変数の傾き単調性やternary searchだけで解く凸最適化、および連続最小点から整数近傍への保証を持たない一般の格子探索。"],"tagIds":["tag-bezout-diophantine","tag-two-variable-convex-lattice-optimization","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc459-editorial-20454-ecbf9c3449d7213519d035df601b8dabb67074d38f83e1d29ed6693f254b0d5d","source-abc459-g-problem-7d797f0f192d6011a6ea95b5378e324bddf07dc615aaa01f92e8e5aefccec4dc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"t回の同型移動で二軸の符号合計p,qを作るにはt≥max(|p|,|q|)、t≡p≡q mod2が必要。t=max(|p|,|q|)を選び、各軸の正符号を(t+p)/2、(t+q)/2個にすれば同時に実現できる。よって二つのmaxが正確な回数となり、extgcdの全解表示が全経路の符号合計を覆う。\n\nA≠Bでは、二つのmaxの折れ目に乗らない点の勾配は非零であり、折れ目一本だけの劣勾配でも0を作れない。したがって実数最小は二直線以上の交点で得られる。さらにf≤Kの領域は、支配する絶対値を展開すると境界方向が水平・垂直・傾き±1だけの凸八角形となる。整数格子との交差はn,m,n+m,n−mの上下限を整数へ丸めて表せる。実数最小点に近い格子へ丸め、斜め二座標の偶奇を一回補正すれば、整数点を含む最初の八角形内に各軸距離2以下の候補を取れる。この特殊な八角形の近傍保証を用いており、一般の凸関数に±2探索を適用してよいわけではない。全交点と全偶奇を調べることで整数最小を得る。","sourceRevisionIds":["source-abc459-editorial-20454-ecbf9c3449d7213519d035df601b8dabb67074d38f83e1d29ed6693f254b0d5d","source-abc459-g-problem-7d797f0f192d6011a6ea95b5378e324bddf07dc615aaa01f92e8e5aefccec4dc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二変数の凸区分線形整数最適化](src/content/docs/learn/geometry-optimization/two-variable-convex-lattice-optimization.md)

- 二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。
- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

この解説で扱わないこと:

- 一変数の傾き単調性やternary searchだけで解く凸最適化、および連続最小点から整数近傍への保証を持たない一般の格子探索。

## 考察

g=gcd(A,B)でX,Yを割れなければ到達不能。割れればA,B,X,Yをgで縮約する。A=Bの場合、縮約後はA=B=1であり、X,Yの偶奇が同じならmax(|X|,|Y|)手、違えば到達不能として先に処理する。

以後A≠Bとし、拡張EuclidでAs+Bt=1を求める。第一型(±A,±B)と第二型(±B,±A)の回数の偶奇をc_1,c_2∈{0,1}へ固定する。U=(X−c_1 A−c_2 B)/2、V=(Y−c_1 B−c_2 A)/2が整数である場合だけ調べる。全整数解は

x_1=sU+Bn、x_2=tU−An、y_1=tV+Am、y_2=sV−Bm

と表せる。n,mは自由な整数である。第一型の符号合計は(2x_1+c_1,2y_1+c_1)、第二型は(2x_2+c_2,2y_2+c_2)。各型の二つの符号合計は同じ偶奇なので、その型の必要回数は絶対値の最大に等しい。したがって目的関数は

f(n,m)=max(|2Bn+e_1|,|2Am+e_2|)+max(|2An+e_3|,|2Bm+e_4|)、

e_1=2sU+c_1、e_2=2tV+c_1、e_3=−2tU−c_2、e_4=−2sV−c_2。

実数へ緩和すると、折れ目は2Bn+e_1=±(2Am+e_2)、2An+e_3=±(2Bm+e_4)の四直線である。これらの二本ずつの非平行な交点を全て求める。各交点の床座標から−2..2の整数を両軸で試し、元の整数式でfを評価して四偶奇の最小を取る。

## 典型の発動条件

### 一次Diophantine方程式のparameter化

発動条件: 二種類の整数move回数が座標和を作るとき。

gcd可解性とextended Euclidで全解を自由parameter表示する。

### 凸piecewise-linear関数の局所格子探索

発動条件: 低次元整数最適化で実数最適点を定数候補から求められるとき。

折れ目交点周辺の定数半径だけを全探索する。

## 問題固有の要素

巨大格子最短路も、move符号回数のparityと一次方程式へ変えると二変数凸最適化になる。

別の問題へ持ち帰る視点: 整数凸最適化では全範囲を探さず、実数optimumの構造と近傍保証を証明して局所探索する。

## 正当性

t回の同型移動で二軸の符号合計p,qを作るにはt≥max(|p|,|q|)、t≡p≡q mod2が必要。t=max(|p|,|q|)を選び、各軸の正符号を(t+p)/2、(t+q)/2個にすれば同時に実現できる。よって二つのmaxが正確な回数となり、extgcdの全解表示が全経路の符号合計を覆う。

A≠Bでは、二つのmaxの折れ目に乗らない点の勾配は非零であり、折れ目一本だけの劣勾配でも0を作れない。したがって実数最小は二直線以上の交点で得られる。さらにf≤Kの領域は、支配する絶対値を展開すると境界方向が水平・垂直・傾き±1だけの凸八角形となる。整数格子との交差はn,m,n+m,n−mの上下限を整数へ丸めて表せる。実数最小点に近い格子へ丸め、斜め二座標の偶奇を一回補正すれば、整数点を含む最初の八角形内に各軸距離2以下の候補を取れる。この特殊な八角形の近傍保証を用いており、一般の凸関数に±2探索を適用してよいわけではない。全交点と全偶奇を調べることで整数最小を得る。

## 実装上の注意

- A=Bの退化は先に処理し、行列式0の交点を割らない。
- 半分にするU,Vの分子の偶奇を先に確認する。負の有理数の床は0方向への切捨てと異なる。
- extgcd係数、交点の分子、最終座標式は大きくなる。128bitで交差積と評価を行い、浮動小数の交点丸めに依存しない。

## 復習の核

- move回数parityから係数2x+cが出る理由と、L∞ normが必要move数になる構成を先に確認してから凸最適化へ進む。

## 計算量と制約

### 時間

各case O(log min(A,B))。extgcd後は4parity×定数個の交点近傍。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 2 \times 10^5; 1 \le A < B \le 10^6; 0 \le X, Y \le 10^6; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/editorial/20454) — source-abc459-editorial-20454-ecbf9c3449d7213519d035df601b8dabb67074d38f83e1d29ed6693f254b0d5d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/tasks/abc459_g) — source-abc459-g-problem-7d797f0f192d6011a6ea95b5378e324bddf07dc615aaa01f92e8e5aefccec4dc
