---
title: "ABC297-G — Constrained Nim 2"
draft: true
authoringUnit: {"problemId":"abc297-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc297-g.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp"],"sourceRevisionIds":["source-abc297-editorial-6172-bc1a41b391eda2ee80b27fae0e97e1f35e7b36b6ad06304ce6c9713ad4a7fd02","source-abc297-g-problem-5d7a9c2f2ffc60d29655b1e25594340a96613402eb03bbc0acfadfe94086087d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"g(x)=floor((x mod(L+R))/L)を候補とする。x<Lなら合法手がなく候補は0である。x≥Lでは、減少量L..min(R,x)によって到達する剰余区間を、周期境界とLごとの値区間で分けると、候補自身は現れず、候補より小さい全値が少なくとも一回現れる。したがってそのmexは候補値に等しく、小さいxからの帰納法で式が成立する。各山の独立な手は一山だけを変えるので、合成Grundyはxorとなり、0か否かが後手/先手勝ちを決める。","sourceRevisionIds":["source-abc297-editorial-6172-bc1a41b391eda2ee80b27fae0e97e1f35e7b36b6ad06304ce6c9713ad4a7fd02","source-abc297-g-problem-5d7a9c2f2ffc60d29655b1e25594340a96613402eb03bbc0acfadfe94086087d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

山xのGrundy数を小さい範囲で実験すると、周期L+Rの中で長さLごとに0,1,…と増える形になる。

採用する候補: 閉形式g(x)=floor((x mod(L+R))/L)を証明してxor

一周期内のmexと遷移区間を確認し、遷移先Grundy集合が周期的に同じになるため全xへ拡張できる。

棄却する候補: 各xまでGrundy DP

A_iは10^9で全状態を計算できない。

許される減少量[L,R]が長さR-L+1の連続区間なので、直前Grundy値集合が一周期ごとに同じmex構造を作る。

各山でr=A_i mod(L+R)、g=floor(r/L)を計算してxorし、0ならSecond、非0ならFirstとする。

## 典型の発動条件

### Sprague-Grundy xor

発動条件: 独立な複数山の不偏ゲーム。

各山のGrundy数をxorする。

### Grundy列の周期発見と証明

発動条件: 遷移が固定長区間で値域が巨大。

小実験から周期候補を得てmex集合で示す。

## 問題固有の要素

連続区間だけ石を取れるゲームでは、L+R周期とL幅の段階値が現れる。

別の問題へ持ち帰る視点: 区間遷移ゲームはmex列の周期性を実験・証明する。

## 正当性

g(x)=floor((x mod(L+R))/L)を候補とする。x<Lなら合法手がなく候補は0である。x≥Lでは、減少量L..min(R,x)によって到達する剰余区間を、周期境界とLごとの値区間で分けると、候補自身は現れず、候補より小さい全値が少なくとも一回現れる。したがってそのmexは候補値に等しく、小さいxからの帰納法で式が成立する。各山の独立な手は一山だけを変えるので、合成Grundyはxorとなり、0か否かが後手/先手勝ちを決める。

## 実装上の注意

- L+RとA_iは64ビットで計算し、R≥Lでも式の商範囲を決め打ちしない。

## 復習の核

- 小Aまで素朴mexと比較し、周期境界L+R-1/L+R、L=Rを確認する。

## 計算量と制約

### 時間

O(N)、各山をmod(L+R)してxor。

### 空間

O(1)補助。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 1\leq L \leq R \leq 10^9; 1\leq A_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/editorial/6172) — source-abc297-editorial-6172-bc1a41b391eda2ee80b27fae0e97e1f35e7b36b6ad06304ce6c9713ad4a7fd02
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/tasks/abc297_g) — source-abc297-g-problem-5d7a9c2f2ffc60d29655b1e25594340a96613402eb03bbc0acfadfe94086087d
