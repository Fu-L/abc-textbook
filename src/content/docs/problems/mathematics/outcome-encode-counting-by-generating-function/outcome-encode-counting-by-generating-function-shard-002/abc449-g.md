---
title: "ABC449-G — Many Repunit Sum 2"
draft: true
authoringUnit: {"problemId":"abc449-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc449-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-formal-power-series","tag-generating-functions"],"sourceRevisionIds":["source-abc449-editorial-17258-762549cc000592d432feda1e20095c69814a9b7f5425c23b8254033b13b0085e","source-abc449-g-problem-3813696fa1319724d806eabf320c6b6304cde5c7e68a99659bde3068924ce95f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"N個repunitの和は(10n−N)/9で、nはM桁以下10冪をN個足した値なので全単射。最小10冪項数は下M−1digitの和と上位係数で、項の分割は一回で項数を9増やす。従って最小項数t≤N、t≡N mod9、かつn≥Nが必要十分。digit係数母関数でt分布を数えprefix和とmod9抽出を行い、n<Nの不可能値を除くとdistinct和数になる。","sourceRevisionIds":["source-abc449-editorial-17258-762549cc000592d432feda1e20095c69814a9b7f5425c23b8254033b13b0085e","source-abc449-g-problem-3813696fa1319724d806eabf320c6b6304cde5c7e68a99659bde3068924ce95f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

d桁 repunit R_d と10^{d-1}は 9R_d+1=10^d により対応し、N個の repunit 和の distinct 数は N個の M桁以下の10冪和の distinct 数へ全単射で移る。

採用する候補: 10冪和 n の最小項数 f(n) を桁和として特徴付け、項数を N へ増やせる条件 f(n)≤N かつ f(n)≡N mod9 を数える生成関数の係数和を FPS で計算する。

10^d を十個の10^{d-1}へ分割するたび項数が9増え、n≥N なら必要回数の分割が可能なので、最小項数とmod9条件が必要十分になる。

棄却する候補: N 個の repunit の長さ1..Mを列挙し、各和を set に格納する。

選択 multiset は組合せ爆発し、N,M が大きいため和の巨大整数も保持できない。

M桁以下10冪による最小項数は、最上桁係数には上限がなく、下 M-1 桁は0..9の通常桁として f(n)=係数和になる。

係数列は (1+x+…+x^9)^{M-1}/(1-x) で、次数≤Nだけ計算し N mod9 の項を拾えばよい。

repunit問題を10冪和へ変換する。多項式 P=(1+x+…+x^9)^{M-1} を微分方程式 recurrence、FPS pow、または convolution二分累乗で次数Nまで求め、prefix和で /(1-x) を反映し、所定mod9の係数を合計して n<N の分を補正する。

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

N個repunitの和は(10n−N)/9で、nはM桁以下10冪をN個足した値なので全単射。最小10冪項数は下M−1digitの和と上位係数で、項の分割は一回で項数を9増やす。従って最小項数t≤N、t≡N mod9、かつn≥Nが必要十分。digit係数母関数でt分布を数えprefix和とmod9抽出を行い、n<Nの不可能値を除くとdistinct和数になる。

## 実装上の注意

- n≥N 条件を外して生成関数で数えた小さい n を最後に正しく除く。FPS は次数Nでtruncateし modulus 998244353 上で計算する。

## 復習の核

- 9n+N の変換を一個のrepunitで確認し、最小項数からN項へ9ずつ増やせる十分性を具体的なcarry分解で再現する。

## 計算量と制約

### 時間

O(N log N·log M)をNTT二分累乗の場合の上界とする。次数Nで打切る。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq M \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/editorial/17258) — source-abc449-editorial-17258-762549cc000592d432feda1e20095c69814a9b7f5425c23b8254033b13b0085e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/tasks/abc449_g) — source-abc449-g-problem-3813696fa1319724d806eabf320c6b6304cde5c7e68a99659bde3068924ce95f
