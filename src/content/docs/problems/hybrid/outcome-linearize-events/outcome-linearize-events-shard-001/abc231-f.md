---
title: "ABC231-F — Jealous Two"
draft: true
authoringUnit: {"problemId":"abc231-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc231-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-weighted-prefix-fenwick"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-coordinate-compression","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc231-editorial-3059-2800894ed0012eda3c59d85ce01046fba8bf0c21479cd2c0c4e8eb9298de0bc3","source-abc231-f-problem-37c3e1fabb258af6c0177d00752d792cedf5ab67a0ea32e2697bfe540ba9a2d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A が同値の点では B の大きい順に置くことで条件を満たす向きが処理済み側に現れるが、完全に同じ点の複数個はまとめて双方向を数える必要がある。 一方の不等式をソート順へ吸収し、他方を一次元の動的な範囲和へ落とせる。","sourceRevisionIds":["source-abc231-editorial-3059-2800894ed0012eda3c59d85ce01046fba8bf0c21479cd2c0c4e8eb9298de0bc3","source-abc231-f-problem-37c3e1fabb258af6c0177d00752d792cedf5ab67a0ea32e2697bfe540ba9a2d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-events"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"二点(A,B)=(1,2),(1,2)。","procedure":["全四つの順序付きindex pairがAの≤とBの≥を満たす。","同一座標groupは両方向と自己pairを含める。"],"executionTarget":null,"expectedResult":"答え4。","verificationStatus":"not_applicable","learningUnitIds":["unit-event-sweep"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-events"],"prerequisiteIds":["unit-coordinate-compression","unit-weighted-prefix-fenwick"],"attainmentCondition":"同じ座標を一つだけに圧縮してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"頻度2を保つ必要がある。座標同値のm点の内部寄与はm²。"},"answer":{"reasoningOrVerification":"頻度2を保つ必要がある。座標同値のm点の内部寄与はm²。","procedure":["具体例の各状態・寄与を再計算する。","頻度2を保つ必要がある。座標同値のm点の内部寄与はm²。"],"expectedResult":"頻度2を保つ必要がある。座標同値のm点の内部寄与はm²。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

高橋への品 i、青木への品 j で喧嘩しない条件は A_i≥A_j かつ B_i≤B_j であり、二次元の半順序を満たす順序付き点対の個数になる。

点を A 昇順、同じ A では B 降順に処理すると、現在点 i より前には A_j≤A_i の候補が揃い、残りは B_j≥B_i の個数問合せになる。

棄却する候補: 全ての順序付き組 (i,j) について二つの不等式を直接確認する。

候補が N の二乗個あり、20 万点では全組を走査できない。

採用する候補: A で sweep し、座標圧縮した B の頻度を Fenwick tree または segment tree に蓄積して suffix 個数を問い合わせる。

一方の不等式をソート順へ吸収し、他方を一次元の動的な範囲和へ落とせる。

A が同値の点では B の大きい順に置くことで条件を満たす向きが処理済み側に現れるが、完全に同じ点の複数個はまとめて双方向を数える必要がある。

喧嘩しない条件を二次元 dominance counting として、A の昇順 sweep と圧縮 B 上の suffix 頻度和を組み合わせ、同一点群を一括処理する。

## 典型の発動条件

### 二次元半順序の sweep line

発動条件: 点対に x の一方向不等式と y の逆方向不等式が同時に課されるとき。

x をソート順で満たし、処理済み点の y 頻度から現在閾値以上の個数を取得する。

### 座標圧縮と Fenwick tree

発動条件: 座標値は大きいが、挿入と prefix・suffix 個数問合せだけを行うとき。

B の順位へ一点加算し、全挿入数から B_i 未満の prefix 和を引く。

## 問題固有の要素

同じ品を二人へ渡すことも許されるため i＝j を含み、同一座標が c 個ならその群内だけで c² 個の順序付き組が有効になる。

別の問題へ持ち帰る視点: dominance counting では、不等号が非厳密か、組が順序付きか、同一点と自己対を含むかをグループ単位で確認する。

## 正当性

A が同値の点では B の大きい順に置くことで条件を満たす向きが処理済み側に現れるが、完全に同じ点の複数個はまとめて双方向を数える必要がある。 一方の不等式をソート順へ吸収し、他方を一次元の動的な範囲和へ落とせる。

## 実装上の注意

- 完全に同じ (A,B) の点は群サイズを数え、群全体を木へ反映する時点と答えへの寄与を統一して欠落を防ぐ。
- 答えは最大 N² なので 64 bit 整数を使い、B≥B_i の等号を suffix 問合せへ含める。

## 復習の核

- 二変数の不等式対が出たら、一方をソートで自動的に満たし、残る一方をデータ構造の問合せにする。
- タイブレークは適当に決めず、同じ第一座標で有効な第二座標の向きが処理済み側へ来る順を選ぶ。

## 計算量と制約

### 時間

O(N log N)、A sortとB Fenwick。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq A_i \leq 10^9; 0 \leq B_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

二点(A,B)=(1,2),(1,2)。

1. 全四つの順序付きindex pairがAの≤とBの≥を満たす。
2. 同一座標groupは両方向と自己pairを含める。

期待される結果: 答え4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ座標を一つだけに圧縮してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

頻度2を保つ必要がある。座標同値のm点の内部寄与はm²。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/editorial/3059) — source-abc231-editorial-3059-2800894ed0012eda3c59d85ce01046fba8bf0c21479cd2c0c4e8eb9298de0bc3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc231/tasks/abc231_f) — source-abc231-f-problem-37c3e1fabb258af6c0177d00752d792cedf5ab67a0ea32e2697bfe540ba9a2d2
