---
title: "ABC380-G — Another Shuffle Window"
draft: true
authoringUnit: {"problemId":"abc380-g","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc380-g.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-two-pointers-window","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-fenwick-weighted-prefix","tag-modular-arithmetic","tag-two-pointers-window"],"sourceRevisionIds":["source-abc380-editorial-11363-4c1b5eae453dc1dc73be946b7f9f6930eb7c93d7946c683a7f72f73f4729004b","source-abc380-g-problem-d161fd53e7e2ba10c59a497885deec96fdfbdf13621549a1773a39415d2c3c72"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"窓内の任意の異なる二要素は shuffle 後の前後が半々なので、値に関係なく各 pair の期待寄与は1/2になる。 左端要素を除くとその要素が左側として作った「より小さい右要素」数を引き、右端要素追加では「より大きい既存要素」数を足す。 期待値の線形性で shuffle の分布を窓内 pair の1/2へ集約でき、全窓の転倒数を O(N log N) で走査できる。","sourceRevisionIds":["source-abc380-editorial-11363-4c1b5eae453dc1dc73be946b7f9f6930eb7c93d7946c683a7f72f73f4729004b","source-abc380-g-problem-d161fd53e7e2ba10c59a497885deec96fdfbdf13621549a1773a39415d2c3c72"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(3,1,2),K=2。","procedure":["元反転数2。窓12の転倒1を期待1/2へ、窓23の転倒0を期待1/2へ置換。","二窓の期待値は3/2,5/2。"],"executionTarget":null,"expectedResult":"全窓平均2。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-modular-arithmetic","unit-two-pointers-window","unit-weighted-prefix-fenwick"],"attainmentCondition":"窓外とのcross inversionも変わるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"窓は連続位置で外要素が全窓の片側にある。値multisetが同じなのでcross inversion総数は不変。"},"answer":{"reasoningOrVerification":"窓は連続位置で外要素が全窓の片側にある。値multisetが同じなのでcross inversion総数は不変。","procedure":["具体例の各状態・寄与を再計算する。","窓は連続位置で外要素が全窓の片側にある。値multisetが同じなのでcross inversion総数は不変。"],"expectedResult":"窓は連続位置で外要素が全窓の片側にある。値multisetが同じなのでcross inversion総数は不変。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

長さ K の窓を shuffle して変わるのは窓内二要素の相対順だけで、窓外との転倒関係は位置ブロックが保たれる。一様 permutation の窓内期待転倒数は K(K-1)/4 である。

採用する候補: 元全体の転倒数から各窓の元転倒数を引き、K(K-1)/4 を足す。窓転倒数は Fenwick tree で削除・追加寄与を更新する。

期待値の線形性で shuffle の分布を窓内 pair の1/2へ集約でき、全窓の転倒数を O(N log N) で走査できる。

棄却する候補: 各窓について K! 通りの並べ替えを列挙し、転倒数を平均する。

K は2×10^5まであり permutation 列挙は不可能で、窓ごとの O(K log K) 再計算も O(NK) になる。

窓内の任意の異なる二要素は shuffle 後の前後が半々なので、値に関係なく各 pair の期待寄与は1/2になる。

左端要素を除くとその要素が左側として作った「より小さい右要素」数を引き、右端要素追加では「より大きい既存要素」数を足す。

Fenwick tree で元 permutation の全転倒数と最初の窓の転倒数を求める。窓を一つずつずらして削除・追加の順位数を反映し、各窓の期待値を足して窓数で割る。

## 典型の発動条件

### 期待値の線形性による pair 分解

発動条件: random shuffle 後の転倒数など pair 指示変数の和を扱うとき。

各窓内 pair の確率1/2を独立性なしで加算する。

### sliding window inversion

発動条件: 固定長窓の転倒数を全位置で求めたいとき。

Fenwick tree で出入り要素の転倒寄与だけを更新する。

## 問題固有の要素

shuffle が窓外との相対位置を変えないことをブロック X,Y,Z で分離すると、差分は窓内だけになる。

別の問題へ持ち帰る視点: 期待転倒数は各 pair の確率だけでよく、pair 間の依存を考えなくてよい。

## 正当性

窓内の任意の異なる二要素は shuffle 後の前後が半々なので、値に関係なく各 pair の期待寄与は1/2になる。 左端要素を除くとその要素が左側として作った「より小さい右要素」数を引き、右端要素追加では「より大きい既存要素」数を足す。 期待値の線形性で shuffle の分布を窓内 pair の1/2へ集約でき、全窓の転倒数を O(N log N) で走査できる。

## 実装上の注意

- K(K-1)/4 は法上で inv2 を使い、全窓平均でも窓数の逆元を掛ける。削除・追加時の strict 比較方向を揃える。

## 復習の核

- 窓内・窓外の六種類の pair を分類し、どの関係だけが random 化されるかを先に確認する。

## 計算量と制約

### 時間

O(N log N)、全転倒数とK窓の追加削除BIT。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le K \le N \le 2 \times 10^5; P is a permutation of (1,2,\dots,N).

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(3,1,2),K=2。

1. 元反転数2。窓12の転倒1を期待1/2へ、窓23の転倒0を期待1/2へ置換。
2. 二窓の期待値は3/2,5/2。

期待される結果: 全窓平均2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

窓外とのcross inversionも変わるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

窓は連続位置で外要素が全窓の片側にある。値multisetが同じなのでcross inversion総数は不変。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc380/editorial/11363) — source-abc380-editorial-11363-4c1b5eae453dc1dc73be946b7f9f6930eb7c93d7946c683a7f72f73f4729004b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc380/tasks/abc380_g) — source-abc380-g-problem-d161fd53e7e2ba10c59a497885deec96fdfbdf13621549a1773a39415d2c3c72
