---
title: "ABC434-G — Keyboard"
draft: true
authoringUnit: {"problemId":"abc434-g","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc434-g.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc434-editorial-14660-4785cdf7b0084f7d5c689355b827060d0d221e16c9681d8d879b37fe5b53c749","source-abc434-g-problem-219a37c2c31b58e0fc0f91969f4b52ea76287629a8c2208d1712b50b9f3c895c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"正規形B^bDを連結すると、右側の先頭Bだけが左側末尾の数字を消すため、削除数uと三値の合成式が成立する。子の数字列のうち左側はprefixだけが残り、右側は全て残る。この連結構造を使う部分値探索は、境界の子だけを再帰して求める数字列と一致する。右から左への区間合成では左引数が常に元の木の節点なので、各段で必要な部分値を取得でき、区間全体の正規形が復元される。","sourceRevisionIds":["source-abc434-editorial-14660-4785cdf7b0084f7d5c689355b827060d0d221e16c9681d8d879b37fe5b53c749","source-abc434-g-problem-219a37c2c31b58e0fc0f91969f4b52ea76287629a8c2208d1712b50b9f3c895c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

数字+Bを削除し尽くした正規形はB^b D（数字列D、長さl、値x）となる。削除規則は、異なる削除位置が重ならないため順序に依存しない。連結前に各側を正規化しても全体の正規形は同じになる。

S=(b_s,l_s,x_s), T=(b_t,l_t,x_t)を連結する。u=min(l_s,b_t)桁をSの末尾から削除し、そのsuffix値をyとする。残るSの値はz=(x_s−y)·10^{−u} mod p。積はb=b_s+max(0,b_t−l_s), l=l_s−u+l_t, x=z·10^{l_t}+x_tとなる。10の冪と逆冪を前計算する。ただし三値だけではyを得られないので、左側Sをセグメント木の節点として保持し、その子を辿る。

節点Sが左右子L,Rからできるとき、正規形の数字列はLの末尾min(l_L,b_R)桁を削ったprefixと、Rの数字列の連結である。suffix(u)はu≤l_RならRへ降り、u>l_RならLに残るprefixの末尾u−l_R桁とRを連結する。Lに残るprefixの値は全Lの値から削除suffixを引く代わりに、必要なprefix長の値を子へ降りて取得できる。prefix／suffixの任意境界では、完全に含まれる子の値をまとめ、一つの境界だけを再帰する。したがってO(log N)で必要な部分値を得る。

内部節点の再計算はこの部分値取得を使うのでO(log N)。一点更新でO(log N)祖先を更新してO(log²N)。区間照会ではcanonical nodesを右から左へ処理する。毎回、木にある節点を左側S、現在の集約を右側Tとして合成すれば、欠ける情報は常に探索可能な左節点にある。左からのfoldでは左側が木にない集約となってしまうため、この三値だけの方式には使えない。

## 典型の発動条件

### 正規形モノイド

発動条件: 局所削除規則が合流的で、連結前後の正規化が同じ結果になるとき。

数字+B の削除を尽くした正規形を区間積として扱う。

### セグメント木の履歴を使う要約補完

発動条件: 定数サイズ要約同士は直接マージ不能だが、一方の元区間が木に保持され追加情報を探索できるとき。

左節点の子へ二分探索し、要約から欠けた末尾 n 桁だけを O(log N) で取り出す。

### 十進連結のローリング値

発動条件: 長い数字列の連結・suffix の値を法上で扱うとき。

10^k を前計算し、長さと剰余値の組で連結を計算する。

## 問題固有の要素

定数サイズ要約が演算に閉じなくても、セグメント木が持つ分解履歴を補助 oracle にすれば必要情報だけ復元できる。

別の問題へ持ち帰る視点: データ構造の節点値は必ずしも自己完結モノイドでなく、木上探索込みの部分演算として設計できる場合がある。

## 正当性

正規形B^bDを連結すると、右側の先頭Bだけが左側末尾の数字を消すため、削除数uと三値の合成式が成立する。子の数字列のうち左側はprefixだけが残り、右側は全て残る。この連結構造を使う部分値探索は、境界の子だけを再帰して求める数字列と一致する。右から左への区間合成では左引数が常に元の木の節点なので、各段で必要な部分値を取得でき、区間全体の正規形が復元される。

## 実装上の注意

- canonical nodesは右から左へ合成し、左引数を木の節点に保つ。数字が全て消えたときの長さ0、Bが余る場合、10の逆冪を確認する。

## 復習の核

- Data 積に本当に必要な欠落情報が左末尾だけか、末尾取得が複数節点を跨いでも O(log N) に収まるかを確認する。

## 計算量と制約

### 時間

構築O(N)、点更新・区間照会O(log²N)。高さhの節点はO(h)で再計算でき、構築の総和はΣ_h O((N/2^h)h)=O(N)。

### 空間

O(N)、三値summaryと子参照・10の冪。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 8 \times 10^6; 1 \leq Q \leq 2 \times 10^5; S is a string of length N consisting of 1, 2, \dots, 9, and B.; 1 \leq x \leq N; c is 1, 2, \dots, 9, or B.; 1 \leq l \leq r \leq N; N, Q, x, l, r are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14660) — source-abc434-editorial-14660-4785cdf7b0084f7d5c689355b827060d0d221e16c9681d8d879b37fe5b53c749
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/tasks/abc434_g) — source-abc434-g-problem-219a37c2c31b58e0fc0f91969f4b52ea76287629a8c2208d1712b50b9f3c895c
