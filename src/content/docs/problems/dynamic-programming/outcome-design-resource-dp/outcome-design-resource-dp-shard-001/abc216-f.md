---
title: "ABC216-F — Max Sum Counting"
draft: true
authoringUnit: {"problemId":"abc216-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc216-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-contribution-reordering"],"sourceRevisionIds":["source-abc216-editorial-2560-a06bb87effd4e4ed9cc8ee0c190370cae8af098b0c6d9dfc5559cd63d5a0934f","source-abc216-f-problem-869388f0644dd957ae924a0dd867f5ed1f4ce38f389c65a44d06eee27222e7c0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"A順で各非空subsetを最後の選択要素iで分類する。この時max AはA_iであり条件は旧B和≤A_i−B_i。旧prefixの和DPを先に集計し後でiを追加すれば各subsetを一度だけ数える。同Aも固定したsort順で最後が一意。","sourceRevisionIds":["source-abc216-editorial-2560-a06bb87effd4e4ed9cc8ee0c190370cae8af098b0c6d9dfc5559cd63d5a0934f","source-abc216-f-problem-869388f0644dd957ae924a0dd867f5ed1f4ce38f389c65a44d06eee27222e7c0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

条件 max A_i ≥ sum B_i は、選んだ集合の中で最大の A を持つ要素を一つ固定すると、残りの B の総和上限として表せる。組 (A_i,B_i) を A_i の昇順に並べれば、各非空部分集合にはソート順で最後に選ばれた一意な要素 i がある。最大値という集合全体の条件を、最大を担当する一要素 i の固定へ変えると、残りは加法的な B のナップサック条件になる。A が同値の要素が複数あっても、ソート後に最後に選んだ添字を証人にすれば各部分集合はちょうど一度だけ数えられる。

棄却する候補: 全ての部分集合を列挙し、それぞれで A の最大値と B の合計を計算して条件を確認する。

N 個の要素の部分集合は 2 の N 乗個あり、N＝5000 では列挙できない。

採用する候補: A の昇順に各要素を最大値の証人として固定し、それ以前の要素から B 和が A_i−B_i 以下となる選び方を部分和 DP で数える。

全ての非空部分集合を最後の要素で重複なく分類でき、以前の要素の情報は B の総和別個数だけで十分になる。

A 順の最後の選択要素で部分集合を分割し、走査済み要素の B 和別選択数を 0/1 ナップサック DP として維持して閾値以下を加算する。

## 典型の発動条件

### 極値を担当する証人の固定

発動条件: 部分集合条件に最大値または最小値が現れ、各集合を一意な極値要素で分類できるとき。

A でソートし、最後に選んだ i を最大 A の担当として、残りの選択を以前の要素だけへ限定する。

### 部分和の 0/1 ナップサック数え上げ

発動条件: 各要素を高々一度選び、重み総和別の部分集合数を逐次維持するとき。

走査済み要素の B 和 s ごとの個数を持ち、i を証人にする前に s≤A_i−B_i の個数を答えへ足す。

## 問題固有の要素

証人 i 自身の B_i も総和へ含まれるため、以前の要素へ許される上限は A_i ではなく A_i−B_i になる。

別の問題へ持ち帰る視点: 極値要素を固定して残りを DP するときは、証人自身が加法条件へ寄与する分を先に差し引く。

## 正当性

A順で各非空subsetを最後の選択要素iで分類する。この時max AはA_iであり条件は旧B和≤A_i−B_i。旧prefixの和DPを先に集計し後でiを追加すれば各subsetを一度だけ数える。同Aも固定したsort順で最後が一意。

## 実装上の注意

- 要素 i の寄与を現在の DP から数えてから B_i を追加し、i を以前の要素として同じ寄与へ混ぜない。
- A_i−B_i が負なら寄与は 0 とし、B 和の DP 更新は降順に行って同じ要素の複数回使用を防ぐ。

## 復習の核

- max と総和が同じ不等式に現れたら、max を達成する要素を固定して残りへ許される総和を導く。
- 極値が同値でも値だけで分類せず、ソート後の最後の添字という一意な証人を使って重複を避ける。

## 計算量と制約

### 時間

N要素、B和上限V=max A_i。sort O(N log N)、0/1 DP O(NV)。

### 空間

和別個数 O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5000; 1 \leq A_i,B_i \leq 5000; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/editorial/2560) — source-abc216-editorial-2560-a06bb87effd4e4ed9cc8ee0c190370cae8af098b0c6d9dfc5559cd63d5a0934f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/tasks/abc216_f) — source-abc216-f-problem-869388f0644dd957ae924a0dd867f5ed1f4ce38f389c65a44d06eee27222e7c0
