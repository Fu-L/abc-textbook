---
title: "ABC259-F — Select Edges"
draft: true
authoringUnit: {"problemId":"abc259-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc259-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-greedy-exchange"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc259-editorial-4287-3612bfdde67210806fa69102feb1a83f6ce40f8819df0ea69ef29e3a434f89e8","source-abc259-f-problem-ace555e2e0fe1e65c70f65d4e3021a56b88142ea4c5c68b9767e8d833d4964a9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"親辺を選ぶ場合だけ頂点 v の枠が一つ減る。全子辺を選ばない値を土台にすると、各子辺の採用は独立な利得一つと枠一つに分離する。同じ一枠を使うので正の利得を大きい順に取る交換法が最適。子の二状態が最適であるという帰納法で根の値が最適になる。","sourceRevisionIds":["source-abc259-editorial-4287-3612bfdde67210806fa69102feb1a83f6ce40f8819df0ea69ef29e3a434f89e8","source-abc259-f-problem-ace555e2e0fe1e65c70f65d4e3021a56b88142ea4c5c68b9767e8d833d4964a9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

木を根付き木にすると、異なる子部分木の選択は、親頂点に接続する選択辺の本数だけを通じて干渉する。親辺を選ぶかどうかで頂点vに残る上限が1本変わるため、その二状態を区別すればよい。 子uとの辺を選ばない基準値はdp_le[u]、選ぶとw(v,u)+dp_lt[u]になる。したがって子ごとの選択は、基準値に差分Δ=w+dp_lt[u]−dp_le[u]を上乗せする形へ分離できる。 dp_le[v]をvに接続する部分木内の辺をd_v本以下選べる最大値、dp_lt[v]をd_v本未満に制限した最大値とする。後者は親辺を選んで1枠使う場合に必要になる。 全子で辺を選ばない値Σdp_le[u]を土台にすれば、選ぶべきなのは正のΔだけである。各辺が同じく1枠を消費するため、大きい差分から取る貪欲法が最適になる。

棄却する候補: 各頂点で、どの子辺を選ぶかの部分集合を全列挙して部分木の最適値を求める。

次数の大きい頂点では子の部分集合数が指数的になり、N≤3×10^5を処理できない。

採用する候補: 親辺用の容量を残すかで二状態の木DPを作り、正の選択差分を大きい順に上限本数まで採用する。

子部分木の基準値は独立に足せ、残る制約は同じ価値1の枠へ入れる差分を高々d_v個選ぶことだけになる。

dp_le[v]をvに接続する部分木内の辺をd_v本以下選べる最大値、dp_lt[v]をd_v本未満に制限した最大値とする。後者は親辺を選んで1枠使う場合に必要になる。

全子で辺を選ばない値Σdp_le[u]を土台にすれば、選ぶべきなのは正のΔだけである。各辺が同じく1枠を消費するため、大きい差分から取る貪欲法が最適になる。

任意の根からpostorderで処理する。各vでbase=Σdp_le[u]と各子のΔを求めて降順に並べ、正の先頭d_v個を足してdp_le[v]、正の先頭d_v−1個を足してdp_lt[v]とする。d_v=0のdp_lt[v]は実現不能値にし、根のdp_leを答える。

## 典型の発動条件

### 親辺の選択余地を表す二状態木DP

発動条件: 木上の選択で各頂点に次数上限があり、親との辺を選ぶと子側に使える枠が一つ減るとき。

各部分木について上限d_vまで使える値と、親辺のために一枠空けた値を保持する。

### 独立選択の差分貪欲

発動条件: 基準案から各候補を選ぶ増分が独立で、各候補が同じ1枠を消費し、個数上限だけがあるとき。

子辺を選ぶ差分Δのうち正で大きいものを、頂点の残り枠数まで採用する。

## 問題固有の要素

辺の重みが負でも特別な場合分けは不要で、部分木最適値まで含む差分Δが非正なら選ばないという統一した判断になる。

別の問題へ持ち帰る視点: 局所選択の価値は入力上の辺重みだけでなく、選択によって子状態が変わる機会費用との差として比較する。

## 正当性

親辺を選ぶ場合だけ頂点 v の枠が一つ減る。全子辺を選ばない値を土台にすると、各子辺の採用は独立な利得一つと枠一つに分離する。同じ一枠を使うので正の利得を大きい順に取る交換法が最適。子の二状態が最適であるという帰納法で根の値が最適になる。

## 実装上の注意

- d_v=0ではdp_lt[v]を作れない。親がその辺を選ぶ候補へ実現不能値が混ざって正の差分にならないよう、十分小さい64bit値を一貫して扱う。
- 再帰深度がNに達する木を考慮し、反復DFSの順序を逆走査するか、実行環境で安全な走査方法を使う。DP合計は64bit整数で保持する。

## 復習の核

- 二状態を単なる『親辺を選ぶ／選ばない』と曖昧にせず、部分木内でvに接する辺を何本まで許す値かを定義し、Δに子側の一枠の機会費用が含まれることを確認する。

## 計算量と制約

### 時間

N 頂点。各子利得の sort で O(Σ_v deg(v)log(deg(v)+1))⊆O(N log N)。

### 空間

木、二状態 DP、利得列で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3 \times 10^5; 1 \leq u_i, v_i \leq N; -10^9 \leq w_i \leq 10^9; d_i is a non-negative integer not exceeding the degree of Vertex i.; The given graph is a tree.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc259/editorial/4287) — source-abc259-editorial-4287-3612bfdde67210806fa69102feb1a83f6ce40f8819df0ea69ef29e3a434f89e8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc259/tasks/abc259_f) — source-abc259-f-problem-ace555e2e0fe1e65c70f65d4e3021a56b88142ea4c5c68b9767e8d833d4964a9
