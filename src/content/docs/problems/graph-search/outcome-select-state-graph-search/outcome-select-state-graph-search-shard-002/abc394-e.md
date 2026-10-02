---
title: "ABC394-E — Palindromic Shortest Path"
draft: true
authoringUnit: {"problemId":"abc394-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc394-e.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc394-e-problem-533b6d290a7446c365096ed0ea81d5cb587c31bea5b9f89f6ab6f060de728c85","source-abc394-editorial-12279-3461cc9787cdba2e081283a781ca43276d1250d76b4373a257ff891dbe30b97b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長さ0対角と長さ1辺はpalindrome基底。長さ2以上のpalindromeは両端同字辺を除くと短いpalindromeになり、逆拡張も必ずpalindrome。基底からpair状態を距離順処理すれば全palindromeを網羅し最短長を得る。","sourceRevisionIds":["source-abc394-e-problem-533b6d290a7446c365096ed0ea81d5cb587c31bea5b9f89f6ab6f060de728c85","source-abc394-editorial-12279-3461cc9787cdba2e081283a781ca43276d1250d76b4373a257ff891dbe30b97b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さ2以上のpalindrome pathは、内側のpalindrome pathの両端へ同じlabelのedgeを一つずつ付けたものに一意に分解できる。 内側の始終点(i,j)をstateとすれば、外側(k,l)への拡張はedge k→iとj→lのlabel一致だけで決まり、N² stateのgraph最短路になる。 empty path(i,i)をdistance0、既存edge(i,j)をdistance1として初期化すると偶数長・奇数長palindromeの双方を覆う。 state(i,j)からincoming edge k→iとoutgoing edge j→lの文字が同じとき(k,l)へdistance+2で遷移する。

採用する候補: 頂点pair graphを作り、長さ0/1の中心から同label edge pairで外向きBFSする

各拡張costは2で一定、中心distance 0/1を先にqueueへ入れれば、N² state・O(N⁴)遷移で全pairの最短palindrome長を一括計算できる。

棄却する候補: 各(i,j)について元graphのpathを長さ順に列挙しlabel palindromeを検査する

cycleによりpath数は無限で、pair間で同じ内側palindrome計算も重複する。

empty path(i,i)をdistance0、既存edge(i,j)をdistance1として初期化すると偶数長・奇数長palindromeの双方を覆う。

state(i,j)からincoming edge k→iとoutgoing edge j→lの文字が同じとき(k,l)へdistance+2で遷移する。

dist[N][N]=INFとしdist[i][i]=0、全edge i→jに1を設定してmulti-source queueへ入れる。popした(i,j)について文字c別のpred[i][c]とsucc[j][c]を全組し、未訪問(k,l)へdist+2を設定する。

## 典型の発動条件

### product graph

発動条件: pathの両端を同時に一stepずつ動かす対称条件を扱うとき。

始終点pairをstateにして同label edgeを組にする。

### palindromeの中心からのBFS

発動条件: palindromeを外側へ同文字で拡張し最短長を求めるとき。

空中心と一文字中心をmulti-sourceにする。

## 問題固有の要素

元pathを前から読むのでなく、palindromeの再帰定義どおり内側から外へ構成すると、全始終点を同じpair-state探索で共有できる。

別の問題へ持ち帰る視点: 両端条件を持つstring-labelled pathは、二頂点の積graphで左右を同期させる。

## 正当性

長さ0対角と長さ1辺はpalindrome基底。長さ2以上のpalindromeは両端同字辺を除くと短いpalindromeになり、逆拡張も必ずpalindrome。基底からpair状態を距離順処理すれば全palindromeを網羅し最短長を得る。

## 実装上の注意

- dist0とdist1のstateを重複queueしても最短順を壊さないよう初期化する。edge方向は左側がincoming、右側がoutgoingである。

## 復習の核

- N≤6でpath長を上限付き全探索し、self pair、direct edge、偶数/奇数中心、向き非対称graphのdistを比較する。

## 計算量と制約

### 時間

元N頂点、label種類C、M辺。状態N²、両端edge組総数≤M²、全体 O(N²+M²)⊆O(N⁴)。

### 空間

label別正逆隣接 O(M)、pair dist O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; N is an integer.; Each C_{i, j} is either a lowercase English letter or -.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc394/tasks/abc394_e) — source-abc394-e-problem-533b6d290a7446c365096ed0ea81d5cb587c31bea5b9f89f6ab6f060de728c85
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc394/editorial/12279) — source-abc394-editorial-12279-3461cc9787cdba2e081283a781ca43276d1250d76b4373a257ff891dbe30b97b
