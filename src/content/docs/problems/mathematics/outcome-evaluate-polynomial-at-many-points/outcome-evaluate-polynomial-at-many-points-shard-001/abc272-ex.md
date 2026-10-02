---
title: "ABC272-EX — Flipping Coins 2"
draft: true
authoringUnit: {"problemId":"abc272-ex","docPath":"src/content/docs/problems/mathematics/outcome-evaluate-polynomial-at-many-points/outcome-evaluate-polynomial-at-many-points-shard-001/abc272-ex.md","learningOutcomeIds":["outcome-evaluate-polynomial-at-many-points","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-formal-power-series","unit-inclusion-exclusion","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-functions","tag-polynomial-multipoint-evaluation","tag-combinatorial-coefficients","tag-convolution","tag-inclusion-exclusion","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc272-ex-problem-13a1b5608d7d4c4ef6a93585f42563a31743bd693135ae3e339b3dbcbf3657ba","source-abc272-editorial-4963-2fab3266c32ba5ad324a1e421e6f7965abecb00b9e8fbd6bf7be0ce24b25d477"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"rotation対称性で一枚の上向き確率をN倍すればよい。指定L条件の成立総数G(L)はexact成立数F(K)をC(K,L)で重み付けした二項変換である。g=f e^xへの変換でDPの微分作用が(j+C_i)の乗算へ対角化されるため、その積の多点評価とe^{−x}畳み込みが元DPを復元する。最後の二項反転でFを得て奇数回flipの重みだけ足す。","sourceRevisionIds":["source-abc272-ex-problem-13a1b5608d7d4c4ef6a93585f42563a31743bd693135ae3e339b3dbcbf3657ba","source-abc272-editorial-4963-2fab3266c32ba5ad324a1e421e6f7965abecb00b9e8fbd6bf7be0ce24b25d477"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-evaluate-polynomial-at-many-points","outcome-encode-counting-by-generating-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"変換の小例として成立数分布F(0)=1,F(1)=2,F(2)=1。","procedure":["G(0)=1+2+1=4、G(1)=2+2=4、G(2)=1。","逆にF(2)=1,F(1)=4−2=2,F(0)=4−2−1=1。"],"executionTarget":null,"expectedResult":"奇数回の確率は2/4=1/2。","verificationStatus":"not_applicable","learningUnitIds":["unit-polynomial-multipoint-evaluation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-evaluate-polynomial-at-many-points","outcome-encode-counting-by-generating-function"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-formal-power-series","unit-inclusion-exclusion","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"attainmentCondition":"G(1)/G(0)をそのまま上向き確率とできるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"exact分布への反転が必要。"},"answer":{"reasoningOrVerification":"G(1)は成立回数Kの重み付き総数で、Kが偶数のcaseも含む。例では4/4=1になるが正しくは1/2。","procedure":["具体例の各状態・寄与を再計算する。","G(1)は成立回数Kの重み付き総数で、Kが偶数のcaseも含む。例では4/4=1になるが正しくは1/2。"],"expectedResult":"exact分布への反転が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [多項式の多点評価・補間](src/content/docs/learn/combinatorics-algebra/polynomial-multipoint-evaluation.md)

- 任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [FPS基本演算と多項式の多点評価を行う](src/content/docs/learn/combinatorics-algebra/formal-power-series.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 多項式の多点評価・補間の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

rotation symmetryにより全coinのface-up probabilityは等しく、期待face-up数はN倍のcoin N−1がface upである確率でよい。

coin N−1をflipするassignment数Kの分布F(K)を直接数える代わりに、L個の指定条件を満たす総数G(L)を数えると G(L)=Σ_{K≥L}C(K,L)F(K) というbinomial transformになる。

棄却する候補: 条件を満たすindex数を状態にするpermutation DPでG(0),…,G(N)を求める。

dp[i][j]の全遷移がO(N^2)となりN=20万を扱えない。

採用する候補: DP generating functionへe^xを掛けてderivative termを対角化し、積polynomial h(x)=∏(x+C_i)を整数点0,…,Nでmultipoint evaluationする。

N個のDP stepがh(j)の一括評価へ変わり、subproduct treeとNTTでO(N log^2 N)にできる。

indexを反転したDPの母関数f_iは f_i=x(f_{i−1}+f'_{i−1})+C_i f_{i−1} を満たし、g_i=f_i e^xなら係数ごとに g_{i,j}=(j+C_i)g_{i−1,j} と分離する。

h(j)=∏_i(j+C_i)を全jで得た後、e^{-x}とのconvolutionでf_NとGを戻し、もう一度exponential generating-functionのbinomial inversionでFを復元できる。

permutation counting DPをexponential generating functionsでdiagonalizeし、product polynomialのmultipoint evaluationとbinomial inversionへ変換する。

## 典型の発動条件

### 多項式の多点評価

発動条件: 一つの高次polynomialを連続する多数の点で評価すればDP coefficientsを得られるとき。

subproduct treeでh(x)=∏(x+C_i)を作り、remainder treeでh(0),…,h(N)を求める。

### 指数母関数によるbinomial変換

発動条件: 二列がΣ C(K,L)F(K)型の包含count関係を持つとき。

factorial scaling後のgenerating functionsにe^xまたはe^{-x}を掛けてGとFを相互変換する。

## 問題固有の要素

coin N−1のflip回数Kが偶数ならface upなので、復元したFのeven coefficientsを合計しN/N!倍して期待値にする。

別の問題へ持ち帰る視点: 期待個数はindicatorの線形性と対称性で一対象の分布へ縮約し、最後に対象数を掛ける。

## 正当性

rotation対称性で一枚の上向き確率をN倍すればよい。指定L条件の成立総数G(L)はexact成立数F(K)をC(K,L)で重み付けした二項変換である。g=f e^xへの変換でDPの微分作用が(j+C_i)の乗算へ対角化されるため、その積の多点評価とe^{−x}畳み込みが元DPを復元する。最後の二項反転でFを得て奇数回flipの重みだけ足す。

## 実装上の注意

- AをsortしてB_i=N−1−A_iとC_i=N−B_i+1−iを同じ0/1-based規約で作り、DP式のoff-by-oneを避ける。
- factorial・inverse factorialとe^{±x}の係数符号を揃え、各polynomialを必要次数Nでtruncateする。

## 復習の核

- 全要素が回転対称なら期待値の線形性で一要素のevent-count distributionへ落とす。
- derivativeを含むpolynomial DPはe^xを掛ける積の微分で係数ごとに独立化できないか試す。

## 計算量と制約

### 時間

O(N log²N)。一次因子積の多点評価と二回の二項反転を高速多項式演算で行う。

### 空間

O(N log N)の積木保持。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N\leq 2\times 10^5; 0\leq A_i \leq N-1; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

変換の小例として成立数分布F(0)=1,F(1)=2,F(2)=1。

1. G(0)=1+2+1=4、G(1)=2+2=4、G(2)=1。
2. 逆にF(2)=1,F(1)=4−2=2,F(0)=4−2−1=1。

期待される結果: 奇数回の確率は2/4=1/2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

G(1)/G(0)をそのまま上向き確率とできるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

G(1)は成立回数Kの重み付き総数で、Kが偶数のcaseも含む。例では4/4=1になるが正しくは1/2。

確認結果: exact分布への反転が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/tasks/abc272_h) — source-abc272-ex-problem-13a1b5608d7d4c4ef6a93585f42563a31743bd693135ae3e339b3dbcbf3657ba
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/editorial/4963) — source-abc272-editorial-4963-2fab3266c32ba5ad324a1e421e6f7965abecb00b9e8fbd6bf7be0ce24b25d477
