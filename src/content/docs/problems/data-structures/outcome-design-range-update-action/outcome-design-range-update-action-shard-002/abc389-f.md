---
title: "ABC389-F — Rated Range"
draft: true
authoringUnit: {"problemId":"abc389-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc389-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc389-editorial-11966-2d50c1df0f7b6574a259cb831848ec304fcdca04663322d78c78d68438e57968","source-abc389-f-problem-752d508edfdaa527668d8275f53899f230b8de394edf2b058d53053ad0d374b8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"D配列は単調だがstrict増加とは限らないため、lower_bound(L)とupper_bound(R)でpreimage境界を取る。 rating上限は初期最大にcontest増分を見込んだ範囲までsegment treeへ確保するか、query対象domainだけを管理する。 各contestでD(x)∈[L,R]となる最初・最後のxをmonoid searchでO(log X)に求め、区間加算できるため全体O((N+Q)log X)となる。","sourceRevisionIds":["source-abc389-editorial-11966-2d50c1df0f7b6574a259cb831848ec304fcdca04663322d78c78d68438e57968","source-abc389-f-problem-752d508edfdaa527668d8275f53899f230b8de394edf2b058d53053ad0d374b8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-range-update-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"初期rating0,1,2,3を管理しcontest[1,2]。","procedure":["preimageは初期index1,2。","更新後D=(0,2,3,3)。"],"executionTarget":null,"expectedResult":"単調非減少だが同値3が二つ生じる。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-actions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-range-update-action"],"prerequisiteIds":["unit-range-monoid-aggregation"],"attainmentCondition":"次にcontest[3,3]が来たら一つだけ更新してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"両方の3が対象なので初期index2,3の全区間を+1しD=(0,2,4,4)とする。upper_boundで同値block末尾を取る。"},"answer":{"reasoningOrVerification":"両方の3が対象なので初期index2,3の全区間を+1しD=(0,2,4,4)とする。upper_boundで同値block末尾を取る。","procedure":["具体例の各状態・寄与を再計算する。","両方の3が対象なので初期index2,3の全区間を+1しD=(0,2,4,4)とする。upper_boundで同値block末尾を取る。"],"expectedResult":"両方の3が対象なので初期index2,3の全区間を+1しD=(0,2,4,4)とする。upper_boundで同値block末尾を取る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

初期rating xからi contest後の値D_i(x)はxについて単調非減少で、一度二つの軌道が同値になれば以後も同じ更新を受ける。

contest [L,R]で+1される初期値xの集合は、単調なD(x)のpreimageなので一つの連続区間になる。

採用する候補: 全初期ratingの現在値をrange-add segment treeで持ち、各contestのpreimage区間をtree上探索して+1する

各contestでD(x)∈[L,R]となる最初・最後のxをmonoid searchでO(log X)に求め、区間加算できるため全体O((N+Q)log X)となる。

棄却する候補: queryごとにN contestを逐次simulationする

O(NQ)でN=2×10^5,Q=3×10^5に間に合わない。

D配列は単調だがstrict増加とは限らないため、lower_bound(L)とupper_bound(R)でpreimage境界を取る。

rating上限は初期最大にcontest増分を見込んだ範囲までsegment treeへ確保するか、query対象domainだけを管理する。

D[x]=xで初期化する。各[L_i,R_i]についてD値がL_i以上になる最初lとR_iより大きくなる最初rをsegment treeのsearchで求め、初期index区間[l,r)へ+1する。最後にquery Xの点値を返す。

## 典型の発動条件

### monotone functionのpreimage更新

発動条件: 多数の初期状態へ同じ単調transitionを適用し、条件成立域が値区間で与えられるとき。

現在値配列のlower/upper boundを求め初期状態区間へ作用する。

### range addとsegment-tree search

発動条件: 単調配列を区間加算しながら値境界を検索するとき。

lazy treeのmax_right/min_leftでpreimage端を求める。

## 問題固有の要素

時間軸をqueryごとに辿る代わりに、全初期値を横に並べた写像Dを一括更新すると、rating条件が区間作用になる。

別の問題へ持ち帰る視点: 独立simulationが多数あるとき、初期条件→現在状態の単調写像をまとめて持てないか検討する。

## 正当性

D配列は単調だがstrict増加とは限らないため、lower_bound(L)とupper_bound(R)でpreimage境界を取る。 rating上限は初期最大にcontest増分を見込んだ範囲までsegment treeへ確保するか、query対象domainだけを管理する。 各contestでD(x)∈[L,R]となる最初・最後のxをmonoid searchでO(log X)に求め、区間加算できるため全体O((N+Q)log X)となる。

## 実装上の注意

- 同じD値が連続するので二分探索条件の≤/<を区別する。segment treeの管理domainが全query Xを含むことを確認する。

## 復習の核

- 初期値軌道が合流するcase、L=R、更新区間が空/全域になる小domainを全simulationと比較し、upper bound境界を確認する。

## 計算量と制約

### 時間

O(X+N log X+Q log X)、Xは管理する初期rating数、Nはcontest数。

### 空間

O(X)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq L_i \leq R_i \leq 5 \times 10^5 (1 \leq i \leq N); 1 \leq Q \leq 3 \times 10^5; For each query, 1 \leq X \leq 5 \times 10^5.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

初期rating0,1,2,3を管理しcontest[1,2]。

1. preimageは初期index1,2。
2. 更新後D=(0,2,3,3)。

期待される結果: 単調非減少だが同値3が二つ生じる。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

次にcontest[3,3]が来たら一つだけ更新してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

両方の3が対象なので初期index2,3の全区間を+1しD=(0,2,4,4)とする。upper_boundで同値block末尾を取る。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc389/editorial/11966) — source-abc389-editorial-11966-2d50c1df0f7b6574a259cb831848ec304fcdca04663322d78c78d68438e57968
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc389/tasks/abc389_f) — source-abc389-f-problem-752d508edfdaa527668d8275f53899f230b8de394edf2b058d53053ad0d374b8
