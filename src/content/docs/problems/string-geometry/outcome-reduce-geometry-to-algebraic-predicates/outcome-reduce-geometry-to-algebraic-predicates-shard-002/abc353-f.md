---
title: "ABC353-F — Tile Distance"
draft: true
authoringUnit: {"problemId":"abc353-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc353-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc353-editorial-9936-509e9f0eee652edd2a928ddd74ea483002ee0d86c772f63f19bc7c42870e77e9","source-abc353-f-problem-75ae7813bfc2b129711ae72749e8cc373492d2c390c7354744dbf827865695a9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"小tileだけの経路はManhattan直行候補。大tileを使う経路では最初と最後に入る大tileを固定でき、その外側を最短直進へ置換して悪化しない。各端から四方向最初の大tileを全て候補にすれば最適を覆う。大tile間の閉式をK=2とその他で分けて評価し、両端tollと直行を比較すれば最小になる。","sourceRevisionIds":["source-abc353-editorial-9936-509e9f0eee652edd2a928ddd74ea483002ee0d86c772f63f19bc7c42870e77e9","source-abc353-f-problem-75ae7813bfc2b129711ae72749e8cc373492d2c390c7354744dbf827865695a9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"K=3、S=(3,0)、T=(5,2)。","procedure":["両方block index(1,0)の大tile内。","同じtile内の移動は境界を跨がずtoll0。"],"executionTarget":null,"expectedResult":"0。","verificationStatus":"not_applicable","learningUnitIds":["unit-geometry-primitives"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"K=1,S=(0,0),T=(3,2)では。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"5。"},"answer":{"reasoningOrVerification":"tileは全て一格子cellで大tileによる改善がない。Manhattan距離3+2。","procedure":["具体例の各状態・寄与を再計算する。","tileは全て一格子cellで大tileによる改善がない。Manhattan距離3+2。"],"expectedResult":"5。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

小 tile だけを通る経路の toll は通常の Manhattan 距離で、まず有効な上界になる。これより改善する経路は必ず大 tile を少なくとも一つ通る。

開始点が小 tile 内なら最初に入る大 tile は上下左右に最初に当たる高々4個、終了側も同様なので、大 tile を使う経路は入口・出口の高々16組へ絞れる。

採用する候補: 直行 Manhattan 解と、始終点近傍の大 tile 候補対をすべて結ぶ解を比較し、大 tile 間距離を格子座標の閉形式で求める。

無限盤面を定数個の候補へ圧縮でき、大 tile graph の規則性から候補対距離も O(1) になる。

棄却する候補: 通過 tile を頂点とする無限 graph 上で Dijkstra 法を行う。

座標が2×10^16で探索範囲を有限に制限できず、周期的 tile 配置の距離式を利用していない。

大 tile を使う最適路の最初と最後を固定すれば、その外側区間は小 tile だけを直進して到達する候補に置き換えても最適値を失わない。

大 tile index 差 dx,dy の移動 toll は K=2 の特殊な横隣接と、K≠2 で対角方向の一点共有を使う場合で式が異なる。

K=1 は Manhattan 距離を返す。K≥2 では各点を含む block の parity から、その点が大 tile 内なら一候補、小 tile なら四方向で最初の大 tile と入口 toll を列挙する。始終候補全組について、公式の大 tile 間距離式（K=2 とその他を分岐）＋両端 toll を計算し、直行解との最小を取る。

## 典型の発動条件

### 周期盤面の gateway 列挙

発動条件: 広大・無限な周期空間で、低コスト領域へ入るまでの候補方向が定数個のとき。

始終点から最初/最後に使う gateway を列挙し、内部距離を閉形式化する。

### 格子距離の座標変換

発動条件: checkerboard 状の大 block 間移動が対角・軸方向で異なるとき。

block index の和差または dx,dy から最小 toll を算出する。

## 問題固有の要素

大 tile を使わない上界を先に持つことで、「使うなら最初と最後の大 tile だけを決める」という経路正規化ができる。

別の問題へ持ち帰る視点: 特殊な高速領域がある最短路では、通常経路上界と高速領域への gateway 分解を試す。

## 正当性

小tileだけの経路はManhattan直行候補。大tileを使う経路では最初と最後に入る大tileを固定でき、その外側を最短直進へ置換して悪化しない。各端から四方向最初の大tileを全て候補にすれば最適を覆う。大tile間の閉式をK=2とその他で分けて評価し、両端tollと直行を比較すれば最小になる。

## 実装上の注意

- K=1 と K=2 は距離式の例外として分岐する。floor(x/K) の parity と tile の実座標を混同せず、全計算を 64 bit 以上で行う。

## 復習の核

- 大 tile graph を小さい K で描き、対角接触と横移動の toll を数えて式を導く。例外 K=2 を一般式へ無理に混ぜない。

## 計算量と制約

### 時間

O(1)。四方向入口・出口の高々16組を比較する。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq K\leq10^{16}; 0\leq S_x\leq2\times10^{16}; 0\leq S_y\leq2\times10^{16}; 0\leq T_x\leq2\times10^{16}; 0\leq T_y\leq2\times10^{16}; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

K=3、S=(3,0)、T=(5,2)。

1. 両方block index(1,0)の大tile内。
2. 同じtile内の移動は境界を跨がずtoll0。

期待される結果: 0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

K=1,S=(0,0),T=(3,2)では。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

tileは全て一格子cellで大tileによる改善がない。Manhattan距離3+2。

確認結果: 5。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/editorial/9936) — source-abc353-editorial-9936-509e9f0eee652edd2a928ddd74ea483002ee0d86c772f63f19bc7c42870e77e9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/tasks/abc353_f) — source-abc353-f-problem-75ae7813bfc2b129711ae72749e8cc373492d2c390c7354744dbf827865695a9
