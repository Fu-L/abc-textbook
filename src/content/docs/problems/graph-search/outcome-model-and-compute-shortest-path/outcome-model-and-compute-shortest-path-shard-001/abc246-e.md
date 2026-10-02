---
title: "ABC246-E — Bishop 2"
draft: true
authoringUnit: {"problemId":"abc246-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc246-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc246-e-problem-0e2f0bb30b88da59ba7287e7e33d67229dfb820dceb6b1c2053d6b9fce77a94e","source-abc246-editorial-3702-98ab0c26bf215624b89817acec8ece6263f72ade00b9fd1d31ad410235d80a51"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一手の斜め移動を同方向の単位移動列へ分解すると開始だけ1、継続0。逆に同方向連続を一手へまとめられ、方向変更数付きcostと手数が一致する。位置と前方向が将来を決めるので4状態の最短路が正しい。","sourceRevisionIds":["source-abc246-e-problem-0e2f0bb30b88da59ba7287e7e33d67229dfb820dceb6b1c2053d6b9fce77a94e","source-abc246-editorial-3702-98ab0c26bf215624b89817acec8ece6263f72ade00b9fd1d31ad410235d80a51"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3×3全空、始点(1,1)、終点(3,3)。","procedure":["南東方向を1手で開始。","同方向で(2,2),(3,3)へ進む追加cost0。","一つのbishop手に圧縮する。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"異色の二マスは空盤面なら届くか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"届かない。斜め移動は行列和のparityを保存する。"},"answer":{"reasoningOrVerification":"届かない。斜め移動は行列和のparityを保存する。","procedure":["具体例の各状態・寄与を再計算する。","届かない。斜め移動は行列和のparityを保存する。"],"expectedResult":"届かない。斜め移動は行列和のparityを保存する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

bishop は斜めにしか進まないため、始点と終点のマス色が異なれば到達不能である。ただし同色でも pawn による分断があり、最短手数の探索が必要になる。 1 手の長い斜め移動を 1 マスずつに分けると、直前と同じ方向への継続は手数 0、方向を変えて進み始めると手数 1 と表現できる。 同じ斜め方向に何マス進んでも 0-cost 辺の連鎖なので、最初に方向を選んだ 1 回だけが bishop の 1 手に対応する。 辺重みが 0 と 1 だけなので、距離が改善した 0-cost 状態は deque 前方、1-cost 状態は後方へ入れれば距離順に確定できる。

採用する候補: 状態を (マス,直前の斜め方向) とし、同方向への辺を重み 0、別方向への辺を重み 1 とした 01-BFS を行う。

各マス 4 状態と隣接 4 方向だけで bishop の任意距離移動を表し、盤面全体を線形規模で探索できる。

棄却する候補: 各マスから同じ斜線上で pawn までの全マスへ、1 手の辺を明示して通常 BFS を行う。

開けた盤面では 1 状態から O(N) 本の辺が生じ、N≤1500 に対して辺列挙が大きくなる。

同じ斜め方向に何マス進んでも 0-cost 辺の連鎖なので、最初に方向を選んだ 1 回だけが bishop の 1 手に対応する。

辺重みが 0 と 1 だけなので、距離が改善した 0-cost 状態は deque 前方、1-cost 状態は後方へ入れれば距離順に確定できる。

始点から 4 方向状態へのコストを 1 として開始し、空きマス間の斜め隣接を 01-BFS する。同方向なら +0、方向変更なら +1 とし、終点の 4 状態の最小値を答える。未到達なら -1 とする。

## 典型の発動条件

### 01-BFS

発動条件: グラフの全辺重みが 0 または 1 で、最短距離を求めたいとき。

方向継続を 0、方向変更を 1 として deque の前後へ緩和状態を入れる。

### 直前操作を持つ状態拡張

発動条件: 同じ場所への到達でも直前の選択により次のコストが変わるとき。

盤面位置に 4 斜め方向を加え、次の移動が手の継続か新しい手かを判定する。

## 問題固有の要素

bishop の『任意距離を 1 手』は、方向を記憶して同方向の単位移動を無料にすることで疎な 01 最短路へ変換できる。

別の問題へ持ち帰る視点: 長い一操作を単位遷移へ分ける際は、操作継続を 0、操作開始を 1 とする状態グラフを検討する。

## 正当性

一手の斜め移動を同方向の単位移動列へ分解すると開始だけ1、継続0。逆に同方向連続を一手へまとめられ、方向変更数付きcostと手数が一致する。位置と前方向が将来を決めるので4状態の最短路が正しい。

## 実装上の注意

- 始点ではまだ手を使っていないため、super source から各初期方向へコスト 1 とするか、初期距離を 1 にそろえる。
- 盤外または # への遷移は作らず、距離配列は N×N×4 の範囲で確保する。

## 復習の核

- 一直線で答え 1、途中で方向転換して答え 2、始終点の色が異なり -1 の例を並べ、0-cost 継続と初期コストの対応を確認する。

## 計算量と制約

### 時間

N×N盤面、4N²状態と定数次数辺に01-BFSで O(N²)。

### 空間

盤面、4方向dist、deque O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 1500; 1 \le A_x,A_y \le N; 1 \le B_x,B_y \le N; (A_x,A_y) \neq (B_x,B_y); S_i is a string of length N consisting of . and #.; S_{A_x,A_y}= .; S_{B_x,B_y}= .

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3×3全空、始点(1,1)、終点(3,3)。

1. 南東方向を1手で開始。
2. 同方向で(2,2),(3,3)へ進む追加cost0。
3. 一つのbishop手に圧縮する。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

異色の二マスは空盤面なら届くか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

届かない。斜め移動は行列和のparityを保存する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/tasks/abc246_e) — source-abc246-e-problem-0e2f0bb30b88da59ba7287e7e33d67229dfb820dceb6b1c2053d6b9fce77a94e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/editorial/3702) — source-abc246-editorial-3702-98ab0c26bf215624b89817acec8ece6263f72ade00b9fd1d31ad410235d80a51
