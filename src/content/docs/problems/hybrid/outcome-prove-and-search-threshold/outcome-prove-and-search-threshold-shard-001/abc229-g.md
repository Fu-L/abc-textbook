---
title: "ABC229-G — Longest Y"
draft: true
authoringUnit: {"problemId":"abc229-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc229-g.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-basic-convex-optimization"],"sourceRevisionIds":["source-abc229-editorial-2963-afb72ff0fd07e9b66f6fe951c466e017b8e32d71939a9ec4dd892bfe0ae2596f","source-abc229-g-problem-83a9221894dec91f4bf1f2918bfa0b9ca85696be322d5ff83af8e1dcb00a2708"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"目標の連続座標を直接最適化せず、Y の順位 i を位置から引くことで「全要素を一値へ揃える」中央値問題に正規化する。 m 個を連続化できればそれ未満もでき、絶対値和は中央値で最小になるため各窓を定数個の区間和で評価できる。","sourceRevisionIds":["source-abc229-editorial-2963-afb72ff0fd07e9b66f6fe951c466e017b8e32d71939a9ec4dd892bfe0ae2596f","source-abc229-g-problem-83a9221894dec91f4bf1f2918bfa0b9ca85696be322d5ff83af8e1dcb00a2708"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

Y の位置を昇順に A_i とすると、連続した Y を作る際にも Y 同士の順序は交換せず、採用する Y は A 上の連続区間としてよい。

B_i＝A_i−i とずらすと、隣接する目標位置の一マス差が消え、選んだ B_i を同じ整数へ動かす総距離が交換回数になる。

棄却する候補: 各交換をシミュレーションし、現在最も長くなりそうな Y の塊へ近い Y を一つずつ寄せる。

K が 10 の 12 乗まであり、局所的な交換選択だけでは最適な採用区間も保証できない。

採用する候補: 長さ m を二分探索し、B の各長さ m 区間を中央値へ揃える費用を累積和で計算して K 以下か判定する。

m 個を連続化できればそれ未満もでき、絶対値和は中央値で最小になるため各窓を定数個の区間和で評価できる。

目標の連続座標を直接最適化せず、Y の順位 i を位置から引くことで「全要素を一値へ揃える」中央値問題に正規化する。

Y の位置列を順位補正して単調列 B を作り、長さ m の各窓について中央値までの L1 距離を prefix sum で求める可否判定を答えの二分探索に使う。

## 典型の発動条件

### 連続配置の順位補正

発動条件: 順序を保った点を間隔 1 の連続位置へ移す最小総移動量を求めるとき。

i 番目の位置 A_i から i を引き、連続配置を同一点への移動へ変換する。

### 中央値による絶対値和最小化

発動条件: 複数の値を一つの共通値へ動かすコストが絶対差の総和であるとき。

各窓の中央要素を目標にし、左右の費用を累積和から求める。

### 長さの単調可否に対する答え二分探索

発動条件: 長さ m の対象を予算内で構成できれば、それより短い対象も構成できるとき。

各長さ m の窓を中央値へ揃える最小費用が K 以下か判定し、可能な最大 m を二分探索する。

## 問題固有の要素

Y の相対順序は隣接交換で入れ替える必要がなく、離れた Y を飛ばして採用するより間の Y を採用する方が移動費用を悪化させない。

別の問題へ持ち帰る視点: 一次元の順序保存移動では、最適な採用集合が元の順序上の連続区間になる交換論法を検討する。

## 正当性

目標の連続座標を直接最適化せず、Y の順位 i を位置から引くことで「全要素を一値へ揃える」中央値問題に正規化する。 m 個を連続化できればそれ未満もでき、絶対値和は中央値で最小になるため各窓を定数個の区間和で評価できる。

## 実装上の注意

- A_i と i の添字基準を統一すれば定数ずれは全 B に共通なので費用へ影響しないが、窓の中央添字は一貫させる。
- 位置差の総和と K は大きくなるため 64 bit 整数を使い、Y が一個もない場合も答え 0 を返す。

## 復習の核

- 点を間隔 1 で並べたいときは、目標位置列の傾き 1 を順位分だけ引いて水平化する。
- 最大個数を求める前に、固定個数の最小費用が連続窓と中央値で求まるかを切り分ける。

## 計算量と制約

### 時間

O(N+Y log Y)、N文字列長YはY文字数。各長さ判定はprefix中央値距離O(Y)。

### 空間

O(Y)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq |S| \leq 2 \times 10^5; Each character of S is Y or ..; 0 \leq K \leq 10^{12}; K is an integer.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc229/editorial/2963) — source-abc229-editorial-2963-afb72ff0fd07e9b66f6fe951c466e017b8e32d71939a9ec4dd892bfe0ae2596f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc229/tasks/abc229_g) — source-abc229-g-problem-83a9221894dec91f4bf1f2918bfa0b9ca85696be322d5ff83af8e1dcb00a2708
