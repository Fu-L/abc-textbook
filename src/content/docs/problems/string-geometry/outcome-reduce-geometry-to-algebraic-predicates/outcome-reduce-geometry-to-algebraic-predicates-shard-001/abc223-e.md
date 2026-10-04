---
title: "ABC223-E — Placing Rectangles"
draft: true
authoringUnit: {"problemId":"abc223-e","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc223-e.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc223-e-problem-166cf74c15959fb17162cb4f1aec3b1d5c94f834c1ffa02de9873e7753d6fed1","source-abc223-editorial-2781-24b456093448226fc8a924b5af78bb6af9a44a183e3a3b363da7c6b935d63adf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"面積Sを幅wの帯に置くための最小整数高さはceil(S/w)であり、それより狭い帯では面積が不足する。三つの互いに重ならない軸平行長方形には、一つと残り二つを分離する水平または垂直な切り線が存在する。横方向に二枚が分離している場合、その間を三枚目が遮れば三枚目は両方から縦に分離しており、縦の切り線を選べる。この一枚を最小の帯へ縮めても残りの領域は減らない。残り二枚は縦か横に分離でき、必要幅・高さの天井除算で正確に判定できる。全一枚目と全方向を試すので配置を漏らさない。","sourceRevisionIds":["source-abc223-e-problem-166cf74c15959fb17162cb4f1aec3b1d5c94f834c1ffa02de9873e7753d6fed1","source-abc223-editorial-2781-24b456093448226fc8a924b5af78bb6af9a44a183e3a3b363da7c6b935d63adf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

この解説で扱わないこと:

- 凸包の境界候補列挙・半平面交差。

## 考察

面積の総和が XY 以下でも、整数辺長と各長方形の形のため配置できるとは限らない。一方、長方形が三つだけなら、実現可能な配置には一つを残り二つから分ける水平または垂直な直線が存在する。

採用する候補: 分離する一個の長方形、分離方向、A,B,C の順列を列挙し、天井除算で必要な帯幅を確保して残領域へ二個を並べられるか判定する。

三長方形に対する分離直線の存在により、連続的に見える配置を有限個の必要十分な切り分けへ落とせる。

棄却する候補: A+B+C≤XY だけを確認して配置可能と判定する。

面積には余裕があっても、各長方形が整数幅・整数高さを必要とするため、容器の縦横へ収まらない例を除けない。

面積 S の長方形を幅 w の帯へ置くには高さ ceil(S/w) が必要十分であり、帯を切り取った後は二長方形の同じ判定へ帰着する。

三長方形の任意の実現可能配置では、いずれかの長方形の辺を延長することで、一個と二個を隔てる軸平行線を選べる。

A,B,C の6順列と X,Y の二方向を試し、最初の面積に必要な帯を切り取り、残った長方形で残り二面積を縦または横に分割できるか天井除算で調べる。

## 典型の発動条件

### 分離補題による幾何配置の有限化

発動条件: 少数の軸平行図形を重ならずに置く存在判定で、図形の辺を延長した分離線を議論できるとき。

三個の配置を『一個を帯へ置き、残り二個を残領域へ置く』有限ケースとして全列挙する。

### 天井除算による最小必要長

発動条件: 整数辺長の長方形で、一辺と必要面積からもう一辺の最小値を求めるとき。

面積 S を幅 w に収める高さを ceil(S/w) とし、残る寸法を過不足なく更新する。

## 問題固有の要素

三個までなら、どの実現可能配置にも一個対二個の軸平行な分離線が存在するため、複雑な噛み合わせを考えなくてよい。

別の問題へ持ち帰る視点: 少数の軸平行図形では、辺の延長で配置を再帰的な帯分割に標準化できるかを先に証明する。

## 正当性

面積Sを幅wの帯に置くための最小整数高さはceil(S/w)であり、それより狭い帯では面積が不足する。三つの互いに重ならない軸平行長方形には、一つと残り二つを分離する水平または垂直な切り線が存在する。横方向に二枚が分離している場合、その間を三枚目が遮れば三枚目は両方から縦に分離しており、縦の切り線を選べる。この一枚を最小の帯へ縮めても残りの領域は減らない。残り二枚は縦か横に分離でき、必要幅・高さの天井除算で正確に判定できる。全一枚目と全方向を試すので配置を漏らさない。

## 実装上の注意

- ceil(S/w) は (S+w-1)/w で求め、S が10^18なので加算と面積比較の整数幅を確保し、必要長が容器を超えた場合を直ちに失敗させる。

## 復習の核

- 面積総和だけで判断せず、『一個を切り離せる線があるか』を証明してから有限ケースへ落とす。

## 計算量と制約

### 時間

3!個の順列と容器の二方向、および残り二枚の二方向を試すだけなので O(1)。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq X, Y \leq 10^9; 1 \leq A, B, C \leq 10^{18}; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/tasks/abc223_e) — source-abc223-e-problem-166cf74c15959fb17162cb4f1aec3b1d5c94f834c1ffa02de9873e7753d6fed1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/editorial/2781) — source-abc223-editorial-2781-24b456093448226fc8a924b5af78bb6af9a44a183e3a3b363da7c6b935d63adf
