---
title: "ABC227-G — Divisors of Binomial Coefficient"
draft: true
authoringUnit: {"problemId":"abc227-g","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc227-g.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc227-editorial-2909-2d66e4e56bf7cf39ce74fbaf080ffc6ad85dd47a1bb5137c7e6393eb2a1ad3f5","source-abc227-g-problem-f6a6be930af8d51a2bcb681704a3b8055738ef7534d5e9e5fafefde5b007538c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二項係数の指数は分子短区間の指数からK!の指数を引けば得られる。√N以下の全素数を除いた残存値は1または素数で、合成数なら除去済みの小因子を持つはずだからである。全指数を集計した後、約数の指数選択0..eの独立性よりΠ(e+1)を得る。","sourceRevisionIds":["source-abc227-editorial-2909-2d66e4e56bf7cf39ce74fbaf080ffc6ad85dd47a1bb5137c7e6393eb2a1ad3f5","source-abc227-g-problem-f6a6be930af8d51a2bcb681704a3b8055738ef7534d5e9e5fafefde5b007538c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

約数個数は素因数指数から求まるが、Nは10^12なのでN!や二項係数そのものを構築できない。一方Kは10^6以下で、分子は[N-K+1,N]という短い連続区間、分母はK!である。

sqrt(N)は最大10^6でKと同程度なので、sqrt(N)までの素数を列挙し、短い分子区間をまとめて割る方針なら制約に合う。

棄却する候補: 二項係数を法998244353で計算し、その剰余を素因数分解する。

剰余から元の巨大整数の素因数指数は復元できず、約数個数も保存されない。

採用する候補: K!と連続区間[N-K+1,N]を篩の要領で素因数分解し、各素数の分子指数から分母指数を引く。

扱う整数は2K個に限られ、必要な素数もsqrt(N)以下までの篩で列挙できるため、Nの大きさに比例せず指数表を得られる。

C(N,K)=N(N-1)…(N-K+1)/K!なので、素数pごとの指数は分子区間の指数総和からK!の指数を引けばよく、巨大な積を持つ必要がない。

分子の各数をsqrt(N)以下の全素数で割り切った後に1より大きく残る因子は素数である。短い区間を配列に保持することで、区間篩と同様に各倍数だけを訪問できる。

sqrt(N)までを篩って素数を列挙する。各素数について分子区間内の最初の倍数から繰り返し割って指数を加え、K!中の指数を減らす。最後に各要素の残存素因数も加え、全ての指数eについて(e+1)をmod 998244353で掛ける。

## 典型の発動条件

### 積・商を素因数指数の加減算へ移す

発動条件: 巨大な整数の積や組合せ数そのものではなく、約数個数・平方性・割り切れ方を求めるとき。

二項係数の分子と分母を別々に因数分解し、素数ごとの指数差から約数個数を計算する。

### 区間篩による連続整数の素因数分解

発動条件: 値自体は大きいが、因数分解したい整数が短い連続区間にまとまっており、sqrt(最大値)までの素数を列挙できるとき。

[N-K+1,N]の残存値を配列に置き、各素数pの区間内倍数だけをpで割って指数を回収する。

## 問題固有の要素

N≤10^12とK≤10^6からsqrt(N)≤10^6が成り立ち、分子区間の長さと試す素数範囲の両方が実行可能な大きさに揃っている。

別の問題へ持ち帰る視点: 巨大な端点と短い区間が同時に現れたら、区間全体を走査しつつsqrt(端点)までの素数でまとめて処理する segmented sieve を疑う。

## 正当性

二項係数の指数は分子短区間の指数からK!の指数を引けば得られる。√N以下の全素数を除いた残存値は1または素数で、合成数なら除去済みの小因子を持つはずだからである。全指数を集計した後、約数の指数選択0..eの独立性よりΠ(e+1)を得る。

## 実装上の注意

- 区間値・N・倍数計算には64bit整数を使い、ceil(L/p)×pで最初の倍数を求める。
- K=0では二項係数が1で答えも1となる。篩後に各分子要素へ残った1より大きい因子を忘れず指数表へ加える。

## 復習の核

- 組合せ数の乗法的性質を問われたら、まずC(N,K)を短い分子区間÷K!と書き、値ではなく素因数指数を持つ方針を検討する。
- 制約のKとsqrt(N)が同じ10^6に収まることを見落とさず、単発の試し割りではなく区間篩へつなげる。

## 計算量と制約

### 時間

O((K+√N)log N)を上界とする。短区間の倍数走査と素因数除去を行う。

### 空間

O(K+√N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{12}; 0 \leq K \leq \min(10^6,N); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/editorial/2909) — source-abc227-editorial-2909-2d66e4e56bf7cf39ce74fbaf080ffc6ad85dd47a1bb5137c7e6393eb2a1ad3f5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/tasks/abc227_g) — source-abc227-g-problem-f6a6be930af8d51a2bcb681704a3b8055738ef7534d5e9e5fafefde5b007538c
