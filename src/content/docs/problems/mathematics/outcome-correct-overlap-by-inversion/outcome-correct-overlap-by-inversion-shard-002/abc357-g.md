---
title: "ABC357-G — Stair-like Grid"
draft: true
authoringUnit: {"problemId":"abc357-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc357-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-compute-online-relaxed-convolution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-relaxed-convolution","tag-combinatorial-coefficients","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc357-editorial-10179-6ee21b6ab16f35a854bce875f0abbc9f40ed38233e4cb1f9f4f40a634ef45b06","source-abc357-g-problem-5e7319708b23faaeb5d7dad6022dc6e5aa4cc5268b0249022bbd607aa38d484f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"任意の禁止wallを通るpathは最初に通るwallを一意に持つ。そのwallまでの既に補正済み寄与を終点までの自由path数で延ばし引けば、禁止wallを通る全pathを一度除ける。規則境界wallは本来grid外へ出るpathだけを表し、差kernelのCDQ畳み込みは同じ補正和を因果順に計算するため、通常のwall DPと結果が一致する。","sourceRevisionIds":["source-abc357-editorial-10179-6ee21b6ab16f35a854bce875f0abbc9f40ed38233e4cb1f9f4f40a634ef45b06","source-abc357-g-problem-5e7319708b23faaeb5d7dad6022dc6e5aa4cc5268b0249022bbd607aa38d484f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-compute-online-relaxed-convolution"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、実wallなし。","procedure":["この場合gridは2×2。","右→下、下→右の二つの最短path。"],"executionTarget":null,"expectedResult":"2。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-compute-online-relaxed-convolution"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"attainmentCondition":"wallを始点や終点と同じ座標で二重に置いてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"重複wallは統合。"},"answer":{"reasoningOrVerification":"同じ禁止点を二度補正すると再帰の意味が崩れる。座標重複とtopological tieを整理し、到達不能な点対はkernel0とする。","procedure":["具体例の各状態・寄与を再計算する。","同じ禁止点を二度補正すると再帰の意味が崩れる。座標重複とtopological tieを整理し、到達不能な点対はkernel0とする。"],"expectedResult":"重複wallは統合。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- 係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

階段形gridは N×N gridに、各段差の直外側へ O(N) 個の追加wallを置いた最短path問題として埋め込める。wall回避数え上げはtopological順の包除DPになる。

入力wallはM≤50なので愚直遷移できるが、規則的追加wall同士の O(N²) 遷移だけが障害で、そのpath数はindex差だけの二項係数kernelになる。

採用する候補: 規則wall間の包除DPをCDQ divide-and-conquer convolution/NTTで処理し、少数入力wallとの遷移だけ直接計算する。

translation invariantなkernel部分を O(N log²N)、例外M点を O(M(N+M)) に分離できる。

棄却する候補: 階段gridの全マスへ通常の右下DPを行う。

grid面積がΘ(N²)で N=2.5×10^5 のため、壁が少なくても走査不能である。

wall w_iへ到達するpathから以前のwallを最後に通るものを引く dp_i=−Σ_{j<i}g(w_j,w_i)dp_j により、全wall回避pathを包除の部分集合列挙なしで得る。

二列の規則wall w_{t,1},w_{t,2} 間の g は t差に応じた四種類のcombinationで、2×2 convolutionとしてblock間へ一括加算できる。

始点・終点、M個の実wall、階段境界を表す二系列の仮wallをtopological順に置く。combinationでg(a,b)を O(1) 評価し、実wallを含む遷移は直接加算する。仮wall系列間はCDQで左halfの確定dpと差kernelをNTT畳み込みし右halfへ反映する。終点dpの符号を直して答える。

## 典型の発動条件

### 障害物grid pathの包除DP

発動条件: 右下移動pathを少数wallを避けて数え、点間path数が組合せで得られるとき。

topological順に「最初/最後のwall」を課金して到達数を引く。

### CDQ convolution

発動条件: online DP遷移が index差だけのkernelとの畳み込みで、左から値が確定するとき。

分割統治で左block→右block寄与をFFT/NTTでまとめる。

## 問題固有の要素

巨大な欠けたgridを埋込むとwall数もO(N)になるが、その大半が規則列なので「少数例外＋畳み込みkernel」として扱える。

別の問題へ持ち帰る視点: 巨大形状DPでは境界を障害物列へ変え、規則部分のtranslation invarianceを探す。

## 正当性

任意の禁止wallを通るpathは最初に通るwallを一意に持つ。そのwallまでの既に補正済み寄与を終点までの自由path数で延ばし引けば、禁止wallを通る全pathを一度除ける。規則境界wallは本来grid外へ出るpathだけを表し、差kernelのCDQ畳み込みは同じ補正和を因果順に計算するため、通常のwall DPと結果が一致する。

## 実装上の注意

- 到達不能な点対はg=0にし、同じ座標wallやtopological tieを整理する。四kernelのrow type対応とdpの負符号を固定する。

## 復習の核

- まずO(|S|²)のwall包除式を正しく導いてから規則wallだけを切り出す。kernelが本当にi−jだけに依存するか四typeすべて確認する。

## 計算量と制約

### 時間

O(N log²N+MN+M²)。規則wall間はCDQ畳み込み、実wallとの遷移は直接計算する。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2.5 \times 10^5; N is even.; 0 \leq M \leq 50; 1 \leq a_i \leq N; 1 \leq b_i \leq \left \lceil \frac{a_i}{2} \right \rceil \times 2; (a_i, b_i) \neq (1, 1) and (a_i, b_i) \neq (N, N).; (a_i, b_i) \neq (a_j, b_j) if i \neq j.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、実wallなし。

1. この場合gridは2×2。
2. 右→下、下→右の二つの最短path。

期待される結果: 2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

wallを始点や終点と同じ座標で二重に置いてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じ禁止点を二度補正すると再帰の意味が崩れる。座標重複とtopological tieを整理し、到達不能な点対はkernel0とする。

確認結果: 重複wallは統合。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/editorial/10179) — source-abc357-editorial-10179-6ee21b6ab16f35a854bce875f0abbc9f40ed38233e4cb1f9f4f40a634ef45b06
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc357/tasks/abc357_g) — source-abc357-g-problem-5e7319708b23faaeb5d7dad6022dc6e5aa4cc5268b0249022bbd607aa38d484f
