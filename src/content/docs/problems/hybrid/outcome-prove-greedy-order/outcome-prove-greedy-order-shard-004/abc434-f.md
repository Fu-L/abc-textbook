---
title: "ABC434-F — Concat (2nd)"
draft: true
authoringUnit: {"problemId":"abc434-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-004/abc434-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-z-algorithm"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-z-algorithm-prefix-matching"],"sourceRevisionIds":["source-abc434-editorial-14670-66bb51f94f1f13b38f028cda9f5695e6525c00591da0b0b7ffe5e2f2be4b1dfc","source-abc434-editorial-14680-3197538bd4a21389bc1fa50f82b70c602af314a82a2c8d77c1acca870b5aa256","source-abc434-f-problem-3a3e08003e3179b45b06e2fc5aee175704c4918cacfd1bd966d5dbc75ed6adc9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"`XY<YX` 順で隣接非可換なら、隣接pairを逆転させると連結文字列は厳密に大きくなる。転倒数2以上の順序は転倒を一つずつ戻す途中に二つ以上の小さい結果を持つため二番目ではない。末尾二swapが候補にあるので、これより前で初めて異なる列も二番目になれず、転倒数1候補のうちN−2以前のswapはその位置の非可換pairで大きくなる。よって残る二つの末尾候補だけを連結比較すればよい。隣接に可換pairがあればswapで同じ最小連結を再現するため、その最小連結自体が二番目となる。\n\nZ配列を使った比較は、XYとYXの同一文字列内区間の最長共通prefixを正確に飛ばし、最初の不一致文字で順序を決めるので、通常の比較器と同じ結果を返す。","sourceRevisionIds":["source-abc434-editorial-14670-66bb51f94f1f13b38f028cda9f5695e6525c00591da0b0b7ffe5e2f2be4b1dfc","source-abc434-editorial-14680-3197538bd4a21389bc1fa50f82b70c602af314a82a2c8d77c1acca870b5aa256","source-abc434-f-problem-3a3e08003e3179b45b06e2fc5aee175704c4918cacfd1bd966d5dbc75ed6adc9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md) — 各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

最小連結順 `S'_1,…,S'_N` は `XY<YX` でsortして得る。隣接する二文字列が可換ならそのswapでも同じ最小文字列になるため、二番目の答えは最小連結文字列そのもの。

隣接対が全て非可換なら、転倒数2以上の順序には少なくとも二つ小さい連結結果があるので二番目候補にならない。転倒数1のswap候補だけを考える。末尾二つをswapした列があるため、二番目候補は `S'_1…S'_{N−2}` と同じprefixを持つ。さらに、隣接対が非可換なので、N−2以前をswapした候補はその位置でより大きくなり除外できる。残るのは次の二つだけ。

- `S'_1…S'_{N−2} S'_N S'_{N−1}`
- `S'_1…S'_{N−3} S'_{N−1} S'_{N−2} S'_N`

N=3で `S'=(a,aab,b)` なら、後者 `aab,a,b` が前者より小さい。最小候補を末尾二swapだけで決められない例である。

比較器は `XY` と `YX` を短い文字列長まで直接比べ、同一文字列内の長い中央比較だけZ配列で飛ばす。

## 典型の発動条件

### 連結順序 comparator

発動条件: 文字列群の連結結果を辞書順最小化するとき。

X<Y を XY<YX で定義し、交換法で最適ソート順を得る。

### Z 配列による自己部分文字列比較

発動条件: 比較中に同じ長い文字列内の二区間の LCP が必要なとき。

各文字列の Z 値を保持し、ずれた suffix と prefix の一致長を定数時間で得る。

### 転倒数による第二候補の絞り込み

発動条件: 全順列の二番目を、最小順序からの局所交換として特徴付けられるとき。

転倒数 2 以上を排除し、接頭辞を最大限共有する末尾付近の二候補だけ比較する。

## 問題固有の要素

比較一回の最悪長より、各要素がソート全体で何文字読まれるかを抑える comparator 設計が必要である。

別の問題へ持ち帰る視点: 辞書順二番目は最小解との最長共通接頭辞を持つ局所的な一転倒へ絞れる場合がある。

## 正当性

`XY<YX` 順で隣接非可換なら、隣接pairを逆転させると連結文字列は厳密に大きくなる。転倒数2以上の順序は転倒を一つずつ戻す途中に二つ以上の小さい結果を持つため二番目ではない。末尾二swapが候補にあるので、これより前で初めて異なる列も二番目になれず、転倒数1候補のうちN−2以前のswapはその位置の非可換pairで大きくなる。よって残る二つの末尾候補だけを連結比較すればよい。隣接に可換pairがあればswapで同じ最小連結を再現するため、その最小連結自体が二番目となる。

Z配列を使った比較は、XYとYXの同一文字列内区間の最長共通prefixを正確に飛ばし、最初の不一致文字で順序を決めるので、通常の比較器と同じ結果を返す。

## 実装上の注意

- comparator は等価な XY=YX に対して strict weak ordering を壊さないよう false を返す。N=2 と可換対ありを先に処理し、候補の添字を範囲内にする。

## 復習の核

- 比較が O(min長) に収まる区間分解と、非可換時に残す二つの末尾候補が公式の順序どおりかを確認する。

## 計算量と制約

### 時間

O(L log N)、Lは総文字数。Z前計算O(L)、IDのmerge sortは各階層で比較費用を取り出した文字列長へ課金してO(L)、隣接可換判定と二候補の構築・比較はO(L)。

### 空間

O(L+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 1.5 \times 10^5; 2 \le N \le 3 \times 10^5; T,N are integers.; S_i is a string consisting of lowercase English letters with length between 1 and 10^6-1, inclusive.; For a single input, the sum of N does not exceed 3 \times 10^5.; For a single input, the sum of |S_i| does not exceed 10^6.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14670) — source-abc434-editorial-14670-66bb51f94f1f13b38f028cda9f5695e6525c00591da0b0b7ffe5e2f2be4b1dfc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14680) — source-abc434-editorial-14680-3197538bd4a21389bc1fa50f82b70c602af314a82a2c8d77c1acca870b5aa256
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/tasks/abc434_f) — source-abc434-f-problem-3a3e08003e3179b45b06e2fc5aee175704c4918cacfd1bd966d5dbc75ed6adc9
