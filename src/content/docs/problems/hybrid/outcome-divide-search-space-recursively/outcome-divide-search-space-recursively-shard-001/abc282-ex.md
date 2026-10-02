---
title: "ABC282-EX — Min + Sum"
draft: true
authoringUnit: {"problemId":"abc282-ex","docPath":"src/content/docs/problems/hybrid/outcome-divide-search-space-recursively/outcome-divide-search-space-recursively-shard-001/abc282-ex.md","learningOutcomeIds":["outcome-divide-search-space-recursively"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-idempotent-overlap-range-query"],"excludedTopics":["再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-recursive-divide-and-conquer","tag-amortized-monotone-progress","tag-idempotent-overlap-range-query"],"sourceRevisionIds":["source-abc282-editorial-5404-af7ca5d897c8ea3ead4396fabb25b13e43b7b0d2a368066302179faa9f21794c","source-abc282-ex-problem-467f20007e97f251312a9a6d652bba298cf793d3a81d179c5f942db55b98b68e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"l≤M≤rなら条件はPB[r]-PB[l-1]≤S-A_Mとなり、l固定ではrのvalid集合がprefix、r固定ではlのvalid集合がsuffixになる。 [L,M]と[M,R]の短い方だけendpointを固定すると、再帰treeで各indexが短い側に入るたび担当区間sizeが少なくとも半減する。 最小位置で左右へ再帰すれば、各subarrayはその最小要素を代表とするnodeで一度だけcross intervalとして数えられる。 minimumの変化を消し、各indexの列挙回数をsmall-side規則で対数回に抑えられる。","sourceRevisionIds":["source-abc282-editorial-5404-af7ca5d897c8ea3ead4396fabb25b13e43b7b0d2a368066302179faa9f21794c","source-abc282-ex-problem-467f20007e97f251312a9a6d652bba298cf793d3a81d179c5f942db55b98b68e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-divide-search-space-recursively"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(3,1),B=(2,4),S=6。","procedure":["singletonは3+2=5、1+4=5でvalid。","全域はminA1+sumB6=7でinvalid。"],"executionTarget":null,"expectedResult":"valid区間2個。","verificationStatus":"not_applicable","learningUnitIds":["unit-recursive-divide-and-conquer"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-divide-search-space-recursively"],"prerequisiteIds":["unit-amortized-monotone-progress","unit-idempotent-overlap-range-query"],"attainmentCondition":"Bに負値を許すと端点二分探索は保てるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"prefix Bが単調でなくなりvalid端点がprefix/suffixとは限らない。非負/正のBという適用条件が必要。"},"answer":{"reasoningOrVerification":"prefix Bが単調でなくなりvalid端点がprefix/suffixとは限らない。非負/正のBという適用条件が必要。","procedure":["具体例の各状態・寄与を再計算する。","prefix Bが単調でなくなりvalid端点がprefix/suffixとは限らない。非負/正のBという適用条件が必要。"],"expectedResult":"prefix Bが単調でなくなりvalid端点がprefix/suffixとは限らない。非負/正のBという適用条件が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

- pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [冪等演算のoverlap range query・Sparse Table](src/content/docs/learn/query/idempotent-overlap-range-query.md)

対象外:

- 再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

B_i≥0なのでprefix sum PBは非減少で、区間minimumが固定されればsumB≤S-minという条件の相手endpoint範囲を二分探索できる。

区間[L,R]のA最小位置Mを選ぶと、Mを含む全subarrayのminimumはA_Mに固定され、残りは左右再帰へ重複なく分割できる。

採用する候補: range minimum位置でdivide-and-conquerし、Mを含むintervalは短い側のendpointだけ列挙して、長い側の有効範囲をPB上のbinary searchで数える。

minimumの変化を消し、各indexの列挙回数をsmall-side規則で対数回に抑えられる。

棄却する候補: 全(l,r)を列挙し、RMQとprefix sumで条件を定数/対数時間判定する。

interval自体が二次個あるためN≤2×10^5に間に合わない。

l≤M≤rなら条件はPB[r]-PB[l-1]≤S-A_Mとなり、l固定ではrのvalid集合がprefix、r固定ではlのvalid集合がsuffixになる。

[L,M]と[M,R]の短い方だけendpointを固定すると、再帰treeで各indexが短い側に入るたび担当区間sizeが少なくとも半減する。

最小位置で左右へ再帰すれば、各subarrayはその最小要素を代表とするnodeで一度だけcross intervalとして数えられる。

RMQまたはmin Cartesian treeで各区間の最小位置Mを得る。leftが短ければ各l∈[L,M]についてPB上で最大r∈[M,R]を探し、rightが短ければ各rについて最小lを探す。cross数を加え、[L,M-1],[M+1,R]へ再帰する。

## 典型の発動条件

### minimum-pivot divide-and-conquer

発動条件: subarray costにminimum/maximumが含まれ、そのextremum位置を含む区間で値を固定できるとき。

range最小位置をpivotにcross intervalを数え、左右へ再帰する。

### smaller-side enumeration

発動条件: divide-and-conquerのpivotが偏り得るが、cross pairの片側endpointだけ列挙できるとき。

短い側を走査して各要素の担当回数を対数に抑える。

### monotone prefix sum binary search

発動条件: 非負列の区間和上限からendpointの境界を求めるとき。

非減少PBにlower/upper_boundしてvalid endpoint数を取る。

## 問題固有の要素

minimum pivotを含むintervalではmin項が定数A_Mになり、min+sumという混合条件が単なるprefix sum差の閾値へ変わる。

別の問題へ持ち帰る視点: extremumと加法量が混ざる区間条件では、extremumを固定する分割とprefix sum queryを組み合わせる。

## 正当性

l≤M≤rなら条件はPB[r]-PB[l-1]≤S-A_Mとなり、l固定ではrのvalid集合がprefix、r固定ではlのvalid集合がsuffixになる。 [L,M]と[M,R]の短い方だけendpointを固定すると、再帰treeで各indexが短い側に入るたび担当区間sizeが少なくとも半減する。 最小位置で左右へ再帰すれば、各subarrayはその最小要素を代表とするnodeで一度だけcross intervalとして数えられる。 minimumの変化を消し、各indexの列挙回数をsmall-side規則で対数回に抑えられる。

## 実装上の注意

- S-A_M<0ならpivotを含むgood intervalは0で、unsigned underflowを避ける。
- B_i=0でPBが同値になるため、≤条件に合うupper_bound/lower_boundの種類と検索区間を正しく選ぶ。

## 復習の核

- 同じminimumが複数ある列でtie規約を固定し、あるsubarrayがどのpivot nodeで一度だけ数えられるかCartesian tree上で確認する。

## 計算量と制約

### 時間

O(N log²N)、短い側endpointは各要素O(log N)回、各二分探索O(log N)。

### 空間

O(N)、prefix・Cartesian tree・再帰stack。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq S \leq 3 \times 10^{14}; 0 \leq A_i \leq 10^{14}; 0 \leq B_i \leq 10^9; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(3,1),B=(2,4),S=6。

1. singletonは3+2=5、1+4=5でvalid。
2. 全域はminA1+sumB6=7でinvalid。

期待される結果: valid区間2個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

Bに負値を許すと端点二分探索は保てるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

prefix Bが単調でなくなりvalid端点がprefix/suffixとは限らない。非負/正のBという適用条件が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/editorial/5404) — source-abc282-editorial-5404-af7ca5d897c8ea3ead4396fabb25b13e43b7b0d2a368066302179faa9f21794c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/tasks/abc282_h) — source-abc282-ex-problem-467f20007e97f251312a9a6d652bba298cf793d3a81d179c5f942db55b98b68e
