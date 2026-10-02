---
title: "ABC429-F — Shortest Path Query"
draft: true
authoringUnit: {"problemId":"abc429-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc429-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-semiring-matrix-exponentiation","unit-weighted-shortest-path"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-semiring-matrix-exponentiation","tag-shortest-path"],"sourceRevisionIds":["source-abc429-editorial-14274-e36534099806a283b2248f27f8ce44b278b6971a5ea492de86fba015f0759147","source-abc429-f-problem-1daa51f4404cecb7602f514823810f40e0027d401966fcea1a1fdb1d37da475d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"列内では上下移動を何回か行ってから右へ進むだけなので、入力三距離から出力三距離への最短コストは固定サイズの min-plus 行列で表せる。 写像 f,g の合成 h(x)=g(f(x)) は結合的で、区間を左右に分けても全体作用が変わらない。 写像合成は結合的で、一点更新後の全列合成を O(log N) で再計算できる。","sourceRevisionIds":["source-abc429-editorial-14274-e36534099806a283b2248f27f8ce44b278b6971a5ea492de86fba015f0759147","source-abc429-f-problem-1daa51f4404cecb7602f514823810f40e0027d401966fcea1a1fdb1d37da475d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [半環行列・min-plus/max-min遷移](src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

3×N グリッドの左上から右下への最短路には列を左へ戻る移動を含まない最短路が存在する。すると列 j までの三行の距離ベクトルは、直前列のベクトルと列 j の通行可否だけで決まる。

採用する候補: 各列を三成分の距離ベクトルに作用する min-plus 写像として表し、写像の合成をセグメント木に載せる。

写像合成は結合的で、一点更新後の全列合成を O(log N) で再計算できる。

棄却する候補: 各マス更新のたびにグリッド全体で BFS をやり直す。

一質問 O(N) 以上となり、Q 回に対して遅い。

列内では上下移動を何回か行ってから右へ進むだけなので、入力三距離から出力三距離への最短コストは固定サイズの min-plus 行列で表せる。

写像 f,g の合成 h(x)=g(f(x)) は結合的で、区間を左右に分けても全体作用が変わらない。

各列の障害配置から、前列各行から当列各行へ左戻りなしで移る 3×3 の min-plus 遷移行列を作る。セグメント木の積を min-plus 行列積で定義し、更新列の行列を差し替える。初期ベクトルへ全体積を作用させた第3成分を答える。

## 典型の発動条件

### min-plus 行列

発動条件: 少数状態の最短距離 DP の遷移を合成したいとき。

三行間の遷移コストを行列にし、加算を経路連結、min を中間状態選択として積を定義する。

### モノイドセグメント木

発動条件: 一点更新があり、列順に並ぶ結合的な写像の全体合成を繰り返し求めるとき。

葉へ列写像、内部節点へ左写像の後に右写像を置いた合成を保存する。

## 問題固有の要素

幅が定数の動的グリッド最短路は、各列を境界距離ベクトル間の小さな写像として要約できる。

別の問題へ持ち帰る視点: DP 遷移が結合可能なら、列更新は遷移モノイドの一点更新へ置き換えられる。

## 正当性

列内では上下移動を何回か行ってから右へ進むだけなので、入力三距離から出力三距離への最短コストは固定サイズの min-plus 行列で表せる。 写像 f,g の合成 h(x)=g(f(x)) は結合的で、区間を左右に分けても全体作用が変わらない。 写像合成は結合的で、一点更新後の全列合成を O(log N) で再計算できる。

## 実装上の注意

- 行列積の左右順序を列順と合わせ、通行不能遷移は十分大きい INF にする。始点・終点が塞がる場合と第1列の初期化を確認する。

## 復習の核

- 左戻り不要の根拠、列行列が列内の全上下経路を含むこと、セグメント木の積順序を確認する。

## 計算量と制約

### 時間

O(N+Q log N)、3×3 min-plus合成はO(1)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le 2\times 10^5; S_{i,j} is # or ..; S_{1,1}=S_{3,N}= .; 1\le Q\le 2\times 10^5; 1\le r\le 3; 1\le c\le N; (r,c) \neq (1,1),(3,N); N,Q,r,c are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc429/editorial/14274) — source-abc429-editorial-14274-e36534099806a283b2248f27f8ce44b278b6971a5ea492de86fba015f0759147
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc429/tasks/abc429_f) — source-abc429-f-problem-1daa51f4404cecb7602f514823810f40e0027d401966fcea1a1fdb1d37da475d
