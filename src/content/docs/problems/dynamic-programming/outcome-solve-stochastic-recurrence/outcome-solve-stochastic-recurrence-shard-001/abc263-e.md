---
title: "ABC263-E — Sugoroku 3"
draft: true
authoringUnit: {"problemId":"abc263-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc263-e.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-transition-acceleration","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc263-e-problem-eef4590c663d3faba07d180145406aac13d7d7c43bf20125fb419d5f195586f2","source-abc263-editorial-4546-50da0faeb7c80a60d2182c11cba30b7434a8e34da04c987b8c7eb076641af9a4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"位置iからの一手は0..A_iの等確率で、0は自己ループである。期待値E_iは1+(E_i+Σ_{k=1}^{A_i}E_{i+k})/(A_i+1)を満たす。自己ループを移項するとE_i=(A_i+1+ΣE_{i+k})/A_iとなり、右側はiより右の値だけなので終点E_N=0から逆順に求められる。累積和はこの連続区間の和を正確に保持するため、自己ループを除外した単純平均と違って一手の失敗も数えている。","sourceRevisionIds":["source-abc263-e-problem-eef4590c663d3faba07d180145406aac13d7d7c43bf20125fb419d5f195586f2","source-abc263-editorial-4546-50da0faeb7c80a60d2182c11cba30b7434a8e34da04c987b8c7eb076641af9a4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

dp[i] を i から終点までの期待試行回数とすると、0 の目による自己ループのため遷移式の右辺にも dp[i] が現れる。

正の目で遷移する先は連続区間 i＋1,…,i＋A_i なので、後ろから計算する際に区間和だけ高速に得ればよい。

棄却する候補: 0 が出る回数を確率付きで無限級数として列挙し、各マスで直接和を取る。

級数は閉形式へ整理できるため無限項を扱う必要がなく、遷移先の区間和も毎回走査できない。

採用する候補: 期待値方程式から自己ループ項を左辺へ移し、dp[i]=(A_i＋1＋Σ_{j=1}^{A_i}dp[i+j])/A_i を suffix sum で後ろから計算する。

依存先が全て大きい添字になり、連続和と法逆元だけで各状態を確定できる。

dp[i]=1+(dp[i]+Σnext)/(A_i＋1) を解くと、停止しない0の目の寄与も有限な代数式へ吸収される。

確率DPの self-loop を一次方程式として消去し、range-sum optimized backward expectation DP に変える。

## 典型の発動条件

### 自己ループを含む期待値方程式

発動条件: 一回の試行で同じ状態に戻る確率があり、終了までの期待回数を求めるとき。

未知の期待値を両辺に置き、自己ループ係数を左辺へ移して解く。

### DP遷移区間の累積和

発動条件: 各状態が連続する将来状態の総和・平均に依存するとき。

suffix sum を保ち、i＋1 から i＋A_i の和を差で取得する。

## 問題固有の要素

0 が続く回数の期待値は 1/A_i であり、「正の目が出るまでの余分な試行」と見ても同じ遷移式を導ける。

別の問題へ持ち帰る視点: 自己ループは方程式で消す方法と、成功までの幾何分布へまとめる方法の両方で検算する。

## 正当性

位置iからの一手は0..A_iの等確率で、0は自己ループである。期待値E_iは1+(E_i+Σ_{k=1}^{A_i}E_{i+k})/(A_i+1)を満たす。自己ループを移項するとE_i=(A_i+1+ΣE_{i+k})/A_iとなり、右側はiより右の値だけなので終点E_N=0から逆順に求められる。累積和はこの連続区間の和を正確に保持するため、自己ループを除外した単純平均と違って一手の失敗も数えている。

## 実装上の注意

- dp[N]=0 とし、suffix sum の添字 i＋A_i が N を超えないという制約を利用して後ろ向きに更新する。
- 除算 A_i は modulo 998244353 の逆元を掛け、引き算を含む区間和を非負に正規化する。

## 復習の核

- 期待値DPに自分自身が現れたら循環と捉えず、まず一次方程式として未知項を分離する。
- 等確率な連続遷移先の平均は、DP本体より先に累積和で定数時間取得できる形へする。

## 計算量と制約

### 時間

O(N)、逆順DPとsuffix/range sum、逆元前計算。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2 \times 10^5; 1 \le A_i \le N-i(1 \le i \le N-1); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/tasks/abc263_e) — source-abc263-e-problem-eef4590c663d3faba07d180145406aac13d7d7c43bf20125fb419d5f195586f2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/editorial/4546) — source-abc263-editorial-4546-50da0faeb7c80a60d2182c11cba30b7434a8e34da04c987b8c7eb076641af9a4
