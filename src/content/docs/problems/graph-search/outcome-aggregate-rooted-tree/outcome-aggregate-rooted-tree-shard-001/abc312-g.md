---
title: "ABC312-G — Avoid Straight Line"
draft: true
authoringUnit: {"problemId":"abc312-g","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc312-g.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc312-editorial-6854-95127d442c1e51570a1a84ea4733af43f13e85b96d616c07119c7b7377841d01","source-abc312-g-problem-7f9c17fee4eb88ec83271f7ba91cd73e394e9e73b5e34fefe65ebc76ef6ffc39"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一直線上にない三頂点には一意の分岐点 v があり、T−v の異なる三成分に入る。逆も成立するので各頂点で異なる三方向のサイズ積を足すとちょうど一度数える。降順 ways 更新は ∏(1+c_i x) の x³ 係数を計算し同方向の再使用を防ぐ。","sourceRevisionIds":["source-abc312-editorial-6854-95127d442c1e51570a1a84ea4733af43f13e85b96d616c07119c7b7377841d01","source-abc312-g-problem-7f9c17fee4eb88ec83271f7ba91cd73e394e9e73b5e34fefe65ebc76ef6ffc39"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

三頂点が一本の単純路上にないとき、その三本の道が合流する分岐点 v が一意に存在し、三頂点は T−v の異なる連結成分に属する。v を固定すると必要なのは、v を除いた各方向の成分サイズだけであり、異なる三成分から一頂点ずつ選ぶ積の和になる。任意根で subtree size を求めれば、辺 v−child 側は size[child]、親側は N−size[v] として reroot なしに全方向サイズが得られる。成分サイズ列 c を左から見て、選択数 0..3 の積和を更新すれば [x³]∏(1+c_i x) を O(deg v) で計算できる。

採用する候補: 各頂点 v について incident edge の向こう側の成分サイズを集め、異なる三成分から選ぶ積を次数に比例する DP で足す。

条件を満たす三つ組は唯一の分岐点へ一度だけ割り当てられ、全頂点の次数和が O(N) なので全体も O(N) になる。

棄却する候補: 全三つ組を列挙し、LCA や距離から一本の道に乗るか判定する。

判定を高速化しても Θ(N³) 個の三つ組を列挙できない。

木を任意根で DFS して subtree size を求める。各 v で隣接方向ごとのサイズを作り、ways[0]=1 の三要素選択 DP を更新して ways[3] を答えへ加える。

## 典型の発動条件

### 木の中心分岐による組の一意な分類

発動条件: 複数頂点が一本の道に載るか、異なる枝へ分かれるかを数えるとき。

Steiner subtree の分岐点を固定し、削除後の異なる成分から選ぶ。

### 辺の両側サイズ

発動条件: 全頂点を仮の根にした子方向成分サイズが必要なとき。

一度の subtree size から child 側 size と parent 側 N−size を得る。

## 問題固有の要素

数えたい三つ組には分岐点が一意なので、全 v で足しても重複しないことが O(N) 解法の土台になる。

別の問題へ持ち帰る視点: 木上の組を数えるとき、各組を LCA・中心・最初の分岐など一意な頂点へ課金できるか探す。

## 正当性

一直線上にない三頂点には一意の分岐点 v があり、T−v の異なる三成分に入る。逆も成立するので各頂点で異なる三方向のサイズ積を足すとちょうど一度数える。降順 ways 更新は ∏(1+c_i x) の x³ 係数を計算し同方向の再使用を防ぐ。

## 実装上の注意

- 親方向成分を忘れず、v 自身はどの成分にも入れない。積と総数は N³ 規模なので 64 bit を使う。

## 復習の核

- 三頂点の最小連結部分木を描き、path 型か次数3の分岐型かを分類する。成分サイズの積が何を一回ずつ数えるか言葉で確認する。

## 計算量と制約

### 時間

N 頂点、次数総和分の三選択 DP で O(N)。

### 空間

木と部分木サイズで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i, B_i \leq N; The given graph is a tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/editorial/6854) — source-abc312-editorial-6854-95127d442c1e51570a1a84ea4733af43f13e85b96d616c07119c7b7377841d01
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/tasks/abc312_g) — source-abc312-g-problem-7f9c17fee4eb88ec83271f7ba91cd73e394e9e73b5e34fefe65ebc76ef6ffc39
