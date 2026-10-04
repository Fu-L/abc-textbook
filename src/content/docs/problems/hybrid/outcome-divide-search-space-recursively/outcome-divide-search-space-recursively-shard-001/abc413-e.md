---
title: "ABC413-E — Reverse 2^i"
draft: true
authoringUnit: {"problemId":"abc413-e","docPath":"src/content/docs/problems/hybrid/outcome-divide-search-space-recursively/outcome-divide-search-space-recursively-shard-001/abc413-e.md","learningOutcomeIds":["outcome-divide-search-space-recursively"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc413-e-problem-b33e30b82a6df49f0dc88ff9bbab8b13863a9d73d69009e0e22b19166cd6c101","source-abc413-editorial-13406-d94240a40fe855e57af83485a4cd057185bab32505c42cac77e1e73f3c2d50e4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"全体反転を使ってB+Aを得たいときは、先に各半分をreverse(A),reverse(B)へ到達させてから全体を反転すればよく、単純な全体反転で内部順が崩れる問題を解消できる。 各再帰nodeで子結果の小さい先頭を前に置けば、そのnodeの要素集合から到達可能な最小列を帰納的に構成できる。 PはpermutationなのでA_0≠B_0で、辞書順比較は先頭だけで決まる。B+Aも両半分を反転してから全体を反転すれば実現できる。","sourceRevisionIds":["source-abc413-e-problem-b33e30b82a6df49f0dc88ff9bbab8b13863a9d73d69009e0e22b19166cd6c101","source-abc413-editorial-13406-d94240a40fe855e57af83485a4cd057185bab32505c42cac77e1e73f3c2d50e4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

- pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さ2^Nの列を左右半分に分けると、長さ2^N全体の反転以外の操作は要素を半分間で移さず、全体反転は左右の要素集合を丸ごと交換する。

全体反転は最後に高々一度だけ行う形へ並べ替えられるため、各半分で独立に得られる辞書順最小列 A,B から、A+BまたはB+Aだけを比較すればよい。

採用する候補: power-of-two区間を再帰的に解き、最小化した左右半分を先頭要素の小さい順に連結する

棄却する候補: 許される全区間反転の適用有無や順序を探索して到達permutationを列挙する

操作は重なって非可換で到達候補が巨大になり、dyadic区間の再帰的な半分不変性を利用していない。

長さ1ならその要素を返す。区間を等分して左右を再帰的に最小化し、left[0]<right[0]ならleft+right、逆ならright+leftを返す。根の結果を出力し、各levelでのcopyを含め O(N·2^N) とする。

## 典型の発動条件

### divide and conquer

発動条件: 許可操作区間が2冪境界に整列し、最大操作だけが左右blockを交換するとき。

左右の最適形を独立に求め、親で順序だけ決める。

### 辞書順最小化

発動条件: 候補列の先頭要素が必ず相異なるとき。

二つのblockの先頭を比較するだけで連結順を決定する。

### 操作列の正規化

発動条件: 大域操作と局所操作の順序を交換・共役できるとき。

全体反転を最後へ移し、局所最適化後のblock swapとして扱う。

## 問題固有の要素

区間反転なのに再帰nodeでは「子blockを内部順を保ってswap」できる点が核心で、その実現に子反転2回と親反転1回を使う。

別の問題へ持ち帰る視点: 階層的reverse操作では、親reverseが子の順序も反転するため、子側で事前にreverseして純粋なblock swapを合成できるか調べる。

## 正当性

全体反転を使ってB+Aを得たいときは、先に各半分をreverse(A),reverse(B)へ到達させてから全体を反転すればよく、単純な全体反転で内部順が崩れる問題を解消できる。 各再帰nodeで子結果の小さい先頭を前に置けば、そのnodeの要素集合から到達可能な最小列を帰納的に構成できる。 PはpermutationなのでA_0≠B_0で、辞書順比較は先頭だけで決まる。B+Aも両半分を反転してから全体を反転すれば実現できる。

## 実装上の注意

- 入力は0-index列名でも値は1..2^Nのpermutationで、先頭値は必ず異なる。長さ1のbase caseと出力順を確認し、過剰なvector copyの定数にも注意する。

## 復習の核

- N=1,2,左右半分の最小先頭が逆転する例を全操作closureと比較し、B+Aの到達性も実際の三反転で確認する。

## 計算量と制約

### 時間

O(n2ⁿ)、列長2ⁿ、各再帰levelのcopyを含む。

### 空間

O(2ⁿ)、逐次左右構築のピーク領域。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^{5}; 1 \leq N \leq 18; P is a permutation of (1,2,3,\ldots,2^{N}).; For each input file, the sum of 2^N over all test cases is at most 3 \times 10^{5}.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc413/tasks/abc413_e) — source-abc413-e-problem-b33e30b82a6df49f0dc88ff9bbab8b13863a9d73d69009e0e22b19166cd6c101
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc413/editorial/13406) — source-abc413-editorial-13406-d94240a40fe855e57af83485a4cd057185bab32505c42cac77e1e73f3c2d50e4
