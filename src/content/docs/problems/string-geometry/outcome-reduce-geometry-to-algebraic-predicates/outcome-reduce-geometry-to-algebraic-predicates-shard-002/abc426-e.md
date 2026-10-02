---
title: "ABC426-E — Closest Moment"
draft: true
authoringUnit: {"problemId":"abc426-e","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc426-e.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc426-e-problem-064cb3ae02052d71eb4c77ee70984fb8d76f9ba8578c9bc580933b2b46f0cef3","source-abc426-editorial-14151-841f0e2f065f1d8848b53ab8df599a199a5740f9c0153aa032edd6c748269877"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"到着時刻順に区間を分けると相対位置は各区間で一次関数なので、距離最小は原点とその相対segmentの最短距離に等しい。同時移動区間の端相対位置と停止後の移動segmentを求めれば全時刻を覆う。segmentへの射影を[0,1]にclampすることで区間外の最小点を除き、二区間最小を取ると全時刻最小になる。","sourceRevisionIds":["source-abc426-e-problem-064cb3ae02052d71eb4c77ee70984fb8d76f9ba8578c9bc580933b2b46f0cef3","source-abc426-editorial-14151-841f0e2f065f1d8848b53ab8df599a199a5740f9c0153aa032edd6c748269877"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"Takahashiは(0,0)→(4,0)、Aokiは(2,2)→(2,0)、共に単位速度。","procedure":["時刻2で両者(2,0)にいる。","距離は非負なので0が下限かつ達成。"],"executionTarget":null,"expectedResult":"0。","verificationStatus":"not_applicable","learningUnitIds":["unit-geometry-primitives"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"prerequisiteIds":[],"attainmentCondition":"両者が(0,0)→(4,0)と(0,3)→(4,3)なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"3。"},"answer":{"reasoningOrVerification":"同じ速度で並走し相対位置は常に(0,−3)。同時到着後も距離3。","procedure":["具体例の各状態・寄与を再計算する。","同じ速度で並走し相対位置は常に(0,−3)。同時到着後も距離3。"],"expectedResult":"3。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

二人はいずれも線分上を単位速度で進み、短い方が到着した後だけ一人が動く。長い移動時間 p と短い移動時間 q に揃えると、距離ベクトルは各時間区間で一次関数になる。

採用する候補: p≥q となるよう二人を交換し、同時移動区間 [0,q] と一人だけ動く区間 [q,p] をそれぞれ原点と線分の最短距離へ帰着する。

各フェーズの相対位置が線分を動く点となり、点と線分の距離を定数時間で求められる。

棄却する候補: 時刻全体を細かく刻んで二人の距離をサンプリングする。

連続時刻の真の最小値を保証できず、刻み幅による誤差管理も不要に難しい。

同時移動中の相対位置は (A-C)+(t/q)((E-A)-(D-C)) であり、t/q∈[0,1] に対して一つの線分を描く。

一人の到着後は、動く側の線分 EB と停止点 D の距離を求めればよい。

p<q なら人物を入れ替える。時刻 q の長い側の位置 E=A+(q/p)(B-A) を求め、相対位置の端点 A-C と E-D を結ぶ線分から原点への距離、および線分 EB から D への距離の小さい方を返す。

## 典型の発動条件

### 相対運動

発動条件: 複数点が同時に等速直線運動し、その距離の最小値を求めるとき。

一方から他方を引いた相対位置を考え、時間に対する一本の線分へ変換する。

### 点と線分の距離

発動条件: 連続パラメータ上の一次ベクトルのノルムを最小化するとき。

射影係数を [0,1] に clamp して最近点を求めるか、凸性を用いた三分探索で評価する。

## 問題固有の要素

停止時刻で区切ることで、速度が変わる運動も二本の相対位置線分だけに整理できる。

別の問題へ持ち帰る視点: 連続時間の等速運動では座標を個別追跡せず、相対位置が描く幾何図形を見る。

## 正当性

到着時刻順に区間を分けると相対位置は各区間で一次関数なので、距離最小は原点とその相対segmentの最短距離に等しい。同時移動区間の端相対位置と停止後の移動segmentを求めれば全時刻を覆う。segmentへの射影を[0,1]にclampすることで区間外の最小点を除き、二区間最小を取ると全時刻最小になる。

## 実装上の注意

- 長さ 0 の線分では除算を避けて端点距離を使う。浮動小数の出力精度と、p<q の人物交換後の座標対応に注意する。

## 復習の核

- 時刻 q の E が長い側の移動比 q/p で計算されているか、両フェーズの端点が時刻 q で連続するかを確認する。

## 計算量と制約

### 時間

各case O(1)。同時移動と片方停止の二segment距離。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 2\times 10^5; -100\leq TS_X,TS_Y,TG_X,TG_Y,AS_X,AS_Y,AG_X,AG_Y \leq 100; (TS_X,TS_Y)\neq (TG_X,TG_Y); (AS_X,AS_Y)\neq (AG_X,AG_Y); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

Takahashiは(0,0)→(4,0)、Aokiは(2,2)→(2,0)、共に単位速度。

1. 時刻2で両者(2,0)にいる。
2. 距離は非負なので0が下限かつ達成。

期待される結果: 0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

両者が(0,0)→(4,0)と(0,3)→(4,3)なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じ速度で並走し相対位置は常に(0,−3)。同時到着後も距離3。

確認結果: 3。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc426/tasks/abc426_e) — source-abc426-e-problem-064cb3ae02052d71eb4c77ee70984fb8d76f9ba8578c9bc580933b2b46f0cef3
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc426/editorial/14151) — source-abc426-editorial-14151-841f0e2f065f1d8848b53ab8df599a199a5740f9c0153aa032edd6c748269877
