---
title: "ABC424-F — Adding Chords"
draft: true
authoringUnit: {"problemId":"abc424-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc424-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-cyclic-order-crossing"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-cyclic-order-crossing"],"sourceRevisionIds":["source-abc424-editorial-13900-cbe65d1d291e222fd5af22288a9a30412b5bcb9f58985518daf446706ecbc60b","source-abc424-f-problem-797d4fe9537e11466488967b83ee21792e5dfc5dafc05436240d37242ab7e797"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"candidate[A,B]が既存intervalと交差しない iff (A,B)内のendpoint列に、外から入るunmatched closeも外へ出るunmatched openもない。これは区間sum=0かつrelative prefix minimum≥0という正しい括弧列条件である。 各端点は一度しか現れず、range foldと二点updateをO(log N)で処理できる。","sourceRevisionIds":["source-abc424-editorial-13900-cbe65d1d291e222fd5af22288a9a30412b5bcb9f58985518daf446706ecbc60b","source-abc424-f-problem-797d4fe9537e11466488967b83ee21792e5dfc5dafc05436240d37242ab7e797"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"既存chord[1,4]、新候補[2,5]。","procedure":["既存endpoint列の候補内部(2,5)には位置4のcloseだけがある。","sum=-1、最小prefix=-1。"],"executionTarget":null,"expectedResult":"新候補はNo。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":["unit-cyclic-order-crossing"],"attainmentCondition":"新候補[2,3]ならどうか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"内部に既存endpointがなく(sum,minPrefix)=(0,0)なのでYes。既存chordの内側への入れ子は交差でない。"},"answer":{"reasoningOrVerification":"内部に既存endpointがなく(sum,minPrefix)=(0,0)なのでYes。既存chordの内側への入れ子は交差でない。","procedure":["具体例の各状態・寄与を再計算する。","内部に既存endpointがなく(sum,minPrefix)=(0,0)なのでYes。既存chordの内側への入れ子は交差でない。"],"expectedResult":"内部に既存endpointがなく(sum,minPrefix)=(0,0)なのでYes。既存chordの内側への入れ子は交差でない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [円環順序・chord交差](src/content/docs/learn/geometry-optimization/cyclic-order-crossing.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

円を1とNの間で開くと、採用済みchordは交差しない区間族、すなわちlaminarな括弧構造になる。left endpointを+1、rightを-1とすればcandidate内部の既存端点がbalancedかで交差を判定できる。

採用する候補: prefix minimumとsumを持つsegment treeでcandidate区間の括弧列を判定する

各端点は一度しか現れず、range foldと二点updateをO(log N)で処理できる。

棄却する候補: 新chordと全採用chordをpairwise比較する

全て採用されるとqueryごとO(Q)、合計O(Q²)になる。

candidate[A,B]が既存intervalと交差しない iff (A,B)内のendpoint列に、外から入るunmatched closeも外へ出るunmatched openもない。これは区間sum=0かつrelative prefix minimum≥0という正しい括弧列条件である。

segment tree leafを未使用0とし、nodeに(sum,minPrefix)を持つ。各[A_i,B_i]について内部rangeをfoldしsum=0かつminPrefix≥0ならYesとしてAへ+1、Bへ-1をpoint updateし、そうでなければNoとして何もしない。

## 典型の発動条件

### laminar intervalと括弧列

発動条件: 交差しない区間族の開閉endpointがproper nestingを作る。

left/rightをparenthesisとしてcandidate内部のbalanceを検査する。

### 括弧monoid segment tree

発動条件: 動的な二点括弧挿入とsubstring validity queryが必要である。

(sum,minPrefix)をassociative mergeしてrange foldする。

## 問題固有の要素

全query endpointがdistinctなので、candidate端に既存括弧がなく、内部endpoint列だけを調べる条件がそのまま使える。

別の問題へ持ち帰る視点: endpoint衝突がないdynamic interval insertionは括弧列monoidへ直接写せる。

## 正当性

candidate[A,B]が既存intervalと交差しない iff (A,B)内のendpoint列に、外から入るunmatched closeも外へ出るunmatched openもない。これは区間sum=0かつrelative prefix minimum≥0という正しい括弧列条件である。 各端点は一度しか現れず、range foldと二点updateをO(log N)で処理できる。

## 実装上の注意

- 内部を(A,B)とするか[A,B]としても端leafは挿入前0だが、index規約を統一する。不採用queryは更新しない。

## 復習の核

- nested、disjoint、交互endpoint、外側candidate追加をbrute intersectionと比較する。

## 計算量と制約

### 時間

O(N+Q log N)、Nは円周頂点数。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^6; 1 \leq Q \leq 3\times 10^5; 1 \leq A_i < B_i \leq N; The 2Q integers A_1,\ldots,A_Q,B_1,\ldots,B_Q are pairwise distinct.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

既存chord[1,4]、新候補[2,5]。

1. 既存endpoint列の候補内部(2,5)には位置4のcloseだけがある。
2. sum=-1、最小prefix=-1。

期待される結果: 新候補はNo。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

新候補[2,3]ならどうか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

内部に既存endpointがなく(sum,minPrefix)=(0,0)なのでYes。既存chordの内側への入れ子は交差でない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/editorial/13900) — source-abc424-editorial-13900-cbe65d1d291e222fd5af22288a9a30412b5bcb9f58985518daf446706ecbc60b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/tasks/abc424_f) — source-abc424-f-problem-797d4fe9537e11466488967b83ee21792e5dfc5dafc05436240d37242ab7e797
