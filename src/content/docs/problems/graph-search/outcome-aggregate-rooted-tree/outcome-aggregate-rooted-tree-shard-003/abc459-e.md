---
title: "ABC459-E — Select from Subtrees"
draft: true
authoringUnit: {"problemId":"abc459-e","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-003/abc459-e.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc459-e-problem-2ce3291f70c35bf35627556054a7895416f364b01dc308ebe180bb1ed76f59a5","source-abc459-editorial-20979-e81283aaf0c48dc74a735d7a8400a7359b35f32fd57640a4263ccb09478c828f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"postorder では i の子孫が要求した T_i−D_i 個だけが先に取り除かれる。i が選べる残り個数は S_i−T_i+D_i で、具体的にどの飴を子孫が選んだかに依らない。各段でそこから D_i 個選ぶ二項係数を掛けると配分を一意に数える。供給不足部分木があれば0。","sourceRevisionIds":["source-abc459-e-problem-2ce3291f70c35bf35627556054a7895416f364b01dc308ebe180bb1ed76f59a5","source-abc459-editorial-20979-e81283aaf0c48dc74a735d7a8400a7359b35f32fd57640a4263ccb09478c828f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

squirrelの選択順は答えを変えないため、木のpostorderに固定できる。頂点iの番では子孫が既に取った飴総数がsubtree内で確定し、選択可能数が過去の具体的な選び方に依存しない。 postorderでは子孫だけがiより先に選び、iのsubtree外の選択はiが選べる飴集合へ影響しない。 S_i<T_iならsubtree全体の要求数が供給数を超えるため、その時点で答えは0である。

採用する候補: 各subtreeの飴総数 S_i=ΣC_j と必要選択数 T_i=ΣD_j をDFSで求め、各iの選び方 C(S_i-T_i+D_i,D_i) を全頂点で掛ける。

iより前に子孫が合計T_i-D_i個を必ず消費しているため、残候補数はS_i-(T_i-D_i)で一定となり、各頂点の組合せ数を独立に乗算できる。

棄却する候補: squirrelごとに実際の飴subsetを列挙し、後続頂点へ残集合をstateとして渡す。

各subtreeで選択subsetが組合せ爆発し、残集合を保持するDPは指数状態になる。

postorderでは子孫だけがiより先に選び、iのsubtree外の選択はiが選べる飴集合へ影響しない。

S_i<T_iならsubtree全体の要求数が供給数を超えるため、その時点で答えは0である。

rooted treeをpostorder DFSし、S_i=C_i+ΣS_child、T_i=D_i+ΣT_childを計算する。各iでS_i≥T_iを確認し、falling productまたは階乗前計算でbinom(S_i-T_i+D_i,D_i)を求めてmod積へ掛ける。

## 典型の発動条件

### 選択順固定による独立化

発動条件: subtree内resourceを祖先・子孫が選び、順序によらず最終条件だけが決まるとき。

postorderに固定して各頂点時点の既消費総数を確定する。

### subtree総和と二項係数

発動条件: 各頂点が残resourceから所定数を選ぶ方法数を数えるとき。

供給総和と需要総和の差から候補数を作る。

## 問題固有の要素

選択結果そのものが後続へ影響して見えても、必要数だけが影響するなら順序を固定して総数へ圧縮できる。

別の問題へ持ち帰る視点: tree上の組合せ積ではsubtree feasibilityと頂点ごとの自由選択数を分離する。

## 正当性

postorder では i の子孫が要求した T_i−D_i 個だけが先に取り除かれる。i が選べる残り個数は S_i−T_i+D_i で、具体的にどの飴を子孫が選んだかに依らない。各段でそこから D_i 個選ぶ二項係数を掛けると配分を一意に数える。供給不足部分木があれば0。

## 実装上の注意

- S_i-T_i+D_iがD_i未満なら0とし、ΣD_i制約に合わせたfactorial範囲を用意する。深い木ではiterative postorderも検討する。

## 復習の核

- postorderの頂点i直前に何個が必ず消費済みかを小木で追い、具体的subsetによらないことを確認する。

## 計算量と制約

### 時間

N 頂点、D=ΣD_i。逆階乗前計算と falling product なら O(N+D)。

### 空間

木、部分和で O(N)、逆階乗表で O(D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq P_i \leq N; 1 \leq C_i \leq 10^9; 1 \leq D_i; D_1 + D_2 + \cdots + D_N \leq 10^6; All input values are integers.; T is a rooted tree with vertex 1 as the root.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/tasks/abc459_e) — source-abc459-e-problem-2ce3291f70c35bf35627556054a7895416f364b01dc308ebe180bb1ed76f59a5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/editorial/20979) — source-abc459-editorial-20979-e81283aaf0c48dc74a735d7a8400a7359b35f32fd57640a4263ccb09478c828f
