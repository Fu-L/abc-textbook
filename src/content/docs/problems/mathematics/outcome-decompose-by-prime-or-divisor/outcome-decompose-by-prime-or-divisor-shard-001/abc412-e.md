---
title: "ABC412-E — LCM Sequence"
draft: true
authoringUnit: {"problemId":"abc412-e","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc412-e.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc412-e-problem-b1dd2ee7a196901de5c09926f0c5097e4ad5ba4e585f89a645632cf631613037","source-abc412-editorial-13387-d3fee80ccc172983e1e1ad2ed6c6b7c1e99725db08da55d76946ec45e2986d5f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"LCMのprime p指数はp^k≤nの最大k。nがprime-powerのときだけ新指数が現れLCMが厳密増加し、それ以外は変わらない。従って区間最初の値1種類と(L,R]のprime-power個数がdistinct数。区間篩で相異なるprime数1の値を数えることはprime-power判定と同値で、残存primeも補えば全候補を正確に判定する。","sourceRevisionIds":["source-abc412-e-problem-b1dd2ee7a196901de5c09926f0c5097e4ad5ba4e585f89a645632cf631613037","source-abc412-editorial-13387-d3fee80ccc172983e1e1ad2ed6c6b7c1e99725db08da55d76946ec45e2986d5f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

A_n=lcm(1..n) は単調で、A_n>A_{n-1} となるのは n=p^k が素数冪のときに限る。そのとき素因数 p の最大指数だけが一つ増える。

したがって列 A_L..A_R の distinct 数は、最初の A_L 一個と区間 [L+1,R] に含まれる素数冪の個数の和である。区間幅と sqrt(R) はともに最大10^7である。

採用する候補: [L+1,R] を区間篩で素因数分解し、異なる素因数がちょうど一種類の数を数える

sqrt(R) 以下の素数を通常篩で作り、区間内の倍数から同じ素数を割り切る。最後の残余も一因子として数えれば各数のprime-power判定をまとめて行える。

棄却する候補: 各 n∈[L+1,R] を sqrt(n) まで試し割りして素数冪か判定する

区間長10^7、sqrt(R)も10^7なので最悪10^14規模となり、各小素数の倍数を一括処理できていない。

lcm における p の指数は max{k:p^k≤n} なので、n を一つ増やして変化するには新しい最大冪 n=p^k が現れる必要十分がある。

区間篩では素数 p の倍数ごとに p を何回でも割るが、distinct factor数は一回だけ増やす。全小素数処理後の rem>1 は sqrt(R) より大きい素因数一個である。

B=L+1..R の各値を rem に初期化し distinctPrimeCount=0 とする。sieveで得た p≤sqrt(R) ごとにB内最初の倍数から走査し、割れればcountを1増やしてremからpを全て除く。終了後rem>1ならcountを1増やし、元の値が2以上かつcount=1を数え、答えを1から始める。

## 典型の発動条件

### LCM の素数指数

発動条件: lcm(1..n) がいつ変化するかを調べるとき。

各primeの最大冪指数が増える時点をprime powerとして特徴づける。

### 区間篩／segmented factorization

発動条件: 数値自体は大きいが短い連続区間の全整数を素因数分解したいとき。

sqrt(R)以下の各primeを区間内の倍数へまとめて適用する。

### distinct prime factor数による素数冪判定

発動条件: 整数が単一primeの正冪かを判定するとき。

1を除き、異なる素因数の個数がちょうど1かを見る。

## 問題固有の要素

巨大な lcm 自体は一度も構成せず、値が変わる index の素数冪判定だけで distinct 項数を数える。

別の問題へ持ち帰る視点: 巨大な単調列のdistinct数では、隣接差の発生条件を数論的eventへ変換してevent indexだけ数える。

## 正当性

LCMのprime p指数はp^k≤nの最大k。nがprime-powerのときだけ新指数が現れLCMが厳密増加し、それ以外は変わらない。従って区間最初の値1種類と(L,R]のprime-power個数がdistinct数。区間篩で相異なるprime数1の値を数えることはprime-power判定と同値で、残存primeも補えば全候補を正確に判定する。

## 実装上の注意

- L=Rなら区間は空で答え1。数1をprime powerに含めず、区間の最初のpの倍数をceil(B_l/p)pで安全に計算し、p*pや座標値は64 bitにする。

## 復習の核

- L=R、区間に1だけ、素数・平方・二素数積が混在する小区間を直接lcm更新および素因数分解と比較する。

## 計算量と制約

### 時間

O((R−L+√R)log R)を上界とする。√Rまでの素数篩と短区間因数除去。

### 空間

O(R−L+√R)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq L \leq R \leq 10^{14}; R - L \leq 10^7; L and R are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/tasks/abc412_e) — source-abc412-e-problem-b1dd2ee7a196901de5c09926f0c5097e4ad5ba4e585f89a645632cf631613037
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc412/editorial/13387) — source-abc412-editorial-13387-d3fee80ccc172983e1e1ad2ed6c6b7c1e99725db08da55d76946ec45e2986d5f
