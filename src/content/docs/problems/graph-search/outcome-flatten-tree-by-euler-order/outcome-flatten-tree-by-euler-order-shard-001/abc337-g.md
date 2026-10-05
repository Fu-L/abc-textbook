---
title: "ABC337-G — Tree Inversion"
draft: true
authoringUnit: {"problemId":"abc337-g","docPath":"src/content/docs/problems/graph-search/outcome-flatten-tree-by-euler-order/outcome-flatten-tree-by-euler-order-shard-001/abc337-g.md","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-euler-flattening","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc337-editorial-9128-cbe0bd941506e286fb57dadf72d10bcbdf8ee413c5cf00a8d08e9186e3731f52","source-abc337-g-problem-c93d5e000c3d22efaf05c107e0398fe3076143c17dd8518cc30a3383278210cd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"pair(v,w),v<wが寄与するroot uは、u=wなら必ず寄与し、u≠wならw削除後にvと異なる成分にいることが必要十分。各wの自己root寄与w−1を先に入れる。残りは固定rootのchild subtreeかその補集合への範囲加算となり、各方向の小label数をoffline BITで数えられる。木imosでこれら領域の全寄与を合算すると元の全pairを正確に数える。","sourceRevisionIds":["source-abc337-editorial-9128-cbe0bd941506e286fb57dadf72d10bcbdf8ee413c5cf00a8d08e9186e3731f52","source-abc337-g-problem-c93d5e000c3d22efaf05c107e0398fe3076143c17dd8518cc30a3383278210cd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)

- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

## 考察

pair(v,w),v<wを固定する。root u=wではendpoint条件で常に寄与する。u≠wでは、wを消したときuとvが別成分なら元u–v pathにwが載る。よって各wの自己rootにw−1を置き、各方向成分の外側rootへその方向内のv<wの数を範囲加算する。固定根のEuler区間と補集合へ分解し、label昇順BITで必要個数を求め木imosで全rootへ届ける。

## 典型の発動条件

### Euler tourによるsubtree区間化

発動条件: 寄与先がsubtreeまたはその補集合で、範囲加算したい。

subtreeを連続区間へ写し、区間addと全体add-minus-subtreeで表す。

### offline二次元counting

発動条件: subtree区間内でvertex labelがthreshold未満の個数をO(N)回求めたい。

threshold順に頂点をBITへ追加し、Euler区間sumで矩形countを得る。

## 問題固有の要素

pair(v,w)をuごとに数える代わりに、wを切った時のv側componentを特定し、その補集合に属する全uへ一括加算する。

別の問題へ持ち帰る視点: path包含条件はcut vertexでcomponentを分け、寄与先集合へのrange updateへ主客転倒できる。

## 正当性

pair(v,w),v<wが寄与するroot uは、u=wなら必ず寄与し、u≠wならw削除後にvと異なる成分にいることが必要十分。各wの自己root寄与w−1を先に入れる。残りは固定rootのchild subtreeかその補集合への範囲加算となり、各方向の小label数をoffline BITで数えられる。木imosでこれら領域の全寄与を合算すると元の全pairを正確に数える。

## 実装上の注意

u=wのendpoint寄与を忘れずans[w]へw−1を足す。BITへ現在label wを登録する前にlabel<w個数をqueryする。Euler区間と補集合をrange差分へ正しく変換し、全値は64bit。

## 復習の核

- path、star、rootを跨ぐpairでN小の三重loop真値と比較し、subtree境界の半開区間とv=w除外を確認する。

## 計算量と制約

### 時間

N頂点。Euler、O(N)集約queryのBITと木imosで O(N log N)。

### 空間

木、Euler順、BIT、range差分 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq2\times10^5; 1\leq u_i\leq N\ (1\leq i\leq N); 1\leq v_i\leq N\ (1\leq i\leq N); The given graph is a tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/editorial/9128) — source-abc337-editorial-9128-cbe0bd941506e286fb57dadf72d10bcbdf8ee413c5cf00a8d08e9186e3731f52
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/tasks/abc337_g) — source-abc337-g-problem-c93d5e000c3d22efaf05c107e0398fe3076143c17dd8518cc30a3383278210cd
