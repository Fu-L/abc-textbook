---
title: "ABC432-E — Clamp"
draft: true
authoringUnit: {"problemId":"abc432-e","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc432-e.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc432-e-problem-80faeeba809117447ceb08d66cf6a35cb7e0492c35323f90c7398b76d946fde4","source-abc432-editorial-14572-764bfa5a99ff52099e6cc8417442383b9b5d78e8b93cb45529ea827bf613f6d9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"答えは l·count(A<l)+sum(l≤A≤r)+r·count(A>r) と分解できる。 l>r の場合は min(r,x)≤r<l なので全要素の値が max により l となり、答えは lN である。 三領域の個数・総和を各 O(log K) で得て、一点更新も同じ計算量で処理できる。","sourceRevisionIds":["source-abc432-e-problem-80faeeba809117447ceb08d66cf6a35cb7e0492c35323f90c7398b76d946fde4","source-abc432-editorial-14572-764bfa5a99ff52099e6cc8417442383b9b5d78e8b93cb45529ea827bf613f6d9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

clamp(A_i,l,r)=max(l,min(r,A_i)) は A_i<l なら l、l≤A_i≤r なら A_i、A_i>r なら r の三領域に分かれる。更新は値一個の頻度移動に過ぎない。

採用する候補: 値ごとの個数 C_j と重み付き和 jC_j を二つの集約値としてセグメント木で管理する。

三領域の個数・総和を各 O(log K) で得て、一点更新も同じ計算量で処理できる。

棄却する候補: 各求値クエリで全 A_i を clamp して合計する。

一質問 O(N) で、Q が大きいと間に合わない。

答えは l·count(A<l)+sum(l≤A≤r)+r·count(A>r) と分解できる。

l>r の場合は min(r,x)≤r<l なので全要素の値が max により l となり、答えは lN である。

各値 j の葉に (count,sum=j·count) を持つセグメント木を構築する。更新では旧値の葉から一つ減らし新値へ加える。照会 l≤r では三範囲の count/sum を取得して式を計算し、l>r は lN を返す。

## 典型の発動条件

### 値域上の頻度データ構造

発動条件: 配列順序ではなく値の大小で区間集計し、一点の値更新があるとき。

値を添字として頻度と値和を保持し、閾値未満・区間内・超過を取得する。

### 区分線形関数の集約

発動条件: 各要素への関数が値域ごとに定数または一次式になるとき。

各区間で必要な count と sum のモーメントだけを集めて関数値総和を復元する。

## 問題固有の要素

clamp の総和は元の要素を個別処理せず、閾値で分けた個数と一次モーメントだけで決まる。

別の問題へ持ち帰る視点: 区分多項式の一括評価は、各区間の低次モーメントをデータ構造に持つと高速化できる。

## 正当性

答えは l·count(A<l)+sum(l≤A≤r)+r·count(A>r) と分解できる。 l>r の場合は min(r,x)≤r<l なので全要素の値が max により l となり、答えは lN である。 三領域の個数・総和を各 O(log K) で得て、一点更新も同じ計算量で処理できる。

## 実装上の注意

- 値域 K の外に l,r が来る場合は検索区間を clamp し、空区間を 0 とする。積 l·N や値和には十分広い整数型を使う。

## 復習の核

- 三領域の境界で A_i=l,r を中央へ含めることと、l>r の演算順に基づく特例を確認する。

## 計算量と制約

### 時間

構築O(N+K)、Q操作O(Q log K)、Kは管理値域。

### 空間

O(N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 5\times 10^5; 1\leq Q \leq 2\times 10^5; 0\leq A_i \leq 5\times 10^5; For queries of the first type, 1\leq x\leq N 0\leq y \leq 5\times 10^5; 1\leq x\leq N; 0\leq y \leq 5\times 10^5; For queries of the second type, 0\leq l,r \leq 5\times 10^5; 0\leq l,r \leq 5\times 10^5; All inputs are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc432/tasks/abc432_e) — source-abc432-e-problem-80faeeba809117447ceb08d66cf6a35cb7e0492c35323f90c7398b76d946fde4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc432/editorial/14572) — source-abc432-editorial-14572-764bfa5a99ff52099e6cc8417442383b9b5d78e8b93cb45529ea827bf613f6d9
