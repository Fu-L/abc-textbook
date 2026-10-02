---
title: "ABC373-G — No Cross Matching"
draft: true
authoringUnit: {"problemId":"abc373-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-weighted-bipartite-matching/outcome-solve-weighted-bipartite-matching-shard-001/abc373-g.md","learningOutcomeIds":["outcome-solve-weighted-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching"],"excludedTopics":["重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-weighted-bipartite-matching"],"sourceRevisionIds":["source-abc373-editorial-11045-1fee3fff5238bfdbbb53355a4534e3eafa1b74fa4b22fa7b0f7df9ac05329804","source-abc373-g-problem-1966028055b8124ce63fad5b85b2978764ef41f87134a380c7e139d0e050153e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"交差二線分の両端を交換すると三角不等式と非共線性で総距離が厳密に減る。よって最小総距離perfect matchingには交差が存在しない。全点を一度使う二部matchingを求めることで要求の幾何配置を構成できる。","sourceRevisionIds":["source-abc373-editorial-11045-1fee3fff5238bfdbbb53355a4534e3eafa1b74fa4b22fa7b0f7df9ac05329804","source-abc373-g-problem-1966028055b8124ce63fad5b85b2978764ef41f87134a380c7e139d0e050153e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-weighted-bipartite-matching"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(0,0),(2,0)、Q=(0,2),(2,2)。","procedure":["縦対応の総距離4。","交差対応は各√8で総2√8>4。","最小matchingは縦二線分。"],"executionTarget":null,"expectedResult":"Q対応(1,2)","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-bipartite-matching"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-weighted-bipartite-matching"],"prerequisiteIds":["unit-bipartite-matching"],"attainmentCondition":"浮動小数の距離を二乗距離へ替えて同じ最適性を主張できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一般には不可。和の最小化は単調変換で保存されず、交換証明は距離和に対して使う。"},"answer":{"reasoningOrVerification":"一般には不可。和の最小化は単調変換で保存されず、交換証明は距離和に対して使う。","procedure":["具体例の各状態・寄与を再計算する。","一般には不可。和の最小化は単調変換で保存されず、交換証明は距離和に対して使う。"],"expectedResult":"一般には不可。和の最小化は単調変換で保存されず、交換証明は距離和に対して使う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [重み付き二部完全matching](src/content/docs/learn/graph/weighted-bipartite-matching.md)

- assignment matrixのdual potentialとtight edgeを保ち、Hungarian法または同値なmin-cost flowで完全matchingの重みを最適化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

対象外:

- 重み付き二部完全matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

二本の対応線分が交差しているなら、交点を介した三角不等式により対応先を交換すると二本の長さの総和が真に減る。したがって距離総和が最小の完全マッチングは交差を持たない。 交差点 X に対し |PaX|+|XQb|>|PaQb| と対称な不等式を足すと、交差辺の swap が距離和を改善する。 求めるのは最短距離値ではなく対応そのものなので、Hungarian 法または min-cost flow の復元情報を保持する。

採用する候補: P_i と Q_j のユークリッド距離をコストとする最小重み完全二部マッチングを解き、その対応 permutation を出力する。

非共線条件により交差解の交換では距離が真に減るため、任意の最小費用マッチングが要求する無交差性を満たす。

棄却する候補: 角度順に二集合の点を並べ、同じ順位同士を貪欲に対応させる。

二集合の配置は共通の凸位置を持つとは限らず、局所的な角度順だけでは内部交差を排除できない。

交差点 X に対し |PaX|+|XQb|>|PaQb| と対称な不等式を足すと、交差辺の swap が距離和を改善する。

求めるのは最短距離値ではなく対応そのものなので、Hungarian 法または min-cost flow の復元情報を保持する。

完全二部グラフの辺 (i,j) に点間距離を置き、Hungarian 法などで最小費用完全マッチングを求める。得られた Q 側の対応 index を各 P_i について出力する。

## 典型の発動条件

### uncrossing と最小重みマッチング

発動条件: 幾何的な対応で交差二辺の付け替えが目的値を改善するとき。

無交差制約を直接管理せず、距離和最小化へ埋め込む。

## 問題固有の要素

難しい無交差条件を列挙する代わりに、交差が最適性へ反する目的関数を設計する。

別の問題へ持ち帰る視点: 幾何構築では局所交換で違反を消せるポテンシャルがないかを探す。

## 正当性

交差二線分の両端を交換すると三角不等式と非共線性で総距離が厳密に減る。よって最小総距離perfect matchingには交差が存在しない。全点を一度使う二部matchingを求めることで要求の幾何配置を構成できる。

## 実装上の注意

- 距離は浮動小数で、整数専用 min-cost flow への雑なスケーリングは順序を壊し得る。long double 対応の割当法と安定した比較を用いる。

## 復習の核

- 交差二辺を入れ替えた四点の図を描き、どの三角不等式を足すと真の改善になるかを自力で示す。

## 計算量と制約

### 時間

二群各N点。距離表O(N²)、Hungarian O(N³)。

### 空間

費用表と割当 O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 300; 0 \leq A_i, B_i, C_i, D_i \leq 5000 (1 \leq i \leq N); (A_i, B_i) \neq (A_j, B_j) (1 \leq i < j \leq N); (C_i, D_i) \neq (C_j, D_j) (1 \leq i < j \leq N); (A_i, B_i) \neq (C_j, D_j) (1 \leq i, j \leq N); No three different points lie on the same straight line.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(0,0),(2,0)、Q=(0,2),(2,2)。

1. 縦対応の総距離4。
2. 交差対応は各√8で総2√8>4。
3. 最小matchingは縦二線分。

期待される結果: Q対応(1,2)

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

浮動小数の距離を二乗距離へ替えて同じ最適性を主張できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一般には不可。和の最小化は単調変換で保存されず、交換証明は距離和に対して使う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc373/editorial/11045) — source-abc373-editorial-11045-1fee3fff5238bfdbbb53355a4534e3eafa1b74fa4b22fa7b0f7df9ac05329804
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc373/tasks/abc373_g) — source-abc373-g-problem-1966028055b8124ce63fad5b85b2978764ef41f87134a380c7e139d0e050153e
