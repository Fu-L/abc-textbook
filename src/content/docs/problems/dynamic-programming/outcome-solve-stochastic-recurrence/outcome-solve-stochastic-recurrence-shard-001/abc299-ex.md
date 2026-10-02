---
title: "ABC299-EX — Dice Sum Infinity"
draft: true
authoringUnit: {"problemId":"abc299-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc299-ex.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-linear-recurrence","unit-linear-system-rank","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-linear-recurrence-matrix","tag-linear-system-rank","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc299-editorial-6260-65b8d99af67681a1820012f1d17b9df647e78d51e1826d273df53aa9871b6ba6","source-abc299-ex-problem-32f2b01f495d613cb5a4fd47805f94440359d726706a4732dbfa27c6093fc516"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一周期内の到達・overshoot補助過程は、残距離rから六つの残距離r−1..r−6へ等確率で移る。従って期待歩数とovershoot各確率は直前六項の線形漸化式を満たし、行列累乗はその一歩ずつの更新と等価である。周期を跨いだovershootごとに次周期の残差状態を接続すると、真の停止条件である和≡R mod10^9に対する六状態の期待値方程式になる。有限のmod状態の連鎖は停止点へ到達でき、期待値方程式の解が一意なので、その連立解が全体の期待停止回数である。","sourceRevisionIds":["source-abc299-editorial-6260-65b8d99af67681a1820012f1d17b9df647e78d51e1826d273df53aa9871b6ba6","source-abc299-ex-problem-32f2b01f495d613cb5a4fd47805f94440359d726706a4732dbfa27c6093fc516"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"一周期補助過程の残距離r=1、標準6面die。","procedure":["一回で必ず到達または超過するので補助期待回数1。","残距離0,−1,…,−5へ各確率1/6。"],"executionTarget":null,"expectedResult":"補助e(1)=1、六overshoot確率は全て1/6。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-stochastic"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"prerequisiteIds":["unit-dp-state-design","unit-linear-recurrence","unit-linear-system-rank","unit-modular-arithmetic"],"attainmentCondition":"全体でも超過したら停止するのか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"全体は和≡R mod10⁹に達した時だけ停止。超過を次周期の残差状態へ接続し、補助期待値を最終期待値と混同しない。"},"answer":{"reasoningOrVerification":"全体は和≡R mod10⁹に達した時だけ停止。超過を次周期の残差状態へ接続し、補助期待値を最終期待値と混同しない。","procedure":["具体例の各状態・寄与を再計算する。","全体は和≡R mod10⁹に達した時だけ停止。超過を次周期の残差状態へ接続し、補助期待値を最終期待値と混同しない。"],"expectedResult":"全体は和≡R mod10⁹に達した時だけ停止。超過を次周期の残差状態へ接続し、補助期待値を最終期待値と混同しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)
- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

閾値を10^9周期で越えるたび残差状態はovershootの6通りだけなので、無限に続く過程を6状態の期待値方程式へ閉じられる。

採用する候補: 6残差の連立方程式と線形漸化式高速化

有限距離rの停止期待値・overshoot分布を高速累乗で求め、周期を跨いだ後のE_1..E_6へ接続して定数サイズ連立を解ける。

棄却する候補: 期待値DPを0..Rで逐次計算

Rは10^9で線形時間が間に合わない。

一周期到達問題e(r),p_i(r)はいずれも直前6項だけに依存する線形漸化式で、行列累乗によりO(log r)で評価できる。

残りrを0以下にする通常dice過程の期待回数とovershoot0..-5確率を遷移行列累乗で求める。それらから周期残差E_1..E_6の6元一次方程式を作って解き、R-6からの式へ代入する。

## 典型の発動条件

### 有限Markov renewal

発動条件: 大きな周期閾値を越えると少数のovershoot状態へ再生する。

一周期の到達時間と出口分布から残差期待値方程式を作る。

### 線形漸化式の行列累乗

発動条件: 固定幅dice recurrenceを巨大indexで評価する。

状態ベクトルを高速累乗する。

## 問題固有の要素

mod 10^9の停止条件は巨大でも、dice最大目6が周期境界の情報を6残差へ圧縮する。

別の問題へ持ち帰る視点: 周期境界を跨ぐ確率過程はovershoot幅を状態にする。

## 正当性

一周期内の到達・overshoot補助過程は、残距離rから六つの残距離r−1..r−6へ等確率で移る。従って期待歩数とovershoot各確率は直前六項の線形漸化式を満たし、行列累乗はその一歩ずつの更新と等価である。周期を跨いだovershootごとに次周期の残差状態を接続すると、真の停止条件である和≡R mod10^9に対する六状態の期待値方程式になる。有限のmod状態の連鎖は停止点へ到達でき、期待値方程式の解が一意なので、その連立解が全体の期待停止回数である。

## 実装上の注意

- R-6≤0の基底とovershoot添字を揃え、法998244353上でpivot非零を確認しながらGauss消去する。

## 復習の核

- 小周期へ縮小した逐次DP/連立方程式と比較し、R=1..6相当境界と各overshoot確率総和1を確認する。

## 計算量と制約

### 時間

O(log 10⁹)、6〜7次の固定行列累乗と6元方程式。

### 空間

O(1)、固定次元行列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0\lt R\lt10^9; R is an integer.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

一周期補助過程の残距離r=1、標準6面die。

1. 一回で必ず到達または超過するので補助期待回数1。
2. 残距離0,−1,…,−5へ各確率1/6。

期待される結果: 補助e(1)=1、六overshoot確率は全て1/6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全体でも超過したら停止するのか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

全体は和≡R mod10⁹に達した時だけ停止。超過を次周期の残差状態へ接続し、補助期待値を最終期待値と混同しない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/editorial/6260) — source-abc299-editorial-6260-65b8d99af67681a1820012f1d17b9df647e78d51e1826d273df53aa9871b6ba6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/tasks/abc299_h) — source-abc299-ex-problem-32f2b01f495d613cb5a4fd47805f94440359d726706a4732dbfa27c6093fc516
