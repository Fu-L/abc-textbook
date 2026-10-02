---
title: "ABC306-F — Merge Sets"
draft: true
authoringUnit: {"problemId":"abc306-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc306-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-coordinate-compression","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc306-f-problem-63fe6d6c7ae0bf5d4e0b393df64ed190600bfaf0159f4d78ea5e158e1c75a3c8","source-abc306-editorial-6601-7f08b56f50b5a14b21a2e311a92a05e3f3dcea5339f6c4fe18fd5dc598b9117e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全valuesがdistinctなのでcoordinate compression後のprefix countが≤比較の個数にそのまま一致する。 within-set constant contributionはC(M+1,2)×C(N,2)として先に加え、Fenwickは他set由来だけを担当する。 全NM elementsについて一回のqueryと一回のinsertだけでcross termを数えられる。","sourceRevisionIds":["source-abc306-f-problem-63fe6d6c7ae0bf5d4e0b393df64ed190600bfaf0159f4d78ea5e158e1c75a3c8","source-abc306-editorial-6601-7f08b56f50b5a14b21a2e311a92a05e3f3dcea5339f6c4fe18fd5dc598b9117e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

f(S_i,S_j)は各x∈S_iについてS_i∪S_j内のx以下の要素数を足したもので、S_i自身からの寄与は常に1+…+Mである。

残るcross termはi<jかつy∈S_j, y≤x∈S_iとなるordered element pairsの個数である。

棄却する候補: 各set pairをmerge-sortしてS_i elementsのranksを足す。

N^2 pairsがありN=10^4では重すぎる。

採用する候補: iをNから1へ走査し、後続setsの全valuesをFenwick treeへ入れて各A_{i,k}以下の個数をqueryする。

全NM elementsについて一回のqueryと一回のinsertだけでcross termを数えられる。

全valuesがdistinctなのでcoordinate compression後のprefix countが≤比較の個数にそのまま一致する。

within-set constant contributionはC(M+1,2)×C(N,2)として先に加え、Fenwickは他set由来だけを担当する。

rank-sum definitionをconstant self ranksとcross inversionsへ分解し、set index逆走査のFenwick prefix countsで集計する。

## 典型の発動条件

### 式変形によるpair contribution化

発動条件: set merge後のrank和を全set pairsについて求め、自己寄与と他集合寄与へ分けられるとき。

各S_i要素以下のS_j要素数というcross comparisonへ展開する。

### Fenwick treeのoffline走査

発動条件: index順条件i<jとvalue順条件y≤xを同時に満たすpairsを数えたいとき。

indexを逆走査してj>iだけをdata structureへ保持し、compressed value prefixをqueryする。

## 問題固有の要素

S_i内で各要素のrankは1,…,Mを一度ずつ取るため、値の並びに依らずself contributionはM(M+1)/2である。

別の問題へ持ち帰る視点: rank aggregateは同一group内の固定項を閉形式にし、group間比較だけをdata structureへ残す。

## 正当性

全valuesがdistinctなのでcoordinate compression後のprefix countが≤比較の個数にそのまま一致する。 within-set constant contributionはC(M+1,2)×C(N,2)として先に加え、Fenwickは他set由来だけを担当する。 全NM elementsについて一回のqueryと一回のinsertだけでcross termを数えられる。

## 実装上の注意

- set iのqueriesをすべて終えてからそのM valuesをinsertし、同じsetをcross termへ混ぜない。
- 答えはN^2M^2規模になり得るため64 bit整数を使う。

## 復習の核

- rankの定義を「自分以下の要素数」に展開し、各ordered pairの寄与として読み替える。
- indexとvalueの二条件を持つpair countingは、一方をscan順、他方をFenwick軸に割り当てる。

## 計算量と制約

### 時間

O(NM log(NM))、全値圧縮とFenwick。

### 空間

O(NM)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^4; 1\leq M \leq 10^2; 1\leq A_{i,j} \leq 10^9; If i_1 \neq i_2 or j_1 \neq j_2, then A_{i_1,j_1} \neq A_{i_2,j_2}.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/tasks/abc306_f) — source-abc306-f-problem-63fe6d6c7ae0bf5d4e0b393df64ed190600bfaf0159f4d78ea5e158e1c75a3c8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/editorial/6601) — source-abc306-editorial-6601-7f08b56f50b5a14b21a2e311a92a05e3f3dcea5339f6c4fe18fd5dc598b9117e
