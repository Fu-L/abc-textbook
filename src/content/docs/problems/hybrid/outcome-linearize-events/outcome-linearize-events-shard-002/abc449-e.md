---
title: "ABC449-E — A += v"
draft: true
authoringUnit: {"problemId":"abc449-e","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-002/abc449-e.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc449-e-problem-997a7ccb68b25fa3f77cd4e902582d044a8b91c43b69d203e02549bcbc08cc26","source-abc449-editorial-17253-4e8fa9484930c48248f543a8b9996139c2c021ca4abb754b9bfa4f34b2a34829"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同頻度の値は値昇順で選ばれるため、最小頻度集合を一周する操作列はその値列の反復となり、全員の頻度が一つ上がる。次の頻度水準へ達するまでこの集合は変わらず、stage長の式は操作後の列長を正確に数える。従ってqueryのstage内順位をFenwick treeのk番目選択へ写せば、逐次操作のX番目と一致する。","sourceRevisionIds":["source-abc449-e-problem-997a7ccb68b25fa3f77cd4e902582d044a8b91c43b69d203e02549bcbc08cc26","source-abc449-editorial-17253-4e8fa9484930c48248f543a8b9996139c2c021ca4abb754b9bfa4f34b2a34829"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

値1からMまで全てについて初期出現回数を数え、出現0回の値も含めて(frequency,value)順に並べる。同じ頻度の値は昇順に並び、最小頻度の値を一周選ぶたびその集合の頻度が一つ増える。次の頻度水準へ追いつくまでの回数をstageとしてまとめる。

stage kの反復数は隣の頻度差、各反復の追加順は先頭k値の昇順である。累積追加長からquery Xのstageと周期内順位を求め、k順にFenwick treeへ値を追加してX番目の値を取る。初期配列内のX≤NはそのままA_Xで答え、初期値にない値も後続stageへ含める。

全値の数Mを処理するため、初期頻度構築はO(N+M)、sortingとquery処理はO((M+Q)log(M+Q))、空間はO(N+M+Q)。N·M≤2.5×10^11なのでstage積には符号付き64 bit整数で足りる。

## 典型の発動条件

### 頻度 level の一括 simulation

発動条件: 最小頻度要素を繰り返し増やす操作を巨大位置まで追いたいとき。

次の頻度へ追いつくまでを同一集合の周期としてまとめる。

### offline Fenwick kth

発動条件: prefix 集合 P_1..P_k の値順 v 番目を多数問うとき。

k 順に要素を追加し、累積頻度の lower_bound で kth を得る。

## 問題固有の要素

逐次的な最小頻度更新は、水位が次の group へ達するまで active set が変わらない water filling として圧縮できる。

別の問題へ持ち帰る視点: 二次元 query (prefix長,順位) は prefix長で offline sort し、順序統計 tree を一方向更新する。

## 正当性

同頻度の値は値昇順で選ばれるため、最小頻度集合を一周する操作列はその値列の反復となり、全員の頻度が一つ上がる。次の頻度水準へ達するまでこの集合は変わらず、stage長の式は操作後の列長を正確に数える。従ってqueryのstage内順位をFenwick treeのk番目選択へ写せば、逐次操作のX番目と一致する。

## 実装上の注意

- 初期freq=0の値も1..Mを全てfrequency arrayに含める。同頻度tieはvalue昇順を保つ。
- 初期配列のprefix、stage累積長、N·Mを符号付き64 bitで保持する。

## 復習の核

- 小さな頻度表で追加列を実際に書き、stage の周期・終了長・周期内0/1-origin順位の式を照合する。

## 計算量と制約

### 時間

O(N+M+(M+Q)log(M+Q))、初期頻度集計・全値sort・offline query処理。

### 空間

O(N+M+Q)、全値の頻度・順序・queryを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N,M\le 5\times 10^5; 1\le A_i \le M; 1\le Q\le 2\times 10^5; 1\le X_i \le 10^{18}; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/tasks/abc449_e) — source-abc449-e-problem-997a7ccb68b25fa3f77cd4e902582d044a8b91c43b69d203e02549bcbc08cc26
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc449/editorial/17253) — source-abc449-editorial-17253-4e8fa9484930c48248f543a8b9996139c2c021ca4abb754b9bfa4f34b2a34829
