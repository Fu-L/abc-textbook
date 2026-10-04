---
title: "ABC429-F — Shortest Path Query"
draft: true
authoringUnit: {"problemId":"abc429-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc429-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-semiring-matrix-exponentiation","unit-weighted-shortest-path"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-semiring-matrix-exponentiation","tag-shortest-path"],"sourceRevisionIds":["source-abc429-editorial-14274-e36534099806a283b2248f27f8ce44b278b6971a5ea492de86fba015f0759147","source-abc429-f-problem-1daa51f4404cecb7602f514823810f40e0027d401966fcea1a1fdb1d37da475d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"左へ戻る移動を除けることは、三行という制約から示す。最短路を単純な経路として選び、その最初の左移動が列cからc−1へのものだとする。それまでの列移動は右向きなので、列cへ入った行をa、左へ出る行をr、その後初めて列cへ戻る行をbとする。終点の列が右端なので必ず戻る。\n\na,bが列cの同じ通路連結成分にあれば、列c内の上下移動だけで両者を結べる。元の往復は上下移動が最低|a−b|回、左右移動が最低2回なので、置き換えると短くなり矛盾する。異なる成分なら、三行では中央が壁で上下がそれぞれ単独の通路という場合しかない。このときa側の成分は一マスなのでr=aである。最初の左移動は入ってきた列c−1の行aへ戻り、同じマスを再訪して単純性に反する。よって左移動のない最短路が存在する。\n\n左戻りのない経路は各列で上下に動いた後、同じ行で次列へ進む。T_jはその列の全移動の最小費用を表し、min-plus積は全中間行を最小化するので、全列積がこの経路族の最短距離を与える。最短路をこの族へ限定できることは上の証明から保証される。横移動N−1を加えれば元の最短距離になる。積は結合的なのでセグメント木の合成も正しい。","sourceRevisionIds":["source-abc429-editorial-14274-e36534099806a283b2248f27f8ce44b278b6971a5ea492de86fba015f0759147","source-abc429-f-problem-1daa51f4404cecb7602f514823810f40e0027d401966fcea1a1fdb1d37da475d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

先に読む単元:

- [半環行列・min-plus/max-min遷移](src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md) — 線形遷移・行列累乗で得た考え方と実装を再利用し、半環行列・min-plus/max-min遷移の発動条件・正当化・境界を重複なく学ぶ。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

最短路上の左戻りを除ければ、各列の上下移動を3×3 min-plus行列へ圧縮できる。難所は列数ではなく左戻りを除ける根拠であり、三行では縦の通路成分の形が限られるため場合分けで示せる。

列jの行aから行bへ縦に動く費用を `T_j[b][a]` とする。両端を含む行min(a,b)..max(a,b)が全て通路なら `|a−b|`、途中に壁があればINF。a=bでも壁ならINFであり、壁の対角成分を0にしない。

列vectorへ作用させると、次の行bの値は `min_a(T_j[b][a]+d[a])` になる。初期vector `(0,INF,INF)` に `T_N…T_1` を作用させ、その第3成分に横移動の `N−1` を足す。第3成分がINFなら−1。各列の横移動は全経路で共通なので、行列には縦移動だけを載せられる。

列順の合成をセグメント木に置けば、一マスの反転はその列の葉だけを作り直す更新になる。左区間の行列L、右区間の行列Rは `R⊗L` の順で結合し、根の積から毎回答える。

## 典型の発動条件

### min-plus 行列

発動条件: 少数状態の最短距離 DP の遷移を合成したいとき。

三行間の遷移コストを行列にし、加算を経路連結、min を中間状態選択として積を定義する。

### モノイドセグメント木

発動条件: 一点更新があり、列順に並ぶ結合的な写像の全体合成を繰り返し求めるとき。

葉へ列写像、内部節点へ左写像の後に右写像を置いた合成を保存する。

## 問題固有の要素

三行では、列内の通路が分断されると両端の成分が単独マスになる。この性質が左戻りを除く証明を支える。

別の問題へ持ち帰る視点: 列の小行列へ圧縮する前に、戻りを含む経路を除ける根拠を示す。行数が定数という条件だけで、この三状態遷移が成立するわけではない。

## 正当性

左へ戻る移動を除けることは、三行という制約から示す。最短路を単純な経路として選び、その最初の左移動が列cからc−1へのものだとする。それまでの列移動は右向きなので、列cへ入った行をa、左へ出る行をr、その後初めて列cへ戻る行をbとする。終点の列が右端なので必ず戻る。

a,bが列cの同じ通路連結成分にあれば、列c内の上下移動だけで両者を結べる。元の往復は上下移動が最低|a−b|回、左右移動が最低2回なので、置き換えると短くなり矛盾する。異なる成分なら、三行では中央が壁で上下がそれぞれ単独の通路という場合しかない。このときa側の成分は一マスなのでr=aである。最初の左移動は入ってきた列c−1の行aへ戻り、同じマスを再訪して単純性に反する。よって左移動のない最短路が存在する。

左戻りのない経路は各列で上下に動いた後、同じ行で次列へ進む。T_jはその列の全移動の最小費用を表し、min-plus積は全中間行を最小化するので、全列積がこの経路族の最短距離を与える。最短路をこの族へ限定できることは上の証明から保証される。横移動N−1を加えれば元の最短距離になる。積は結合的なのでセグメント木の合成も正しい。

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
