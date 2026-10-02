---
title: "ABC262-F — Erase and Rotate"
draft: true
authoringUnit: {"problemId":"abc262-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc262-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc262-f-problem-e97d9131710ad7ff7ac0ab7616fd67a116b4f8df7a6289f54313e1c37043b87a","source-abc262-editorial-4504-fa00567abe2f9d20ce2bfdad3b0955cae6283d3d8c422a1f3fef480ede8090b7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"回転で前へ運んだ要素を後から削除する操作は、回転前に削除して必要回転数を一つ減らす操作へ置き換えられ、同じ総操作数で同じ残存順序を作れる。 削除だけの辞書順最小列は、現在位置から残り削除数だけ先までの最小要素を次に採用し、飛ばした個数を予算から引くことで得られる。 順列なので各範囲の最小先頭は一意で、先頭が大きい他の回転回数は後続に関係なく辞書順で劣る。","sourceRevisionIds":["source-abc262-f-problem-e97d9131710ad7ff7ac0ab7616fd67a116b4f8df7a6289f54313e1c37043b87a","source-abc262-editorial-4504-fa00567abe2f9d20ce2bfdad3b0955cae6283d3d8c422a1f3fef480ede8090b7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(3,1,2)、削除予算1、回転なしの枝。","procedure":["最初の候補範囲3,1の最小1を採用し3を削除。","残り2を続ける。"],"executionTarget":null,"expectedResult":"この枝の最小列(1,2)。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-range-monoid-aggregation"],"attainmentCondition":"回転後に前へ運んだ要素を削除する二操作を固定すべきか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"先に削除して必要回転を減らす同じ残存順へ交換できる。rotate-then-delete正規形で重複探索を省く。"},"answer":{"reasoningOrVerification":"先に削除して必要回転を減らす同じ残存順へ交換できる。rotate-then-delete正規形で重複探索を省く。","procedure":["具体例の各状態・寄与を再計算する。","先に削除して必要回転を減らす同じ残存順へ交換できる。rotate-then-delete正規形で重複探索を省く。"],"expectedResult":"先に削除して必要回転を減らす同じ残存順へ交換できる。rotate-then-delete正規形で重複探索を省く。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 対称操作による状態の正規化。

## 考察

操作回数が余れば末尾要素を削除して列を辞書順で悪化させないため、最適解は実質ちょうど K 回の操作として扱える。

回転なしの先頭候補は先頭 K＋1 要素、正の回転ありの先頭候補は末尾 K 要素に限られ、それぞれ最小値以外は辞書順で勝てない。

棄却する候補: 回転回数 r=0,…,K を全て固定し、各回転後に削除貪欲を独立にシミュレーションする。

各候補列の構築に線形以上かかり、K 個全てを比較すると二乗規模になる。

採用する候補: 回転なしで先頭側最小値を選ぶ候補と、正の回転で末尾側最小値を先頭へ出す候補だけを、区間最小値を使う削除貪欲で構築して比較する。

順列なので各範囲の最小先頭は一意で、先頭が大きい他の回転回数は後続に関係なく辞書順で劣る。

回転で前へ運んだ要素を後から削除する操作は、回転前に削除して必要回転数を一つ減らす操作へ置き換えられ、同じ総操作数で同じ残存順序を作れる。

削除だけの辞書順最小列は、現在位置から残り削除数だけ先までの最小要素を次に採用し、飛ばした個数を予算から引くことで得られる。

操作列を rotate-then-delete の正規形へ交換し、lexicographic optimization を最初の要素による候補枝刈りと range-min greedy に落とす。

## 典型の発動条件

### 辞書順最小部分列の貪欲法

発動条件: 順序を保ったまま一定数まで要素を削除し、残る列を辞書順最小にしたいとき。

削除可能範囲内の最小値を次要素に選び、飛ばした要素数だけ予算を消費する。

### 操作交換による正規形

発動条件: 削除と並べ替え操作の順序が多数あるが、局所交換で同じ結果・同じ以下の費用に揃えられるとき。

回転を先、削除を後に集約し、回転済み要素の削除を回転前削除へ対応させる。

### RMQ を使う貪欲シミュレーション

発動条件: 単調に進む候補区間から最小要素と位置を繰り返し取得するとき。

Segment Tree またはスライド最小値で次に採用する要素を高速取得する。

## 問題固有の要素

正の回転候補では先頭へ来た要素を削除しないため、末尾 K 要素中の最小値を先頭にする回転だけを残せる。

別の問題へ持ち帰る視点: 辞書順最適化では、実現可能な先頭値を先に最小化すると後続探索の候補を大幅に削れる。

## 正当性

回転で前へ運んだ要素を後から削除する操作は、回転前に削除して必要回転数を一つ減らす操作へ置き換えられ、同じ総操作数で同じ残存順序を作れる。 削除だけの辞書順最小列は、現在位置から残り削除数だけ先までの最小要素を次に採用し、飛ばした個数を予算から引くことで得られる。 順列なので各範囲の最小先頭は一意で、先頭が大きい他の回転回数は後続に関係なく辞書順で劣る。

## 実装上の注意

- 回転なし候補と正の回転候補で、既に使った操作数と無料化できる回転部分の削除を分けて残予算を更新する。
- 残った操作は列末尾の削除へ使い、二候補は可変長列として通常の辞書順規則で比較する。

## 復習の核

- 複数種類の操作が任意順なら、操作同士を交換して代表的な順序へ正規化できるか証明する。
- 辞書順最小化では後続を作り込む前に、実現可能な先頭値ごとの支配関係で候補数を絞る。

## 計算量と制約

### 時間

O(N log N)、候補回転と削除greedyをrange-minで行う。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq K \leq N-1; 1 \leq p_i \leq N; (p_1,p_2,\ldots,p_N) contains 1,2,\ldots,N exactly once each.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(3,1,2)、削除予算1、回転なしの枝。

1. 最初の候補範囲3,1の最小1を採用し3を削除。
2. 残り2を続ける。

期待される結果: この枝の最小列(1,2)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

回転後に前へ運んだ要素を削除する二操作を固定すべきか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

先に削除して必要回転を減らす同じ残存順へ交換できる。rotate-then-delete正規形で重複探索を省く。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/tasks/abc262_f) — source-abc262-f-problem-e97d9131710ad7ff7ac0ab7616fd67a116b4f8df7a6289f54313e1c37043b87a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/editorial/4504) — source-abc262-editorial-4504-fa00567abe2f9d20ce2bfdad3b0955cae6283d3d8c422a1f3fef480ede8090b7
