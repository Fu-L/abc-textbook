---
title: "ABC409-G — Accumulation of Wealth"
draft: true
authoringUnit: {"problemId":"abc409-g","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc409-g.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution","tag-generating-functions","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc409-editorial-13172-94a5ce9a66c66c0e47a1f1ccd42c3ded3ae66f20724269ca333de29f7e25d7a5","source-abc409-g-problem-27228e15fe52a148b2a9dc3940e8a705c69f0551673efb01f45c4297f1c6ffcf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"kの初登場時刻を固定すると以前の新値追加数はk−2で、二項確率により初登場確率が決まる。以後の一stepの期待増分は(1−p)c/nなので、条件付き期待数は共通倍率fへ独立に分離できる。その時刻和を階乗で正規化するとF*Gの係数になり、外側p冪を掛けてE_kを得る。全個数の和NからE_1を戻す保存則も成立する。","sourceRevisionIds":["source-abc409-editorial-13172-94a5ce9a66c66c0e47a1f1ccd42c3ded3ae66f20724269ca333de29f7e25d7a5","source-abc409-g-problem-27228e15fe52a148b2a9dc3940e8a705c69f0551673efb01f45c4297f1c6ffcf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、P=50%。","procedure":["F=(1,5/4)、G=(1,1/2)なので係数1は7/4。","E_2=(1/2)(7/4)=7/8、E_3=(1/2)²=1/4。","E_1=3−7/8−1/4=15/8。"],"executionTarget":null,"expectedResult":"(15/8,7/8,1/4)、総和3。","verificationStatus":"not_applicable","learningUnitIds":["unit-polynomial-convolution"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compute-convolution-or-correlation","outcome-encode-counting-by-generating-function"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-dp-stochastic","unit-modular-arithmetic"],"attainmentCondition":"P=100%なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"全E_k=1。"},"answer":{"reasoningOrVerification":"毎回新値を追加するので1..Nが各一個。既存値の倍率は1。","procedure":["具体例の各状態・寄与を再計算する。","毎回新値を追加するので1..Nが各一個。既存値の倍率は1。"],"expectedResult":"全E_k=1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

k≥2 が操作 i で初登場するには、それ以前 i-1 回で新値追加が k-2 回、i 回目も新値追加であり、その確率は二項係数と p^{k-1}(1-p)^{i-k+1} で表せる。

k が一個存在し列長 n のとき、既存値を選ぶ操作による期待増分は (1-p)c/n。したがって以後の期待個数は現在個数へ (n+1-p)/n を掛ける形で、初登場時刻だけに依存する。

採用する候補: 初登場時刻で条件付けた E_k の和を factorial 形へ変形し、全 k の和を二多項式の convolution の係数として一括計算する

成長係数 f(j) と (1-p)^i/i! を前計算すると、E_k は p^{k-1}/(k-2)! 倍の一つの積係数になり、O(N log N) で全期待値を得られる。

棄却する候補: 各 k と各初登場時刻 i の二重loopで期待値公式を直接加算する

各項は O(1) でも総和 O(N^2) となり N=10^5 に間に合わない。

f(0)=1、f(x)=f(x-1)(N-x+1-p)/(N-x) として、初登場後 x 回の preferential attachment による期待倍率を O(N) で列挙できる。

F_j=f(j)(N-j-2)!、G_i=(1-p)^i/i! と置けば、k≥2 の内側の和は [x^{N-k}]F(x)G(x) になり、k の違いは読む係数と外側係数だけである。

mod 998244353 上で p=P/100、factorial・inverse factorial・p の累乗と f を前計算する。F(x)=Σ_{j=0}^{N-2}f(j)(N-j-2)!x^j、G(x)=Σ_{i=0}^{N-2}(1-p)^i/i!x^i を convolution し、E_k=p^{k-1}/(k-2)!·coef[N-k] を k=2..N で得る。E_1=N-Σ_{k=2}^N E_k とする。

## 典型の発動条件

### 初登場時刻による条件付け

発動条件: 種類 k の出現と、その後の対称な増殖過程を分けて期待値を求めるとき。

k が初めて追加される操作を列挙し、残期間の期待倍率 f を掛ける。

### 期待値の乗法漸化式

発動条件: 個数 c の次step期待値が c の定数倍になる reinforced process のとき。

列長 n ごとの倍率 (n+1-p)/n を前計算する。

### 生成関数と convolution

発動条件: 全 k に対する Σ_i a_i b_{N-k-i} 型の和を同時に求めるとき。

factorial を係数へ吸収して二多項式積の係数として読む。

## 問題固有の要素

新番号の生成確率と、生成後に出現頻度比例で選ばれる成長を分離すると、番号 k に依らない成長 kernel が現れて畳み込める。

別の問題へ持ち帰る視点: 全種類の期待値で birth time の和がずれて現れる場合、birth 分布と age-dependent 成長率を convolution にできないか調べる。

## 正当性

kの初登場時刻を固定すると以前の新値追加数はk−2で、二項確率により初登場確率が決まる。以後の一stepの期待増分は(1−p)c/nなので、条件付き期待数は共通倍率fへ独立に分離できる。その時刻和を階乗で正規化するとF*Gの係数になり、外側p冪を掛けてE_kを得る。全個数の和NからE_1を戻す保存則も成立する。

## 実装上の注意

- p=0,1 を含め mod 値として扱い、分母 1..N は法と互いに素である。F の factorial 添字 N-j-2、係数 N-k、k=1 の保存則による計算をずらさない。

## 復習の核

- P=0ならE_1=N、P=100なら全E_k=1、N=2,3 の全操作列を列挙し、期待個数の総和が常にNになることも確認する。

## 計算量と制約

### 時間

O(N log N)。初登場後倍率と二項確率をNTT畳み込みにする。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 0 \leq P \leq 100; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、P=50%。

1. F=(1,5/4)、G=(1,1/2)なので係数1は7/4。
2. E_2=(1/2)(7/4)=7/8、E_3=(1/2)²=1/4。
3. E_1=3−7/8−1/4=15/8。

期待される結果: (15/8,7/8,1/4)、総和3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

P=100%なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

毎回新値を追加するので1..Nが各一個。既存値の倍率は1。

確認結果: 全E_k=1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc409/editorial/13172) — source-abc409-editorial-13172-94a5ce9a66c66c0e47a1f1ccd42c3ded3ae66f20724269ca333de29f7e25d7a5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc409/tasks/abc409_g) — source-abc409-g-problem-27228e15fe52a148b2a9dc3940e8a705c69f0551673efb01f45c4297f1c6ffcf
