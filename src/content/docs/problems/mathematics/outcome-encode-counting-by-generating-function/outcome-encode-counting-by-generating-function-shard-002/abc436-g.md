---
title: "ABC436-G — Linear Inequation"
draft: true
authoringUnit: {"problemId":"abc436-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc436-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-transition-optimization"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc436-editorial-14748-d9d1d8c863414f6d5468cf6b316754d131fd18addc8995826a59796ad00276b3","source-abc436-g-problem-b283eaa6b2ba6c8af928d4ea6f1f3ad1b43b6d4dd7ca5183d4e02adfeec2f278"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"X=dQ+Rは各成分で一意の桁分解で、A·X≤MはA·Q≤floor((M−A·R)/d)と同値。従って桁重み分布Sの頻度付き再帰は全Xを一度分類する。係数列へ転置した畳み込み・d個集約はこの再帰の線形和を保存し、最大添字が0に落ちると負上限のfは0、f(0)=1だから係数c_0が答えになる。","sourceRevisionIds":["source-abc436-editorial-14748-d9d1d8c863414f6d5468cf6b316754d131fd18addc8995826a59796ad00276b3","source-abc436-g-problem-b283eaa6b2ba6c8af928d4ea6f1f3ad1b43b6d4dd7ca5183d4e02adfeec2f278"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,3)、M=6。","procedure":["x=0でy=0,1,2の3個。x=1でy=0,1の2個。","x=2,3でy=0を各1個。"],"executionTarget":null,"expectedResult":"7vector。","verificationStatus":"not_applicable","learningUnitIds":["unit-generating-functions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-dp-transition-optimization"],"attainmentCondition":"M−s=−1,d=2の再帰上限を0へ丸めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"floor(−1/2)=−1。"},"answer":{"reasoningOrVerification":"数学的floorは−1で解0。0方向丸めで0にすると全ゼロQを誤って一つ数える。","procedure":["具体例の各状態・寄与を再計算する。","数学的floorは−1で解0。0方向丸めで0にすると全ゼロQを誤って一つ数える。"],"expectedResult":"floor(−1/2)=−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

求める f(A,M) は非負整数ベクトル X で A·X≤M となる個数である。各 X_i を基数 d で X=dQ+R、0≤R_i<d と一意分解すると、下位桁 R の重み和分布を介した再帰になる。

採用する候補: 係数列 c_i による線形結合 Σc_i f(A,i) をまとめて基数 d 変換し、畳み込みで添字幅を保ちながら O(log_d M) 回縮約する。

最大非零添字が各回 1/d 以下になり、係数列の幅は O(dΣA) に抑えられるため高速畳み込みが使える。

棄却する候補: X_1,…,X_N を上限内で再帰列挙する通常の多次元 DP を行う。

M や変数数に対して状態・遷移が大きく、巨大な上限を直接扱えない。

R 全体の多重集合 S={A·R} に対して f(A,M)=Σ_{s∈S}f(A,⌊(M-s)/d⌋) が成り立つ。

Σ_i c_i f(A,i) を変換すると新係数は c'_q=Σ_{j=0}^{d-1}Σ_{s∈S}c_{dq+j+s} であり、S の頻度列との convolution と d 個ごとの集約で計算できる。

開始係数 c_M=1 を反復変換し、非零添字が 0 以下だけになれば f(A,i<0)=0,f(A,0)=1 より答えは c_0 になる。

小さな d を選び、各 i の R_i∈[0,d) による A_iR_i の分布を多項式積で作って S の頻度を得る。係数列 c を一点 M で初期化し、S との畳み込みと residue block 集約で c' を作る操作を最大添字が 0 になるまで繰り返し、c[0] を出力する。

## 典型の発動条件

### 基数分解による再帰

発動条件: 非負整数変数の重み付き不等式で上限 M が非常に大きいとき。

各変数を quotient と digit に分け、上限を 1/d へ縮める再帰式を作る。

### 線形結合の係数遷移

発動条件: 同じ再帰関数 f の多数の引数評価を個別に展開すると重複が大きいとき。

Σc_i f(i) 全体を一度に次の係数列へ移し、最終的な基底値だけ読む。

### 多項式畳み込み

発動条件: 独立な digit の重み和分布や係数列との shift 和を高速に求めるとき。

各 R_i の生成多項式を積み、変換式の Σ_s を convolution で処理する。

## 問題固有の要素

巨大上限の格子点計数を、全変数の下位桁分布と上位桁の同型問題へ分解する。

別の問題へ持ち帰る視点: 再帰値の集合を直接 memoize せず、必要評価の係数分布を逆向きに伝播すると添字範囲を制御できる。

## 正当性

X=dQ+Rは各成分で一意の桁分解で、A·X≤MはA·Q≤floor((M−A·R)/d)と同値。従って桁重み分布Sの頻度付き再帰は全Xを一度分類する。係数列へ転置した畳み込み・d個集約はこの再帰の線形和を保存し、最大添字が0に落ちると負上限のfは0、f(0)=1だから係数c_0が答えになる。

## 実装上の注意

- 負添字を含む係数配列の offset を明示し、floor 除算を数学的な床として扱う。畳み込み後の d 個区間和と添字反転を式どおりに実装する。

## 復習の核

- c'_q の添字式を小さな d,N で愚直比較し、反復終了時に負添字寄与が f=0 として消えることを確認する。

## 計算量と制約

### 時間

O(H log H·log_d M+構築費)、H=(d−1)ΣA_i+1。固定dで桁分布と帯域係数をNTT更新する。

### 空間

O(H+N)。巨大Mはoffsetで保持しM長配列を作らない。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le100; 1\le A _ i\le100\ (1\le i\le N); 1\le M\le10 ^ {18}; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,3)、M=6。

1. x=0でy=0,1,2の3個。x=1でy=0,1の2個。
2. x=2,3でy=0を各1個。

期待される結果: 7vector。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

M−s=−1,d=2の再帰上限を0へ丸めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

数学的floorは−1で解0。0方向丸めで0にすると全ゼロQを誤って一つ数える。

確認結果: floor(−1/2)=−1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/editorial/14748) — source-abc436-editorial-14748-d9d1d8c863414f6d5468cf6b316754d131fd18addc8995826a59796ad00276b3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/tasks/abc436_g) — source-abc436-g-problem-b283eaa6b2ba6c8af928d4ea6f1f3ad1b43b6d4dd7ca5183d4e02adfeec2f278
