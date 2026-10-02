---
title: "ABC397-F — Variety Split Hard"
draft: true
authoringUnit: {"problemId":"abc397-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc397-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action"],"sourceRevisionIds":["source-abc397-editorial-12457-7f7b906edc8a6fba053224e8ef52a71749ad5e2e4906a0aa157fed62dea2ceb8","source-abc397-f-problem-2ae42bf6a4f9d444b3bd9f3753c4459bbf27db20e58d0056256882c351c16fa2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_{j+1}が右区間(cut,j]に未出現なのはcut≥last[A_{j+1}]であり、そのcut範囲だけscore+1する。 新しいcut=jでは左distinct L_jと一要素右区間の1を初期値として追加する。 各要素追加につき一回の区間加算と新cutの点設定だけでX_jをO(log N)更新し、suffix distinct前計算と合わせO(N log N)。","sourceRevisionIds":["source-abc397-editorial-12457-7f7b906edc8a6fba053224e8ef52a71749ad5e2e4906a0aa157fed62dea2ceb8","source-abc397-f-problem-2ae42bf6a4f9d444b3bd9f3753c4459bbf27db20e58d0056256882c351c16fa2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

三分割を右端jで考えると、prefix[1..j]を二分割したdistinct和の最大X_jとsuffix[j+1..N]のdistinct数を足せばよい。

dp_j(cut)=distinct(1..cut)+distinct(cut+1..j)は、新要素A_{j+1}の直前出現位置lastよりcutが後ろの場合だけ右区間distinctが1増えるため、cut軸のsuffix range addになる。

採用する候補: 全cutの二分割scoreをlazy segment treeで持ち、右端をsweepしてrange add・range maxする

各要素追加につき一回の区間加算と新cutの点設定だけでX_jをO(log N)更新し、suffix distinct前計算と合わせO(N log N)。

棄却する候補: 二つのcut位置(i,j)を全探索し三区間のdistinctを数える

候補O(N²)でN=3×10^5には間に合わない。

A_{j+1}が右区間(cut,j]に未出現なのはcut≥last[A_{j+1}]であり、そのcut範囲だけscore+1する。

新しいcut=jでは左distinct L_jと一要素右区間の1を初期値として追加する。

prefix/suffix distinct L,Rを前計算する。jを増やしながらcut=1..j-1のscoreをsegment treeに保持し、last[value]以降へ+1、新cutをL_j+1でsetする。X_{j+1}=全体maxを取り、X_i+R_{i+1}を最大化する。

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

A_{j+1}が右区間(cut,j]に未出現なのはcut≥last[A_{j+1}]であり、そのcut範囲だけscore+1する。 新しいcut=jでは左distinct L_jと一要素右区間の1を初期値として追加する。 各要素追加につき一回の区間加算と新cutの点設定だけでX_jをO(log N)更新し、suffix distinct前計算と合わせO(N log N)。

## 実装上の注意

- 三区間を非emptyにするcut範囲を守る。last未出現時の境界、new cutのpoint set、R[i+1] indexをずらさない。

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
