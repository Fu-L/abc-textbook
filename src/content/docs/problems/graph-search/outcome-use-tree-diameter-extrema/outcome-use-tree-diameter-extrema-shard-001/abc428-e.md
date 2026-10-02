---
title: "ABC428-E — Farthest Vertex"
draft: true
authoringUnit: {"problemId":"abc428-e","docPath":"src/content/docs/problems/graph-search/outcome-use-tree-diameter-extrema/outcome-use-tree-diameter-extrema-shard-001/abc428-e.md","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-metric-diameter"],"sourceRevisionIds":["source-abc428-e-problem-7d929dab8a998eb78a89669be62c9bd9e4d245a200a45e26b319d527a61f76b9","source-abc428-editorial-14240-d77d5666ac1548841eaa7c0c01d828cf2fec5a26f19012a4801b34b10a69a3aa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各頂点へ番号×微小εの補助葉を付けると整数距離優先・番号後順位の最遠が一つの木距離最大化になる。拡張tree直径の二端が全最遠を代表する性質を使い、実装は距離/番号pair比較でεを正確に模倣する。両探索と回答に同tie規則を使えば最大番号を失わない。","sourceRevisionIds":["source-abc428-e-problem-7d929dab8a998eb78a89669be62c9bd9e4d245a200a45e26b319d527a61f76b9","source-abc428-editorial-14240-d77d5666ac1548841eaa7c0c01d828cf2fec5a26f19012a4801b34b10a69a3aa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

木で任意頂点 u からの最大距離は、直径の両端 s,t のどちらかへの距離に等しい。ただし同距離なら頂点番号が大きい方を選ぶという辞書的な tie-break も距離計算へ組み込みたい。 距離を組 (元の辺数, 終点番号) の辞書順として扱えば、実際に 10^-100 の浮動小数辺を作らず微小摂動を正確に模倣できる。 拡張木でも任意点の最遠点は一つの直径の端点のいずれかなので、二端点への組付き距離の大きい方が答えになる。

採用する候補: 各元頂点 i に微小な長さ i·ε の葉 i' を付けた拡張木を考え、その直径端点二つからの距離を比較する。

整数距離を最優先しつつ同距離では番号が大きい葉が遠くなり、通常の直径端点の性質をそのまま適用できる。

棄却する候補: 各頂点を始点に DFS/BFS して全頂点への距離と最大番号を求める。

正しいが全始点探索で O(N^2) となる。

距離を組 (元の辺数, 終点番号) の辞書順として扱えば、実際に 10^-100 の浮動小数辺を作らず微小摂動を正確に模倣できる。

拡張木でも任意点の最遠点は一つの直径の端点のいずれかなので、二端点への組付き距離の大きい方が答えになる。

頂点番号を tie-break とする距離比較で、任意頂点から最遠点 s、s から最遠点 t を求めて拡張木の直径端を得る。元の木で s,t から全距離を計算し、各 u について距離が大きい端、等しければ番号が大きい端を出力する。

## 典型の発動条件

### 木の直径

発動条件: 木の各頂点からの最遠点または離心率を一括して求めるとき。

直径端点 s,t からの二つの距離だけを比較して各頂点の最遠候補を決める。

### 微小摂動による tie-break

発動条件: 主目的値が同じ場合だけ副目的値を最大化したいとき。

葉への仮想的な微小辺、実装上は距離と番号の辞書順比較で最大番号条件を埋め込む。

## 問題固有の要素

最大番号という副条件も、十分小さい重みを加えた単一の距離最大化とみなせる。

別の問題へ持ち帰る視点: 木の直径端点の性質は、順序を壊さない微小摂動で tie-break を含む目的へ拡張できる。

## 正当性

各頂点へ番号×微小εの補助葉を付けると整数距離優先・番号後順位の最遠が一つの木距離最大化になる。拡張tree直径の二端が全最遠を代表する性質を使い、実装は距離/番号pair比較でεを正確に模倣する。両探索と回答に同tie規則を使えば最大番号を失わない。

## 実装上の注意

- 浮動小数 ε は実装せず、距離が同じ場合だけ頂点番号を比較する。直径探索と各頂点の回答の両方で同じ比較規則を使う。

## 復習の核

- 直径端点の探索でも同距離時の最大番号を選んでいるか、各 u の比較が距離優先・番号後順位になっているかを確認する。

## 計算量と制約

### 時間

N頂点、tie付き直径探索と二距離 O(N)、出力O(N)。

### 空間

木と二距離 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5 \times 10^5; 1 \leq A_i \lt B_i \leq N; The graph given in the input is a tree.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/tasks/abc428_e) — source-abc428-e-problem-7d929dab8a998eb78a89669be62c9bd9e4d245a200a45e26b319d527a61f76b9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/editorial/14240) — source-abc428-editorial-14240-d77d5666ac1548841eaa7c0c01d828cf2fec5a26f19012a4801b34b10a69a3aa
