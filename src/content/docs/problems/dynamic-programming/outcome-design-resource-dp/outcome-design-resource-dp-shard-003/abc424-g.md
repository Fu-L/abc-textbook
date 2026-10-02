---
title: "ABC424-G — Set list"
draft: true
authoringUnit: {"problemId":"abc424-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-003/abc424-g.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-bipartite-matching-hall"],"sourceRevisionIds":["source-abc424-editorial-13936-84a09f5da2aa7440936546e3b16a18fffb6a32bcec202e6fabc225a59900aaf4","source-abc424-g-problem-387c737d0126b4c57dbaa6a2d61e9e94e7ef7709a220991e2e9275f5f56ffbe2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"選曲をB降順にすると任意k曲の最大需要は先頭k曲の需要和である。idol iはk曲へ高々min(A_i,k)回参加できるためprefix条件は必要。bipartite b-matchingの容量cutを全song部分集合へ見ると、需要最大集合がprefixなのでこれらの条件だけで全cutを満たし十分。処理順もB降順に固定し、曲を追加する時だけ新prefixを検査すれば過去prefixは不変。DPは全可行選曲集合を一回ずつ検査しC和最大を保つ。","sourceRevisionIds":["source-abc424-editorial-13936-84a09f5da2aa7440936546e3b16a18fffb6a32bcec202e6fabc225a59900aaf4","source-abc424-g-problem-387c737d0126b4c57dbaa6a2d61e9e94e7ef7709a220991e2e9275f5f56ffbe2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

選択songを必要人数Bの降順に並べた時、割当可能性は全prefix kについてΣ_{first k}B≤R_k=Σ_i min(A_i,k)である。この条件は各idol capacityを持つbipartite degree sequenceの必要十分条件になる。 大きいBからk曲選んだprefixで必要な延べ人数sがR_k以下なら、全kでのGale型条件が保たれ、capacityの大きいidolから割り当てる帰納構成が可能である。

採用する候補: B降順songを、選択数k・必要人数累積sのknapsack DPで選ぶ

prefix feasibilityをsong追加時のs≤R_kとして逐次保証し、excitement最大化を有限状態で解ける。

棄却する候補: 総必要dance回数ΣB≤ΣAだけを確認する

一部songが多人数を要求すると同じidolを一曲に重複配置できず、prefix条件を満たさない場合がある。

大きいBからk曲選んだprefixで必要な延べ人数sがR_k以下なら、全kでのGale型条件が保たれ、capacityの大きいidolから割り当てる帰納構成が可能である。

songsをB降順sortしR_kを前計算する。dp[k][s]を処理済みsongsからk曲選び全prefix条件を満たす最大C和とし、skipまたはchooseで(k+1,s+B_j)へ遷移する際s+B_j≤R_{k+1}を課す。全dp最大を出す。

## 典型の発動条件

### degree sequence feasibility

発動条件: 各itemがB_j個の異なるresourceを使い、resource iの総capacityがA_iである。

需要降順prefixとΣmin(A_i,k)のmajorization条件で割当可否を特徴付ける。

### 制約付きknapsack DP

発動条件: songごとに選択/非選択し、選択数と需要和がprefix feasibilityを決める。

(k,s)状態でexcitementを最大化し、R_kでinvalid stateを切る。

## 問題固有の要素

誰が踊るかをDPに含めず、選択songのB列がcapacity列に割当可能かをprefix不等式へ完全に射影できる。

別の問題へ持ち帰る視点: 複雑なassignmentはmajorization条件があればitem selection DPから分離できる。

## 正当性

選曲をB降順にすると任意k曲の最大需要は先頭k曲の需要和である。idol iはk曲へ高々min(A_i,k)回参加できるためprefix条件は必要。bipartite b-matchingの容量cutを全song部分集合へ見ると、需要最大集合がprefixなのでこれらの条件だけで全cutを満たし十分。処理順もB降順に固定し、曲を追加する時だけ新prefixを検査すれば過去prefixは不変。DPは全可行選曲集合を一回ずつ検査しC和最大を保つ。

## 実装上の注意

- 同じj iterationでsongを二度選ばないようcopyまたはk,s降順更新し、-INF状態をskipする。B=0も扱う。

## 復習の核

- N,M小でsong subsetとidol assignment max-flowを全比較しprefix条件を検証する。

## 計算量と制約

### 時間

idol N、song M、総参加枠 S=ΣA_i≤NM。容量表 O(NM)、dp遷移 O(M²S)（song×選曲数×総必要人数）、sort O(Mlog M)。

### 空間

rollingで O(MS)、R表O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 100; 1\leq M\leq 100; 0\leq A_i\leq M; 0\leq B_i\leq N; 0\leq C_i\leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/editorial/13936) — source-abc424-editorial-13936-84a09f5da2aa7440936546e3b16a18fffb6a32bcec202e6fabc225a59900aaf4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc424/tasks/abc424_g) — source-abc424-g-problem-387c737d0126b4c57dbaa6a2d61e9e94e7ef7709a220991e2e9275f5f56ffbe2
