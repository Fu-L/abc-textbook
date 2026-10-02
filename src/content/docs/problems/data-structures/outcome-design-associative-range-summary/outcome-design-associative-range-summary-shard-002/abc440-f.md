---
title: "ABC440-F — Egoism"
draft: true
authoringUnit: {"problemId":"abc440-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc440-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc440-editorial-15032-e0da1c1fd845f62396a02c2953ff3129230a530ccdf7e479ac25e96c18392302","source-abc440-f-problem-49e8c48bf23ebe03297a814dc95ab95da892369e25fb91726dddd138d3fc91c6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"z=0 なら先頭だけが係数 1 なので答えは 2ΣA_i−min A_i、z=N なら全員が係数 1 なので答えは ΣA_i となり、中間の場合と分離できる。 0<z<N では A_i が小さい z 頭の集合 T に B_i=2 が含まれれば T が最適である。含まれなければ、T 内の最大 A_i を全体で最小の B_i=2 の馬へ置き換えるのが最小の修正になる。 選んだ集合を係数 1 にできる並べ方の構成は、この集合最適化が単なる下界ではなく実際に達成可能な答えであることを保証する。 集合の必要十分条件まで示せば並び順を状態に持たずに済み、各更新を値域上の O(log M) 個の節点だけで処理できる。","sourceRevisionIds":["source-abc440-editorial-15032-e0da1c1fd845f62396a02c2953ff3129230a530ccdf7e479ac25e96c18392302","source-abc440-f-problem-49e8c48bf23ebe03297a814dc95ab95da892369e25fb91726dddd138d3fc91c6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各馬の満足度に掛かる係数は、先頭なら 1、それ以外なら直前の馬の B_i であり、1 または 2 に限られる。したがって全馬を係数 2 とした 2ΣA_i を基準に置き、係数 1 になる馬の A_i の総和を最小化すればよい。

B_i=1 の馬の頭数を z とする。末尾が B_i=1 でない並びは巡回移動して満足度を下げずに末尾を B_i=1 にできるため、0<z<N では係数 1 の馬をちょうど z 頭とする場合だけ調べれば足りる。

0<z<N のとき、係数 1 にする z 頭の集合は B_i=2 の馬を少なくとも 1 頭含む必要がある。逆にこの条件を満たす任意の集合は、B と希望係数による四分類を所定の順に並べることで実現できる。

採用する候補: 並び順の最適化を、A_i の小さい z 頭を選ぶ問題へ言い換える。値 A ごとの B=1 の個数、B=2 の個数、A の総和をセグメント木に持ち、点更新後に z 番目の値と B=2 の最小値を順序統計として求める。

集合の必要十分条件まで示せば並び順を状態に持たずに済み、各更新を値域上の O(log M) 個の節点だけで処理できる。

棄却する候補: 各クエリ後に全馬を A_i の昇順へ並べ直し、先頭から z 頭と B_i=2 の候補を走査する。

一回の更新ごとに N 頭を整列または走査すると、N,Q がともに 2×10^5 の制約では間に合わない。

棄却する候補: 馬を一頭ずつ置く貪欲法として、直前の B_i と次の A_i の積がその場で最大になる馬を選ぶ。

現在の選択が次の係数と B_i=2 を含むという全体条件を同時に変えるため、局所的な積の大小から最適な並びは決められない。

z=0 なら先頭だけが係数 1 なので答えは 2ΣA_i−min A_i、z=N なら全員が係数 1 なので答えは ΣA_i となり、中間の場合と分離できる。

0<z<N では A_i が小さい z 頭の集合 T に B_i=2 が含まれれば T が最適である。含まれなければ、T 内の最大 A_i を全体で最小の B_i=2 の馬へ置き換えるのが最小の修正になる。

選んだ集合を係数 1 にできる並べ方の構成は、この集合最適化が単なる下界ではなく実際に達成可能な答えであることを保証する。

値 A を添字とするセグメント木に B=1 の個数 c_1、B=2 の個数 c_2、A の総和 s を保持する。更新前の馬を削除して更新後の馬を追加し、0<z<N なら累積個数が z 以上となる最小値 r を木上で探索する。A≤r の集計から余分な同値要素を引いた z 個分の和を求め、そこに B=2 がなければ値 r の一頭を最小の B=2 へ交換し、最後に 2ΣA_i からその和を引く。

## 典型の発動条件

### 基準値からの差分による目的関数変形

発動条件: 各要素の係数が少数の値しか取らず、最大の係数を全要素へ与えた仮想的な総和から損失だけを最小化できる場合。

係数をすべて 2 とした 2ΣA_i を基準にし、係数 1 を割り当てる実現可能な集合の A_i 総和を最小化する問題へ変換する。

### セグメント木上の順序統計

発動条件: 値の多重集合が点更新され続け、k 番目の値、先頭 k 個の総和、条件付き最小値を毎回高速に求めたい場合。

A の値域に個数と総和を載せ、累積個数が z に達する境界 r、z 個の総和、B=2 の最小 A を木上の降下で取得する。

## 問題固有の要素

各馬が受ける係数の集合を先に特徴付けると、順列の自由度は「B_i=2 の馬を一頭以上含む z 要素部分集合」という静的な条件へ潰れる。

別の問題へ持ち帰る視点: 前後関係を直接最適化しにくいときは、各位置が受ける係数の多重集合と、その割り当てを実現できる条件を先に求める。

## 正当性

z=0 なら先頭だけが係数 1 なので答えは 2ΣA_i−min A_i、z=N なら全員が係数 1 なので答えは ΣA_i となり、中間の場合と分離できる。 0<z<N では A_i が小さい z 頭の集合 T に B_i=2 が含まれれば T が最適である。含まれなければ、T 内の最大 A_i を全体で最小の B_i=2 の馬へ置き換えるのが最小の修正になる。 選んだ集合を係数 1 にできる並べ方の構成は、この集合最適化が単なる下界ではなく実際に達成可能な答えであることを保証する。 集合の必要十分条件まで示せば並び順を状態に持たずに済み、各更新を値域上の O(log M) 個の節点だけで処理できる。

## 実装上の注意

- A_i の重複を許すため、境界値 r の個数を丸ごと足さず、累積個数の超過分だけ r を総和から引いて正確に z 頭を選ぶ。
- 点更新では旧い (A_i,B_i) を木から削除してから新しい組を追加し、全体和と z も同じ順序で同期させる。
- z=0 と z=N を中間式へ流さず、総和や 2 倍した値は 64 bit 整数で保持する。

## 復習の核

- データ構造を見る前に、係数 1 の集合について必要性だけでなく任意の適合集合を実現する並べ方まで説明できているかを確認する。
- A_i が同値の馬を多数含む例と、更新で z が 0、1、N−1、N をまたぐ例を用意し、境界 r の補正と場合分けを重点的に検査する。

## 計算量と制約

### 時間

構築O(N+M)、Q更新O(Q log M)、MはAの管理値域。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq A_i \leq 10^6 (1 \leq i \leq N); B_i is 1 or 2. (1 \leq i \leq N); 1 \leq W_k \leq N (1 \leq k \leq Q); 1 \leq X_k \leq 10^6 (1 \leq k \leq Q); Y_k is 1 or 2. (1 \leq k \leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/editorial/15032) — source-abc440-editorial-15032-e0da1c1fd845f62396a02c2953ff3129230a530ccdf7e479ac25e96c18392302
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/tasks/abc440_f) — source-abc440-f-problem-49e8c48bf23ebe03297a814dc95ab95da892369e25fb91726dddd138d3fc91c6
