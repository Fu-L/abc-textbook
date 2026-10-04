---
title: "ABC343-G — Compress Strings"
draft: true
authoringUnit: {"problemId":"abc343-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc343-g.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-z-algorithm"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-z-algorithm-prefix-matching"],"sourceRevisionIds":["source-abc343-editorial-9436-6a670070b7c547f803b964c0cf52d50537c5e486adca0024522f5353a5db112a","source-abc343-g-problem-bd0d4f09487ab73e9780b1979149827420246173bfd0f70e1e583c04da30a63e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"他文字列に含まれる文字列は条件を追加しない。残る文字列のsuperstring出現順はsuffix-prefix最大重なりで接げ、追加長は|next|−overlap。mask,lastの最短長を保持して全順序を覆う。包含を除いた後は末尾文字列が将来追加費用を決める。","sourceRevisionIds":["source-abc343-editorial-9436-6a670070b7c547f803b964c0cf52d50537c5e486adca0024522f5353a5db112a","source-abc343-g-problem-bd0d4f09487ab73e9780b1979149827420246173bfd0f70e1e583c04da30a63e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md) — 各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

あるS_iが別のS_jのsubstringなら、S_iを含む条件はS_jを含む条件に包含されるため除去できる。残った文字列は最短superstring内で開始位置順に並び、隣接文字列を最大suffix-prefix overlapで重ねる形へ変形できる。包含関係を除いた最適superstringで、開始位置が隣接するX,Yの重なりはXのsuffixとYのprefixでなければならず、最大overlap未満ならさらに短縮できる。よって順序が決まれば追加長は|first|+Σ(|next|-ov(prev,next))である。

採用する候補: 包含文字列を除去し、全ordered overlapを前計算してbitmask DPする

N≤20なので文字列順列をsubset×末尾状態へ圧縮し、最小追加長を厳密に求められる。

棄却する候補: 全N!通りの連結順を生成する

20!通りあり、overlap計算を前計算しても列挙できない。

同一文字列をdeduplicateし、他文字列のsubstringであるものをKMP/Z等で削除する。各ordered pair(i,j)の最大suffix-prefix一致長ov[i][j]を前計算する。dp[mask][j]をmaskを含むsuperstringで末尾がjの最小長として、未使用kへ+|S_k|-ov[j][k]を遷移しfull maskの最小を出す。

## 典型の発動条件

### 冗長constraint除去

発動条件: ある要求対象が別要求対象に完全包含される。

substringである文字列を先に消し、subset DPのNと重複条件を減らす。

### overlap TSP型bit DP

発動条件: 各objectを一度ずつ順序付け、隣接pairごとの節約量で総costが決まる。

訪問集合maskと最後の文字列を状態にし、次文字列の追加長をedge costにする。

## 問題固有の要素

substring包含を除いたことで、最適解中の文字列出現を開始位置順に一度ずつ代表化でき、非隣接の複雑な重なりも隣接最大overlapの連鎖で十分になる。

別の問題へ持ち帰る視点: superstring問題は包含除去後にpairwise overlapを辺重みとするHamiltonian pathへ落ちる。

## 正当性

他文字列に含まれる文字列は条件を追加しない。残る文字列のsuperstring出現順はsuffix-prefix最大重なりで接げ、追加長は|next|−overlap。mask,lastの最短長を保持して全順序を覆う。包含を除いた後は末尾文字列が将来追加費用を決める。

## 実装上の注意

- 同一文字列が複数ある時に全て削除しないよう先にdeduplicateする。ov[i][i]は遷移に使わず、dpのINF加算を避ける。

## 復習の核

- duplicate、完全包含、overlapなし、非対称overlap、三文字列の順序で節約が変わる例を全順列と比較する。

## 計算量と制約

### 時間

削除後文字列数C≤20、全長L。KMP等で包含/重なり O(CL)、subset DP O(C²2^C)。

### 空間

入力O(L)、重なりO(C²)、DP O(C2^C)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1 \leq N \leq 20; S_i is a string consisting of lowercase English letters whose length is at least 1.; The total length of S_1, S_2, \dots, S_N is at most 2\times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/editorial/9436) — source-abc343-editorial-9436-6a670070b7c547f803b964c0cf52d50537c5e486adca0024522f5353a5db112a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc343/tasks/abc343_g) — source-abc343-g-problem-bd0d4f09487ab73e9780b1979149827420246173bfd0f70e1e583c04da30a63e
