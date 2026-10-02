---
title: "ABC403-G — Odd Position Sum Query"
draft: true
authoringUnit: {"problemId":"abc403-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-sparse-domain-segment-tree/outcome-maintain-sparse-domain-segment-tree-shard-001/abc403-g.md","learningOutcomeIds":["outcome-maintain-sparse-domain-segment-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["動的・implicit Segment Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dynamic-segment-tree"],"sourceRevisionIds":["source-abc403-editorial-12770-89d524d03f2fc4f095fecb61d7f270682ca1c9247a4ecb86cc7acce87d768ff6","source-abc403-g-problem-b65cb2206c4053168999e038af2c064c8597c976bcdbc32ee9535b31d78e3e7d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"左の個数が偶数なら親の odd=left.odd+right.odd、even=left.even+right.even、奇数なら右の odd/even を交換して足す。 同じ値が複数回入る葉でも、個数 c と値 x から odd=ceil(c/2)x、even=floor(c/2)x と表せるため、重複を特別な別構造で管理する必要はない。 左右の情報を個数の parity で結合でき、点追加後の根の奇数番目和がそのまま答えになる。ノード数と時間はいずれも Q log 10^9 である。","sourceRevisionIds":["source-abc403-editorial-12770-89d524d03f2fc4f095fecb61d7f270682ca1c9247a4ecb86cc7acce87d768ff6","source-abc403-g-problem-b65cb2206c4053168999e038af2c064c8597c976bcdbc32ee9535b31d78e3e7d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [動的・implicit Segment Tree](src/content/docs/learn/query/dynamic-segment-tree.md)

- 巨大または疎な座標域で訪れたnodeだけを生成し、区間要約と境界探索をO(log U)で保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 動的・implicit Segment Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

x_i は直前の答え z により暗号化されるため全挿入値を先読みできず、通常の座標圧縮を前処理として使えない。一方、値域は [1,10^9] で挿入点は Q 個だけである。

昇順列を左区間、右区間の順に連結すると、左の要素数が奇数か偶数かだけで右区間の奇数番目・偶数番目の役割が決まる。

採用する候補: 必要な経路だけ生成する動的セグメント木に、要素数・局所奇数番目和・局所偶数番目和を持つ

左右の情報を個数の parity で結合でき、点追加後の根の奇数番目和がそのまま答えになる。ノード数と時間はいずれも Q log 10^9 である。

棄却する候補: 各追加後に配列へ挿入して全体を sort し、奇数番目を走査する

一回 O(i log i) 以上を要し Q=3×10^5 では間に合わず、前回答依存の値も事前処理できない。

左の個数が偶数なら親の odd=left.odd+right.odd、even=left.even+right.even、奇数なら右の odd/even を交換して足す。

同じ値が複数回入る葉でも、個数 c と値 x から odd=ceil(c/2)x、even=floor(c/2)x と表せるため、重複を特別な別構造で管理する必要はない。

根区間を [1,10^9+1) として x_i の根から葉までだけ生成し、葉の個数を 1 増やす。帰りがけに parity 付き結合で三つ組を更新し、root.odd を z として出力して次の x_i を計算する。

## 典型の発動条件

### 動的セグメント木

発動条件: 座標域は巨大だが、オンライン点更新で実際に触る座標数が少ないとき。

各挿入につき深さ約 30 のノードだけ生成し、未生成部分を単位元として扱う。

### parity を含むモノイド

発動条件: 整列列の交互位置の集計を、連続区間の連結として求めたいとき。

区間長の偶奇に応じて後半の odd/even 集計を交換する結合則を定義する。

## 問題固有の要素

奇数番目和は値だけの可換な和ではないが、「個数」と偶奇別二和を組にすれば、値域順の区間連結に対して結合可能になる。

別の問題へ持ち帰る視点: 順位の偶奇が境界をまたいで反転する集計では、部分列長の parity をモノイド状態へ加える。

## 正当性

左の個数が偶数なら親の odd=left.odd+right.odd、even=left.even+right.even、奇数なら右の odd/even を交換して足す。 同じ値が複数回入る葉でも、個数 c と値 x から odd=ceil(c/2)x、even=floor(c/2)x と表せるため、重複を特別な別構造で管理する必要はない。 左右の情報を個数の parity で結合でき、点追加後の根の奇数番目和がそのまま答えになる。ノード数と時間はいずれも Q log 10^9 である。

## 実装上の注意

- z と区間和は 32 bit を超えるので 64 bit 整数を使い、(y_i+z) mod 10^9 の加算順にも注意する。値域右端 10^9 を含む半開区間を確認する。

## 復習の核

- 同値を連続挿入する場合、最小値・最大値を交互に入れる場合、z が 10^9 を大きく超える場合を multiset の全 sort と比較する。

## 計算量と制約

### 時間

O(Q log U)、U=10⁹のオンライン値域。

### 空間

O(Q log U)、生成済み経路node。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le Q \le 3\times 10^5; 0 \le y_i < 10^9; 1 \le x_i \le 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc403/editorial/12770) — source-abc403-editorial-12770-89d524d03f2fc4f095fecb61d7f270682ca1c9247a4ecb86cc7acce87d768ff6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc403/tasks/abc403_g) — source-abc403-g-problem-b65cb2206c4053168999e038af2c064c8597c976bcdbc32ee9535b31d78e3e7d
