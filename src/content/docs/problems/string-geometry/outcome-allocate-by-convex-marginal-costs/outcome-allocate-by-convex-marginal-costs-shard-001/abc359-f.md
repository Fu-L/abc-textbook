---
title: "ABC359-F — Tree Degree Optimization"
draft: true
authoringUnit: {"problemId":"abc359-f","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc359-f.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-greedy-exchange","unit-priority-queue-best-first"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-greedy-exchange-order","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc359-editorial-10260-2b6d1547de087bbf4176fd0e68c8db96a391c2283b8cae857798b0b04b0ffab8","source-abc359-f-problem-2b056103c3c211859dd536326e8594c8e2edc62f670339e9bf6745247be29142"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"次数条件の十分性は葉を取り除く帰納法で示せる。N=2なら正次数で和2となる列は(1,1)だけである。N>2では全次数が2以上だと和が2N以上になり、全次数が1だと和がNなので、次数1の頂点ℓと次数2以上の頂点jが存在する。ℓを除きjの次数を1減らすと、正次数で和2(N−1)−2の列になる。帰納的に木を作り、ℓをjへ葉としてつなげば元の次数列を実現できる。\n\nよって次数1からN−2個の増分を配るだけで、実現可能な木の次数列をちょうど網羅する。各頂点の増分列3A_i,5A_i,7A_i,…は増加列なので、heapで全列の先頭の最小値を取り続けると全増分の最小N−2個が選ばれる。各列で後の項を選ぶ前に前の項も選ばれるため、この選択は実行可能である。他の選択がより高い増分を含めば安い未選択増分と交換できるので最小費用となる。","sourceRevisionIds":["source-abc359-editorial-10260-2b6d1547de087bbf4176fd0e68c8db96a391c2283b8cae857798b0b04b0ffab8","source-abc359-f-problem-2b056103c3c211859dd536326e8594c8e2edc62f670339e9bf6745247be29142"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md) — 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

木の次数列は各d_i≥1かつ総和2N−2を満たし、逆にこの二条件を満たす整数列は木の次数列として実現できる。したがって辺そのものではなく次数の配分だけを最適化すればよい。

次数条件の十分性は葉を取り除く帰納法で示せる。

頂点iの次数をdからd+1へ増やす追加費用はA_i((d+1)^2−d^2)=A_i(2d+1)で、同じ頂点では選ぶたび単調に増える。

採用する候補: 全次数を1から始め、現在の限界費用A_i(2d_i+1)が最小の頂点をpriority queueでN−2回選ぶ。

分離された凸費用へ同数の単位増分を配る問題であり、未選択の最小増分を順に取る交換法が成立する。

棄却する候補: 候補となる木の辺集合を直接選び、得られた次数から費用を比較する。

木の形は指数的に多い一方、目的関数が必要とする情報は次数だけなので不要な構造を探索している。

初期次数1の総和Nから必要な2N−2まで、ちょうどN−2回だけ単位増分を配ればよい。

各頂点の増分列3A_i,5A_i,7A_i,...は非減少なので、全列の先頭の最小値をmergeする貪欲として見られる。

answer=ΣA_i、d_i=1で初期化し、各頂点の次の増分3A_iをheapへ入れる。N−2回、最小増分をanswerへ加えた頂点のd_iを1増やし、新しいA_i(2d_i+1)をheapへ戻す。

## 典型の発動条件

### 次数列への射影

発動条件: 木の目的関数が各頂点の次数だけで決まるとき。

木構造を消去し、実現可能な次数の総和制約へ置き換える。

### 分離凸費用の限界値貪欲

発動条件: 固定個数の単位資源を、増分費用が単調な複数対象へ配るとき。

priority queueで現在最小の次増分を選び続ける。

## 問題固有の要素

正次数・総和2N−2という条件が木としての実現可能性を完全に特徴付ける。葉を除く帰納構成により、次数配分の最適解が木の最適解でもあると保証できる。

別の問題へ持ち帰る視点: 評価が統計量だけで決まるときは、その統計量の実現可能領域を両方向に示してから構造を消去する。

## 正当性

次数条件の十分性は葉を取り除く帰納法で示せる。N=2なら正次数で和2となる列は(1,1)だけである。N>2では全次数が2以上だと和が2N以上になり、全次数が1だと和がNなので、次数1の頂点ℓと次数2以上の頂点jが存在する。ℓを除きjの次数を1減らすと、正次数で和2(N−1)−2の列になる。帰納的に木を作り、ℓをjへ葉としてつなげば元の次数列を実現できる。

よって次数1からN−2個の増分を配るだけで、実現可能な木の次数列をちょうど網羅する。各頂点の増分列3A_i,5A_i,7A_i,…は増加列なので、heapで全列の先頭の最小値を取り続けると全増分の最小N−2個が選ばれる。各列で後の項を選ぶ前に前の項も選ばれるため、この選択は実行可能である。他の選択がより高い増分を含めば安い未選択増分と交換できるので最小費用となる。

## 実装上の注意

- 初期費用ΣA_iを忘れず、追加回数はN−2とする。増分と答えは符号付き64 bitに収まる保証を利用する。

## 復習の核

- 目的式をd_iからd_i+1へ変えた差分まで展開する。heap要素が「現在費用」ではなく「次に1増やす費用」だと確認する。

## 計算量と制約

### 時間

O(N log N)。N−2回のheap最小限界費用選択。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 1\leq A_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/editorial/10260) — source-abc359-editorial-10260-2b6d1547de087bbf4176fd0e68c8db96a391c2283b8cae857798b0b04b0ffab8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/tasks/abc359_f) — source-abc359-f-problem-2b056103c3c211859dd536326e8594c8e2edc62f670339e9bf6745247be29142
