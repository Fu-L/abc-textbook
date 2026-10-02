---
title: "ABC421-E — Yacht"
draft: true
authoringUnit: {"problemId":"abc421-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-optimize-stochastic-actions/outcome-optimize-stochastic-actions-shard-001/abc421-e.md","learningOutcomeIds":["outcome-optimize-stochastic-actions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-normalization"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-state-normalization"],"sourceRevisionIds":["source-abc421-e-problem-004c6251d80a7f4907fed4b1c3aaa5783078d1cdd19063600de8bfa61402589e","source-abc421-editorial-13731-a00fc8b5577348b07e11c5ce24fb1c87bdf1be6a9323e4b8276408a3f0c6ae63"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"保持済み出目と残roll数が将来分布と合法keepを全て決める。最終roll後の得点はmax_x(x×個数)。各roll結果を等確率で列挙し、その結果を見てからkeep subsetの最大値を取る順序が意思決定と一致する。既保持diceは外せないので、次状態へ追加keepだけを加える。残roll数の帰納法で最適期待値を得る。同値faceも六面の別結果として確率を保つ。","sourceRevisionIds":["source-abc421-e-problem-004c6251d80a7f4907fed4b1c3aaa5783078d1cdd19063600de8bfa61402589e","source-abc421-editorial-13731-a00fc8b5577348b07e11c5ce24fb1c87bdf1be6a9323e4b8276408a3f0c6ae63"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

keep済みdiceの出目multisetと残りroll回数だけで将来の最適期待scoreが決まる。diceは5個、rollは3回だけなので、全出目とkeep subsetを列挙できる。 最終scoreは出目xの個数×xの最大値。途中では未keep diceの全6^r結果Pごとに、Pの全subset Tからf(k-1,S∪T)最大を選び、その期待値を取る。

採用する候補: f(k,S)のmemoized expectation DP

同じheld multisetの将来を共有し、各roll結果で最適keepを選ぶBellman式を直接評価できる。

棄却する候補: 各diceを特定の値になるまで固定するgreedy

face値と残り回数により別の目を混在keepする価値が変わり、局所規則では最適性がない。

最終scoreは出目xの個数×xの最大値。途中では未keep diceの全6^r結果Pごとに、Pの全subset Tからf(k-1,S∪T)最大を選び、その期待値を取る。

held multisetをsort tupleでcanonical化し、f(1,S)は残diceを一回振ったscore平均、f(k,S)は各result tupleに対するkeep subset最大の平均としてmemoする。答えはf(3,empty)。

## 典型の発動条件

### 有限horizon確率DP

発動条件: 観測後にactionを選べ、残りstepと保持情報が小さい。

chance nodeで確率平均、decision nodeで最大を交互に取る。

### multiset state圧縮

発動条件: dice個体は同一で、将来は保持値の個数だけに依存する。

保持出目をsorted tuple/count vectorへ正規化する。

## 問題固有の要素

同じroll結果でもどのdice個体をkeepしたかは不要で、値multisetだけをmemo keyにすればstateを大幅に共有できる。

別の問題へ持ち帰る視点: 交換可能な個体の確率DPは個体labelを捨てfrequency stateへ圧縮する。

## 正当性

保持済み出目と残roll数が将来分布と合法keepを全て決める。最終roll後の得点はmax_x(x×個数)。各roll結果を等確率で列挙し、その結果を見てからkeep subsetの最大値を取る順序が意思決定と一致する。既保持diceは外せないので、次状態へ追加keepだけを加える。残roll数の帰納法で最適期待値を得る。同値faceも六面の別結果として確率を保つ。

## 実装上の注意

- 重複face値がある場合も6 faceを等確率として列挙し、同じmultisetへ確率を正しく合算する。

## 復習の核

- 全face同値、最大値だけkeepが不利な例を全strategy列挙と比較する。

## 計算量と制約

### 時間

D=5 dice、面 F=6、roll R=3。held size h別に multiset状態 C(F+h−1,h)、O(R·Σ_{h=0}^D C(F+h−1,h)F^(D−h)2^(D−h)D log(D+1)) の直接列挙。D,F,Rは固定なので入力サイズに対し定数時間。

### 空間

held multiset memo は O(R·C(F+D,D))、一時結果とsubsetは O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: A_i is an integer between 1 and 100, inclusive.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc421/tasks/abc421_e) — source-abc421-e-problem-004c6251d80a7f4907fed4b1c3aaa5783078d1cdd19063600de8bfa61402589e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc421/editorial/13731) — source-abc421-editorial-13731-a00fc8b5577348b07e11c5ce24fb1c87bdf1be6a9323e4b8276408a3f0c6ae63
