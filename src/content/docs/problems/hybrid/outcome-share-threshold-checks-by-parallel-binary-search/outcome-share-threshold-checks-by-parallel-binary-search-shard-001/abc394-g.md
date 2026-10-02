---
title: "ABC394-G — Dense Buildings"
draft: true
authoringUnit: {"problemId":"abc394-g","docPath":"src/content/docs/problems/hybrid/outcome-share-threshold-checks-by-parallel-binary-search/outcome-share-threshold-checks-by-parallel-binary-search-shard-001/abc394-g.md","learningOutcomeIds":["outcome-share-threshold-checks-by-parallel-binary-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-event-sweep","unit-monotone-search"],"excludedTopics":["parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-parallel-binary-search","tag-dsu-components","tag-event-sweep","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc394-editorial-12282-bf22c5a958afc0c0ebfae7594d29091c765a99a1e40f40090bb106e241d13598","source-abc394-g-problem-3d32764e92489392c72461f71cf57a7da6e8abcfe3e4b109a0a7423b7500e905"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"thresholdを下げるほど利用可能cell/edgeが増えるのでconnectivityは単調である。 edge capacityは両端buildingの低い方で、その高さ以下なら同階walkwayを渡れる。 高さmidでの連結判定をquery間で共有し、各roundにedgeを降順追加する一回のDSU sweepで全queryを更新できる。","sourceRevisionIds":["source-abc394-editorial-12282-bf22c5a958afc0c0ebfae7594d29091c765a99a1e40f40090bb106e241d13598","source-abc394-g-problem-3d32764e92489392c72461f71cf57a7da6e8abcfe3e4b109a0a7423b7500e905"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-share-threshold-checks-by-parallel-binary-search"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"二隣接building高さ5,3。","procedure":["edge capacity=min(5,3)=3。","threshold3で接続、4で不接続。"],"executionTarget":null,"expectedResult":"walkway bottleneck3。","verificationStatus":"not_applicable","learningUnitIds":["unit-parallel-binary-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-share-threshold-checks-by-parallel-binary-search"],"prerequisiteIds":["unit-dsu-components","unit-event-sweep","unit-monotone-search"],"attainmentCondition":"capacityを高い方5にしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"低いbuildingの階4は存在せず移動できないので両端のminが必要。"},"answer":{"reasoningOrVerification":"低いbuildingの階4は存在せず移動できないので両端のminが必要。","procedure":["具体例の各状態・寄与を再計算する。","低いbuildingの階4は存在せず移動できないので両端のminが必要。"],"expectedResult":"低いbuildingの階4は存在せず移動できないので両端のminが必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [parallel binary search・多数境界の判定共有](src/content/docs/learn/modeling/parallel-binary-search.md)

- 各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- parallel binary search・多数境界の判定共有の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

高さXのwalkwayだけで二building間を移動できるのは、高さX以上のcellだけを残したgridで両cellが連結なことと同値である。

二cellが連結でいられる最大threshold Mが分かれば、実際に使う高さはmin(M,Y,Z)で、階段回数はY+Z-2min(M,Y,Z)になる。

採用する候補: 隣接edgeのcapacity=min(F_u,F_v)でthreshold connectivityをDSU処理し、全queryをparallel binary searchする

高さmidでの連結判定をquery間で共有し、各roundにedgeを降順追加する一回のDSU sweepで全queryを更新できる。

棄却する候補: queryごとに高さを二分探索し、その都度grid BFSする

一判定O(HW)をQ logF回行い、最大2×10^5 queryでは不可能である。

thresholdを下げるほど利用可能cell/edgeが増えるのでconnectivityは単調である。

edge capacityは両端buildingの低い方で、その高さ以下なら同階walkwayを渡れる。

全grid隣接edgeをcapacity降順にsortする。各queryの[L,R) thresholdを持ち、mid別bucketを作るroundごとにDSUを初期化してedgeをthresholdまで追加し、endpoint連結ならL=mid、否ならR=midと更新する。確定Mから式を出力する。

## 典型の発動条件

### offline dynamic connectivity by threshold

発動条件: edgeがkey threshold以下/以上で単調に追加され、多数のpair接続閾値を求めるとき。

edge sortとDSU sweepを共有する。

### parallel binary search

発動条件: 多数queryが同じ単調更新列上でbinary searchするとき。

同じmid判定を一roundのdata structure sweepへまとめる。

## 問題固有の要素

walkway回数は無料なのでpath長でなく「path上の最小building高さを最大化するwidest path」だけがstairs最小化を決める。

別の問題へ持ち帰る視点: 移動costが高度を一度下げて戻す形なら、空間部分はbottleneck connectivityへ分離する。

## 正当性

thresholdを下げるほど利用可能cell/edgeが増えるのでconnectivityは単調である。 edge capacityは両端buildingの低い方で、その高さ以下なら同階walkwayを渡れる。 高さmidでの連結判定をquery間で共有し、各roundにedgeを降順追加する一回のDSU sweepで全queryを更新できる。

## 実装上の注意

- same cell queryでもfloorが異なるcaseはMをbuilding高さ相当として式が成り立つ。mid bucket処理のedge≥mid境界とL/R初期値を統一する。

## 復習の核

- 小gridで全threshold BFSとmax-min pathを列挙し、同cell、隣接cell、start/end floorがbottleneckより低いcaseを比較する。

## 計算量と制約

### 時間

O(E log E+log Hmax·(Eα(V)+Qα(V)+Q log Q))、V=HW,E=O(V)、midをsortするPBS版。

### 空間

O(V+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq H \leq 500; 1\leq W \leq 500; 1\leq F_{i,j} \leq 10^6; 1\leq Q\leq 2\times 10^5; 1\leq A_i,C_i\leq H; 1\leq B_i,D_i\leq W; 1\leq Y_i\leq F_{A_i,B_i}; 1\leq Z_i\leq F_{C_i,D_i}; (A_i,B_i,Y_i)\neq (C_i,D_i,Z_i); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

二隣接building高さ5,3。

1. edge capacity=min(5,3)=3。
2. threshold3で接続、4で不接続。

期待される結果: walkway bottleneck3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

capacityを高い方5にしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

低いbuildingの階4は存在せず移動できないので両端のminが必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc394/editorial/12282) — source-abc394-editorial-12282-bf22c5a958afc0c0ebfae7594d29091c765a99a1e40f40090bb106e241d13598
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc394/tasks/abc394_g) — source-abc394-g-problem-3d32764e92489392c72461f71cf57a7da6e8abcfe3e4b109a0a7423b7500e905
