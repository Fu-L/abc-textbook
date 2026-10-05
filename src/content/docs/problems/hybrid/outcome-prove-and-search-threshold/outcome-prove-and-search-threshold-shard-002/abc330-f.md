---
title: "ABC330-F — Minimize Bounding Square"
draft: true
authoringUnit: {"problemId":"abc330-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc330-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-prefix-aggregate"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-basic-convex-optimization","tag-prefix-difference"],"sourceRevisionIds":["source-abc330-editorial-7753-dbcbe9a7817397803a66a446c6015dcdc62e451709ee1cf5e569a8a02998f96e","source-abc330-f-problem-8a90fa5e29d8244512c0ca99393824aab8100d938e9f9557e108155083428871"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"sorted Vとprefix sumがあれば、l未満のcost=l·count−sum、l+d超のcost=sum−(l+d)·countとしてinterval costを対数時間評価できる。 cost(l)はdiscrete convexで、lを右へ1動かす差分は左側点数−右側点数として単調増加するため、最小lをbinary searchできる。 2次元の移動budgetを独立な1次元凸最適化へ分け、巨大座標を1ずつ動かさず最小整数sideを判定できる。","sourceRevisionIds":["source-abc330-editorial-7753-dbcbe9a7817397803a66a446c6015dcdc62e451709ee1cf5e569a8a02998f96e","source-abc330-f-problem-8a90fa5e29d8244512c0ca99393824aab8100d938e9f9557e108155083428871"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

side長dのsquareに全点を入れる条件は、x座標をある長さdのintervalへ、y座標も別の長さdのintervalへ移すことに分離できる。

固定axis・interval [l,l+d]への最小移動costは、外側の座標だけをnearest endpointへclampしたΣdistanceである。

axisごとの最小clamp costの和がK以下かはdを増やすほど成立しやすく、整数dについて単調判定になる。

採用する候補: side長dをbinary searchし、各axisで長さd intervalへの最小L1 clamp costをsorted座標とprefix sumから求める。

棄却する候補: 各operationを1回ずつ使い、現在spanが大きいaxisの端点を内側へ動かす。

Kが4×10^14で1-step simulationは不可能で、同じextreme集合をまとめて処理する必要がある。

棄却する候補: x,yを同じ中心へ集めるcostだけを最小化する。

最適squareはside d>0のintervalを各axisで別位置に置け、1点へ集約する必要はない。

X,Yを別々にsortしてprefix sumを作る。axisCost(V,d)ではlを[min V,max V]でdiscrete convex searchし、Σ_{v<l}(l-v)+Σ_{v>l+d}(v-l-d)の最小を返す。predicate(d)=axisCost(X,d)+axisCost(Y,d)≤Kとし、d=0..max(initial x-span,y-span)をinteger binary searchして最小trueを出力する。

## 典型の発動条件

### answer binary search

発動条件: 整数bound dを緩めると必要costが単調減少する最小化問題。

side長固定の可否を判定して最小dを探す。

### intervalへのL1 clamp

発動条件: 1次元点群を長さ固定interval内へ移す最小総距離。

外側だけを両endpointへ寄せる。

### sorted prefix sumでの距離和

発動条件: threshold左・右の全点との距離和を繰り返し評価するとき。

count×endpoint−sumで計算する。

### discrete convex minimization

発動条件: interval位置lのcost差分が単調なとき。

差分の符号が変わる位置をbinary searchする。

## 問題固有の要素

squareのx/y interval位置は独立に選べ、操作costもManhattanのaxis和なので、共通なのはside長dとbudgetの加算だけになる。

別の問題へ持ち帰る視点: axis-aligned bounding形状のL1移動最適化は、形状sizeを固定して各axisのclamp問題へ分離する。

## 正当性

sorted Vとprefix sumがあれば、l未満のcost=l·count−sum、l+d超のcost=sum−(l+d)·countとしてinterval costを対数時間評価できる。 cost(l)はdiscrete convexで、lを右へ1動かす差分は左側点数−右側点数として単調増加するため、最小lをbinary searchできる。 2次元の移動budgetを独立な1次元凸最適化へ分け、巨大座標を1ずつ動かさず最小整数sideを判定できる。

## 実装上の注意

- costは最大4×10^14級なので64bit整数を使い、Kを超えた時点でcapしてoverflowを避けてもよい。
- interval endpoint l+dとupper_boundのinclusive条件を揃え、既にinterval内の点へcostを加えない。

## 復習の核

- 片axisだけspanが大きい例と、両axisへbudgetを分ける例で、predicateがaxis別最小costの和になることを確認する。

## 計算量と制約

### 時間

O(N log N+log²C log N)、Cは座標幅。外側幅二分×内側convex位置二分×prefix評価。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 2 \times 10^5; 0 \le K \le 4 \times 10^{14}; 0 \le X_i, Y_i \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc330/editorial/7753) — source-abc330-editorial-7753-dbcbe9a7817397803a66a446c6015dcdc62e451709ee1cf5e569a8a02998f96e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc330/tasks/abc330_f) — source-abc330-f-problem-8a90fa5e29d8244512c0ca99393824aab8100d938e9f9557e108155083428871
