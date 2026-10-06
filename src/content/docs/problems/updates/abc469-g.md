---
title: "ABC469 G — K-nacci Operations"
draft: true
authoringUnit: {"problemId":"abc469-g","docPath":"src/content/docs/problems/updates/abc469-g.md","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-linear-recurrence-matrix"],"sourceRevisionIds":["source-abc469-g-problem-c736a519c81389ff355c63bd25653eb283e4254cb50122cf5f9dc33c6976895b","source-abc469-editorial-23809-bc7ff2617413dea273d7fcb9ee247ac48599adf9511729e62b2e7e443c8631f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"回転と反転の作用は二面体群の合成式で閉じ、要約は連結を完全に保存する。反転bitの隣接漸化式の差から周期が得られ、各回転係数の符号も同周期になる。従って一期ごとに同じ線形写像を適用でき、行列累乗と余り遷移は元の再帰作用と一致する。","sourceRevisionIds":["source-abc469-g-problem-c736a519c81389ff355c63bd25653eb283e4254cb50122cf5f9dc33c6976895b","source-abc469-editorial-23809-bc7ff2617413dea273d7fcb9ee247ac48599adf9511729e62b2e7e443c8631f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 考察

再帰的に作るS_Nは巨大なので展開できない。操作がTの回転と反転だけなら、作用を回転量a mod |T|と反転bit bで要約できる。作用を『左回転aの後に反転b』と定義すると、Xの後にYを実行した合成は (a_X+(-1)^{b_X}a_Y, b_X xor b_Y)。順序を逆にしてはならない。

各初期S_iを一文字ずつ合成して(a_i,b_i)を求める。i>Kでは逆順に過去K個を連結するため、b_i=b_{i−1} xor … xor b_{i−K}。連続二式をxorすると b_{i+1}=b_{i−K} となり、i≥K+1から周期K+1がある。b_{K+1}も計算し、周期列の基底を1,…,K+1として固定する。

a_iは過去K個のaの符号付き線形結合で、a_{i−j}の符号は先に連結されるj−1個のbのxorで決まる。bが周期的なのでこの遷移係数も周期K+1。一期分のK次元遷移行列Pを作り、初期状態(a_K,…,a_1)からN−Kステップのうち周期数回をPの累乗で進め、余りだけ逐次遷移する。

Pを一般行列K+1個の積で作ると余計なKが掛かる。各一ステップは新先頭行を旧行の符号付き和にし、残りの行をずらすだけなので O(K²) で行列を更新できる。一期の構築は O(K³)、累乗 O(K³ log N)。最後はTを一度回転し必要なら反転して出力する。

## 典型の発動条件

巨大な構文を作らず、それが対象へ与える作用を有限次元へ圧縮する。作用が非可換でも、係数が周期なら一期の線形写像を累乗できる。

## 問題固有の要素

反転bitのxor漸化式がK+1周期となり、回転量の符号付き漸化式を周期係数系へ変える。

## 正当性

回転と反転の作用は二面体群の合成式で閉じ、要約は連結を完全に保存する。反転bitの隣接漸化式の差から周期が得られ、各回転係数の符号も同周期になる。従って一期ごとに同じ線形写像を適用でき、行列累乗と余り遷移は元の再帰作用と一致する。

## 実装上の注意

N≤Kは初期作用を直接使う。負値をMで正規化する。周期の開始位相をK+1番目の遷移に合わせる。M=1は回転量0。

## 復習の核

文字列の長さではなく作用の情報量を見る。周期遷移の積を作る順と最初の位相を確認する。

## 計算量と制約

### 時間

初期入力の総長をS、T長をMとして O(S+K³ log N+M)。

### 空間

行列 O(K²)、入力と出力 O(S+M)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq K \leq 100; K is an integer.; S_i is a non-empty string consisting of a and b. (1 \leq i \leq K); The sum of the lengths of S_1, S_2, \ldots, S_K is at most 2 \times 10^5.; 1 \leq N \leq 10^{18}; N is an integer.; T is a string consisting of lowercase English letters with length between 1 and 2 \times 10^5, inclusive.

## 出典

- [公式問題](https://atcoder.jp/contests/abc469/tasks/abc469_g)
- [公式解説](https://atcoder.jp/contests/abc469/editorial/23809)
