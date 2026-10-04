---
title: "ABC353-E — Yet Another Sigma Problem"
draft: true
authoringUnit: {"problemId":"abc353-e","docPath":"src/content/docs/problems/string-geometry/outcome-index-shared-prefixes-with-trie/outcome-index-shared-prefixes-with-trie-shard-001/abc353-e.md","learningOutcomeIds":["outcome-index-shared-prefixes-with-trie"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。"],"tagIds":["tag-trie-prefix","tag-contribution-reordering"],"sourceRevisionIds":["source-abc353-e-problem-664ff6752d2dc14f04612070c41408399f4e648f0981d19c455ddc9db9b84432","source-abc353-editorial-9969-137ec1c5bd08e5a9fce39a58eb3825b744473a3d2ac97cb0be953ee76fae6e09"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"LCPは共有する非空prefix個数。各prefix nodeの通過文字列pair数を足す主客転倒が全LCP和と一致する。新文字列のnodeで既存countを先に足すとi<jのpairだけ各共有prefixで一回数え、その後countを増やして次入力へ備えられる。root空prefixは長さ0なので足さない。","sourceRevisionIds":["source-abc353-e-problem-664ff6752d2dc14f04612070c41408399f4e648f0981d19c455ddc9db9b84432","source-abc353-editorial-9969-137ec1c5bd08e5a9fce39a58eb3825b744473a3d2ac97cb0be953ee76fae6e09"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

- 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。

この解説で扱わないこと:

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 考察

LCP(S_i,S_j) は二文字列が共有する非空 prefix の個数に等しい。したがって各 prefix p について、それを持つ文字列 pair 数を足せば同じ答えになる。

全入力長が3×10^5なので、全 prefix を Trie の node として共有すれば、同じ文字列断片を重複保持せずに頻度を集計できる。

採用する候補: 文字列を順に Trie へ挿入し、各 prefix node を過去に通った文字列数を今回の寄与へ加える。

各 pair は共有する各 prefix node で一回ずつ数えられ、処理量は総文字数に比例する。

棄却する候補: 全文字列 pair ごとに先頭から一致長を比較する。

文字列が似ている最悪例で pair 数 N² と比較長が重なり、総入力長制約内でも二乗時間になる。

S_j の各 prefix node の count は、それを共有する i<j の本数なので、その総和が j と過去全文字列との LCP 合計になる。

文字列末端かどうかではなく、root 以外の通過 node すべてへ count を持つことで prefix 一個ごとの寄与を表す。

空 Trie を用意し、j=1..N の順に S_j の文字をたどる。各文字後の node で現在 count を答えへ加え、その後（または二段目の走査で）S_j が通る全 node の count を1増やす。

## 典型の発動条件

### LCP の共通 prefix 数への分解

発動条件: 全 pair の longest common prefix 長総和を求めるとき。

長さを共有 prefix ごとの indicator sum に展開する。

### Trie 上の通過頻度

発動条件: 多数文字列の prefix ごとの出現数を総入力長で集計したいとき。

prefix を node に共有し、挿入時に path count を更新する。

## 問題固有の要素

最大一致長という max 型量を「長さ k 以上である」の layer cake に分けると、prefix node ごとの単純な pair 数になる。

別の問題へ持ち帰る視点: 整数値の総和は threshold indicator の和へ展開すると、共有構造で数えやすくなる場合がある。

## 正当性

LCPは共有する非空prefix個数。各prefix nodeの通過文字列pair数を足す主客転倒が全LCP和と一致する。新文字列のnodeで既存countを先に足すとi<jのpairだけ各共有prefixで一回数え、その後countを増やして次入力へ備えられる。root空prefixは長さ0なので足さない。

## 実装上の注意

- count を加えてから今回文字列を登録し、自分自身との pair を数えない。空 prefix root は LCP 長に寄与しない。

## 復習の核

- LCP=共有prefix数という等式を短い二文字列で確認する。Trie node の count が「末端数」でなく「通過文字列数」であることに注意する。

## 計算量と制約

### 時間

O(L)、L=Σ|S_i|。trie通過頻度。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3\times 10^5; S_i is a string consisting of lowercase English letters.; 1 \leq |S_i|; |S_1|+|S_2|+\ldots+|S_N|\leq 3\times 10^5; All input numbers are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/tasks/abc353_e) — source-abc353-e-problem-664ff6752d2dc14f04612070c41408399f4e648f0981d19c455ddc9db9b84432
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc353/editorial/9969) — source-abc353-editorial-9969-137ec1c5bd08e5a9fce39a58eb3825b744473a3d2ac97cb0be953ee76fae6e09
