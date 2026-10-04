---
title: "ABC442-E — Laser Takahashi"
draft: true
authoringUnit: {"problemId":"abc442-e","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc442-e.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc442-e-problem-42087373ff2c255f67b0ad5bbad3ca4ea618df2041a9b7e0063309028f7c148f","source-abc442-editorial-15136-380daa78228677f1f43f35e09299c4abd5f07bea270b151f820cb4909ce5bda7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"レーザーrotationでは偏角だけが被照射時刻を決め、同ray全体は同時に消える。半平面区分と外積比較が正確な円周順を作り、外積0かつ内積正だけを同rayへまとめる。各queryをstart block左端、end block右端へ広げて円環長を数えれば同時消滅個体を全て含む。wrapの場合も円周区間を二つに分けるだけで同じ集合を数える。","sourceRevisionIds":["source-abc442-e-problem-42087373ff2c255f67b0ad5bbad3ca4ea618df2041a9b7e0063309028f7c148f","source-abc442-editorial-15136-380daa78228677f1f43f35e09299c4abd5f07bea270b151f820cb4909ce5bda7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

この解説で扱わないこと:

- 凸包の境界候補列挙・半平面交差。

## 考察

レーザーが当たる順序は原点から見た偏角だけで決まり、同じ半直線上のモンスターは同時に消える。query の端点は個体順位ではなく同偏角 block の両端へ広げる必要がある。

採用する候補: 点を半平面分類と外積比較で偏角降順に sort し、各点に同偏角 block の L_i,R_i を前計算して query 区間を円環上で数える。

整数外積なら角度誤差がなく、同時消滅を block へまとめることで各 query は L_a と R_b の循環区間長を定数時間で返せる。

棄却する候補: atan2 で各点の実数角度を計算し、query ごとに回転過程をシミュレーションする。

浮動小数点では同一直線上の等角判定が不安定で、query ごとの走査も NQ となる。

偏角比較は上半平面・下半平面を先に分け、同一半平面内では外積の符号だけで全順序を作れる。

点 a が消える向きから点 b が消える向きまでに含む個数は、非wrapなら R_b-L_a+1、wrapなら N-L_a+1+R_b になる。

各点を元 index 付きで偏角降順に並べ、外積0かつ内積正の同一半直線を連続 block にする。元 index から L,R へ写し、各 query の円環区間長を二ケースで出力する。

## 典型の発動条件

### 整数偏角 sort

発動条件: 原点回りの方向順を誤差なく並べたいとき。

半平面分類と外積で比較関数を構成する。

### 同値 block の端点前計算

発動条件: 同じ key の要素が同時に処理され、query 端点を group 単位へ広げるとき。

同偏角の連続 run に共通の L,R を与える。

## 問題固有の要素

回転の連続時間は偏角の循環順序へ離散化でき、同時刻だけを block として扱えばよい。

別の問題へ持ち帰る視点: 幾何順序を sort へ落とすときは、collinear の中でも同方向と反対方向を区別する。

## 正当性

レーザーrotationでは偏角だけが被照射時刻を決め、同ray全体は同時に消える。半平面区分と外積比較が正確な円周順を作り、外積0かつ内積正だけを同rayへまとめる。各queryをstart block左端、end block右端へ広げて円環長を数えれば同時消滅個体を全て含む。wrapの場合も円周区間を二つに分けるだけで同じ集合を数える。

## 実装上の注意

- 外積は座標積に十分な整数幅を使い、原点は入力されない前提を確認する。降順規約と wrap 条件を一貫させる。

## 復習の核

- 正の x 軸、負の x 軸、同一半直線、正反対の点を含む小例を sort し、L/R と円環式を手計算する。

## 計算量と制約

### 時間

O(N log N+Q)。偏角sortと同ray blockの端順位。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 2\times 10^5; 1\leq Q \leq 2\times 10^5; -10^9\leq X_i,Y_i \leq 10^9; (X_i,Y_i)\neq (0,0); 1\leq A_j,B_j\leq N; A_j\neq B_j; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc442/tasks/abc442_e) — source-abc442-e-problem-42087373ff2c255f67b0ad5bbad3ca4ea618df2041a9b7e0063309028f7c148f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc442/editorial/15136) — source-abc442-editorial-15136-380daa78228677f1f43f35e09299c4abd5f07bea270b151f820cb4909ce5bda7
