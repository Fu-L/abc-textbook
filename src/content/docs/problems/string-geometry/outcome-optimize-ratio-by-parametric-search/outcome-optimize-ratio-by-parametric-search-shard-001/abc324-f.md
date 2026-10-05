---
title: "ABC324-F — Beautiful Path"
draft: true
authoringUnit: {"problemId":"abc324-f","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-ratio-by-parametric-search/outcome-optimize-ratio-by-parametric-search-shard-001/abc324-f.md","learningOutcomeIds":["outcome-optimize-ratio-by-parametric-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dag-topological-processing","unit-monotone-search"],"excludedTopics":["fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-fractional-parametric-search","tag-dag-topological-processing","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc324-editorial-7405-5317d02fe307ce10102a7967c7f3daf33d3d92a95198f8b7d90c973e18e2e531","source-abc324-f-problem-a176553a647da6e3d14065cf470eec98dd1f7f0cfc7f9e784e56d782ecb04ce2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"pathのcost和は正なので比≥xはΣ(b−xc)≥0と同値。頂点番号がtopological順であるためdp最大値は全pathの変換和最大を正確に求める。xを増やすと全pathの和が減るのでpredicateは単調、そのtrue上端が最大比になる。到達不能stateを負無限とすれば存在しないpathは混ざらない。","sourceRevisionIds":["source-abc324-editorial-7405-5317d02fe307ce10102a7967c7f3daf33d3d92a95198f8b7d90c973e18e2e531","source-abc324-f-problem-a176553a647da6e3d14065cf470eec98dd1f7f0cfc7f9e784e56d782ecb04ce2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [fractional programming・比率parametric search](src/content/docs/learn/geometry-optimization/fractional-parametric-search.md)

- 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。

先に読む単元:

- [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md) — 状態グラフのモデリングと探索で得た考え方と実装を再利用し、DAGのtopological processingの発動条件・正当化・境界を重複なく学ぶ。
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

## 考察

pathのbeauty/cost比がX以上という条件は、Σ(b_i-c_iX)≥0へ分母を払って加法的なpath weight条件にできる。

全edgeでu_i<v_iなので頂点番号順がtopological orderであり、固定Xでの最大path weightは1回のDAG DPで求められる。

Xを大きくすると全edgeの変換weightが減るため、達成可能性はtrueからfalseへ単調に変わる。

採用する候補: 候補比Xでedge weightをb-cXへ変換し、DAG最大path DPの可否を実数binary searchする。

ratio目的を線形和へ変換し、各判定を全edgeの一走査で行える。

棄却する候補: beauty最大pathとcost最小pathを別々に求め、その比を取る。

2つの最適値を達成するpathが同じとは限らず、ratio最適化にならない。

棄却する候補: 各edgeのb_i/c_iが最大のものを優先してpathを作る。

graphの接続制約と複数edgeの加重平均があり、局所ratioだけでは有効な1→N pathを選べない。

cost総和は正なのでratio不等式を掛け算しても向きが変わらず、変換後weight和の符号だけを見ればよい。

dp[v]=1からvへの最大変換weightとし、到達不能を−∞にすれば、全incoming edge u→vからdp[u]+b-cXをmax更新できる。

predicate(X)ではdp[1]=0、他−∞とし、u=1..Nの番号順に全outgoing edge(u,v,b,c)でdp[v]=max(dp[v],dp[u]+b-cX)を更新し、dp[N]≥0を返す。lower=0、upperを最大b_i/c_i以上に取り、十分な回数binary searchしてtrueならlower=mid、falseならupper=midとしlowerを出力する。

## 典型の発動条件

### fractional programmingのparametric search

発動条件: 正の分母を持つpath上の総和比を最大化するとき。

b-cXへ変換してratio≥Xを加法的可否にする。

### DAG longest path DP

発動条件: 負weightも含む有向acyclic graphで最大path和を求めるとき。

topological orderで−∞状態をrelaxする。

### 実数binary search

発動条件: 連続値Xに対するpredicateが単調で誤差許容出力のとき。

固定回数反復してtrue領域の上端へ収束させる。

## 問題固有の要素

pathごとに異なるcost総和を分母に持つが、候補Xとの差を各edgeへ分配すると、全pathを同じDAG DPで比較できる。

別の問題へ持ち帰る視点: 平均・比率の最適化は、候補値を引いたweighted sumの正負へ変換できないか試す。

## 正当性

pathのcost和は正なので比≥xはΣ(b−xc)≥0と同値。頂点番号がtopological順であるためdp最大値は全pathの変換和最大を正確に求める。xを増やすと全pathの和が減るのでpredicateは単調、そのtrue上端が最大比になる。到達不能stateを負無限とすれば存在しないpathは混ざらない。

## 実装上の注意

- 到達不能dpからedgeをrelaxせず、long doubleまたは十分な精度のdoubleと大きい負値を使う。
- 要求誤差10^-9に余裕を持つ反復回数を取り、最後にpredicate true側のlowerを出力する。

## 復習の核

- 異なるratioを持つ2本のpathでmidを挟み、変換weight和の符号とbinary search更新方向が元ratio比較に一致するか確認する。

## 計算量と制約

### 時間

O(I(N+M))。I回の実数二分探索でDAG DP。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq u_i \lt v_i \leq N; 1 \leq b_i, c_i \leq 10^4; There is a path from vertex 1 to vertex N.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc324/editorial/7405) — source-abc324-editorial-7405-5317d02fe307ce10102a7967c7f3daf33d3d92a95198f8b7d90c973e18e2e531
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc324/tasks/abc324_f) — source-abc324-f-problem-a176553a647da6e3d14065cf470eec98dd1f7f0cfc7f9e784e56d782ecb04ce2
