---
title: "ABC296-F — Simultaneous Swap"
draft: true
authoringUnit: {"problemId":"abc296-f","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc296-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc296-editorial-6117-1769e9bb180dcae3fdd30d6b6507c3bc5af74e5774cd87d74c48940d71cb8bed","source-abc296-f-problem-0d48463f14482bc686535f0cb2ff2767ea3733bafa058b49333b9ecddf2193e6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重複値二個の識別ラベルを交換しても元配列は変わらないため、必要な置換parityを選べる。 値集合が違えば不能、重複があれば同値要素の交換でparityを自由に反転でき、なければparity一致が必要十分となる。","sourceRevisionIds":["source-abc296-editorial-6117-1769e9bb180dcae3fdd30d6b6507c3bc5af74e5774cd87d74c48940d71cb8bed","source-abc296-f-problem-0d48463f14482bc686535f0cb2ff2767ea3733bafa058b49333b9ecddf2193e6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

操作はAとBで同時に一回ずつ互換を行うため、要素が全て異なる場合は二列の反転数parityのxorが不変である。

採用する候補: multiset一致と重複有無・反転parity判定

値集合が違えば不能、重複があれば同値要素の交換でparityを自由に反転でき、なければparity一致が必要十分となる。

棄却する候補: 操作列を探索

状態数が順列対で指数的。

重複値二個の識別ラベルを交換しても元配列は変わらないため、必要な置換parityを選べる。

A,Bをsortしてmultiset一致を確認し、重複があればYes。全相異ならFenwick tree等で両反転数parityを求め、一致するときだけYes。

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

重複値二個の識別ラベルを交換しても元配列は変わらないため、必要な置換parityを選べる。 値集合が違えば不能、重複があれば同値要素の交換でparityを自由に反転でき、なければparity一致が必要十分となる。

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
