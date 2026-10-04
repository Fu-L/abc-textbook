---
title: "ABC241-F — Skate"
draft: true
authoringUnit: {"problemId":"abc241-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc241-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc241-editorial-3451-625adf44aa9c67024e10052849ef27e766fdad348a9d073622264ae8fad88011","source-abc241-f-problem-7a8f10675668b8b55c7beeb18e2aa2963c631763dcd108ce84dcd76aad1a5638"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"合法停止は各方向の最初の障害物の直前なので開始点以外の候補O(K)。二分探索が一手の唯一遷移先を正確に返し、障害物がない方向は崖へ落ちるため除外する。全遷移単位費用なのでBFSの最短手数が答え。","sourceRevisionIds":["source-abc241-editorial-3451-625adf44aa9c67024e10052849ef27e766fdad348a9d073622264ae8fad88011","source-abc241-f-problem-7a8f10675668b8b55c7beeb18e2aa2963c631763dcd108ce84dcd76aad1a5638"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

## 考察

盤面は最大10^9×10^9だが、一手の停止位置は衝突した障害物の直前に限られる。したがって開始点を除く到達候補は各障害物の上下左右に隣接する O(N) マスしかない。 現在位置から一方向の遷移先は、同じ行または列でその方向に最も近い障害物があれば、その一つ手前として一意に決まる。障害物がなければ崖へ落ちるためその手自体が禁止される。 通過するだけのマスは次の手を選べないので状態に不要であり、goal も障害物直前として実際に停止できた場合だけ到達扱いになる。

採用する候補: 行ごと・列ごとに障害物座標を sort し、BFS の各状態から predecessor/successor を二分探索して最大4遷移を生成する。

巨大な空白マスを graph から除き、停止可能点だけの sparse implicit graph として最短手数を求められる。

棄却する候補: 全盤面の空きマスを頂点にし、一手で滑る先を探索する BFS を行う。

H,W は10^9まであり、盤面を列挙も記憶もできない。

通過するだけのマスは次の手を選べないので状態に不要であり、goal も障害物直前として実際に停止できた場合だけ到達扱いになる。

障害物を row→sorted columns と column→sorted rows に格納する。start から BFS し、上下左右それぞれ nearest obstacle を lower_bound で探し、その直前マスが別状態なら距離+1で enqueue する。goal の距離が得られなければ -1 とする。

## 典型の発動条件

### 巨大グリッドの停止候補への縮約

発動条件: 座標範囲は巨大だが、移動規則により停止・分岐できる点が障害物周辺などに限られるとき。

重要点だけを graph vertex とし、空白区間を一辺の遷移へ圧縮する。

### sorted 障害物の predecessor/successor

発動条件: 同じ行・列で最寄りの壁や点まで一気に移動するとき。

行列別の sorted list へ二分探索し、四方向の最寄り要素を取得する。

## 問題固有の要素

崖は停止壁ではなく「その方向へ動けない」条件なので、盤面境界を仮想障害物として加えてはいけない。

別の問題へ持ち帰る視点: 滑走問題では境界で止まる規則か、壁がなければ操作禁止かを区別して遷移 graph を作る。

## 正当性

合法停止は各方向の最初の障害物の直前なので開始点以外の候補O(K)。二分探索が一手の唯一遷移先を正確に返し、障害物がない方向は崖へ落ちるため除外する。全遷移単位費用なのでBFSの最短手数が答え。

## 実装上の注意

- 障害物が隣接して遷移先が現在地になる self-loop は無視する。候補座標が盤内か確認し、visited は座標 pair の hash/map で管理する。

## 復習の核

- goal を通過するが次の障害物直前ではない例を描き、なぜ BFS 頂点へ goal を置くだけでは到達にしてはいけないか確認する。

## 計算量と制約

### 時間

障害物K。行列ごとsort O(K log K)、O(K)停止状態のBFSで各二分探索 O(log K)、合計 O(K log K)。

### 空間

行列障害物list、停止状態distで O(K)、hashはexpected。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq H \leq 10^9; 1\leq W \leq 10^9; 1\leq N \leq 10^5; 1\leq s_x,g_x\leq H; 1\leq s_y,g_y\leq W; 1\leq X_i \leq H; 1\leq Y_i \leq W; (s_x,s_y)\neq (g_x,g_y); (s_x,s_y)\neq (X_i,Y_i); (g_x,g_y)\neq (X_i,Y_i); If i\neq j, then (X_i,Y_i)\neq (X_j,Y_j).; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/editorial/3451) — source-abc241-editorial-3451-625adf44aa9c67024e10052849ef27e766fdad348a9d073622264ae8fad88011
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc241/tasks/abc241_f) — source-abc241-f-problem-7a8f10675668b8b55c7beeb18e2aa2963c631763dcd108ce84dcd76aad1a5638
