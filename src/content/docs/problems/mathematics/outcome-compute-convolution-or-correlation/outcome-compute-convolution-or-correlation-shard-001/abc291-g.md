---
title: "ABC291-G — OR Sum"
draft: true
authoringUnit: {"problemId":"abc291-g","docPath":"src/content/docs/problems/mathematics/outcome-compute-convolution-or-correlation/outcome-compute-convolution-or-correlation-shard-001/abc291-g.md","learningOutcomeIds":["outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。"],"tagIds":["tag-convolution"],"sourceRevisionIds":["source-abc291-editorial-5853-63fe1b5a3336818969994232dcd22bb622706f26a5e0a23b93e8b9467f59499a","source-abc291-g-problem-b70a3c77e64434ca33b8131b0663954ac871d89241f2e3e45f1b62d9f0604162"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ORが0の位置は当該bitの両列が0である位置だけなので、OR1個数はNからzero同士の対応数を引けばよい。Aを二周、Bを反転した畳み込みのN−1+j係数は巡回shift jの対応積和に等しい。5bitの重み2^bを足して全shiftの正確な得点を得るため、その最大が答えになる。","sourceRevisionIds":["source-abc291-editorial-5853-63fe1b5a3336818969994232dcd22bb622706f26a5e0a23b93e8b9467f59499a","source-abc291-g-problem-b70a3c77e64434ca33b8131b0663954ac871d89241f2e3e45f1b62d9f0604162"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

この解説で扱わないこと:

- 組合せ解釈を必要とする生成関数の設計、および逆数・対数・指数などのFPS演算。

## 考察

ORはbitごとに独立で、あるbitのORが0なのは対応するA,Bのbitが両方0の位置だけである。

採用する候補: 補bit列の巡回相互相関を畳み込みで計算

Aを二周、Bを反転して畳み込めば全回転で両bitが0の個数が得られ、各bitのOR和を全shiftへ加算できる。

棄却する候補: 全N回転を一つずつ評価

各回転にN要素必要で二次時間になる。

巡回shift jの添字和は、二周した列と逆順列の通常畳み込みの係数N-1+jとして取り出せる。

各5bitについて補数化したA二周列と逆順B列を畳み込み、全shiftのOR個数N-c[N-1+j]を2^bit倍して得点へ加え、最大得点を選ぶ。

## 典型の発動条件

### 畳み込みによる相互相関

発動条件: 全shiftに対する二列の位置ごとの積和が必要になる。

一方を反転し、もう一方を二周して巡回相関を得る。

### bit分解

発動条件: 値域が0..31で論理和に繰り上がりがない。

5bitを独立な0/1列として処理し2^b倍で合成する。

## 問題固有の要素

ORの1を直接数える代わりにDe Morganで「両方0」の相関を数えると積和になり、FFT/NTTへ接続できる。

別の問題へ持ち帰る視点: 論理演算の全shift集計は、補集合やbit分解で積和へ変形する。

## 正当性

ORが0の位置は当該bitの両列が0である位置だけなので、OR1個数はNからzero同士の対応数を引けばよい。Aを二周、Bを反転した畳み込みのN−1+j係数は巡回shift jの対応積和に等しい。5bitの重み2^bを足して全shiftの正確な得点を得るため、その最大が答えになる。

## 実装上の注意

- Aの二周長2Nと反転Bの係数位置N-1+jを確認し、各shiftの得点は64ビットで持つ。

## 復習の核

- 小さいNの全shift全評価と比較し、全0・全1、Nが変換長の境界付近、shift0とN-1を確認する。

## 計算量と制約

### 時間

O(N log N)。5bitそれぞれをNTT相関に変える。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5\times 10^5; 0\leq A_i,B_i \leq 31; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/editorial/5853) — source-abc291-editorial-5853-63fe1b5a3336818969994232dcd22bb622706f26a5e0a23b93e8b9467f59499a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/tasks/abc291_g) — source-abc291-g-problem-b70a3c77e64434ca33b8131b0663954ac871d89241f2e3e45f1b62d9f0604162
