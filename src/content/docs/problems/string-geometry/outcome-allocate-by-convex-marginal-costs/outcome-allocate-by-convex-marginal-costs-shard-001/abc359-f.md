---
title: "ABC359-F — Tree Degree Optimization"
draft: true
authoringUnit: {"problemId":"abc359-f","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc359-f.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-greedy-exchange","unit-priority-queue-best-first"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-greedy-exchange-order","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc359-editorial-10260-2b6d1547de087bbf4176fd0e68c8db96a391c2283b8cae857798b0b04b0ffab8","source-abc359-f-problem-2b056103c3c211859dd536326e8594c8e2edc62f670339e9bf6745247be29142"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"木次数は正で和2N−2が必要十分なので次数1からN−2増分を配る問題になる。各頂点の限界費用は3A,5A,7A,…の非減少列。全列の最小N−2個を取ると、後の項だけ先に取られることはなくprefix条件を満たす。交換でより高費用の増分を含む他解を改善できるのでheap greedyが全体最小になる。","sourceRevisionIds":["source-abc359-editorial-10260-2b6d1547de087bbf4176fd0e68c8db96a391c2283b8cae857798b0b04b0ffab8","source-abc359-f-problem-2b056103c3c211859dd536326e8594c8e2edc62f670339e9bf6745247be29142"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=4、A=(1,2,3,4)。","procedure":["初期費用10、追加二回は3と5を頂点1へ。","次数(3,1,1,1)はstarで実現し費用9+2+3+4。"],"executionTarget":null,"expectedResult":"18。","verificationStatus":"not_applicable","learningUnitIds":["unit-separable-convex-marginals"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"prerequisiteIds":["unit-basic-convex-optimization","unit-greedy-exchange","unit-priority-queue-best-first"],"attainmentCondition":"N=2でheapから何回取るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0回。"},"answer":{"reasoningOrVerification":"追加N−2=0。唯一の木は各次数1なので答えA_1+A_2。","procedure":["具体例の各状態・寄与を再計算する。","追加N−2=0。唯一の木は各次数1なので答えA_1+A_2。"],"expectedResult":"0回。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

木の次数列は各d_i≥1かつ総和2N−2を満たし、逆にこの二条件を満たす整数列は木の次数列として実現できる。したがって辺そのものではなく次数の配分だけを最適化すればよい。

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

Prüfer codeにより次数列の二条件が十分でもあるため、最適な次数配分を得た後に木を構成する必要さえない。

別の問題へ持ち帰る視点: 構造最適化でも評価が低次元統計量だけなら、その統計量の実現可能領域を先に特徴付ける。

## 正当性

木次数は正で和2N−2が必要十分なので次数1からN−2増分を配る問題になる。各頂点の限界費用は3A,5A,7A,…の非減少列。全列の最小N−2個を取ると、後の項だけ先に取られることはなくprefix条件を満たす。交換でより高費用の増分を含む他解を改善できるのでheap greedyが全体最小になる。

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

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=4、A=(1,2,3,4)。

1. 初期費用10、追加二回は3と5を頂点1へ。
2. 次数(3,1,1,1)はstarで実現し費用9+2+3+4。

期待される結果: 18。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=2でheapから何回取るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

追加N−2=0。唯一の木は各次数1なので答えA_1+A_2。

確認結果: 0回。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/editorial/10260) — source-abc359-editorial-10260-2b6d1547de087bbf4176fd0e68c8db96a391c2283b8cae857798b0b04b0ffab8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/tasks/abc359_f) — source-abc359-f-problem-2b056103c3c211859dd536326e8594c8e2edc62f670339e9bf6745247be29142
