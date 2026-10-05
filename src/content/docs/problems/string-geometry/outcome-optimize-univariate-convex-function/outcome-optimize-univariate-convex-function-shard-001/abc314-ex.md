---
title: "ABC314-EX — Disk and Segments"
draft: true
authoringUnit: {"problemId":"abc314-ex","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-univariate-convex-function/outcome-optimize-univariate-convex-function-shard-001/abc314-ex.md","learningOutcomeIds":["outcome-optimize-univariate-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["一次元凸・単峰最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-basic-convex-optimization","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc314-editorial-6958-903fc195f820ea11b2d1c234636b2b3f311e60f34d6d00357ba1bab2b3125787","source-abc314-ex-problem-e573f2aa9925372ff091f6bb20223906f19c45f10b18478722aef8fc5baa4e85"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"diskが全線分へ接する必要十分は半径が各線分への距離以上で、固定中心の最小半径はそのmax。凸集合距離の凸性とmaxの凸性でf(x,y)は凸、yを最小化したF(x)もepigraph射影により凸。従って内外一変数探索は局所最小に陥らず全体最小へ収束する。射影をsegment端へclampして距離を正しく評価する。","sourceRevisionIds":["source-abc314-editorial-6958-903fc195f820ea11b2d1c234636b2b3f311e60f34d6d00357ba1bab2b3125787","source-abc314-ex-problem-e573f2aa9925372ff091f6bb20223906f19c45f10b18478722aef8fc5baa4e85"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

- 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

## 考察

中心 (x,y) を固定した最小半径は、各線分までの Euclid 距離の最大値 f(x,y) である。点から凸集合である線分への距離は凸関数で、その有限個の max も凸である。

二次元凸関数を直接探索する代わりに x を固定すれば y の一変数凸最小化になり、F(x)=min_y f(x,y) も凸なので入れ子の三分探索が使える。

採用する候補: 線分距離の max を評価関数とし、y の三分探索を内側、x の三分探索を外側にした凸最適化を行う。

凸性により局所最小が大域最小で、座標範囲を十分な bounding box に置けば固定反復で要求誤差へ収束する。

棄却する候補: 円盤が接する2〜3本の線分や端点の組を列挙し、候補円を幾何的に構成する。

最近点が線分内部か端点かの組合せと active constraints が多く、漏れのない場合分けが複雑になる。

線分上の最近点は射影 parameter を [0,1] に clamp して求められ、f の一評価は O(N) で安定に計算できる。

F の epigraph は f の epigraph を y 軸方向へ射影したものなので凸であり、外側の三分探索の正当性も保たれる。

dist(point,segment) を内積射影と clamp で実装し、eval(x,y)=max_i dist とする。十分広い座標区間で、固定 x に対し y を約100回三分探索して F(x) を返す。さらに x も約100回三分探索し、最後の近傍での最小 eval を出力する。

## 典型の発動条件

### 凸関数の入れ子三分探索

発動条件: 少数次元の連続最適化で目的関数の各変数方向と部分最小化後の凸性を示せるとき。

一変数最小化 oracle を内側に置き、その値関数を外側でも三分探索する。

### 点と線分の距離

発動条件: 線分との共有点を持つ最小半径を中心からの距離で判定するとき。

射影係数を clamp し、最近点との距離を計算する。

## 問題固有の要素

「全対象へ届く最小半径」は各対象への距離の max であり、対象が凸集合なら凸最適化へ直結する。

別の問題へ持ち帰る視点: minimize maximum distance 型では、個々の距離関数と max の凸性を確認すると数値探索の保証を作れる。

## 正当性

diskが全線分へ接する必要十分は半径が各線分への距離以上で、固定中心の最小半径はそのmax。凸集合距離の凸性とmaxの凸性でf(x,y)は凸、yを最小化したF(x)もepigraph射影により凸。従って内外一変数探索は局所最小に陥らず全体最小へ収束する。射影をsegment端へclampして距離を正しく評価する。

## 実装上の注意

- 零長線分は制約で無いが、射影分母と long double の精度を管理する。探索区間は入力 bounding box を十分含め、反復回数を誤差要件から余裕を持たせる。

## 復習の核

- 三分探索を経験則で使わず、線分距離・max・部分最小化の三段階で凸性を確認する。距離 oracle は端点近傍も含む clamp を検算する。

## 計算量と制約

### 時間

O(NI_xI_y)。内外三分探索回数I_x,I_yを誤差保証から決める。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 100; 0\leq a _ i,b _ i,c _ i,d _ i\leq1000\ (1\leq i\leq N); (a _ i,b _ i)\neq(c _ i,d _ i)\ (1\leq i\leq N); The i-th and j-th line segments do not share a point (1\leq i\lt j\leq N).; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/editorial/6958) — source-abc314-editorial-6958-903fc195f820ea11b2d1c234636b2b3f311e60f34d6d00357ba1bab2b3125787
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/tasks/abc314_h) — source-abc314-ex-problem-e573f2aa9925372ff091f6bb20223906f19c45f10b18478722aef8fc5baa4e85
