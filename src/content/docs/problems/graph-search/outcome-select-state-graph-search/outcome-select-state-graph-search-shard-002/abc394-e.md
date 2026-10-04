---
title: "ABC394-E — Palindromic Shortest Path"
draft: true
authoringUnit: {"problemId":"abc394-e","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc394-e.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search"],"sourceRevisionIds":["source-abc394-e-problem-533b6d290a7446c365096ed0ea81d5cb587c31bea5b9f89f6ab6f060de728c85","source-abc394-editorial-12279-3461cc9787cdba2e081283a781ca43276d1250d76b4373a257ff891dbe30b97b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"空回文の対角距離0と、非対角の一辺回文の距離1が基底である。自己ループ中心の距離1は同じpairの距離0に支配され、辺としては保持するので外側の拡張を失わない。長さ2以上の回文から同字の両端辺を除くと内側回文を得て、逆に同字辺による拡張は必ず回文を作る。したがって基底からの全遷移は全ての最短回文を覆う。距離0の全基底を距離1の全基底より先に入れ、各遷移が2増えるFIFO順で処理すると、初回到達が最短距離となる。","sourceRevisionIds":["source-abc394-e-problem-533b6d290a7446c365096ed0ea81d5cb587c31bea5b9f89f6ab6f060de728c85","source-abc394-editorial-12279-3461cc9787cdba2e081283a781ca43276d1250d76b4373a257ff891dbe30b97b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

## 考察

回文の両端の文字を一緒に扱いたいので、状態を元の有向グラフの頂点pair(i,j)にする。iからjへの回文を同じ文字cの辺k→iとj→lで包むと、kからlへの回文になる。長さは2増える。元のパスは単純でなくてよく、同じ頂点を通る回文もこの遷移に含める。

偶数長の中心は空文字、奇数長の中心は一辺である。全distをINFにし、まず全ての(i,i)を距離0としてqueueへ入れる。次にC_{i,j}≠'-'かつi≠jのpairだけを距離1としてqueueへ入れる。自己ループがあってもdist[i][i]=0を1で上書きしない。自己ループの辺自体は隣接表へ残し、外側への拡張に利用する。

pred[i][c]をcの辺でiへ入る頂点、succ[j][c]をjからcの辺で出る頂点とする。(i,j)をpopしたら各cと(k,l)∈pred[i][c]×succ[j][c]を列挙し、dist[k][l]がINFならdist[i][j]+2を設定して末尾へ入れる。最初のqueueが全距離0、続いて全距離1という順なら、その後も0,1,2,3,…の距離順で処理でき、初回到達だけで最短値を確定できる。

自己ループを長さ1の中心として別に探索しなくても、同じ状態(i,i)の空回文の方が短く、同じ外側の拡張を全て使えるので最短解を失わない。例えばN=1でC='a'でも出力は0。全pairを処理後、INFを−1に置き換えて距離行列を出力する。

元グラフでパスを直接列挙すると閉路により無限個になり、同じ内側回文を何度も調べる。中心からの積グラフ探索なら状態N²、同字辺pairの列挙は合計Σ_c M_c²≤M²なのでO(N²+M²)である。

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

空回文の対角距離0と、非対角の一辺回文の距離1が基底である。自己ループ中心の距離1は同じpairの距離0に支配され、辺としては保持するので外側の拡張を失わない。長さ2以上の回文から同字の両端辺を除くと内側回文を得て、逆に同字辺による拡張は必ず回文を作る。したがって基底からの全遷移は全ての最短回文を覆う。距離0の全基底を距離1の全基底より先に入れ、各遷移が2増えるFIFO順で処理すると、初回到達が最短距離となる。

## 実装上の注意

- 自己ループでも対角dist=0を保つ。queueには対角の0を全て入れてから非対角の1を入れる。
- predは左側の入辺、succは右側の出辺。自己ループを隣接表から削除しない。
- N²の入力行列を読む費用と、全N²回答の出力も計算量に含める。

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
