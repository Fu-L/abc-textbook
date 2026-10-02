---
title: "ABC255-F — Pre-order and In-order"
draft: true
authoringUnit: {"problemId":"abc255-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc255-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc255-editorial-4105-468540b88cdedbb71b5c0365f7989f877a04953998ea5c1b51b9db993945ab3b","source-abc255-f-problem-d18f8d29fe4e73a8279289ed4b8f908c96f0e6f08d0e99bf611576777a05137b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"先行順と中間順の部分問題は同じ頂点集合でなければならず、根の中間順位置が現在区間外なら入力は不整合である。 左部分木サイズを中間順から求めると、先行順でも根直後の同じ長さが左部分木になり、残りが右部分木になる。 各根位置をO(1)で引き、対応する先行順区間を同じサイズに分割すれば、存在する場合の唯一の木を線形時間で復元・検証できる。","sourceRevisionIds":["source-abc255-editorial-4105-468540b88cdedbb71b5c0365f7989f877a04953998ea5c1b51b9db993945ab3b","source-abc255-f-problem-d18f8d29fe4e73a8279289ed4b8f908c96f0e6f08d0e99bf611576777a05137b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

先行順区間の先頭が部分木の根であり、その根の中間順位置より左が左部分木、右が右部分木なので、左右の頂点数まで一意に決まる。

採用する候補: 中間順の逆位置を使う区間再帰

各根位置をO(1)で引き、対応する先行順区間を同じサイズに分割すれば、存在する場合の唯一の木を線形時間で復元・検証できる。

棄却する候補: 各再帰で中間順区間を走査して根を探す

一本鎖の木では長い区間走査が繰り返され、二次時間になる。

先行順と中間順の部分問題は同じ頂点集合でなければならず、根の中間順位置が現在区間外なら入力は不整合である。

左部分木サイズを中間順から求めると、先行順でも根直後の同じ長さが左部分木になり、残りが右部分木になる。

各頂点の中間順位置invを前計算し、(preL,inL,len)を持つ部分問題を処理する。根=P[preL]の位置が中間順区間内か検証し、左右サイズで二部分へ分け、空でなければその先頭を子として記録する。

## 典型の発動条件

### 巡回列からの二分木復元

発動条件: 先行順と中間順が与えられ、子関係を構成したい。

先行順先頭を根とし、中間順の根位置で左右部分木を再帰分割する。

### 逆置換による位置参照

発動条件: 再帰ごとに同じ配列内の要素位置を探す。

中間順の逆位置配列を作り、各根の位置を定数時間で得る。

## 問題固有の要素

二つの巡回列は木が存在すれば左右部分木区間を一意に決める一方、根位置が区間外という局所検査で不可能性も検出できる。

別の問題へ持ち帰る視点: 構造復元では部分列をコピーせず境界だけを持ち、要素位置の逆引きを前計算して全要素を一度ずつ処理する。

## 正当性

先行順と中間順の部分問題は同じ頂点集合でなければならず、根の中間順位置が現在区間外なら入力は不整合である。 左部分木サイズを中間順から求めると、先行順でも根直後の同じ長さが左部分木になり、残りが右部分木になる。 各根位置をO(1)で引き、対応する先行順区間を同じサイズに分割すれば、存在する場合の唯一の木を線形時間で復元・検証できる。

## 実装上の注意

- 問題で根は頂点1なのでP_1≠1なら即-1とする。N=2×10^5の一本鎖で再帰スタックが溢れないよう反復スタックを使い、子なしは0を出力する。

## 復習の核

- 復元後に実際の先行順・中間順を再生成して入力と一致するか確認し、一本鎖、完全木、根位置が部分区間外になる不正例を試す。

## 計算量と制約

### 時間

O(N)、inorder逆引きと一node一回構築。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; N is an integer.; (P_1, P_2, \ldots, P_N) is a permutation of (1, 2, \ldots, N).; (I_1, I_2, \ldots, I_N) is a permutation of (1, 2, \ldots, N).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/editorial/4105) — source-abc255-editorial-4105-468540b88cdedbb71b5c0365f7989f877a04953998ea5c1b51b9db993945ab3b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/tasks/abc255_f) — source-abc255-f-problem-d18f8d29fe4e73a8279289ed4b8f908c96f0e6f08d0e99bf611576777a05137b
