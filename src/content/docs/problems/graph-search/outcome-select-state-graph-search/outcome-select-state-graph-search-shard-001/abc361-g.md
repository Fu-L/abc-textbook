---
title: "ABC361-G — Go Territory"
draft: true
authoringUnit: {"problemId":"abc361-g","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc361-g.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search","tag-event-sweep"],"sourceRevisionIds":["source-abc361-editorial-10355-fa903d354a637287b02cc5a951981e5c8be5ba4737f17f92b245ca6fc792534b","source-abc361-g-problem-e7ae4c77ce0cced0a222ce1ed6380ab09770e31ccbe61d31b1c9049c13c16d51"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"box 外には石がなく、box 外周は四近傍で連結なので、box 内の空点が (−1,−1) に到達できることと、box 内だけを通って外周へ到達できることは同値である。外へ出る任意の経路も最初に外周を通る。\n\n各頂点が表す長方形は石を含まず四近傍で連結。同じ石行の異なる空区間は石で隔たれる。異なる block 間の四近傍接続は、隣接 block の x 区間が重なる場合に限り存在する。したがって長方形を一頂点へ縮約しても空点の連結成分は厳密に保存される。\n\n探索済み頂点は外へ出られる空点に、未探索頂点は囲まれた空点に対応する。各 block は重複せず、区間重みは石を除いた実格子点数なので、未探索重みの和が答えになる。長い空行や入れ子の囲みも同じ連結性判定で処理できる。","sourceRevisionIds":["source-abc361-editorial-10355-fa903d354a637287b02cc5a951981e5c8be5ba4737f17f92b245ca6fc792534b","source-abc361-g-problem-e7ae4c77ce0cced0a222ce1ed6380ab09770e31ccbe61d31b1c9049c13c16d51"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。

## 考察

無限平面の空格子点をそのまま探索できない。石のある行では空点の連続区間、石のない連続行では一つの大きな空長方形にまとめれば、連結性と格子点数を同時に保持できる。

採用する候補: 行ごとの空区間を頂点とする重み付き graph を作り、外周から flood fill する。

石は第一象限にあるので、有限 box x∈[−1,max X+1], y∈[−1,max Y+1] を取る。全石を厳密に内包し、box の外周は空で (−1,−1) と連結である。

石のある Y 座標を sort する。各石行は高さ 1 の block、間の連続した空行はまとめて高さ g の block とし、上下の空外周行も含める。石行の X 座標を sort し、box 内の石でない整数閉区間 [l,r] を列挙する。空行 block は全横幅の区間一つでよい。各区間長方形を一頂点とし、重みを (r−l+1)×block 高さにする。

隣接 block の区間を左右順の two pointers で比較し、x の共通部分があれば辺を張る。外周に触れる頂点から探索し、到達しない頂点の重みを足す。

棄却する候補: X,Y をそれぞれ圧縮して全組合せの grid を作る。

各軸 O(N) 座標でも全組合せは O(N²)。行の空区間だけを頂点化すれば総数は O(N) に抑えられる。

## 典型の発動条件

### 連結な空領域の状態圧縮

発動条件: 障害物が疎で、障害物のない長方形内部の全点が同じ連結状態を持つとき。

内部を一頂点にまとめ、隣接条件と実点数を保持する。座標差は閉区間の長さとして数える。

### 隣接区間列の線形 merge

発動条件: 隣り合う二層の互いに素な区間同士を、共通部分の有無で結ぶとき。

左右順の two pointers で交差 pair を列挙し、小さい右端を持つ側を進める。

## 問題固有の要素

石が第一象限に限られるため −1 の外周を空と保証できる。上下の空行 block を省くと外側の成分を誤って内部として数える。

別の問題へ持ち帰る視点: 二軸の直積を圧縮する前に、各層の連結区間だけを列挙できないか考える。

## 正当性

box 外には石がなく、box 外周は四近傍で連結なので、box 内の空点が (−1,−1) に到達できることと、box 内だけを通って外周へ到達できることは同値である。外へ出る任意の経路も最初に外周を通る。

各頂点が表す長方形は石を含まず四近傍で連結。同じ石行の異なる空区間は石で隔たれる。異なる block 間の四近傍接続は、隣接 block の x 区間が重なる場合に限り存在する。したがって長方形を一頂点へ縮約しても空点の連結成分は厳密に保存される。

探索済み頂点は外へ出られる空点に、未探索頂点は囲まれた空点に対応する。各 block は重複せず、区間重みは石を除いた実格子点数なので、未探索重みの和が答えになる。長い空行や入れ子の囲みも同じ連結性判定で処理できる。

## 実装上の注意

- 石行では連続する石の間に空区間がなければ頂点を作らない。空区間は整数閉区間で、長さは r−l+1。
- 空行 gap の高さは次の石行 Y−前の石行 Y−1。高さ 0 の block は作らない。
- 隣接 block の区間が重なれば辺を張り、右端が小さい側を進める。右端が等しければ両方進める。
- 面積と座標差は 64 bit 整数で持つ。探索は明示 stack または queue を使う。

## 復習の核

- 空長方形の内部連結性と block 間の接続条件を示し、縮約前後の成分が一致することを証明する。O(N²) の二軸直積を作らない。

## 計算量と制約

### 時間

石の sort は O(N log N)。block 数は O(N)、石行の空区間数は石数+1 以下なので頂点総数も O(N)。隣接 block の two pointers は区間数の和に線形で、各 block は高々二回参加するため全辺構築と探索は O(N)。全体 O(N log N)。

### 空間

石、block、空区間 graph、探索配列は O(N)。

### 制約との対応

座標範囲の面積に比例した配列を確保せず、石数に比例する状態だけを扱う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/editorial/10355) — source-abc361-editorial-10355-fa903d354a637287b02cc5a951981e5c8be5ba4737f17f92b245ca6fc792534b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc361/tasks/abc361_g) — source-abc361-g-problem-e7ae4c77ce0cced0a222ce1ed6380ab09770e31ccbe61d31b1c9049c13c16d51
