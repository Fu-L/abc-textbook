---
title: "ABC364-G — Last Major City"
draft: true
authoringUnit: {"problemId":"abc364-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-steiner-tree-by-subset-dp/outcome-solve-steiner-tree-by-subset-dp-shard-001/abc364-g.md","learningOutcomeIds":["outcome-solve-steiner-tree-by-subset-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-weighted-shortest-path"],"excludedTopics":["Steiner tree subset DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-steiner-tree-dp","tag-shortest-path"],"sourceRevisionIds":["source-abc364-editorial-10547-0ce6702759818c3334c43dfff2b684fb4f5ff524c8e1a158e410e6d33ffd750a","source-abc364-g-problem-2b7755f38ab76701b38b7e8606e7efbd62fb407a019d63341ada4e0e7fed61b6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"非負辺の最適連結部分 graph は閉路を取り除いて木にできる。root v の最適木が分岐するなら、端点集合を二つへ分けた木を v で併合する遷移に分解できる。root から最初の分岐まで一本道なら root を動かす最短路 closure に分解できる。各候補の union は端点を結ぶ有効解であり、重なった辺の二重計上は過大候補を作るだけで過小評価しない。最適木の分解も候補に含まれるため subset 帰納法で等号を得る。","sourceRevisionIds":["source-abc364-editorial-10547-0ce6702759818c3334c43dfff2b684fb4f5ff524c8e1a158e410e6d33ffd750a","source-abc364-g-problem-2b7755f38ab76701b38b7e8606e7efbd62fb407a019d63341ada4e0e7fed61b6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Steiner tree subset DP](src/content/docs/learn/dynamic-programming/steiner-tree-dp.md)

- terminal subsetと終点を状態に、subset分割mergeとmulti-source shortest path relaxationを交互に行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

求める各答えは固定terminal 1..K−1と追加頂点vを含む最小Steiner treeの重みであり、K≤10なのでterminal集合をbit maskで持てる。同じ頂点vで二つのterminal部分集合を結合する遷移と、辺を一つ延ばしてroot位置を移す遷移の二種類で任意の最適木を分解できる。dp[mask][v]←dp[sub][v]+dp[mask−sub][v]はvを共通接続点として二木を合併し、重複辺があれば最適解をさらに改善できるので上界遷移として安全である。各maskでmergeを済ませた値を全頂点sourceの初期距離としてDijkstraすれば、dp[mask][v]←dp[mask][u]+wを循環なく最短路閉包できる。

採用する候補: dp[mask][v]をmask内terminalとvを結ぶ最小木とし、subset merge後にmulti-source Dijkstraで辺延長を閉包する。

Steiner treeの分岐を同一点での集合併合、path部分を最短路緩和として網羅できる。

棄却する候補: 各vについてSteiner頂点集合や木の辺集合を個別に列挙する。

非terminal候補がN個あり部分集合探索は巨大で、vごとに共通する固定terminalの計算も共有できない。

固定terminal i=1..K−1についてdp[1<<i][i]=0、他を∞とする。maskを昇順に処理し、全非空proper submaskとの和で各vをmin更新する。そのdp列を初期距離にmulti-source Dijkstraして全辺緩和する。full maskについてv=K..Nのdp[full][v]を出力する。

## 典型の発動条件

### Dreyfus-Wagner型Steiner DP

発動条件: terminal数だけが小さいweighted graphの最小接続部分graph。

terminal subsetと接続rootを状態にし、subset mergeとshortest-path closureを交互に行う。

### multi-source Dijkstra閉包

発動条件: 同一mask内の辺遷移に循環があり、全rootの初期候補が既にあるとき。

全dp[mask][v]をqueueへ入れて最短距離として一括伝播する。

## 問題固有の要素

追加都市vをterminal bitへ毎回加えず、Steiner DPのroot位置vとして残すことで全vの答えを一回の表から得られる。

別の問題へ持ち帰る視点: 多数の追加terminal queryは、一点をroot parameterにした共通DPで同時計算できないか考える。

## 正当性

非負辺の最適連結部分 graph は閉路を取り除いて木にできる。root v の最適木が分岐するなら、端点集合を二つへ分けた木を v で併合する遷移に分解できる。root から最初の分岐まで一本道なら root を動かす最短路 closure に分解できる。各候補の union は端点を結ぶ有効解であり、重なった辺の二重計上は過大候補を作るだけで過小評価しない。最適木の分解も候補に含まれるため subset 帰納法で等号を得る。

## 実装上の注意

- submaskと補集合のmergeを重複実行しても正しさは保つが定数倍に注意する。∞との加算overflowを避け、terminal番号とbit位置をずらさない。

## 復習の核

- 最適木のvが葉の場合は辺延長、分岐点の場合はsubset mergeのどちらで分解されるかを図示する。各maskのmerge後に必ず最短路閉包する順序を守る。

## 計算量と制約

### 時間

元 graph N 頂点 M 辺、固定端点数 k=K−1。O(3^k N+2^k(N+M)log N+N)（heap Dijkstra）、出力は N−K+1 個。

### 空間

dp と graph で O(2^k N+N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 4000; N-1 \leq M \leq 8000; 2\leq K \leq \min(N,\,10); 1 \leq A_i < B_i \leq N; 1 \leq C_i \leq 10^9; One can travel between any two cities by traversing some roads.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc364/editorial/10547) — source-abc364-editorial-10547-0ce6702759818c3334c43dfff2b684fb4f5ff524c8e1a158e410e6d33ffd750a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc364/tasks/abc364_g) — source-abc364-g-problem-2b7755f38ab76701b38b7e8606e7efbd62fb407a019d63341ada4e0e7fed61b6
