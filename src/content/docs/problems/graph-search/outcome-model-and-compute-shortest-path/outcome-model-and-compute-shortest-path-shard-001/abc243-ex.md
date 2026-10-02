---
title: "ABC243-EX — Builder Takahashi (Enhanced version)"
draft: true
authoringUnit: {"problemId":"abc243-ex","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc243-ex.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc243-editorial-3546-89a660b3c8dda82dde57aa36a38a94770e60efb75f91ba72b8d5d4ac1c78a971","source-abc243-ex-problem-cb35728cca943b2ff65de0edea1b620bf01183421366f241251dbf8132adbebe"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"barrierの閉曲線が固定S–G曲線を奇数回横切ることと両点分離が同値。edge crossing bitをxorする二層pathはこの交差parityを正確に表す。same開始の奇parity帰還は分離barrierで、canonical開始規約が同じ壁集合の重複を除く。最短壁costと同最短countをBFSで集計する。","sourceRevisionIds":["source-abc243-editorial-3546-89a660b3c8dda82dde57aa36a38a94770e60efb75f91ba72b8d5d4ac1c78a971","source-abc243-ex-problem-cb35728cca943b2ff65de0edea1b620bf01183421366f241251dbf8132adbebe"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"2×3盤面 S.G / OOO。Oは壁にできない。","procedure":["SからGへの唯一のroadには中央(1,2)がある。","そこへ壁一つを作れば分離。","0壁では上段pathがある。"],"executionTarget":null,"expectedResult":"Yes、最小1壁、選び方1","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"prerequisiteIds":["unit-geometry-primitives","unit-state-graph-search"],"attainmentCondition":"barrierとS–G曲線の交差が二回なら分離するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"しない。内外を二回反転し同じ側へ戻る。回数ではなくparityを状態へ残す。"},"answer":{"reasoningOrVerification":"しない。内外を二回反転し同じ側へ戻る。回数ではなくparityを状態へ残す。","procedure":["具体例の各状態・寄与を再計算する。","しない。内外を二回反転し同じ側へ戻る。回数ではなくparityを状態へ残す。"],"expectedResult":"しない。内外を二回反転し同じ側へ戻る。回数ではなくparityを状態へ残す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

4近傍 path を遮る壁集合は、壁セル中心を8近傍で結び盤外も利用した閉じた barrier として見られる。平面上で S と G を分けるかどうかは、固定した S-G 曲線と barrier の交差回数の偶奇で判定できる。 交差回数そのものを覚える必要はなく parity だけでよいので、壁候補 graph の各位置を parity 0/1 の二層へ持ち上げれば、分離条件は同じ位置へ奇 parity で戻る閉路になる。 閉曲線に沿って内外は交差のたび反転するため、S と G が別側にあることと、固定 S-G 曲線を barrier が奇数回横切ることが同値である。 壁にできない O/S/G は barrier 頂点から除き、盤外を padding した graph に含めることで、grid boundary を使う separator も同じ閉路表現に入る。

採用する候補: 固定した S-G grid path とその片側を使って各8近傍遷移の crossing bit を定め、parity-expanded graph 上の最短閉路とその本数を shortest-path DP で求める。

平面的な分離条件を局所 edge の XOR へ変え、壁数最小化と最短路数え上げを同じ状態 graph で扱える。

棄却する候補: node-splitting max-flow で最小頂点 cut を求める。

最小壁数だけなら候補だが、minimum cut を達成する壁集合の総数 r を一般の flow 値だけから数えられない。

閉曲線に沿って内外は交差のたび反転するため、S と G が別側にあることと、固定 S-G 曲線を barrier が奇数回横切ることが同値である。

壁にできない O/S/G は barrier 頂点から除き、盤外を padding した graph に含めることで、grid boundary を使う separator も同じ閉路表現に入る。

S から G への単純 path を一つ固定し、赤 path とその片側の青領域の境を跨ぐ8近傍 edge に bit1を付ける。constructible cell と盤外からなる graph を (position,parity) に拡張し、公式の canonical start ごとに odd parity で戻る最短距離と経路数を求め、最小壁数と総数を集約する。

## 典型の発動条件

### 平面 separator と交差 parity

発動条件: grid/planar graph で二点を分断する閉曲線を数えたいとき。

二点間の基準曲線を固定し、separator との交差数 mod 2 を分離の判定量にする。

### parity-expanded shortest path

発動条件: path の edge 属性 XOR が0か1という条件付きで最短距離と本数を求めるとき。

各 vertex を parity 二層に複製し、edge bit で層を遷移する。

## 問題固有の要素

壁による到達不能を cut の集合条件のまま数えず、8近傍 barrier の閉路と固定 S-G path の奇交差へ双対化する。

別の問題へ持ち帰る視点: 平面 grid の cut 数え上げでは primal の削除集合より、dual な barrier/closed curve 表現を探す。

## 正当性

barrierの閉曲線が固定S–G曲線を奇数回横切ることと両点分離が同値。edge crossing bitをxorする二層pathはこの交差parityを正確に表す。same開始の奇parity帰還は分離barrierで、canonical開始規約が同じ壁集合の重複を除く。最短壁costと同最短countをBFSで集計する。

## 実装上の注意

- 盤外を十分な padding で明示し、corner の8近傍と path 片側の crossing 判定を統一する。同じ壁集合を開始点や向き違いで重複計数しない canonicalization と、同距離 path 数の法加算が必要である。

## 復習の核

- 固定 S-G 線を横切るたび barrier の内外が切り替わる図を描き、偶数交差では同じ側、奇数交差で別側になることを確認する。

## 計算量と制約

### 時間

H×W、V=O(HW)のparity二層graph、canonical開始数S=O(H+W)。01-BFSを各開始で行い O(SHW)⊆O(max(H,W)³)。

### 空間

各開始dist/count二層O(HW)、盤面と補助外周 O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H \leq 100; 2 \leq W \leq 100; C_{i,j} is S, G, ., or O.; Each of S and G appears exactly once in C_{i,j}.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

2×3盤面 S.G / OOO。Oは壁にできない。

1. SからGへの唯一のroadには中央(1,2)がある。
2. そこへ壁一つを作れば分離。
3. 0壁では上段pathがある。

期待される結果: Yes、最小1壁、選び方1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

barrierとS–G曲線の交差が二回なら分離するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

しない。内外を二回反転し同じ側へ戻る。回数ではなくparityを状態へ残す。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/editorial/3546) — source-abc243-editorial-3546-89a660b3c8dda82dde57aa36a38a94770e60efb75f91ba72b8d5d4ac1c78a971
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/tasks/abc243_h) — source-abc243-ex-problem-cb35728cca943b2ff65de0edea1b620bf01183421366f241251dbf8132adbebe
