---
title: "ABC470 E — Concentration"
draft: true
authoringUnit: {"problemId":"abc470-e","docPath":"src/content/docs/problems/updates/abc470-e.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-stochastic-expectation-dp"],"sourceRevisionIds":["source-abc470-e-problem-60c7e1932b98b8c399a4f4c5d57d830349dd24ccfb3baa850ef0665985c4c0f0","source-abc470-editorial-23855-7c036556e435fa680595205a6d49725699d7c1f6c66a9914872c23d19f8cd39f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"既知ペアの即回収は得点・ライフ・情報を悪化させず、回収できない時の未知カード選択は既知カード選択より情報を減らさない。残る未知配置は一様で、四つの分岐確率は全事象を排反に覆う。条件付き期待値を状態Fへ戻す式は全期待値の法則で正当化できる。対称性からペアの値の平均を最後に掛けられる。","sourceRevisionIds":["source-abc470-e-problem-60c7e1932b98b8c399a4f4c5d57d830349dd24ccfb3baa850ef0665985c4c0f0","source-abc470-editorial-23855-7c036556e435fa680595205a6d49725699d7c1f6c66a9914872c23d19f8cd39f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

## 考察

カード位置を全部状態にすると指数個になるが、未知カードは条件付きで一様な配置なので、既知のペアを回収した後は『完全未知のペア数a、片方だけ既知のペア数b、残りライフl』だけで状況を表せる。ペアを既知にしているなら失敗リスクなしで回収でき、先送りしても情報は増えない。ペアが作れなければ未知カードを選ぶことで新情報を最大化できる。数値A_iを見て特定のペアを優先する必要はない。

F(l,a,b)を今後回収するペア数の期待値とする。未知カードはu=2a+b枚。一枚目が片既知ペアの相方である確率はb/uで、その場で回収し 1+F(l,a,b−1)。一枚目が完全未知ペアなら確率2a/uで、その相方を含め二枚目も未知から取る。相方を引く確率1/(u−1)では 1+F(l,a−1,b)。別の完全未知ペアを引く確率2(a−1)/(u−1)では F(l−1,a−2,b+2)。片既知ペアの相方を引く確率b/(u−1)では失敗してライフが減るが、l>1なら次ターンでその既知ペアを回収でき、1+F(l−1,a−1,b)。l=1ならゲームが直ちに終わるので、この枝の値は0。

F(0,a,b)=0、F(l,0,b)=b (l>0)。a=0では未知カードを一枚見れば必ず既知相方と回収できる。各遷移で未知カード数uが減るのでメモ化が停止する。初期の期待ペア数はF(L,N,0)。値に依存しない対称な戦略により各ペアの獲得確率が等しく、期待得点はF(L,N,0)×ΣA_i/Nとなる。

## 典型の発動条件

交換可能な未知要素を個数へ圧縮し、決定的に回収できるものを状態から除く。確率DPは戦略の支配を先に証明してから分岐する。

## 問題固有の要素

最後のライフを失った直後は、二枚目で既知になったペアを次ターンに回収できない。

## 正当性

既知ペアの即回収は得点・ライフ・情報を悪化させず、回収できない時の未知カード選択は既知カード選択より情報を減らさない。残る未知配置は一様で、四つの分岐確率は全事象を排反に覆う。条件付き期待値を状態Fへ戻す式は全期待値の法則で正当化できる。対称性からペアの値の平均を最後に掛けられる。

## 実装上の注意

u−1で割る枝はa>0の時だけ使う。bの上限とa+b≤Nを守り、浮動小数点で期待値を計算する。

## 復習の核

確率が計算できるだけでは十分でない。なぜ値を見た別戦略が上回らないかと、ゲーム終了の時点を確かめる。

## 計算量と制約

### 時間

ライフLとa,bの O(LN²) 状態、各状態定数遷移で O(LN²)。

### 空間

メモ表 O(LN²)。到達しない状態は省ける。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 200; 1 \leq L \leq 200; 1 \leq A_1 < A_2 < \dots < A_N \leq 10^5; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc470/tasks/abc470_e)
- [公式解説](https://atcoder.jp/contests/abc470/editorial/23855)
