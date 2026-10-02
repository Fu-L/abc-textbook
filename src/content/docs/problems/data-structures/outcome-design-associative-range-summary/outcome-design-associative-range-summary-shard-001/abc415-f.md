---
title: "ABC415-F — Max Combo"
draft: true
authoringUnit: {"problemId":"abc415-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc415-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc415-editorial-13485-ecd648f75179785509f8b9157eb02e89f55c030b9c0efdef66a026c4a0b0176d","source-abc415-f-problem-db40abf308f6599da193860db7308c2e227e4301e69869227a21eb7da63019da"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"境界文字が等しければcross=a.suffixLen+b.prefixLenをbest候補にする。aが全同一ならmerge prefixはa.len+b.prefixLenまで伸び、suffixも対称に処理する。 空区間identityを長さ0として特別扱いすれば op(e,x)=op(x,e)=x を保証でき、標準segment treeのrange productをそのまま使える。 隣接二nodeを境界文字の一致でO(1) mergeでき、点更新と任意substring queryを各O(log N)で処理できる。","sourceRevisionIds":["source-abc415-editorial-13485-ecd648f75179785509f8b9157eb02e89f55c030b9c0efdef66a026c4a0b0176d","source-abc415-f-problem-db40abf308f6599da193860db7308c2e227e4301e69869227a21eb7da63019da"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

query区間の最長同一文字runは、左右子区間内の最大runか、左suffixと右prefixが同じ文字のときその連結runのいずれかである。

merge後のprefix/suffixを正しく延長するには、子区間全体が同じ文字かどうか、または区間長を持つ必要がある。

採用する候補: prefix文字・長さ、suffix文字・長さ、区間全体同一flag、内部最大runをmonoidとしてsegment treeに載せる

隣接二nodeを境界文字の一致でO(1) mergeでき、点更新と任意substring queryを各O(log N)で処理できる。

棄却する候補: 更新後の各type2区間を左から走査してrun lengthを数え直す

一query O(N)となりQ=5×10^5では間に合わず、変更は一点だけなのに既存区間情報を再利用しない。

境界文字が等しければcross=a.suffixLen+b.prefixLenをbest候補にする。aが全同一ならmerge prefixはa.len+b.prefixLenまで伸び、suffixも対称に処理する。

空区間identityを長さ0として特別扱いすれば op(e,x)=op(x,e)=x を保証でき、標準segment treeのrange productをそのまま使える。

各文字をlen=1、prefix=suffix=その文字/1、all=true、best=1のnodeへ変換してbuildする。mergeでlen、all、prefix、suffix、bestを更新する。type1はleaf置換、type2はprod(l,r)のbestを出力する。

## 典型の発動条件

### 区間summary monoid

発動条件: query答えが左右内部の答えと境界をまたぐ候補から合成できるとき。

prefix/suffix/全体flag/最大値を閉じたmerge情報として持つ。

### segment tree

発動条件: 一点更新と結合可能な区間queryが大量にあるとき。

文字leafを更新し、substring nodeをO(log N)で取得する。

## 問題固有の要素

最長run全体だけでは境界mergeできないため、境界へ接続可能なprefix/suffixを証拠として一緒に保持する。

別の問題へ持ち帰る視点: 部分列の連続構造をsegment tree化するときは、内部最適に加えて左右境界から伸びる未完成解を状態にする。

## 正当性

境界文字が等しければcross=a.suffixLen+b.prefixLenをbest候補にする。aが全同一ならmerge prefixはa.len+b.prefixLenまで伸び、suffixも対称に処理する。 空区間identityを長さ0として特別扱いすれば op(e,x)=op(x,e)=x を保証でき、標準segment treeのrange productをそのまま使える。 隣接二nodeを境界文字の一致でO(1) mergeでき、点更新と任意substring queryを各O(log N)で処理できる。

## 実装上の注意

- all=trueの子でのみprefix/suffixを反対側へ延長する。identityの文字値を通常文字として比較せず、l,rのhalf-open変換を統一する。

## 復習の核

- 長さ1、全同一、境界で二runが結合／分裂する更新、queryがnode境界をまたぐ例をsubstring直接走査と比較する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 1 and 5 \times 10^5, inclusive.; S is a string of length N consisting of lowercase English letters.; Q is an integer between 1 and 5 \times 10^5, inclusive.; Type 1 queries satisfy the following constraints: i is an integer between 1 and N, inclusive. x is a lowercase English letter.; i is an integer between 1 and N, inclusive.; x is a lowercase English letter.; Type 2 queries satisfy the following constraints: l,r are integers satisfying 1 \le l \le r \le N.; l,r are integers satisfying 1 \le l \le r \le N.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc415/editorial/13485) — source-abc415-editorial-13485-ecd648f75179785509f8b9157eb02e89f55c030b9c0efdef66a026c4a0b0176d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc415/tasks/abc415_f) — source-abc415-f-problem-db40abf308f6599da193860db7308c2e227e4301e69869227a21eb7da63019da
