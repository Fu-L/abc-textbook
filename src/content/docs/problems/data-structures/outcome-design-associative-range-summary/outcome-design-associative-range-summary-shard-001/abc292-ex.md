---
title: "ABC292-EX — Rating Estimator"
draft: true
authoringUnit: {"problemId":"abc292-ex","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc292-ex.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc292-editorial-5887-7498e511a2951ba3c4f47d7ef98b7c42f5f9a34d616491b4d39b45c93e8cfb43","source-abc292-ex-problem-9f6fad77868d72dbd6f000ad47dea0254c74ec49279cbf1d42f024da899fc99b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"Σ_{i≤s}(a_i−B)≥0はprefix平均≥Bと同値。区間の非空prefixはSだけに入るか、S全体とTの非空prefixからなるので結合式が成立する。maxPrefixは区間を伸ばすと単調非減少であり、最初に0以上となる境界をmax_rightで得られる。非空prefixが一つも該当しなければ問題の規則通り全N項を使う。","sourceRevisionIds":["source-abc292-editorial-5887-7498e511a2951ba3c4f47d7ef98b7c42f5f9a34d616491b4d39b45c93e8cfb43","source-abc292-ex-problem-9f6fad77868d72dbd6f000ad47dea0254c74ec49279cbf1d42f024da899fc99b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

更新後の値a_iからq_i=a_i−Bを作る。平均が初めてB以上になる位置は、非空prefix和が初めて0以上になる位置sである。存在しなければs=N。求めるratingはB+(Σ_{i≤s}q_i)/sである。

各区間に(sum,maxPrefix)を持たせ、maxPrefixは非空prefixだけを対象とする。葉は(q_i,q_i)、空区間の単位元は(0,−∞)。S,Tの結合は(sumS+sumT,max(maxPrefixS,sumS+maxPrefixT))となる。

max_rightの判定を「maxPrefix<0」とする。単位元では真で、区間を右へ伸ばすとmaxPrefixは減らないため、最初の失敗位置を木上で探索できる。戻り値がrなら、r<Nの場合s=r+1、r=Nならs=N。区間[0,s)のsumからratingを求める。一点更新・探索・区間和は各O(log N)。空prefixの和0を最大に含めると、全ての探索が冒頭で失敗するので定義を区別する。

## 典型の発動条件

### prefix最大モノイド

発動条件: 更新列で閾値を初めて越えるprefixを探す。

区間和と最大prefix和を結合してsegment treeに載せる。

### segment tree上の二分探索

発動条件: prefix判定が単調に失敗する最初の位置が欲しい。

左から節点を降りてsを求める。

## 問題固有の要素

平均条件をp_i-Bの符号付き累積和へ移すと、動的な最初の閾値越えになる。

別の問題へ持ち帰る視点: 動的平均条件は基準値を各項から引いてprefix問題へ変換する。

## 正当性

Σ_{i≤s}(a_i−B)≥0はprefix平均≥Bと同値。区間の非空prefixはSだけに入るか、S全体とTの非空prefixからなるので結合式が成立する。maxPrefixは区間を伸ばすと単調非減少であり、最初に0以上となる境界をmax_rightで得られる。非空prefixが一つも該当しなければ問題の規則通り全N項を使う。

## 実装上の注意

- 非負prefixが無い場合はs=Nとし、葉・単位元のmaxPrefix定義を空区間と混同しない。

## 復習の核

- 直接prefix走査と照合し、最初の要素で到達・最後まで負・更新でsが左右へ動く例を確認する。

## 計算量と制約

### 時間

O(N+Q log N)、木上探索で最初の非負prefixを得る。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 1 \leq B \leq 10^9; 1 \leq Q \leq 10^5; 0 \leq a_i \leq 10^9; 1 \leq c \leq N; 0 \leq x \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/editorial/5887) — source-abc292-editorial-5887-7498e511a2951ba3c4f47d7ef98b7c42f5f9a34d616491b4d39b45c93e8cfb43
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/tasks/abc292_h) — source-abc292-ex-problem-9f6fad77868d72dbd6f000ad47dea0254c74ec49279cbf1d42f024da899fc99b
