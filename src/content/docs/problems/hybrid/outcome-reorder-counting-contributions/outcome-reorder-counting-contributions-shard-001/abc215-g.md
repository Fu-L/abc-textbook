---
title: "ABC215-G — Colorful Candies 2"
draft: true
authoringUnit: {"problemId":"abc215-g","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc215-g.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc215-editorial-2497-df0b13e3c660893741c643f23ebc88af2f75e8b02edfe3ba29c83fd76b909b27","source-abc215-g-problem-9d5a37e8b9076586f4e03230b8d055dccd7cbb2a8ecb06a813bc11c813cb6e5e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"色どうしの出現は独立でなくても、期待値の線形性により各色の出現確率を単純に足せる。 正の頻度 x が互いに異なるなら、その最小総和は 1＋2＋… と増えるため、存在する頻度値の種類数は少ない。 期待値への寄与は色名でなく頻度だけで決まり、異なる正頻度の種類数は N の平方根程度に抑えられる。","sourceRevisionIds":["source-abc215-editorial-2497-df0b13e3c660893741c643f23ebc88af2f75e8b02edfe3ba29c83fd76b909b27","source-abc215-g-problem-9d5a37e8b9076586f4e03230b8d055dccd7cbb2a8ecb06a813bc11c813cb6e5e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"色列(a,a,b)、K=2。","procedure":["三つの二枚選択はaa,ab,ab。","distinct色数は1,2,2。"],"executionTarget":null,"expectedResult":"期待値5/3。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"attainmentCondition":"色出現の独立性がなくても確率を足してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"色数は各色が一度以上現れる指示変数の和なので期待値の線形性で足せる。独立性は不要。"},"answer":{"reasoningOrVerification":"色数は各色が一度以上現れる指示変数の和なので期待値の線形性で足せる。独立性は不要。","procedure":["具体例の各状態・寄与を再計算する。","色数は各色が一度以上現れる指示変数の和なので期待値の線形性で足せる。独立性は不要。"],"expectedResult":"色数は各色が一度以上現れる指示変数の和なので期待値の線形性で足せる。独立性は不要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

選んだ K 個の飴に含まれる色数は、各色について「その色が一個以上現れた」という指示変数の総和である。

全 N 個中に n_i 個ある色 i が一度も選ばれない確率は C(N−n_i,K)／C(N,K) であり、出現確率はその余事象である。

棄却する候補: 各 K と各色の組について、その色が含まれる選び方を個別に計算して期待値へ加える。

色数も K の種類数も N に達し得るため、全組を処理すると二乗規模になる。

採用する候補: 同じ出現個数 x を持つ色を a_x 個にまとめ、各 K に対して正の a_x だけから出現確率を加算する。

期待値への寄与は色名でなく頻度だけで決まり、異なる正頻度の種類数は N の平方根程度に抑えられる。

色どうしの出現は独立でなくても、期待値の線形性により各色の出現確率を単純に足せる。

正の頻度 x が互いに異なるなら、その最小総和は 1＋2＋… と増えるため、存在する頻度値の種類数は少ない。

色数を指示変数の和へ分解し、余事象の二項係数比を頻度別に集約して、正頻度の疎性を利用しながら全ての K の期待値を求める。

## 典型の発動条件

### 指示変数と期待値の線形性

発動条件: 異なる種類の出現数の期待値を求め、種類間の依存関係が複雑なとき。

各色が一度以上選ばれる指示変数を置き、その出現確率を色ごとに加える。

### 頻度による同型項の集約

発動条件: 各種類の寄与が名前ではなく、その種類の出現回数だけで決まるとき。

頻度 x の色数 a_x を数え、同じ二項係数比を a_x 倍して一括加算する。

## 問題固有の要素

頻度ごとの配列は長さ N でも、正の異なる頻度は合計が N 以内という制約から平方根程度しか存在しない。

別の問題へ持ち帰る視点: 値別グループの走査が一見二乗でも、正の異なる値の総和制約から非零グループ数を評価できることがある。

## 正当性

色どうしの出現は独立でなくても、期待値の線形性により各色の出現確率を単純に足せる。 正の頻度 x が互いに異なるなら、その最小総和は 1＋2＋… と増えるため、存在する頻度値の種類数は少ない。 期待値への寄与は色名でなく頻度だけで決まり、異なる正頻度の種類数は N の平方根程度に抑えられる。

## 実装上の注意

- K＞N−x のとき C(N−x,K) は 0 と扱い、配列外の階乗を参照しない。
- 色の値そのものは大きくてもよいため、連想配列またはソートで各色の個数を求め、さらに頻度別の色数へ圧縮する。

## 復習の核

- 異なる種類数の期待値では、分布全体を追う前に各種類が現れたかという指示変数へ分解する。
- 同じ頻度の種類が同一式へ寄与するなら、頻度の種類数を総和制約から評価して反復回数を見積もる。

## 計算量と制約

### 時間

O(N√N)、存在する正の頻度種類数O(√N)、各Kで頻度別和。

### 空間

O(N)、階乗と頻度群。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^4; 1 \leq c_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

色列(a,a,b)、K=2。

1. 三つの二枚選択はaa,ab,ab。
2. distinct色数は1,2,2。

期待される結果: 期待値5/3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

色出現の独立性がなくても確率を足してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

色数は各色が一度以上現れる指示変数の和なので期待値の線形性で足せる。独立性は不要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/editorial/2497) — source-abc215-editorial-2497-df0b13e3c660893741c643f23ebc88af2f75e8b02edfe3ba29c83fd76b909b27
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/tasks/abc215_g) — source-abc215-g-problem-9d5a37e8b9076586f4e03230b8d055dccd7cbb2a8ecb06a813bc11c813cb6e5e
