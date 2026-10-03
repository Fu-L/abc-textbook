---
title: "ABC435-F — Cat exercise"
draft: true
authoringUnit: {"problemId":"abc435-f","docPath":"src/content/docs/problems/data-structures/outcome-build-cartesian-tree-decomposition/outcome-build-cartesian-tree-decomposition-shard-001/abc435-f.md","learningOutcomeIds":["outcome-build-cartesian-tree-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-monotone-stack-queue","unit-rooted-tree-aggregation"],"excludedTopics":["最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。"],"tagIds":["tag-cartesian-tree","tag-dp-state-equivalence","tag-monotone-stack-queue","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc435-editorial-14734-748bcd62111bf26fa2011c48bc5c9e5f3b2df660f399daac2f1a2621d929d217","source-abc435-f-problem-006358a955d8f296aa608caa7b4b164b837f65d3a106a9e701e67194d3574677"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"猫が i にいるとき、猫を含む残存連続区間の最大高さは P_i である。初期状態で成立し、猫の塔を撤去すると残存区間内の最大塔へ移るため保存される。従ってその区間は、左右の最初の P_i より高い塔の内側 [L_i,R_i] に含まれる。極大区間から任意の小区間へは、その両側の隣接塔を先に撤去して猫を動かさず縮められるので、極大区間の最適値 F(i) は小区間の最適値を支配する。\n\ni から直接左の j へ移るには、j..i−1 の全塔が P_j 以下でなければならず、P_i>P_j なので R_j=i−1 となる。極大状態からでも、L_j−1 が区間内なら撤去し、i+1 が区間内なら撤去してから i を撤去すれば、猫は最大塔 j へ移り、残存区間はちょうど [L_j,R_j] になる。右側は対称。従って任意の直接移動を、その行先の極大状態への移動として実現できる。\n\n左側全体の最大塔を M とする。i から M へは右側を切り離して i を撤去すれば移れる。さらに左側で直接移動可能な任意の j に対し、M と j を含む区間へ縮め、現在の最大塔を順に撤去すると高さが厳密に下がって最終的に j に至る。j より高い途中の塔をすべて除いた時点で j が最大になり、各移動は前段の極大状態への実現に置き換えられる。この M→j の移動距離和は三角不等式で |M−j| 以上なので F(M)≥|M−j|+F(j)。従って |i−M|+F(M)≥|i−j|+F(j)。右側も同様で、各側の最大塔だけを次の候補としてよい。\n\n左右の最大塔は最大 Cartesian Tree の child である。葉では 0、内部では F(i)=max_{child c}(|i−c|+F(c)) とする。各候補は実現でき、ほかの直接移動をすべて支配するので帰納的に最適。初期の全体最大塔を根としてその値が答えである。","sourceRevisionIds":["source-abc435-editorial-14734-748bcd62111bf26fa2011c48bc5c9e5f3b2df660f399daac2f1a2621d929d217","source-abc435-f-problem-006358a955d8f296aa608caa7b4b164b837f65d3a106a9e701e67194d3574677"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [大小関係をCartesian treeへ変換する](src/content/docs/learn/query/cartesian-tree.md)

- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。

## 考察

猫が高さ P_i の塔にいる時、到達可能な連続区間は P_i 以下の塔だけからなる。i を含むその極大区間 [L_i,R_i] だけを状態にしても、より狭い区間から得る最適値を包含できる。

採用する候補: P の最大 Cartesian Tree を構築し、各頂点 i から左右部分区間の最大塔である子への移動だけを候補にした木 DP を行う。

一般の到達先は同じ側の最大塔を経由しても到達できるため、二候補へ縮約され、木構築・DP とも O(N) になる。

棄却する候補: 状態 (現在塔 i,残存区間 l,r) を全て列挙して DP する。

状態数が三乗規模で、極大到達区間による支配関係を利用していない。

[L_i,R_i] は左右で最初に現れる P_i より高い塔の内側であり、その左右部分の最大値位置 M_i^L,M_i^R が次に考えるべき代表である。

i から同じ側の任意 j へ有利に遷移できるなら、まずその側の最大塔 M を状態としても j へ到達可能で、dp[M]+|i-M| が候補を支配する。

各 i と左右部分の最大位置を結んだグラフは P の最大 Cartesian Tree になる。

単調 stack で P の最大 Cartesian Tree を作り、全体最大値 N の位置を根とする。葉から dp[i]=max(dp[left]+|i-left|,dp[right]+|i-right|) を計算し、存在しない子の候補を除く。根の dp を答える。

## 典型の発動条件

### Cartesian Tree

発動条件: 各区間最大値を親とし、元配列順を保つ階層を線形時間で構築したいとき。

塔高さの最大 Cartesian Treeで、左右到達区間の代表最大塔を子にする。

### 状態の支配による DP 圧縮

発動条件: 多数の部分区間状態のうち、より広い状態が狭い状態の選択肢を包含するとき。

(i,l,r) を極大区間 (i,L_i,R_i) 一つへまとめる。

### 木 DP

発動条件: 各状態の最適遷移先が左右の子に限られる階層構造を持つとき。

子部分木での最大運動距離へ親子添字距離を加え、最大を取る。

## 問題固有の要素

動的な削除過程の状態空間が、各要素を区間最大とする Cartesian Tree の包含階層へ一致する。

別の問題へ持ち帰る視点: 配列上で『次に越えられない大きい要素』が境界になる過程は Cartesian Tree 上の DP を疑う。

## 正当性

猫が i にいるとき、猫を含む残存連続区間の最大高さは P_i である。初期状態で成立し、猫の塔を撤去すると残存区間内の最大塔へ移るため保存される。従ってその区間は、左右の最初の P_i より高い塔の内側 [L_i,R_i] に含まれる。極大区間から任意の小区間へは、その両側の隣接塔を先に撤去して猫を動かさず縮められるので、極大区間の最適値 F(i) は小区間の最適値を支配する。

i から直接左の j へ移るには、j..i−1 の全塔が P_j 以下でなければならず、P_i>P_j なので R_j=i−1 となる。極大状態からでも、L_j−1 が区間内なら撤去し、i+1 が区間内なら撤去してから i を撤去すれば、猫は最大塔 j へ移り、残存区間はちょうど [L_j,R_j] になる。右側は対称。従って任意の直接移動を、その行先の極大状態への移動として実現できる。

左側全体の最大塔を M とする。i から M へは右側を切り離して i を撤去すれば移れる。さらに左側で直接移動可能な任意の j に対し、M と j を含む区間へ縮め、現在の最大塔を順に撤去すると高さが厳密に下がって最終的に j に至る。j より高い途中の塔をすべて除いた時点で j が最大になり、各移動は前段の極大状態への実現に置き換えられる。この M→j の移動距離和は三角不等式で |M−j| 以上なので F(M)≥|M−j|+F(j)。従って |i−M|+F(M)≥|i−j|+F(j)。右側も同様で、各側の最大塔だけを次の候補としてよい。

左右の最大塔は最大 Cartesian Tree の child である。葉では 0、内部では F(i)=max_{child c}(|i−c|+F(c)) とする。各候補は実現でき、ほかの直接移動をすべて支配するので帰納的に最適。初期の全体最大塔を根としてその値が答えである。

## 実装上の注意

- 撤去した空隙は詰めない。猫の塔を撤去した直後は、その撤去位置から左右の元の隣接を通じて届く塔の最大へ移る。
- P は相異なるので最大 Cartesian Tree は一意。単調 stack で parent と左右 child を作る。
- 木が一直線になる場合もあるため、明示 stack の逆順で DP する。距離総和は 64 bit 整数で持つ。

## 復習の核

- 猫が残存区間の最大塔である不変量、極大状態への支配、左右の最大塔を経由する候補の支配を順に示す。任意の塔へ自由に移れるとは仮定しない。

## 計算量と制約

### 時間

O(N)、Cartesian tree構築と木DP。

### 空間

O(N)、木とDP・stack。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times 10^5; (P_1,P_2,\ldots, P_N) is a permutation of (1,2,\ldots,N).; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/editorial/14734) — source-abc435-editorial-14734-748bcd62111bf26fa2011c48bc5c9e5f3b2df660f399daac2f1a2621d929d217
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/tasks/abc435_f) — source-abc435-f-problem-006358a955d8f296aa608caa7b4b164b837f65d3a106a9e701e67194d3574677
