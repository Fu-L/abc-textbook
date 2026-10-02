---
title: "ABC297-EX — Diff Adjacent"
draft: true
authoringUnit: {"problemId":"abc297-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc297-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-inclusion-exclusion","unit-modular-arithmetic","unit-polynomial-convolution"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-formal-power-series","tag-generating-functions","tag-convolution","tag-inclusion-exclusion","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc297-editorial-6141-eb4db3f782f161398487c46accd3f29e0badf888e3d74996b9178385e861fb3e","source-abc297-ex-problem-acf0c092c4ebf9fd75c392b95e3647caad781aabbd8a882a52ff5ff9b40ad215"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同値隣接runの包除では値iをj個連結した部品の符号が(−1)^{j−1}になる。部品列の母関数は1/(1−g)、長さmarkを微分して1へ戻すと長さ総和H/(1−G)²を得る。これは違反境界を持つ列が相殺された後の各適正列をその長さだけ数えるため、N次係数が求める和になる。","sourceRevisionIds":["source-abc297-editorial-6141-eb4db3f782f161398487c46accd3f29e0badf888e3d74996b9178385e861fb3e","source-abc297-ex-problem-acf0c092c4ebf9fd75c392b95e3647caad781aabbd8a882a52ff5ff9b40ad215"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

隣接要素が異なる列は、同値runの境界違反へ包除を掛けるとrun長jの重み(-1)^(j-1)x^(ij)y^jで表せる。

採用する候補: 二変数母関数をy微分し形式冪級数計算

長さ総和は∂/∂yをy=1で評価でき、必要級数を約数列挙で作って多項式逆元を計算できる。

棄却する候補: 総和Nの全compositionを列挙

2^(N-1)個ありN=2×10^5では不可能。

列をrun部品の列と見るとf=1/(1-g)で、長さmark yの微分が全列の長さ合計を抽出する。

次数NまでG=Σ x^i/(1+x^i)とH=Σx^i/(1+x^i)^2を約数寄与で構成し、H/(1-G)^2のx^N係数をNTTとFPS逆元で求める。

## 典型の発動条件

### 包除付き母関数

発動条件: 局所禁止条件をrunの重みへ織り込む。

同値run長に交代符号を付ける。

### marking variableの微分

発動条件: 全構造の要素数総和を数える。

長さをyでmarkしy微分する。

### 形式冪級数逆元

発動条件: 1/(1-G)^2の係数を高速に得る。

NTT/Newton法で次数Nまで計算する。

## 問題固有の要素

隣接非同値制約を値ごとのrun包除に変えると、正整数列の総和・長さが二変数生成関数へまとまる。

別の問題へ持ち帰る視点: 局所一致禁止はcluster/run法で母関数化する。

## 正当性

同値隣接runの包除では値iをj個連結した部品の符号が(−1)^{j−1}になる。部品列の母関数は1/(1−g)、長さmarkを微分して1へ戻すと長さ総和H/(1−G)²を得る。これは違反境界を持つ列が相殺された後の各適正列をその長さだけ数えるため、N次係数が求める和になる。

## 実装上の注意

- 次数Nで全級数をtruncateし、符号と微分後の分子、法998244353のNTT長を確認する。

## 復習の核

- 小Nのcomposition全列挙と係数を比較し、N=1,2とrun包除符号を確認する。

## 計算量と制約

### 時間

O(N log N)。約数寄与でG,Hを作りNTT/FPS逆元で係数抽出する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^5; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/editorial/6141) — source-abc297-editorial-6141-eb4db3f782f161398487c46accd3f29e0badf888e3d74996b9178385e861fb3e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/tasks/abc297_h) — source-abc297-ex-problem-acf0c092c4ebf9fd75c392b95e3647caad781aabbd8a882a52ff5ff9b40ad215
