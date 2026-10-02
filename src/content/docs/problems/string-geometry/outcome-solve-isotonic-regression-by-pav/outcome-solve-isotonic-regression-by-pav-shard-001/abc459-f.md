---
title: "ABC459-F — -1, +1"
draft: true
authoringUnit: {"problemId":"abc459-f","docPath":"src/content/docs/problems/string-geometry/outcome-solve-isotonic-regression-by-pav/outcome-solve-isotonic-regression-by-pav-shard-001/abc459-f.md","learningOutcomeIds":["outcome-solve-isotonic-regression-by-pav"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-isotonic-regression-pav"],"sourceRevisionIds":["source-abc459-editorial-20507-0f56e72dcc42a017be4eb8cd3cab4a557b2c735265b6a856f36b07110843fb59","source-abc459-f-problem-8bdd1d46eed2a90f4a233fad12113cbd0bfc99cc42f9b10b18ae084bc1b985c3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_i−iを広義増加にすれば元列は狭義増加。右への単位移動は各prefix和を減らすので、到達目標のprefix和は元以下で操作数はprefix差の和に等しい。逆転blockを総和一定でfloor/ceilへ均すと広義増加を作り、許容prefixを出来る限り大きく保つので必要移動数が最小。境界逆転がなくなるまでmergeし整数余りを後ろへ置くとこの最適列を一意に復元する。","sourceRevisionIds":["source-abc459-editorial-20507-0f56e72dcc42a017be4eb8cd3cab4a557b2c735265b6a856f36b07110843fb59","source-abc459-f-problem-8bdd1d46eed2a90f4a233fad12113cbd0bfc99cc42f9b10b18ae084bc1b985c3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [isotonic regression・PAV](src/content/docs/learn/geometry-optimization/isotonic-regression.md)

- 単調制約付き凸最小化で違反する隣接blockをpoolし、block optimumが単調になるまでmergeする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

対象外:

- isotonic regression・PAVの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

A_iをA_i-iへずらすと狭義増加化は広義増加化になる。隣接逆転を均す操作を前から繰り返した最終列は一意で、連続blockごとの総和をほぼ均等配分した形になる。

採用する候補: 各要素を一blockとしてstackへ入れ、直前blockの最終値が次blockの先頭値を超える間mergeし、block和と長さから floor((S+t)/len) の均し列を表す。

各block内の最適列は総和固定の最も平坦な広義単調列で、隣接block境界が逆転した場合は別々に保つ解が不可能なのでmergeが強制される。

棄却する候補: 最左の逆転位置へ操作を一回ずつ適用し、列が単調になるまでsimulationする。

値差が巨大だと操作回数も巨大になり、最終形は得られても逐次simulationは入力値に比例する。

長さL・総和Sのblockを最も均す整数列は floor((S+t)/L), t=0..L-1 で、値は二つの隣接整数だけになる。

stack mergeは各blockを一度pushし一度popするだけなので、境界比較を定数時間にできれば全体線形である。

shift後Aを左から処理し、blockに(l,r,sum)を持つ。top二blockの均し列境界値が非単調ならsum・lengthを合併する。確定blockごとにquotient/remainderから最終Bを復元し、元AからBへの必要操作数を公式に集計する。

## 典型の発動条件

### pool adjacent violators

発動条件: 単調制約下で隣接違反をblock平均化して一意解を求めるとき。

stack上で違反blockをmergeし、平坦な整数列へ均す。

### index shiftによる単調制約変換

発動条件: 隣接差が少なくとも1の整数列を作りたいとき。

A_i-iで狭義単調を広義単調へ変える。

## 問題固有の要素

局所操作の回数を追う代わりに、保存されるblock総和と最終単調形を直接構成する。

別の問題へ持ち帰る視点: isotonic型問題では隣接blockの解が境界で両立しないとき、その二blockを一つの平均化問題へ統合する。

## 正当性

A_i−iを広義増加にすれば元列は狭義増加。右への単位移動は各prefix和を減らすので、到達目標のprefix和は元以下で操作数はprefix差の和に等しい。逆転blockを総和一定でfloor/ceilへ均すと広義増加を作り、許容prefixを出来る限り大きく保つので必要移動数が最小。境界逆転がなくなるまでmergeし整数余りを後ろへ置くとこの最適列を一意に復元する。

## 実装上の注意

- 負のSに対する floor divisionを数学的床で実装し、remainder配置順を単調になるよう統一する。shiftの0/1-indexを混同しない。

## 復習の核

- 一blockのS,Lから均し列を復元し、隣接block境界違反ならmergeが必要な理由を交換法で確認する。

## 計算量と制約

### 時間

O(N)。長さ・総和blockのstack mergeとprefix操作数。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 3 \times 10^5; 1 \le N \le 2 \times 10^5; 0 \le A_i \le 10^9; The sum of N across all test cases is at most 6 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/editorial/20507) — source-abc459-editorial-20507-0f56e72dcc42a017be4eb8cd3cab4a557b2c735265b6a856f36b07110843fb59
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc459/tasks/abc459_f) — source-abc459-f-problem-8bdd1d46eed2a90f4a233fad12113cbd0bfc99cc42f9b10b18ae084bc1b985c3
