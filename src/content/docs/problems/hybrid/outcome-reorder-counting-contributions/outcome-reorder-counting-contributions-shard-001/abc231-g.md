---
title: "ABC231-G — Balls in Boxes"
draft: true
authoringUnit: {"problemId":"abc231-g","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc231-g.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-generating-functions","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc231-editorial-3051-f01ce3737eb8308e2bca5621c3dafd2305bea4bc5c68a1be636ac7cc0f1ca678","source-abc231-g-problem-69931605380a9f39f080222475ed80e894b343fb11dc7e342b4b9cd81494e59f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"m 個の相異なる箱について ∏X_i を展開すると、同じ時刻に二箱は選べないため有効なのは相異なる m 時刻だけで、期待値は (K)_m/N^m になる。 A の積の部分集合和は ∏(1＋A_i z) の係数、すなわち全次数の基本対称式として一度に計算できる。 A 側は二次時間の対称式 DP、確率側は falling factorial の一次再帰となり、巨大な K を状態に含めない。","sourceRevisionIds":["source-abc231-editorial-3051-f01ce3737eb8308e2bca5621c3dafd2305bea4bc5c68a1be636ac7cc0f1ca678","source-abc231-g-problem-69931605380a9f39f080222475ed80e894b343fb11dc7e342b4b9cd81494e59f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2)、K=1、一箱を等確率で増やす。","procedure":["箱1を増やすと積2·2=4、箱2なら1·3=3。","平均(4+3)/2。"],"executionTarget":null,"expectedResult":"期待積7/2。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-generating-functions","unit-modular-arithmetic"],"attainmentCondition":"同じ時刻を異なる二箱の増分へ割り当てる項は寄与するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一操作は一箱しか選べずその項は0。m箱momentは相異なるm時刻の(K)_m/N^mである。"},"answer":{"reasoningOrVerification":"一操作は一箱しか選べずその項は0。m箱momentは相異なるm時刻の(K)_m/N^mである。","procedure":["具体例の各状態・寄与を再計算する。","一操作は一箱しか選べずその項は0。m箱momentは相異なるm時刻の(K)_m/N^mである。"],"expectedResult":"一操作は一箱しか選べずその項は0。m箱momentは相異なるm時刻の(K)_m/N^mである。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

箱 i が選ばれた回数を X_i とすると得点は ∏(A_i＋X_i) であり、積を展開すれば各項の期待値へ線形性を適用できる。

相異なる m 箱の X_i の積の期待値は箱の選び方に依存せず、操作時刻を各箱へ一つ割り当てる組合せだけで決まる。

棄却する候補: K 回後の各箱の球数分布を多次元 DP で求め、配置ごとの積を確率付きで足す。

K が 10 億で箱数も 1000 あり、球の配分状態を列挙できない。

採用する候補: 積を A と X の選択部分集合で展開し、A の基本対称式と、相異なる箱の選択回数積の共通期待値を次数別に掛け合わせる。

A 側は二次時間の対称式 DP、確率側は falling factorial の一次再帰となり、巨大な K を状態に含めない。

m 個の相異なる箱について ∏X_i を展開すると、同じ時刻に二箱は選べないため有効なのは相異なる m 時刻だけで、期待値は (K)_m/N^m になる。

A の積の部分集合和は ∏(1＋A_i z) の係数、すなわち全次数の基本対称式として一度に計算できる。

ランダムな選択回数を含む積を多重線形展開し、定数 A の基本対称式と multinomial 分布の相異なる座標に対する階乗モーメントを次数ごとに合成する。

## 典型の発動条件

### 積の展開と期待値の線形性

発動条件: 相関する確率変数の積でも、各変数が一次式として一度ずつ現れるとき。

各因子から A_i または X_i を選ぶ部分集合へ展開し、単項式ごとの期待値を足す。

### 基本対称式 DP

発動条件: 全ての部分集合について要素積を選択個数別に合計したいとき。

多項式 ∏(1＋A_i z) の係数を一次元 DP の降順更新で求める。

## 問題固有の要素

X_i 自体は互いに独立でないが、各操作で選ばれる箱の対称性と時刻の独立性により、相異なる箱集合の積期待値は集合サイズだけに依存する。

別の問題へ持ち帰る視点: 交換可能な確率変数では独立性を求める前に、必要なモーメントが添字集合の大きさだけで決まる対称性を探す。

## 正当性

m 個の相異なる箱について ∏X_i を展開すると、同じ時刻に二箱は選べないため有効なのは相異なる m 時刻だけで、期待値は (K)_m/N^m になる。 A の積の部分集合和は ∏(1＋A_i z) の係数、すなわち全次数の基本対称式として一度に計算できる。 A 側は二次時間の対称式 DP、確率側は falling factorial の一次再帰となり、巨大な K を状態に含めない。

## 実装上の注意

- (K)_m は m＞K で 0 になり、m を一つ増やすごとに K−m＋1 と N の逆元を掛けて更新する。
- 次数 m の X を選ぶ項には次数 N−m の A 基本対称式を対応させ、添字を逆に取り違えない。

## 復習の核

- 確率変数の積が難しいときも、各因子が定数＋変数ならまず全単項式へ展開し、線形性が使える形を探す。
- 選択回数の積では、時刻添字が一致した項が 0 になるかを調べ、相異なる時刻の falling factorial を導く。

## 計算量と制約

### 時間

O(N²)、基本対称式DPと次数momentの合成。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1000; 1 \leq K \leq 10^9; 0 \leq A_i \leq 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2)、K=1、一箱を等確率で増やす。

1. 箱1を増やすと積2·2=4、箱2なら1·3=3。
2. 平均(4+3)/2。

期待される結果: 期待積7/2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ時刻を異なる二箱の増分へ割り当てる項は寄与するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一操作は一箱しか選べずその項は0。m箱momentは相異なるm時刻の(K)_m/N^mである。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/editorial/3051) — source-abc231-editorial-3051-f01ce3737eb8308e2bca5621c3dafd2305bea4bc5c68a1be636ac7cc0f1ca678
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/tasks/abc231_g) — source-abc231-g-problem-69931605380a9f39f080222475ed80e894b343fb11dc7e342b4b9cd81494e59f
