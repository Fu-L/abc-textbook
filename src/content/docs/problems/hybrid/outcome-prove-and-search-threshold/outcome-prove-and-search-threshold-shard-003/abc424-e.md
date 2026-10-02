---
title: "ABC424-E — Cut in Half"
draft: true
authoringUnit: {"problemId":"abc424-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-003/abc424-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-implicit-binary-tree"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-implicit-binary-tree-arithmetic"],"sourceRevisionIds":["source-abc424-e-problem-02b9995b4ccab9db6e4ad63955d08e26ca78ed293099894cb655b42315c3c4a6","source-abc424-editorial-13858-a4d5f909bedd3be212f27b0394ffd777966ae96bbccd6e09e08a6e08a6a3857e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"need(D)=Σ(2^{q_i}-1)はDが増えるほど非増加で、need(D)≤Kとなる境界がK回後のmaximumを定める。境界まで分割後の余剰splitは同じ最大長pieceだけを最大数未満割り、長さ半分へ移す。 K回greedy後の最大値を単調な必要split数で求め、全K回をheap simulationせず処理できる。","sourceRevisionIds":["source-abc424-e-problem-02b9995b4ccab9db6e4ad63955d08e26ca78ed293099894cb655b42315c3c4a6","source-abc424-editorial-13858-a4d5f909bedd3be212f27b0394ffd777966ae96bbccd6e09e08a6e08a6a3857e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-and-search-threshold"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"初期棒長8、最大棒を二分する操作K=2、順位X=2。","procedure":["一回目は4,4。","二回目は4,2,2。"],"executionTarget":null,"expectedResult":"二番目の長さ2。","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-and-search-threshold"],"prerequisiteIds":["unit-implicit-binary-tree"],"attainmentCondition":"同じ最大長の全pieceを最後に一度で割るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"余剰回数は同長piece数未満の場合があり、Kを超えて割ってはならない。この例は4の二本中一本だけ割る。"},"answer":{"reasoningOrVerification":"余剰回数は同長piece数未満の場合があり、Kを超えて割ってはならない。この例は4の二本中一本だけ割る。","procedure":["具体例の各状態・寄与を再計算する。","余剰回数は同長piece数未満の場合があり、Kを超えて割ってはならない。この例は4の二本中一本だけ割る。"],"expectedResult":"余剰回数は同長piece数未満の場合があり、Kを超えて割ってはならない。この例は4の二本中一本だけ割る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [対称性・深さ・label区間で巨大な完全二分木を数える](src/content/docs/learn/tree/implicit-binary-tree.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

一つの長さAのstickを全piece長≤Dにするには深さq=ceil(log2(A/D))まで完全二分し、2^q-1回splitが必要である。各元stickは独立なので必要回数を合計できる。

採用する候補: 最終maximum長Dを二分探索し、dyadic piece数を集約してX-thを取る

K回greedy後の最大値を単調な必要split数で求め、全K回をheap simulationせず処理できる。

棄却する候補: 最大stickをpriority queueでK回splitする

Kは10^9で一操作ずつ処理できない。

need(D)=Σ(2^{q_i}-1)はDが増えるほど非増加で、need(D)≤Kとなる境界がK回後のmaximumを定める。境界まで分割後の余剰splitは同じ最大長pieceだけを最大数未満割り、長さ半分へ移す。

relative errorに十分な回数binary searchしてfinal maximum Lを得る。各A_iのminimal depth q_iと2^q_i pieces of A_i/2^q_iをcount mapへ足し、used=Σ(2^q_i-1)を求める。残K-used個のlength L pieceを一つずつsplitした集約差分を反映し、length降順count累積でX-thを出す。

## 典型の発動条件

### 答えの二分探索

発動条件: threshold以下に全objectをする最小operation数がthresholdに単調である。

Dごとの完全二分深さからneed(D)を計算し境界を探す。

### 完全二分木の層数式とfrequency集約

発動条件: 同じobjectへの反復二分操作が、深さqの完全二分木として対称に展開されるとき。

各棒のq回分割を内部node数2^q−1・葉数2^qで数え、pieceを個別生成せずlength→count mapで順位を求める。

## 問題固有の要素

greedyが常にlongestを割るため、最終maximum未満のpieceを先に割ることはなく、境界後の余剰操作もmaximum classだけへ集中する。

別の問題へ持ち帰る視点: priority processはthreshold到達までの各rootの展開数をclosed form化できる。

## 正当性

need(D)=Σ(2^{q_i}-1)はDが増えるほど非増加で、need(D)≤Kとなる境界がK回後のmaximumを定める。境界まで分割後の余剰splitは同じ最大長pieceだけを最大数未満割り、長さ半分へ移す。 K回greedy後の最大値を単調な必要split数で求め、全K回をheap simulationせず処理できる。

## 実装上の注意

- 2^qとneedはKを超えた時点でcapしoverflowを防ぐ。浮動比較の境界ではdyadic長を一貫して再構成する。

## 復習の核

- K小でheap simulationと比較し、同率maximumが複数、X=1/N+Kを検証する。

## 計算量と制約

### 時間

O(IN log K+N log K log(N log K))、I実数二分回数、分割depth≤log₂(K+1)。

### 空間

O(N log K)、depth別piece count。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; For each test case: 1 \leq N \leq 10^5 1 \leq A_i \leq 10^9 1 \leq K \leq 10^9 1 \leq X \leq N+K; 1 \leq N \leq 10^5; 1 \leq A_i \leq 10^9; 1 \leq K \leq 10^9; 1 \leq X \leq N+K; The sum of N over all test cases does not exceed 10^5.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

初期棒長8、最大棒を二分する操作K=2、順位X=2。

1. 一回目は4,4。
2. 二回目は4,2,2。

期待される結果: 二番目の長さ2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ最大長の全pieceを最後に一度で割るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

余剰回数は同長piece数未満の場合があり、Kを超えて割ってはならない。この例は4の二本中一本だけ割る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/tasks/abc424_e) — source-abc424-e-problem-02b9995b4ccab9db6e4ad63955d08e26ca78ed293099894cb655b42315c3c4a6
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/editorial/13858) — source-abc424-editorial-13858-a4d5f909bedd3be212f27b0394ffd777966ae96bbccd6e09e08a6e08a6a3857e
