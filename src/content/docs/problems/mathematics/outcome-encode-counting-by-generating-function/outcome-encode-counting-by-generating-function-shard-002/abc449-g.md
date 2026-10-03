---
title: "ABC449-G — Many Repunit Sum 2"
draft: true
authoringUnit: {"problemId":"abc449-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc449-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-formal-power-series","tag-generating-functions"],"sourceRevisionIds":["source-abc449-editorial-17258-762549cc000592d432feda1e20095c69814a9b7f5425c23b8254033b13b0085e","source-abc449-g-problem-3813696fa1319724d806eabf320c6b6304cde5c7e68a99659bde3068924ce95f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"repunit和と10冪和は固定Nで全単射である。繰上げ標準形が最少項数を与え、項数を9ずつ増やす分割とn≥Nにより三条件は必要十分。母関数Fは各整数nを唯一のdigit列として一度数え、f(n)とmod9条件を抽出する。n<Nで残った候補はN−9j≥0のfloor(N/9)個なので指定補正が正確である。H P'=(M−1)H'Pからの係数比較は各P_nを定め、定数項1から順に全係数を復元する。累積和でFを得て抽出・補正した値がdistinctな和の個数になる。","sourceRevisionIds":["source-abc449-editorial-17258-762549cc000592d432feda1e20095c69814a9b7f5425c23b8254033b13b0085e","source-abc449-g-problem-3813696fa1319724d806eabf320c6b6304cde5c7e68a99659bde3068924ce95f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

d桁repunit R_dとd桁10冪10^{d−1}には9R_d+1=10^dの対応がある。N個のrepunit和は、対応する10冪の和nを用いて(10n−N)/9となるので、distinctな10冪和の個数を数えればよい。個別の長さmultisetを列挙すると同じ整数を重複して数えるため、各整数nの最少項数を標準形にする。

10^{M−1}の係数は上限なし、下M−1桁は通常の0..9のdigitへ繰り上げる。この係数和f(n)が最少項数である。10^dを十個の10^{d−1}へ分割すると項数が9増えるから、N項表示の必要十分条件は n≥N、f(n)≤N、f(n)≡N mod9。十分性では項数がNに達するまで分割する。全項が1になった時の項数はnなので、n≥Nなら途中で分割できなくなることはない。

f(n)別の個数母関数は F(x)=(1+x+…+x^9)^{M−1}/(1−x)。次数Nまでの係数F_tからt≡N mod9のものを足し、最後にn<Nを除く。この補正も具体的に数えられる。f(n)≤n<Nは自動、f(n)≡n mod9なので、除く値はN−9,N−18,…の非負整数。0を含めてちょうどfloor(N/9)個である。答えは Σ_{0≤t≤N,t≡N mod9} F_t−floor(N/9)。

N≤10^5に対して、巨大なM乗を反復する必要はない。H(x)=1+x+…+x^9、P(x)=H(x)^{M−1}、P_n=[x^n]Pとする。H P'=(M−1)H'Pの係数を比較すると、P_0=1、

nP_n=Σ_{j=1}^{min(9,n)}(Mj−n)P_{n−j}。

これでP_1,…,P_NをO(9N)で順に求める。F_t=Σ_{i=0}^t P_iなのでprefix和を取り、所定のmod9の項を加算する。法998244353ではn≤N<法だからnの逆元がある。Mも法上へ移してよく、M=1ではP=1、F_t=1となり答えは1。例えばN=9,M=1ではF_0+F_9=2から補正1を引き、repunit1を九個足す一種類だけが残る。

FPS log/expならO(N log N)、NTT二分累乗ならO(N log N log M)でも同じ母関数を計算できる。本問では底Hの次数が9である観察から、微分による線形漸化式が最も軽い。

## 典型の発動条件

### 表現の全単射変換

発動条件: repunit の和を桁ごとの加算へ直して distinct 値を数えたいとき。

9倍と定数加算で10冪和へ一対一対応させる。

### 有界係数の生成関数

発動条件: 多数変数の和が上限内となる組数を次数ごとに数えたいとき。

(1+x+…+x^9) の冪と累積和から係数を得る。

## 問題固有の要素

表現通り数えるのではなく、各値が表現可能かの必要十分条件を最小項数と合同条件に縮約する。

別の問題へ持ち帰る視点: 10進繰上がりは十個を一個へまとめる操作で項数を9ずつ変えるため、mod9が不変量になる。

## 正当性

repunit和と10冪和は固定Nで全単射である。繰上げ標準形が最少項数を与え、項数を9ずつ増やす分割とn≥Nにより三条件は必要十分。母関数Fは各整数nを唯一のdigit列として一度数え、f(n)とmod9条件を抽出する。n<Nで残った候補はN−9j≥0のfloor(N/9)個なので指定補正が正確である。H P'=(M−1)H'Pからの係数比較は各P_nを定め、定数項1から順に全係数を復元する。累積和でFを得て抽出・補正した値がdistinctな和の個数になる。

## 実装上の注意

- n=1..Nの逆元でP_nを計算する。Mj−nの負の剰余を正規化する。
- 最少項数f(n)の抽出だけでは不足し、floor(N/9)を最後に引く。0も補正対象に含む。
- N個のrepunitの長さの選び方ではなく、異なる和を数える。digit標準形は各整数を一度だけ表す。

## 復習の核

- 一個のrepunitで9R_d+1=10^dを確認し、和の対応(10n−N)/9を導く。最小項数からN項へ9ずつ増やせる十分性を具体的なcarry分解で再現する。

## 計算量と制約

### 時間

O(N)。底多項式の次数9を利用し、一係数につき高々9項。nの逆元を線形前計算し、prefix和・mod9抽出もO(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq M \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/editorial/17258) — source-abc449-editorial-17258-762549cc000592d432feda1e20095c69814a9b7f5425c23b8254033b13b0085e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/tasks/abc449_g) — source-abc449-g-problem-3813696fa1319724d806eabf320c6b6304cde5c7e68a99659bde3068924ce95f
