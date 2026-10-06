---
title: "ABC475 E — Quiz Competition: Qualifiers"
draft: true
authoringUnit: {"problemId":"abc475-e","docPath":"src/content/docs/problems/updates/abc475-e.md","learningOutcomeIds":["outcome-query-bitwise-order-with-trie"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-binary-trie"],"sourceRevisionIds":["source-abc475-e-problem-d322c0887c46c31e249092fac615c6fa8555ab1312042849a0149af486adad92","source-abc475-editorial-25493-169fe389ca09ead5866b84e5cc08893ad21b0e46aa2160004b3e6cf922300a72"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"選抜手続きの各段は辞書順の0側集団を先に確定するので、全誤答を除き、同一列以下の累積人数が定員内にある集団に限って合格となる。Trieは現在の多重集合の人数を各prefixへ保持し、0子の加算と同一葉の人数で対象以下の個数を正確に数える。","sourceRevisionIds":["source-abc475-e-problem-d322c0887c46c31e249092fac615c6fa8555ab1312042849a0149af486adad92","source-abc475-editorial-25493-169fe389ca09ead5866b84e5cc08893ad21b0e46aa2160004b3e6cf922300a72"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md)

- 整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。

## 考察

正答を0、誤答を1としたK bit列X_iへ変える。各設問は未確定者を次のbitで分岐し、0側が定員内なら全員合格にして1側を続け、定員超過なら1側を全員落として0側を続ける。これはX_iの辞書順に順位を付け、定員境界にかかった同一列の集団をまとめて不合格にする手続きである。

X_i以下の列の個数rank_le(X_i)がM以下なら、その集団は境界より前に全部収まるので合格。ただし全誤答の列11…1は、一度も正解による合格確定がなく最後に残るため、常に不合格とする。N=Mのときもこの例外が必要。

参加者の列を二分Trieに入れ、各ノードへ通過人数を持つ。一bit反転では旧列の人数を根から葉まで減らし、変更後の列を増やす。rank_leは、対象bitが1の時に0子の人数を足し、最後に同一葉の人数も足すことで O(K) で求まる。

Q回で新ノードを無制限に増やすと O((N+Q)K) メモリになる。旧列削除時に人数0になった枝を空きノードへ戻して再利用すれば、同時に必要なノード数は O(NK)。あるいは全クエリ先読みで必要列を圧縮する。

## 典型の発動条件

段階的な選抜を辞書順の順位へ言い換え、prefix Trieで多重集合のrankを数える。更新では旧経路の削除と新経路の追加を対にする。

## 問題固有の要素

同点集団を途中まで合格にできないので、rank_ltでなくrank_leを使う。全誤答は順位条件とは別に不合格。

## 正当性

選抜手続きの各段は辞書順の0側集団を先に確定するので、全誤答を除き、同一列以下の累積人数が定員内にある集団に限って合格となる。Trieは現在の多重集合の人数を各prefixへ保持し、0子の加算と同一葉の人数で対象以下の個数を正確に数える。

## 実装上の注意

正誤bitはTに対して計算する。削除で空になった枝を再利用し、人数は重複列を含めて数える。

## 復習の核

手続きがどの比較順を実装しているか見る。等しいキーの扱いと特別な終端状態を確認する。

## 計算量と制約

### 時間

初期構築 O(NK)、全クエリ O(QK)。

### 空間

ノード再利用付きTrie O(NK)、参加者列 O(NK)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 3\times 10^4; 1 \leq K \leq 200; S_i and T are strings of length K consisting of o and x.; 1 \leq Q \leq 5\times 10^4; For each query, 1\leq i \leq N and 1 \leq j \leq K.

## 出典

- [公式問題](https://atcoder.jp/contests/abc475/tasks/abc475_e)
- [公式解説](https://atcoder.jp/contests/abc475/editorial/25493)
