---
title: "ABC243-F — Lottery"
draft: true
authoringUnit: {"problemId":"abc243-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc243-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc243-editorial-3508-3ebd952fa347715a6423d7e9c124bee0e7408cca427b9b705bcc1d308492d16f","source-abc243-f-problem-5079ff840136d541c211c172c8a0a558b6aaef5045395c908305ee1c2788093e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"回数vectorの確率はK!Πp_i^{c_i}/c_i!。DPは種類iごとにc_iを一意に決め、正回数だけ種類数を増やすため、exactly M種の全vectorを一度足す。最後のK!が各vectorのdraw順序の多項係数を回復する。","sourceRevisionIds":["source-abc243-editorial-3508-3ebd952fa347715a6423d7e9c124bee0e7408cca427b9b705bcc1d308492d16f","source-abc243-f-problem-5079ff840136d541c211c172c8a0a558b6aaef5045395c908305ee1c2788093e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、重み(1,1)、K=2、M=2。","procedure":["異なる賞が出る列は(1,2),(2,1)。","各確率1/4なので合計1/2。"],"executionTarget":null,"expectedResult":"確率1/2。","verificationStatus":"not_applicable","learningUnitIds":["unit-combinatorial-coefficients"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"prerequisiteIds":["unit-modular-arithmetic"],"attainmentCondition":"K=2,M=3ならDPに特別な式が必要か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0。"},"answer":{"reasoningOrVerification":"二回で三種類は出ない。正回数ごとに1以上drawを消費するのでdp[3][2]は自然に0。","procedure":["具体例の各状態・寄与を再計算する。","二回で三種類は出ない。正回数ごとに1以上drawを消費するのでdp[3][2]は自然に0。"],"expectedResult":"0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

各賞 i が c_i 回出る具体的 count vector の確率は multinomial coefficient K!/∏c_i! と ∏p_i^{c_i} の積である。exactly M 種類という条件は c_i>0 の index 数だけで表せる。

K! は全 count vector に共通なので外へ出し、賞ごとの因子 p_i^{c_i}/c_i! を一種類ずつ掛ける DP にすれば、draw の並び順を直接列挙せずに済む。

採用する候補: 処理済み賞数、正の count を持つ種類数、割当済み draw 数を状態にし、次の賞へ c=0..残りを割り当てる DP を行う。

multinomial の分母と確率積が賞ごとに分離し、M 種類条件も c=0か正かで更新できる。

棄却する候補: 使用する M 種類の subset を列挙し、その subset が全て一度以上出る確率を個別に計算する。

C(N,M) が大きく、重みの異なる賞ごとに subset をまとめられない。

dp の中では順序なし count vector の重み ∏p_i^{c_i}/c_i! を足し、最後に K! を一度掛けることで全 draw sequence の multinomial 個数を復元する。

p_i=W_i/(ΣW) を法上で求め、dp[usedKinds][draws] を初期 dp[0][0]=1 とする。賞 i ごとに c=0..K-draws を試し、c=0なら種類数据え置き、c>0なら+1し、p_i^c/c! を掛ける。最後に dp[M][K]·K! を出力する。

## 典型の発動条件

### multinomial の種類別 DP

発動条件: 独立試行の結果 count と、正の count を持つカテゴリ数を同時に数えたいとき。

共通 K! を外へ出し、各カテゴリの p^c/c! を生成関数係数として畳み込む。

### 法上の確率計算

発動条件: 有理確率の分母が法と互いに素で、答えを有限体上で求めるとき。

総重みの逆元で確率を表し、階乗逆元と冪を法上で掛ける。

## 問題固有の要素

exactly M distinct は draw 順では複雑だが、count vector では非零成分数という単純な統計量になる。

別の問題へ持ち帰る視点: 反復試行の distinct 数条件では、sequence から occupancy counts へ視点を移し multinomial 重みを分離する。

## 正当性

回数vectorの確率はK!Πp_i^{c_i}/c_i!。DPは種類iごとにc_iを一意に決め、正回数だけ種類数を増やすため、exactly M種の全vectorを一度足す。最後のK!が各vectorのdraw順序の多項係数を回復する。

## 実装上の注意

- c=0 の因子は1で distinct 数を増やさない。M>K なら自然に0となり、p_i の冪と inverse factorial を K まで前計算して rolling DP を使う。

## 復習の核

- K=3で count (2,1) の並びが3通りになることを、DP 内の 1/(2!1!) と最後の3!の積から再現する。

## 計算量と制約

### 時間

O(NMK²)。賞ごとの出現回数cを列挙するrolling DP。

### 空間

O(MK+NK)。確率冪表を賞単位に作ればO(MK+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq 50; 1 \leq M \leq N \leq 50; 0 < W_i; 0 < W_1 + \ldots + W_N < 998244353; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、重み(1,1)、K=2、M=2。

1. 異なる賞が出る列は(1,2),(2,1)。
2. 各確率1/4なので合計1/2。

期待される結果: 確率1/2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

K=2,M=3ならDPに特別な式が必要か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

二回で三種類は出ない。正回数ごとに1以上drawを消費するのでdp[3][2]は自然に0。

確認結果: 0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/editorial/3508) — source-abc243-editorial-3508-3ebd952fa347715a6423d7e9c124bee0e7408cca427b9b705bcc1d308492d16f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/tasks/abc243_f) — source-abc243-f-problem-5079ff840136d541c211c172c8a0a558b6aaef5045395c908305ee1c2788093e
