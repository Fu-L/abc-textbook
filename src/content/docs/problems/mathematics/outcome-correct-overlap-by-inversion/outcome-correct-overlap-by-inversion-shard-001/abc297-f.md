---
title: "ABC297-F — Minimum Bounding Box 2"
draft: true
authoringUnit: {"problemId":"abc297-f","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc297-f.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-modular-arithmetic"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc297-editorial-6157-b6977990ddffc8dfaf2e2b6dd9f30b58f9854d60d6ed32791d815e4e67da9c98","source-abc297-f-problem-ead99b97c373361d06678b186b73957a8ebe3dfef841dde59a69ab2b46b5fab5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"box面積は含まれるcellの指示値の和。cellがboxから外れる事象は全選択点が上下左右いずれかの片側領域にあることで、その交差も長方形である。16項の包除がcellを含むK点選択を数えるので、全cellの和は全box面積総和になる。全C(HW,K)選択で割ると期待値を得る。","sourceRevisionIds":["source-abc297-editorial-6157-b6977990ddffc8dfaf2e2b6dd9f30b58f9854d60d6ed32791d815e4e67da9c98","source-abc297-f-problem-ead99b97c373361d06678b186b73957a8ebe3dfef841dde59a69ab2b46b5fab5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

bounding box面積の総和は、各マス(a,b)がboxに含まれる選び方数を全マスで足す主客転倒で得られる。

採用する候補: 各マスごとに四方向除外の包除

boxが(a,b)を含まない条件は全選択点が上・下・左・右の半平面に入る事象の和で、16部分集合を面積から二項係数化できる。

棄却する候補: 各K点集合のboxを計算

C(HW,K)通りで不可能。

複数の方向条件の共通部分も一つの長方形領域になり、そこからK点を選ぶ数はC(area,K)である。

二項係数を前計算し、全(a,b)と上下左右条件の16maskについて許可長方形面積を求め、包除符号付きC(area,K)から包含選択数を出し、総和をC(HW,K)で割る。

## 典型の発動条件

### 期待値の総和割り

発動条件: 一様な組合せ事象のscore期待値。

全score総和を事象数で割る。

### 主客転倒と包除

発動条件: box面積を含有マス数として数える。

各マスがbox内に入る選択数を四方向事象の包除で得る。

## 問題固有の要素

box面積そのものを端点分布で追わず、box内の単位マス指示関数へ分解する。

別の問題へ持ち帰る視点: 幾何量の期待値は構成単位の包含確率へ線形化する。

## 正当性

box面積は含まれるcellの指示値の和。cellがboxから外れる事象は全選択点が上下左右いずれかの片側領域にあることで、その交差も長方形である。16項の包除がcellを含むK点選択を数えるので、全cellの和は全box面積総和になる。全C(HW,K)選択で割ると期待値を得る。

## 実装上の注意

- 方向条件の交差が空なら面積0とし、K>areaのCを0、最後の分母逆元を正しく掛ける。

## 復習の核

- 小盤面の全K集合と比較し、K=1,HW、端・中央マスの包除を確認する。

## 計算量と制約

### 時間

O(HW)。各cellの16方向maskを定数時間で計算する。

### 空間

O(HW)。階乗表。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq H,W \leq 1000; 1\leq K \leq HW; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/editorial/6157) — source-abc297-editorial-6157-b6977990ddffc8dfaf2e2b6dd9f30b58f9854d60d6ed32791d815e4e67da9c98
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/tasks/abc297_f) — source-abc297-f-problem-ead99b97c373361d06678b186b73957a8ebe3dfef841dde59a69ab2b46b5fab5
