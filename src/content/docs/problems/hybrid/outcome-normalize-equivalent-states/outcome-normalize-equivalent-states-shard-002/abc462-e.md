---
title: "ABC462-E — Alternating Costs"
draft: true
authoringUnit: {"problemId":"abc462-e","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-002/abc462-e.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc462-e-problem-00806f6d57842b99312dcaefcffc5016befda8ee2283e0605fe7955230afdeb4","source-abc462-editorial-21400-74eb05e0e855bd0c2c27e61b16b3533c5cc934b55ca3c73f9e7d0ec6974d2236"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最適walkは折返し位置を調整して、parityが奇数なら最後の一歩を目標へ近づくXまたはY方向に限定できる。 偶数2K歩では各costがK回ずつ現れ、座標達成に必要なB側move数だけがKのpiecewise-linear関数を作る。 正規化後、K≤Yで必要な高cost移動最小数から g(K)=2KA+(Y-K)(B-A) が一次式となり、K≥Yでは2KAでYが最小なので端点以外に最適はない。","sourceRevisionIds":["source-abc462-e-problem-00806f6d57842b99312dcaefcffc5016befda8ee2283e0605fe7955230afdeb4","source-abc462-editorial-21400-74eb05e0e855bd0c2c27e61b16b3533c5cc934b55ca3c73f9e7d0ec6974d2236"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-equivalent-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"終点座標(X,Y)=(2,1)、一歩が座標和parityを反転する。","procedure":["X+Y=3は奇数。","最後の一歩をx向きにすると残り(1,1)、y向きなら(2,0)でいずれも偶数和。"],"executionTarget":null,"expectedResult":"偶数case二候補の最小に最後の対応costを加える。","verificationStatus":"not_applicable","learningUnitIds":["unit-normalization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-equivalent-states"],"prerequisiteIds":["unit-basic-convex-optimization"],"attainmentCondition":"負座標も別の全分岐として列挙する必要があるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"符号対称性で絶対値へ正規化できる。軸交換時は対応するcost A,Bも交換する。"},"answer":{"reasoningOrVerification":"符号対称性で絶対値へ正規化できる。軸交換時は対応するcost A,Bも交換する。","procedure":["具体例の各状態・寄与を再計算する。","符号対称性で絶対値へ正規化できる。軸交換時は対応するcost A,Bも交換する。"],"expectedResult":"符号対称性で絶対値へ正規化できる。軸交換時は対応するcost A,Bも交換する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

座標符号は往復で反転できるため |X|,|Y|だけ見ればよい。総移動回数が偶数なら奇数回cost Aと偶数回cost Bの回数が等しく、軸交換も含めてA≤B、X≤Yへ正規化できる。

採用する候補: X+Y偶数では半移動回数Kの実行可能区間端 K=(X+Y)/2 と K=Y の二点だけcost一次式 g(K)を評価し、奇数では最後の一歩をx/y方向に固定した二つの偶数caseへ帰着する。

正規化後、K≤Yで必要な高cost移動最小数から g(K)=2KA+(Y-K)(B-A) が一次式となり、K≥Yでは2KAでYが最小なので端点以外に最適はない。

棄却する候補: 座標(X,Y)までの最短costを広いgrid上のDijkstraで求める。

座標が巨大で状態空間を列挙できず、交互costのphaseを含めるとさらに倍増する。

最適walkは折返し位置を調整して、parityが奇数なら最後の一歩を目標へ近づくXまたはY方向に限定できる。

偶数2K歩では各costがK回ずつ現れ、座標達成に必要なB側move数だけがKのpiecewise-linear関数を作る。

X,Yを絶対値化する。evenSolveでA,BとX,Yを必要に応じswapし、g((X+Y)/2),g(Y)を計算してminを返す。X+Y奇数なら有効な(X-1,Y)+Aと(X,Y-1)+BのevenSolveを比較する。

## 典型の発動条件

### 対称性による標準化

発動条件: 格子移動で座標符号・軸・交互costの役割に対称性があるとき。

絶対値とswapでparameter順序を固定する。

### piecewise-linear目的の端点評価

発動条件: 自由な余分移動回数Kに対するcostが区間ごとの一次式になるとき。

傾き一定なので各定義域端だけ比較する。

## 問題固有の要素

巨大grid最短路も、移動回数parityと各cost回数を固定すると一変数の線形最適化へ落ちる。

別の問題へ持ち帰る視点: 対称性で係数と座標を同時にsortするとcaseworkを本質的な一ケースへ縮められる。

## 正当性

最適walkは折返し位置を調整して、parityが奇数なら最後の一歩を目標へ近づくXまたはY方向に限定できる。 偶数2K歩では各costがK回ずつ現れ、座標達成に必要なB側move数だけがKのpiecewise-linear関数を作る。 正規化後、K≤Yで必要な高cost移動最小数から g(K)=2KA+(Y-K)(B-A) が一次式となり、K≥Yでは2KAでYが最小なので端点以外に最適はない。

## 実装上の注意

- odd caseでX=0またはY=0の負座標遷移を除外せず、絶対値対称性込みの引数を正しく渡す。積は64 bit上限を確認する。

## 復習の核

- 2K歩中のA/B回数と必要な高costmove数を数え、g(K)の定義域二端だけで十分な理由を傾きから確認する。

## 計算量と制約

### 時間

O(1)、対称性正規化と定数候補のpiecewise-linear評価。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 2\times 10^5; 1\le A,B\le 10^9; -10^9\le X,Y\le 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

終点座標(X,Y)=(2,1)、一歩が座標和parityを反転する。

1. X+Y=3は奇数。
2. 最後の一歩をx向きにすると残り(1,1)、y向きなら(2,0)でいずれも偶数和。

期待される結果: 偶数case二候補の最小に最後の対応costを加える。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

負座標も別の全分岐として列挙する必要があるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

符号対称性で絶対値へ正規化できる。軸交換時は対応するcost A,Bも交換する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/tasks/abc462_e) — source-abc462-e-problem-00806f6d57842b99312dcaefcffc5016befda8ee2283e0605fe7955230afdeb4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/editorial/21400) — source-abc462-editorial-21400-74eb05e0e855bd0c2c27e61b16b3533c5cc934b55ca3c73f9e7d0ec6974d2236
