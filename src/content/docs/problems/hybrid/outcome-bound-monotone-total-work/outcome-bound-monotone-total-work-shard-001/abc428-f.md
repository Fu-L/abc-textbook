---
title: "ABC428-F — Pyramid Alignment"
draft: true
authoringUnit: {"problemId":"abc428-f","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc428-f.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-interval-partition"],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress","tag-endpoint-run-partition"],"sourceRevisionIds":["source-abc428-editorial-14251-082c02c8b9e966ba57d73b732f79daf94bc5104df159a8dbbbb9e5983d13b906","source-abc428-f-problem-4f19f9612d7f02e7fbc4bb6cd7c6e7b3a8e08c66c01328bb80a49359e57d3edb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"操作対象の境界区間 i_q の現在端点だけ分かれば、新しい [1,i_q] または対応する端側の整列ブロックを一つ作れる。途中の既存ブロックは丸ごと上書きされる。 包含関係により座標 x+1/2 を含むかは区間番号について false から true へ一度だけ変わる。 各クエリでブロックを一つ追加し、削除されたブロックは戻らないので更新全体が O(Q) に償却される。","sourceRevisionIds":["source-abc428-editorial-14251-082c02c8b9e966ba57d73b732f79daf94bc5104df159a8dbbbb9e5983d13b906","source-abc428-f-problem-4f19f9612d7f02e7fbc4bb6cd7c6e7b3a8e08c66c01328bb80a49359e57d3edb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各区間は番号が増えるほど前の区間を包含する。左寄せ・右寄せ操作後も、連続した番号帯では同じ左端または右端を共有するため、個々の座標を更新する必要はない。

採用する候補: 番号の連続範囲を (l,r,左/右揃え,x) のブロック列で持ち、端からの整列操作で覆われるブロックをまとめて削除・分割する。

各クエリでブロックを一つ追加し、削除されたブロックは戻らないので更新全体が O(Q) に償却される。

棄却する候補: N 本すべての区間端点を整列操作のたびに更新する。

一回の操作が Θ(N) になり、Q 回で時間制限を超える。

操作対象の境界区間 i_q の現在端点だけ分かれば、新しい [1,i_q] または対応する端側の整列ブロックを一つ作れる。途中の既存ブロックは丸ごと上書きされる。

包含関係により座標 x+1/2 を含むかは区間番号について false から true へ一度だけ変わる。

deque/list に整列ブロックを順に保持する。左または右の整列クエリでは対象端から i_q を含むブロックまで除去し、必要なら残部を切り、新しい整列ブロックを追加する。点を含む区間数の質問はブロック終端を二分探索し、該当ブロック内でも端点式から境界番号を求める。

## 典型の発動条件

### ランレングス状の区間管理

発動条件: 連続添字範囲が同じ規則・同じ端点を共有し、更新が端から範囲を上書きするとき。

同一整列状態を一ブロックに圧縮し、クエリを split・pop・push で表す。

### ポテンシャル法による償却

発動条件: 一操作で多数要素を削除し得るが、各操作が追加する要素数は定数のとき。

ブロック数をポテンシャルと見て、全 pop 回数を全 push 回数で抑える。

### 包含列上の二分探索

発動条件: 対象を含むかという述語が添字順に単調なとき。

点 x+1/2 を初めて含む区間番号 k+1 を探し、N-k を答える。

## 問題固有の要素

更新対象を値の配列ではなく、同じ幾何制約を共有する最大連続範囲として持つと一括上書きが安くなる。

別の問題へ持ち帰る視点: 大量 pop を伴う端更新は、ブロックの生成回数が少なければ償却定数時間になる。

## 正当性

操作対象の境界区間 i_q の現在端点だけ分かれば、新しい [1,i_q] または対応する端側の整列ブロックを一つ作れる。途中の既存ブロックは丸ごと上書きされる。 包含関係により座標 x+1/2 を含むかは区間番号について false から true へ一度だけ変わる。 各クエリでブロックを一つ追加し、削除されたブロックは戻らないので更新全体が O(Q) に償却される。

## 実装上の注意

- 右端共有ブロックの左端は x-W_i、左端共有ブロックの右端は x+W_i で復元する。半整数判定は 2 倍した整数で比較すると安全である。

## 復習の核

- ブロックを途中で切る場合の l,r と、左右どちらの端から pop するかを操作定義に合わせて確認する。

## 計算量と制約

### 時間

全Q更新のblock処理は償却O(Q log Q)、照会は二段二分探索O(log Q+log N)。

### 空間

O(Q)、整列block数。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq W_i \leq 10^9 (1 \leq i \leq N); W_1 < W_2 < \dots < W_N; For v given in queries of types 1 and 2, 1 \leq v \leq N.; For x given in queries of type 3, 0 \leq x \leq 10^9.; At least one query of type 3 is given.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/editorial/14251) — source-abc428-editorial-14251-082c02c8b9e966ba57d73b732f79daf94bc5104df159a8dbbbb9e5983d13b906
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/tasks/abc428_f) — source-abc428-f-problem-4f19f9612d7f02e7fbc4bb6cd7c6e7b3a8e08c66c01328bb80a49359e57d3edb
