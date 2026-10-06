---
title: "ABC468 F — Chmax"
draft: true
authoringUnit: {"problemId":"abc468-f","docPath":"src/content/docs/problems/updates/abc468-f.md","learningOutcomeIds":["outcome-design-lis-frontier"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-lis-state"],"sourceRevisionIds":["source-abc468-f-problem-81895e0547e879214a14bee6f17d451498539ebaef9fd42e14b83c02c30d4dbe","source-abc468-editorial-23738-5e139065258f1b30a36be01029a54705a79c0df96aa548309c35039d069aac2e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"prefix最大値を大きい箱に置く操作は、同じ得点を保ちながら小さい最大値をそれ以下に保つので、任意の将来操作を不利にしない。その正規形では非prefix最大値から得る加点列は狭義増加であり、上限はLIS長。LISを小さい箱へ割り当てる構成がその上限に達する。","sourceRevisionIds":["source-abc468-f-problem-81895e0547e879214a14bee6f17d451498539ebaef9fd42e14b83c02c30d4dbe","source-abc468-editorial-23738-5e139065258f1b30a36be01029a54705a79c0df96aa548309c35039d069aac2e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[LIS・末尾の支配関係](src/content/docs/learn/dynamic-programming/dp-lis.md)

- 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

二つの箱へ値を割り当て、各箱の最大値が増えた回数を最大化する。状態(x,y)を全て持つと大きいが、処理済みprefixの最大値は必ずmax(x,y)と一致する。未来へ影響する自由な値は小さい方だけである。

新しいprefix最大値vは必ずどちらかの箱を更新して1点を得る。大きい方へ入れれば小さい方を残せる。小さい方へ入れると小さい最大値まで大きくなり、以後に更新できる候補が減るだけなので、大きい方へ入れる戦略が支配する。

prefix最大値ではないvは大きい箱を更新できない。点を得るには小さい箱の現在値より大きくする必要があり、点を得たこれらの値は入力順で狭義増加になる。逆にprefix最大値をすべて大きい箱へ入れ、残りの列Qの任意の増加部分列だけを小さい箱へ入れれば、その長さだけ加点できる。答えはprefix最大値の個数+LIS(Q)。

Qに対して、長さjの増加部分列の最小末尾をtails[j]に保つ。各vをlower_boundで置き換える。順列なので重複はないが、定義は狭義増加としておく。

## 典型の発動条件

二つの最大値のうち一つがprefix全体から決まるなら状態を一つ消せる。支配関係で確定できる操作を取り除き、残る増加列をLISへ帰着する。

## 問題固有の要素

自由に二列へ分ける問題だが、二列のLIS長の和ではない。大きい箱の値は毎prefixで固定される。

## 正当性

prefix最大値を大きい箱に置く操作は、同じ得点を保ちながら小さい最大値をそれ以下に保つので、任意の将来操作を不利にしない。その正規形では非prefix最大値から得る加点列は狭義増加であり、上限はLIS長。LISを小さい箱へ割り当てる構成がその上限に達する。

## 実装上の注意

prefix最大値は読み込む前の最大値と比較して判定する。N=1はprefix最大値だけで答え1。

## 復習の核

状態変数の一部が入力prefixだけで決まるか調べる。その後も自由な状態を、同得点なら小さい方がよいという支配で削る。

## 計算量と制約

### 時間

prefix最大値抽出 O(N)、LIS O(N log N)。

### 空間

tailsに O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 5\times 10^5; P is a permutation of (1,2,\ldots,N).; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc468/tasks/abc468_f)
- [公式解説](https://atcoder.jp/contests/abc468/editorial/23738)
