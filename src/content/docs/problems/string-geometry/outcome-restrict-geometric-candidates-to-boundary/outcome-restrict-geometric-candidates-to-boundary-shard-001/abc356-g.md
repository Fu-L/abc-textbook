---
title: "ABC356-G — Freestyle"
draft: true
authoringUnit: {"problemId":"abc356-g","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc356-g.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull"],"sourceRevisionIds":["source-abc356-editorial-10127-9631dfbce040f74564c78e584baf44a5d137f433d5096315078ecbf2b3e04244","source-abc356-g-problem-5064a3c530583bb2c3ad67ad3adaa9b4525eaf687a574a8925545b1991fd2601"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"時間割合による平均rateは凸包内の点と一致し、距離Dの時間と体力はD/B、DA/Bである。同速度で最小A以外を捨て、下側境界上で速度を最大にしても最適解を失わない。最小比の右端αから最大速度ωへの凸chainでは、Bh'(B)−h(B)の非減少性からh(B)/Bが非減少となる。最小比が制約を超えれば不可能、最大速度が合法ならそれが最速。残る場合、二分探索で合法から非合法へ切り替わる辺を特定し、線形補間で制約線との交点を得る。その交点より右は全て非合法であり、交点は二styleの時間混合で達成できるので、その速度から求めたD/B_optが最小時間である。","sourceRevisionIds":["source-abc356-editorial-10127-9631dfbce040f74564c78e584baf44a5d137f433d5096315078ecbf2b3e04244","source-abc356-g-problem-5064a3c530583bb2c3ad67ad3adaa9b4525eaf687a574a8925545b1991fd2601"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一つの泳ぎ方iを一秒使うrate点P_i=(B_i,A_i)とする。総時間Tで割った平均rateは時間割合を係数とする凸結合であり、逆に任意の凸結合はその割合だけ泳いで実現できる。距離Dをちょうど進むと所要時間はD/B、体力はDA/Bとなる。従ってA/B≤C/Dの凸包内の点から最大Bを選ぶ。

全style対を毎queryで調べるとO(N²Q)。同じ速度Bでは体力Aが最小の点だけ残し、Bの昇順で下側凸包を作る。末尾二点u,vと追加pでcross(v−u,p−v)≤0の間はvを除く。保持する辺の傾きは厳密に増え、下側境界は凸関数h(B)となる。

凸包上でA/Bが最小の点αを選び、同値ならBが最大の点とする。Bが最大の点ωはその速度で最小Aの点である。A_αD>B_αCなら全style混合でも不可能なので−1、A_ωD≤B_ωCならωだけで最速なのでD/B_ωを返す。

残る場合はαからωへ右に進む下側chainだけを見る。各辺上でh(B)/Bの導関数の符号はBh'(B)−h(B)である。これは一つの辺で一定で、次の辺で傾きが増えると非減少となる。最小比の右端α以降では非負なので、chainの頂点比A/Bは非減少である。従ってA D≤B Cという可否はこのchain上でtrueからfalseへ一度だけ変わる。

αを成功端、ωを失敗端としてindex二分探索し、隣接する成功頂点uと失敗頂点vを得る。e_u=A_uD−B_uC≤0、e_v=A_vD−B_vC>0と置く。uからvへ進む混合率はλ=−e_u/(e_v−e_u)、制約線A=(C/D)Bとの交点速度は

B_opt=(B_u e_v−B_v e_u)/(e_v−e_u)

となる。所要時間D/B_opt=D(e_v−e_u)/(B_u e_v−B_v e_u)を最後だけ実数へ変換して出力する。成功端が線上ならe_u=0でλ=0となり、余計なepsilonや追加の実数二分探索は要らない。

例えばstyle (A,B)=(1,2),(2,3),(3,3),(4,4)では同速度の(3,3)を捨てる。C=4,D=7の交点はB_opt=7/3、所要時間3。C=49,D=100は最小比1/2より厳しく−1であり、凸包全周を単峰とみなして探索せず、判定後のchainを使うことが要点である。

## 典型の発動条件

### 連続時間混合の凸包

発動条件: 複数行動を任意の実時間比で混ぜ、平均rateの線形制約下で最適化するとき。

行動rateを点とし、可能集合をconvex hullとして境界上の極値を探す。

### 凸chain上の傾きquery

発動条件: 原点からのslope制約とx最大化queryが多数あるとき。

関連する凸包chainでslope順序を使ってedgeを二分探索する。

## 問題固有の要素

切替回数mは本質でなく、各styleに費やす時間割合だけが総distance/staminaを決めるためconvex combinationへ落ちる。

別の問題へ持ち帰る視点: 連続量で行動を混ぜられる問題では、整数DPより先にrate spaceの凸性を見る。

## 正当性

時間割合による平均rateは凸包内の点と一致し、距離Dの時間と体力はD/B、DA/Bである。同速度で最小A以外を捨て、下側境界上で速度を最大にしても最適解を失わない。最小比の右端αから最大速度ωへの凸chainでは、Bh'(B)−h(B)の非減少性からh(B)/Bが非減少となる。最小比が制約を超えれば不可能、最大速度が合法ならそれが最速。残る場合、二分探索で合法から非合法へ切り替わる辺を特定し、線形補間で制約線との交点を得る。その交点より右は全て非合法であり、交点は二styleの時間混合で達成できるので、その速度から求めたD/B_optが最小時間である。

## 実装上の注意

- 同じBでは最小Aのみ。最小A/Bの同値は右端を選ぶ。N=1は二つの端点判定だけで処理できる。
- 可否A D≤B C、比の比較、crossと交点の分子・分母は整数で評価する。B·eは10^27程度になり得るので128bitを使い、最後の比だけlong double等へ変換する。
- 凸包全周で比の単調性を仮定しない。αからωへB昇順の下側chainだけを探索する。

## 復習の核

- まず総時間で割って平均rateを作り、可能集合が凸包になることを証明する。query直線の上下判定は浮動比較でなく整数cross productを優先する。

## 計算量と制約

### 時間

O(N log N+Q log N)。下側凸包とquery交点binary search。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 2 \times 10^5; 1 \le A_i, B_i \le 10^9; 1 \le Q \le 2 \times 10^5; 1 \le C_i, D_i \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc356/editorial/10127) — source-abc356-editorial-10127-9631dfbce040f74564c78e584baf44a5d137f433d5096315078ecbf2b3e04244
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc356/tasks/abc356_g) — source-abc356-g-problem-5064a3c530583bb2c3ad67ad3adaa9b4525eaf687a574a8925545b1991fd2601
