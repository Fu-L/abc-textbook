---
title: "ABC303-E — A Gift From the Stars"
draft: true
authoringUnit: {"problemId":"abc303-e","docPath":"src/content/docs/problems/graph-search/outcome-classify-tree-by-distance-residue/outcome-classify-tree-by-distance-residue-shard-001/abc303-e.md","learningOutcomeIds":["outcome-classify-tree-by-distance-residue"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-distance-residue"],"sourceRevisionIds":["source-abc303-e-problem-c838ea6c3e0b9635fa6650bb232baaa3892f42a8d277ba37d6132642ae4637bd","source-abc303-editorial-6434-6a6ec6fcf19c8d60d88886da438753e6640976d44023868c0997e6da9de59ac2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"構成木では葉隣接がstar中心で中心間距離は3の倍数、非中心は異なる剰余。中心からの距離0mod3だけを取れば全中心を復元し、その元次数がstar levelに一致する。","sourceRevisionIds":["source-abc303-e-problem-c838ea6c3e0b9635fa6650bb232baaa3892f42a8d277ba37d6132642ae4637bd","source-abc303-editorial-6434-6a6ec6fcf19c8d60d88886da438753e6640976d44023868c0997e6da9de59ac2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 木の一つの基準点から全頂点への距離を求め、距離の剰余類と局所構造から各頂点の役割や周期的な部品構造を分類できる。

この解説で扱わないこと:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

与えられた木は複数のstarを所定の方法で連結してできており、葉の隣は必ず元のstarの中心である。中心間の距離は3の倍数なので、一つの中心を基準に距離の剰余で全中心を識別できる。 葉の隣にある中心からの距離が0 mod 3の頂点だけが中心になり、中心でない葉までの距離は0 mod 3にならない。したがって選んだ始点に依存せず、該当頂点の次数が元の各starのlevelである。

採用する候補: 葉の隣を始点に距離を求め、距離mod 3で中心を抽出する

構成由来の距離規則を使えば、一回のDFS/BFSだけで全starのlevelを中心の次数として復元できる。

棄却する候補: 葉を反復的に削除しながらstarを一つずつ復元する

実現可能だが削除順と残存次数の管理が複雑で、距離剰余による一括分類の方が不変条件を明確に保てる。

葉の隣にある中心からの距離が0 mod 3の頂点だけが中心になり、中心でない葉までの距離は0 mod 3にならない。したがって選んだ始点に依存せず、該当頂点の次数が元の各starのlevelである。

任意の次数1頂点を見つけ、その唯一の隣接頂点を始点に木をDFSまたはBFSする。距離が3の倍数である頂点の次数を答え列へ追加し、昇順にsortして出力する。

## 典型の発動条件

### 木上の距離剰余

発動条件: 反復構造の接続間隔が一定で、同じ役割の頂点同士の距離が固定modulusに揃う。

既知の中心から距離mod 3を付け、中心という役割を剰余類0として復元する。

### 構成逆算

発動条件: 最終グラフが既知の部品を規則的に接続して作られている。

葉という確実な局所特徴から部品中心を一つ特定し、全体の周期構造へ広げる。

## 問題固有の要素

starのlevelは中心の次数に等しく、中心集合さえ距離mod 3で特定できれば、元の接続手順そのものを逆再生する必要はない。

別の問題へ持ち帰る視点: 構成問題の復元では、部品の識別標識と部品間距離の周期性を探すと削除simulationを避けられる。

## 正当性

構成木では葉隣接がstar中心で中心間距離は3の倍数、非中心は異なる剰余。中心からの距離0mod3だけを取れば全中心を復元し、その元次数がstar levelに一致する。

## 実装上の注意

- 始点は葉そのものではなく葉の唯一の隣である中心にする。親を除外して木を走査し、最後にlevel列を問題指定どおり昇順にする。

## 復習の核

- 単一star、levelの異なるstarのchain、複数の葉から別の始点を選んだ場合で、抽出される中心次数multisetが一致することを確認する。

## 計算量と制約

### 時間

N頂点。木探索O(N)、star数Sのsort O(S log S)。

### 空間

隣接と距離、答え O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3\leq N\leq 2\times 10^5; 1\leq u_i, v_i\leq N; The given graph is an N-vertex tree obtained by the procedure in the problem statement.; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/tasks/abc303_e) — source-abc303-e-problem-c838ea6c3e0b9635fa6650bb232baaa3892f42a8d277ba37d6132642ae4637bd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/editorial/6434) — source-abc303-editorial-6434-6a6ec6fcf19c8d60d88886da438753e6640976d44023868c0997e6da9de59ac2
