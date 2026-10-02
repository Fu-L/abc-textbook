---
title: "ABC338-F — Negative Traveling Salesman"
draft: true
authoringUnit: {"problemId":"abc338-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc338-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-weighted-shortest-path"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-shortest-path"],"sourceRevisionIds":["source-abc338-editorial-9170-0547dd2070c8672755ddefc73c4931953514fb9b26bbac55b5feff56a4ee3c2e","source-abc338-f-problem-3bd2d4f58dc54a3808d0f8d12cefc87a8165a6dc4a30746fd31e162afd914735"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"任意全頂点walkの初訪問順を取ると各区間costはAPSP距離以上。逆にその順の最短区間をつなげれば全頂点walkが作れる。よってAPSP距離で全順序を最小化するsubset DPと最適walk値が等しい。負閉路なしで区間最短が有限に定義される。","sourceRevisionIds":["source-abc338-editorial-9170-0547dd2070c8672755ddefc73c4931953514fb9b26bbac55b5feff56a4ee3c2e","source-abc338-f-problem-3bd2d4f58dc54a3808d0f8d12cefc87a8165a6dc4a30746fd31e162afd914735"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

頂点iからjへwalkの途中で何頂点を通ってもよいので、まずその区間を最短距離d[i][j]へ置換できる。全頂点をある順序で代表点として並べ、その隣接間を最短walkで結ぶ問題へ帰着する。 任意の実行可能walkから各頂点を一度ずつ選んだ出現順pを取り出すと、選択頂点間の部分walkを最短路へ置換して重みを増やさない。逆に任意の順列間の最短路を連結すれば全頂点を少なくとも一度訪れるため、順列上の最小和と答えが一致する。

採用する候補: Floyd–Warshall後にbitmask Hamiltonian-path DPを行う

N≤20なので全順序を2^N状態へ圧縮でき、負辺も負閉路なしのall-pairs shortest pathで正しく扱える。

棄却する候補: 元graphのwalkを状態なしで最短路探索する

訪問済み頂点集合を区別しなければ全頂点訪問条件を判定できず、同じ頂点への再訪もある。

任意の実行可能walkから各頂点を一度ずつ選んだ出現順pを取り出すと、選択頂点間の部分walkを最短路へ置換して重みを増やさない。逆に任意の順列間の最短路を連結すれば全頂点を少なくとも一度訪れるため、順列上の最小和と答えが一致する。

edge重みからFloyd–Warshallでdを求める。dp[mask][i]をmask内の頂点を代表順として訪ねiで終わる最小costとし、全iでdp[1<<i][i]=0、j∉maskへdp[mask|1<<j][j]=min(...,dp[mask][i]+d[i][j])を行う。full mask最小がINFならNo。

## 典型の発動条件

### metric closure

発動条件: walkの区間で中間頂点再訪を許し、端点間の最安costだけが後段に必要である。

負辺を含む有向graphの全点対最短距離をFloyd–Warshallで計算する。

### bitmask DP

発動条件: N≤20で、訪問対象集合と最後の頂点が将来costを決める。

部分集合maskと終点iを状態にし、未選択頂点を次の代表点として加える。

## 問題固有の要素

shortest pathがmask外頂点を途中で通っても問題はなく、maskは実際の全訪問集合ではなく順列で明示的に選んだ代表頂点集合と解釈する。

別の問題へ持ち帰る視点: metric closure後のsubset DPでは、中間経路が未選択対象を先取りしても「少なくとも一度」条件なら許容できる。

## 正当性

任意全頂点walkの初訪問順を取ると各区間costはAPSP距離以上。逆にその順の最短区間をつなげれば全頂点walkが作れる。よってAPSP距離で全順序を最小化するsubset DPと最適walk値が等しい。負閉路なしで区間最短が有限に定義される。

## 実装上の注意

- INF同士やINF+負値の加算を避け、costは64bitを使う。full maskの全終点がINFの場合だけNoとする。

## 復習の核

- 到達不能な有向graph、負辺を含むが負cycleなし、最短路が別の未選択頂点を経由する例を小規模walk探索と比較する。

## 計算量と制約

### 時間

N≤20、M辺。Floyd O(N³)、subset TSP O(N²2^N)。

### 空間

距離O(N²)、mask×last O(N2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 20; 1\leq M \leq N(N-1); 1\leq U_i,V_i \leq N; U_i \neq V_i; (U_i,V_i) \neq (U_j,V_j) for i\neq j; -10^6\leq W_i \leq 10^6; The given graph does not contain negative cycles.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc338/editorial/9170) — source-abc338-editorial-9170-0547dd2070c8672755ddefc73c4931953514fb9b26bbac55b5feff56a4ee3c2e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc338/tasks/abc338_f) — source-abc338-f-problem-3bd2d4f58dc54a3808d0f8d12cefc87a8165a6dc4a30746fd31e162afd914735
