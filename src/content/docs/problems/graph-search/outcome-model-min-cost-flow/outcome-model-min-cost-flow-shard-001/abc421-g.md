---
title: "ABC421-G — Increase to make it Increasing"
draft: true
authoringUnit: {"problemId":"abc421-g","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc421-g.md","learningOutcomeIds":["outcome-model-min-cost-flow"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-prefix-aggregate","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow","tag-prefix-difference"],"sourceRevisionIds":["source-abc421-editorial-13788-9378fdf51169821035f0f4852e984a6dfc0129a0dce8fb7debd76b012f3f72bd","source-abc421-g-problem-34988055034f78b45b4b8a02d98691ec1afb35581e43a205d2468d6432d937bc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間加算は差分box RからL−1へ一unitを動かす。内部負差分の不足を満たすflowがちょうど非減少化で、cost1のrange辺の流量和は操作回数。box Nの無限供給と正差分供給は末尾増加/余剰を許し、flow分解で操作multisetへ戻せる。","sourceRevisionIds":["source-abc421-editorial-13788-9378fdf51169821035f0f4852e984a6dfc0129a0dce8fb7debd76b012f3f72bd","source-abc421-g-problem-34988055034f78b45b4b8a02d98691ec1afb35581e43a205d2468d6432d937bc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-min-cost-flow"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(3,1)、許可区間[2,2]だけ。","procedure":["内部差分A2−A1=−2。","末尾box2からbox1へrange辺で二unit。","A2を二回増やし(3,3)。"],"executionTarget":null,"expectedResult":"2","verificationStatus":"not_applicable","learningUnitIds":["unit-min-cost-flow"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-min-cost-flow"],"prerequisiteIds":["unit-max-flow-min-cut","unit-prefix-aggregate","unit-weighted-shortest-path"],"attainmentCondition":"全体[1,2]加算だけなら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"内部差分は変わらず−2なので不可能、−1。"},"answer":{"reasoningOrVerification":"内部差分は変わらず−2なので不可能、−1。","procedure":["具体例の各状態・寄与を再計算する。","内部差分は変わらず−2なので不可能、−1。"],"expectedResult":"内部差分は変わらず−2なので不可能、−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

range [L,R]への+1は差分dでd[L-1]へ+1、d[R]へ-1を移す操作になる。非減少条件は内部差分d[1..N-1]を全て非負にすることなので、余剰boxから不足boxへballを運ぶ問題になる。 d_i>0は供給、d_i<0は需要で、index Nは最終値を上げても内部非減少性を壊さない無限供給源とみなせる。range操作(L,R)はRからL-1へunitを運ぶ。

採用する候補: 差分indexを頂点とするmin-cost flow

各許可rangeを一球移動cost1の有向辺にし、不足総量を満たす最小operation数をflow costとして得られる。

棄却する候補: 各負差分を局所的に直すgreedy

一つのoperationがどの余剰sourceをどの不足へ運ぶかの組合せがあり、局所選択は全体最小costを保証しない。

d_i>0は供給、d_i<0は需要で、index Nは最終値を上げても内部非減少性を壊さない無限供給源とみなせる。range操作(L,R)はRからL-1へunitを運ぶ。

sourceから正d_iへcapacity d_i、負d_iからsinkへcapacity -d_i、sourceからNへINF、各rangeにR→L-1 capacity INF cost1を張る。需要Kのmin-cost flowが流れなければ-1、流れればcostを出す。

## 典型の発動条件

### 差分によるrange update変換

発動条件: range一様加算を端点二箇所の変化へ写す。

Aの拡張差分d_0…d_Nで操作をunit transferとして表す。

### min-cost flow

発動条件: 供給から需要へ許可edgeを通してunitを運び、edge使用回数和を最小化する。

不足総量をrequired flowとし、range edgeだけcost1にする。

## 問題固有の要素

末尾差分d_Nは負でもよいため、box Nを無限供給にすることで総和保存と目的制約を同時に表現できる。

別の問題へ持ち帰る視点: 制約外の境界differenceをslack source/sinkとしてflow modelへ組み込む。

## 正当性

区間加算は差分box RからL−1へ一unitを動かす。内部負差分の不足を満たすflowがちょうど非減少化で、cost1のrange辺の流量和は操作回数。box Nの無限供給と正差分供給は末尾増加/余剰を許し、flow分解で操作multisetへ戻せる。

## 実装上の注意

- d_0=A_1とd_N=-A_Nを含むindexを正しく作り、required flowは内部0..N-1の負分だけを数える。

## 復習の核

- 単一不足、Nからの供給必須、到達不能なtransfer graphを小整数探索と比較する。

## 計算量と制約

### 時間

N要素M区間、差分不足総量K。V=N+3,E=O(N+M)、potential min-cost flowの安全上界 O(K E log V)。

### 空間

差分とnetwork O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 300; 1\leq M \leq 300; 1\leq A_i \leq 300; 1\leq L_i\leq R_i\leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(3,1)、許可区間[2,2]だけ。

1. 内部差分A2−A1=−2。
2. 末尾box2からbox1へrange辺で二unit。
3. A2を二回増やし(3,3)。

期待される結果: 2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全体[1,2]加算だけなら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

内部差分は変わらず−2なので不可能、−1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc421/editorial/13788) — source-abc421-editorial-13788-9378fdf51169821035f0f4852e984a6dfc0129a0dce8fb7debd76b012f3f72bd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc421/tasks/abc421_g) — source-abc421-g-problem-34988055034f78b45b4b8a02d98691ec1afb35581e43a205d2468d6432d937bc
