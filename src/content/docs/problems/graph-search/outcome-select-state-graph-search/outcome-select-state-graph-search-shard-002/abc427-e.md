---
title: "ABC427-E — Wind Cleaning"
draft: true
authoringUnit: {"problemId":"abc427-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc427-e.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-prefix-aggregate"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search","tag-dp-state-equivalence","tag-prefix-difference"],"sourceRevisionIds":["source-abc427-e-problem-39f00b523157b4f857b566f257cf9c6b6a0d04344ca9741f584e987e0ca526f5","source-abc427-editorial-14197-b5f7fe42bd361cb6585fdae29d50412466d220aeeaafdcc91d7c73639858f1dd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全ごみは同じ変位を受け、一度盤外へ出た元行列端だけが除かれるので残存初期座標は矩形。矩形と変位で現在ごみ集合を完全復元できる。次変位のT逆像に元ごみがあれば禁止、盤外端を縮める四遷移は全合法風と一致しBFSが最小回数。","sourceRevisionIds":["source-abc427-e-problem-39f00b523157b4f857b566f257cf9c6b6a0d04344ca9741f584e987e0ca526f5","source-abc427-editorial-14197-b5f7fe42bd361cb6585fdae29d50412466d220aeeaafdcc91d7c73639858f1dd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

高橋君は動かず、風による各操作は盤面上の全ごみを同方向へ一マス平行移動し、盤外へ出たごみだけが消える。したがって状態は人物位置ではなく残存する初期ごみの範囲と累積移動量で決まる。 同じ風を全ごみに適用し続けるので、残存ごみは初期盤面のある軸平行矩形内のごみを一様に (dx,dy) だけずらした形に限られる。 一方向へ動かしたとき、盤外に出る初期座標の端一行または一列を矩形から削り、変位を更新すれば次状態になる。

採用する候補: 残存する初期座標の矩形 [lx,rx)×[ly,ry) と累積変位 (dx,dy) を状態にして BFS する。

到達可能状態は六つの整数で O(H^3W^3) 個に抑えられ、各状態から四方向の辺だけを調べれば最短操作数になる。

棄却する候補: 各盤面のごみ配置を HW bit の集合として BFS する。

一般には 2^(HW) 状態を想定してしまい、平行移動と切り落としが保つ矩形構造を利用できない。

同じ風を全ごみに適用し続けるので、残存ごみは初期盤面のある軸平行矩形内のごみを一様に (dx,dy) だけずらした形に限られる。

一方向へ動かしたとき、盤外に出る初期座標の端一行または一列を矩形から削り、変位を更新すれば次状態になる。

初期矩形全体と変位 0 を始点に、六変数を key として BFS する。四方向ごとに変位を一つ進め、盤外へ出る側の矩形端を必要なだけ縮める。矩形内の初期ごみが 0 になった最初の距離を返す。

## 典型の発動条件

### 状態空間 BFS

発動条件: 各操作のコストが 1 で、状態を多項式個の正規形へ圧縮できるとき。

矩形境界と平行移動量を頂点、四方向の風を有向辺として最短距離を求める。

### 変換前座標での状態圧縮

発動条件: 全要素が同じ変換を受け、境界から脱落するだけの過程を扱うとき。

残った初期座標の範囲と共通変位だけを保持し、個々のごみ位置を再構築しない。

### 二次元累積和

発動条件: 任意の初期矩形に対象が残るかを繰り返し判定するとき。

矩形内の初期ごみ個数を O(1) で得て空状態を検出する。

## 問題固有の要素

風の履歴そのものは不要で、共通変位と初期盤面の切り抜き矩形が将来を完全に決める。

別の問題へ持ち帰る視点: 一様変換と境界削除から成る系では、元データ上の生存範囲を状態にすると指数的配置を圧縮できる。

## 正当性

全ごみは同じ変位を受け、一度盤外へ出た元行列端だけが除かれるので残存初期座標は矩形。矩形と変位で現在ごみ集合を完全復元できる。次変位のT逆像に元ごみがあれば禁止、盤外端を縮める四遷移は全合法風と一致しBFSが最小回数。

## 実装上の注意

- 上下左右で縮める初期矩形の端と変位の符号を対応させる。ごみを含まない端行・端列も正規化して同じ配置の重複状態を避ける。

## 復習の核

- 六変数から復元される位置が盤内にある条件と、遷移後に削る矩形端の対応を小さな盤面で確認する。

## 計算量と制約

### 時間

H×W、六変数状態数O(H³W³)、各四遷移と矩形和O(1)で O(H³W³)。

### 空間

visited/state queue O(H³W³)、prefix石和O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 12; S_i is a string of length W consisting of T, #, and ..; There is exactly one (i, j) such that S_{i, j} = T.; There is at least one (i, j) such that S_{i, j} = #.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/tasks/abc427_e) — source-abc427-e-problem-39f00b523157b4f857b566f257cf9c6b6a0d04344ca9741f584e987e0ca526f5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/editorial/14197) — source-abc427-editorial-14197-b5f7fe42bd361cb6585fdae29d50412466d220aeeaafdcc91d7c73639858f1dd
