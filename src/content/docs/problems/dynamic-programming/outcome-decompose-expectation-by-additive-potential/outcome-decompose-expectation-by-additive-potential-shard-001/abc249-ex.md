---
title: "ABC249-EX — Dye Color"
draft: true
authoringUnit: {"problemId":"abc249-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-decompose-expectation-by-additive-potential/outcome-decompose-expectation-by-additive-potential-shard-001/abc249-ex.md","learningOutcomeIds":["outcome-decompose-expectation-by-additive-potential"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-stochastic","unit-modular-arithmetic"],"excludedTopics":["期待値の頻度圧縮と加法的ポテンシャルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-additive-expectation-potential","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc249-editorial-3842-1c73a62788380cc97a386b0c3db2803734266f6502a71bfe6035a636488e16ec","source-abc249-ex-problem-14bb83c88176a910c2d064c647200793b0ba5d4b67377eef28589c75fae8e266"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"色cの個数J_cの一手後の分布はJ_cだけに依存する。g(0)=0を固定し、0≤j<Nについてg(j)−Σ_k P[j,k]g(k)=1/Nを課す。個数は高々一つしか増えずP[j,j+1]=(N−j)/(N2^{j+1})は法上非零なので、行jからg(j+1)を順に一意に求められる。Φ=Σ_{c=1}^N g(J_c)は非終端で一手あたり期待値が1減り、単色終端では常にg(N)になる。したがってΦ−g(N)は終端値0と期待回数のBellman式を満たす。有限状態かつ終端へ到達する確率が正なので、この解が期待停止回数である。","sourceRevisionIds":["source-abc249-editorial-3842-1c73a62788380cc97a386b0c3db2803734266f6502a71bfe6035a636488e16ec","source-abc249-ex-problem-14bb83c88176a910c2d064c647200793b0ba5d4b67377eef28589c75fae8e266"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [期待値の頻度圧縮と加法的ポテンシャル](src/content/docs/learn/dynamic-programming/additive-expectation-potential.md)

- 対称な確率過程の期待費用を頻度別関数の和へ分離し、自己ループを含む一段方程式と終端の較正から吸収までの期待費用を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 期待値の頻度圧縮と加法的ポテンシャルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

ある色が現在j個あるとき、その色の個数の次状態分布はjだけで決まり、1回の操作では増えてもj+1までである。

採用する候補: 色ごとの個数に対する加法的ポテンシャル

期待残り回数を各色の個数だけの関数の和で表すと、一色の遷移式へ分離でき、増加幅が高々1なので値を順番に決定できる。

棄却する候補: 全ての盤面状態を頂点にするマルコフ連鎖

色の配置状態数が指数的で、N=2000まで扱えない。

色名ではなく出現個数だけを見る対称性により、各色へ同じ一変数関数gを適用するポテンシャルを設計できる。

g(j)の式に現れる未確定の大きい添字はg(j+1)だけで、その遷移確率が非零なので、連立方程式を逐次的に解ける。

各個数jの一手後の分布を組合せ数から求め、g(j)=1/N+ΣP[j][k]g(k)を自己ループを移項してj=0から順に解き、初期色頻度のgの総和から単色終端のポテンシャルを差し引く。

## 典型の発動条件

### 対称性による頻度圧縮

発動条件: ラベルの違いではなく各種類の出現数だけが遷移確率を決める。

色ごとの寄与を同一関数g(頻度)として期待値を加法分解する。

### 上ヘッセンベルグ型の期待値方程式

発動条件: 一回で状態量が増える幅だけが1に制限されている。

各jの方程式から唯一の次項g(j+1)を解き、巨大な一般連立方程式を避ける。

## 問題固有の要素

一色の個数は減少幅こそ大きいが増加は高々1であり、この非対称性が期待値方程式を前から解ける形にする。

別の問題へ持ち帰る視点: 多種類の対称な確率過程では、全体の吸収時間を一種類の周辺過程のポテンシャル和として探す。

## 正当性

色cの個数J_cの一手後の分布はJ_cだけに依存する。g(0)=0を固定し、0≤j<Nについてg(j)−Σ_k P[j,k]g(k)=1/Nを課す。個数は高々一つしか増えずP[j,j+1]=(N−j)/(N2^{j+1})は法上非零なので、行jからg(j+1)を順に一意に求められる。Φ=Σ_{c=1}^N g(J_c)は非終端で一手あたり期待値が1減り、単色終端では常にg(N)になる。したがってΦ−g(N)は終端値0と期待回数のBellman式を満たす。有限状態かつ終端へ到達する確率が正なので、この解が期待停止回数である。

## 実装上の注意

- 確率は法998244353上で扱い、自己ループ係数とP[j][j+1]の逆元、g(0)の正規化、全て同色になった終端ポテンシャルの差し引きを別々に検証する。

## 復習の核

- Nが小さい場合の全状態連立方程式と比較し、単色の初期状態で0になること、各P[j][k]の総和が1になること、終端定数の較正を確認する。

## 計算量と制約

### 時間

O(N²)、各色個数jの遷移分布とg(j)の逐次方程式。

### 空間

O(N²)、分布表。逐次分布生成ならO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3.5 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2000; 1 \le A_i \le N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3842) — source-abc249-editorial-3842-1c73a62788380cc97a386b0c3db2803734266f6502a71bfe6035a636488e16ec
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_h) — source-abc249-ex-problem-14bb83c88176a910c2d064c647200793b0ba5d4b67377eef28589c75fae8e266
