---
title: "ABC301-EX — Difference of Distance"
draft: true
authoringUnit: {"problemId":"abc301-ex","docPath":"src/content/docs/problems/graph-search/outcome-identify-bridges-and-articulations/outcome-identify-bridges-and-articulations-shard-001/abc301-ex.md","learningOutcomeIds":["outcome-identify-bridges-and-articulations","outcome-sweep-connectivity-by-kruskal-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-event-sweep","unit-state-graph-search"],"excludedTopics":["次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。"],"tagIds":["tag-kruskal-threshold-sweep","tag-lowlink-critical-structure","tag-dsu-components","tag-event-sweep"],"sourceRevisionIds":["source-abc301-editorial-6344-dc0137a9d497b87c806f280bfaa16810971f41dec665b5150a4a92beaa240e2c","source-abc301-ex-problem-9af37d3cfd4c8a86125b566c017bbdc9dbc36b618b097122b0d5477141ecd9c3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"対象辺重みwがbottleneck Dより小さいなら1増えても≤D、大きいなら最適path不使用。w=DのときだけD以下graphでその辺を避けるS–T pathが争点になる。w未満成分の縮約後、同重み辺のbridgeがS,Tを反対側へ分けるときだけ代替不能。同重みをunion前に検査すれば必要十分の判定を得る。","sourceRevisionIds":["source-abc301-editorial-6344-dc0137a9d497b87c806f280bfaa16810971f41dec665b5150a4a92beaa240e2c","source-abc301-ex-problem-9af37d3cfd4c8a86125b566c017bbdc9dbc36b618b097122b0d5477141ecd9c3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [lowlinkで橋・関節点を特定する](src/content/docs/learn/graph/lowlink-critical-structure.md)

- DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。
- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 次数条件に基づく葉の反復削除と、答えを保つgraph core・kernelへの縮約。

## 考察

bottleneck距離D(S,T)は重み≤wのsubgraphでの連結閾値であり、一辺重みを1増やして答えが変わるのはその辺重みがDと等しい場合だけである。 w<Dなら更新後も≤D、w>Dなら最適pathは対象辺を使わない。w=Dだけ「D以下pathからその辺を除けるか」というbridge問題になる。

採用する候補: 重み別DSU縮約＋lowlink bridge判定

軽い辺成分を縮約した同重みgraphで対象辺がS-Tを分離するbridgeか判定すれば、その辺が全最適bottleneck pathに必須か分かる。

棄却する候補: 各queryで辺重み更新後にminimax shortest path

Q回graph探索で過大。

w<Dなら更新後も≤D、w>Dなら最適pathは対象辺を使わない。w=Dだけ「D以下pathからその辺を除けるか」というbridge問題になる。

辺を重み順に処理し、w未満辺をDSUで縮約する。同重み辺で作るcomponent graphへlowlinkとDFS順を構築し、queryのS,T連結閾値と対象edgeのbridge分離sideから距離増加有無を答える。

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

対象辺重みwがbottleneck Dより小さいなら1増えても≤D、大きいなら最適path不使用。w=DのときだけD以下graphでその辺を避けるS–T pathが争点になる。w未満成分の縮約後、同重み辺のbridgeがS,Tを反対側へ分けるときだけ代替不能。同重みをunion前に検査すれば必要十分の判定を得る。

## 実装上の注意

- 同重み辺はunion前にまとめてgraphを作り、多重辺をbridgeと誤判定しない。query端点を縮約代表へ写す。

## 復習の核

- 小graphで更新前後minimax Dijkstraと比較し、同重みparallel経路、対象辺がbridgeでもS-Tを分けない例を確認する。

## 計算量と制約

### 時間

N 頂点、M 辺、Q 質問。重みsort、同重みlowlink、接続閾値の復元木/LCA照会を使う実装は O((N+M+Q)log(N+M))。

### 空間

全重み群graph・DSU・復元木と照会表で O((N+M)log N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 2\times 10^5; N-1\leq M \leq 2\times 10^5; 1 \leq U_i,V_i \leq N; U_i \neq V_i; 1 \leq W_i \leq M; The given graph is connected.; 1\leq Q \leq 2\times 10^5; 1 \leq A_j \leq M; 1 \leq S_j,T_j \leq N; S_j\neq T_j; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6344) — source-abc301-editorial-6344-dc0137a9d497b87c806f280bfaa16810971f41dec665b5150a4a92beaa240e2c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_h) — source-abc301-ex-problem-9af37d3cfd4c8a86125b566c017bbdc9dbc36b618b097122b0d5477141ecd9c3
