---
title: "ABC293-EX — Optimal Path Decomposition"
draft: true
authoringUnit: {"problemId":"abc293-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc293-ex.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc293-editorial-5964-fa661f02f6876e8896f80d4179788d50bb5a6502ede71ab300bd6a35945c80c9","source-abc293-ex-problem-a073d501650d2242c62acd73265aeb8e9e62825f1dbe51a2e2cbb5363343f6b9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同色にする子はdpが大きいものを優先し、3個以上は同色連結成分がパスでなくなるため高々2個だけ考える。 各頂点では子を同色にする0/1/2個の選択だけで、子dpの上位定数個から最適遷移とK可否を判定できる。","sourceRevisionIds":["source-abc293-editorial-5964-fa661f02f6876e8896f80d4179788d50bb5a6502ede71ab300bd6a35945c80c9","source-abc293-ex-problem-a073d501650d2242c62acd73265aeb8e9e62825f1dbe51a2e2cbb5363343f6b9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-and-search-threshold"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"同じ色の中心に三つの同色子を付ける候補。","procedure":["同色成分の中心次数は3。","一つのpathで覆うための局所degree≤2に反する。"],"executionTarget":null,"expectedResult":"三子を同時に同色pathへ採用する候補は不適。","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-and-search-threshold"],"prerequisiteIds":["unit-rooted-tree-aggregation"],"attainmentCondition":"最大二子だけを見る根拠は単なる高速化か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"path成分は分岐しないという必要条件に基づく。上位三個以上を選ぶ状態自体がinvalid。"},"answer":{"reasoningOrVerification":"path成分は分岐しないという必要条件に基づく。上位三個以上を選ぶ状態自体がinvalid。","procedure":["具体例の各状態・寄与を再計算する。","path成分は分岐しないという必要条件に基づく。上位三個以上を選ぶ状態自体がinvalid。"],"expectedResult":"path成分は分岐しないという必要条件に基づく。上位三個以上を選ぶ状態自体がinvalid。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

最大色数K以下の判定は、根付き部分木から親へ伸びるパスの必要色数と、親を根と同色にできるかの1bitだけを残せば統合できる。

採用する候補: 答え二分探索と定数候補だけ見る木DP

各頂点では子を同色にする0/1/2個の選択だけで、子dpの上位定数個から最適遷移とK可否を判定できる。

棄却する候補: 全頂点の色を列挙

色数・割当とも指数的で木構造を利用しない。

同色にする子はdpが大きいものを優先し、3個以上は同色連結成分がパスでなくなるため高々2個だけ考える。

Kを固定し葉から(dp_v,f_v)を計算して全パス制約を検査する。判定の単調性でKを二分探索し、子値は最大数個だけ保持する。

## 典型の発動条件

### 答えの二分探索

発動条件: 最大値最小化でK以下の可否が単調。

木DP判定を繰り返す。

### 木DPの支配状態削減

発動条件: 親との接続可否と最悪値だけが上位へ影響する。

(dp,f)の非支配状態一つへ圧縮する。

## 問題固有の要素

同色辺を選ぶことを各頂点次数高々2のパス分解とみると、子の選択肢が0〜2個に限定される。

別の問題へ持ち帰る視点: 木上のパス制約は親境界で必要な要約状態を探す。

## 正当性

同色にする子はdpが大きいものを優先し、3個以上は同色連結成分がパスでなくなるため高々2個だけ考える。 各頂点では子を同色にする0/1/2個の選択だけで、子dpの上位定数個から最適遷移とK可否を判定できる。

## 実装上の注意

- 子dpの上位値とf別上位を定数個正確に拾い、根には親接続可否を要求しない。

## 復習の核

- 小木の全分解と比較し、星・鎖・同値子が多い場合とK判定境界を確認する。

## 計算量と制約

### 時間

O(N log N)、K判定O(N)、子summaryの上位定数個を保持。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i, B_i \leq N; The given graph is a tree.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

同じ色の中心に三つの同色子を付ける候補。

1. 同色成分の中心次数は3。
2. 一つのpathで覆うための局所degree≤2に反する。

期待される結果: 三子を同時に同色pathへ採用する候補は不適。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

最大二子だけを見る根拠は単なる高速化か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

path成分は分岐しないという必要条件に基づく。上位三個以上を選ぶ状態自体がinvalid。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/editorial/5964) — source-abc293-editorial-5964-fa661f02f6876e8896f80d4179788d50bb5a6502ede71ab300bd6a35945c80c9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/tasks/abc293_h) — source-abc293-ex-problem-a073d501650d2242c62acd73265aeb8e9e62825f1dbe51a2e2cbb5363343f6b9
