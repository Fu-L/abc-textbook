---
title: "ABC293-E — Geometric Progression"
draft: true
authoringUnit: {"problemId":"abc293-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-accelerate-fixed-linear-transition/outcome-accelerate-fixed-linear-transition-shard-001/abc293-e.md","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["一般のDP遷移の区間集約・単調最適化。"],"tagIds":["tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc293-e-problem-34dffe16b25f63d64a14ea0e51c23a469f311873f2c9f9d6402e85cde91a89d3","source-abc293-editorial-5955-af80e9c73937033b345abba821c9c5a5e318dbbda9ef3aa34d15aa0e121cc6d3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"f(n+1)=Af(n)+1、f(0)=0 は幾何和に一致する。定数1を添えたvectorへの行列作用はこのaffine更新と同じで、行列積は操作合成に一致する。二分累乗でX回合成した第一成分が答え。法M上でも除算を用いないので合成数とA=1を扱える。","sourceRevisionIds":["source-abc293-e-problem-34dffe16b25f63d64a14ea0e51c23a469f311873f2c9f9d6402e85cde91a89d3","source-abc293-editorial-5955-af80e9c73937033b345abba821c9c5a5e318dbbda9ef3aa34d15aa0e121cc6d3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=3,X=4,M=20。","procedure":["fは0→1→4→13→40。","最後を法20へ落とす。","直接和1+3+9+27=40も一致。"],"executionTarget":null,"expectedResult":"0","verificationStatus":"not_applicable","learningUnitIds":["unit-linear-recurrence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"A=1,M=8,X=5で(A^X−1)/(A−1)を使えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"分母0で不可。affine更新なら毎回1を加え答え5。"},"answer":{"reasoningOrVerification":"分母0で不可。affine更新なら毎回1を加え答え5。","procedure":["具体例の各状態・寄与を再計算する。","分母0で不可。affine更新なら毎回1を加え答え5。"],"expectedResult":"分母0で不可。affine更新なら毎回1を加え答え5。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 一般のDP遷移の区間集約・単調最適化。

## 考察

等比和a_n=Σ_(i=0)^(n-1)A^iはa_(n+1)=A a_n+1という一次アフィン漸化式を満たす。 状態(a_n,1)へ行列[[A,1],[0,1]]を掛けると、除算なしで和と冪を同時に合成できる。

採用する候補: 2×2行列の高速累乗

アフィン更新を線形化すれば合成を法M上で安全に繰り返し二乗できる。

棄却する候補: (A^X-1)/(A-1)を法上で割る

Mは素数とは限らずA-1の逆元が存在しない場合がある。

状態(a_n,1)へ行列[[A,1],[0,1]]を掛けると、除算なしで和と冪を同時に合成できる。

遷移行列を法MでX乗し、初期ベクトル(0,1)へ作用させた第一成分を出力する。

## 典型の発動条件

### アフィン変換の行列化

発動条件: 定数項付き漸化式を巨大回反復する。

定数1を状態へ加え2×2行列として累乗する。

## 問題固有の要素

閉形式の割り算が危険な合成数modでも、漸化式の合成なら加減乗だけで完結する。

別の問題へ持ち帰る視点: 法上の逆元が保証されない等比和は行列・doublingで求める。

## 正当性

f(n+1)=Af(n)+1、f(0)=0 は幾何和に一致する。定数1を添えたvectorへの行列作用はこのaffine更新と同じで、行列積は操作合成に一致する。二分累乗でX回合成した第一成分が答え。法M上でも除算を用いないので合成数とA=1を扱える。

## 実装上の注意

- 全乗算を都度mod Mし、X=1、M=1、A=1でも同じ式で処理する。

## 復習の核

- 直接和を作れる小Xと比較し、A=1、Mが合成数、A-1とMが非互いに素な例を確認する。

## 計算量と制約

### 時間

指数Xのbit数分の2×2行列積で O(log(X+1))。

### 空間

2×2行列を数個保持して O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq A, M \leq 10^9; 1 \leq X \leq 10^{12}; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=3,X=4,M=20。

1. fは0→1→4→13→40。
2. 最後を法20へ落とす。
3. 直接和1+3+9+27=40も一致。

期待される結果: 0

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A=1,M=8,X=5で(A^X−1)/(A−1)を使えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

分母0で不可。affine更新なら毎回1を加え答え5。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/tasks/abc293_e) — source-abc293-e-problem-34dffe16b25f63d64a14ea0e51c23a469f311873f2c9f9d6402e85cde91a89d3
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/editorial/5955) — source-abc293-editorial-5955-af80e9c73937033b345abba821c9c5a5e318dbbda9ef3aa34d15aa0e121cc6d3
