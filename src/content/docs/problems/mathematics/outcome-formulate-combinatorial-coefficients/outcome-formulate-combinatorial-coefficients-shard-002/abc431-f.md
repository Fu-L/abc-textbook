---
title: "ABC431-F — Almost Sorted 2"
draft: true
authoringUnit: {"problemId":"abc431-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc431-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-two-pointers-window"],"sourceRevisionIds":["source-abc431-editorial-14492-228ecac80890d685616600ffce4e1c80d66c5ad8df5cd8032d64020511828730","source-abc431-f-problem-24f87728a3fc28ac631adf09694ffab5bef2251ee31ef1a7d1836bd6c43d1f5f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"値を昇順に追加する際、新最大値vの直後に大き過ぎる下降を作らない挿入gapは、既存のv−D..v−1の各要素の直前と末尾だけ。新しいvへの上昇は常に合法なので直前要素は制限しない。g=w+1個の区別gapへ同値cnt[v]個を分けるstars-and-barsはC(w+cnt[v],cnt[v])。最終列から最大値群を削除すると前段と各gapの個数が一意に戻るため、全値の積が各合法列を一度数える。","sourceRevisionIds":["source-abc431-editorial-14492-228ecac80890d685616600ffce4e1c80d66c5ad8df5cd8032d64020511828730","source-abc431-f-problem-24f87728a3fc28ac631adf09694ffab5bef2251ee31ef1a7d1836bd6c43d1f5f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,3)、D=1。","procedure":["13は合法、31は下降差2>Dで不適。","v=3の窓[2,2]は空なので挿入gapは末尾一つ。"],"executionTarget":null,"expectedResult":"1列。","verificationStatus":"not_applicable","learningUnitIds":["unit-combinatorial-coefficients"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"prerequisiteIds":["unit-two-pointers-window"],"attainmentCondition":"同じAでD=2なら差2を許すか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"2列。"},"answer":{"reasoningOrVerification":"窓は[v−D,v−1]でlower inclusive。31も合法になり2列。値差D未満という説明では境界を誤る。","procedure":["具体例の各状態・寄与を再計算する。","窓は[v−D,v−1]でlower inclusive。31も合法になり2列。値差D未満という説明では境界を誤る。"],"expectedResult":"2列。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

隣接する下降について差がD以下なら許される。値vを昇順に挿入する時の既存の許容値は閉区間[v−D,v−1]で、差Dの境界も含む。

## 典型の発動条件

頻度のsliding windowとstars-and-bars。値vの許容既存要素数wに対してC(w+cnt[v],cnt[v])を積算する。

## 問題固有の要素

同値要素を区別せず、許容gapは窓内の各既存要素の直前と末尾。vから後続要素への下降差をD以下に制限するので、直後ではなく直前に挿入する。Dの境界を閉区間で扱う。

## 正当性

値を昇順に追加する際、新最大値vの直後に大き過ぎる下降を作らない挿入gapは、既存のv−D..v−1の各要素の直前と末尾だけ。新しいvへの上昇は常に合法なので直前要素は制限しない。g=w+1個の区別gapへ同値cnt[v]個を分けるstars-and-barsはC(w+cnt[v],cnt[v])。最終列から最大値群を削除すると前段と各gapの個数が一意に戻るため、全値の積が各合法列を一度数える。

## 実装上の注意

窓から削除するのはv−D−1以下で、v−Dを残す。二項係数の最大添字はN。

## 復習の核

A=(1,3)でD=1なら1列、D=2なら13と31の2列。差Dを除く半開境界の実装をこの二例で検出する。

## 計算量と制約

### 時間

O(V+N)、V=max A+D。頻度窓と二項係数表。

### 空間

O(V+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 1\leq D\leq 10^6; 1\leq A_i\leq 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,3)、D=1。

1. 13は合法、31は下降差2>Dで不適。
2. v=3の窓[2,2]は空なので挿入gapは末尾一つ。

期待される結果: 1列。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じAでD=2なら差2を許すか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

窓は[v−D,v−1]でlower inclusive。31も合法になり2列。値差D未満という説明では境界を誤る。

確認結果: 2列。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/editorial/14492) — source-abc431-editorial-14492-228ecac80890d685616600ffce4e1c80d66c5ad8df5cd8032d64020511828730
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/tasks/abc431_f) — source-abc431-f-problem-24f87728a3fc28ac631adf09694ffab5bef2251ee31ef1a7d1836bd6c43d1f5f
