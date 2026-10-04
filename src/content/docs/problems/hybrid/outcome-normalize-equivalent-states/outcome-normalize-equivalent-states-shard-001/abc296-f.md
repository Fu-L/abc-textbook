---
title: "ABC296-F — Simultaneous Swap"
draft: true
authoringUnit: {"problemId":"abc296-f","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc296-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc296-editorial-6117-1769e9bb180dcae3fdd30d6b6507c3bc5af74e5774cd87d74c48940d71cb8bed","source-abc296-f-problem-0d48463f14482bc686535f0cb2ff2767ea3733bafa058b49333b9ecddf2193e6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全異値なら操作ごとに二つの反転数がともに反転し、その和の偶奇は保たれる。一方、位置xを直す操作 `(y,z,x)` はAのswap位置がy,z、Bのswap位置がy,xなので、xより前の値を変えずB_xだけをA_xへ合わせる。未確定suffixのmultiset一致は各段で保たれ、`x≤N−2` ではyと異なるzを選べる。最後の二位置は一致するかswap違いだけである。swap違いなら反転数和は奇数となるため、初期偶数条件の下では起こらず、最後にA=Bとなる。\n\n重複値があれば、等しい二要素に異なる識別ラベルを付け、そのラベルをA内で交換しても実配列は変わらない。この交換で反転parityを反転できるので、ラベルを選んで反転数和を偶数にし、同じ構成を適用できる。","sourceRevisionIds":["source-abc296-editorial-6117-1769e9bb180dcae3fdd30d6b6507c3bc5af74e5774cd87d74c48940d71cb8bed","source-abc296-f-problem-0d48463f14482bc686535f0cb2ff2767ea3733bafa058b49333b9ecddf2193e6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

先に読む単元:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- 交換論による貪欲順の証明。

## 考察

まずAとBのmultisetが一致する必要がある。値が全て異なる場合、各操作はAとBの両方で一回ずつswapするので、二列の反転数の和の偶奇が不変。最後に一致した状態ではその和は偶数だから、初期値が奇数なら不可能である。

十分性は左から位置を確定する構成で示せる。`x=1,…,N−2` について `A_x≠B_x` なら、未確定suffixから `A_x=B_y` となる `y>x` を取り、`z>x, z≠y` を選ぶ。操作 `(i,j,k)=(y,z,x)` はA_xを保ったままB_xをA_xへ直し、確定済みprefixを変えない。

採用する候補: multiset一致、重複の有無、反転数和の偶奇で判定し、全異値時はprefixを固定する構成を使う。

不変量が必要条件を与え、prefix構成が偶奇条件の十分性を示す。

棄却する候補: 操作列を状態探索する。

順列対の状態数は指数的になる。

## 典型の発動条件

### 置換parity不変量

発動条件: 二列へ同時に互換を施す。

反転数の偶奇変化を追う。

### 重複によるparity自由化

発動条件: 同値要素があり識別順を交換しても観測列が変わらない。

一方のparityを任意に反転できるとみなす。

## 問題固有の要素

同時swap制約は全相異時だけ効き、重複一組があるだけでparity障害が消える。

別の問題へ持ち帰る視点: 重複を持つ並べ替えでは置換符号が一意でなくなる。

## 正当性

全異値なら操作ごとに二つの反転数がともに反転し、その和の偶奇は保たれる。一方、位置xを直す操作 `(y,z,x)` はAのswap位置がy,z、Bのswap位置がy,xなので、xより前の値を変えずB_xだけをA_xへ合わせる。未確定suffixのmultiset一致は各段で保たれ、`x≤N−2` ではyと異なるzを選べる。最後の二位置は一致するかswap違いだけである。swap違いなら反転数和は奇数となるため、初期偶数条件の下では起こらず、最後にA=Bとなる。

重複値があれば、等しい二要素に異なる識別ラベルを付け、そのラベルをA内で交換しても実配列は変わらない。この交換で反転parityを反転できるので、ラベルを選んで反転数和を偶数にし、同じ構成を適用できる。

## 実装上の注意

- multiset不一致を先に除外し、parityだけなら反転数全値でなくmod2更新でよい。

## 復習の核

- 小Nの状態BFSと比較し、重複なしの奇偶両例、重複あり、multiset不一致を確認する。

## 計算量と制約

### 時間

O(N log N)、multiset sortと反転parity。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2\times 10^5; 1\leq A_i,B_i\leq N; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/editorial/6117) — source-abc296-editorial-6117-1769e9bb180dcae3fdd30d6b6507c3bc5af74e5774cd87d74c48940d71cb8bed
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/tasks/abc296_f) — source-abc296-f-problem-0d48463f14482bc686535f0cb2ff2767ea3733bafa058b49333b9ecddf2193e6
