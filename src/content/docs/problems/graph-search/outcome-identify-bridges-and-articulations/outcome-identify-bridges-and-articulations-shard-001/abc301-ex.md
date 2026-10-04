---
title: "ABC301-EX — Difference of Distance"
draft: true
authoringUnit: {"problemId":"abc301-ex","docPath":"src/content/docs/problems/graph-search/outcome-identify-bridges-and-articulations/outcome-identify-bridges-and-articulations-shard-001/abc301-ex.md","learningOutcomeIds":["outcome-identify-bridges-and-articulations","outcome-sweep-connectivity-by-kruskal-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-event-sweep","unit-state-graph-search"],"excludedTopics":["次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。"],"tagIds":["tag-kruskal-threshold-sweep","tag-lowlink-critical-structure","tag-dsu-components","tag-event-sweep"],"sourceRevisionIds":["source-abc301-editorial-6344-dc0137a9d497b87c806f280bfaa16810971f41dec665b5150a4a92beaa240e2c","source-abc301-ex-problem-9af37d3cfd4c8a86125b566c017bbdc9dbc36b618b097122b0d5477141ecd9c3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"元の最適値を D、変更辺の重みを w とする。w<D なら整数性により w+1≤D で、元の最適経路は引き続き使える。w>D なら D 以下の最適経路はその辺を使わない。いずれも変更で距離は減らないので増加は 0。\n\n第一 sweep の union 前・後の連結性はそれぞれ D<w、D≤w と同値なので、残る query は厳密に D=w。その query の端点は w 未満では別成分で、w 以下では同成分となるため、第二 sweep の局所 graph に両方の代表が現れ、同じ連結成分に属する。\n\nw 未満の成分内は変更辺によらず移動できる。したがって D 以下の代替経路が存在することと、縮約 graph で対象辺を除いても端点間が連結であることは同値。bridge でなければ連結性は失われず、bridge なら child subtree とそれ以外を分ける。tin,tout の XOR 判定がこの分離を表す。\n\n代替経路がなければ距離は w より大きくなるが、元の経路は変更後も w+1 以下なので、整数性から新距離はちょうど w+1。よって答えは 0 または 1 であり、上の判定は必要十分である。","sourceRevisionIds":["source-abc301-editorial-6344-dc0137a9d497b87c806f280bfaa16810971f41dec665b5150a4a92beaa240e2c","source-abc301-ex-problem-9af37d3cfd4c8a86125b566c017bbdc9dbc36b618b097122b0d5477141ecd9c3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [lowlinkで橋・関節点を特定する](src/content/docs/learn/graph/lowlink-critical-structure.md)

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。
- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 考察

bottleneck 距離 D(S,T) は、重み w 以下の辺で S,T が初めて連結になる閾値である。対象辺の重みを w から w+1 へ変えたとき、w<D なら変更後もその辺は D 以下、w>D なら最適経路に不要なので増加は 0。w=D の場合だけ代替経路の有無を調べる。

採用する候補: query を対象辺の重みで bucket に分け、DSU を二回 sweep する。一回目で D=w の query だけを残し、二回目で軽い辺成分を縮約した同重み graph の bridge を調べる。

棄却する候補: 各 query で minimax shortest path を計算する。

Q 回の graph 探索は大きすぎる。全 query の D を復元木で計算する必要もなく、対象重みとの三択比較だけで足りる。

第一 sweep は重み w ごとに、同重み辺を union する前に S,T が連結なら D<w として答え 0 を記録する。その重みの全辺を union した後も非連結なら D>w として 0。残った query だけが D=w である。

DSU を初期化して第二 sweep を行う。重み w 未満の成分代表のうち、w の辺の端点に現れるものだけを sort・unique して局所番号へ圧縮する。w の辺をこの局所多重 graph に張り、lowlink と DFS の tin,tout を求める。縮約でできた self-loop は bridge でない。平行辺は元の edge ID を保つ。

同重み辺を union する前に候補 query の S,T の代表を局所番号へ写す。対象辺が bridge で、その DFS child を c とすると、半開区間 [tin[c],tout[c]) に S,T の一方だけが属するとき増加は 1、ほかは 0。全 query を答えてから同重み辺を union する。

## 典型の発動条件

### minimax pathと閾値連結

発動条件: path costが最大辺重み。

重み以下edgeのDSU連結で距離を捉える。

### 縮約graphのbridge

発動条件: 全最適pathに特定edgeが必須か判定する。

軽辺成分を縮約し同重み辺のlowlinkを求める。

## 問題固有の要素

一増加という局所変更は、対象重みとbottleneck閾値が一致する層だけ見ればよく、その層では必須性がbridgeへ一致する。

別の問題へ持ち帰る視点: minimax感度解析はweight layerを縮約してbridgeを調べる。

## 正当性

元の最適値を D、変更辺の重みを w とする。w<D なら整数性により w+1≤D で、元の最適経路は引き続き使える。w>D なら D 以下の最適経路はその辺を使わない。いずれも変更で距離は減らないので増加は 0。

第一 sweep の union 前・後の連結性はそれぞれ D<w、D≤w と同値なので、残る query は厳密に D=w。その query の端点は w 未満では別成分で、w 以下では同成分となるため、第二 sweep の局所 graph に両方の代表が現れ、同じ連結成分に属する。

w 未満の成分内は変更辺によらず移動できる。したがって D 以下の代替経路が存在することと、縮約 graph で対象辺を除いても端点間が連結であることは同値。bridge でなければ連結性は失われず、bridge なら child subtree とそれ以外を分ける。tin,tout の XOR 判定がこの分離を表す。

代替経路がなければ距離は w より大きくなるが、元の経路は変更後も w+1 以下なので、整数性から新距離はちょうど w+1。よって答えは 0 または 1 であり、上の判定は必要十分である。

## 実装上の注意

- 同重み辺は batch として処理する。第二 sweep の局所 graph と S,T の写像は必ず union 前の代表から作る。
- lowlink は parent 頂点でなく parent edge ID だけを除外する。平行辺があると parent 頂点への別辺は back edge になる。
- 各 batch は端点に現れる代表だけを列挙する。全 N 頂点の配列を重みごとに初期化しない。DFS は非連結成分もすべて処理する。
- recursion の深さは M に達し得るため、環境に応じて明示 stack を使う。

## 復習の核

- D を求める代わりに union 前後の連結性で対象重みとの関係だけを判定する。bridge 判定まで union を遅らせる理由と、局所番号化の総計算量を説明する。

## 計算量と制約

### 時間

W_i≤M なので辺と query の重み bucket は O(N+M+Q)。batch の辺数を m_w とすると局所番号化の sort の総和は ΣO(m_w log(m_w+1))≤O(M log(M+1))。query の代表を二分探索で写す総時間は O(Q log(M+1))。局所頂点数は各 batch で 2m_w 以下なので lowlink の総和は O(M)。二回の DSU 操作は O((M+Q)α(N))。全体 O(N+(M+Q)log(M+1)+(M+Q)α(N))。

### 空間

辺・query bucket、DSU、局所 graph と DFS 配列を合わせて O(N+M+Q)。局所 graph の配列は batch ごとに破棄または再利用する。

### 制約との対応

重みの上限 M を bucket に使い、局所 graph の頂点を辺の端点だけに絞ることで、重みごとの O(N) 初期化を避ける。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6344) — source-abc301-editorial-6344-dc0137a9d497b87c806f280bfaa16810971f41dec665b5150a4a92beaa240e2c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_h) — source-abc301-ex-problem-9af37d3cfd4c8a86125b566c017bbdc9dbc36b618b097122b0d5477141ecd9c3
