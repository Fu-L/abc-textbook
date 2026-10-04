---
title: "ABC436-E — Minimum Swap"
draft: true
authoringUnit: {"problemId":"abc436-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-002/abc436-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc436-e-problem-29bcc2df24f6f13d81c2c0625f2cd0187ad861f6d793cd750abd7cdf145fb7cf","source-abc436-editorial-14751-1b8affa4ba8c56243f0edd95c7b0f99bfb5f41bc4efa3d55d8507934c752b83d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"swapは同cycle二点なら分割しcycle数を1増やし、異cycleなら1減らす。恒等のcycle数Nへは最低N−C回かかる。最短列の第一手は必ず増加し、同cycle二点なら残りも分割して達成可能。よって各cycleの二点組を合計する。","sourceRevisionIds":["source-abc436-e-problem-29bcc2df24f6f13d81c2c0625f2cd0187ad861f6d793cd750abd7cdf145fb7cf","source-abc436-editorial-14751-1b8affa4ba8c56243f0edd95c7b0f99bfb5f41bc4efa3d55d8507934c752b83d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

順列 P の写像 i→P_i は互いに素なサイクルへ分解される。swap(i,j) は i,j が同じサイクルなら一つを二つへ分割し、異なるサイクルなら二つを結合する。 サイクル数を C とすると恒等順列では C=N で、swap 一回で C は高々 1 しか増えないため最短回数は K=N-C である。 K 手で完了するには毎手サイクル数を 1 増やす必要があり、最初の二位置が同一サイクルに属することが必要十分である。

採用する候補: 順列の各サイクル長 s を求め、同じサイクル内から最初の swap 対を選ぶ個数 Σ binom(s,2) を数える。

最短回数 N-C を一手で N-(C+1) に減らす必要十分条件が同一サイクル内の二頂点選択である。

棄却する候補: 現在 P_i≠i の位置 i と P_i だけを swap する操作を候補として数える。

これは最短列を構成する一方法だが、同一サイクル内の非隣接な任意二頂点もサイクルを分割し最初の操作になれる。

サイクル数を C とすると恒等順列では C=N で、swap 一回で C は高々 1 しか増えないため最短回数は K=N-C である。

K 手で完了するには毎手サイクル数を 1 増やす必要があり、最初の二位置が同一サイクルに属することが必要十分である。

visited 配列で未訪問 i から P を辿りサイクル長 s を得るたび、答えへ s(s-1)/2 を加える。全サイクルを一度ずつ走査して答えを出力する。

## 典型の発動条件

### 順列のサイクル分解

発動条件: swap による整列回数や、同一循環内の選択肢を数えるとき。

P を関数グラフとして分解し、各成分長だけを集計する。

### 単調量による最短列の特徴付け

発動条件: 一操作で目的指標が高々1改善し、下界を達成する操作列を分類したいとき。

サイクル数 C をポテンシャルにし、毎手 +1 する操作だけが最短列に入れると示す。

## 問題固有の要素

最短回数だけでなく最短列の最初の選択肢も、swap がサイクル数をどう変えるかで完全に分類できる。

別の問題へ持ち帰る視点: 一手当たりの改善上限で最短下界が tight なら、最短解に使える各手は毎回最大改善を達成する必要がある。

## 正当性

swapは同cycle二点なら分割しcycle数を1増やし、異cycleなら1減らす。恒等のcycle数Nへは最低N−C回かかる。最短列の第一手は必ず増加し、同cycle二点なら残りも分割して達成可能。よって各cycleの二点組を合計する。

## 実装上の注意

- 固定点のサイクル長 1 は 0 を寄与する。答えは最大 binom(N,2) なので言語に応じて広い整数型を使う。

## 復習の核

- 同一サイクル内の任意の二位置で C が必ず1増えることと、異なるサイクルでは最短残手数が増えることを確認する。

## 計算量と制約

### 時間

順列長 N に対して O(N)。

### 空間

visitedとcycle走査で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le3\times10 ^ 5; 1\le P _ i\le N\ (1\le i\le N); P _ i\ne P _ j\ (1\le i\lt j\le N); There exists 1\le i\le N such that i\ne P _ i.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/tasks/abc436_e) — source-abc436-e-problem-29bcc2df24f6f13d81c2c0625f2cd0187ad861f6d793cd750abd7cdf145fb7cf
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/editorial/14751) — source-abc436-editorial-14751-1b8affa4ba8c56243f0edd95c7b0f99bfb5f41bc4efa3d55d8507934c752b83d
