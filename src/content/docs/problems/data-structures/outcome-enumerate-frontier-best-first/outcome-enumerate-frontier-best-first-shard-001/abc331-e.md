---
title: "ABC331-E — Set Meal"
draft: true
authoringUnit: {"problemId":"abc331-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc331-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc331-e-problem-c771615a9e19ac2c74b6969333bbc0bcf052767532d5a88a24ccf1d88f07dfab","source-abc331-editorial-7821-c847e2b391347e4d5dbf43067cce67fdb9d95ff161189a9d94fe04ec3eba528b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"heapから主菜iの現在候補を取り出した直後に、その主菜の次の副菜との組だけを追加すれば、未調査全体の最大値を失わない。 禁止判定には元の副菜indexが必要なので、降順sort後も価格と元indexを組で保持する。 heapには各降順列の最大未調査要素が必ずあり、禁止組をL個読み飛ばしてもL+1回以内に答えへ着くので、列挙数を禁止数に比例させられる。","sourceRevisionIds":["source-abc331-e-problem-c771615a9e19ac2c74b6969333bbc0bcf052767532d5a88a24ccf1d88f07dfab","source-abc331-editorial-7821-c847e2b391347e4d5dbf43067cce67fdb9d95ff161189a9d94fe04ec3eba528b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

禁止組が最大10^5個しかないため、価格上位の組を高い順に調べれば、提供される組へ到達するまでに捨てる候補は高々L個である。全NM組を作るのでなく「次に高い組」だけを生成したい。

副菜を価格降順に並べると、主菜iを固定した組は a_i+b_1, a_i+b_2,… という降順列になる。求める候補列は、このN本の降順列のmergeとみなせる。

採用する候補: 各主菜の未調査先頭をmax-heapへ入れ、全組を価格降順に列挙する

heapには各降順列の最大未調査要素が必ずあり、禁止組をL個読み飛ばしてもL+1回以内に答えへ着くので、列挙数を禁止数に比例させられる。

棄却する候補: 全NM組の価格を列挙してsortする

N,Mはともに10^5であり、NM個の生成時点で時間・メモリ上限を超える。

棄却する候補: 最大価格から二分探索し、閾値以上の提供組があるか判定する

禁止組を除いた存在判定は構成できるが、各判定で価格順と禁止情報を突き合わせる必要があり、この問題では上位だけを直接列挙する方が単純で計算量も明確である。

heapから主菜iの現在候補を取り出した直後に、その主菜の次の副菜との組だけを追加すれば、未調査全体の最大値を失わない。

禁止判定には元の副菜indexが必要なので、降順sort後も価格と元indexを組で保持する。

副菜を価格降順にsortし、各主菜iについて先頭副菜との価格和・i・順位0をmax-heapへ入れる。最大候補をpopし、その元index対が禁止集合になければ価格和を答える。禁止なら同じ主菜の次順位をheapへ入れて続ける。

## 典型の発動条件

### sorted listsのk-way merge

発動条件: 各グループ内の候補が単調順に並び、全体の上位だけが必要なとき。

主菜ごとの副菜価格列を降順列とし、各列の先頭だけをheapで競わせる。

### 禁止要素数による探索回数評価

発動条件: 候補を良い順に調べ、失敗する候補の総数が小さく制約されているとき。

提供されない組はL個だけなので、最初の有効候補は高々L+1回目に現れる。

## 問題固有の要素

価格行列a_i+b_jは各行を同じ副菜順で降順化できるため、一般の二次元最大探索をN本の列mergeへ落とせる。

別の問題へ持ち帰る視点: 和・積など片側の順序を固定しても単調性が保たれる二項候補では、全直積を作らず行ごとのfrontierだけを管理する。

## 正当性

heapから主菜iの現在候補を取り出した直後に、その主菜の次の副菜との組だけを追加すれば、未調査全体の最大値を失わない。 禁止判定には元の副菜indexが必要なので、降順sort後も価格と元indexを組で保持する。 heapには各降順列の最大未調査要素が必ずあり、禁止組をL個読み飛ばしてもL+1回以内に答えへ着くので、列挙数を禁止数に比例させられる。

## 実装上の注意

- 禁止集合はsort前の主菜・副菜indexで照合する。次順位がM未満のときだけpushし、価格和は64 bit整数で持つ。

## 復習の核

- 禁止組が0、各主菜の先頭候補が連続して禁止、最後の一組だけ有効な小ケースを全列挙と照合し、heap frontierの不変条件を確認する。

## 計算量と制約

### 時間

O(M log M+(N+L)log(N+L))、N主菜M副菜L禁止組。平衡木で禁止照合する場合はO(L log L)。

### 空間

O(N+M+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M \leq 10^5; 0 \leq L \leq \min(10^5, NM - 1); 1 \leq a_i, b_i \leq 10^9; 1 \leq c_i \leq N; 1 \leq d_j \leq M; (c_i, d_i) \neq (c_j, d_j) if i \neq j.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc331/tasks/abc331_e) — source-abc331-e-problem-c771615a9e19ac2c74b6969333bbc0bcf052767532d5a88a24ccf1d88f07dfab
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc331/editorial/7821) — source-abc331-editorial-7821-c847e2b391347e4d5dbf43067cce67fdb9d95ff161189a9d94fe04ec3eba528b
