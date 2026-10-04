---
title: "ABC322-F — Vacation Query"
draft: true
authoringUnit: {"problemId":"abc322-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc322-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc322-editorial-7303-78eb3ac0025e62afd734563853884e0cc2d27e7d0f8706015f4fb8f1cc14a71d","source-abc322-f-problem-00617dfda1bb35d2bd1170644c1a944cd547c3359c166bec98e45285c40a7563"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"左右node A,Bのbest[b]はmax(A.best[b],B.best[b],A.suffix[b]+B.prefix[b])である。 prefix[b]はA全体がbならA.len+B.prefix[b]、そうでなければA.prefix[b]で、suffixも対称に求まる。 flip mappingはprefix[0]↔prefix[1]、suffix[0]↔suffix[1]、best[0]↔best[1]をswapしlenを保つ。 range反転とrange最長1-runの両方を対数時間で処理でき、merge・mapping・compositionが閉じる。","sourceRevisionIds":["source-abc322-editorial-7303-78eb3ac0025e62afd734563853884e0cc2d27e7d0f8706015f4fb8f1cc14a71d","source-abc322-f-problem-00617dfda1bb35d2bd1170644c1a944cd547c3359c166bec98e45285c40a7563"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

区間の最長1-runだけでは左右区間をmergeできず、左区間のsuffix 1-runと右区間のprefix 1-runも必要になる。

range flip後の1-run情報はflip前の0-run情報と完全に入れ替わるため、0と1の両方についてprefix・suffix・maximumを保持すればlazy作用が定数時間になる。

flipを2回行うと元へ戻るのでlazy tagは1bitのxorで合成できる。

採用する候補: lenとbit別prefix/suffix/max-runをnodeに持ち、flip lazy tagで0/1情報をswapする遅延segment tree。

棄却する候補: 各queryでS[L,R]を直接反転またはscanして最長runを測る。

N≤5×10^5,Q≤10^5で長い区間queryが重なると二次時間になる。

棄却する候補: segment treeに区間内の最長1-runだけを保存する。

左右境界を跨ぐrun長を復元できず、flip後の値も0-run情報なしには更新できない。

各文字をlen=1で、対応bitのprefix=suffix=best=1、反対bitを0としてleaf化する。上記mergeでlazy segment treeを構築する。type 1では[L,R]へflip tagをapplyし、既存tagとxor合成する。type 2ではrange productを取得しbest[1]を出力する。identityはlen=0としてmerge境界を扱う。

## 典型の発動条件

### run情報monoid

発動条件: 区間内の同値連続長をmerge可能にしたいとき。

length・prefix・suffix・bestを持って境界跨ぎ候補を加える。

### lazy segment tree

発動条件: range updateとrange aggregate queryを同時に処理するとき。

flip mappingをnodeへ遅延適用する。

### 対称情報のswap作用

発動条件: binary値の反転で0の統計と1の統計が交換されるとき。

両bitの同型aggregateを保持してmappingをswapだけにする。

## 問題固有の要素

query対象は1-runだけだが、更新作用が0↔1なので、更新後も同じmonoid形式を保つ最小の補助情報として0-run三種が必要になる。

別の問題へ持ち帰る視点: lazy treeのnode設計ではquery情報だけでなく、全update作用を受けてもO(1)で写せる閉包まで情報を拡張する。

## 正当性

左右node A,Bのbest[b]はmax(A.best[b],B.best[b],A.suffix[b]+B.prefix[b])である。 prefix[b]はA全体がbならA.len+B.prefix[b]、そうでなければA.prefix[b]で、suffixも対称に求まる。 flip mappingはprefix[0]↔prefix[1]、suffix[0]↔suffix[1]、best[0]↔best[1]をswapしlenを保つ。 range反転とrange最長1-runの両方を対数時間で処理でき、merge・mapping・compositionが閉じる。

## 実装上の注意

- 半開区間への変換で入力[L,R]の右端を落とさず、leaf・identityのlenを正しく設定する。
- lazy tag compositionはlogical xorで、push時に子へswapを一度ずつ伝える。

## 復習の核

- 左suffixと右prefixが繋がって最大になる例をmergeし、その区間をflipした後に0/1の全三統計がswapするか確認する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 1 \leq Q \leq 10^5; S is a string of length N consisting of 0 and 1.; c \in \lbrace 1, 2 \rbrace; 1 \leq L \leq R \leq N; N, Q, c, L, and R are all integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc322/editorial/7303) — source-abc322-editorial-7303-78eb3ac0025e62afd734563853884e0cc2d27e7d0f8706015f4fb8f1cc14a71d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc322/tasks/abc322_f) — source-abc322-f-problem-00617dfda1bb35d2bd1170644c1a944cd547c3359c166bec98e45285c40a7563
