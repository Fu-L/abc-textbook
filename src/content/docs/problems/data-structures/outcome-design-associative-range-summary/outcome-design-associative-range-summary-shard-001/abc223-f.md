---
title: "ABC223-F — Parenthesis Checking"
draft: true
authoringUnit: {"problemId":"abc223-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc223-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc223-editorial-2774-57fa3ac279d6ed720ff418a408c5d27d679d0411709c1c7735ab8789873242cf","source-abc223-f-problem-d35abb95952d72d51f6ffe64103b56bae74b48c76d5e57b753f14fd130d6c306"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"minPrefix は空 prefix を含めて定義する。左 (s_L,m_L) と右 (s_R,m_R) の結合は (s_L+s_R,min(m_L,s_L+m_R))、identity は (0,0) となり、結合順を逆にできない非可換 monoid である。 二つの隣接区間の (sum,minPrefix) を O(1) で結合でき、swap の二点更新と query 区間の取得をともに O(log N) で処理できる。","sourceRevisionIds":["source-abc223-editorial-2774-57fa3ac279d6ed720ff418a408c5d27d679d0411709c1c7735ab8789873242cf","source-abc223-f-problem-d35abb95952d72d51f6ffe64103b56bae74b48c76d5e57b753f14fd130d6c306"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

## 考察

query 区間を '('=+1, ')'=-1 とし、左端直前を 0 とした相対 prefix p_0,...,p_len を考える。正しい括弧列である必要十分条件は p_len=0 かつ min_j p_j≥0 である。

N,Q≤2×10^5 なので query ごとの線形走査は使えない。swap は二点の値変更だから、判定条件を結合可能な区間要約にできれば点更新と区間積へ落とせる。

採用する候補: 各区間の総和と最小 prefix 和を monoid とし、segment tree で点更新と区間積を管理する。

棄却する候補: 各 query のたびに区間を左から走査して prefix 和を確認する。

一回 O(r-l+1)、全体で最悪 O(NQ) となり、N,Q≤2×10^5 に合わない。

leaf を '('=(1,0), ')'=(-1,-1)、identity を (0,0) として segment tree を構築する。type 1 は文字を交換して二点更新し、type 2 は [l,r] の積 (s,m) を取得して s=0 かつ m≥0 なら Yes、それ以外は No とする。

## 典型の発動条件

### 括弧列の prefix 条件

発動条件: 部分括弧列の正当性を判定するとき。

総和 0 と最小 prefix 0 以上を必要十分条件として使う。

### segment tree の monoid 設計

発動条件: 点更新を受けながら結合可能な区間要約を取得するとき。

(sum,minPrefix) を順序付きで結合する。

## 問題固有の要素

絶対 prefix 和を管理する必要はなく、query 左端を 0 とした相対 prefix の最小値だけを区間要約に持てばよい。

別の問題へ持ち帰る視点: 区間条件を左からの走査で判定できるなら、走査中に必要な要約とその結合則を探す。

## 正当性

minPrefix は空 prefix を含めて定義する。左 (s_L,m_L) と右 (s_R,m_R) の結合は (s_L+s_R,min(m_L,s_L+m_R))、identity は (0,0) となり、結合順を逆にできない非可換 monoid である。 二つの隣接区間の (sum,minPrefix) を O(1) で結合でき、swap の二点更新と query 区間の取得をともに O(log N) で処理できる。

## 実装上の注意

- minPrefix に空 prefix を含める定義を leaf・identity・query 判定まで統一する。swap 後は保持文字列も交換して両点を更新し、区間積は左から右の順序を保つ。

## 復習の核

- 結合則を具体的な二つの短い括弧列で再導出し、順序を逆にできない理由を確認する。
- 同一文字の swap、()、)(、((、左端以前の global balance が 0 でなくても区間自体は正しい例を、区間の直接走査と照合する。

## 計算量と制約

### 時間

構築O(N)、Q操作O(Q log N)。

### 空間

O(N)、区間(sum,minPrefix)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,Q \leq 2 \times 10^5; S is a string of length N consisting of ( and ).; 1 \leq l < r \leq N; N,Q,l,r are all integers.; Each query is in the format 1 l r or 2 l r.; There is at least one query in the format 2 l r.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/editorial/2774) — source-abc223-editorial-2774-57fa3ac279d6ed720ff418a408c5d27d679d0411709c1c7735ab8789873242cf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/tasks/abc223_f) — source-abc223-f-problem-d35abb95952d72d51f6ffe64103b56bae74b48c76d5e57b753f14fd130d6c306
