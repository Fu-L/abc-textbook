---
title: "ABC251-EX — Fill Triangle"
draft: true
authoringUnit: {"problemId":"abc251-ex","docPath":"src/content/docs/problems/mathematics/outcome-accelerate-iteration-by-characteristic-p-frobenius/outcome-accelerate-iteration-by-characteristic-p-frobenius-shard-001/abc251-ex.md","learningOutcomeIds":["outcome-accelerate-iteration-by-characteristic-p-frobenius"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-ordered-interval-partition"],"excludedTopics":["標数pのFrobenius恒等式による反復高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-finite-field-frobenius","tag-combinatorial-coefficients","tag-ordered-interval-partition"],"sourceRevisionIds":["source-abc251-editorial-3954-5502e77b9db90e8223bf51820c90da77bdb341a71963b77421a1a563a6336004","source-abc251-ex-problem-fecc529753f72db31753658d74853da733df6f9c45e94aa18801d577114ab7b0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一行上昇はシフト作用素Eによる(1+E)で表せる。標数7では(1+E)^{7^t}=1+E^{7^t}なので二つの位置の加算で7^t行分を正確に飛ばせる。N−Kの七進展開に従って合成すると所要変換そのものになる。各RLE加算は両列の境界で区間を分割するので全位置の値を保ち、隣接同値区間の統合も列を変えない。","sourceRevisionIds":["source-abc251-editorial-3954-5502e77b9db90e8223bf51820c90da77bdb341a71963b77421a1a563a6336004","source-abc251-ex-problem-fecc529753f72db31753658d74853da733df6f9c45e94aa18801d577114ab7b0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-accelerate-iteration-by-characteristic-p-frobenius"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=8、最下段は1が8個、K=1。","procedure":["7行上がる変換は7の冪ジャンプ1回。","先頭値はa_1+a_8=1+1=2 mod7。逐次法でも2^7=128≡2。"],"executionTarget":null,"expectedResult":"第1行は2。","verificationStatus":"not_applicable","learningUnitIds":["unit-finite-field-frobenius"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-accelerate-iteration-by-characteristic-p-frobenius"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-ordered-interval-partition"],"attainmentCondition":"同じ最下段でK=2なら何が得られるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"[1,1]。"},"answer":{"reasoningOrVerification":"6回の隣接加算で全値は2^6≡1になる。長さ2の列なので[1,1]。","procedure":["具体例の各状態・寄与を再計算する。","6回の隣接加算で全値は2^6≡1になる。長さ2の列なので[1,1]。"],"expectedResult":"[1,1]。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [標数pのFrobenius恒等式による反復高速化](src/content/docs/learn/number-theory/finite-field-frobenius.md)

- 標数pで中間の二項係数が消える恒等式 (1+x)^(p^t)=1+x^(p^t) をシフト演算へ適用し、隣接和反復をpの冪回ずつ飛ばす。圧縮列では各段のrun数の増加も評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

対象外:

- 標数pのFrobenius恒等式による反復高速化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

上の行は下の行との二項係数畳み込みであり、法7では(1+x)^(7^t)=1+x^(7^t)が成り立つため、7の冪行を一度に飛ばせる。

採用する候補: 7の冪ジャンプとRLE列の変換

巨大な行数差を七進展開に沿って飛ばし、同値が続く区間を圧縮したままシフト加算すればNが10^9でも処理できる。

棄却する候補: 三角形を一行ずつ生成する

必要な行差が最大10^9で、各行の長さも巨大になるため実行できない。

7^t行上がる変換は、位置jの値を現在列のjとj+7^tの和にする二つのシフトだけで表せる。

入力の種類数Mが小さいラン長圧縮列では、区間境界だけを分割・統合してジャンプ変換でき、全N要素を展開する必要がない。

N-Kを七進的な7の冪ジャンプへ分解し、各ジャンプでRLE列とその7^tシフト列を法7で加算する。区間境界を分割し、隣接する同値区間を再結合しながら、最後に先頭K項を出力する。

## 典型の発動条件

### 有限体上のFrobenius

発動条件: 法pのパスカル変換をpの冪単位で高速化したい。

(1+x)^(p^t)=1+x^(p^t)を使い、長い二項係数畳み込みを少数のシフト加算へ変える。

### ラン長圧縮列の区間演算

発動条件: 非常に長い列が少数の定数区間で与えられる。

シフトで生じる境界だけを分割し、値が等しい隣接区間を統合して表現を小さく保つ。

## 問題固有の要素

法7という条件は単なる出力の剰余ではなく、パスカル変換を7の冪ごとの疎な変換へ変える核心である。

別の問題へ持ち帰る視点: 巨大な反復線形変換は、標数pの冪構造と入力の圧縮表現を組み合わせると飛び越せる。

## 正当性

一行上昇はシフト作用素Eによる(1+E)で表せる。標数7では(1+E)^{7^t}=1+E^{7^t}なので二つの位置の加算で7^t行分を正確に飛ばせる。N−Kの七進展開に従って合成すると所要変換そのものになる。各RLE加算は両列の境界で区間を分割するので全位置の値を保ち、隣接同値区間の統合も列を変えない。

## 実装上の注意

- N,Kと区間端は64ビットで扱い、ジャンプの適用回数と向きを七進展開に合わせる。法7加算後に同値となった隣接ランを必ず統合し、出力はちょうどK項に切る。

## 復習の核

- 小さいNで一行ずつ作る実装と比較し、ジャンプ幅がラン境界に一致する場合と内部を横切る場合、値が0になってランが再結合する場合を確認する。

## 計算量と制約

### 時間

O(Σ_j r_j+K)。r_jは七進ジャンプjの直前のRLE区間数、ジャンプ回数は高々6⌈log_7N⌉。

### 空間

O(max_j r_j+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^9; 1 \leq M \leq \min(N, 200); 1 \leq K \leq \min(N,5 \times 10^5); 0 \leq a_i \leq 6; 1 \leq c_i \leq N; \sum_{i=1}^M c_i = N; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=8、最下段は1が8個、K=1。

1. 7行上がる変換は7の冪ジャンプ1回。
2. 先頭値はa_1+a_8=1+1=2 mod7。逐次法でも2^7=128≡2。

期待される結果: 第1行は2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ最下段でK=2なら何が得られるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

6回の隣接加算で全値は2^6≡1になる。長さ2の列なので[1,1]。

確認結果: [1,1]。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/editorial/3954) — source-abc251-editorial-3954-5502e77b9db90e8223bf51820c90da77bdb341a71963b77421a1a563a6336004
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/tasks/abc251_h) — source-abc251-ex-problem-fecc529753f72db31753658d74853da733df6f9c45e94aa18801d577114ab7b0
