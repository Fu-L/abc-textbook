---
title: "ABC476 E — Min-Max Swap"
draft: true
authoringUnit: {"problemId":"abc476-e","docPath":"src/content/docs/problems/updates/abc476-e.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc476-e-problem-8d26392bf541c3a33bb998797f4e7748ffcfbead158a9928d0d5ece62311ff2d","source-abc476-editorial-25802-1e8d1f17374198fbfbce0c86576a6ff79089bf489aed43460a4dd11613d34a82"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各ノードの極値は子区間の極値の小さい方・大きい方で決まるので、木は常に現在配列の正しい区間極値を返す。更新前の二極値を読み、その値を交換する二点更新は指定操作そのもの。操作回数に関する帰納で最終配列が一致する。","sourceRevisionIds":["source-abc476-e-problem-8d26392bf541c3a33bb998797f4e7748ffcfbead158a9928d0d5ece62311ff2d","source-abc476-editorial-25802-1e8d1f17374198fbfbce0c86576a6ff79089bf489aed43460a4dd11613d34a82"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

## 考察

各区間の最小・最大を入れ替える操作は、一度順序が変わると次の区間極値も変わるので、更新後の配列をそのまま保守する。一ノードの情報を『最小値と位置、最大値と位置』の組にする。二つの子を結合するとき、それぞれの極値を比較して位置を引き継げばよい。

Segment Treeを線形時間で構築し、各操作の区間[L,R]をqueryして位置u,vと旧値a,bを同時に読み取る。その後uへb、vへaを一点更新する。queryを二回に分ける場合も、どちらも更新前の木から読む。順列なので最小と最大の位置は一意。

全操作後の葉を走査して出力する。一回ごとに範囲を直接なめる O(NM) を、結合可能な極値要約による O(log N) のqueryと二点更新へ変えられる。

## 典型の発動条件

集約値だけでなく、その値を取る位置も要約へ持たせる。queryで特定した少数位置を更新すれば操作の影響を局所化できる。

## 問題固有の要素

値が全て異なるのでargmin/argmaxの同点規約は不要だが、一般化するなら位置のtie-breakを固定する。

## 正当性

各ノードの極値は子区間の極値の小さい方・大きい方で決まるので、木は常に現在配列の正しい区間極値を返す。更新前の二極値を読み、その値を交換する二点更新は指定操作そのもの。操作回数に関する帰納で最終配列が一致する。

## 実装上の注意

二つの旧値を読み終えてから更新する。閉区間から半開区間へ変換するとき右端を含める。

## 復習の核

答えの値を知るだけで操作できるか、それを取る場所も必要か確認する。

## 計算量と制約

### 時間

構築 O(N)、操作 O(M log N)、最終出力 O(N)。

### 空間

Segment Treeと配列 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le 2\times 10^5; 1\le M\le 2\times 10^5; P is a permutation of (1,2,\ldots,N).; 1\le L_i < R_i\le N; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc476/tasks/abc476_e)
- [公式解説](https://atcoder.jp/contests/abc476/editorial/25802)
