---
title: "ABC372-G — Ax + By < C"
draft: true
authoringUnit: {"problemId":"abc372-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-line-envelope/outcome-optimize-by-line-envelope-shard-001/abc372-g.md","learningOutcomeIds":["outcome-optimize-by-line-envelope"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-euclidean-floor-sum"],"excludedTopics":["Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-hull-trick","tag-euclidean-floor-sum"],"sourceRevisionIds":["source-abc372-editorial-10973-65365912d37b041843a3541d9f94ebcc20adf3f3b84671f32d4b4f9a7ea26184","source-abc372-g-problem-68e8e9b0a9851ed0d38ff7ad6830f60fc20931fd6ca858be1c542cfeda092e25"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"正x固定の許容正y数は全直線上限のminで決まる。同傾きの高い直線を除き下包絡線を作ると各整数xのactive線が一意区間へ分かれる。strict不等式は整数右辺C−1へ変えられるので、その区間のy数はfloor((C−1−Ax)/B)。正yの存在範囲へ切りfloor_sumで足すと全格子点を一度数える。","sourceRevisionIds":["source-abc372-editorial-10973-65365912d37b041843a3541d9f94ebcc20adf3f3b84671f32d4b4f9a7ea26184","source-abc372-g-problem-68e8e9b0a9851ed0d38ff7ad6830f60fc20931fd6ca858be1c542cfeda092e25"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Convex Hull Trick・直線包絡](src/content/docs/learn/geometry-optimization/line-envelope.md)

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [格子点転置によるfloor_sum](src/content/docs/learn/number-theory/euclidean-floor-sum.md)

対象外:

- Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各不等式は第一象限の格子点が直線 A_i x+B_i y=C_i より下にある条件である。固定 x に許される y は全直線の上限の最小値であり、最小になる直線は x の区間ごとに変わる。

採用する候補: 傾き順に直線の下包絡線を構築し、各直線が最小となる整数 x 区間ごとに floor_sum で許される y の個数を加える。

不要な直線を凸包と同様の stack で除けば区間数は O(N) となり、各区間の床関数和を対数時間で処理できる。

棄却する候補: x=1 から上限まで走査し、全 N 本の不等式から y の最大値を求める。

座標上限は10^9級であり、x の列挙も各 x の全直線比較も制約を超える。

同傾きでは切片が最も低い直線だけ残り、傾き順に見た最小直線の交代順は単調なので下包絡線を stack で作れる。

厳密不等式 A_ix+B_iy<C_i は正整数 y の個数 floor((C_i-1-A_ix)/B_i) を与え、区間和は floor_sum に一致する。

A_i/B_i の比較を交差積で行い、同傾き処理後に下包絡線と交点の切上げ x を求める。x∈[1,Xmax) と各有効区間の共通部分に対し floor_sum を適用して総和を得る。

## 典型の発動条件

### 直線の下包絡線

発動条件: 多数の一次式の pointwise minimum を広い整数範囲で扱うとき。

傾き順 stack で最小になり得る直線と交代点だけを残す。

### floor_sum

発動条件: 一次式を整数で割った床の連続区間和が現れるとき。

各包絡線区間の y 上限を対数時間で総和する。

## 問題固有の要素

二変数線形不等式の共通部分を、x ごとの最小上限という一次元包絡線へ落とす。

別の問題へ持ち帰る視点: 幾何の交点は実数で求めず、最初に優位になる整数 x を除算の丸め込みで決める。

## 正当性

正x固定の許容正y数は全直線上限のminで決まる。同傾きの高い直線を除き下包絡線を作ると各整数xのactive線が一意区間へ分かれる。strict不等式は整数右辺C−1へ変えられるので、その区間のy数はfloor((C−1−Ax)/B)。正yの存在範囲へ切りfloor_sumで足すと全格子点を一度数える。

## 実装上の注意

- 傾き・交点比較は 64 bit を超える積を取り得るため十分広い整数型を使う。同傾き、空区間、y≤0 の範囲を除外する。

## 復習の核

- 固定 x で最も厳しい一本だけを見る発想から、最厳直線の交代が凸包になることと厳密不等式の -1 を連結して復習する。

## 計算量と制約

### 時間

O(N log N+N log V)、V=max(A_i,B_i,C_i)。下包絡線と各区間floor_sum。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; 1 \leq A_i, B_i, C_i \leq 10^9; The sum of N over all test cases is at most 2 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/editorial/10973) — source-abc372-editorial-10973-65365912d37b041843a3541d9f94ebcc20adf3f3b84671f32d4b4f9a7ea26184
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/tasks/abc372_g) — source-abc372-g-problem-68e8e9b0a9851ed0d38ff7ad6830f60fc20931fd6ca858be1c542cfeda092e25
