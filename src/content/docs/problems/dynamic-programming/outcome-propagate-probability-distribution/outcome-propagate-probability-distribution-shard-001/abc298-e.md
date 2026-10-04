---
title: "ABC298-E — Unfair Sugoroku"
draft: true
authoringUnit: {"problemId":"abc298-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc298-e.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc298-e-problem-5852dc6c338f2ccff6bd2385849a81c0ee563b813396f416b99683e1127bd9ff","source-abc298-editorial-6216-3e17008c42c2f5d640bcceb6616609643f0d97853747e55e48acc61dac404c8a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各手番で全dice遷移先の勝率を平均する。先にgoalした側の勝敗は確定し、非終端遷移は少なくとも一位置が増えるから降順の二位置で依存先を先に計算できる。手番を持つことで先手優位も正確に反映する。","sourceRevisionIds":["source-abc298-e-problem-5852dc6c338f2ccff6bd2385849a81c0ee563b813396f416b99683e1127bd9ff","source-abc298-editorial-6216-3e17008c42c2f5d640bcceb6616609643f0d97853747e55e48acc61dac404c8a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

盤面位置は各手番で増えるだけなので、両者の位置(i,j)と次手番だけを持つ勝率DPをN側から逆順に解ける。高橋手番では遷移先勝率の平均、青木手番でも高橋勝率の平均であり、終端N到達だけ0/1に固定すればよい。

採用する候補: 手番付き二次元期待値DP

各状態の遷移先は少なくとも一方の位置が大きく、終端勝敗から後退計算できる。

棄却する候補: ゲーム木を全出目列挙

終了までの分岐が指数的。

dp[i][j][turn]をi,j降順に計算し、高橋手番はk=1..P、青木手番はk=1..Qの遷移平均を法逆元で取る。dp[A][B][0]を出す。

## 典型の発動条件

### 吸収確率DP

発動条件: 単調に終端へ進む確率ゲーム。

終端勝敗を固定し遷移確率の加重平均を逆順計算する。

## 問題固有の要素

交互手番もturnを一状態追加するだけで、位置単調性が循環のない期待値方程式にする。

別の問題へ持ち帰る視点: 単調確率過程は状態順序を見つけてDPする。

## 正当性

各手番で全dice遷移先の勝率を平均する。先にgoalした側の勝敗は確定し、非終端遷移は少なくとも一位置が増えるから降順の二位置で依存先を先に計算できる。手番を持つことで先手優位も正確に反映する。

## 実装上の注意

- min(i+k,N)でovershootをNへ止め、高橋が既にNなら1、青木がNなら0の基底優先度を統一する。

## 復習の核

- 小Nの連立/全確率展開と比較し、P,Q=1、開始点隣接、同一roundで両者が届き得る例を確認する。

## 計算量と制約

### 時間

終点N、dice面数P,Q。二位置手番状態 O(N²(P+Q))。

### 空間

位置pair×turn O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 100; 1 \leq A, B < N; 1 \leq P, Q \leq 10; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/tasks/abc298_e) — source-abc298-e-problem-5852dc6c338f2ccff6bd2385849a81c0ee563b813396f416b99683e1127bd9ff
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/editorial/6216) — source-abc298-editorial-6216-3e17008c42c2f5d640bcceb6616609643f0d97853747e55e48acc61dac404c8a
