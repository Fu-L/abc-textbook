---
title: "ABC248-E — K-colinear Line"
draft: true
authoringUnit: {"problemId":"abc248-e","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc248-e.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc248-e-problem-3bdb5230e435e45ecdada0339b5aa4d424d0a6dcecc863712b12270c320c19a8","source-abc248-editorial-3792-678e0d64c5fea2844c27e28f78b4fffc0bd8497479aa439587db945b60c3fac6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"K=1なら各点を通る無限の直線が存在する。K≥2の有効直線は必ず入力点の対から生成されるので、全点対を調べれば漏れない。外積0で所属点数を正確に求め、gcdと符号で正規化した(A,B,C)の集合へ入れると、どの点対で生成しても同じ直線は一度だけ数えられる。座標積には浮動小数を使わない。","sourceRevisionIds":["source-abc248-e-problem-3bdb5230e435e45ecdada0339b5aa4d424d0a6dcecc863712b12270c320c19a8","source-abc248-editorial-3792-678e0d64c5fea2844c27e28f78b4fffc0bd8497479aa439587db945b60c3fac6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

K=1 なら、与えられた任意の 1 点を通る直線だけでも傾きを連続的に変えられるため無限本存在する。

K≥2 なら条件を満たす直線は必ず与えられた相異なる 2 点で一意に定まり、候補は点対から得られる有限個に限られる。

採用する候補: 全点対が定める直線について全 N 点の共線性を外積で調べ、K 点以上なら正規化した直線表現を set に入れる。

N≤300 なので点対×全点を調べられ、正規化 key により同一直線を一度だけ数えられる。

棄却する候補: 各点対が K 点以上を通るたびに、そのまま答えを 1 増やす。

m 点が同一直線上にあると同じ直線を mC2 回数えてしまい、重複除去がない。

点 A,B,P の共線条件は (B_x-A_x)(P_y-A_y)=(B_y-A_y)(P_x-A_x) で、傾きの除算を使わず垂直線も同じ式で扱える。

直線 Ax+By+C=0 の係数を gcd で割り、最初の非零係数が正になるよう符号をそろえると、同一直線が同一の整数 tuple になる。

K=1 なら Infinity を出力する。それ以外は i<j の各点対から直線を作り、全点を外積で数えて K 以上なら canonical (A,B,C) を set へ挿入し、set size を答える。

## 典型の発動条件

### 2 点で決まる候補の全列挙

発動条件: 求める幾何対象が任意の 2 入力点で一意に決まり、N が数百程度のとき。

O(N^2) 個の候補直線ごとに全点の共線性を検査する。

### 整数係数による幾何正規化

発動条件: 同じ直線や方向を浮動小数なしで重複排除したいとき。

直線係数を gcd と符号で canonicalize し、tuple を set key にする。

## 問題固有の要素

K=1 の無限性と K≥2 の『必ず点対で決まる』を分けることで、連続な直線集合が有限候補列挙へ変わる。

別の問題へ持ち帰る視点: 幾何数え上げでは、必要な入力点数で対象が一意に決まる閾値を先に確認し、退化時だけ別処理する。

## 正当性

K=1なら各点を通る無限の直線が存在する。K≥2の有効直線は必ず入力点の対から生成されるので、全点対を調べれば漏れない。外積0で所属点数を正確に求め、gcdと符号で正規化した(A,B,C)の集合へ入れると、どの点対で生成しても同じ直線は一度だけ数えられる。座標積には浮動小数を使わない。

## 実装上の注意

- 座標差と積は大きくなるため、外積および C 係数の計算には十分な幅の整数型を使う。
- 垂直線・水平線も含めて gcd(|A|,|B|,|C|) と符号規約を一貫させ、同じ線の点対順による符号反転を除く。

## 復習の核

- 3 点が同一直線上にある例で 3 点対が 1 key に潰れることと、K=1 だけが Infinity になる理由を別々に確認する。

## 計算量と制約

### 時間

O(N³+N² log N log V)。Vは係数の最大絶対値。

### 空間

O(N²)（直線keyの集合）。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 300; \lvert X_i \rvert, \lvert Y_i \rvert \leq 10^9; X_i\neq X_j or Y_i\neq Y_j, if i\neq j.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/tasks/abc248_e) — source-abc248-e-problem-3bdb5230e435e45ecdada0339b5aa4d424d0a6dcecc863712b12270c320c19a8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/editorial/3792) — source-abc248-editorial-3792-678e0d64c5fea2844c27e28f78b4fffc0bd8497479aa439587db945b60c3fac6
