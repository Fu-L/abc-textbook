---
title: "ABC376-G — Treasure Hunting"
draft: true
authoringUnit: {"problemId":"abc376-g","docPath":"src/content/docs/problems/graph-search/outcome-optimize-tree-order-by-cluster-contraction/outcome-optimize-tree-order-by-cluster-contraction-shard-001/abc376-g.md","learningOutcomeIds":["outcome-optimize-tree-order-by-cluster-contraction"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange","unit-priority-queue-best-first"],"excludedTopics":["01 on Tree・親先行順序のcluster縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-precedence-contraction","tag-dsu-components","tag-greedy-exchange-order","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc376-editorial-11196-a18251ecf2055b932d102aa3f8bccd2f6b2e4df137f625ae2ae766a90759e2fb","source-abc376-g-problem-d1e80774f47d87b619c3d47de0ca47347deb38146893cecb69ba3b4bdde81378"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未発見履歴は探索順のprefixだけなので期待操作はΣposition_i a_i/Σa。親優先の線形拡張をcluster順へ変換し、独立二clusterの順比較は重み/size比で決まる。最大比clusterを親直後へ寄せる公式交換法で最適を保ち、その順を縮約していけば最後のweighted completion値が最小になる。","sourceRevisionIds":["source-abc376-editorial-11196-a18251ecf2055b932d102aa3f8bccd2f6b2e4df137f625ae2ae766a90759e2fb","source-abc376-g-problem-d1e80774f47d87b619c3d47de0ca47347deb38146893cecb69ba3b4bdde81378"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [01 on Tree・親先行順序のcluster縮約](src/content/docs/learn/tree/tree-precedence-contraction.md)

- 親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 01 on Tree・親先行順序のcluster縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

合法な探索順は親が子より前に現れる線形拡張であり、期待操作回数の最小化は Σ position(q_i)·a_{q_i} の最小化に等しい。各頂点を 0^{a_i}1 の列とみると結合列の転倒数問題になる。 頂点 cluster を (C0,C1)=(重み総和,頂点数) とすると、二 cluster の順序比較は C0_a C1_b と C0_b C1_a の比比較になる。 最大比の非根 cluster v は最適線形拡張で親 cluster の直後へ移しても損せず、結合時の交差寄与 C1_parent·C0_v を加えればよい。

採用する候補: 01 on Tree の縮約貪欲を重み付き列へ拡張し、C0/C1 比が最大の cluster を親へ直後結合する操作を heap と DSU で行う。

交換論法により最大比 cluster を親の直後へ置く最適解が存在し、縮約を N-1 回行えば O(N log N) で順序と目的値を得られる。

棄却する候補: 木の DFS 順や a_i の大きい順で、親子制約を満たす頂点を都度選ぶ。

局所的な単頂点重量だけでは、その頂点に既に縮約された子孫列が後続へ与える転倒寄与を評価できない。

頂点 cluster を (C0,C1)=(重み総和,頂点数) とすると、二 cluster の順序比較は C0_a C1_b と C0_b C1_a の比比較になる。

最大比の非根 cluster v は最適線形拡張で親 cluster の直後へ移しても損せず、結合時の交差寄与 C1_parent·C0_v を加えればよい。

各頂点を cluster とし比を分数比較する max-heap に入れる。生存する最大 cluster v を取り、その現在の親 p へ DSU 的に縮約し、(C0,C1) と親関係を更新して再挿入する。最後の転倒数から期待値を作る。

## 典型の発動条件

### 01 on Tree

発動条件: 親が子より前という precedence 制約下で二値列の転倒型目的を最小化するとき。

比率最大 cluster を親へ縮約する greedy を用いる。

## 問題固有の要素

期待値の位置重み和を 0…01 列の転倒数へ翻訳すると、既知の木上スケジューリング構造が現れる。

別の問題へ持ち帰る視点: 縮約後は頂点ではなく列 cluster の比を比較し続ける必要がある。

## 正当性

未発見履歴は探索順のprefixだけなので期待操作はΣposition_i a_i/Σa。親優先の線形拡張をcluster順へ変換し、独立二clusterの順比較は重み/size比で決まる。最大比clusterを親直後へ寄せる公式交換法で最適を保ち、その順を縮約していけば最後のweighted completion値が最小になる。

## 実装上の注意

- 古い heap entry を current root/版番号で捨て、根0は縮約対象にしない。交差積と目的値は十分広い整数型で計算し、最後に S で割る。

## 復習の核

- 位置重み和と転倒数の差が定数である変換、および比率比較が隣接交換の符号になることを再証明する。

## 計算量と制約

### 時間

探索対象N、根を含むN+1頂点。ratio heap・DSU contraction O(N log N)。

### 空間

cluster weight,size,parentとheap O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; 0 \leq p_i < i; 1 \leq a_i; \sum_{i=1}^N a_i \leq 10^8; The sum of N over all test cases is at most 2 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc376/editorial/11196) — source-abc376-editorial-11196-a18251ecf2055b932d102aa3f8bccd2f6b2e4df137f625ae2ae766a90759e2fb
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc376/tasks/abc376_g) — source-abc376-g-problem-d1e80774f47d87b619c3d47de0ca47347deb38146893cecb69ba3b4bdde81378
