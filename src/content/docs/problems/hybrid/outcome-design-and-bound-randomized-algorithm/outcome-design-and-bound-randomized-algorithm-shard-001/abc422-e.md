---
title: "ABC422-E — Colinear"
draft: true
authoringUnit: {"problemId":"abc422-e","docPath":"src/content/docs/problems/hybrid/outcome-design-and-bound-randomized-algorithm/outcome-design-and-bound-randomized-algorithm-shard-001/abc422-e.md","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。"],"tagIds":["tag-randomized-algorithm","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc422-e-problem-44e69a3fb5e8d2422de1f335ba82aceb7f4466392b01cdcc3d8a17560541554f","source-abc422-editorial-13820-84a6d94e189cefe290ad2d1e79ce85ef37836d033117cbd8b62d65041716a864"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"line上点数m≥(N+1)/2ならpair hit確率m/N·(m-1)/(N-1)≥(N+1)/(4N)>1/4。hitしたcandidateはexact integer determinantで必ず認証でき、false positiveはない。 存在時の失敗確率を(3/4)^Tまで下げ、O(TN)で十分高速かつ高確率に正答する。","sourceRevisionIds":["source-abc422-e-problem-44e69a3fb5e8d2422de1f335ba82aceb7f4466392b01cdcc3d8a17560541554f","source-abc422-editorial-13820-84a6d94e189cefe290ad2d1e79ce85ef37836d033117cbd8b62d65041716a864"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"点(0,0),(1,1),(2,2),(0,2),(2,0)。","procedure":["最初二点からa=−1,b=1,c=0を得る。","x=yの点は3個、2·3>5。"],"executionTarget":null,"expectedResult":"Yes、直線−x+y=0。","verificationStatus":"not_applicable","learningUnitIds":["unit-randomized-algorithms"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-and-bound-randomized-algorithm"],"prerequisiteIds":["unit-geometry-primitives"],"attainmentCondition":"係数候補がvalidでもline点数がN/2ちょうどなら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"strict majorityでないので不採用。乱数は発見だけを担い、認証は厳密な整数条件で行う。"},"answer":{"reasoningOrVerification":"strict majorityでないので不採用。乱数は発見だけを担い、認証は厳密な整数条件で行う。","procedure":["具体例の各状態・寄与を再計算する。","strict majorityでないので不採用。乱数は発見だけを担い、認証は厳密な整数条件で行う。"],"expectedResult":"strict majorityでないので不採用。乱数は発見だけを担い、認証は厳密な整数条件で行う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md)

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 考察

過半数lineが存在するならrandomな異なる二点が両方そのline上にある確率は1/4より大きい。その二点が定めるlineを全点で検証すれば一試行O(N)である。

採用する候補: random pairを約100回sampleしてmajority lineを検証する

存在時の失敗確率を(3/4)^Tまで下げ、O(TN)で十分高速かつ高確率に正答する。

棄却する候補: 全点pairが定めるlineを調べる

O(N^3)検証、工夫してもpair O(N^2)がN=5×10^5に合わない。

line上点数m≥(N+1)/2ならpair hit確率m/N·(m-1)/(N-1)≥(N+1)/(4N)>1/4。hitしたcandidateはexact integer determinantで必ず認証でき、false positiveはない。

異なるindex p,qをrandom sampleしa=y_p-y_q,b=x_q-x_p,c=x_p y_q-x_q y_pを作る。全点でax+by+c=0をcountし2count>NならYesと係数を出す。100回失敗ならNo。

## 典型の発動条件

### Monte Carlo candidate sampling

発動条件: 解が多数要素に支持され、少数sampleで解を含む組を引ける。

二点sampleでcandidateを生成し、全入力によるdeterministic verificationを行う。

### integer collinearity

発動条件: 座標line判定でfloating誤差を避けたい。

二点から整数係数を作りdeterminant式を64bitで評価する。

## 問題固有の要素

strict majorityにより正解lineは高々一つで、sample後は候補lineの全点countだけで確定できる。

別の問題へ持ち帰る視点: 多数派構造はrandom witness生成と厳密検証の組合せに向く。

## 正当性

line上点数m≥(N+1)/2ならpair hit確率m/N·(m-1)/(N-1)≥(N+1)/(4N)>1/4。hitしたcandidateはexact integer determinantで必ず認証でき、false positiveはない。 存在時の失敗確率を(3/4)^Tまで下げ、O(TN)で十分高速かつ高確率に正答する。

## 実装上の注意

- 二indexを必ず異ならせ、係数積は制約内64bitだが符号を含める。random seedの偏りを避ける。

## 復習の核

- 解あり/なしを小N全pair真値と比較し、100回失敗確率も評価する。

## 計算量と制約

### 時間

O(TN)、T=100、整数determinant検査。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 5 \times 10^5; N is odd.; -10^8 \leq x_i \leq 10^8; -10^8 \leq y_i \leq 10^8; If i \neq j, then (x_i, y_i) \neq (x_j, y_j).; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

点(0,0),(1,1),(2,2),(0,2),(2,0)。

1. 最初二点からa=−1,b=1,c=0を得る。
2. x=yの点は3個、2·3>5。

期待される結果: Yes、直線−x+y=0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

係数候補がvalidでもline点数がN/2ちょうどなら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

strict majorityでないので不採用。乱数は発見だけを担い、認証は厳密な整数条件で行う。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc422/tasks/abc422_e) — source-abc422-e-problem-44e69a3fb5e8d2422de1f335ba82aceb7f4466392b01cdcc3d8a17560541554f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc422/editorial/13820) — source-abc422-editorial-13820-84a6d94e189cefe290ad2d1e79ce85ef37836d033117cbd8b62d65041716a864
