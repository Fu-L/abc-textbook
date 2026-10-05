---
title: "ABC216-E — Amusement Park"
draft: true
authoringUnit: {"problemId":"abc216-e","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc216-e.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-integer-boundary-blocks","unit-monotone-search"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-integer-boundary-blocks","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc216-e-problem-c2a9f442c019499487e7d2a54ccff8f94df6d66cc82f716a4dc4e26a80874812","source-abc216-editorial-2469-f775cb9327920f22d1752df9ead3b71e28fa49edbfb5a3eda2128bd156f79edd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各施設の利益は A_i,A_i−1,…,1 という非増加列である。各時点の最大利益を取る貪欲では、その項を取る前に必要な同じ施設の項は全てそれ以上なので、全列を合わせた上位K項を選べる。境界mを固定するとm超の項は全て採用され、mの項を残数だけ採用する。m超の個数はmに対して単調であり、各列の和は等差数列の公式で求まる。正の項を取り尽くした後は0だけなので、余った操作は答えを変えない。","sourceRevisionIds":["source-abc216-e-problem-c2a9f442c019499487e7d2a54ccff8f94df6d66cc82f716a4dc4e26a80874812","source-abc216-editorial-2469-f775cb9327920f22d1752df9ead3b71e28fa49edbfb5a3eda2128bd156f79edd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md) — floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

## 考察

アトラクション i から得る幸福度は乗るたび A_i,A_i−1,… と一ずつ減り、0 未満にはならない。

乗る順序は将来の候補値を変えないため、全アトラクションが持つ減少列を合わせた中から大きい値を K 個選ぶ問題とみなせる。

棄却する候補: 現在の幸福度が最大のアトラクションを優先度付きキューから一回ずつ選び、K 回更新する。

一回の更新は軽くても K が 20 億まであり、乗車回数に比例する反復はできない。

採用する候補: 選ばれる幸福度の境界値 m を二分探索し、m より大きい項を等差数列の和で一括取得して残りを m で埋める。

値が閾値以上の項数は閾値に対して単調で、各減少列の個数と総和を式でまとめられる。

貪欲に一回ずつ最大値を取る結果には共通の境界値があり、境界より上は全て選び、境界値だけ必要個数を選ぶ。

一つの A_i について m より大きい幸福度は A_i から m＋1 までの連続整数なので、個数と和を等差数列で計算できる。

減少する限界利益列の上位 K 項選択を、値域上の順位閾値探索へ変換し、各列の閾値超過部分を算術級数としてまとめて加算する。

## 典型の発動条件

### 上位 K 項の閾値探索

発動条件: 複数の単調列から大きい要素を多数選ぶが、選択回数そのものが非常に大きいとき。

値 m 以上の要素数を数えて K 番目の値を求め、m より大きい全要素と m の一部を選ぶ。

### 等差数列の一括加算

発動条件: 連続整数の区間を一項ずつ処理せず、その個数と総和だけが必要なとき。

各 A_i から閾値直上までの幸福度を、初項・末項・項数からまとめて足す。

## 問題固有の要素

各乗車の限界幸福度は他のアトラクションの乗車履歴に依存しないため、時系列の操作を多重集合の上位 K 選択へ交換できる。

別の問題へ持ち帰る視点: 反復操作の利得が対象ごとの選択回数だけで決まるなら、操作順ではなく各対象が生成する限界利益列を見る。

## 正当性

各施設の利益は A_i,A_i−1,…,1 という非増加列である。各時点の最大利益を取る貪欲では、その項を取る前に必要な同じ施設の項は全てそれ以上なので、全列を合わせた上位K項を選べる。境界mを固定するとm超の項は全て採用され、mの項を残数だけ採用する。m超の個数はmに対して単調であり、各列の和は等差数列の公式で求まる。正の項を取り尽くした後は0だけなので、余った操作は答えを変えない。

## 実装上の注意

- 境界 m に対して先に m より大きい項数を数え、K までの残りだけを値 m として加えることで等号の重複を避ける。
- 項数・積・総幸福度は 64 bit 整数で扱い、正の幸福度が K 個未満なら残りの 0 は答えを増やさない。

## 復習の核

- 優先度付きキューの一回ずつの貪欲が明らかでも K が巨大なら、その最終状態にある共通の値境界を探す。
- 閾値の等号側を全て取ると K を超えるため、「超える項」と「等しい項」を分けて数える。

## 計算量と制約

### 時間

A=max A_i として O(N log(A+1))。一つの閾値の判定と和の計算は O(N)、回数Kには比例しない。

### 空間

入力列を保持して O(N)、閾値と集計値の追加領域は O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq K \leq 2 \times 10^9; 1 \leq A_i \leq 2 \times 10^9; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/tasks/abc216_e) — source-abc216-e-problem-c2a9f442c019499487e7d2a54ccff8f94df6d66cc82f716a4dc4e26a80874812
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc216/editorial/2469) — source-abc216-editorial-2469-f775cb9327920f22d1752df9ead3b71e28fa49edbfb5a3eda2128bd156f79edd
