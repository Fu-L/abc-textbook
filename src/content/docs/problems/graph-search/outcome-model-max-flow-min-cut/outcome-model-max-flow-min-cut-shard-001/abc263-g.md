---
title: "ABC263-G — Erasing Prime Pairs"
draft: true
authoringUnit: {"problemId":"abc263-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc263-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut","tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc263-g-problem-3544fd0611c86c99fb427893ed0daac8d5d820123490945d6cbcf37e3d5b5132","source-abc263-editorial-4537-eed6c766625e13546e78cdb7556166cabe8920898c0876286cb352dc7c4567e2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"(1,1) の使用回数 k を固定すると、残る奇偶の消去は整数容量の最大流と一致する。値 1 の source 辺の容量 c だけを変える。任意の cut の費用は、この辺を切らなければ c に依存しない定数、切れば c+定数である。各種類の最小定数を F,H とすると f(c)=min(F,c+H)。\n\nH≥F なら全区間で f(c)=F=h=t。H<F なら h=H、t=min(F,b+H) なので、0≤c≤b では f(c)=min(t,c+h)。したがって二回の最大流の端点値 h,t から全 c の値が決まる。\n\ng(k)=min(t+k,b+h−k) は増加直線と減少直線の小さい方である。実数の交点の左右で単調性が変わるため、許容整数区間内の最適点は交点の floor・ceil を clamp した値か端点にある。これらを比較すると、すべての例外 pair 使用回数を考慮した最大消去数を得る。","sourceRevisionIds":["source-abc263-g-problem-3544fd0611c86c99fb427893ed0daac8d5d820123490945d6cbcf37e3d5b5132","source-abc263-editorial-4537-eed6c766625e13546e78cdb7556166cabe8920898c0876286cb352dc7c4567e2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

正の整数の素数和は、(1,1) を除けば奇数と偶数の組に限る。個数 B_i を容量として奇偶間に最大流を張れば、(1,1) 以外の最大消去数を求められる。

採用する候補: 値 1 の個数を b とし、その source 辺容量を 0、b にした二回の最大流だけで、例外 pair の最適使用回数を決める。

容量 c のときの最大流を f(c)、h=f(0)、t=f(b) とすると、0≤c≤b では f(c)=min(t,c+h)。最大流・最小 cut の定理で、変化する辺を切る cut と切らない cut に分けると導ける。k 個の (1,1) を使う総消去数は g(k)=k+f(b−2k)=min(t+k,b+h−k)。二直線の交点付近だけを比較すればよい。

棄却する候補: 個数分だけ頂点を展開する、または全 k を列挙する。

B_i≤10^9 なのでどちらも大きすぎる。値を頂点、個数を容量に残す。

source→奇数値に個数容量、偶数値→sink に個数容量、素数和の奇偶間に INF>ΣB_i の辺を張る。値 1 がなければ b=0。k は 0..⌊b/2⌋ で、交点 (b+h−t)/2 の floor・ceil をこの範囲へ clamp し、両端も含め比較する。

## 典型の発動条件

### 多重要素ペアリングの容量付き最大流

発動条件: 値種類は少ないが各種類の個数が巨大で、異なる二群間の許可ペアを最大化するとき。

種類を頂点、個数をsource/sink辺容量、許可関係を大容量辺にする。

### 例外辺数固定による二部化

発動条件: ほぼ二部グラフだが少数種類の同側辺だけが構造を壊しているとき。

例外辺の使用回数を固定し、残余容量上の二部問題を解く。

### 一辺容量の変化と最小 cut

発動条件: network の一辺だけの容量を変えて最大流の値を求めるとき。

その辺を切る cut と切らない cut に分け、定数と一次関数の下包絡を導く。

## 問題固有の要素

奇偶の二部性を壊すのは値 1 の自己 pair だけ。一般グラフ matching へ進む前に、例外を一つの容量変数へ切り出す。

別の問題へ持ち帰る視点: 最大流の一辺容量だけを変えると、最小 cut をその辺を切るか否かで分類でき、流量値が二直線の下包絡になる。

## 正当性

(1,1) の使用回数 k を固定すると、残る奇偶の消去は整数容量の最大流と一致する。値 1 の source 辺の容量 c だけを変える。任意の cut の費用は、この辺を切らなければ c に依存しない定数、切れば c+定数である。各種類の最小定数を F,H とすると f(c)=min(F,c+H)。

H≥F なら全区間で f(c)=F=h=t。H<F なら h=H、t=min(F,b+H) なので、0≤c≤b では f(c)=min(t,c+h)。したがって二回の最大流の端点値 h,t から全 c の値が決まる。

g(k)=min(t+k,b+h−k) は増加直線と減少直線の小さい方である。実数の交点の左右で単調性が変わるため、許容整数区間内の最適点は交点の floor・ceil を clamp した値か端点にある。これらを比較すると、すべての例外 pair 使用回数を考慮した最大消去数を得る。

## 実装上の注意

- 最大値の二倍 U まで sieve で素数表を作り、全奇偶 pair を判定する。容量・流量・g(k) は 64 bit 整数を使う。
- 二回の最大流は、それぞれ初期化した network で計算する。残余 graph をそのまま流用して容量だけ小さくしない。
- b=0、奇数 b、交点の半整数を扱う。浮動小数は不要で、b+h−t の整数除算から候補を作れる。

## 復習の核

- f(c)=min(F,c+H) を cut の分類から導き、h=f(0), t=f(b) が全区間を決めることを証明する。三分探索の凹性を根拠なく仮定しない。

## 計算量と制約

### 時間

U=2max A_i とすると sieve は O(U log log U)、奇偶 pair の列挙は O(N²)。頂点 O(N)、辺 O(N²) の一般容量 network で Dinic の安全な上界は一回 O(N²E)=O(N⁴)。最大流は二回だけで、全体 O(U log log U+N⁴)。個数 B_i に比例する反復はない。

### 空間

素数表 O(U)、network O(N²)、合計 O(U+N²)。

### 制約との対応

A_i≤10^7、N≤100 なので素数表を一度作り、小さい容量 network で巨大な B_i を扱う。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/tasks/abc263_g) — source-abc263-g-problem-3544fd0611c86c99fb427893ed0daac8d5d820123490945d6cbcf37e3d5b5132
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/editorial/4537) — source-abc263-editorial-4537-eed6c766625e13546e78cdb7556166cabe8920898c0876286cb352dc7c4567e2
