---
title: "ABC214-F — Substrings"
draft: true
authoringUnit: {"problemId":"abc214-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc214-f.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc214-editorial-2440-8404c7a84430603f504698d7a67b0eb89173b87ef656cf7e522e1d7ef121c7ac","source-abc214-f-problem-203e028b0a1974274025dd558bce523e82e7a094cc1d77c32448a6e2abd00b75"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"prefix s までで作れる文字列の集合は s とともに包含関係で増える。S_i を付けられる集合は prefix max(0,i−2) の集合であり、同じ末尾を持つ既存文字列の prefix 集合は直前の同じ文字位置 k に対応する prefix max(0,k−2) の集合と一致する。文字を末尾へ付ける写像は単射なので、この二つの個数差が新しい文字列を過不足なく数える。P_i=P_{i−1}+d_i は位置 i で初めて得られる文字列だけを追加し、最後に空文字列を一つ除けば答えになる。","sourceRevisionIds":["source-abc214-editorial-2440-8404c7a84430603f504698d7a67b0eb89173b87ef656cf7e522e1d7ef121c7ac","source-abc214-f-problem-203e028b0a1974274025dd558bce523e82e7a094cc1d77c32448a6e2abd00b75"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じ文字列を異なる位置集合から作れるため、位置集合の個数を数える DP では重複する。一方、文字列を左から貪欲に埋め込むと、次の文字を置ける最初の位置は一意である。各文字列を「最初に完成できる位置」で分類して重複を除く。

1-based で d_i を、位置 i を使って初めて完成できる非空文字列の個数とする。P_s=1+Σ_{j=1}^s d_j を prefix s までで作れる文字列数とし、1は空文字列、P_0=1 である。位置 i に文字 S_i を付けるには、直前の選択位置は i−2 以下でなければならない。したがって付加できる異なる prefix は P_{max(0,i−2)} 個。

ただし既に同じ文字 S_i で終わる文字列を数えている。S_i の直前の出現位置を k（なければ0）とすると、以前に同じ末尾文字を付けられた prefix の集合は P_{max(0,k−2)} 個に一致する。以前の出現位置の候補集合は包含関係にあり、直前の出現だけを引けばよい。

```text
d_i = P[max(0,i−2)] − (k=0 ? 0 : P[max(0,k−2)])
P_i = P_{i−1} + d_i
```

各文字の最後の出現位置を配列で持って更新する。全て法 10^9+7 で計算し、答えは空文字列を除いた P_N−1。S=aa では d_1=1,d_2=0、S=aba では d_1=1,d_2=1,d_3=1 で a,b,aa の3種類になる。

採用する典型は「新しい末尾を付ける候補の集合から、以前に同じ末尾で得られた集合を引く」重複除去 DP である。隣接禁止によって参照 prefix が i−1 ではなく i−2 になる。

## 典型の発動条件

### 最終出現による部分列の重複排除

発動条件: 異なる位置選択が同じ文字列を作り得るため、相異なる部分列だけを数えるとき。

現在文字と同じ文字の直前出現位置を境界にし、それ以前から作られる重複した末尾追加を遷移から除く。

### DP 遷移の累積和

発動条件: 各状態が連続した添字範囲の DP 値の総和として表されるとき。

最終出現位置から隣接禁止境界までの和を prefix sum の差で求める。

## 問題固有の要素

重複排除が文字の最終出現を左境界にし、非隣接制約が現在位置の一つ前を右境界から外すため、二条件が一つの区間和へ統合される。

別の問題へ持ち帰る視点: 部分列に局所的な位置制約を追加するときは、既存の重複排除 DP の遷移元範囲をどう狭めるかとして考える。

## 正当性

prefix s までで作れる文字列の集合は s とともに包含関係で増える。S_i を付けられる集合は prefix max(0,i−2) の集合であり、同じ末尾を持つ既存文字列の prefix 集合は直前の同じ文字位置 k に対応する prefix max(0,k−2) の集合と一致する。文字を末尾へ付ける写像は単射なので、この二つの個数差が新しい文字列を過不足なく数える。P_i=P_{i−1}+d_i は位置 i で初めて得られる文字列だけを追加し、最後に空文字列を一つ除けば答えになる。

## 実装上の注意

- P_0=1 は空文字列を付加元として数えるための初期値。以前の同じ文字がない k=0 のときは何も引かない。
- 前回出現 k を使って d_i を計算してから last[S_i]=i に更新する。差を法で正規化する。
- 重複除去の代表は最も早く完成する位置であり、「最も右の出現を選ぶ」規則ではない。

## 復習の核

- 部分列の個数を問われたら、位置集合の個数か生成文字列の個数かを最初に区別し、同じ文字の例で重複を検査する。
- 通常の最終出現 DP を基準にし、追加の位置制約が遷移元のどちらの境界を動かすかを式で比較する。

## 計算量と制約

### 時間

O(N)。アルファベット26種の最終出現と累積和を用いる。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string of length between 1 and 2 \times 10^5 (inclusive) consisting of lowercase English letters.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2440) — source-abc214-editorial-2440-8404c7a84430603f504698d7a67b0eb89173b87ef656cf7e522e1d7ef121c7ac
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_f) — source-abc214-f-problem-203e028b0a1974274025dd558bce523e82e7a094cc1d77c32448a6e2abd00b75
