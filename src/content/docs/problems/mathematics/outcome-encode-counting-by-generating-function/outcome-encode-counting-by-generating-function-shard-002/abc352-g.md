---
title: "ABC352-G — Socks 3"
draft: true
authoringUnit: {"problemId":"abc352-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc352-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-modular-arithmetic","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients","tag-contribution-reordering","tag-modular-arithmetic","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc352-editorial-9921-cd1539bcfa3bc4b97abe409358a9a00fefca49b80670243b72959acd693fe786","source-abc352-g-problem-d90411b7e23ff5291b7a54c09dd39346be4e8a3d7e1c05f9a3f4669571b667fa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i枚でpairがないことは全i枚の色が相異なること。色別1+A_jxの積の係数f_iは実物靴下の順不同選択数であり、全C(S,i)集合と比較すれば生存確率になる。T≥i+1とi枚後の生存は同じ事象なので、i=0..Nを足すtail-sumが取り出し枚数の期待値になる。","sourceRevisionIds":["source-abc352-editorial-9921-cd1539bcfa3bc4b97abe409358a9a00fefca49b80670243b72959acd693fe786","source-abc352-g-problem-d90411b7e23ff5291b7a54c09dd39346be4e8a3d7e1c05f9a3f4669571b667fa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,2)、S=4。","procedure":["0,1枚後の生存は1。2枚後は色相異の4集合/全6集合=2/3。","3枚後は必ずpair。"],"executionTarget":null,"expectedResult":"期待枚数1+1+2/3=8/3。","verificationStatus":"not_applicable","learningUnitIds":["unit-generating-functions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-modular-arithmetic","unit-recursive-divide-and-conquer"],"attainmentCondition":"一色だけでA_1≥2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"期待枚数2。"},"answer":{"reasoningOrVerification":"一枚後は生存、二枚目で必ずpair。N+1上限とtail添字を確認できる。","procedure":["具体例の各状態・寄与を再計算する。","一枚後は生存、二枚目で必ずpair。N+1上限とtail添字を確認できる。"],"expectedResult":"期待枚数2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

同色 pair ができるまでに取り出す枚数は鳩の巣原理で N+1 以下。非負整数値の期待値は E[T]=Σ_{i≥1}Pr(T≥i) という tail sum で求められる。

i 枚後も終了しない確率は、異なる i 色から各一枚選ぶ方法 f_i を全 i 枚選択 C(S,i) で割ったものになる。f_i は ∏(1+A_jx) の x^i 係数である。

採用する候補: 線形多項式 (1+A_i x) を product tree と NTT で総積し、各係数を組合せ数で割って tail probability を合計する。

全 elementary symmetric sums f_i を O(N log²N) 程度で一括取得でき、N=3×10^5 を扱える。

棄却する候補: 色を順に追加する通常の elementary symmetric DP を O(N²) で行う。

係数数 N に対し最大約3000色で全次数を更新すると9×10^8規模になり、積構造を使えていない。

色 j を選ばない一通りと、その色から一足だけ選ぶ A_j 通りが因子 1+A_jx に対応し、係数が色相異なる靴下集合数を過不足なく数える。

順不同抽出の survival probability は f_i/C(S,i) であり、T≥i+1 と i 枚時点の pair 不在を添字対応させる。

S=ΣA_i を計算し、各色の polynomial 1+A_i x を次数 N で product tree により NTT multiplication する。得た f_0..f_N と C(S,i) の逐次更新または factorial 式から P_{i+1}=f_i/C(S,i) を作り、i=0..N を合計する。

## 典型の発動条件

### 期待値の tail-sum formula

発動条件: 停止時刻が小さい整数上界を持ち、各時点まで継続する確率が数えやすいとき。

E[T] を終了時刻分布でなく ΣPr(T≥i) として計算する。

### 多項式積による elementary symmetric sum

発動条件: 各 group から0/1個を選ぶ重み付き組合せ数を全サイズで求めるとき。

因子 (1+w_i x) の総積を product tree と高速畳み込みで作る。

## 問題固有の要素

pair ができる過程を直接追うより、「まだ全色相異なる」という survival event を数えると独立な色選択の多項式積になる。

別の問題へ持ち帰る視点: 停止期待値では、継続条件の方が積・組合せとして簡単でないか先に比較する。

## 正当性

i枚でpairがないことは全i枚の色が相異なること。色別1+A_jxの積の係数f_iは実物靴下の順不同選択数であり、全C(S,i)集合と比較すれば生存確率になる。T≥i+1とi枚後の生存は同じ事象なので、i=0..Nを足すtail-sumが取り出し枚数の期待値になる。

## 実装上の注意

- S は大きいが i≤N だけ必要なので C(S,i) を逐次式で求める。P_1 は f_0/C(S,0)=1 を含み、添字を一つずらす。

## 復習の核

- 終了確率より継続確率を書き、i枚選択と T≥i+1 の対応を確認する。多項式の各因子が「その色を0/1足選ぶ」を表すことを言葉で説明する。

## 計算量と制約

### 時間

O(N log²N)。一次因子積木とN個の生存確率の和。

### 空間

O(N log N)の積木保持、逐次解放でO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 3\times 10^5; 2\leq A_i \leq 3000; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,2)、S=4。

1. 0,1枚後の生存は1。2枚後は色相異の4集合/全6集合=2/3。
2. 3枚後は必ずpair。

期待される結果: 期待枚数1+1+2/3=8/3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

一色だけでA_1≥2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一枚後は生存、二枚目で必ずpair。N+1上限とtail添字を確認できる。

確認結果: 期待枚数2。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc352/editorial/9921) — source-abc352-editorial-9921-cd1539bcfa3bc4b97abe409358a9a00fefca49b80670243b72959acd693fe786
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc352/tasks/abc352_g) — source-abc352-g-problem-d90411b7e23ff5291b7a54c09dd39346be4e8a3d7e1c05f9a3f4669571b667fa
