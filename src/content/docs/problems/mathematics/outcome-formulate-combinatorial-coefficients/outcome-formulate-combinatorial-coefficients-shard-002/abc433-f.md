---
title: "ABC433-F — 1122 Subsequence 2"
draft: true
authoringUnit: {"problemId":"abc433-f","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc433-f.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-contribution-reordering"],"sourceRevisionIds":["source-abc433-editorial-14594-08bc59650ef1192757d238eb2f5ed124e1ab34db56b16c86ccb1fa7841abc7d8","source-abc433-f-problem-ce87dc4de4780fe3a1c4a13b1e3631c7aeaec1cfe60d81db8e4fdede040d2391"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非空1122型列は前半最後の元位置iが一意である。左の同digit p個からk−1、右の次digit q個からkを選ぶ積がそのiの候補数。Vandermondeで全k和をC(p+q,p+1)へ変えるのは同じ選択を二群へ分けた恒等式。全i和は中央左位置の分類で重複なく全列を数える。","sourceRevisionIds":["source-abc433-editorial-14594-08bc59650ef1192757d238eb2f5ed124e1ab34db56b16c86ccb1fa7841abc7d8","source-abc433-f-problem-ce87dc4de4780fe3a1c4a13b1e3631c7aeaec1cfe60d81db8e4fdede040d2391"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

1122部分列の中央左側の文字を位置 i の数字 S_i に固定する。左側で同じ数字を選べる個数を p、右側で S_i+1 を選べる個数を q とすると、長さ 2k の候補数は binom(p,k-1)binom(q,k) である。

採用する候補: 各 i を中央位置として寄与を一意に数え、Vandermonde の畳み込みで長さ k の和を binom(p+q,p+1) に閉じる。

p,q は prefix/suffix 頻度で O(1)、二項係数も前計算できるため全体 O(N) になる。

棄却する候補: 全ての部分列を列挙し、前半同値・後半が+1かを調べる。

部分列は 2^N 個存在する。

各非空 1122 部分列は前半最後、すなわち |T|/2 文字目の元位置 i をちょうど一つ持つため、i ごとの和に重複がない。

Σ_{k≥1}binom(p,k-1)binom(q,k)=binom(p+q,p+1) は Vandermonde の畳み込みである。

各数字の prefix count または左右総数を用意する。i を左から走査し、p=左側の S_i 個数、q=右側の S_i+1 個数を求め、fact/invfact で binom(p+q,p+1) を答えへ足す。

## 典型の発動条件

### 代表位置による部分列分割

発動条件: 各対象部分列に中央・最初・最後など一意な代表添字を割り当てられるとき。

1122部分列を前半最後の位置 i で分類し、左右の選択を独立にする。

### Vandermonde の畳み込み

発動条件: Σ_k binom(p,k+a)binom(q,k+b) のように選択数 k を全て足すとき。

長さ別の積和を一つの二項係数 binom(p+q,p+1) へ簡約する。

### 左右頻度の累積管理

発動条件: 各位置に対して左の同値個数と右の別値個数が必要なとき。

prefix count と総頻度から p,q を定数時間で取得する。

## 問題固有の要素

部分列長を DP 状態に残さず、中央位置固定後の長さ別和を組合せ恒等式で消去できる。

別の問題へ持ち帰る視点: 一意な代表で分割した後に左右選択の積和が出たら、Vandermonde 型へ変形できないか調べる。

## 正当性

非空1122型列は前半最後の元位置iが一意である。左の同digit p個からk−1、右の次digit q個からkを選ぶ積がそのiの候補数。Vandermondeで全k和をC(p+q,p+1)へ変えるのは同じ選択を二群へ分けた恒等式。全i和は中央左位置の分類で重複なく全列を数える。

## 実装上の注意

- p は i 自身を含まない左側、q は i より右側だけを数える。p+1 が範囲外なら二項係数を 0 とする規約を統一する。

## 復習の核

- 長さ 2k で左から k 番目が i となる選択数と、閉形式 binom(p+q,p+1) の対応を確認する。

## 計算量と制約

### 時間

O(|S|)。各digit左右個数と階乗表を更新する。

### 空間

O(|S|)、左右countは定数10。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string consisting of digits with length between 1 and 10^6, inclusive.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc433/editorial/14594) — source-abc433-editorial-14594-08bc59650ef1192757d238eb2f5ed124e1ab34db56b16c86ccb1fa7841abc7d8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc433/tasks/abc433_f) — source-abc433-f-problem-ce87dc4de4780fe3a1c4a13b1e3631c7aeaec1cfe60d81db8e4fdede040d2391
