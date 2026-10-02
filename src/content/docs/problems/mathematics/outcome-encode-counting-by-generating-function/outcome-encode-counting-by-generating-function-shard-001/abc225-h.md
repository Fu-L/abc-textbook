---
title: "ABC225-H — Social Distance 2"
draft: true
authoringUnit: {"problemId":"abc225-h","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc225-h.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc225-editorial-2834-cdce3199f33b881049c53cbd155bf02b23ef7e989c6b1c6c5e6c04d5c5e8d01d","source-abc225-h-problem-eb012bb53f4a2575070ec7721fa3027063e62b8e837c718f9f96acbc0d54fafd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定席で区切った各区間では距離積が独立。区間多項式のk次係数がk人追加の位置選択の重み和なので、積のD次係数は全配分を一度数える。位置のみを数えた後、相異なるD人の割当てD!を掛けると個体差を回復する。","sourceRevisionIds":["source-abc225-editorial-2834-cdce3199f33b881049c53cbd155bf02b23ef7e989c6b1c6c5e6c04d5c5e8d01d","source-abc225-h-problem-eb012bb53f4a2575070ec7721fa3027063e62b8e837c718f9f96acbc0d54fafd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、M=2、固定席2に1人。","procedure":["追加席1でも3でも隣人との差は1。"],"executionTarget":null,"expectedResult":"スコア和2。","verificationStatus":"not_applicable","learningUnitIds":["unit-generating-functions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"prerequisiteIds":["unit-combinatorial-coefficients"],"attainmentCondition":"隣接した固定席間の空区間で0人追加の係数は0か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"定数係数1。"},"answer":{"reasoningOrVerification":"固定席間距離は1なので係数1。空区間は恒等因子になる。","procedure":["具体例の各状態・寄与を再計算する。","固定席間距離は1なので係数1。空区間は恒等因子になる。"],"expectedResult":"定数係数1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

固定済みの座席を境界にすると空席はK+1個の区間へ分かれ、隣り合う着席位置の差の積も各区間内の選び方の寄与の積へ分解できる。未着席者の個体差は最後に順列係数として戻せる。

採用する候補: 両端・片端・無端が着席済みの区間ごとの人数別スコア和を二項係数で閉じ、各区間の多項式を畳み込みで掛けてM-K次係数を取る。

固定席で区間が独立になり、区間へ何人配るかだけが多項式積の次数として結合するため、高速畳み込みが使える。

棄却する候補: 左から席を見て、直前の着席位置と着席人数を持つ通常DPで全配置を加算する。

距離積を更新するため直前位置まで状態に含めるとNとMにまたがる二乗規模となり、N=2×10^5 に届かない。

長さnの区間へk人追加するスコア和は、両端着席で C(n+k-1,2k+1)、片端着席で C(n+k-1,2k)、両端なしで C(n+k-1,2k-1) と表せる。

区間ごとの係数列を多項式にすると、積のd次係数が合計d人を各区間へ配る全方法とスコア積の総和を同時に表す。

固定席からK+1個の区間多項式を作り、次数M-Kまでに切って小さいものから畳み込み、係数[M-K]へ未着席者の並べ方(M-K)!を掛ける。K=0は両端なしの式を直接使う。

## 典型の発動条件

### 固定点による区間独立化

発動条件: 一次元配置の評価が隣接選択点間の積で、いくつかの選択点が既に固定されているとき。

固定点間と両端の区間を分離し、各区間へ追加する人数だけを共有変数として残す。

### 生成多項式の積による人数配分

発動条件: 独立な部品ごとに使用個数別の重みがあり、全部品で使う総数を固定したいとき。

各区間のk人分のスコア和をx^kの係数にし、多項式積の指定次数を畳み込みで求める。

## 問題固有の要素

距離の積という非加法的なスコアが、固定席で切った各区間のスコアの積としてちょうど因数分解する。

別の問題へ持ち帰る視点: 隣接要素間の積を全配置で足す問題では、固定境界で独立成分へ切り、各成分の重みを生成関数の係数にする。

## 正当性

固定席で区切った各区間では距離積が独立。区間多項式のk次係数がk人追加の位置選択の重み和なので、積のD次係数は全配分を一度数える。位置のみを数えた後、相異なるD人の割当てD!を掛けると個体差を回復する。

## 実装上の注意

- 端区間と内部区間でf1,f2,f3を取り違えず、各多項式をM-K次で打ち切る。未着席者を区別しない集計後に(M-K)!を掛け戻す。

## 復習の核

- 隣接距離の積は足し算DPへ急いで落とさず、固定点で切ったとき区間ごとの積へ分解するかを確認する。

## 計算量と制約

### 時間

O(N+Σ_j ℓ_j log ℓ_j)。ℓ_jはD=M−K次に切った各NTT積の変換長で、小さい多項式から合成する。

### 空間

O(N+D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 2 \leq M \leq N; 0 \leq K \leq M; 1 \leq A_1 \lt A_2 \lt \ldots \lt A_K \leq N; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、M=2、固定席2に1人。

1. 追加席1でも3でも隣人との差は1。

期待される結果: スコア和2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

隣接した固定席間の空区間で0人追加の係数は0か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

固定席間距離は1なので係数1。空区間は恒等因子になる。

確認結果: 定数係数1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/editorial/2834) — source-abc225-editorial-2834-cdce3199f33b881049c53cbd155bf02b23ef7e989c6b1c6c5e6c04d5c5e8d01d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc225/tasks/abc225_h) — source-abc225-h-problem-eb012bb53f4a2575070ec7721fa3027063e62b8e837c718f9f96acbc0d54fafd
