---
title: "ABC452-F — Interval Inversion Count"
draft: true
authoringUnit: {"problemId":"abc452-f","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc452-f.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc452-editorial-18361-b74defbf0da84a0af6f2a8fcd61a1f4813ab245fd05100c3103230b9b02fd73d","source-abc452-f-problem-b3e7961b57ecef64f4ec4e9ec53f0c184762e97b65cf47981f8eef33f212f22a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"window 右へ x を追加する寄与は既存要素のうち x より大きい個数である。 左端 x を削除すると、x を左要素とする転倒、すなわち残りで x より小さい個数だけ転倒数が減る。 各左端の最大右端は単調に進み、右追加では既存の自分より大きい数、左削除では自分より小さい数だけ転倒数が増減するので対数時間で維持できる。","sourceRevisionIds":["source-abc452-editorial-18361-b74defbf0da84a0af6f2a8fcd61a1f4813ab245fd05100c3103230b9b02fd73d","source-abc452-f-problem-b3e7961b57ecef64f4ec4e9ec53f0c184762e97b65cf47981f8eef33f212f22a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

先に読む単元:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

転倒数が k 以下という区間性質は、左右端を削ると転倒数が増えないため包含に対して単調である。ちょうど k 個は f(k)-f(k-1) で求められる。

採用する候補: f(K)=転倒数≤Kの区間数を二ポインタで求め、window の追加・削除時の転倒寄与を Fenwick tree の値頻度から更新する。

棄却する候補: 全区間について転倒数を merge sort または BIT で一から計算する。

区間数が Θ(N^2) で、各回を高速化しても制約に収まらない。

solve(K) で空 window、inv=0 から R を可能な限り伸ばし、各 L に対して R-L 個を加える。Fenwick frequency で追加寄与と削除寄与を計算する。K<0なら0とし solve(k)-solve(k-1) を返す。

## 典型の発動条件

### 統計量付き尺取り法

発動条件: 区間統計が端点更新でき、閾値条件が区間包含に対して単調なとき。

最大 valid 右端と window 転倒数を同時に維持する。

### Fenwick tree による動的転倒数

発動条件: 順列 window の端へ要素を追加・削除するとき。

値域頻度の小さい側・大きい側の個数で寄与を更新する。

## 問題固有の要素

ちょうど値の区間数は、単調判定しやすい at most の累積分布を二回計算して差を取る。

別の問題へ持ち帰る視点: 転倒数のような pair 統計も、端点要素が作る新規 pair だけを順序統計で数えれば sliding window に載る。

## 正当性

window 右へ x を追加する寄与は既存要素のうち x より大きい個数である。 左端 x を削除すると、x を左要素とする転倒、すなわち残りで x より小さい個数だけ転倒数が減る。 各左端の最大右端は単調に進み、右追加では既存の自分より大きい数、左削除では自分より小さい数だけ転倒数が増減するので対数時間で維持できる。

## 実装上の注意

- 右追加と左削除で strict <,> の向きが異なる。R を半開端として区間数を数え、k=0時の solve(-1) を0にする。

## 復習の核

- window [L,R) へ右を足す場合と左を消す場合の転倒 pair を図示し、f(k)-f(k-1) の重複なし対応を確認する。

## 計算量と制約

### 時間

O(N log N)、at-most kとk−1を二度実行。

### 空間

O(N)、圧縮頻度BIT。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le5\times10 ^ 5; 0\le K\le\dfrac{N(N-1)}2; 1\le P _ i\le N\ (1\le i\le N); P _ i\ne P _ j\ (1\le i\lt j\le N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/editorial/18361) — source-abc452-editorial-18361-b74defbf0da84a0af6f2a8fcd61a1f4813ab245fd05100c3103230b9b02fd73d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/tasks/abc452_f) — source-abc452-f-problem-b3e7961b57ecef64f4ec4e9ec53f0c184762e97b65cf47981f8eef33f212f22a
