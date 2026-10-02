---
title: "ABC374-E — Sensor Optimization Dilemma 2"
draft: true
authoringUnit: {"problemId":"abc374-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc374-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc374-e-problem-1d99812ee638b9685e30325b4809f89b5eb6bb84f6fd5f3f73865aff698564ec","source-abc374-editorial-11094-1a058ec84dd88b6c561defb3cb8b227508261f266a39c56e1d5daef6b84ea2c1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"B_i 台の能力 A_i の機械と A_i 台の能力 B_i の機械はどちらも能力 A_iB_i で、費用の安い束へ交換できる。 従って最適解には S≤B_i または T≤A_i の表現があり、片方を全探索して他方を不足能力から一意に最小化できる。 最適解では交換可能な二束の高い方を除けるため、少なくとも片方の台数が小さい範囲に入り、一判定 O(Σ(A_i+B_i)) になる。","sourceRevisionIds":["source-abc374-e-problem-1d99812ee638b9685e30325b4809f89b5eb6bb84f6fd5f3f73865aff698564ec","source-abc374-editorial-11094-1a058ec84dd88b6c561defb3cb8b227508261f266a39c56e1d5daef6b84ea2c1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

全工程の最小能力 W を最大化するので、目標 w の達成可能性は単調である。工程ごとは二種類の機械台数の非負整数最適化だが、同じ能力 A_iB_i を作る二つの束を交換できる。

採用する候補: 答え w を二分探索し、各工程では S を0..B_i台または T を0..A_i台に限定して不足分を ceil で補い、最小費用を求める。

最適解では交換可能な二束の高い方を除けるため、少なくとも片方の台数が小さい範囲に入り、一判定 O(Σ(A_i+B_i)) になる。

棄却する候補: 各工程で二種類の機械台数を目標能力 w まで二重全探索する。

w は10^9級で二重探索範囲も大きく、工程数100と二分探索を重ねると間に合わない。

B_i 台の能力 A_i の機械と A_i 台の能力 B_i の機械はどちらも能力 A_iB_i で、費用の安い束へ交換できる。

従って最適解には S≤B_i または T≤A_i の表現があり、片方を全探索して他方を不足能力から一意に最小化できる。

w の上下界を決め打ち二分探索する。各工程で二方向の小範囲全探索から min(P_i s+Q_i ceil(max(0,w-A_i s)/B_i)) を求め、総費用が X を超えた時点で不可とする。

## 典型の発動条件

### 最大値の最小化に対する二分探索

発動条件: 全構成要素が目標値以上という条件で、目標を上げるほど難しくなるとき。

目標能力 w の予算内可否を判定する。

### 交換可能な束による探索制限

発動条件: 二資源の整数組合せで同じ効果を持つ束があるとき。

高価な束を交換し、片方の個数が周期未満の最適解を保証する。

## 問題固有の要素

整数二変数最適化を愚直に解かず、等価能力を持つ二束の交換論法で基本領域へ折り畳む。

別の問題へ持ち帰る視点: 二分探索の判定内で独立な工程の最小費用を足す構造を見抜く。

## 正当性

B_i 台の能力 A_i の機械と A_i 台の能力 B_i の機械はどちらも能力 A_iB_i で、費用の安い束へ交換できる。 従って最適解には S≤B_i または T≤A_i の表現があり、片方を全探索して他方を不足能力から一意に最小化できる。 最適解では交換可能な二束の高い方を除けるため、少なくとも片方の台数が小さい範囲に入り、一判定 O(Σ(A_i+B_i)) になる。

## 実装上の注意

- 費用総和は X を超えたら打ち切り overflow を避ける。w=0、ceil の不足量0、二方向探索の重複は問題なく min を取る。

## 復習の核

- 「両方の台数が上限より大きい最適解」を仮定し、どちらの束へ交換すれば矛盾するかを費用比較込みで説明する。

## 計算量と制約

### 時間

O(log W·Σ(A_i+B_i))、Wは最大生産量探索上限、各工程二方向の小範囲全探索。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 100; 1 \le A_i,B_i \le 100; 1 \le P_i,Q_i,X \le 10^7

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/tasks/abc374_e) — source-abc374-e-problem-1d99812ee638b9685e30325b4809f89b5eb6bb84f6fd5f3f73865aff698564ec
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/editorial/11094) — source-abc374-editorial-11094-1a058ec84dd88b6c561defb3cb8b227508261f266a39c56e1d5daef6b84ea2c1
