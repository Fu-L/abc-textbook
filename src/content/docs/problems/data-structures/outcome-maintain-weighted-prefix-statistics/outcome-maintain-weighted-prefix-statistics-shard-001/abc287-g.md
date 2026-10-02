---
title: "ABC287-G — Balance Update Query"
draft: true
authoringUnit: {"problemId":"abc287-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc287-g.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix","tag-coordinate-compression"],"sourceRevisionIds":["source-abc287-editorial-5633-7a389616e1c18eb480569f5987f8248187fca80603469d38b3212c4d9f96339e","source-abc287-g-problem-8b42218db6b3e08b9fa2ffd1cbf114d5bc2fa41495e2afe16bfaea5fa2273199"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同じscoreのcardは区別不要なので、kind単位ではなくscore座標ごとのquota合計へ集約できる。 上位からcountがxを超える最初のscoreを境界とし、それより高い全cardのweighted sumに、残数×境界scoreを足せばよい。 種類ごとのscore/quota変更を点更新へ変え、順位境界と価値和を対数的に取得できる。","sourceRevisionIds":["source-abc287-editorial-5633-7a389616e1c18eb480569f5987f8248187fca80603469d38b3212c4d9f96339e","source-abc287-g-problem-8b42218db6b3e08b9fa2ffd1cbf114d5bc2fa41495e2afe16bfaea5fa2273199"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"score/quota=(7,2),(4,3)、上位x=4枚。","procedure":["7を2枚で14、残り4を2枚で8。","境界score4の全quota3枚を取らない。"],"executionTarget":null,"expectedResult":"最大和22。","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-prefix-fenwick"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"prerequisiteIds":["unit-coordinate-compression","unit-prefix-aggregate"],"attainmentCondition":"x=6ならどうなるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"総quota5枚しかないので-1。境界探索前に不足判定する。"},"answer":{"reasoningOrVerification":"総quota5枚しかないので-1。境界探索前に不足判定する。","procedure":["具体例の各状態・寄与を再計算する。","総quota5枚しかないので-1。境界探索前に不足判定する。"],"expectedResult":"総quota5枚しかないので-1。境界探索前に不足判定する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

最大score和を得るには、quotaの範囲でscoreが高いcardから順にx枚選べばよい。

score更新で将来現れる値は全queryを先読みすれば有限集合として得られ、座標圧縮できる。

各score帯についてcard枚数とscore×枚数の両方を持てば、上位帯を丸ごと選んだ価値と閾値帯の一部選択を計算できる。

採用する候補: 全scoreを座標圧縮し、quota総数とscore総和の2本のFenwick treeで更新・上位x枚queryを処理する。

種類ごとのscore/quota変更を点更新へ変え、順位境界と価値和を対数的に取得できる。

棄却する候補: query 3ごとに全種類をscore順にsortしてquotaを消費する。

最大2×10^5回のqueryで毎回N種類をsortすると間に合わない。

棄却する候補: max heapへcardをquota枚ずつ投入して更新する。

総quotaが大きく、scoreやquotaの変更で古い要素の削除・大量挿入も必要になる。

同じscoreのcardは区別不要なので、kind単位ではなくscore座標ごとのquota合計へ集約できる。

上位からcountがxを超える最初のscoreを境界とし、それより高い全cardのweighted sumに、残数×境界scoreを足せばよい。

初期scoreと全type-1更新値を圧縮し、Fenwick Xへ各座標のquota、Yへscore×quotaを入れる。score変更では旧座標からb_iを引き新座標へ足し、quota変更では差分を現在score座標へ反映する。type-3ではX全体がx未満なら-1。否则Fenwickのprefix lower_bound等で上位x枚の境界座標を求め、高score側のY合計と境界scoreで残りを計算する。

## 典型の発動条件

### offline座標圧縮

発動条件: 更新値を含む大きなkey集合がquery先読みで既知になるとき。

初期値と全score更新値だけを昇順indexへ写す。

### 個数・重み和の二重Fenwick

発動条件: 上位k個の値の総和を動的multisetで求めたいとき。

frequencyで順位境界を探し、weighted sumで完全に取る範囲の価値を得る。

### 閾値bucketの部分採用

発動条件: 同値要素をまとめた順位queryで必要数がbucket途中に達するとき。

境界より上を全採用し、残数だけ同scoreから取る。

## 問題固有の要素

各kindに10^100枚あってもquotaだけが選択可能数を決めるため、実体cardを生成せずscore別の有限なmultiplicityとして扱える。

別の問題へ持ち帰る視点: 巨大または暗黙の要素集合でも、同値な要素をweight付きbucketへ集約できればorder statisticを処理できる。

## 正当性

同じscoreのcardは区別不要なので、kind単位ではなくscore座標ごとのquota合計へ集約できる。 上位からcountがxを超える最初のscoreを境界とし、それより高い全cardのweighted sumに、残数×境界scoreを足せばよい。 種類ごとのscore/quota変更を点更新へ変え、順位境界と価値和を対数的に取得できる。

## 実装上の注意

- score変更時は現在quota b_iを、quota変更時は現在score a_iを使い、両arrayをquery後に更新する。
- countとscore総和は64bit整数で持ち、score 0のbucketも圧縮対象から落とさない。
- Fenwickがprefix方向なら、全体−prefixでsuffix量へ変換するindex境界を揃える。

## 復習の核

- 同じscoreの複数kind、score 0、境界bucketを一部だけ使うqueryを作り、Xの枚数差分とYの価値差分が常に同期するか確認する。

## 計算量と制約

### 時間

O((N+Q)log(N+Q))、score圧縮とBIT木上順位探索。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,Q \leq 2 \times 10^5; 0 \leq a_i \leq 10^9; 0 \leq b_i \leq 10^4; For each query of the 1-st kind, 1 \leq x \leq N and 0 \leq y \leq 10^9.; For each query of the 2-nd kind, 1 \leq x \leq N and 0 \leq y \leq 10^4.; For each query of the 3-rd kind, 1 \leq x \leq 10^9.; There is at least one query of the 3-rd kind.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

score/quota=(7,2),(4,3)、上位x=4枚。

1. 7を2枚で14、残り4を2枚で8。
2. 境界score4の全quota3枚を取らない。

期待される結果: 最大和22。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

x=6ならどうなるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

総quota5枚しかないので-1。境界探索前に不足判定する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/editorial/5633) — source-abc287-editorial-5633-7a389616e1c18eb480569f5987f8248187fca80603469d38b3212c4d9f96339e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/tasks/abc287_g) — source-abc287-g-problem-8b42218db6b3e08b9fa2ffd1cbf114d5bc2fa41495e2afe16bfaea5fa2273199
