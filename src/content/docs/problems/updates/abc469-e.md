---
title: "ABC469 E — Pro Exam Eligibility"
draft: true
authoringUnit: {"problemId":"abc469-e","docPath":"src/content/docs/problems/updates/abc469-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc469-e-problem-bc0cab83f5f11882ae37b6c655e649977ef7b6ceda31199addbc7c34cf896bfa","source-abc469-editorial-23760-5ff1e2b805e0a31637ddf439c7b003f3f9e5631c0b35d8d88547749e7e265457"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"変換区間和は勝数−p×区間長であり、符号が勝率条件に一致する。累積勝数の単調性からK勝条件を満たす左prefixを全て、かつそれだけ最小値候補へ入れる。最小prefix差が非負なら区間が存在し、なければどの有効左端でも達成できない。成功範囲はpについて下向きに閉じるので二分探索が成立する。","sourceRevisionIds":["source-abc469-e-problem-bc0cab83f5f11882ae37b6c655e649977ef7b6ceda31199addbc7c34cf896bfa","source-abc469-editorial-23760-5ff1e2b805e0a31637ddf439c7b003f3f9e5631c0b35d8d88547749e7e265457"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

## 考察

勝率の最大化は区間長も勝数も変化するので、勝数だけを固定する貪欲では決まらない。候補勝率p以上を達成できるかという判定に変える。各勝利を1−p、敗北を−pとすれば、区間和≥0と勝率≥pは同値。

勝数の累積和W_iと変換後の累積和F_i=W_i−piを作る。右端rを固定すると、左prefix t=l−1は W_t≤W_r−K を満たすものだけ選べる。Wは単調なので有効なtは連続したprefix。ポインタを進めて有効になったF_tの最小値を保ち、F_r−min F_t≥0なら成功とする。各rで有効prefixを追加するだけなので一回の判定は O(N)。

pを[0,1]で二分探索し、例えば60回判定する。判定成功なら下端をpへ上げ、失敗なら上端を下げる。元の列が少なくともK勝を含むためp=0は成功する。Fを毎回配列に作らず、W_t−ptを有効化時に計算してもよい。

## 典型の発動条件

比率の最適化は分子−候補比率×分母の符号判定へ変える。左端制約がprefix条件になる場合、最小累積値を単調に追加できる。

## 問題固有の要素

長さの下限ではなく勝数Kの下限なので、左端ポインタは累積勝数で進める。

## 正当性

変換区間和は勝数−p×区間長であり、符号が勝率条件に一致する。累積勝数の単調性からK勝条件を満たす左prefixを全て、かつそれだけ最小値候補へ入れる。最小prefix差が非負なら区間が存在し、なければどの有効左端でも達成できない。成功範囲はpについて下向きに閉じるので二分探索が成立する。

## 実装上の注意

t=0を忘れない。浮動小数点誤差と出力桁数を確認する。p=1も判定でき、全勝区間なら上限に近づく。

## 復習の核

最大平均では二分探索を思い出すだけでなく、変換後の有効な左prefixをどう管理するかまで導く。

## 計算量と制約

### 時間

精度εについて O(N log(1/ε))。60回なら O(60N)。

### 空間

累積勝数 O(N)。判定の追加領域 O(1)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 10^6; N and K are integers.; S is a string of length N consisting of o and x.; S contains at least K occurrences of o.

## 出典

- [公式問題](https://atcoder.jp/contests/abc469/tasks/abc469_e)
- [公式解説](https://atcoder.jp/contests/abc469/editorial/23760)
