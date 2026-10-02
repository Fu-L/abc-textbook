---
title: "ABC293-G — Triple Index"
draft: true
authoringUnit: {"problemId":"abc293-g","docPath":"src/content/docs/problems/data-structures/outcome-schedule-range-query-updates/outcome-schedule-range-query-updates-shard-001/abc293-g.md","learningOutcomeIds":["outcome-schedule-range-query-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンラインのpriority queue・multiset、および単調stack・queue。"],"tagIds":["tag-mo-offline-range"],"sourceRevisionIds":["source-abc293-editorial-5947-521de1ac63f5adc46869cbc5a4afac67b6cb0cc2757590c8211288fd0f5561c8","source-abc293-g-problem-a415ae157c4931a162c6f1e20e5dd417d648595dbe7573e4ea2ecb325b7fa3f9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"答えΣ_x C(cnt_x,3)を直接持てば、追加前cntのC(cnt,2)を足し、削除後のcntに対する同値を引くだけでよい。 全質問が事前にあり、左右端一歩の追加削除がO(1)なので総移動量を約N√Qへ抑えられる。","sourceRevisionIds":["source-abc293-editorial-5947-521de1ac63f5adc46869cbc5a4afac67b6cb0cc2757590c8211288fd0f5561c8","source-abc293-g-problem-a415ae157c4931a162c6f1e20e5dd417d648595dbe7573e4ea2ecb325b7fa3f9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Moの順序で区間問い合わせの差分を更新する](src/content/docs/learn/query/mo-offline-range.md)

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- オンラインのpriority queue・multiset、および単調stack・queue。

## 考察

区間に値xを一個追加すると同値三つ組はC(cnt_x,2)個増え、削除時も逆順で定数時間更新できる。

採用する候補: Mo's algorithmで区間端を並べ替える

全質問が事前にあり、左右端一歩の追加削除がO(1)なので総移動量を約N√Qへ抑えられる。

棄却する候補: 各質問で頻度を数え直す

区間長の総和がO(NQ)になり得る。

答えΣ_x C(cnt_x,3)を直接持てば、追加前cntのC(cnt,2)を足し、削除後のcntに対する同値を引くだけでよい。

質問を左端blockと右端順でソートし、現在区間を伸縮しながらfreq[A_i]と三つ組数を差分更新して元の質問順へ答える。

## 典型の発動条件

### Mo's algorithm

発動条件: 静的配列の多数区間質問で端点一歩更新が軽い。

質問順をblock分割で並べ替えて区間移動を共有する。

### 組合せ数の差分

発動条件: 頻度cに一要素を加えた統計量C(c,3)の変化を知りたい。

C(c+1,3)-C(c,3)=C(c,2)を使う。

## 問題固有の要素

三重ループをせず、値別頻度の三項組合せ和をオンライン維持できる。

別の問題へ持ち帰る視点: 区間内k組数は追加時に既存(k-1)組数を足す。

## 正当性

答えΣ_x C(cnt_x,3)を直接持てば、追加前cntのC(cnt,2)を足し、削除後のcntに対する同値を引くだけでよい。 全質問が事前にあり、左右端一歩の追加削除がO(1)なので総移動量を約N√Qへ抑えられる。

## 実装上の注意

- 追加と削除のfreq更新順を逆にし、答えは64ビットで保持する。

## 復習の核

- 素朴三重ループと照合し、全同値・全相異・長さ3未満・同じ区間の重複質問を確認する。

## 計算量と制約

### 時間

O(Q log Q+QB+N²/B)、B≈N/√Qで移動O(N√Q+Q)。 左端block幅Bでは左端の移動がO(QB)、右端は高々N/B個のblockで各O(N)なのでO(N²/B)。B=max(1,⌊N/√Q⌋)で均衡させる。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq A_i \leq 2 \times 10^5; 1 \leq l_q \leq r_q \leq N; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/editorial/5947) — source-abc293-editorial-5947-521de1ac63f5adc46869cbc5a4afac67b6cb0cc2757590c8211288fd0f5561c8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/tasks/abc293_g) — source-abc293-g-problem-a415ae157c4931a162c6f1e20e5dd417d648595dbe7573e4ea2ecb325b7fa3f9
