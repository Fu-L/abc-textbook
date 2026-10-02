---
title: "ABC223-H — Xor Query"
draft: true
authoringUnit: {"problemId":"abc223-h","docPath":"src/content/docs/problems/mathematics/outcome-maintain-xor-linear-basis/outcome-maintain-xor-linear-basis-shard-001/abc223-h.md","learningOutcomeIds":["outcome-maintain-xor-linear-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-xor-linear-basis","tag-event-sweep"],"sourceRevisionIds":["source-abc223-editorial-2784-5514fdbcce2c4b2a9d2f9c24e0f8d8e15f239d9ff2f9d3caad45c97eff24f190","source-abc223-h-problem-49bdf1820ba1be91722759d396d83747e61e76f7fc1c2bf12dec85e6a8be7c0e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同pivotでは新しい添字を優先し交換すると、任意の左端Lに対して添字L以上の基底行がA_L..A_Rのspanを生成する不変条件を保てる。Xをその行だけで消去して0になることと区間内要素の線形結合で表せることは同値。R順の処理で必要なprefixだけを基底へ入れる。","sourceRevisionIds":["source-abc223-editorial-2784-5514fdbcce2c4b2a9d2f9c24e0f8d8e15f239d9ff2f9d3caad45c97eff24f190","source-abc223-h-problem-49bdf1820ba1be91722759d396d83747e61e76f7fc1c2bf12dec85e6a8be7c0e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

- 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

部分列の要素を選んだXORは、各数の二進表現を F_2 上の60次元ベクトルと見たときの線形結合である。したがって各問い合わせは区間ベクトルが X を生成するかという所属判定になる。

採用する候補: 右端を左から伸ばしながら、各pivotにできるだけ新しい添字を残すXOR線形基底を管理し、Rごとの問い合わせをその基底で判定する。

基底の次元は高々60であり、各基底ベクトルに区間左端の可否を判定する添字情報を持たせれば、N,Qの大きさに依らず一問を60bitで処理できる。

棄却する候補: 各問い合わせの A_L,…,A_R から掃き出し法をやり直して X の所属を判定する。

区間長に比例して基底を作り直すため、最大2×10^5問では同じ要素を繰り返し掃き出して間に合わない。

右端 r のprefixから、各suffixのspanが変化する添字だけを残すと、その集合は全prefixのspanの基底であり、添字が l 以上のものだけで span(A_l,…,A_r) を生成できる。

新しいベクトルを挿入するとき同じpivotの古いベクトルより新しい添字を優先して交換すると、各pivotの表現可能範囲を最も右へ保てる。

問い合わせをRでまとめ、A_Rを添字付き線形基底へ挿入する。Xを高bitから、添字がL以上のpivotだけで消去し、0まで落とせればYesとする。

## 典型の発動条件

### F_2 上のXOR線形基底

発動条件: 部分集合XORの実現可能性を問われ、値のbit幅が小さく固定されているとき。

数をベクトルとしてpivotごとに掃き出し、目標ベクトルが生成部分空間に属するかを判定する。

### 右端オフライン走査と添字付き基底

発動条件: 区間問い合わせを右端までのprefixデータへ追加でき、左端制約を要素の時刻で判定できるとき。

基底ベクトルへ有効な最新添字を付け、Rを固定したまま異なるLのsuffix spanを一つの基底から取り出す。

## 問題固有の要素

区間ごとの基底を保存する代わりに、同じpivotでは新しい添字を勝たせると、一つのprefix基底が全ての左端に答えられる。

別の問題へ持ち帰る視点: 可逆な要約構造で区間を扱うとき、要約要素に『どこから有効か』という時刻を持たせてprefixをsuffix判定へ転用する。

## 正当性

同pivotでは新しい添字を優先し交換すると、任意の左端Lに対して添字L以上の基底行がA_L..A_Rのspanを生成する不変条件を保てる。Xをその行だけで消去して0になることと区間内要素の線形結合で表せることは同値。R順の処理で必要なprefixだけを基底へ入れる。

## 実装上の注意

- 基底挿入時はベクトルと添字を必ず同時にswapし、60bit全てを符号なし整数で高位から処理する。X_i>0 なので空集合だけで作る0の扱いは答えに影響しない。

## 復習の核

- 区間XORの『選び方』を追わず、まず生成部分空間への所属へ言い換え、左端を基底の有効時刻として持たせる。

## 計算量と制約

### 時間

O((N+Q)B)、B=60。

### 空間

O(Q+B)、入力保持込みO(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 4 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq A_i \lt 2^{60}; 1 \leq L_i \leq R_i \leq N; 1 \leq X_i \lt 2^{60}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/editorial/2784) — source-abc223-editorial-2784-5514fdbcce2c4b2a9d2f9c24e0f8d8e15f239d9ff2f9d3caad45c97eff24f190
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/tasks/abc223_h) — source-abc223-h-problem-49bdf1820ba1be91722759d396d83747e61e76f7fc1c2bf12dec85e6a8be7c0e
