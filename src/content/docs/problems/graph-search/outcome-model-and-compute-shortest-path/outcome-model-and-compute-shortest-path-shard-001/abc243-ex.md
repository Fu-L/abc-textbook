---
title: "ABC243-EX — Builder Takahashi (Enhanced version)"
draft: true
authoringUnit: {"problemId":"abc243-ex","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc243-ex.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc243-editorial-3546-89a660b3c8dda82dde57aa36a38a94770e60efb75f91ba72b8d5d4ac1c78a971","source-abc243-ex-problem-cb35728cca943b2ff65de0edea1b620bf01183421366f241251dbf8132adbebe"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"4近傍で移動する二領域の境界は8近傍の壁鎖であり、外部をΩで結ぶと閉路になる。S-G曲線を横切るたび内外が入れ替わるので、奇数交差が分断と等価。全壁が正費用であるため、最小の奇数閉歩道に実壁への寄り道や弦があれば、奇数な部分閉路を取り出して壁を減らせる。従って全始点を通じた最小値に寄与するものは単純な分断閉路で、外部Ωも高々一度でよい。無駄な壁がない最小配置の壁集合はその閉路を一意に定める。\n\n奇数交差の辺には赤い壁マスが関わるので、全最小配置は赤始点の探索に現れる。早い赤頂点を削除することにより、最初の赤頂点だけから数えられる。同じ閉路をその頂点から辿る方向は二つなので、全体を2で割れば壁集合の個数になる。距離から1を引く補正とΩの費用0により、距離は実際の壁数に一致する。","sourceRevisionIds":["source-abc243-editorial-3546-89a660b3c8dda82dde57aa36a38a94770e60efb75f91ba72b8d5d4ac1c78a971","source-abc243-ex-problem-cb35728cca943b2ff65de0edea1b620bf01183421366f241251dbf8132adbebe"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

移動は4近傍だが、移動を遮る壁の連結は8近傍で考える。最小の遮断配置は、SとGを分ける8近傍の壁の閉路として表せる。境界に達する壁の鎖も扱うため、盤面外部を一頂点Ωへ縮約する。壁を置ける「.」だけを実頂点にし、8近傍の組と、境界の「.」からΩへの辺を張る。O、S、Gは壁頂点にしない。

SからGへ、盤面のマスを通る単純なManhattan pathを一つ選び、そのマス列を赤とする。マス中心を結ぶ線を少しずらし、壁頂点を通らないS-G曲線γを作る。辺eがγを横切る回数の偶奇をb_eとする。8近傍の実辺は中心間の線分、Ωへの辺は中心から盤面境界へ出る線分と外部を通る接続で表す。外部での接続はγを横切らないので、内側の線分の交差だけでb_eを求められる。端の外部を通常の壁として費用1で数えてはならない。

閉路に沿ってb_eをxorした値が1なら、その閉路はSとGを分断する。全ての分断閉路は赤いマスを少なくとも一つ含むので、赤い「.」を始点vとして奇数閉路の最短距離と通り数を求める。

同じ壁集合を複数の赤始点から数えないよう、赤マスの順番を固定する。vを処理するときは、それ以前の赤い「.」をグラフから除く。これで各閉路は最も早い赤頂点だけに割り当てられる。

状態を(現在頂点u,交差偶奇p,Ωを使用済みかz)とする。開始(v,0,0)の距離は1。辺を渡るとpをb_eで反転し、到着先が実壁なら1、Ωなら0を加える。Ωは一度までに限定する。目標(v,1,z)では始点を二度数えているので、距離から1を引く。0/1距離なので0-1 BFS、またはDijkstraで求められる。最小壁数の閉路だけを合計し、最後に逆向き二通りを除くため2で割る。存在しなければNo。

経路数は距離計算後、最短辺だけのDAGで数えるとよい。距離昇順、同距離では実頂点をΩより先に処理する。費用0の辺はΩへ入る辺だけで、Ωから出る辺は費用1。したがってこの順番で全最短辺の寄与が確定する。Dijkstraのpop順の同距離だけに任せると、Ωへ後から入る同距離の経路数を落とす。

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

4近傍で移動する二領域の境界は8近傍の壁鎖であり、外部をΩで結ぶと閉路になる。S-G曲線を横切るたび内外が入れ替わるので、奇数交差が分断と等価。全壁が正費用であるため、最小の奇数閉歩道に実壁への寄り道や弦があれば、奇数な部分閉路を取り出して壁を減らせる。従って全始点を通じた最小値に寄与するものは単純な分断閉路で、外部Ωも高々一度でよい。無駄な壁がない最小配置の壁集合はその閉路を一意に定める。

奇数交差の辺には赤い壁マスが関わるので、全最小配置は赤始点の探索に現れる。早い赤頂点を削除することにより、最初の赤頂点だけから数えられる。同じ閉路をその頂点から辿る方向は二つなので、全体を2で割れば壁集合の個数になる。距離から1を引く補正とΩの費用0により、距離は実際の壁数に一致する。

## 実装上の注意

- Ωは外部全体を表す一頂点であり費用0。同じ境界壁とΩの辺を複数作らず、Ωの再訪も許さない。
- γを壁中心や辺の端点に通さず、交差判定の端点規約を固定する。赤いpathを単純な折れ線にすると交差偶奇は整数座標を一定倍率し、小さな固定ずれを加えて外積で判定できる。
- 早い赤頂点を除外した各始点の最短値を、全始点の最小値と比較して通り数を合計する。始点の再加算を1だけ引き、逆向きの重複を2で割る。
- 距離0のΩへの辺があるので、経路数の確定順は距離昇順かつ同距離で実頂点を先にする。

## 復習の核

移動の4近傍と壁の8近傍を区別し、外部を費用0の一頂点にする。交差偶奇、最初の赤頂点、方向二通りの三段階で分断条件と重複を処理する。

## 計算量と制約

### 時間

O((H+W)HW log(HW))。赤始点はO(H+W)、状態・辺はO(HW)。Dijkstraと最短距離順の経路数集計を各始点で行う。交差bitはManhattan pathの定数本の線分で前計算できる。

### 空間

O(HW)。グラフ、4倍状態の距離・経路数を始点ごとに再利用する。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H \leq 100; 2 \leq W \leq 100; C_{i,j} is S, G, ., or O.; Each of S and G appears exactly once in C_{i,j}.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/editorial/3546) — source-abc243-editorial-3546-89a660b3c8dda82dde57aa36a38a94770e60efb75f91ba72b8d5d4ac1c78a971
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/tasks/abc243_h) — source-abc243-ex-problem-cb35728cca943b2ff65de0edea1b620bf01183421366f241251dbf8132adbebe
