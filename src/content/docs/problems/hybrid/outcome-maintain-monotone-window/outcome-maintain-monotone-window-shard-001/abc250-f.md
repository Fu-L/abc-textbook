---
title: "ABC250-F — One Fourth"
draft: true
authoringUnit: {"problemId":"abc250-f","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc250-f.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc250-editorial-3928-5023b9af8aa1da66ab00900f5b4489f1f6945435795598250a9021f4744f04b9","source-abc250-f-problem-f073c65fa9a08b3cce95e5d85aac92471a16dda3bec9211a0af9189e1ebec2b2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"面積を2倍した外積和で保持すれば、四分の一との差は|全体の2倍面積-4×部分の2倍面積|として整数だけで比較できる。 始点を一つ進めても最適な終点は後退しないので、頂点列を巡回配列として二本のポインタを全体で線形回だけ動かせる。 凸性による面積の単調性から、各始点で終点を戻さず進められ、目標を跨ぐ直前と直後だけで最小差を評価できる。","sourceRevisionIds":["source-abc250-editorial-3928-5023b9af8aa1da66ab00900f5b4489f1f6945435795598250a9021f4744f04b9","source-abc250-f-problem-f073c65fa9a08b3cce95e5d85aac92471a16dda3bec9211a0af9189e1ebec2b2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-monotone-window"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"正方形(0,0),(2,0),(2,2),(0,2)。","procedure":["全2倍面積S=8。","三頂点の三角形のE=4、差abs(S−4E)=8。"],"executionTarget":null,"expectedResult":"最小整数評価値8。","verificationStatus":"not_applicable","learningUnitIds":["unit-two-pointers-window"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-monotone-window"],"prerequisiteIds":["unit-geometry-primitives"],"attainmentCondition":"外積評価に浮動小数の1/4を掛ける必要はあるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ない。全て2倍面積としてabs(S−4E)を整数で比較できる。"},"answer":{"reasoningOrVerification":"ない。全て2倍面積としてabs(S−4E)を整数で比較できる。","procedure":["具体例の各状態・寄与を再計算する。","ない。全て2倍面積としてabs(S−4E)を整数で比較できる。"],"expectedResult":"ない。全て2倍面積としてabs(S−4E)を整数で比較できる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

凸多角形で始点を固定すると、対角線のもう一端を周上で進めた部分多角形の面積は単調に増えるため、4倍面積が全体面積を跨ぐ位置だけ調べればよい。

採用する候補: 符号付き面積を更新する二点法

凸性による面積の単調性から、各始点で終点を戻さず進められ、目標を跨ぐ直前と直後だけで最小差を評価できる。

棄却する候補: 全ての対角線について切り取る面積を計算する

対角線が二次個あり、N=2×10^5では列挙できない。

面積を2倍した外積和で保持すれば、四分の一との差は|全体の2倍面積-4×部分の2倍面積|として整数だけで比較できる。

始点を一つ進めても最適な終点は後退しないので、頂点列を巡回配列として二本のポインタを全体で線形回だけ動かせる。

全体の2倍面積Sを求め、頂点を巡回させながら部分多角形の2倍面積Eを外積で増減する。各左端について4EがSを超えるまで右端を進め、跨ぐ前後の|S-4E|で答えを更新する。

## 典型の発動条件

### 凸多角形の二点法

発動条件: 一方の端点を固定した部分面積が他方の端点に対して単調に変化する。

目標面積を跨ぐ終点を単調ポインタで追跡する。

### 外積による面積差分

発動条件: 座標多角形の面積を正確に高速更新したい。

三角形の外積を足し引きして、浮動小数点なしで部分面積を維持する。

## 問題固有の要素

最小値は目標四分の一を跨ぐ境界の両側にしか現れず、凸性がその境界を単調に移動させる。

別の問題へ持ち帰る視点: 連続的に見える幾何最適化でも、単調な量の閾値越えへ直せれば二点法が使える。

## 正当性

面積を2倍した外積和で保持すれば、四分の一との差は|全体の2倍面積-4×部分の2倍面積|として整数だけで比較できる。 始点を一つ進めても最適な終点は後退しないので、頂点列を巡回配列として二本のポインタを全体で線形回だけ動かせる。 凸性による面積の単調性から、各始点で終点を戻さず進められ、目標を跨ぐ直前と直後だけで最小差を評価できる。

## 実装上の注意

- 全ての面積計算を64ビット整数で行い、右端が始点を一周越えないよう制限し、閾値を跨ぐ直前の候補も必ず評価する。

## 復習の核

- 三角形・長方形・細長い凸多角形で二次全探索と比較し、ポインタ更新時の面積の足し引きと巡回端の候補漏れを確認する。

## 計算量と制約

### 時間

O(N)、凸多角形の巡回two pointers。

### 空間

O(N)、頂点。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 4 \le N \le 10^5; |X_i|, |Y_i| \le 4 \times 10^8; The given points are the vertices of a convex N-gon in the counterclockwise order.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

正方形(0,0),(2,0),(2,2),(0,2)。

1. 全2倍面積S=8。
2. 三頂点の三角形のE=4、差abs(S−4E)=8。

期待される結果: 最小整数評価値8。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

外積評価に浮動小数の1/4を掛ける必要はあるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ない。全て2倍面積としてabs(S−4E)を整数で比較できる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/editorial/3928) — source-abc250-editorial-3928-5023b9af8aa1da66ab00900f5b4489f1f6945435795598250a9021f4744f04b9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/tasks/abc250_f) — source-abc250-f-problem-f073c65fa9a08b3cce95e5d85aac92471a16dda3bec9211a0af9189e1ebec2b2
