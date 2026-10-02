---
title: "ABC298-E — Unfair Sugoroku"
draft: true
authoringUnit: {"problemId":"abc298-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc298-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc298-e-problem-5852dc6c338f2ccff6bd2385849a81c0ee563b813396f416b99683e1127bd9ff","source-abc298-editorial-6216-3e17008c42c2f5d640bcceb6616609643f0d97853747e55e48acc61dac404c8a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各手番で全dice遷移先の勝率を平均する。先にgoalした側の勝敗は確定し、非終端遷移は少なくとも一位置が増えるから降順の二位置で依存先を先に計算できる。手番を持つことで先手優位も正確に反映する。","sourceRevisionIds":["source-abc298-e-problem-5852dc6c338f2ccff6bd2385849a81c0ee563b813396f416b99683e1127bd9ff","source-abc298-editorial-6216-3e17008c42c2f5d640bcceb6616609643f0d97853747e55e48acc61dac404c8a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-propagate-probability-distribution"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3,A=B=2,P=Q=1、高橋先手。","procedure":["高橋の唯一出目1で直ちに3到着。","青木の手番は来ない。","終端勝率1。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-propagate-probability-distribution"],"prerequisiteIds":["unit-dp-state-design","unit-modular-arithmetic"],"attainmentCondition":"両者同じ位置・同diceなら勝率1/2か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一般に違う。先手が先にgoalする場合があり上例は1。"},"answer":{"reasoningOrVerification":"一般に違う。先手が先にgoalする場合があり上例は1。","procedure":["具体例の各状態・寄与を再計算する。","一般に違う。先手が先にgoalする場合があり上例は1。"],"expectedResult":"一般に違う。先手が先にgoalする場合があり上例は1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

盤面位置は各手番で増えるだけなので、両者の位置(i,j)と次手番だけを持つ勝率DPをN側から逆順に解ける。 高橋手番では遷移先勝率の平均、青木手番でも高橋勝率の平均であり、終端N到達だけ0/1に固定すればよい。

採用する候補: 手番付き二次元期待値DP

各状態の遷移先は少なくとも一方の位置が大きく、終端勝敗から後退計算できる。

棄却する候補: ゲーム木を全出目列挙

終了までの分岐が指数的。

高橋手番では遷移先勝率の平均、青木手番でも高橋勝率の平均であり、終端N到達だけ0/1に固定すればよい。

dp[i][j][turn]をi,j降順に計算し、高橋手番はk=1..P、青木手番はk=1..Qの遷移平均を法逆元で取る。dp[A][B][0]を出す。

## 典型の発動条件

### 吸収確率DP

発動条件: 単調に終端へ進む確率ゲーム。

終端勝敗を固定し遷移確率の加重平均を逆順計算する。

## 問題固有の要素

交互手番もturnを一状態追加するだけで、位置単調性が循環のない期待値方程式にする。

別の問題へ持ち帰る視点: 単調確率過程は状態順序を見つけてDPする。

## 正当性

各手番で全dice遷移先の勝率を平均する。先にgoalした側の勝敗は確定し、非終端遷移は少なくとも一位置が増えるから降順の二位置で依存先を先に計算できる。手番を持つことで先手優位も正確に反映する。

## 実装上の注意

- min(i+k,N)でovershootをNへ止め、高橋が既にNなら1、青木がNなら0の基底優先度を統一する。

## 復習の核

- 小Nの連立/全確率展開と比較し、P,Q=1、開始点隣接、同一roundで両者が届き得る例を確認する。

## 計算量と制約

### 時間

終点N、dice面数P,Q。二位置手番状態 O(N²(P+Q))。

### 空間

位置pair×turn O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 100; 1 \leq A, B < N; 1 \leq P, Q \leq 10; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3,A=B=2,P=Q=1、高橋先手。

1. 高橋の唯一出目1で直ちに3到着。
2. 青木の手番は来ない。
3. 終端勝率1。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

両者同じ位置・同diceなら勝率1/2か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一般に違う。先手が先にgoalする場合があり上例は1。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/tasks/abc298_e) — source-abc298-e-problem-5852dc6c338f2ccff6bd2385849a81c0ee563b813396f416b99683e1127bd9ff
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/editorial/6216) — source-abc298-editorial-6216-3e17008c42c2f5d640bcceb6616609643f0d97853747e55e48acc61dac404c8a
