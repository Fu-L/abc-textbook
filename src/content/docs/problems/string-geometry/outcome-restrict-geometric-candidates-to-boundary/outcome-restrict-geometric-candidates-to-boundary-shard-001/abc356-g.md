---
title: "ABC356-G — Freestyle"
draft: true
authoringUnit: {"problemId":"abc356-g","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc356-g.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull"],"sourceRevisionIds":["source-abc356-editorial-10127-9631dfbce040f74564c78e584baf44a5d137f433d5096315078ecbf2b3e04244","source-abc356-g-problem-5064a3c530583bb2c3ad67ad3adaa9b4525eaf687a574a8925545b1991fd2601"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"時間比でstyleを混ぜる平均rateは凸結合そのものであり逆に全凸結合を実現できる。距離Dへ時間D/B、必要stamina D A/Bなので許容率A/B≤C/Dの中で最大Bが最短になる。支配された点を除いた下側hullだけで最大Bを達成でき、制約線との交点は二style混合で実現可能。chainの単調傾きからbinary searchでその辺を特定する。","sourceRevisionIds":["source-abc356-editorial-10127-9631dfbce040f74564c78e584baf44a5d137f433d5096315078ecbf2b3e04244","source-abc356-g-problem-5064a3c530583bb2c3ad67ad3adaa9b4525eaf687a574a8925545b1991fd2601"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

各styleを一秒使う rate pair (distance B, stamina A) とすると、時間比で混ぜた平均rateは点 (B_i,A_i) の凸包内の任意点、またそれだけである。

Dを時間最小で進むには、stamina/distance≤C/D という原点を通る直線以下のfeasible rateのうち、B座標最大の点を選べば所要時間D/Bになる。

採用する候補: rate点の凸包で、体力効率最良点から速度最大点までの下側chainを作り、各query直線との交点辺を二分探索する。

最適混合は凸包境界の一点で、queryごとにchain上のfeasible/infeasible境界を O(log N) で特定できる。

棄却する候補: 各queryで全style pairの混合比を調べ、最速feasible rateを探す。

候補pairがN²でQも2×10^5あり、凸結合の極値が凸包辺上に限られることを使えていない。

最小 A/B の点でも C/D を上回れば不可能、最大 B の点が制約線以下ならそれ単独が最速、残りの場合だけ両点間chain上に交点が一意にある。

辺 endpointsとの cross product AD? を使えば slope 比較を除算なしで行え、交点でのBも一次補間の有理式から計算できる。

重複Bでは最小Aなど支配点を除き、(B,A) の下側凸包を構築する。各query q=C/D の傾きについて、最小A/B点の判定、最大B点の判定後、chain上で A/B≤q から >q へ変わる隣接点を二分探索する。線分と A=qB の交点B_optを求め D/B_opt を出力する。

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

時間比でstyleを混ぜる平均rateは凸結合そのものであり逆に全凸結合を実現できる。距離Dへ時間D/B、必要stamina D A/Bなので許容率A/B≤C/Dの中で最大Bが最短になる。支配された点を除いた下側hullだけで最大Bを達成でき、制約線との交点は二style混合で実現可能。chainの単調傾きからbinary searchでその辺を特定する。

## 実装上の注意

- 可否比較は A·D≤B·C を128 bitで行う。collinear/同一点の支配点を除き、凸包chainの向きとslope単調性を揃える。

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
