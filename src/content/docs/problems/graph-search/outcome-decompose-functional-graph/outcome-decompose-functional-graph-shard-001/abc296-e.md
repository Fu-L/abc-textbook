---
title: "ABC296-E — Transition Game"
draft: true
authoringUnit: {"problemId":"abc296-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc296-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc296-e-problem-d20cd3f48bf987b0261459fa8579faa57de6822c5f637a3d263bf0c442985204","source-abc296-editorial-6116-dbe4ddefbb6d44eab7ed7f4d8bd3b687af7526bb5b0e973a6dd18f091a411f0b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"写像像を繰り返すと先行点を持たない木頂点から順に失われる。一方cycle頂点はcycle内先行点を常に持ち像に残る。入次数peelingの未削除点はこの安定集合と一致する。","sourceRevisionIds":["source-abc296-e-problem-d20cd3f48bf987b0261459fa8579faa57de6822c5f637a3d263bf0c442985204","source-abc296-editorial-6116-dbe4ddefbb6d44eab7ed7f4d8bd3b687af7526bb5b0e973a6dd18f091a411f0b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

写像f(i)=A_iの反復像S_0⊇S_1⊇…の安定集合はfunctional graphの閉路頂点だけになる。 削除された頂点xは唯一の出辺先A_xの有効入次数を一つ減らし、新たに0なら同様に消える。

採用する候補: 入次数0からのleaf pruning

閉路外頂点をqueueで順に削れば残る頂点数が無限反復後にも選べる数と一致する。

棄却する候補: ゲーム回数ごとに集合像を再構成

安定まで最大N回、各回N走査で二次になる。

削除された頂点xは唯一の出辺先A_xの有効入次数を一つ減らし、新たに0なら同様に消える。

全入次数を数え、0の頂点をqueueへ入れて取り出すたびA_xの入次数を減らす。削除されなかった頂点数を答える。

## 典型の発動条件

### functional graphの閉路抽出

発動条件: 各頂点の出次数が1で、反復後に残る頂点を求める。

入次数0から木部分を剥がす。

## 問題固有の要素

ゲームの全時刻条件を写像の安定像へ変えると、functional graphのcycle membershipになる。

別の問題へ持ち帰る視点: 有限写像の無限反復像は閉路集合である。

## 正当性

写像像を繰り返すと先行点を持たない木頂点から順に失われる。一方cycle頂点はcycle内先行点を常に持ち像に残る。入次数peelingの未削除点はこの安定集合と一致する。

## 実装上の注意

- 自己loopも閉路として残し、削除済み数または残数を一度だけ更新する。

## 復習の核

- 直接集合反復と比較し、自己loop、複数cycle、長いtailを確認する。

## 計算量と制約

### 時間

N 頂点に対して O(N)。

### 空間

入次数、出辺とqueue O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times 10^5; 1\leq A_i\leq N; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/tasks/abc296_e) — source-abc296-e-problem-d20cd3f48bf987b0261459fa8579faa57de6822c5f637a3d263bf0c442985204
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/editorial/6116) — source-abc296-editorial-6116-dbe4ddefbb6d44eab7ed7f4d8bd3b687af7526bb5b0e973a6dd18f091a411f0b
