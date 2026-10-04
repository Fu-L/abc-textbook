---
title: "ABC294-F — Sugar Water 2"
draft: true
authoringUnit: {"problemId":"abc294-f","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-ratio-by-parametric-search/outcome-optimize-ratio-by-parametric-search-shard-001/abc294-f.md","learningOutcomeIds":["outcome-optimize-ratio-by-parametric-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-search"],"excludedTopics":["fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-fractional-parametric-search"],"sourceRevisionIds":["source-abc294-editorial-6007-de45be4385ee21284a25107feade9404328fc47a94c7f503c5abbdd9959c2416","source-abc294-f-problem-4cac15dbeb01b266629f56e03570d7c6798a2ea688747b57db91c1296762e613"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"濃度≥xは総sugar−x総weight≥0で、各溶液の変換scoreの和が非負と同値。片側scoreをsortして補数境界をlower_boundすれば重複濃度も含む全pair数を正確に数える。xを上げると成立pair数は減るので、count≥Kの最大境界がK番目の濃度になる。正weightにより変形の不等号向きは保存される。","sourceRevisionIds":["source-abc294-editorial-6007-de45be4385ee21284a25107feade9404328fc47a94c7f503c5abbdd9959c2416","source-abc294-f-problem-4cac15dbeb01b266629f56e03570d7c6798a2ea688747b57db91c1296762e613"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [fractional programming・比率parametric search](src/content/docs/learn/geometry-optimization/fractional-parametric-search.md)

- 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。

先に読む単元:

- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

## 考察

濃度x以上かは各溶液の余剰量s-t*x/(1-x)を足した値が0以上かで判定できる。

採用する候補: 答え濃度の二分探索と余剰列sort

固定xで一方の余剰をsortし、各他方に対し和が非負となる個数を二分探索すればK番目判定ができる。

棄却する候補: NM個の混合濃度を列挙sort

最大2.5×10^9組で生成できない。

比率不等式をA_i-(A_i+B_i)xとC_j-(C_j+D_j)xの和へ交差乗算すれば、ペア条件が二数の和の符号になる。

xを0..1で十分回二分探索し、各判定で青木側scoreをsort、各高橋側scoreについてlower_boundで和≥0のペア数を数え、K以上なら下限を上げる。

## 典型の発動条件

### K番目値の二分探索

発動条件: 巨大な直積集合の順位値を求める。

閾値以上の要素数を判定する。

### 二集合pair和数え上げ

発動条件: 条件がu_i+v_j≥0へ分離できる。

片側sortとlower_boundで数える。

## 問題固有の要素

混合後の分数比較を各容器の閾値余剰へ分離すると、直積濃度がpair和問題になる。

別の問題へ持ち帰る視点: 比率の順位問題は閾値との差を加法分離する。

## 正当性

濃度≥xは総sugar−x総weight≥0で、各溶液の変換scoreの和が非負と同値。片側scoreをsortして補数境界をlower_boundすれば重複濃度も含む全pair数を正確に数える。xを上げると成立pair数は減るので、count≥Kの最大境界がK番目の濃度になる。正weightにより変形の不等号向きは保存される。

## 実装上の注意

- 百分率出力の100倍を忘れず、判定回数を誤差保証に十分取り、pair数は64ビットで持つ。

## 復習の核

- 小NMの全濃度sortと比較し、同濃度多数、K=1,NM、極端な砂糖水比を確認する。

## 計算量と制約

### 時間

O(I(M log M+N log M))、Iは誤差保証用二分探索回数。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M \leq 5 \times 10^4; 1 \leq K \leq N \times M; 1 \leq A_i, B_i, C_i, D_i \leq 10^5; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/editorial/6007) — source-abc294-editorial-6007-de45be4385ee21284a25107feade9404328fc47a94c7f503c5abbdd9959c2416
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/tasks/abc294_f) — source-abc294-f-problem-4cac15dbeb01b266629f56e03570d7c6798a2ea688747b57db91c1296762e613
