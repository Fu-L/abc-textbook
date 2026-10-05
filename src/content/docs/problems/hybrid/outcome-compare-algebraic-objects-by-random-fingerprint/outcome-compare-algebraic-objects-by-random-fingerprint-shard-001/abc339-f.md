---
title: "ABC339-F — Product Equality"
draft: true
authoringUnit: {"problemId":"abc339-f","docPath":"src/content/docs/problems/hybrid/outcome-compare-algebraic-objects-by-random-fingerprint/outcome-compare-algebraic-objects-by-random-fingerprint-shard-001/abc339-f.md","learningOutcomeIds":["outcome-compare-algebraic-objects-by-random-fingerprint"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-randomized-algorithms"],"excludedTopics":["乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-randomized-algebraic-fingerprint","tag-randomized-algorithm"],"sourceRevisionIds":["source-abc339-editorial-9206-783ff9c3caa8b6c79125699ba25139d0f342ede0ece4c0a1081ab3044f3c70a2","source-abc339-f-problem-fd4fd095dde8aba7756de773d9f4b871b37d3563a7e3899c3f38b694662189b5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"p×q≠rなのに一つのprime modulus xで一致するのは、非零整数pq-rをxが割る時だけである。|pq-r|<10^2000が持つ10^9以上の相異なるprime factorは高々約222個なので、広い範囲から複数primeを選ぶと全てでcollisionする確率は極小になる。 各巨大整数を短いresidue vectorへ前計算し、N^2 pairを高速にfrequency lookupでき、誤判定確率を十分小さくできる。","sourceRevisionIds":["source-abc339-editorial-9206-783ff9c3caa8b6c79125699ba25139d0f342ede0ece4c0a1081ab3044f3c70a2","source-abc339-f-problem-fd4fd095dde8aba7756de773d9f4b871b37d3563a7e3899c3f38b694662189b5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択代数fingerprint](src/content/docs/learn/modeling/randomized-algebraic-fingerprint.md)

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md) — 乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

## 考察

A_iは1000桁だが、必要なのは積そのものではなくA_iA_jが入力multiset内のどの値と一致するかである。複数の大きなmodulusに対するresidue vectorをfingerprintにすれば、積keyをmachine integer演算で作れる。

採用する候補: 複数のrandom large primesによるmodular fingerprintで積を照合する

棄却する候補: 全N^2積を1000桁以上の多倍長整数で計算してmap検索する

各積に高価なbig-integer乗算と巨大key処理が必要で、N=1000では厳しい。

10^9～2×10^9から独立に約20個のprimeを選び、各A_iをdecimal文字列から各mod residueへ変換してvector keyを作りfrequency mapへ入れる。全順序付きpair(i,j)についてcomponentwise residue積keyを作り、そのkeyの入力frequencyを答えへ加える。

## 典型の発動条件

### randomized modular fingerprint

発動条件: 巨大整数の等値性を大量に判定し、false positiveだけを十分低確率へ抑えられる。

複数の独立なprime mod residue tupleをhash keyとして使う。

### multiset frequency集計

発動条件: kの値が同じ入力indexを個別に探索せず、積値ごとの一致数が欲しい。

residue vectorごとの出現数をmapにし、各(i,j)の積keyに対応するk数を一括加算する。

## 問題固有の要素

product equalityを三重loopにせず、(i,j)のN^2個を生成側、A_kのmultisetをlookup側へ分けると、k次元をfrequencyで消せる。

別の問題へ持ち帰る視点: 三変数の等式数え上げは二変数演算結果を残り一変数の頻度表へ照合する。

## 正当性

p×q≠rなのに一つのprime modulus xで一致するのは、非零整数pq-rをxが割る時だけである。|pq-r|<10^2000が持つ10^9以上の相異なるprime factorは高々約222個なので、広い範囲から複数primeを選ぶと全てでcollisionする確率は極小になる。 各巨大整数を短いresidue vectorへ前計算し、N^2 pairを高速にfrequency lookupでき、誤判定確率を十分小さくできる。

## 実装上の注意

- 選ぶmodulusは実際にprime判定しdistinctにする。residue tuple全体をkeyに含め、答えは最大N^3なので64bitを使い、乱数seedの扱いも再現可能性を考慮する。

## 復習の核

- 小桁入力では多倍長の真値と比較し、重複値、1、多数の同じ積、単一modで意図的にcollisionする値も複数modで区別されることを確認する。

## 計算量と制約

### 時間

O(R(L+N²log N))、Rは固定prime数、Lは入力桁総数、map比較のR成分を含む。hash mapなら期待O(R(L+N²))。

### 空間

O(RN+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 1000; \color{red}{1 \le A_i < 10^{1000}}

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc339/editorial/9206) — source-abc339-editorial-9206-783ff9c3caa8b6c79125699ba25139d0f342ede0ece4c0a1081ab3044f3c70a2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc339/tasks/abc339_f) — source-abc339-f-problem-fd4fd095dde8aba7756de773d9f4b871b37d3563a7e3899c3f38b694662189b5
