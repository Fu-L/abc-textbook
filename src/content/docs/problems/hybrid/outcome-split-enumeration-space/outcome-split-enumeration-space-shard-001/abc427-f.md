---
title: "ABC427-F — Not Adjacent"
draft: true
authoringUnit: {"problemId":"abc427-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc427-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle"],"sourceRevisionIds":["source-abc427-editorial-14195-a523ac80888e999b403a874323ca4ed5424535861f03895268bdcce8d5c01e98","source-abc427-f-problem-1009db545ade28aeb0009ef81f314ed11a4d7baaf41792a10bd84e80b8422dbd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"左右で条件を満たす選択を組み合わせたとき、新たに違反し得るのは分割境界の二要素を両方選ぶ場合だけである。 左の剰余 x には右の剰余 -x mod M を組み合わせれば総和が M の倍数になる。 列挙数が φ^(N/2) 程度に収まり、剰余の補数をソートまたは頻度表で数えられる。","sourceRevisionIds":["source-abc427-editorial-14195-a523ac80888e999b403a874323ca4ed5424535861f03895268bdcce8d5c01e98","source-abc427-f-problem-1009db545ade28aeb0009ef81f314ed11a4d7baaf41792a10bd84e80b8422dbd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

隣接する二要素を同時に選ばない部分列の個数はフィボナッチ数程度で、N=60 でも半分なら約 218 万個まで減る。総和の剰余は左右半分の和で結合できる。

採用する候補: 列を半分に分け、各半分の非隣接部分列を列挙して総和 mod M と境界要素の選択有無を集計する。

列挙数が φ^(N/2) 程度に収まり、剰余の補数をソートまたは頻度表で数えられる。

棄却する候補: 全 2^N 部分集合を列挙し、隣接選択と総和を判定する。

N=60 では状態数が大きすぎる。

左右で条件を満たす選択を組み合わせたとき、新たに違反し得るのは分割境界の二要素を両方選ぶ場合だけである。

左の剰余 x には右の剰余 -x mod M を組み合わせれば総和が M の倍数になる。

前半・後半について、直前を選んだかを持つ DFS で非隣接部分列だけを列挙し、総和 mod M と境界選択フラグを記録する。剰余頻度を用いて全組を数え、左右の境界要素をともに選ぶ組を同様に差し引く。

## 典型の発動条件

### 制約付き半分全列挙

発動条件: 全体の部分集合は多すぎるが、制約により半分の有効集合数が数百万程度になるとき。

非隣接集合だけを左右別々に生成し、加法的な総和剰余で結合する。

### 境界状態による結合

発動条件: 局所制約を持つ列を分割し、違反が分割点付近だけで起こるとき。

各半分の端を選んだかを持ち、境界の両選択だけ除外する。

## 問題固有の要素

非隣接部分集合は 2^n ではなくフィボナッチ数個なので、半分全列挙の実用範囲が広がる。

別の問題へ持ち帰る視点: 局所制約付き meet-in-the-middle では、内部を各側で保証し、境界に必要な最小情報だけ付加する。

## 正当性

左右で条件を満たす選択を組み合わせたとき、新たに違反し得るのは分割境界の二要素を両方選ぶ場合だけである。 左の剰余 x には右の剰余 -x mod M を組み合わせれば総和が M の倍数になる。 列挙数が φ^(N/2) 程度に収まり、剰余の補数をソートまたは頻度表で数えられる。

## 実装上の注意

- 空部分列を答えに含める条件を問題文と合わせる。N=1 では片側が空になるため、分割と境界フラグの添字を特別に確認する。

## 復習の核

- 全結合数から引くのが『左末尾選択かつ右先頭選択』の組だけであること、剰余 0 の補数処理を確認する。

## 計算量と制約

### 時間

O(F_h log F_h)、h=ceil(N/2)、F_hはh要素の非隣接選択数（Fibonacci型）。

### 空間

O(F_h)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le60; 1\le M\le10 ^ 9; 0\le A _ i\lt M; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/editorial/14195) — source-abc427-editorial-14195-a523ac80888e999b403a874323ca4ed5424535861f03895268bdcce8d5c01e98
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc427/tasks/abc427_f) — source-abc427-f-problem-1009db545ade28aeb0009ef81f314ed11a4d7baaf41792a10bd84e80b8422dbd
