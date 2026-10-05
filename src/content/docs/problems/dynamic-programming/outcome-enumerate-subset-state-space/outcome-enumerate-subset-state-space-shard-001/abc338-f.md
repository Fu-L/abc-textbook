---
title: "ABC338-F — Negative Traveling Salesman"
draft: true
authoringUnit: {"problemId":"abc338-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc338-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-weighted-shortest-path"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-shortest-path"],"sourceRevisionIds":["source-abc338-editorial-9170-0547dd2070c8672755ddefc73c4931953514fb9b26bbac55b5feff56a4ee3c2e","source-abc338-f-problem-3bd2d4f58dc54a3808d0f8d12cefc87a8165a6dc4a30746fd31e162afd914735"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"実行可能walkから時系列順に全頂点の代表出現を選べば、代表間の区間がwalk全体を分割し、APSP距離の和は元の費用以下となる。閉walkは負閉路なしの条件から非負費用で、非負辺を一つ切って開walkにしても全頂点と費用上界を保てる。逆に任意の代表頂点順にAPSP最短路をつなげれば、各代表を通るため全頂点を訪れるwalkとなる。したがって両最適値は一致し、subset DPは全ての代表順を一度ずつ扱う。","sourceRevisionIds":["source-abc338-editorial-9170-0547dd2070c8672755ddefc73c4931953514fb9b26bbac55b5feff56a4ee3c2e","source-abc338-f-problem-3bd2d4f58dc54a3808d0f8d12cefc87a8165a6dc4a30746fd31e162afd914735"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

各頂点を少なくとも一度訪れるwalkの区間は、APSP距離へ置き換えてよい。任意のwalkが開いていれば、実際の始点と終点を含め、全頂点の代表出現を時系列順に一つずつ選ぶ。選んだ出現間の区間はwalk全体を分割するので、その各区間を最短距離に置き換えても元の総費用を超えない。

walkが閉じている場合は、負閉路がないため総費用は非負で、少なくとも一辺は非負。そこを切って巡回順をずらすと、全頂点を訪れる開いたwalkになり、費用は増えない。逆に代表頂点の順を決めてAPSP経路をつなげれば、全頂点を訪れるwalkを作れる。

よってAPSP距離上のHamiltonian path最小化と答えは一致し、N≤20なのでsubset DPで解ける。

採用する候補: Floyd–Warshallの後に、訪問maskと最後の代表頂点を持つDPを行う。

負辺を含んでも負閉路がなければAPSP距離は有限に定義できる。

棄却する候補: 頂点訪問条件を持たずに元graph上の最短路だけを求める。

訪問済み集合を区別できず、全頂点を通ったか判定できない。

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

実行可能walkから時系列順に全頂点の代表出現を選べば、代表間の区間がwalk全体を分割し、APSP距離の和は元の費用以下となる。閉walkは負閉路なしの条件から非負費用で、非負辺を一つ切って開walkにしても全頂点と費用上界を保てる。逆に任意の代表頂点順にAPSP最短路をつなげれば、各代表を通るため全頂点を訪れるwalkとなる。したがって両最適値は一致し、subset DPは全ての代表順を一度ずつ扱う。

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
