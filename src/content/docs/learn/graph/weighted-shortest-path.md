---
title: "最短路モデル"
description: "「最短路モデル」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 92
---

# 最短路モデル

習得対象の目安: **緑色（800–1199）**。重みと状態の定義を確認し、Dijkstraなどの標準的な最短路算法を使い分ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第74単元。技能の説明を学んでから問題一覧へ進んでください。

前: [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/) ／ 次: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)

## 概要

### 最短路モデル

重み付きグラフに帰着し、距離の確定条件に応じた最短路法を選ぶ。

### 距離確定：非負重みを使う

緩和d[v]←min(d[v],d[u]+w)の式だけでは算法は決まらない。非負重みなら未確定頂点の最小距離を確定してよい。優先度付きキューのDijkstraはO((V+E) log V)。重みが0・1なら候補の距離が二層に限られ、0辺をdequeの前、1辺を後へ入れる0-1 BFSでO(V+E)。全辺1ならFIFOでよい。負辺のある元の式も、ポテンシャルで非負化できればこの原理へ戻せる。

### 依存順：経路集合を一段ずつ広げる

DAGではトポロジカル順が全先行状態の完了を保証し、重みが負でもO(V+E)でよい。ABC271 Eの辺列順では、処理済みprefixの辺をその順に選べる経路だけを表す。辺を自由に使う通常の最短路と混同せず、一つの辺出現を高々一度使う更新にする。

### 反復緩和：改善する閉路を検出する

Bellman–Fordでは高々k辺のwalkという不変量から、V−1回で十分な有限最短路と、V回目にも改善する到達可能な負閉路を区別する。O(VE)。最大路は符号反転して正閉路を調べる。始点から届く閉路でも、指定終点へ影響しなければその終点の答えは発散しない。

### 全点対：中継点集合のDP

Floyd–Warshallは中継点を{0,…,k−1}まで許す距離D_kを持ち、D_{k+1}[i][j]=min(D_k[i][j],D_k[i][k]+D_k[k][j])とする。kを最外ループにしてO(V³)、空間O(V²)。負辺は扱えるが負閉路のある組は有限距離と呼べない。ABC301 E・ABC338 Fでは距離計算は前処理であり、代表地点の訪問順と集合状態の設計が主題になる。

### 習得する技能

- 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
- 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。
- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

### このUnitでは扱わないもの

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC395 E「Flip Edge」](https://atcoder.jp/contests/abc395/tasks/abc395_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
2. [ABC463 E「Roads and Gates」](https://atcoder.jp/contests/abc463/tasks/abc463_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
3. [ABC325 E「Our clients, please wait a moment」](https://atcoder.jp/contests/abc325/tasks/abc325_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
4. [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
5. [ABC286 E「Souvenir」](https://atcoder.jp/contests/abc286/tasks/abc286_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
6. [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
7. [ABC277 E「Crystal Switches」](https://atcoder.jp/contests/abc277/tasks/abc277_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
8. [ABC237 E「Skiing」](https://atcoder.jp/contests/abc237/tasks/abc237_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
9. [ABC363 E「Sinking Land」](https://atcoder.jp/contests/abc363/tasks/abc363_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
10. [ABC271 E「Subsequence Path」](https://atcoder.jp/contests/abc271/tasks/abc271_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。既習技能: DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
11. [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
12. [ABC213 E「Stronger Takahashi」](https://atcoder.jp/contests/abc213/tasks/abc213_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
13. [ABC246 E「Bishop 2」](https://atcoder.jp/contests/abc246/tasks/abc246_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
14. [ABC431 E「Reflection on Grid」](https://atcoder.jp/contests/abc431/tasks/abc431_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
15. [ABC291 F「Teleporter and Closed off」](https://atcoder.jp/contests/abc291/tasks/abc291_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
16. [ABC342 E「Last Train」](https://atcoder.jp/contests/abc342/tasks/abc342_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
17. [ABC416 E「Development」](https://atcoder.jp/contests/abc416/tasks/abc416_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
18. [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
19. [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 BFSと部分集合DPを既習として、移動の全履歴を重要地点間の距離へ圧縮する。dp[S][v]から未訪問の代表地点へ進み、最後に出口への距離を加えて時間制約を判定する。通過した菓子を全て状態に記録しなくても最適値を失わない理由も確かめる。
20. [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
21. [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。 Floyd–Warshallと部分集合DPを既習として、最短路閉包上の訪問順DPへ変換する。maskは代表として訪問順へ追加した頂点集合であり、距離前計算の途中で通る頂点を禁止しない。任意のwalkから初訪問順を取り出す方向と、DP解をwalkへ展開する方向で同値性を示す。
22. [ABC375 G「Road Blocked 2」](https://atcoder.jp/contests/abc375/tasks/abc375_g) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。 両端からのDijkstraとlowlinkを既習として、d_s[u]+w(u,v)+d_t[v]=d_s[t]を満たす辺だけで最短路部分グラフを作る。そのグラフで橋になることと全最短路に不可欠なことを対応させる。元グラフの橋判定とは違う。正重みによる距離の増加を使って対応を証明する。
23. [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
24. [ABC245 G「Foreign Friends」](https://atcoder.jp/contests/abc245/tasks/abc245_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。
25. [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)。既習技能: 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。
26. [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。
27. [ABC243 Ex「Builder Takahashi (Enhanced version)」](https://atcoder.jp/contests/abc243/tasks/abc243_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f) — 主題: [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC252 E「Road Reduction」](https://atcoder.jp/contests/abc252/tasks/abc252_e) — 主題: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC261 G「Replace」](https://atcoder.jp/contests/abc261/tasks/abc261_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
- [ABC308 Ex「Make Q」](https://atcoder.jp/contests/abc308/tasks/abc308_h) — 主題: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC364 G「Last Major City」](https://atcoder.jp/contests/abc364/tasks/abc364_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)。既習技能: Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。 / 辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。 / 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC395 G「Minimum Steiner Tree 2」](https://atcoder.jp/contests/abc395/tasks/abc395_g) — 主題: [Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC414 G「AtCoder Express 4」](https://atcoder.jp/contests/abc414/tasks/abc414_g) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 / DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。

## 根拠

- [ABC213 E 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_e)
- [ABC213 E 公式解説](https://atcoder.jp/contests/abc213/editorial/2397)
- [ABC218 F 公式解説](https://atcoder.jp/contests/abc218/editorial/2606)
- [ABC218 F 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC232 G 公式解説](https://atcoder.jp/contests/abc232/editorial/3141)
- [ABC232 G 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-weighted-shortest-path`
