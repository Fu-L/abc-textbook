---
title: "ABC257-EX — Dice Sum 2"
draft: true
authoringUnit: {"problemId":"abc257-ex","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc257-ex.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives","unit-kinetic-order-maintenance"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull","tag-kinetic-order-maintenance"],"sourceRevisionIds":["source-abc257-editorial-4168-f4b0c81f2f0e7ca46ac56b229f127ec40515a09a6690d54425669db1055c8b4a","source-abc257-ex-problem-89026fea7c003dede5775fd2a883a7341d60c0ac91d927e54c17c5e2fe06451f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"独立な出目の和の二乗期待値は平均和の二乗と分散和に分かれる。分母を払った各サイコロを点(x_i,y_i)へ写すと目的は選択和(X,Y)に対するX²+Yとなる。この凸関数の最大は選択和集合の凸包頂点で達成され、上側の各頂点はあるcに対するcX+Yの最大、つまりcx_i+y_iの上位K個で得られる。順位が変わるのは二直線の交点のみなので全交点順のsweepで候補を尽くせる。同傾きイベントをまとめ、直前・直後の上位K集合の評価を漏らさない。","sourceRevisionIds":["source-abc257-editorial-4168-f4b0c81f2f0e7ca46ac56b229f127ec40515a09a6690d54425669db1055c8b4a","source-abc257-ex-problem-89026fea7c003dede5775fd2a883a7341d60c0ac91d927e54c17c5e2fe06451f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,K=1。サイコロ1は六面全て1、費用1。サイコロ2は六面全て2、費用1。","procedure":["どちらも分散0で、平均はそれぞれ1と2。","目的の期待値から費用を引くと1²−1=0、2²−1=3。","線形評価のsweepはこの二つの単点候補を覆う。"],"executionTarget":null,"expectedResult":"二番目を選び最大3。","verificationStatus":"not_applicable","learningUnitIds":["unit-convex-boundary-hull"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"prerequisiteIds":["unit-geometry-primitives","unit-kinetic-order-maintenance"],"attainmentCondition":"分散項を無視して平均だけが最大のサイコロを選んでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一般には不可。二乗期待値は平均の二乗に分散も加わる。平均が小さくても分散や費用の差で目的値が逆転し得るため、点のy座標を捨てない。"},"answer":{"reasoningOrVerification":"一般には不可。二乗期待値は平均の二乗に分散も加わる。平均が小さくても分散や費用の差で目的値が逆転し得るため、点のy座標を捨てない。","procedure":["具体例の各状態・寄与を再計算する。","一般には不可。二乗期待値は平均の二乗に分散も加わる。平均が小さくても分散や費用の差で目的値が逆転し得るため、点のy座標を捨てない。"],"expectedResult":"一般には不可。二乗期待値は平均の二乗に分散も加わる。平均が小さくても分散や費用の差で目的値が逆転し得るため、点のy座標を捨てない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)
- [kinetic sorting・交差event順序更新](src/content/docs/learn/modeling/kinetic-order-maintenance.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

選んだサイコロiの平均をx_i、二次モーメント補正から費用を引いた値をy_iとすると、目的期待値は(Σx_i)^2+Σy_iに変形できる。

採用する候補: K個和の上側凸包を線形評価のparametric sweepで列挙

凸関数X^2+Yの最大は選択和集合の凸包頂点にあり、各頂点はあるcでcX+Yが最大、すなわち個別値cx_i+y_i上位K個として得られる。

棄却する候補: 全K要素部分集合を列挙

候補が二項係数個あり、N=1000では不可能である。

棄却する候補: 全ての傾きごとにN点を再ソート

傾き候補がO(N^2)あり、毎回O(N log N)では三次時間になる。

f_i'(1)=E[die_i]、f_i''(1)を使うとE[(総和)^2]-費用が選択ベクトル和(X,Y)上のX^2+Yになる。

cを変えた順位は二点のcx+yが交差する傾きでだけ変わるので、全交差を偏角順に処理して現在順位をswapすれば上位K和を増分更新できる。

各サイコロから整数スケールした(x_i,y_i)を作り、初期のx順と上位K和を用意する。全点対の順位交換イベントを傾き順にソートし、同傾き群を反映しながら上位KのΣx,Σyを更新して(Σx)^2+Σyの最大を評価する。

## 典型の発動条件

### 確率母関数の微分

発動条件: 独立確率変数の和の二乗期待値を選択項ごとの量へ分解したい。

f_i'(1),f_i''(1)から平均と二次モーメントを作る。

### 凸包と支持関数

発動条件: 多数の選択和の上で凸目的関数を最大化したい。

最大候補を上側凸包頂点へ絞り、線形汎関数cX+Yの最適解として列挙する。

### 順位のイベントスイープ

発動条件: 線形係数cの変化で要素順位が二点交差時だけ変わる。

O(N^2)イベントを傾き順に処理し、上位K集合と和を動的に更新する。

## 問題固有の要素

サイコロ選択の非線形な相互作用は平均の総和の二乗だけで、各サイコロを二次元ベクトルにすると組合せ和の凸包問題になる。

別の問題へ持ち帰る視点: 選択集合の目的が「総和の凸関数＋個別和」なら、支持線で上位Kを選ぶparametric最適化を検討する。

## 正当性

独立な出目の和の二乗期待値は平均和の二乗と分散和に分かれる。分母を払った各サイコロを点(x_i,y_i)へ写すと目的は選択和(X,Y)に対するX²+Yとなる。この凸関数の最大は選択和集合の凸包頂点で達成され、上側の各頂点はあるcに対するcX+Yの最大、つまりcx_i+y_iの上位K個で得られる。順位が変わるのは二直線の交点のみなので全交点順のsweepで候補を尽くせる。同傾きイベントをまとめ、直前・直後の上位K集合の評価を漏らさない。

## 実装上の注意

- 平均の分母6を払ってx,yと最終目的を整数スケールし、浮動小数点で傾きを比較しない。同傾きのイベントをまとめ、順位・上位K境界とΣx,Σyを一貫して更新する。

## 復習の核

- Nが小さい全K部分集合との比較に加え、同じ(x,y)、同傾きイベント、K=1・K=N、上位K境界を跨ぐswapだけが和を変えることを確認する。

## 計算量と制約

### 時間

O(N² log N)。O(N²)個の順位交換イベントをsortし、それぞれで順位と上位K和を更新する。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1000; 1 \leq K \leq N; 1 \leq C_i \leq 10^5; 1 \leq A_{i,j} \leq 10^5; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,K=1。サイコロ1は六面全て1、費用1。サイコロ2は六面全て2、費用1。

1. どちらも分散0で、平均はそれぞれ1と2。
2. 目的の期待値から費用を引くと1²−1=0、2²−1=3。
3. 線形評価のsweepはこの二つの単点候補を覆う。

期待される結果: 二番目を選び最大3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

分散項を無視して平均だけが最大のサイコロを選んでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一般には不可。二乗期待値は平均の二乗に分散も加わる。平均が小さくても分散や費用の差で目的値が逆転し得るため、点のy座標を捨てない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/editorial/4168) — source-abc257-editorial-4168-f4b0c81f2f0e7ca46ac56b229f127ec40515a09a6690d54425669db1055c8b4a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc257/tasks/abc257_h) — source-abc257-ex-problem-89026fea7c003dede5775fd2a883a7341d60c0ac91d927e54c17c5e2fe06451f
