---
title: "ABC372-F — Teleporting Takahashi 2"
draft: true
authoringUnit: {"problemId":"abc372-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-normalize-common-dp-action/outcome-normalize-common-dp-action-shard-001/abc372-f.md","learningOutcomeIds":["outcome-normalize-common-dp-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc372-editorial-10969-ee25597f59d2400ce6fd5335a2a3770e021095d149183b0aae43dea85c7377e5","source-abc372-f-problem-366da97398328238081e7fb0103fadbb1a66db6aa87bc7a830dce59f00c28490"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"cycle通常遷移は全分布の一位置shiftなので配列viewのoffset変更だけで表せる。追加辺寄与はshift前のsource値から加える。全source値を退避してから加算すれば同手内の追加寄与の再利用を防ぎ、各層の通常DPと完全一致する。","sourceRevisionIds":["source-abc372-editorial-10969-ee25597f59d2400ce6fd5335a2a3770e021095d149183b0aae43dea85c7377e5","source-abc372-f-problem-366da97398328238081e7fb0103fadbb1a66db6aa87bc7a830dce59f00c28490"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

通常のcycle辺だけなら分布は一つ隣へ循環shiftする。配列値を毎回コピーせず、論理offsetをずらせばよい。追加辺はM≤50本なので、各手で旧dpのsourceを退避して差分だけ加える。

初期状態は頂点1だけ1、他は0。K回更新した後、全頂点のdpを足した値を出力する。

採用する候補: DP配列の始点を毎手ずらし、追加辺の寄与だけを更新する。

通常遷移N本のコピーを省け、全体をO(N+MK)にできる。

棄却する候補: 全辺を各手で緩和する通常DP。

N,Kがともに2×10^5でO(NK)は不可能。

## 典型の発動条件

### inline DP

発動条件: 大部分の遷移が単なる shift で、各段で異なる箇所が少数のとき。

配列をコピーせず添字対応をずらし、例外遷移だけ差分更新する。

## 問題固有の要素

遷移式を図として一段ずらすと、二つの DP 列の差が疎であることが見える。

別の問題へ持ち帰る視点: ほぼ permutation の遷移では値の移動を省き、座標系そのものを動かす。

## 正当性

cycle通常遷移は全分布の一位置shiftなので配列viewのoffset変更だけで表せる。追加辺寄与はshift前のsource値から加える。全source値を退避してから加算すれば同手内の追加寄与の再利用を防ぎ、各層の通常DPと完全一致する。

## 実装上の注意

- 追加辺の全寄与は同じ時刻の旧 dp から読む必要がある。通常の cycle 辺と重複する追加辺はないが、複数辺の加算順で新値を再利用しない。

## 復習の核

- dp の二段を紙に一列ずつずらして重ね、どのセルだけが通常 shift と異なるかを発見する練習をする。

## 計算量と制約

### 時間

N cycle頂点、M追加辺、K手。offset shiftと追加辺処理で O(N+MK)。

### 空間

循環配列O(N)（線形offset配列実装はO(N+K)）、追加辺O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq M \leq 50; 1 \leq K \leq 2 \times 10^5; 1 \leq X_i, Y_i \leq N, X_i \neq Y_i; All of the N+M directed edges are distinct.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/editorial/10969) — source-abc372-editorial-10969-ee25597f59d2400ce6fd5335a2a3770e021095d149183b0aae43dea85c7377e5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/tasks/abc372_f) — source-abc372-f-problem-366da97398328238081e7fb0103fadbb1a66db6aa87bc7a830dce59f00c28490
