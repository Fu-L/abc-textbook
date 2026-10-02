---
title: "ABC354-F — Useless for LIS"
draft: true
authoringUnit: {"problemId":"abc354-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-aggregate-subsequence-transitions-by-value/outcome-aggregate-subsequence-transitions-by-value-shard-001/abc354-f.md","learningOutcomeIds":["outcome-aggregate-subsequence-transitions-by-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-dp-sequence","unit-range-monoid-aggregation"],"excludedTopics":["値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-value-range-dp","tag-coordinate-compression","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc354-editorial-10027-bc6483f17b3841b339158e56f8e6ae34a489dc4d0513073e8a17fd6d47c28e84","source-abc354-f-problem-df7964159518037ba49d8e31fa074b4c70361fe81899dcc751daf106f2cef501"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"iを含む増加部分列は左からiへ終わる最長とiから右へ始まる最長を結べるため最大長l_i+r_i−1。左右はi以外で重ならず厳密値条件もiを境に成立する。全LIS長Lとの等号がLISに含まれる必要十分条件。","sourceRevisionIds":["source-abc354-editorial-10027-bc6483f17b3841b339158e56f8e6ae34a489dc4d0513073e8a17fd6d47c28e84","source-abc354-f-problem-df7964159518037ba49d8e31fa074b4c70361fe81899dcc751daf106f2cef501"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [値域集約による部分列DP](src/content/docs/learn/dynamic-programming/dp-value-range.md)

- 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

A_i を含む増加部分列は、i で終わる左側最長長 l_i と i で始まる右側最長長 r_i を A_i で接続して長さ l_i+r_i−1 にできる。 全体 LIS 長を L とすると A_i が少なくとも一つの LIS に含まれる必要十分条件は l_i+r_i−1=L である。 l_i は A_i 未満の値で終わる過去 DP 最大＋1、r_i は右側で A_i より大きい値から同様に求まり、strict 不等号を守る。 l_i と r_i を達成する subsequence は index i だけを共有し、値も左<A_i<右なので連結して実際の LIS 候補になる。

採用する候補: 前向き LIS DP で l_i、反転・符号反転した同型 DP で r_i を求め、長さ条件で各 index を判定する。

各方向 O(N log N) で、要素ごとの「左から何番目・右から何番目になれるか」を完全に捉える。

棄却する候補: LIS を一本だけ復元し、その中の index だけを答える。

LIS が複数ある場合、復元した一本に無いが別の LIS に含まれる要素を取り逃す。

l_i は A_i 未満の値で終わる過去 DP 最大＋1、r_i は右側で A_i より大きい値から同様に求まり、strict 不等号を守る。

l_i と r_i を達成する subsequence は index i だけを共有し、値も左<A_i<右なので連結して実際の LIS 候補になる。

値を座標圧縮する。左から Fenwick/segment tree の prefix max で l_i=1+max(rank<A_i) を求める。右から suffix max で r_i=1+max(rank>A_i) を求める。L=max l_i とし、l_i+r_i−1=L の index を昇順出力する。

## 典型の発動条件

### 前後 DP の一点接続

発動条件: ある要素を必ず通る最適部分列・path の長さを全点で判定するとき。

始点側最適値と終点側最適値を重複一点ぶん引いて足す。

### LIS の range maximum DP

発動条件: 各要素で終わる strict increasing subsequence 長を全 index で欲しいとき。

座標圧縮値未満の最大を query し、現在rankへ chmaxする。

## 問題固有の要素

「ある LIS に含まれる」と「復元した LIS に含まれる」を区別し、存在判定を左右の最適値の等式へ変える。

別の問題へ持ち帰る視点: 最適解への要素参加可能性は、その要素を境にした prefix/suffix optimum の和で判定できることが多い。

## 正当性

iを含む増加部分列は左からiへ終わる最長とiから右へ始まる最長を結べるため最大長l_i+r_i−1。左右はi以外で重ならず厳密値条件もiを境に成立する。全LIS長Lとの等号がLISに含まれる必要十分条件。

## 実装上の注意

- strict LIS なので前向きは rank 未満、後向きは rank より大きい範囲を使う。test case ごとに tree を初期化し総 N 制約を活かす。

## 復習の核

- 一本復元で済まない理由を重複値・分岐する LIS 例で確認する。左右 DP の strict range を左右対称に実装する。

## 計算量と制約

### 時間

列長N。圧縮と左右max構造で O(N log N)。

### 空間

左右長と圧縮値、treeで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; The sum of N across all test cases is at most 2 \times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/editorial/10027) — source-abc354-editorial-10027-bc6483f17b3841b339158e56f8e6ae34a489dc4d0513073e8a17fd6d47c28e84
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc354/tasks/abc354_f) — source-abc354-f-problem-df7964159518037ba49d8e31fa074b4c70361fe81899dcc751daf106f2cef501
