---
title: "ABC245-F — Endless Walk"
draft: true
authoringUnit: {"problemId":"abc245-f","docPath":"src/content/docs/problems/graph-search/outcome-peel-directed-graph-toward-cycles/outcome-peel-directed-graph-toward-cycles-shard-001/abc245-f.md","learningOutcomeIds":["outcome-peel-directed-graph-toward-cycles"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["有向cycle検出・sink/source peelingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-directed-core-peeling"],"sourceRevisionIds":["source-abc245-editorial-3652-b716ad14ba697633a2ca377f2100df6202c59e1f1a7744a0e4556578fdb48d9c","source-abc245-f-problem-2111ce95b6ab338f9bfa8fd103b2e49052114125936604f2520989705f1d7a40"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"削除されるsinkは無限walk不能。全行き先が削除済みになる頂点も不能なので帰納的に削除は正しい。残る頂点は残存出辺を一つ以上持ち、有限graphで辿ればcycleへ至り無限walk可能。よって未削除点が正確な集合。","sourceRevisionIds":["source-abc245-editorial-3652-b716ad14ba697633a2ca377f2100df6202c59e1f1a7744a0e4556578fdb48d9c","source-abc245-f-problem-2111ce95b6ab338f9bfa8fd103b2e49052114125936604f2520989705f1d7a40"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [有向cycle検出・sink/source peeling](src/content/docs/learn/graph/directed-core-peeling.md)

- 三色DFSまたはKahn型peelingの不変条件を説明し、有向cycleの存在を判定して必要ならcycleへ残るcoreを抽出できる。

## 考察

有限頂点の有向グラフで無限に歩けることは、選んだ辺をたどり続けて最終的に有向閉路へ入れることと同値である。 出次数 0 の頂点からは続けられない。また、行き先がすべて有限歩しかできないと確定した頂点も有限であるため、この性質を逆辺方向へ伝播できる。 削除順を番号とみなすと、削除された頂点から進める先はすべて自分より先に削除済みであり、番号が真に減るので無限歩はできない。 残った各頂点には残存頂点への出辺が少なくとも 1 本ある。その辺を選び続ければ有限個の頂点のどれかを再訪し、以後も歩き続けられる。

採用する候補: 各頂点の未削除の出次数を持ち、出次数 0 の頂点を queue から削除して逆辺の始点の出次数を減らす。最後まで削除されない頂点を数える。

各辺を一度だけ処理し、閉路へ到達できない頂点を局所条件からまとめて除外できる。

棄却する候補: 各始点から DFS を行い、その始点から閉路へ到達できるかを個別に判定する。

探索結果を適切に共有しなければ同じ部分グラフを何度もたどり、N,M≤2×10^5 で二次規模になり得る。

削除順を番号とみなすと、削除された頂点から進める先はすべて自分より先に削除済みであり、番号が真に減るので無限歩はできない。

残った各頂点には残存頂点への出辺が少なくとも 1 本ある。その辺を選び続ければ有限個の頂点のどれかを再訪し、以後も歩き続けられる。

逆隣接リストと現在出次数を作り、初期 sink を queue に入れる。頂点 v を削除したら v への各入辺 u→v について outdeg[u] を減らし、0 になった u を追加する。N から削除数を引いた値が答えになる。

## 典型の発動条件

### 逆向き topological pruning

発動条件: 有向グラフで、行き先を失った頂点から不可能状態を後方へ伝播したいとき。

sink を起点に逆辺をたどって削除し、閉路へ到達可能な core だけを残す。

### 次数管理付き queue

発動条件: 頂点の全隣接先が処理済みになった瞬間だけ次の処理対象にしたいとき。

未削除出次数を decrement し、0 になった一度だけ enqueue する。

## 問題固有の要素

「良い始点を直接探す」のではなく、「必ず有限回で止まる頂点」を sink から消すと、無限歩可能な頂点が残集合として現れる。

別の問題へ持ち帰る視点: 閉路到達性や eventual behavior では、悪い状態が局所的に閉じるなら補集合を剥がす視点が有効である。

## 正当性

削除されるsinkは無限walk不能。全行き先が削除済みになる頂点も不能なので帰納的に削除は正しい。残る頂点は残存出辺を一つ以上持ち、有限graphで辿ればcycleへ至り無限walk可能。よって未削除点が正確な集合。

## 実装上の注意

- 伝播には元の辺と逆向きの隣接リストが必要で、v を削除した際に u→v の u を更新する。
- 出次数が 0 になった瞬間だけ enqueue し、削除済み頂点を重複計上しない。

## 復習の核

- 閉路そのものだけでなく閉路へ流入する頂点も残る例を使い、残集合の意味を「閉路上」に狭めていないか確認する。

## 計算量と制約

### 時間

N 頂点、M 辺。逆辺peelingで O(N+M)。

### 空間

逆隣接、出次数、queue O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq M \leq \min(N(N-1), 2\times 10^5); 1 \leq U_i,V_i\leq N; U_i\neq V_i; (U_i,V_i)\neq (U_j,V_j) if i\neq j.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/editorial/3652) — source-abc245-editorial-3652-b716ad14ba697633a2ca377f2100df6202c59e1f1a7744a0e4556578fdb48d9c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/tasks/abc245_f) — source-abc245-f-problem-2111ce95b6ab338f9bfa8fd103b2e49052114125936604f2520989705f1d7a40
