---
title: "ABC257-F — Teleporter Setting"
draft: true
authoringUnit: {"problemId":"abc257-f","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc257-f.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc257-editorial-4183-5d92754316053c465897b9e88ffc5ef61cb42a4e33fbc5988791c8dca2c32f35","source-abc257-f-problem-197deaa7efd3411cbd75855ce09f6c750437b8f49c923abeb74faff7ab91218c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"共通Tを使うsimple pathはTを高々一度訪れ、可変辺を0回、1回二方向、2回の四型へ分類できる。各型の通常区間は端点距離とS最短で独立評価できる。最短単純化は長さを増やさないので全Tに四候補最小が十分。","sourceRevisionIds":["source-abc257-editorial-4183-5d92754316053c465897b9e88ffc5ef61cb42a4e33fbc5988791c8dca2c32f35","source-abc257-f-problem-197deaa7efd3411cbd75855ce09f6c750437b8f49c923abeb74faff7ab91218c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

可変テレポーターの未定端を町Tへ結ぶと、最短単純路はTを二度以上訪れないため、可変辺の使い方は0回、片方向に1回の二種、Tを挟んで2回の計4型だけである。通常辺だけの距離をd1,dNとすると、四候補はd1[N]、min_S d1+1+dN[T]、d1[T]+1+min_S dN、min_S d1+2+min_S dNである。可変テレポーターを二回使う場合も、Tへ入り直ちにTから出る形へ短縮できるため、S側の二端は独立に最短値を選べる。

採用する候補: 通常辺だけの二回BFSと四経路型の最小値

町1・Nからの距離と、既定端集合Sまでの距離最小値を前計算すれば、全Tの答えを四つの式から定数時間で得られる。

棄却する候補: Tごとに辺を張り替えてBFS

N通りそれぞれでO(N+M)探索が必要になり、N,M=3×10^5では間に合わない。

頂点0を含む辺の相手集合Sを取り出し、残る通常グラフで1とNからBFSしてd1,dNを求める。S上の各距離最小値を計算し、T=1..Nごとに四候補の最小を出し、全て無限なら-1とする。

## 典型の発動条件

### 特殊辺使用回数の経路分解

発動条件: 可変端点を持つ辺があり、最短路での使用形が少数に限られる。

Tの訪問回数を削って可変辺0・1・2回の四型を列挙する。

### 無重みグラフの両端BFS

発動条件: 多数の経路候補が固定始点・終点までの距離を共有する。

町1と町Nから通常辺だけの距離配列を一度ずつ求める。

### 特別集合上のmin集約

発動条件: 式中でSの要素はTと独立に一項だけへ現れる。

min_(x∈S)d1[x]とmin_(x∈S)dN[x]を前計算する。

## 問題固有の要素

可変辺を含む全グラフを作り直さず、最短路が可変端Tを訪れる局所形を列挙すると、T依存部分とS上の共通最小値が分離する。

別の問題へ持ち帰る視点: 少数の特殊辺を含む最短路では、単純路性から使用パターンを限定し、通常グラフの距離へ分解する。

## 正当性

共通Tを使うsimple pathはTを高々一度訪れ、可変辺を0回、1回二方向、2回の四型へ分類できる。各型の通常区間は端点距離とS最短で独立評価できる。最短単純化は長さを増やさないので全Tに四候補最小が十分。

## 実装上の注意

- 到達不能は十分大きいINFで持ち、INFへ加算してオーバーフローしない。Sが空の場合の最小値、TがS自身の場合を含め、有限候補がなければ-1を出す。

## 復習の核

- 各Tで実際にグラフを構築する小ケースBFSと比較し、Sが空、通常経路なし、可変辺を0・1・2回使う各型が最適になる例を確認する。

## 計算量と制約

### 時間

N町M辺。二BFS O(N+M)、全T四式 O(N)。

### 空間

通常graphと距離 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3\times 10^5; 1\leq M\leq 3\times 10^5; 0\leq U_i<V_i\leq N; If i \neq j, then (U_i,V_i)\neq (U_j,V_j).; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/editorial/4183) — source-abc257-editorial-4183-5d92754316053c465897b9e88ffc5ef61cb42a4e33fbc5988791c8dca2c32f35
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/tasks/abc257_f) — source-abc257-f-problem-197deaa7efd3411cbd75855ce09f6c750437b8f49c923abeb74faff7ab91218c
