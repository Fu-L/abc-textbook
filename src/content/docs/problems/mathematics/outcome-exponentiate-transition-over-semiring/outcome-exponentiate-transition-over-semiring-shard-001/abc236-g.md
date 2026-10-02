---
title: "ABC236-G — Good Vertices"
draft: true
authoringUnit: {"problemId":"abc236-g","docPath":"src/content/docs/problems/mathematics/outcome-exponentiate-transition-over-semiring/outcome-exponentiate-transition-over-semiring-shard-001/abc236-g.md","learningOutcomeIds":["outcome-exponentiate-transition-over-semiring"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-recurrence"],"excludedTopics":["半環行列・min-plus/max-min遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-semiring-matrix-exponentiation"],"sourceRevisionIds":["source-abc236-editorial-3286-eb641db2ebe6102a3decfe3203d9f04dcb8427feefdb35660b1fe094417c333d","source-abc236-g-problem-f1eea62ce5aa1264a1a77a48af5df332be33d5dc6fc17e07d56e10c53c66baed"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長さLのwalkが存在する最早時刻は使用辺時刻の最大値を最小化したもの。前後のwalkを連結すると最大値はmax、選択肢の比較はminなので半環積が正確に長さを合成する。結合則により二分累乗の隣接行列L乗がちょうどL辺の全walkを表す。対角0の単位行列は長さ0だけを表す。","sourceRevisionIds":["source-abc236-editorial-3286-eb641db2ebe6102a3decfe3203d9f04dcb8427feefdb35660b1fe094417c333d","source-abc236-g-problem-f1eea62ce5aa1264a1a77a48af5df332be33d5dc6fc17e07d56e10c53c66baed"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [半環行列・min-plus/max-min遷移](src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md)

- 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

対象外:

- 半環行列・min-plus/max-min遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

辺の追加時刻をその辺の重みとすると、時刻 t までにちょうど L 辺で到達可能とは、使用辺の最大重みが t 以下の L-step walk があることと同値である。

求める最早時刻は、頂点 1 から各頂点へのちょうど L 辺 walk が持つ最大辺重みの最小値という bottleneck DP になる。

棄却する候補: 移動回数 i＝1 から L まで、各辺で bottleneck DP を一段ずつ更新する。

L が 10 億まであり、移動回数に比例する反復はできない。

採用する候補: 辺時刻行列を、加法を min、乗法を max とする半環上で累乗し、長さ L の walk の最小 bottleneck を一括計算する。

二つの walk を連結すると最大辺重みは max、経路候補から最良を選ぶ演算は min で、行列積の結合則により二分累乗できる。

(P⊗Q)_{ij}=min_k max(P_{ik},Q_{kj}) は、前半と後半の walk を中継点 k で連結したときの bottleneck 最小化そのものである。

時刻付き有向グラフの exact-length bottleneck path DP を (min,max) semiring の行列積へ写し、隣接行列の L 乗を繰り返し二乗法で初期ベクトルへ作用させる。

## 典型の発動条件

### 半環上の行列累乗

発動条件: 固定長 walk の DP 遷移が結合的な二演算で行列積と同じ形になり、長さが巨大なとき。

通常の和・積を min・max に置換し、二分累乗で L 回の遷移を合成する。

### bottleneck path

発動条件: 経路費用が辺重みの和でなく最大値で、候補経路間では最小を取りたいとき。

辺の追加時刻を重みとし、walk の最大辺時刻をその頂点が良くなる時刻として最小化する。

## 問題固有の要素

「ちょうど L 回」が重要で、短い到達を流用できないため、半環単位行列の対角 0 は累乗の初期化にだけ使い、元隣接行列へ勝手な待機辺を加えない。

別の問題へ持ち帰る視点: 行列累乗で walk を数えるときは、exact length と at most length を区別し、自己ループの有無を入力通りに保つ。

## 正当性

長さLのwalkが存在する最早時刻は使用辺時刻の最大値を最小化したもの。前後のwalkを連結すると最大値はmax、選択肢の比較はminなので半環積が正確に長さを合成する。結合則により二分累乗の隣接行列L乗がちょうどL辺の全walkを表す。対角0の単位行列は長さ0だけを表す。

## 実装上の注意

- 存在しない辺と到達不能を十分大きい INF、半環単位行列を対角 0・非対角 INF とする。
- 入力辺 (u_t,v_t) の行列値は t とし、最終値が INF の頂点だけ −1 を出力する。

## 復習の核

- DP の一段遷移に min と max が現れたら、通常の行列積の和・積を置換した半環として結合できるか確認する。
- 時間増加グラフでは、最早時刻を「経路中の最大追加時刻の最小値」へ変換すると静的な path 問題になる。

## 計算量と制約

### 時間

O(N³ log L)。min-max半環行列の繰り返し二乗。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 100; 1 \leq T \leq N^2; 1 \leq L \leq 10^9; 1 \leq u_t, v_t \leq N; i \neq j \Rightarrow (u_i, v_i) \neq (u_j, v_j); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/editorial/3286) — source-abc236-editorial-3286-eb641db2ebe6102a3decfe3203d9f04dcb8427feefdb35660b1fe094417c333d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/tasks/abc236_g) — source-abc236-g-problem-f1eea62ce5aa1264a1a77a48af5df332be33d5dc6fc17e07d56e10c53c66baed
