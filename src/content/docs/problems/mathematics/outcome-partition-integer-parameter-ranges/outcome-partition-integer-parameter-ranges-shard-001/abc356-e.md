---
title: "ABC356-E — Max/Min"
draft: true
authoringUnit: {"problemId":"abc356-e","docPath":"src/content/docs/problems/mathematics/outcome-partition-integer-parameter-ranges/outcome-partition-integer-parameter-ranges-shard-001/abc356-e.md","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc356-e-problem-1e0f17fba263518103ea1f25c1e38af9f2d1c4ad5354e40fadfa9575c47bfe5e","source-abc356-editorial-10116-e9887115bd504bac202ff7241b487b6e336f909dd8f4ea7952d06e6079a07c56"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各unordered pairは小値dと大値xで一意に向きを決められる。同値はC(freq[d],2)で別に数える。異値では商qの正確な区間[qd,(q+1)d−1]をx>dで切り、freq[d]·区間個数·qを足す。頻度prefix和は各bucketの個数を正確に返すので全pairのfloor(max/min)を一度数える。","sourceRevisionIds":["source-abc356-e-problem-1e0f17fba263518103ea1f25c1e38af9f2d1c4ad5354e40fadfa9575c47bfe5e","source-abc356-editorial-10116-e9887115bd504bac202ff7241b487b6e336f909dd8f4ea7952d06e6079a07c56"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,4,4)。","procedure":["2と4のpairが2つで各寄与2。","4同士の一pairは寄与1。"],"executionTarget":null,"expectedResult":"5。","verificationStatus":"not_applicable","learningUnitIds":["unit-integer-boundary-blocks"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-partition-integer-parameter-ranges"],"prerequisiteIds":[],"attainmentCondition":"d=2でx=3,4を同じ商1bucketに入れてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"寄与和3。"},"answer":{"reasoningOrVerification":"floor(3/2)=1、floor(4/2)=2。bucketは[2,3]と[4,5]で、d+1から幅dで区切ると境界がずれる。","procedure":["具体例の各状態・寄与を再計算する。","floor(3/2)=1、floor(4/2)=2。bucketは[2,3]と[4,5]で、d+1から幅dで区切ると境界がずれる。"],"expectedResult":"寄与和3。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 素因数指数による整数条件の分解。

## 考察

値域が10^6以下なので頻度とprefix和を作る。各pairを小値dと大値xへ向けると寄与はfloor(x/d)。同値はC(freq[d],2)として別計算し、異値は商qごとの正確なbucket [qd,(q+1)d−1]をx>dで切って数える。例えばd=2ではx=3の商1とx=4の商2は別bucketであり、d+1から幅dで区切る方法は誤る。q=1..floor(V/d)を列挙し、bucketの頻度をfreq[d]q倍して合計する。全dのbucket数は調和級数でO(V log V)。

## 典型の発動条件

整数商が一定の区間[qd,(q+1)d−1]を頻度prefix和で数える。最小値を固定してunordered pairの向きを一意にし、同値pairを組合せで分離する。

## 問題固有の要素

自己pairと同値要素の重複を避けるためx>dだけをbucket側で数え、x=dはC(freq[d],2)へ分ける。

## 正当性

各unordered pairは小値dと大値xで一意に向きを決められる。同値はC(freq[d],2)で別に数える。異値では商qの正確な区間[qd,(q+1)d−1]をx>dで切り、freq[d]·区間個数·qを足す。頻度prefix和は各bucketの個数を正確に返すので全pairのfloor(max/min)を一度数える。

## 実装上の注意

bucket lower=max(d+1,qd)、upper=min(V,(q+1)d−1)とする。lower>upperならskip。q=1の区間をd+1から始める場合でも上端は2d−1であり2dを含めない。答えは64bit。

## 復習の核

d=2,x=3,4の寄与が1,2へ分かれることを確認する。A=(2,4,4)の正答5と同値pairを一度だけ数える境界を復習する。

## 計算量と制約

### 時間

O(V log V+N)、V=max A≤10^6。調和級数個の商bucketを走査する。

### 空間

O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq A_i \leq 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,4,4)。

1. 2と4のpairが2つで各寄与2。
2. 4同士の一pairは寄与1。

期待される結果: 5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

d=2でx=3,4を同じ商1bucketに入れてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

floor(3/2)=1、floor(4/2)=2。bucketは[2,3]と[4,5]で、d+1から幅dで区切ると境界がずれる。

確認結果: 寄与和3。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc356/tasks/abc356_e) — source-abc356-e-problem-1e0f17fba263518103ea1f25c1e38af9f2d1c4ad5354e40fadfa9575c47bfe5e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc356/editorial/10116) — source-abc356-editorial-10116-e9887115bd504bac202ff7241b487b6e336f909dd8f4ea7952d06e6079a07c56
