---
title: "ABC265-EX — No-capture Lance Game"
draft: true
authoringUnit: {"problemId":"abc265-ex","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc265-ex.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-conway-number-games","unit-dp-game","unit-separable-linear-transform"],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution","tag-conway-number-games","tag-game-grundy-dp","tag-separable-linear-transform"],"sourceRevisionIds":["source-abc265-ex-problem-055d926e1343bc0e9dd5f13eb2b0a7878d1c300f3d8cc91fac8b952717f48de5","source-abc265-editorial-4577-a0a5cd70b7240c0d5ac6da0e58b56efbdfc5e377bc7df7fe6419e06715bbce72"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一行の評価(s,g)は独立行の直和でsが加算、gがXOR合成される。従って一行分布のH回畳み込みが全盤面の評価分布そのもの。加算軸はNTT、XOR軸はWalsh–Hadamardで対角化してH乗し逆変換する。加算軸を全和域へpaddingしoffsetをH倍戻すことで巡回混入を除き、S>0またはS=0,G>0だけ足す。","sourceRevisionIds":["source-abc265-ex-problem-055d926e1343bc0e9dd5f13eb2b0a7878d1c300f3d8cc91fac8b952717f48de5","source-abc265-editorial-4577-a0a5cd70b7240c0d5ac6da0e58b56efbdfc5e377bc7df7fe6419e06715bbce72"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [独立な数ゲームの和](src/content/docs/learn/dynamic-programming/conway-number-games.md)
- [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)
- [分離可能線形変換・Walsh–Hadamard変換](src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)

対象外:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

行同士に移動はなく、全体ゲームはH個の独立な一行ゲームの直和として評価できる。

先手位置j・後手位置kの一行評価は、k<jなら (s,g)=(0,j−k−1)、k>jなら (s,g)=((j−1)−(W−k),0) になる。

棄却する候補: 全W(W−1)^H配置を列挙し、各盤面のゲーム木を探索する。

配置数がHに対して指数的で、同じ一行局面の合成を繰り返している。

採用する候補: 一行配置の (s,g) 分布を作り、sは加算、gはXORする混合二次元畳み込みをtransform領域でH乗して全体分布を得る。

通常DFTは加算畳み込み、Walsh-Hadamard変換はXOR畳み込みを同時に対角化し、H回の合成を点ごとの冪へ変えられる。

全体評価 (S,G)=(Σs_i, XOR g_i) に対し、先手勝ちは S>0 または S=0かつG>0 で特徴付けられる。

負のsは一定offsetを加えて多項式次数へ写し、H行分の最大次数を覆う長さへzero paddingすれば巡回を通常畳み込みにできる。

partisan gameのsurreal-number成分を加法群、impartial成分をXOR群として、direct product group上のconvolutionを多次元Fourier変換で対角化する。

## 典型の発動条件

### 独立ゲームの数値・Grundy合成

発動条件: 複数の独立局面から毎手一つを選ぶゲームで、局面ごとにpartisan値とimpartial値へ分解できるとき。

数値成分を加算し、Grundy成分をXORして全体勝敗を判定する。

### 加算×XORの混合畳み込み

発動条件: 状態pairの一軸が通常加算、他軸がbitwise XORで合成される分布を反復合成するとき。

加算軸へNTT、XOR軸へWalsh-Hadamard変換を施し、各点をH乗して逆変換する。

## 問題固有の要素

向かい合う二駒の間の空白は通常のNim heapとなり、外向きの二駒は左右の手数差という整数値になるため、一行で両評価が同時に非零にはならない。

別の問題へ持ち帰る視点: 複合ゲームは駒の相対配置ごとに標準ゲームへ分解し、加法則が異なる評価成分を分けて持つ。

## 正当性

一行の評価(s,g)は独立行の直和でsが加算、gがXOR合成される。従って一行分布のH回畳み込みが全盤面の評価分布そのもの。加算軸はNTT、XOR軸はWalsh–Hadamardで対角化してH乗し逆変換する。加算軸を全和域へpaddingしoffsetをH倍戻すことで巡回混入を除き、S>0またはS=0,G>0だけ足す。

## 実装上の注意

- XOR軸長は全gを含む2冪、加算軸長はH行のs範囲を巡回なしで含むNTT可能長にする。
- 逆Walsh-Hadamard変換では軸長の逆元を掛け、sのoffsetをH倍した位置から実際のSを復元して勝ち状態だけ合計する。

## 復習の核

- 独立部分ゲームの評価が複数の演算で合成されるなら、各演算を対角化する変換の直積を考える。
- 反復畳み込みの対象が全行同一なら、逐次DPではなく変換後の点ごとのH乗へ置き換える。

## 計算量と制約

### 時間

O(LB(log L+log B+log H))。Bはgを覆う2冪、LはH行のsの全和域を覆うNTT長。

### 空間

O(LB)。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H \leq 8000; 2 \leq W \leq 30; H and W are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/tasks/abc265_h) — source-abc265-ex-problem-055d926e1343bc0e9dd5f13eb2b0a7878d1c300f3d8cc91fac8b952717f48de5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/editorial/4577) — source-abc265-editorial-4577-a0a5cd70b7240c0d5ac6da0e58b56efbdfc5e377bc7df7fe6419e06715bbce72
