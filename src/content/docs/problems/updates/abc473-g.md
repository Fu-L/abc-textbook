---
title: "ABC473 G — Wipeout"
draft: true
authoringUnit: {"problemId":"abc473-g","docPath":"src/content/docs/problems/updates/abc473-g.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation","outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-convolution","tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc473-g-problem-ed90721269f594819067074a2a7d677a17907233fe962cbecf832f26f5e4e752","source-abc473-editorial-24872-20a0fd6a058efde714f5e3ddd37abc83deb8114c57b5271baf68832e47b1d725"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"既知の目標を即回収する戦略は余分な探索をせず期待操作数を最小化する。未知k枚時点の目標位置は条件付きで一様なので、各段の追加操作の分布が履歴に依存しない。条件付き確率の積から母関数が得られ、畳み込み係数は失敗数の確率となる。","sourceRevisionIds":["source-abc473-g-problem-ed90721269f594819067074a2a7d677a17907233fe962cbecf832f26f5e4e752","source-abc473-editorial-24872-20a0fd6a058efde714f5e3ddd37abc83deb8114c57b5271baf68832e47b1d725"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。
- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

先に読む単元:

- [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

## 考察

未知カードをめくるか、位置を知っている現在の目標カードを食べるかだけを考える。既知の目標を先に食べても将来の未知探索を増やさないため、常に即回収してよい。目標が未知なら、残る未知k枚からどれを選んでも目標を引く条件付き確率は1/k。

未知の枚数はNから0へ一枚ずつ減り、各kを一度通る。未知カードを引いて即食べられなかった場合だけ、後でそのカードをもう一度めくる追加操作が必要。従って総回数はN+失敗数。k枚時点の失敗指示の確率母関数は (1+(k−1)x)/k。履歴によらず成功率が1/kなので、条件付き分布を掛け合わせて総母関数 Π_{k=1}^N(1+(k−1)x)/N! を得る。

K<NまたはK>2N−1なら0。必要なのは次数K−Nの係数。一次多項式をbalanced product treeで二つずつNTT畳み込みし、最後にN!の逆元を掛ける。k=1の因子は定数1なので最大失敗数はN−1。各層の次数総和は O(N)、層は O(log N) なので計算量は O(N log² N)。目的次数を超える項は途中で切り落としてもよい。

## 典型の発動条件

確率分布を母関数へ変え、多数の一次因子の積をproduct treeで計算する。独立性を宣言する前に条件付き確率が履歴不変か示す。

## 問題固有の要素

既知カードの回収には探索情報が要らず、未知枚数だけが追加操作確率を決める。

## 正当性

既知の目標を即回収する戦略は余分な探索をせず期待操作数を最小化する。未知k枚時点の目標位置は条件付きで一様なので、各段の追加操作の分布が履歴に依存しない。条件付き確率の積から母関数が得られ、畳み込み係数は失敗数の確率となる。

## 実装上の注意

k=1の因子は次数0。N!の逆元が存在するN<法を確認する。係数の添字はK−N。

## 復習の核

確率変数を操作回数全体ではなく、各未知枚数で生じる追加一回へ分解する。

## 計算量と制約

### 時間

balanced product tree O(N log² N)。階乗逆元 O(N+log p)。

### 空間

層ごとの多項式を解放すれば O(N) 作業領域。全層保存なら O(N log N)。

### 制約との対応

Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 5 \times 10^5; N \le K \le 10^9

## 出典

- [公式問題](https://atcoder.jp/contests/abc473/tasks/abc473_g)
- [公式解説](https://atcoder.jp/contests/abc473/editorial/24872)
