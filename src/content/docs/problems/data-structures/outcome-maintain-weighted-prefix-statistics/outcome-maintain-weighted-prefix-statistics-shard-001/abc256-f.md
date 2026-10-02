---
title: "ABC256-F — Cumulative Cumulative Cumulative Sum"
draft: true
authoringUnit: {"problemId":"abc256-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc256-f.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc256-editorial-4131-5a56cfc1385cccb66caaa609b059936e87f87c1a1fe818c7857a8646d481623a","source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"累積回数を二項係数として数え、x と i の多項式へ展開すると可変 x と更新対象 i を分離できる。 点更新を三つの moment の差分更新へ変換でき、必要な prefix 和を対数時間で取得できる。","sourceRevisionIds":["source-abc256-editorial-4131-5a56cfc1385cccb66caaa609b059936e87f87c1a1fe818c7857a8646d481623a","source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2,3)、x=3。","procedure":["B=(1,3,6)、C=(1,4,10)、D=(1,5,15)。","重みは6,3,1で1·6+2·3+3·1=15。"],"executionTarget":null,"expectedResult":"D_3=15。","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-prefix-fenwick"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-prefix-aggregate"],"attainmentCondition":"A_2を4へ更新するとD_3はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"差分2に位置2の重み3を掛けて+6、答え21。三momentへ同じ差分を各重み付きで反映する。"},"answer":{"reasoningOrVerification":"差分2に位置2の重み3を掛けて+6、答え21。三momentへ同じ差分を各重み付きで反映する。","procedure":["具体例の各状態・寄与を再計算する。","差分2に位置2の重み3を掛けて+6、答え21。三momentへ同じ差分を各重み付きで反映する。"],"expectedResult":"差分2に位置2の重み3を掛けて+6、答え21。三momentへ同じ差分を各重み付きで反映する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

一点代入のたびに B,C,D を作り直すと 1 query が Θ(N) であり、N,Q≤2×10^5 には間に合わない。更新される A の一点が各 D_x へ与える寄与を直接管理したい。

i≤x の A_i は B へ 1 回、C_x へ x-i+1 回、D_x へ (x-i+1)(x-i+2)/2 回寄与する。この係数は i に関する二次式へ展開できる。

採用する候補: ΣA_i・ΣiA_i・Σi²A_i を三本の Fenwick tree で管理し、展開式から各 query を求める。

点更新を三つの moment の差分更新へ変換でき、必要な prefix 和を対数時間で取得できる。

棄却する候補: 更新後に累積和を三回作り直して D_x を求める。

一回の更新が後続の全要素へ影響し、query ごとの再構築は線形時間になる。

累積回数を二項係数として数え、x と i の多項式へ展開すると可変 x と更新対象 i を分離できる。

S_r(x)=Σ_{i=1}^x i^r A_i (r=0,1,2) を 3 本の Fenwick tree で管理し、D_x={S_2(x)-(2x+3)S_1(x)+(x+1)(x+2)S_0(x)}/2 を計算する。代入更新は旧値との差分を 3 種類の重みで加える。

## 典型の発動条件

### 多項式 moment の分離

発動条件: 更新位置 i の寄与が query 位置 x との低次多項式で表せるとき。

i の次数ごとの prefix 和を別々に管理する。

### Fenwick tree

発動条件: 点更新と prefix 和をオンラインで繰り返すとき。

三種類の重み付き A_i をそれぞれ更新・取得する。

## 問題固有の要素

累積和をデータ構造へ直接載せるのではなく、元の A_i が答えへ何回寄与するかを先に数える。

別の問題へ持ち帰る視点: 多重累積・区間加算では、一要素の寄与係数を二項係数や多項式へ展開して moment を探す。

## 正当性

累積回数を二項係数として数え、x と i の多項式へ展開すると可変 x と更新対象 i を分離できる。 点更新を三つの moment の差分更新へ変換でき、必要な prefix 和を対数時間で取得できる。

## 実装上の注意

- 添字を 1-origin で統一し、代入更新は Δ=(v-old) mod 998244353 として負値を正規化する。i² や x を含む係数も乗算前に法を取り、最後に 2 の逆元を掛ける。

## 復習の核

- x=1,2,3 で各 A_i の寄与回数を手計算して展開式を再導出し、値を小さくする代入で負になる差分も直接再計算と照合する。

## 計算量と制約

### 時間

O(N+Q log N)、三moment Fenwick。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times10^5; 1 \leq Q \leq 2\times10^5; 0 \leq A_i \leq 10^9; 1 \leq x \leq N; 0 \leq v \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2,3)、x=3。

1. B=(1,3,6)、C=(1,4,10)、D=(1,5,15)。
2. 重みは6,3,1で1·6+2·3+3·1=15。

期待される結果: D_3=15。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A_2を4へ更新するとD_3はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

差分2に位置2の重み3を掛けて+6、答え21。三momentへ同じ差分を各重み付きで反映する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/editorial/4131) — source-abc256-editorial-4131-5a56cfc1385cccb66caaa609b059936e87f87c1a1fe818c7857a8646d481623a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/tasks/abc256_f) — source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965
