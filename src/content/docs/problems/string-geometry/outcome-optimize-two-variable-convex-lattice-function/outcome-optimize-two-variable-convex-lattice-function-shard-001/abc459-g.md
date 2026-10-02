---
title: "ABC459-G — Golf 2"
draft: true
authoringUnit: {"problemId":"abc459-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-two-variable-convex-lattice-function/outcome-optimize-two-variable-convex-lattice-function-shard-001/abc459-g.md","learningOutcomeIds":["outcome-optimize-two-variable-convex-lattice-function","outcome-characterize-integer-solvability"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["一変数の傾き単調性やternary searchだけで解く凸最適化、および連続最小点から整数近傍への保証を持たない一般の格子探索。"],"tagIds":["tag-bezout-diophantine","tag-two-variable-convex-lattice-optimization","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc459-editorial-20454-ecbf9c3449d7213519d035df601b8dabb67074d38f83e1d29ed6693f254b0d5d","source-abc459-g-problem-7d797f0f192d6011a6ea95b5378e324bddf07dc615aaa01f92e8e5aefccec4dc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二move型の符号合計は各座標の一次不定方程式へ移る。同型の符号合計p,qは同parityならmax(|p|,|q|)手で実現でき、必要な逆符号pairで不足を埋められる。extgcdの全解parameterと各型parityを固定すると目的は二つのmax絶対値の和で凸区分線形になる。公式の格子構造で折れ目交点周辺±2が整数最小候補を覆うため、全4parity候補の比較が全最適move数を得る。","sourceRevisionIds":["source-abc459-editorial-20454-ecbf9c3449d7213519d035df601b8dabb67074d38f83e1d29ed6693f254b0d5d","source-abc459-g-problem-7d797f0f192d6011a6ea95b5378e324bddf07dc615aaa01f92e8e5aefccec4dc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-two-variable-convex-lattice-function","outcome-characterize-integer-solvability"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=1,B=3、目標(2,0)。","procedure":["(0,0)→(1,3)→(2,0)の二moveで可能。","一moveは両座標とも非零の絶対値1,3なので目標へ行けない。"],"executionTarget":null,"expectedResult":"2move。","verificationStatus":"not_applicable","learningUnitIds":["unit-two-variable-convex-lattice-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-two-variable-convex-lattice-function","outcome-characterize-integer-solvability"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"同じA,Bで目標(1,0)ならgcd1だけで可能といえるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"−1。"},"answer":{"reasoningOrVerification":"各moveでx,yが共に奇数だけ変わるため二座標parityは常に同じ。(1,0)は違うので不可能。","procedure":["具体例の各状態・寄与を再計算する。","各moveでx,yが共に奇数だけ変わるため二座標parityは常に同じ。(1,0)は違うので不可能。"],"expectedResult":"−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二変数の凸区分線形整数最適化](src/content/docs/learn/geometry-optimization/two-variable-convex-lattice-optimization.md)

- 二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。
- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 一変数の傾き単調性やternary searchだけで解く凸最適化、および連続最小点から整数近傍への保証を持たない一般の格子探索。

## 考察

g=gcd(A,B)は全到達座標の共通因子なので、X,Yの可除性を確認後に正規化できる。二種類のmove回数parityを固定すると座標方程式は二つの一次Diophantine方程式になる。

採用する候補: 四通りのparityを列挙し、extended Euclidで全整数解をparameter n,mで表す。得られる凸piecewise-linear関数の実数最小候補交点を求め、その周囲定数格子点を評価する。

各move種類の最小回数は二座標係数絶対値のmaxで、目的関数は二つのL∞ norm和として凸である。実数最適点は折れ線条件二本の交点にあり、整数最適点は距離2以内に存在する。

棄却する候補: 原点から(X,Y)まで格子点をBFSし、knight型moveの最短回数を求める。

無限格子上で最短路が通る探索範囲を安全に有限化できず、到達不能な入力ではBFSの停止条件も定められない。

同種類moveをp,q方向へ配分する最小回数は max(|p|,|q|) で、p,qは使用回数parityが一致する。

凸関数の折れ目直線四本から二本を選ぶ交点だけで実数最小候補を得られ、各候補周辺5×5整数点で離散最小を覆える。

gcdでscaleを除き到達可否を確認する。c1,c2∈{0,1}ごとに二座標方程式をextgcdでparameter化し、目的f(n,m)を作る。折れ目直線pair全ての交点を有理数で求め、floor座標±2を評価して最小値を返す。

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

二move型の符号合計は各座標の一次不定方程式へ移る。同型の符号合計p,qは同parityならmax(|p|,|q|)手で実現でき、必要な逆符号pairで不足を埋められる。extgcdの全解parameterと各型parityを固定すると目的は二つのmax絶対値の和で凸区分線形になる。公式の格子構造で折れ目交点周辺±2が整数最小候補を覆うため、全4parity候補の比較が全最適move数を得る。

## 実装上の注意

- gで割れないX,Yは即到達不能とし、extgcd係数・負parameter・有理交点をoverflowしない整数演算で扱う。

## 復習の核

- move回数parityから係数2x+cが出る理由と、L∞ normが必要move数になる構成を先に確認してから凸最適化へ進む。

## 計算量と制約

### 時間

各case O(log min(A,B))。extgcd後は4parity×定数個の交点近傍。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 2 \times 10^5; 1 \le A < B \le 10^6; 0 \le X, Y \le 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=1,B=3、目標(2,0)。

1. (0,0)→(1,3)→(2,0)の二moveで可能。
2. 一moveは両座標とも非零の絶対値1,3なので目標へ行けない。

期待される結果: 2move。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じA,Bで目標(1,0)ならgcd1だけで可能といえるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各moveでx,yが共に奇数だけ変わるため二座標parityは常に同じ。(1,0)は違うので不可能。

確認結果: −1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/editorial/20454) — source-abc459-editorial-20454-ecbf9c3449d7213519d035df601b8dabb67074d38f83e1d29ed6693f254b0d5d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/tasks/abc459_g) — source-abc459-g-problem-7d797f0f192d6011a6ea95b5378e324bddf07dc615aaa01f92e8e5aefccec4dc
