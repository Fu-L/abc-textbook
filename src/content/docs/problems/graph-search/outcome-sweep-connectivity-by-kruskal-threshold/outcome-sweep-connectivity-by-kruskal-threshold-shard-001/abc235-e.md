---
title: "ABC235-E — MST + 1"
draft: true
authoringUnit: {"problemId":"abc235-e","docPath":"src/content/docs/problems/graph-search/outcome-sweep-connectivity-by-kruskal-threshold/outcome-sweep-connectivity-by-kruskal-threshold-shard-001/abc235-e.md","learningOutcomeIds":["outcome-sweep-connectivity-by-kruskal-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-event-sweep","unit-spanning-tree-optimization"],"excludedTopics":["Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-kruskal-threshold-sweep","tag-dsu-components","tag-event-sweep"],"sourceRevisionIds":["source-abc235-e-problem-dccad2a4c2f5987ff301944fb9581b4434faa1a3d9c6056a2a351517fb96d800","source-abc235-editorial-3254-3f27d67a0dbdcf3850835b7081f4364b176de8ed7482511f3e8c04b5bfb48b7b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"質問辺重みwより軽い元辺だけで両端連結ならcycle交換で質問辺をMSTに入れられない。非連結なら重みwの選択順で質問辺を先に採りMSTを完成できる。同重み元辺をunion前に質問すればstrict条件を正しく保つ。","sourceRevisionIds":["source-abc235-e-problem-dccad2a4c2f5987ff301944fb9581b4434faa1a3d9c6056a2a351517fb96d800","source-abc235-editorial-3254-3f27d67a0dbdcf3850835b7081f4364b176de8ed7482511f3e8c04b5bfb48b7b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Kruskal順の閾値DSU sweep](src/content/docs/learn/graph/kruskal-threshold-sweep.md)

- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md) — 貪欲の交換論を土台に、cut・cycle性質から最適全域木の辺の採否条件を導く。DSUはKruskal順の閾値sweepで初めて必須にする。

## 考察

追加辺 e=(u,v,w) が Kruskal 法で選ばれるかは、重み w 未満の元グラフ辺を処理した時点で u と v がまだ非連結かだけで決まる。各クエリは独立で追加辺を実際には残さないため、全クエリの判定中に Union-Find を変化させるのは元グラフ辺だけである。答えを知るには完成した MST 自体は不要で、候補辺が現れる瞬間の軽い辺による連結性という途中状態だけで十分である。

棄却する候補: 各クエリで追加後の全辺をソートし直し、Kruskal 法で MST を再構築する。

M と Q がともに 20 万で、各クエリに全辺走査を行えない。

採用する候補: 元辺と全クエリを重み順に一緒に並べ、元辺では Union、クエリでは現在の連結性を読むだけの一回の sweep を行う。

各クエリを個別 Kruskal の重み w 時点まで進めた状態が、共通の元辺 sweep 上で完全に一致する。

Kruskal の選択条件を重み閾値付き連結性クエリへ切り出し、独立クエリを元辺だけが更新するオフライン Union-Find sweep に並列化する。

## 典型の発動条件

### Kruskal 順のオフラインクエリ

発動条件: 候補辺が MST に入るかを多数問われ、各候補追加は他クエリへ影響しないとき。

重み順イベント列で元辺を併合し、候補辺イベントでは端点 root の一致だけを判定する。

## 問題固有の要素

クエリ重みは元辺重みと異なる保証があるため、同重みで元辺を先に入れるか後に入れるかという MST のタイ処理が不要である。

別の問題へ持ち帰る視点: 重み sweep の問合せでは、判定が「未満」か「以下」かを確認し、同値イベントの処理順を入力保証と合わせる。

## 正当性

質問辺重みwより軽い元辺だけで両端連結ならcycle交換で質問辺をMSTに入れられない。非連結なら重みwの選択順で質問辺を先に採りMSTを完成できる。同重み元辺をunion前に質問すればstrict条件を正しく保つ。

## 実装上の注意

- イベントに元辺かクエリかと元のクエリ番号を保持し、ソート後も答えを入力順へ戻す。
- クエリイベントでは非連結なら Yes と記録するだけで、その端点を Union して後続状態を変えない。

## 復習の核

- MST クエリでは完成木を毎回作る前に、Kruskal のどの瞬間で答えが確定するかを切り出す。
- クエリが独立なら、問合せイベントを更新せず観測だけにして全クエリを一つの sweep へ載せる。

## 計算量と制約

### 時間

N頂点M元辺Q独立質問。sort O((M+Q)log(M+Q))、DSU O((M+Q)α(N))。

### 空間

辺、質問、DSU O(N+M+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; N - 1 \leq M \leq 2 \times 10^5; 1 \leq a_i \leq N (1 \leq i \leq M); 1 \leq b_i \leq N (1 \leq i \leq M); 1 \leq c_i \leq 10^9 (1 \leq i \leq M); c_i \neq c_j (1 \leq i \lt j \leq M); The graph G is connected.; 1 \leq Q \leq 2 \times 10^5; 1 \leq u_i \leq N (1 \leq i \leq Q); 1 \leq v_i \leq N (1 \leq i \leq Q); 1 \leq w_i \leq 10^9 (1 \leq i \leq Q); w_i \neq c_j (1 \leq i \leq Q, 1 \leq j \leq M); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/tasks/abc235_e) — source-abc235-e-problem-dccad2a4c2f5987ff301944fb9581b4434faa1a3d9c6056a2a351517fb96d800
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/editorial/3254) — source-abc235-editorial-3254-3f27d67a0dbdcf3850835b7081f4364b176de8ed7482511f3e8c04b5bfb48b7b
