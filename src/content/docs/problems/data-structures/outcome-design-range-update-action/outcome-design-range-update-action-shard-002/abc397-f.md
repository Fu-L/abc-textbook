---
title: "ABC397-F — Variety Split Hard"
draft: true
authoringUnit: {"problemId":"abc397-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc397-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc397-editorial-12457-7f7b906edc8a6fba053224e8ef52a71749ad5e2e4906a0aa157fed62dea2ceb8","source-abc397-f-problem-2ae42bf6a4f9d444b3bd9f3753c4459bbf27db20e58d0056256882c351c16fa2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"位置iの直前出現pを更新前に読むと、既存右区間(j,i−1]へA_iが初めて加わる条件はj≥pである。既存の合法切れ目1≤j≤i−2への区間加算はこの条件を正確に表す。新切れ目j=i−1は左区間のL_{i−1}と右一要素の1から初期化するので、帰納的に各葉がD_i(j)になる。その最大X_iとR_{i+1}を2≤i≤N−1で合計すれば、三つの非空区間の全分割を覆い、最大値を得る。","sourceRevisionIds":["source-abc397-editorial-12457-7f7b906edc8a6fba053224e8ef52a71749ad5e2e4906a0aa157fed62dea2ceb8","source-abc397-f-problem-2ae42bf6a4f9d444b3bd9f3753c4459bbf27db20e58d0056256882c351c16fa2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 過去の版の保存・rollback・構造共有。

## 考察

三つの非空区間を作る第二の切れ目iを固定する。L_iをprefix[1,i]の種類数、R_iをsuffix[i,N]の種類数、X_iをprefix[1,i]を二つの非空区間へ分けた種類数和の最大とすると、回答はmax_{2≤i≤N−1}(X_i+R_{i+1})となる。L,Rは前後の走査でO(N)計算できる。

残る二分割の状態をD_i(j)=distinct(A_1,…,A_j)+distinct(A_{j+1},…,A_i)、1≤j<iとする。iを一つ増やしたとき、左区間は変わらず右区間の種類数だけが増える。a=A_iの位置iより前の最後の出現をp（未出現なら0）とすると、古い右区間(j,i−1]にaがない必要十分条件はj≥p。よって既存の切れ目j∈[max(1,p),i−1)だけへ+1する。この最後の端i−1は、まだ存在しなかった新しい切れ目である。

切れ目jを木の位置j−1へ対応させ、全葉を−INFとして初期化する。lastも全て0。i=1,…,Nを順に処理し、次の順で実行する。

1. p=last[A_i]を読む。i≥2なら、既存葉[max(1,p)−1,i−2)へ+1する。空なら何もしない。
2. i≥2なら、新しい切れ目j=i−1の葉i−2へL_{i−1}+1をsetする。先に加算してから有効化するため、新状態を二重に+1しない。
3. last[A_i]=i。i≥2でX_i=root.maxを得る。i≤N−1の場合だけX_i+R_{i+1}で回答を更新する。

これで各時点の木にはD_i(j)が入る。例えばN=3、A=(1,1,1)ではi=2で新状態D_2(1)=2を作り、回答は2+R_3=3。i=3のX_3は求められても後ろに非空区間がないので回答候補にしない。未使用の切れ目を0にして全体maxへ混ぜる必要はない。

二つの切れ目を直接全列挙するとO(N²)だが、直前出現の境界で一括更新することで一点追加と一回の区間加算にまとまり、全体O(N log N)となる。

## 典型の発動条件

### inline DPのrange update

発動条件: 状態indexごとの遷移差が条件の単調境界で一括加算になるとき。

cut位置範囲へlazy +1し全体maxを取る。

### last occurrenceによるdistinct更新

発動条件: 右端を伸ばした区間のdistinct増加を全左端について更新するとき。

直前出現位置を境に増えるleft endpointsを区間化する。

## 問題固有の要素

三分割を直接二次元管理せず、prefix二分割の最適値を動的に保ってsuffix一列と結合する。

別の問題へ持ち帰る視点: k分割最適化では最後のcutを外側sweepにし、手前の分割DPがrange update可能か調べる。

## 正当性

位置iの直前出現pを更新前に読むと、既存右区間(j,i−1]へA_iが初めて加わる条件はj≥pである。既存の合法切れ目1≤j≤i−2への区間加算はこの条件を正確に表す。新切れ目j=i−1は左区間のL_{i−1}と右一要素の1から初期化するので、帰納的に各葉がD_i(j)になる。その最大X_iとR_{i+1}を2≤i≤N−1で合計すれば、三つの非空区間の全分割を覆い、最大値を得る。

## 実装上の注意

- 処理する新要素の位置i、切れ目j、木の葉j−1を分ける。lastは位置iを登録する前の値を使う。
- 既存葉への+1、新しい葉のset、回答の取得という順を守る。
- −INFは加算しても合法値に紛れない十分小さい値にする。全同値・全相異・再出現ABAで全切れ目の値を比較する。

## 復習の核

- N≤10で全cut pairを列挙し、全同値・全distinct・ABA型の再出現について各jのdp cut配列まで比較する。

## 計算量と制約

### 時間

O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 3 \times 10^5; 1 \leq A_i \leq N (1 \leq i \leq N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc397/editorial/12457) — source-abc397-editorial-12457-7f7b906edc8a6fba053224e8ef52a71749ad5e2e4906a0aa157fed62dea2ceb8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc397/tasks/abc397_f) — source-abc397-f-problem-2ae42bf6a4f9d444b3bd9f3753c4459bbf27db20e58d0056256882c351c16fa2
