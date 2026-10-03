---
title: "ABC430-G — Range Set Modifying Query"
draft: true
authoringUnit: {"problemId":"abc430-g","docPath":"src/content/docs/problems/data-structures/outcome-prune-range-actions-by-node-invariant/outcome-prune-range-actions-by-node-invariant-shard-001/abc430-g.md","learningOutcomeIds":["outcome-prune-range-actions-by-node-invariant"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-bitset-word-parallel","unit-range-monoid-aggregation"],"excludedTopics":["Segment Tree Beatsの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-segment-tree-beats","tag-amortized-monotone-progress","tag-bitset-word-parallel"],"sourceRevisionIds":["source-abc430-editorial-14300-ce79636c7dd94da6b9fb5e74bc13506c28d8fa953f03a1aa447465ec5a7a1fc2","source-abc430-g-problem-086fab8b8983d2a10fd1b13d0e952735274293b0e5a7a4d35689090bcee90392"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"(O\\A)∩(a∪b)=∅ なら、操作対象の各要素は区間内の全集合に含まれるか全く含まれないので、全葉のサイズ変化が同じで節点へ一括適用できる。 mapping 失敗で子へ降り再集約すると O\\A のサイズが真に減る。クエリ一回で曖昧度を増やせる節点は O(log N)、増分は高々 1 である。 失敗するたび曖昧要素 O\\A が減り、その増加総量も制限されるため全クエリを償却高速に処理できる。","sourceRevisionIds":["source-abc430-editorial-14300-ce79636c7dd94da6b9fb5e74bc13506c28d8fa953f03a1aa447465ec5a7a1fc2","source-abc430-g-problem-086fab8b8983d2a10fd1b13d0e952735274293b0e5a7a4d35689090bcee90392"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Segment Tree Beats](src/content/docs/learn/query/segment-tree-beats.md)

- nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [bitsetで集合演算をword並列化する](src/content/docs/learn/query/bitset-word-parallel.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- Segment Tree Beatsの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各位置の集合への区間追加・削除は f(X)=(X\a)∪b という写像で合成できる。一方、区間最大要素数とその個数だけでは、対象要素が各集合に入っているか分からず写像を常に適用できない。

採用する候補: 和集合 O・共通部分 A・最大サイズ M・達成数 C を持つ Segment Tree Beats を構築し、一括適用不能な節点だけ子へ降りる。

失敗するたび曖昧要素 O\A が減り、その増加総量も制限されるため全クエリを償却高速に処理できる。

棄却する候補: 通常の遅延セグメント木に最大サイズと達成数だけを持たせる。

追加・削除対象が区間内の集合に混在すると各葉のサイズ変化が異なり、節点情報だけから mapping を計算できない。

(O\A)∩(a∪b)=∅ なら、操作対象の各要素は区間内の全集合に含まれるか全く含まれないので、全葉のサイズ変化が同じで節点へ一括適用できる。

mapping 失敗で子へ降り再集約すると O\A のサイズが真に減る。クエリ一回で曖昧度を増やせる節点は O(log N)、増分は高々 1 である。

集合を 64-bit mask とし、各節点に OR、AND、最大 popcount、最大達成葉数、遅延写像 (remove,add) を保持する。完全被覆時に成功条件を満たせば写像と集約を更新し、失敗なら push して子へ再帰する。根の M,C を各質問後に取得する。

写像を正準形f(X)=(X&~a)|b、a&b=0で持つ。先に(a1,b1)、後に(a2,b2)を適用した合成は、b=(b1&~a2)|b2、a=(a1|a2)&~b。後の追加が先の削除を上書きする順序を保つ。

一括適用時はORとANDをともにfで更新する。全葉共通のサイズ変化はΔ=popcount(b&~O)−popcount(a&A)なので、最大サイズM←M+Δ、達成数Cは不変。初期の全空集合の節点ではO=A=M=0、Cは実際の葉数とする。

ポテンシャルを全内部節点のpopcount(O&~A)の和に取る。完全被覆で失敗した節点では、混在していた対象bitが操作後に全て0または全て1となり、一つ以上消える。曖昧度が増える可能性があるのは区間境界をまたぐO(log N)節点だけ。単bitの追加・削除一回につき各節点の増加は高々1なので、失敗下降の総数はO(NB+Q log N)。各操作の境界走査を含めO(NB+Q log N)であり、元のO((N+Q)B log N)も保守的上界として成立する。複数bitをまとめた一般写像を一回と数えるなら増加上界にBを掛ける。

## 典型の発動条件

### Segment Tree Beats

発動条件: 区間写像を節点情報だけで適用できる場合とできない場合があり、失敗回数を単調量で償却できるとき。

集合の混在度 O\A を失敗時に減るポテンシャルとして、必要な場合だけ子へ降りる。

### bitset による集合写像

発動条件: 要素 universe が機械語幅程度で、和・積・差を頻繁に扱うとき。

集合と追加・削除写像を bit mask にし、OR/AND/AND-NOT を定数時間で行う。

### 区間最大値と達成数の集約

発動条件: 葉の値の最大と、その最大を取る位置数を繰り返し問うとき。

子の最大を比較し、等しければ達成数を足すモノイドとして保持する。

## 問題固有の要素

遅延写像が適用可能かを、区間内で membership が混在する要素集合 O\A との交差だけで判定できる。

別の問題へ持ち帰る視点: Segment Tree Beats では失敗を許す代わりに、失敗のたび減るポテンシャルと更新で増える総量を明示する。

## 正当性

(O\A)∩(a∪b)=∅ なら、操作対象の各要素は区間内の全集合に含まれるか全く含まれないので、全葉のサイズ変化が同じで節点へ一括適用できる。 mapping 失敗で子へ降り再集約すると O\A のサイズが真に減る。クエリ一回で曖昧度を増やせる節点は O(log N)、増分は高々 1 である。 失敗するたび曖昧要素 O\A が減り、その増加総量も制限されるため全クエリを償却高速に処理できる。

## 実装上の注意

- 写像合成では先の remove/add と後の操作順を保つ。葉・内部節点の OR/AND 初期値、成功時の M の増減と C 不変を整合させる。

## 復習の核

- 一括適用条件が対象 bit の membership 一様性と同値か、mapping 失敗時にポテンシャルが減ることを確認する。

## 計算量と制約

### 時間

償却O((N+Q)B log N)、Bは集合のbit数（64-bit mask内）。曖昧bitの減少へ失敗下降を課金する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 3\times 10^5; 1\leq Q \leq 3\times 10^5; For each query, 1 \leq L \leq R \leq N.; For type 1,2 queries, 1 \leq x \leq 60.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc430/editorial/14300) — source-abc430-editorial-14300-ce79636c7dd94da6b9fb5e74bc13506c28d8fa953f03a1aa447465ec5a7a1fc2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc430/tasks/abc430_g) — source-abc430-g-problem-086fab8b8983d2a10fd1b13d0e952735274293b0e5a7a4d35689090bcee90392
