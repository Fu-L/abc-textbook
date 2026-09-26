# 全問題の semantic placement 再監査（2026-09-26）

## 対象・判定方法

`problem-placements.json` の全868問について、対応する Technique
Inventory の観察、核心、採用解法、algorithm connection を読んで解法の意味を確認した。各問の primary
tag と home outcome、co-primary がある場合の home 選択、supporting
tag/outcome を、タグ・outcome の定義と照らして個別に判定した。Inventory の内容は正しいものとして扱った。下の一覧の生成に使ったプログラムは、読了後に確定した判定を ID 順に転記しただけであり、分類の判定規則には使っていない。

ここでいう supporting の「十分」は、採用解法の理解・実装に必要な**別個の学習技術**を表せていることを指す。初歩的な算術・探索・データ構造をすべて列挙する趣旨ではない。home は JSON 配列の先頭要素ではなく
`primaryOutcomeId` で判定した。co-primary がない問の欄は `—` とする。

**結論：868問を確認し、10問に分類上の誤りを認めた。**
内訳は primary の意味または home の選択が9問、supporting の配置・過不足が4問（重複を含む）。残る858問には、Inventory を真とする条件下で修正を要する根拠を認めなかった。

## 要修正の10問

### ABC244 Ex — 点の凸包を直線包絡と取り違えている

- **現状**：primary `tag-convex-hull-trick` / `outcome-optimize-by-line-envelope`、supporting
  `tag-convex-boundary-hull` と `tag-segment-tree-canonical-decomposition`。
- **Inventory 上の解法**：点集合に対する方向ベクトル `(A,B)`
  との最大内積を、各セグメント木ノードに構築した**二次元の点の凸包**上で求める。内部点を除くことと、方向ごとの支持点を探すことが核心。
- **誤り**：現行 CHT タグは、傾きと交点順による一次関数の直線包絡を定義する。この解法ではそのデータ構造を構築しない。技術名に「convex
  hull trick」が書かれていても、実際の構造は点の凸包である。
- **修正**：`tag-convex-boundary-hull` / `outcome-restrict-geometric-candidates-to-boundary`
  を primary に昇格し、直線包絡を外す。セグメント木の区間分解は supporting に残す。

### ABC308 Ex — 最短路の証明書は目的となる技術ではない

- **現状**：primary `tag-shortest-path-certificate` /
  `outcome-build-shortest-path-certificate`、supporting `tag-shortest-path`。
- **Inventory 上の解法**：各接続点を根とした最短路木で頂点に根からの第一枝ラベルを付け、異なる枝を結ぶ辺から根を通る最小単純閉路を得る。余分な枝と閉路で辺を重複使用しないために、接続辺の削除ケースも評価する。
- **誤り**：最短路木を作ること自体は必要だが、最短路を復元・証明することが課題の中心ではない。根付き最小閉路を**異枝交差辺で特徴付ける**証明と、余分な辺の役割分けが解法の核心である。
- **修正**：`tag-shortest-path` に枝間交差による根付き最小閉路を表す
  `outcome-find-rooted-cycle-by-shortest-path-branches`
  を追加して primary とし、最短路木の復元を supporting とする。

### ABC352 G — 生成関数が主、畳み込みはその計算手段

- **現状**：co-primary は `tag-convolution` と `tag-generating-functions`、home は
  `outcome-compute-convolution-or-correlation`。
- **Inventory 上の解法**：停止時刻の期待値を生存確率の和にし、異色の靴下を `∏(1+A_i x)`
  の係数として符号化する。その積を product tree と NTT で計算する。
- **誤り**：問題固有の変換は「各色から0個か1個」を生成関数の因子にし、係数を生存確率へ結び付ける部分。NTT は得た多項式積を速く計算する手段である。
- **修正**：両 primary は維持し、home を `outcome-encode-counting-by-generating-function`
  に変更する。現 supporting は維持する。

### ABC355 F — MST の閾値別成分数公式が primary から抜けている

- **現状**：primary `tag-dsu-components` / `outcome-maintain-connectivity-components`、supporting
  `tag-spanning-tree-optimization`。
- **Inventory 上の解法**：`G_k` を重み `k` 以下の辺のグラフとすると、MST 重みは
  `Σ_{k=0}^{9}(components(G_k)-1)`。辺の追加時は該当する閾値 DSU の成功した union ごとに和を1減らす。
- **誤り**：DSU 成分管理だけでは、なぜ十個の DSU の成分数の和が MST 重みになるか説明できない。現行の MST タグは重み順の全域木構成・辺採否を扱い、この**動的な層別重み公式**を正確には表さない。`tag-kruskal-threshold-sweep`
  も重み順に並べるオフライン走査の定義であり、そのまま置き換えるのは不正確。
- **修正**：`tag-spanning-tree-optimization` に層別重み公式と追加辺での維持を表す
  `outcome-derive-mst-weight-from-threshold-components`
  を追加して primary とし、DSU を supporting に移す。Kruskal の cut/cycle 性質は新 outcome の前提とする。

### ABC392 G — この問題の home は畳み込み

- **現状**：co-primary `tag-convolution` と `tag-generating-functions`、home は
  `outcome-encode-counting-by-generating-function`。
- **Inventory 上の解法**：集合の指示配列 `f` を自己畳み込みし、各 `B` に対し `(conv[2B]-1)/2`
  を足す。`2B=A+C` を和ごとのペア数へ一括変換する。
- **誤り**：学習の中心は和が一定のペア数を指示配列の畳み込みへ移すこと。生成関数の組合せ構造の設計は独立した難所ではない。
- **修正**：両 primary は維持し、home を `outcome-compute-convolution-or-correlation`
  に変更する。指示多項式による係数解釈は第二の学習成果に置く。

### ABC398 E — 偶奇戦略を Grundy DP としている

- **現状**：co-primary `tag-bipartite-structure` と `tag-game-grundy-dp`、home は
  `outcome-classify-game-states`、supporting は `tag-interactive-protocol`。
- **Inventory 上の解法**：連結二部グラフの彩色は反転を除いて固定される。合法な異色間の未使用辺の集合は一手ごとに一辺減るだけなので、初期残手数の偶奇で先後を選び、任意の合法辺を返す。
- **誤り**：`tag-game-grundy-dp`
  の定義は後続状態から勝敗または Grundy 数を求めること。この解法ではその DP を使わず、Inventory でもゲーム DP 案を却下している。
- **修正**：二部グラフの彩色・成分構造を home にし、Grundy
  DP を外す。手数偶奇不変量を表す適切な技術を追加するなら supporting または別の primary として検討する。対話 protocol は supporting のまま。

### ABC398 G — 成分型の偶奇不変量を Grundy DP としている

- **現状**：co-primary `tag-bipartite-structure` と `tag-game-grundy-dp`、home は
  `outcome-classify-game-states`。
- **Inventory 上の解法**：各成分の二部サイズと彩色反転の自由度から `ee/oo/eo/isolated`
  型と成分内残辺数を集計し、少数の場合分けと偶奇不変量で勝敗を決める。
- **誤り**：局面の後続を列挙する勝敗 DP や mex は行わない。二部成分の型を得る構造定理が問題固有の核心である。
- **修正**：`tag-bipartite-structure` / `outcome-color-and-classify-bipartite-components`
  を home にし、Grundy DP を外す。ゲームの偶奇戦略を体系化するなら別定義を設ける。

### ABC422 G — OGF と EGF の使い分けが home

- **現状**：co-primary `tag-convolution` と `tag-generating-functions`、home は
  `outcome-compute-convolution-or-correlation`。
- **Inventory 上の解法**：区別しない球には係数 `1` の通常母関数、区別する球には係数 `1/n!`
  の指数型母関数を使う。同じ三箱への分配でも係数の意味が変わり、三つの多項式を NTT で乗じる。
- **誤り**：普通母関数と指数型母関数を選び分け、係数を分配数に読み替えるのが主要な学習成果。畳み込みは計算手段。
- **修正**：両 primary を維持し、home を `outcome-encode-counting-by-generating-function`
  に変更する。

### ABC451 G — XOR 線形基底と Trie の主従が逆

- **現状**：primary `tag-binary-trie` / `outcome-query-bitwise-order-with-trie`、supporting
  `tag-xor-linear-basis`。
- **Inventory 上の解法**：全域木の XOR ポテンシャルと全辺の巡回 XOR から線形空間を作る。簡約基底による剰余類の最小代表写像を各頂点へ適用してから、値の組の XOR が
  `K` 以下である個数を Trie で数える。
- **誤り**：歩道に挿入できる閉路の XOR 自由度と、ペアごとの最小 XOR を各点の正規化へ分離できる証明が解法の核心。Trie は最後の順序統計の実装である。
- **修正**：`tag-xor-linear-basis` / `outcome-maintain-xor-linear-basis`
  を primary に昇格し、Trie を supporting にする。線形基底の「剰余類最小代表」の意味は解説内で明示する。

### ABC457 G — supporting が実際の LIS 技術を指していない

- **現状**：primary は半順序と Dilworth。supporting は `tag-geometry-orientation-transform` と
  `tag-sequence-subsequence-dp`。
- **Inventory 上の解法**：`(t+x,t-x)`
  に変換して辞書順にソートし、第二座標の最長狭義減少部分列を**patience
  sorting と二分探索**で求める。
- **誤り**：一般の subsequence
  DP は prefix や最終要素の状態設計を指すが、この解法で必要なのは「同じ長さならより有利な末尾だけ残す」LIS
  frontier である。現 supporting ではこの技術が欠ける。
- **修正**：`tag-sequence-subsequence-dp` / `outcome-design-order-preserving-dp` を `tag-lis-state`
  / `outcome-design-lis-frontier` に置き換える。座標変換は残す。

## 全868問の監査時の個別判定

`○` は Inventory の採用解法とタグ定義の意味が整合する判定、`要修正` は上記の問題、`—`
は co-primary がないことを表す。P は semantic
primary、C は co-primary の home、S は supporting の必要十分性。

| 問題      |   P    |   C    |   S    |
| --------- | :----: | :----: | :----: |
| ABC212 E  |   ○    |   —    |   ○    |
| ABC212 F  |   ○    |   —    |   ○    |
| ABC212 G  |   ○    |   —    |   ○    |
| ABC212 H  |   ○    |   —    |   ○    |
| ABC213 E  |   ○    |   —    |   ○    |
| ABC213 F  |   ○    |   —    |   ○    |
| ABC213 G  |   ○    |   —    |   ○    |
| ABC213 H  |   ○    |   —    |   ○    |
| ABC214 E  |   ○    |   —    |   ○    |
| ABC214 F  |   ○    |   —    |   ○    |
| ABC214 G  |   ○    |   —    |   ○    |
| ABC214 H  |   ○    |   ○    |   ○    |
| ABC215 E  |   ○    |   —    |   ○    |
| ABC215 F  |   ○    |   —    |   ○    |
| ABC215 G  |   ○    |   —    |   ○    |
| ABC215 H  |   ○    |   —    |   ○    |
| ABC216 E  |   ○    |   —    |   ○    |
| ABC216 F  |   ○    |   —    |   ○    |
| ABC216 G  |   ○    |   —    |   ○    |
| ABC216 H  |   ○    |   —    |   ○    |
| ABC217 E  |   ○    |   —    |   ○    |
| ABC217 F  |   ○    |   —    |   ○    |
| ABC217 G  |   ○    |   —    |   ○    |
| ABC217 H  |   ○    |   —    |   ○    |
| ABC218 E  |   ○    |   —    |   ○    |
| ABC218 F  |   ○    |   ○    |   ○    |
| ABC218 G  |   ○    |   —    |   ○    |
| ABC218 H  |   ○    |   —    |   ○    |
| ABC219 E  |   ○    |   —    |   ○    |
| ABC219 F  |   ○    |   —    |   ○    |
| ABC219 G  |   ○    |   —    |   ○    |
| ABC219 H  |   ○    |   —    |   ○    |
| ABC220 E  |   ○    |   —    |   ○    |
| ABC220 F  |   ○    |   —    |   ○    |
| ABC220 G  |   ○    |   —    |   ○    |
| ABC220 H  |   ○    |   —    |   ○    |
| ABC221 E  |   ○    |   —    |   ○    |
| ABC221 F  |   ○    |   —    |   ○    |
| ABC221 G  |   ○    |   —    |   ○    |
| ABC221 H  |   ○    |   —    |   ○    |
| ABC222 E  |   ○    |   —    |   ○    |
| ABC222 F  |   ○    |   —    |   ○    |
| ABC222 G  |   ○    |   —    |   ○    |
| ABC222 H  |   ○    |   —    |   ○    |
| ABC223 E  |   ○    |   —    |   ○    |
| ABC223 F  |   ○    |   —    |   ○    |
| ABC223 G  |   ○    |   —    |   ○    |
| ABC223 H  |   ○    |   —    |   ○    |
| ABC224 E  |   ○    |   —    |   ○    |
| ABC224 F  |   ○    |   —    |   ○    |
| ABC224 G  |   ○    |   —    |   ○    |
| ABC224 H  |   ○    |   —    |   ○    |
| ABC225 E  |   ○    |   —    |   ○    |
| ABC225 F  |   ○    |   —    |   ○    |
| ABC225 G  |   ○    |   —    |   ○    |
| ABC225 H  |   ○    |   —    |   ○    |
| ABC226 E  |   ○    |   —    |   ○    |
| ABC226 F  |   ○    |   —    |   ○    |
| ABC226 G  |   ○    |   —    |   ○    |
| ABC226 H  |   ○    |   —    |   ○    |
| ABC227 E  |   ○    |   —    |   ○    |
| ABC227 F  |   ○    |   —    |   ○    |
| ABC227 G  |   ○    |   —    |   ○    |
| ABC227 H  |   ○    |   ○    |   ○    |
| ABC228 E  |   ○    |   ○    |   ○    |
| ABC228 F  |   ○    |   —    |   ○    |
| ABC228 G  |   ○    |   ○    |   ○    |
| ABC228 H  |   ○    |   —    |   ○    |
| ABC229 E  |   ○    |   —    |   ○    |
| ABC229 F  |   ○    |   —    |   ○    |
| ABC229 G  |   ○    |   —    |   ○    |
| ABC229 H  |   ○    |   —    |   ○    |
| ABC230 E  |   ○    |   —    |   ○    |
| ABC230 F  |   ○    |   —    |   ○    |
| ABC230 G  |   ○    |   —    |   ○    |
| ABC230 H  |   ○    |   ○    |   ○    |
| ABC231 E  |   ○    |   —    |   ○    |
| ABC231 F  |   ○    |   —    |   ○    |
| ABC231 G  |   ○    |   —    |   ○    |
| ABC231 H  |   ○    |   —    |   ○    |
| ABC232 E  |   ○    |   —    |   ○    |
| ABC232 F  |   ○    |   —    |   ○    |
| ABC232 G  |   ○    |   —    |   ○    |
| ABC232 H  |   ○    |   —    |   ○    |
| ABC233 E  |   ○    |   —    |   ○    |
| ABC233 EX |   ○    |   —    |   ○    |
| ABC233 F  |   ○    |   —    |   ○    |
| ABC233 G  |   ○    |   —    |   ○    |
| ABC234 E  |   ○    |   —    |   ○    |
| ABC234 EX |   ○    |   —    |   ○    |
| ABC234 F  |   ○    |   —    |   ○    |
| ABC234 G  |   ○    |   —    |   ○    |
| ABC235 E  |   ○    |   —    |   ○    |
| ABC235 EX |   ○    |   ○    |   ○    |
| ABC235 F  |   ○    |   —    |   ○    |
| ABC235 G  |   ○    |   —    |   ○    |
| ABC236 E  |   ○    |   —    |   ○    |
| ABC236 EX |   ○    |   —    |   ○    |
| ABC236 F  |   ○    |   —    |   ○    |
| ABC236 G  |   ○    |   —    |   ○    |
| ABC237 E  |   ○    |   —    |   ○    |
| ABC237 EX |   ○    |   —    |   ○    |
| ABC237 F  |   ○    |   —    |   ○    |
| ABC237 G  |   ○    |   —    |   ○    |
| ABC238 E  |   ○    |   —    |   ○    |
| ABC238 EX |   ○    |   —    |   ○    |
| ABC238 F  |   ○    |   —    |   ○    |
| ABC238 G  |   ○    |   —    |   ○    |
| ABC239 E  |   ○    |   —    |   ○    |
| ABC239 EX |   ○    |   —    |   ○    |
| ABC239 F  |   ○    |   —    |   ○    |
| ABC239 G  |   ○    |   —    |   ○    |
| ABC240 E  |   ○    |   —    |   ○    |
| ABC240 EX |   ○    |   —    |   ○    |
| ABC240 F  |   ○    |   —    |   ○    |
| ABC240 G  |   ○    |   —    |   ○    |
| ABC241 E  |   ○    |   —    |   ○    |
| ABC241 EX |   ○    |   —    |   ○    |
| ABC241 F  |   ○    |   —    |   ○    |
| ABC241 G  |   ○    |   —    |   ○    |
| ABC242 E  |   ○    |   —    |   ○    |
| ABC242 EX |   ○    |   —    |   ○    |
| ABC242 F  |   ○    |   —    |   ○    |
| ABC242 G  |   ○    |   —    |   ○    |
| ABC243 E  |   ○    |   —    |   ○    |
| ABC243 EX |   ○    |   —    |   ○    |
| ABC243 F  |   ○    |   —    |   ○    |
| ABC243 G  |   ○    |   —    |   ○    |
| ABC244 E  |   ○    |   —    |   ○    |
| ABC244 EX | 要修正 |   —    | 要修正 |
| ABC244 F  |   ○    |   —    |   ○    |
| ABC244 G  |   ○    |   —    |   ○    |
| ABC245 E  |   ○    |   —    |   ○    |
| ABC245 EX |   ○    |   —    |   ○    |
| ABC245 F  |   ○    |   —    |   ○    |
| ABC245 G  |   ○    |   —    |   ○    |
| ABC246 E  |   ○    |   —    |   ○    |
| ABC246 EX |   ○    |   —    |   ○    |
| ABC246 F  |   ○    |   —    |   ○    |
| ABC246 G  |   ○    |   —    |   ○    |
| ABC247 E  |   ○    |   —    |   ○    |
| ABC247 EX |   ○    |   —    |   ○    |
| ABC247 F  |   ○    |   —    |   ○    |
| ABC247 G  |   ○    |   —    |   ○    |
| ABC248 E  |   ○    |   —    |   ○    |
| ABC248 EX |   ○    |   —    |   ○    |
| ABC248 F  |   ○    |   —    |   ○    |
| ABC248 G  |   ○    |   —    |   ○    |
| ABC249 E  |   ○    |   —    |   ○    |
| ABC249 EX |   ○    |   —    |   ○    |
| ABC249 F  |   ○    |   —    |   ○    |
| ABC249 G  |   ○    |   —    |   ○    |
| ABC250 E  |   ○    |   —    |   ○    |
| ABC250 EX |   ○    |   ○    |   ○    |
| ABC250 F  |   ○    |   —    |   ○    |
| ABC250 G  |   ○    |   —    |   ○    |
| ABC251 E  |   ○    |   —    |   ○    |
| ABC251 EX |   ○    |   —    |   ○    |
| ABC251 F  |   ○    |   —    |   ○    |
| ABC251 G  |   ○    |   —    |   ○    |
| ABC252 E  |   ○    |   —    |   ○    |
| ABC252 EX |   ○    |   —    |   ○    |
| ABC252 F  |   ○    |   —    |   ○    |
| ABC252 G  |   ○    |   —    |   ○    |
| ABC253 E  |   ○    |   —    |   ○    |
| ABC253 EX |   ○    |   —    |   ○    |
| ABC253 F  |   ○    |   —    |   ○    |
| ABC253 G  |   ○    |   —    |   ○    |
| ABC254 E  |   ○    |   —    |   ○    |
| ABC254 EX |   ○    |   —    |   ○    |
| ABC254 F  |   ○    |   —    |   ○    |
| ABC254 G  |   ○    |   —    |   ○    |
| ABC255 E  |   ○    |   —    |   ○    |
| ABC255 EX |   ○    |   —    |   ○    |
| ABC255 F  |   ○    |   —    |   ○    |
| ABC255 G  |   ○    |   —    |   ○    |
| ABC256 E  |   ○    |   —    |   ○    |
| ABC256 EX |   ○    |   —    |   ○    |
| ABC256 F  |   ○    |   —    |   ○    |
| ABC256 G  |   ○    |   —    |   ○    |
| ABC257 E  |   ○    |   —    |   ○    |
| ABC257 EX |   ○    |   —    |   ○    |
| ABC257 F  |   ○    |   —    |   ○    |
| ABC257 G  |   ○    |   —    |   ○    |
| ABC258 E  |   ○    |   —    |   ○    |
| ABC258 EX |   ○    |   —    |   ○    |
| ABC258 F  |   ○    |   —    |   ○    |
| ABC258 G  |   ○    |   —    |   ○    |
| ABC259 E  |   ○    |   —    |   ○    |
| ABC259 EX |   ○    |   —    |   ○    |
| ABC259 F  |   ○    |   —    |   ○    |
| ABC259 G  |   ○    |   —    |   ○    |
| ABC260 E  |   ○    |   —    |   ○    |
| ABC260 EX |   ○    |   ○    |   ○    |
| ABC260 F  |   ○    |   —    |   ○    |
| ABC260 G  |   ○    |   —    |   ○    |
| ABC261 E  |   ○    |   —    |   ○    |
| ABC261 EX |   ○    |   —    |   ○    |
| ABC261 F  |   ○    |   —    |   ○    |
| ABC261 G  |   ○    |   —    |   ○    |
| ABC262 E  |   ○    |   —    |   ○    |
| ABC262 EX |   ○    |   —    |   ○    |
| ABC262 F  |   ○    |   —    |   ○    |
| ABC262 G  |   ○    |   —    |   ○    |
| ABC263 E  |   ○    |   —    |   ○    |
| ABC263 EX |   ○    |   —    |   ○    |
| ABC263 F  |   ○    |   —    |   ○    |
| ABC263 G  |   ○    |   —    |   ○    |
| ABC264 E  |   ○    |   —    |   ○    |
| ABC264 EX |   ○    |   —    |   ○    |
| ABC264 F  |   ○    |   —    |   ○    |
| ABC264 G  |   ○    |   ○    |   ○    |
| ABC265 E  |   ○    |   —    |   ○    |
| ABC265 EX |   ○    |   —    |   ○    |
| ABC265 F  |   ○    |   —    |   ○    |
| ABC265 G  |   ○    |   —    |   ○    |
| ABC266 E  |   ○    |   —    |   ○    |
| ABC266 EX |   ○    |   —    |   ○    |
| ABC266 F  |   ○    |   —    |   ○    |
| ABC266 G  |   ○    |   —    |   ○    |
| ABC267 E  |   ○    |   —    |   ○    |
| ABC267 EX |   ○    |   —    |   ○    |
| ABC267 F  |   ○    |   —    |   ○    |
| ABC267 G  |   ○    |   —    |   ○    |
| ABC268 E  |   ○    |   —    |   ○    |
| ABC268 EX |   ○    |   —    |   ○    |
| ABC268 F  |   ○    |   —    |   ○    |
| ABC268 G  |   ○    |   —    |   ○    |
| ABC269 E  |   ○    |   —    |   ○    |
| ABC269 EX |   ○    |   —    |   ○    |
| ABC269 F  |   ○    |   —    |   ○    |
| ABC269 G  |   ○    |   —    |   ○    |
| ABC270 E  |   ○    |   —    |   ○    |
| ABC270 EX |   ○    |   —    |   ○    |
| ABC270 F  |   ○    |   —    |   ○    |
| ABC270 G  |   ○    |   —    |   ○    |
| ABC271 E  |   ○    |   —    |   ○    |
| ABC271 EX |   ○    |   —    |   ○    |
| ABC271 F  |   ○    |   —    |   ○    |
| ABC271 G  |   ○    |   —    |   ○    |
| ABC272 E  |   ○    |   —    |   ○    |
| ABC272 EX |   ○    |   ○    |   ○    |
| ABC272 F  |   ○    |   —    |   ○    |
| ABC272 G  |   ○    |   —    |   ○    |
| ABC273 E  |   ○    |   —    |   ○    |
| ABC273 EX |   ○    |   —    |   ○    |
| ABC273 F  |   ○    |   —    |   ○    |
| ABC273 G  |   ○    |   —    |   ○    |
| ABC274 E  |   ○    |   —    |   ○    |
| ABC274 EX |   ○    |   ○    |   ○    |
| ABC274 F  |   ○    |   —    |   ○    |
| ABC274 G  |   ○    |   —    |   ○    |
| ABC275 E  |   ○    |   —    |   ○    |
| ABC275 EX |   ○    |   ○    |   ○    |
| ABC275 F  |   ○    |   —    |   ○    |
| ABC275 G  |   ○    |   —    |   ○    |
| ABC276 E  |   ○    |   —    |   ○    |
| ABC276 EX |   ○    |   —    |   ○    |
| ABC276 F  |   ○    |   —    |   ○    |
| ABC276 G  |   ○    |   —    |   ○    |
| ABC277 E  |   ○    |   —    |   ○    |
| ABC277 EX |   ○    |   —    |   ○    |
| ABC277 F  |   ○    |   —    |   ○    |
| ABC277 G  |   ○    |   —    |   ○    |
| ABC278 E  |   ○    |   —    |   ○    |
| ABC278 EX |   ○    |   —    |   ○    |
| ABC278 F  |   ○    |   —    |   ○    |
| ABC278 G  |   ○    |   —    |   ○    |
| ABC279 E  |   ○    |   —    |   ○    |
| ABC279 EX |   ○    |   —    |   ○    |
| ABC279 F  |   ○    |   —    |   ○    |
| ABC279 G  |   ○    |   —    |   ○    |
| ABC280 E  |   ○    |   —    |   ○    |
| ABC280 EX |   ○    |   —    |   ○    |
| ABC280 F  |   ○    |   —    |   ○    |
| ABC280 G  |   ○    |   ○    |   ○    |
| ABC281 E  |   ○    |   —    |   ○    |
| ABC281 EX |   ○    |   ○    |   ○    |
| ABC281 F  |   ○    |   —    |   ○    |
| ABC281 G  |   ○    |   —    |   ○    |
| ABC282 E  |   ○    |   —    |   ○    |
| ABC282 EX |   ○    |   —    |   ○    |
| ABC282 F  |   ○    |   —    |   ○    |
| ABC282 G  |   ○    |   —    |   ○    |
| ABC283 E  |   ○    |   —    |   ○    |
| ABC283 EX |   ○    |   —    |   ○    |
| ABC283 F  |   ○    |   —    |   ○    |
| ABC283 G  |   ○    |   —    |   ○    |
| ABC284 E  |   ○    |   —    |   ○    |
| ABC284 EX |   ○    |   —    |   ○    |
| ABC284 F  |   ○    |   —    |   ○    |
| ABC284 G  |   ○    |   —    |   ○    |
| ABC285 E  |   ○    |   —    |   ○    |
| ABC285 EX |   ○    |   —    |   ○    |
| ABC285 F  |   ○    |   —    |   ○    |
| ABC285 G  |   ○    |   —    |   ○    |
| ABC286 E  |   ○    |   —    |   ○    |
| ABC286 EX |   ○    |   —    |   ○    |
| ABC286 F  |   ○    |   ○    |   ○    |
| ABC286 G  |   ○    |   —    |   ○    |
| ABC287 E  |   ○    |   —    |   ○    |
| ABC287 EX |   ○    |   —    |   ○    |
| ABC287 F  |   ○    |   —    |   ○    |
| ABC287 G  |   ○    |   —    |   ○    |
| ABC288 E  |   ○    |   —    |   ○    |
| ABC288 EX |   ○    |   —    |   ○    |
| ABC288 F  |   ○    |   —    |   ○    |
| ABC288 G  |   ○    |   —    |   ○    |
| ABC289 E  |   ○    |   —    |   ○    |
| ABC289 EX |   ○    |   ○    |   ○    |
| ABC289 F  |   ○    |   —    |   ○    |
| ABC289 G  |   ○    |   —    |   ○    |
| ABC290 E  |   ○    |   —    |   ○    |
| ABC290 EX |   ○    |   —    |   ○    |
| ABC290 F  |   ○    |   —    |   ○    |
| ABC290 G  |   ○    |   —    |   ○    |
| ABC291 E  |   ○    |   —    |   ○    |
| ABC291 EX |   ○    |   —    |   ○    |
| ABC291 F  |   ○    |   —    |   ○    |
| ABC291 G  |   ○    |   —    |   ○    |
| ABC292 E  |   ○    |   —    |   ○    |
| ABC292 EX |   ○    |   —    |   ○    |
| ABC292 F  |   ○    |   —    |   ○    |
| ABC292 G  |   ○    |   —    |   ○    |
| ABC293 E  |   ○    |   —    |   ○    |
| ABC293 EX |   ○    |   —    |   ○    |
| ABC293 F  |   ○    |   —    |   ○    |
| ABC293 G  |   ○    |   —    |   ○    |
| ABC294 E  |   ○    |   —    |   ○    |
| ABC294 EX |   ○    |   —    |   ○    |
| ABC294 F  |   ○    |   —    |   ○    |
| ABC294 G  |   ○    |   ○    |   ○    |
| ABC295 E  |   ○    |   —    |   ○    |
| ABC295 EX |   ○    |   —    |   ○    |
| ABC295 F  |   ○    |   —    |   ○    |
| ABC295 G  |   ○    |   —    |   ○    |
| ABC296 E  |   ○    |   —    |   ○    |
| ABC296 EX |   ○    |   —    |   ○    |
| ABC296 F  |   ○    |   —    |   ○    |
| ABC296 G  |   ○    |   —    |   ○    |
| ABC297 E  |   ○    |   —    |   ○    |
| ABC297 EX |   ○    |   ○    |   ○    |
| ABC297 F  |   ○    |   —    |   ○    |
| ABC297 G  |   ○    |   —    |   ○    |
| ABC298 E  |   ○    |   —    |   ○    |
| ABC298 EX |   ○    |   —    |   ○    |
| ABC298 F  |   ○    |   —    |   ○    |
| ABC298 G  |   ○    |   —    |   ○    |
| ABC299 E  |   ○    |   —    |   ○    |
| ABC299 EX |   ○    |   —    |   ○    |
| ABC299 F  |   ○    |   —    |   ○    |
| ABC299 G  |   ○    |   —    |   ○    |
| ABC300 E  |   ○    |   —    |   ○    |
| ABC300 EX |   ○    |   —    |   ○    |
| ABC300 F  |   ○    |   —    |   ○    |
| ABC300 G  |   ○    |   —    |   ○    |
| ABC301 E  |   ○    |   —    |   ○    |
| ABC301 EX |   ○    |   ○    |   ○    |
| ABC301 F  |   ○    |   ○    |   ○    |
| ABC301 G  |   ○    |   —    |   ○    |
| ABC302 E  |   ○    |   —    |   ○    |
| ABC302 EX |   ○    |   —    |   ○    |
| ABC302 F  |   ○    |   —    |   ○    |
| ABC302 G  |   ○    |   —    |   ○    |
| ABC303 E  |   ○    |   —    |   ○    |
| ABC303 EX |   ○    |   —    |   ○    |
| ABC303 F  |   ○    |   —    |   ○    |
| ABC303 G  |   ○    |   —    |   ○    |
| ABC304 E  |   ○    |   —    |   ○    |
| ABC304 EX |   ○    |   —    |   ○    |
| ABC304 F  |   ○    |   —    |   ○    |
| ABC304 G  |   ○    |   —    |   ○    |
| ABC305 E  |   ○    |   —    |   ○    |
| ABC305 EX |   ○    |   —    |   ○    |
| ABC305 F  |   ○    |   ○    |   ○    |
| ABC305 G  |   ○    |   ○    |   ○    |
| ABC306 E  |   ○    |   —    |   ○    |
| ABC306 EX |   ○    |   —    |   ○    |
| ABC306 F  |   ○    |   —    |   ○    |
| ABC306 G  |   ○    |   —    |   ○    |
| ABC307 E  |   ○    |   —    |   ○    |
| ABC307 EX |   ○    |   —    |   ○    |
| ABC307 F  |   ○    |   —    |   ○    |
| ABC307 G  |   ○    |   —    |   ○    |
| ABC308 E  |   ○    |   —    |   ○    |
| ABC308 EX | 要修正 |   —    |   ○    |
| ABC308 F  |   ○    |   —    |   ○    |
| ABC308 G  |   ○    |   —    |   ○    |
| ABC309 E  |   ○    |   —    |   ○    |
| ABC309 EX |   ○    |   —    |   ○    |
| ABC309 F  |   ○    |   —    |   ○    |
| ABC309 G  |   ○    |   —    |   ○    |
| ABC310 E  |   ○    |   —    |   ○    |
| ABC310 EX |   ○    |   —    |   ○    |
| ABC310 F  |   ○    |   —    |   ○    |
| ABC310 G  |   ○    |   —    |   ○    |
| ABC311 E  |   ○    |   ○    |   ○    |
| ABC311 EX |   ○    |   —    |   ○    |
| ABC311 F  |   ○    |   —    |   ○    |
| ABC311 G  |   ○    |   —    |   ○    |
| ABC312 E  |   ○    |   —    |   ○    |
| ABC312 EX |   ○    |   —    |   ○    |
| ABC312 F  |   ○    |   —    |   ○    |
| ABC312 G  |   ○    |   —    |   ○    |
| ABC313 E  |   ○    |   —    |   ○    |
| ABC313 EX |   ○    |   —    |   ○    |
| ABC313 F  |   ○    |   —    |   ○    |
| ABC313 G  |   ○    |   —    |   ○    |
| ABC314 E  |   ○    |   —    |   ○    |
| ABC314 EX |   ○    |   —    |   ○    |
| ABC314 F  |   ○    |   —    |   ○    |
| ABC314 G  |   ○    |   —    |   ○    |
| ABC315 E  |   ○    |   —    |   ○    |
| ABC315 EX |   ○    |   —    |   ○    |
| ABC315 F  |   ○    |   —    |   ○    |
| ABC315 G  |   ○    |   —    |   ○    |
| ABC317 E  |   ○    |   —    |   ○    |
| ABC317 EX |   ○    |   ○    |   ○    |
| ABC317 F  |   ○    |   —    |   ○    |
| ABC317 G  |   ○    |   —    |   ○    |
| ABC318 E  |   ○    |   —    |   ○    |
| ABC318 EX |   ○    |   ○    |   ○    |
| ABC318 F  |   ○    |   —    |   ○    |
| ABC318 G  |   ○    |   —    |   ○    |
| ABC319 E  |   ○    |   —    |   ○    |
| ABC319 F  |   ○    |   —    |   ○    |
| ABC319 G  |   ○    |   —    |   ○    |
| ABC320 E  |   ○    |   —    |   ○    |
| ABC320 F  |   ○    |   —    |   ○    |
| ABC320 G  |   ○    |   —    |   ○    |
| ABC321 E  |   ○    |   —    |   ○    |
| ABC321 F  |   ○    |   —    |   ○    |
| ABC321 G  |   ○    |   —    |   ○    |
| ABC322 E  |   ○    |   —    |   ○    |
| ABC322 F  |   ○    |   —    |   ○    |
| ABC322 G  |   ○    |   —    |   ○    |
| ABC323 E  |   ○    |   —    |   ○    |
| ABC323 F  |   ○    |   —    |   ○    |
| ABC323 G  |   ○    |   —    |   ○    |
| ABC324 E  |   ○    |   —    |   ○    |
| ABC324 F  |   ○    |   —    |   ○    |
| ABC324 G  |   ○    |   —    |   ○    |
| ABC325 E  |   ○    |   —    |   ○    |
| ABC325 F  |   ○    |   —    |   ○    |
| ABC325 G  |   ○    |   —    |   ○    |
| ABC326 E  |   ○    |   —    |   ○    |
| ABC326 F  |   ○    |   —    |   ○    |
| ABC326 G  |   ○    |   —    |   ○    |
| ABC327 E  |   ○    |   —    |   ○    |
| ABC327 F  |   ○    |   —    |   ○    |
| ABC327 G  |   ○    |   —    |   ○    |
| ABC328 E  |   ○    |   —    |   ○    |
| ABC328 F  |   ○    |   —    |   ○    |
| ABC328 G  |   ○    |   —    |   ○    |
| ABC329 E  |   ○    |   —    |   ○    |
| ABC329 F  |   ○    |   —    |   ○    |
| ABC329 G  |   ○    |   —    |   ○    |
| ABC330 E  |   ○    |   —    |   ○    |
| ABC330 F  |   ○    |   —    |   ○    |
| ABC330 G  |   ○    |   —    |   ○    |
| ABC331 E  |   ○    |   —    |   ○    |
| ABC331 F  |   ○    |   —    |   ○    |
| ABC331 G  |   ○    |   ○    |   ○    |
| ABC332 E  |   ○    |   —    |   ○    |
| ABC332 F  |   ○    |   —    |   ○    |
| ABC332 G  |   ○    |   —    |   ○    |
| ABC333 E  |   ○    |   —    |   ○    |
| ABC333 F  |   ○    |   —    |   ○    |
| ABC333 G  |   ○    |   —    |   ○    |
| ABC334 E  |   ○    |   —    |   ○    |
| ABC334 F  |   ○    |   —    |   ○    |
| ABC334 G  |   ○    |   —    |   ○    |
| ABC335 E  |   ○    |   ○    |   ○    |
| ABC335 F  |   ○    |   —    |   ○    |
| ABC335 G  |   ○    |   ○    |   ○    |
| ABC336 E  |   ○    |   —    |   ○    |
| ABC336 F  |   ○    |   —    |   ○    |
| ABC336 G  |   ○    |   —    |   ○    |
| ABC337 E  |   ○    |   —    |   ○    |
| ABC337 F  |   ○    |   —    |   ○    |
| ABC337 G  |   ○    |   —    |   ○    |
| ABC338 E  |   ○    |   —    |   ○    |
| ABC338 F  |   ○    |   —    |   ○    |
| ABC338 G  |   ○    |   —    |   ○    |
| ABC339 E  |   ○    |   —    |   ○    |
| ABC339 F  |   ○    |   —    |   ○    |
| ABC339 G  |   ○    |   —    |   ○    |
| ABC340 E  |   ○    |   —    |   ○    |
| ABC340 F  |   ○    |   —    |   ○    |
| ABC340 G  |   ○    |   —    |   ○    |
| ABC341 E  |   ○    |   —    |   ○    |
| ABC341 F  |   ○    |   —    |   ○    |
| ABC341 G  |   ○    |   —    |   ○    |
| ABC342 E  |   ○    |   —    |   ○    |
| ABC342 F  |   ○    |   —    |   ○    |
| ABC342 G  |   ○    |   —    |   ○    |
| ABC343 E  |   ○    |   —    |   ○    |
| ABC343 F  |   ○    |   —    |   ○    |
| ABC343 G  |   ○    |   —    |   ○    |
| ABC344 E  |   ○    |   —    |   ○    |
| ABC344 F  |   ○    |   —    |   ○    |
| ABC344 G  |   ○    |   —    |   ○    |
| ABC345 E  |   ○    |   —    |   ○    |
| ABC345 F  |   ○    |   —    |   ○    |
| ABC345 G  |   ○    |   ○    |   ○    |
| ABC346 E  |   ○    |   —    |   ○    |
| ABC346 F  |   ○    |   —    |   ○    |
| ABC346 G  |   ○    |   —    |   ○    |
| ABC347 E  |   ○    |   —    |   ○    |
| ABC347 F  |   ○    |   —    |   ○    |
| ABC347 G  |   ○    |   —    |   ○    |
| ABC348 E  |   ○    |   —    |   ○    |
| ABC348 F  |   ○    |   —    |   ○    |
| ABC348 G  |   ○    |   —    |   ○    |
| ABC349 E  |   ○    |   —    |   ○    |
| ABC349 F  |   ○    |   —    |   ○    |
| ABC349 G  |   ○    |   —    |   ○    |
| ABC350 E  |   ○    |   —    |   ○    |
| ABC350 F  |   ○    |   —    |   ○    |
| ABC350 G  |   ○    |   —    |   ○    |
| ABC351 E  |   ○    |   —    |   ○    |
| ABC351 F  |   ○    |   —    |   ○    |
| ABC351 G  |   ○    |   —    |   ○    |
| ABC352 E  |   ○    |   —    |   ○    |
| ABC352 F  |   ○    |   —    |   ○    |
| ABC352 G  |   ○    | 要修正 |   ○    |
| ABC353 E  |   ○    |   —    |   ○    |
| ABC353 F  |   ○    |   —    |   ○    |
| ABC353 G  |   ○    |   —    |   ○    |
| ABC354 E  |   ○    |   —    |   ○    |
| ABC354 F  |   ○    |   —    |   ○    |
| ABC354 G  |   ○    |   —    |   ○    |
| ABC355 E  |   ○    |   ○    |   ○    |
| ABC355 F  | 要修正 |   —    | 要修正 |
| ABC355 G  |   ○    |   ○    |   ○    |
| ABC356 E  |   ○    |   —    |   ○    |
| ABC356 F  |   ○    |   —    |   ○    |
| ABC356 G  |   ○    |   —    |   ○    |
| ABC357 E  |   ○    |   —    |   ○    |
| ABC357 F  |   ○    |   —    |   ○    |
| ABC357 G  |   ○    |   ○    |   ○    |
| ABC358 E  |   ○    |   —    |   ○    |
| ABC358 F  |   ○    |   —    |   ○    |
| ABC358 G  |   ○    |   —    |   ○    |
| ABC359 E  |   ○    |   —    |   ○    |
| ABC359 F  |   ○    |   —    |   ○    |
| ABC359 G  |   ○    |   —    |   ○    |
| ABC360 E  |   ○    |   —    |   ○    |
| ABC360 F  |   ○    |   —    |   ○    |
| ABC360 G  |   ○    |   —    |   ○    |
| ABC361 E  |   ○    |   —    |   ○    |
| ABC361 F  |   ○    |   —    |   ○    |
| ABC361 G  |   ○    |   —    |   ○    |
| ABC362 E  |   ○    |   —    |   ○    |
| ABC362 F  |   ○    |   —    |   ○    |
| ABC362 G  |   ○    |   —    |   ○    |
| ABC363 E  |   ○    |   —    |   ○    |
| ABC363 F  |   ○    |   —    |   ○    |
| ABC363 G  |   ○    |   —    |   ○    |
| ABC364 E  |   ○    |   —    |   ○    |
| ABC364 F  |   ○    |   —    |   ○    |
| ABC364 G  |   ○    |   —    |   ○    |
| ABC365 E  |   ○    |   —    |   ○    |
| ABC365 F  |   ○    |   —    |   ○    |
| ABC365 G  |   ○    |   —    |   ○    |
| ABC366 E  |   ○    |   —    |   ○    |
| ABC366 F  |   ○    |   —    |   ○    |
| ABC366 G  |   ○    |   —    |   ○    |
| ABC367 E  |   ○    |   —    |   ○    |
| ABC367 F  |   ○    |   —    |   ○    |
| ABC367 G  |   ○    |   —    |   ○    |
| ABC368 E  |   ○    |   —    |   ○    |
| ABC368 F  |   ○    |   —    |   ○    |
| ABC368 G  |   ○    |   —    |   ○    |
| ABC369 E  |   ○    |   —    |   ○    |
| ABC369 F  |   ○    |   —    |   ○    |
| ABC369 G  |   ○    |   —    |   ○    |
| ABC370 E  |   ○    |   —    |   ○    |
| ABC370 F  |   ○    |   —    |   ○    |
| ABC370 G  |   ○    |   —    |   ○    |
| ABC371 E  |   ○    |   —    |   ○    |
| ABC371 F  |   ○    |   —    |   ○    |
| ABC371 G  |   ○    |   ○    |   ○    |
| ABC372 E  |   ○    |   —    |   ○    |
| ABC372 F  |   ○    |   —    |   ○    |
| ABC372 G  |   ○    |   —    |   ○    |
| ABC373 E  |   ○    |   —    |   ○    |
| ABC373 F  |   ○    |   —    |   ○    |
| ABC373 G  |   ○    |   —    |   ○    |
| ABC374 E  |   ○    |   —    |   ○    |
| ABC374 F  |   ○    |   —    |   ○    |
| ABC374 G  |   ○    |   —    |   ○    |
| ABC375 E  |   ○    |   —    |   ○    |
| ABC375 F  |   ○    |   —    |   ○    |
| ABC375 G  |   ○    |   —    |   ○    |
| ABC376 E  |   ○    |   —    |   ○    |
| ABC376 F  |   ○    |   —    |   ○    |
| ABC376 G  |   ○    |   —    |   ○    |
| ABC377 E  |   ○    |   —    |   ○    |
| ABC377 F  |   ○    |   —    |   ○    |
| ABC377 G  |   ○    |   —    |   ○    |
| ABC378 E  |   ○    |   —    |   ○    |
| ABC378 F  |   ○    |   —    |   ○    |
| ABC378 G  |   ○    |   —    |   ○    |
| ABC379 E  |   ○    |   —    |   ○    |
| ABC379 F  |   ○    |   —    |   ○    |
| ABC379 G  |   ○    |   —    |   ○    |
| ABC380 E  |   ○    |   —    |   ○    |
| ABC380 F  |   ○    |   —    |   ○    |
| ABC380 G  |   ○    |   —    |   ○    |
| ABC381 E  |   ○    |   —    |   ○    |
| ABC381 F  |   ○    |   —    |   ○    |
| ABC381 G  |   ○    |   —    |   ○    |
| ABC382 E  |   ○    |   —    |   ○    |
| ABC382 F  |   ○    |   —    |   ○    |
| ABC382 G  |   ○    |   —    |   ○    |
| ABC383 E  |   ○    |   —    |   ○    |
| ABC383 F  |   ○    |   —    |   ○    |
| ABC383 G  |   ○    |   —    |   ○    |
| ABC384 E  |   ○    |   —    |   ○    |
| ABC384 F  |   ○    |   —    |   ○    |
| ABC384 G  |   ○    |   —    |   ○    |
| ABC385 E  |   ○    |   —    |   ○    |
| ABC385 F  |   ○    |   —    |   ○    |
| ABC385 G  |   ○    |   ○    |   ○    |
| ABC386 E  |   ○    |   —    |   ○    |
| ABC386 F  |   ○    |   —    |   ○    |
| ABC386 G  |   ○    |   ○    |   ○    |
| ABC387 E  |   ○    |   —    |   ○    |
| ABC387 F  |   ○    |   —    |   ○    |
| ABC387 G  |   ○    |   ○    |   ○    |
| ABC388 E  |   ○    |   —    |   ○    |
| ABC388 F  |   ○    |   —    |   ○    |
| ABC388 G  |   ○    |   —    |   ○    |
| ABC389 E  |   ○    |   —    |   ○    |
| ABC389 F  |   ○    |   —    |   ○    |
| ABC389 G  |   ○    |   —    |   ○    |
| ABC390 E  |   ○    |   —    |   ○    |
| ABC390 F  |   ○    |   —    |   ○    |
| ABC390 G  |   ○    |   ○    |   ○    |
| ABC391 E  |   ○    |   —    |   ○    |
| ABC391 F  |   ○    |   —    |   ○    |
| ABC391 G  |   ○    |   —    |   ○    |
| ABC392 E  |   ○    |   —    |   ○    |
| ABC392 F  |   ○    |   —    |   ○    |
| ABC392 G  |   ○    | 要修正 |   ○    |
| ABC393 E  |   ○    |   —    |   ○    |
| ABC393 F  |   ○    |   —    |   ○    |
| ABC393 G  |   ○    |   —    |   ○    |
| ABC394 E  |   ○    |   —    |   ○    |
| ABC394 F  |   ○    |   —    |   ○    |
| ABC394 G  |   ○    |   —    |   ○    |
| ABC395 E  |   ○    |   —    |   ○    |
| ABC395 F  |   ○    |   —    |   ○    |
| ABC395 G  |   ○    |   —    |   ○    |
| ABC396 E  |   ○    |   —    |   ○    |
| ABC396 F  |   ○    |   —    |   ○    |
| ABC396 G  |   ○    |   —    |   ○    |
| ABC397 E  |   ○    |   —    |   ○    |
| ABC397 F  |   ○    |   —    |   ○    |
| ABC397 G  |   ○    |   —    |   ○    |
| ABC398 E  | 要修正 | 要修正 |   ○    |
| ABC398 F  |   ○    |   —    |   ○    |
| ABC398 G  | 要修正 | 要修正 |   ○    |
| ABC399 E  |   ○    |   —    |   ○    |
| ABC399 F  |   ○    |   —    |   ○    |
| ABC399 G  |   ○    |   —    |   ○    |
| ABC400 E  |   ○    |   —    |   ○    |
| ABC400 F  |   ○    |   —    |   ○    |
| ABC400 G  |   ○    |   —    |   ○    |
| ABC401 E  |   ○    |   —    |   ○    |
| ABC401 F  |   ○    |   —    |   ○    |
| ABC401 G  |   ○    |   —    |   ○    |
| ABC402 E  |   ○    |   —    |   ○    |
| ABC402 F  |   ○    |   —    |   ○    |
| ABC402 G  |   ○    |   —    |   ○    |
| ABC403 E  |   ○    |   —    |   ○    |
| ABC403 F  |   ○    |   —    |   ○    |
| ABC403 G  |   ○    |   —    |   ○    |
| ABC404 E  |   ○    |   —    |   ○    |
| ABC404 F  |   ○    |   —    |   ○    |
| ABC404 G  |   ○    |   —    |   ○    |
| ABC405 E  |   ○    |   —    |   ○    |
| ABC405 F  |   ○    |   —    |   ○    |
| ABC405 G  |   ○    |   —    |   ○    |
| ABC406 E  |   ○    |   —    |   ○    |
| ABC406 F  |   ○    |   —    |   ○    |
| ABC406 G  |   ○    |   —    |   ○    |
| ABC407 E  |   ○    |   —    |   ○    |
| ABC407 F  |   ○    |   —    |   ○    |
| ABC407 G  |   ○    |   —    |   ○    |
| ABC408 E  |   ○    |   —    |   ○    |
| ABC408 F  |   ○    |   —    |   ○    |
| ABC408 G  |   ○    |   —    |   ○    |
| ABC409 E  |   ○    |   —    |   ○    |
| ABC409 F  |   ○    |   —    |   ○    |
| ABC409 G  |   ○    |   ○    |   ○    |
| ABC410 E  |   ○    |   —    |   ○    |
| ABC410 F  |   ○    |   —    |   ○    |
| ABC410 G  |   ○    |   —    |   ○    |
| ABC411 E  |   ○    |   ○    |   ○    |
| ABC411 F  |   ○    |   —    |   ○    |
| ABC411 G  |   ○    |   —    |   ○    |
| ABC412 E  |   ○    |   —    |   ○    |
| ABC412 F  |   ○    |   —    |   ○    |
| ABC412 G  |   ○    |   —    |   ○    |
| ABC413 E  |   ○    |   —    |   ○    |
| ABC413 F  |   ○    |   —    |   ○    |
| ABC413 G  |   ○    |   —    |   ○    |
| ABC414 E  |   ○    |   —    |   ○    |
| ABC414 F  |   ○    |   —    |   ○    |
| ABC414 G  |   ○    |   —    |   ○    |
| ABC415 E  |   ○    |   —    |   ○    |
| ABC415 F  |   ○    |   —    |   ○    |
| ABC415 G  |   ○    |   —    |   ○    |
| ABC416 E  |   ○    |   —    |   ○    |
| ABC416 F  |   ○    |   —    |   ○    |
| ABC416 G  |   ○    |   —    |   ○    |
| ABC417 E  |   ○    |   —    |   ○    |
| ABC417 F  |   ○    |   —    |   ○    |
| ABC417 G  |   ○    |   —    |   ○    |
| ABC418 E  |   ○    |   —    |   ○    |
| ABC418 F  |   ○    |   —    |   ○    |
| ABC418 G  |   ○    |   ○    |   ○    |
| ABC419 E  |   ○    |   —    |   ○    |
| ABC419 F  |   ○    |   ○    |   ○    |
| ABC419 G  |   ○    |   ○    |   ○    |
| ABC420 E  |   ○    |   —    |   ○    |
| ABC420 F  |   ○    |   —    |   ○    |
| ABC420 G  |   ○    |   —    |   ○    |
| ABC421 E  |   ○    |   —    |   ○    |
| ABC421 F  |   ○    |   —    |   ○    |
| ABC421 G  |   ○    |   —    |   ○    |
| ABC422 E  |   ○    |   —    |   ○    |
| ABC422 F  |   ○    |   —    |   ○    |
| ABC422 G  |   ○    | 要修正 |   ○    |
| ABC423 E  |   ○    |   —    |   ○    |
| ABC423 F  |   ○    |   —    |   ○    |
| ABC423 G  |   ○    |   —    |   ○    |
| ABC424 E  |   ○    |   —    |   ○    |
| ABC424 F  |   ○    |   —    |   ○    |
| ABC424 G  |   ○    |   —    |   ○    |
| ABC425 E  |   ○    |   —    |   ○    |
| ABC425 F  |   ○    |   —    |   ○    |
| ABC425 G  |   ○    |   —    |   ○    |
| ABC426 E  |   ○    |   —    |   ○    |
| ABC426 F  |   ○    |   —    |   ○    |
| ABC426 G  |   ○    |   —    |   ○    |
| ABC427 E  |   ○    |   —    |   ○    |
| ABC427 F  |   ○    |   —    |   ○    |
| ABC427 G  |   ○    |   —    |   ○    |
| ABC428 E  |   ○    |   —    |   ○    |
| ABC428 F  |   ○    |   —    |   ○    |
| ABC428 G  |   ○    |   —    |   ○    |
| ABC429 E  |   ○    |   —    |   ○    |
| ABC429 F  |   ○    |   —    |   ○    |
| ABC429 G  |   ○    |   —    |   ○    |
| ABC430 E  |   ○    |   —    |   ○    |
| ABC430 F  |   ○    |   —    |   ○    |
| ABC430 G  |   ○    |   —    |   ○    |
| ABC431 E  |   ○    |   —    |   ○    |
| ABC431 F  |   ○    |   —    |   ○    |
| ABC431 G  |   ○    |   —    |   ○    |
| ABC432 E  |   ○    |   —    |   ○    |
| ABC432 F  |   ○    |   —    |   ○    |
| ABC432 G  |   ○    |   ○    |   ○    |
| ABC433 E  |   ○    |   —    |   ○    |
| ABC433 F  |   ○    |   —    |   ○    |
| ABC433 G  |   ○    |   —    |   ○    |
| ABC434 E  |   ○    |   —    |   ○    |
| ABC434 F  |   ○    |   —    |   ○    |
| ABC434 G  |   ○    |   —    |   ○    |
| ABC435 E  |   ○    |   —    |   ○    |
| ABC435 F  |   ○    |   —    |   ○    |
| ABC435 G  |   ○    |   —    |   ○    |
| ABC436 E  |   ○    |   —    |   ○    |
| ABC436 F  |   ○    |   —    |   ○    |
| ABC436 G  |   ○    |   ○    |   ○    |
| ABC437 E  |   ○    |   —    |   ○    |
| ABC437 F  |   ○    |   —    |   ○    |
| ABC437 G  |   ○    |   —    |   ○    |
| ABC438 E  |   ○    |   —    |   ○    |
| ABC438 F  |   ○    |   —    |   ○    |
| ABC438 G  |   ○    |   —    |   ○    |
| ABC439 E  |   ○    |   —    |   ○    |
| ABC439 F  |   ○    |   —    |   ○    |
| ABC439 G  |   ○    |   ○    |   ○    |
| ABC440 E  |   ○    |   —    |   ○    |
| ABC440 F  |   ○    |   —    |   ○    |
| ABC440 G  |   ○    |   —    |   ○    |
| ABC441 E  |   ○    |   —    |   ○    |
| ABC441 F  |   ○    |   —    |   ○    |
| ABC441 G  |   ○    |   —    |   ○    |
| ABC442 E  |   ○    |   —    |   ○    |
| ABC442 F  |   ○    |   —    |   ○    |
| ABC442 G  |   ○    |   —    |   ○    |
| ABC443 E  |   ○    |   —    |   ○    |
| ABC443 F  |   ○    |   —    |   ○    |
| ABC443 G  |   ○    |   —    |   ○    |
| ABC444 E  |   ○    |   —    |   ○    |
| ABC444 F  |   ○    |   —    |   ○    |
| ABC444 G  |   ○    |   —    |   ○    |
| ABC445 E  |   ○    |   —    |   ○    |
| ABC445 F  |   ○    |   —    |   ○    |
| ABC445 G  |   ○    |   —    |   ○    |
| ABC446 E  |   ○    |   —    |   ○    |
| ABC446 F  |   ○    |   —    |   ○    |
| ABC446 G  |   ○    |   —    |   ○    |
| ABC447 E  |   ○    |   —    |   ○    |
| ABC447 F  |   ○    |   —    |   ○    |
| ABC447 G  |   ○    |   —    |   ○    |
| ABC448 E  |   ○    |   —    |   ○    |
| ABC448 F  |   ○    |   —    |   ○    |
| ABC448 G  |   ○    |   —    |   ○    |
| ABC449 E  |   ○    |   —    |   ○    |
| ABC449 F  |   ○    |   —    |   ○    |
| ABC449 G  |   ○    |   ○    |   ○    |
| ABC450 E  |   ○    |   —    |   ○    |
| ABC450 F  |   ○    |   —    |   ○    |
| ABC450 G  |   ○    |   —    |   ○    |
| ABC451 E  |   ○    |   —    |   ○    |
| ABC451 F  |   ○    |   —    |   ○    |
| ABC451 G  | 要修正 |   —    | 要修正 |
| ABC452 E  |   ○    |   —    |   ○    |
| ABC452 F  |   ○    |   —    |   ○    |
| ABC452 G  |   ○    |   —    |   ○    |
| ABC453 E  |   ○    |   —    |   ○    |
| ABC453 F  |   ○    |   —    |   ○    |
| ABC453 G  |   ○    |   —    |   ○    |
| ABC454 E  |   ○    |   —    |   ○    |
| ABC454 F  |   ○    |   —    |   ○    |
| ABC454 G  |   ○    |   —    |   ○    |
| ABC455 E  |   ○    |   —    |   ○    |
| ABC455 F  |   ○    |   —    |   ○    |
| ABC455 G  |   ○    |   —    |   ○    |
| ABC456 E  |   ○    |   —    |   ○    |
| ABC456 F  |   ○    |   —    |   ○    |
| ABC456 G  |   ○    |   —    |   ○    |
| ABC457 E  |   ○    |   —    |   ○    |
| ABC457 F  |   ○    |   —    |   ○    |
| ABC457 G  |   ○    |   —    | 要修正 |
| ABC458 E  |   ○    |   —    |   ○    |
| ABC458 F  |   ○    |   ○    |   ○    |
| ABC458 G  |   ○    |   —    |   ○    |
| ABC459 E  |   ○    |   —    |   ○    |
| ABC459 F  |   ○    |   —    |   ○    |
| ABC459 G  |   ○    |   —    |   ○    |
| ABC460 E  |   ○    |   —    |   ○    |
| ABC460 F  |   ○    |   —    |   ○    |
| ABC460 G  |   ○    |   —    |   ○    |
| ABC461 E  |   ○    |   —    |   ○    |
| ABC461 F  |   ○    |   —    |   ○    |
| ABC461 G  |   ○    |   —    |   ○    |
| ABC462 E  |   ○    |   —    |   ○    |
| ABC462 F  |   ○    |   —    |   ○    |
| ABC462 G  |   ○    |   —    |   ○    |
| ABC463 E  |   ○    |   —    |   ○    |
| ABC463 F  |   ○    |   —    |   ○    |
| ABC463 G  |   ○    |   —    |   ○    |
| ABC464 E  |   ○    |   —    |   ○    |
| ABC464 F  |   ○    |   —    |   ○    |
| ABC464 G  |   ○    |   —    |   ○    |
| ABC465 E  |   ○    |   —    |   ○    |
| ABC465 F  |   ○    |   —    |   ○    |
| ABC465 G  |   ○    |   —    |   ○    |
| ABC466 E  |   ○    |   —    |   ○    |
| ABC466 F  |   ○    |   —    |   ○    |
| ABC466 G  |   ○    |   ○    |   ○    |
