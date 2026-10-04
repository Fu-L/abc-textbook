---
title: "ABC218-G — Game on Tree 2"
draft: true
authoringUnit: {"problemId":"abc218-g","docPath":"src/content/docs/problems/data-structures/outcome-rollback-reversible-updates/outcome-rollback-reversible-updates-shard-001/abc218-g.md","learningOutcomeIds":["outcome-rollback-reversible-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-game-value","unit-ordered-set-multiset"],"excludedTopics":["rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rollback","tag-game-value-dp","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc218-editorial-2607-43364299e8c54da3ef94a47ec6ac5138474c324ae1a077ee7172a2a34595f6a1","source-abc218-g-problem-8f708577ee7df47490e76bafede091444db5db977d8d6b6ab0b8fbaa02f5bdc8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"木では根から葉への経路が一意である。DFSの追加と取り消しがその経路の値を保つので、葉の評価は実際の中央値に一致する。各内部頂点で手番の最適な子を選べば、葉からの帰納により根の値がゲームの最適値となる。","sourceRevisionIds":["source-abc218-editorial-2607-43364299e8c54da3ef94a47ec6ac5138474c324ae1a077ee7172a2a34595f6a1","source-abc218-g-problem-8f708577ee7df47490e76bafede091444db5db977d8d6b6ab0b8fbaa02f5bdc8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rollback・DFS入退場の状態復元](src/content/docs/learn/query/rollback.md)

- 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [minimax・得点差・局面値を評価するゲームDP](src/content/docs/learn/dynamic-programming/dp-game-value.md) — 状態遷移を設計できることを前提に、双方の最適行動を最大化・最小化として評価する。
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

木を頂点1で根付けると、再訪禁止の駒は親へ戻れず子へ進み続け、必ず葉で止まる。終端の葉を固定すれば訪問集合は根からその葉までの path に一意に定まる。

各葉の path 中央値が分かれば、内部頂点では手番に応じて子の値の最大または最小を選ぶだけなので、ゲーム部分は通常の minimax 木 DP になる。

採用する候補: DFS 中の根から現在頂点までの値の multiset を二分割して中央値を保ち、葉の評価値を求めながら深さ偶数で max、奇数で min を返す。

path への一要素追加・削除と中央値取得を効率化し、葉の payoff 計算と minimax を一度の DFS に統合できる。

棄却する候補: 葉ごとに根からの値を集め直してソートし、その後ゲーム木を評価する。

多くの葉が長い共通 path を持つ木では同じ頂点値を繰り返し集計し、N=10^5 に対して二乗規模になり得る。

DFS の入場時に A_v を追加し、退場時に同じ一個を削除すれば、データ構造は常に現在の root-to-v path だけを表す。

根の深さを0とすると、次の行き先を選ぶのは偶数深さで Taro、奇数深さで Jiro なので、それぞれ子の返り値の max と min を取る。

値を座標圧縮した Fenwick Tree の k-th 探索、または大小二つの multiset で path 中央値を管理する。葉では奇数個なら中央、偶数個なら中央二値の平均を返し、内部では深さの偶奇で集約する。

## 典型の発動条件

### DFS path データ構造

発動条件: 各 root-to-node path の統計量を全頂点または全葉で求め、要素の追加と rollback ができるとき。

DFS 入退場で一要素ずつ更新し、兄弟部分木へ path 状態を持ち越さない。

### ゲーム木の minimax

発動条件: 完全情報ゲームが木上を一方向に進み、終端 payoff が決まるとき。

最大化手番では子値の最大、最小化手番では最小を bottom-up に返す。

## 問題固有の要素

再訪禁止と入力が木であることの組合せが、一般の walk ゲームを「葉を選ぶゲーム」へ変える。中央値は終端 path だけで決まり途中手番の履歴を別状態に持たない。

別の問題へ持ち帰る視点: グラフゲームで履歴依存に見えたら、木・非再訪・開始点から合法手が常に子方向だけになるかを先に確認する。

## 正当性

木では根から葉への経路が一意である。DFSの追加と取り消しがその経路の値を保つので、葉の評価は実際の中央値に一致する。各内部頂点で手番の最適な子を選べば、葉からの帰納により根の値がゲームの最適値となる。

## 実装上の注意

- 重複値を一個ずつ削除できる構造にし、偶数長 path では中央二値の和を2で割る。A_i が偶数なので答えは整数だが、再帰深度 N の実装にも注意する。

## 復習の核

- 根・内部・葉の三段の小木で、手番と深さの対応を書き込み、中央値の管理と max/min の向きを別々に再現する。

## 計算量と制約

### 時間

O(N log N)、path中央値と木minimax。

### 空間

O(N)、path頻度/木/DFS履歴。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 2 \leq A_i \leq 10^9; A_i is even.; 1 \leq u_i < v_i \leq N; The given graph is a tree.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/editorial/2607) — source-abc218-editorial-2607-43364299e8c54da3ef94a47ec6ac5138474c324ae1a077ee7172a2a34595f6a1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/tasks/abc218_g) — source-abc218-g-problem-8f708577ee7df47490e76bafede091444db5db977d8d6b6ab0b8fbaa02f5bdc8
