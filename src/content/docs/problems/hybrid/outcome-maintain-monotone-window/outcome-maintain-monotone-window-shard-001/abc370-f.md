---
title: "ABC370-F — Cake Division"
draft: true
authoringUnit: {"problemId":"abc370-f","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc370-f.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-lifting","unit-monotone-search"],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window","tag-binary-lifting","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc370-editorial-10895-ae5cc3fa596f036b68db8dec7ccd3da0d7012df59cf637c0e411ec377a98d44a","source-abc370-f-problem-a22fbc95c73df9857bb2e703550340b9aebb7f969b3b4316e123c91b8b8b6e58"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_i>0なので、区間を可能な限り短く切るgreedyが残り質量を最大化し、K区間存在判定の必要十分条件になる。 最適Xで切り目iを含むdivisionが存在するかを全iで数え、どの最適divisionにも切られない本数はN−その個数である。 円環上の全切り位置を同時に判定し、最適Xで一度でも使える切り目数からnever-cut数も得られる。","sourceRevisionIds":["source-abc370-editorial-10895-ae5cc3fa596f036b68db8dec7ccd3da0d7012df59cf637c0e411ec377a98d44a","source-abc370-f-problem-a22fbc95c73df9857bb2e703550340b9aebb7f969b3b4316e123c91b8b8b6e58"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-monotone-window"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"円環A=(2,2,2,2),K=2。","procedure":["X=4なら二要素ずつで二segmentが一周に収まる。","X=5なら各segmentに三要素必要で計6>4。"],"executionTarget":null,"expectedResult":"最適X=4、全4始点がvalid、切られない辺数0。","verificationStatus":"not_applicable","learningUnitIds":["unit-two-pointers-window"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-monotone-window"],"prerequisiteIds":["unit-binary-lifting","unit-monotone-search"],"attainmentCondition":"負のAを許すと最短segmentgreedyの判定は使えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"和の単調性と端点単調性が壊れる。正値という適用条件に依存する。"},"answer":{"reasoningOrVerification":"和の単調性と端点単調性が壊れる。正値という適用条件に依存する。","procedure":["具体例の各状態・寄与を再計算する。","和の単調性と端点単調性が壊れる。正値という適用条件に依存する。"],"expectedResult":"和の単調性と端点単調性が壊れる。正値という適用条件に依存する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

最小取り分Xを達成可能かはXについて単調なので最大Xをbinary searchできる。固定Xでは正の質量ゆえ、各開始位置から和がX以上になる最短次位置f(i)をgreedyに選んでよい。

円環を二周列へ複製すると、切り目iを最初に切ってK区間作れる条件はfをK回適用した終端が一周先N+i+1以下であることになる。

採用する候補: Xを二分探索し、各判定でtwo pointersのnext写像とdoublingを作って全開始切り目のK-step到達を調べる。

円環上の全切り位置を同時に判定し、最適Xで一度でも使える切り目数からnever-cut数も得られる。

棄却する候補: 各切り目を開始にしてK区間をgreedy生成し、さらにX候補も順に試す。

開始位置ごとに同じnext遷移を反復し、目的値の単調性も共有写像も利用していない。

A_i>0なので、区間を可能な限り短く切るgreedyが残り質量を最大化し、K区間存在判定の必要十分条件になる。

最適Xで切り目iを含むdivisionが存在するかを全iで数え、どの最適divisionにも切られない本数はN−その個数である。

Aを二回並べる。候補Xごとにtwo pointersでf(i)=和が初めてX以上となるexclusive終端を全iに作り、binary liftingでf^K(i+1)を求める。いずれかのiで一周内ならfeasibleとしてXを二分探索する。最大Xでもう一度全iを判定し、valid start数cとともにX,N−cを出力する。

## 典型の発動条件

### 円環列の二倍化

発動条件: 任意切れ目から一周以内の連続segmentを扱うとき。

列を二周分連結し、wrap aroundを通常区間へ直す。

### 尺取りnext写像とdoubling

発動条件: 正数列を閾値以上の最短区間へ反復分割するとき。

全開始の一step greedy遷移を作り、K回適用をbinary liftingする。

## 問題固有の要素

最大最小値だけでなく「最適解のどれかで切れる線」も、固定X判定を全startへ広げると同時に得られる。

別の問題へ持ち帰る視点: optimization後の解集合情報が必要なら、decision oracleが各候補開始点のwitness存在も返すよう設計する。

## 正当性

A_i>0なので、区間を可能な限り短く切るgreedyが残り質量を最大化し、K区間存在判定の必要十分条件になる。 最適Xで切り目iを含むdivisionが存在するかを全iで数え、どの最適divisionにも切られない本数はN−その個数である。 円環上の全切り位置を同時に判定し、最適Xで一度でも使える切り目数からnever-cut数も得られる。

## 実装上の注意

- fはinclusive/exclusiveのどちらかを固定し、開始を切り目iの次piece i+1へ対応させる。到達不能sentinelをdoublingで自己遷移させ、never-cutはN−valid数とする。

## 復習の核

- K=Nと均等質量の例で全切り目判定を確認する。二周indexの一周上限に等号を許すかを小さい円で照合する。

## 計算量と制約

### 時間

O(N log K log S)、S=ΣA、判定にtwo pointersとK回jumpのbinary lifting。

### 空間

O(N log K)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq K \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^4; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

円環A=(2,2,2,2),K=2。

1. X=4なら二要素ずつで二segmentが一周に収まる。
2. X=5なら各segmentに三要素必要で計6>4。

期待される結果: 最適X=4、全4始点がvalid、切られない辺数0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

負のAを許すと最短segmentgreedyの判定は使えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

和の単調性と端点単調性が壊れる。正値という適用条件に依存する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/editorial/10895) — source-abc370-editorial-10895-ae5cc3fa596f036b68db8dec7ccd3da0d7012df59cf637c0e411ec377a98d44a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/tasks/abc370_f) — source-abc370-f-problem-a22fbc95c73df9857bb2e703550340b9aebb7f969b3b4316e123c91b8b8b6e58
