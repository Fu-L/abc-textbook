---
title: "ABC391-E — Hierarchical Majority Vote"
draft: true
authoringUnit: {"problemId":"abc391-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-002/abc391-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc391-e-problem-c7663c0eba32ca0257568c987b448555e1cef6dc88d5c173f6626d06a2ff40a9","source-abc391-editorial-12103-02f2a7126e883bad329f4df3b7d3aae4f7ce4db3eefada45c04a8987ca605c17"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"現在多数派が二子なら、その二子の一方を反転することが必要十分で最小費用を選ぶ。三子なら二子以上の反転が必要で最小二費用を足す。子部分木は互いに素だから費用加算が可能。葉費用1から帰納的に全頂点の最小反転費用が正しい。","sourceRevisionIds":["source-abc391-e-problem-c7663c0eba32ca0257568c987b448555e1cef6dc88d5c173f6626d06a2ff40a9","source-abc391-editorial-12103-02f2a7126e883bad329f4df3b7d3aae4f7ce4db3eefada45c04a8987ca605c17"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

長さ3のmajority nodeを反転するには、現在の多数派を構成するchildのうち必要数を反転すればよい。葉変更の影響は完全な三分木上を上へ伝わる。childが3つ同値なら安い2つを、2対1なら多数派側の安い1つを反転すれば親のmajorityが変わる。leafの反転costは1。内部nodeでは現在多数派と同じ値のchildだけが親反転へ寄与する候補になる。同値3個なら一個だけ反転しても2対1で親値は変わらないため、二つの最小costを足す。

採用する候補: 各三分木nodeの現在値と、その値を反転する最小leaf変更数をbottom-up DPする

各nodeの最適変更は三childの値・costだけで局所的に決まり、全node数O(3^N)を一度処理すればroot答えが得られる。

棄却する候補: leaf subsetを変更数順に列挙して最終majorityを再計算する

leaf数3^Nに対するsubsetは二重指数的であり、階層構造を利用していない。

leafの反転costは1。

文字を(value,cost=1)のleafとし、3要素ずつまとめる。親valueをmajorityで求め、多数派childが2個ならcostのmin、3個ならcostの小さい2個の和を親costとする。N層後のcostを出す。

## 典型の発動条件

### tree DPによる局所感度

発動条件: 階層的な集約関数の最終出力を反転する最小入力変更数を求めるとき。

各nodeに現在値と反転costを持たせる。

### majority gateの最小cut

発動条件: 奇数個majorityの出力を変えるcostがchild別に異なるとき。

現多数派を過半数未満にする最安child集合を選ぶ。

## 問題固有の要素

最終bitだけを目標にしても、各subtreeでは「現在値を逆にするcost」一つだけで上位の全判断に十分である。

別の問題へ持ち帰る視点: Boolean回路の出力反転最小costでは、gateごとに出力0/1の最小costまたは現在値反転costをbottom-upする。

## 正当性

現在多数派が二子なら、その二子の一方を反転することが必要十分で最小費用を選ぶ。三子なら二子以上の反転が必要で最小二費用を足す。子部分木は互いに素だから費用加算が可能。葉費用1から帰納的に全頂点の最小反転費用が正しい。

## 実装上の注意

- 三つ全同値と2対1を分け、多数派でないchildのcostを誤って選ばない。3^N長を整数で正しく構築する。

## 復習の核

- N≤3で全leaf変更subsetを列挙し、3同値・2対1が各層で混ざるcaseのvalue/costをnodeごとに比較する。

## 計算量と制約

### 時間

葉数 L=3^N。三分木全体も O(L) 頂点なので O(3^N)。

### 空間

各段を縮める配列で O(3^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer with 1 \leq N \leq 13.; A is a string of length 3^N consisting of 0 and 1.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc391/tasks/abc391_e) — source-abc391-e-problem-c7663c0eba32ca0257568c987b448555e1cef6dc88d5c173f6626d06a2ff40a9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc391/editorial/12103) — source-abc391-editorial-12103-02f2a7126e883bad329f4df3b7d3aae4f7ce4db3eefada45c04a8987ca605c17
