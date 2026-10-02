---
title: "ABC300-E — Dice Product 3"
draft: true
authoringUnit: {"problemId":"abc300-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc300-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc300-e-problem-a38ec87a7c321ea6f527b93db8330fb37309527e8eba47c2e47dddd381fa27c5","source-abc300-editorial-6279-c63fd978778493f959f6e294f89bff61afe306d587bf48a2cc19ca5eaa2ca9dd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一回の出目1は値不変の自己loopで、その項を移すと2..6の確率平均1/5になる。全依存先は現在値より大きく、N到達1、超過0から再帰評価できる。乗法状態は素因数2,3,5しか含まず疎memoで全到達値を覆う。","sourceRevisionIds":["source-abc300-e-problem-a38ec87a7c321ea6f527b93db8330fb37309527e8eba47c2e47dddd381fa27c5","source-abc300-editorial-6279-c63fd978778493f959f6e294f89bff61afe306d587bf48a2cc19ca5eaa2ca9dd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

diceの1は状態nを変えないself-loopなので移項するとdp(n)=(dp(2n)+…+dp(6n))/5となり、再帰先は常に増える。 目4,6も素因数2,3だけなので到達値の素因数集合は{2,3,5}から増えない。

採用する候補: 2,3,5-smooth状態だけのメモ化再帰

1から到達するnは2^a3^b5^cに限られN以下でも約6万状態なので、巨大Nでも疎にDPできる。

棄却する候補: 1..Nの配列DP

Nは10^18で確保不能。

目4,6も素因数2,3だけなので到達値の素因数集合は{2,3,5}から増えない。

dp(N)=1、n>Nは0とし、未計算nを2..6倍先へ再帰して和/5を返す。dp(1)を法998244353で出力する。

## 典型の発動条件

### 疎状態メモ化DP

発動条件: 値域は巨大だが乗法遷移で到達状態が少ない。

smooth数だけmapにmemoする。

### 自己ループを除いた到達確率方程式

発動条件: 遷移に同じ状態が含まれる。

自己項を左辺へ移してDAG状遷移にする。

## 問題固有の要素

数値上限でなく到達値の素因数指数を数えることで状態数を評価できる。

別の問題へ持ち帰る視点: 乗法過程は生成素因数による疎状態を探す。

## 正当性

一回の出目1は値不変の自己loopで、その項を移すと2..6の確率平均1/5になる。全依存先は現在値より大きく、N到達1、超過0から再帰評価できる。乗法状態は素因数2,3,5しか含まず疎memoで全到達値を覆う。

## 実装上の注意

- n*kのoverflow前にn>N/kを判定し、n=Nをn≥Nの0条件より先に処理する。

## 復習の核

- 小Nの状態方程式と比較し、Nに7以上の素因数がある0例、N=2、self-loop係数を確認する。

## 計算量と制約

### 時間

N以下の2^a3^b5^c状態数S=O((log N)³)。memoで O(S)。

### 空間

memo O(S)、再帰深さ O(log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^{18}; N is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/tasks/abc300_e) — source-abc300-e-problem-a38ec87a7c321ea6f527b93db8330fb37309527e8eba47c2e47dddd381fa27c5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc300/editorial/6279) — source-abc300-editorial-6279-c63fd978778493f959f6e294f89bff61afe306d587bf48a2cc19ca5eaa2ca9dd
