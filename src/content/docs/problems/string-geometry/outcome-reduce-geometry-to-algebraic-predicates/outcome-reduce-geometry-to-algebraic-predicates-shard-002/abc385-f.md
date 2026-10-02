---
title: "ABC385-F — Visible Buildings"
draft: true
authoringUnit: {"problemId":"abc385-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc385-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc385-editorial-11664-76d5a0bbd1baef5fe071c2d300507fca7164300e970ad633d9c5f17e3591e920","source-abc385-f-problem-75176a21b1f00a0a84ff4c1c5737571a51db5a16d6aefba6f634abe016ff81d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"(0,h)から各頂点への傾きがx順に適切に並ぶことが非遮蔽条件。隣接傾きの全比較が成り立てば推移律で全pair比較が成り立つ。各隣接pairの等傾き境界を整数分子/分母で解けば必要hの下限になるため、全境界と0の最大が要求境界高さ。等号を除く可視規約でもこの値は下限として返す。","sourceRevisionIds":["source-abc385-editorial-11664-76d5a0bbd1baef5fe071c2d300507fca7164300e970ad633d9c5f17e3591e920","source-abc385-f-problem-75176a21b1f00a0a84ff4c1c5737571a51db5a16d6aefba6f634abe016ff81d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"(X,H)=(1,2),(2,3),(3,2)。","procedure":["隣接境界は1と5。","h=5では後ろ二頂点への傾きが両方−1、h>5で正しい順へ開く。"],"executionTarget":null,"expectedResult":"境界高さ5。","verificationStatus":"not_applicable","learningUnitIds":["unit-geometry-primitives"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"prerequisiteIds":[],"attainmentCondition":"全buildingの高さが2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"境界2。"},"answer":{"reasoningOrVerification":"各隣接頂点の直線はy=2で原点intercept2。どのpairも同じ境界になる。","procedure":["具体例の各状態・寄与を再計算する。","各隣接頂点の直線はy=2で原点intercept2。どのpairも同じ境界になる。"],"expectedResult":"境界2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

原点(0,h)から各building頂点を見る直線の傾き条件を全pairで課すと二次だが、三点i<j<kでは外側pair(i,k)の制約は隣接側のどちらかに支配される。

したがって全buildingが互いに遮られないための必要高さの最大は、隣接pair(i,i+1)だけ調べれば得られる。

採用する候補: 隣接building対ごとの境界高さを有理式で求め、その最大と0を取る

公式の三点比較により非隣接pair制約は必ず冗長で、N-1個だけをO(N)走査すれば全条件を満たす最小高さになる。

棄却する候補: 全i<jの遮蔽境界を列挙する

正しいがΩ(N^2)でN=2×10^5に間に合わず、隣接制約による支配関係を利用していない。

境界は直線の傾き等式から h=(H_{i+1}X_i-H_iX_{i+1})/(X_i-X_{i+1}) と一つの分数で表す。

差を取ってから加える形は桁落ちしやすいため、分子を整数で計算して最後に除算する。

i=1..N-1について隣接pairの分子H_{i+1}X_i-H_iX_{i+1}と分母X_i-X_{i+1}を広い整数で作り、浮動小数へ変換して比を求める。全比と0の最大を出力する。

## 典型の発動条件

### 局所制約による全pair制約の支配

発動条件: 順序付き点列の三点性質から遠いpairの制約が隣接pairへ含意されるとき。

隣接N-1条件だけへ削減する。

### 安定な有理式評価

発動条件: 大きく近い浮動小数の差が現れる幾何計算をするとき。

式を整数の単一分子・分母へ整理して最後に割る。

## 問題固有の要素

可視性を各pair制約として眺め、任意の中間点を入れた三点比較をすると、非隣接pairが極値候補から消える。

別の問題へ持ち帰る視点: 全pair幾何最適化では、順序上の中間要素による支配・三角的性質を探し、隣接制約へ落とせないか試す。

## 正当性

(0,h)から各頂点への傾きがx順に適切に並ぶことが非遮蔽条件。隣接傾きの全比較が成り立てば推移律で全pair比較が成り立つ。各隣接pairの等傾き境界を整数分子/分母で解けば必要hの下限になるため、全境界と0の最大が要求境界高さ。等号を除く可視規約でもこの値は下限として返す。

## 実装上の注意

- 分子積は64 bit符号付き範囲を確認し、分母の符号を統一する。最小高さは0以上で、十分な桁数を出力する。

## 復習の核

- 三点をrandom生成して全pair境界最大と隣接pair最大を高精度有理数で比較し、分子が0付近・巨大値同士の差になるcaseを重点確認する。

## 計算量と制約

### 時間

O(N)。隣接buildingの境界分数を最大化する。

### 空間

O(1)追加領域。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq X_1 < \dots < X_N \leq 10^9; 1 \leq H_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

(X,H)=(1,2),(2,3),(3,2)。

1. 隣接境界は1と5。
2. h=5では後ろ二頂点への傾きが両方−1、h>5で正しい順へ開く。

期待される結果: 境界高さ5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全buildingの高さが2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各隣接頂点の直線はy=2で原点intercept2。どのpairも同じ境界になる。

確認結果: 境界2。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/editorial/11664) — source-abc385-editorial-11664-76d5a0bbd1baef5fe071c2d300507fca7164300e970ad633d9c5f17e3591e920
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/tasks/abc385_f) — source-abc385-f-problem-75176a21b1f00a0a84ff4c1c5737571a51db5a16d6aefba6f634abe016ff81d2
