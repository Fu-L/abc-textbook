---
title: "ABC314-E — Roulettes"
draft: true
authoringUnit: {"problemId":"abc314-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc314-e.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc314-e-problem-9c1f2c4e116a29222661a3bac6c5d20fb485a8f1e886cc0600bd562106db0231","source-abc314-editorial-6956-1cac01b30607302e095c5960e9c250c8aa1588d44a99d3b56029134afc04c731"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"0出目は同状態を繰り返す。固定rouletteを選ぶBellman式の自己項を移項すると有効cost C_iP_i/(P_i−Z_i)と非零出目平均になる。全依存先が目標へ近いので後退DPしroulette最小を取ると最適策略が得られる。全零rouletteは進めず候補外。","sourceRevisionIds":["source-abc314-e-problem-9c1f2c4e116a29222661a3bac6c5d20fb485a8f1e886cc0600bd562106db0231","source-abc314-editorial-6956-1cac01b30607302e095c5960e9c250c8aa1588d44a99d3b56029134afc04c731"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

残り必要点が r の時点からの最小期待費用だけで将来が決まり、出目が正なら r の小さい状態から順に Bellman 値を確定できる。 0 点の出目は同じ状態への self-loop になる。そのまま式の右辺に未知 e_r が残るが、非0が出るまで同じルーレットを回す試行へまとめれば消せる。 P 個中 Z 個が0なら非0を得るまでの回数期待値は P/(P−Z) で、実効コストは C·P/(P−Z)、非0出目は一様である。 状態 i で特定 roulette j を選ぶ値は実効コスト＋非0出目先 e_{i+s} の平均であり、その最小が Bellman 最適性を満たす。

採用する候補: 0 出目を除いた条件付きルーレットへ期待コストを補正し、残り点数の後ろ向き DP で各状態の最良ルーレットを選ぶ。

全遷移がより目標に近い既計算状態へ進み、各状態・各ルーレットの期待値を直接比較できる。

棄却する候補: 各履歴を状態として、ルーレット選択と出目を含む決定木を探索する。

履歴は無限に伸び得るが、最適行動は累積点だけで決まる Markov 性を利用していない。

P 個中 Z 個が0なら非0を得るまでの回数期待値は P/(P−Z) で、実効コストは C·P/(P−Z)、非0出目は一様である。

状態 i で特定 roulette j を選ぶ値は実効コスト＋非0出目先 e_{i+s} の平均であり、その最小が Bellman 最適性を満たす。

各 roulette から0を除き cost_i=C_i P_i/(P_i−Z_i) を作る。e[p]=0 (p≥M) とし p=M−1..0 の順に、全 roulette の cost_i+非0出目に対する e[min(M,p+s)] の平均を計算し最小を e[p] とする。e[0] を出力する。

## 典型の発動条件

### 自己ループを含む期待値 DP

発動条件: 試行結果に状態不変があり、成功まで同じ選択を続けられるとき。

幾何分布の期待回数で self-loop を消去し、進む遷移だけの実効操作へ置換する。

### 確率的最短路の Bellman 最適化

発動条件: 現在状態から行動を選び、その後の確率遷移に応じて追加費用が決まるとき。

各行動の即時費用＋次状態価値の期待値を比較する。

## 問題固有の要素

0 が出た後に別 roulette へ変える必要はなく、同じ状態で改めて最適行動を選ぶ Bellman 方程式を解けば実効コスト式と一致する。

別の問題へ持ち帰る視点: 期待値式の右辺に自分自身が現れたら、係数を移項するか成功までの geometric trial として解消する。

## 正当性

0出目は同状態を繰り返す。固定rouletteを選ぶBellman式の自己項を移項すると有効cost C_iP_i/(P_i−Z_i)と非零出目平均になる。全依存先が目標へ近いので後退DPしroulette最小を取ると最適策略が得られる。全零rouletteは進めず候補外。

## 実装上の注意

- 非0個数 P−Z は問題制約で正。平均の分母を元 P ではなく非0個数にし、実効 cost の補正と二重に確率を掛けない。

## 復習の核

- まず e_i の Bellman 方程式を書き、0出目の e_i 項を実際に左辺へ移す。行動が履歴でなく現在点だけに依存してよい理由も確認する。

## 計算量と制約

### 時間

目標M、roulette数N、全出目数L=ΣP_i。期待値DP O(ML)。

### 空間

roulette入力O(L)、期待値O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 100; 1\leq M\leq 100; 1\leq C _ i\leq 10 ^ 4\ (1\leq i\leq N); 1\leq P _ i\leq 100\ (1\leq i\leq N); 0\leq S _ {i,j}\leq M\ (1\leq i\leq N,1\leq j\leq P _ i); \displaystyle\sum _ {j=1}^{P _ i}S _ {i,j}\gt0\ (1\leq i\leq N); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/tasks/abc314_e) — source-abc314-e-problem-9c1f2c4e116a29222661a3bac6c5d20fb485a8f1e886cc0600bd562106db0231
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc314/editorial/6956) — source-abc314-editorial-6956-1cac01b30607302e095c5960e9c250c8aa1588d44a99d3b56029134afc04c731
