---
title: "ABC333-E — Takahashi Quest"
draft: true
authoringUnit: {"problemId":"abc333-e","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc333-e.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange","unit-prefix-aggregate"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-greedy-exchange-order","tag-prefix-difference"],"sourceRevisionIds":["source-abc333-e-problem-54ee0e837a75eef0633b0e658e46acd1d10b413d37f5dafb8780346845b23b7f","source-abc333-editorial-7939-a9a410ed926a18653f5725e36ab57c65fc00f2c1379deaed6109c889708766d3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"最適戦略があるmonsterで貪欲より早いpotionを使っていれば、貪欲が選ぶ遅いpotionが未使用なら置換し、後のmonsterに使われるなら二本の割当を交換できる。いずれも各時点の所持数を増やさないため、全割当を最新優先へ変形できる。 不足判定を正しく行いつつ、交換argumentにより所持本数の最大値Kを最小化する対応を構成できる。","sourceRevisionIds":["source-abc333-e-problem-54ee0e837a75eef0633b0e658e46acd1d10b413d37f5dafb8780346845b23b7f","source-abc333-editorial-7939-a9a410ed926a18653f5725e36ab57c65fc00f2c1379deaed6109c889708766d3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

先に読む単元:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

monster type xを倒すには、それ以前に見つけた未使用の同type potionが一つ必要である。使うなら利用可能な中で最も遅く見つけたpotionを対応させると、それより早いpotionの保持期間を不必要に延ばさずに済む。

採用する候補: 全potionを仮に拾い、type別stackから最新の一本をmonsterへ割り当てる

棄却する候補: monsterごとに最も早く見つけたpotionを使う

遅いpotionを将来まで持ち越して同時所持数を増やし得て、K最小化の保証がない。

typeごとに発見event indexのstackを持つ。t=1ではindexをpushし、t=2では対応stackが空なら-1、そうでなければtopをpopしてその発見を採用とmarkする。最後まで成功したら採用markを時系列に走査し、採用時+1、monster時-1としてprefix最大Kと各t=1の0/1を出力する。

## 典型の発動条件

### type別LIFO対応

発動条件: 資源と要求にtypeがあり、要求以前の利用可能資源のうち最も遅いものを使いたい。

各typeの発見indexをstackで管理し、monster時に最新indexを取り出す。

### interval重なりのprefix集計

発動条件: 採用potionは発見から対応monsterまで所持数へ1寄与する。

採用発見で+1、各monster消費で-1として時系列prefixの最大を求める。

## 問題固有の要素

全potionを拾うsimulationで最後まで未使用のものを事後的に捨てたことにすれば、実際に拾う0/1とmonsterへの割当を同時に決められる。

別の問題へ持ち帰る視点: optionalな資源選択は一旦全て受け入れて必要分だけmatchingし、未対応資源を後から除くと構成しやすい。

## 正当性

最適戦略があるmonsterで貪欲より早いpotionを使っていれば、貪欲が選ぶ遅いpotionが未使用なら置換し、後のmonsterに使われるなら二本の割当を交換できる。いずれも各時点の所持数を増やさないため、全割当を最新優先へ変形できる。 不足判定を正しく行いつつ、交換argumentにより所持本数の最大値Kを最小化する対応を構成できる。

## 実装上の注意

- 出力する0/1はt=1 eventだけの入力順である。失敗時は行動列を出さず-1とし、成功時のK計算では採用されなかったpotionを加算しない。

## 復習の核

- 同typeのpotionが連続する例、typeごとの不足、最後まで余るpotion、複数typeが交差して保持区間が重なる例を小規模全戦略と比較する。

## 計算量と制約

### 時間

O(N)、typeごとの発見stackと採用mark走査。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq t _ i\leq2\ (1\leq i\leq N); 1\leq x _ i\leq N\ (1\leq i\leq N); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/tasks/abc333_e) — source-abc333-e-problem-54ee0e837a75eef0633b0e658e46acd1d10b413d37f5dafb8780346845b23b7f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/editorial/7939) — source-abc333-editorial-7939-a9a410ed926a18653f5725e36ab57c65fc00f2c1379deaed6109c889708766d3
