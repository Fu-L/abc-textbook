---
title: "ABC258-F — Main Street"
draft: true
authoringUnit: {"problemId":"abc258-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc258-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc258-editorial-4237-f64386f7dcd8dcbd2521070103668d59be2948a5eba1d7c8349965e9de0754d5","source-abc258-f-problem-e69b00e450a590b4f1f26d98031df0a0dcbc28ede9a4274f20f2b21b68bab788"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"大通りを使わない経路は通常道路のManhattan距離を費用K倍した候補で覆う。使う経路では最初と最後の大通りへの出入りを各点の上下左右の直近のB倍線への射影へ移して損をしない。四入口×四出口を尽くせば最適経路を含む。大通り間は交差する方向や別帯ではManhattan距離、同じ帯の平行路なら両側の直交大通りを経由する二つの迂回を比較する。この例外を含めた厳密な網内距離と出入り費用を最小化する。","sourceRevisionIds":["source-abc258-editorial-4237-f64386f7dcd8dcbd2521070103668d59be2948a5eba1d7c8349965e9de0754d5","source-abc258-f-problem-e69b00e450a590b4f1f26d98031df0a0dcbc28ede9a4274f20f2b21b68bab788"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"B=10,K=2、S=(1,1),G=(9,1)。","procedure":["全通常道路なら水平距離8に費用2を掛け16。","Sからy=0へ1、そこで水平に8、Gへ1移動する。","費用は2+8+2=12。y=10経由や縦大通り経由はこれより長い。"],"executionTarget":null,"expectedResult":"最小費用12。","verificationStatus":"not_applicable","learningUnitIds":["unit-geometry-primitives"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"prerequisiteIds":["unit-bounded-enumeration"],"attainmentCondition":"同じ点でK=1なら最適費用はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"8。全通常道路の直線移動が達成し、費用単価は全道路で1なのでManhattan距離8を下回れない。大通り使用を強制しない。"},"answer":{"reasoningOrVerification":"8。全通常道路の直線移動が達成し、費用単価は全道路で1なのでManhattan距離8を下回れない。大通り使用を強制しない。","procedure":["具体例の各状態・寄与を再計算する。","8。全通常道路の直線移動が達成し、費用単価は全道路で1なのでManhattan距離8を下回れない。大通り使用を強制しない。"],"expectedResult":"8。全通常道路の直線移動が達成し、費用単価は全道路で1なのでManhattan距離8を下回れない。大通り使用を強制しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

大通りを使う経路で最初に到達する大通り点は、始点から上下左右へ進んで最初にxまたはyがBの倍数になる四射影のいずれかであり、終点側も同様である。

採用する候補: 始終点の四射影を全組合せし、大通り間の厳密距離を評価

入口・出口候補は各4個だけなので16組を調べ、周期的な大通り網内の距離を同一帯の迂回だけ場合分けすれば各テストを定数時間で解ける。

棄却する候補: 座標平面を頂点としてDijkstra

座標は10^9まで広がり、周期構造を展開したグラフを構築できない。

棄却する候補: 必ず大通りを使う

大通りへ寄る距離や同一帯での迂回が大きい場合、全区間を通常道路で進む方が安い。

大通りを使わない候補はK(|S_x-G_x|+|S_y-G_y|)で独立に評価する。

二つの大通り点間は通常マンハッタン距離で移動できるが、同方向の平行大通り上で同じB幅の帯にいる場合だけ、最寄り交差大通りへの迂回と帯内を通常道路で横切る経路を比較する。

各点からfloor/ceilしたB倍数の縦線・横線への四射影を列挙する。入口までは通常費用K、入口・出口間は大通り網距離、出口から終点も通常費用Kとして16組の最小を取り、全て通常道路の候補とも比較する。

## 典型の発動条件

### 境界候補の定数列挙

発動条件: 周期的な高速領域へ初めて入る点が各軸方向の最近境界に限られる。

始終点それぞれの上下左右のB倍数射影だけを入口・出口候補にする。

### 周期格子上の距離場合分け

発動条件: 格子線上は安いが、平行線間の移動には交差線または高価な横断が必要になる。

マンハッタン可否を判定し、同一帯だけ上下または左右の境界迂回と通常横断を比較する。

## 問題固有の要素

無限に見える大通り網でも、一般道路から最初・最後に触れる点を4候補へ絞ると、中央部は周期セル一個の幾何だけで評価できる。

別の問題へ持ち帰る視点: 周期的な高速領域を含む最短路は、進入・退出候補の支配関係を示して定数列挙へ落とす。

## 正当性

大通りを使わない経路は通常道路のManhattan距離を費用K倍した候補で覆う。使う経路では最初と最後の大通りへの出入りを各点の上下左右の直近のB倍線への射影へ移して損をしない。四入口×四出口を尽くせば最適経路を含む。大通り間は交差する方向や別帯ではManhattan距離、同じ帯の平行路なら両側の直交大通りを経由する二つの迂回を比較する。この例外を含めた厳密な網内距離と出入り費用を最小化する。

## 実装上の注意

- 距離と費用積は64ビットで持ち、剰余・帯番号にはBを使う。K=1でも全通常候補を残し、射影が重複してもよい。同一帯の上下・左右両迂回を比較する。

## 復習の核

- 小座標で格子グラフDijkstraと比較し、両端が大通り上、同じ平行線、同一帯の別平行線、交差点経由、K=1、B=1を確認する。

## 計算量と制約

### 時間

各テストO(1)、全体O(T)。

### 空間

O(1)補助領域。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 2 \times 10^5; 1 \le B,K \le 10^9; 0 \le S_x,S_y,G_x,G_y \le 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

B=10,K=2、S=(1,1),G=(9,1)。

1. 全通常道路なら水平距離8に費用2を掛け16。
2. Sからy=0へ1、そこで水平に8、Gへ1移動する。
3. 費用は2+8+2=12。y=10経由や縦大通り経由はこれより長い。

期待される結果: 最小費用12。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ点でK=1なら最適費用はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

8。全通常道路の直線移動が達成し、費用単価は全道路で1なのでManhattan距離8を下回れない。大通り使用を強制しない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/editorial/4237) — source-abc258-editorial-4237-f64386f7dcd8dcbd2521070103668d59be2948a5eba1d7c8349965e9de0754d5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/tasks/abc258_f) — source-abc258-f-problem-e69b00e450a590b4f1f26d98031df0a0dcbc28ede9a4274f20f2b21b68bab788
