---
title: "ABC240-E — Ranges on Tree"
draft: true
authoringUnit: {"problemId":"abc240-e","docPath":"src/content/docs/problems/graph-search/outcome-flatten-tree-by-euler-order/outcome-flatten-tree-by-euler-order-shard-001/abc240-e.md","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness"],"excludedTopics":["Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-euler-flattening","tag-constructive-witness"],"sourceRevisionIds":["source-abc240-e-problem-e5054fcf5d3834274ce994f833dfba65cf31ca0fe481cfa0ce55dcc59c577637","source-abc240-editorial-3426-8e200e9bd56c3e859f7d501769cda07a476bed0894e6fd3b3efb2a6757a0d8f8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"DFSで葉を連番化すると部分木内葉は連続する。内部点の最小葉番号・最大葉番号を区間にすれば包含条件と非交差条件を満たす。M枚の互いに素な葉区間には少なくともM個の整数が必要なので最大番号Mが最小。","sourceRevisionIds":["source-abc240-e-problem-e5054fcf5d3834274ce994f833dfba65cf31ca0fe481cfa0ce55dcc59c577637","source-abc240-editorial-3426-8e200e9bd56c3e859f7d501769cda07a476bed0894e6fd3b3efb2a6757a0d8f8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)

- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。

## 考察

異なる葉の部分木は互いに素なので、その区間も互いに交わらなければならない。葉が M 個なら少なくとも M 個の異なる正整数が必要で、最大値は M 未満にできない。DFS で葉を訪問順に1..Mと番号付けすると、任意の部分木に属する葉は DFS 順の連続区間を占める。よってその最小番号と最大番号を頂点の区間にできる。最適値を決めるのは頂点数ではなく、互いに素な最小部分木である葉の個数であり、内部頂点は葉区間の包として新しい整数を消費しない。

採用する候補: 葉だけへ DFS 順の連番を与え、内部頂点の [L,R] を子区間の最小左端・最大右端として bottom-up に作る。

葉数 M という下界と同じ最大値で、包含する部分木は包含区間、互いに素な部分木は非交差区間になる構成を与える。

棄却する候補: 全頂点へ preorder 番号を付け、部分木の Euler tour 区間をそのまま出力する。

条件は満たせるが最大値が N まで増え、葉数 M<N の木では最小性を達成しない。

根1から DFS し、子を持たない頂点に counter の現在値を L=R として割り当てて増やす。内部頂点では全 child の L の最小と R の最大を取り、全頂点の区間を出力する。

## 典型の発動条件

### DFS 順の部分木連続性

発動条件: 部分木や連結な再帰部分が並び順上の区間になる表現を作りたいとき。

各子部分木を連続して処理し、葉または頂点の訪問時刻の min/max を要約にする。

### 下界と一致する構成

発動条件: 最大使用値などを最小化する構成問題で最適性も示す必要があるとき。

互いに異なる値を強制する対象から下界を出し、その個数だけで全条件を満たす構成を作る。

## 問題固有の要素

葉だけが互いに素な区間のための新しい座標を必要とし、内部頂点の区間は配下の葉番号の hull で十分である。

別の問題へ持ち帰る視点: 階層区間の構成では、独立な原子だけへ座標を割り当て、祖先を原子集合の min/max で表せないか考える。

## 正当性

DFSで葉を連番化すると部分木内葉は連続する。内部点の最小葉番号・最大葉番号を区間にすれば包含条件と非交差条件を満たす。M枚の互いに素な葉区間には少なくともM個の整数が必要なので最大番号Mが最小。

## 実装上の注意

- 葉は無向次数1ではなく、根付け後に子が0個の頂点として判定する。path 木では根以外の末端一つだけが葉になり、全区間が [1,1] でも正しい。

## 復習の核

- star と path の二例で葉数と最適最大値を比べ、全頂点の Euler 番号では余計な整数を使う理由を確認する。

## 計算量と制約

### 時間

N 頂点で O(N)、出力 O(N)。

### 空間

木、走査順、区間 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq u_i, v_i \leq N; All values in input are integers.; The given graph is a tree.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/tasks/abc240_e) — source-abc240-e-problem-e5054fcf5d3834274ce994f833dfba65cf31ca0fe481cfa0ce55dcc59c577637
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/editorial/3426) — source-abc240-editorial-3426-8e200e9bd56c3e859f7d501769cda07a476bed0894e6fd3b3efb2a6757a0d8f8
