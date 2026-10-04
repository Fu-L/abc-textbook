---
title: "ABC355-E — Guess the Sum"
draft: true
authoringUnit: {"problemId":"abc355-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc355-e.md","learningOutcomeIds":["outcome-select-state-graph-search","outcome-maintain-interactive-query-protocol"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-shortest-path-reconstruction"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interactive-protocol","tag-state-graph-search","tag-shortest-path-certificate"],"sourceRevisionIds":["source-abc355-e-problem-64c12f61dd7d978a64c4258c01ccd92495be86135b14a644c46ce7dbb61650ae","source-abc355-editorial-10079-ae8439019596192c5ef65db0f13e1f126c02b42ad285c9ae2ae4cff8f5388371"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dyadic質問和はprefix二境界差。境界pathの符号付き質問を足すと中間prefixが相殺され目的差になる。任意質問集合で目的差を表すには端点が同辺支持成分でつながる必要がありその支持はpathを含む。BFS最短pathは必要最少質問数を達成する。","sourceRevisionIds":["source-abc355-e-problem-64c12f61dd7d978a64c4258c01ccd92495be86135b14a644c46ce7dbb61650ae","source-abc355-editorial-10079-ae8439019596192c5ef65db0f13e1f126c02b42ad285c9ae2ae4cff8f5388371"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。

先に読む単元:

- [最短路を証明する木・経路の復元](src/content/docs/learn/graph/shortest-path-reconstruction.md) — 最短距離を計算できるようになった後、距離等式を満たす親辺を記録して最短路木・実現経路を復元する。

## 考察

質問区間は長さ2^iでその倍数境界を端点に持つ。区間和は加法的で逆向きなら符号を反転できるため、複数質問の和差で目的区間を作れる。 prefix 境界0..2^Nを頂点、質問可能区間の両端を無向辺とすると、LからR+1への path が質問列、その長さが質問数になる。 S(x,z)=S(x,y)+S(y,z) なので path 上の辺区間和を向きに応じて加減すれば目的 S(L,R+1) へ telescoping する。 各 dyadic interval は一辺で、全辺数はΣ2^{N−i}=2^{N+1}−1 のため N≤18 なら graph を明示して BFS できる。

採用する候補: prefix 境界 graph で L→R+1 の最短 path を BFS し、各辺を向き付きで質問して返答を加減する。

任意の質問戦略は辺の線形結合に対応し、最短 path は必要最小質問数 m を達成する構成を直接与える。

棄却する候補: 目的区間を disjoint dyadic intervals に貪欲分解して各区間を質問する。

引き算を許す本問では大区間から余分を引く方が少ない場合があり、分割のみでは最小質問数を保証しない。

S(x,z)=S(x,y)+S(y,z) なので path 上の辺区間和を向きに応じて加減すれば目的 S(L,R+1) へ telescoping する。

各 dyadic interval は一辺で、全辺数はΣ2^{N−i}=2^{N+1}−1 のため N≤18 なら graph を明示して BFS できる。

頂点0..2^Nを用意し、全 i,j について u=2^ij,v=2^i(j+1) を辺で結ぶ。BFS で L から R+1 の parent edge を復元する。path 順に ? i j を出力・flushし、u→vなら応答を加え、v→uなら引く。法100へ正規化して ! ans を出力する。

## 典型の発動条件

### 加法的区間 query の境界 graph

発動条件: 許可区間の和を質問でき、答え同士を加減して目的区間を復元するとき。

prefix 境界を頂点、許可区間を辺として最少質問を shortest path にする。

### interactive path reconstruction

発動条件: 最短操作列を実際に問い合わせ、向きで応答を合成する必要があるとき。

BFS parent から edge label と traversal direction を復元し、逐次flushする。

## 問題固有の要素

区間分割問題ではなく、区間和の逆元が使える群上の path 合成問題と見ることで、補集合を引く短い解も自然に含まれる。

別の問題へ持ち帰る視点: query 結果に逆演算があるなら、被覆ではなく生成 graph 上の最短表現を考える。

## 正当性

dyadic質問和はprefix二境界差。境界pathの符号付き質問を足すと中間prefixが相殺され目的差になる。任意質問集合で目的差を表すには端点が同辺支持成分でつながる必要がありその支持はpathを含む。BFS最短pathは必要最少質問数を達成する。

## 実装上の注意

- 目的終点は R でなく R+1。逆向き traversal の応答を引き、負値を mod100へ戻す。各質問後に必ずflushし、judge error応答なら終了する。

## 復習の核

- 区間を半開 [L,R+1) に直し、各質問を prefix 境界間の差として描く。対話実装前に path の向きと加減符号を固定する。

## 計算量と制約

### 時間

境界頂点V=2^N+1、全dyadic辺E=Σ_i2^(N−i)<2^(N+1)。graph構築/BFS O(2^N)、質問は最短path長m回。

### 空間

境界graph、parentで O(2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 18; 0 \leq L \leq R \leq 2^N - 1; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/tasks/abc355_e) — source-abc355-e-problem-64c12f61dd7d978a64c4258c01ccd92495be86135b14a644c46ce7dbb61650ae
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc355/editorial/10079) — source-abc355-editorial-10079-ae8439019596192c5ef65db0f13e1f126c02b42ad285c9ae2ae4cff8f5388371
